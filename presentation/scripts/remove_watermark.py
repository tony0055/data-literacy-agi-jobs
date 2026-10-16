"""Gemini 생성 이미지의 오른쪽 아래 반짝이(✦) 표시를 SAM 2.1 마스크 + 인페인팅으로 지운다.

1) 예상 위치(오른쪽·아래 끝에서 짧은 변의 15.6%) 주변 창의 밝기 top-hat에 별(astroid) 템플릿을 여러 크기로 맞춰 표시 위치·크기를 잡는다.
2) 중심 점(양성)·모서리 두 점(음성)과 꼭 맞는 상자를 SAM 2.1(hiera small)에 넣어 마스크를 얻는다.
   별 넓이 범위에 맞는 마스크가 없으면 템플릿 별 모양을 마스크로 쓰고 그 사실을 기록한다.
3) 마스크를 조금 넓혀 OpenCV Telea 인페인팅으로 채운 뒤, 마스크 영역만 원본에 합성한다.
4) 덱용으로 가로 1920px JPEG(품질 88)로 저장하고, 확인용 전후 비교 크롭을 남긴다.

생성 사실은 덱에 'AI 생성 이미지(Gemini)'로 표기한다. 이 스크립트는 화면 표시만 지우고 출처 고지는 지우지 않는다.

실행: <venv>/bin/python scripts/remove_watermark.py <ckpt> <raw_dir> <out_dir>
"""

import json
import sys
from pathlib import Path

import cv2
import numpy as np
import torch
from sam2.build_sam import build_sam2
from sam2.sam2_image_predictor import SAM2ImagePredictor


def star_template(size):
    # Gemini 표시는 네 꼭짓점이 오목하게 휜 별(astroid) 모양이다: |x|^(2/3) + |y|^(2/3) <= 1
    r = np.linspace(-1, 1, size)
    xx, yy = np.meshgrid(r, r)
    return ((np.abs(xx) ** (2 / 3) + np.abs(yy) ** (2 / 3)) <= 1).astype(np.float32)


def find_mark(img):
    h, w = img.shape[:2]
    # Gemini 표시는 오른쪽·아래 끝에서 짧은 변의 약 15.6%(1536px 기준 240px) 떨어진 자리에 붙는다(이 덱 6장에서 확인).
    # 그 예상 위치 주변 창에서만 찾는다.
    off = 0.156 * min(h, w)
    ex, ey = int(w - off), int(h - off)
    win = int(0.045 * min(h, w))  # 예상 위치에서 ±약 70px만 다듬는다
    x0, y0 = max(0, ex - win), max(0, ey - win)
    roi = cv2.cvtColor(img[y0:min(h, ey + win), x0:min(w, ex + win)], cv2.COLOR_RGB2GRAY)
    k = int(min(h, w) * 0.14) | 1  # 표시(짧은 변의 약 6%)보다 충분히 큰 커널
    tophat = cv2.morphologyEx(roi, cv2.MORPH_TOPHAT, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k))).astype(np.float32)
    # 별 모양 템플릿을 여러 크기로 맞춰 가장 잘 맞는 자리를 고른다
    best_score, mx, my, size = -1, 0, 0, 0
    for frac in (0.05, 0.0575, 0.0625, 0.07):
        s = int(min(h, w) * frac) | 1
        t = star_template(s) - 0.5
        res = cv2.matchTemplate(tophat, t, cv2.TM_CCOEFF_NORMED)
        _, sc, _, loc = cv2.minMaxLoc(res)
        if sc > best_score:
            best_score, mx, my, size = sc, loc[0] + s // 2, loc[1] + s // 2, s
    return (x0 + mx, y0 + my), size, float(best_score)


def main():
    ckpt, raw_dir, out_dir = map(Path, sys.argv[1:4])
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "check").mkdir(exist_ok=True)
    dev = "mps" if torch.backends.mps.is_available() else "cpu"
    model = build_sam2("configs/sam2.1/sam2.1_hiera_s.yaml", str(ckpt), device=dev)
    pred = SAM2ImagePredictor(model)
    log = []
    for p in sorted(raw_dir.glob("*.png")):
        img = cv2.cvtColor(cv2.imread(str(p), cv2.IMREAD_COLOR), cv2.COLOR_BGR2RGB)
        h, w = img.shape[:2]
        (cx, cy), size, match = find_mark(img)
        half = int(size * 0.55)
        box = np.array([cx - half, cy - half, cx + half, cy + half])
        pts = np.array([[cx, cy], [cx - half + 5, cy - half + 5], [cx + half - 5, cy + half - 5]])
        with torch.inference_mode():
            pred.set_image(img)
            masks, scores, _ = pred.predict(point_coords=pts, point_labels=np.array([1, 0, 0]), box=box[None, :], multimask_output=True)
        # 별 모양 넓이(약 3/8·π·r²)에 가까운, 점수 높은 가장 작은 마스크 = 표시 자체
        star_area = 3 / 8 * np.pi * (size / 2) ** 2
        cand = sorted([(m.sum(), s, m) for m, s in zip(masks, scores) if m[cy, cx] and s > 0.8 and 0.5 * star_area < m.sum() < 2.5 * star_area], key=lambda t: t[0])
        if cand:
            mask, method = cand[0][2].astype(np.uint8), "sam2.1"
        else:
            # SAM이 실패하면 템플릿 별 모양 자체를 마스크로 쓴다(기록에 남김)
            mask = np.zeros((h, w), np.uint8)
            t = (star_template(size) > 0).astype(np.uint8)
            mask[cy - size // 2: cy - size // 2 + size, cx - size // 2: cx - size // 2 + size] = t
            method = "template-fallback"
        grow = cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15)))
        bgr = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
        filled = cv2.inpaint(bgr, grow * 255, 9, cv2.INPAINT_TELEA)
        soft = cv2.GaussianBlur(grow.astype(np.float32), (0, 0), 3)[..., None]
        out = (filled * soft + bgr * (1 - soft)).astype(np.uint8)
        scale = 1920 / w
        small = cv2.resize(out, (1920, round(h * scale)), interpolation=cv2.INTER_AREA)
        cv2.imwrite(str(out_dir / f"{p.stem}.jpg"), small, [cv2.IMWRITE_JPEG_QUALITY, 88])
        x1, y1 = max(0, cx - 180), max(0, cy - 180)
        x2, y2 = min(w, cx + 180), min(h, cy + 180)
        cv2.imwrite(str(out_dir / "check" / f"{p.stem}-before-after.png"), np.hstack([bgr[y1:y2, x1:x2], out[y1:y2, x1:x2]]))
        log.append({"file": p.name, "size": [w, h], "mark_center": [int(cx), int(cy)], "mark_size": int(size), "template_match": round(match, 3), "method": method,
                    "mask_px": int(mask.sum()), "inpaint_px": int(grow.sum()), "sam_scores": [round(float(s), 3) for s in scores]})
        print(log[-1])
    (out_dir / "check" / "watermark-log.json").write_text(json.dumps(log, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()

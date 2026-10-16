"""덱이 실제로 쓰는 표시 크기에 맞춘 이미지 파생본을 만든다(PR6, 2026-10-16).

규칙
- 목표 해상도 = 1920×1080 렌더에서 잰 표시 크기(CSS px, object-fit: cover면 잘리기 전 상자) × 1.55
  (조건 IMG-03의 1.5배에 반올림 여유 3%). 원본 해상도를 넘지 않는다(업스케일 0).
- 원본 비율 그대로 줄이기만 한다(자르기 0 — 화면의 크롭은 CSS object-fit·object-position이 그대로 맡는다).
- 생성 이미지(assets/img)는 WebP(품질 82, method 6)를 <picture>의 <source>로 주고, WebP를 못 쓰는 브라우저용 JPEG 대체본은
  가로 1920 이하(이전 덱과 같은 해상도)로 줄여 진행형 JPEG로 둔다. JPEG 품질은 82부터 2씩 내려 140KB 이하가 되는 가장 높은 값(하한 70).
  대체본까지 합쳐 assets/img 총량이 IMG-04(파일당 300KB, 총 1.5MB) 안에 들도록 한 값이다.
- 인물 사진(assets/photos)은 작아서 JPEG 하나만 둔다(품질 82부터, 250KB 이하).
- 색: 원본에 붙은 ICC(sRGB 'c2')는 그대로 옮기고, ICC가 없는 원본(Gemini PNG·올트먼·허사비스)은 sRGB로 보고
  파생본에 sRGB 프로필(588바이트, PIL ImageCms 내장 sRGB)을 붙여 명시한다(V15-42).

원본
- AI 생성 이미지(assets/img): Gemini 원본 2752×1536 PNG(오른쪽 아래 Gemini 표시가 남은 것)와
  remove_watermark.py가 같은 해상도에서 지운 결과 조각(check/<이름>-before-after.png 오른쪽 절반, 360×360)을
  합쳐 '표시를 지운 원본 크기 마스터'를 복원한 뒤 줄인다. 조각 왼쪽 절반이 원본 PNG의 같은 자리와 한 픽셀도 다르지 않은지
  확인하고(다르면 멈춘다), 복원한 마스터를 1920으로 줄여 기존 덱 JPEG(assets/src/img, 품질 88)와 PSNR 39dB 이상인지 본다.
  원본 PNG(장당 7~8MB)는 저장소에 넣지 않는다 — 위치는 MANIFEST.md.
- 인물 사진(assets/photos): assets/src/photos의 Wikimedia Commons 960px 썸네일을 줄인다.

실행(저장소 presentation/에서): python3 assets/src/derive.py [--snap <원본 PNG가 있는 assets/img 폴더>]
"""

import argparse
import io
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageCms

HERE = Path(__file__).resolve().parent          # presentation/assets/src
ASSETS = HERE.parent                              # presentation/assets
SNAP_DEFAULT = Path("/home/user/product-design-system/11-week8-deck-snapshot/agi-job-displacement/presentation/assets/img")

K = 1.55
SRGB = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB")).tobytes()
# 1920×1080 렌더에서 잰 img 상자(CSS px). 장 번호는 2026-10-16 PR2 결과(13dc48d) 기준
SHOWN = {
    # 생성 이미지: (장, 표시 폭, 표시 높이)
    "cover": (1, 639, 704), "callcenter": (1, 639, 704), "recursion": (6, 685, 960),
    "entry": (18, 1920, 960), "robot": (19, 501, 640), "neurons": (22, 501, 640),
    # 인물 사진(9장): 올트먼·허사비스는 감싼 칸보다 큰 img를 칸 안에서 옮겨 자르므로 img 상자 자체를 잰다
    "altman": (9, 322, 546), "amodei": (9, 227, 144), "hassabis": (9, 394, 263),
}
GEN = ["cover", "callcenter", "recursion", "entry", "robot", "neurons"]
PHOTOS = ["altman", "amodei", "hassabis"]


def target(name, w0, h0):
    _, dw, dh = SHOWN[name]
    s = max(dw * K / w0, dh * K / h0)   # cover: 두 변 모두 1.55배 이상이 되는 배율
    s = min(s, 1.0)                     # 원본보다 키우지 않는다
    return max(1, round(w0 * s)), max(1, round(h0 * s)), s >= 1.0


def save_jpeg(img, path, icc=None, budget=250 * 1024):
    for q in range(82, 69, -2):
        b = io.BytesIO()
        img.save(b, "JPEG", quality=q, progressive=True, optimize=True, subsampling="4:2:0", **({"icc_profile": icc} if icc else {}))
        if b.tell() <= budget or q <= 70:
            path.write_bytes(b.getvalue())
            return q, b.tell()


def save_webp(img, path, q=82, icc=SRGB):
    b = io.BytesIO()
    img.save(b, "WEBP", quality=q, method=6, icc_profile=icc)
    path.write_bytes(b.getvalue())
    return q, b.tell()


def master(snap, name):
    log = {e["file"].removesuffix(".png"): e for e in json.loads((snap / "check/watermark-log.json").read_text())}
    raw = np.asarray(Image.open(snap / "raw" / f"{name}.png").convert("RGB")).copy()
    h, w = raw.shape[:2]
    cx, cy = log[name]["mark_center"]
    x1, y1, x2, y2 = max(0, cx - 180), max(0, cy - 180), min(w, cx + 180), min(h, cy + 180)
    ba = np.asarray(Image.open(snap / "check" / f"{name}-before-after.png").convert("RGB"))
    before, after = ba[:, : x2 - x1], ba[:, x2 - x1:]
    if not np.array_equal(before, raw[y1:y2, x1:x2]):
        raise SystemExit(f"{name}: check 조각 왼쪽이 원본 PNG와 다르다 — 마스터 복원 중단")
    raw[y1:y2, x1:x2] = after
    m = Image.fromarray(raw)
    old = np.asarray(Image.open(HERE / "img" / f"{name}.jpg").convert("RGB"), float)
    small = np.asarray(m.resize((old.shape[1], old.shape[0]), Image.LANCZOS), float)
    psnr = 10 * np.log10(255 ** 2 / ((small - old) ** 2).mean())
    if psnr < 39:
        raise SystemExit(f"{name}: 복원 마스터가 기존 덱 JPEG와 다르다(PSNR {psnr:.1f}dB)")
    return m, psnr


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--snap", type=Path, default=SNAP_DEFAULT)
    a = ap.parse_args()
    rows = []
    for name in GEN:
        m, psnr = master(a.snap, name)
        w, h, capped = target(name, *m.size)
        q, n = save_webp(m.resize((w, h), Image.LANCZOS), ASSETS / "img" / f"{name}.webp")
        rows.append((f"{name}.webp", f"{m.size[0]}×{m.size[1]} PNG(마스터 PSNR {psnr:.1f}dB)", w, h, q, n, capped))
        fw = min(w, 1920)
        fh = round(h * fw / w)
        q, n = save_jpeg(m.resize((fw, fh), Image.LANCZOS), ASSETS / "img" / f"{name}.jpg", icc=SRGB, budget=140 * 1024)
        rows.append((f"{name}.jpg", "  └ WebP 못 쓸 때 대체본", fw, fh, q, n, False))
    for name in PHOTOS:
        src = Image.open(HERE / "photos" / f"{name}.jpg")
        icc = src.info.get("icc_profile") or SRGB
        w, h, capped = target(name, *src.size)
        out = ASSETS / "photos" / f"{name}.jpg"
        q, n = save_jpeg(src.convert("RGB").resize((w, h), Image.LANCZOS), out, icc)
        rows.append((f"{name}.jpg", f"{src.size[0]}×{src.size[1]} JPEG", w, h, q, n, capped))
    for name, src, w, h, q, n, capped in rows:
        _, dw, dh = SHOWN[name.split(".")[0]]
        k = min(w / dw, h / dh)
        print(f"{name:16s} {src:34s} → {w}×{h} q{q} {n / 1024:6.1f}KB · 배율 {k:.2f}{' (원본 크기에서 멈춤)' if capped else ''}")


if __name__ == "__main__":
    main()

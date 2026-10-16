#!/usr/bin/env python3
"""visual-qa.ts의 픽셀 보조. 스크린샷에서 색·대비·차이를 잰다.

쓰는 법: python qa_pixels.py <jobs.json>   → 표준 출력에 결과 JSON 한 줄
jobs.json = {"tasks": [{"op": ..., ...}, ...]}  결과는 같은 순서의 배열.

op
  slidestats   장 PNG 한 장: 본문 영역 지배 색과 그 비율, 평균 L*, L*>97 비율, OKLCH C>0.14 비율, 인디고 비율
  textcontrast 글자 상자마다 상자 안 바탕 픽셀(글자색과 먼 픽셀)로 최악 5% 대비
  sample       사각형마다 평균 색
  diff         두 이미지의 다른 픽셀 비율(안쪽만/바깥만 선택)
  ssim         두 이미지 SSIM(회색조, 8px 창)
  jpg          PNG → JPG(품질·최대 폭)
  crop         잘라서 JPG로 저장
  simulate     회색조·제1색맹·제2색맹·프로젝터(대비 -30%, 감마 1.4) 모사본 저장
  icc          ICC 프로필 이름
  tiles        이미지를 겹치는 격자 조각으로 잘라 키운 PNG로 저장(IMG-02 OCR 입력). 조각마다 원본 좌표 상자를 낸다
  linecheck    두 이미지(렌더·PDF 래스터)에서 꺾은선 구간 안쪽 점마다 선 색이 있는지 — PDF에서 선이 사라졌는지 본다
PIL과 numpy가 필요하다.
"""
import json
import sys

import numpy as np
from PIL import Image


def load(path):
    return np.asarray(Image.open(path).convert("RGB"), dtype=np.float64)


def srgb_to_linear(c):
    c = c / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def lab(rgb):
    lin = srgb_to_linear(rgb)
    m = np.array([[0.4124564, 0.3575761, 0.1804375], [0.2126729, 0.7151522, 0.0721750], [0.0193339, 0.1191920, 0.9503041]])
    xyz = lin @ m.T
    xyz = xyz / np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 216 / 24389, np.cbrt(xyz), (24389 / 27 * xyz + 16) / 116)
    L = 116 * f[..., 1] - 16
    a = 500 * (f[..., 0] - f[..., 1])
    b = 200 * (f[..., 1] - f[..., 2])
    return np.stack([L, a, b], axis=-1)


def oklch_c(rgb):
    lin = srgb_to_linear(rgb)
    m1 = np.array([[0.4122214708, 0.5363325363, 0.0514459929], [0.2119034982, 0.6806995451, 0.1073969566], [0.0883024619, 0.2817188376, 0.6299787005]])
    lms = np.cbrt(lin @ m1.T)
    m2 = np.array([[0.2104542553, 0.7936177850, -0.0040720468], [1.9779984951, -2.4285922050, 0.4505937099], [0.0259040371, 0.7827717662, -0.8086757660]])
    o = lms @ m2.T
    return np.hypot(o[..., 1], o[..., 2]), o[..., 0], np.degrees(np.arctan2(o[..., 2], o[..., 1])) % 360


def lum(rgb):
    lin = srgb_to_linear(np.asarray(rgb, dtype=np.float64))
    return lin[..., 0] * 0.2126 + lin[..., 1] * 0.7152 + lin[..., 2] * 0.0722


def mask_of(shape, rects, value=True):
    m = np.zeros(shape[:2], dtype=bool)
    for r in rects or []:
        x0, y0 = max(0, int(r["x"])), max(0, int(r["y"]))
        x1, y1 = min(shape[1], int(r["x"] + r["w"])), min(shape[0], int(r["y"] + r["h"]))
        if x1 > x0 and y1 > y0:
            m[y0:y1, x0:x1] = value
    return m


def slidestats(t):
    img = load(t["img"])
    h, w = img.shape[:2]
    region = t.get("region") or {"x": 0, "y": 0, "w": w, "h": h}
    reg = mask_of(img.shape, [region])
    photo = mask_of(img.shape, t.get("photos"))
    text = mask_of(img.shape, t.get("texts"))
    L = lab(img)
    sel = reg & ~photo
    px = img[sel] if sel.any() else img.reshape(-1, 3)
    q = (px // 8).astype(int)
    keys = q[:, 0] * 1024 + q[:, 1] * 32 + q[:, 2]
    vals, counts = np.unique(keys, return_counts=True)
    top = vals[np.argmax(counts)]
    dom = px[keys == top].mean(axis=0)
    dl = lab(dom[None, :])[0]
    de = np.sqrt(((L[sel] - dl) ** 2).sum(axis=1)) if sel.any() else np.array([0])
    C, Lk, H = oklch_c(img)
    nonphoto = ~photo
    bright = (L[..., 0] > 97) & nonphoto & ~text
    indigo_refs = np.array([[0x4C, 0x5E, 0xB2], [0xEF, 0xF2, 0xFC], [0xDF, 0xE6, 0xFB]], dtype=np.float64)
    ind = np.zeros(img.shape[:2], dtype=bool)
    # 인디고 #4c5eb2는 ΔE<10, 옅은 단계(50·100)는 바탕 스톤(#f4f2ef)과 ΔE 6~7이라 ΔE<3으로 좁힌다
    for ref, tol in zip(lab(indigo_refs), (10, 3, 3)):
        ind |= np.sqrt(((L - ref) ** 2).sum(axis=-1)) < tol
    np_count = max(1, int(nonphoto.sum()))
    hi = (C > 0.14) & nonphoto
    red = hi & ((H < 20) | (H > 340))
    return {
        "dominant": [round(v) for v in dom], "dominantLab": [round(v, 2) for v in dl], "dominantShare": round(float((de < 3).mean()), 4),
        "meanL": round(float(L[..., 0].mean()), 2), "brightShare": round(float(bright.sum() / max(1, int((nonphoto & ~text).sum()))), 4),
        "chromaShare": round(float(hi.sum() / np_count), 5), "redShare": round(float(red.sum() / np_count), 5), "indigoShare": round(float((ind & nonphoto).sum() / np_count), 4),
    }


def contrast_ratio(l1, l2):
    hi, lo = np.maximum(l1, l2), np.minimum(l1, l2)
    return (hi + 0.05) / (lo + 0.05)


def textcontrast(t):
    img = load(t["img"])
    out = []
    Lall = lab(img)
    for it in t["items"]:
        r = it["rect"]
        x0, y0 = max(0, int(r["x"])), max(0, int(r["y"]))
        x1, y1 = min(img.shape[1], int(r["x"] + r["w"] + 0.999)), min(img.shape[0], int(r["y"] + r["h"] + 0.999))
        if x1 <= x0 or y1 <= y0:
            out.append(None)
            continue
        px = img[y0:y1, x0:x1].reshape(-1, 3)
        lb = Lall[y0:y1, x0:x1].reshape(-1, 3)
        tc = np.array(it["color"][:3], dtype=np.float64)
        tl = lab(tc[None, :])[0]
        far = np.sqrt(((lb - tl) ** 2).sum(axis=1)) > 30
        bg = px[far] if far.sum() >= 10 else px
        cr = contrast_ratio(lum(bg), float(lum(tc)))
        q = (bg // 8).astype(int)
        keys = q[:, 0] * 1024 + q[:, 1] * 32 + q[:, 2]
        vals, counts = np.unique(keys, return_counts=True)
        mode = bg[keys == vals[np.argmax(counts)]].mean(axis=0)
        out.append({"worst5": round(float(np.percentile(cr, 5)), 2), "median": round(float(np.median(cr)), 2), "mode": round(float(contrast_ratio(lum(mode), float(lum(tc)))), 2), "modeColor": [round(v) for v in mode], "bgPixels": int(len(bg))})
    return out


def sample(t):
    img = load(t["img"])
    res = []
    for r in t["rects"]:
        m = mask_of(img.shape, [r])
        res.append([round(v, 1) for v in img[m].mean(axis=0)] if m.any() else None)
    return res


def diff(t):
    a, b = load(t["a"]), load(t["b"])
    if a.shape != b.shape:
        b = np.asarray(Image.open(t["b"]).convert("RGB").resize((a.shape[1], a.shape[0])), dtype=np.float64)
    d = np.abs(a - b).max(axis=-1)
    m = np.ones(a.shape[:2], dtype=bool)
    if t.get("inside"):
        m = mask_of(a.shape, t["inside"])
    if t.get("outside"):
        m &= ~mask_of(a.shape, t["outside"])
    sel = d[m]
    return {"changed": round(float((sel > t.get("tol", 8)).mean()) if sel.size else 0.0, 5), "meanAbs": round(float(sel.mean()) if sel.size else 0.0, 3)}


def ssim(t):
    A = Image.open(t["a"]).convert("L")
    B = Image.open(t["b"]).convert("L")
    w = t.get("w") or min(A.width, B.width)
    hgt = round(w * A.height / A.width)
    A, B = A.resize((w, hgt), Image.LANCZOS), B.resize((w, hgt), Image.LANCZOS)
    if t.get("blur"):  # 글자 래스터화 차이를 지우고 배치만 본다
        from PIL import ImageFilter
        A, B = A.filter(ImageFilter.GaussianBlur(t["blur"])), B.filter(ImageFilter.GaussianBlur(t["blur"]))
    a = np.asarray(A, dtype=np.float64)
    b = np.asarray(B, dtype=np.float64)
    k = 8
    hh, ww = (a.shape[0] // k) * k, (a.shape[1] // k) * k
    a, b = a[:hh, :ww].reshape(hh // k, k, ww // k, k), b[:hh, :ww].reshape(hh // k, k, ww // k, k)
    ma, mb = a.mean(axis=(1, 3)), b.mean(axis=(1, 3))
    va, vb = a.var(axis=(1, 3)), b.var(axis=(1, 3))
    cov = ((a - ma[:, None, :, None]) * (b - mb[:, None, :, None])).mean(axis=(1, 3))
    c1, c2 = (0.01 * 255) ** 2, (0.03 * 255) ** 2
    s = ((2 * ma * mb + c1) * (2 * cov + c2)) / ((ma ** 2 + mb ** 2 + c1) * (va + vb + c2))
    return round(float(s.mean()), 4)


def jpg(t):
    im = Image.open(t["src"]).convert("RGB")
    mw = t.get("maxw")
    if mw and im.width > mw:
        im = im.resize((mw, round(im.height * mw / im.width)), Image.LANCZOS)
    im.save(t["dst"], quality=t.get("q", 80))
    return t["dst"]


def crop(t):
    im = Image.open(t["src"]).convert("RGB")
    r = t["rect"]
    box = (max(0, int(r["x"])), max(0, int(r["y"])), min(im.width, int(r["x"] + r["w"])), min(im.height, int(r["y"] + r["h"])))
    if box[2] <= box[0] or box[3] <= box[1]:
        return None
    im = im.crop(box)
    mw = t.get("maxw")
    if mw and im.width > mw:
        im = im.resize((mw, round(im.height * mw / im.width)), Image.LANCZOS)
    im.save(t["dst"], quality=t.get("q", 85))
    return t["dst"]


def linecheck(t):
    """a(렌더)와 b(PDF 래스터, 같은 크기로 맞춤)에서 꺾은선 구간마다 안쪽 점(꼭짓점에서 10px 넘게 떨어진 곳)을 뽑아
    5×5 창 안에 선 색(거리 <48)이 있는지 센다. 렌더에 선이 있던 점 가운데 PDF에도 있는 비율을 낸다."""
    a = load(t["a"])
    b = np.asarray(Image.open(t["b"]).convert("RGB").resize((a.shape[1], a.shape[0]), Image.LANCZOS), dtype=np.float64)
    out = []
    for line in t["lines"]:
        col = np.array(line["color"][:3], dtype=np.float64)
        pts = line["pts"]
        inA = inB = n = 0
        for p, q in zip(pts, pts[1:]):
            L = ((q["x"] - p["x"]) ** 2 + (q["y"] - p["y"]) ** 2) ** 0.5
            if L < 24:
                continue
            for f in np.linspace(0, 1, max(3, int(L // 24)) + 2)[1:-1]:
                x, y = p["x"] + (q["x"] - p["x"]) * f, p["y"] + (q["y"] - p["y"]) * f
                if f * L < 10 or (1 - f) * L < 10:
                    continue
                xi, yi = int(round(x)), int(round(y))
                if not (2 <= xi < a.shape[1] - 2 and 2 <= yi < a.shape[0] - 2):
                    continue
                n += 1
                da = np.sqrt(((a[yi - 2:yi + 3, xi - 2:xi + 3] - col) ** 2).sum(-1)).min()
                db = np.sqrt(((b[yi - 2:yi + 3, xi - 2:xi + 3] - col) ** 2).sum(-1)).min()
                if da < 48:
                    inA += 1
                    if db < 48:
                        inB += 1
        out.append({"n": n, "inA": inA, "inB": inB, "share": round(inB / inA, 3) if inA else None})
    return out


def tiles(t):
    """grid×grid 조각(한 변 원본의 1/grid보다 약간 크게 겹침)을 scale배로 키워 저장한다. eq=True면 회색조 평활화."""
    from PIL import ImageOps
    im = Image.open(t["src"]).convert("RGB")
    W, H = im.size
    g, sc = t.get("grid", 3), t.get("scale", 2)
    span = t.get("span", 1.3) / g
    out = []
    for i in range(g):
        for j in range(g):
            x0, y0 = int(W * j / g * (1 - span + 1 / g) if g > 1 else 0), int(H * i / g * (1 - span + 1 / g) if g > 1 else 0)
            x1, y1 = min(W, int(x0 + W * span)), min(H, int(y0 + H * span))
            c = im.crop((x0, y0, x1, y1))
            if t.get("eq"):
                c = ImageOps.equalize(c.convert("L"))
            c = c.resize(((x1 - x0) * sc, (y1 - y0) * sc), Image.LANCZOS)
            dst = f'{t["dst"]}-g{g}{"e" if t.get("eq") else ""}-{i}{j}.png'
            c.save(dst)
            out.append({"path": dst, "box": [x0, y0, x1 - x0, y1 - y0]})
    return out


# Machado 2009 심각도 1.0 행렬(선형 RGB)
PROTAN = np.array([[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]])
DEUTAN = np.array([[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]])


def to_srgb(lin):
    lin = np.clip(lin, 0, 1)
    return np.where(lin <= 0.0031308, lin * 12.92, 1.055 * lin ** (1 / 2.4) - 0.055) * 255


def simulate(t):
    img = load(t["src"])
    lin = srgb_to_linear(img)
    out = {}
    g = lum(img)
    out["gray"] = to_srgb(np.stack([g, g, g], axis=-1))
    out["protan"] = to_srgb(lin @ PROTAN.T)
    out["deutan"] = to_srgb(lin @ DEUTAN.T)
    proj = 128 + (img - 128) * 0.7
    out["projector"] = 255 * (np.clip(proj, 0, 255) / 255) ** (1 / 1.4)
    paths = {}
    for k, v in out.items():
        p = f'{t["dst"]}-{k}.jpg'
        im = Image.fromarray(np.clip(v, 0, 255).astype(np.uint8))
        if t.get("maxw") and im.width > t["maxw"]:
            im = im.resize((t["maxw"], round(im.height * t["maxw"] / im.width)), Image.LANCZOS)
        im.save(p, quality=80)
        paths[k] = p
    return paths


def icc(t):
    im = Image.open(t["path"])
    prof = im.info.get("icc_profile")
    if not prof:
        return {"profile": None, "mode": im.mode}
    try:
        from PIL import ImageCms
        desc = ImageCms.getProfileDescription(ImageCms.ImageCmsProfile(__import__("io").BytesIO(prof))).strip()
    except Exception as e:  # 프로필을 못 읽으면 길이만
        desc = f"unreadable({len(prof)} bytes): {e}"
    return {"profile": desc, "mode": im.mode}


OPS = {"slidestats": slidestats, "textcontrast": textcontrast, "sample": sample, "diff": diff, "ssim": ssim, "jpg": jpg, "crop": crop, "simulate": simulate, "icc": icc, "linecheck": linecheck, "tiles": tiles}


def main():
    jobs = json.load(open(sys.argv[1]))
    res = []
    for t in jobs["tasks"]:
        try:
            res.append(OPS[t["op"]](t))
        except Exception as e:
            res.append({"error": f"{type(e).__name__}: {e}"})
    print(json.dumps(res))


if __name__ == "__main__":
    main()

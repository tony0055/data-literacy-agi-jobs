#!/usr/bin/env python3
"""장 PNG를 2열 컨택트시트로 묶는다. --pairs면 (before, after)를 한 줄에 나란히 놓는다.

쓰는 법
  python3 scripts/contact-sheet.py --out renders/contact.jpg [--cols 2] [--width 960] [--rows 9] renders/index/slide-*.png
  python3 scripts/contact-sheet.py --out renders/compare.jpg --pairs before-01.png after-01.png before-02.png after-02.png ...
  python3 scripts/contact-sheet.py --out renders/compare.jpg --pairs --dirs renders/before renders/index   (같은 파일 이름끼리 짝)

시트가 길면 --rows 줄마다 나눠 contact-1.jpg, contact-2.jpg …로 저장하고 만든 경로를 한 줄씩 출력한다.
칸마다 파일 이름(장 번호)을 위에 적는다. PIL이 필요하다.
"""
import argparse
import os
import re
import sys

from PIL import Image, ImageDraw, ImageFont


def font(size):
    for p in ["/System/Library/Fonts/AppleSDGothicNeo.ttc", "/System/Library/Fonts/Supplemental/Arial Unicode.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except OSError:
                pass
    return ImageFont.load_default()


def name_of(p):
    m = re.search(r"slide-(\d+)", os.path.basename(p))
    return f"{int(m.group(1))}장" if m else os.path.basename(p)


def tile(path, width):
    im = Image.open(path).convert("RGB")
    return im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)


def build(cells, cols, width, captions, out_path, gap=16, cap_h=36):
    f = font(22)
    tiles = [tile(p, width) if p and os.path.exists(p) else None for p in cells]
    th = max((t.height for t in tiles if t), default=round(width * 9 / 16))
    rows = (len(cells) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * width + (cols + 1) * gap, rows * (th + cap_h + gap) + gap), (40, 38, 35))
    d = ImageDraw.Draw(sheet)
    for i, t in enumerate(tiles):
        r, c = divmod(i, cols)
        x = gap + c * (width + gap)
        y = gap + r * (th + cap_h + gap)
        d.text((x, y + 4), captions[i], fill=(235, 232, 228), font=f)
        if t:
            sheet.paste(t, (x, y + cap_h))
        else:
            d.rectangle([x, y + cap_h, x + width, y + cap_h + th], outline=(120, 116, 110))
            d.text((x + 16, y + cap_h + 16), "없음", fill=(200, 196, 190), font=f)
    sheet.save(out_path, quality=82)
    return out_path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--cols", type=int, default=2)
    ap.add_argument("--width", type=int, default=960)
    ap.add_argument("--rows", type=int, default=9)
    ap.add_argument("--pairs", action="store_true")
    ap.add_argument("--dirs", nargs=2)
    ap.add_argument("images", nargs="*")
    a = ap.parse_args()

    if a.pairs:
        if a.dirs:
            before, after = a.dirs
            names = sorted({os.path.splitext(f)[0] for f in os.listdir(after) if re.match(r"slide-\d+\.(png|jpe?g)$", f)})
            pick = lambda d, n: next((os.path.join(d, n + e) for e in (".png", ".jpg", ".jpeg") if os.path.exists(os.path.join(d, n + e))), None)
            imgs = [x for n in names for x in (pick(before, n), pick(after, n))]
        else:
            imgs = a.images
        if len(imgs) % 2:
            sys.exit("--pairs에는 before·after 짝수 개가 필요하다")
        cols = 2
        caps = [f"{name_of(p)} {'이전' if i % 2 == 0 else '이후'}" for i, p in enumerate(imgs)]
    else:
        imgs, cols = a.images, a.cols
        caps = [name_of(p) for p in imgs]
    if not imgs:
        sys.exit("이미지가 없다")
    per = a.rows * cols
    base, ext = os.path.splitext(a.out)
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    chunks = [range(i, min(i + per, len(imgs))) for i in range(0, len(imgs), per)]
    for k, ch in enumerate(chunks):
        out = a.out if len(chunks) == 1 else f"{base}-{k + 1}{ext}"
        print(build([imgs[i] for i in ch], cols, a.width, [caps[i] for i in ch], out))


if __name__ == "__main__":
    main()

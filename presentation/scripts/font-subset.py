#!/usr/bin/env python3
"""덱 글자만 담은 부분 글꼴 Deck Sans Subset을 만든다(TYP-14 · PERF-01).

원본은 Pretendard(길형진, SIL OFL 1.1, Reserved Font Name "Pretendard")다. 부분 파일은 OFL의 Modified Version이라
예약 이름을 쓸 수 없으므로 내부 이름(name 1·3·4·6·16·25와 fvar 인스턴스 PostScript 이름)을 "Deck Sans Subset"으로 바꾸고,
저작권(0)·상표(7)·제작자(8·9)·라이선스(13·14) 레코드는 그대로 두며 0번에 파생 사실을 덧붙인다.

만드는 파일: assets/fonts/DeckSansSubset.woff2
tokens.css는 같은 CSS 별칭 "Deck Sans"로 @font-face 두 개를 둔다(원본 파일은 바꾸지 않고 별칭으로만 부른다).
  1) 원본 PretendardVariable.woff2 — unicode-range: 원본에 있고 부분 파일에 없는 글자(공백 U+0020 제외)
  2) DeckSansSubset.woff2 — unicode-range: 부분 파일에 담은 글자
나중에 정의한 규칙이 먼저 쓰이므로 덱 글자는 부분 파일로 그리고, 덱에 없는 글자가 나타날 때만 원본을 받는다.

다시 만들기(presentation/에서):
  python3 scripts/font-subset.py [다른 파일 …]   # 글자 모으기 → 부분 파일 → 이름 바꾸기 → tokens.css의 unicode-range 두 줄 갱신
  (병합 전 다른 PR 브랜치의 index.html·src/*를 인자로 주면 그 글자도 담는다. 병합 뒤에는 인자 없이 다시 돌린다.)
글자를 모으는 곳: index.html, src/*.js, src/*.css, 그리고 아래 BASE(기본 라틴·문장 부호·화살표·수학 기호).
필요한 것: fontTools(pyftsubset) + brotli.
"""
import pathlib, re, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "assets/fonts/PretendardVariable.woff2"
OUT = ROOT / "assets/fonts/DeckSansSubset.woff2"
NEW_FAMILY, NEW_PS = "Deck Sans Subset", "DeckSansSubset"
KEEP_IDS = {0, 7, 8, 9, 10, 11, 12, 13, 14}  # 저작권·상표·제작자·설명·URL·라이선스는 그대로
TOKENS = ROOT / "src/tokens.css"

# 기본 라틴 전체 · 라틴-1 문장 부호 · 일반 문장 부호 · 위첨자 · 화살표 · 자주 쓰는 수학 기호 · 원 기호
BASE = set(range(0x20, 0x7F)) | set(range(0xA0, 0x100)) | set(range(0x2010, 0x2070)) \
    | {0x00B2, 0x00B3, 0x00B9, 0x2070, 0x2074, 0x2075, 0x2076, 0x2077, 0x2078, 0x2079} \
    | set(range(0x2190, 0x21A0)) | {0x21BA, 0x21BB} \
    | {0x2212, 0x2213, 0x2215, 0x2219, 0x221A, 0x221E, 0x2248, 0x2260, 0x2261, 0x2264, 0x2265, 0x00D7, 0x00F7} \
    | {0x25B2, 0x25B6, 0x25BC, 0x25C0, 0x25CF, 0x25CB, 0x2713, 0x2715}


def collect(extra: list[str]) -> set[int]:
    cps = set(BASE)
    files = [ROOT / "index.html", *sorted((ROOT / "src").glob("*.js")), *sorted((ROOT / "src").glob("*.css")), *map(pathlib.Path, extra)]
    for f in files:
        text = f.read_text(encoding="utf-8")
        text = re.sub(r"\\([0-9a-fA-F]{2,6})", lambda m: chr(int(m.group(1), 16)), text)  # CSS 이스케이프
        text = re.sub(r"&#x([0-9a-fA-F]+);", lambda m: chr(int(m.group(1), 16)), text)
        text = re.sub(r"&#(\d+);", lambda m: chr(int(m.group(1))), text)
        cps |= {ord(c) for c in text if ord(c) >= 0x20}
    return cps


def ranges(cps: list[int]) -> list[tuple[int, int]]:
    out: list[tuple[int, int]] = []
    for c in sorted(cps):
        if out and c == out[-1][1] + 1:
            out[-1] = (out[-1][0], c)
        else:
            out.append((c, c))
    return out


def fmt(rs: list[tuple[int, int]]) -> str:
    return ", ".join(f"U+{a:X}" if a == b else f"U+{a:X}-{b:X}" for a, b in rs)


def rename(path: pathlib.Path) -> None:
    """OFL 예약 이름(Pretendard)을 부분 파일의 이름 레코드에서 뺀다. 저작권·라이선스 레코드는 남긴다."""
    from fontTools.ttLib import TTFont

    font = TTFont(path)
    name = font["name"]
    for rec in name.names:
        text = rec.toUnicode()
        if rec.nameID == 0:
            if "Deck Sans Subset" not in text:
                text += ". Deck Sans Subset is a subset derived from Pretendard (c) Kil Hyung-jin, licensed under the SIL Open Font License 1.1"
        elif rec.nameID not in KEEP_IDS:
            text = text.replace("Pretendard Variable", NEW_FAMILY).replace("PretendardVariable", NEW_PS).replace("Pretendard", NEW_FAMILY)
        rec.string = text
    left = [(r.nameID, r.toUnicode()) for r in name.names if r.nameID not in KEEP_IDS and "Pretendard" in r.toUnicode()]
    assert not left, left
    font.flavor = "woff2"
    font.save(path)


def main() -> None:
    from fontTools.ttLib import TTFont

    have = set(TTFont(SRC).getBestCmap())
    cps = sorted(c for c in collect(sys.argv[1:]) if c in have)
    subprocess.run([
        "pyftsubset", str(SRC), f"--output-file={OUT}", "--flavor=woff2",
        f"--unicodes={','.join(f'{c:X}' for c in cps)}",
        "--layout-features=*", "--no-hinting", "--desubroutinize",
        "--name-IDs=*", "--name-languages=*", "--name-legacy",
    ], check=True)
    rename(OUT)
    sub = ranges(cps)
    # 원본 규칙: 원본 글꼴에 있는 글자 가운데 부분 파일에 담지 않은 것만(공백 포함 안 됨).
    # 원본에도 없는 글자는 범위에서 빼서, 그런 글자 때문에 2MB를 받지 않고 바로 시스템 글꼴로 간다.
    rest = ranges(sorted(have - set(cps)))
    assert not any(a <= 0x20 <= b for a, b in rest)  # 공백은 BASE에 있어 늘 부분 파일 쪽
    css = TOKENS.read_text(encoding="utf-8")
    css = re.sub(r"(/\* @rest \*/ unicode-range: )[^;]+;", lambda m: m.group(1) + fmt(rest) + ";", css)
    css = re.sub(r"(/\* @deck \*/ unicode-range: )[^;]+;", lambda m: m.group(1) + fmt(sub) + ";", css)
    TOKENS.write_text(css, encoding="utf-8")
    print(f"{len(cps)}자 → {OUT.name} {OUT.stat().st_size / 1024:.0f}KB · 범위 {len(sub)}개(부분) / {len(rest)}개(나머지)", file=sys.stderr)


if __name__ == "__main__":
    main()

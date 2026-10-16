# PR3 · 차트 9개 문법·정직성·접근성

## ① 요약
- 배정 위반 **42건 중 고침 29 · 부분 11 · 못 고침 2**(못 고친 2건과 부분의 나머지는 모두 다른 PR 소유 파일). critical 1건 **V8-01 고침**: 13장 산점도의 세로 범위를 −50%–+200%(데이터 최댓값 +197.0%)로 넓혀 +50% 넘는 직업 10개를 실제 값 자리에 그린다. 끝에 붙인 점은 0개다.
- 9개 차트 모두 svg 위 같은 자리에 '무엇·단위·기간' 제목을 둔다. 출처 줄에는 n·기간·확인일(2026-10-16)을, 차트 안에는 강조 주석 한 줄을 넣었다.
- svg는 `role="img"`이고 `<title>`·`<desc>`로 읽힌다. desc는 유형·축 범위·핵심 값을 담고 chart-data의 '설명' 필드에서 데이터 값으로 만든다. 눈금·축 글자는 aria-hidden이다.
- 차트 글자는 잉크·회색만 입는다. 점에는 바탕색 2px 고리를 두르고 막대 두께는 20(끝 둥글기 4)이다. 로그 눈금은 10배 간격이고 비교 계열은 잉크(프로젝터 모사 ΔL* 22.5)로 그린다. 점선은 뜻이 있는 계열(KDI·직급 기준선)에만 쓴다.
- 27장은 헤드라인('사무직부터 시작해…')에 맞춰 **시작 시점 차트**로 바꿨다. 연도 축 위에 기준 시나리오 점과 빠름–신중 범위선을 시작 순으로 놓고, 2036년 대체 압력(%)은 오른쪽 열에 숫자로 둔다.
- 10·11장 AGI 계열은 같은 이름·색·굵기·가로축·자리로 맞췄다. 직업군 이름은 17·27·28장에서 전문직·사무직·판매직·장치·기계 조작직으로 통일했다.
- gates·poster는 createElement + textContent로 그린다(25장 픽셀 차 0). 외삽 경계(960분)·라벨은 chart-data로 옮기고 font-size 15 하드코딩은 지웠다.
- **숫자 값은 바꾸지 않았다**: check-numbers unverified `[]`이고, chart-data의 원래 숫자 값 diff는 0이다(바뀐 것은 축 범위·눈금·이름표 자리·설명 같은 메타 필드뿐).
- 맡은 파일만 고쳤다: `presentation/src/charts.js` · `presentation/src/deck.css`(차트 블록 110–144행) · `chart-data.json` · `analysis/build_chart_data.py` · `presentation/index.html`의 `data-chart` 요소 안쪽(+ build.ts가 쓰는 chart-data 블록).

## ② 배정 위반 표
전체 42건 표·판정 이의·확인 못 한 것: [qa/pr/03/violations.md](violations.md)

| 상태 | id |
| --- | --- |
| 고침(29) | V8-01, V1-13, VG-21, V8-02, V8-04, V8-05, V8-06, V15-19, V15-20, V15-24, V22-28, V22-29, V22-30, V22-36, V22-34, V1-14, V8-07, V8-09, V8-11, V15-21, V15-22, V15-23, V15-27, V22-31, V22-32, V22-33, V22-37, V22-38, VG-42 |
| 부분(11) | V1-15·VG-20(5장 도식 PR2), V8-42(킥커·카드·꼬리말), V8-43(카드 문구), VG-29·V8-45·V22-18(헤드라인·본문·꼬리말 표기), VG-34(.legend·fit.js), V8-35(장당 크기 위계 tokens), V15-25·V22-35(헤드라인·카드 이름) |
| 못 고침(2) | V22-39(23·25·26·28장 추정 라벨 자리·헤드라인 표현), V1-24(5장 도식) — 둘 다 PR2/PR5 소유 |

## ③ visual-qa 결과 (`--compare=baseline-cloud`)
- 전체: 통과 39 · 실패 103 · 수동 5 · 오류 0. 기준선은 통과 29였다.
- 기준선 대비 실패 → 통과 11개: **CON-04, CHT-01, CHT-02, CHT-04, CHT-05, CHT-06, CHT-07, CHT-08, CHT-09, CHT-11, CHT-12**
- 항목이 줄어든 조건: CON-03 7→3(남은 것은 5장 도식), TYP-02 7→2(5장 도식), TXT-08 33→30, TYP-09 56→54, TYP-03 120→119
- 맡은 조건 가운데 아직 실패하는 것과 사유
  - CHT-10(10·11장 세로 범위)·EVD-01(지우라고 한 표시의 숫자 토큰): 판정 이의(violations.md 1·2)
  - CARD-07·TYP-03·TYP-09·TYP-13·TXT-04·TXT-08·EVD-02·EVD-04: 남은 항목은 모두 차트 밖 요소(5장 도식, 킥커, 태그, 카드, 헤드라인, 꼬리말)라서 다른 PR 소유
- 회귀 3: CHT-10·EVD-01은 판정 이의다. NAV-04는 부하 흔들림이다. 같은 명령을 기준선 덱과 번갈아 5회씩 돌린 중앙값이 기준선 63–157ms(3회 실패), 이 덱 74–133ms(3회 실패)였다. **판정 이의를 빼면 이 PR이 만든 회귀는 0이다.**

## ④ qa-all 단계별 종료 코드
| 단계 | 종료 | 비고 |
| --- | --- | --- |
| build | 0 | |
| render | 0 | issues는 5장 도식 tiny만, 기준선과 같음 |
| check-numbers | 0 | unverified [] |
| constitution | 0 | 글자 크기 9 · 굵기 3 · 위반 0 |
| token-check | 1 | off-token space 27건으로 기준선과 같음(전부 slides.css·deck.css 차트 블록 밖·index.html 15장 인라인 1건). 이 PR은 0건 추가 |
| visual-qa | 1 | 남은 실패가 있어 정상. qa-all 안에서 돈 마지막 회차는 외부 종료(143)로 끊겨 같은 명령을 단독으로 다시 돌렸다(594초) |

## ⑤ before / after (1920×1080)
바뀐 장은 7 · 10 · 11 · 13 · 14 · 17 · 24 · 26 · 27 · 28장이다. 25장은 표를 다시 짜도 픽셀 차가 0이었고, 나머지 장도 기준선 PNG와 픽셀 차 0이다.

![비교 1](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/compare-1.jpg)
![비교 2](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/compare-2.jpg)

| 장 | before | after |
| --- | --- | --- |
| 7 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/before/slide-07.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/after/slide-07.jpg) |
| 10 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/before/slide-10.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/after/slide-10.jpg) |
| 11 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/before/slide-11.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/after/slide-11.jpg) |
| 13 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/before/slide-13.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/after/slide-13.jpg) |
| 14 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/before/slide-14.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/after/slide-14.jpg) |
| 17 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/before/slide-17.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/after/slide-17.jpg) |
| 24 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/before/slide-24.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/after/slide-24.jpg) |
| 26 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/before/slide-26.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/after/slide-26.jpg) |
| 27 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/before/slide-27.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/after/slide-27.jpg) |
| 28 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/before/slide-28.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/after/slide-28.jpg) |

## ⑥ 못 고친 것과 사유
- 맡은 파일 밖이라 손대지 않은 것
  - 5장 인과 사슬 도식(V1-24, V1-15·VG-20의 5장 부분): PR2
  - 킥커의 '관계식 R1~R3'·'수업 7주', 카드·꼬리말의 용어 풀이와 중복 문구, 헤드라인·본문의 물결·따옴표·em dash, 23·25·26·28장 '추정' 라벨 자리와 외삽 헤드라인 표현: PR2/PR5
  - `.legend` 크기와 fit.js TERTIARY: PR2·PR1/PR7
- 디자인 표준 `color.md`의 '비교 = --chart-mid · 맥락 = 점선'이 이번 변경(비교 = 잉크, 점선은 다른 출처 계열 전용)과 다르다. PR7에서 고쳐야 한다(violations.md '색 표준과 다른 점').
- 10·11장 세로 범위를 같게 하라는 CHT-10 판정은 V8-02 지시('세로 범위만 늘림')와 부딪혀 지시를 따랐다.

## ⑦ 확인 못 한 것
- OCR 기반 항목(IMG-02·RSP-02 OCR 부분): 이 환경에서 돌리지 못했다.
- 실기기 휴대폰: 확인하지 않았다. 390×844 무대 렌더(전체 축소)에서 라벨 겹침이 없는 것만 눈으로 확인했다. 세로 읽기 모드는 PR4 소유다.
- 독립 검증(만든 쪽과 다른 에이전트): 아직 하지 않았다.
- 비교 시트 칸 제목의 한글이 이 환경 글꼴(DejaVu)에서 네모로 나온다(scripts/contact-sheet.py, PR1 소유). 장 순서는 7·10·11·13·14·17 / 24·26·27·28이다.
- hover 툴팁·표 보기(dataviz 권장)는 발표 덱이라 넣지 않았다. 대신 desc가 핵심 값을 글로 갖는다.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

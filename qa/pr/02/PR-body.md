## 요약

카드를 걷어내고 **장 바탕 면**으로 34장을 다시 짰습니다. 독립 검증 1회차 불합격과 오케스트레이터 결정(TYP-11·SURF-03·CARD-02 조건 우선)에 따라 2회차에서 바꾼 것은 다섯 가지입니다.

- **둥근 색 면을 10장으로 줄였습니다.** 3·4·8·9·12·15·16·21·23·33장에만 장당 1개, 바깥 여백 64 한 가지입니다. 나머지 24장은 그릇 없이 장 바탕을 나눠 구성했습니다(세로 나눔·머리 띠·옆 시트·아래 띠·표 첫 열 칠). 장별 틀은 [`qa/pr/02/surface-plan.md`](qa/pr/02/surface-plan.md)에 있습니다.
- **96px 이상 숫자는 4·18장 두 장뿐입니다.** 나머지 장은 핵심 숫자 88 하나와 보조 숫자 64입니다.
- **어두운 장은 18장 하나입니다.** 6·19장은 밝은 바탕 위 사진으로, 29·34장은 밝은 장으로 바꿨습니다.
- **2장 장식을 데이터 도식으로 바꿨습니다.** 두 배 기간 188→129→105일을 고리 지름에 비례하게 그렸습니다.
- **글이 적은 장은 본문을 32 보통 굵기로 키워 장 높이를 씁니다.**

3회차(독립 검증 2회차 불합격 뒤 오케스트레이터 지시)에서 바꾼 것:

- **본문은 헤더 아래 64에서 바로 시작합니다.** `.body.cols { align-content: center }`를 지웠고, 33장 모두 헤더 → 첫 보이는 내용 64를 DOM으로 쟀습니다(표는 violations.md 「3회차」 절). 남는 높이는 띄워서 만들지 않고 면 높이·줄 나눔·본문 32·값을 그대로 그린 보조 그림(12장 근로시간 막대, 15장 18칸 중 11칸, 20장 2.9·4.9·7.8년 막대)으로 씁니다.
- **띠는 내용 덩어리에 붙습니다.** 고정 y(`.y776`·`.y864`)를 지우고 7장 출처 줄·20장 회사 줄·33장 다음 할 일·32장 일정 덩어리에 띠를 붙였습니다. 경계를 가로지르는 글줄이 없습니다.
- **같은 틀 3연속이 없습니다.** 30장은 가운데 쟁점을 두고 두 근거가 마주 보는 표, 31장만 첫 열 칠(칠 끝과 둘째 열 글자 사이 거터 24), 32장은 일정 막대가 먼저입니다. 3·15·21장 면은 오른쪽, 20장은 위아래, 22장은 사진 왼쪽입니다.
- **9장 인물 사진은 얼굴 기준으로 자릅니다.** 허사비스 사진은 원본 오른쪽 위(본인 쪽)만 씁니다.
- **문장은 바꾸지 않았습니다.** 줄바꿈은 nowrap span과 줄 폭으로만 고쳤고, 문구가 필요한 것은 PR5로 넘겼습니다.

그 밖에:

- 1회차에 한 일은 그대로입니다. 헤드라인은 모든 장 (160,112)에 고정했고, 색(인디고·세이지)과 모서리 체계는 유지했습니다.
- 글꼴은 덱 글자만 담은 부분 파일 Deck Sans Subset(OFL 파생, 167KB)입니다.
- 모션 시간·이징은 토큰으로, :hover는 미디어 조건 안으로 옮겼습니다.
- 배정 142건: **고침 120 · 부분·타PR 17 · 부분·충돌인정 5 · 부분·범위안 0 · 안 고침 0**
- critical V1-01(5장 도식 13px)은 화면 쪽을 고쳤습니다. 도식을 1:1로 그리고 최소 20px로 올렸습니다. 남은 것은 fit.js의 `.chain text`(PR1)와 README(PR7)입니다.
- 맡은 파일만 바꿨습니다: `src/tokens.css`·`src/deck.css`(차트 블록 제외)·`src/slides.css`·`index.html` 본문 구조. 그 밖에 오케스트레이터 지시로 추가한 것은 `assets/fonts/DeckSansSubset.woff2`, `assets/fonts/DeckSansSubset-NOTICE.txt`, `scripts/font-subset.py`입니다.
- chart-data 블록, 차트 div 안쪽, `<head>`, `<script>`는 바이트 단위로 그대로입니다.

## 배정 위반

전체 표: [`qa/pr/02/violations.md`](qa/pr/02/violations.md). 142건 전부를 담았고, PR4 이관 항목과 2회차 지적 반영 표도 함께 있습니다.

| 상태 | 건수 | 주요 사유 |
| --- | --- | --- |
| 고침 | 120 | 조건 전부 통과 + 렌더 눈 확인 + (3회차) 헤더→첫 내용 DOM 실측 |
| 부분·타PR | 17 | 남은 몫이 다른 PR 파일: 차트 div 안 범례·라벨·색(PR3), 이미지(PR6), README(PR7), fit.js(PR1), 문장(PR5) |
| 부분·충돌인정 | 5 | 오케스트레이터가 인정한 조건 충돌: TYP-09 최대/본문(20·25·28~32장), LAY-09 34장 |
| 부분·범위안 | 0 | — |
| 안 고침 | 0 | — |

## visual-qa 결과(`--compare=baseline-cloud`)

- 전체 147: **통과 64 · 실패 78 · 수동 5 · 오류 0**(수동 확인 대기 9). 기준선 통과는 29였습니다.
- 새로 통과: LAY-01, LAY-03, LAY-04, LAY-07, LAY-08, LAY-10, SURF-01, SURF-02, CARD-01, CARD-02, CARD-03, CARD-04, CARD-05, CARD-06, CARD-07, CARD-08, COL-01, COL-05, CON-01, CON-02, CON-05, TYP-03, TYP-04, TYP-05, TYP-06, TYP-07, TYP-08, TYP-10, TYP-11, TYP-13, TXT-09, IMG-06, EVD-02, NAV-11, CTL-07, A11Y-04, STD-02
- 판정기가 회귀로 표시한 것은 4건입니다.
  - **TYP-01**(통과→실패): 판정기 결함으로 오케스트레이터가 인정했다. 덱 글자만 담은 부분 파일 Deck Sans Subset은 원본 Pretendard와 글리프가 925/925 같다. 다만 OFL 예약 이름 때문에 이름만 다르다. 회귀로 세지 않는다(PR1 판정기 수정 대상).
  - **CHT-05**(항목 17→18): 11장 「2098」 라벨 겹침이다. 차트를 1:1로 그리면서 원래 있던 겹침이 측정 문턱을 넘었다. 라벨 위치는 charts.js(PR3) 몫이고, PR3 브랜치에서는 통과다.
  - **NAV-04**(통과→실패, 중앙값 455ms): 페이지 로드 직후 첫 넘김 한두 번이 느린 콜드 흔들림이다. 같은 작업트리에서 `--only=NAV-04` 단독 3회는 모두 통과(첫 표본 142·133·7ms, 나머지 44~85ms). 2회차 검증자도 기준선 덱에서 같은 양상(3회 중 1회 실패)을 확인했다.
  - **CTL-02**(항목 133→136): 재생 버튼을 기준선 위치(오른쪽 아래)로 되돌렸다(오케스트레이터 지시). 6·18·19장 쪽 번호가 LAY-01에 따라 다른 장과 같은 자리로 오면서, 기준선의 31장과 똑같이 버튼과 겹친다. PR4 조작부가 버튼을 대체한다.

## qa-all 단계별 종료 코드

| 단계 | 종료 |
| --- | --- |
| build | 0 |
| render | 0(issues 0) |
| check-numbers | 0(unverified 0) |
| constitution | 0(글자 크기 8 · 굵기 3 · 이징 2 · 위반 0) |
| token-check --strict | 0(off-token 0) |
| visual-qa | 1(남은 실패가 있어 정상) |

## before / after(34장 전부 바뀜)

비교 시트: [compare-1](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/compare-1.jpg) · [compare-2](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/compare-2.jpg) · [compare-3](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/compare-3.jpg) · [compare-4](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/compare-4.jpg) · [compare-5](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/compare-5.jpg) · [compare-6](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/compare-6.jpg)

| 장 | before | after |
| --- | --- | --- |
| 1 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-01.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-01.jpg) |
| 2 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-02.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-02.jpg) |
| 3 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-03.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-03.jpg) |
| 4 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-04.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-04.jpg) |
| 5 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-05.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-05.jpg) |
| 6 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-06.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-06.jpg) |
| 7 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-07.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-07.jpg) |
| 8 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-08.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-08.jpg) |
| 9 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-09.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-09.jpg) |
| 10 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-10.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-10.jpg) |
| 11 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-11.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-11.jpg) |
| 12 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-12.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-12.jpg) |
| 13 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-13.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-13.jpg) |
| 14 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-14.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-14.jpg) |
| 15 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-15.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-15.jpg) |
| 16 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-16.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-16.jpg) |
| 17 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-17.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-17.jpg) |
| 18 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-18.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-18.jpg) |
| 19 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-19.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-19.jpg) |
| 20 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-20.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-20.jpg) |
| 21 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-21.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-21.jpg) |
| 22 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-22.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-22.jpg) |
| 23 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-23.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-23.jpg) |
| 24 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-24.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-24.jpg) |
| 25 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-25.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-25.jpg) |
| 26 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-26.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-26.jpg) |
| 27 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-27.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-27.jpg) |
| 28 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-28.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-28.jpg) |
| 29 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-29.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-29.jpg) |
| 30 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-30.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-30.jpg) |
| 31 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-31.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-31.jpg) |
| 32 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-32.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-32.jpg) |
| 33 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-33.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-33.jpg) |
| 34 | ![before](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/before/slide-34.jpg) | ![after](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/design/02-surfaces/qa/pr/02/after/slide-34.jpg) |

## 못 고친 것과 사유

- **조건 충돌(오케스트레이터 인정, 2회차 검증자 재현): CARD-02 × LAY-09 × TYP-09.** 숫자 없는 표·목록 장(20·25·28~32)은 셋을 함께 지킬 수 없습니다.
  - 둥근 색 면은 10장 한도라 이 장들에 줄 수 없습니다.
  - 본문 24로는 점유율이 0.20~0.32에 머뭅니다.
  - 32로 키우면 점유율은 0.35를 넘지만 최대 64/본문 32 = 2.0으로 TYP-09(2.4 이상)에 걸립니다.
  - LAY-09를 지켰습니다(우선순위: LAY-09 전 장, TYP-09는 4·21·33장 명시 — 셋 다 통과).
- **LAY-09 34장(출처 표).** 32로 키우면 표가 장을 193px 넘칩니다. 24 이하로 두어 점유율 0.21입니다(기준선도 0.24로 실패).
- **SURF-03.** 남은 항목은 design-standard에 18장(전면 사진) 사유를 적는 일이고, PR7 몫입니다.
- **다른 PR 파일:**
  - 차트 색·라벨·점(CON-03·CON-04·CHT-05·LAY-06 10·11·17장, COL-03 24장, LAY-05 28장)은 PR3 몫입니다.
  - 이미지 해상도·용량·가짜 글자(IMG-02·03·04)는 PR6 몫입니다.
  - README(STD-01)는 PR7 몫입니다.
  - fit.js TERTIARY는 PR1 몫입니다.
  - 문장 분량(TXT-10)과 29장 조사 「은」은 PR5 몫입니다.
  - JS 끔 차트(A11Y-05)는 PR3·PR4 몫입니다.
- **STD-03 'n=3' 라벨.** EVD-02(주장 라벨 보존)와 부딪쳐 남겼습니다.
- **범례·정의 18px(V8-33·V22-11·V15-28) — PR3 소유(PR7 통합 처리).** 10·13·14·17·24·26·27장 범례는 출처와 한 줄(p.chart-src)로 `<div data-chart>` 안에 있습니다(index.html 184·234·254·314·454·488·504행). 범례만 18px 이상 줄로 나누려면 차트 div 안 HTML을 고쳐야 합니다. slides.css 45행으로 `.chart-src` 전체를 20px로 올리면 EVD-03(출처 글자 ≥ 본문)·TYP-12(줄당 45자 초과) 회귀가 생겨 16px로 두었습니다. 23장(차트 div 밖)은 꼬리말 출처에 연도가 들어가면(문구, 이관 PR5) 가정 문장을 24px 본문으로 옮길 수 있습니다.

## 병합 때 할 일

- PR4의 글꼴 preload(`<head>`)를 `<link rel="preload" href="assets/fonts/DeckSansSubset.woff2" as="font" type="font/woff2" crossorigin>`로 바꿔야 합니다.
- PR3·PR4·PR5를 병합한 뒤 `presentation/`에서 `python3 scripts/font-subset.py`를 다시 돌려야 합니다. 새 글자가 부분 파일과 unicode-range에 들어가야 합니다.
- PR1 판정기 TYP-01이 Pretendard 파생 부분 파일 이름을 허용하게 해야 합니다.
- PR1 판정기 메모: LAY-04는 `.body` 상자 top만 잽니다(첫 보이는 내용으로 재야 함). CARD-05는 `::before`만 있는 요소(pseudoOnly 상자)에서 `s.split` 오류로 판정 전체가 error가 됩니다. EVD-03(출처 <20px)과 TYP-03(범례 ≥18px)은 같은 `.chart-src` 줄을 두고 서로 맞지 않습니다.
- squash 병합을 권합니다. 7c5ed46 이력에 예약 이름을 그대로 쓴 부분 파일이 남아 있습니다.

## 확인 못 한 것

- OCR(macOS Vision 전용)은 돌리지 못했습니다.
- 실제 프로젝터와 실기기는 확인하지 못했습니다. CDP 에뮬레이션만 했습니다.
- Slow 4G 글꼴 적용 시간은 CDP 근사로만 쟀습니다.
- 병합 뒤 렌더(PR3 차트 블록, PR4 controls.css·preload)는 다시 재야 합니다.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## 요약

카드를 걷어내고 **장 바탕 면**으로 34장을 다시 짰습니다. 장마다 바탕(스톤·흰·연세이지·세이지·스톤 한 단계·검정·전면 사진)을 바꾸고, 장 안에는 둥근 색 면 하나(32px, 그림자 없음)만 둡니다. 링·선·그림자 3중 테두리(--bezel)와 채운 결론 띠를 없앴고, 헤드라인은 모든 장에서 (160, 112)에 고정했습니다. 장마다 영웅 숫자 하나가 화면을 잡게 했습니다(120~144px). 색(인디고·세이지)과 모서리 체계는 그대로입니다. 장별 설계는 [`qa/pr/02/surface-plan.md`](qa/pr/02/surface-plan.md)에 있습니다.

- 배정 142건: **고침 109 · 부분 31 · 다른 PR 소유 2 · 못 고침 0**
- critical V1-01(5장 도식 13px): 고침. 도식을 카드 밖 1:1로 두고 설명 20px·노드 제목 24px로 올렸습니다. 남은 것은 fit.js의 `.chain text` 예외(PR1)와 README 기록(PR7)입니다.
- PR4가 넘긴 PR2 파일 항목도 처리했습니다.
  - **글꼴:** 덱 글자만 담은 부분 파일 `DeckSansSubset.woff2`(166KB)를 만들었습니다. OFL 예약 이름 때문에 내부 이름을 바꿨고, 원본 Pretendard와 CSS 별칭 "Deck Sans"·unicode-range로 묶었습니다.
  - 그 밖에 모션 시간·이징 토큰, 미디어 조건 밖 :hover, img 크기 속성을 고쳤습니다. RSP-02는 검토만 했고 사유를 적었습니다.
- 오케스트레이터 화면 피드백도 반영했습니다.
  - 2장: 재귀를 보여 주는 드로스테 그림을 넣었습니다.
  - 3·12·20·21장: 세로 배치와 대각 배치로 1080 높이를 씁니다.
- 맡은 파일만 바꿨습니다: `src/tokens.css`·`src/deck.css`(차트 블록 제외)·`src/slides.css`·`index.html` 본문 구조. 그 밖에 오케스트레이터 지시로 추가한 것은 다음 셋입니다.
  - `assets/fonts/DeckSansSubset.woff2`
  - `assets/fonts/DeckSansSubset-NOTICE.txt`
  - `scripts/font-subset.py`
- chart-data 블록, 차트 div 안쪽, `<head>`, `<script>`는 바이트 단위로 그대로입니다.

## 배정 위반

전체 표: [`qa/pr/02/violations.md`](qa/pr/02/violations.md)(142건 전부 + PR4 이관 항목 + 화면 피드백 표).

| 상태 | 건수 | 주요 사유 |
| --- | --- | --- |
| 고침 | 109 | 조건 전부 통과 + 렌더 눈 확인 |
| 부분 | 31 | CARD-02(장 안 색 면을 카드로 셈, 판정 이의), TYP-09·TYP-11(영웅 숫자 장), LAY-09(기준선부터 실패한 3·12·20·34장), CON-01·02(사진 위 「최악 5%」, 판정 이의), 다른 PR 파일(차트·이미지·README) |
| 다른 PR 소유 | 2 | V15-18 차트 계열 대비(PR3), V15-42 전면 사진 원본 해상도(PR6) |

## visual-qa 결과(`--compare=baseline-cloud`)

- 전체 147: **통과 60 · 실패 82 · 수동 5 · 오류 0**(수동 확인 대기 8). 기준선 통과는 29였습니다.
- 새로 통과: LAY-01, LAY-03, LAY-07, LAY-08, LAY-10, SURF-01, SURF-02, CARD-01, CARD-03, CARD-04, CARD-05, CARD-06, CARD-07, CARD-08, COL-01, COL-05, CON-05, TYP-03, TYP-04, TYP-05, TYP-06, TYP-07, TYP-08, TYP-10, TYP-13, TXT-09, IMG-06, EVD-02, NAV-11, CTL-07, PERF-01, STD-02
- 판정기가 회귀로 표시한 것은 2건입니다.
  - **TYP-01**(통과→실패, 판정 이의 — 라이선스): 판정기는 렌더 글꼴 이름이 'Pretendard Variable'이어야 통과로 본다. 그런데 Pretendard OFL의 Reserved Font Name 때문에 부분 파일(수정본)은 이름을 'Deck Sans Subset'으로 바꿔야 했다. 원본 2MB 하나로 돌아가면 TYP-01은 통과하지만 TYP-14·PERF-01이 기준선 상태로 돌아간다. 판정기(PR1)가 Pretendard 파생 부분 파일 이름을 허용해야 한다.
  - **CHT-05**(항목 17→18): 11장 차트의 「2098」 라벨이 선에 닿는다. 이 PR이 svg를 1:1(data-w px)로 그리게 하면서 축소 렌더의 반올림에 가려져 있던 겹침이 드러났다. 라벨 위치는 charts.js(PR3) 몫이고, PR3 브랜치 보고서에서는 CHT-05가 통과다.
- 앞선 실행에서 나온 SURF-05·MOT-02·PRT-01(표지)·CARD-07(2장 그림 모서리)·EVD-01·A11Y-03(20장)·LAY-09(21장) 회귀는 최종 실행 전에 고쳤습니다.
- NAV-04·MOT-10은 CPU를 나눠 쓴 전체 실행에서 한 번씩 흔들렸고, 단독으로 다시 재면 통과입니다.
- 다른 PR 몫 조건 가운데 이 PR에서 함께 줄어든 것: CTL-04 16→1, IMG-03 15→3, PRT-01 8→6, TYP-14 4→2, MOT-05 7→5, MOT-04 3→2

## qa-all 단계별 종료 코드

| 단계 | 종료 |
| --- | --- |
| build | 0 |
| render | 0 |
| check-numbers | 0(unverified 0) |
| constitution | 0(글자 크기 9 · 굵기 3 · 이징 2 · 위반 0) |
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

- **TYP-01 — 판정 이의(라이선스).** 위 회귀 설명을 보세요. Pretendard 파생 부분 파일 이름은 OFL에 따라 바꿔야 합니다.
- **CARD-02(카드 있는 장 24>10) — 판정 이의.** 오케스트레이터가 「18장처럼 면으로, 장 안에 둥근 색 면」을 지시했습니다. 그 색 면(.panel)과 표 라벨 띠(.band)를 판정기가 카드로 셉니다. 장당 1개 이하는 지켰습니다.
- **SURF-03(어두운 장 5>2, 18·19 이웃) — 지시와 충돌.** 2차 지시(사진·어두운 면 장 수를 기준선 이상으로)에 따라 6·18·19·29·34장을 유지했습니다. README 사유 기록은 PR7 몫입니다.
- **TYP-11·TYP-09(4·21장 등)** — 「장마다 영웅 숫자 하나가 화면을 잡게」 지시에 따라 큰 숫자 장이 늘었습니다. 2장(헤드라인만 있는 진술 장)과 33장의 「최대/본문」도 판정 이의입니다.
- **LAY-09(3·12·20·34장 점유율)** — 기준선부터 실패한 장이고, 항목 수는 기준선과 같습니다. 3·12·20장은 배치를 바꿔 높이를 쓰게 했지만, 점유율 계산은 글자·상자 면적이라 0.27~0.33에 머뭅니다.
- **CON-01·02(6·19장)** — 「픽셀 최악 5%」 측정이 검정 알약 위 흰 글자의 가장자리 안티에일리어싱을 셉니다. 렌더를 눈으로 보면 대비는 충분합니다(판정 이의).
- **RSP-02(1280×720 실효 12px)** — 1920 캔버스의 최소 글자를 18px로 올리면 TYP-09 이웃 크기 비(18/20=1.11)가 거의 모든 장에서 깨집니다. 덱 글자 단계와 PR3 차트 글자를 함께 바꿔야 해서 PR7 안건으로 넘깁니다.
- **2장 사진** — 쓸 수 있는 사진이 없습니다. recursion은 6장과 중복이고(IMG-06), desk에는 가짜 글자가 있습니다(IMG-02). 사진을 새로 만들지는 PR6이 판단할 일입니다.
- **다른 PR 파일:**
  - 차트 라벨·색(CHT-05, CON-03·04, LAY-05 28장, COL-03 24장)은 PR3 몫입니다.
  - 이미지 해상도·용량·가짜 글자(IMG-02·03·04)는 PR6 몫입니다.
  - README(STD-01)는 PR7 몫입니다.
  - fit.js TERTIARY(V1-01 일부)는 PR1 몫입니다.
  - 문장 분량(TXT-10)은 PR5 몫입니다.
  - JS 끔 차트(A11Y-05)는 PR3·PR4 몫입니다.

## 병합 때 할 일

- PR4의 글꼴 preload(`<head>`)를 `<link rel="preload" href="assets/fonts/DeckSansSubset.woff2" as="font" type="font/woff2" crossorigin>`로 바꿔야 합니다. 원본 PretendardVariable.woff2를 preload하면 2MB를 첫 화면에 받습니다.
- PR3·PR4·PR5를 병합한 뒤 `presentation/`에서 `python3 scripts/font-subset.py`를 다시 돌려야 합니다. 새 글자가 부분 파일과 tokens.css unicode-range에 들어가야 합니다.
- PR1 판정기 TYP-01이 Pretendard 파생 부분 파일 이름(Deck Sans Subset)을 허용하게 해야 합니다.

## 확인 못 한 것

- OCR(macOS Vision 전용)은 돌리지 못했습니다. IMG-02 가짜 글자와 480×270 쪽 번호는 눈과 크기로만 봤습니다.
- 실제 프로젝터와 실기기(휴대폰·태블릿)의 대비·글자 크기는 확인하지 못했습니다. CDP 에뮬레이션만 했습니다.
- Slow 4G 글꼴 적용 시간은 CDP 근사로만 쟀습니다(약 9초, preload 없음).
- 병합 뒤 상태는 아직 확인하지 못했습니다. PR3의 차트 블록, PR4의 controls.css·preload와 겹쳐 렌더된 결과는 병합 뒤에 다시 재야 합니다.
- 부분 파일 이름 변경이 OFL 예약 이름 조항을 충족하는지는 오케스트레이터 확인에 따랐습니다. 법률 검토는 하지 않았습니다.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

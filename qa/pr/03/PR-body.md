# PR3 · 차트 9개 문법·정직성·접근성

## ① 요약
- (2회차, 독립 검증 1회차 불합격 반영) 배정 위반 **42건 중 고침 29 · 부분 12 · 못 고침 1**. 부분 12건은 남은 부분이 모두 다른 PR 소유 파일이고(검증이 사유 타당 판정), 못 고침 1건(V1-24)은 5장 도식(PR2)이다. critical **V8-01 고침**: 13장 산점도는 세로 ±50%(점 98.4%)를 유지하고, +50% 넘는 직업 10개를 끝에 붙인 원 대신 플롯 위 바깥쪽 **위 방향 삼각 표식(▲)**과 직접 주석(「▲ +50% 넘는 직업 10개 (최대 +197.0)는 위 끝에」)으로 그린다. 1회차의 −50~+200 확장이 만든 세로 압축(N1)도 고쳤다: 주 군집 p5–p95 48px → **157.6px**(1920 렌더).
- 9개 차트 모두 svg 위 같은 자리에 '무엇·단위·기간' 제목을 둔다. 출처 줄에는 n·기간·확인일(2026-10-16)을, 차트 안에는 강조 주석 한 줄을 넣었다.
- svg는 `role="img"`이고 `<title>`·`<desc>`로 읽힌다. desc는 유형·축 범위·핵심 값을 담고 chart-data의 '설명' 필드에서 데이터 값으로 만든다. 눈금·축 글자는 aria-hidden이다.
- 차트 글자는 잉크·회색만 입는다. 점에는 바탕색 2px 고리를 두르고 막대 두께는 20(끝 둥글기 4)이다. 로그 눈금은 10배 간격이고 비교 계열은 잉크(프로젝터 모사 ΔL* 22.5)로 그린다. 점선은 뜻이 있는 계열(KDI·직급 기준선)에만 쓴다.
- (3회차) V22-39 범위 안 몫을 모두 고쳤다: 24장 주석 「…해내기 시작하는 해(추정) · 빠름 2027.9 · 기준 2028.4 · 신중 2030.4」와 교차 이름표 「2030.4 추정」, 25장 표 머리 「빠름 (추정)·기준 (추정)·신중 (추정)」, 28장 안내판 위 `poster.라벨` 한 줄과 추정 연도 알약 「2029 추정」 등. 남은 몫은 23장 영수증·26장 카드 라벨 자리·외삽 헤드라인 표현뿐(PR2/PR5).
- (3회차) 24장은 문턱 점선과 8px 안의 격자선을 그리지 않고, 1만 시간 상한에서 멈춘 선 끝에 ▲와 「▲ 1만 시간에서 멈춘 선」 주석을 둔다. 13장 출처에 확인일을 되돌리고(p5–p95 155.8px 유지) ▲끼리·▲와 점이 닿지 않게, 지시선이 다른 점을 파고들지 않게 했다. 17·10장 주석 지시선은 글자 밖에서 시작한다.
- 7장 눈금은 「1분·10분·100분·1,000분」 + 「≈17시간」, 13장 직업 이름표는 숫자만(단위는 제목 (%)), 24장은 세로 1–10,000시간으로 플롯을 넓혀 문턱 이름표가 선과 맞는다.
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
| 부분(12) | V1-15·VG-20(5장 도식 PR2), V8-42(킥커·카드·꼬리말), V8-43(카드 문구), VG-29·V8-45·V22-18(헤드라인·본문·꼬리말 표기), VG-34(.legend·fit.js), V8-35(장당 크기 위계 tokens), V15-25·V22-35(헤드라인·카드 이름), V22-39(25·28장은 고침, 23·26장 라벨 자리·헤드라인 표현은 PR2/PR5) |
| 못 고침(1) | V1-24(5장 도식, PR2) |

검증 1회차 지적(N1–N9)과 2회차 지적(V22-39 24장, N-r2-2–6) 처리 표는 violations.md '2회차'·'3회차' 절에 있다(N8 인쇄 맥락 계열은 PR4 소유로 기록).

## ③ visual-qa 결과 (`--compare=baseline-cloud`, 3회차 단독 실행)
- 전체: **통과 40** · 실패 102 · 수동 5 · 오류 0 (기준선 통과 29). 통과 → 실패로 바뀐 조건 0.
- 기준선 대비 실패 → 통과 11개: **CON-04, CHT-01, CHT-02, CHT-04, CHT-05, CHT-06, CHT-07, CHT-08, CHT-09, CHT-11, CHT-12**
- 항목이 줄어든 조건: CON-03 7→3(남은 것 5장 도식), TYP-02 7→2(5장 도식), TXT-08 33→30, TYP-10 298→279, TYP-03 120→119, COL-05 33→31
- 도구 회귀 2 = **CHT-10·EVD-01**, 둘 다 판정 이의이고 독립 검증 1회차가 타당 판정(판정기 결함 후보 J1·J2). EVD-01 13장 항목은 검증 지시 (가)(±50 + 삼각 표식)를 따른 결과다. **판정 이의를 빼면 회귀 0.** NAV-04·MOT-10은 이번 실행에서 통과.
- 맡은 조건 가운데 남은 실패(CARD-07·TYP-03·TYP-09·TYP-13·TXT-04·TXT-08·EVD-02·EVD-04)는 모두 차트 밖 요소(5장 도식·킥커·태그·카드·헤드라인·꼬리말)로 다른 PR 소유다.

## ④ qa-all 단계별 종료 코드
| 단계 | 종료 | 비고 |
| --- | --- | --- |
| build | 0 | |
| render | 0 | issues는 5장 도식 tiny 12건만, 기준선과 같음 |
| check-numbers | 0 | unverified [] |
| constitution | 0 | 글자 크기 9 · 굵기 3 · 위반 0 |
| token-check | 1 | off-token space 27건, 기준선과 같음(전부 차트 블록 밖). 이 PR 추가 0 |
| visual-qa | 1 | 남은 실패가 있어 정상. 다른 작업자 부하로 qa-all 안 실행이 외부 종료(143)된 적이 있어 2회차 최종은 단계별로 따로 돌렸다 |

## ⑤ before / after (1920×1080)
바뀐 장은 7 · 10 · 11 · 13 · 14 · 17 · 24 · 25 · 26 · 27 · 28장이다(25장은 2회차에 표 머리 '(추정)'이 더해짐). 나머지 장은 기준선 PNG와 픽셀 차 0이다.

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
| 25 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/before/slide-25.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/charts/03-grammar/qa/pr/03/after/slide-25.jpg) |
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
- 독립 검증: 1회차(verify-r1.md)·2회차(verify-r2.md) 불합격 지적을 모두 반영했다. 3회차 검증은 아직이다.
- 비교 시트 칸 제목의 한글이 이 환경 글꼴(DejaVu)에서 네모로 나온다(scripts/contact-sheet.py, PR1 소유). 장 순서는 7·10·11·13·14·17 / 24·26·27·28이다.
- hover 툴팁·표 보기(dataviz 권장)는 발표 덱이라 넣지 않았다. 대신 desc가 핵심 값을 글로 갖는다.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

구현 143/147 조건 (automated·both 142개 중 142개 자동 판정, visual 5개 중 1개 부분 자동·4개 수동) · 통과 29 · 실패 114 · 수동 4 · 오류 0

# 시각 QA 보고서 — baseline

## critical 위반을 잡은 조건

1회차 감사(violations.md)의 critical 4건이 이 검사기의 어느 조건 id로 실패 판정됐는지. '잡은 조건'은 그 위반의 장에서 실패 항목을 낸 조건이다.

| 위반 | 장 | 잡은 조건 | 이번 판정 | 근거(측정값) |
| --- | --- | --- | --- | --- |
| VG-01 | 전체 | NAV-01, NAV-02, CTL-01 | NAV-01 실패 · NAV-02 실패 · CTL-01 실패 | NAV-01: 왼쪽으로 80px(Δy 10): 장 5→5 (Δ0, 기대 +1) / NAV-01: 오른쪽으로 80px: 장 5→5 (Δ0, 기대 -1) / NAV-02: 390x844 터치: 이전·다음 버튼 없음(다음 0, 이전 0) / NAV-02: 1440x900 마우스: 이전·다음 버튼 없음(다음 0, 이전 0) |
| VG-07 | 전체 | ONB-03, RSP-02 | ONB-03 실패 · RSP-02 실패 | ONB-03: 390x844 세로: 회전 안내·세로 읽기 모드 없음 / ONB-03: 375x812 세로: 회전 안내·세로 읽기 모드 없음 / RSP-02: 1장 1280×720 최소 실효 글자 9.33px(<12): span "데이터리터러시의이해 중간고사 과제" / RSP-02: 2장 1280×720 최소 실효 글자 10.67px(<12): span.source.credit "사진: AI 생성 이미지(Gemini) · 이처럼 " |
| V1-01 | 5 | TYP-03, LAY-06, STD-01 | TYP-03 실패 · LAY-06 실패 · STD-01 실패 | TYP-03: 5장 14px 3차 정보 아님: div.kicker.t-stagger-line "전체 구조" / TYP-03: 5장 12.97px(<14): text.n-s "학습 연산 연 4.1배" (svg 축소 0.811) / LAY-06: 5장 작은 글자(fit): 12개 — svg "연산과 전력에서 AI 능력, AI 개발 가속" text.n-s "학습 연산 연 4.1배" 축소 0.81 → 글자 13.0px (예외 목록 .chain text에 있어도 14px 미만) / LAY-06: 5장 svg chain 축소 배율 0.811(<0.9) |
| V8-01 | 13 | CHT-02, CHT-07, EVD-01 | CHT-02 실패 · CHT-07 실패 · EVD-01 실패 | CHT-02: 13장 occ_scatter n기간 없음 / CHT-02: 13장 occ_scatter 세로 범위를 넘은 점 10개를 끝에 붙여 그렸는데 표식·주석 없음 / CHT-07: 13장 occ_scatter 범위 밖 10개 점이 축 끝(y=441.4)에 실제 값처럼 그려짐(끝선 위 점 10개, 다른 모양·표시 없음) / EVD-01: 13장 occ_scatter 세로 범위 밖 값 10개가 축 끝값으로 그려져 그림 위치가 데이터 값과 다름 |

## 실행

- 실행: 2026-10-16T09:05:53.560Z · 커밋 da07164 · 덱 해시 a2bf7b988014 · 305초
- 명령: `cd presentation && bun scripts/visual-qa.ts --label baseline` · 파이썬 `<tmp>/sam-env/bin/python`
- 스크린샷 링크(`../shots/<label>/`)는 커밋하지 않는다(.gitignore). 같은 명령으로 다시 만든다. 기준선 장 렌더는 커밋된 `qa/before/slide-NN.jpg`와 같다
- 이 환경에 없는 도구: axe-core · Lighthouse · tesseract → 해당 조건은 직접 잰 근사로 판정하고 '부분' 표시(아래 조건별 메모). OCR은 tesseract 대신 macOS Vision(scripts/ocr_vision.swift)으로 IMG-02·RSP-02를 판정

## 조건별 결과

| 조건 | 방식 | 구현 | 판정 | 실패한 장 | 첫 항목 |
| --- | --- | --- | --- | --- | --- |
| [LAY-01](#lay-01) | automated | 자동 | 실패 | 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34 | .headline 시작 (160, 170) ≠ (160, 112) |
| [LAY-02](#lay-02) | automated | 자동 | 통과 |  |  |
| [LAY-03](#lay-03) | automated | 자동 | 실패 | 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34 | 열 시작점 밖 글 덩어리 4개: span "주제 설명과 데이터분석 계획 · 2026-10-16" x=1522.2 · div.kicker "AI가 AI 개발을 돕기 시작한 뒤의 10년" x=176 · span.pill |
| [LAY-04](#lay-04) | automated | 자동 | 실패 | 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29, 33, 34 | token-check space 27건(src/deck.css:29  space  16px  (padding) · src/deck.css:48  space  32px  (padding) · src/deck.css:1 |
| [LAY-05](#lay-05) | automated | 자동 | 실패 | 28 | 병렬 항목 6개(>5): div.poster "텔레마케터·상담이미 감소2023년부터 실측 · 미국" |
| [LAY-06](#lay-06) | automated | 자동 | 실패 | 5, 10, 11, 17 | 작은 글자(fit): 12개 — svg "연산과 전력에서 AI 능력, AI 개발 가속" text.n-s "학습 연산 연 4.1배" 축소 0.81 → 글자 13.0px (예외 목록 .chain text에 있어도 14p |
| [LAY-07](#lay-07) | both | 자동+수동 | 실패 | 4, 8, 11, 12, 13, 14, 15, 16, 17, 21, 22, 23, 24, 25, 26, 27 | 3·4장 배치 서명 같음: 160:1600:3 |
| [LAY-08](#lay-08) | automated | 자동 | 실패 | 4, 9, 10, 11, 13, 14, 15, 16, 17, 20, 21, 22, 25, 26, 27, 32, 33 | div.tiles "105일AI가 맡을 수 있는 업무 크기가 두 배로 " 같은 행 형제 폭 579/463 · 높이 534/470/406 |
| [LAY-09](#lay-09) | both | 자동+수동 | 실패 | 3, 12, 20, 34 | 콘텐츠 점유율 0.33(0.35~0.85 밖) |
| [LAY-10](#lay-10) | automated | 자동 | 실패 | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34 | 헤드라인이 DOM 첫 텍스트가 아님(킥커·표지 띠가 앞섬) |
| [SURF-01](#surf-01) | automated | 자동 | 실패 | 3, 4, 22, 23, 26, 27 | 1·2·3장 같은 면 #f4f2ef |
| [SURF-02](#surf-02) | automated | 자동 | 실패 | 덱 전체 | 바탕 면 2종(<3): #f4f2ef×32, #171512×2 |
| [SURF-03](#surf-03) | both | 자동+수동 | 실패 | 19 | 어두운 장 5(>2): 6, 18, 19, 29, 34 |
| [SURF-04](#surf-04) | automated | 자동 | 통과 |  |  |
| [SURF-05](#surf-05) | automated | 자동 | 통과 |  |  |
| [SURF-06](#surf-06) | automated | 자동 | 실패 | 덱 전체 | meta color-scheme=light 없음 |
| [CARD-01](#card-01) | automated | 자동 | 실패 | 3, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 21, 22, 24, 25, 26, 27, 28, 29, 30, 32, 33 | 경계 있는 상자 4개(>1): div.card · div.card · div.card.accent |
| [CARD-02](#card-02) | both | 자동+수동 | 실패 | 덱 전체 | class에 card가 든 요소 41개(>16, before 40) |
| [CARD-03](#card-03) | automated | 자동 | 실패 | 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 17, 18, 19, 21, 24, 25, 26, 28, 29, 30, 31, 32, 33, 34 | 폭 1600px(>960) 카드: div.sowe.t-stagger-line |
| [CARD-04](#card-04) | automated | 자동 | 실패 | 9 | 같은 크기 카드 3개 이상 한 줄인 장 4(>2): 3, 8, 9, 29 |
| [CARD-05](#card-05) | automated | 자동 | 실패 | 1, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 21, 22, 24, 25, 26, 27, 29, 30, 31, 32, 33 | 그림자 요소 3개(>1) |
| [CARD-06](#card-06) | automated | 자동 | 실패 | 23 | 한쪽만 굵은 띠(0/0/4/0): span.d |
| [CARD-07](#card-07) | automated | 자동 | 실패 | 3, 4, 5, 8, 9, 17, 21, 24, 29, 30, 33, 34 | 모서리/짧은 변 0.3(>0.2): div.sowe.t-stagger-line r24 |
| [CARD-08](#card-08) | automated | 자동 | 실패 | 3, 4, 5, 8, 17, 21, 24, 29, 33, 34 | 결론 띠 배경 rgba(239,242,252,1) ≠ 장 바탕 rgba(244,242,239,1) |
| [COL-01](#col-01) | automated | 자동 | 실패 | 4, 6, 9, 29 | 토큰 밖 계산 색 background rgba(20,18,16,0.08) — 장 4 |
| [COL-02](#col-02) | automated | 자동 | 통과 |  |  |
| [COL-03](#col-03) | automated | 자동 | 실패 | 1, 3, 4, 5, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27, 30, 33 | 인디고 요소 4개(>2, svg는 1로 셈) |
| [COL-04](#col-04) | both | 자동+수동 | 통과 |  |  |
| [COL-05](#col-05) | automated | 자동 | 실패 | 1, 3, 7, 8, 10, 11, 12, 13, 14, 15, 17, 20, 21, 22, 25, 26, 27, 29, 33 | 18px 이상 글자 중 회색 비율 62%(>50%) |
| [CON-01](#con-01) | automated | 부분 | 실패 | 6, 9, 18, 19 | 대비 3.32:1 < 4.5 — div.kicker.t-stagger-line "재귀적 자기개선 · 지금 보이는 신호" 14px 600 (픽셀 최악 5%) |
| [CON-02](#con-02) | automated | 자동 | 실패 | 6, 9, 18, 19 | 사진 위 글자 최악 5% 대비 3.32:1 < 4.5 — div.kicker.t-stagger-line "재귀적 자기개선 · 지금 보이는 신호" |
| [CON-03](#con-03) | automated | 부분 | 실패 | 5, 10, 13, 17, 26 | agi_forecast_shift circle.b-neutral #cac7c2 대비 1.69:1(<3) — 9개 중 3개 직접 라벨 없음 |
| [CON-04](#con-04) | both | 자동+수동 | 실패 | 11, 17, 24, 26 | espai_two_clocks 프로젝터 모사 인접 계열 ΔL* 8.1(<15) |
| [CON-05](#con-05) | visual | 자동+수동 | 실패 | 1, 7, 13, 17 | forced-colors에서 라벨 알약 3/3개 경계 없음(테두리·외곽선 0, 바탕·그림자는 지워짐): div.kicker, span.pill, span.pill.on |
| [GRAD-01](#grad-01) | automated | 자동 | 통과 |  |  |
| [GRAD-02](#grad-02) | both | 자동+수동 | 통과 |  |  |
| [GRAD-03](#grad-03) | automated | 자동 | 통과 |  |  |
| [TYP-01](#typ-01) | automated | 자동 | 통과 |  |  |
| [TYP-02](#typ-02) | automated | 자동 | 실패 | 5, 7, 10, 17, 24 | svg 축소로 프리셋 밖 실효 크기 19.5px — 장 5,14,27 |
| [TYP-03](#typ-03) | automated | 자동 | 실패 | 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34 | 14px 3차 정보 아님: span "데이터리터러시의이해 중간고사 과제" |
| [TYP-04](#typ-04) | automated | 자동 | 실패 | 3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 29, 30, 32, 33 | 본문 문단 20px(<24) 3개: p "AI가 맡을 수 있는 업무 크기가 두 배가 되는 데" |
| [TYP-05](#typ-05) | automated | 자동 | 실패 | 1 | 3줄 이상 행간 비 <1.2: h1.t "AI는 언제쯤내 일을대신하게 될까요" 1.1 |
| [TYP-06](#typ-06) | automated | 자동 | 실패 | 덱 전체 | deck.css에 text-overflow: ellipsis |
| [TYP-07](#typ-07) | automated | 자동 | 실패 | 1, 4, 9, 13, 15, 17, 19, 27, 29, 30, 31, 32 | 고아 줄 '추정했습니다.'(7자): p.s "AI가 맡을 수 있는 일이 얼마나 빨리 커지는지 그" |
| [TYP-08](#typ-08) | automated | 자동 | 실패 | 1 | 헤드라인 3줄(>2): "AI는 언제쯤내 일을대신하게 될까요" |
| [TYP-09](#typ-09) | automated | 자동 | 실패 | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34 | 이웃 크기 비 1.14(<1.15): 16/14 |
| [TYP-10](#typ-10) | automated | 자동 | 실패 | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34 | 16px 이하 음수 자간 -0.014em: span "데이터리터러시의이해 중간고사 과제" |
| [TYP-11](#typ-11) | automated | 자동 | 실패 | 4, 12, 16, 18, 19, 21, 23, 31, 32, 34 | 80px 이상 숫자 3개: 105 · 3.5 · 94 |
| [TYP-12](#typ-12) | automated | 자동 | 실패 | 1, 6, 7, 10, 11, 13, 17, 21, 22, 23, 24, 26 | 80px 문장 3줄: h1.t "AI는 언제쯤내 일을대신하게 될까요" |
| [TYP-13](#typ-13) | automated | 자동 | 실패 | 1, 5 | 헤드라인 안 꾸밈(color): span.hl "대신하게 될까요" |
| [TYP-14](#typ-14) | automated | 자동 | 실패 | 덱 전체 | font-display: block |
| [TXT-01](#txt-01) | automated | 자동 | 실패 | 16, 22 | 제목류 쉼표·콜론: th "모형(2023→2025 고용 변화, 743개 직업)" |
| [TXT-02](#txt-02) | automated | 자동 | 실패 | 5, 31 | '~다'로 끝남: "이 로봇 데이터가 쌓이는 만큼 늦게 현장 일로 넘어간다" |
| [TXT-03](#txt-03) | both | 자동+수동 | 실패 | 12 | 금지 표현: the future of |
| [TXT-04](#txt-04) | both | 자동+수동 | 실패 | 7, 8, 10, 11, 14, 15, 16, 18, 20, 21, 24, 25, 26, 27 | 화면 snake_case: benchmark_results_1_1, timeline_analysis |
| [TXT-05](#txt-05) | both | 자동+수동 | 실패 | 6, 9, 25, 28, 30, 34 | 같은 숫자 3회 이상: 2026×4 |
| [TXT-06](#txt-06) | both | 자동+수동 | 실패 | 7, 13, 14, 17, 27 | 차트 장 헤드라인에 숫자 없음: "AI가 맡을 수 있는 업무는 갈수록 빠르게 커집니다" |
| [TXT-07](#txt-07) | automated | 자동 | 통과 |  |  |
| [TXT-08](#txt-08) | automated | 부분 | 실패 | 4, 6, 7, 9, 11, 13, 17, 18, 19, 27, 28, 34 | em dash 3개(>2) |
| [TXT-09](#txt-09) | automated | 자동 | 실패 | 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34 | 알약 kicker "AI가 AI 개발을 돕기 시작한 뒤의 10년" |
| [TXT-10](#txt-10) | automated | 자동 | 실패 | 6, 23, 25, 28, 29, 30, 31, 34 | 본문 255자(>220) |
| [TXT-11](#txt-11) | visual | 수동 | 수동 |  |  |
| [IMG-01](#img-01) | automated | 자동 | 통과 |  |  |
| [IMG-02](#img-02) | both | 자동+수동 | 실패 | 2, 9 | openai-livestream-thumb.jpg 안 글자 'OpenAl Update'(Vision 확신도 1, 원본 (746, 334) 463×67) |
| [IMG-03](#img-03) | automated | 자동 | 실패 | 1, 2, 6, 9, 18, 19, 22 | cover.jpg width·height 속성 없음 |
| [IMG-04](#img-04) | automated | 자동 | 실패 | 덱 전체 | desk.jpg 305KB(>300) |
| [IMG-05](#img-05) | both | 자동+수동 | 통과 |  |  |
| [IMG-06](#img-06) | automated | 자동 | 실패 | 6, 18 | assets/img/entry.jpg 2장에서 재사용: 1,18 |
| [IMG-07](#img-07) | visual | 수동 | 수동 |  |  |
| [CHT-01](#cht-01) | automated | 자동 | 실패 | 7, 10, 11, 13, 14, 17, 24, 26, 27 | metr_horizon 차트 제목 0개 |
| [CHT-02](#cht-02) | both | 자동+수동 | 실패 | 7, 10, 11, 13, 14, 17, 24, 26, 27 | metr_horizon n기간 없음 |
| [CHT-03](#cht-03) | automated | 자동 | 통과 |  |  |
| [CHT-04](#cht-04) | both | 자동+수동 | 실패 | 26 | proj_kr_jobs 같은 색·같은 점선·같은 굵기 계열 쌍(l-neutral, l-neutral) |
| [CHT-05](#cht-05) | both | 자동+수동 | 실패 | 10, 11, 13, 17 | agi_forecast_shift 글자 겹침 "2042" ↔ "전문가 설문 (HLMI)" 5px² |
| [CHT-06](#cht-06) | automated | 자동 | 실패 | 7, 10, 11, 13, 14, 17, 26, 27 | metr_horizon 점 바탕색 고리 없음 ×16 |
| [CHT-07](#cht-07) | automated | 자동 | 실패 | 13 | occ_scatter 범위 밖 10개 점이 축 끝(y=441.4)에 실제 값처럼 그려짐(끝선 위 점 10개, 다른 모양·표시 없음) |
| [CHT-08](#cht-08) | automated | 자동 | 실패 | 7, 10, 11, 13, 14, 17, 24, 26, 27 | metr_horizon 차트 글자 색 rgb(76, 94, 178)(잉크·회색 밖) |
| [CHT-09](#cht-09) | both | 자동+수동 | 통과 |  |  |
| [CHT-10](#cht-10) | automated | 자동 | 실패 | 11 | 연속 차트 장 10·11 축 범위 다름: 세로 2020~2070 · 가로 2016~2027 / 세로 2030~2170 · 가로 2016~2025 |
| [CHT-11](#cht-11) | automated | 자동 | 실패 | 7, 10, 11, 13, 14, 17, 24, 26, 27 | metr_horizon 설명 숫자 1개(<2): "AI가 맡을 수 있는 업무 크기 (METR 50% 시간지평)" |
| [CHT-12](#cht-12) | automated | 자동 | 실패 | 덱 전체 | charts.js:104 하드코딩 숫자 배열: for (const t of [0, 0.25, 0.5, 0.75, 1]) svg.append(el("text", { class: "alab",  |
| [CHT-13](#cht-13) | automated | 자동 | 통과 |  |  |
| [EVD-01](#evd-01) | automated | 자동 | 실패 | 13 | occ_scatter 세로 범위 밖 값 10개가 축 끝값으로 그려져 그림 위치가 데이터 값과 다름 |
| [EVD-02](#evd-02) | automated | 자동 | 실패 | 4 | 라벨 "n=3"와 가장 가까운 숫자 127px(>64) |
| [EVD-03](#evd-03) | automated | 자동 | 실패 | 1, 2, 3, 5, 6, 8, 9, 14, 15, 16, 19, 21, 29, 30, 31, 32, 33, 34 | 출처에 연도 없음: "사진: AI 생성 이미지(Gemini) · 모든 수치에 출처와 라벨(기술" |
| [EVD-04](#evd-04) | both | 자동+수동 | 실패 | 3, 21, 23, 26, 32, 34 | 2036 외삽 장에 한계 문구 없음 |
| [EVD-05](#evd-05) | automated | 자동 | 실패 | 33 | 4장 핵심 수치 "105"가 33장에 없음 |
| [EVD-06](#evd-06) | automated | 자동 | 통과 |  |  |
| [NAV-01](#nav-01) | automated | 자동 | 실패 | 덱 전체 | 왼쪽으로 80px(Δy 10): 장 5→5 (Δ0, 기대 +1) |
| [NAV-02](#nav-02) | automated | 자동 | 실패 | 덱 전체 | 390x844 터치: 이전·다음 버튼 없음(다음 0, 이전 0) |
| [NAV-03](#nav-03) | automated | 자동 | 통과 |  |  |
| [NAV-04](#nav-04) | automated | 자동 | 통과 |  |  |
| [NAV-05](#nav-05) | automated | 자동 | 실패 | 덱 전체 | 390x844 터치: 이전·다음 버튼이 없어 비활성 모양을 확인할 수 없음 |
| [NAV-06](#nav-06) | automated | 자동 | 실패 | 덱 전체 | #1에서 location.hash='#12' 후 장 1(hashchange 처리 없음) |
| [NAV-07](#nav-07) | automated | 자동 | 실패 | 덱 전체 | history.back() 후 about:blank(기대 3장) |
| [NAV-08](#nav-08) | automated | 자동 | 실패 | 덱 전체 | 무대에서 Esc가 개요를 엶 |
| [NAV-09](#nav-09) | automated | 자동 | 실패 | 덱 전체 | 개요 제목('전체 34장') 없음 |
| [NAV-10](#nav-10) | automated | 자동 | 실패 | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34 | 섹션명 없음 |
| [NAV-11](#nav-11) | automated | 자동 | 실패 | 9, 34 | 밑줄·↗ 없음: "영상 · OpenAI 라이브(2025-10-28)7분 " |
| [NAV-12](#nav-12) | automated | 자동 | 실패 | 덱 전체 | 미지원 환경에서 F 후 오류: unhandled rejection: TypeError: Fullscreen API is not supported |
| [CTL-01](#ctl-01) | automated | 자동 | 실패 | 34 | 375x812 덱 안 링크 30×5(<44): a "자료조사 research" |
| [CTL-02](#ctl-02) | automated | 자동 | 실패 | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34 | 1920x1080: button.replay-btn ↔ span.pg "1 / 34" 215px² |
| [CTL-03](#ctl-03) | automated | 자동 | 실패 | 덱 전체 | 포인터 3초 정지 후 컨트롤 불투명도 1(>0.2) |
| [CTL-04](#ctl-04) | automated | 자동 | 실패 | 덱 전체 | :active 없음: a.c3.video.t-stagger-line "영상 · OpenAI 라이브(2025-10-28)7" |
| [CTL-05](#ctl-05) | automated | 자동 | 실패 | 덱 전체 | 강조(인디고) 버튼 0개(다음 장 하나여야 함) |
| [CTL-06](#ctl-06) | automated | 자동 | 실패 | 덱 전체 | meta viewport에 viewport-fit=cover 없음: <meta name="viewport" content="width=device-width, initial-scale=1"> |
| [CTL-07](#ctl-07) | automated | 자동 | 실패 | 덱 전체 | 누를 수 없는 요소의 :hover: .poster .it:hover (6개) |
| [ONB-01](#onb-01) | automated | 자동 | 실패 | 덱 전체 | 첫 방문 조작 안내 없음 |
| [ONB-02](#onb-02) | automated | 자동 | 실패 | 덱 전체 | 390x844 터치 화면에 키 표기: (R) |
| [ONB-03](#onb-03) | both | 자동+수동 | 실패 | 덱 전체 | 390x844 세로: 회전 안내·세로 읽기 모드 없음 |
| [ONB-04](#onb-04) | automated | 자동 | 통과 |  |  |
| [RSP-01](#rsp-01) | both | 자동+수동 | 통과 |  |  |
| [RSP-02](#rsp-02) | automated | 자동 | 실패 | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34 | 1280×720 최소 실효 글자 9.33px(<12): span "데이터리터러시의이해 중간고사 과제" |
| [RSP-03](#rsp-03) | both | 자동+수동 | 통과 |  |  |
| [RSP-04](#rsp-04) | automated | 자동 | 실패 | 덱 전체 | 첫 페인트에 가로 스크롤 |
| [MOT-01](#mot-01) | automated | 자동 | 통과 |  |  |
| [MOT-02](#mot-02) | automated | 자동 | 실패 | 7, 10, 11, 13, 17, 24, 26 | 글줄 등장 1220ms(>1000) |
| [MOT-03](#mot-03) | automated | 자동 | 실패 | 3 | 이미 본 3장으로 돌아온 50ms 뒤 흐린 글줄 4/4(다시 재생됨) |
| [MOT-04](#mot-04) | automated | 자동 | 실패 | 덱 전체 | overshoot 이징 cubic-bezier(0.34, 1.45, 0.64, 1) |
| [MOT-05](#mot-05) | automated | 자동 | 실패 | 덱 전체 | slides.css:14 토큰 밖 시간 값 1600ms |
| [MOT-06](#mot-06) | automated | 자동 | 실패 | 덱 전체 | 모션 감소에서 장 사이 전환 none 0s(opacity 150~200ms 페이드 기대) |
| [MOT-07](#mot-07) | automated | 자동 | 실패 | 덱 전체 | 표지 30초 동안 사진 교차 5회(>2) |
| [MOT-08](#mot-08) | both | 자동+수동 | 실패 | 2, 4, 8, 12, 18, 19, 21, 23 | 등장 순서가 읽기 순서와 어긋남 1곳 |
| [MOT-09](#mot-09) | both | 자동+수동 | 실패 | 덱 전체 | design-standard에 모션 목록 절 없음 |
| [MOT-10](#mot-10) | automated | 자동 | 통과 |  |  |
| [MOT-11](#mot-11) | automated | 자동 | 실패 | 7 | 탭 복귀 100ms 뒤 차트 빌드 169/2290ms — 반쯤 그려진 채로 보임(3121ms 뒤 2290ms) |
| [A11Y-01](#a11y-01) | automated | 자동 | 실패 | 덱 전체 | 현재 장이 아닌데 inert·aria-hidden 아닌 장 33/33 |
| [A11Y-02](#a11y-02) | automated | 자동 | 실패 | 덱 전체 | aria-live=polite 영역 없음 |
| [A11Y-03](#a11y-03) | automated | 자동 | 실패 | 2, 4, 8, 11, 12, 13, 14, 15, 16, 18, 19, 21, 26 | h1·h2 0개(1 기대) — nohead 장은 숨긴 heading 필요 |
| [A11Y-04](#a11y-04) | automated | 부분 | 실패 | 6, 9, 18, 19 | color-contrast: 대비 3.32:1 < 4.5 — div.kicker.t-stagger-line "재귀적 자기개선 · 지금 보이는 신호" 14px 600 (픽셀 최악 5%) |
| [A11Y-05](#a11y-05) | automated | 자동 | 실패 | 덱 전체 | JS 끔: 빈 차트 9(metr_horizon, agi_forecast_shift, espai_two_clocks, occ_scatter, occ_quintile, kr_occupation_index, proj_ca |
| [A11Y-06](#a11y-06) | automated | 자동 | 통과 |  |  |
| [PERF-01](#perf-01) | automated | 부분 | 실패 | 덱 전체 | LCP 7740ms(>2500) |
| [PERF-02](#perf-02) | automated | 자동 | 통과 |  |  |
| [PERF-03](#perf-03) | automated | 자동 | 통과 |  |  |
| [PERF-04](#perf-04) | automated | 자동 | 통과 |  |  |
| [META-01](#meta-01) | automated | 자동 | 실패 | 덱 전체 | description 없음 |
| [META-02](#meta-02) | automated | 자동 | 실패 | 덱 전체 | favicon(link rel=icon) 없음 |
| [PRT-01](#prt-01) | both | 자동+수동 | 실패 | 7, 10, 11, 17, 24, 26 | print 미디어(CSS만)에서 흐린 글줄 149 |
| [PRT-02](#prt-02) | automated | 자동 | 통과 |  |  |
| [STD-01](#std-01) | both | 자동+수동 | 실패 | 덱 전체 | 34장 역할 표 행 0(<34) |
| [STD-02](#std-02) | automated | 자동 | 실패 | 덱 전체 | token-check --strict 종료 1: off-token: 27 (space 27) |
| [STD-03](#std-03) | automated | 자동 | 실패 | 4, 9, 10, 12, 21 | .tag @sage 계산 스타일 2종 — 이 장 [600 \| 14px \| 20px \| rgb(64, 77, 47) \| rgba(20, 18, 16, 0.06) \| 0px \| 12px \| 999px] ≠ 다수 [600 |
| [STD-04](#std-04) | automated | 자동 | 통과 |  |  |
| [STD-05](#std-05) | visual | 수동 | 수동 |  |  |
| [STD-06](#std-06) | visual | 수동 | 수동 |  |  |
| [STD-07](#std-07) | both | 자동+수동 | 실패 | 덱 전체 | README 검증 표 6/6행에 실행 로그(qa/ 경로) 없음 |

## 조건별 상세

### LAY-01

실패 · 레이아웃·틀 고정 · automated · 구현 auto

> 내용 장(제목 있는 장)의 .headline 시작 좌표, .foot 위치, .pg 오른쪽 끝이 34장에서 같다. 표지·nohead·전면 장은 유형별로 고정하고 예외 목록을 design-standard README에 둔다  
> 기준: 내용 장: .headline left=160px·top=112px(±0px), .foot bottom=1016px(±1px), .pg right 편차 0px. 예외 장은 README 목록과 일치

실패 33건 · 장 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34

- 3장 · .headline 시작 (160, 170) ≠ (160, 112)
- 4장 · .headline 시작 (160, 170) ≠ (160, 112)
- 5장 · .headline 시작 (160, 170) ≠ (160, 112)
- 7장 · .headline 시작 (160, 170) ≠ (160, 112)
- 8장 · .headline 시작 (160, 170) ≠ (160, 112)
- 9장 · .headline 시작 (160, 170) ≠ (160, 112)
- 10장 · .headline 시작 (160, 170) ≠ (160, 112)
- 11장 · .headline 시작 (160, 170) ≠ (160, 112)
- 12장 · .headline 시작 (160, 170) ≠ (160, 112)
- 13장 · .headline 시작 (160, 170) ≠ (160, 112)
- 14장 · .headline 시작 (160, 170) ≠ (160, 112)
- 15장 · .headline 시작 (160, 170) ≠ (160, 112)
- 16장 · .headline 시작 (160, 170) ≠ (160, 112)
- 17장 · .headline 시작 (160, 170) ≠ (160, 112)
- 20장 · .headline 시작 (160, 170) ≠ (160, 112)
- 21장 · .headline 시작 (160, 170) ≠ (160, 112)
- 22장 · .headline 시작 (160, 170) ≠ (160, 112)
- 23장 · .headline 시작 (160, 170) ≠ (160, 112)
- 24장 · .headline 시작 (160, 170) ≠ (160, 112)
- 25장 · .headline 시작 (160, 170) ≠ (160, 112)
- 26장 · .headline 시작 (160, 170) ≠ (160, 112)
- 27장 · .headline 시작 (160, 170) ≠ (160, 112)
- 28장 · .headline 시작 (160, 170) ≠ (160, 112)
- 29장 · .headline 시작 (160, 170) ≠ (160, 112)
- 30장 · .headline 시작 (160, 170) ≠ (160, 112)
- … 외 8건(JSON 보고서에 전부)

- 메모: 예외 장(표지·nohead·bleed)은 내용 장 틀(헤드라인 160·112, .foot 1016, .pg 오른쪽 최빈값)과 비교하고, 다르면 README에 그 유형이 '예외'로 적혀 있는지 본다

근거: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-05.jpg](../shots/baseline/slide-05.jpg) · [slide-06.jpg](../shots/baseline/slide-06.jpg) · [slide-07.jpg](../shots/baseline/slide-07.jpg)

### LAY-02

통과 · 레이아웃·안전 영역 · automated · 구현 auto

> 전면 사진을 뺀 모든 텍스트와 차트 라벨은 캔버스 안전 영역 안에 있다  
> 기준: 모든 텍스트 bbox가 x∈[80,1840], y∈[64,1016] 안. 위반 0건(전면 이미지 클래스 제외)

### LAY-03

실패 · 레이아웃·격자 · automated · 구현 auto

> 글 덩어리의 왼쪽 가장자리는 12열(거터 48) 열 시작점에만 놓고, 한 장의 고유 왼쪽 x는 3개 이하다  
> 기준: 열 시작점과 ±1px 밖 요소 0건(풀블리드 예외 목록 제외). 장별 고유 left 수 ≤3

실패 59건 · 장 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34

- 1장 · 열 시작점 밖 글 덩어리 4개: span "주제 설명과 데이터분석 계획 · 2026-10-16" x=1522.2 · div.kicker "AI가 AI 개발을 돕기 시작한 뒤의 10년" x=176 · span.pill "AI가 맡는 업무 크기 105일마다 2배" x=184
- 1장 · 고유 왼쪽 x 5개(>3): 160, 1522, 176, 184, 519
- 2장 · 열 시작점 밖 글 덩어리 4개: span.t-stagger-line "다음 AI를 만드는 데" x=256 · span.t-stagger-line "AI를 쓰기 시작했고" x=352 · span.t-stagger-line "그 뒤로 발전 속도가" x=448
- 2장 · 고유 왼쪽 x 5개(>3): 160, 256, 352, 448, 544
- 3장 · 열 시작점 밖 글 덩어리 8개: div.kicker.t-stagger-line "이 발표가 답하려는 것" x=176 · h3 "AI는 얼마나 빨리 강해지고 있나" x=208 · p "AI가 맡을 수 있는 업무 크기가 두 배가 되는 데" x=208
- 3장 · 고유 왼쪽 x 6개(>3): 176, 160, 208, 757, 1307, 371
- 4장 · 열 시작점 밖 글 덩어리 12개: div.kicker.t-stagger-line "결론 먼저" x=176 · span.t-digit-group "105" x=208 · div.k "AI가 맡을 수 있는 업무 크기가 두 배로 느는 데" x=208
- 4장 · 고유 왼쪽 x 10개(>3): 176, 160, 208, 581, 835, 894, 1345, 1365
- 5장 · 열 시작점 밖 글 덩어리 2개: div.kicker.t-stagger-line "전체 구조" x=176 · div.sowe.t-stagger-line "읽는 법컴퓨터 속 AI와 로봇을 따로 보지 않습니다" x=263.7
- 7장 · 열 시작점 밖 글 덩어리 4개: div.kicker.t-stagger-line "AI 발전 속도 · 관계식 R1" x=176 · p.chart-sub "세로축은 AI가 절반 이상 성공하는 과제를 사람이 " x=208 · p.chart-src "METR Time Horizon 1.1 원본 YAM" x=208
- 7장 · 고유 왼쪽 x 4개(>3): 176, 160, 208, 664
- 8장 · 열 시작점 밖 글 덩어리 12개: div.kicker.t-stagger-line "AI 발전 속도 · 관계식 R1" x=176 · span.t-digit-group "188" x=208 · span.unit "일" x=318.8
- 8장 · 고유 왼쪽 x 10개(>3): 176, 160, 208, 319, 757, 866, 1307, 1418
- 9장 · 열 시작점 밖 글 덩어리 11개: div.kicker.t-stagger-line "AI 발전 속도 · 회사 대표들의 말" x=176 · p.name "OpenAI · 샘 올트먼" x=184 · p.quote "AI 연구를 스스로 하는 AI는 2028년 3월" x=184
- 9장 · 고유 왼쪽 x 6개(>3): 176, 160, 184, 596, 1008, 1428
- 10장 · 열 시작점 밖 글 덩어리 8개: div.kicker.t-stagger-line "전문가 예상 · 관계식 R2" x=176 · p.chart-src "AI Impacts 전문가 설문(직접) · Meta" x=208 · span.tag "기술" x=787.5
- 10장 · 고유 왼쪽 x 6개(>3): 176, 160, 208, 788, 1307, 1610
- 11장 · 열 시작점 밖 글 덩어리 10개: div.kicker.t-stagger-line "전문가 예상 · 관계식 R3" x=176 · p.chart-src "같은 설문에서 같은 전문가들에게 물은 두 예상 연도" x=208 · span.tag "기술" x=771.7
- 11장 · 고유 왼쪽 x 6개(>3): 176, 160, 208, 772, 1307, 1418
- 12장 · 열 시작점 밖 글 덩어리 10개: div.kicker.t-stagger-line "전문가 예상 · 컨설팅 기관" x=176 · p "McKinsey 추정 · 지금 하는 업무의 절반이 " x=208 · span.t-digit-group "2045" x=208
- 12장 · 고유 왼쪽 x 7개(>3): 176, 160, 208, 841, 1032, 1229, 1543
- 13장 · 열 시작점 밖 글 덩어리 7개: div.kicker.t-stagger-line "실제 고용 1 · 미국 세부 직업 · 수업 7주 상" x=176 · p.chart-src "점 하나 = 직업 하나(2022년 고용 1만 명 이" x=208 · span.tag "기술" x=878.9
- 13장 · 고유 왼쪽 x 5개(>3): 176, 160, 208, 879, 1307
- 14장 · 열 시작점 밖 글 덩어리 10개: div.kicker.t-stagger-line "실제 고용 1 · 노출 상위 직업" x=176 · p.chart-title "노출도 5분위별 합계 고용 변화 2022→2025" x=208 · p.chart-src "분위마다 직업 154개 · 막대는 0에서 시작 기술" x=208
- 14장 · 고유 왼쪽 x 6개(>3): 176, 160, 208, 452, 1169, 1308
- … 외 34건(JSON 보고서에 전부)

- 메모: 전면 사진 장(.bleed)은 풀블리드 예외로 뺐다
- 메모: 열 시작점 160 · 297 · 435 · 572 · 709 · 847 · 984 · 1121 · 1259 · 1396 · 1533 · 1671

근거: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-02.jpg](../shots/baseline/slide-02.jpg) · [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-05.jpg](../shots/baseline/slide-05.jpg) · [slide-07.jpg](../shots/baseline/slide-07.jpg)

### LAY-04

실패 · 레이아웃·간격 · automated · 구현 auto

> 모든 padding·margin·gap은 8 배수 토큰이고, 같은 부모의 형제 간격은 1종이며 그룹 안 간격 < 그룹 사이 간격이다. 헤더→본문 64, 본문→결론 32, 결론→꼬리말 24를 지킨다  
> 기준: 감사 '간격' 위반 0, token-check space 0, 계산값이 8의 배수 아님 0건(4는 아이콘 반 단계만), 형제 간격 종류 1, 표준 거리 ±1px

실패 67건 · 장 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29, 33, 34

- token-check space 27건(src/deck.css:29  space  16px  (padding) · src/deck.css:48  space  32px  (padding) · src/deck.css:104  space  16px  (padding) · src/slides.css:4  space  96px  (column-gap))
- 1장 · 8 배수 아닌 계산 간격 2: div.pills "AI가 맡는 업무 크기 105일마다 2배2036년 " rowGap 12 · div.pills "AI가 맡는 업무 크기 105일마다 2배2036년 " columnGap 12
- 1장 · 형제 간격 2종 이상 1곳: div.left "AI가 AI 개발을 돕기 시작한 뒤의 10년 AI는" [24,32,48]
- 3장 · 본문→결론 48 ≠ 32
- 3장 · 결론→꼬리말 32 ≠ 24
- 4장 · 8 배수 아닌 계산 간격 8: span.tag "기술" paddingRight 12 · span.tag "기술" paddingLeft 12 · span.tag "n=3" paddingRight 12
- 4장 · 형제 간격 2종 이상 1곳: div.sowe.t-stagger-line "2036년이 관계가 이어지면 기준 시나리오에서 한국" [428,451]
- 4장 · 본문→결론 48 ≠ 32
- 4장 · 결론→꼬리말 32 ≠ 24
- 5장 · 본문→결론 48 ≠ 32
- 5장 · 결론→꼬리말 32 ≠ 24
- 6장 · 8 배수 아닌 계산 간격 6: span.tag "2차 · 자체 보고" paddingRight 12 · span.tag "2차 · 자체 보고" paddingLeft 12 · span.tag "2차" paddingRight 12
- 6장 · 형제 간격 2종 이상 1곳: div.inner "재귀적 자기개선 · 지금 보이는 신호 AI 회사들은" [48,32]
- 6장 · 헤더→본문 48 ≠ 64
- 7장 · 8 배수 아닌 계산 간격 2: span.tag "기술" paddingRight 12 · span.tag "기술" paddingLeft 12
- 8장 · 8 배수 아닌 계산 간격 2: span.tag "시간순 검증" paddingRight 12 · span.tag "시간순 검증" paddingLeft 12
- 8장 · 형제 간격 2종 이상 1곳: div.head "AI 발전 속도 · 관계식 R1 AI가 맡는 업무 " [24,16]
- 8장 · 본문→결론 48 ≠ 32
- 8장 · 결론→꼬리말 32 ≠ 24
- 9장 · 형제 간격 2종 이상 1곳: div.head "AI 발전 속도 · 회사 대표들의 말 AI 회사 대" [24,16]
- 10장 · 8 배수 아닌 계산 간격 4: span.tag "기술" paddingRight 12 · span.tag "기술" paddingLeft 12 · span.tag "n=3" paddingRight 12
- 10장 · 헤더→본문 48 ≠ 64
- 11장 · 8 배수 아닌 계산 간격 2: span.tag "기술" paddingRight 12 · span.tag "기술" paddingLeft 12
- 11장 · 형제 간격 2종 이상 2곳: div.card.accent "AGI가 온 뒤 모든 직업이 자동화되기까지105년 " [0,16] · div.card "AI 능력이 두 배가 될 때마다 앞당겨진 햇수AGI" [0,16]
- 11장 · 헤더→본문 48 ≠ 64
- … 외 42건(JSON 보고서에 전부)

근거: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-05.jpg](../shots/baseline/slide-05.jpg) · [slide-06.jpg](../shots/baseline/slide-06.jpg) · [slide-07.jpg](../shots/baseline/slide-07.jpg)

### LAY-05

실패 · 레이아웃·정보량 · automated · 구현 auto

> 한 장에 시각 블록 4개 이하, 병렬 항목 4개 기본(최대 5), 표 본문 행 7 이하, 차트 2개 이하. 넘치면 글자를 줄이지 않고 장을 나눈다  
> 기준: 블록 >4 장 0, 병렬 항목 >5 0(5개는 README 사유), 표 행 >7 0, 차트 >2 장 0

실패 1건 · 장 28

- 28장 · 병렬 항목 6개(>5): div.poster "텔레마케터·상담이미 감소2023년부터 실측 · 미국"

근거: [slide-28.jpg](../shots/baseline/slide-28.jpg)

### LAY-06

실패 · 레이아웃·넘침 · automated · 구현 auto

> 장 밖으로 나가거나 잘리거나 서로 가리는 요소가 없고, fit.js가 강하게 축소한 요소도 없다. 장 안 스크롤 영역도 없다  
> 기준: report의 jsErrors·over·clipped·tiny 모두 빈 배열, 가림 쌍(교차 >4px²) 0, overflow 스크롤 요소 0, 축소 배율 <0.9 요소 0

실패 5건 · 장 5, 10, 11, 17

- 5장 · 작은 글자(fit): 12개 — svg "연산과 전력에서 AI 능력, AI 개발 가속" text.n-s "학습 연산 연 4.1배" 축소 0.81 → 글자 13.0px (예외 목록 .chain text에 있어도 14px 미만)
- 5장 · svg chain 축소 배율 0.811(<0.9)
- 10장 · 글자 상자 겹침 1쌍: text.vlab "2042" ↔ text.note.slab "전문가 설문 (HLMI)" 5px²
- 11장 · 글자 상자 겹침 2쌍: text.vlab "2098" ↔ text.note.slab "직업 자동화" 5px² · text.vlab "2042" ↔ text.vlab.slab "AGI" 5px²
- 17장 · 글자 상자 겹침 3쌍: text.vlab "119.7" ↔ text.vlab.slab "전문가" 19px² · text.vlab "108.7" ↔ text.note.slab "사무직" 18px²

- 메모: fit.js가 3차 정보 예외로 넘긴 글자 228개(실패로 세지 않음, TYP-03에서 따로 잰다)

근거: [slide-05.jpg](../shots/baseline/slide-05.jpg) · [slide-10.jpg](../shots/baseline/slide-10.jpg) · [slide-11.jpg](../shots/baseline/slide-11.jpg) · [slide-17.jpg](../shots/baseline/slide-17.jpg)

### LAY-07

실패 · 레이아웃·리듬 · both · 구현 auto+manual

> 이웃한 두 장이 같은 배치 서명을 쓰지 않고 같은 배치 단어가 3장 연속되지 않는다  
> 기준: 연속 동일 서명 쌍 0(의도된 시퀀스는 README 사유), 같은 배치 단어 3연속 0

실패 16건 · 장 4, 8, 11, 12, 13, 14, 15, 16, 17, 21, 22, 23, 24, 25, 26, 27

- 4장 · 3·4장 배치 서명 같음: 160:1600:3
- 8장 · 7·8장 배치 서명 같음: 160:1600:3
- 11장 · 10·11장 배치 서명 같음: 160:1600:2
- 12장 · 11·12장 배치 서명 같음: 160:1600:2
- 13장 · 12·13장 배치 서명 같음: 160:1600:2
- 14장 · 13·14장 배치 서명 같음: 160:1600:2
- 15장 · 14·15장 배치 서명 같음: 160:1600:2
- 16장 · 15·16장 배치 서명 같음: 160:1600:2
- 17장 · 16·17장 배치 서명 같음: 160:1600:2
- 21장 · 20·21장 배치 서명 같음: 160:1600:2
- 22장 · 21·22장 배치 서명 같음: 160:1600:2
- 23장 · 22·23장 배치 서명 같음: 160:1600:2
- 24장 · 23·24장 배치 서명 같음: 160:1600:2
- 25장 · 24·25장 배치 서명 같음: 160:1600:2
- 26장 · 25·26장 배치 서명 같음: 160:1600:2
- 27장 · 26·27장 배치 서명 같음: 160:1600:2

근거: [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-08.jpg](../shots/baseline/slide-08.jpg) · [slide-11.jpg](../shots/baseline/slide-11.jpg) · [slide-12.jpg](../shots/baseline/slide-12.jpg) · [slide-13.jpg](../shots/baseline/slide-13.jpg) · [slide-14.jpg](../shots/baseline/slide-14.jpg)

수동 확인 절차: 장별 서명(.body 직계 자식의 열 시작·열 너비·행 수 + 바탕 필드 유무)을 생성해 연속 쌍을 비교하고, 컨택트시트를 보며 장마다 배치 단어(split·chart·statement·table·full-bleed·list)를 적는다
볼 것: [contact-1.jpg](../shots/baseline/contact-1.jpg) · [contact-2.jpg](../shots/baseline/contact-2.jpg)

### LAY-08

실패 · 레이아웃·묶음 균일 · automated · 구현 auto

> 같은 행의 형제 블록(.figs·.tiles·.bands·질문 묶음)은 폭·높이·자식 구조가 같다  
> 기준: 폭·높이 차 ≤8px, 자식 클래스 집합 동일. 의도된 비대칭은 README 예외 목록

실패 31건 · 장 4, 9, 10, 11, 13, 14, 15, 16, 17, 20, 21, 22, 25, 26, 27, 32, 33

- 4장 · div.tiles "105일AI가 맡을 수 있는 업무 크기가 두 배로 " 같은 행 형제 폭 579/463 · 높이 534/470/406
- 9장 · div.grid "OpenAI · 샘 올트먼AI 연구를 스스로 하는 " 같은 행 형제 폭 364 · 높이 540/508
- 9장 · div.grid "OpenAI · 샘 올트먼AI 연구를 스스로 하는 " 같은 행 형제 자식 구조 다름
- 10장 · div.grid "2020203020402050206020702016" 같은 행 형제 폭 1051/501 · 높이 614/528
- 10장 · div.grid "2020203020402050206020702016" 같은 행 형제 자식 구조 다름
- 11장 · div.grid "2030205020702090211021302150" 같은 행 형제 폭 1051/501 · 높이 614/496
- 11장 · div.grid "2030205020702090211021302150" 같은 행 형제 자식 구조 다름
- 13장 · div.grid "-50-250+25+500.000.250.500.7" 같은 행 형제 폭 1051/501 · 높이 614/512
- 13장 · div.grid "-50-250+25+500.000.250.500.7" 같은 행 형제 자식 구조 다름
- 14장 · div.grid "1분위 (β 0.00~0.09)+3.3%2분위 (β" 같은 행 형제 폭 913/639 · 높이 507/512
- 14장 · div.grid "1분위 (β 0.00~0.09)+3.3%2분위 (β" 같은 행 형제 자식 구조 다름
- 15장 · div.grid "18개 직업 대분류 중 음의 상관이 나온 곳11개전" 같은 행 형제 폭 776 · 높이 304/352
- 15장 · div.grid "18개 직업 대분류 중 음의 상관이 나온 곳11개전" 같은 행 형제 자식 구조 다름
- 16장 · div.grid "모형(2023→2025 고용 변화, 743개 직업)" 같은 행 형제 폭 913/639 · 높이 459/448
- 16장 · div.grid "모형(2023→2025 고용 변화, 743개 직업)" 같은 행 형제 자식 구조 다름
- 17장 · div.grid "8090100110120201920202021202" 같은 행 형제 폭 1051/501 · 높이 534/480
- 17장 · div.grid "8090100110120201920202021202" 같은 행 형제 자식 구조 다름
- 20장 · div.grid "따라잡는 햇수 = 격차를 메우려면 두 배가 돼야 하" 같은 행 형제 폭 913/639 · 높이 296/240
- 20장 · div.grid "따라잡는 햇수 = 격차를 메우려면 두 배가 돼야 하" 같은 행 형제 자식 구조 다름
- 21장 · div.grid "가장 큰 AI 모델 학습에 드는 전력2.9배/년학습" 같은 행 형제 폭 776 · 높이 272/304
- 22장 · div.grid "하는 일이 달라 직접 비교는 아니지만 뇌는 20W," 같은 행 형제 폭 639/913 · 높이 560/464
- 22장 · div.grid "하는 일이 달라 직접 비교는 아니지만 뇌는 20W," 같은 행 형제 자식 구조 다름
- 25장 · div.grid "직급맡는 업무 크기빠름기준신중신입·인턴하루짜리 일2" 같은 행 형제 폭 1051/501 · 높이 554/528
- 25장 · div.grid "직급맡는 업무 크기빠름기준신중신입·인턴하루짜리 일2" 같은 행 형제 자식 구조 다름
- 26장 · div.grid "0100200300400202620272028202" 같은 행 형제 폭 1051/501 · 높이 657/480
- … 외 6건(JSON 보고서에 전부)

근거: [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-09.jpg](../shots/baseline/slide-09.jpg) · [slide-10.jpg](../shots/baseline/slide-10.jpg) · [slide-11.jpg](../shots/baseline/slide-11.jpg) · [slide-13.jpg](../shots/baseline/slide-13.jpg) · [slide-14.jpg](../shots/baseline/slide-14.jpg)

### LAY-09

실패 · 레이아웃·밀도 · both · 구현 auto+manual

> 장이 비어 보이거나 빽빽하지 않고, 카드를 빈칸 채우기로 늘리지 않는다  
> 기준: 점유율 0.35~0.85(표지·구획 장 예외), 채움 <0.6 카드 0, 바탕 85% 이상 장 ≤1

실패 5건 · 장 3, 12, 20, 34

- 3장 · 콘텐츠 점유율 0.33(0.35~0.85 밖)
- 12장 · 콘텐츠 점유율 0.33(0.35~0.85 밖)
- 20장 · 콘텐츠 점유율 0.33(0.35~0.85 밖)
- 34장 · 콘텐츠 점유율 0.24(0.35~0.85 밖)
- 본문 영역 바탕 85% 이상 장 6개(>1): 1, 2, 6, 18, 19, 34

근거: [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-12.jpg](../shots/baseline/slide-12.jpg) · [slide-20.jpg](../shots/baseline/slide-20.jpg) · [slide-34.jpg](../shots/baseline/slide-34.jpg)

수동 확인 절차: 안전 영역 대비 콘텐츠 bbox 합집합 비율, 카드 내부 콘텐츠 높이/카드 높이를 계산하고 PNG에서 본문 영역 바탕색 비율을 잰 뒤 컨택트시트로 확인한다
볼 것: [contact-1.jpg](../shots/baseline/contact-1.jpg) · [contact-2.jpg](../shots/baseline/contact-2.jpg)

### LAY-10

실패 · 레이아웃·위계 · automated · 구현 auto

> 장마다 가장 큰 글자는 하나이고 헤드라인·핵심 수치 중 하나이며 위쪽 절반에 있다. 헤드라인은 DOM 첫 텍스트다  
> 기준: 최대 크기 요소 동률 0, 클래스 ∈ {.headline, .num, .fig .v, 표지 h1}, top ≤540px(예외 목록 제외)

실패 44건 · 장 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34

- 1장 · 헤드라인이 DOM 첫 텍스트가 아님(킥커·표지 띠가 앞섬)
- 2장 · 최대 크기 64px 동률 5개: span.t-stagger-line "AI 회사들은" · span.t-stagger-line "다음 AI를 만드는 데" · span.t-stagger-line "AI를 쓰기 시작했고"
- 2장 · 가장 큰 글자가 헤드라인·핵심 수치가 아님: span.t-stagger-line "AI 회사들은" 64px
- 3장 · 헤드라인이 DOM 첫 텍스트가 아님(킥커·표지 띠가 앞섬)
- 4장 · 최대 크기 96px 동률 3개: span.t-digit-group "105" · span.t-digit-group "3.5" · span.t-digit-group "94"
- 4장 · 헤드라인이 DOM 첫 텍스트가 아님(킥커·표지 띠가 앞섬)
- 5장 · 헤드라인이 DOM 첫 텍스트가 아님(킥커·표지 띠가 앞섬)
- 6장 · 헤드라인이 DOM 첫 텍스트가 아님(킥커·표지 띠가 앞섬)
- 7장 · 헤드라인이 DOM 첫 텍스트가 아님(킥커·표지 띠가 앞섬)
- 8장 · 최대 크기 64px 동률 3개: span.t-digit-group "188" · span.t-digit-group "129" · span.t-digit-group "105"
- 8장 · 헤드라인이 DOM 첫 텍스트가 아님(킥커·표지 띠가 앞섬)
- 9장 · 헤드라인이 DOM 첫 텍스트가 아님(킥커·표지 띠가 앞섬)
- 10장 · 헤드라인이 DOM 첫 텍스트가 아님(킥커·표지 띠가 앞섬)
- 11장 · 헤드라인이 DOM 첫 텍스트가 아님(킥커·표지 띠가 앞섬)
- 12장 · 최대 크기 96px 동률 2개: span.t-digit-group "2045" · span.t-digit-group "29.5"
- 12장 · 가장 큰 글자 top 573 > 540
- 12장 · 헤드라인이 DOM 첫 텍스트가 아님(킥커·표지 띠가 앞섬)
- 13장 · 헤드라인이 DOM 첫 텍스트가 아님(킥커·표지 띠가 앞섬)
- 14장 · 헤드라인이 DOM 첫 텍스트가 아님(킥커·표지 띠가 앞섬)
- 15장 · 헤드라인이 DOM 첫 텍스트가 아님(킥커·표지 띠가 앞섬)
- 16장 · 헤드라인이 DOM 첫 텍스트가 아님(킥커·표지 띠가 앞섬)
- 17장 · 헤드라인이 DOM 첫 텍스트가 아님(킥커·표지 띠가 앞섬)
- 18장 · 최대 크기 96px 동률 3개: span.t-digit-group "28.5" · span.t-digit-group "19" · span.t-digit-group "91→28"
- 18장 · 헤드라인이 DOM 첫 텍스트가 아님(킥커·표지 띠가 앞섬)
- 19장 · 최대 크기 96px 동률 3개: span.t-digit-group "6.6" · span.t-digit-group "2.5" · span.t-digit-group "3,333"
- … 외 19건(JSON 보고서에 전부)

근거: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-02.jpg](../shots/baseline/slide-02.jpg) · [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-05.jpg](../shots/baseline/slide-05.jpg) · [slide-06.jpg](../shots/baseline/slide-06.jpg)

### SURF-01

실패 · 배경 면 · automated · 구현 auto

> 연속한 세 장이 같은 배경 면(장 루트·전면 필드의 지배 색)을 쓰지 않는다  
> 기준: 같은 면 3연속 0건

실패 6건 · 장 3, 4, 22, 23, 26, 27

- 3장 · 1·2·3장 같은 면 #f4f2ef
- 4장 · 2·3·4장 같은 면 #f4f2ef
- 22장 · 20·21·22장 같은 면 #f4f2ef
- 23장 · 21·22·23장 같은 면 #f4f2ef
- 26장 · 24·25·26장 같은 면 #ffffff
- 27장 · 25·26·27장 같은 면 #ffffff

근거: [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-22.jpg](../shots/baseline/slide-22.jpg) · [slide-23.jpg](../shots/baseline/slide-23.jpg) · [slide-26.jpg](../shots/baseline/slide-26.jpg) · [slide-27.jpg](../shots/baseline/slide-27.jpg)

### SURF-02

실패 · 배경 면 · automated · 구현 auto

> 덱이 밝은 tint 면(스톤 단계·세이지·인디고 50/100)을 상황에 따라 바꿔 짜며, 면 종류는 3종 이상이고 모두 토큰이다  
> 기준: 면 종류 ≥3, 토큰 밖 바탕 0

실패 1건

- 바탕 면 2종(<3): #f4f2ef×32, #171512×2

### SURF-03

실패 · 배경 면·어두운 장 · both · 구현 auto+manual

> 어두운 장은 결정적 순간에만 2장 이하로 쓰고 이웃하지 않으며, 전면 사진 장과 합쳐 6장 이하다. 사유는 design-standard에 있다  
> 기준: 어두운 장 ≤2, 연속 0, 어두운+전면 사진 ≤6, 사유 누락 0

실패 3건 · 장 19

- 어두운 장 5(>2): 6, 18, 19, 29, 34
- 19장 · 어두운 장 이웃 18·19
- design-standard에 어두운·전면 사진 장 사유 없음: 18, 19, 29, 34장

근거: [slide-19.jpg](../shots/baseline/slide-19.jpg)

수동 확인 절차: PNG 평균 L*<30인 장과 .bg 전면 사진 장을 나열하고 README의 사유 목록과 대조한다
볼 것: [slide-06.jpg](../shots/baseline/slide-06.jpg) · [slide-18.jpg](../shots/baseline/slide-18.jpg) · [slide-19.jpg](../shots/baseline/slide-19.jpg) · [slide-29.jpg](../shots/baseline/slide-29.jpg) · [slide-34.jpg](../shots/baseline/slide-34.jpg)

### SURF-04

통과 · 배경 면·어두운 장 · automated · 구현 auto

> 어두운 장 위 이미지·차트에 순백 면을 쓰지 않는다  
> 기준: ≤2%

### SURF-05

통과 · 배경 면·레터박스 · automated · 구현 auto

> 뷰포트 비율이 16:9가 아닐 때 생기는 여백은 토큰 무대색으로 칠해진다  
> 기준: 레터박스 색 = 토큰 값(ΔE<2)

근거: [stage-1024x768-s10.jpg](../shots/baseline/stage-1024x768-s10.jpg) · [stage-2560x1080-s10.jpg](../shots/baseline/stage-2560x1080-s10.jpg) · [stage-390x844-s10.jpg](../shots/baseline/stage-390x844-s10.jpg)

### SURF-06

실패 · 배경 면·색 구성표 · automated · 구현 auto

> 덱은 라이트 전용으로 선언돼 브라우저 자동 다크화로 색이 뒤집히지 않는다  
> 기준: meta color-scheme=light 존재, theme-color 2개가 --stage와 일치, 픽셀 차 0

실패 3건

- meta color-scheme=light 없음
- :root color-scheme: light 없음
- theme-color 0개(<2)

### CARD-01

실패 · 카드 · automated · 구현 auto

> 밝은 장의 카드형 상자(그림자·배경·테두리로 경계가 생긴 컨테이너)는 장당 0~1개다  
> 기준: 밝은 장: ≤1, 모든 장: ≤2

실패 25건 · 장 3, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 21, 22, 24, 25, 26, 27, 28, 29, 30, 32, 33

- 3장 · 경계 있는 상자 4개(>1): div.card · div.card · div.card.accent
- 4장 · 경계 있는 상자 4개(>1): div.tile.t1.t-stagger-line · div.tile.t2.t-stagger-line · div.tile.t3.t-stagger-line
- 5장 · 경계 있는 상자 2개(>1): div.chainwrap.t-stagger-line · div.sowe.t-stagger-line
- 8장 · 경계 있는 상자 4개(>1): div.card.t-stagger-line · div.card.t-stagger-line · div.card.accent.t-stagger-line
- 9장 · 경계 있는 상자 5개(>1): div.c3.who.t-stagger-line · div.c3.who.t-stagger-line · div.c3.who.t-stagger-line
- 10장 · 경계 있는 상자 3개(>1): div.c8.chart.t-stagger-line · div.card · div.card.soft
- 11장 · 경계 있는 상자 3개(>1): div.c8.chart.t-stagger-line · div.card.accent · div.card
- 12장 · 경계 있는 상자 2개(>1): div.c6.card.t-stagger-line · div.c6.card.sage.t-stagger-line
- 13장 · 경계 있는 상자 3개(>1): div.c8.chart.t-stagger-line · div.card · div.card.soft
- 14장 · 경계 있는 상자 3개(>1): div.c7.chart.t-stagger-line · div.card.accent · div.card
- 15장 · 경계 있는 상자 2개(>1): div.c6.card.t-stagger-line · div.c6.card.soft.t-stagger-line
- 16장 · 경계 있는 상자 3개(>1): div.c7.card.t-stagger-line · div.card.accent · div.card
- 17장 · 경계 있는 상자 4개(>1): div.c8.chart.t-stagger-line · div.card · div.card.soft
- 20장 · 경계 있는 상자 2개(>1): div.c7.eq.t-stagger-line · div.c5.card.t-stagger-line
- 21장 · 경계 있는 상자 3개(>1): div.c6.card.ink.t-stagger-line · div.c6.card.t-stagger-line · div.sowe.t-stagger-line
- 22장 · 경계 있는 상자 3개(>1): div.c5.photo.t-stagger-line · div.card · div.card.soft
- 24장 · 경계 있는 상자 2개(>1): div.chart · div.sowe.t-stagger-line
- 25장 · 경계 있는 상자 3개(>1): div.c8.card.t-stagger-line · div.card.soft · div.card.accent
- 26장 · 경계 있는 상자 3개(>1): div.c8.chart.t-stagger-line · div.card.accent · div.card
- 27장 · 경계 있는 상자 3개(>1): div.c7.chart.t-stagger-line · div.card · div.card.soft
- 28장 · 경계 있는 상자 6개(>1): div.posterwrap.t-stagger-line · div.it.t-stagger-line · div.it.t-stagger-line
- 29장 · 경계 있는 상자 5개(>2): div.phase · div.phase · div.phase
- 30장 · 경계 있는 상자 5개(>1): div.band.head-band.t-stagger-line · div.band.t-stagger-line · div.band.t-stagger-line
- 32장 · 경계 있는 상자 2개(>1): div.c8.card.t-stagger-line · div.c4.key.t-stagger-line
- 33장 · 경계 있는 상자 4개(>1): div.c4.card.ink.t-stagger-line · div.c4.card.t-stagger-line · div.c4.card.sage.t-stagger-line

근거: [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-05.jpg](../shots/baseline/slide-05.jpg) · [slide-08.jpg](../shots/baseline/slide-08.jpg) · [slide-09.jpg](../shots/baseline/slide-09.jpg) · [slide-10.jpg](../shots/baseline/slide-10.jpg)

### CARD-02

실패 · 카드 · both · 구현 auto+manual

> 덱 전체 카드 수가 크게 줄고, 카드가 본문을 주도하는 장은 전체의 3분의 1 이하다  
> 기준: 카드 총수 ≤16(before 40), 카드 있는 장 ≤30%(≤10장), 카드 주도 장 ≤11

실패 3건

- class에 card가 든 요소 41개(>16, before 40)
- 카드 있는 장 33(>10): 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34
- 카드가 본문 50% 이상인 장 27(>11): 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 16, 17, 18, 19, 21, 22, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33

수동 확인 절차: grep -o 'class="[^"]*card' $DECK/index.html \| wc -l로 before(40)와 after를 기록하고, 카드가 본문 면적 50% 이상인 장과 카드가 있는 장 수를 렌더로 센 뒤 컨택트시트로 확인한다
볼 것: [contact-1.jpg](../shots/baseline/contact-1.jpg) · [contact-2.jpg](../shots/baseline/contact-2.jpg)

### CARD-03

실패 · 카드 · automated · 구현 auto

> 카드 안에 카드가 없고, 장 내용 폭 60%를 넘는 큰 상자에는 카드를 쓰지 않는다  
> 기준: 중첩 0, 폭 >960px 카드 0

실패 42건 · 장 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 17, 18, 19, 21, 24, 25, 26, 28, 29, 30, 31, 32, 33, 34

- 3장 · 폭 1600px(>960) 카드: div.sowe.t-stagger-line
- 4장 · 폭 1600px(>960) 카드: div.sowe.t-stagger-line
- 5장 · 폭 1600px(>960) 카드: div.chainwrap.t-stagger-line
- 5장 · 폭 1600px(>960) 카드: div.sowe.t-stagger-line
- 6장 · 폭 1872px(>960) 카드: div.bg
- 7장 · 폭 1600px(>960) 카드: div.chart
- 8장 · 폭 1600px(>960) 카드: div.sowe.t-stagger-line
- 9장 · 카드 안 카드: span.vcap ⊂ a.c3.video.t-stagger-line
- 10장 · 폭 1050.7px(>960) 카드: div.c8.chart.t-stagger-line
- 11장 · 폭 1050.7px(>960) 카드: div.c8.chart.t-stagger-line
- 13장 · 폭 1050.7px(>960) 카드: div.c8.chart.t-stagger-line
- 17장 · 폭 1050.7px(>960) 카드: div.c8.chart.t-stagger-line
- 17장 · 폭 1600px(>960) 카드: div.sowe.t-stagger-line
- 18장 · 폭 1872px(>960) 카드: div.bg
- 18장 · 폭 1568px(>960) 카드: p.relation.t-stagger-line
- 19장 · 폭 1872px(>960) 카드: div.bg
- 21장 · 폭 1600px(>960) 카드: div.sowe.t-stagger-line
- 24장 · 폭 1600px(>960) 카드: div.chart
- 24장 · 폭 1600px(>960) 카드: div.sowe.t-stagger-line
- 25장 · 폭 1050.7px(>960) 카드: div.c8.card.t-stagger-line
- 26장 · 폭 1050.7px(>960) 카드: div.c8.chart.t-stagger-line
- 28장 · 폭 1600px(>960) 카드: div.posterwrap.t-stagger-line
- 28장 · 카드 안 카드: div.it.t-stagger-line ⊂ div.posterwrap.t-stagger-line
- 28장 · 폭 1472px(>960) 카드: div.it.t-stagger-line
- 28장 · 카드 안 카드: div.it.t-stagger-line ⊂ div.posterwrap.t-stagger-line
- … 외 17건(JSON 보고서에 전부)

근거: [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-05.jpg](../shots/baseline/slide-05.jpg) · [slide-06.jpg](../shots/baseline/slide-06.jpg) · [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-08.jpg](../shots/baseline/slide-08.jpg)

### CARD-04

실패 · 카드 · automated · 구현 auto

> 같은 크기 카드 3개 이상 한 줄 배치를 반복하지 않는다  
> 기준: 해당 장 ≤2, 연속 장 0

실패 2건 · 장 9

- 같은 크기 카드 3개 이상 한 줄인 장 4(>2): 3, 8, 9, 29
- 9장 · 연속 장 8·9에서 반복

- 메모: inspect.mjs card-rows는 돌리지 않았다(같은 기준을 DOM으로 직접 잼)

근거: [slide-09.jpg](../shots/baseline/slide-09.jpg)

### CARD-05

실패 · 카드·그림자 · automated · 구현 auto

> 그림자는 떠 있는 요소 한 단계만, 연한 것만 쓴다. 같은 경계를 링·선·그림자로 겹쳐 그리지 않고 글자 그림자는 없다  
> 기준: 장당 box-shadow 요소 ≤1(고정 컨트롤 제외), 알파 >0.16 0, 링+그림자+선 동시 0, text-shadow 0, lint shadow 감소

실패 81건 · 장 1, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 21, 22, 24, 25, 26, 27, 29, 30, 31, 32, 33

- 1장 · 그림자 요소 3개(>1)
- 1장 · 같은 경계를 링과 그림자로 겹쳐 그림: div.object
- 3장 · 그림자 요소 3개(>1)
- 3장 · 같은 경계를 링과 그림자로 겹쳐 그림: div.card
- 3장 · 같은 경계를 링과 그림자로 겹쳐 그림: div.card
- 3장 · 같은 경계를 링과 그림자로 겹쳐 그림: div.card.accent
- 4장 · 그림자 요소 3개(>1)
- 4장 · 같은 경계를 링과 그림자로 겹쳐 그림: div.tile.t1.t-stagger-line
- 4장 · 같은 경계를 링과 그림자로 겹쳐 그림: div.tile.t2.t-stagger-line
- 4장 · 같은 경계를 링과 그림자로 겹쳐 그림: div.tile.t3.t-stagger-line
- 5장 · 같은 경계를 링과 그림자로 겹쳐 그림: div.chainwrap.t-stagger-line
- 7장 · 같은 경계를 링과 그림자로 겹쳐 그림: div.chart
- 8장 · 그림자 요소 3개(>1)
- 8장 · 같은 경계를 링과 그림자로 겹쳐 그림: div.card.t-stagger-line
- 8장 · 같은 경계를 링과 그림자로 겹쳐 그림: div.card.t-stagger-line
- 8장 · 같은 경계를 링과 그림자로 겹쳐 그림: div.card.accent.t-stagger-line
- 9장 · 그림자 요소 4개(>1)
- 9장 · 같은 경계를 링과 그림자로 겹쳐 그림: div.c3.who.t-stagger-line
- 9장 · 같은 경계를 링과 그림자로 겹쳐 그림: div.c3.who.t-stagger-line
- 9장 · 같은 경계를 링과 그림자로 겹쳐 그림: div.c3.who.t-stagger-line
- 9장 · 같은 경계를 링과 그림자로 겹쳐 그림: a.c3.video.t-stagger-line
- 10장 · 그림자 요소 2개(>1)
- 10장 · 같은 경계를 링과 그림자로 겹쳐 그림: div.c8.chart.t-stagger-line
- 10장 · 같은 경계를 링과 그림자로 겹쳐 그림: div.card
- 11장 · 그림자 요소 3개(>1)
- … 외 56건(JSON 보고서에 전부)

근거: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-05.jpg](../shots/baseline/slide-05.jpg) · [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-08.jpg](../shots/baseline/slide-08.jpg)

### CARD-06

실패 · 카드 · automated · 구현 auto

> 한쪽만 굵은 색 띠, 1px로 둘러싼 상자 남발, 점선 장식이 없다  
> 기준: 색 띠 0, 1px 둘러싼 상자 <3, 장식 점선 0(차트 기준선·추정 구간 제외)

실패 12건 · 장 23

- 23장 · 한쪽만 굵은 띠(0/0/4/0): span.d
- 23장 · 장식 점선(dotted): span.d
- 23장 · 한쪽만 굵은 띠(0/0/4/0): span.d
- 23장 · 장식 점선(dotted): span.d
- 23장 · 한쪽만 굵은 띠(0/0/4/0): span.d
- 23장 · 장식 점선(dotted): span.d
- 23장 · 한쪽만 굵은 띠(0/0/4/0): span.d
- 23장 · 장식 점선(dotted): span.d
- 23장 · 한쪽만 굵은 띠(0/0/4/0): span.d
- 23장 · 장식 점선(dotted): span.d
- 23장 · 한쪽만 굵은 띠(0/0/4/0): span.d
- 23장 · 장식 점선(dotted): span.d

근거: [slide-23.jpg](../shots/baseline/slide-23.jpg)

### CARD-07

실패 · 카드·모서리 · automated · 구현 auto

> border-radius는 토큰 단계만 쓰고 크기에 맞으며, 겹친 모양은 동심이다  
> 기준: 감사 위반 0, 비율 >0.2 0(pill 제외), 높이<160 radius≥24 0, 동심 오차 >1px 0

실패 34건 · 장 3, 4, 5, 8, 9, 17, 21, 24, 29, 30, 33, 34

- 3장 · 모서리/짧은 변 0.3(>0.2): div.sowe.t-stagger-line r24
- 3장 · 높이 80(<160)인데 모서리 24: div.sowe.t-stagger-line
- 4장 · 모서리/짧은 변 0.3(>0.2): div.sowe.t-stagger-line r24
- 4장 · 높이 80(<160)인데 모서리 24: div.sowe.t-stagger-line
- 5장 · 모서리/짧은 변 0.3(>0.2): div.sowe.t-stagger-line r24
- 5장 · 높이 80(<160)인데 모서리 24: div.sowe.t-stagger-line
- 5장 · 도식 chain rect 6개: rx 22.7 토큰 단계(16·24·32) 밖
- 5장 · 도식 chain rect 2개: rx 22.7 토큰 단계(16·24·32) 밖 · rx/짧은 변 0.24(>0.2)
- 8장 · 모서리/짧은 변 0.21(>0.2): div.sowe.t-stagger-line r24
- 8장 · 높이 112(<160)인데 모서리 24: div.sowe.t-stagger-line
- 9장 · 모서리/짧은 변 0.3(>0.2): span.vcap r24
- 9장 · 높이 80(<160)인데 모서리 24: span.vcap
- 17장 · 모서리/짧은 변 0.3(>0.2): div.sowe.t-stagger-line r24
- 17장 · 높이 80(<160)인데 모서리 24: div.sowe.t-stagger-line
- 21장 · 모서리/짧은 변 0.3(>0.2): div.sowe.t-stagger-line r24
- 21장 · 높이 80(<160)인데 모서리 24: div.sowe.t-stagger-line
- 24장 · 모서리/짧은 변 0.3(>0.2): div.sowe.t-stagger-line r24
- 24장 · 높이 80(<160)인데 모서리 24: div.sowe.t-stagger-line
- 29장 · 모서리/짧은 변 0.3(>0.2): div.sowe.t-stagger-line r24
- 29장 · 높이 80(<160)인데 모서리 24: div.sowe.t-stagger-line
- 30장 · 모서리/짧은 변 0.3(>0.2): div.band.head-band.t-stagger-line r24
- 30장 · 높이 80(<160)인데 모서리 24: div.band.head-band.t-stagger-line
- 30장 · 모서리/짧은 변 0.21(>0.2): div.band.t-stagger-line r24
- 30장 · 높이 112(<160)인데 모서리 24: div.band.t-stagger-line
- 30장 · 모서리/짧은 변 0.21(>0.2): div.band.t-stagger-line r24
- … 외 9건(JSON 보고서에 전부)

근거: [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-05.jpg](../shots/baseline/slide-05.jpg) · [slide-08.jpg](../shots/baseline/slide-08.jpg) · [slide-09.jpg](../shots/baseline/slide-09.jpg) · [slide-17.jpg](../shots/baseline/slide-17.jpg)

### CARD-08

실패 · 카드·결론 띠 · automated · 구현 auto

> 장 결론(.sowe 등)은 1px 선과 한 문장으로 가볍게 두고, 헤드라인과 같은 말을 되풀이하지 않으며 결론 라벨은 1종이다  
> 기준: 배경색≠바탕 또는 그림자 있음 0, 문장 수 >1 0, 라벨 고유값 1, 유사도 ≤0.5

실패 15건 · 장 3, 4, 5, 8, 17, 21, 24, 29, 33, 34

- 3장 · 결론 띠 배경 rgba(239,242,252,1) ≠ 장 바탕 rgba(244,242,239,1)
- 4장 · 결론 띠 배경 rgba(239,242,252,1) ≠ 장 바탕 rgba(244,242,239,1)
- 5장 · 결론 띠 배경 rgba(239,242,252,1) ≠ 장 바탕 rgba(244,242,239,1)
- 5장 · 결론 문장 2개(>1)
- 8장 · 결론 띠 배경 rgba(239,242,252,1) ≠ 장 바탕 rgba(244,242,239,1)
- 8장 · 결론 문장 2개(>1)
- 17장 · 결론 띠 배경 rgba(239,242,252,1) ≠ 장 바탕 rgba(244,242,239,1)
- 17장 · 결론 문장 2개(>1)
- 21장 · 결론 띠 배경 rgba(239,242,252,1) ≠ 장 바탕 rgba(244,242,239,1)
- 24장 · 결론 띠 배경 rgba(239,242,252,1) ≠ 장 바탕 rgba(244,242,239,1)
- 24장 · 결론 문장 2개(>1)
- 29장 · 결론 띠 배경 rgba(34,32,29,1) ≠ 장 바탕 rgba(23,21,18,1)
- 33장 · 결론 띠 배경 rgba(239,242,252,1) ≠ 장 바탕 rgba(244,242,239,1)
- 34장 · 결론 띠 배경 rgba(34,32,29,1) ≠ 장 바탕 rgba(23,21,18,1)
- 결론 라벨 9종: 누구를 위한 분석인가, 2036년, 읽는 법, 검산과 예측, 그래서, 모형에서는, 지금 따져 볼 것, 바로 다음 할 일

근거: [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-05.jpg](../shots/baseline/slide-05.jpg) · [slide-08.jpg](../shots/baseline/slide-08.jpg) · [slide-17.jpg](../shots/baseline/slide-17.jpg) · [slide-21.jpg](../shots/baseline/slide-21.jpg)

### COL-01

실패 · 색·토큰 · automated · 구현 auto

> CSS·인라인·JS 어디에도 토큰 밖 색이 없다  
> 기준: 모두 0건

실패 5건 · 장 4, 6, 9, 29

- 4장 · 토큰 밖 계산 색 background rgba(20,18,16,0.08) — 장 4
- 6장 · 토큰 밖 계산 색 background rgba(204,227,177,0.16) — 장 6,18,19
- 6장 · 토큰 밖 계산 색 background rgba(20,18,16,0.06) — 장 6,7,8,10,11,12,13,14,17
- 9장 · 토큰 밖 계산 색 background rgba(20,18,16,0.82) — 장 9
- 29장 · 토큰 밖 계산 색 background rgba(204,227,177,0.12) — 장 29,34

근거: [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-06.jpg](../shots/baseline/slide-06.jpg) · [slide-09.jpg](../shots/baseline/slide-09.jpg) · [slide-29.jpg](../shots/baseline/slide-29.jpg)

### COL-02

통과 · 색·팔레트 · automated · 구현 auto

> 원색·고채도 색과 빨강 계열이 없고 이전 원색이 남아 있지 않다  
> 기준: C>0.14 픽셀 ≤0.5%, 계산 색 C ≤0.135, 색상각 0±20° 고채도 0, 노란 크림·테라코타 0, 원색 hex 0

### COL-03

실패 · 색·강조 절제 · automated · 구현 auto

> 인디고 강조는 장마다 핵심 한 곳에만 쓰고 면적이 작다  
> 기준: accent 요소 ≤2/장, accent 배경 칠 ≤1/장, 인디고 픽셀 ≤8%(README 예외 장 제외)

실패 55건 · 장 1, 3, 4, 5, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27, 30, 33

- 1장 · 인디고 요소 4개(>2, svg는 1로 셈)
- 1장 · 인디고 배경 칠 2개(>1): div.kicker · span.pill.on
- 3장 · 인디고 요소 5개(>2, svg는 1로 셈)
- 3장 · 인디고 배경 칠 3개(>1): div.kicker.t-stagger-line · div.card.accent · div.sowe.t-stagger-line
- 3장 · 인디고 픽셀 10.8%(>8%)
- 4장 · 인디고 요소 6개(>2, svg는 1로 셈)
- 4장 · 인디고 배경 칠 3개(>1): div.kicker.t-stagger-line · div.tile.t1.t-stagger-line · div.sowe.t-stagger-line
- 4장 · 인디고 픽셀 20.1%(>8%)
- 5장 · 인디고 요소 6개(>2, svg는 1로 셈)
- 5장 · 인디고 배경 칠 2개(>1): div.kicker.t-stagger-line · div.sowe.t-stagger-line
- 7장 · 인디고 요소 3개(>2, svg는 1로 셈)
- 8장 · 인디고 요소 5개(>2, svg는 1로 셈)
- 8장 · 인디고 배경 칠 3개(>1): div.kicker.t-stagger-line · div.card.accent.t-stagger-line · div.sowe.t-stagger-line
- 8장 · 인디고 픽셀 12.8%(>8%)
- 9장 · 인디고 요소 5개(>2, svg는 1로 셈)
- 10장 · 인디고 요소 4개(>2, svg는 1로 셈)
- 10장 · 인디고 배경 칠 2개(>1): div.kicker.t-stagger-line · div.card.soft
- 11장 · 인디고 요소 4개(>2, svg는 1로 셈)
- 11장 · 인디고 배경 칠 2개(>1): div.kicker.t-stagger-line · div.card.accent
- 13장 · 인디고 요소 4개(>2, svg는 1로 셈)
- 13장 · 인디고 배경 칠 2개(>1): div.kicker.t-stagger-line · div.card.soft
- 14장 · 인디고 요소 4개(>2, svg는 1로 셈)
- 14장 · 인디고 배경 칠 2개(>1): div.kicker.t-stagger-line · div.card.accent
- 14장 · 인디고 픽셀 8.5%(>8%)
- 15장 · 인디고 요소 3개(>2, svg는 1로 셈)
- … 외 30건(JSON 보고서에 전부)

- 메모: 인디고 픽셀: #4c5eb2는 ΔE<10, 옅은 단계 #eff2fc·#dfe6fb는 바탕 스톤과 ΔE 6~7이라 ΔE<3으로 좁혀 셈(절차의 ±ΔE10을 그대로 쓰면 바탕 전체가 인디고로 잡힘)

근거: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-05.jpg](../shots/baseline/slide-05.jpg) · [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-08.jpg](../shots/baseline/slide-08.jpg)

### COL-04

통과 · 색·의미 일관 · both · 구현 auto+manual

> 색별 의미 표(인디고=핵심 계열·주장, 세이지=보조 면, 스톤=비교 기준)가 color.md에 있고, 그 밖 용도가 없으며 같은 대상은 차트가 바뀌어도 같은 색이다  
> 기준: 의미 표에 없는 용도 0, 같은 대상 다른 색 0

수동 확인 절차: color.md 표를 읽고 var(--accent) 사용처를 CSS·인라인·JS에서 모아 용도를 분류한다. chart-data.json에서 여러 차트에 나오는 대상 이름의 계열 클래스를 대조한다
볼 것: [color.md](../../presentation/design-standard/color.md) · [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-10.jpg](../shots/baseline/slide-10.jpg) · [slide-11.jpg](../shots/baseline/slide-11.jpg) · [slide-13.jpg](../shots/baseline/slide-13.jpg) · [slide-14.jpg](../shots/baseline/slide-14.jpg) · [slide-17.jpg](../shots/baseline/slide-17.jpg) · [slide-24.jpg](../shots/baseline/slide-24.jpg) · [slide-26.jpg](../shots/baseline/slide-26.jpg) · [slide-27.jpg](../shots/baseline/slide-27.jpg)

### COL-05

실패 · 색·글자색 · automated · 구현 auto

> 색 면 위에서는 그 면 전용 글자색을 쓰고, 본문은 잉크로, 회색은 2차 정보에만, rgba·opacity로 흐린 글자는 없다  
> 기준: 색 면 위 --note 0, --note 비율 >50% 장 0, 흐린 글자 0(애니메이션 완료 후)

실패 33건 · 장 1, 3, 7, 8, 10, 11, 12, 13, 14, 15, 17, 20, 21, 22, 25, 26, 27, 29, 33

- 1장 · 18px 이상 글자 중 회색 비율 62%(>50%)
- 3장 · 18px 이상 글자 중 회색 비율 58%(>50%)
- 7장 · 색 면 위 --note 글자: span.tag "기술" (바탕 rgba(241,241,241,1))
- 8장 · 색 면 위 --note 글자: span.tag "시간순 검증" (바탕 rgba(226,229,238,1))
- 10장 · 색 면 위 --note 글자: span.tag "기술" (바탕 rgba(241,241,241,1))
- 10장 · 색 면 위 --note 글자: span.tag "n=3" (바탕 rgba(241,241,241,1))
- 10장 · 색 면 위 --note 글자: p "예측 커뮤니티 Metaculus는 2025년 이후 " (바탕 rgba(239,242,252,1))
- 10장 · 18px 이상 글자 중 회색 비율 71%(>50%)
- 11장 · 색 면 위 --note 글자: span.tag "기술" (바탕 rgba(241,241,241,1))
- 11장 · 18px 이상 글자 중 회색 비율 64%(>50%)
- 12장 · 색 면 위 --note 글자: span.tag "직접" (바탕 rgba(241,241,241,1))
- 12장 · 18px 이상 글자 중 회색 비율 81%(>50%)
- 13장 · 색 면 위 --note 글자: span.tag "기술" (바탕 rgba(241,241,241,1))
- 13장 · 색 면 위 --note 글자: p "노출 지표를 Microsoft·Anthropic 것" (바탕 rgba(239,242,252,1))
- 13장 · 18px 이상 글자 중 회색 비율 66%(>50%)
- 14장 · 색 면 위 --note 글자: span.tag "기술" (바탕 rgba(241,241,241,1))
- 15장 · 색 면 위 --note 글자: p "경영·재무·관리처럼 노출이 큰 대분류가 경기 덕에 " (바탕 rgba(239,242,252,1))
- 15장 · 색 면 위 --note 글자: p "금리 인상 뒤 테크 채용 조정 · 원격근무 확산 ·" (바탕 rgba(239,242,252,1))
- 15장 · 18px 이상 글자 중 회색 비율 89%(>50%)
- 17장 · 색 면 위 --note 글자: span.tag "기술" (바탕 rgba(241,241,241,1))
- 17장 · 색 면 위 --note 글자: p "한국고용정보원과 국회예산정책처도 노출도와 취업자 증" (바탕 rgba(239,242,252,1))
- 17장 · 18px 이상 글자 중 회색 비율 54%(>50%)
- 20장 · 18px 이상 글자 중 회색 비율 60%(>50%)
- 21장 · 18px 이상 글자 중 회색 비율 64%(>50%)
- 22장 · 색 면 위 --note 글자: p "Intel Hala Point 15 TOPS/W 이" (바탕 rgba(239,242,252,1))
- … 외 8건(JSON 보고서에 전부)

근거: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-08.jpg](../shots/baseline/slide-08.jpg) · [slide-10.jpg](../shots/baseline/slide-10.jpg) · [slide-11.jpg](../shots/baseline/slide-11.jpg)

### CON-01

실패 · 대비·글자 · automated · 구현 partial

> 모든 글자-바탕 쌍이 실측 기준을 넘는다(밝은 장·어두운 장·세이지·인디고 면·라벨 알약 포함)  
> 기준: 24px 미만 400 굵기 ≥4.5:1, 24px 이상 또는 18.66px 굵게 ≥3:1, 위반 0, 문서값=실측값

실패 24건 · 장 6, 9, 18, 19

- 6장 · 대비 3.32:1 < 4.5 — div.kicker.t-stagger-line "재귀적 자기개선 · 지금 보이는 신호" 14px 600 (픽셀 최악 5%)
- 6장 · 대비 3.62:1 < 4.5 — span.tag "2차 · 자체 보고" 14px 600 (픽셀 최악 5%)
- 6장 · 대비 4.23:1 < 4.5 — span.tag "2차" 14px 600 (픽셀 최악 5%)
- 6장 · 대비 3.07:1 < 4.5 — span.tag "직접" 14px 600 (픽셀 최악 5%)
- 6장 · 대비 3.89:1 < 4.5 — span.source.credit "배경: AI 생성 이미지(Gemini) · Sema" 16px 400 (픽셀 최악 5%)
- 6장 · 대비 2.25:1 < 4.5 — span.pg "6 / 34" 16px 600 (픽셀 최악 5%)
- 6장 · 대비 2.18:1 < 4.5 — b "6" 16px 700 (픽셀 최악 5%)
- 6장 · 대비 2.85:1 < 4.5 — span.tot "34" 16px 600 (픽셀 최악 5%)
- 9장 · 대비 4.16:1 < 4.5 — span.vcap "영상 · OpenAI 라이브(2025-10-28)7" 16px 600 (픽셀 최악 5%)
- 18장 · 대비 3.23:1 < 4.5 — div.kicker.t-stagger-line "실제 고용 3 · 신입 채용 · 관계식 R4" 14px 600 (픽셀 최악 5%)
- 18장 · 대비 2.3:1 < 3 — span.t-digit-group "91→28" 96px 700 (픽셀 최악 5%)
- 18장 · 대비 2.92:1 < 3 — small "%" 24px 700 (픽셀 최악 5%)
- 18장 · 대비 4.39:1 < 4.5 — div.k "한국 공인회계사 합격자 중 수습 회계사로 등록한 비" 20px 400 (픽셀 최악 5%)
- 18장 · 대비 3.64:1 < 4.5 — p.relation.t-stagger-line "AI 능력이 두 배가 될 때마다 미국 격차 약 1." 20px 600 (픽셀 최악 5%)
- 18장 · 대비 3.84:1 < 4.5 — span.source.credit "배경: AI 생성 이미지(Gemini) · 한국은행" 16px 400 (픽셀 최악 5%)
- 18장 · 대비 2.65:1 < 4.5 — span.pg "18 / 34" 16px 600 (픽셀 최악 5%)
- 18장 · 대비 2.37:1 < 4.5 — b "18" 16px 700 (픽셀 최악 5%)
- 18장 · 대비 2.53:1 < 4.5 — span.tot "34" 16px 600 (픽셀 최악 5%)
- 19장 · 대비 3.02:1 < 4.5 — div.kicker.t-stagger-line "로봇 학습 데이터" 14px 600 (픽셀 최악 5%)
- 19장 · 대비 2.97:1 < 3 — small "개월" 24px 700 (픽셀 최악 5%)
- 19장 · 대비 3.54:1 < 4.5 — div.k "인터넷 영상(약 10억 시간)이 로봇 조작 데이터(" 20px 400 (픽셀 최악 5%)
- 19장 · 대비 3.95:1 < 4.5 — span.source.credit "배경: AI 생성 이미지(Gemini) · Waym" 16px 400 (픽셀 최악 5%)
- 19장 · 대비 3.26:1 < 4.5 — b "19" 16px 700 (픽셀 최악 5%)
- 19장 · 대비 4:1 < 4.5 — span.tot "34" 16px 600 (픽셀 최악 5%)

- 메모: axe-core가 설치돼 있지 않아 계산 색과 실제 뒤 불투명 바탕(조상 합성)으로 직접 잼. 사진·그라데이션 위는 픽셀 최악 5%
- 메모: design-standard 대비표와 실측값 대조는 수동

근거: [slide-06.jpg](../shots/baseline/slide-06.jpg) · [slide-09.jpg](../shots/baseline/slide-09.jpg) · [slide-18.jpg](../shots/baseline/slide-18.jpg) · [slide-19.jpg](../shots/baseline/slide-19.jpg)

### CON-02

실패 · 대비·사진 위 글자 · automated · 구현 auto

> 사진 위 글자는 중립 스크림이나 조용한 영역 위에 있고 최악 픽셀 기준으로도 읽힌다  
> 기준: ≥4.5:1(큰 글자 3:1), 색 오버레이·듀오톤 0

실패 24건 · 장 6, 9, 18, 19

- 6장 · 사진 위 글자 최악 5% 대비 3.32:1 < 4.5 — div.kicker.t-stagger-line "재귀적 자기개선 · 지금 보이는 신호"
- 6장 · 사진 위 글자 최악 5% 대비 3.62:1 < 4.5 — span.tag "2차 · 자체 보고"
- 6장 · 사진 위 글자 최악 5% 대비 4.23:1 < 4.5 — span.tag "2차"
- 6장 · 사진 위 글자 최악 5% 대비 3.07:1 < 4.5 — span.tag "직접"
- 6장 · 사진 위 글자 최악 5% 대비 3.89:1 < 4.5 — span.source.credit "배경: AI 생성 이미지(Gemini) · Sema"
- 6장 · 사진 위 글자 최악 5% 대비 2.25:1 < 4.5 — span.pg "6 / 34"
- 6장 · 사진 위 글자 최악 5% 대비 2.18:1 < 4.5 — b "6"
- 6장 · 사진 위 글자 최악 5% 대비 2.85:1 < 4.5 — span.tot "34"
- 9장 · 사진 위 글자 최악 5% 대비 4.16:1 < 4.5 — span.vcap "영상 · OpenAI 라이브(2025-10-28)7"
- 18장 · 사진 위 글자 최악 5% 대비 3.23:1 < 4.5 — div.kicker.t-stagger-line "실제 고용 3 · 신입 채용 · 관계식 R4"
- 18장 · 사진 위 글자 최악 5% 대비 2.3:1 < 3 — span.t-digit-group "91→28"
- 18장 · 사진 위 글자 최악 5% 대비 2.92:1 < 3 — small "%"
- 18장 · 사진 위 글자 최악 5% 대비 4.39:1 < 4.5 — div.k "한국 공인회계사 합격자 중 수습 회계사로 등록한 비"
- 18장 · 사진 위 글자 최악 5% 대비 3.64:1 < 4.5 — p.relation.t-stagger-line "AI 능력이 두 배가 될 때마다 미국 격차 약 1."
- 18장 · 사진 위 글자 최악 5% 대비 3.84:1 < 4.5 — span.source.credit "배경: AI 생성 이미지(Gemini) · 한국은행"
- 18장 · 사진 위 글자 최악 5% 대비 2.65:1 < 4.5 — span.pg "18 / 34"
- 18장 · 사진 위 글자 최악 5% 대비 2.37:1 < 4.5 — b "18"
- 18장 · 사진 위 글자 최악 5% 대비 2.53:1 < 4.5 — span.tot "34"
- 19장 · 사진 위 글자 최악 5% 대비 3.02:1 < 4.5 — div.kicker.t-stagger-line "로봇 학습 데이터"
- 19장 · 사진 위 글자 최악 5% 대비 2.97:1 < 3 — small "개월"
- 19장 · 사진 위 글자 최악 5% 대비 3.54:1 < 4.5 — div.k "인터넷 영상(약 10억 시간)이 로봇 조작 데이터("
- 19장 · 사진 위 글자 최악 5% 대비 3.95:1 < 4.5 — span.source.credit "배경: AI 생성 이미지(Gemini) · Waym"
- 19장 · 사진 위 글자 최악 5% 대비 3.26:1 < 4.5 — b "19"
- 19장 · 사진 위 글자 최악 5% 대비 4:1 < 4.5 — span.tot "34"

근거: [slide-06.jpg](../shots/baseline/slide-06.jpg) · [slide-09.jpg](../shots/baseline/slide-09.jpg) · [slide-18.jpg](../shots/baseline/slide-18.jpg) · [slide-19.jpg](../shots/baseline/slide-19.jpg)

### CON-03

실패 · 대비·데이터 마크 · automated · 구현 partial

> 값을 담은 선·막대·점·영역은 배경 대비 3:1 이상이고, WARN 색을 쓰면 직접 라벨이 함께 있다  
> 기준: 데이터 마크 ≥3:1 또는 같은 마크에 직접 라벨, validate_palette FAIL 0

실패 7건 · 장 5, 10, 13, 17, 26

- 10장 · agi_forecast_shift circle.b-neutral #cac7c2 대비 1.69:1(<3) — 9개 중 3개 직접 라벨 없음
- 13장 · occ_scatter circle.dot #dad8d4 대비 1.43:1(<3) — 634개 중 543개 직접 라벨 없음
- 17장 · kr_occupation_index circle.b-neutral #cac7c2 대비 1.69:1(<3) — 7개 중 5개 직접 라벨 없음
- 26장 · proj_kr_jobs circle.b-neutral #cac7c2 대비 1.69:1(<3) — 22개 중 8개 직접 라벨 없음
- 5장 · 도식 chain 연결선 path.edge #a19e99 대비 2.67:1(<3) — 8개
- 5장 · 도식 chain 화살촉 #ar #a19e99 대비 2.67:1(<3) — 10개
- 5장 · 도식 chain 화살촉 #ar 색 #a19e99이 선 색 #4c5eb2·#141210와 다름(공용 화살촉) — 2개

- 메모: validate_palette.js(dataviz 스킬)는 이 환경 경로가 고정돼 있지 않아 돌리지 않음 — 마크 색 대비를 직접 잼

근거: [slide-05.jpg](../shots/baseline/slide-05.jpg) · [slide-10.jpg](../shots/baseline/slide-10.jpg) · [slide-13.jpg](../shots/baseline/slide-13.jpg) · [slide-17.jpg](../shots/baseline/slide-17.jpg) · [slide-26.jpg](../shots/baseline/slide-26.jpg)

### CON-04

실패 · 대비·투사 환경 · both · 구현 auto+manual

> 프로젝터·압축 환경 모사에서도 본문·눈금을 읽고 인접 계열을 구분한다  
> 기준: 인접 계열 ΔL* ≥15, 판독 불가 항목 0

실패 4건 · 장 11, 17, 24, 26

- 11장 · espai_two_clocks 프로젝터 모사 인접 계열 ΔL* 8.1(<15)
- 17장 · kr_occupation_index 프로젝터 모사 인접 계열 ΔL* 8.1(<15)
- 24장 · proj_capability 프로젝터 모사 인접 계열 ΔL* 8.1(<15)
- 26장 · proj_kr_jobs 프로젝터 모사 인접 계열 ΔL* 8.1(<15)

근거: [slide-11.jpg](../shots/baseline/slide-11.jpg) · [slide-17.jpg](../shots/baseline/slide-17.jpg) · [slide-24.jpg](../shots/baseline/slide-24.jpg) · [slide-26.jpg](../shots/baseline/slide-26.jpg)

수동 확인 절차: ImageMagick으로 34장 PNG에 대비 −30%·감마 1.4를 적용하고, 차트별 인접 계열 L* 차를 계산한 뒤 장별 체크표를 채운다
볼 것: [sim-07-gray.jpg](../shots/baseline/sim-07-gray.jpg) · [sim-07-protan.jpg](../shots/baseline/sim-07-protan.jpg) · [sim-07-deutan.jpg](../shots/baseline/sim-07-deutan.jpg) · [sim-07-projector.jpg](../shots/baseline/sim-07-projector.jpg) · [sim-10-gray.jpg](../shots/baseline/sim-10-gray.jpg) · [sim-10-protan.jpg](../shots/baseline/sim-10-protan.jpg) · [sim-10-deutan.jpg](../shots/baseline/sim-10-deutan.jpg) · [sim-10-projector.jpg](../shots/baseline/sim-10-projector.jpg) · [sim-11-gray.jpg](../shots/baseline/sim-11-gray.jpg) · [sim-11-protan.jpg](../shots/baseline/sim-11-protan.jpg) · [sim-11-deutan.jpg](../shots/baseline/sim-11-deutan.jpg) · [sim-11-projector.jpg](../shots/baseline/sim-11-projector.jpg)

### CON-05

실패 · 대비·고대비 모드 · visual · 구현 auto+manual

> prefers-contrast: more와 forced-colors에서 라벨 경계와 차트 계열이 구분된다  
> 기준: 계열 구분 실패 0, 라벨 알약 경계 보임

실패 4건 · 장 1, 7, 13, 17

- 1장 · forced-colors에서 라벨 알약 3/3개 경계 없음(테두리·외곽선 0, 바탕·그림자는 지워짐): div.kicker, span.pill, span.pill.on
- 7장 · forced-colors에서 라벨 알약 2/2개 경계 없음(테두리·외곽선 0, 바탕·그림자는 지워짐): div.kicker.t-stagger-line, span.tag
- 13장 · forced-colors에서 라벨 알약 2/2개 경계 없음(테두리·외곽선 0, 바탕·그림자는 지워짐): div.kicker.t-stagger-line, span.tag
- 17장 · forced-colors에서 라벨 알약 2/2개 경계 없음(테두리·외곽선 0, 바탕·그림자는 지워짐): div.kicker.t-stagger-line, span.tag

- 메모: 강제 색 모드(Emulation forced-colors: active)에서 라벨 알약(.tag·.kicker·.pill)에 1px 이상 테두리나 외곽선이 남는지 계산 스타일로 본다. 차트 계열 구분은 캡처를 사람이 본다

근거: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-13.jpg](../shots/baseline/slide-13.jpg) · [slide-17.jpg](../shots/baseline/slide-17.jpg)

수동 확인 절차: Playwright emulateMedia({forcedColors:'active'})와 CDP prefers-contrast: more로 표지와 차트 장을 캡처해 확인한다
볼 것: [con05-forced-s01.jpg](../shots/baseline/con05-forced-s01.jpg) · [con05-forced-s07.jpg](../shots/baseline/con05-forced-s07.jpg) · [con05-forced-s13.jpg](../shots/baseline/con05-forced-s13.jpg) · [con05-forced-s17.jpg](../shots/baseline/con05-forced-s17.jpg) · [con05-more-s01.jpg](../shots/baseline/con05-more-s01.jpg) · [con05-more-s07.jpg](../shots/baseline/con05-more-s07.jpg) · [con05-more-s13.jpg](../shots/baseline/con05-more-s13.jpg) · [con05-more-s17.jpg](../shots/baseline/con05-more-s17.jpg)

### GRAD-01

통과 · 그라데이션 · automated · 구현 auto

> 그라데이션은 같은 색 계열의 미세한 것만 쓰고 보라→파랑은 없다  
> 기준: 정지점 간 ΔL ≤0.08, ΔC ≤0.04, 색상각 차 ≤20°, 280~320°→240~270° 조합 0

- 메모: 가상 요소(::after) 그라데이션은 CSS 원문에서 토큰을 풀어 잼

### GRAD-02

통과 · 그라데이션 · both · 구현 auto+manual

> 그라데이션을 쓴 장은 소수이고 의미 구분에는 쓰지 않으며, 그라데이션 글자는 대비를 다시 확인한다  
> 기준: 그라데이션 장 ≤8(34장의 1/4), 의미 구분 용도 0, 그라데이션 글자 대비 통과

수동 확인 절차: 그라데이션 사용 장 수를 세고, background-clip:text 요소는 양 끝 색으로 CON-01 계산을 한다. lint gradient 건은 README에 사유를 적는다
볼 것: [slide-06.jpg](../shots/baseline/slide-06.jpg) · [slide-18.jpg](../shots/baseline/slide-18.jpg) · [slide-19.jpg](../shots/baseline/slide-19.jpg)

### GRAD-03

통과 · 그라데이션·효과 · automated · 구현 auto

> radial glow, 유리 패널, 네온 테두리, 반복 패턴 배경이 슬라이드 안에 없다  
> 기준: 슬라이드 내부 0, backdrop-filter 요소 ≤1(고정 오버레이)

### TYP-01

통과 · 타이포·서체 · automated · 구현 auto

> 모든 글자가 로컬 Pretendard Variable 하나로 실제 렌더되고 모노스페이스는 없다  
> 기준: 플랫폼 폰트 'Pretendard Variable' 1종, 다른 font-family 지정 0, mono 0

- 메모: 공개 URL의 글꼴 확인은 --public=URL로 돌린다

### TYP-02

실패 · 타이포·프리셋 · automated · 구현 auto

> 글자 크기는 이름 붙은 프리셋 9단계 이하만, 굵기는 400·600·700만 쓴다(SVG·JS 포함)  
> 기준: 크기 ≤9종이고 모두 tokens.css 프리셋, 굵기 집합 = {400,600,700}

실패 7건 · 장 5, 7, 10, 17, 24

- 5장 · svg 축소로 프리셋 밖 실효 크기 19.5px — 장 5,14,27
- 5장 · svg 축소로 프리셋 밖 실효 크기 13px — 장 5
- 7장 · svg 축소로 프리셋 밖 실효 크기 18.5px — 장 7
- 10장 · svg 축소로 프리셋 밖 실효 크기 18.2px — 장 10,11
- 17장 · svg 축소로 프리셋 밖 실효 크기 18.8px — 장 17
- 24장 · svg 축소로 프리셋 밖 실효 크기 19.4px — 장 24
- charts.js:87 font-size 15 하드코딩(프리셋 밖)

근거: [slide-05.jpg](../shots/baseline/slide-05.jpg) · [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-10.jpg](../shots/baseline/slide-10.jpg) · [slide-17.jpg](../shots/baseline/slide-17.jpg) · [slide-24.jpg](../shots/baseline/slide-24.jpg)

### TYP-03

실패 · 타이포·최소 크기 · automated · 구현 auto

> 읽어야 할 모든 글자(차트 눈금·범례·직접 라벨 포함)는 1920 기준 18px 이상이고, 14~17px는 출처·쪽 번호·n 캡션 같은 3차 정보에만 쓴다  
> 기준: tiny 0, 비3차 18px 미만 0(범례 포함), 14px 미만 0

실패 120건 · 장 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34

- 1장 · 14px 3차 정보 아님: span "데이터리터러시의이해 중간고사 과제"
- 1장 · 14px 3차 정보 아님: span "주제 설명과 데이터분석 계획 · 2026-10-16"
- 1장 · 14px 3차 정보 아님: div.kicker "AI가 AI 개발을 돕기 시작한 뒤의 10년"
- 3장 · 14px 3차 정보 아님: div.kicker.t-stagger-line "이 발표가 답하려는 것"
- 4장 · 14px 3차 정보 아님: div.kicker.t-stagger-line "결론 먼저"
- 4장 · 14px 3차 정보 아님: span.tag "기술"
- 4장 · 14px 3차 정보 아님: span.tag "한국은행"
- 4장 · 14px 3차 정보 아님: span.tag.est "추정"
- 5장 · 14px 3차 정보 아님: div.kicker.t-stagger-line "전체 구조"
- 5장 · 12.97px(<14): text.n-s "학습 연산 연 4.1배" (svg 축소 0.811)
- 5장 · 12.97px(<14): text.n-s "전력은 연 15% 증가" (svg 축소 0.811)
- 5장 · 12.97px(<14): text.n-s "맡을 수 있는 업무 크기" (svg 축소 0.811)
- 5장 · 12.97px(<14): text.n-s "105일마다 두 배" (svg 축소 0.811)
- 5장 · 12.97px(<14): text.n-s "사내 코드 75~90% AI 작성" (svg 축소 0.811)
- 5장 · 12.97px(<14): text.n-s "능력 2배마다 AGI 3.2년 당김" (svg 축소 0.811)
- 5장 · 12.97px(<14): text.n-s "코딩 · 상담 · 사무" (svg 축소 0.811)
- 5장 · 12.97px(<14): text.n-s "신입 업무부터" (svg 축소 0.811)
- 5장 · 12.97px(<14): text.n-s "원격조작 · 시뮬레이션" (svg 축소 0.811)
- 5장 · 12.97px(<14): text.n-s "데이터 기업이 축적" (svg 축소 0.811)
- 5장 · 12.97px(<14): text.n-s "생산 · 물류 · 판매 현장" (svg 축소 0.811)
- 5장 · 12.97px(<14): text.n-s "3~8년 늦게 같은 변화" (svg 축소 0.811)
- 5장 · 12.97px(<14): text.n-s "① 신입 채용이 먼저 줄고" (svg 축소 0.811)
- 5장 · 12.97px(<14): text.n-s "② 기존 인력의 업무가 바뀌고" (svg 축소 0.811)
- 5장 · 12.97px(<14): text.n-s "③ 인구 감소와 겹쳐 총량에 반영" (svg 축소 0.811)
- 5장 · 12.97px(<14): text.e-l "전력이 속도를 제한(2030년 전후)" (svg 축소 0.811)
- … 외 95건(JSON 보고서에 전부)

- 메모: 3차 정보는 .foot·.source·.chart-src·.pg·.credit·'n=' 캡션으로 좁게 본다. fit.js TERTIARY는 공통 deck-fit.js보다 16개 넓다(.band.head-band p, .gates td.yr span, .video .vcap, .chain text, .plug, .credit…) — fit 보고의 '예외로 넘김' 228개

근거: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-05.jpg](../shots/baseline/slide-05.jpg) · [slide-06.jpg](../shots/baseline/slide-06.jpg) · [slide-07.jpg](../shots/baseline/slide-07.jpg)

### TYP-04

실패 · 타이포·청중 본문 · automated · 구현 auto

> 화면 공유로 읽어야 하는 본문 문단은 24px 이상을 목표로 한다  
> 기준: 본문 문단 ≥24px, 20px로 남긴 블록은 README에 장·사유 기록(미기록 0)

실패 25건 · 장 3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 29, 30, 32, 33

- 3장 · 본문 문단 20px(<24) 3개: p "AI가 맡을 수 있는 업무 크기가 두 배가 되는 데"
- 6장 · 본문 문단 20px(<24) 3개: p "2024년 10월 → 2026년 4월. Anthro"
- 7장 · 본문 문단 16px(<24) 1개: p.chart-sub "세로축은 AI가 절반 이상 성공하는 과제를 사람이 "
- 8장 · 본문 문단 20px(<24) 3개: p "2019년 이후 전체"
- 9장 · 본문 문단 14/16px(<24) 6개: p.name "OpenAI · 샘 올트먼"
- 10장 · 본문 문단 20px(<24) 2개: p "2016년 설문과 2024년 설문 사이 19년 앞당"
- 11장 · 본문 문단 20px(<24) 4개: p "AGI가 온 뒤 모든 직업이 자동화되기까지"
- 12장 · 본문 문단 20px(<24) 4개: p "McKinsey 추정 · 지금 하는 업무의 절반이 "
- 13장 · 본문 문단 20px(<24) 3개: p "Spearman 순위 상관"
- 14장 · 본문 문단 20px(<24) 3개: p "노출 상위 10% 직업 77개"
- 15장 · 본문 문단 20px(<24) 4개: p "18개 직업 대분류 중 음의 상관이 나온 곳"
- 16장 · 본문 문단 20px(<24) 2개: p "노출도를 넣어 늘어난 설명력"
- 17장 · 본문 문단 20px(<24) 2개: p "2019→2025. 줄어든 판매직은 AI 노출이 낮"
- 18장 · 본문 문단 20px(<24) 1개: p.relation.t-stagger-line "AI 능력이 두 배가 될 때마다 미국 격차 약 1."
- 20장 · 본문 문단 16/20px(<24) 2개: p.plug "로봇 연구자 Levine의 예상(약 5년)과도 비슷"
- 21장 · 본문 문단 20px(<24) 4개: p "가장 큰 AI 모델 학습에 드는 전력"
- 22장 · 본문 문단 20px(<24) 2개: p "오가노이드 칩 CL1은 뉴런 약 80만 개, 대당 "
- 23장 · 본문 문단 20px(<24) 1개: p.lead "같은 AI 능력이라도 몸을 많이 쓰는 직업일수록 늦"
- 25장 · 본문 문단 20px(<24) 2개: p "큰 숫자는 대체가 본격화하는 해(회사 절반이 도입)"
- 26장 · 본문 문단 20px(<24) 3개: p "기준 시나리오 2036년"
- 27장 · 본문 문단 20px(<24) 2개: p "판매와 생산·조작은 몇 년 늦게 시작하지만 2036"
- 29장 · 본문 문단 20px(<24) 8개: p.yr "2026 ~ 2027"
- 30장 · 본문 문단 14/20px(<24) 10개: p.a "AI 영향으로 볼 수 있는 근거"
- 32장 · 본문 문단 14px(<24) 1개: p.k "일정 (계획)"
- 33장 · 본문 문단 20px(<24) 3개: p "AI가 일자리를 '줄였다'(인과) · 2036년 숫"

근거: [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-06.jpg](../shots/baseline/slide-06.jpg) · [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-08.jpg](../shots/baseline/slide-08.jpg) · [slide-09.jpg](../shots/baseline/slide-09.jpg) · [slide-10.jpg](../shots/baseline/slide-10.jpg)

### TYP-05

실패 · 타이포·행간 · automated · 구현 auto

> 행간은 4px 배수이고 세 줄 이상 블록은 충분히 넓으며 프리셋 행간 비율은 크기가 커질수록 같거나 작아진다  
> 기준: 4 배수 아님·normal 0, 3줄 이상 ≥1.2, 본문 프리셋 ≥1.5, 단조 위반 0

실패 4건 · 장 1

- 1장 · 3줄 이상 행간 비 <1.2: h1.t "AI는 언제쯤내 일을대신하게 될까요" 1.1
- 프리셋 행간 비 단조 위반: --t-label 1.43 → --t-caption 1.5
- 프리셋 행간 비 단조 위반: --t-caption-strong 1.5 → --t-body 1.6
- 프리셋 행간 비 단조 위반: --t-h3 1.25 → --t-headline 1.33

근거: [slide-01.jpg](../shots/baseline/slide-01.jpg)

### TYP-06

실패 · 타이포·잘림 · automated · 구현 auto

> 어떤 텍스트도 말줄임으로 잘리지 않는다. 출처는 두 줄까지 허용한다  
> 기준: 모두 0건, deck.css에 text-overflow:ellipsis 0

실패 1건

- deck.css에 text-overflow: ellipsis

### TYP-07

실패 · 타이포·줄바꿈 · automated · 구현 auto

> 한글은 keep-all이고 마지막 줄에 한두 글자만 남는 고아 줄이 없다  
> 기준: 줄 수 ≥2인 요소 중 마지막 줄 ≤2글자 또는 1어절 0, keep-all 아닌 한글 요소 0

실패 17건 · 장 1, 4, 9, 13, 15, 17, 19, 27, 29, 30, 31, 32

- 1장 · 고아 줄 '추정했습니다.'(7자): p.s "AI가 맡을 수 있는 일이 얼마나 빨리 커지는지 그"
- 4장 · 고아 줄 '한국은행'(4자): div.k "2022~2026년 한국 청년 일자리 감소 28.5"
- 9장 · 고아 줄 '~2027년'(6자): p.quote "강력한 AI는 빠르면 2026년 말~2027년"
- 13장 · 고아 줄 '0.033'(5자): p "노출 지표를 Microsoft·Anthropic 것"
- 15장 · 고아 줄 '덮습니다.'(5자): p "경영·재무·관리처럼 노출이 큰 대분류가 경기 덕에 "
- 17장 · 고아 줄 '−17.6%'(6자): h3 "전문가 +19.7% · 사무 +8.7% · 판매 −"
- 17장 · 고아 줄 '(잠정)'(4자): p "한국고용정보원과 국회예산정책처도 노출도와 취업자 증"
- 19장 · 고아 줄 '건(2026-03)'(10자): div.k "Waymo 무인 택시의 주간 유료 운행이 두 배가 "
- 27장 · 고아 줄 '이릅니다'(4자): p "판매와 생산·조작은 몇 년 늦게 시작하지만 2036"
- 29장 · 고아 줄 '줄었습니다.'(6자): p "AI가 하루짜리 업무(2026년)와 한 주짜리 업무"
- 29장 · 고아 줄 '시작합니다.'(6자): p "한 달짜리 업무까지 가능(2028년). 사무직은 2"
- 30장 · 고아 줄 'Fed)'(4자): p.c "원격근무가 미국 청년 대졸 실업 증가의 64%를 설"
- 30장 · 고아 줄 '(Challenger)'(12자): p.a "미국 감원 발표의 AI 사유가 2026년 1~9월 "
- 31장 · 고아 줄 '(4·5주)'(6자): td "평균·중앙값·SD(ddof 명시) · z와 IQR "
- 32장 · 고아 줄 '(7주)'(4자): td "산점도 · Pearson/Spearman · 이상치"
- 32장 · 고아 줄 '패널'(2자): td "2023년 전후 × 노출 상하위 × 청년/중장년 패"
- 32장 · 고아 줄 '갱신'(2자): td "새 실측으로 관계식 재추정 → 2036 경로 갱신"

근거: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-09.jpg](../shots/baseline/slide-09.jpg) · [slide-13.jpg](../shots/baseline/slide-13.jpg) · [slide-15.jpg](../shots/baseline/slide-15.jpg) · [slide-17.jpg](../shots/baseline/slide-17.jpg)

### TYP-08

실패 · 타이포·헤드라인 · automated · 구현 auto

> 헤드라인(표지 h1 포함)은 2줄 이하이고 2줄이면 직접 넣은 의미 단위 줄바꿈이다  
> 기준: 3줄 이상 0, 자동 줄바꿈 2줄 0

실패 1건 · 장 1

- 1장 · 헤드라인 3줄(>2): "AI는 언제쯤내 일을대신하게 될까요"

근거: [slide-01.jpg](../shots/baseline/slide-01.jpg)

### TYP-09

실패 · 타이포·크기 위계 · automated · 구현 auto

> 장 안 크기 대비가 충분하고 경쟁하는 제목 크기가 없으며 장당 글자 크기는 5종 이하다  
> 기준: 최대/본문 ≥2.4, 두 번째/최대 <0.75, 고유 크기 ≤5, 이웃 비 <1.15 쌍 0

실패 56건 · 장 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34

- 1장 · 이웃 크기 비 1.14(<1.15): 16/14
- 2장 · 최대/본문 1(<2.4): 64/64
- 3장 · 이웃 크기 비 1.14(<1.15): 16/14
- 4장 · 고유 크기 6(>5): 96,48,24,20,16,14
- 4장 · 이웃 크기 비 1.14(<1.15): 16/14
- 5장 · 고유 크기 6(>5): 48,20,19,16,14,13
- 5장 · 이웃 크기 비 1.05(<1.15): 20/19
- 6장 · 이웃 크기 비 1.14(<1.15): 16/14
- 7장 · 이웃 크기 비 1.14(<1.15): 16/14
- 8장 · 둘째 크기/최대 0.75(≥0.75): 48/64
- 8장 · 고유 크기 6(>5): 64,48,24,20,16,14
- 8장 · 이웃 크기 비 1.14(<1.15): 16/14
- 9장 · 이웃 크기 비 1.14(<1.15): 16/14
- 10장 · 고유 크기 6(>5): 48,24,20,18,16,14
- 10장 · 이웃 크기 비 1.11(<1.15): 20/18
- 11장 · 둘째 크기/최대 0.75(≥0.75): 48/64
- 11장 · 고유 크기 7(>5): 64,48,24,20,18,16,14
- 11장 · 이웃 크기 비 1.11(<1.15): 20/18
- 12장 · 고유 크기 6(>5): 96,48,24,20,16,14
- 12장 · 이웃 크기 비 1.14(<1.15): 16/14
- 13장 · 둘째 크기/최대 0.75(≥0.75): 48/64
- 13장 · 이웃 크기 비 1.14(<1.15): 16/14
- 14장 · 둘째 크기/최대 0.75(≥0.75): 48/64
- 14장 · 고유 크기 7(>5): 64,48,24,20,19,16,14
- 14장 · 이웃 크기 비 1.05(<1.15): 20/19
- … 외 31건(JSON 보고서에 전부)

근거: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-02.jpg](../shots/baseline/slide-02.jpg) · [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-05.jpg](../shots/baseline/slide-05.jpg) · [slide-06.jpg](../shots/baseline/slide-06.jpg)

### TYP-10

실패 · 타이포·자간·대문자 · automated · 구현 auto

> 한글 자간은 −0.02em보다 좁히지 않고, 16px 이하 라벨은 0 이상이며, 자간 넓힌 대문자 마이크로 라벨이 없다  
> 기준: 한글 < −0.02em 0, 16px 이하 음수 0, 대문자 라벨 규칙 위반 0

실패 298건 · 장 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34

- 1장 · 16px 이하 음수 자간 -0.014em: span "데이터리터러시의이해 중간고사 과제"
- 1장 · 16px 이하 음수 자간 -0.014em: span "주제 설명과 데이터분석 계획 · 2026-10-16"
- 1장 · 한글 자간 -0.04em(< −0.02): h1.t "AI는 언제쯤내 일을대신하게 될까요"
- 1장 · 한글 자간 -0.04em(< −0.02): span.hl "대신하게 될까요"
- 1장 · 16px 이하 음수 자간 -0.012em: span.source.credit "사진: AI 생성 이미지(Gemini) · 모든 수"
- 1장 · 16px 이하 음수 자간 -0.012em: span.pg "1 / 34"
- 1장 · 16px 이하 음수 자간 -0.012em: b "1"
- 1장 · 16px 이하 음수 자간 -0.012em: span.tot "34"
- 2장 · 한글 자간 -0.045em(< −0.02): span.t-stagger-line "AI 회사들은"
- 2장 · 한글 자간 -0.045em(< −0.02): span.t-stagger-line "다음 AI를 만드는 데"
- 2장 · 한글 자간 -0.045em(< −0.02): span.t-stagger-line "AI를 쓰기 시작했고"
- 2장 · 한글 자간 -0.045em(< −0.02): span.t-stagger-line "그 뒤로 발전 속도가"
- 2장 · 한글 자간 -0.045em(< −0.02): span.t-stagger-line "더 빨라졌습니다"
- 2장 · 16px 이하 음수 자간 -0.012em: span.source.credit "사진: AI 생성 이미지(Gemini) · 이처럼 "
- 2장 · 16px 이하 음수 자간 -0.012em: span.pg "2 / 34"
- 2장 · 16px 이하 음수 자간 -0.012em: b "2"
- 2장 · 16px 이하 음수 자간 -0.012em: span.tot "34"
- 3장 · 한글 자간 -0.03em(< −0.02): h2.headline.t-stagger-line "세 가지를 차례로 확인합니다"
- 3장 · 16px 이하 음수 자간 -0.012em: span.source "AGI 정의는 회사마다 다릅니다. 정의가 다른 지표"
- 3장 · 16px 이하 음수 자간 -0.012em: span.pg "3 / 34"
- 3장 · 16px 이하 음수 자간 -0.012em: b "3"
- 3장 · 16px 이하 음수 자간 -0.012em: span.tot "34"
- 4장 · 한글 자간 -0.03em(< −0.02): h2.headline.t-stagger-line "결론은 세 숫자입니다"
- 4장 · 16px 이하 음수 자간 -0.014em: span.tag "기술"
- 4장 · 16px 이하 음수 자간 -0.014em: span.tag "n=3"
- … 외 273건(JSON 보고서에 전부)

근거: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-02.jpg](../shots/baseline/slide-02.jpg) · [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-05.jpg](../shots/baseline/slide-05.jpg) · [slide-06.jpg](../shots/baseline/slide-06.jpg)

### TYP-11

실패 · 타이포·숫자 · automated · 구현 auto

> 한 장의 80px 이상 영웅 숫자는 1개, 96px hero 프리셋은 덱 전체 2장 이하. 영웅 숫자는 비례 숫자, 표·눈금은 tabular-nums  
> 기준: 80px 숫자 ≥2 장 0, hero 장 ≤2, 규칙 위반 0

실패 48건 · 장 4, 12, 16, 18, 19, 21, 23, 31, 32, 34

- 4장 · 80px 이상 숫자 3개: 105 · 3.5 · 94
- 12장 · 80px 이상 숫자 2개: 2045 · 29.5
- 16장 · 표 숫자 tabular-nums 아님: td "−0.006"
- 16장 · 표 숫자 tabular-nums 아님: td "0.089"
- 16장 · 표 숫자 tabular-nums 아님: td "0.079"
- 16장 · 표 숫자 tabular-nums 아님: td "0.089 (학습 R² 0.501 → 과적합 신호)"
- 16장 · 표 숫자 tabular-nums 아님: td "0.103"
- 18장 · 80px 이상 숫자 3개: 28.5 · 19 · 91→28
- 19장 · 80px 이상 숫자 3개: 6.6 · 2.5 · 3,333
- 21장 · 80px 이상 숫자 2개: 2.9 · 15
- 23장 · 표 숫자 tabular-nums 아님: td "105일 유지"
- 23장 · 표 숫자 tabular-nums 아님: td "2.6년"
- 23장 · 표 숫자 tabular-nums 아님: td "3년"
- 23장 · 표 숫자 tabular-nums 아님: td "129일 → 2028년부터 188일"
- 23장 · 표 숫자 tabular-nums 아님: td "4년"
- 23장 · 표 숫자 tabular-nums 아님: td "5년"
- 23장 · 표 숫자 tabular-nums 아님: td "188일 → 2028년부터 1년"
- 23장 · 표 숫자 tabular-nums 아님: td "6년"
- 23장 · 표 숫자 tabular-nums 아님: td "8년"
- 31장 · 표 숫자 tabular-nums 아님: td "1 질문"
- 31장 · 표 숫자 tabular-nums 아님: td "AI 노출이 높은 직업일수록 2023년 이후 청년·"
- 31장 · 표 숫자 tabular-nums 아님: td "조작적 정의: 노출 = Eloundou β를 한국 "
- 31장 · 표 숫자 tabular-nums 아님: td "2 확보"
- 31장 · 표 숫자 tabular-nums 아님: td "KOSIS 지역별고용조사 직업 중분류 × 연령(한 "
- 31장 · 표 숫자 tabular-nums 아님: td "sources.csv에 URL·행 수·해시 (2주)"
- … 외 23건(JSON 보고서에 전부)

근거: [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-12.jpg](../shots/baseline/slide-12.jpg) · [slide-16.jpg](../shots/baseline/slide-16.jpg) · [slide-18.jpg](../shots/baseline/slide-18.jpg) · [slide-19.jpg](../shots/baseline/slide-19.jpg) · [slide-21.jpg](../shots/baseline/slide-21.jpg)

### TYP-12

실패 · 타이포·정렬 · automated · 구현 auto

> 40px 이상 문장은 2줄 이하, 3줄 이상 가운데 정렬·양쪽 정렬 없음, 본문 줄 길이 과폭 없음  
> 기준: 40px+ 3줄 0, center 3줄+ 0, justify 0, 한글 줄당 >45자 0

실패 16건 · 장 1, 6, 7, 10, 11, 13, 17, 21, 22, 23, 24, 26

- 1장 · 80px 문장 3줄: h1.t "AI는 언제쯤내 일을대신하게 될까요"
- 6장 · 줄당 54자(>45): p "2024년 10월 → 2026년 4월. Anthro"
- 6장 · 줄당 53자(>45): p "2025년 10월 "2026년 9월 인턴, 2028"
- 7장 · 줄당 61자(>45): p.chart-sub "세로축은 AI가 절반 이상 성공하는 과제를 사람이 "
- 7장 · 줄당 48자(>45): p.chart-src "METR Time Horizon 1.1 원본 YAM"
- 10장 · 줄당 59자(>45): p.chart-src "AI Impacts 전문가 설문(직접) · Meta"
- 11장 · 줄당 59자(>45): p.chart-src "같은 설문에서 같은 전문가들에게 물은 두 예상 연도"
- 13장 · 줄당 66자(>45): p.chart-src "점 하나 = 직업 하나(2022년 고용 1만 명 이"
- 17장 · 줄당 67자(>45): p.chart-src "2019년 = 100 · 세로축 80부터(변화 비교"
- 21장 · 줄당 50자(>45): p "IEA 415TWh(2024) → 945TWh(20"
- 22장 · 줄당 49자(>45): p "오가노이드 칩 CL1은 뉴런 약 80만 개, 대당 "
- 22장 · 줄당 57자(>45): p "Intel Hala Point 15 TOPS/W 이"
- 23장 · 줄당 48자(>45): p.lead "같은 AI 능력이라도 몸을 많이 쓰는 직업일수록 늦"
- 23장 · 줄당 78자(>45): p.chart-src "회사 도입 2.6년 = ChatGPT 출시 뒤 한국"
- 24장 · 줄당 101자(>45): p.chart-src "세 시나리오 모두 같은 결론 · 출발점 Claude"
- 26장 · 줄당 84자(>45): p.chart-src "대체 압력 = AI·자동화 고위험 일자리 × 실제로"

근거: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-06.jpg](../shots/baseline/slide-06.jpg) · [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-10.jpg](../shots/baseline/slide-10.jpg) · [slide-11.jpg](../shots/baseline/slide-11.jpg) · [slide-13.jpg](../shots/baseline/slide-13.jpg)

### TYP-13

실패 · 타이포·꾸밈 · automated · 구현 auto

> 헤드라인 안 단어를 이탤릭·다른 서체·다른 색·밑줄로 꾸미지 않고, 이모지·장식 순번(01/02)이 없다  
> 기준: 모두 0

실패 2건 · 장 1, 5

- 1장 · 헤드라인 안 꾸밈(color): span.hl "대신하게 될까요"
- 5장 · 동그라미 장식 순번 ①②③

근거: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-05.jpg](../shots/baseline/slide-05.jpg)

### TYP-14

실패 · 타이포·로딩 · automated · 구현 auto

> 느린 회선에서도 글자 없는 표지가 오래 보이지 않는다  
> 기준: font-display:block 0, preload 존재, 첫 글꼴 ≤1MB 또는 분할, h1 표시 ≤1.5s(최악 3s 초과 0)

실패 4건

- font-display: block
- 글꼴 preload 없음
- 첫 글꼴 PretendardVariable.woff2 1.96MB(>1MB, 분할 없음)
- Slow 4G 근사에서 글꼴 적용(h1 표시) 12초 안에 없음(>1500ms, 최악 3초 초과)

- 메모: CDP 네트워크 제한(150ms RTT·1.6Mbps)·CPU 4배로 근사. 실제 회선·기기 아님

### TXT-01

실패 · 문장·문장부호 · automated · 구현 auto

> 헤드라인·제목·소제목·인용·차트 제목·<title>·og:title에 쉼표와 콜론이 없다  
> 기준: 0건

실패 2건 · 장 16, 22

- 16장 · 제목류 쉼표·콜론: th "모형(2023→2025 고용 변화, 743개 직업)"
- 22장 · 제목류 쉼표·콜론: h3 "하는 일이 달라 직접 비교는 아니지만 뇌는 20W,"

근거: [slide-16.jpg](../shots/baseline/slide-16.jpg) · [slide-22.jpg](../shots/baseline/slide-22.jpg)

### TXT-02

실패 · 문장·어미 · automated · 구현 auto

> 본문 문장은 ~습니다와 명사형 끝맺음을 섞고 '~다'로 끝나지 않는다  
> 기준: '~다' 끝 0, 습니다 ≥1이고 명사형 ≥1

실패 2건 · 장 5, 31

- 5장 · '~다'로 끝남: "이 로봇 데이터가 쌓이는 만큼 늦게 현장 일로 넘어간다"
- 31장 · '~다'로 끝남: "진단과 처리를 나눈다"

근거: [slide-05.jpg](../shots/baseline/slide-05.jpg) · [slide-31.jpg](../shots/baseline/slide-31.jpg)

### TXT-03

실패 · 문장·비유 · both · 구현 auto+manual

> 지어낸 비유·압축어·과장 수사·유행어가 없다  
> 기준: 매치 0, 수동 목록 0

실패 1건 · 장 12

- 12장 · 금지 표현: the future of

근거: [slide-12.jpg](../shots/baseline/slide-12.jpg)

수동 확인 절차: grep -nE "두 시계\|도착\|입구\|물결\|문턱\|배가당\|시계의 간격\|파도\|쓰나미\|혁신\|원활\|차세대\|게임 체인저\|충격\|종말\|재앙\|도태\|쓸모없\|the future of" $DECK/index.html, lint.mjs [copy], 이어서 전 장을 읽고 은유·압축 표현 목록을 만든다
볼 것: [contact-1.jpg](../shots/baseline/contact-1.jpg) · [contact-2.jpg](../shots/baseline/contact-2.jpg)

### TXT-04

실패 · 문장·전문용어 · both · 구현 auto+manual

> 전문용어·약어·기호(METR 시간지평, HLMI, r, R², n, CAGR, 배가 시간, 대체 압력, β, φ, R1 등)는 첫 등장 장에서 한 번 풀고, 이후 같은 이름만 쓰며 kicker에 내부 코드를 드러내지 않는다  
> 기준: 풀이 없는 첫 등장 0, 대표 이름 외 표현(첫 풀이 밖) 0, 화면 snake_case 0

실패 16건 · 장 7, 8, 10, 11, 14, 15, 16, 18, 20, 21, 24, 25, 26, 27

- 7장 · 화면 snake_case: benchmark_results_1_1, timeline_analysis
- 7장 · kicker 내부 코드: "AI 발전 속도 · 관계식 R1"
- 8장 · 화면 snake_case: timeline_analysis, ml_models
- 8장 · kicker 내부 코드: "AI 발전 속도 · 관계식 R1"
- 10장 · kicker 내부 코드: "전문가 예상 · 관계식 R2"
- 11장 · kicker 내부 코드: "전문가 예상 · 관계식 R3"
- 14장 · 화면 snake_case: occupation_analysis
- 15장 · 화면 snake_case: occupation_analysis
- 16장 · 화면 snake_case: ml_models
- 18장 · kicker 내부 코드: "실제 고용 3 · 신입 채용 · 관계식 R4"
- 20장 · kicker 내부 코드: "관계식 R6 · 로봇 데이터가 따라잡는 데 걸리는 시간"
- 21장 · kicker 내부 코드: "속도를 늦추는 요인 · 관계식 R5"
- 24장 · 화면 snake_case: projection_2036
- 25장 · 화면 snake_case: projection_2036
- 26장 · 화면 snake_case: projection_2036
- 27장 · 화면 snake_case: projection_2036

근거: [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-08.jpg](../shots/baseline/slide-08.jpg) · [slide-10.jpg](../shots/baseline/slide-10.jpg) · [slide-11.jpg](../shots/baseline/slide-11.jpg) · [slide-14.jpg](../shots/baseline/slide-14.jpg) · [slide-15.jpg](../shots/baseline/slide-15.jpg)

수동 확인 절차: domain.md 용어집을 기준으로 텍스트 추출본에서 각 용어 첫 등장 장과 풀이 문장을 표로 만들고 동의어·표기 변형(Deepmind, Open AI)을 grep한다
볼 것: [domain.md](../../presentation/design-standard/domain.md) · [contact-1.jpg](../shots/baseline/contact-1.jpg) · [contact-2.jpg](../shots/baseline/contact-2.jpg)

### TXT-05

실패 · 문장·중복 · both · 구현 auto+manual

> 한 장에서 제목·본문·결론이 같은 말을 되풀이하지 않고, 같은 숫자는 2회 이하, 연속 장 헤드라인도 겹치지 않는다  
> 기준: 유사도 ≥0.5 쌍 0, 같은 숫자 >2회 0, 메시지 2개 이상 장 0

실패 6건 · 장 6, 9, 25, 28, 30, 34

- 6장 · 같은 숫자 3회 이상: 2026×4
- 9장 · 같은 숫자 3회 이상: 2026×3, 2025×3
- 25장 · 같은 숫자 3회 이상: 2030×3
- 28장 · 같은 숫자 3회 이상: 25×3
- 30장 · 같은 숫자 3회 이상: 1×3
- 34장 · 같은 숫자 3회 이상: 2025×4, 2026×3

근거: [slide-06.jpg](../shots/baseline/slide-06.jpg) · [slide-09.jpg](../shots/baseline/slide-09.jpg) · [slide-25.jpg](../shots/baseline/slide-25.jpg) · [slide-28.jpg](../shots/baseline/slide-28.jpg) · [slide-30.jpg](../shots/baseline/slide-30.jpg) · [slide-34.jpg](../shots/baseline/slide-34.jpg)

수동 확인 절차: 장 내 블록 쌍과 연속 장 헤드라인의 2-gram 자카드, 장별 숫자 토큰 빈도를 계산한 뒤 장마다 '메시지 한 문장'을 적는다
볼 것: [contact-1.jpg](../shots/baseline/contact-1.jpg) · [contact-2.jpg](../shots/baseline/contact-2.jpg)

### TXT-06

실패 · 문장·헤드라인 · both · 구현 auto+manual

> 헤드라인은 주제명이 아닌 결론 문장이고 마침표가 없으며, 차트가 있는 장은 숫자를 포함한 결론이다. 자기 지시 표현이 없다  
> 기준: 마침표 끝 0, 차트 장 숫자 없음 0, 메타 표현 0, 주제명 판정 0

실패 5건 · 장 7, 13, 14, 17, 27

- 7장 · 차트 장 헤드라인에 숫자 없음: "AI가 맡을 수 있는 업무는 갈수록 빠르게 커집니다"
- 13장 · 차트 장 헤드라인에 숫자 없음: "그런데 직업 전체로 보면AI 노출도와 고용 변화는 아직 상관이 없습니다"
- 14장 · 차트 장 헤드라인에 숫자 없음: "다만 노출이 가장 큰 직업들은 이미 덜 늘고 있습니다"
- 17장 · 차트 장 헤드라인에 숫자 없음: "한국도 사무직·전문직 취업자는 아직 늘고 있습니다"
- 27장 · 차트 장 헤드라인에 숫자 없음: "사무직부터 시작해 판매와 생산 현장으로 이어집니다"

근거: [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-13.jpg](../shots/baseline/slide-13.jpg) · [slide-14.jpg](../shots/baseline/slide-14.jpg) · [slide-17.jpg](../shots/baseline/slide-17.jpg) · [slide-27.jpg](../shots/baseline/slide-27.jpg)

수동 확인 절차: 헤드라인 끝 문자, 차트 장 헤드라인·차트 제목의 숫자 포함, /이 장\|보여줍니다\|살펴봅니다\|알아봅니다\|현황\|추이/ 매치를 검사하고 34개를 읽어 주장/주제명 판정한다
볼 것: [contact-1.jpg](../shots/baseline/contact-1.jpg) · [contact-2.jpg](../shots/baseline/contact-2.jpg)

### TXT-07

통과 · 문장·기기 독립 · automated · 구현 auto

> 슬라이드 본문에 입력 방식·배치에 기대는 지시('클릭', '스크롤', '왼쪽 그림')가 없다  
> 기준: 0건

### TXT-08

실패 · 문장·표기 · automated · 구현 partial

> em dash는 덱 전체 2개 이하, 범위는 en dash, 곧은 큰따옴표 인용 없음, 숫자 표기 규칙(천 단위 쉼표·만 단위·단위 띄어쓰기)이 하나다  
> 기준: em dash ≤2, 하이픈 범위 0, 곧은 따옴표 0, 형식 불일치 0

실패 13건 · 장 4, 6, 7, 9, 11, 13, 17, 18, 19, 27, 28, 34

- em dash 3개(>2)
- 4장 · 하이픈 범위: 6-1
- 6장 · 곧은 큰따옴표: "90% 이상"
- 7장 · 하이픈 범위: 6-0
- 9장 · 하이픈 범위: 5-0, 6-0
- 11장 · 하이픈 범위: 6-0
- 13장 · 하이픈 범위: 0 -2
- 17장 · 하이픈 범위: 5-4, 6-0
- 18장 · 하이픈 범위: 6-1, 6-0
- 19장 · 하이픈 범위: 4-0, 6-0, 4-1
- 27장 · 하이픈 범위: 5-4
- 28장 · 하이픈 범위: 6-1
- 34장 · 하이픈 범위: 3-3, 5-2, 6-1

- 메모: 지표별 숫자 표기 형식 일치는 수동(형식 표 없음)

근거: [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-06.jpg](../shots/baseline/slide-06.jpg) · [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-09.jpg](../shots/baseline/slide-09.jpg) · [slide-11.jpg](../shots/baseline/slide-11.jpg) · [slide-13.jpg](../shots/baseline/slide-13.jpg)

### TXT-09

실패 · 문장·kicker · automated · 구현 auto

> kicker는 헤드라인에 없는 정보(섹션·질문 번호)만 담고 알약 모양이 아니며, 헤드라인 위 작은 pill 배지가 없다  
> 기준: 자카드 ≥0.4 장 0, 알약 kicker 0, 헤드라인 위 pill 0(표지 포함)

실패 33건 · 장 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34

- 1장 · 알약 kicker "AI가 AI 개발을 돕기 시작한 뒤의 10년"
- 3장 · 알약 kicker "이 발표가 답하려는 것"
- 4장 · 알약 kicker "결론 먼저"
- 5장 · 알약 kicker "전체 구조"
- 6장 · 알약 kicker "재귀적 자기개선 · 지금 보이는 신호"
- 7장 · 알약 kicker "AI 발전 속도 · 관계식 R1"
- 8장 · 알약 kicker "AI 발전 속도 · 관계식 R1"
- 9장 · 알약 kicker "AI 발전 속도 · 회사 대표들의 말"
- 10장 · 알약 kicker "전문가 예상 · 관계식 R2"
- 11장 · 알약 kicker "전문가 예상 · 관계식 R3"
- 12장 · 알약 kicker "전문가 예상 · 컨설팅 기관"
- 13장 · 알약 kicker "실제 고용 1 · 미국 세부 직업 · 수업 7주 상관"
- 14장 · 알약 kicker "실제 고용 1 · 노출 상위 직업"
- 15장 · 알약 kicker "실제 고용 1 · 수업 9주 층화 · 심슨의 역설"
- 16장 · 알약 kicker "예측모형 · 수업 6주 보너스 · 학습/검증 분리"
- 17장 · 알약 kicker "실제 고용 2 · 한국 직업 대분류"
- 18장 · 알약 kicker "실제 고용 3 · 신입 채용 · 관계식 R4"
- 19장 · 알약 kicker "로봇 학습 데이터"
- 20장 · 알약 kicker "관계식 R6 · 로봇 데이터가 따라잡는 데 걸리는 시간"
- 21장 · 알약 kicker "속도를 늦추는 요인 · 관계식 R5"
- 22장 · 알약 kicker "바이오 반도체 · 뉴로모픽"
- 23장 · 알약 kicker "2036 추정 1 · 모형의 뼈대"
- 24장 · 알약 kicker "2036 추정 2 · AI 능력 연장"
- 25장 · 알약 kicker "2036 추정 3 · 직급별"
- 26장 · 알약 kicker "2036 추정 4 · 한국 일자리"
- … 외 8건(JSON 보고서에 전부)

근거: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-05.jpg](../shots/baseline/slide-05.jpg) · [slide-06.jpg](../shots/baseline/slide-06.jpg) · [slide-07.jpg](../shots/baseline/slide-07.jpg)

### TXT-10

실패 · 문장·분량 · automated · 구현 auto

> 장당 본문 글자 수와 문장 길이가 짧다  
> 기준: 장당 ≤220자(180 초과 장은 분할 검토 기록), 문장 길이 p90 ≤60자

실패 8건 · 장 6, 23, 25, 28, 29, 30, 31, 34

- 6장 · 본문 255자(>220)
- 23장 · 본문 284자(>220)
- 25장 · 본문 337자(>220)
- 28장 · 본문 271자(>220)
- 29장 · 본문 313자(>220)
- 30장 · 본문 295자(>220)
- 31장 · 본문 292자(>220)
- 34장 · 본문 442자(>220)

근거: [slide-06.jpg](../shots/baseline/slide-06.jpg) · [slide-23.jpg](../shots/baseline/slide-23.jpg) · [slide-25.jpg](../shots/baseline/slide-25.jpg) · [slide-28.jpg](../shots/baseline/slide-28.jpg) · [slide-29.jpg](../shots/baseline/slide-29.jpg) · [slide-30.jpg](../shots/baseline/slide-30.jpg)

### TXT-11

수동 · 문장·논증 흐름 · visual · 구현 manual

> 헤드라인만 이어 읽어도 질문→데이터→근거→검증→한계→결론 흐름이 끊기지 않는다  
> 기준: 역할 순서 역전 0, 누락 장 0, 한계 장·검증 장 각 ≥1

수동 확인 절차: 34장 헤드라인을 순서대로 추출해 장마다 역할을 붙이고 design-standard의 장별 역할 표와 대조한다
볼 것: [contact-1.jpg](../shots/baseline/contact-1.jpg) · [contact-2.jpg](../shots/baseline/contact-2.jpg)

### IMG-01

통과 · 이미지·생성 표기 · automated · 구현 auto

> 생성 이미지를 쓰는 모든 장에 'AI 생성 이미지(Gemini)' 표기가 있고 MANIFEST.md에 기록되며 데이터 차트를 대신하지 않는다  
> 기준: 표기 누락 0, MANIFEST 누락 0, 차트용 img 0

### IMG-02

실패 · 이미지·내용 · both · 구현 auto+manual

> 이미지에 Gemini 워터마크와 글자(가짜 글자 포함)가 없다  
> 기준: 워터마크 잔상 0, OCR 문자 0(허용 목록 제외)

실패 4건 · 장 2, 9

- 9장 · openai-livestream-thumb.jpg 안 글자 'OpenAl Update'(Vision 확신도 1, 원본 (746, 334) 463×67)
- 2장 · desk.jpg 안 글자 'j0s &'(Vision 확신도 0.3, 원본 (1869, 609) 48×30)
- 2장 · desk.jpg 안 글자 'MC'(Vision 확신도 0.3, 원본 (984, 827) 24×19)
- 2장 · desk.jpg 안 글자 'Mt'(Vision 확신도 0.3, 원본 (1069, 798) 18×13)

- 메모: macOS Vision OCR을 원본 전체·3×3 조각(2배)·4×4 평활화 조각(3배)에 돌려, 글자(한글·라틴) 2자 이상이 확신도 0.3 이상으로 가로 글줄(상자 폭 ≥ 높이×0.8)에서 읽히면 실패. 허용 글자는 qa/exceptions.json의 IMG-02.allow
- 메모: 흐릿하게 뭉개진 가짜 글자는 OCR이 못 읽을 수 있다(예: neurons.jpg 칩 기판의 'MEA CHI…'는 확대·평활화해도 읽히지 않았다) — 크롭 묶음을 사람이 함께 본다

근거: [img02-ocr-01.jpg](../shots/baseline/img02-ocr-01.jpg) · [img02-ocr-04.jpg](../shots/baseline/img02-ocr-04.jpg) · [img02-ocr-05.jpg](../shots/baseline/img02-ocr-05.jpg) · [img02-ocr-07.jpg](../shots/baseline/img02-ocr-07.jpg) · [slide-02.jpg](../shots/baseline/slide-02.jpg) · [slide-09.jpg](../shots/baseline/slide-09.jpg)

수동 확인 절차: 각 이미지 오른쪽 아래 15%를 확대 크롭해 Read로 보고, tesseract kor+eng OCR을 돌린다
볼 것: [img02-ocr-01.jpg](../shots/baseline/img02-ocr-01.jpg) · [img02-ocr-04.jpg](../shots/baseline/img02-ocr-04.jpg) · [img02-ocr-05.jpg](../shots/baseline/img02-ocr-05.jpg) · [img02-ocr-07.jpg](../shots/baseline/img02-ocr-07.jpg) · [img02-desk-br15.jpg](../shots/baseline/img02-desk-br15.jpg) · [img02-neurons-br15.jpg](../shots/baseline/img02-neurons-br15.jpg) · [img02-callcenter-br15.jpg](../shots/baseline/img02-callcenter-br15.jpg) · [img02-entry-br15.jpg](../shots/baseline/img02-entry-br15.jpg) · [img02-robot-br15.jpg](../shots/baseline/img02-robot-br15.jpg) · [img02-cover-br15.jpg](../shots/baseline/img02-cover-br15.jpg) · [img02-recursion-br15.jpg](../shots/baseline/img02-recursion-br15.jpg) · [img02-hassabis-br15.jpg](../shots/baseline/img02-hassabis-br15.jpg)

### IMG-03

실패 · 이미지·품질 · automated · 구현 auto

> 사진은 표시 크기의 1.5배 이상 해상도, 원본 비율 유지(의도된 cover 크롭만), sRGB, width·height 속성을 갖는다  
> 기준: 배율 ≥1.5, fill이면서 비율 차 >1% 0, sRGB 아닌 파일 0, 크기 속성 누락 0

실패 15건 · 장 1, 2, 6, 9, 18, 19, 22

- 1장 · cover.jpg width·height 속성 없음
- 1장 · entry.jpg width·height 속성 없음
- 1장 · callcenter.jpg width·height 속성 없음
- 2장 · recursion.jpg width·height 속성 없음
- 2장 · desk.jpg width·height 속성 없음
- 6장 · recursion.jpg 해상도 배율 1.03(<1.5) — 원본 1920×1072, 표시 1872×1032
- 9장 · altman.jpg width·height 속성 없음
- 9장 · amodei.jpg width·height 속성 없음
- 9장 · hassabis.jpg width·height 속성 없음
- 9장 · openai-livestream-thumb.jpg 해상도 배율 1.33(<1.5) — 원본 1280×720, 표시 364×540
- 9장 · openai-livestream-thumb.jpg width·height 속성 없음
- 18장 · entry.jpg 해상도 배율 1.03(<1.5) — 원본 1920×1072, 표시 1872×1032
- 19장 · robot.jpg 해상도 배율 1.03(<1.5) — 원본 1920×1072, 표시 1872×1032
- 19장 · robot.jpg width·height 속성 없음
- 22장 · neurons.jpg width·height 속성 없음

근거: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-02.jpg](../shots/baseline/slide-02.jpg) · [slide-06.jpg](../shots/baseline/slide-06.jpg) · [slide-09.jpg](../shots/baseline/slide-09.jpg) · [slide-18.jpg](../shots/baseline/slide-18.jpg) · [slide-19.jpg](../shots/baseline/slide-19.jpg)

### IMG-04

실패 · 이미지·용량 · automated · 구현 auto

> 휴대폰 데이터로 열어도 부담이 적다  
> 기준: 파일당 ≤300KB, 총 ≤1.5MB

실패 2건

- desk.jpg 305KB(>300)
- assets/img 총 1.64MB(>1.5)

### IMG-05

통과 · 이미지·대체 텍스트 · both · 구현 auto+manual

> 의미 있는 이미지는 내용 alt, 장식 이미지는 alt=""이고 실존 인물·기관명을 생성 이미지 alt에 쓰지 않는다  
> 기준: alt 속성 누락 0, 내용 이미지 alt <5자 0, 생성 이미지 alt 실명 0

수동 확인 절차: 모든 img의 alt를 나열해 장식/내용 분류표와 대조한다
볼 것: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-02.jpg](../shots/baseline/slide-02.jpg) · [slide-06.jpg](../shots/baseline/slide-06.jpg) · [slide-09.jpg](../shots/baseline/slide-09.jpg) · [slide-18.jpg](../shots/baseline/slide-18.jpg) · [slide-19.jpg](../shots/baseline/slide-19.jpg) · [slide-22.jpg](../shots/baseline/slide-22.jpg)

### IMG-06

실패 · 이미지·사용 · automated · 구현 auto

> 같은 이미지를 여러 장에 재사용하지 않고, 데이터 장에는 사진을 두지 않으며, 사진 처리(반지름·filter)는 한 가지다  
> 기준: 2회 이상 파일 0(README 의도 목록 제외), 차트 장 img 0, 반지름·filter 각 1종

실패 3건 · 장 6, 18

- 18장 · assets/img/entry.jpg 2장에서 재사용: 1,18
- 6장 · assets/img/recursion.jpg 2장에서 재사용: 2,6
- 사진 반지름 2종: 32,24

근거: [slide-06.jpg](../shots/baseline/slide-06.jpg) · [slide-18.jpg](../shots/baseline/slide-18.jpg)

### IMG-07

수동 · 이미지·포용 · visual · 구현 manual

> 사람이 나오는 이미지가 직업 고정관념을 강화하지 않는다  
> 기준: 강화 판정 0

수동 확인 절차: 이미지마다 장·묘사 인물 특성·판정을 표로 기록한다
볼 것: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-02.jpg](../shots/baseline/slide-02.jpg) · [slide-06.jpg](../shots/baseline/slide-06.jpg) · [slide-09.jpg](../shots/baseline/slide-09.jpg) · [slide-18.jpg](../shots/baseline/slide-18.jpg) · [slide-19.jpg](../shots/baseline/slide-19.jpg) · [slide-22.jpg](../shots/baseline/slide-22.jpg)

### CHT-01

실패 · 차트·제목 · automated · 구현 auto

> 9개 차트마다 svg 위 같은 자리에 '무엇·단위·기간'을 담은 차트 제목이 1개 있다  
> 기준: 제목 정확히 1, 위치 위반 0, 단위·기간 없음 0

실패 9건 · 장 7, 10, 11, 13, 14, 17, 24, 26, 27

- 7장 · metr_horizon 차트 제목 0개
- 10장 · agi_forecast_shift 차트 제목 0개
- 11장 · espai_two_clocks 차트 제목 0개
- 13장 · occ_scatter 차트 제목 0개
- 14장 · occ_quintile 제목이 svg 위에 있지 않음
- 17장 · kr_occupation_index 차트 제목 0개
- 24장 · proj_capability 차트 제목 0개
- 26장 · proj_kr_jobs 차트 제목 0개
- 27장 · proj_wave 제목이 svg 위에 있지 않음

근거: [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-10.jpg](../shots/baseline/slide-10.jpg) · [slide-11.jpg](../shots/baseline/slide-11.jpg) · [slide-13.jpg](../shots/baseline/slide-13.jpg) · [slide-14.jpg](../shots/baseline/slide-14.jpg) · [slide-17.jpg](../shots/baseline/slide-17.jpg)

### CHT-02

실패 · 차트·구성 체크리스트 · both · 구현 auto+manual

> 모든 차트가 축 이름+단위, n과 기간, 출처, 기준일, 직접 라벨, 강조 주석을 갖고 로그축·시간 단위를 표기한다  
> 기준: 빈 칸 0

실패 14건 · 장 7, 10, 11, 13, 14, 17, 24, 26, 27

- 7장 · metr_horizon n기간 없음
- 10장 · agi_forecast_shift n기간 없음
- 10장 · agi_forecast_shift 기준일 없음
- 11장 · espai_two_clocks n기간 없음
- 11장 · espai_two_clocks 기준일 없음
- 13장 · occ_scatter n기간 없음
- 13장 · occ_scatter 세로 범위를 넘은 점 10개를 끝에 붙여 그렸는데 표식·주석 없음
- 14장 · occ_quintile n기간 없음
- 14장 · occ_quintile 기준일 없음
- 17장 · kr_occupation_index n기간 없음
- 24장 · proj_capability n기간 없음
- 26장 · proj_kr_jobs n기간 없음
- 27장 · proj_wave n기간 없음
- 27장 · proj_wave 기준일 없음

근거: [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-10.jpg](../shots/baseline/slide-10.jpg) · [slide-11.jpg](../shots/baseline/slide-11.jpg) · [slide-13.jpg](../shots/baseline/slide-13.jpg) · [slide-14.jpg](../shots/baseline/slide-14.jpg) · [slide-17.jpg](../shots/baseline/slide-17.jpg)

수동 확인 절차: 9개 차트별 7항목 체크표를 채우고 렌더 PNG에서 실제로 보이는지 확인한다. logline·yearline·capfan에 단위·'로그' 문자열을 grep한다
볼 것: [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-10.jpg](../shots/baseline/slide-10.jpg) · [slide-11.jpg](../shots/baseline/slide-11.jpg) · [slide-13.jpg](../shots/baseline/slide-13.jpg) · [slide-14.jpg](../shots/baseline/slide-14.jpg) · [slide-17.jpg](../shots/baseline/slide-17.jpg) · [slide-24.jpg](../shots/baseline/slide-24.jpg) · [slide-26.jpg](../shots/baseline/slide-26.jpg) · [slide-27.jpg](../shots/baseline/slide-27.jpg)

### CHT-03

통과 · 차트·색 · automated · 구현 auto

> 차트마다 강조 계열 하나만 인디고, 나머지는 중립이며 고유 색은 4개 이하다  
> 기준: 고유 색 ≤4, 무채색 외 색은 accent·sage 계열만, accent 데이터 그룹 =1

### CHT-04

실패 · 차트·색 외 단서 · both · 구현 auto+manual

> 계열은 직접 라벨과 선 모양·굵기로도 구분되고, 같은 색 중립 계열이 둘 이상이면 dasharray가 다르다  
> 기준: 라벨 없는 색 구분 0, 직접 라벨 수 = 계열 수, dasharray 동일 쌍 0

실패 1건 · 장 26

- 26장 · proj_kr_jobs 같은 색·같은 점선·같은 굵기 계열 쌍(l-neutral, l-neutral)

근거: [slide-26.jpg](../shots/baseline/slide-26.jpg)

수동 확인 절차: 34장 PNG를 그레이스케일·제2·제1색맹 시뮬레이션으로 변환해 장별 체크하고, 계열 수와 직접 라벨 수, 같은 stroke 선의 dasharray를 비교한다
볼 것: [sim-07-gray.jpg](../shots/baseline/sim-07-gray.jpg) · [sim-07-protan.jpg](../shots/baseline/sim-07-protan.jpg) · [sim-07-deutan.jpg](../shots/baseline/sim-07-deutan.jpg) · [sim-07-projector.jpg](../shots/baseline/sim-07-projector.jpg) · [sim-10-gray.jpg](../shots/baseline/sim-10-gray.jpg) · [sim-10-protan.jpg](../shots/baseline/sim-10-protan.jpg) · [sim-10-deutan.jpg](../shots/baseline/sim-10-deutan.jpg) · [sim-10-projector.jpg](../shots/baseline/sim-10-projector.jpg) · [sim-11-gray.jpg](../shots/baseline/sim-11-gray.jpg) · [sim-11-protan.jpg](../shots/baseline/sim-11-protan.jpg) · [sim-11-deutan.jpg](../shots/baseline/sim-11-deutan.jpg) · [sim-11-projector.jpg](../shots/baseline/sim-11-projector.jpg)

### CHT-05

실패 · 차트·라벨 충돌 · both · 구현 auto+manual

> 값 라벨·주석이 서로, 그리고 선·점과 겹치지 않는다(10장 '2047' 포함). 산점도 라벨은 5개 이하  
> 기준: 교차 >1px 0, 산점도 라벨 ≤5

실패 17건 · 장 10, 11, 13, 17

- 10장 · agi_forecast_shift 글자 겹침 "2042" ↔ "전문가 설문 (HLMI)" 5px²
- 10장 · agi_forecast_shift 라벨 "2047"이 선과 겹침
- 11장 · espai_two_clocks 글자 겹침 "2098" ↔ "직업 자동화" 5px²
- 11장 · espai_two_clocks 글자 겹침 "2042" ↔ "AGI" 5px²
- 11장 · espai_two_clocks 라벨 "2116"이 선과 겹침
- 13장 · occ_scatter 라벨 "웹 개발자 −20.8%"이 점과 겹침
- 13장 · occ_scatter 라벨 "데이터 입력원 −19.3%"이 점과 겹침
- 13장 · occ_scatter 라벨 "경리·회계 사무원 −11.4%"이 점과 겹침
- 17장 · kr_occupation_index 글자 겹침 "100" ↔ "100" 16px²
- 17장 · kr_occupation_index 글자 겹침 "100" ↔ "100" 16px²
- 17장 · kr_occupation_index 글자 겹침 "100" ↔ "100" 16px²
- 17장 · kr_occupation_index 글자 겹침 "100" ↔ "100" 833px²
- 17장 · kr_occupation_index 글자 겹침 "100" ↔ "100" 833px²
- 17장 · kr_occupation_index 글자 겹침 "119.7" ↔ "전문가" 19px²
- 17장 · kr_occupation_index 글자 겹침 "100" ↔ "100" 833px²
- 17장 · kr_occupation_index 글자 겹침 "108.7" ↔ "사무직" 18px²
- 17장 · kr_occupation_index 글자 겹침 "82.4" ↔ "판매직" 4px²

근거: [slide-10.jpg](../shots/baseline/slide-10.jpg) · [slide-11.jpg](../shots/baseline/slide-11.jpg) · [slide-13.jpg](../shots/baseline/slide-13.jpg) · [slide-17.jpg](../shots/baseline/slide-17.jpg)

수동 확인 절차: svg text getBBox 쌍 교차와 text-polyline/circle 교차를 계산하고 차트 장 PNG를 원본 크기로 확인한다
볼 것: [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-10.jpg](../shots/baseline/slide-10.jpg) · [slide-11.jpg](../shots/baseline/slide-11.jpg) · [slide-13.jpg](../shots/baseline/slide-13.jpg) · [slide-14.jpg](../shots/baseline/slide-14.jpg) · [slide-17.jpg](../shots/baseline/slide-17.jpg) · [slide-24.jpg](../shots/baseline/slide-24.jpg) · [slide-26.jpg](../shots/baseline/slide-26.jpg) · [slide-27.jpg](../shots/baseline/slide-27.jpg)

### CHT-06

실패 · 차트·마크 규격 · automated · 구현 auto

> 화면 실측 기준 데이터 선 ≥3px, 격자 ≤1.5px의 옅은 실선, 점 지름 ≥8px에 바탕색 고리, 막대 두께 ≤24px·간격 2px·길이 ≥4px  
> 기준: 모든 항목 위반 0, 뜻 없는 점선 0

실패 32건 · 장 7, 10, 11, 13, 14, 17, 26, 27

- 7장 · metr_horizon 점 바탕색 고리 없음 ×16
- 10장 · agi_forecast_shift 점 바탕색 고리 없음 ×13
- 11장 · espai_two_clocks 점 바탕색 고리 없음 ×7
- 11장 · espai_two_clocks 뜻 라벨 없는 점선 2
- 13장 · occ_scatter 점 지름 6.2px(<8) ×5
- 13장 · occ_scatter 점 바탕색 고리 없음 ×639
- 13장 · occ_scatter 점 지름 5.9px(<8) ×478
- 13장 · occ_scatter 점 지름 6.8px(<8) ×2
- 13장 · occ_scatter 점 지름 6.4px(<8) ×3
- 13장 · occ_scatter 점 지름 7.7px(<8) ×3
- 13장 · occ_scatter 점 지름 7.5px(<8) ×4
- 13장 · occ_scatter 점 지름 6.7px(<8) ×3
- 13장 · occ_scatter 점 지름 7.1px(<8) ×4
- 13장 · occ_scatter 점 지름 6.6px(<8)
- 13장 · occ_scatter 점 지름 6.3px(<8) ×5
- 13장 · occ_scatter 점 지름 7.4px(<8) ×3
- 13장 · occ_scatter 점 지름 8px(<8) ×4
- 13장 · occ_scatter 점 지름 6px(<8) ×3
- 13장 · occ_scatter 점 지름 7.9px(<8) ×3
- 13장 · occ_scatter 점 지름 7.8px(<8)
- 13장 · occ_scatter 점 지름 7px(<8) ×3
- 13장 · occ_scatter 점 지름 6.5px(<8) ×4
- 13장 · occ_scatter 점 지름 7.2px(<8)
- 13장 · occ_scatter 점 지름 6.1px(<8) ×3
- 13장 · occ_scatter 점 지름 7.6px(<8)
- … 외 7건(JSON 보고서에 전부)

근거: [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-10.jpg](../shots/baseline/slide-10.jpg) · [slide-11.jpg](../shots/baseline/slide-11.jpg) · [slide-13.jpg](../shots/baseline/slide-13.jpg) · [slide-14.jpg](../shots/baseline/slide-14.jpg) · [slide-17.jpg](../shots/baseline/slide-17.jpg)

### CHT-07

실패 · 차트·축 · automated · 구현 auto

> 눈금은 깔끔한 수열, 막대는 0 기준, 연도 축은 실제 날짜 간격으로 왼→오른 증가한다  
> 기준: 간격 ∉{1,2,2.5,5}×10^k 0, 0 기준 위반 0, 변동계수 <2%, 쉼표 규칙 위반 0

실패 1건 · 장 13

- 13장 · occ_scatter 범위 밖 10개 점이 축 끝(y=441.4)에 실제 값처럼 그려짐(끝선 위 점 10개, 다른 모양·표시 없음)

근거: [slide-13.jpg](../shots/baseline/slide-13.jpg)

### CHT-08

실패 · 차트·값 라벨 · automated · 구현 auto

> 차트 안 글자는 --ink/--note만 입고, 값 라벨 소수 자릿수는 차트 안에서 통일되며 단위는 축·부제에 한 번 쓴다  
> 기준: 토큰 외 fill 0, 자릿수 종류 1, 단위 포함 값 라벨 ≤1/차트

실패 17건 · 장 7, 10, 11, 13, 14, 17, 24, 26, 27

- 7장 · metr_horizon 차트 글자 색 rgb(76, 94, 178)(잉크·회색 밖)
- 7장 · metr_horizon 값 라벨 소수 자릿수 0/1
- 7장 · metr_horizon 단위 붙은 값 라벨 2(>1)
- 10장 · agi_forecast_shift 차트 글자 색 rgb(76, 94, 178)(잉크·회색 밖)
- 11장 · espai_two_clocks 차트 글자 색 rgb(76, 94, 178)(잉크·회색 밖)
- 13장 · occ_scatter 차트 글자 색 rgb(76, 94, 178)(잉크·회색 밖)
- 13장 · occ_scatter 단위 붙은 값 라벨 5(>1)
- 14장 · occ_quintile 차트 글자 색 rgb(76, 94, 178)(잉크·회색 밖)
- 14장 · occ_quintile 값 라벨 소수 자릿수 1/2
- 14장 · occ_quintile 단위 붙은 값 라벨 6(>1)
- 17장 · kr_occupation_index 차트 글자 색 rgb(76, 94, 178)(잉크·회색 밖)
- 17장 · kr_occupation_index 값 라벨 소수 자릿수 0/1
- 24장 · proj_capability 차트 글자 색 rgb(76, 94, 178)(잉크·회색 밖)
- 26장 · proj_kr_jobs 차트 글자 색 rgb(76, 94, 178)(잉크·회색 밖)
- 27장 · proj_wave 차트 글자 색 rgb(76, 94, 178)(잉크·회색 밖)
- 27장 · proj_wave 값 라벨 소수 자릿수 2/1
- 27장 · proj_wave 단위 붙은 값 라벨 6(>1)

근거: [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-10.jpg](../shots/baseline/slide-10.jpg) · [slide-11.jpg](../shots/baseline/slide-11.jpg) · [slide-13.jpg](../shots/baseline/slide-13.jpg) · [slide-14.jpg](../shots/baseline/slide-14.jpg) · [slide-17.jpg](../shots/baseline/slide-17.jpg)

### CHT-09

통과 · 차트·형식 · both · 구현 auto+manual

> 차트 형태가 데이터의 일에 맞고, 값이 3개 이하인 데이터는 차트가 아니라 큰 숫자 타이포로, 낯선 형식(두 계열 시점·파동·관계식 체인)은 '읽는 법' 한 문장을 갖는다  
> 기준: 형태 불일치 0, 마크 ≤3인 svg 0, 읽는 법 누락 0, 이중 세로축 0

수동 확인 절차: '장 / 맡은 일 / 현재 형태 / 맞는 형태' 표를 만들고 svg 데이터 마크 수, 기타 형식 장의 읽는 법 요소, 세로축 척도 수를 확인한다
볼 것: [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-10.jpg](../shots/baseline/slide-10.jpg) · [slide-11.jpg](../shots/baseline/slide-11.jpg) · [slide-13.jpg](../shots/baseline/slide-13.jpg) · [slide-14.jpg](../shots/baseline/slide-14.jpg) · [slide-17.jpg](../shots/baseline/slide-17.jpg) · [slide-24.jpg](../shots/baseline/slide-24.jpg) · [slide-26.jpg](../shots/baseline/slide-26.jpg) · [slide-27.jpg](../shots/baseline/slide-27.jpg)

### CHT-10

실패 · 차트·연속성 · automated · 구현 auto

> 같은 데이터를 다루는 차트 쌍(7↔22장 METR, 17↔25·26장 직업군)은 계열 색·마커·단위·이름 표기가 같고, 이어지는 장은 축·위치를 유지한다  
> 기준: 불일치 0, 연속 장 bbox 차 ≤8px

실패 1건 · 장 11

- 11장 · 연속 차트 장 10·11 축 범위 다름: 세로 2020~2070 · 가로 2016~2027 / 세로 2030~2170 · 가로 2016~2025

근거: [slide-11.jpg](../shots/baseline/slide-11.jpg)

### CHT-11

실패 · 차트·접근성 · automated · 구현 auto

> 차트마다 유형·축·범위·핵심 값(chart-data.json 강조값)을 담은 설명이 있고, 주관어가 없으며 눈금 텍스트는 aria-hidden이다  
> 기준: 빈 설명 0, 숫자 <2개 0, 강조값 누락 0, 주관어 0, aria-hidden 누락 0

실패 16건 · 장 7, 10, 11, 13, 14, 17, 24, 26, 27

- 7장 · metr_horizon 설명 숫자 1개(<2): "AI가 맡을 수 있는 업무 크기 (METR 50% 시간지평)"
- 7장 · metr_horizon 강조값 Claude Mythos(초기판) · 17.4시간 설명에 없음
- 7장 · metr_horizon 눈금 글자 aria-hidden 없음 11개
- 10장 · agi_forecast_shift 설명 숫자 0개(<2): "전문가들이 예상한 AGI 연도의 변화"
- 10장 · agi_forecast_shift 눈금 글자 aria-hidden 없음 21개
- 11장 · espai_two_clocks 설명 숫자 0개(<2): "AGI 예상 연도와 모든 직업 자동화 예상 연도"
- 11장 · espai_two_clocks 눈금 글자 aria-hidden 없음 20개
- 13장 · occ_scatter 설명 숫자 0개(<2): "AI 노출도와 고용 변화 — 미국 세부 직업"
- 13장 · occ_scatter 눈금 글자 aria-hidden 없음 12개
- 14장 · occ_quintile 눈금 글자 aria-hidden 없음 4개
- 17장 · kr_occupation_index 눈금 글자 aria-hidden 없음 15개
- 24장 · proj_capability 눈금 글자 aria-hidden 없음 14개
- 26장 · proj_kr_jobs 설명 숫자 0개(<2): "한국 일자리 대체 압력 누적 (새 일자리 미반영)"
- 26장 · proj_kr_jobs 눈금 글자 aria-hidden 없음 20개
- 27장 · proj_wave 설명 숫자 1개(<2): "직업군별 2036년 대체 압력 (기준 시나리오)"
- 27장 · proj_wave 눈금 글자 aria-hidden 없음 5개

근거: [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-10.jpg](../shots/baseline/slide-10.jpg) · [slide-11.jpg](../shots/baseline/slide-11.jpg) · [slide-13.jpg](../shots/baseline/slide-13.jpg) · [slide-14.jpg](../shots/baseline/slide-14.jpg) · [slide-17.jpg](../shots/baseline/slide-17.jpg)

### CHT-12

실패 · 차트·데이터 진정성 · automated · 구현 auto

> 그래프 모양은 모두 chart-data.json에 묶이고, charts.js는 하드코딩 숫자·innerHTML 문자열 결합 없이 그린다  
> 기준: 모두 0, 의도하지 않은 픽셀 차 0

실패 3건

- charts.js:104 하드코딩 숫자 배열: for (const t of [0, 0.25, 0.5, 0.75, 1]) svg.append(el("text", { class: "alab", 
- charts.js:201 innerHTML 문자열 결합
- 차트 도형 766개 중 data 속성으로 값과 묶인 것 0

### CHT-13

통과 · 차트·상호작용 · automated · 구현 auto

> 핵심 값은 호버·클릭 없이 보이고, 툴팁을 넣는다면 호버와 키보드 포커스 모두에서 같은 값을 보이며 발표 화면을 가리지 않는다  
> 기준: hover 전용 정보 0, 툴팁 값 불일치 0

### EVD-01

실패 · 근거·숫자 일치 · automated · 구현 auto

> 덱의 모든 숫자가 chart-data.json·분석 출력과 일치하고 디자인 수정으로 숫자가 바뀌지 않는다  
> 기준: unverified [] 종료 코드 0, 사라지거나 바뀐 숫자 0

실패 1건 · 장 13

- 13장 · occ_scatter 세로 범위 밖 값 10개가 축 끝값으로 그려져 그림 위치가 데이터 값과 다름

근거: [slide-13.jpg](../shots/baseline/slide-13.jpg)

### EVD-02

실패 · 근거·주장 라벨 · automated · 구현 auto

> 주장 라벨(기술·추정·2차·계획 등)은 하나도 지워지지 않고 해당 숫자 옆에 글자로 있다  
> 기준: 사라진 라벨 0, 빈 라벨 0, 거리 >64px 0

실패 1건 · 장 4

- 4장 · 라벨 "n=3"와 가장 가까운 숫자 127px(>64)

근거: [slide-04.jpg](../shots/baseline/slide-04.jpg)

### EVD-03

실패 · 근거·출처 · automated · 구현 auto

> 모든 장에 출처가 숫자 가까이 있고 연도를 포함하며, 2차 인용은 원 발화자와 매체를 함께 적고, 출처는 본문보다 작은 보조 프리셋이다  
> 기준: 누락 0(표지·마무리 README 예외), 연도 없음 0, 2차 매체 누락 0

실패 18건 · 장 1, 2, 3, 5, 6, 8, 9, 14, 15, 16, 19, 21, 29, 30, 31, 32, 33, 34

- 1장 · 출처에 연도 없음: "사진: AI 생성 이미지(Gemini) · 모든 수치에 출처와 라벨(기술"
- 2장 · 출처에 연도 없음: "사진: AI 생성 이미지(Gemini) · 이처럼 AI가 다음 AI 개발"
- 3장 · 출처에 연도 없음: "AGI 정의는 회사마다 다릅니다. 정의가 다른 지표는 한 줄로 잇지 않았"
- 5장 · 출처에 연도 없음: "Epoch AI · IEA · METR · Google·Anthropic"
- 6장 · 출처에 연도 없음: "배경: AI 생성 이미지(Gemini) · Semafor·TechSpot"
- 8장 · 출처에 연도 없음: "analysis/timeline_analysis.py · analysis"
- 9장 · 출처에 연도 없음: "사진: Village Global(CC BY 2.0), UK Prime "
- 14장 · 출처에 연도 없음: "분위마다 직업 154개 · 막대는 0에서 시작 기술"
- 15장 · 출처에 연도 없음: "analysis/occupation_analysis.py — 대분류별 ρ"
- 16장 · 출처에 연도 없음: "analysis/ml_models.py (numpy, scikit-lea"
- 19장 · 출처에 연도 없음: "배경: AI 생성 이미지(Gemini) · Waymo 발표 · Gener"
- 21장 · 출처에 연도 없음: "Epoch AI · IEA Energy and AI · research/"
- 29장 · 출처에 연도 없음: "모든 연도는 기준 시나리오 추정 · 결론 등급은 '기술'(관계)과 '추정"
- 30장 · 출처에 연도 없음: "research/jobs-global.md · research/jobs-"
- 31장 · 출처에 연도 없음: "수업 방법 결정표(course-domain/method-selector."
- 32장 · 출처에 연도 없음: "7~16주는 계획 문서 기준이며 확정 일정은 학교 공지를 따릅니다"
- 33장 · 출처에 연도 없음: "분석 명세 spec.md · 종합 보고서 report.md · 독립 재계"
- 34장 · 출처에 연도 없음: "이미지: Gemini 생성 8장(워터마크는 SAM 2.1로 제거, 생성 "

근거: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-02.jpg](../shots/baseline/slide-02.jpg) · [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-05.jpg](../shots/baseline/slide-05.jpg) · [slide-06.jpg](../shots/baseline/slide-06.jpg) · [slide-08.jpg](../shots/baseline/slide-08.jpg)

### EVD-04

실패 · 근거·불확실성 · both · 구현 auto+manual

> 추정값은 같은 블록에 '추정' 라벨과 범위를 갖고, 외삽 장마다 한계 문구가 있으며 한계 장은 구체 가정과 수치 범위를 말한다. 인과 동사는 근거 등급을 넘지 않는다  
> 기준: 누락 0, 등급 초과 인과 동사 0

실패 6건 · 장 3, 21, 23, 26, 32, 34

- 3장 · 2036 외삽 장에 한계 문구 없음
- 21장 · 추정 라벨이 있는데 범위 표기 없음
- 23장 · 추정 라벨이 있는데 범위 표기 없음
- 26장 · 추정 라벨이 있는데 범위 표기 없음
- 32장 · 2036 외삽 장에 한계 문구 없음
- 34장 · 2036 외삽 장에 한계 문구 없음

근거: [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-21.jpg](../shots/baseline/slide-21.jpg) · [slide-23.jpg](../shots/baseline/slide-23.jpg) · [slide-26.jpg](../shots/baseline/slide-26.jpg) · [slide-32.jpg](../shots/baseline/slide-32.jpg) · [slide-34.jpg](../shots/baseline/slide-34.jpg)

수동 확인 절차: 추정 수치 요소 가장 가까운 블록의 .tag.est·범위 표기, 2036 외삽 장의 한계 문구, 한계 장 정규식(숫자~숫자\|±), /때문에\|초래\|입증\|증명/ 문장의 라벨 등급을 확인한다
볼 것: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-22.jpg](../shots/baseline/slide-22.jpg) · [slide-23.jpg](../shots/baseline/slide-23.jpg) · [slide-24.jpg](../shots/baseline/slide-24.jpg) · [slide-25.jpg](../shots/baseline/slide-25.jpg) · [slide-26.jpg](../shots/baseline/slide-26.jpg) · [slide-27.jpg](../shots/baseline/slide-27.jpg) · [slide-28.jpg](../shots/baseline/slide-28.jpg) · [slide-29.jpg](../shots/baseline/slide-29.jpg) · [slide-32.jpg](../shots/baseline/slide-32.jpg)

### EVD-05

실패 · 근거·마무리 · automated · 구현 auto

> 33장이 4장의 결론 숫자 세 개를 다시 확인하고, 덱 안에 데이터 기준일이 한 번 이상 있다  
> 기준: 3/3 포함, 기준일 ≥1

실패 4건 · 장 33

- 33장 · 4장 핵심 수치 "105"가 33장에 없음
- 33장 · 4장 핵심 수치 "3.5"가 33장에 없음
- 33장 · 4장 핵심 수치 "94"가 33장에 없음
- 덱 안에 데이터 기준일 표기 없음

근거: [slide-33.jpg](../shots/baseline/slide-33.jpg)

### EVD-06

통과 · 근거·개인정보 · automated · 구현 auto

> 덱과 데이터에 개인 식별 정보가 없다  
> 기준: 0건(허용 목록 제외)

### NAV-01

실패 · 내비게이션·터치 · automated · 구현 auto

> 터치 화면에서 좌우 스와이프로 넘긴다. 가장자리 16px 시작·짧은 이동·세로 우세·두 손가락·확대 상태는 넘기지 않고, 못 미치면 제자리로 돌아온다  
> 기준: 각각 +1, 0, 0, 0, −1, 0(300ms 안 translateX 0 복귀), 0. touch-action에 pan-y pinch-zoom

실패 3건

- 왼쪽으로 80px(Δy 10): 장 5→5 (Δ0, 기대 +1)
- 오른쪽으로 80px: 장 5→5 (Δ0, 기대 -1)
- 스와이프 표면 touch-action auto / auto(pan-y pinch-zoom 아님)

근거: [nav01-375x812-s5.jpg](../shots/baseline/nav01-375x812-s5.jpg)

### NAV-02

실패 · 내비게이션·보이는 버튼 · automated · 구현 auto

> 키보드 없이 보이는 이전·다음 버튼(또는 탭 영역)과 개요·전체 화면 버튼만으로 모든 장 이동과 기능을 쓴다  
> 기준: 모든 동작 성공, location.hash가 #1~#34 차례로 변경

실패 2건

- 390x844 터치: 이전·다음 버튼 없음(다음 0, 이전 0)
- 1440x900 마우스: 이전·다음 버튼 없음(다음 0, 이전 0)

### NAV-03

통과 · 내비게이션·키보드 · automated · 구현 auto

> →·Space·PageDown/←·PageUp/Home/End로 이동하고, 수식키 조합과 브라우저 기본 동작은 가로채지 않는다  
> 기준: 키 매핑 100% 동작, 수식키 preventDefault 0, current 변화 0

### NAV-04

통과 · 내비게이션·반응 · automated · 구현 auto

> 입력 즉시 전환이 시작되고 연타해도 입력을 잃지 않으며 상태가 꼬이지 않는다  
> 기준: current=10이고 current 장 1개, 입력→visible ≤100ms, is-hiding 잔존 0, opacity 1 아닌 줄 0, jsErrors 0

- 메모: 글줄 불투명 확인은 마지막 입력 1.5초 뒤(글줄 등장 ≤1000ms 허용)

### NAV-05

실패 · 내비게이션·끝 피드백 · automated · 구현 auto

> 1장의 이전·34장의 다음은 비활성 모양이고, 34장에서 더 넘기면 끝 표시와 처음으로 가는 길이 보인다  
> 기준: aria-disabled=true, opacity ≤0.4, cursor default, 끝 표시 보임, current=33 유지

실패 2건

- 390x844 터치: 이전·다음 버튼이 없어 비활성 모양을 확인할 수 없음
- 1440x900 마우스: 이전·다음 버튼이 없어 비활성 모양을 확인할 수 없음

### NAV-06

실패 · 내비게이션·주소 · automated · 구현 auto

> #n으로 특정 장을 열고, 주소 변경(hashchange)·새로고침·범위 밖 값이 올바르게 처리된다  
> 기준: current 11·0·33·0·0, hashchange 후 11, reload 후 11, 오류 0

실패 1건

- #1에서 location.hash='#12' 후 장 1(hashchange 처리 없음)

### NAV-07

실패 · 내비게이션·되돌리기 · automated · 구현 auto

> 개요·딥링크 점프만 history에 남겨 뒤로 가기로 직전 장에 돌아오고, 한 장씩 이동은 기록을 늘리지 않는다  
> 기준: back 후 current=2, history.length 증가 0

실패 1건

- history.back() 후 about:blank(기대 3장)

### NAV-08

실패 · 내비게이션·Esc 관례 · automated · 구현 auto

> 무대에서 Esc는 개요를 열지 않고 닫기·나가기만 한다. 개요는 G(또는 O)와 보이는 버튼으로 연다. 전체 화면에서 Esc 한 번은 전체 화면만 끝낸다  
> 기준: 무대 Esc로 개요 열림 0, 다른 열기 수단 2개, 전체 화면 Esc 후 개요 열림 0

실패 2건

- 무대에서 Esc가 개요를 엶
- 개요를 여는 다른 수단 0개(G·O 키·버튼 중): 없음

- 메모: 전체 화면에서 Esc: 개요 열림 — CDP 키 입력은 브라우저의 전체 화면 Esc 처리를 거치지 않아 판정에서 빼고 기록만 한다(실기기 확인 필요)

### NAV-09

실패 · 내비게이션·개요 · automated · 구현 auto

> 개요는 제목('전체 34장'), 44px 닫기 버튼, 썸네일마다 읽히는 장 번호, 현재 장 aria-current와 테두리, Tab·화살표·Enter 선택, 즉시 전환, 다른 오버레이 숨김을 갖는다  
> 기준: 모든 항목 존재, 장 번호 실효 ≥14px, 현재 장 표시 그레이스케일 구분, 열고 닫을 때 애니메이션 0, 다른 오버레이 display:none

실패 6건

- 개요 제목('전체 34장') 없음
- 닫기 버튼 없음
- 썸네일 장 번호 실효 높이 4.9px(<14)
- aria-current 장 0개
- 현재 장 테두리 없음(none 3px)
- 열 때 실행 중 애니메이션 1

### NAV-10

실패 · 내비게이션·위치 표시 · automated · 구현 auto

> 모든 장 같은 자리에 '섹션명 · n / 34'가 있고, 휴대폰에서는 덱 밖 고정 진행 표시가 있으며 document.title이 장을 따라 갱신된다  
> 기준: 번호 불일치 0, 섹션명 누락 0, 진행 막대 오차 ≤0.5%, 실측 ≥12px, title에 장 번호 포함

실패 37건 · 장 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34

- 1장 · 섹션명 없음
- 2장 · 섹션명 없음
- 3장 · 섹션명 없음
- 4장 · 섹션명 없음
- 5장 · 섹션명 없음
- 6장 · 섹션명 없음
- 7장 · 섹션명 없음
- 8장 · 섹션명 없음
- 9장 · 섹션명 없음
- 10장 · 섹션명 없음
- 11장 · 섹션명 없음
- 12장 · 섹션명 없음
- 13장 · 섹션명 없음
- 14장 · 섹션명 없음
- 15장 · 섹션명 없음
- 16장 · 섹션명 없음
- 17장 · 섹션명 없음
- 18장 · 섹션명 없음
- 19장 · 섹션명 없음
- 20장 · 섹션명 없음
- 21장 · 섹션명 없음
- 22장 · 섹션명 없음
- 23장 · 섹션명 없음
- 24장 · 섹션명 없음
- 25장 · 섹션명 없음
- … 외 12건(JSON 보고서에 전부)

근거: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-02.jpg](../shots/baseline/slide-02.jpg) · [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-05.jpg](../shots/baseline/slide-05.jpg) · [slide-06.jpg](../shots/baseline/slide-06.jpg)

### NAV-11

실패 · 내비게이션·외부 링크 · automated · 구현 auto

> 외부 링크는 밑줄·↗·'새 탭' 이름을 갖고 목적지를 설명하며, 새 탭으로 열리고 탭해도 장이 넘어가지 않는다. 영상은 행선지(YouTube)·시작 시점을 텍스트로 밝힌다  
> 기준: 밑줄 없음 0, noopener 누락 0, '새 탭' 이름 누락 0, 모호 텍스트 0, 탭 시 장 변화 0, 링크 200

실패 6건 · 장 9, 34

- 9장 · 밑줄·↗ 없음: "영상 · OpenAI 라이브(2025-10-28)7분 "
- 9장 · '새 탭' 이름 없음: "영상 · OpenAI 라이브(2025-10-28)7분 "
- 34장 · '새 탭' 이름 없음: "자료조사 research"
- 34장 · '새 탭' 이름 없음: "분석 코드 analysis"
- 34장 · '새 탭' 이름 없음: "종합 보고서 report.md"
- 34장 · '새 탭' 이름 없음: "차트 값 chart-data.json"

- 메모: 원문 링크 HTTP 상태는 --net으로 돌릴 때만 확인

근거: [slide-09.jpg](../shots/baseline/slide-09.jpg) · [slide-34.jpg](../shots/baseline/slide-34.jpg)

### NAV-12

실패 · 내비게이션·전체 화면 · automated · 구현 auto

> 전체 화면 버튼은 지원 환경에서만 보이고 상태에 따라 라벨이 바뀌며, 미지원 환경에서 F를 눌러도 오류가 없다. 진입·종료 후 장이 유지되고 맞춤이 다시 계산된다  
> 기준: 미지원 버튼 0, 오류 0, 라벨 2상태, current 불변

실패 2건

- 미지원 환경에서 F 후 오류: unhandled rejection: TypeError: Fullscreen API is not supported
- 지원 환경 전체 화면 버튼 없음(라벨 2상태 확인 불가)

### CTL-01

실패 · 컨트롤·크기 · automated · 구현 auto

> 화면 위 컨트롤은 뷰포트 기준 44×44 이상이고 서로 12px 이상 떨어진다(캔버스와 함께 축소되지 않는다)  
> 기준: 고정 컨트롤 <44px 0, 간격 <12px 0, 덱 안 링크 히트 영역 <44px 0(확대 히트 영역 포함)

실패 16건 · 장 34

- 34장 · 375x812 덱 안 링크 30×5(<44): a "자료조사 research"
- 34장 · 375x812 덱 안 링크 30×5(<44): a "분석 코드 analysis"
- 34장 · 375x812 덱 안 링크 36×5(<44): a "종합 보고서 report.md"
- 34장 · 375x812 덱 안 링크 39×5(<44): a "차트 값 chart-data.json"
- 34장 · 812x375 덱 안 링크 53×8(<44): a "자료조사 research"
- 34장 · 812x375 덱 안 링크 53×8(<44): a "분석 코드 analysis"
- 34장 · 812x375 덱 안 링크 64×8(<44): a "종합 보고서 report.md"
- 34장 · 812x375 덱 안 링크 70×8(<44): a "차트 값 chart-data.json"
- 34장 · 1280x720 덱 안 링크 102×16(<44): a "자료조사 research"
- 34장 · 1280x720 덱 안 링크 101×16(<44): a "분석 코드 analysis"
- 34장 · 1280x720 덱 안 링크 123×16(<44): a "종합 보고서 report.md"
- 34장 · 1280x720 덱 안 링크 134×16(<44): a "차트 값 chart-data.json"
- 34장 · 1440x900 덱 안 링크 115×18(<44): a "자료조사 research"
- 34장 · 1440x900 덱 안 링크 114×18(<44): a "분석 코드 analysis"
- 34장 · 1440x900 덱 안 링크 139×18(<44): a "종합 보고서 report.md"
- 34장 · 1440x900 덱 안 링크 150×18(<44): a "차트 값 chart-data.json"

근거: [slide-34.jpg](../shots/baseline/slide-34.jpg)

### CTL-02

실패 · 컨트롤·가림 · automated · 구현 auto

> 고정 컨트롤·힌트·안내는 어떤 뷰포트에서도 현재 장의 텍스트·쪽 번호·출처·결론·차트를 가리지 않는다  
> 기준: 교차 면적 0

실패 133건 · 장 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34

- 1장 · 1920x1080: button.replay-btn ↔ span.pg "1 / 34" 215px²
- 2장 · 1920x1080: button.replay-btn ↔ span.pg "2 / 34" 215px²
- 3장 · 1920x1080: button.replay-btn ↔ span.pg "3 / 34" 215px²
- 4장 · 1920x1080: button.replay-btn ↔ span.pg "4 / 34" 215px²
- 5장 · 1920x1080: button.replay-btn ↔ span.pg "5 / 34" 215px²
- 7장 · 1920x1080: button.replay-btn ↔ span.pg "7 / 34" 215px²
- 8장 · 1920x1080: button.replay-btn ↔ span.pg "8 / 34" 215px²
- 9장 · 1920x1080: button.replay-btn ↔ span.pg "9 / 34" 215px²
- 10장 · 1920x1080: button.replay-btn ↔ span.pg "10 / 34" 215px²
- 11장 · 1920x1080: button.replay-btn ↔ span.pg "11 / 34" 215px²
- 12장 · 1920x1080: button.replay-btn ↔ span.pg "12 / 34" 215px²
- 13장 · 1920x1080: button.replay-btn ↔ span.pg "13 / 34" 215px²
- 14장 · 1920x1080: button.replay-btn ↔ span.pg "14 / 34" 215px²
- 15장 · 1920x1080: button.replay-btn ↔ span.pg "15 / 34" 215px²
- 16장 · 1920x1080: button.replay-btn ↔ span.pg "16 / 34" 215px²
- 17장 · 1920x1080: button.replay-btn ↔ span.pg "17 / 34" 215px²
- 20장 · 1920x1080: button.replay-btn ↔ span.pg "20 / 34" 148px²
- 21장 · 1920x1080: button.replay-btn ↔ span.pg "21 / 34" 215px²
- 22장 · 1920x1080: button.replay-btn ↔ span.pg "22 / 34" 215px²
- 23장 · 1920x1080: button.replay-btn ↔ span.pg "23 / 34" 215px²
- 24장 · 1920x1080: button.replay-btn ↔ span.pg "24 / 34" 215px²
- 25장 · 1920x1080: button.replay-btn ↔ span.pg "25 / 34" 148px²
- 26장 · 1920x1080: button.replay-btn ↔ span.pg "26 / 34" 215px²
- 27장 · 1920x1080: button.replay-btn ↔ span.pg "27 / 34" 215px²
- 28장 · 1920x1080: button.replay-btn ↔ span.pg "28 / 34" 215px²
- … 외 108건(JSON 보고서에 전부)

근거: [stage-1920x1080-s10.jpg](../shots/baseline/stage-1920x1080-s10.jpg) · [stage-1366x768-s10.jpg](../shots/baseline/stage-1366x768-s10.jpg) · [stage-1280x720-s10.jpg](../shots/baseline/stage-1280x720-s10.jpg) · [stage-844x390-s10.jpg](../shots/baseline/stage-844x390-s10.jpg) · [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-02.jpg](../shots/baseline/slide-02.jpg) · [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg)

### CTL-03

실패 · 컨트롤·발표 중 숨김 · automated · 구현 auto

> 포인터가 3초 멈추면 컨트롤이 흐려지고, 움직이거나 탭하면 즉시 돌아오며, 포커스가 있으면 숨지 않는다  
> 기준: 정지 시 ≤0.2, 복귀 200ms 안 1, 포커스 중 1

실패 1건

- 포인터 3초 정지 후 컨트롤 불투명도 1(>0.2)

### CTL-04

실패 · 컨트롤·피드백 · automated · 구현 auto

> 모든 상호작용 요소는 :active(scale 0.95~0.98, 100~160ms)·:focus-visible 링(2px, 3:1)을 갖고, :hover는 (hover:hover) and (pointer:fine) 안에만 있다  
> 기준: 누락 0, 미디어 밖 :hover 0, 링 <2px 또는 <3:1 0

실패 16건

- :active 없음: a.c3.video.t-stagger-line "영상 · OpenAI 라이브(2025-10-28)7"
- :focus-visible 없음: a.c3.video.t-stagger-line "영상 · OpenAI 라이브(2025-10-28)7"
- :active 없음: a "자료조사 research"
- :focus-visible 없음: a "자료조사 research"
- :active 없음: a "분석 코드 analysis"
- :focus-visible 없음: a "분석 코드 analysis"
- :active 없음: a "종합 보고서 report.md"
- :focus-visible 없음: a "종합 보고서 report.md"
- :active 없음: a "차트 값 chart-data.json"
- :focus-visible 없음: a "차트 값 chart-data.json"
- :focus-visible 없음: button.replay-btn "다시 재생 (R)"
- 미디어 밖 :hover: body.overview .slide:hover
- 미디어 밖 :hover: .replay-btn:hover::after
- 미디어 밖 :hover: .video:hover .play
- 미디어 밖 :hover: .poster .it:hover
- 포커스 링 auto 1px: a.c3.video.t-stagger-line "영상 · OpenAI 라이브(2025-10-28)7"

### CTL-05

실패 · 컨트롤·위계와 라벨 · automated · 구현 auto

> 다음 장 버튼만 강조 스타일이고 컨트롤 높이는 같으며 묶음은 2개 이하. 버튼 이름은 짧은 동작어이고 아이콘 버튼은 aria-label·title을 갖는다. 아이콘은 한 세트 SVG다  
> 기준: accent 버튼 1, 높이 차 0, 그룹 ≤2, 이름 비거나 '확인/OK' 0, 이름 ≤12자, aria-label 누락 0, stroke-width·viewBox 각 1종

실패 1건

- 강조(인디고) 버튼 0개(다음 장 하나여야 함)

### CTL-06

실패 · 컨트롤·모바일 네이티브 · automated · 구현 auto

> viewport-fit=cover와 safe-area 여백, 100dvh, 탭 하이라이트 제거, 버튼 touch-action manipulation, 무대 overscroll-behavior none을 갖는다  
> 기준: 모든 항목 충족, 100vh 0

실패 7건

- meta viewport에 viewport-fit=cover 없음: <meta name="viewport" content="width=device-width, initial-scale=1">
- 고정 요소 safe-area 여백(env(safe-area-inset-*)) 없음
- 탭 하이라이트 rgba(51, 181, 229, 0.4)
- 버튼 touch-action auto: button.replay-btn "다시 재생 (R)"
- 버튼 user-select auto: button.replay-btn "다시 재생 (R)"
- 무대 overscroll-behavior auto/auto
- fit()이 visualViewport resize에 걸려 있지 않음

### CTL-07

실패 · 컨트롤·비상호작용 구분 · automated · 구현 auto

> 누를 수 없는 요소(표지 알약·킥커·주장 라벨·포스터 항목)는 버튼처럼 보이거나 호버에 반응하지 않는다  
> 기준: 0건

실패 1건

- 누를 수 없는 요소의 :hover: .poster .it:hover (6개)

### ONB-01

실패 · 첫 진입·안내 · automated · 구현 auto

> 첫 방문에 기기별 한 줄 조작 안내가 콘텐츠를 가리지 않고 보였다가 첫 이동이나 5초 뒤 사라지고, 재방문에는 뜨지 않으며 ?로 다시 볼 수 있다  
> 기준: 모든 단계 기대대로, 오류 0, alert/dialog 0, 문구 2문장 이하·쉼표 콜론 0, 렌더 PNG 차이 0

실패 1건

- 첫 방문 조작 안내 없음

### ONB-02

실패 · 첫 진입·기기 맞춤 표현 · automated · 구현 auto

> 터치 환경에서는 키 표기를, 데스크톱에서는 터치 표현을 보이지 않는다  
> 기준: 터치: 키 표기 0, 데스크톱: 키 안내 존재

실패 2건

- 390x844 터치 화면에 키 표기: (R)
- 375x812 터치 화면에 키 표기: (R)

### ONB-03

실패 · 첫 진입·세로 휴대폰 · both · 구현 auto+manual

> 세로 휴대폰에서 회전 안내 또는 세로 읽기 모드가 보이고, 가로로 돌리면 안내가 사라지며 장 번호가 유지된다  
> 기준: 세로 표시, 가로 숨김, current 불변, 가로 덱 폭 ≥95%

실패 3건

- 390x844 세로: 회전 안내·세로 읽기 모드 없음
- 375x812 세로: 회전 안내·세로 읽기 모드 없음
- 375×812 세로 배율 0.1953 → 헤드라인 실효 9.4px·본문 3.9px

- 메모: '가로 덱 폭 ≥95%'는 16:9 덱이 2.17:1 화면에서 폭을 채울 수 없어 '한 변(높이)을 95% 이상 채움'으로 잰다

근거: [onb03-390x844-portrait.jpg](../shots/baseline/onb03-390x844-portrait.jpg) · [onb03-844x390-landscape.jpg](../shots/baseline/onb03-844x390-landscape.jpg) · [onb03-375x812-portrait.jpg](../shots/baseline/onb03-375x812-portrait.jpg) · [onb03-812x375-landscape.jpg](../shots/baseline/onb03-812x375-landscape.jpg)

수동 확인 절차: 390×844·375×812에서 안내/읽기 모드 표시, 812×375로 바꿔 숨김·배율=min(812/1920,375/1080)·current 유지·덱 폭 비율을 확인하고 각 크기 스크린샷을 저장한다
볼 것: [onb03-390x844-portrait.jpg](../shots/baseline/onb03-390x844-portrait.jpg) · [onb03-844x390-landscape.jpg](../shots/baseline/onb03-844x390-landscape.jpg) · [onb03-375x812-portrait.jpg](../shots/baseline/onb03-375x812-portrait.jpg) · [onb03-812x375-landscape.jpg](../shots/baseline/onb03-812x375-landscape.jpg)

### ONB-04

통과 · 첫 진입·장벽 없음 · automated · 구현 auto

> 로드 직후 입력 없이 1장 표지가 보이고, 표지 제목을 덮는 고정·모달 요소가 없다  
> 기준: current=cover, 교차 0, 모달·배너 0, 200

- 메모: 공개 URL 200은 --public=URL로 확인

### RSP-01

통과 · 화면 크기·비율 · both · 구현 auto+manual

> 모든 QA 뷰포트에서 캔버스가 16:9로 가운데 맞춰지고 가로 스크롤과 잘림이 없다  
> 기준: 비율 오차 ≤0.5%, scrollWidth>innerWidth 0, deck rect 뷰포트 밖 0, 여백 차 ≤1px

- 메모: 뷰포트마다 10장 한 장을 찍어 묶음으로 낸다(34장 × 11뷰포트 전부는 찍지 않음, 덱 상자는 장과 무관)

근거: [stage-1920x1080-s10.jpg](../shots/baseline/stage-1920x1080-s10.jpg) · [stage-1512x982-s10.jpg](../shots/baseline/stage-1512x982-s10.jpg) · [stage-1440x900-s10.jpg](../shots/baseline/stage-1440x900-s10.jpg) · [stage-1366x768-s10.jpg](../shots/baseline/stage-1366x768-s10.jpg)

수동 확인 절차: 1920×1080, 1512×982, 1440×900, 1366×768, 1280×720, 1024×768, 2560×1080, 960×1080, 844×390, 390×844, 375×812에서 34장 스크린샷을 qa/after/<뷰포트>/에 저장하고 deck rect·scrollWidth·좌우 여백 차를 기록한다
볼 것: [stage-1920x1080-s10.jpg](../shots/baseline/stage-1920x1080-s10.jpg) · [stage-1512x982-s10.jpg](../shots/baseline/stage-1512x982-s10.jpg) · [stage-1440x900-s10.jpg](../shots/baseline/stage-1440x900-s10.jpg) · [stage-1366x768-s10.jpg](../shots/baseline/stage-1366x768-s10.jpg) · [stage-1280x720-s10.jpg](../shots/baseline/stage-1280x720-s10.jpg) · [stage-1024x768-s10.jpg](../shots/baseline/stage-1024x768-s10.jpg) · [stage-2560x1080-s10.jpg](../shots/baseline/stage-2560x1080-s10.jpg) · [stage-960x1080-s10.jpg](../shots/baseline/stage-960x1080-s10.jpg) · [stage-844x390-s10.jpg](../shots/baseline/stage-844x390-s10.jpg) · [stage-390x844-s10.jpg](../shots/baseline/stage-390x844-s10.jpg) · [stage-375x812-s10.jpg](../shots/baseline/stage-375x812-s10.jpg)

### RSP-02

실패 · 화면 크기·실효 글자 · automated · 구현 auto

> 노트북·화면 공유 해상도에서 실효 글자 크기가 읽힌다  
> 기준: 1280×720 실효 ≥12px, 1280×720 헤드라인 글자 높이 ≥30px, 480×270 헤드라인 ≥12px, 쪽 번호 OCR 34/34

실패 66건 · 장 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34

- 1장 · 1280×720 최소 실효 글자 9.33px(<12): span "데이터리터러시의이해 중간고사 과제"
- 2장 · 1280×720 최소 실효 글자 10.67px(<12): span.source.credit "사진: AI 생성 이미지(Gemini) · 이처럼 "
- 3장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "이 발표가 답하려는 것"
- 4장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "결론 먼저"
- 5장 · 1280×720 최소 실효 글자 8.65px(<12): text.n-s "학습 연산 연 4.1배"
- 6장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "재귀적 자기개선 · 지금 보이는 신호"
- 7장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "AI 발전 속도 · 관계식 R1"
- 8장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "AI 발전 속도 · 관계식 R1"
- 9장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "AI 발전 속도 · 회사 대표들의 말"
- 10장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "전문가 예상 · 관계식 R2"
- 11장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "전문가 예상 · 관계식 R3"
- 12장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "전문가 예상 · 컨설팅 기관"
- 13장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "실제 고용 1 · 미국 세부 직업 · 수업 7주 상"
- 14장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "실제 고용 1 · 노출 상위 직업"
- 15장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "실제 고용 1 · 수업 9주 층화 · 심슨의 역설"
- 16장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "예측모형 · 수업 6주 보너스 · 학습/검증 분리"
- 17장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "실제 고용 2 · 한국 직업 대분류"
- 18장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "실제 고용 3 · 신입 채용 · 관계식 R4"
- 19장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "로봇 학습 데이터"
- 20장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "관계식 R6 · 로봇 데이터가 따라잡는 데 걸리는 "
- 21장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "속도를 늦추는 요인 · 관계식 R5"
- 22장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "바이오 반도체 · 뉴로모픽"
- 23장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "2036 추정 1 · 모형의 뼈대"
- 24장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "2036 추정 2 · AI 능력 연장"
- 25장 · 1280×720 최소 실효 글자 9.33px(<12): div.kicker.t-stagger-line "2036 추정 3 · 직급별"
- … 외 41건(JSON 보고서에 전부)

- 메모: 480×270 쪽 번호는 macOS Vision OCR로 읽었다

근거: [slide-01.jpg](../shots/baseline/slide-01.jpg) · [slide-02.jpg](../shots/baseline/slide-02.jpg) · [slide-03.jpg](../shots/baseline/slide-03.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-05.jpg](../shots/baseline/slide-05.jpg) · [slide-06.jpg](../shots/baseline/slide-06.jpg)

### RSP-03

통과 · 화면 크기·확대 · both · 구현 auto+manual

> 핀치·브라우저 확대를 막지 않고, 200% 확대에서도 장 전체가 보이거나 읽기 모드에서 글자가 실제로 커진다  
> 기준: 확대 차단 0, 네 모서리 뷰포트 안, 읽기 모드 실효 크기 ≥1.8배

- 메모: 읽기 모드 실효 크기 1.8배·핀치 후 화면은 수동

근거: [rsp03-1440x900-zoom200.jpg](../shots/baseline/rsp03-1440x900-zoom200.jpg)

수동 확인 절차: meta viewport에 user-scalable=no·maximum-scale 유무를 grep하고, 200% 확대에서 장 네 모서리와 읽기 모드 본문 실효 크기를 측정하며 390×844 핀치 후 스크린샷을 비교한다
볼 것: [rsp03-1440x900-zoom200.jpg](../shots/baseline/rsp03-1440x900-zoom200.jpg)

### RSP-04

실패 · 화면 크기·첫 페인트 · automated · 구현 auto

> 첫 페인트부터 무대에 1장만 보이고 34장이 세로로 쌓인 화면이 깜빡이지 않는다  
> 기준: 보이는 장 1, 가로 스크롤 0, 표지 영역 밖 픽셀 차 0

실패 2건

- 첫 페인트에 가로 스크롤
- 첫 페인트와 완성 무대의 표지 밖 픽셀 차 50.5%

근거: [rsp04-early.jpg](../shots/baseline/rsp04-early.jpg)

### MOT-01

통과 · 모션·장 전환 · automated · 구현 auto

> 장 전환은 250ms 이하, 거리 8px, blur 3px 이하, 앞으로 가면 새 장이 오른쪽에서 들어오고 뒤로 가면 거울 방향이다  
> 기준: duration ≤0.25s, 진입 translateX 앞 +/뒤 −, 퇴장 반대

### MOT-02

실패 · 모션·장 안 등장 · automated · 구현 auto

> 글줄 차례 등장은 30~80ms 간격에 장당 1000ms 안에 끝나고, 차트 빌드는 1500ms 안에 끝나며 도중에도 즉시 넘어간다  
> 기준: 글줄 ≤1000ms, 간격 30~80ms, 차트 ≤1500ms, 전환 지연 ≤50ms

실패 14건 · 장 7, 10, 11, 13, 17, 24, 26

- 10장 · 글줄 등장 1220ms(>1000)
- 11장 · 글줄 등장 1380ms(>1000)
- 13장 · 글줄 등장 1140ms(>1000)
- 17장 · 글줄 등장 1220ms(>1000)
- 24장 · 글줄 등장 1220ms(>1000)
- 26장 · 글줄 등장 1140ms(>1000)
- 7장 · 차트 빌드 2290ms(>1500)
- 10장 · 차트 빌드 2530ms(>1500)
- 11장 · 차트 빌드 2570ms(>1500)
- 13장 · 차트 빌드 1776ms(>1500)
- 17장 · 차트 빌드 2570ms(>1500)
- 24장 · 차트 빌드 1830ms(>1500)
- 26장 · 차트 빌드 3220ms(>1500)
- 7장 · 떠난 장의 차트 타임라인이 계속 돎(paused false, 263/2290ms)

근거: [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-10.jpg](../shots/baseline/slide-10.jpg) · [slide-11.jpg](../shots/baseline/slide-11.jpg) · [slide-13.jpg](../shots/baseline/slide-13.jpg) · [slide-17.jpg](../shots/baseline/slide-17.jpg) · [slide-24.jpg](../shots/baseline/slide-24.jpg)

### MOT-03

실패 · 모션·재방문 · automated · 구현 auto

> 이미 본 장으로 돌아오면 완성 상태로 바로 보이고, 다시 보려면 R이나 버튼으로만 재생한다. 재생 후 Space는 정확히 한 장 넘긴다  
> 기준: 재방문 opacity 1·진행 완료, R 후 opacity <1, Space +1, 추가 재생 0

실패 2건 · 장 3

- 3장 · 이미 본 3장으로 돌아온 50ms 뒤 흐린 글줄 4/4(다시 재생됨)
- R 후 50ms 첫 글줄 불투명도 1(재생 안 됨)

근거: [slide-03.jpg](../shots/baseline/slide-03.jpg)

### MOT-04

실패 · 모션·곡선과 속성 · automated · 구현 auto

> overshoot·bounce·ease-in·scale(0)·transition: all이 없고, transform·opacity(작은 blur)만 움직이며 퇴장은 등장보다 짧은 페이드다  
> 기준: 모두 0, 퇴장 ≤200ms이고 ≤ 등장

실패 3건

- overshoot 이징 cubic-bezier(0.34, 1.45, 0.64, 1)
- JS scale: [0, 1](점이 0에서 커짐)
- 장 퇴장 페이드 250ms(>200, 등장과 같음)

### MOT-05

실패 · 모션·토큰 · automated · 구현 auto

> 모든 시간·이징은 모션 토큰을 참조하고 이징은 3개 이하이며 JS는 CSS 변수를 읽는다  
> 기준: 이징 ≤3, 사유 없는 손값 0

실패 7건

- slides.css:14 토큰 밖 시간 값 1600ms
- slides.css:205 토큰 밖 시간 값 200ms
- motion.js:13 토큰 밖 시간 값 micro: 80
- motion.js:13 토큰 밖 시간 값 stagger: 40
- motion.js:13 토큰 밖 시간 값 fast: 250
- motion.js:13 토큰 밖 시간 값 slow: 500
- JS가 모션 CSS 변수를 읽지 않음(시간을 JS 상수로 다시 적음)

### MOT-06

실패 · 모션·모션 감소 · automated · 구현 auto

> prefers-reduced-motion에서 장 사이는 150~200ms 페이드만, 이동·블러·빌드·교차 페이드 없이 진입 즉시 최종 상태다  
> 기준: opacity 150~200ms만, transform/filter 변화 0, 픽셀 차 0, 교차 페이드 0회

실패 1건

- 모션 감소에서 장 사이 전환 none 0s(opacity 150~200ms 페이드 기대)

### MOT-07

실패 · 모션·반복 정지 · automated · 구현 auto

> 끝없이 반복되는 움직임이 없다. 표지 교차 페이드는 정해진 횟수 뒤 또는 첫 입력·장 이탈·탭 숨김 때 멈춘다  
> 기준: 전환 ≤2회, 30초 뒤 running 0, hidden 중 0회, infinite 0, 자동 장 이동 0

실패 1건

- 표지 30초 동안 사진 교차 5회(>2)

- 메모: 교차 1회 = 표지 사진 하나가 .on을 새로 얻은 횟수

### MOT-08

실패 · 모션·순서와 절제 · both · 구현 auto+manual

> 등장 순서는 읽기 순서(위→아래, 왼→오른)이고 차트는 축→데이터→강조→결론 순, 한 번에 한 가지만 움직인다. 숫자 팝인은 값이 실제로 바뀌는 곳이나 핵심 수치 장에만 쓴다  
> 기준: 순서 역전 0, 동시 변화 그룹 ≤2, .t-digit-group 장당 ≤1·덱 ≤8장, 표지 순차 대상 ≤4

실패 9건 · 장 2, 4, 8, 12, 18, 19, 21, 23

- 2장 · 등장 순서가 읽기 순서와 어긋남 1곳
- 4장 · 숫자 팝인 3개(>1)
- 8장 · 숫자 팝인 3개(>1)
- 12장 · 숫자 팝인 2개(>1)
- 18장 · 숫자 팝인 3개(>1)
- 19장 · 숫자 팝인 3개(>1)
- 21장 · 숫자 팝인 2개(>1)
- 23장 · 등장 순서가 읽기 순서와 어긋남 1곳
- 숫자 팝인 장 12(>8)

근거: [slide-02.jpg](../shots/baseline/slide-02.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-08.jpg](../shots/baseline/slide-08.jpg) · [slide-12.jpg](../shots/baseline/slide-12.jpg) · [slide-18.jpg](../shots/baseline/slide-18.jpg) · [slide-19.jpg](../shots/baseline/slide-19.jpg)

수동 확인 절차: 장마다 --i 순서와 bbox (y,x) 순서를 비교하고, snap-motion.ts로 0·0.2·0.4·0.6·1 프레임의 그룹 출현을 판정하며, 장별 전환 종류 표와 .t-digit-group 수를 만든다
볼 것: [](bun scripts/snap-motion.ts 5,7,13 → presentation/renders/motion/)

### MOT-09

실패 · 모션·목록 · both · 구현 auto+manual

> design-standard에 모든 애니메이션이 목적과 함께 기록돼 있고 목록 밖 모션이 없다  
> 기준: 목록 밖 0, 목적 빈 칸 0

실패 3건

- design-standard에 모션 목록 절 없음
- 모션 목록에 '장 전환' 행 없음
- 모션 목록에 '글줄' 행 없음

수동 확인 절차: motion.js·slides.css·deck.css의 transition/animation/anime 호출을 나열해 목록과 대조한다
볼 것: [components.md](../../presentation/design-standard/components.md) · [README.md](../../presentation/design-standard/README.md) · [color.md](../../presentation/design-standard/color.md) · [domain.md](../../presentation/design-standard/domain.md) · [typography.md](../../presentation/design-standard/typography.md) · [layout.md](../../presentation/design-standard/layout.md)

### MOT-10

통과 · 모션·성능 · automated · 구현 auto

> 보급형 휴대폰 성능에서도 장 넘김과 빌드가 끊기지 않는다  
> 기준: 50ms 초과 프레임 0, 평균 FPS ≥50, 에뮬레이션 결과를 실기기 통과로 보고하지 않음

- 메모: CPU 4배 감속 에뮬레이션(390×844). 실기기 확인 아님

### MOT-11

실패 · 모션·복귀 · automated · 구현 auto

> 빌드 도중 탭을 떠났다 돌아오면 차트가 반쯤 그려진 채 멈춰 있지 않다  
> 기준: current 불변, 진행 1

실패 1건 · 장 7

- 7장 · 탭 복귀 100ms 뒤 차트 빌드 169/2290ms — 반쯤 그려진 채로 보임(3121ms 뒤 2290ms)

- 메모: 탭 숨김은 document.hidden·visibilitychange를 10초 바꿔 모사(실제 탭 전환 아님). 돌아온 100ms 뒤 완성 상태여야 통과

근거: [slide-07.jpg](../shots/baseline/slide-07.jpg)

### A11Y-01

실패 · 접근성·포커스와 숨김 · automated · 구현 auto

> 현재 장이 아닌 장은 inert이고 Tab 포커스가 현재 장과 고정 컨트롤 밖으로 새지 않는다  
> 기준: 비현재 장 33개 모두 inert, 바깥 포커스 0

실패 1건

- 현재 장이 아닌데 inert·aria-hidden 아닌 장 33/33

### A11Y-02

실패 · 접근성·변화 알림 · automated · 구현 auto

> 장이 바뀌면 aria-live 영역이 'n / 34 헤드라인'을 알리고 개요 열고 닫기도 알린다  
> 기준: 매 이동 갱신, 장 번호와 헤드라인 포함

실패 1건

- aria-live=polite 영역 없음

### A11Y-03

실패 · 접근성·구조 · automated · 구현 auto

> 장마다 heading이 정확히 하나이고(nohead 장은 시각적으로 숨긴 heading) 서로 겹치지 않으며, 쪼갠 숫자는 한 덩어리로 읽힌다  
> 기준: heading ≠1 장 0, 중복 0, aria-label 불일치·누락 0

실패 45건 · 장 2, 4, 8, 11, 12, 13, 14, 15, 16, 18, 19, 21, 26

- 2장 · h1·h2 0개(1 기대) — nohead 장은 숨긴 heading 필요
- 4장 · 쪼갠 숫자 "105" aria-label 없음
- 4장 · "105" 숫자 조각 aria-hidden 0/3
- 4장 · 쪼갠 숫자 "3.5" aria-label 없음
- 4장 · "3.5" 숫자 조각 aria-hidden 0/3
- 4장 · 쪼갠 숫자 "94" aria-label 없음
- 4장 · "94" 숫자 조각 aria-hidden 0/2
- 8장 · 쪼갠 숫자 "188" aria-label 없음
- 8장 · "188" 숫자 조각 aria-hidden 0/3
- 8장 · 쪼갠 숫자 "129" aria-label 없음
- 8장 · "129" 숫자 조각 aria-hidden 0/3
- 8장 · 쪼갠 숫자 "105" aria-label 없음
- 8장 · "105" 숫자 조각 aria-hidden 0/3
- 11장 · 쪼갠 숫자 "105" aria-label 없음
- 11장 · "105" 숫자 조각 aria-hidden 0/3
- 12장 · 쪼갠 숫자 "2045" aria-label 없음
- 12장 · "2045" 숫자 조각 aria-hidden 0/4
- 12장 · 쪼갠 숫자 "29.5" aria-label 없음
- 12장 · "29.5" 숫자 조각 aria-hidden 0/4
- 13장 · 쪼갠 숫자 "−0.017" aria-label 없음
- 13장 · "−0.017" 숫자 조각 aria-hidden 0/6
- 14장 · 쪼갠 숫자 "+0.3" aria-label 없음
- 14장 · "+0.3" 숫자 조각 aria-hidden 0/4
- 15장 · 쪼갠 숫자 "11" aria-label 없음
- 15장 · "11" 숫자 조각 aria-hidden 0/2
- … 외 20건(JSON 보고서에 전부)

근거: [slide-02.jpg](../shots/baseline/slide-02.jpg) · [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-08.jpg](../shots/baseline/slide-08.jpg) · [slide-11.jpg](../shots/baseline/slide-11.jpg) · [slide-12.jpg](../shots/baseline/slide-12.jpg) · [slide-13.jpg](../shots/baseline/slide-13.jpg)

### A11Y-04

실패 · 접근성·자동 검사 · automated · 구현 partial

> 34장 전부 axe-core critical·serious 위반이 없다  
> 기준: critical·serious 0(color-contrast·svg-img-alt·image-alt·button-name 포함)

실패 24건 · 장 6, 9, 18, 19

- 6장 · color-contrast: 대비 3.32:1 < 4.5 — div.kicker.t-stagger-line "재귀적 자기개선 · 지금 보이는 신호" 14px 600 (픽셀 최악 5%)
- 6장 · color-contrast: 대비 3.62:1 < 4.5 — span.tag "2차 · 자체 보고" 14px 600 (픽셀 최악 5%)
- 6장 · color-contrast: 대비 4.23:1 < 4.5 — span.tag "2차" 14px 600 (픽셀 최악 5%)
- 6장 · color-contrast: 대비 3.07:1 < 4.5 — span.tag "직접" 14px 600 (픽셀 최악 5%)
- 6장 · color-contrast: 대비 3.89:1 < 4.5 — span.source.credit "배경: AI 생성 이미지(Gemini) · Sema" 16px 400 (픽셀 최악 5%)
- 6장 · color-contrast: 대비 2.25:1 < 4.5 — span.pg "6 / 34" 16px 600 (픽셀 최악 5%)
- 6장 · color-contrast: 대비 2.18:1 < 4.5 — b "6" 16px 700 (픽셀 최악 5%)
- 6장 · color-contrast: 대비 2.85:1 < 4.5 — span.tot "34" 16px 600 (픽셀 최악 5%)
- 9장 · color-contrast: 대비 4.16:1 < 4.5 — span.vcap "영상 · OpenAI 라이브(2025-10-28)7" 16px 600 (픽셀 최악 5%)
- 18장 · color-contrast: 대비 3.23:1 < 4.5 — div.kicker.t-stagger-line "실제 고용 3 · 신입 채용 · 관계식 R4" 14px 600 (픽셀 최악 5%)
- 18장 · color-contrast: 대비 2.3:1 < 3 — span.t-digit-group "91→28" 96px 700 (픽셀 최악 5%)
- 18장 · color-contrast: 대비 2.92:1 < 3 — small "%" 24px 700 (픽셀 최악 5%)
- 18장 · color-contrast: 대비 4.39:1 < 4.5 — div.k "한국 공인회계사 합격자 중 수습 회계사로 등록한 비" 20px 400 (픽셀 최악 5%)
- 18장 · color-contrast: 대비 3.64:1 < 4.5 — p.relation.t-stagger-line "AI 능력이 두 배가 될 때마다 미국 격차 약 1." 20px 600 (픽셀 최악 5%)
- 18장 · color-contrast: 대비 3.84:1 < 4.5 — span.source.credit "배경: AI 생성 이미지(Gemini) · 한국은행" 16px 400 (픽셀 최악 5%)
- 18장 · color-contrast: 대비 2.65:1 < 4.5 — span.pg "18 / 34" 16px 600 (픽셀 최악 5%)
- 18장 · color-contrast: 대비 2.37:1 < 4.5 — b "18" 16px 700 (픽셀 최악 5%)
- 18장 · color-contrast: 대비 2.53:1 < 4.5 — span.tot "34" 16px 600 (픽셀 최악 5%)
- 19장 · color-contrast: 대비 3.02:1 < 4.5 — div.kicker.t-stagger-line "로봇 학습 데이터" 14px 600 (픽셀 최악 5%)
- 19장 · color-contrast: 대비 2.97:1 < 3 — small "개월" 24px 700 (픽셀 최악 5%)
- 19장 · color-contrast: 대비 3.54:1 < 4.5 — div.k "인터넷 영상(약 10억 시간)이 로봇 조작 데이터(" 20px 400 (픽셀 최악 5%)
- 19장 · color-contrast: 대비 3.95:1 < 4.5 — span.source.credit "배경: AI 생성 이미지(Gemini) · Waym" 16px 400 (픽셀 최악 5%)
- 19장 · color-contrast: 대비 3.26:1 < 4.5 — b "19" 16px 700 (픽셀 최악 5%)
- 19장 · color-contrast: 대비 4:1 < 4.5 — span.tot "34" 16px 600 (픽셀 최악 5%)

- 메모: axe-core가 이 환경에 없어 critical·serious 규칙 중 image-alt·button-name·link-name·svg-img-alt·color-contrast·html-has-lang·document-title·duplicate-id만 직접 잼

근거: [slide-06.jpg](../shots/baseline/slide-06.jpg) · [slide-09.jpg](../shots/baseline/slide-09.jpg) · [slide-18.jpg](../shots/baseline/slide-18.jpg) · [slide-19.jpg](../shots/baseline/slide-19.jpg)

### A11Y-05

실패 · 접근성·대체 상태 · automated · 구현 auto

> JS 비활성·anime CDN 차단·이미지 차단에서도 34장 내용이 최종 상태로 읽힌다  
> 기준: .slide 34, opacity<1 텍스트 0, 덱 정지 오류 0, CLS 0

실패 3건

- JS 끔: 빈 차트 9(metr_horizon, agi_forecast_shift, espai_two_clocks, occ_scatter, occ_quintile, kr_occupation_index, proj_capability, proj_kr_jobs, proj_wave)
- JS 끔: noscript 안내 없음
- anime 차단: 오류 Uncaught TypeError: Cannot destructure property 'createTimeline' of 'window.anime' as it is undefined. @ motion.js:7

근거: [a11y05-nojs.jpg](../shots/baseline/a11y05-nojs.jpg) · [a11y05-noanime-s8.jpg](../shots/baseline/a11y05-noanime-s8.jpg)

### A11Y-06

통과 · 접근성·복사 · automated · 구현 auto

> 콘텐츠 텍스트는 선택·복사할 수 있다  
> 기준: user-select none(무대 버튼 제외) 0, 선택 문자열 비어 있지 않음

### PERF-01

실패 · 성능·로딩 · automated · 구현 partial

> 느린 모바일 회선에서도 첫 화면이 빠르고 흔들리지 않는다  
> 기준: LCP ≤2.5s, CLS ≤0.05, 첫 화면 전송량 ≤1.5MB

실패 2건

- LCP 7740ms(>2500)
- 첫 화면 전송량 1.59MB(>1.5): 가장 큰 /assets/img/desk.jpg 305KB, /assets/img/recursion.jpg 242KB

- 메모: Lighthouse가 없어 CDP(150ms RTT·1.6Mbps·CPU 4배)와 PerformanceObserver로 근사. 로컬 서버만, 공개 URL은 --public

### PERF-02

통과 · 성능·미리 받기 · automated · 구현 auto

> 다음 장 이미지는 미리 받고, 이미지가 오기 전에도 넘기기가 동작한다  
> 기준: n+1 complete=true, 지연 중 이동 성공, 첫 넘김 CLS 0

### PERF-03

통과 · 성능·외부 요청과 개인정보 · automated · 구현 auto

> 첫 로드에 동일 출처 외 요청·추적·쿠키·iframe·자동 재생이 없고 새 의존성이 추가되지 않는다  
> 기준: 타 출처 요청 0(외부 링크 클릭 제외), 쿠키 0, iframe 0, autoplay 0, 추가 의존성 0

### PERF-04

통과 · 성능·안정성 · automated · 구현 auto

> 모든 뷰포트·모드에서 JS 오류가 없고 스크립트 최상위 이름이 충돌하지 않으며 confirm·alert·beforeunload가 없다  
> 기준: 오류 0, 이름 중복 0, 차단 대화상자 0, probe-nav 1→34 정지·역행 0

- 메모: probe-nav 종료 1: 스크롤 위치로 장을 재는 geometry 검사(mismatches 33)는 발표 무대(한 장씩 겹침) 구조와 맞지 않아 판정에 쓰지 않음 — 걷기(down·up)만 본다

### META-01

실패 · 메타데이터·공유 · automated · 구현 auto

> 링크 미리보기용 meta description·og:title·og:description·og:image·og:url·og:type·twitter:card가 있고 og:image는 1200×630이다  
> 기준: 모두 존재, og:image 200·1200×630, og:title ≤30자·[,:—] 0, og:description ≤90자

실패 7건

- description 없음
- og:title 없음
- og:description 없음
- og:image 없음
- og:url 없음
- og:type 없음
- twitter:card 없음

- 메모: og:image 1200×630·200 응답은 이미지 파일이 생기면 로컬 경로로 확인

### META-02

실패 · 메타데이터·식별 · automated · 구현 auto

> 단순한 SVG favicon이 있고 <title>은 짧으며 대시·쉼표·콜론이 없다. 슬라이드 안에 로고·과목명을 반복하지 않는다  
> 기준: favicon 200, title [,:—] 0, 표지 외 반복 0

실패 2건

- favicon(link rel=icon) 없음
- <title> "AI는 언제 내 일을 대신할까 — 재귀적 자기개선 뒤의 2036년"에 대시·쉼표·콜론

### PRT-01

실패 · 인쇄·PDF · both · 구현 auto+manual

> 인쇄·PDF는 34쪽 최종 상태로 나오고 조작 UI·흐린 그림자·필터가 없다. 최종 상태는 CSS(@media print)만으로 강제된다  
> 기준: 34쪽, headline 누락 0, 컨트롤 텍스트 0, 7장 선 끝점까지 그려짐, opacity 1 아님 0

실패 8건 · 장 7, 10, 11, 17, 24, 26

- print 미디어(CSS만)에서 흐린 글줄 149
- @media print에 box-shadow: none 없음
- 7장 · PDF 7쪽 꺾은선 1/1개가 끝까지 안 그려짐: metr_horizon:l-worse 0/51점(0%)
- 10장 · PDF 10쪽 꺾은선 1/2개가 끝까지 안 그려짐: agi_forecast_shift:l-worse 0/20점(0%)
- 11장 · PDF 11쪽 꺾은선 2/2개가 끝까지 안 그려짐: espai_two_clocks:l-worse 0/9점(0%) · espai_two_clocks:l-evid 0/22점(0%)
- 17장 · PDF 17쪽 꺾은선 2/3개가 끝까지 안 그려짐: kr_occupation_index:l-evid 0/19점(0%) · kr_occupation_index:l-worse 0/24점(0%)
- 24장 · PDF 24쪽 꺾은선 3/3개가 끝까지 안 그려짐: proj_capability:l-evid 0/15점(0%) · proj_capability:l-worse 0/24점(0%) · proj_capability:l-neutral 34/41점(83%)
- 26장 · PDF 26쪽 꺾은선 2/4개가 끝까지 안 그려짐: proj_kr_jobs:l-evid 0/30점(0%) · proj_kr_jobs:l-worse 0/30점(0%)

- 메모: 꺾은선 판정: 선 구간 안쪽 점(꼭짓점에서 10px 넘게 떨어진 곳, 24px 간격)마다 5×5 창 안에 선 색(RGB 거리 <48)이 있는지 렌더와 PDF 래스터(pdftoppm 1920×1080)에서 보고, 렌더에 있던 점의 90% 미만이 PDF에 있으면 실패

근거: [prt01-pdf-p07.jpg](../shots/baseline/prt01-pdf-p07.jpg) · [prt01-pdf-p10.jpg](../shots/baseline/prt01-pdf-p10.jpg) · [prt01-pdf-p11.jpg](../shots/baseline/prt01-pdf-p11.jpg) · [prt01-pdf-p17.jpg](../shots/baseline/prt01-pdf-p17.jpg) · [prt01-pdf-p24.jpg](../shots/baseline/prt01-pdf-p24.jpg) · [prt01-pdf-p26.jpg](../shots/baseline/prt01-pdf-p26.jpg) · [slide-07.jpg](../shots/baseline/slide-07.jpg) · [slide-10.jpg](../shots/baseline/slide-10.jpg)

수동 확인 절차: page.pdf({width:'1920px',height:'1080px',printBackground:true})로 만들고 pdfinfo 쪽 수, 각 쪽 headline 텍스트, 컨트롤 문자열, 7장 래스터에서 선 끝점을 확인한다. print 미디어 에뮬레이션에서 .t-stagger-line opacity와 @media print의 box-shadow:none·filter:none을 확인한다
볼 것: [prt01-pdf-p07.jpg](../shots/baseline/prt01-pdf-p07.jpg) · [prt01-pdf-p10.jpg](../shots/baseline/prt01-pdf-p10.jpg) · [prt01-pdf-p11.jpg](../shots/baseline/prt01-pdf-p11.jpg) · [prt01-pdf-p17.jpg](../shots/baseline/prt01-pdf-p17.jpg) · [prt01-pdf-p24.jpg](../shots/baseline/prt01-pdf-p24.jpg) · [prt01-pdf-p26.jpg](../shots/baseline/prt01-pdf-p26.jpg)

### PRT-02

통과 · 인쇄·모드 일관 · automated · 구현 auto

> 개요 썸네일·?slide 렌더·발표 무대가 같은 장 배치를 보인다  
> 기준: SSIM ≥0.98(34장 모두)

- 메모: 썸네일과 ?slide=n 렌더를 둘 다 폭 240px로 줄이고 가우스 흐림 1px을 준 뒤 SSIM(8px 창)을 잰다 — 글자 래스터화 차이는 지우고 배치 차이만 본다(다른 장끼리는 0.6~0.7)

### STD-01

실패 · 디자인 표준 문서 · both · 구현 auto+manual

> design-standard에 다섯 줄 계약(THESIS·OWN-WORLD·STORY·FIRST VIEW·FORM), 34장 역할 표, 색 의미 표, 대비표, 역할→컴포넌트 매핑, 용어집, 모션 목록, 어두운 장·예외 표시 목록, 상충 해소 기록이 있고 문서 값이 CSS와 같다  
> 기준: 항목 누락 0, 값 불일치 0, 미기록 예외 0

실패 9건

- 34장 역할 표 행 0(<34)
- 색 의미 표 없음
- 대비표 없음(x:1 값 5개 미만)
- 역할→컴포넌트 매핑 없음
- 모션 목록 없음
- 상충 해소 기록 없음
- typography.md 18px가 프리셋에 없음
- 예외 표시 32건(token-ok 등)이 design-standard에 기록되지 않음
- fit.js TERTIARY 확장 15개가 design-standard에 기록 없음: .band.head-band p, .gates td.yr span, .video .vcap, .chain text, .credit

수동 확인 절차: $DECK/design-standard/*.md 6개를 읽어 항목 유무를 체크하고 typography.md·color.md 값을 tokens.css와 스크립트로 대조한다. data-type-ok·token-ok·constitution-ok·taste-skill-ignore·TERTIARY 확장마다 README 기록을 대조한다
볼 것: [components.md](../../presentation/design-standard/components.md) · [README.md](../../presentation/design-standard/README.md) · [color.md](../../presentation/design-standard/color.md) · [domain.md](../../presentation/design-standard/domain.md) · [typography.md](../../presentation/design-standard/typography.md) · [layout.md](../../presentation/design-standard/layout.md)

### STD-02

실패 · 디자인 표준·헌법 감사 · automated · 구현 auto

> 매 PR 마지막 커밋에서 헌법 감사와 token-check가 0이다  
> 기준: 두 명령 종료 코드 0, 위반 0

실패 1건

- token-check --strict 종료 1: off-token: 27 (space 27)

### STD-03

실패 · 디자인 표준·일관성 · automated · 구현 auto

> 역할 클래스마다 계산 스타일이 1종이고, 인라인 style로 font·color·background를 주지 않으며, 일부 장만 새 스타일로 바뀐 반쪽 상태가 없다  
> 기준: 역할별 조합 1종, 인라인 font/color/background 0, 반쪽 전환 클래스 0

실패 8건 · 장 4, 9, 10, 12, 21

- 12장 · .tag @sage 계산 스타일 2종 — 이 장 [600 \| 14px \| 20px \| rgb(64, 77, 47) \| rgba(20, 18, 16, 0.06) \| 0px \| 12px \| 999px] ≠ 다수 [600 \| 14px \| 20px \| rgb(20, 18, 16) \| rgba(20, 18, 16, 0.08) \| 0px \| 12px \| 999px](장 4)
- 4장 · .tag에 주장 라벨이 아닌 표본 수 'n=3'
- 9장 · 메타 줄 라벨 '내부 목표'를 .tag 대신 b(700 · rgb(76, 94, 178))로 씀: b "내부 목표"
- 9장 · 메타 줄 라벨 '예측'를 .tag 대신 b(700 · rgb(76, 94, 178))로 씀: b "예측"
- 9장 · 주장 라벨 '2차'를 .tag 대신 일반 글자로 씀: p.when "2026-06 행사 발언 · 예측 · 2차"
- 9장 · 메타 줄 라벨 '예측'를 .tag 대신 b(700 · rgb(76, 94, 178))로 씀: b "예측"
- 10장 · .tag에 주장 라벨이 아닌 표본 수 'n=3'
- 21장 · .tag.est '추정'가 @ink 바탕 규칙에 덮여 .tag와 같은 모양(변형 뜻이 사라짐)

- 메모: '반쪽 전환' 비교는 --compare로 이전 보고서가 있을 때 회귀로 드러난다
- 메모: 스타일시트에 '.역할.변형'으로 따로 정의된 변형 클래스(예: .tag.est)는 별개 역할로 묶는다

근거: [slide-04.jpg](../shots/baseline/slide-04.jpg) · [slide-09.jpg](../shots/baseline/slide-09.jpg) · [slide-10.jpg](../shots/baseline/slide-10.jpg) · [slide-12.jpg](../shots/baseline/slide-12.jpg) · [slide-21.jpg](../shots/baseline/slide-21.jpg)

### STD-04

통과 · 디자인 표준·분량과 순서 · automated · 구현 auto

> 34장 분량과 내용 순서를 유지하고, 나눈 장은 순서를 보존한다  
> 기준: after ≥34장, 순서 보존 위반 0

### STD-05

수동 · 시각 QA·직접 확인 · visual · 구현 manual

> before/after 34장 1920 렌더를 나란히 놓고 장별 체크표(라벨 충돌·넘침·정렬·의도한 변화)를 채우며, 컨택트시트·흐림 덩어리 검사·10% 속도 모션 검사를 사람이 직접 본다  
> 기준: 체크표 빈 칸 0, 초점 2개 이상 장 0, 모션 위반 프레임 0

수동 확인 절차: qa/before/slide-NN.png와 qa/after/slide-NN.png로 비교 이미지와 montage -tile 6x 컨택트시트를 만들고, -blur 0x24 흐림본으로 '1초에 본 것'을 장마다 적고, CDP Animation.setPlaybackRate 0.1로 장 넘김·글줄·숫자·차트 빌드를 50ms 간격 캡처해 원점·급정지·막대 기준선 성장을 체크한다
볼 것: [compare-1.jpg](../shots/baseline/compare-1.jpg) · [compare-2.jpg](../shots/baseline/compare-2.jpg) · [compare-3.jpg](../shots/baseline/compare-3.jpg) · [compare-4.jpg](../shots/baseline/compare-4.jpg) · [contact-1.jpg](../shots/baseline/contact-1.jpg) · [contact-2.jpg](../shots/baseline/contact-2.jpg)

### STD-06

수동 · 시각 QA·독립 리뷰 · visual · 구현 manual

> 제작 대화를 모르는 리뷰어가 렌더와 다섯 줄 계약만 보고 판정하고, critique 라운드 기록으로 상위 문제가 해소된 것을 보인다. 다른 주제 덱으로 옮겨도 되는 장이 적다  
> 기준: '어긋났다' 0, 이전 라운드 상위 세 문제 미해결 0, 이식 가능 장 <3

수동 확인 절차: 하위 리뷰어에 README 첫 다섯 줄과 PNG만 주어 줄마다 '지켰다/어긋났다+장 번호' 판정을 받고, qa/critique-roundN.md(before 1회, after 최대 3회)를 작성하고, 장마다 이식 가능 여부를 표시한다
볼 것: [contact-1.jpg](../shots/baseline/contact-1.jpg) · [contact-2.jpg](../shots/baseline/contact-2.jpg)

### STD-07

실패 · 시각 QA·보고 정직성 · both · 구현 auto+manual

> 실행하지 않은 검사를 통과로 보고하지 않고, 배포 후 공개 URL을 실제로 열어 쪽 수·글꼴·차트를 확인하며 에뮬레이션과 실기기 확인을 구분해 적는다  
> 기준: 로그 없는 통과 주장 0, .slide 34(또는 분할 후 수), 빈 svg 0, 실기기 미확인 항목 명시

실패 3건

- README 검증 표 6/6행에 실행 로그(qa/ 경로) 없음
- README에 에뮬레이션·실기기 구분 없음
- 공개 URL 확인 기록 없음(--public=URL로 실행)

수동 확인 절차: PR 본문·README 검증 절의 각 검사를 qa/ 실행 로그(명령·종료 코드)와 대조하고, 공개 URL에서 .slide 수·document.fonts 상태·빈 svg 수를 기록한다
볼 것: [README.md 검증 절](../../README.md)

## 외부 검사 원문

- `python3 ~/.agents/skills/designing-decks-and-motion/scripts/constitution_audit.py src/tokens.css src/deck.css src/slides.css` → 종료 0
  - constitution audit: 글자 크기 9 · 굵기 3 · 이징 3 · 위반 0
- `python3 ~/.agents/skills/designing-decks-and-motion/scripts/constitution_audit.py src/tokens.css src/deck.css src/slides.css --max-sizes 9` → 종료 0
  - constitution audit: 글자 크기 9 · 굵기 3 · 이징 3 · 위반 0
- `bun ~/.agents/skills/designing-decks-and-motion/scripts/token-check.ts --tokens src/tokens.css src/deck.css src/slides.css index.html --strict` → 종료 1
  - index.html:287  space  32px  (margin-top) / off-token: 27 (space 27)
- `bun scripts/check-numbers.ts` → 종료 0
  -  "unverified": [] / }
- `bun scripts/render.ts index.html` → 종료 0
  -     "div.kicker.t-stagger-line \"AI 발전 속도 · 관계식 R1\" 14px — 예외로 넘김(.kicker)", /     "p.chart-s
- `bun scripts/probe-nav.ts` → 종료 1
  -  "upOk": true / }

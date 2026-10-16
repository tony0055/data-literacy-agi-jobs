# ulw plan — 덱 개선 실행 계획

입력: [이상 상태](ideal-state.md) 147조건 · [위반](violations.md) 278건 · [HIG 원칙](hig-principles.md) · [규칙](rules.md).

## 실행 물결

| 물결 | PR | 병렬 | 의존 |
| --- | --- | --- | --- |
| W0 | PR1 | 단독 | 없음(모든 PR이 이 검사기로 검증) |
| W1 | PR2 · PR3 · PR4 | 3개 병렬, 맡는 파일이 겹치지 않음 | PR1 브랜치 위 |
| W2 | PR5 · PR6 | 2개 병렬 | PR2 브랜치 위 |
| W3 | PR7 | 단독 | 모든 브랜치 병합 |

## 모든 PR의 공통 완료 조건

1. 배정된 위반 id마다 고친 내용·검증 결과를 PR 본문 표에 적는다(못 고친 것은 사유).
2. `bun scripts/visual-qa.ts` 결과: 자기 범위 조건 전부 통과, 다른 조건은 기준선보다 나빠지지 않음(회귀 0).
3. `bun scripts/build.ts` · `bun scripts/render.ts index.html`(issues []) · `bun scripts/check-numbers.ts`(unverified []) · 헌법 감사 위반 0.
4. 바뀐 장의 before/after 이미지를 `qa/pr/<번호>/before|after/`에 커밋하고 PR 본문에 나란히 보인다.
5. 만든 쪽과 다른 독립 검증 에이전트가 배정 위반을 하나씩 스크린샷으로 재확인하고, 실패가 있으면 고치는 쪽으로 돌려보낸다(최대 3회). 결과를 qa/LOG.md에 한 줄씩 남긴다.
6. force push 금지. 병합은 사용자가 한다.

## PR1 · 시각 QA 장치와 감사 기록

- 브랜치 `qa/01-visual-qa` ← 기준 `main`
- 맡는 파일: presentation/scripts/visual-qa.* · qa-all · contact-sheet · fit.js · qa/ 전체 · .gitignore
- 목표: 덱 화면은 바꾸지 않는다. 147조건 중 automated·both 142개를 조건 id 그대로 판정하는 검사기, 기준선(46a5bfc)에서 critical 4건을 포함해 실패를 잡아내는지 증명
- 배정 위반 5건(critical 0 · major 3 · minor 2): VC-05, VC-06, VC-07, VG-44, V8-50
- 통과해야 할 조건: LAY-04, MOT-09, STD-01, STD-02, STD-03, STD-06, STD-07, TYP-03

## PR2 · 카드 축소·배경 면·색·타이포·레이아웃 체계

- 브랜치 `design/02-surfaces` ← 기준 `qa/01-visual-qa`
- 맡는 파일: src/tokens.css · src/deck.css(.chart svg 블록 제외) · src/slides.css · index.html의 구조·클래스·이미지 태그(차트 div 안쪽과 <head>·script 제외)
- 목표: 18장처럼 면을 바꾸며 카드는 장당 0~1개, 연속 세 장 같은 면 금지, 미세 그라데이션은 소수 장, 헌법 감사 0, 대비 실측 통과
- 배정 위반 142건(critical 1 · major 68 · minor 73): V1-01, V1-03, V1-12, V1-23, V1-30, V1-32, V1-33, VG-22, VG-25, V1-04, V1-08, V1-11, VG-23, VG-26, V1-09, V1-10, V1-06, V1-07, VC-04, V1-17, V8-15, V8-16, V8-19, V8-26, V8-27, V8-28, V8-31, V8-33, V8-37, V8-23, VG-24, V8-10, V15-01, V15-03, V15-04, V15-05, V15-07, V15-09, V15-11, V15-12, V15-15, V15-16, V15-28, V15-14, V15-10, V15-17, V22-01, V22-03, V22-04, V22-05, V22-08, V22-09, V22-11, V22-23, V22-24, V22-41, V22-02, V22-26, V22-27, V22-10, V29-01, V29-04, V29-08, V29-05, V29-06, V29-09, V29-12, V29-16, V29-11, V1-19, V1-31, V1-38, V1-39, V1-40, V1-42, V1-43, VG-32, VG-36, VG-43, VG-45, VG-46, VC-09, V1-34, VG-40, VG-33, VG-35, VG-37, VG-38, VG-39, V8-17, V8-18, V8-20, V8-21, V8-22, V8-25, V8-30, V8-34, V8-36, V8-38, V8-40, V8-41, V8-24, V8-32, VG-41, V8-29, V8-39, V15-06, V15-08, V15-29, V15-30, V15-31, V15-32, V15-33, V15-02, V15-13, V15-18, V15-48, V15-42, V15-43, V22-07, V22-12, V22-14, V22-15, V22-16, V22-13, V22-25, V22-06, V29-02, V29-03, V29-07, V29-10, V29-15, V29-17, V29-18, V29-19, V29-20, V29-21, V29-22, V29-38, V29-14, V29-37, V29-13
- 통과해야 할 조건: A11Y-05, CARD-01, CARD-02, CARD-03, CARD-04, CARD-05, CARD-06, CARD-07, CARD-08, COL-01, COL-02, COL-03, COL-04, COL-05, CON-01, CON-02, CON-03, CON-04, CON-05, EVD-02, IMG-02, IMG-03, IMG-04, IMG-05, IMG-06, LAY-01, LAY-03, LAY-04, LAY-05, LAY-06, LAY-07, LAY-08, LAY-09, LAY-10, NAV-11, STD-01, STD-03, SURF-01, SURF-02, SURF-03, TXT-05, TXT-10, TYP-03, TYP-04, TYP-05, TYP-06, TYP-07, TYP-08, TYP-09, TYP-10, TYP-11, TYP-12, TYP-13

## PR3 · 차트 9개 문법·정직성·접근성

- 브랜치 `charts/03-grammar` ← 기준 `qa/01-visual-qa`
- 맡는 파일: src/charts.js · deck.css의 .chart svg 블록 · chart-data.json(+analysis/build_chart_data.py) · index.html의 차트 div 안쪽 텍스트·data 속성
- 목표: 숫자 값 변경 없이 잘린 점 표시·라벨 충돌 제거·직접 라벨·대체 텍스트, check-numbers 통과
- 배정 위반 42건(critical 1 · major 19 · minor 22): V8-01, V1-15, VG-20, V1-13, VG-21, V8-42, V8-02, V8-04, V8-05, V8-06, V8-43, V15-19, V15-20, V15-24, V22-39, V22-28, V22-29, V22-30, V22-36, V22-34, VG-29, V1-24, V1-14, VG-34, V8-35, V8-45, V8-07, V8-09, V8-11, V15-21, V15-22, V15-23, V15-25, V15-27, V22-18, V22-31, V22-32, V22-33, V22-37, V22-38, V22-35, VG-42
- 통과해야 할 조건: CARD-07, CHT-01, CHT-02, CHT-04, CHT-05, CHT-06, CHT-07, CHT-08, CHT-09, CHT-10, CHT-11, CHT-12, COL-04, CON-03, CON-04, EVD-01, EVD-02, EVD-04, STD-05, TXT-04, TXT-05, TXT-08, TYP-02, TYP-03, TYP-09, TYP-13

## PR4 · 내비게이션·모바일·접근성·모션·메타

- 브랜치 `nav/04-touch-a11y` ← 기준 `qa/01-visual-qa`
- 맡는 파일: src/present.js · src/motion.js · 새 src/controls.css · index.html <head>와 script 태그만
- 목표: 스와이프·보이는 이전/다음·진행 표시·휴대폰 세로 읽기·inert·aria-live·reduced-motion·메타·컨트롤이 내용을 가리지 않음
- 배정 위반 43건(critical 2 · major 29 · minor 12): VG-01, VG-07, V1-21, V1-22, V1-41, VG-02, VG-03, VG-04, VG-06, VG-08, VG-09, VG-10, VG-12, VG-13, VG-14, VG-17, VC-03, VC-08, V1-05, V1-20, VG-16, V1-16, VG-11, VG-15, VC-01, V8-49, V8-08, V8-12, V15-44, V15-45, V22-43, VG-05, VG-18, VG-19, VC-02, V8-14, V8-13, V15-36, V15-47, V15-46, V22-42, V22-44, V29-35
- 통과해야 할 조건: A11Y-02, A11Y-03, A11Y-05, CHT-04, CON-04, CTL-01, CTL-02, CTL-03, CTL-04, CTL-05, CTL-06, CTL-07, EVD-02, EVD-04, IMG-03, IMG-04, LAY-01, LAY-10, META-01, META-02, MOT-02, MOT-03, MOT-04, MOT-05, MOT-06, MOT-07, MOT-08, MOT-11, NAV-01, NAV-02, NAV-05, NAV-06, NAV-07, NAV-08, NAV-09, NAV-10, NAV-11, NAV-12, ONB-01, ONB-02, ONB-03, PERF-01, PRT-01, RSP-02, RSP-04, STD-05, SURF-06, TXT-01, TXT-03, TXT-08, TYP-01, TYP-14

## PR5 · 문장·근거·출처 표기

- 브랜치 `copy/05-writing` ← 기준 `design/02-surfaces`
- 맡는 파일: index.html 텍스트(PR2 결과 위에서)
- 목표: ~습니다·명사형, 제목 쉼표·콜론 0, 지어낸 비유 0, 출처 잘림 0, 숫자 변경 0
- 배정 위반 46건(critical 0 · major 25 · minor 21): V1-02, V1-25, VG-27, V1-28, V1-29, V1-18, V8-46, V8-47, V8-48, V8-03, V15-35, V15-37, V15-41, V15-40, V22-17, V22-19, V22-22, V22-40, V22-20, V29-23, V29-28, V29-30, V29-31, V29-27, V29-32, V1-27, V1-35, V1-36, V1-37, VG-31, V1-26, VG-28, V8-44, V15-38, V15-34, V15-39, VG-30, V15-26, V22-21, V29-24, V29-26, V29-29, V29-34, V29-36, V29-33, V29-25
- 통과해야 할 조건: CHT-10, COL-05, EVD-02, EVD-03, EVD-04, EVD-05, LAY-05, LAY-10, META-02, STD-01, TXT-01, TXT-02, TXT-03, TXT-04, TXT-05, TXT-06, TXT-08, TXT-09, TXT-10, TXT-11, TYP-03, TYP-12

## PR6 · 이미지(필요할 때만 Gemini 생성)

- 브랜치 `img/06-images` ← 기준 `design/02-surfaces`
- 맡는 파일: assets/img · MANIFEST · index.html 이미지 태그
- 목표: PR2가 낸 필요 목록만, 생성 표기·워터마크 제거
- 배정 위반 0건(critical 0 · major 0 · minor 0): 없음(PR2 결과에 따름)
- 통과해야 할 조건: 공통 조건

## PR7 · 통합본 시각 QA·디자인 표준 갱신

- 브랜치 `qa/07-integration` ← 기준 `main`
- 맡는 파일: 모든 브랜치 병합 + design-standard/*.md · README · qa/LOG·violations 상태
- 목표: 통합 상태에서 visual-qa 전 조건 통과(남는 것은 사유 기록), 독립 리뷰어 34장 확인
- 배정 위반 0건(critical 0 · major 0 · minor 0): 없음(PR2 결과에 따름)
- 통과해야 할 조건: 공통 조건

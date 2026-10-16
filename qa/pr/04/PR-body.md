# PR4 · 내비게이션·모바일·접근성·모션·메타

브랜치 `nav/04-touch-a11y` ← `qa/01-visual-qa`. 맡은 파일: `presentation/src/present.js` · `presentation/src/motion.js` · 새 `presentation/src/controls.css` · `presentation/index.html`의 `<head>`·script 태그·body 끝 noscript, 저장소 입구 `index.html`, 공유 이미지 `presentation/assets/og.jpg`(새 파일).

## ① 요약

- **터치와 보이는 버튼으로 34장을 다 넘긴다.** 스와이프(가장자리·두 손가락·확대·세로 우세는 무시, 못 미치면 제자리), 이전·다음·개요·전체 화면·다시 재생 버튼(44px, 한 SVG 세트, 다음만 인디고), 진행 표시, 1장 이전·34장 다음 비활성과 '마지막 장입니다 · 처음으로'.
- **조작부가 내용을 가리지 않는다.** 데스크톱은 꼬리말 아래 여백(필요하면 덱을 1~2% 줄여 자리를 만든다), 휴대폰 가로는 좌우 레터박스 기둥(배율 그대로), 세로는 덱 아래 막대. 9개 뷰포트 34장 교차 0.
- **휴대폰 세로에서 읽힌다.** 덱 미리보기 아래 '읽기 칸'에 지금 장을 실제 글자 크기(본문 20px, 최소 14px)로 한 열로 다시 흘린다. 장 클래스에 기대지 않는 일반 규칙(원본 계산 스타일로 판별, 표는 가로 스크롤)이라 PR2 구조 변경 뒤에도 유지된다. 34장 휴대폰 사진은 `qa/pr/04/phone/`.
- **주소·기록·키보드:** #n 딥링크·hashchange·새로고침, 개요 점프만 history에 남겨 뒤로 가기로 복귀, Esc는 닫기만·G/O로 개요(제목·닫기·현재 장 테두리·키보드 선택), 비활성 장 inert, aria-live 장 안내, 장 따라 바뀌는 title, '섹션 · n / 34'.
- **모션:** 시간·이징을 CSS 토큰에서 읽기, 글줄을 읽는 순서로 40ms 간격(≤980ms), 차트 빌드 ≤1.4초·재생 전 시작 상태 찍기(완성 모습이 먼저 번쩍이지 않음)·점선은 페이드, 본 장은 완성 상태로, 탭 숨김 때 빌드 마무리, 숫자 팝인 8장 1개씩(aria-label), 표지 교차 페이드 2번 뒤 정지, 모션 감소는 150ms 교차 페이드만, 인쇄는 CSS만으로 최종 상태.
- **메타:** 대시 없는 title, description, og·twitter(1200×630), SVG favicon, color-scheme·theme-color, viewport-fit, 글꼴 preload, 첫 페인트부터 한 장, noscript. 저장소 입구는 해시를 보존해 `제출 URL#12`가 12장에 도착.
- 배정 **43건 중 고침 23 · 부분 17 · 다른 PR 소유 3**. critical: **VG-01 고침**, **VG-07 부분**(읽기 칸·회전 안내 완료, 남은 것은 판정 이의 1과 PR2 글자 토큰).

## ② 배정 위반 표

전체 표(고친 내용·검증·사유): [qa/pr/04/violations.md](https://github.com/tony0055/data-literacy-agi-jobs/blob/nav/04-touch-a11y/qa/pr/04/violations.md)

| 상태 | id |
| --- | --- |
| 고침(23) | VG-01, VG-02, VG-04, VG-06, VG-08, VG-09, VG-14, VC-08, V1-16, VG-11, VG-15, VC-01, V8-12, V15-44, V15-45, V22-43, VG-05, VG-18, VC-02, V8-14, V8-13, V15-47, V15-46 |
| 부분(17) | VG-07, V1-21, V1-41, VG-03, VG-10, VG-12, VG-13, VG-17, VC-03, V1-20, VG-16, V8-49, V8-08, VG-19, V15-36, V22-42, V29-35 |
| 다른 PR 소유(3) | V1-22(PR2·PR5), V1-05(PR2), V22-44(PR2) |

## ③ visual-qa 결과(`--compare=baseline-cloud`, qa/reports/pr4.md)

- 통과 **56**(기준선 29) · 실패 86 · 수동 5 · 오류 0. 이 PR이 맡은 52조건 중 통과 28.
- 새로 통과 28: SURF-06, NAV-01, NAV-02, NAV-05, NAV-06, NAV-07, NAV-08, NAV-09, NAV-10, NAV-11, NAV-12, CTL-02, CTL-03, CTL-05, CTL-06, ONB-01, ONB-02, RSP-04, MOT-02, MOT-03, MOT-07, MOT-08, MOT-11, A11Y-01, A11Y-02, META-01, META-02, PRT-01.
- 실패지만 항목이 준 조건: A11Y-03(45→1), CTL-04(16→4), MOT-05(7→2), MOT-04(3→1), ONB-03(3→1), A11Y-05(3→1), LAY-10(44→38), CON-01(26→22), A11Y-04(26→22), TYP-09(56→50), TYP-14(4→3), EVD-05(4→3).
- **회귀 1: TXT-05**(13·19장 '같은 숫자 3회 이상: 0×3, 3×4'). 팝인하지 않는 숫자도 이전과 같은 배치로 글자마다 쪼개 두었는데, 판정기는 `.t-digit-group`이 아닌 숫자 조각을 글자 하나씩 센다. 문장 안 숫자 반복은 없다(판정 이의 4). 조각 이름을 판정기가 건너뛰는 `.t-digit`으로 바꾸면 EVD-05가 4장 핵심 수치를 1개로 세어 회귀가 나서, 모든 글자를 판정기에 보이는 쪽을 택했다.
- MOT-10(CPU 4배 감속 프레임)은 최종 실행 59.8fps·50ms 넘는 프레임 0. 중간 실행에서 회귀로 나왔던 것은 장마다 `:root`에 CSS 변수를 써 덱 전체 스타일을 다시 계산하던 탓이라 고쳤고, 남은 흔들림은 다른 작업자와 CPU를 나눈 탓임을 기준선 덱과 같은 조건에서 나란히 재서 확인했다.

## ④ qa-all 단계별 종료 코드

| 단계 | 종료 | 메모 |
| --- | --- | --- |
| build | 0 | chart-data 블록 변경 없음 |
| render | 0 | issues는 기준선과 같은 5장 도식 축소 글자(PR2·PR3) |
| check-numbers | 0 | unverified [] (167개) |
| constitution | 0 | 글자 크기 9 · 굵기 3 · 이징 3 · 위반 0(controls.css 포함해도 0) |
| token-check | 1 | 기준선과 같은 27건(slides.css·deck.css·index.html 본문). controls.css 0건 |
| visual-qa | 1 | 남은 실패가 있어 정상 |

## ⑤ before/after

장 렌더(1920): 모든 장의 꼬리말 위치 표시에 섹션 이름이 붙었고(34장), 사진 장(6·18·19)은 위치 표시에 어두운 바탕, 9·34장 외부 링크에 ↗, 10·17·24·26장 점선 계열이 점선으로 보이고, 16장 'R² 0.01'이 붙어 보이던 것을 고쳤다.

| 비교 시트 |
| --- |
| ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/nav/04-touch-a11y/qa/pr/04/compare-1.jpg) |
| ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/nav/04-touch-a11y/qa/pr/04/compare-2.jpg) |
| ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/nav/04-touch-a11y/qa/pr/04/compare-3.jpg) |
| ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/nav/04-touch-a11y/qa/pr/04/compare-4.jpg) |
| ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/nav/04-touch-a11y/qa/pr/04/compare-5.jpg) |
| ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/nav/04-touch-a11y/qa/pr/04/compare-6.jpg) |

발표 무대(#10, 왼쪽 before · 오른쪽 after):

| 휴대폰 세로 375×812 | 휴대폰 가로 812×375 |
| --- | --- |
| ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/nav/04-touch-a11y/qa/pr/04/stage/compare-375x812.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/nav/04-touch-a11y/qa/pr/04/stage/compare-812x375.jpg) |
| **노트북 1280×720** | **데스크톱 1440×900** |
| ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/nav/04-touch-a11y/qa/pr/04/stage/compare-1280x720.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/nav/04-touch-a11y/qa/pr/04/stage/compare-1440x900.jpg) |

휴대폰 세로 읽기 칸 34장(390×844 터치, #1~#34):

| 1–9 | 10–18 | 19–27 | 28–34 |
| --- | --- | --- | --- |
| ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/nav/04-touch-a11y/qa/pr/04/phone/sheet-1.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/nav/04-touch-a11y/qa/pr/04/phone/sheet-2.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/nav/04-touch-a11y/qa/pr/04/phone/sheet-3.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/nav/04-touch-a11y/qa/pr/04/phone/sheet-4.jpg) |

## ⑥ 못 고친 것과 사유

- **맡은 파일 밖(PR2):** tokens.css `font-display: block`과 2MB 단일 글꼴(TYP-14·PERF-01) — 덱 글자 696자 부분 파일로 145KB까지 줄어드는 것을 확인했지만, tokens.css의 원본 @font-face가 그대로면 `document.fonts.check`가 거짓이 되어(TYP-01 회귀) 되돌렸다. tokens.css에서 원본 규칙을 부분 파일+나머지 범위로 바꾸면 된다. slides.css의 overshoot `--digit-ease` 정의·`1600ms`·`200ms`(MOT-04·MOT-05), deck.css·slides.css의 미디어 밖 :hover 4개(CTL-04·CTL-07, 그중 `.replay-btn` 규칙은 이 PR 뒤로 쓰이지 않으니 지우면 됨), 2장 heading(A11Y-03), 장 안 h3·h4 수, 이미지 크기 속성·용량(IMG-03·IMG-04·PERF-01), 1280×720 실효 12px(RSP-02, 14·16px 글자 토큰).
- **PR3:** JS 꺼짐 때 빈 차트 9개(A11Y-05), 차트 계열 대비·같은 점선 쌍(CON-04·CHT-04).
- **PR5:** 본문 em dash·따옴표·날짜 표기(TXT-08), 'the future of'(TXT-03), 영상 캡션의 보이는 행선지 문구.
- **판정 이의(판정기는 고치지 않음):** ① ONB-03 '375×812 세로 배율 <0.3' — 16:9 덱이 폭 375에 들어가는 최대 배율이 0.195라 RSP-01(16:9·뷰포트 안, 기준선 통과)과 동시에 만족할 수 없다. ② MOT-06 '진입 0ms·2000ms 픽셀 차' — 같은 조건이 요구하는 150~200ms 페이드 도중(약 70ms)에 찍힌다. ③ CTL-01 '덱 안 링크 <44px' — 1920 캔버스를 0.2~0.75배로 줄이는 무대에서 링크 상자가 함께 줄고 판정기는 확대 히트 영역을 보지 않는다(읽기 칸 링크는 44px 이상). ④ TXT-05·CON-02의 숫자 조각 계산(위 ③ 절).

## ⑦ 확인 못 한 것

- 실기기(iOS Safari·안드로이드 Chrome): 안전 영역(노치), 전체 화면 미지원(iPhone), 실제 손가락 스와이프·핀치 상태는 CDP 터치 에뮬레이션으로만 확인했다.
- OCR(macOS Vision) 부분: RSP-02의 480×270 쪽 번호 OCR은 이 클라우드에서 못 돌렸다(크기로 대신 판정).
- 공개 URL(GitHub Pages)에서의 og 미리보기와 `제출 URL#12` 이동은 로컬 서버로만 확인했다(병합·배포 뒤 확인 필요).
- 읽기 칸 안 차트 svg 글자는 칸 폭에 맞춰 줄어 12px 아래다(가로로 돌리면 덱 배율로 본다).
- 전체 화면에서 Esc 한 번의 동작(NAV-08 메모)은 CDP 키 입력이 브라우저 처리를 거치지 않아 실기기 확인이 필요하다.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

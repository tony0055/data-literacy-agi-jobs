# PR4 · 내비게이션·모바일·접근성·모션·메타

브랜치 `nav/04-touch-a11y` ← `qa/01-visual-qa`. 맡은 파일: `presentation/src/present.js` · `presentation/src/motion.js` · 새 `presentation/src/controls.css` · `presentation/index.html`의 `<head>`·script 태그·body 끝 noscript, 저장소 입구 `index.html`, 공유 이미지 `presentation/assets/og.jpg`(새 파일).

## ① 요약

- **터치와 보이는 버튼으로 34장을 다 넘긴다.** 스와이프(가장자리·두 손가락·확대·세로 우세는 무시, 못 미치면 제자리), 이전·다음·개요·전체 화면·다시 재생 버튼(44px, 한 SVG 세트, 다음만 인디고), 진행 표시, 1장 이전·34장 다음 비활성과 '마지막 장입니다 · 처음으로'.
- **조작부가 내용을 가리지 않는다.** 데스크톱은 꼬리말·사진 카드 아래 여백(필요하면 덱을 1~2% 줄여 자리를 만든다), 휴대폰 가로는 좌우 레터박스 기둥(배율 그대로), 세로는 덱 아래 막대. 9개 뷰포트 34장 교차 0. 덱 안 링크(34장 출처·9장 영상)는 무대 배율에 반비례하는 투명 히트 영역으로 어느 화면에서나 44px 이상.
- **휴대폰 세로에서 읽힌다.** 덱 미리보기 아래 '읽기 칸'에 지금 장을 실제 글자 크기(본문 20px, 최소 14px)로 한 열로 다시 흘린다. 차트는 가장 작은 글자가 12.5px이 되는 폭으로 그려 표처럼 가로로 밀어 본다. 장 클래스에 기대지 않는 일반 규칙(원본 계산 스타일로 판별)이라 PR2 구조 변경 뒤에도 유지된다. 34장 휴대폰 사진은 `qa/pr/04/phone/`.
- **주소·기록·키보드:** #n 딥링크·hashchange·새로고침, 개요 점프만 history에 남겨 뒤로 가기로 복귀, Esc는 닫기만·G/O로 개요(제목·닫기·현재 장 테두리·키보드 선택), 비활성 장 inert, aria-live 장 안내, 장 따라 바뀌는 title, '섹션 · n / 34'.
- **모션:** 시간·이징을 CSS 토큰에서 읽기, 글줄을 읽는 순서로 40ms 간격(≤980ms), 차트 빌드 ≤1.4초·재생 전 시작 상태 찍기(완성 모습이 먼저 번쩍이지 않음)·점선은 페이드, 본 장은 완성 상태로, 탭 숨김 때 빌드 마무리, 숫자 팝인 8장 1개씩(aria-label, 나머지 숫자는 원문 그대로), 표지 교차 페이드 2번 뒤 정지, 모션 감소는 150ms 교차 페이드만, 인쇄는 CSS만으로 최종 상태.
- **메타·첫 화면:** 표지 제목과 같은 title·og:title·공유 이미지, description, twitter, SVG favicon, color-scheme·theme-color, viewport-fit, 글꼴·덱 스크립트 preload, 첫 페인트부터 한 장, 읽기 칸은 글꼴 전 시스템 글꼴로 먼저. LCP 기준선 7.8초 → 약 5.1초. 저장소 입구는 해시를 보존해 `제출 URL#12`가 12장에 도착.
- **JS 없이도:** noscript 안내, 장이 화면 폭에 맞게 줄고(잘림 0) 쪽 번호가 CSS로 채워진다.
- 배정 **43건 중 고침 26 · 부분 14 · 다른 PR 소유 3**. critical 2건 **모두 고침**(VG-01, VG-07 — ONB-03 이의 수용, RSP-02는 PR2·PR7 재배정). 부분 14건의 남은 몫은 모두 맡은 파일 밖이다.
- 2회차(1회차 독립 검증 불합격 대응): 정지 숫자를 쪼개지 않아 판정기를 가리지 않게, 덱 안 링크 히트 영역, JS 끔 잘림, 읽기 칸 차트 글자, LCP, minor 6개(숫자·단위 줄 갈림, 휴대폰 끝 표시 겹침, 1366×768 사진 카드, og 제목 통일, phone/ 재촬영, 처리표 표기).

## ② 배정 위반 표

전체 표(고친 내용·검증·사유): [qa/pr/04/violations.md](https://github.com/tony0055/data-literacy-agi-jobs/blob/nav/04-touch-a11y/qa/pr/04/violations.md)

| 상태 | id |
| --- | --- |
| 고침(26) | VG-01, VG-07, VG-02, VG-04, VG-06, VG-08, VG-09, VG-13, VG-14, VC-08, V1-16, VG-11, VG-15, VC-01, V8-12, V15-44, V15-45, V22-43, VG-05, VG-18, VC-02, V8-14, V8-13, V15-47, V15-46, V29-35 |
| 부분(14) | V1-21, V1-41, VG-03, VG-10, VG-12, VG-17, VC-03, V1-20, VG-16, V8-49, V8-08, VG-19, V15-36, V22-42 |
| 다른 PR 소유(3) | V1-22(PR2·PR5), V1-05(PR2), V22-44(PR2) |

## ③ visual-qa 결과(`--compare=baseline-cloud`, qa/reports/pr4.md)

- 통과 **58**(기준선 29) · 실패 84 · 수동 5 · 오류 0. 이 PR이 맡은 52조건 중 통과 29.
- 새로 통과 29: SURF-06, NAV-01, NAV-02, NAV-05, NAV-06, NAV-07, NAV-08, NAV-09, NAV-10, NAV-11, NAV-12, **CTL-01**, CTL-02, CTL-03, CTL-05, CTL-06, ONB-01, ONB-02, RSP-04, MOT-02, MOT-03, MOT-07, MOT-08, MOT-11, A11Y-01, A11Y-02, META-01, META-02, PRT-01.
- 실패지만 항목이 준 조건: A11Y-03(45→1), CTL-04(16→4), MOT-05(7→2), MOT-04(3→1), ONB-03(3→1), A11Y-05(3→1), TYP-14(4→3), CON-01·CON-02·A11Y-04(26→24).
- **'회귀' 3건은 가렸던 것이 드러난 것이다(회귀로 세지 않음).** 기준선은 모든 숫자를 판정기가 건너뛰는 `.t-digit` 조각으로 쪼갰다. 이 PR은 팝인하는 숫자(8장 1개씩)만 쪼개고 나머지는 원문 그대로 둔다. 그래서 판정기가 기준선에서 못 보던 숫자를 새로 본다. 화면의 숫자 글자·크기·위치는 같고 check-numbers는 unverified []다.
  - LAY-06(5→11, 12·13·14·16·21·26장): 큰 숫자와 바로 위 설명의 글자 상자 겹침. 숫자 글꼴 토큰의 줄 높이가 글자 크기와 같아 생김(tokens.css, PR2). 화면상 글자 겹침 없음.
  - TYP-07(17→25, 4·8·16·19·21·26장): '105일'의 '일', '3.5배'의 '배'처럼 크기가 다른 단위를 '고아 줄'로 셈. 실제로는 한 줄.
  - EVD-01(1→11): 기준선은 숫자를 한 자리씩('3','.','5') 뽑았고 지금은 '3.5'로 뽑아 목록이 달라 보임. 값은 같음.
  - 1회차에서 '줄었던' LAY-10·TYP-09·EVD-05는 기준선과 같은 44·56·4로 돌아왔다(1회차 개선은 가림이었다). 1회차 회귀 TXT-05는 통과.
- MOT-10(CPU 4배 감속 프레임) 59.7fps 통과. 장마다 `:root`에 CSS 변수를 쓰면 덱 전체 스타일을 다시 계산하므로 진행 막대 변수는 진행 요소에만 쓴다.
- **PERF-01 LCP:** 기준선 7.76초 → 1회차 10.1초(읽기 칸 큰 글자가 늦게 도착한 덱 스크립트와 `font-display: block` 글꼴에 묶임)였다. 덱 스크립트 preload와 읽기 칸 시스템 글꼴 선표시로 단독 재측정 5.33·5.10초, 5.33·4.82초, 최종 실행 5.14초다. 2.5초 기준은 이미지 용량(첫 화면 2.56MB, PR2·PR6)과 2MB 글꼴(PR2) 몫이다. PR2 글꼴 변경과 병합한 뒤 다시 재야 한다.

## ④ qa-all 단계별 종료 코드

| 단계 | 종료 | 메모 |
| --- | --- | --- |
| build | 0 | chart-data 블록 변경 없음 |
| render | 0 | issues는 기준선과 같은 5장 도식 축소 글자(PR2·PR3) |
| check-numbers | 0 | unverified [] (167개) |
| constitution | 0 | 글자 크기 9 · 굵기 3 · 이징 3 · 위반 0(controls.css 포함해도 0) |
| token-check | 1 | 기준선과 같은 27건(slides.css·deck.css·index.html 본문). controls.css 0건 |
| visual-qa | 1 | 남은 실패가 있어 정상(통과 58·회귀 표시 3은 ③의 '드러난 항목') |

## ⑤ before/after

장 렌더(1920): 모든 장의 꼬리말 위치 표시에 섹션 이름이 붙었고(34장), 사진 장(6·18·19)은 위치 표시에 어두운 바탕, 9·34장 외부 링크에 ↗, 10·17·24·26장 점선 계열이 점선으로 보이고, 16장 'R² 0.01'이 붙어 보이던 것을 고쳤다. 숫자는 기준선과 같은 모양이다(4·12·13·14·16·19·26장은 숫자를 원문 글자로 되돌려 렌더 픽셀이 조금 다름).

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

JS 끔(장이 화면 폭에 맞게 줄어 잘림 0, 쪽 번호 CSS로 채움):

| 1440×900 | 390×844 |
| --- | --- |
| ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/nav/04-touch-a11y/qa/pr/04/stage/nojs-1440.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/nav/04-touch-a11y/qa/pr/04/stage/nojs-390.jpg) |

휴대폰 세로 읽기 칸 34장(390×844 터치, #1~#34, 차트는 가로로 밀어 봄):

| 1–9 | 10–18 | 19–27 | 28–34 |
| --- | --- | --- | --- |
| ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/nav/04-touch-a11y/qa/pr/04/phone/sheet-1.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/nav/04-touch-a11y/qa/pr/04/phone/sheet-2.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/nav/04-touch-a11y/qa/pr/04/phone/sheet-3.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/nav/04-touch-a11y/qa/pr/04/phone/sheet-4.jpg) |

## ⑥ 못 고친 것과 사유

- **맡은 파일 밖(PR2):** tokens.css `font-display: block`과 2MB 단일 글꼴(TYP-14·PERF-01) — 덱 글자 696자 부분 파일로 145KB까지 줄어드는 것을 확인했지만, tokens.css의 원본 @font-face가 그대로면 `document.fonts.check`가 거짓이 되어(TYP-01 회귀) 되돌렸다. tokens.css에서 원본 규칙을 부분 파일+나머지 범위로 바꾸면 된다. slides.css의 overshoot `--digit-ease` 정의·`1600ms`·`200ms`(MOT-04·MOT-05), deck.css·slides.css의 미디어 밖 :hover 4개(CTL-04·CTL-07, 그중 `.replay-btn` 규칙은 이 PR 뒤로 쓰이지 않으니 지우면 됨), 2장 heading(A11Y-03), 장 안 h3·h4 수, 이미지 크기 속성·용량(IMG-03·IMG-04·PERF-01, PR6과 함께), 숫자 글꼴 토큰 줄 높이(LAY-06 드러난 항목).
- **PR2·PR7(재배정):** 1280×720 실효 12px(RSP-02, 14·16px 글자 토큰).
- **PR3:** JS 꺼짐 때 빈 차트 9개(A11Y-05), 차트 계열 대비·같은 점선 쌍(CON-04·CHT-04).
- **PR5:** 본문 em dash·따옴표·날짜 표기(TXT-08), 'the future of'(TXT-03), 제목류 쉼표(TXT-01), 영상 캡션의 보이는 행선지 문구.
- **판정 이의(판정기는 고치지 않음, 검증자·오케스트레이터 수용):** ① ONB-03 '375×812 세로 배율 <0.3' — 16:9 덱이 폭 375에 들어가는 최대 배율이 0.195라 RSP-01과 동시에 만족할 수 없다. 읽기 칸이 실제 글자 크기로 보여 준다. ② MOT-06 '진입 0ms·2000ms 픽셀 차' — 같은 조건이 요구하는 150~200ms 페이드 도중(약 70ms)에 찍힌다.

## ⑦ 확인 못 한 것

- 실기기(iOS Safari·안드로이드 Chrome): 안전 영역(노치), 전체 화면 미지원(iPhone), 실제 손가락 스와이프·핀치 상태는 CDP 터치 에뮬레이션으로만 확인했다.
- OCR(macOS Vision) 부분: RSP-02의 480×270 쪽 번호 OCR은 이 클라우드에서 못 돌렸다(크기로 대신 판정).
- 공개 URL(GitHub Pages)에서의 og 미리보기와 `제출 URL#12` 이동은 로컬 서버로만 확인했다(병합·배포 뒤 확인 필요).
- PERF-01 LCP는 이 클라우드의 Slow 4G 근사로만 쟀다(다른 작업자와 대역·CPU를 나눠 ±0.5초 흔들림). PR2 글꼴과 병합 뒤 다시 재야 한다.
- 전체 화면에서 Esc 한 번의 동작(NAV-08 메모)은 CDP 키 입력이 브라우저 처리를 거치지 않아 실기기 확인이 필요하다.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

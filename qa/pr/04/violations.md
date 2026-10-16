# PR4 배정 위반 43건 처리표(2회차)

판정은 `bun scripts/visual-qa.ts --label pr4 --compare=baseline-cloud`(qa/reports/pr4.md) 기준. '렌더'는 `presentation/renders/index` 1920 렌더와 발표 무대 스크린샷을 직접 연 확인. 상태: 고침 · 부분(이 PR 몫은 고쳤고 남은 몫의 사유를 적음) · 다른 PR 소유(맡은 파일 밖이라 손대지 않음).

2회차는 1회차 독립 검증(`verify-r1.md`, 불합격)의 지적 6가지를 고쳤다: ① 숫자 DOM이 판정기를 가리지 않게(정지 숫자는 쪼개지 않음) ② 덱 안 링크 히트 영역 ③ JS 끔 때 장 잘림 ④ 읽기 칸 차트 글자 ⑤ LCP ⑥ minor 6개.

| id | 장 | 심각도 | 고친 내용 | 검증 | 상태 |
| --- | --- | --- | --- | --- | --- |
| VG-01 | 전체 | critical | present.js에 포인터 스와이프(10px 뒤 방향 고정, 폭 20%·최대 120px 또는 48px 이상 빠른 밀기, 가장자리 16px·두 번째 손가락·visualViewport.scale>1·세로 우세는 무시, 못 미치면 250ms 안 제자리), `.deck`에 `touch-action: pan-y pinch-zoom`. 보이는 이전·다음(44×44, 다음만 인디고)과 개요·전체 화면·다시 재생 버튼을 덱 밖(꼬리말 아래·좌우 기둥·세로 막대)에 | NAV-01·NAV-02·CTL-01·CTL-02 통과(9개 뷰포트 겹침 0, 덱 안 링크 포함 44px) | 고침 |
| VG-07 | 전체 | critical | 세로 화면(폭 ≤820)은 덱을 위에 폭 맞춤으로 두고 그 아래 '읽기 칸'에 지금 장을 실제 글자 크기로 다시 흘린다(그림자 DOM 사본, 본문 20px·최소 14px, 헤드라인 32px). 한 열 선형화는 장 클래스에 기대지 않는 일반 규칙(원본 계산 스타일로 flex·grid·절대 배치를 판별). **2회차:** 차트 svg는 가장 작은 글자가 12.5px이 되는 고정 폭(`viewBox 폭 × 12.5 / 최소 글자`)으로 그리고 표처럼 가로 스크롤 칸에 넣음. 숫자+단위는 한 줄로 묶음(4장 '94 %'·12장 '29.5 %' 갈림 해소). 알림 줄 '옆으로 밀어 넘기고 가로로 돌리면 크게 봅니다' | 390×844(높이 3000) 터치 #1~#34 자동 검사: 가로 넘침 0, 12px 미만 HTML 글자 0, **차트 장 svg 글자 최소 12.5px**, 글자 단위 줄바꿈 0. 눈 확인 `phone/sheet-1~4.jpg`(HEAD로 다시 찍음). ONB-03 남은 1항목 '375×812 세로 배율 0.1953'은 판정 이의 1(오케스트레이터 수용). RSP-02(1280×720 실효 12px)는 덱 글자 토큰 14·16px 문제라 PR2·PR7로 재배정 | 고침 |
| V1-21 | 1 | major | 표지 교차 페이드를 두 번 바꾼 뒤 멈춤, 첫 키·포인터 입력·장 이탈·탭 숨김에 즉시 멈춤. 유지 시간은 `--cover-hold` 변수를 JS가 읽음 | MOT-07 통과. MOT-05의 slides.css 14행 `1600ms`는 slides.css(PR2) | 부분 |
| V1-22 | 1 | major | — | 표지 알약 그림자·라벨·범위는 index.html 본문·slides.css | 다른 PR 소유(PR2·PR5) |
| V1-41 | 1 | major | viewport-fit=cover, meta color-scheme light, theme-color 2개, description, og 세트(1200×630 `presentation/assets/og.jpg`), twitter:card, SVG favicon, 글꼴 preload, 대시 없는 짧은 title. **2회차:** `<title>`·og:title·og 이미지 제목을 표지 h1 'AI는 언제쯤 내 일을 대신하게 될까요'로 통일 | META-01·META-02·SURF-06·CTL-06 통과. TYP-14(`font-display: block`·2MB 단일 글꼴)는 tokens.css(PR2). 부분 글꼴 파일은 tokens.css의 원본 @font-face를 바꿔야 TYP-01이 안 깨짐 | 부분 |
| VG-02 | 1–34 | major | 다시 재생을 덱 밖 조작부로 옮김. 데스크톱은 덱 배율을 '꼬리말 아래 52px 막대 자리'가 생기도록 고름. **2회차:** 막대 자리 기준을 가장 낮은 장 표면(사진 카드 아래 끝, 캔버스 y=1056)으로 바꿔 1366×768 사진 장(6·18·19)도 덮지 않음 | CTL-02 통과(9개 뷰포트 34장 교차 0). 1366×768 6장: 사진 카드 아래 716px < 막대 위 720px | 고침 |
| VG-03 | 1–34 | major | Esc는 닫기만, G·O 키와 개요 버튼으로 열기. 개요: '전체 34장' 제목, 44px 닫기, 썸네일 밖 장 번호, 현재 장 aria-current+테두리, 썸네일 button 역할·이름, 화살표·Enter 선택, 열 때 애니메이션 0 | NAV-08·NAV-09 통과. 개요 호버 외곽선(deck.css `body.overview .slide:hover`가 미디어 밖)은 deck.css(PR2) → CTL-04 | 부분 |
| VG-04 | 1, 12 | major | hashchange·popstate 처리, 한 장 이동은 replaceState, 개요·처음으로 점프만 pushState | NAV-06·NAV-07 통과 | 고침 |
| VG-06 | 1–34 | major | `.pg`를 '섹션 · n / 34'로, 장마다 document.title '(n/34)', polite aria-live 'n / 34 · 헤드라인', 덱 밖 진행 표시(role=progressbar) | NAV-10·A11Y-02 통과 | 고침 |
| VG-08 | 1–34 | major | viewport-fit=cover, 조작부 env(safe-area-inset-*), 탭 하이라이트 투명, 버튼 touch-action manipulation, 무대 overscroll-behavior none, visualViewport resize에 배치 다시 계산, color-scheme·theme-color | CTL-06·SURF-06 통과 | 고침 |
| VG-09 | 1 | major | 첫 방문(탭 세션당 1회) 기기별 한 줄 안내, 첫 이동이나 5초 뒤 숨김, ?로 다시. 터치는 '옆으로 밀어 넘깁니다', 키 표기는 데스크톱만. 렌더(?slide·?check)엔 없음 | ONB-01·ONB-02 통과 | 고침 |
| VG-10 | 1 | major | 메타 세트·favicon·title, 저장소 입구 index.html title을 덱과 같게 | META-01·META-02 통과. TXT-01(16장 th·22장 h3)·TXT-03('the future of', 12장 본문)은 PR5·PR2 | 부분 |
| VG-12 | 1 | major | 글꼴 preload, 첫 페인트부터 한 장만, 스크립트 순서(present·motion 먼저, Anime 마지막). **2회차:** 덱 스크립트 4개 preload(fetchpriority high), 읽기 칸은 글꼴이 오기 전 시스템 글꼴로 먼저 그리고 글꼴이 와도 다시 그리지 않음 | RSP-04 통과. **LCP 기준선 7.76초 → 단독 재측정 5.33·5.10초, 5.33·4.82초, 최종 실행 5.14초**(1회차 10.1초 악화 해소). PERF-01 남은 실패(LCP >2.5초, 첫 화면 2.56MB)는 이미지 용량·width/height(PR2·PR6)와 font-display·2MB 글꼴(PR2). PR2 글꼴 변경 뒤 다시 재야 함 | 부분 |
| VG-13 | 1–34 | major | 모션 감소에서 장 사이 150ms 불투명도 교차 페이드만(이동·흐림 없음, 들어오는 장은 바로 visible), 장 안은 처음부터 최종 상태 | 측정: 전환 opacity 0.15s, transform/filter none. MOT-06 남은 항목 '진입 0ms와 2000ms 픽셀 차'는 판정 이의 2(오케스트레이터 수용) | 고침 |
| VG-14 | 1 | major | V1-21과 같음 | MOT-07 통과 | 고침 |
| VG-17 | 1, 9, 28 | major | 조작부·장 안 링크에 :focus-visible 2px 인디고 링, :active scale 150ms, 조작부 hover는 (hover:hover) and (pointer:fine) 안, 포인터 3초 정지 시 0.2로 흐림 | CTL-03 통과. CTL-04·CTL-07 남은 항목은 deck.css·slides.css의 미디어 밖 :hover 4개(`.replay-btn:hover::after`는 이 PR 뒤로 쓰이지 않는 규칙) — PR2 | 부분 |
| VC-03 | 1–34 | major | noscript 안내, JS 없이도 표지 첫 사진 보임, Anime를 못 불러오면 최종 상태·이동 정상. **2회차:** `html:not(.deck-js)`에서 화면 폭 단계별 zoom으로 1920 장을 폭에 맞춰 줄임(왼쪽 잘림 해소), `.pg`의 빈 숫자를 CSS 카운터로 채움('n / 34') | JS 끔 직접 렌더 `stage/nojs-1440.jpg`(장 왼쪽 21·오른쪽 1404px)·`stage/nojs-390.jpg`(41·349px), 잘림 0. A11Y-05 남은 1항목 'JS 끔: 빈 차트 9'는 차트 정적 대체(charts.js, PR3) | 부분 |
| VC-08 | 1–34 | major | 입구 문서: 덱 제목·og 메타, `location.replace('presentation/'+search+hash)`(noscript일 때만 meta refresh) | `/#12` → `/presentation/#12`, 장 12 | 고침 |
| V1-05 | 2 | major | — | 2장 heading은 index.html 본문 | 다른 PR 소유(PR2) |
| V1-20 | 4 | major | 4장 숫자 팝인 1개('105')만, 이징을 --ease-smooth-out으로(controls.css에서 --digit-ease 재지정), 묶음 role=img·aria-label·조각 aria-hidden | MOT-08 통과. MOT-04의 overshoot 정의 문자열은 slides.css(PR2) | 부분 |
| VG-16 | 4, 8, 11–16, 18, 19, 21, 26 | major | JS가 --duration-*·--ease-smooth-out을 읽음(T 상수·setTimeout 220 삭제), 점 scale 0.9→1+opacity, 팝인 8장(4·8·11·12·15·18·19·21) 1개씩, 퇴장 150ms < 등장 250ms. **2회차:** 팝인하지 않는 숫자는 쪼개지 않고 원래 글자 그대로 | MOT-08 통과, MOT-04·MOT-05 남은 항목은 slides.css(overshoot 정의, 1600ms, 200ms)뿐 | 부분 |
| V1-16 | 7 | major | 빌드 축 0 → 선 250 → 점 500 → 라벨 750, 묶음 차례 상한, 7장 1150ms | MOT-02 통과 | 고침 |
| VG-11 | 7, 10, 11, 24, 26 | major | @media print에서 글줄·숫자 최종 상태·그림자·필터·조작부 제거, 안 본 장 타임라인은 끝 상태, beforeprint에서 전부 끝으로 | PRT-01 통과 | 고침 |
| VG-15 | 7, 10, 11, 13, 17, 24, 26, 28 | major | 차트 ≤1400ms, 글줄 간격 40ms·순번 12에서 멈춤(≤980ms), 본 장 재방문은 완성 상태 | MOT-02·MOT-03 통과 | 고침 |
| VC-01 | 7, 10, 11, 13, 14, 17, 24, 26, 27 | major | 재생 직전에 단계별 시작 상태(utils.set) 찍기, 처음 로드 때 모든 타임라인을 끝으로 | 시작 시 점·라벨 보임 0, 축→선→점→라벨 순 | 고침 |
| V8-49 | 9 | major | aria-label '… (새 탭에서 YouTube 열기)', title에 ↗, 캡션 끝 ↗(CSS), :active·:focus-visible, 히트 영역 44px(아래 V29-35) | NAV-11·CTL-01 통과. `.video:hover .play` 미디어 밖(slides.css)과 보이는 행선지 문구(본문)는 PR2·PR5 | 부분 |
| V8-08 | 10, 11 | major | 점선 계열은 선 그리기 대신 페이드라 점선 모양 유지 | 10장 Metaculus 점선 확인. CON-04·CHT-04는 차트 색·클래스(PR3) | 부분 |
| V8-12 | 10, 11, 13 | major | 단계 겹침·묶음 상한(큰 산점도는 한 번에) | MOT-02 통과 | 고침 |
| V15-44 | 15–17, 20, 21 | major | VG-02와 같음 | CTL-02 통과 | 고침 |
| V15-45 | 15, 16, 18, 19, 21 | major | 팝인 장당 1개, smooth-out, 'R² 0.01' 공백을 줄바꿈 없는 공백으로 | MOT-08 통과, 16장 렌더 'R² 0.01' 확인 | 고침 |
| V22-43 | 24, 26, 28 | major | 글줄 ≤980ms, 26장 빌드 1400ms, 점 0.9. (1회차 표의 '26장 320 팝인'은 틀린 표기 — 26장 '320만 명'은 팝인하지 않는 정지 숫자다) | MOT-02·MOT-08 통과 | 고침 |
| VG-05 | 1, 34 | minor | 1장 이전·34장 다음 aria-disabled·opacity .4, 34장에서 더 넘기면 '마지막 장입니다 · 처음으로'. **2회차:** 휴대폰 세로에서 끝 표시가 뜨는 동안 알림 줄을 숨겨 겹침 해소 | NAV-05 통과 | 고침 |
| VG-18 | 1–34 | minor | 한 SVG 아이콘 세트(24 격자·2px), aria-label·title, 다음만 강조, fullscreenEnabled일 때만 버튼과 F | CTL-05·NAV-12 통과 | 고침 |
| VG-19 | 2, 4, 8, 11–16, 18, 19, 21, 26 | minor | 팝인 숫자 묶음 role=img·aria-label=원문, 조각 aria-hidden. 정지 숫자는 쪼개지 않아 원문 그대로 읽힘 | A11Y-03 남은 1항목은 2장 heading(PR2) | 부분 |
| VC-02 | 7, 10, 11, 13, 14, 17, 24, 26, 27 | minor | visibilitychange 숨김 때 지금 장 빌드를 끝냄 | MOT-11 통과 | 고침 |
| V8-14 | 8, 11–14 | minor | 팝인 장당 1개, smooth-out | MOT-08 통과 | 고침 |
| V8-13 | 10, 11, 13 | minor | 점 scale [0.9,1]+opacity | MOT-04의 JS 항목 없음 | 고침 |
| V15-36 | 15, 16, 18, 19, 21 | minor | `<title>` em dash 제거, 'R² 0.01' 붙음 고침 | 출처 em dash·따옴표·날짜 표기는 본문(PR5) | 부분 |
| V15-47 | 15, 16, 18, 19, 21 | minor | VG-19와 같음 | A11Y-03 해당 장 통과 | 고침 |
| V15-46 | 17 | minor | 화면에서 읽는 순서로 --i를 다시 매기고(글꼴 로드 뒤 한 번 더) 간격 40ms | MOT-02·MOT-08 통과 | 고침 |
| V22-42 | 22, 23, 25–27 | minor | 26장 '320만 명'은 쪼개지 않은 원문이라 스크린 리더가 그대로 읽음 | heading 수(h3·h4)는 index.html 본문 | 부분 |
| V22-44 | 28 | minor | — | `.poster .it:hover`·`.eta` 알약은 slides.css | 다른 PR 소유(PR2) |
| V29-35 | 34 | minor | 링크 이름에 '(새 탭에서 GitHub 열기)', ↗ 표시. **2회차:** 덱 안 링크(34장 4개·9장 영상)에 무대 배율에 반비례하는 투명 히트 영역(`padding: calc(44px / 배율 / 2)`, 같은 크기 음수 margin이라 배치는 그대로). 세로 읽기 칸에서는 44px 높이 세로 목록 | **CTL-01 통과**(1회차 실패 16). 직접 잰 링크 높이 375×812·812×375·1280×720·1440×900에서 49~62px | 고침 |

## 집계

- **고침 26 · 부분 14 · 다른 PR 소유 3** (1회차 23·17·3)
- critical 2건 모두 고침: VG-01, VG-07(ONB-03 이의 수용, RSP-02는 PR2·PR7 재배정)
- '부분' 14건의 남은 몫은 모두 맡은 파일 밖이다: slides.css·deck.css·tokens.css·장 본문 구조·이미지(PR2·PR6), 본문 문구(PR5), 차트(PR3).

## 드러난 항목(회귀 아님 — 가렸던 것이 드러남)

1회차는 팝인하지 않는 숫자도 글자마다 쪼개 aria-hidden 조각(`.t-num-d`)으로 두어, 판정기가 큰 숫자를 못 보게 만들었다(검증자 '거짓 개선'). 2회차는 정지 숫자를 쪼개지 않는다. 기준선(baseline-cloud)은 모든 숫자를 `.t-digit` 조각으로 쪼개 판정기가 건너뛰었으므로, 원문 숫자를 그대로 둔 지금 판정기가 기준선에서 못 보던 것을 새로 본다. 화면의 숫자 글자·크기·위치는 기준선과 같다(4장 확대 대조, check-numbers unverified []).

| 조건 | 기준선 → 2회차 | 새로 보인 장 | 내용 | 실제 원인과 소유 |
| --- | --- | --- | --- | --- |
| LAY-06 | 항목 5 → 11 | 12, 13, 14, 16, 21, 26 | 큰 숫자(`div.num`)와 바로 위 설명 `p`의 글자 상자(line box) 겹침 225~925px² | 숫자 글꼴 토큰의 줄 높이가 글자 크기와 같아(`--t-number: 64px/64px`·`--t-hero: 96px/96px`, tokens.css) 글자 상자가 줄 밖으로 나옴(PR2). 화면상 글자가 겹치지 않음 |
| TYP-07 | 항목 17 → 25 | 8, 16, 21, 26(4·19는 항목 추가) | '105일'의 '일', '3.5배'의 '배', '320만 명'의 '만 명' 등 단위를 '고아 줄'로 셈 | 숫자와 단위가 크기가 달라 판정기가 다른 줄로 봄. 한 줄이며 줄바꿈 없음 |
| EVD-01 | 항목 1 → 11 | 4, 8, 12, 13, 14, 16, 18, 19, 21, 26 | '기준 대비 사라지거나 바뀐 숫자: 3, 4, 5, 9' 꼴 | 기준선은 숫자를 한 자리씩('3','.','5') 뽑았고 지금은 '3.5'로 뽑아 목록이 달라 보임. 숫자 값은 같음(check-numbers 167개 unverified 0) |
| LAY-10 · TYP-09 · EVD-05 | 1회차 38·50·3 → 2회차 44·56·4 | 4·8·12·18·19·21 등 | 96px 숫자 동률·둘째 크기 비 | 기준선과 같은 수로 돌아옴(1회차의 '개선'은 가림이었음). 숫자 크기 위계는 PR2 |

1회차의 유일한 회귀였던 TXT-05(13·19장 숫자 조각 반복)는 2회차에 통과다.

## 판정 이의(판정기는 고치지 않음)

1. **ONB-03 '375×812 세로 배율 <0.3'** — 16:9 덱이 폭 375px 안에 들어가는 최대 배율이 0.195다. 0.3을 맞추면 덱이 화면 밖으로 나가 RSP-01이 깨진다. 덱 미리보기 아래 읽기 칸이 같은 장 글자를 실제 크기(14~32px, 차트 12.5px 이상)로 보여 준다. 판정기는 이 칸을 보지 않는다. (검증자·오케스트레이터 수용)
2. **MOT-06 '진입 0ms와 2000ms 픽셀 차'** — 같은 조건이 '장 사이 150~200ms 페이드'를 요구하는데 판정기는 약 70ms에 찍는다. 장 안 요소는 진입 즉시 최종 상태임을 직접 확인했다. (검증자·오케스트레이터 수용)

1회차의 이의 3(CTL-01)·4(TXT-05)는 이번에 고쳐서 거둔다.

# PR4 배정 위반 43건 처리표

판정은 `bun scripts/visual-qa.ts --label pr4 --compare=baseline-cloud`(qa/reports/pr4.md) 기준. '렌더'는 `presentation/renders/index` 1920 렌더와 발표 무대 스크린샷을 직접 연 확인. 상태: 고침 · 부분(이 PR 몫은 고쳤고 남은 몫의 사유를 적음) · 다른 PR 소유(맡은 파일 밖이라 손대지 않음).

| id | 장 | 심각도 | 고친 내용 | 검증 | 상태 |
| --- | --- | --- | --- | --- | --- |
| VG-01 | 전체 | critical | present.js에 포인터 스와이프(10px 뒤 방향 고정, 폭 20%·최대 120px 또는 48px 이상 빠른 밀기, 가장자리 16px·두 번째 손가락·visualViewport.scale>1·세로 우세는 무시, 못 미치면 250ms 안 제자리), `.deck`에 `touch-action: pan-y pinch-zoom`. 보이는 이전·다음(44×44, 다음만 인디고)과 개요·전체 화면·다시 재생 버튼을 덱 밖(꼬리말 아래·좌우 기둥·세로 막대)에 | NAV-01 통과(7가지 경우 모두 기대값), NAV-02 통과(390×844 터치·1440×900 마우스 1→34→1, 해시 #2~#34), CTL-02 통과(9개 뷰포트 겹침 0). CTL-01은 34장 덱 안 링크(아래 V29-35)만 남음 | 고침 |
| VG-07 | 전체 | critical | 세로 화면(폭 ≤820)은 덱을 위에 폭 맞춤으로 두고 그 아래 '읽기 칸'에 지금 장을 실제 글자 크기로 다시 흘린다(그림자 DOM 사본, 본문 20px·최소 14px, 헤드라인 32px). 한 열 선형화는 장 클래스에 기대지 않는 일반 규칙(원본 계산 스타일로 flex·grid·절대 배치를 판별, 표는 가로 스크롤 칸)이라 PR2 구조 변경 뒤에도 유지된다. 알림 줄 '옆으로 밀어 넘기고 가로로 돌리면 크게 봅니다'. 가로 휴대폰은 화면 높이를 채우는 배율 그대로 좌우 기둥에 조작부 | ONB-03: 세로 알림·가로 숨김·배율·장 유지·높이 100% 통과, 남은 1항목은 '375×812 세로 배율 0.1953'(판정 이의 1). 390×844 터치 #1~#34 읽기 칸 34장 자동 검사(가로 넘침 0·12px 미만 HTML 글자 0·글자 단위 줄바꿈 0)와 눈 확인 `phone/sheet-1~4.jpg`. 차트 svg 안 글자는 칸 폭에 맞춰 줄어 12px 아래(가로로 돌리면 덱으로 봄). RSP-02(1280×720 실효 12px)는 덱 글자 토큰 14·16px 문제라 PR2 | 부분 |
| V1-21 | 1 | major | 표지 교차 페이드를 두 번 바꾼 뒤 멈춤, 첫 키·포인터 입력·장 이탈·탭 숨김에 즉시 멈춤. 유지 시간은 `--cover-hold` 변수를 JS가 읽음 | MOT-07 통과(30초 2회, 이후 실행 애니메이션 0, 숨김 중 0). MOT-05의 slides.css 14행 `1600ms`는 slides.css(PR2) | 부분 |
| V1-22 | 1 | major | — | 표지 알약 그림자·라벨·범위는 index.html 본문·slides.css | 다른 PR 소유(PR2·PR5) |
| V1-41 | 1 | major | viewport-fit=cover, meta color-scheme light, theme-color 2개(--stage), description, og 세트(1200×630 이미지 `presentation/assets/og.jpg`), twitter:card, SVG favicon(data URI), 글꼴 preload(crossorigin), 대시 없는 짧은 title | META-01·META-02·SURF-06·CTL-06 통과. TYP-14는 tokens.css `font-display: block`과 2MB 단일 글꼴(PR2). 덱 글자 696자 부분 파일은 145KB로 만들어 시험했으나 tokens.css의 원본 @font-face가 남아 있으면 `document.fonts.check`가 거짓이 되어(TYP-01 회귀) 되돌림 → PR2가 tokens.css에서 바꿔야 함 | 부분 |
| VG-02 | 1–34 | major | 다시 재생을 덱 밖 조작부로 옮김(기존 `.replay-btn` 생성 제거). 데스크톱은 덱 배율을 '꼬리말 아래 52px 막대 자리'가 생기도록 골라 막대가 꼬리말·쪽 번호와 겹치지 않음 | CTL-02 통과(1920·1440·1366·1280·1024·2560·960·844×390·390×844 34장 교차 0) | 고침 |
| VG-03 | 1–34 | major | Esc는 닫기만, G·O 키와 개요 버튼으로 열기. 개요: '전체 34장' 제목, 44px 닫기, 썸네일 밖 장 번호(섹션 · n / 34, 실효 17px), 현재 장 aria-current+테두리, 썸네일 button 역할·이름, 화살표·Enter 선택, 열 때 애니메이션 0, 다른 오버레이 숨김 | NAV-08·NAV-09 통과. 개요 호버 외곽선(deck.css `body.overview .slide:hover`가 미디어 밖)은 deck.css(PR2) → CTL-04 | 부분 |
| VG-04 | 1, 12 | major | hashchange·popstate 처리, 한 장 이동은 replaceState, 개요·처음으로 점프만 pushState | NAV-06·NAV-07 통과 | 고침 |
| VG-06 | 1–34 | major | `.pg`를 '섹션 · n / 34'로(장에 data-section이 있으면 우선), 장마다 document.title '(n/34)', polite aria-live에 'n / 34 · 헤드라인', 덱 밖 진행 표시(role=progressbar, 휴대폰 가로 높이 ≥44) | NAV-10·A11Y-02 통과 | 고침 |
| VG-08 | 1–34 | major | viewport-fit=cover, 조작부 env(safe-area-inset-*), 탭 하이라이트 투명, 버튼 touch-action manipulation·user-select none, 무대 overscroll-behavior none(개요 contain), visualViewport resize에 배치 다시 계산, color-scheme·theme-color | CTL-06·SURF-06 통과 | 고침 |
| VG-09 | 1 | major | 첫 방문(탭 세션당 1회, sessionStorage·try/catch) 기기별 한 줄 안내를 조작 막대 자리에 띄우고 첫 이동이나 5초 뒤 숨김, ?로 다시. 터치는 '옆으로 밀어 넘깁니다', 키 표기는 데스크톱만. 렌더(?slide·?check)엔 없음 | ONB-01·ONB-02 통과 | 고침 |
| VG-10 | 1 | major | 메타 세트·favicon·title, 저장소 입구 index.html title을 덱과 같게('도착' 제거) | META-01·META-02 통과, TXT-01의 `<title>` 항목 없음. TXT-03 남은 'the future of'(12장 본문)는 PR5 | 부분 |
| VG-12 | 1 | major | 글꼴 preload, 첫 페인트부터 한 장만(head 배치 스크립트+controls.css), 스크립트 순서(present·motion 먼저, Anime 마지막) | RSP-04 통과. PERF-01(LCP·첫 화면 2.5MB)은 이미지 용량·loading·width/height(PR2·PR6)와 font-display(PR2), IMG-03·IMG-04도 같은 사유 | 부분 |
| VG-13 | 1–34 | major | 모션 감소에서 장 사이 150ms 불투명도 교차 페이드만(이동·흐림 없음, 들어오는 장은 바로 visible), 장 안은 처음부터 최종 상태 | 측정: 전환 opacity 0.15s, transform/filter none, 교차 페이드 0. MOT-06 남은 항목 '진입 0ms와 2000ms 픽셀 차'는 150ms 페이드와 동시에 만족할 수 없음(판정 이의 2) | 부분 |
| VG-14 | 1 | major | V1-21과 같음 | MOT-07 통과 | 고침 |
| VG-17 | 1, 9, 28 | major | 조작부·장 안 링크에 :focus-visible 2px 인디고 링, :active scale(.97/.98) 150ms, 조작부 hover는 (hover:hover) and (pointer:fine) 안, 포인터 3초 정지 시 0.2로 흐림(포커스 중 유지) | CTL-03 통과, 포커스 링 측정 통과. CTL-04·CTL-07 남은 항목은 deck.css·slides.css의 미디어 밖 :hover 4개(`.replay-btn:hover::after`는 이제 쓰이지 않는 규칙, `.poster .it:hover`, `.video:hover .play`, 개요 호버) — PR2 | 부분 |
| VC-03 | 1–34 | major | noscript 안내, JS 없이도 표지 첫 사진 보임(CSS), Anime를 못 불러오면 오류 없이 최종 상태·이동 정상 | A11Y-05 남은 항목은 'JS 끔: 빈 차트 9'(차트 정적 대체는 charts.js·차트 div 안쪽, PR3). JS 없을 때 `.pg` 숫자는 HTML 본문(PR2) | 부분 |
| VC-08 | 1–34 | major | 입구 문서: 덱 제목·og 메타, `location.replace('presentation/'+hash)`(noscript일 때만 meta refresh) | 로컬 확인: `/#12` → `/presentation/#12`, 장 12 | 고침 |
| V1-05 | 2 | major | — | 2장 heading은 index.html 본문 | 다른 PR 소유(PR2) |
| V1-20 | 4 | major | 4장 숫자 팝인 1개만, 이징을 --ease-smooth-out으로(controls.css에서 --digit-ease 재지정), 묶음 role=img·aria-label·조각 aria-hidden | A11Y-03 4장 통과, MOT-08 통과. MOT-04의 overshoot 정의 문자열은 slides.css 219행(PR2가 지워야 판정 통과) | 부분 |
| VG-16 | 4, 8, 11–16, 18, 19, 21, 26 | major | JS가 --duration-*·--ease-smooth-out을 읽음(T 상수·setTimeout 220 삭제), 점 scale 0.9→1+opacity, 팝인 8장 1개씩, 퇴장 150ms < 등장 250ms | MOT-08 통과, MOT-04·MOT-05 남은 항목은 slides.css(overshoot 정의, 1600ms, 200ms)뿐 | 부분 |
| V1-16 | 7 | major | 빌드 축 0 → 선 250(500ms) → 점 500 → 라벨 750, 묶음 차례 상한, 7장 1150ms | MOT-02 통과, 시간 표본(0·120·300·600·900ms) 확인 | 고침 |
| VG-11 | 7, 10, 11, 24, 26 | major | @media print에서 글줄·숫자 최종 상태·그림자·필터·조작부 제거, 안 본 장의 타임라인은 처음부터 끝 상태, beforeprint에서 전부 끝으로 | PRT-01 통과(34쪽, 꺾은선 끝까지, 버튼 0) | 고침 |
| VG-15 | 7, 10, 11, 13, 17, 24, 26, 28 | major | 차트 ≤1400ms, 글줄 간격 40ms·순번 12에서 멈춤(≤980ms), 본 장 재방문은 완성 상태 | MOT-02·MOT-03 통과 | 고침 |
| VC-01 | 7, 10, 11, 13, 14, 17, 24, 26, 27 | major | 재생 직전에 단계별 시작 상태(utils.set) 찍기, 처음 로드 때 모든 타임라인을 끝으로 | 7·14·26장 프레임 표본: 시작 시 점·라벨·막대 보임 0, 축→선→점→라벨 순 | 고침 |
| V8-49 | 9 | major | aria-label '… (새 탭에서 YouTube 열기)', title에 ↗, 캡션 끝 ↗ 표시, :active·:focus-visible | NAV-11 통과. `.video:hover .play` 미디어 밖(slides.css)과 보이는 'YouTube에서 보기' 문구(본문)는 PR2·PR5 | 부분 |
| V8-08 | 10, 11 | major | 점선 계열은 선 그리기 대신 페이드라 점선 모양 유지 | 10장 렌더에서 Metaculus 점선 확인. CON-04(ΔL* 8.1)·CHT-04(26장 같은 계열 쌍)는 차트 색·클래스(PR3) | 부분 |
| V8-12 | 10, 11, 13 | major | 단계 겹침·묶음 상한(큰 산점도는 한 번에) | MOT-02 통과 | 고침 |
| V15-44 | 15–17, 20, 21 | major | VG-02와 같음 | CTL-02 통과 | 고침 |
| V15-45 | 15, 16, 18, 19, 21 | major | 팝인 장당 1개, smooth-out, 'R² 0.01' 공백을 줄바꿈 없는 공백으로 | MOT-08 통과, 16장 렌더 'R² 0.01' 확인 | 고침 |
| V22-43 | 24, 26, 28 | major | 글줄 ≤980ms, 26장 빌드 1400ms, 점 0.9, 26장 '320' 팝인 smooth-out | MOT-02·MOT-08 통과 | 고침 |
| VG-05 | 1, 34 | minor | 1장 이전·34장 다음 aria-disabled·opacity .4·cursor default, 34장에서 더 넘기면 '마지막 장입니다 · 처음으로' | NAV-05 통과 | 고침 |
| VG-18 | 1–34 | minor | 이전·다음·개요·전체 화면·다시 재생을 한 SVG 세트(24 격자·2px), aria-label·title, 다음만 강조, fullscreenEnabled일 때만 버튼과 F, 상태별 라벨, 거부 Promise 처리 | CTL-05·NAV-12 통과 | 고침 |
| VG-19 | 2, 4, 8, 11–16, 18, 19, 21, 26 | minor | 쪼갠 숫자 묶음 role=img·aria-label=원문, 조각 aria-hidden | A11Y-03 남은 1항목은 2장 heading(PR2) | 부분 |
| VC-02 | 7, 10, 11, 13, 14, 17, 24, 26, 27 | minor | visibilitychange 숨김 때 지금 장 빌드를 끝냄 | MOT-11 통과(복귀 100ms 뒤 진행 1) | 고침 |
| V8-14 | 8, 11–14 | minor | 팝인 장당 1개, smooth-out | MOT-08 통과 | 고침 |
| V8-13 | 10, 11, 13 | minor | 점 scale [0.9,1]+opacity | MOT-04의 JS `scale: [0, 1]` 항목 없음 | 고침 |
| V15-36 | 15, 16, 18, 19, 21 | minor | `<title>` em dash 제거, 'R² 0.01' 붙음 고침 | 15장 출처 em dash·따옴표·날짜 표기는 본문(PR5) | 부분 |
| V15-47 | 15, 16, 18, 19, 21 | minor | VG-19와 같음 | A11Y-03 해당 장 통과 | 고침 |
| V15-46 | 17 | minor | 화면에서 읽는 순서로 --i를 다시 매기고(글꼴 로드 뒤 한 번 더) 간격 40ms | MOT-02·MOT-08 통과 | 고침 |
| V22-42 | 22, 23, 25–27 | minor | 26장 '320' aria-label·조각 aria-hidden | heading 수(h3·h4)는 index.html 본문 | 부분 |
| V22-44 | 28 | minor | — | `.poster .it:hover`·`.eta` 알약은 slides.css | 다른 PR 소유(PR2) |
| V29-35 | 34 | minor | 링크 이름에 '(새 탭에서 GitHub 열기)', ↗ 표시, 세로 읽기 칸에서는 링크를 44px 높이 세로 목록으로 | NAV-11 통과. CTL-01의 '덱 안 링크 <44px'은 1920 캔버스를 0.2~0.75배로 줄여 보이는 무대에서 링크 높이가 함께 줄어드는 문제(판정 이의 3) | 부분 |

## 집계

- 고침 23 · 부분 17 · 다른 PR 소유 3 (critical 2건: VG-01 고침, VG-07 부분 — 세로 휴대폰 읽기 칸은 들어갔고 남은 것은 판정 이의 1과 PR2 글자 토큰)

## 판정 이의(판정기는 고치지 않음)

1. **ONB-03 '375×812 세로 배율 <0.3'** — 16:9 덱이 폭 375px 안에 들어가는 최대 배율이 0.195다. 배율을 0.3 이상으로 올리면 덱이 화면 밖으로 나가 RSP-01(16:9·뷰포트 안, 기준선 통과)이 깨진다. 이 PR은 덱 미리보기 아래 읽기 칸에서 같은 장 글자를 실제 크기(14~32px)로 보여 주는 쪽을 택했다. 판정기는 이 칸을 보지 않는다.
2. **MOT-06 '진입 0ms와 2000ms 픽셀 차'** — 같은 조건이 '장 사이 150~200ms 페이드'를 요구한다. 판정기는 키 입력 뒤 4프레임(약 70ms)에 찍으므로 페이드 도중 화면이 찍혀 차이가 날 수밖에 없다(전환 없음이었던 기준선만 0). 장 안 요소는 진입 즉시 최종 상태임을 직접 확인했다.
3. **CTL-01 '덱 안 링크 <44px'(375×812·812×375·1280×720 등 34장)** — 1920 캔버스를 배율 0.195~0.75로 줄이는 무대에서 장 안 링크 상자는 배율만큼 줄어든다(44px이 되려면 캔버스에서 60~225px 높이). 판정기는 상자만 재므로 히트 영역 확대(::after)도 반영되지 않는다. 세로 읽기 칸의 사본 링크는 44px 이상.
4. **MOT-08·EVD-05·LAY-10의 숫자 측정** — 판정기는 `.t-digit-group`을 '쪼갠 숫자 한 덩어리'이자 '팝인'으로 함께 센다. 팝인하지 않는 숫자는 배치를 그대로 두려고 같은 구조(`.t-num`)로 쪼개되 이름을 달리했다. 그래서 CON-02는 18장 '91→28'(사진 위 대비 부족, 기준선부터 있던 문제)을 글자마다 세고, LAY-10은 그 숫자들을 숨은 조각으로 보아 동률 항목이 사라진다. 회귀는 없지만 숫자 대비·동률 문제 자체는 PR2 몫으로 남아 있다.

# PR6 작업 기록

| 회차 | 무엇을 | 결과 | 남은 배정(사용자 결정 제외) |
| --- | --- | --- | --- |
| 0 | PR2 넘김 목록·IMG-01~07·PERF-01 판정기 읽기, 1920 렌더에서 img 표시 크기 측정(장 1·6·9·18·19·22) | PR2: IMG-03 실패 2(6장 1.12, 18장 1.00), IMG-04 실패 2(desk 305KB, 총 1.64MB), PERF-01 LCP 3.04~3.13s(단독 3회) | 6 |
| 1 | Gemini 원본 2752×1536 PNG가 덱 밖 스냅숏에 있음을 찾음. check/ 조각(같은 해상도에서 표시 지운 결과)을 붙여 표시 없는 마스터 복원(조각 왼쪽=원본 픽셀 일치, 1920 축소본이 덱 JPEG와 PSNR 39~42dB). 원본 덱 JPEG·사진은 assets/src/로 옮기고(git rename), desk.jpg·openai-livestream-thumb.jpg는 참조 0 확인 후 삭제 | 표시 지운 자리 크롭 6장 눈으로 확인 — 반짝이 잔상 0 | 6 |
| 2 | 표시 크기 × 1.55 진행형 JPEG 파생본(assets/src/derive.py), img width/height 갱신 | IMG-03 6장 1.55, 18장 1.43, IMG-04 통과(총 1.13MB). 단, PERF-01 첫 화면 전송량이 1273→1824KB(이미지가 측정 창 안에 다 내려와 >1.5MB) → 회귀 | 3 |
| 3 | `loading="lazy"` 시험 | render.ts가 멈춤(?slide=n은 다른 장을 display:none으로 숨기고 settle이 타임아웃 없이 모든 img를 기다림 — 2분 뒤 강제 종료, 렌더 0장). lazy 포기 | 3 |
| 4 | fetchpriority 시험(cover high, 나머지 low), 이미지 차단 시험 | fetchpriority는 LCP 변화 없음(HTTP/1.1 로컬 서버). 이미지를 모두 막으면 LCP 1.84~1.93s → LCP는 이미지 요청이 HTML·CSS와 대역을 나눠 먹어서 생김 | 3 |
| 5 | WebP(품질 82) + JPEG 대체본(가로 1920 이하, ≤140KB)을 `<picture>`로. `<picture>`로 감싸도 34장 렌더가 PR2와 같은지 픽셀 비교 | 레이아웃 차이 0(압축 차이만, 장 평균 0.2~0.4/255). 첫 화면 전송량 1283KB(통과 유지), LCP 2.78~3.08s, IMG-04 총 1.38MB 통과 | 3 |
| 6 | 모든 파생본에 sRGB ICC 명시(V15-42), MANIFEST·CREDITS를 실제 파일과 대조해 고침 | IMG-01 통과, ICC: 생성 12개·사진 2개 'sRGB built-in', amodei 'c2' | 3(사용자 결정: 18장 해상도, 1·22장 가짜 글자) |

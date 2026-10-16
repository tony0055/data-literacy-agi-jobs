# AI 생성 이미지 기록

- 도구: Google Gemini 웹(gemini.google.com, Pro 모드, '이미지 만들기' Nano Banana 계열), 16:9, 2026-10-16 생성. 사용자 계정으로 ego-lite 브라우저에서 생성·원본 크기 다운로드.
- 원본(2752×1536 PNG, 장당 7~8MB)은 이 저장소에 넣지 않았다. 위치: `product-design-system/11-week8-deck-snapshot/agi-job-displacement/presentation/assets/img/raw/`(같은 폴더의 `check/`에 표시 지운 전후 조각과 `watermark-log.json`).
- 원본 오른쪽 아래의 Gemini 반짝이 표시는 `../../scripts/remove_watermark.py`로 지웠다: 별 템플릿으로 위치를 잡고 SAM 2.1(hiera small) 마스크 → OpenCV Telea 인페인팅 → 마스크 영역만 합성. 전후 비교는 위 `check/`.
- 덱의 해당 장에는 'AI 생성 이미지(Gemini)'라고 표기한다(1·6·18·19·22장 꼬리말). 데이터 차트를 대신하지 않는다.

## 덱용 파일(PR6, 2026-10-16)

`../src/derive.py`로 만든다. 원본 PNG에 `check/` 조각(같은 해상도에서 표시를 지운 결과)을 다시 붙여 표시 없는 원본 크기 마스터를 복원하고(조각 왼쪽 절반이 원본과 픽셀 단위로 같은지 확인, 1920으로 줄인 마스터가 이전 덱 JPEG와 PSNR 39~42dB), 1920×1080 렌더에서 잰 표시 크기 × 1.55(IMG-03의 1.5배 + 반올림 여유)로 줄인다. 원본보다 키우지 않고, 자르지 않는다(화면 크롭은 CSS 그대로). 모든 파생본에 sRGB ICC를 붙였다.

- 덱은 `<picture>`로 WebP(품질 82)를 먼저 주고, WebP를 못 쓰는 브라우저에는 같은 이름 `.jpg` 대체본(가로 1920 이하 = 이전 덱 해상도, 진행형, 140KB 이하가 되는 가장 높은 품질·하한 70)을 준다.
- 첫 화면 cover는 `fetchpriority="high"`. 나머지에 `loading="lazy"`를 넣지 않은 이유는 PR6 PR-body(렌더 도구가 멈춤).

| 파일 | 장 | 표시(CSS px) | WebP(브라우저가 받는 것) | 배율 | JPEG 대체본 | 이전 덱 파일(assets/src/img) |
| --- | --- | --- | --- | --- | --- | --- |
| cover | 1 | 639×704 | 1955×1091 · 72KB | 1.55 | 1920×1071 q76 · 131KB | 1920×1072 · 217KB |
| callcenter | 1 | 639×704 | 1955×1091 · 51KB | 1.55 | 1920×1071 q82 · 131KB | 1920×1072 · 185KB |
| recursion | 6 | 685×960 | 2666×1488 · 186KB | 1.55 | 1920×1072 q72 · 139KB | 1920×1072 · 242KB(배율 1.12) |
| entry | 18 | 1920×960 | 2752×1536(원본 최대) · 114KB | 1.43(<1.5) | 1920×1072 q76 · 138KB | 1920×1072 · 230KB(배율 1.00) |
| robot | 19 | 501×640 | 1777×992 · 94KB | 1.55 | 1777×992 q70 · 145KB | 1920×1072 · 277KB |
| neurons | 22 | 501×640 | 1777×992 · 78KB | 1.55 | 1777×992 q80 · 137KB | 1920×1072 · 226KB |

- assets/img 합계 1.38MB(1415KB = WebP 595KB + JPEG 대체본 820KB, 판정기 IMG-04는 둘 다 센다, 1KB=1024B). 브라우저가 실제로 받는 생성 이미지는 WebP 595KB(이전 덱 6장 JPEG 1377KB).
- entry는 원본 2752px로도 배율 1.43이라 IMG-03(1.5)에 못 미친다. 2880px 이상이 필요하며 단순 보간 확대는 하지 않았다(선명도가 늘지 않는다). 재생성·유료 업스케일은 사용자 결정.
- 이전 덱 파일(가로 1920, 품질 88, 표시 지운 것)은 `../src/img/`에 그대로 옮겨 두었다(git에서 같은 내용이라 저장소 용량 증가 0).

## 덱에서 내린 그림

| 파일 | 상태 |
| --- | --- |
| desk | 2장에서 PR2가 내림(가짜 글자 문서·가짜 막대 그래프). index.html·CSS 참조 0을 확인하고 PR6에서 파일을 지움(커밋 13dc48d까지 이력에 남음, 원본 PNG는 위 `raw/`) |
| seoul | 이 저장소에 파일 없음(원본 PNG와 1920 JPEG는 스냅숏 폴더에만). 덱 참조 0 |

## 프롬프트

| 파일 | 프롬프트 |
| --- | --- |
| cover | Realistic editorial documentary photograph, 16:9 … split-flap departure board … empty modern open-plan office at dawn … (전문 미기록 — 예전 기록의 '아래 tsv'는 저장소·스냅숏 어디에도 없다. robot·neurons도 줄임 기록만 남음) |
| recursion | Realistic editorial documentary photograph, 16:9. Cool blue-gray palette with a single warm amber light accent, soft light, shallow depth of field, calm serious mood. Absolutely no readable text, letters, numbers or logos anywhere. Keep the left third as calm dark negative space for slide text. Scene: a data-center server corridor seen between two facing mirrors so the corridor repeats infinitely into the distance (recursive Droste effect). Inside the reflections a slim white robotic arm is carefully adjusting a server rack. Cool blue LED light with one small amber status light. |
| desk | Realistic editorial documentary photograph, 16:9, top-down view. Cool blue-gray palette with a single warm amber desk lamp glow, shallow depth of field, calm serious mood. Absolutely no readable text, letters, numbers or logos anywhere: all paper text is blurred and unreadable, the laptop screen shows only abstract glowing blurred bars. Keep the left third relatively empty dark wood surface for slide text. Scene: a professional's desk at night with stacks of contract papers, a calculator, a fountain pen, an open laptop, a cup of coffee. |
| entry | Realistic editorial documentary photograph, 16:9. Cool blue-gray palette with a single warm amber light accent, soft early-morning light, shallow depth of field, quiet lonely mood. Absolutely no readable text, letters, numbers or logos anywhere; monitors show only blurred light. Keep the left third as calm negative space for slide text. Scene: a single young Korean office worker seen from behind, sitting alone at the far end of a very long row of empty desks in a high-rise office in Seoul, early morning. |
| seoul | Realistic editorial documentary photograph, 16:9. Cool blue-gray blue-hour palette with warm amber office window lights, light mist, calm serious mood. Absolutely no readable text, signs, letters, numbers or logos anywhere. Keep the left third as calm sky and water negative space for slide text. Scene: Yeouido business district skyline in Seoul seen across the Han River at blue hour, office tower windows lit, mist over the water. |
| callcenter | Realistic editorial documentary photograph, 16:9. Cool blue-gray palette with one warm amber desk lamp, soft light, shallow depth of field, quiet empty mood. Absolutely no readable text, letters, numbers or logos anywhere; screens show only abstract blurred shapes. Keep the left third as calm negative space for slide text. Scene: an empty call-center floor at night, rows of workstations with headsets resting on the desks, chairs pushed in, screens glowing softly. |
| robot | Realistic editorial documentary photograph … humanoid robot working at a car factory assembly line next to an empty human workstation … |
| neurons | Realistic scientific editorial photograph … living brain organoid resting on a microelectrode array chip … |

## 남은 문제(사용자 결정 필요)

- cover.jpg(1장): 뒤쪽 매달린 화면 두 개에 흐릿한 가짜 글자 덩어리(덱 화면 좌표 약 1210–1390, 435–500). 지금 CSS 크롭(object-fit: cover, 50% 50%) 안 한가운데라 크롭을 바꾸지 않고는 뺄 수 없다.
- neurons.jpg(22장): 칩 기판의 가짜 글자 'MEA_CHI…'·'uV'가 보이는 자리에 있다.
- recursion.jpg(6장): 랙 선반 앞 작은 명판에 글자 같은 무늬('S1EEFA'처럼 보임, 덱 화면에서 폭 약 20px). PR6에서 원본 크기로 바꾸며 눈으로 찾은 것(PR2 넘김 목록에 없던 항목).
- 세 장 모두 재생성(Gemini, 프롬프트에 화면·기판 글자 금지 강화) 또는 해당 부분 국소 보정이 필요하다. 생성은 사용자 확인 뒤에 한다.

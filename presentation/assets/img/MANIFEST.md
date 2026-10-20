# 덱 이미지 목록 (생성형 AI 이미지)

모든 파일은 **생성형 AI 이미지**다. 실제 사진이 아니다. 표시 정책: 그림 아래 · 각 장 꼬리말에는 생성 표시를 달지 않고, 34장(출처) 꼬리말에서 한 번에 밝힌다 — 이미지를 쓴 장 번호 + 이 파일 경로(사용자 2026. 10. 21., design-standard/components.md 「그림」).

- 생성 도구: Gemini 웹(gemini.google.com), 사용자 계정(Pro). 입력창 「이미지 만들기」 도구, 모델 선택은 기본값 Flash 그대로. 장면마다 새 채팅에서 한 장씩 만들었다.
- 생성일: 01-hero는 2026. 10. 20.(23시 56분 무렵), 나머지는 2026. 10. 21.(0시 3분~0시 31분, KST).
- 받은 방법: 응답의 「원본 크기 이미지 다운로드」를 누를 때 Gemini가 받아 오는 원본 PNG를 같은 페이지에서 다시 받아 저장. 받은 원본을 그 채팅 화면의 미리보기와 축소 비교해 같은 이미지인지 확인했다(06·07·10·01은 채팅에 응답이 하나뿐인 상태에서 받음).
- **Gemini 워터마크 있음(지우지 않음).** 모든 장 오른쪽 아래에 반투명 흰 ✦ 표시가 있다. 원본 기준 오른쪽·아래 가장자리에서 약 64–160px 안쪽(중심 약 112px, 크기 약 96px). 16:9 JPEG(2400px로 축소)에서는 약 56–140px 안쪽.
  - 덱은 칸에 맞춰 자를 때 기준점을 **오른쪽 아래**로 둔다(deck.css `.media` `--media-position: 100% 100%`) — 위 · 왼쪽만 잘리고 워터마크는 남는다. 오른쪽 아래 모서리를 다른 요소로 덮지 않는다.
- 비율: Gemini 비율 선택지가 1:1·9:16·3:4·4:3·16:9뿐이라 원본은 16:9 · 4:3 · 3:4로 만들고 덱에서 칸에 맞춰 자른다 — 덱 허용 비율 여섯 가지(`data-ratio` 16:9 · 3:2 · 4:3 · 1:1 · 3:4 · 2:3, 3회차 SC-05) 중에서만. 예외는 13장 한 칸(원본 2×2 격자의 오른쪽 아래 사분면만 16:9 칸에, 장 CSS). 자르는 기준점은 늘 오른쪽 아래라 워터마크가 남는다.
- 파일: `NN-이름.png`가 받은 원본(손대지 않음, 커밋하지 않음), `NN-이름.jpg`가 덱용 사본. **덱에는 jpg를 쓴다.** 원본 PNG 20장 합계 약 152MB.
- 덱용 사본 크기(2026. 10. 21. 3회차 L-07 · L-06): 장에서 그려지는 크기(칸에 맞춰 자르기 전 전체 그림의 긴 변, 1280 × 720 캔버스 px)의 **2배** 이상이 되게 긴 변 1280px로 줄였다(가장 크게 그려지는 29장 서울 그림 645 → 1300px). 1920 화면(1.5배 렌더)에서 화면 픽셀당 원본 1.3픽셀 이상이다. 표지 히어로(그려지는 긴 변 1290)만 원본 사본 2400px 그대로. PNG 원본에서 한 번에 줄였고(LANCZOS) JPEG 품질 85 · 프로그레시브 · **sRGB 색 프로필 포함**(IC-45, 전에는 프로필 없음), Pillow. 비율은 원본과 같아(자르지 않음) 오른쪽 아래 워터마크도 그대로 줄어 남는다. JPEG 합계 약 8.7MB → 약 2.8MB. 장을 다시 짜서 그림이 훨씬 커지면(그려지는 긴 변 640px 넘게) PNG에서 다시 만든다.

## 공통 스타일 문단

각 장면 프롬프트 뒤에 빈 줄 하나를 두고 아래 문단을 그대로 붙여 보냈다.

```text
Style for this image: bright, airy editorial photograph, soft natural daylight, cool color palette of pale sky blue, deep navy-tinted blue and clean white, with only a little natural color from real objects, generous negative space, shallow depth of field, calm and optimistic mood, realistic photograph (not an illustration, not a 3D render). Strictly no text, no letters, no numbers, no logos, no brand names, no signage text and no readable screen content anywhere in the image. No identifiable faces: people are seen only from behind, in profile silhouette, or as hands. No purple or neon gradients, no glowing sci-fi effects, no robots with red eyes, nothing dystopian.
```

## 파일별

「쓸 장」은 실제 쓰임(`grep -o 'assets/img/[^"]*' src/slides/*.html`, 2026. 10. 21. 3회차 최종)이다. 한 그림을 두 장에 쓴 것은 07 · 10 · 17(3장 세 질문 칸과 본문 장), 세 장 이상 쓴 그림은 없다. 덱 밖에서는 `design-standard.html` 확인 화면이 01 · 06 · 07 · 11 · 13을 견본으로 쓴다.

| 파일 | 쓸 장 | 내용 | 비율 | 원본 PNG | 덱용 JPG | 워터마크 |
| --- | --- | --- | --- | --- | --- | --- |
| `01-hero.jpg` | 1 | 히어로. 이른 아침 밝은 사무실 창가, 책상 위 노트북 옆 작은 흰 로봇 팔이 종이를 정리하고 사람 손이 커피잔을 든다. 왼쪽 약 40%는 비어 있는 창빛·흰 벽(제목 자리). | 16:9 | 2752×1536, 6.3MB | 2400×1340, 167KB | 오른쪽 아래 |
| `06-ai-builds-ai.jpg` | 6 | 밝은 연구실의 흰 서버 랙 앞, 화면 빛을 받는 연구자의 뒷모습. 화면은 흐릿한 빈 빛. | 4:3 | 2400×1792, 7.4MB | 1280×956, 106KB | 오른쪽 아래 |
| `07-growing-blocks.jpg` | 3 · 8 | 흰색에서 남색으로 갈수록 점점 커지는 블록 여섯 개(정물). | 4:3 | 2400×1792, 6.0MB | 1280×956, 44KB | 오른쪽 아래 |
| `10-experts-meeting.jpg` | 3 · 10 | 통유리 회의실, 빈 화이트보드 앞에서 이야기하는 네 사람(뒷모습·옆모습). | 4:3 | 2400×1792, 8.1MB | 1280×956, 133KB | 오른쪽 아래 |
| `11-clock.jpg` | 안 씀(확인 화면 견본만) | 숫자 없는 흰 벽시계와 창 그림자(세로). | 3:4 | 1792×2400, 7.8MB | 956×1280, 73KB | 오른쪽 아래 |
| `12-glass-towers.jpg` | 12 (옆 칸) | 유리 빌딩 사이로 올려다본 파란 하늘(세로). | 3:4 | 1792×2400, 9.6MB | 956×1280, 259KB | 오른쪽 아래 |
| `13-hands-of-work.jpg` | 13(오른쪽 아래 사분면만 16:9 칸에) | 네 직업의 손 2×2 격자: 간호(청진기), 사무(펜·빈 종이), 목공(망치·나무), 컴퓨터(노트북 타자). | 4:3 | 2400×1792, 7.1MB | 1280×956, 127KB | 오른쪽 아래 |
| `16-data-points.jpg` | 16 | 밝은 바탕 위 가는 선으로 이어진 물방울 같은 점들(추상). | 4:3 | 2400×1792, 6.8MB | 1280×956, 51KB | 오른쪽 아래 |
| `17-seoul-commute.jpg` | 3 · 17 | 아침 햇빛의 한국 도심 오피스 거리 넓은 보도, 멀리 걸어가는 출근길 사람들(작게, 뒷모습). | 4:3 | 2400×1792, 9.1MB | 1280×956, 263KB | 오른쪽 아래 |
| `18-interview-wait.jpg` | 18 | 복도 의자에 나란히 앉은 정장 차림 지원자들의 무릎과 손, 닫힌 흰 서류철(얼굴 없음). | 4:3 | 2400×1792, 7.4MB | 1280×956, 114KB | 오른쪽 아래 |
| `19-robot-cup.jpg` | 19 | 밝고 정돈된 실험실에서 흰 로봇 팔이 흰 머그를 집어 드는 장면. | 4:3 | 2400×1792, 7.2MB | 1280×956, 91KB | 오른쪽 아래 |
| `20-warehouse-robot.jpg` | 20 | 밝은 물류 창고에서 하늘색 작업복 작업자(뒷모습)와 상자를 실은 흰 이동 로봇이 함께 걷는다. | 4:3 | 2400×1792, 7.4MB | 1280×956, 160KB | 오른쪽 아래 |
| `21-power-datacenter.jpg` | 21 | 맑은 낮의 송전탑과 지붕에 냉각 설비가 줄지은 데이터센터 건물. | 4:3 | 2400×1792, 7.6MB | 1280×956, 169KB | 오른쪽 아래 |
| `22-organoid-chip.jpg` | 22 (옆 칸) | 밝은 실험대, 장갑 낀 손의 핀셋과 페트리 접시 속 전극 칩 위 조직, 뒤의 현미경(세로). | 3:4 | 1792×2400, 6.7MB | 956×1280, 102KB | 오른쪽 아래 |
| `25-office-floors.jpg` | 25 (옆 칸) | 유리 지붕 아트리움, 계단으로 이어진 여러 층과 층마다 작은 사람들(세로). | 3:4 | 1792×2400, 8.3MB | 956×1280, 198KB | 오른쪽 아래 |
| `26-seoul-2036.jpg` | 29 | 맑은 낮 한강과 다리, 강변 공원 너머 서울 스카이라인(과장 없는 가까운 미래). | 16:9 | 2752×1536, 8.3MB | 1300×726, 158KB | 오른쪽 아래 |
| `27-empty-desks.jpg` | 28 | 빈 책상이 줄지은 사무실, 맨 안쪽 한 자리만 모니터가 켜져 있다. | 4:3 | 2400×1792, 6.7MB | 1280×956, 132KB | 오른쪽 아래 |
| `30-scale.jpg` | 30 (옆 칸) | 흰 탁자 위 거의 수평인 놋쇠·흰색 저울(세로). | 3:4 | 1792×2400, 5.6MB | 956×1280, 58KB | 오른쪽 아래 |
| `32-forked-path.jpg` | 31 | 푸른 초원 위에서 두 갈래로 갈라지는 흰 자갈길과 맑은 하늘. | 4:3 | 2400×1792, 9.1MB | 1280×956, 211KB | 오른쪽 아래 |
| `33-foggy-road.jpg` | 33 | 나무가 늘어선 곧은 길이 밝은 안개 속으로 사라진다. 앞 구간만 또렷하다. | 4:3 | 2400×1792, 9.1MB | 1280×956, 218KB | 오른쪽 아래 |

## 대체 글(alt) — 장식 그림은 비운다(2026. 10. 21. 결정)

정본 AC-65(필수): 정보 없이 분위기 · 비유만 전하는 장식 그림은 화면 읽기 프로그램이 건너뛰게 `alt=""`로 둔다. 장 메시지가 말하는 대상을 보여 주는 그림만 무엇이 보이는지 적는다(2회차 검수 IM-03). 같은 그림을 두 장에 쓰면 두 곳 모두 같은 판단이다. 이 표는 `grep -o '<img[^>]*assets/img/[^>]*>' src/slides/*.html`로 다시 읽은 실제 상태다.

| 그림 | 장 | alt | 까닭 |
| --- | --- | --- | --- |
| `19-robot-cup.jpg` · `20-warehouse-robot.jpg` · `21-power-datacenter.jpg` · `22-organoid-chip.jpg` | 19 · 20 · 21 · 22 | 설명(한 문장) | 장이 말하는 대상(로봇 팔 · 창고 로봇 · 데이터센터 · 오가노이드 칩)을 보여 준다 |
| `01-hero.jpg` · `06-ai-builds-ai.jpg` · `07-growing-blocks.jpg` · `10-experts-meeting.jpg` · `12-glass-towers.jpg` · `13-hands-of-work.jpg` · `16-data-points.jpg` · `17-seoul-commute.jpg` · `18-interview-wait.jpg` · `25-office-floors.jpg` · `26-seoul-2036.jpg` · `27-empty-desks.jpg` · `30-scale.jpg` · `32-forked-path.jpg` · `33-foggy-road.jpg` | 1 · 3 · 6 · 8 · 10 · 12 · 13 · 16 · 17 · 18 · 25 · 28 · 29 · 30 · 31 · 33 | `alt=""` | 분위기 · 비유 그림이라 장의 사실을 더하지 않는다(장식). 생성형 AI 표시는 34장 꼬리말에서 한 번에 밝힌다 |

인물 사진(`assets/photos/`, 9장)은 사람 이름을 alt로 둔다(`assets/photos/CREDITS.md`).

## 프롬프트 원문과 확인 메모

### 01-hero

- 쓸 장: 1 · 생성일: 2026. 10. 20. · 생성형 AI 이미지 · Gemini 워터마크 있음(지우지 않음)
- 확인 메모: 노트북 옆면에 읽히지 않는 작은 라벨 자국(원본 약 60×20px)이 있다. 덱 크기에서는 보이지 않는다.

```text
Create a photograph, landscape 16:9 aspect ratio. Early morning in a bright, minimal office beside a large window with soft pale-blue morning light. On the right side of the frame: a light desk with an open laptop seen from the side (screen not visible), a small white desktop robotic arm neatly stacking a few blank sheets of paper, and a person's hand entering from the edge of the frame lifting a white coffee cup. The moment when a person and AI begin to share the same work. The left 40% of the frame is calm, uncluttered empty space — a softly out-of-focus white wall and pale blue window light — reserved for a headline.
```

### 06-ai-builds-ai

- 쓸 장: 6 · 생성일: 2026. 10. 21. · 생성형 AI 이미지 · Gemini 워터마크 있음(지우지 않음)

```text
Create a photograph, landscape 4:3 aspect ratio. A bright, clean AI research lab with rows of white server racks with small blue status lights. A researcher is seen from behind, standing in front of a large monitor; the screen is softly blurred and only casts a cool blue glow on their shoulders, with no readable content. Calm, focused atmosphere.
```

### 07-growing-blocks

- 쓸 장: 3 · 8 · 생성일: 2026. 10. 21. · 생성형 AI 이미지 · Gemini 워터마크 있음(지우지 않음)

```text
Create a photograph, landscape 4:3 aspect ratio. Abstract still life: a single row of smooth matte blocks on a white tabletop, growing steadily in size from a tiny cube on the left to a large block on the right, each block roughly double the previous one. Colors range from white to pale sky blue to a deep navy blue. Soft window light from the left, gentle soft shadows, plenty of empty white space above.
```

### 10-experts-meeting

- 쓸 장: 3 · 10 · 생성일: 2026. 10. 21. · 생성형 AI 이미지 · Gemini 워터마크 있음(지우지 않음)
- 확인 메모: 오른쪽 한 사람은 옆모습이다(작게, 특정 어려움).

```text
Create a photograph, landscape 4:3 aspect ratio. A bright meeting room with floor-to-ceiling windows. Three or four people seen from behind or as soft silhouettes, standing and discussing in front of a large completely blank white whiteboard. Cool daylight, soft focus on the people, no writing on the board.
```

### 11-clock

- 쓸 장: 안 씀(덱에서 뺐다, 확인 화면 그림 견본에만 남음) · 생성일: 2026. 10. 21. · 생성형 AI 이미지 · Gemini 워터마크 있음(지우지 않음)

```text
Create a photograph, portrait 3:4 aspect ratio. A minimal white wall clock with no numerals, only thin navy hands, hanging on a pale blue-gray wall, softly lit by morning sunlight with a long window shadow crossing the wall. Still life, lots of empty space.
```

### 12-glass-towers

- 쓸 장: 12 (옆 칸) · 생성일: 2026. 10. 21. · 생성형 AI 이미지 · Gemini 워터마크 있음(지우지 않음)

```text
Create a photograph, portrait 3:4 aspect ratio. Looking straight up between modern glass office towers toward a clear cool blue sky. The glass facades reflect clouds and sky. Clean geometric lines, crisp daylight, no signage.
```

### 13-hands-of-work

- 쓸 장: 13 · 생성일: 2026. 10. 21. · 생성형 AI 이미지 · Gemini 워터마크 있음(지우지 않음)
- 확인 메모: 노트북 자판에 아주 작은 키 글자가 있다(칸 크기에서 읽히지 않음).
- 두 번째 생성본이다(첫 생성본의 문제는 아래 「다시 생성한 것」).

```text
Create a photograph, landscape 4:3 aspect ratio. A 2 by 2 grid collage of four overhead photos of hands at work, each on a white or pale blue surface: a nurse's hands holding a stethoscope over a plain white tray; an office worker's hands holding a pen over a few completely blank white sheets of paper; a carpenter's hands holding a hammer and a wooden board; hands typing on a silver laptop whose keyboard is softly out of focus. Thin white gutters between the four tiles, consistent soft daylight, matching cool color grade. No calculators, no printed forms, no writing on any paper.
```

### 16-data-points

- 쓸 장: 16 · 생성일: 2026. 10. 21. · 생성형 AI 이미지 · Gemini 워터마크 있음(지우지 않음)

```text
Create an image, landscape 4:3 aspect ratio. An abstract photograph of a delicate constellation of small soft-blue light points connected by very fine thin lines, forming a loose network that drifts across a bright white and pale-blue background, with soft bokeh in the foreground and background. Light, airy, minimal, scientific mood; no dark background.
```

### 17-seoul-commute

- 쓸 장: 3 · 17 · 생성일: 2026. 10. 21. · 생성형 AI 이미지 · Gemini 워터마크 있음(지우지 않음)
- 확인 메모: 간판·글자 없음. 서울 특정 장소는 아니다(첫 프롬프트는 거절되어 「한국 도시」로 바꿈).
- 두 번째 생성본이다(첫 생성본의 문제는 아래 「다시 생성한 것」).

```text
Create a photograph, landscape 4:3 aspect ratio. A wide, clean sidewalk in a modern business district of a Korean city on a bright morning, with glass office towers and young street trees. A few small figures in coats far away walk away from the camera, softly blurred by motion. Long soft morning shadows on the pavement. No signs, no shop names, no readable text.
```

### 18-interview-wait

- 쓸 장: 18 · 생성일: 2026. 10. 21. · 생성형 AI 이미지 · Gemini 워터마크 있음(지우지 않음)
- 두 번째 생성본이다(첫 생성본의 문제는 아래 「다시 생성한 것」).

```text
Create a photograph, landscape 4:3 aspect ratio. Close-up from the side of a row of simple wooden chairs in a bright corridor outside an interview room. Young job applicants in navy suits are seated; only their laps and hands are visible, each holding a closed plain white folder. All folders are closed, nothing printed on them, no visible paper sheets. Faces and heads are out of frame. Soft daylight from tall windows, quiet, slightly nervous mood.
```

### 19-robot-cup

- 쓸 장: 19 · 생성일: 2026. 10. 21. · 생성형 AI 이미지 · Gemini 워터마크 있음(지우지 않음)
- 확인 메모: 뒤쪽에 흐릿한 사람 두 명(얼굴 특정 안 됨).
- 두 번째 생성본이다(첫 생성본의 문제는 아래 「다시 생성한 것」).

```text
Create a photograph, landscape 4:3 aspect ratio. In a bright, minimal, very tidy robotics lab, a slim white robotic arm with a two-finger gripper gently grasps the handle of a plain white ceramic mug and lifts it just above a clean empty white table. Nothing else on the table. Large windows with soft daylight, softly blurred pale blue background, shallow depth of field. No logos, no screens.
```

### 20-warehouse-robot

- 쓸 장: 20 · 생성일: 2026. 10. 21. · 생성형 AI 이미지 · Gemini 워터마크 있음(지우지 않음)

```text
Create a photograph, landscape 4:3 aspect ratio. A bright, clean logistics warehouse with tall shelves of plain cardboard boxes. A worker in a light blue work jacket, seen from behind, walks alongside a low white autonomous mobile robot carrying a stack of boxes. Daylight from skylights, calm and orderly. No labels, no text on boxes, no logos.
```

### 21-power-datacenter

- 쓸 장: 21 · 생성일: 2026. 10. 21. · 생성형 AI 이미지 · Gemini 워터마크 있음(지우지 않음)

```text
Create a photograph, landscape 4:3 aspect ratio. Bright midday: tall steel electricity transmission towers and power lines in the foreground, and behind them a large modern windowless data center building with rows of cooling units on its roof, under a clear cool blue sky with a few white clouds. Clean, documentary feel, no signage.
```

### 22-organoid-chip

- 쓸 장: 22 (옆 칸) · 생성일: 2026. 10. 21. · 생성형 AI 이미지 · Gemini 워터마크 있음(지우지 않음)
- 확인 메모: 현미경 받침에 흐려진 라벨 자국(읽히지 않음).

```text
Create a photograph, portrait 3:4 aspect ratio. A bright biology research bench: a small clear petri dish holding pale pink-beige tissue on a microchip-like electrode array, a gloved hand holding tweezers nearby, and a white laboratory microscope softly out of focus in the background. White and pale blue tones, clean, scientific, soft daylight. No labels.
```

### 25-office-floors

- 쓸 장: 25 (옆 칸) · 생성일: 2026. 10. 21. · 생성형 AI 이미지 · Gemini 워터마크 있음(지우지 않음)

```text
Create a photograph, portrait 3:4 aspect ratio. Inside a bright modern office building atrium, looking at several stacked floors connected by white open staircases, glass railings and clean white floor slabs, a few small people on different levels seen from far away. Daylight from a glass roof, cool white and blue tones, architectural, orderly. No signs.
```

### 26-seoul-2036

- 쓸 장: 29 · 생성일: 2026. 10. 21. · 생성형 AI 이미지 · Gemini 워터마크 있음(지우지 않음)

```text
Create a photograph, landscape 16:9 aspect ratio. A bright, clear daytime view of the Seoul skyline along the Han River in the near future: realistic modern high-rise buildings, a few new slim towers, green riverside parks and bridges, soft haze, cool blue sky. Realistic and grounded, not science fiction, no flying cars, no neon.
```

### 27-empty-desks

- 쓸 장: 28 · 생성일: 2026. 10. 21. · 생성형 AI 이미지 · Gemini 워터마크 있음(지우지 않음)

```text
Create a photograph, landscape 4:3 aspect ratio. A long open-plan office with rows of identical empty white desks and chairs in soft bluish daylight. Only one desk far in the row has a monitor turned on, giving a gentle cool glow; all other monitors are off. The screen content is not visible. Quiet, still, slightly melancholic but bright mood.
```

### 30-scale

- 쓸 장: 30 (옆 칸) · 생성일: 2026. 10. 21. · 생성형 AI 이미지 · Gemini 워터마크 있음(지우지 않음)

```text
Create a photograph, portrait 3:4 aspect ratio. A simple, elegant brass-and-white balance scale with two empty pans, standing on a white table against a pale blue-gray wall, the two pans almost level. Soft side light, minimalist still life, lots of negative space.
```

### 32-forked-path

- 쓸 장: 31 · 생성일: 2026. 10. 21. · 생성형 AI 이미지 · Gemini 워터마크 있음(지우지 않음)

```text
Create a photograph, landscape 4:3 aspect ratio. A bright open landscape with a pale gravel path through green-blue grassland that splits into two diverging paths heading toward a distant horizon under a clear cool blue sky. Seen from a standing height, calm, airy.
```

### 33-foggy-road

- 쓸 장: 33 · 생성일: 2026. 10. 21. · 생성형 AI 이미지 · Gemini 워터마크 있음(지우지 않음)

```text
Create a photograph, landscape 4:3 aspect ratio. A quiet straight road lined with trees disappearing into soft white morning fog; only the first stretch of the road is clearly visible and the rest fades into bright pale-blue mist. Gentle, hopeful, not gloomy.
```

## 다시 생성한 것

| 장면 | 첫 시도 | 이유 | 바꾼 것 |
| --- | --- | --- | --- |
| 13-hands-of-work | 생성됨, 버림 | 계산기 자판에 깨진 글자, 간호 칸의 서식 종이에 가짜 글자 | 계산기·인쇄 서식 빼고 「펜과 빈 종이」로, 자판은 흐리게 |
| 17-seoul-commute | Gemini가 거절(「저는 그런 것을 하도록 프로그램되지 않았습니다」) | 이유 미표시 | 「서울」 대신 「한국 도시의 업무 지구」, 사람은 멀리 작게 |
| 18-interview-wait | 생성됨, 버림 | 손에 든 이력서에 가짜 글자 줄 | 서류철을 모두 닫은 빈 흰 서류철로, 얼굴은 화면 밖 |
| 19-robot-cup | 생성됨, 버림 | 실험대에 전선·부스러기가 어지럽게 흩어져 다른 장과 결이 어긋남 | 아무것도 없는 깨끗한 흰 탁자, 머그 손잡이를 집는 구도 |
| 01-hero(대안) | Gemini가 거절 | 이유 미표시. 첫 생성본을 그대로 씀 | — |

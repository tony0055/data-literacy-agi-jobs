# 컴포넌트 · 패턴 · 장 작업 규칙

값과 모양의 기준은 시스템 [`../src/ds/components.css`](../src/ds/components.css) · [`../src/ds/layout.css`](../src/ds/layout.css)(마크업 예는 [`../src/ds/DESIGN.md`](../src/ds/DESIGN.md) 5절)와 덱 [`../src/deck.css`](../src/deck.css)다. 모든 패턴의 실제 렌더는 [`../design-standard.html`](../design-standard.html)(히어로 · 그림 · 절 표시 · 계열 색 표 포함).

## 1. 장 파일

- 한 장 = `src/slides/NN.html` 하나(두 자리 번호). 맨 바깥은 `<section class="slide sNN">` **하나**(안쪽 묶음 `section.group`은 괜찮다). 앞에 주석 한 줄은 된다.
- 장 고유 CSS가 필요하면 `src/slides/NN.css`. **모든 선택자는 `.sNN`으로 시작**하고 `@keyframes` 이름은 `sNN-`로 시작한다(빌드가 검사한다). 색 · 글자 · 간격 값은 **시스템 토큰만** — 덱 토큰(`--deck-*` · `--stat-col` · `--media-ratio`)은 쓰지 않는다(시스템 검사가 장 CSS를 따로 읽어 「없는 토큰」으로 센다. 12열 한 열 폭이 필요하면 `calc((var(--layout-max-width) - var(--space-8) * 2 - var(--layout-gutter) * 11) / 12)`).
- `index.html` · `src/slides.bundle.css`는 빌드가 만든다. 고치지 않는다.
- 쪽 번호는 빌드가 `<span class="pg"></span>`에 「n / 34」로 채운다. `data-n`도 빌드가 단다.
- 장 작업자는 **자기 장 파일만** 고친다. `deck.css` · `controls.css` · `charts.js` · `present.js` · `fit.js` · `shell.html` · `src/ds/` · `chart-data.json` · 분석 파일은 고치지 않는다. 필요한 패턴 · 차트 종류가 없으면 `NN.css`로 장 안에서 해결하거나(토큰만), 공통으로 필요하면 보고에 적는다.

```html
<!-- NN 장 이름 -->
<section class="slide sNN">
  <div class="head">
    <p class="tag section-tag" data-hue="blue">절 이름</p>          <!-- 절 표시: color.md 「절 색」 표 그대로(빌드가 대조) -->
    <h2 class="headline">장 제목 한 문장(두 줄이면 의미 단위로 <br>)</h2>
    <p class="lead">설명 한두 줄(있을 때만)</p>
  </div>
  <div class="body">
    … 패턴 …
    <div class="takeaway"><p>핵심 한 문장</p></div>   <!-- 있을 때만. 배너 · 아이콘 없음 -->
  </div>
  <footer class="foot"><p class="source">출처 · 자료명 · 기준일</p><p class="where"><span class="sec">절 안 자리</span><span class="pg"></span></p></footer>
</section>
```

## 2. 뼈대(모든 내용 장에서 같은 자리)

| 클래스 | 역할 | 규칙 |
| --- | --- | --- |
| `.head` > `.section-tag` | 절 표시(시스템 `.tag[data-hue]`) | 마크업은 제목 앞, 화면에는 제목 첫 줄 끝 쪽(같은 기준선). 이름 · 색상은 [color.md](color.md) 「절 색」 표 그대로 — 2~34장 전부에 이미 들어 있다. 1장(히어로)에는 없다 |
| `.head` > `.headline` | 장 제목(type-title-1) | 한 장에 하나. 한 줄이 기본, 두 줄까지 `<br>`로 직접(검사가 `<br>` 수 + 1 줄까지 허용). 한 줄에 들어가는 제목도 의미 단위로 두 줄로 끊을 수 있다 — 그 대신 본문 높이가 32 줄어든다(2회차 T2-06) |
| `.head` > `.lead` | 설명 문단(type-body · text-2 · 최대 40em) | 한두 줄. 제목을 되풀이하지 않는다 |
| `.body` | 본문 | 위에서부터 쌓는다(세로 가운데는 히어로만). **남는 높이는 늘리지 않는다** — [layout.md](layout.md) 「남는 높이」 |
| `.takeaway` | 핵심 한 문장 | 위 가는 선 + 본문 굵게(배너 · 아이콘 없음), 본문 맨 아래 같은 자리. 한 장의 주장은 이 모양 하나로 둔다(위쪽 굵은 줄 · heading 줄로 따로 만들지 않는다) |
| `.foot` > `.source` · `.where` > `.sec` · `.pg` | 꼬리말 | 출처는 두 줄까지(캡션 12px, 세 줄이면 `fit.js`가 실패로 잡는다 — 위 선을 넘는다). 출처 줄에는 기관 · 자료 이름과 함께 **분석 파일 경로(재현 경로)를 남긴다**(예: `analysis/relations.py`, W-62는 오케스트레이터 결정까지 남김). **꼬리말에는 순수 출처(기관 · 자료 이름 · 파일 경로 · 기준일)만** — 풀이 · 가정 · 정의 · 범례 문장은 본문 · 차트 부제 · `.footnote`로(3회차 C3-01 · T3-03, 정본 CO-05 필수). 출처 항목 사이 구분자는 띄운 「 · 」 하나(아래 「화면 글」). 출처 줄에는 읽기 폭을 걸지 않는다(폭을 줄이면 10 · 12장이 세 줄로 넘친다). `.sec`은 절 안 자리(예: 「AI 발전 속도 · 관계식 R1」). 관계식 R1~R6은 5장 흐름도의 연결선 이름표와 같은 번호다(`analysis/out/relations.json`: R1 배가 가속 7 · 8장, R2 AGI 예상 10장, R3 직업 자동화 예상 11장, R4 신입 채용 신호 18장, R5 전력 21장, R6 로봇 데이터 시차 20장). 생성 이미지 표시는 장마다 적지 않고 34장 꼬리말에서 한 번에 밝힌다(이미지를 쓴 장 번호 + `assets/img/MANIFEST.md`, 사용자 2026. 10. 21.) |

## 3. 패턴 — 고르는 법

**카드 없음(사용자 결정 2026-10-20 「카드 형태의 UI는 쓰지 마」).** 장 안에 바탕 상자 · 바깥 테두리 · 둥근 묶음 상자(시스템 GroupBox의 `.groupbox__box` 포함) · 그림자 · 색 면 · 한쪽 색 띠 · 어두운 장을 만들지 않는다. 핵심 문장을 배너(`.banner`)에 담지 않는다 — 배너는 피드백 메시지다(WR-62).

| 내용의 관계 | 패턴 | 마크업 요지 |
| --- | --- | --- |
| 표지 | **히어로** `.slide.hero` | 아래 「히어로」 |
| 차트 하나 + 읽는 법 · 숫자 몇 개 | `.cols` > `figure.chart.span-8` + `section.group.span-4` | 묶음 높이 = 내용. 빈 곳은 그림 · 차트로 |
| 차트 하나를 넓게 | `figure.chart`(data-w="1152") | `data-h`로 높이 |
| 장면 · 대상을 보이는 그림 | **`figure.media`**(생성 이미지는 캡션 없음) | 아래 「그림」 |
| 핵심 숫자 둘~넷을 나란히 | `section.group` > `.group__cols[data-cols]` > `.group__cell` | 칸 사이 세로 선 |
| 숫자 하나가 장의 주인공 | `p.figure.figure--display` | 36/44, 단위는 heading |
| 숫자 + 설명 목록(세로) | `.group__rows` > `.group__row.group__row--stat` × n | `[숫자 160][설명]`. 숫자 칸은 오른쪽 덩어리 수만큼만 행을 걸친다(deck.css가 센다 — 장 CSS로 `grid-row`를 고치지 않는다) |
| 질문 · 단계 · 차례 | `ol.group__rows` > `li.group__row.group__row--step` > `.group__no` + `h3` + `p` | `[번호 32][제목 + 설명]`. 번호 붙은 차례는 모두 이 모양(33장 「바로 다음 할 일」처럼 제목만 있으면 번호 칸도 한 행) |
| 이름 ↔ 값(사양 · 변화율 목록) | `.group__rows` > `.group__row.group__row--pair` > `.group__label`(+ `.group__desc`) + `.group__value` | 값은 끝 맞춤 · 같은 폭 숫자. 이름 하나 ↔ 값 하나인 짧은 목록(13 · 17 · 22 · 23 · 26장)이 기본. **값이 셋 이상이고 견줄 열이 둘 이상이면 표로**(열 머리 — 14장). 정본도 그대로 갈린다: GroupBox 행은 행 사이 선, 표는 선 없는 둥근 행(2회차 S-07). 예외 하나: 줄마다 계산 차례(+ · ×)가 이어 읽히는 계산 과정은 **머리 없는 시스템 표**(23장 계산 표 둘 — README 「값」 OP-14) |
| 짧은 머리 + 설명 묶음 | `.block` > `h3` + `p` | |
| 정의 · 용어 · 대상 | `section.group` > `h3.group__title` + `.group__rows` > `.group__row` | |
| 여러 속성 비교 · 계획 · 출처 | 표 `div.table.table--wrap[role=table]` + `NN.css`에서 열 너비 | 표 제목은 `section.group` > `h3.group__title` + 표. 여러 줄 칸이 섞이면 `.table--multiline`(30 · 31 · 32장) |
| 시간 순서(2026~2036) | `ol.timeline` > `li.timeline__item`(지금 단계 `data-current`) | 세로로 펼치면 `.timeline--vertical`(줄 높이 = 내용, 줄 사이 16 — 29장) |
| 마디 · 화살표 도식 | 손 SVG `svg.diagram` > `g.node` > `text.n-t`/`.n-s`, `path.edge`(핵심 경로 `.edge--key`) | 마디는 **상자 없이** 글자 묶음(이름 굵게 + 설명)과 연결선만(2회차 S-01). `rect`를 남겨도 그리지 않는다. 마디 이름은 모두 text-1 |
| 인물 발언(큰 사진) | 아래 「인물 발언」 | 사진 원래 비율 |
| 핵심 한 문장 | `div.takeaway` > `p`(+ 둘째 줄 `p.t-label.c-text-2`) | 본문 맨 아래. 한 줄이 기본(두 줄이면 위 선이 올라간다 — 2회차 SL-06) |
| 각주 · 단서 문장(「* 3.5배는 …」, 축 뜻 · 뺀 점 · 정의 · 범례 · 가정) | `p.footnote` | 라벨 13/20 · text-2 · 읽기 폭 40em · pretty. 읽어야 하는 주석은 text-3(캡션 · 출처 줄)에 싣지 않는다(정본 CO-05 필수, 3회차 C3-01 · T3-03). **자리**: 차트의 단서 = `figure.chart` 안 그림 뒤 · 출처(`.chart-src`) 앞, 그림의 단서 = `figure.media` 밖 바로 뒤(생성 이미지에는 캡션 없음, 캡션은 사진 출처 자리만), 장 전체의 단서 = 본문 끝(핵심 한 문장 위) 또는 그 묶음 끝. 각주 표시는 `<span class="fn">*</span>`(어디서나 13/600 · 폭 0). 자리가 없어 출처 줄에 남길 때만 그 조각을 `span.c-text-2`로(12px라 덱 기준 밖 — 보고에 남긴다) |

나란한 묶음 둘의 시작선 · 높이를 맞출 때는 시스템 `.grid[data-share-rows]`(머리 · 본문 두 행) 또는 서브그리드(4장)를 쓴다. 묶음 안에 묶음을 넣지 않는다(줄 · 칸 · 선으로 나눈다).

### 히어로(1장) — `.slide.hero`

큰 그림 + 큰 제목(덱 display 44/52) + 부제 + 두 숫자(덱 figure 36/44). 왼쪽 6열 글, 오른쪽 7열 시작선부터 장 가장자리까지 그림(628 × 720, radius-0, 오른쪽 아래 기준으로 자름 — 워터마크 보존). 본문은 세로 가운데, 제목 묶음 → 64 → 두 숫자(칸 시작 64 · 358 — 12열 선). 제목 묶음 안은 큰 제목 → 16 → [부제 → 8 → 설명] — 부제 + 설명을 `.stack[data-gap="1"]`로 묶는다(부모 간격만, SP-61). 그림 출처 · 생성형 AI 표시는 꼬리말 출처 줄에. 표지 그림은 비유 그림이라 `alt=""`. 아래는 실제 1장(`src/slides/01.html`, 2026. 10. 21.) 그대로다.

```html
<section class="slide s01 hero">
  <figure class="media hero__media"><img src="assets/img/01-hero.jpg" width="2400" height="1340" alt=""></figure>
  <div class="body">
    <div class="hero__head">
      <h1 class="headline">AI는 언제쯤<br>내 일을 대신하게 될까요</h1>
      <div class="stack" data-gap="1">
        <p class="t-heading c-text-2">AI가 AI 개발을 돕기 시작한 뒤의 10년</p>
        <p class="lead">설명 한두 줄</p>
      </div>
    </div>
    <section class="group" aria-label="이 발표의 두 숫자">
      <div class="group__cols" data-cols="2">
        <div class="group__cell">
          <p class="figure figure--display">105<span class="figure__unit">일마다 두 배</span></p>
          <p>AI가 맡을 수 있는 업무 크기 <span class="tag" data-hue="indigo">기술</span></p>
          <p class="t-label c-text-2">2024년 이후 두 배가 되는 데 걸린 기간</p>
        </div>
        <div class="group__cell">
          <p class="figure figure--display"><span class="figure__unit">약</span> 320<span class="figure__unit">만 개</span></p>
          <p>2036년 대체 압력 <span class="tag" data-hue="purple">추정</span></p>
          <p class="t-label c-text-2">2036년 말까지 쌓인, AI로 사람이 빠질 수 있는 일자리 수(기준 시나리오 모형 값)</p>
        </div>
      </div>
    </section>
  </div>
  <footer class="foot"><p class="source">데이터리터러시의이해 중간고사 · … · 2026. 10. 16.<br>라벨 뜻: 기술은 정확한 집계·함께 움직임(원인 아님), 추정은 가정을 둔 계산, 직접은 원문 확인, 2차는 재인용</p><p class="where"><span class="pg"></span></p></footer>
</section>
```

- 두 숫자는 덱 기본 text-1 — 누를 수 없는 강조라 파랑을 쓰지 않는다(정본 CO-35, 2026. 10. 21.). 숫자 설명은 읽어야 하는 글이라 text-2. 대체 압력은 일자리 개수라 「만 개」(사용자 결정 2026. 10. 21.).

- 주인공이 그림 왼쪽에 있으면 장 CSS에서 `.s01 .hero__media { --media-position: 30% 100%; }`처럼 가로만 옮긴다 — 오른쪽 아래 모서리(워터마크)가 잘리지 않게 세로는 100%로 둔다.

### 그림 — `figure.media`

```html
<figure class="media" data-ratio="16:9">                                  <!-- 비율: 없음(원래 비율) · 16:9 · 3:2 · 4:3 · 1:1 · 3:4 · 2:3 -->
  <img src="assets/img/이름.jpg" width="원본 폭" height="원본 높이" alt="대상을 보여 주는 그림만 설명, 비유 · 분위기 그림은 빈 값">
</figure>                                                               <!-- 생성 이미지는 캡션 없음(생성 표시는 34장 꼬리말) -->
```

- 바탕 · 테두리 · 그림자 없음(카드처럼 보이지 않게), 모서리 radius-2. 캡션(`figcaption.media__caption`)은 사진 출처를 그림 곁에 둬야 할 때만 — 그림 ↔ 캡션 8. 지금 장 파일에서 쓰는 곳은 0.
- `data-ratio`로 칸에 맞출 때만 자른다(object-fit: cover). 기준점은 **오른쪽 아래**(`--media-position` 기본 100% 100%) — Gemini 워터마크는 지우지 않고(사용자 결정) 잘리지 않게 둔다.
- **비율 세트(3회차 SC-05 결정)**: 자를 때는 `data-ratio` 여섯 가지 — 가로 `16:9` · `3:2` · `4:3`, 정사각 `1:1`, 세로 `3:4` · `2:3` — 중에서만 고른다. 장 CSS에서 `aspect-ratio`를 따로 주지 않는다(같은 쓰임의 사진이 11가지 비율이었다). 높이는 덱이 4로 반올림한다(소수 픽셀 없음). 칸 높이가 남으면 사진을 늘리지 말고 아래 빈 곳으로 둔다. 지금 쓰는 비율은 [layout.md](layout.md) 「묶음 · 항목 · 칸」 그림 행과 렌더로 확인한다.
- 예외 둘(장 CSS, README 「값」): 13장은 손 2×2 격자 원본에서 오른쪽 아래 칸(노트북 손)만 16:9 칸에 보인다(원본을 2400/1194배 폭으로 놓고 오른쪽 아래에 붙여 워터마크를 남김 — 3회차 M-02, 아래 두 칸을 따로 보이면 왼쪽 칸에 워터마크가 없었다). 9장 인물 사진은 실제 사진(워터마크 없음)이라 4:3으로 자르고 기준점을 얼굴 쪽으로 옮긴다(`--media-position`).
- **대체 글(AC-65)**: 장 메시지가 말하는 대상을 보여 주는 그림만 설명을 둔다 — 지금 19 로봇 팔 · 20 창고 로봇 · 21 데이터센터 · 22 오가노이드 칩, 9장 인물 사진. 비유 · 분위기만 전하는 그림(표지 · 3장 세 칸 · 블록 · 연구실 · 회의실 · 유리 빌딩 하늘 · 손 · 물방울 그물 · 출근길 · 면접 대기 · 사무 건물 · 빈 책상 · 서울 · 저울 · 갈림길 · 안개 길)은 `alt=""`로 건너뛰게 한다(2026. 10. 21. 장 작업자 판단). 기록은 `assets/img/MANIFEST.md` 「대체 글」.
- **생성형 AI 표시 자리(사용자 2026. 10. 21. — 2회차 S-12의 「그림마다 캡션」을 대체)**: 그림 아래 · 각 장 꼬리말에 「이미지: Gemini 생성」을 달지 않는다. 34장(출처) 꼬리말에서 한 번에 — 이미지를 쓴 장 번호 + `assets/img/MANIFEST.md`. 이미지를 넣거나 뺀 장이 있으면 34장 장 번호 목록도 맞춘다.
- 생성 이미지는 데이터 차트를 대신하지 않는다. 장면 · 대상을 보여 글을 덜어 줄 때 쓴다. `assets/img/MANIFEST.md`가 프롬프트 · 생성 기록이다.
- **캡션 = 사진 출처만(생성 이미지에는 캡션 없음).** 그림이 무엇을 뜻하지 않는지 같은 단서(「블록 크기는 실제 값과 관계없어요」)는 캡션 밖 `p.footnote`로(3회차 SC-12).

### 묶음(`.group`) — 정확한 마크업

모양은 [`../src/deck.css`](../src/deck.css) 「묶음」 절. 시스템 GroupBox 짜임에서 상자만 지웠다: 제목(type-heading 18 · text-1) → 항목, **항목 사이에만** 가는 선. 묶음 위아래를 닫는 선이 없어 핵심 한 문장 위 선 · 꼬리말 위 선과 겹치지 않는다(1회차 SC-07 · L-11). 제목은 끝 문장부호 없이(CN-101).

```html
<section class="group" aria-labelledby="sNN-x">
  <h3 class="group__title" id="sNN-x">묶음 제목</h3>            <!-- 없으면 빼고 section에 aria-label -->
  <div class="group__rows">                                       <!-- 차례가 뜻이면 ol, 목록이면 ul -->
    <div class="group__row"><h3>항목 제목</h3><p>설명(라벨 크기 · text-2)</p></div>
    <div class="group__row"><p class="t-label c-text-2">라벨</p><p class="figure">−0.017</p><p>설명</p></div>
  </div>
</section>

<!-- 숫자 줄: [숫자 + 단위 160][설명 · 꼬리표] -->
<div class="group__row group__row--stat"><p class="figure">105<span class="figure__unit">일</span></p><p>설명</p><p class="tags"><span class="tag" data-hue="indigo">기술</span></p></div>

<!-- 번호 줄: [번호 32][제목 + 설명] -->
<li class="group__row group__row--step"><span class="group__no">1</span><h3>질문</h3><p>무엇을 재나</p></li>

<!-- 이름 ↔ 값 줄 -->
<div class="group__row group__row--pair"><p class="group__label">텔레마케터</p><p class="group__value">−39.5%</p></div>

<!-- 가로 칸: 기본 3칸, data-cols="2" · "4". 칸 시작이 12열 선(3칸 4·4·4 · 2칸 6·6 · 4칸 3·3·3·3), 칸 사이 = 열 사이 24, 세로 선은 그 가운데. 장 CSS에서 칸 폭을 다시 나누지 않는다 -->
<section class="group" aria-label="…">
  <div class="group__cols" data-cols="2">
    <div class="group__cell"><p class="t-label c-text-2">라벨</p><p class="figure">+0.3<span class="figure__unit">%</span></p></div>
    <div class="group__cell"><h4 class="t-body-strong">제목</h4><p>설명(본문 · text-2)</p></div>
  </div>
</section>
```

- 항목 안 덩어리 사이는 한 값 8(제목 + 설명, 숫자 + 설명). 장 CSS에서 다시 주지 않는다.
- 항목 제목 `h3`(묶음 안이면 `h4`도 같은 모양)는 본문 굵게, 클래스 없는 `p`는 항목에서 라벨 크기 · text-2, 칸에서 본문 · text-2다.
- **옛 이름은 지웠다**: `.box-row` · `.box-cols` · `.box-cell` · `.stat` · `.step` · `.step__no` · `.panel` · `.table--ruled` · `data-fill` · `data-justify="between"`. 빌드가 남은 것을 오류로 잡는다. 시스템 `.groupbox` · `.groupbox__box` · `.groupbox__row`는 덱에서 쓰지 않는다.

### 표 — 시스템 `.table` 그대로(`.table--wrap`)

```html
<div class="table table--wrap sNN-table" role="table" aria-label="표 이름">
  <div class="table__head" role="row"><span role="columnheader">이름</span><span role="columnheader" class="table__cell--numeric">값</span></div>
  <div class="table__row" role="row"><span class="table__cell table__cell--name" role="rowheader">신중</span><span class="table__cell table__cell--numeric" role="cell"><span class="num">2038<span class="fn">*</span></span></span></div>
</div>
```

- 사용자가 고른 「선 없이 둥근 행」(정본 components.md 「모양: 채움」) 그대로: 머리 아래 선만, 행 사이 선 · 끝 선 없음, 행 모서리 radius-2(호버 때 보인다). 덱이 더하는 것은 줄바꿈 변형(`.table--wrap`, 행 위아래 8)과 걸침(칸 글이 본문 시작선)뿐이다.
- 칸 글자는 시스템 그대로 `type-label`. 장 CSS에서 표 글자 크기 · 행 높이 늘리기(`grid-template-rows: … 1fr`)를 하지 않는다. 열 너비만: `.sNN .sNN-table :is(.table__head, .table__row) { grid-template-columns: … }`.
- 여러 줄 칸이 섞인 표는 `.table--multiline`을 더한다(`class="table table--wrap table--multiline …"`): 행 안 칸의 첫 줄 기준선을 맞추고(한 줄 칸이 행 가운데에 뜨지 않게) 칸 끝 줄에 한 어절만 남지 않게 한다(text-wrap: pretty). 장 CSS에서 `align-items` · `text-wrap`을 따로 주지 않는다.
- 숫자 칸은 끝 맞춤(`.table__cell--numeric`), 각주 *는 `.fn`(폭 0). 두 열에 걸쳐 가운데 맞춘 값을 두지 않는다.
- 행 묶음이 있으면(34장) `div[role="rowgroup"]`로 감싸고 묶음 이름은 `aria-label`로만 둔다 — 보이는 이름 줄은 두지 않는다(3회차 34장: 이름 줄 두 개 96px을 라벨 뜻에 내주었다. 갈래는 「확인」 열 글자가 말한다). 묶음 사이에 선을 두지 않는다(시스템 표 그대로).
- charts.js 블록 표(25장 직급 표 · 28장 직업군 표)는 `.table--multiline`이 붙어 나온다(3회차 SC-03). 「맡는 업무 크기」 같은 값 칸은 text-2 — 시스템 `.table__cell--muted`(text-3)는 값이 없는 보충 글 몫이라 값 칸에 쓰지 않는다(3회차 C3-04).

### 인물 발언(사진) — 9장

사람 셋을 예상 시점 순서로 12열 4 · 4 · 4칸에 나란히 두고, 사진은 덱 허용 비율 **4:3**(368 × 276)으로 모두 같게 자른다 — 원래 비율로 높이만 맞추면 폭 200 · 189 · 480, 틈 94 · 105로 고르지 않았다(3회차 SL3-05 · SC-05). 실제 인물 사진이라 기준점을 얼굴 쪽으로 옮긴다(장 CSS `--media-position`).

```html
<ol class="sNN-people">                                             <!-- 12열 격자, 칸마다 span 4 -->
  <li class="sNN-who">
    <figure class="media sNN-photo" data-ratio="4:3"><img src="assets/photos/amodei.jpg" width="960" height="1536" alt="다리오 아모데이"></figure>
    <div class="sNN-say">
      <p class="t-body-strong">발언 요지(인용 속 고유한 말은 data-check="ignore")</p>
      <div class="sNN-meta"><p class="t-label-strong">회사 · 이름</p><p class="t-label c-text-2">때 · 출처 <span class="tag" data-hue="indigo">예측</span></p></div>
    </div>
  </li>
</ol>
```

### 차트 구간 — 시작선 하나 + 이름

7장 「2024년 이후」 · 24장 「16시간 위는 측정이 아닌 외삽」은 색 면(띠)을 칠하지 않고 **구간이 시작하는 선 하나**(`line.zone`, 중립 데이터 색 실선 1)와 이름(`text.zone-lab`, 라벨 13 · text-2)으로 보인다(2026. 10. 21., 2회차 S-02 — 옅은 파랑 면이 설명 글이 든 상자로 읽혔다). 7장은 2024년 세로선 + 선 오른쪽 위 이름, 24장은 16시간 가로선 + 직급 문턱(점선 `.gate`) 이름과 같은 오른쪽 열의 이름. 데이터 조각에는 쓰지 않는다(조각은 `rect.bar.s-ctx.seg`).

### 글자 · 색 줄임 클래스

`.t-display` · `.t-title-2` · `.t-heading` · `.t-body` · `.t-body-strong` · `.t-label` · `.t-label-strong` · `.t-caption`, `.c-text-1/2/3`, `.num`(같은 폭 숫자), `.fn`(각주 표시), `.nowrap`, `.measure`(40em), `mark`(핵심어 형광펜 — 한 문장에 낱말 · 구절 하나, 어절 끝까지), `.bullets`(점 목록), `.figure` + `.figure__unit`(핵심 숫자 + 단위, 사이 0), `.figure--display`(큰 핵심 숫자), `.tags`(꼬리표 묶음).

### 시스템 배치 부품

`.stack` · `.inline`(`data-wrap`) · `.grid`(`data-columns` 1~4, 같은 폭 열, `data-share-rows`), `data-gap`(half · 1~6 · 8 · gutter), `data-align`, `data-justify`, `.hug` · `.fill`, `data-max="line"`. 12열 나눔은 덱 `.cols` + `.span-3`~`.span-9` · `.span-12`.

## 4. 주장 라벨(꼬리표)

시스템 색상 꼬리표 `.tag[data-hue]`를 쓴다. 글자가 뜻을 말하고 색은 묶음만 나눈다(CO-15). 한 줄 규칙: **인디고 = 자료 · 출처가 있는 값, 보라 = 이 발표가 계산하거나 가정한 값**([color.md](color.md)).

| 라벨 | 마크업 |
| --- | --- |
| 기술 · 직접 · 2차 · 자체 보고 · 회사 주장 · 예측 · 내부 목표 · 시간순 검증 · n = 3 | `<span class="tag" data-hue="indigo">기술</span>` |
| 추정 · 가정 공개 | `<span class="tag" data-hue="purple">추정</span>` |

덱에 쓴 꼬리표 11개의 뜻 — 34장 「라벨 뜻」과 같은 낱말이다(정본은 34장, 1장 각주가 가리킨다. 3회차 W-06):

| 라벨 | 뜻 |
| --- | --- |
| 기술 | 있는 그대로 적음: 정확한 집계나 함께 움직임, 원인은 아님(한자 「記述」은 Pretendard에 없어 쓰지 않는다) |
| 추정 | 가정을 둔 계산 · 시나리오 |
| 직접 | 원문 · 원자료에서 읽은 값 |
| 2차 | 기사 · 재인용으로 옮긴 값 |
| 자체 보고 | 회사가 스스로 재서 밝힌 값 |
| 회사 주장 | 독립 검증이 없는 회사 발표 |
| 예측 | 앞날을 내다본 말(실측 아님) |
| 내부 목표 | 회사가 세운 목표(예측 아님) |
| 시간순 검증 | 앞 시기 점으로 뒤를 맞힌 검증 |
| n = 3 | 설문 3회뿐인 관계(약한 근거) |
| 가정 공개 | 근거와 함께 밝힌 가정 값 |

- 꼬리표에는 **라벨 낱말만** 넣는다. 연도 · 값은 칸 글자로(28장 표는 「2029 + [추정]」). 기관 이름은 출처 줄에.
- 표본 수는 「n = 3」처럼 등호 앞뒤를 띄운다. 정본 WR-91은 문장 부호(가운뎃점 · 물결표 · 붙임표는 붙임)만 정하고 등호 같은 수식 기호는 정하지 않아, 덱의 다른 식(「r = −0.97」 · 「11.2 ÷ 3.2 = 3.5배」 · 출처 줄 「n = 770」)과 같은 꼴 하나로 맞췄다(2026. 10. 21.).
- 글줄 안 꼬리표(꼬리말 출처 · 차트 출처 · 이름 ↔ 값 줄의 이름)는 deck.css가 위아래 −4로 줄 높이를 키우지 않게 한다 — 장 CSS에서 다시 주지 않는다([layout.md](layout.md) 예외 표).
- 라벨은 숫자 · 주장 가까이(설명 끝, 차트 출처 끝)에 둔다. 미관 때문에 지우지 않는다. 「인과」는 이 덱에서 쓰지 않는다.
- 절 표시(`.section-tag`)도 같은 꼬리표지만 파랑 · 노랑만 쓰고 머리에만 둔다 — 주장 라벨(인디고 · 보라)과 색이 겹치지 않는다.
- 상태 꼬리표(`data-status`)는 쓰지 않는다(상태가 아니다).

## 5. 차트(`src/charts.js`)

```html
<figure class="chart span-8" data-chart="chart-data 키" data-kind="종류" data-w="760" data-h="320">
  <figcaption class="chart-head">
    <p class="chart-title">무엇을 잰 그림인지 한 줄(단위)</p>   <!-- type-heading 18 = 묶음 제목과 같은 단계 -->
    <p class="chart-sub">축 · 점이 무엇인지(필요할 때만)</p>
  </figcaption>
  <p class="footnote">축 뜻 · 뺀 점 · 정의 · 범례처럼 읽어야 하는 단서(있을 때만, 그림 뒤 · 출처 앞)</p>
  <p class="chart-src">자료 · n · 확인일 · 파일 경로 <span class="tag" data-hue="indigo">기술</span></p>   <!-- 순수 출처만, 캡션 12 · text-3 -->
</figure>
```

- svg는 charts.js가 `.chart-head` 뒤에 넣는다. **크기는 장 CSS 픽셀 그대로**(viewBox = `data-w` × `data-h`) — `data-w`는 그 칸의 폭([layout.md](layout.md)의 span 표), `data-h`는 남는 본문 높이 안에서 고른다. 줄여 맞추지 않으니 글자는 늘 12 · 13px이다.
- 값 · 이름표는 모두 `chart-data.json`에서 온다. 장에서 숫자를 다시 적지 않는다. 데이터 파일은 손으로 고치지 않는다(분석 산출물이다) — 이름표 · 문구 · 표시 속성(`dash` · 주석 자리)을 바꿀 때는 `../analysis/build_chart_data.py`를 고쳐 다시 만들고(`python3 -I analysis/build_chart_data.py`), 값이 그대로인지 전후를 대조한다.
- **계열 색은 대상마다 고정**([color.md](color.md) 「차트 계열 색」 표): 기준 · AGI · 사무직 = 파랑, 빠름 · 모든 직업 자동화 · 전문직 = 갈색, 신중 · Metaculus · KDI · 판매직 · 맥락 = 중립. chart-data의 `색` = `main` · `alt` · `ctx`(빌드가 표와 대조). 손 SVG도 같은 클래스(`s-main` · `s-alt` · `s-ctx`)로.
- **모양으로도 가른다**(CN-122 — 파랑 ↔ 갈색은 흑백에서 같은 명도): 갈색(`s-alt`) 계열 점은 네모(`rect.dot.dot--sq` — charts.js가 그린다, 손 SVG도 같은 클래스), 파랑 · 중립은 원. 선 차트(`yearline` · `capfan`)의 맥락 계열은 파선(chart-data 계열 `"dash": true` → `.line.dash`), 26장 KDI 교차확인은 점선(`"dash": "dot"` → `.line.dash--dot`). 파랑 · 갈색 선은 실선.
- **모션 없음**: 차트는 그린 그대로 보인다(축 → 값 → 이름표 차례 모션은 2026. 10. 21. 없앴다). 옛 표시 `data-step` · `data-build`는 지운다(빌드가 남은 것을 경고한다).
- **제목 ↔ 부제 8**(제목 + 설명 문단, 3회차 SL3-09). 차트 제목은 지금 `p.chart-title`이다 — 문서 개요에 넣으려면 `h3.chart-title`(묶음 안이면 `h4`)로 써도 같은 모양이다(3회차 T3-17, 기록만 — 이번에는 바꾸지 않았다).
- **범주 이름은 열 시작선**: hbar · starts는 막대 · 줄 이름을 x 0에 왼쪽 맞춤하고 막대 · 점을 이름 칸(`data-label-w`, starts는 168) 뒤에서 시작한다(3회차 SL3-03). 이름 칸은 가장 긴 이름보다 조금 넓게만 — 넓으면 이름과 막대 사이가 벌어진다.
- **축 이름은 text-2**(`.alab.axis-name` — 단위 · 기준이 든 읽는 글, 3회차 C3-04), 눈금 숫자 · 연도는 text-3.
- **낭독 글**: svg `<desc>`는 해요체 문장. charts.js가 덧붙이는 값 목록도 「… 막대 값은 A 188일, B 105일이에요.」처럼 문장으로 끝맺는다(3회차 W-16). 손 SVG의 `aria-label` · `<desc>`도 「…예요/이에요.」 한 꼴로.
- **기준선**(직급 문턱 · 기준 시점 `.gate`)은 둥근 점(지름 2, 4마다) — 맥락 계열 파선(8 · 4)과 모양으로 갈린다(3회차 C3-08).
- 차트 svg 안 숫자는 같은 폭(견줘 읽는 숫자), 도식(`.diagram`) 글자는 비례 폭.
- 막대는 직각(CSS가 `rx: radius-0`, svg 속성 `rx`는 무시된다). 한 막대의 조각은 `rect.bar.s-ctx.seg`.
- 범위 밖 · 상한 표시는 글자 기호(▲)가 아니라 차트 안 표시와 같은 삼각형 모양으로 그린다. 범위는 데이터 글에서부터 물결표(「β 0.00~0.09」 · 「시나리오별 2028~2032년」, WR-84) — charts.js의 붙임표 → 물결표 바꿈은 안전장치로만 남겼다.
- 주석 지시선(`주석[].to`)은 선분 가운데가 아니라 **실제 데이터 점**을 가리키고, 점 6 앞에서 멈춘다(10장 「19년 앞당김」 → 2024년 설문 2042년 점).

| `data-kind` | 데이터(chart-data 키) | 장 | 장에서 줄 수 있는 것 |
| --- | --- | --- | --- |
| `logline` | `metr_horizon` | 7 | `data-w` · `data-h` |
| `yearline` | `agi_forecast_shift` · `espai_two_clocks` · `kr_occupation_index` · `proj_kr_jobs` | 10 · 11 · 17 · 26 | `data-key-w`(오른쪽 계열 이름 칸, 기본 160) |
| `scatter` | `occ_scatter` | 13 | — |
| `hbar` | `occ_quintile`(bars) 또는 숫자 묶음 + `data-path` | 2 · 8 · 14 | `data-path="배가주기_일"` · `data-labels='{"키":"이름"}'` · `data-unit="일"` · `data-digits="0"` · `data-main="키"`(파랑, 나머지 중립) · `data-signed` · `data-row-h` · `data-label-w`(기본 160). **줄 높이는 두 값만**: 기본 36(막대 12 + 사이 24), 줄을 넉넉히 둘 때 56(2 · 8 · 14장 — 2회차 SL-08). 손 SVG 막대(20 · 21장)는 장 파일이 줄 간격을 정한다(같은 두 값을 권한다) |
| `starts` | `proj_wave` | 27 | `data-row-h`(정수 줄 높이). 없으면 남는 높이를 행 수로 나눈 값을 **내림**(소수 줄 높이를 쓰지 않는다 — 2회차 SL-08). 「2036년까지 5% 미도달」은 주석 단계(라벨 13 · text-2) |
| `capfan` | `proj_capability` | 24 | — (16시간 외삽 시작선은 직급 문턱 이름과 같은 오른쪽 열에 이름, 「한 달짜리 일」 교차 연도는 「2030.4년」처럼 「년」을 붙인다 — 「2030.4」는 날짜로 읽힌다) |
| 블록 `data-block="proj_gates" data-kind="gates"` | `proj_gates` | 25 | 시스템 표로 그린다. `data-main="기준"`(강조 열 → text-1, 나머지 열 값 text-2). 연도는 소수 둘째 자리 값을 버려 「그해」로 찍는다(첫째 자리 반올림 값을 버리면 한 해 늦게 찍혔다 — 2회차 D-10) |
| 블록 `data-block="poster" data-kind="poster"` | `poster` | 28 | 같은 식. `data-main="사무직"`(강조 행 이름 → text-1, 나머지 행 이름 text-2) |

- 차트 주석(`.note`)과 「미도달」 글자는 바탕색 외곽(`paint-order: stroke`)으로 격자선을 끊는다. 손 SVG에서 격자선 위에 글자를 둘 때는 `text.note` 또는 `class="… halo"`를 단다.
- 손으로 그린 **세로 막대**는 `rect.bar.bar--col`(0선 아래로 내려가면 `.neg`도). 손으로 그린 작은 SVG는 차트 클래스를 빌려 쓰고 `figure.chart` 안에 둔다(차트 모양 · 모션이 붙는다).

## 6. 아이콘

시스템 Lucide 스프라이트만(빌드가 문서 맨 앞에 넣는다): `<svg class="icon" aria-hidden="true"><use href="#icon-이름"/></svg>`. 있는 이름 60개는 [`../src/ds/DESIGN.md`](../src/ds/DESIGN.md) 2절. **뜻 없는 장식 아이콘은 넣지 않는다.** 핵심 한 문장에는 아이콘을 두지 않는다.

- 조작부(`present.js` `ICONS` — 빌드가 스프라이트와 대조): 전체 장 보기 `squares-grid`(격자 보기) · 처음으로 `house`(홈 = 처음 장) · 이전 `chevron-left` · 다음 `chevron-right` · 닫기 `xmark`. 뜻이 맞는 그림이 없는 동작(다시 재생 · 전체 화면)은 글자 버튼(IC-03). 넓은 막대에서는 모두 아이콘 + 글자. 좁은 모드(기둥 · 읽기 칸 · 좁은 막대 `deck-compact`)에서는 아이콘이 있는 버튼(전체 장 보기 · 처음으로 · 이전 · 다음 · 닫기)의 글자를 숨기고 28 정사각으로 둔다 — IC-25(아이콘만은 표준 동작 · 뒤로 · 닫기) 밖이라 README 「값」에 OP-14로 적었다. 이름(aria-label)은 보이는 글자로 시작한다(AC-64: 「처음으로(1장)」 · 「닫기(전체 장 보기)」). 「다시 재생」 버튼은 장 안 모션을 없애 2026. 10. 21. 뺐다.
- **글자 기호**: 아이콘 자리에 글자 기호(▲ · → 등)를 쓰지 않는다(차트 범례의 삼각형은 그린다). 글 안의 표기(변화 「2022→2025」, 키 이름 「→ · Space」)는 화면 글 규칙(WR)이 정한다.

## 7. 화면 글

- **해요체 하나**(WR-06 · 07): 「~습니다 · ~입니다 · ~한다」 → 「~어요 · ~예요/이에요」. 받침 있으면 「이에요」, 없으면 「예요」.
- 제목 · 목록 머리 · 묶음 제목(`.group__title`)은 끝 문장부호 없이(CN-101). 문장이면 끝에 마침표(WR-85). 느낌표 · 장식 이모지 없음(WR-86).
- 시스템 상태어(처리 · 완료 · 진행) 대신 무엇이 일어났는지(WR-20). 금지 표현은 시스템 `guideline/banned-phrases.json`(검사: 시스템 `check.mjs` 7번). 인용 속 고유한 말은 그 요소에 `data-check="ignore"`.
- 표기(WR-79 · 81 · 83 · 84 · 91): 날짜 `2026. 10. 16.`, 연 · 월은 `2026년 5월`, 변화 `2022년 6월→2026년 6월`, 숫자와 단위 붙여(`94%` · `105일` · `약 320만 개`). 숫자 칸 · 표 숫자는 `.num`/`.table__cell--numeric`.
- **범위(WR-84)**: 표 · 라벨 · 축 · 제목 · 꼬리표처럼 좁은 자리는 물결표 하나, 앞뒤 붙여(`2026~2030년`, `−0.10~0.065`). **문장 속 범위는 「~부터 ~까지」 · 「~에서 ~」**(권장 — 3회차에서 쪽 제목 · 문장의 물결표를 낱말로 바꿨다). 두 시점 사이 변화는 화살표(「2022→2025」), 범위는 물결표로 가른다.
- **가운뎃점(WR-91)**: 문장 속 열거는 붙인 가운뎃점이나 쉼표. 출처 · 메타 줄의 서로 다른 항목 사이 구분자만 띄운 「 · 」 한 꼴(README 「값」 OP-14, 3회차 T3-02).
- 차트 · 그림 제목 끝 단위 괄호는 앞에 한 칸 띄운다: 「… 2022~2026년 (사람이 하면 걸리는 분)」 · 「… 걸린 기간 (일)」(2회차 W-60 — 07 · 02 · 24장이 서로 달랐다). 괄호 안은 압축어 대신 잰 대상(「사람 기준 분」 → 「사람이 하면 걸리는 분」).
- 소수점 연도(「2027.6」)는 표 · 차트에서 「2027.6년」처럼 「년」을 붙이거나 열 머리에 「(소수점은 그해 안의 지점)」을 적는다 — 「2027.6」만 쓰면 날짜(2027. 6.)로 읽힌다(2회차 W-39).
- **바꾸지 않는 것**: 숫자 · 단위 · 출처 · 주장 라벨 · 고유명사 · 자료명. 사실 문장을 새로 쓰거나 빼지 않는다.
- **같은 낱말을 한 문장 · 한 장 안에서 되풀이하지 않는다**(사용자 2026. 10. 21. — 「AI 회사들이 다음 AI를 만드는 데 AI를 쓰는 동안 AI 발전 속도도…」처럼 겹치면 어색하다). 두 번째부터는 생략 · 지시어(「이」 · 「그」) · 문장 구조 바꾸기로 푼다. 덱 용어(용어집 · 꼬리표 낱말 · 고유명사)는 다른 말로 바꾸지 않는다.
- 생성 이미지 표시는 그림마다 · 장마다 적지 않고 34장 꼬리말에서 한 번에 밝힌다(이미지를 쓴 장 번호 + `assets/img/MANIFEST.md`, 사용자 2026. 10. 21.).
- 지어낸 비유 · 압축어 대신 잰 대상을 쓴다(아래 용어집).

### 용어집

| 쓸 말 | 쓰지 않을 말 | 이유 |
| --- | --- | --- |
| AI가 맡을 수 있는 업무 크기(METR 50% 시간지평) | AI가 혼자 끝내는 일의 길이 | 무엇을 재는지 드러낸다. 처음 한 번 풀어 쓴다 |
| 두 배가 되는 데 걸린 기간 | 배가 간격 · 1배가당 | 압축어를 피한다 |
| AGI 예상 연도 · 모든 직업 자동화 예상 연도 | AI 시계 · 일자리 시계 | 덱에서 지은 비유를 쓰지 않는다 |
| 대체 압력 | 대체 · 실업 | 모형 값(고위험 일자리 × 사람이 빠지는 비율 0.5)이고 실제 해고 수가 아니다 |
| 신입 채용 | 입구 | 같은 이유 |
| 로봇 학습 데이터 | 물리 세계 데이터 · 몸 | 같은 이유 |

## 8. 장 작업자 확인(자기 범위)

```sh
cd presentation
bun scripts/build.ts                         # 오류가 있으면 종료 코드 1(절 표시 · 계열 색 · 옛 이름 · 아이콘도 대조)
bun scripts/render.ts --only 5-9             # renders/index-05-09/slide-NN.png + issues(그 범위만)
bun scripts/check-numbers.ts                 # 본문 숫자 원본 대조(덱 전체)
node ../../product-design-system/design-system/scripts/check.mjs --scan="$PWD/src"   # 시스템 검사(하드코딩 · 없는 토큰 · 금지 표현)
```

- `issues`가 `[]`여도 전수 통과가 아니다(넘침 · 잘림 · 제목 줄 수 · 12px 미만 · JS 오류만). PNG를 열어 잘림 · 겹침 · 줄바꿈 · 정렬 · 라벨 · 여백 · 빈 곳을 눈으로 본다.
- 빌드 · 렌더는 여러 사람이 동시에 돌려도 된다: 빌드는 고유 임시 파일 → rename, 렌더 출력 폴더는 범위마다 다르다(`--out`으로 바꿀 수 있다).
- 커밋 · 푸시 · 배포는 하지 않는다.

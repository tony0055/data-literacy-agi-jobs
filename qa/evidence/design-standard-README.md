# 디자인 표준 — AI는 언제 내 일을 대신할까

```text
THESIS: 숫자를 차분하게 읽히게 한다. 따뜻한 스톤 바탕 위 흰 카드에 한 장 한 메시지, 강조는 채도를 낮춘 인디고 하나와 보조 세이지 하나.
OWN-WORLD: 동심 모서리의 이중 테두리 카드(4px 흰 링 + 1px 선 + 넓게 퍼지는 그림자), 알약 모양 장 라벨과 주장 태그, 어두운 직업군 안내판 한 장, 실제 날짜 간격의 로그 곡선.
STORY: AI가 맡는 업무 크기가 빨라졌고 전문가의 자동화 예상은 더 빨리 당겨졌지만 아직 고용 총량엔 없다 → 신호는 신입 채용 → 관계식으로 2036년까지.
FIRST VIEW: 왼쪽 80px 제목 세 줄과 알약 둘, 오른쪽 동심 모서리 사진(교차 페이드).
FORM: 헌법(designsystems.com Getting Started) 안에서 soft-skill 「Soft Structuralism」 · Pretendard 한 가족 · 34장
```

## 기준의 층

1. **헌법** — [designsystems.com Getting Started](https://www.designsystems.com/sections/getting-started/)(2026-10-16 사용자 지시로 최상위). 로컬 정리본은 공통 덱 스킬 `designing-decks-and-motion/references/constitution.md`([로컬 링크](../../../../../../../../.agents/skills/designing-decks-and-motion/references/constitution.md)). 부딪치면 헌법이 이긴다.
2. **공통 표준** — 공통 덱 스킬 `references/design-standard.md`(헌법을 1920 × 1080에 옮긴 출발점).
3. **이 덱의 옷** — soft-skill 「Soft Structuralism」(사용자 선택 2026-10-16): 둥근 이중 테두리 카드, 넓게 퍼지는 그림자, 알약 라벨. 값은 1·2층 안에서만 고른다.
4. **전환** — transitions.dev 스니펫, Anime.js 차트 빌드. 시간 · 이징은 토큰 세 개로 묶었다.

## 헌법 감사 (`scripts/constitution_audit.py`)

| | 글자 크기 | 굵기 | 이징 | 위반(간격 · 행간 · 색 · 모서리) |
| --- | --- | --- | --- | --- |
| 개정 전 (2026-10-16 오후) | 20가지 | 5가지 | 3 | 93 |
| 개정 후 | 9가지 | 3가지 | 3 | 0 |

```bash
python3 ~/.agents/skills/designing-decks-and-motion/scripts/constitution_audit.py src/tokens.css src/deck.css src/slides.css
```

## 사용자 지시 (이 표준이 반영한 것)

- 「컬러가 약간 원색에 가까워서 조금 촌스러운데, 조금 컬러 디자인을 요즘 메타에 맞게 고쳐서 해줘」 → 코발트 `#2448e8`·라임 `#d4f57a`를 OKLCH 채도 절반 이하의 인디고 `#4c5eb2`·세이지 `#cce3b1`로, 차가운 회청 중립을 아주 약하게 따뜻한 스톤 중립으로([color.md](color.md)).
- 「각 요소들 간의 여백도 좀 많이 챙겨줘. 제목 타이포도 크기가 큰것같고 … 꽉차보이고 답답해보임」 → 제목 64 → 48, 거터 40 → 48, 카드 안 40 → 48, 굵기 800 → 700([typography.md](typography.md), [layout.md](layout.md)).
- 「폰트도 맘에 안듦. pretendard 계열」 → Pretendard Variable 한 가족.
- 「내용이 너무 많아서 생기는 일이라면 좀 나눠서해도돼」 → 34장, 한 장에 차트 하나 또는 카드 두세 개.
- 문장 규칙: 본문은 '~습니다'와 명사형을 섞고, 제목 · 인용 · 차트 제목에 쉼표 · 콜론을 쓰지 않는다. 지어낸 비유와 압축어 대신 잰 대상을 쓴다.

## 헌법 · 공통 표준과 다르게 둔 것

| 값 | 공통 표준 | 이 덱 | 이유 |
| --- | --- | --- | --- |
| 거터 | 32 | 48 | 사용자 「답답」 지적. 8 단계 안 |
| 카드 안쪽 | 32 | 48 | 같은 이유 |
| 굵기 | 400 · 600 · 800 | 400 · 600 · 700 | 800은 48px 제목에서 무겁고 촘촘해 보였다. 세 단계 유지 |
| 제목 | 44/56 한 줄 | 48/64, 두 줄까지 | 두 줄 제목이 있는 장은 의미 단위로 `<br>`을 직접 넣었다 |
| 차트 글자 | — | 20px(본문 프리셋) | 저장소 데이터 덱 규칙(눈금 · 라벨 18px 이상)과 헌법 프리셋을 함께 지키는 값 |
| 그림자 | 3단계 | 카드 하나(`--sh-float`) + 링 | soft-skill 옷. 링 두께는 4px 반 단계 |
| `body.overview .slide` 여백 −1525 · −858 | — | 예외(`constitution-ok`) | 개요 화면 0.206 축소 보정값이라 간격 단계와 무관 |

## 확인

- 렌더: `bun scripts/render.ts index.html` → 34장 넘침 · 가림 · 작은 글자 · 차트 축소 글자 0건, 컨택트시트로 눈 확인.
- 숫자: `bun scripts/check-numbers.ts` → 167개 원본 대조.
- 확인 화면은 덱 자체의 전 장 렌더로 대신한다(모든 토큰 · 컴포넌트가 실제 장에 나온다).
- 이미지: Gemini 생성 8장(`assets/img/MANIFEST.md`, 워터마크는 SAM 2.1로 제거하고 장마다 'AI 생성 이미지(Gemini)' 표기), 인물 사진 3장(`assets/photos/CREDITS.md`, Wikimedia Commons CC).

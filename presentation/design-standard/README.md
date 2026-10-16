# 디자인 표준 — 내 일자리 도착 예정 시각

```text
THESIS: 숫자를 '도착 안내'처럼 읽게 한다. 은회색 바탕 위 둥근 흰 카드에 한 장 한 메시지, 포인트 색은 코발트와 라임 둘.
OWN-WORLD: 이중 테두리 카드(바깥 8px 흰 링 + 연한 그림자), 알약 모양 장 라벨·태그, 어두운 도착 안내판 한 장, 실제 날짜 간격의 로그 곡선.
STORY: AI 시계가 빨라졌고 일자리 시계는 더 빨리 당겨졌지만 아직 총량엔 없다 → 신호는 입구(신입) → 관계식으로 2036년까지.
FIRST VIEW: 왼쪽 140px급 제목 3줄과 알약 셋, 오른쪽 이중 테두리 사진(교차 페이드).
FORM: soft-skill 「Soft Structuralism」 · 청사진은 design-taste-frontend v2 · Pretendard 한 가족 · 34장
```

- 디자인 시스템: 저장소 로컬 스킬 `high-end-visual-design`(soft-skill)의 「Soft Structuralism」이 옷, `design-taste-frontend`(v2)가 장 구성 청사진이다. v2 무장식 안(검정·라임·각진 모서리·Gambarino)은 사용자가 물렸다(2026-10-16). 근거와 예외는 `docs/data-to-slides-workflow.md` §2–3.
- 토큰(`src/tokens.css`): 바탕 `#f1f3f6`, 카드 흰색, 잉크 `#0b0d12`, 보조 글자 `#5b6170`, 코발트 `#2448e8`(흰 바탕 6.63:1), 라임 `#d4f57a`(채움 전용, 잉크 글자 15.86:1). 모서리 36/28/알약, 그림자 `--sh-float`, 이중 테두리 `--bezel`.
- 글꼴: Pretendard Variable 하나(사용자 지시 2026-10-16). 제목 800·64px·자간 −0.035em, 본문 22px, 라벨 16px(장 라벨·출처·표 머리만).
- 밀도: 한 장에 차트 하나 또는 카드 두세 개. 넘치면 장을 나눈다(사용자 지시 2026-10-16). 본문 칸이 모자라면 차트가 비율째 줄어들고, `fit.js`가 줄어든 뒤의 글자 크기(15px 미만이면 실패)까지 잰다. 칸에 맞춘 세로 길이는 `data-h`로 준다.
- 이 덱에서 더한 것(`src/slides.css`): 표지 2단(`.cover`), 계단 문장(`.stair`), 결론 타일(`.tiles`), 사진 장(`.bleed`, 안쪽 24px 둥근 사진), 인물 카드(`.who`), 인과 사슬(`.chain`), 계산 영수증(`.slip`), 도착 안내판(`.poster`), 반증 띠(`.bands`), 타임라인(`.phase`).
- 전환: transitions.dev 스니펫(페이지 좌우 전환·텍스트 차례 등장·숫자 팝인)을 원본 주석째 쓰고, 차트 빌드는 Anime.js에 같은 모션 토큰을 쓴다. 개요(Esc)를 열고 닫을 때는 전환을 끈다.
- taste lint: kicker 알약(`eyebrow`)과 카드 그림자(`shadow`) FAIL은 soft-skill 방향이라 의도한 것이다. 그 밖의 FAIL은 고친다.
- 문장 규칙(사용자 지시, 2026-10-16): 본문은 '~습니다'와 명사형 끝맺음을 섞는다. 제목·소제목·인용·차트 제목에는 쉼표·콜론을 쓰지 않고, 연결 어미나 줄바꿈(`<br>`)으로 나눈다. 렌더 검사(`fit.js`)는 의도한 `<br>` 수만큼만 제목 줄 수를 허용한다.
- 이미지: Gemini 생성 8장(`assets/img/MANIFEST.md`, 워터마크는 SAM 2.1로 제거하고 장마다 'AI 생성 이미지(Gemini)' 표기), 인물 사진 3장(`assets/photos/CREDITS.md`, Wikimedia Commons CC).

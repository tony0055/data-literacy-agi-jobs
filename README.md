# 내 일자리, 도착 예정 시각은 언제일까 — AI가 AI를 만들기 시작한 뒤의 2036년

데이터리터러시의이해 중간고사(과제 제출 대체, 공지 2026-10-16): 「데이터분석을 하고 싶은 주제를 정하고, 주제에 대한 설명과 데이터분석 계획을 쓴 HTML 슬라이드덱 URL을 제출」.

| 항목 | 내용 |
| --- | --- |
| 발표 덱 | `presentation/index.html` · 34장 · 1280 × 720 캔버스(1920 화면에서 1.5배) · 제품 디자인 시스템(tony0055/product-design-system) C 청량 · 강조 파랑 · 라이트 고정, 카드 없음 · 해요체 · 장면 그림은 Gemini 생성 이미지(워터마크 유지, 그림마다 표시하지 않고 34장 꼬리말에서 한 번에 밝힘 — 쓴 장 번호 + `assets/img/MANIFEST.md`) · **https://tony0055.github.io/data-literacy-agi-jobs/** (GitHub Pages, 2026-10-16 배포본은 옛 디자인) |
| 덱 디자인 표준 | [presentation/design-standard/](presentation/design-standard/) · 확인 화면 [presentation/design-standard.html](presentation/design-standard.html) |
| 종합 보고서 | [report.md](report.md) — 관계식·예비 분석·머신러닝·2036 추정·한계·분석 계획 |
| 분석 명세 | [spec.md](spec.md) |
| 독립 검증 | [verification-independent.md](verification-independent.md) — 다른 계열 모델이 원자료에서 핵심 수치를 다시 계산(전부 일치) |
| 자료조사 | [research/](research/) — `agi-timelines.md` · `jobs-global.md` · `jobs-korea.md` · `physical-ai.md` · `biocomputing.md` · `data-sources.md` |

## 질문

AI가 AI 개발에 쓰이기 시작한 뒤 ① AI 능력과 AGI 예상은 얼마나 빨라졌나 ② 일자리 대체 시점 추정도 같이 당겨졌나 ③ 실제 고용에는 어느 직업·직급·연령부터 신호가 있나 ④ 그 관계가 이어지면 2036년까지 어떤 흐름이 예상되나.

## 실행

```sh
python3 -I analysis/timeline_analysis.py
python3 -I analysis/occupation_analysis.py
python3 -I analysis/relations.py
python3 -I analysis/projection_2036.py
<numpy·scikit-learn이 있는 python> analysis/ml_models.py
python3 -I analysis/build_chart_data.py
cd presentation
bun scripts/build.ts                     # src/shell.html + src/slides/NN.html(+NN.css) + ../chart-data.json → index.html
bun scripts/render.ts                    # renders/index/slide-NN.png(1920 × 1080) + 넘침·잘림·12px 미만 검사(issues)
bun scripts/render.ts --only 5-9         # 범위만 → renders/index-05-09/ (--out으로 폴더 지정)
bun scripts/render.ts design-standard.html   # 확인 화면 → renders/design-standard.png
bun scripts/render.ts --og               # 공유 미리보기 assets/og.jpg(1200 × 630)를 지금 1장으로 다시 찍기
bun scripts/check-numbers.ts             # 본문 숫자를 원본 파일과 대조
bun scripts/probe-nav.ts                 # 발표 이동(키·해시·개요) 검사
bash scripts/check-all.sh [--only 5-9]   # 위 검사 + 토큰·시스템 검사 한 번에
```

원자료(`research/_data/raw/`, 약 480MB)와 생성 이미지 원본 PNG(`presentation/assets/img/*.png`)는 `.gitignore`로 뺐다. 원자료를 다시 받는 경로는 `research/data-sources.md`, 이미지 프롬프트와 생성 기록은 `presentation/assets/img/MANIFEST.md`. 덱 렌더에는 Bun 1.4 이상과 Chrome이 필요하다.

차트 이름표 · 문구 · 표시 속성(파선 · 주석 자리)은 `analysis/build_chart_data.py`가 정한다. `chart-data.json`을 손으로 고치지 않고 이 스크립트를 고쳐 다시 만든다(값은 그대로). 차트 `설명`(화면 읽기 프로그램이 읽는 `<desc>`)도 화면 글이라 해요체다. 25장 표의 연도는 `projection_2036.py`가 함께 내보내는 소수 둘째 자리 값(`능력문턱_소수2` · `대체본격화_소수2`, 계산은 같다)을 버려 「그해」로 찍는다.

## 덱 구조

| 경로 | 무엇 |
| --- | --- |
| `presentation/src/ds/` | 제품 디자인 시스템 빌드 결과(tokens · layout · components CSS, Lucide 스프라이트, DESIGN.md)와 Pretendard Variable 1.3.9. 고치지 않는다 |
| `presentation/src/deck.css` · `controls.css` | 덱 뼈대 · 패턴 · 차트 모양 / 발표 무대 · 조작부 · 개요 · 인쇄 |
| `presentation/src/slides/NN.html` · `NN.css` | 장 하나씩(34개). 장 작업은 이 파일만 고친다 |
| `presentation/assets/img/` | 장면 그림 — Gemini 생성 JPEG 20장(덱은 19장을 쓴다, 오른쪽 아래 워터마크를 지우지 않고 자를 때도 남긴다. 덱용 사본은 그려지는 크기의 2배인 긴 변 1280px · sRGB 프로필, 합계 약 2.8MB) + `MANIFEST.md`(프롬프트 · 생성일 · 쓰는 장 · 크기). 원본 PNG는 커밋하지 않는다 |
| `presentation/assets/og.jpg` | 공유 미리보기(1장 히어로, `render.ts --og`) |
| `presentation/src/charts.js` · `present.js` · `fit.js` | 차트 · 발표 조작 · 렌더 검사(장 안 모션 파일 `motion.js`는 2026. 10. 21. 지웠다 — 덱 모션은 장 사이 이동뿐) |
| `presentation/index.html` · `src/slides.bundle.css` | 빌드 결과(생성 파일) |

## 디자인 정리(2026-10-20 · 개선 2026-10-21)

옛 시각 디자인(soft-skill 「Soft Structuralism」, 스톤 바탕 · 인디고/세이지, 이중 테두리 카드, 부분 글꼴, 워터마크를 지운 장식 사진, 147조건 시각 QA)을 걷어 내고 제품 디자인 시스템 하나로 바꿨다. 지금 디자인: C 청량 · 강조 파랑 · 라이트 고정, 카드 형태 없음(묶음은 제목 + 가는 선), 1장은 큰 그림 히어로, 장면 그림은 새로 만든 Gemini 생성 이미지(워터마크 유지). 기준은 [presentation/design-standard/](presentation/design-standard/).

| 처리 | 무엇 |
| --- | --- |
| 지움 | `qa/` 전체(옛 시각 QA 계획·기록·증거 이미지), `presentation/.taste-skill/`, 옛 `src/tokens.css` · `slides.css`, 부분 글꼴 `DeckSansSubset*` · `scripts/font-subset.py`, 옛 장식용 AI 생성 사진(워터마크를 지운 `cover` · `callcenter` 등 7장, 옛 `MANIFEST.md`) · `scripts/remove_watermark.py`, 옛 시각 QA 도구 `scripts/visual-qa.ts` · `vqa/` · `qa_pixels.py` · `ocr_vision.swift` · `snap-motion.ts` · `qa-all.sh`, Anime.js(`assets/vendor/`) |
| 새로 씀 | `src/deck.css` · `controls.css` · `charts.js` · `present.js` · `motion.js` · `fit.js` · `shell.html`, `src/slides/01~34`, `scripts/build.ts` · `render.ts` · `probe-nav.ts` · `check-all.sh`, `design-standard/` 문서 여섯과 확인 화면, `assets/og.jpg`(새 1장 히어로), 루트 `index.html` 테마 색(옛 파비콘은 뺐다) |
| 새로 만듦(2026-10-21) | `assets/img/*.jpg` Gemini 생성 이미지 20장(워터마크 유지 — 사용자 결정) + `MANIFEST.md`. 옛 `assets/img/*`와 이름이 다른 새 파일이다 |
| 남김 | `analysis/` · `research/` · `report.md` · `spec.md` · `verification-independent.md` · `chart-data.json`, 인물 사진 · 라이브스트림 썸네일(`assets/photos/`, `CREDITS.md`), Pretendard 원본(`src/ds/fonts/`로 옮김), `scripts/check-numbers.ts` · `contact-sheet.py`(경로만 고침) |

## 검증

| 검사 | 결과(2026-10-21, 최종 단계 — 3회차 검수 반영) |
| --- | --- |
| 빌드 | 34장, 오류 0 · 경고 0 |
| 렌더 | 34장 1920 × 1080(`renders/final`, 컨택트시트 `contact-*.jpg`), issues 0(넘침 · 잘림 · 본문 아래로 나간 요소 · 제목 줄 수 · 꼬리말 줄 수 · 12px 미만 · JS 오류). PNG를 직접 봤다 |
| 발표 무대 | 1512×900 · 1280×800 · 1280×720 · 1024×768 · 900×700 · 640×360(좁은 막대) · 844×390(기둥) · 390×844 · 360×780(읽기 칸) 모두 해시 #12 진입 · 키 이동 34장 · 마지막 장 · 개요 · 조작부와 장 겹침 없음 · 버튼끼리 겹침 없음 · 장 안 모션 없음 · 링크 누름 영역 24 이상 · 링크끼리 겹침 0 · 조작부 쉬는 모양 투명도 없음 · 글자 대비 6.53:1 이상 · JS 오류 0(`probe-nav.ts`) |
| 인쇄 · 공유 미리보기 | PDF 34쪽(`render.ts --pdf`, 확인 뒤 지움) · `assets/og.jpg` 최종 1장으로 다시 찍음 |
| 헌법 감사 · 토큰 | 헌법 감사 글자 크기 0 · 굵기 0 · 이징 2 · 위반 0, 토큰 밖 값 0(`token-check`) |
| 제품 디자인 시스템 검사 | `check.mjs --scan` — 실패 0 · 경고 0. [design-standard/README.md](presentation/design-standard/README.md#검사와-예외) |
| 본문 숫자 대조 | 본문 · 낭독 글 숫자 전부 원본 파일에서 확인(`check-numbers.ts`, 미확인 0, HTML 주석 제외) |
| 차트 데이터 | `analysis/build_chart_data.py`로 다시 만들어 값은 그대로(이번 단계에 바뀐 것은 이름표 · 설명 문구 · 주석뿐: 28장 줄 이름 「개발자」, 27장 축 이름 「대체 압력이 일자리 5%에 이르는 해」, 7장 설명 「METR가」, 14 · 17 · 27장의 제목을 되풀이하던 주석 삭제) |
| 핵심 수치 독립 재계산 | METR 배가 주기 · 직업 상관 · 꼬리 집계 · KOSIS 변화율 · 설문 관계식 전부 일치(2026-10-16 기록, 이번 디자인 작업에서는 다시 돌리지 않음 — 분석 값은 그대로) |
| 내부 정합성 | KOSIS 9개 대분류 합 = 전체(반올림 오차 이내), METR 파일 값 재현(2026-10-16 기록) |
| 2036 모형 반올림 | 대리·주임 능력 문턱을 0.1년으로 반올림해 입력한다(값은 그대로 두고 report.md 9절 · 23장 각주에 밝힘 — 사용자 결정) |

## 한계

결론 등급은 '기술'(관계)과 '추정'(2036 시나리오)까지다. 관계식의 점이 2~3개이고, 일부 값은 2차 인용이며, 2036 모형의 φ·실현 비율·직급 업무 단위는 가정이다. 자세한 것은 report.md 10절.

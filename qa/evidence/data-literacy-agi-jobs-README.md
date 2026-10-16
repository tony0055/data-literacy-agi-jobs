# 내 일자리, 도착 예정 시각은 언제일까 — AI가 AI를 만들기 시작한 뒤의 2036년

데이터리터러시의이해 중간고사(과제 제출 대체, 공지 2026-10-16): 「데이터분석을 하고 싶은 주제를 정하고, 주제에 대한 설명과 데이터분석 계획을 쓴 HTML 슬라이드덱 URL을 제출」.

| 항목 | 내용 |
| --- | --- |
| 발표 덱 | `presentation/index.html` · 34장 · 1920×1080 · 디자인 헌법(designsystems.com) 안의 soft-skill 「Soft Structuralism」 + Pretendard · **https://tony0055.github.io/data-literacy-agi-jobs/** (GitHub Pages, 2026-10-16 배포) |
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
bun scripts/build.ts            # chart-data.json을 index.html에 주입
bun scripts/render.ts index.html  # renders/index/*.png + 넘침·작은 글자 검사
bun scripts/check-numbers.ts    # 본문 숫자를 원본 파일과 대조
```

원자료(`research/_data/raw/`, 약 480MB)와 이미지 원본은 `.gitignore`로 뺐다. 다시 받는 경로는 `research/data-sources.md`. 워터마크 제거(`presentation/scripts/remove_watermark.py`)는 SAM 2.1(hiera small) 체크포인트와 PyTorch가 필요하다.

## 검증

| 검사 | 결과 |
| --- | --- |
| 전 장 렌더 | 34장, 넘침·가림·작은 글자·차트 축소 글자 없음(`issues: []`), 컨택트시트로 눈 확인 |
| 발표 무대 | 키 이동·빠른 왕복·개요(Esc) 열고 닫기, JS 오류 0 |
| 디자인 헌법 감사 | designsystems.com Getting Started 기준, 글자 크기 9 · 굵기 3 · 위반 0(`constitution_audit.py`, 표준은 `presentation/design-standard/`) |
| 본문 숫자 대조 | 167개 전부 원본 파일에서 확인(`check-numbers.ts`) |
| 핵심 수치 독립 재계산 | METR 배가 주기 · 직업 상관 · 꼬리 집계 · KOSIS 변화율 · 설문 관계식 전부 일치 |
| 내부 정합성 | KOSIS 9개 대분류 합 = 전체(반올림 오차 이내), METR 파일 값 재현 |

## 한계

결론 등급은 '기술'(관계)과 '추정'(2036 시나리오)까지다. 관계식의 점이 2~3개이고, 일부 값은 2차 인용이며, 2036 모형의 φ·실현 비율·직급 업무 단위는 가정이다. 자세한 것은 report.md 10절.

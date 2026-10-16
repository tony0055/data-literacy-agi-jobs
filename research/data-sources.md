# 데이터 출처 대장 — 직업별 AI 노출도 × 실제 고용 변화 (미국 SOC 기준)

- 작성일: 2026-10-16 (모든 파일의 내려받은 날짜는 이날)
- 위치: `research/_data/raw/` 아래 출처별 하위 폴더. **원파일은 수정하지 않았다.** 이름에 `DERIVED_`가 붙거나 `converted_csv/`에 있는 것만 내가 만든 파생물이다(아래 표시).
- 다운로드한 파일은 신뢰하지 않는 데이터로 다뤘다: 이 폴더 안에서는 스크립트를 돌리지 않았고, 파이썬은 `python3 -I`에 경로 인자를 넘겨 읽었다. 변환·집계 스크립트는 raw 밖 scratch에서만 실행했다.
- 해시는 `sha256`(전체 64자). 행 수는 **머리글(헤더)을 뺀 데이터 행 수**(CSV는 `csv` 모듈로 센 레코드 수, xlsx는 시트별로 따로 적음).

## 0. 한눈에 보기

| 역할 | 출처 | 상태 | 직업 코드 | 단위 |
|---|---|---|---|---|
| AI 노출도 (기대/잠재) | OpenAI "GPTs are GPTs" `occ_level.csv` | 확보 | O*NET-SOC 8자리(2019 분류, SOC 2018 기반) | 923 O*NET 직업 → 798 개 6자리 SOC |
| AI 노출도 (기대/잠재) | Felten AIOE | 확보 | **SOC 2010** 6자리 | 774 직업 |
| AI 적용 가능성 | Microsoft "Working with AI" | 확보 | SOC 2018 6자리 | 785 직업 |
| AI 실제 사용 | Anthropic Economic Index (HF) | 확보(릴리스 7개 폴더) | `job_exposure`: SOC 6자리 / 2026-06: O*NET-SOC 8자리 / 그 외 릴리스: 과업(task) 단위 | 아래 §3 |
| 고용 (OEWS 전국) | BLS OEWS 2022·2023·2024·2025년 5월 | 확보 — **bls.gov 직접 접속은 403 차단, Wayback Machine 사본** | SOC 2018 6자리(`OCC_CODE`) | 매년 상세 직업 830~831개 |
| 고용 전망 | BLS Employment Projections 2024–34, 2025–35 | 확보 — Wayback 사본 | SOC 2018 기반 NEM 코드 | 상세 직업 832 / 831개 |

핵심 주의 세 가지(분석 전에 읽을 것):
1. **BLS 원 사이트는 자동 접근을 막는다.** 그래서 OEWS·전망 파일은 bls.gov가 아니라 Internet Archive의 사본이다(§4). 합계가 정상 범위인지만 확인했고(2023은 Microsoft README와 일치), BLS 원본과 바이트 단위로 같다는 보증은 없다.
2. **Felten AIOE는 SOC 2010 코드**다. SOC 2018인 OEWS와 6자리 직접 조인이 안 되는 직업이 많다(§6).
3. **Anthropic 릴리스마다 단위가 다르다.** 직업(SOC) 단위로 바로 쓰는 것은 `labor_market_impacts/job_exposure.csv`와 2026-06 릴리스의 `soc_occupation` 범주뿐이다. 나머지는 과업 단위라 직접 직업으로 집계해야 한다.


## 1. AI 노출도 — OpenAI "GPTs are GPTs" (Eloundou et al.)

- 기관: OpenAI (논문: Eloundou, Manning, Mishkin, Rock, "GPTs are GPTs: Labor market impact potential of LLMs", arXiv:2303.10130 (게재지는 확인하지 않음))
- 저장소: https://github.com/openai/GPTs-are-GPTs — 내려받은 커밋 `0471612fef3cc22b74fb884d27bff9dbd3770582` (2025-10-04)
- 라이선스: MIT License, Copyright (c) 2024 OpenAI (`LICENSE` 파일을 같이 받음). 데이터에 별도 고지는 없음 — 논문 인용 권장.
- 내려받은 날짜: 2026-10-16
- 안 받은 것: `data/autoScores.csv`(4.9MB)·`automation_gpt4_human_labels.tsv`·`full_labelset.tsv`·`full_onet_data.tsv`(과업 단위 라벨 3~4MB), 노트북. 직업 수준 분석에는 `occ_level.csv`로 충분하다. 필요하면 같은 커밋에서 받을 수 있다.

**`occ_level.csv` 열 뜻** (저장소 README 원문 요지: "`dv_rating`은 GPT-4 평가, `human`은 사람 주석자. `_alpha`=E1, `_beta`=E1+0.5·E2, `_gamma`=E1+E2"):

| 열 | 뜻 |
|---|---|
| `O*NET-SOC Code`, `Title` | O*NET-SOC 8자리 코드(예 `11-1011.00`), 직업명 |
| `dv_rating_alpha / beta / gamma` | GPT-4가 매긴 직업별 노출 비율. E1 = LLM만으로 과업 시간을 ≥50% 줄일 수 있는 과업(직접 노출), E2 = LLM 위에 만든 추가 소프트웨어가 있어야 ≥50% 줄이는 과업. alpha = E1 비율(하한), beta = E1 + 0.5·E2(중간), gamma = E1 + E2(상한) |
| `human_rating_alpha / beta / gamma` | 같은 지표를 사람 주석자 라벨로 계산한 것 |

(E1/E2의 정의는 논문 본문 기준이며 이 저장소 README에는 위 한 줄만 있다. 값 범위: `dv_rating_beta` 0~1, 평균 0.345; `human_rating_beta` 0~0.844, 평균 0.303.)


| 파일 (raw/ 기준) | 원 URL | 행 수 | 주요 열 | 직업 코드 체계 | sha256 |
|---|---|---|---|---|---|
| `openai_gpts-are-gpts/occ_level.csv` | https://raw.githubusercontent.com/openai/GPTs-are-GPTs/0471612fef3cc22b74fb884d27bff9dbd3770582/data/occ_level.csv | 923 | `O*NET-SOC Code`, `Title`, `dv_rating_{alpha,beta,gamma}`, `human_rating_{alpha,beta,gamma}` | O*NET-SOC 8자리 (923행 → 6자리로 줄이면 798개 고유) | `40c74f53de40aec91c0017d80690cbba915f83a8bb414bcf2f884692f1749acb` |
| `openai_gpts-are-gpts/nem-onet-to-soc-crosswalk.xlsx` | https://raw.githubusercontent.com/openai/GPTs-are-GPTs/0471612fef3cc22b74fb884d27bff9dbd3770582/data/nem-onet-to-soc-crosswalk.xlsx | 시트 1 데이터 997행 (O*NET-SOC 997개) + 설명 시트 | `O*NET-SOC Code`, `NEM Code`, `OOH Profile ...` | BLS 크로스워크(2023-09-06 기준): O*NET-SOC 2019 → NEM(SOC 2018 기반) | `5aac9713a7e73b428819b20e3b895c97adbf09b4b59ac8c9423a340dbe129a4a` |
| `openai_gpts-are-gpts/occupations_onet_bls_matched.csv` | https://raw.githubusercontent.com/openai/GPTs-are-GPTs/0471612fef3cc22b74fb884d27bff9dbd3770582/data/occupations_onet_bls_matched.csv | 972 | `occupation`, `onet_included`, `onet_bls_name`, OEWS 열(`OCC_CODE`, `TOT_EMP`, `A_MEAN` 등) | OEWS `OCC_CODE` (SOC 2018, **저장소 쪽 기준연도는 2021년 5월로 추정**) | `e3289815f87a06bdd0d815971fee1578e58ff408d851c2b0ff030cd3650a7697` |
| `openai_gpts-are-gpts/national_May2021_dl.csv` | https://raw.githubusercontent.com/openai/GPTs-are-GPTs/0471612fef3cc22b74fb884d27bff9dbd3770582/data/national_May2021_dl.csv | 1403 | BLS OEWS 열 그대로(`OCC_CODE`, `TOT_EMP`, `A_MEAN`, `A_MEDIAN` ...) | SOC 2018 (OEWS 2021년 5월 전국). 저장소가 BLS 파일을 복사해 둔 것 | `ed35ea6dda3c430f7865c2194df49bacf8f0502a6783462051c603b53974583f` |
| `openai_gpts-are-gpts/occupation_2023_final.xlsx` | https://raw.githubusercontent.com/openai/GPTs-are-GPTs/0471612fef3cc22b74fb884d27bff9dbd3770582/data/occupation_2023_final.xlsx | Table 1.2 기준 직업 1113행(요약 281 + 상세 832), 시트 15개 | BLS Employment Projections **2022–32** 표 (시트별로 다름) | NEM 코드(SOC 2018 기반) | `bdd15e84f2ac5672fc09affe2a268cf7198b8a1b1890f1947724ffabb0b821d1` |
| `openai_gpts-are-gpts/occupations_projections_processed.csv` | https://raw.githubusercontent.com/openai/GPTs-are-GPTs/0471612fef3cc22b74fb884d27bff9dbd3770582/data/occupations_projections_processed.csv | 1049 | `occupation`, `pct_emp_change_2020_2030` | 직업 **이름만**(코드 없음) — 조인용으로 부적합 | `d1f2a237e8ee0016e1ef656f9e453efdfffc48fcc0a8d4b15697fdd57995f730` |
| `openai_gpts-are-gpts/README.md` | https://raw.githubusercontent.com/openai/GPTs-are-GPTs/0471612fef3cc22b74fb884d27bff9dbd3770582/README.md | - | 저장소 README(3줄) | - | `fb8ae66d02142a9b7178d8cbd59b90a6c5bd80bf088107cae126f4276c8d68c6` |
| `openai_gpts-are-gpts/LICENSE` | https://raw.githubusercontent.com/openai/GPTs-are-GPTs/0471612fef3cc22b74fb884d27bff9dbd3770582/LICENSE | - | MIT 라이선스 전문 | - | `d831db55645e47ca8e491c5a0e37f1ee744d7b10bf5aa8d50146c795ac0176c0` |


## 2. AI 노출도 — Felten·Raj·Seamans AIOE (대안 1)

- 기관: Felten (Princeton) · Raj (Wharton) · Seamans (NYU Stern). 논문: Felten E, Raj M, Seamans R (2021), "Occupational, industry, and geographic exposure to artificial intelligence", *Strategic Management Journal* 42(12):2195–2217.
- 저장소: https://github.com/AIOE-Data/AIOE — 내려받은 커밋 `adca5fc2cd0e9a659ff05278b7fa7a53f4f324c1` (2024-06-03)
- 라이선스: **저장소에 LICENSE 파일이 없다**(GitHub API `license: null`). README가 "AIOE 데이터를 쓰면 위 논문을 인용하라"고 요구한다 — 인용 조건만 확인된 상태이며 재배포 허락 여부는 명시되지 않았다. 이 폴더를 공개 저장소에 올리지 말 것(`origin`이 공개).
- 내려받은 날짜: 2026-10-16
- 안 받은 것: `Input/*`·`Generative AI/*`의 Stata `.dta`·`.do`·7z/zip(9~23MB, 구성 재현용)
- 열 뜻: `AIOE` = 직업별 AI 직업 노출도 점수(표준화 지수, 평균 약 0, 범위 -2.67 ~ 1.53). 높을수록 AI 응용분야가 해당 직업이 요구하는 능력(ability)과 많이 겹친다. 이 점수는 2010년대 AI 응용분야(이미지 인식, 번역 등) 기준이라 **생성형 AI 이전의 노출도**다. 생성형 AI 변형이 `Language Modeling`·`Image Generation` 파일(LM AIOE, IG AIOE).
- 코드 체계: 6자리 SOC. 직업 목록(예 `15-1131 Computer Programmers`, `15-1121 Computer Systems Analysts`)이 **SOC 2010** 이다. SOC 2018과 다른 세부 직업이 있어 OEWS(2018)와 그대로는 조인이 안 된다 → §6에서 실측.


| 파일 (raw/ 기준) | 원 URL | 행 수 | 주요 열 | 직업 코드 체계 | sha256 |
|---|---|---|---|---|---|
| `felten_aioe/AIOE_DataAppendix.xlsx` | https://raw.githubusercontent.com/AIOE-Data/AIOE/adca5fc2cd0e9a659ff05278b7fa7a53f4f324c1/AIOE_DataAppendix.xlsx | 시트 6개: Appendix A 직업 774행, B 산업(NAICS 4자리) 250행, C 카운티 3271행, D 응용×능력 52행, E 능력 52행 | Appendix A: `SOC Code`, `Occupation Title`, `AIOE` | SOC 2010 6자리 | `c123b4c64840aff3568ae6c97256678719b88a74d45b6362dbefb5af34667b95` |
| `felten_aioe/Language Modeling AIOE and AIIE.xlsx` | https://raw.githubusercontent.com/AIOE-Data/AIOE/adca5fc2cd0e9a659ff05278b7fa7a53f4f324c1/Language%20Modeling%20AIOE%20and%20AIIE.xlsx | LM AIOE 774행, LM AIIE 250행 | `SOC Code`, `Occupation Title`, `Language Modeling AIOE` | SOC 2010 6자리 | `ccdd1fb916dfa404914367eafde7c00b7148ea86f18fe616240bc85cf6131c8b` |
| `felten_aioe/Image Generation AIOE and AIIE.xlsx` | https://raw.githubusercontent.com/AIOE-Data/AIOE/adca5fc2cd0e9a659ff05278b7fa7a53f4f324c1/Image%20Generation%20AIOE%20and%20AIIE.xlsx | IG AIOE 774행, IG AIIE 250행 | `SOC Code`, `Occupation Title`, `Image Generation AIOE` | SOC 2010 6자리 | `62c310544a6c1181037484b4c4017443c8d32661a0bdd482967a108aa224f5f7` |
| `felten_aioe/README.md` | https://raw.githubusercontent.com/AIOE-Data/AIOE/adca5fc2cd0e9a659ff05278b7fa7a53f4f324c1/README.md | - | 저장소 README | - | `6410cb1e5f874aeebc458d2d49267db41b3c5c7ec05f3d1dc790e60d1cd18db2` |


## 2-b. AI 적용 가능성 — Microsoft "Working with AI" (대안 2)

- 기관: Microsoft Research / Microsoft (논문: Tomlinson, Jaffe, Wang, Counts, Suri, "Working with AI: Measuring the Applicability of Generative AI to Occupations", arXiv:2507.07935)
- 저장소: https://github.com/microsoft/working-with-ai — 내려받은 커밋 `18ec44905db3383a7fd7fd0c1ff3ab36ad7729db` (2026-10-09, v1.1: 논문 arXiv v6가 참조)
- 라이선스: **CC BY 4.0** (`LICENSE.txt`). `NOTICE.md`: O*NET 데이터는 CC BY 4.0, BLS 데이터는 퍼블릭 도메인.
- 내려받은 날짜: 2026-10-16
- 안 받은 것: `soc_iwa_weights.csv`(1.2MB)·`soc_iwa_nonphysical_weights.csv`(1.2MB)·`physical_tasks.csv`(0.2MB) — 점수 재계산용 가중치. README 코드로 `ai_applicability_score`를 다시 계산하려면 필요하다.
- 열 뜻: `ai_applicability_score` = 사용자 목표 측과 AI 행동 측 적용 가능성 점수의 평균(범위 0~0.492, 평균 0.159). 근거는 Bing Copilot 대화를 O*NET 작업활동(IWA)에 대응시킨 분류에서 나온 coverage(해당 IWA 비중 ≥0.05%) × completion(과업 완수율) × impact scope(영향 범위 중간 이상)이다. 즉 **실제 Copilot 사용에서 관측된 적용 가능성**이며 이론적 노출 점수와 다르다.
- 제외 직업: 군인(55-xxxx)과 O*NET 과업 데이터가 없는 74개 SOC. README 기준 785개 SOC가 2023 OEWS 고용의 약 1.498억 명(총 1.519억 명)을 덮는다.


| 파일 (raw/ 기준) | 원 URL | 행 수 | 주요 열 | 직업 코드 체계 | sha256 |
|---|---|---|---|---|---|
| `microsoft_working-with-ai/ai_applicability_scores.csv` | https://raw.githubusercontent.com/microsoft/working-with-ai/18ec44905db3383a7fd7fd0c1ff3ab36ad7729db/ai_applicability_scores.csv | 785 | `SOC Code`, `title`, `ai_applicability_score` | SOC 2018 6자리 (README: "detailed 2018 SOC code") | `204c7e6a5ec704156212f88a6282dba7508c8b90e5df7c0d590088b2b44aa7d2` |
| `microsoft_working-with-ai/soc_metrics.csv` | https://raw.githubusercontent.com/microsoft/working-with-ai/18ec44905db3383a7fd7fd0c1ff3ab36ad7729db/soc_metrics.csv | 785 | `SOC Code`, `coverage_{user,ai}`, `completion_{user,ai}`, `feedback_positive_fraction_{user,ai}`, `impact_scope_{user,ai}`, `ai_applicability_score_user`, `ai_applicability_score_ai_nonphysical` | SOC 2018 6자리 | `c452eb71acf0cca7cfd236025a124802d148fed6c31f5e1baa342dd7d1babbfa` |
| `microsoft_working-with-ai/iwa_metrics.csv` | https://raw.githubusercontent.com/microsoft/working-with-ai/18ec44905db3383a7fd7fd0c1ff3ab36ad7729db/iwa_metrics.csv | 332 | `IWA`, `share_{user,ai}`, `completion_*`, `impact_scope_*`, `completion_x_scope_x_coverage_*` | O*NET 중간작업활동(IWA) 332개 — 직업 코드 아님 | `524f718dba31c987f0d04b55d81fac84f95533a143dfb780e04e63fb831abcf2` |
| `microsoft_working-with-ai/soc_to_iwas.csv` | https://raw.githubusercontent.com/microsoft/working-with-ai/18ec44905db3383a7fd7fd0c1ff3ab36ad7729db/soc_to_iwas.csv | 13698 | `SOC Code`, `IWA` | SOC 2018 6자리 ↔ IWA | `6b4fb16f36f099bbb4dd3ffb99659bbbf791389ceab4d6b23399c7a263f77246` |
| `microsoft_working-with-ai/README.md` | https://raw.githubusercontent.com/microsoft/working-with-ai/18ec44905db3383a7fd7fd0c1ff3ab36ad7729db/README.md | - | 문서 | - | `d252b51f6ae9473dcd2e3e0e4129ad7c320ed898eaf25e19a334541f4288e69c` |
| `microsoft_working-with-ai/LICENSE.txt` | https://raw.githubusercontent.com/microsoft/working-with-ai/18ec44905db3383a7fd7fd0c1ff3ab36ad7729db/LICENSE.txt | - | 문서 | - | `7482bb7c074d6d966bb94e54f3393f089d576e8be9dc9e92e239a40a56df8a41` |
| `microsoft_working-with-ai/NOTICE.md` | https://raw.githubusercontent.com/microsoft/working-with-ai/18ec44905db3383a7fd7fd0c1ff3ab36ad7729db/NOTICE.md | - | 문서 | - | `5bd3f57af189553c8d7f287a7d5542e55a758d2eceb36f79834db1fa96ae67d3` |


## 3. AI 실제 사용 — Anthropic Economic Index (Hugging Face)

- 기관: Anthropic. https://huggingface.co/datasets/Anthropic/EconomicIndex — 내려받은 시점의 저장소 리비전 `4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6` (최종 수정 2026-09-30). 이 리비전 고정 URL로 받았다.
- 라이선스: 데이터셋 카드 머리글은 `license: mit`, 본문은 "Data released under CC-BY, code released under MIT License". **데이터는 CC BY**로 읽는 것이 안전하다(인용 BibTeX는 `README.md`). 두 표기가 어긋난다는 사실 자체를 기록해 둔다.
- 내려받은 날짜: 2026-10-16
- 릴리스 7개 폴더 중 6개의 분석용 데이터를 받았다. 단위가 릴리스마다 다르다:

| 폴더 | 기간(자료 수집) | 직업 단위 데이터? | 받은 것 |
|---|---|---|---|
| `labor_market_impacts/` | (보고서 "Labor market impacts") | **예** — SOC 6자리 `observed_exposure` | `job_exposure.csv`, `task_penetration.csv` |
| `release_2025_02_10/` | (README에 기간 미기재) | 과업 단위 + 직업 보조표 | 과업 비중, 자동화/증강 비율, O*NET 과업문, BLS 2023 고용(대분류 22행만), O*NET 임금 |
| `release_2025_03_27/` | (README에 기간 미기재, Claude 3.7 Sonnet 기반) | 과업 단위(`task_pct_v1/v2`, 과업별 협업 유형) | 과업별 자동화/증강 파일, 클러스터 파일 |
| `release_2025_09_15/` | 2025-08-04~11 | facet 단위(국가·주) 원자료, O*NET 과업(`onet_task`) | Claude.ai·1P API 원자료, O*NET 과업문 |
| `release_2026_01_15/` | 2025-11-13~20 | 위와 같은 facet 형식 | Claude.ai·1P API 원자료 |
| `release_2026_03_24/` | 2026-02-05~12 | 위와 같은 facet 형식 | 1P API 원자료 + **Claude.ai 전역(global) 행만 추린 파생 파일** |
| `release_2026_06_26/` | 2026-04, 2026-05 (월 단위) | **예** — `category_name=soc_occupation` | 1P API 전체 + **Claude.ai 전역(global) 행만 추린 파생 파일** |

- 직업(SOC)·과업 단위 사용 비중과 자동화/증강 비율의 위치:
  - 사용 비중: 2025-02/03 릴리스의 `task_pct`·`onet_task_mappings` (과업 비중, O*NET 과업문과 이름으로 연결), 2025-09·2026-01·2026-03 원자료의 `facet=onet_task` `variable=*_pct`, 2026-06 파일의 `category_name=soc_occupation` · `metric_id=pct` (직업 단위, 일·월).
  - 자동화/증강: 2025-02 `automation_vs_augmentation.csv`(전체 비율 5행), 2025-03 `automation_vs_augmentation_by_task.csv`(과업별 directive/feedback_loop/validation/task_iteration/learning), 2025-09 이후 원자료의 `collaboration` facet, 2026-06 파일의 `collaboration_bucket_automation_pct`·`collaboration_bucket_augmentation_pct` (SOC 직업 단위).
- **100MB 제한 때문에 생긴 파생 파일 2개**: Claude.ai 원본이 각각 103MB(2026-03)·219MB(2026-06)라 한도를 넘는다. 원본을 스트리밍으로 읽으며 **전역 행만**(2026-03: `geo_id == GLOBAL`, 2026-06: `geo_level == global`) 걸러 `DERIVED_...global_only.csv`로 저장했다. 열·값은 원본 그대로이고 국가/주 행만 빠졌다. 원본 URL은 아래 표에 적었다(직접 받으면 원본이 나온다). 필터 스크립트는 scratch에만 있다.
- 안 받은 것: 각 릴리스의 노트북·코드·PNG·PDF(`aei_v4_appendix.pdf` 6MB), 2025-09 `data/output`(국가·주 enriched 26MB 등), `robot_exposure/`(로봇 노출도 — 이번 주제 밖).

`labor_market_impacts/job_exposure.csv` 열: `occ_code`(SOC 6자리, 예 `11-1011`), `title`, `observed_exposure`(범위 0~0.745, 평균 0.077). 이 폴더에는 데이터 사전이 없다. 지표의 정의는 Anthropic 보고서 "Labor market impacts"(https://www.anthropic.com/research/labor-market-impacts)를 봐야 하며, 이 대장은 그 정의를 확인하지 않았다. 이름으로 보아 이론적 가능성이 아니라 Claude 실사용에 비춘 "관측 노출도"다.

2026-06 릴리스 파일 열(`data_documentation.md`): `date_start`, `date_end`, `geo_id`, `geo_level`, `category_name`(overall/onet/request/soc_occupation), `hierarchy_level`(0=상세 직업, 1=대분류), `metric_id`, `value`, `node_name`, `node_external_id`(SOC 직업은 `29-1122.00` 같은 **O*NET-SOC 8자리**). 월 2개(2026-04, 2026-05)가 한 파일에 들어 있다.


| 파일 (raw/ 기준) | 원 URL | 행 수 | 주요 열 | 직업 코드 체계 | sha256 |
|---|---|---|---|---|---|
| `anthropic_economic_index/README.md` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/README.md | - | 데이터셋 카드(라이선스·릴리스 목록·인용) | - | `7f3a9c7c8fb2c04c55794810671926466698f171294cd2641075eb7bc403a9f0` |
| `anthropic_economic_index/labor_market_impacts/job_exposure.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/labor_market_impacts/job_exposure.csv | 756 | `occ_code`, `title`, `observed_exposure` | SOC 6자리 (2018 기준으로 보임 — OEWS 2024와 756/756 일치, §6) | `4f0a3adf5feeb2ec5f5d02ab18cc5e851a2a4b8470bde84c0c9335017be12d68` |
| `anthropic_economic_index/labor_market_impacts/task_penetration.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/labor_market_impacts/task_penetration.csv | 17998 | `task`, `penetration` | 과업 문장 단위(코드 없음) | `85bee872db1d55d3e9a7f4e89da5ae4a5d59aa8ec875d728fbf4b7d820984616` |
| `anthropic_economic_index/release_2025_02_10/README.md` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2025_02_10/README.md | - | 릴리스 설명 | - | `27b0c2df5bb4563e006a208189b8031b5a7cd20110a76ac3486cb19293f7a0ac` |
| `anthropic_economic_index/release_2025_02_10/onet_task_mappings.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2025_02_10/onet_task_mappings.csv | 3514 | `task_name`, `pct` | 과업 문장(O*NET 과업문과 이름 일치로 연결) | `8de89c99f762146c9e46b2202c3501e2a14f11c5b44c61c8007021127b6c676e` |
| `anthropic_economic_index/release_2025_02_10/automation_vs_augmentation.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2025_02_10/automation_vs_augmentation.csv | 6 | `interaction_type`, `pct` | 코드 없음(전체 합계) | `d1e264882b17618db4f4a00b6f87f48134222bc5c15eefb3d46aae9519e89d11` |
| `anthropic_economic_index/release_2025_02_10/onet_task_statements.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2025_02_10/onet_task_statements.csv | 19530 | `O*NET-SOC Code`, `Title`, `Task ID`, `Task`, `Task Type`, ... | O*NET-SOC 8자리 (2019 분류) | `82e4c418dc08475ef1263ad1e8c66ffa3357291370cd35ee1065ecea590597ec` |
| `anthropic_economic_index/release_2025_02_10/SOC_Structure.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2025_02_10/SOC_Structure.csv | 1596 | `Major Group`, `Minor Group`, `Broad Occupation`, `Detailed Occupation`, `Detailed O*NET-SOC`, `SOC or O*NET-SOC 2019 Title` | SOC 2018 구조표 | `05eb5e689fb471b7a66962b57bba6666dee2c3e6a6854f0f84faf423af68dd17` |
| `anthropic_economic_index/release_2025_02_10/bls_employment_may_2023.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2025_02_10/bls_employment_may_2023.csv | 22 | 대분류별 BLS 2023-05 고용 | SOC 대분류(22행) — 직업 단위로는 못 씀 | `4bbfd186cf0b87f6f57f7af86a9258ac457374440f32500b0a3515e64e35d51e` |
| `anthropic_economic_index/release_2025_02_10/wage_data.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2025_02_10/wage_data.csv | 1090 | `SOCcode`, `JobName`, `JobFamily`, `MedianSalary`, `JobForecast`, `ChanceAuto`, ... | O*NET-SOC 8자리 (O*NET 사이트에서 긁은 것) | `4453fc56402c94306e4749ad62b6f7c313f63d884ca99bab767a52e7d627b15f` |
| `anthropic_economic_index/release_2025_03_27/README.md` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2025_03_27/README.md | - | 릴리스 설명 | - | `0a72214226fa9815a16881b5c872045e84a8d70420090875f1cc975c9ad8ef3a` |
| `anthropic_economic_index/release_2025_03_27/task_pct_v1.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2025_03_27/task_pct_v1.csv | 3514 | `task_name`, `pct` | 과업 문장 (2025-02 `onet_task_mappings.csv`와 동일 해시) | `8de89c99f762146c9e46b2202c3501e2a14f11c5b44c61c8007021127b6c676e` |
| `anthropic_economic_index/release_2025_03_27/task_pct_v2.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2025_03_27/task_pct_v2.csv | 3365 | `task_name`, `pct` | 과업 문장 (Claude 3.7 Sonnet 기반 v2) | `0c20f184cd4a1e3d8ef3d77f500b32b62431ce61a3c2f133c3af7fa8429f97db` |
| `anthropic_economic_index/release_2025_03_27/automation_vs_augmentation_by_task.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2025_03_27/automation_vs_augmentation_by_task.csv | 3364 | `task_name`, `feedback_loop`, `directive`, `task_iteration`, `validation`, `learning`, `filtered` | 과업 문장. directive+feedback_loop = 자동화, 나머지 = 증강 (README 분류) | `f6570714a9af31ae783fd91bd7ee3b2e9cfabcbf522a30ba1aa9b1f230665e79` |
| `anthropic_economic_index/release_2025_03_27/automation_vs_augmentation_v1.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2025_03_27/automation_vs_augmentation_v1.csv | 6 | `interaction_type`, `pct` | 코드 없음(전체 합계) | `d1e264882b17618db4f4a00b6f87f48134222bc5c15eefb3d46aae9519e89d11` |
| `anthropic_economic_index/release_2025_03_27/automation_vs_augmentation_v2.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2025_03_27/automation_vs_augmentation_v2.csv | 6 | `interaction_type`, `pct` | 코드 없음(전체 합계) | `0d7d8b1666f3d942d728f9b2177681ca6756edfe01fb8fc130e29264d41a391e` |
| `anthropic_economic_index/release_2025_03_27/cluster_level_data/README.md` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2025_03_27/cluster_level_data/README.md | - | 클러스터 파일 설명 | - | `adec743d27e29e33c678b74336decb874f0471f06a59aff0b77e7107df1b223d` |
| `anthropic_economic_index/release_2025_03_27/cluster_level_data/cluster_level_dataset.tsv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2025_03_27/cluster_level_data/cluster_level_dataset.tsv | 630 | `cluster_name_0..2`, `percent_records`, `onet_task`, `collaboration:*_ratio`, `has_thinking_ratio` | 요청 클러스터 ↔ O*NET 과업 문장 (TSV) | `401e3f09d8bb209048502175f593a359b394c9db0a7131d052bedb2211ae2031` |
| `anthropic_economic_index/release_2025_09_15/data_documentation.md` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2025_09_15/data_documentation.md | - | 스키마 문서 | - | `d7e23aa0888628fdeb27f49a14e151c41ea99d47bd5dd65e84383b203c23464a` |
| `anthropic_economic_index/release_2025_09_15/data/intermediate/onet_task_statements.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2025_09_15/data/intermediate/onet_task_statements.csv | 19530 | `O*NET-SOC Code`, `Title`, `Task`, ..., `soc_major_group` | O*NET-SOC 8자리 + 대분류 2자리 | `88427f8d2a9f37a7c08b5420c6c66a01cdae6467b716bbbd31989128504b8ebb` |
| `anthropic_economic_index/release_2025_09_15/data/intermediate/aei_raw_claude_ai_2025-08-04_to_2025-08-11.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2025_09_15/data/intermediate/aei_raw_claude_ai_2025-08-04_to_2025-08-11.csv | 100062 | `geo_id`, `geography`, `date_start`, `date_end`, `platform_and_product`, `facet`, `level`, `variable`, `cluster_name`, `value` | `facet=onet_task`의 `cluster_name`이 과업 문장(코드 없음) | `c8ef9c5eee0c42febc73e358ecc7d2358e0a0ce3b50122c0c15ae8ec569aceff` |
| `anthropic_economic_index/release_2025_09_15/data/intermediate/aei_raw_1p_api_2025-08-04_to_2025-08-11.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2025_09_15/data/intermediate/aei_raw_1p_api_2025-08-04_to_2025-08-11.csv | 33794 | 위와 같음 | 과업 문장 | `c0fc061ea7d4feb71a7bd88c528d54e2d3a11e2045574f1e1fb2d594eebffd0f` |
| `anthropic_economic_index/release_2026_01_15/data_documentation.md` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2026_01_15/data_documentation.md | - | 스키마 문서 | - | `50f117f8f995606004680749fc43012d2bd83c5fc9dab6044a935f601643ef6f` |
| `anthropic_economic_index/release_2026_01_15/data/intermediate/aei_raw_claude_ai_2025-11-13_to_2025-11-20.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2026_01_15/data/intermediate/aei_raw_claude_ai_2025-11-13_to_2025-11-20.csv | 458778 | 위와 같음 | 과업 문장 | `70dc16780061b84d3f34ddf7fe5c978d65c99a5ef58afd78f9315f886a6a5873` |
| `anthropic_economic_index/release_2026_01_15/data/intermediate/aei_raw_1p_api_2025-11-13_to_2025-11-20.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2026_01_15/data/intermediate/aei_raw_1p_api_2025-11-13_to_2025-11-20.csv | 187772 | 위와 같음 | 과업 문장 | `432f8d14348ba384dd9c659fa7fdc85754cbae3b5a480c14a344ac4823d0e861` |
| `anthropic_economic_index/release_2026_03_24/data_documentation.md` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2026_03_24/data_documentation.md | - | 스키마 문서 | - | `0a194ff1e317567e8b5d68d581fa2e5f8a1d3112f71aa209d2caa408ee12a779` |
| `anthropic_economic_index/release_2026_03_24/data/aei_raw_1p_api_2026-02-05_to_2026-02-12.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2026_03_24/data/aei_raw_1p_api_2026-02-05_to_2026-02-12.csv | 195156 | 위와 같음 | 과업 문장 | `b3bcd68e7f6d820ffbb50a3c53d71ec2a122556fc2a38226cd86951a054bd4c8` |
| `anthropic_economic_index/release_2026_03_24/data/DERIVED_aei_raw_claude_ai_2026-02-05_to_2026-02-12_global_only.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2026_03_24/data/aei_raw_claude_ai_2026-02-05_to_2026-02-12.csv (원본 103MB, 전역 행만 추림) | 271313 | 위와 같음 | 과업 문장 (파생: GLOBAL 행만) | `f0a91fbf924b471044b27e66d7f5643b3ba1c5f6c863bfcc6cf5b1f3c1f14d42` |
| `anthropic_economic_index/release_2026_06_26/data_documentation.md` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2026_06_26/data_documentation.md | - | 스키마 문서 | - | `1a01eeb7d34250b192aa9c906098bea1db971644e6bdb04497d87b7a4ed141a5` |
| `anthropic_economic_index/release_2026_06_26/data/aei_1p_api_2026-06-26.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2026_06_26/data/aei_1p_api_2026-06-26.csv | 491705 | `date_start`, `date_end`, `geo_id`, `geo_level`, `category_name`, `hierarchy_level`, `metric_id`, `value`, `node_name`, `node_external_id` | `soc_occupation`: O*NET-SOC 8자리 701개(→6자리 601개); 일부는 `onet`(과업 ID)·`request` | `62197f003e001945ad130c2f26f5e07f3fda45ff41644df91444b04fd524a19f` |
| `anthropic_economic_index/release_2026_06_26/data/DERIVED_aei_claude_ai_2026-06-26_global_only.csv` | https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/4e5f69fab13a9c3f7d0dcc31a6f893a9818738f6/release_2026_06_26/data/aei_claude_ai_2026-06-26.csv (원본 219MB, 전역 행만 추림) | 554941 | 위와 같음 | `soc_occupation`: O*NET-SOC 8자리 718개(→6자리 614개) | `19e02e6d0efd78d42b870ace331e68278e2b97ba771a4967066a465ffa68e79b` |


## 4. 고용 — BLS OEWS 전국 직업별 고용·임금 (2022·2023·2024·2025년 5월)

- 기관: U.S. Bureau of Labor Statistics (BLS), Occupational Employment and Wage Statistics. 원 URL 패턴: `https://www.bls.gov/oes/special-requests/oesmYYnat.zip`
- 라이선스: 미국 연방정부 저작물 — BLS 정보는 퍼블릭 도메인이며 출처 표기 권장(https://www.bls.gov/opub/copyright-information.htm, Microsoft 저장소 `NOTICE.md`도 같은 취지로 인용).
- 내려받은 날짜: 2026-10-16
- **막힌 경로와 우회하지 않은 이유(중요)**: `www.bls.gov`와 `download.bls.gov`는 모든 요청에 `403 Access Denied`를 돌려준다. 본문은 "자동화된 프로그램(봇) 접근은 BLS 사용 정책상 금지"라는 Akamai 차단 페이지(오류 코드 `0.27ad2c17...`)다. 처음 점검할 때 일반 브라우저형 User-Agent 문자열을 붙인 요청 몇 건을 보냈고(전부 403), 그 뒤로는 차단을 우회하려는 시도(헤더 조작·재시도·브라우저 자동화)를 하지 않았다. 대신 **Internet Archive(Wayback Machine)가 보관한 같은 URL의 원본 응답 사본**을 `id_` 모드(원본 바이트 그대로)로 받았다. BLS Public Data API(`api.bls.gov`)는 시도하지 않았다 — 직업 약 830개 × 연도를 받으려면 등록 키(계정 생성)가 필요한데 계정 생성은 이번 범위 밖이다. 
- Wayback 사본 URL 형식은 `https://web.archive.org/web/<캡처시각>id_/<원 URL>`이다. 각 zip을 받은 캡처 시각은 같은 폴더의 `*.zip.wayback_timestamp.txt`에 있다(2022: `20261006075701`, 2023: `20261005183036`, 2024: `20261004165530`, 2025: `20261007170818`). 캡처 시각은 2026-10이지만 내용은 각 연도 5월 기준 확정 자료다.
- **무결성 확인(한계 포함)**: 4개 zip 모두 열리고 xlsx 1개씩 들어 있다. 전 직업 합계 `TOT_EMP`는 2022: 147,886,000 / 2023: 151,853,870 / 2024: 154,187,380 / 2025: 155,495,730이다. 2023 값은 Microsoft 저장소 README가 적은 "2023 OEWS 총 고용 1.519억 명"과 맞는다. 나머지 연도는 BLS 공표치와 외부 대조를 하지 않았다. Wayback 사본이 BLS 원본과 바이트까지 같다는 증명은 없다.
- xlsx 내부 `UpdateTime` 시트가 4개 파일 모두 `09MAR2021`로 돼 있다(BLS 템플릿 잔재로 보이며 자료 기준일이 아니다).
- 변환: `openpyxl`이 없어 표준 라이브러리(`zipfile`+`xml.etree`)로 xlsx 첫 시트와 `Field Descriptions` 시트를 CSV로 변환했다(`converted_csv/`, **파생물**). 소수 값은 엑셀 저장값 그대로라 `36.229999999999997`처럼 긴 소수가 있다. 원본 xlsx는 zip 안에 그대로 있다.
- 열(`*_dl.csv`): `AREA`, `AREA_TITLE`, `AREA_TYPE`, `PRIM_STATE`, `NAICS`, `NAICS_TITLE`, `I_GROUP`, `OWN_CODE`, **`OCC_CODE`**, **`OCC_TITLE`**, **`O_GROUP`**(total/major/minor/broad/detailed), **`TOT_EMP`**(고용), `EMP_PRSE`, `JOBS_1000`, `LOC_QUOTIENT`, `PCT_TOTAL`, `PCT_RPT`, `H_MEAN`, **`A_MEAN`**(연평균임금), `MEAN_PRSE`, `H_PCT10..90`, `A_PCT10..90`, `ANNUAL`, `HOURLY`. 직업 단위 분석은 `O_GROUP == 'detailed'`만 쓴다(연도별 830~831행; 모두 `TOT_EMP`가 숫자).
- 직업 코드 체계: **SOC 2018** (`OCC_CODE` 6자리). 단 OEWS는 SOC 상세 직업을 합친 코드를 쓴다 — 예 `13-1020 Buyers and Purchasing Agents`(상세로 분류)는 O*NET의 `13-1021/13-1022/13-1023`을 합친 것. 그래서 O*NET 쪽 6자리 코드가 OEWS에 없는 경우가 있다(§6).
- 연도 간 일관성: 상세 직업 코드가 2022↔2024는 830개 공통(2022에만 `11-1031` Legislators), 2022↔2025는 829개 공통(2025에만 `29-1024`). 6자리 코드 정의가 바뀐 직업은 시계열 비교에서 제외하거나 BLS의 직업 코드 변경 설명을 따로 확인해야 한다.
- 안 받은 것: 주·대도시권·산업별 OEWS(`oesmYYall.zip` 등), 2021년 5월 이전. 단 2021년 5월 전국표는 OpenAI 저장소에서 온 복사본(`openai_gpts-are-gpts/national_May2021_dl.csv`)이 있다.


| 파일 (raw/ 기준) | 원 URL | 행 수 | 주요 열 | 직업 코드 체계 | sha256 |
|---|---|---|---|---|---|
| `bls_oews/oesm22nat.zip` | https://www.bls.gov/oes/special-requests/oesm22nat.zip (Wayback 사본) | xlsx 1개 (주 시트 데이터 1402행) | `national_M2022_dl.xlsx` + Field Descriptions 시트 | SOC 2018 | `725348e28b50bf6a58b3beed88175efea9ad1235c09d1f498feae5b15c315fd1` |
| `bls_oews/oesm23nat.zip` | https://www.bls.gov/oes/special-requests/oesm23nat.zip (Wayback 사본) | xlsx 1개 (주 시트 데이터 1403행) | `national_M2023_dl.xlsx` + Field Descriptions 시트 | SOC 2018 | `8ce5e8277c3ba68a19f468fec9b4da21170593d5ad9693a813f1afc04c80efa2` |
| `bls_oews/oesm24nat.zip` | https://www.bls.gov/oes/special-requests/oesm24nat.zip (Wayback 사본) | xlsx 1개 (주 시트 데이터 1403행) | `national_M2024_dl.xlsx` + Field Descriptions 시트 | SOC 2018 | `5fa368aa034ca784f0a4f67f0f1bac67072c5a07992ac3e3de92db10a2821043` |
| `bls_oews/oesm25nat.zip` | https://www.bls.gov/oes/special-requests/oesm25nat.zip (Wayback 사본) | xlsx 1개 (주 시트 데이터 1401행) | `national_M2025_dl.xlsx` + Field Descriptions 시트 | SOC 2018 | `b5855a37f3e03e779f6fbf173d3bbc94aeeff33426aef32fa95ce6d025bab1af` |
| `bls_oews/converted_csv/national_M2022_dl.csv` | 위 zip 안의 `national_M2022_dl.xlsx` 첫 시트를 변환(파생) | 1402 | `OCC_CODE`, `OCC_TITLE`, `O_GROUP`, `TOT_EMP`, `A_MEAN`, `A_MEDIAN`, `H_MEAN` 등 32열 | SOC 2018 (`detailed` 830행) | `12be2911a1875418df055ddb46e68bf6d7ca8c5ce7cb2c72c379030e63f90c63` |
| `bls_oews/converted_csv/national_M2022_field_descriptions.csv` | 위 zip 안의 `Field Descriptions` 시트를 변환(파생) | 45 | 필드 설명 텍스트 | - | `4184d25fe3cca418637f47c5ffa3c8224761706e77deb2548e61f366db10068f` |
| `bls_oews/converted_csv/national_M2023_dl.csv` | 위 zip 안의 `national_M2023_dl.xlsx` 첫 시트를 변환(파생) | 1403 | `OCC_CODE`, `OCC_TITLE`, `O_GROUP`, `TOT_EMP`, `A_MEAN`, `A_MEDIAN`, `H_MEAN` 등 32열 | SOC 2018 (`detailed` 831행) | `1af5807032392639e46db9c368582b47611b0ce3d9a253a1dfe4d5f5a7f4096b` |
| `bls_oews/converted_csv/national_M2023_field_descriptions.csv` | 위 zip 안의 `Field Descriptions` 시트를 변환(파생) | 45 | 필드 설명 텍스트 | - | `5d51e1c886404f37545dda9f70a23afa151ad555e8903b572bb751f0594dfb89` |
| `bls_oews/converted_csv/national_M2024_dl.csv` | 위 zip 안의 `national_M2024_dl.xlsx` 첫 시트를 변환(파생) | 1403 | `OCC_CODE`, `OCC_TITLE`, `O_GROUP`, `TOT_EMP`, `A_MEAN`, `A_MEDIAN`, `H_MEAN` 등 32열 | SOC 2018 (`detailed` 831행) | `f2556d494d0e41f5af9e746dc13f35d01dbcf5f052508ed9ec8f1aa452cbfb3e` |
| `bls_oews/converted_csv/national_M2024_field_descriptions.csv` | 위 zip 안의 `Field Descriptions` 시트를 변환(파생) | 45 | 필드 설명 텍스트 | - | `be4d4beb1a53dc4c23d48d5f0805dd87b21b22349f9fb16009cb3096b5f502cd` |
| `bls_oews/converted_csv/national_M2025_dl.csv` | 위 zip 안의 `national_M2025_dl.xlsx` 첫 시트를 변환(파생) | 1401 | `OCC_CODE`, `OCC_TITLE`, `O_GROUP`, `TOT_EMP`, `A_MEAN`, `A_MEDIAN`, `H_MEAN` 등 32열 | SOC 2018 (`detailed` 830행) | `a3fb2cf56e1123cd642f2e677ef940a6b3b56bc47c80d86805ce4a6737dc5223` |
| `bls_oews/converted_csv/national_M2025_field_descriptions.csv` | 위 zip 안의 `Field Descriptions` 시트를 변환(파생) | 45 | 필드 설명 텍스트 | - | `36b8f71eb4e4d502f9c4b4d02cca9c8b8a57737be96359523037b2b469d5ade1` |
| `bls_oews/oesm22nat.zip.wayback_timestamp.txt` | (출처 기록용 내 메모) | 1 | Wayback 캡처 시각 | - | `64bc397d9f941dcb80347af3d7003da725d523ff41ff747280476bb17662198f` |
| `bls_oews/oesm23nat.zip.wayback_timestamp.txt` | (출처 기록용 내 메모) | 1 | Wayback 캡처 시각 | - | `b6dc54a361383ec8506a708314e38be5c9d1202bd83cad1de2d3396dd762040e` |
| `bls_oews/oesm24nat.zip.wayback_timestamp.txt` | (출처 기록용 내 메모) | 1 | Wayback 캡처 시각 | - | `4061de3cc6e37be76b342bc284039d5e2c1cc05b07a564a3ec81aaa284e95133` |
| `bls_oews/oesm25nat.zip.wayback_timestamp.txt` | (출처 기록용 내 메모) | 1 | Wayback 캡처 시각 | - | `fcb761a262d0204a9b7acef65419e2cb9d9a358ae338cda0319a206c105865fe` |


## 5. 고용 전망 — BLS Employment Projections (2024–34, 2025–35)

- 기관: BLS Office of Occupational Statistics and Employment Projections. 원 URL: `https://www.bls.gov/emp/ind-occ-matrix/occupation.xlsx` (BLS가 같은 주소에서 파일을 갈아 끼운다)
- 라이선스: 퍼블릭 도메인(§4와 같음). 내려받은 날짜: 2026-10-16
- 막힘: §4와 같은 이유로 bls.gov 직접 접근은 403. Wayback 사본을 받았다.
  - **2024–34판**: Wayback 캡처 `20250910073646` (xlsx 내부 경로 `Release\2024-34`로 확인) — 요청하신 2024–34 전망이다.
  - **2025–35판**: Wayback 캡처 `20261002185424` (내부 경로 `Release\2025-35`) — **요청에 없던 최신판.** 2025년 고용은 자영업자·무급가족종사자를 포함한 NEM 기준이라 OEWS와 정의가 다르다(총계 1억 7,028만 명 vs OEWS 1억 5,550만 명).
  - 같은 URL의 이전 캡처에서 2022–32판은 OpenAI 저장소 복사본(`occupation_2023_final.xlsx`)에 있다.
- 주의: 이것은 **전망치**이지 실제 고용 변화가 아니다. 2024년 고용(기준연도)과 2034년 전망의 차이다. "실제 변화"는 OEWS 연도 간 차이를 쓰고, 전망은 보조 변수로만 쓴다.
- 변환: 위와 같은 방법으로 시트 `Index`, `Table 1.1`(대분류), `Table 1.2`(상세 직업·전망·학력·임금), `Table 1.12`(직업 활용에 영향을 주는 요인)만 CSV로 뽑았다(`converted_csv/`, 파생물). 다른 시트(1.3~1.11, 산업-직업 매트릭스)는 xlsx 안에 있다.
- `Table 1.2` 열: `20XX National Employment Matrix title`, `... code`, `Occupation type`(Summary/Line item), `Employment, 2024/2034`(천 명), `Employment change, numeric/percent, 2024–34`, `Percent self employed`, `Occupational openings`, `Median annual wage`, 학력·경력·훈련 필드. 변화율 열이 직업별 전망 변화율이다. 첫 두 행은 제목·머리글이다(CSV 첫 행이 제목이라 머리글 행은 2번째).
- `Table 1.12`: BLS가 직업별로 적은 "수요에 영향을 주는 요인" 서술. 두 판 모두 시트 제목이 "Factors affecting occupational utilization"이고 "artificial intelligence"를 언급하는 행이 있다(grep 실측: 2025–35판 54행, 2024–34판 36행). 예: 광고·홍보 관리자 항목 "share decreases as managers increasingly utilize artificial intelligence (AI) tools". 정성 근거로 쓸 수 있다.
- 직업 코드 체계: NEM 코드(SOC 2018 기반, 6자리). 일부는 SOC 합산 코드(예 `31-1120`).


| 파일 (raw/ 기준) | 원 URL | 행 수 | 주요 열 | 직업 코드 체계 | sha256 |
|---|---|---|---|---|---|
| `bls_projections/occupation_2024-34_wayback20250910.xlsx` | https://www.bls.gov/emp/ind-occ-matrix/occupation.xlsx (Wayback 캡처 20250910073646) | 시트 12개. Table 1.2: 요약 281 + 상세(Line item) 832 | `2024 National Employment Matrix title/code`, `Employment, 2024/2034`, `Employment change, percent, 2024–34` | NEM(SOC 2018 기반) | `bebf85e71d3a274eb0531077a9fe1bbcd1167e0a14c59e33071f61cbda9d3a57` |
| `bls_projections/occupation_2025-35_wayback20261002.xlsx` | https://www.bls.gov/emp/ind-occ-matrix/occupation.xlsx (Wayback 캡처 20261002185424) | 시트 12개. Table 1.2: 요약 281 + 상세(Line item) 831 | `2025 National Employment Matrix title/code`, `Employment, 2025/2035`, `Employment change, percent, 2025–35` | NEM(SOC 2018 기반) | `a7d060f0576f7d4f5b829b9a0bb4a6c11a12766d159ebb0e07aab5bd2e7583c5` |
| `bls_projections/converted_csv/occupation_2024-34__sheet01_Index.csv` | 위 xlsx의 해당 시트를 변환(파생) | 11 (제목 행 제외, 머리글 행 포함) | 시트 설명 참고 | - | `9e69f7e81b4a6a7ade49154d1c29007efbf29dc3e04d5c2b55f143d6034fadfc` |
| `bls_projections/converted_csv/occupation_2024-34__sheet02_Table_1.1.csv` | 위 xlsx의 해당 시트를 변환(파생) | 27 (제목 행 제외, 머리글 행 포함) | 시트 설명 참고 | NEM 코드 | `b480adbd508e9da3913e320089478a210a781c88d635c6b9324d45ea9c34fa5e` |
| `bls_projections/converted_csv/occupation_2024-34__sheet03_Table_1.2.csv` | 위 xlsx의 해당 시트를 변환(파생) | 1118 (제목 행 제외, 머리글 행 포함) | 시트 설명 참고 | NEM 코드 | `56f003ab84ea358af54c706e145b535332083bdd9e9e2fc373a0edeb04b90b94` |
| `bls_projections/converted_csv/occupation_2024-34__sheet12_Table_1.12.csv` | 위 xlsx의 해당 시트를 변환(파생) | 1000 (제목 행 제외, 머리글 행 포함) | 시트 설명 참고 | NEM 코드 | `9c9c34dbe135f2c7bf29ec6c7e5e8b64b055c2ca0b773b31e712b14d5dbdd603` |
| `bls_projections/converted_csv/occupation_2025-35__sheet01_Index.csv` | 위 xlsx의 해당 시트를 변환(파생) | 11 (제목 행 제외, 머리글 행 포함) | 시트 설명 참고 | - | `82f04a7222dce67fb24b3260d56a57600792aff50220fb799b0f3d1276bbc088` |
| `bls_projections/converted_csv/occupation_2025-35__sheet02_Table_1.1.csv` | 위 xlsx의 해당 시트를 변환(파생) | 28 (제목 행 제외, 머리글 행 포함) | 시트 설명 참고 | NEM 코드 | `39a7e3a0a31f8cf9959470706f257dfc78ff2849ed0c50ceac1224f91393d354` |
| `bls_projections/converted_csv/occupation_2025-35__sheet03_Table_1.2.csv` | 위 xlsx의 해당 시트를 변환(파생) | 1118 (제목 행 제외, 머리글 행 포함) | 시트 설명 참고 | NEM 코드 | `9cd5d3a60aafecb7964c8441e67ffbe64d087cf273354923df2ce29a0a7e5eaf` |
| `bls_projections/converted_csv/occupation_2025-35__sheet12_Table_1.12.csv` | 위 xlsx의 해당 시트를 변환(파생) | 937 (제목 행 제외, 머리글 행 포함) | 시트 설명 참고 | NEM 코드 | `57770e8b6f5a3f9f7aa2cef420d3bb388d5696c94cb2a72ea5b2205369f2129f` |
| `bls_projections/occupation_2024-34_wayback20250910.xlsx.wayback_timestamp.txt` | (출처 기록용 내 메모) | 1 | Wayback 캡처 시각 | - | `66b527d8588a52b79d44501cd0c35bed609520db3180f26f042fc824c07eccfb` |
| `bls_projections/occupation_2025-35_wayback20261002.xlsx.wayback_timestamp.txt` | (출처 기록용 내 메모) | 1 | Wayback 캡처 시각 | - | `5ed20c1c7552e4b607f7b35216061810daf733882cb9597d040ff38fa5935cbb` |


## 6. 조인 가능성 — 직업 코드가 실제로 몇 개 맞는가 (6자리 SOC)

실측 방법: 각 노출 파일의 직업 코드를 6자리 SOC로 맞춘 뒤(O*NET-SOC 8자리는 앞 7글자 `NN-NNNN`로 줄이고 중복 제거), OEWS `O_GROUP == 'detailed'`의 `OCC_CODE` 집합 및 BLS 전망 `Table 1.2`의 `Line item` 코드 집합과 **문자열 완전 일치**로 교집합을 셌다. 크로스워크는 쓰지 않았다(그래서 이것은 "코드를 그대로 쓸 때"의 수이며, 크로스워크로 늘릴 수 있는 여지는 아래 불일치 목록에 표시). 계산은 scratch의 스크립트로 했고 raw의 파일만 읽었다.

**기준 집합 크기**: OEWS 상세 직업 — 2022: 830, 2023: 831, 2024: 831, 2025: 830 (모두 `TOT_EMP` 숫자). 전망 상세 — 2024–34: 832, 2025–35: 831.

| 노출 파일 | 자체 6자리 고유 직업 수 | ∩ OEWS 2022 | ∩ OEWS 2023 | ∩ OEWS 2024 | ∩ OEWS 2025 | ∩ 전망 2024–34 | ∩ 전망 2025–35 |
|---|---:|---:|---:|---:|---:|---:|---:|
| OpenAI `occ_level.csv` (923 O*NET행 → 6자리) | 798 | 771 | 772 | 772 | 771 | 773 | 772 |
| Felten AIOE (SOC 2010) | 774 | 672 | 673 | 673 | 673 | 673 | 673 |
| Microsoft `ai_applicability_scores.csv` | 785 | 783 | 784 | 784 | 783 | 785 | 784 |
| Anthropic `job_exposure.csv` | 756 | 755 | 756 | 756 | 755 | 756 | 755 |
| Anthropic 2026-06 Claude.ai `soc_occupation` (8자리 718 → 6자리) | 614 | 592 | 592 | 592 | 591 | 592 | 591 |
| Anthropic 2026-06 1P API `soc_occupation` (8자리 701 → 6자리) | 601 | 578 | 578 | 578 | 577 | 578 | 577 |

**두 시점 모두 쓰는 경우(고용 변화 계산용)**: 노출 파일 ∩ OEWS 2022 ∩ OEWS 2024 / ∩ OEWS 2022 ∩ OEWS 2025
- OpenAI 771 / 770 · Felten 672 / 672 · Microsoft 783 / 782 · Anthropic `job_exposure` 755 / 754 · Anthropic 2026-06 Claude.ai 592 / 591 · 1P API 578 / 577
- **네 노출 파일(OpenAI·Felten·Microsoft·Anthropic job_exposure) 교집합: 669개 직업**, 여기에 OEWS 2022와 2024를 모두 요구하면 668개, 2022와 2025면 668개.

**맞지 않는 직업의 성격**(앞부분만; 전체 목록은 필요할 때 같은 방법으로 뽑으면 된다):
- Anthropic `job_exposure`: OEWS 2024와 **전부 일치(756/756)**. 반대로 OEWS 2024에서 노출 점수가 없는 상세 직업은 75개. → 조인 비용이 가장 낮다. 2022·2025와 1개씩 다른 것은 OEWS 쪽 코드 변경(2022에만 `11-1031`, 2025에만 `29-1024`)이다.
- Microsoft: 785개 중 OEWS 2024에 없는 것은 1개(`45-3031`). OEWS 2024에서 점수가 없는 상세 직업은 47개(군인·과업 자료 없는 직업).
- OpenAI: 798개 중 OEWS 2024에 없는 것이 26개 — `13-1021/1022/1023`(OEWS는 `13-1020` 하나로 합침), `13-2022/2023`, `21-1011/1014`, `25-2055/2056`, `25-9042/9043`, `29-2011/2012`, `31-1121/1122` 등 **OEWS가 합산 코드를 쓰는 곳**. 이들은 크로스워크(BLS NEM 또는 O*NET→SOC)로 합쳐 가중평균하면 살릴 수 있다. OEWS 2024에서 점수가 없는 상세 직업은 59개.
- Felten: 774개 중 101개가 OEWS 2024에 없다 — **SOC 2010 코드**라서다(`15-1131 Computer Programmers`, `15-1121`, `15-1122` 등은 2018에서 `15-12xx`로 재편, `11-2031`·`11-3011`·`11-9061` 등도 변경). SOC 2010→2018 크로스워크(BLS/Census 공개)를 추가로 받아야 나머지를 매칭할 수 있다. 이 크로스워크는 이번에 받지 않았다. OEWS 2024에서 점수가 없는 상세 직업은 158개.
- Anthropic 2026-06 `soc_occupation`: O*NET-SOC 8자리를 6자리로 줄인 뒤 OEWS와 맞춘 것이며, 노출 점수가 없는 OEWS 상세 직업이 239개(Claude.ai)·253개(1P API) — 월별 공개 임계치를 못 넘긴 직업은 행이 비어 있다(문서: "missing row means the cell was not published"). 0으로 채우면 안 된다.

**참고(8자리→6자리 줄이기)**: `occ_level.csv`·2026-06 파일은 한 SOC에 O*NET 세부 직업이 여럿 있어 6자리로 줄일 때 평균 등 집계 규칙이 필요하다(예 `11-1011.00`, `11-1011.03`). 이 집계 방식은 분석 결정이며 이 대장은 정하지 않았다.

## 7. 못 한 것·미확인 목록

- BLS 원 사이트 직접 다운로드는 불가(403). 모든 BLS 파일은 Wayback 사본. BLS API는 키가 필요해 시도하지 않음.
- Anthropic `labor_market_impacts/job_exposure.csv`의 `observed_exposure` 정의는 보고서를 읽어 확인하지 않았다.
- OpenAI 저장소의 E1/E2 정의는 논문 지식 기준이고, 저장소 README에는 `alpha/beta/gamma` 한 줄뿐이다.
- Felten 코드를 SOC 2010으로 판단한 근거는 직업 목록 대조(2018에 없는 코드가 많고 OEWS와 672/774만 일치)이며, 저장소가 코드 체계를 명시하지는 않는다.
- Felten 저장소 라이선스 미표기 → 재사용·재배포 조건 불명. 공개 저장소(`origin`)에 이 폴더를 커밋하지 말 것. 용량이 큰 Anthropic 파일(합계 약 480MB)도 커밋 전에 `.gitignore` 대상으로 정해야 한다.
- 이 폴더 전체를 커밋하지 않았다(요청 범위: 수정·커밋 금지). 


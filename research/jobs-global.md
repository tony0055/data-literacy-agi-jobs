# 선진국 화이트칼라 대체: 시기·규모 추정과 이미 나타난 고용 변화 (미국 중심)

- **접근일**: 2026-10-16 (모든 URL을 이날 열람)
- **짝 파일**: `_data/displacement_forecasts.csv`(104행), `_data/occupation_signals.csv`(77행)
- **표기 규칙**: `[추정]`은 모델·설문·예측, `[실측]`은 관측 자료, `[반증]`은 AI 대체 가설에 불리한 자료, `[발언]`은 인물 진술이다. **확인경로**의 `직접`은 이번 세션에서 원문(기관 페이지·PDF 본문)을 열어 숫자를 읽었다는 뜻이고, `2차`는 검색 요약이나 다른 매체의 인용으로만 본 것이다. 2차 값은 확정값으로 쓰지 않는다.

## 요약 (핵심 수치 10줄)

1. **시기 추정이 앞당겨졌다(McKinsey).** 업무활동 50% 자동화 중간 시점이 2017-01 보고서 **2055년(±약 20년)** → 2023-06 보고서가 직전 모델을 **2053년(범위 2035~2070)** 으로 인용하고 새 추정을 **2045년(범위 2030~2060)** 으로 갱신했다. 약 10년 단축이다(직접).
2. **미국 2030년 자동화 가능 근로시간**: 생성AI 이전 **21.5%** → 반영 후 **29.5%**(MGI 2023-07). 2025-11에는 현재 기술로 이론상 **57%**(에이전트 44% + 로봇 13%)이지만 "일자리 감소 예측이 아니다"라고 명시했다(직접). 정의가 달라 57%를 '앞당김'의 연속선으로 읽으면 안 된다.
3. **Goldman Sachs**: 2023 "3억 개 풀타임 일자리 노출, 미국 직업의 약 2/3 노출" → 2025-08 미국 노동력 **6~7% 대체(범위 3~14%)**, 전환기 실업률 **+0.5%p** → 2026-03에도 6~7%·+0.6%p(직접). 2026-06 상향(>9%, 약 1,500만 명)은 2차.
4. **IMF**: 선진국 일자리 **약 60%**, 세계 **약 40%** AI 노출, 노출 일자리의 약 절반은 혜택·절반은 노동수요 감소 가능(2024-01, 직접). 노출이지 실직 예측이 아니다.
5. **WEF 2025**: 2030년까지 **1.7억 창출·9,200만 소멸·순 +7,800만**, 고용주의 **41%** 가 AI로 자동화되는 곳에서 인력 감축 계획(고용주 설문, 직접).
6. **실측(젊은 층)**: Stanford(ADP) **22~25세 AI 노출 직업 고용이 덜 노출된 또래 추세보다 19% 낮음**(2026-06 기준; 2025-07 시점 15%), 같은 연령 고용 수준은 노출 상위 2분위 **-11%**, 하위 3분위 **+10%**(2022-11~2026-06). 경력 노동자는 격차 없음, 경제 전반의 대규모 대체 증거 없음(직접). 이전 판의 "13%"(2025-07 자료)와 "16%"(2025-09 자료)는 회귀 추정이라 같은 지표가 아니다.
7. **Challenger 감원 발표**: AI 사유 **2025년 54,836명**(전체 1,206,374의 약 4.5%), **2026년 1~9월 120,136명**(전체 573,195의 약 21%, 연초 이후 1위 사유). 단 전체 감원은 전년 동기 대비 **-39%**, AI는 8월 4위·9월 5위로 내려갔다(직접).
8. **반증도 같은 무게**: Yale Budget Lab(2025-10) 직업구성 변화가 인터넷 시기보다 약 1%p 빠를 뿐, OECD Employment Outlook 2026(2026-07) 청년 실업 악화에서 "LLM의 설명력은 제한적", NY Fed(2026-06) 원격근무가 청년 대졸 실업 증가의 **64%** 설명, Humlum·Vestergaard(덴마크) 소득·시간 **±2% 이내 0 효과**(직접).
9. **직업별 극단**: BLS 2025~35 전망에서 컴퓨터 프로그래머 **-7.3%**, 고객서비스 상담원 **-5.3%(-141.8천 명)**, 데이터 입력원 **-25.5%**, 사무·행정 지원직 **-4.0%(-752.1천 명)**. 반면 소프트웨어 개발자 **+10.2%**, 통역·번역가(Microsoft 적용가능성 1위, 0.492)조차 **+2.0%**(직접).
10. **직급**: 신입이 먼저 압박받는다는 자료(Stanford·Harvard 주니어 -9%·SignalFire 빅테크 신입 2019 대비 -50% 초과·IMF·Anthropic 설문)와, 신입 감소는 거시 요인·원격근무가 더 크다는 자료(OECD·NY Fed·St. Louis Fed 2차)가 공존한다. Amodei의 "신입 화이트칼라 절반, 실업률 10~20%, 1~5년"(2025-05)은 **예측이며** 2026-08 시점 실측은 그 규모에 한참 못 미친다.

---

## 1. 시기·규모 추정 (A)

### 1-1. 같은 기관이 시점을 달리해 낸 추정: 어떻게 앞당겨졌나

| 기관 | 이전 추정 | 갱신 추정 | 변화 | 비교 시 주의 |
| --- | --- | --- | --- | --- |
| McKinsey Global Institute | 2017-01: 업무활동 50% 자동화 중간 시점 **2055년**(±약 20년) | 2023-06: 같은 지표 **2045년**(범위 2030~2060). 이 보고서가 직전 모델을 **2053년(범위 2035~2070)** 으로 인용 | 약 **10년 단축**(2055→2045 또는 2053→2045) | 2017 보고서는 2016년 활동 기준, 2023은 2023년 활동 기준. 두 보고서 모두 세계 업무활동 기준 |
| McKinsey | 2017-01: 현재 기술로 자동화 가능 활동 약 50%(세계) | 2023-06: 생성AI+기존 기술로 직원 시간의 **60~70%**(세계) | 약 50% → 60~70% | 직원 시간 vs 업무활동 |
| McKinsey (미국) | 2030년 자동화 근로시간 **21.5%**(생성AI 없는 추정) | **29.5%**(생성AI 반영) | **+8.0%p** | 미국 근로시간. 2017 세계 중간 시나리오(15%)와 단순 비교 불가 |
| McKinsey (미국) | 2023-06: 60~70%(세계 직원 시간) | 2025-11: **57%**(미국 근로시간, 현재 입증 기술의 이론적 잠재) | 수치상 오히려 낮음 | 지표·지역·정의 모두 다름. '앞당김'의 증거로 쓰지 말 것 |
| Goldman Sachs | 2023-04: 미국 직업 약 2/3 노출, 노출 직업 업무 25~50% 대체 가능, 3억 개 일자리 노출 | 2025-08: 미국 노동력 **6~7%** 대체(3~14%) / 2026-06(2차): **>9%(약 1,500만 명)** | 노출 → 대체 규모로 추정 단위가 바뀜. 6~7% → >9% 상향은 2차 | 2023은 '노출', 2025·2026은 '대체'. 같은 지표가 아니다 |
| IMF | 2024-01: 세계 약 40%, 선진국 약 60% 노출 | 2026-01: "거의 40%" 유지 | **변화 없음** | 2026-01 블로그는 신규 스킬·신입 채용 쪽으로 초점 이동 |
| PwC | 2025-06: AI 기술 임금 프리미엄 **56%**(2024) | 2026-06: **62%**(전년 57%로 재서술) | 상승. 전년값이 56→57로 달리 표기됨 | 구인공고 기반, 대체 추정 아님 |

### 1-2. McKinsey Global Institute

| 지표 | 값 | 대상 | 기준시점 | 출처기관·저자 | 자료명 | URL | 확인경로 | 메모 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 업무활동 50% 자동화 중간 시점 | 2055년(±약 20년) | 세계 업무활동 | 2017-01-12 | MGI | A future that works | https://www.mckinsey.com/featured-insights/digital-disruption/harnessing-automation-for-a-future-that-works | 직접 | `[추정]` 원문 "could be automated by 2055, but this could happen up to 20 years earlier or later" |
| 2030년 자동화 근로시간 | 중간 시나리오 15%(범위 거의 0~30%) | 세계 근로시간 | 2017-11-28 | MGI(Manyika 외) | Jobs lost, jobs gained | https://www.mckinsey.com/featured-insights/future-of-work/jobs-lost-jobs-gained-what-the-future-of-work-will-mean-for-jobs-skills-and-wages | 직접 | `[추정]` 4억~8억 명이 일자리를 잃을 수 있고, 미국·독일은 2030년 노동력의 최대 1/3이 직업 범주를 바꿔야 함 |
| 50% 자동화 중간 시점(갱신) | 2045년(범위 2030~2060), 직전 2053년(2035~2070) | 세계 업무활동 | 2023-06-14 | MGI | The economic potential of generative AI | https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier | 직접 | `[추정]` "roughly a decade earlier than in our previous estimates" |
| 자동화 가능 직원 시간 | 60~70%(직전 약 50%) | 세계 | 2023-06-14 | MGI | 위와 동일 | 위와 동일 | 직접 | `[추정]` 자연어 이해가 필요한 활동이 총 근무시간의 25% |
| 관리·인재개발 활동 자동화 잠재 | 16%(2017)→49%(2023) | 세계, 활동유형 | 2023-06-14 | MGI | 위와 동일 | 위와 동일 | 직접 | `[추정]` 전문지식 적용 활동은 +34%p. 직급(중간관리자) 관련 |
| 2030 자동화 근로시간(미국) | 21.5%(생성AI 전) → 29.5%(후) | 미국 | 2023-07-26 | MGI(Ellingrud 외) | Generative AI and the future of work in America | https://www.mckinsey.com/mgi/our-research/generative-ai-and-the-future-of-work-in-america | 직접 | `[추정]` STEM·교육·창작·비즈니스/법률은 14~16%p 상승하나 "일자리를 없애기보다 강화"라는 해석 |
| 추가 직업 전환 | 2030까지 1,200만 건(2019~22 실측 860만 건) | 미국 | 2023-07-26 | MGI | 위와 동일 | 위와 동일 | 직접 | 감소 직군(음식서비스·고객서비스/영업·사무지원·생산)이 전환의 84% 초과(약 천만). 저임금층은 최고임금 대비 최대 14배, 여성은 1.5배 |
| 이론적 자동화 가능 근로시간 | 57%(에이전트 44%, 로봇 13%) | 미국 | 2025-11-25 | MGI(Yee 외) | Agents, robots, and us | https://www.mckinsey.com/mgi/our-research/agents-robots-and-us-skill-partnerships-in-the-age-of-ai | 직접 | `[추정]` "not a forecast of job losses", "adoption may take decades". 2030 중간 시나리오 경제가치 연 2.9조 달러, 요구 기술의 70% 초과는 자동화 가능·불가 업무 양쪽에 사용 |

### 1-3. Goldman Sachs Research

| 지표 | 값 | 대상 | 기준시점 | 출처 | 자료명 | URL | 확인경로 | 메모 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 노출 일자리 환산 | 3억 개 풀타임 | 세계(미국·유럽 자료 외삽) | 2023-04-05 기사 | Briggs·Kodnani | Generative AI could raise global GDP by 7% | https://www.goldmansachs.com/insights/articles/generative-ai-could-raise-global-gdp-by-7-percent | 직접 | `[추정]` 미국 직업 약 2/3 노출, 노출 직업 업무 25~50% 대체 가능. 원 보고서(3월) PDF는 미열람 |
| 대체 비중 | 6~7%(3~14%) | 미국 | 2025-08-13 | Briggs·Dong | How Will AI Affect the Global Workforce? | https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-global-workforce | 직접 | `[추정]` 실업률 +0.5%p, 현재 사용사례만이면 고용의 2.5% 위험. 생산성 +15% 가정 |
| 같은 문서의 실측·반증 | AI 노출과 고용·실업·해고 사이 유의한 상관 없음; 기술 노출 직업 20~30세 실업률 약 +3%p(2025년 초 이후) | 미국 | 2025-08-13 | 위와 동일 | 위와 동일 | 위와 동일 | 직접 | `[반증]`과 `[실측]`이 한 문서에 공존. 생성AI 실제 사용 기업 9.3% |
| 대체 비중 | 6~7%, 실업률 +0.6%p, 미국 근로시간 25% 자동화 가능 | 미국 | 2026-03-18 | Briggs | How Will AI Affect the US Labor Market? | https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-us-labor-market | 직접 | `[추정]` 10년 도입 가정 |
| 대체 비중(상향) | >9%(약 1,500만 명) | 미국 | 2026-06 | Briggs | Top of Mind "An AI Job Apocalypse?" | https://www.goldmansachs.com/pdfs/insights/goldman-sachs-research/an-ai-job-apocalypse/report.pdf | 2차(검색 요약; PDF 403) | `[추정]` 확정값으로 쓰지 말 것 |
| 고용 영향 | 직업 노출 10% 증가당 연 고용증가율 -0.1%p; 콜센터 고용 추세 대비 미국 -39%·캐나다 -33%·독일 -27%; 도입률 15~20% | 프랑스·캐나다·미국 등 | 2026-09-03 | Dong·Briggs | Is AI Impacting Global Labor Markets? | https://www.goldmansachs.com/insights/articles/is-ai-impacting-global-labor-markets | 직접 | `[실측]` "economy-wide hiring headwinds remain limited", 신입은 더 큰 역풍 가능 |

### 1-4. IMF · WEF · OECD · PwC

| 지표 | 값 | 대상 | 기준시점 | 출처 | 자료명 | URL | 확인경로 | 메모 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AI 노출 일자리 | 세계 약 40%, 선진국 60%, 신흥 40%, 저소득 26% | 국가군별 고용 | 2024-01-14 | IMF(Georgieva 블로그; 스태프 노트 Cazzaniga 외) | AI Will Transform the Global Economy | https://www.imf.org/en/blogs/articles/2024/01/14/ai-will-transform-the-global-economy-lets-make-sure-it-benefits-humanity | 직접 | `[추정]` 선진국 노출의 약 절반은 혜택, 약 절반은 핵심 업무 대체로 임금·채용 하락. 노트 본문(41쪽) 수치는 미열람 |
| 신규 스킬 요구 공고 / AI 취약 직업 고용 | 선진국 10%·신흥 5% / AI 스킬 수요 높은 지역에서 5년 뒤 3.6% 낮음 | 수백만 건 온라인 공고 | 2026-01-14 | IMF(Georgieva 블로그) | New Skills and AI Are Reshaping the Future of Work | https://www.imf.org/en/blogs/articles/2026/01/14/new-skills-and-ai-are-reshaping-the-future-of-work | 직접 | `[실측]` 중간숙련 사무직이 눌린다고 서술. 신입 직무의 AI 노출이 높음 |
| 2030 일자리 | 창출 1.7억, 소멸 9,200만, 순 +7,800만(현 고용의 22% 변동) | 세계, 고용주 1,000여 곳 설문 | 2025-01-08 | WEF | Future of Jobs Report 2025 | https://www.weforum.org/press/2025/01/future-of-jobs-report-2025-78-million-new-job-opportunities-by-2030-but-urgent-upskilling-needed-to-prepare-workforces/ | 직접 | `[추정]` 고용주 기대. AI·정보처리 변혁 86%, 감원 계획 41%(보도자료)·40%(요약본) |
| 감소 직무 | 서무·비서직 절대 감소 최대; 우편사무원·은행 창구직·데이터 입력원 가장 빠르게 감소 | 세계 고용주 | 2025-01-07 | WEF | 위 요약본 | https://www.weforum.org/publications/the-future-of-jobs-report-2025/digest/ | 직접 | `[추정]` |
| 청년 진입자 어려움과 LLM | "LLM의 설명력은 제한적" | 호주·캐나다·EU·미국 | 2026-07-07 | OECD | Employment Outlook 2026, 1장 | https://www.oecd.org/en/publications/oecd-employment-outlook-2026_7e710f54-en/full-report/from-resilience-to-risk-employment-and-wages-under-pressure_b599ad83.html | 직접 | `[반증]` 대졸 청년-전체 실업 격차가 팬데믹 이전부터 확대, LLM 급확산 시점에 전환점 없음. 증거는 "mixed", 대부분 미국. 결론은 잠정적 |
| 구인 증가(2019~24) | AI 노출 높은 직업 38%, 낮은 직업 65% | 근 10억 건 공고 | 2025-06-03 | PwC | 2025 Global AI Jobs Barometer | https://pwc.com/gx/en/news-room/press-releases/2025/ai-linked-to-a-fourfold-increase-in-productivity-growth.html | 직접 | `[실측]` 노출 직업도 증가했으나 덜 노출된 직업보다 느림. AI 기술 프리미엄 56% |
| 신입 구인 / 기업 인원 | AI 노출+상급 기술 요구 신입 직무 +35%(2019~), 그 밖의 신입 -10% / 최다노출 기업 인원 +52% vs 최소 +36% | 미국 신입 공고 240만 건 / 기업 | 2026-06-15 | PwC | 2026 Global AI Jobs Barometer | https://pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html | 직접 | `[실측]` AI 기술 프리미엄 62%. 보도자료만 열람, 전체 보고서는 미열람 |

---

## 2. 직업별 노출 (B)

### 2-1. 이론적 노출 지표

| 지표 | 값 | 대상 | 기준시점 | 출처 | 자료명 | URL | 확인경로 | 메모 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 노동력 노출 | 약 80%가 업무 10% 이상, 약 19%가 50% 이상 영향 | 미국 노동력 | 2023-03(v5 2023-08) | Eloundou·Manning·Mishkin·Rock | GPTs are GPTs | https://arxiv.org/abs/2303.10130 | 직접(arXiv v5) | `[추정]` 타임라인 예측 없음. 소프트웨어 반영 시 전 과업의 47~56% 단축 가능. Science 2024 게재본은 미열람 |
| 사람 분류 β 최상위 | 조사연구원 84.4, 작가 82.5, 통역·번역가 82.4, 홍보전문가 80.6, 동물과학자 77.8 | 직업 | 위와 동일 | 위와 동일 | 위와 동일 | 위와 동일 | 직접 | 완전 노출(ζ 100%) 직업 사람 분류 15개: 수학자·세무사·금융 계량분석가·작가·웹/디지털 인터페이스 디자이너 등. 모델 분류는 86개 |
| 모델 분류 ζ 100% | 회계사·감사, 뉴스 분석가·기자, 법률 비서·행정보조, 임상 데이터 관리자, 기후정책 분석가 | 직업 | 위와 동일 | 위와 동일 | 위와 동일 | 위와 동일 | 직접 | 직업군별 β>50% 비중: Job Zone 1 0%, 2 6.11%, 3 10.57%, 4 34.5%, 5 26.45% |
| Microsoft 적용가능성 상위 | 통역·번역가 0.492, 역사학자 0.462, 작가 0.454, 서비스 영업 0.449, CNC 프로그래머 0.419, 고객서비스 상담원 0.408, 텔레마케터 0.404 | 직업(Copilot 대화 20만 건) | 2025-07(v6 2025-12) | Tomlinson·Jaffe·Wang·Counts·Suri | Working with AI | https://arxiv.org/abs/2507.07935 | 직접(PDF 표 S3) | `[실측]` 상위 40은 CSV. 하위: 정맥채혈사 0.022, 수술보조 0.012, 하수처리 운영자 0.000 등 |
| Microsoft SOC 소분류 | 미디어·커뮤니케이션 0.38, 컴퓨터 0.29, 금융전문 0.23, 변호사 등 0.17, 진단·치료 의료인 0.13, 최고경영자 0.11, 법률지원 0.06 | 직군 | 위와 동일 | 위와 동일 | 위와 동일 | 위와 동일 | 직접(표 1) | 가장 흔한 AI 활동은 정보의 생성·처리·전달 |
| Felten AIOE | 최상위 직업: 텔레마케터, 영문·외국어·역사 등 대학 교수; 최상위 산업: 법률 서비스, 증권·상품·투자; 임금과 노출 양의 상관 | 직업·산업 | 2023-03(v2 2023-03-18) | Felten·Raj·Seamans | How will Language Modelers like ChatGPT Affect Occupations and Industries? | https://arxiv.org/abs/2303.01157 | 직접(초록) | `[추정]` 수치 표는 미열람. OECD·BLS가 이 지표를 입력으로 사용 |
| BLS 분류 | 831개 직업을 Felten·Eloundou·Eisfeldt(이론)와 Anthropic·Microsoft(관측) 5개 자료로 Low~Very high 4범주화 | 미국 | 2026(2025~35 전망과 함께) | BLS EP | AI exposure categories | https://www.bls.gov/emp/publications/ai-exposure-categories.htm | 직접 | "Exposure does not imply job loss" 명시. 직업별 범주표(xlsx)는 미열람 |

### 2-2. Anthropic Economic Index: 사용 비중과 자동화 대 증강

| 시점(자료 기준) | 지표 | 값 | 출처 | URL | 확인경로 | 메모 |
| --- | --- | --- | --- | --- | --- | --- |
| 2025-02-10 | Claude 대화 중 컴퓨터·수학 직군 / 예술·디자인·미디어 | 37.2% / 10.3% | Anthropic Economic Index | https://www.anthropic.com/news/the-anthropic-economic-index | 직접 | 직업의 약 36%가 과업의 25% 이상에 AI 사용, 약 4%가 75% 이상. 증강 57%·자동화 43% |
| 2025-09-15 | 지시형(directive) 대화 비중 / 1P API 자동화 vs 증강 | 27%→39% / 77% vs 12% | Anthropic Economic Index 보고서 | https://www.anthropic.com/research/anthropic-economic-index-september-2025-report | 직접 | 보고서가 "자동화가 증강을 처음 넘어섰다"고 서술. 분류 모델 변경 보정 시 지시형 45%(Sonnet 4는 49%) |
| 2026-01-15 (2025-11 자료) | Claude.ai 증강 / 자동화 | 52% / 45% | 위 시리즈 | https://www.anthropic.com/research/anthropic-economic-index-january-2026-report | 직접 | 2025-01에는 증강 56%·자동화 41%, 지시형은 8월 대비 11월 7%p 하락해 32%. 1P API는 자동화 약 3/4, 컴퓨터·수학 과업 API 52% vs Claude.ai 36% |
| 2026-03-05 | 관측 노출 상위 | 컴퓨터 프로그래머 75%, 고객서비스 상담원 2위, 데이터 입력원 67% | Massenkoff·McCrory | https://www.anthropic.com/research/labor-market-impacts | 직접 | 컴퓨터·수학 이론 가능 94% vs 관측 33%, 전체 노동자의 30%는 커버리지 0. 노출 10%p당 BLS 증가전망 -0.6%p |
| 2026-03-24 | 직업의 과업 중 최소 1/4을 Claude가 처리한 직업 비중 | 약 49% | Anthropic Economic Index(Learning curves) | https://www.anthropic.com/research/economic-index-march-2026-report | 직접 | 2025-02의 약 36%에서 증가(정의·표본 상이) |
| 2026-06-26 | 설문(약 9,700명) | 본인 실직 가능성 높다 10%, 주니어 동료 실직 확률 60% 초과로 본 응답 1/3 이상 | Anthropic Economic Index Survey(Cadences) | https://www.anthropic.com/research/economic-index-june-2026-report | 직접 | 인식 자료. 본인 실직 응답자의 38%가 AI를 원인으로 지목 |

### 2-3. 직업별 BLS 2025~35 전망과 노출 지표 대조 (`[추정]` 공식 전망)

| 직업 | 2025 → 2035 고용(천 명) | 변화율 | 노출 지표(예) | URL | 확인경로 |
| --- | --- | --- | --- | --- | --- |
| 컴퓨터 프로그래머 | 110.8 → 102.7 | -7.3% | Anthropic 75%(1위), Goldman 고위험 목록 첫째 | https://www.bls.gov/emp/tables/emp-by-detailed-occupation.htm | 직접 |
| 소프트웨어 개발자 | 1,717.8 → 1,892.6 | +10.2% | 이 직군은 BLS 전망에서도 증가 | 위와 동일 | 직접 |
| 고객서비스 상담원 | 2,666.0 → 2,524.1 | -5.3% | Anthropic 2위, Microsoft 0.408 | 위와 동일 | 직접 |
| 데이터 입력원 | 131.8 → 98.2 | -25.5% | Anthropic 67% | 위와 동일 | 직접 |
| 텔레마케터 | 60.9 → 47.8 | -21.4% | Microsoft 0.404, Felten 최상위 | 위와 동일 | 직접 |
| 사무·행정 지원직(대분류) | 18,792.7 → 18,040.5 | -4.0% | 주요 직군 중 가장 큰 감소(-752.1천) | 위와 동일 | 직접 |
| 부기·회계·감사 사무원 | 1,532.4 → 1,446.8 | -5.6% | Microsoft 금융 사무직 0.24 | 위와 동일 | 직접 |
| 회계사·감사 | 1,595.2 → 1,674.6 | +5.0% | Eloundou 모델 ζ 100% | 위와 동일 | 직접 |
| 변호사 / 준법률가 / 법률 비서 | 863.7→904.3 / 404.9→403.8 / 157.6→149.3 | +4.7% / -0.3% / -5.2% | Microsoft 변호사 0.17, 법률지원 0.06 | 위와 동일 | 직접 |
| 통역·번역가 | 73.9 → 75.4 | +2.0% | Microsoft 1위 0.492 | 위와 동일 | 직접 |
| 시장조사·마케팅 전문가 / 경영 분석가 | 952.7→1,019.0 / 1,077.1→1,186.3 | +7.0% / +10.1% | Microsoft 0.350 | 위와 동일 | 직접 |
| 의사 / 영상의학과 의사 / 간호사 | 808.8→837.9 / 28.7→29.6 / 3,465.4→3,660.1 | +3.6% / +3.4% / +5.6% | Microsoft 의료 진단·치료 0.13 | 위와 동일 | 직접 |
| 의료 구술 속기사 | 42.0 → 40.2 | -4.4% | 의료직 중 감소 | 위와 동일 | 직접 |
| 관리 직군 | 13,683.4 → 14,527.6 | +6.2% | Microsoft 최고경영자 0.11 | 위와 동일 | 직접 |

메모: 전체 고용은 +3.5%(공표 BLS TED 2026-09-21). BLS 스스로 "노출 범주는 고용 증감 예측이 아니다"라고 밝혔다. 노출 최상위(번역가)가 증가 전망이고 노출이 중간인 프로그래머가 감소 전망인 사례처럼, 노출 순위와 전망이 일치하지 않는다. 이 표는 순위와 전망의 병렬 제시일 뿐 인과가 아니다.

---

## 3. 이미 나타난 실제 고용 변화 (C)

### 3-1. 변화를 보여주는 자료 (`[실측]`)

| 지표 | 값 | 대상 | 기준시점 | 출처 | 자료명 | URL | 확인경로 | 메모 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 노출 직업 고용이 또래 추세보다 낮은 정도 | 19%(2025-07 시점 15%) | 22~25세, ADP 급여자료 | 2026-06 | Brynjolfsson·Chandar·Chen | Canaries in the Coal Mine? (2026-08판) | https://digitaleconomy.stanford.edu/app/uploads/2026/08/Canaries_August2026.pdf | 직접 | 경력 노동자 격차 없음; 주로 채용 감소 경로; 자동화형 AI 사용 직업에 집중, 보강형은 보합·증가; 임금(기본급)에는 아직 반영 안 됨 |
| 고용 수준 변화(2022-11~2026-06) | 노출 상위 2분위 -11%, 하위 3분위 +10% | 22~25세 | 2026-06 | 위와 동일 | 위와 동일 | 위와 동일 | 직접 | 이전 판 헤드라인: 13%(2025-07 자료), 16%(2025-09 자료)는 기업 충격을 통제한 회귀값 |
| 한계 서술 | 교육 통제 시 격차 약화, 일부 추세는 생성AI 이전부터, 국가 서베이보다 ADP에서 더 큼, "인과 추정 아님" | 위와 동일 | 2026-08 | 위와 동일 | 위와 동일 | 위와 동일 | 직접 | 같은 논문의 자기 반증 |
| 도입 기업 주니어 고용 | 6분기 후 -9%(비도입 기업 대비); 노출 높은 직업 주니어 -7%; 시니어는 추세 단절 없음 | 미국 이력서 6,500만 명·28만 개 기업; 도입 기업은 기업의 3.7%·고용의 약 16% | 2025Q1까지 | Hosseini·Lichtinger | Generative AI as Seniority-Biased Technological Change (2026-05판) | https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5425555 (원문 PDF는 저자 사이트) | 직접 | 주로 채용 둔화 경로. 2025-10판은 -7.7%로 서술(2차) |
| 빅테크 신입 | 채용 중 신입 7%; 2023 대비 -25%, 2019 대비 -50% 초과 | 미국 빅테크; 스타트업 신입 6% 미만(2019 대비 -30% 초과) | 2024 | SignalFire | State of Tech Talent 2025 | https://signalfire.com/blog/signalfire-state-of-talent-report-2025 | 직접 | SignalFire 자신이 금리 정상화·과잉채용 반동이 AI보다 클 수 있다고 서술 |
| AI 사유 감원 발표 | 2025년 54,836명(전체 1,206,374), 2023년 이후 누계 71,825명 | 미국 발표 감원 | 2025 | Challenger, Gray & Christmas | December 2025 Report | https://www.challengergray.com/wp-content/uploads/2026/01/Challenger-Report-December-2025.pdf | 직접 | 발표 기준·고용주가 밝힌 사유 기준 |
| AI 사유 감원 발표(2026) | 1~9월 120,136명(전체 573,195의 약 21%, 연초 이후 1위 사유); 9월 3,961명(5위); 8월 3,462명 | 미국 | 2026-09 | 위와 동일 | September 2026 Report | https://www.challengergray.com/wp-content/uploads/2026/10/Challenger-Report-September-2026.pdf | 직접 | AI는 2026-03~07 월간 1위 사유였고, 2025-12에는 142명이었다 |
| 기술직 청년 실업 | 기술 노출 직업 20~30세 실업률 +약 3%p(2025년 초 이후); 콜센터 고용 추세 대비 -39% | 미국 | 2025 / 2026-09 | Goldman Sachs Research | 위 1-3 참조 | 위 1-3 참조 | 직접 | |
| 청년 고용 비중 | 20~24세 중 가장 AI 노출 직업 종사 비중 16.4%(2022-11) → 15.5%(2025-09) | 미국 CPS | 2025-09 | Dallas Fed(Atkinson·Yamco) | Young workers' employment drops in occupations with high AI exposure | https://www.dallasfed.org/research/economics/2026/0106 | 직접 | 해고가 아니라 직접 입직 감소가 원인; 집계 실업률에는 작은 영향이라고 결론 |
| 신규 취업률 | 22~25세의 노출 직업 신규 취업률 2022 대비 -14%(간신히 유의) | 미국 CPS | 2024~2026 | Anthropic(Massenkoff·McCrory) | Labor market impacts of AI | https://www.anthropic.com/research/labor-market-impacts | 직접 | 실업률은 변화 없음(아래 반증) |
| 최근 대졸자 실업률 | 5.6%(2026-03), 3.6%(2019-03) | 미국 22~27세 | 2026-03 | New York Fed | 보도자료 | https://www.newyorkfed.org/newsevents/mediaadvisory/2026/0528-2026 | 직접 | 원인은 별개(아래) |

### 3-2. 반증·상충 자료 (`[반증]`)

| 지표 | 값 | 대상 | 기준시점 | 출처 | 자료명 | URL | 확인경로 | 메모 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 직업구성 변화 속도 | 인터넷 시기 대비 약 1%p 높은 경로; 노출·자동화·보강 지표와 고용·실업 변화 무관; 직업군 비중 29/46/18% 안정 | 미국 CPS, ChatGPT 후 33개월 | 2025-09 | Yale Budget Lab·Brookings(Gimbel·Kinder·Kendall·Lee) | Evaluating the Impact of AI on the Labor Market | https://budgetlab.yale.edu/research/evaluating-impact-ai-labor-market-current-state-affairs | 직접 | 2025-10-01. 청년 대졸자 구성 격차는 약간 확대되나 소표본·거시 둔화와 구분 못 함. 2026-03 월간 업데이트 "모두 평탄"은 2차 |
| 청년 어려움에서 LLM의 역할 | "제한적" | 4개 지역 | 2026-07-07 | OECD | Employment Outlook 2026 | https://www.oecd.org/en/publications/oecd-employment-outlook-2026_7e710f54-en/full-report/from-resilience-to-risk-employment-and-wages-under-pressure_b599ad83.html | 직접 | 연구 상충 인정: 효과 없음(Chen·Stratton 2026, Gimbel 등, Humlum·Vestergaard) vs 청년 불리(Brynjolfsson 등, Lichtinger 등, Azar 등). 노출 직업이 거시 충격에 민감해 오귀인 가능 |
| 구인 공고 | AI로 인한 별도 노동수요 꺾임 징후 거의 없음; 노출 직업 공고 감소는 ChatGPT 이전부터 | 미국 Lightcast | 2026-05-14 | New York Fed(Audoly·Guerin·Topa) | Do Job Postings Show Early Labor-Market Effects of AI? | https://libertystreeteconomics.newyorkfed.org/2026/05/do-job-postings-show-early-labor-market-effects-of-ai/ | 직접 | 인력의 40%는 노출 0, 노출 0.4 이상은 10% 미만 |
| 청년 대졸 실업 원인 | 원격근무가 증가의 64% 설명(청년 실업 3.1%→3.7%) | 미국 29세 미만 | 2022~25 vs 2017~19 | New York Fed(Emanuel·Harrington·Pallais) | Remote Work Leaves Younger Workers Sidelined | https://libertystreeteconomics.newyorkfed.org/2026/06/remote-work-leaves-younger-workers-sidelined/ | 직접 | AI 요인은 부차적으로 언급 |
| 소득·근로시간 | ChatGPT 후 2년 시점 2% 초과 효과 배제(정밀한 0) | 덴마크 노출 직업, 행정자료 | 2026-03 개정 | Humlum·Vestergaard | NBER w33777 | https://www.nber.org/papers/w33777 | 직접 | 직업 전환과 업무 재편은 발생. 근로자 단위·사업장 단위 모두 0 |
| 실업률 | 고노출 노동자 실업 체계적 증가 없음 | 미국 CPS | 2026 | Anthropic | Labor market impacts of AI | https://www.anthropic.com/research/labor-market-impacts | 직접 | 감지 가능한 효과 크기 약 1%p. "10%의 직업이 사라지면" 같은 시나리오와 대조 |
| 경제 전반 고용 | 직업 노출 10%당 연 고용증가 -0.1%p; "limited" | 프랑스·캐나다·미국 | 2026-09 | Goldman Sachs Research | Is AI Impacting Global Labor Markets? | 1-3 참조 | 직접 | |
| 청년 실업 상승 기여 | AI 관련 수요 1.1%p vs 구인 부족 2.9%p (18~24세, 2023-04~2025-12) | 미국 | 2026 | St. Louis Fed(Rodgers·Kassens) | Bloomberg Law 보도 | https://news.bloomberglaw.com/daily-labor-report/weak-hiring-is-hurting-young-workers-more-than-ai-study-says | 2차 | Fed 원문 미열람 |
| 전체 감원 | 2026년 1~9월 감원 발표 -39%(전년 동기) | 미국 | 2026-09 | Challenger | September 2026 Report | 3-1 참조 | 직접 | AI 사유 비중 증가는 사유 배분의 변화일 수 있음. Forrester는 'AI 핑계' 가능성(2차) |
| 기업 인원 / 구인 | 최다노출 기업 인원 증가 52% vs 36%; 노출 직업 구인도 38% 증가 | 기업·공고 | 2025~2026 | PwC | Barometer 2025·2026 | 1-4 참조 | 직접 | 구인공고 기반 |

---

## 4. 연구소·기업 리더 발언과 실제 결과 (D)

| 인물·기업 | 발언·사건(날짜) | 수치 | 결과·후속 | 출처 URL | 확인경로 | 메모 |
| --- | --- | --- | --- | --- | --- | --- |
| Dario Amodei(Anthropic CEO) | 2025-05-28 Axios: AI가 신입 화이트칼라 일자리의 절반을 없애고 실업률을 10~20%로 올릴 수 있다, 1~5년 | 50%, 10~20% | 2026-01 에세이 "The Adolescence of Technology"에서 "50% of entry-level white-collar jobs over 1–5 years"를 유지(자기 인용). 2026-06 현재 실측은 Stanford 19%·실업률 증가 없음(Anthropic 자체 연구)으로 예측 규모에 못 미침 | https://www.axios.com/2025/05/28/ai-jobs-white-collar-unemployment-anthropic ; https://www.darioamodei.com/essay/the-adolescence-of-technology | 직접 | `[발언]` 기간이 아직 끝나지 않았으므로 맞고 틀림은 판정 불가 |
| Andy Jassy(Amazon CEO) | 2025-06-17 직원 공지: 생성AI·에이전트로 향후 몇 년 내 회사 전체 사무직 인력이 줄 것 | 수치 없음 | 2025-10-28 약 14,000명, 2026-01-28 약 16,000명 감원 발표(경영진이 AI 언급). 회사는 효율·조직개편으로 설명 | https://www.aboutamazon.com/news/company-news/amazon-ceo-andy-jassy-on-generative-ai | 공지는 직접, 감원 수치는 2차(검색 요약) | `[발언]` 감원이 AI로 인한 것인지는 확정 못 함 |
| Marc Benioff(Salesforce CEO) | 2025-09 Logan Bartlett Show: 고객지원 인력 9,000명 → 약 5,000명, 고객 대화 절반을 AI가 처리 | -4,000명 | 회사는 재배치·충원 중단·영업과의 재균형으로 설명, 감원 공시 없음(2차). 사람이 못 하던 AI 한계도 인정 | https://www.theregister.com/2025/09/02/salesforce_4000_jobs_ai | 직접(The Register 본문) | `[발언]` 직접 청취 아님 |
| Sebastian Siemiatkowski(Klarna CEO) | 2024-02: AI 어시스턴트가 상담원 700명 몫, 채팅 75% 처리 | 700명, 75% | 2024-12까지 1년 채용 동결로 직원 -22%(3,500명, 대부분 자연감소). **2025-05 Bloomberg: 품질이 낮아 사람 상담원을 다시 채용** | https://www.entrepreneur.com/business-news/klarna-ceo-reverses-course-by-hiring-more-humans-not-ai/491396 | 직접(Entrepreneur 본문) | **역전 사례**. 총인력은 5,527(2022)→3,422(2024)로 줄었다는 IPO 서류 인용은 2차 |
| Commonwealth Bank of Australia | 2025-07 음성봇 도입으로 고객서비스 45개 직무 정리 → 2025-08-21 철회·사과 | 45개 직무 | 노조가 통화량이 오히려 늘었다고 주장, 은행이 "직무가 불필요하지 않았다"고 인정 | https://www.hcamag.com/au/specialisation/hr-technology/cba-reverses-ai-triggered-employee-layoffs/546887 | 2차(검색 요약) | `[반증]` 호주 사례 |
| Kristalina Georgieva(IMF) | 2026-01 다보스: AI가 노동시장에 쓰나미, 신입 직무가 하는 과업이 제거되기 쉬움 | 영향 일자리 선진국 약 60%·세계 약 40% | 같은 달 IMF 블로그는 "거의 40%"만 서술 | https://fortune.com/2026/01/23/imf-chief-warns-ai-tsunami-entry-level-jobs-gen-z-middle-class/ | 2차(검색 요약) | |
| Forrester / Gartner 예측 | Forrester 2025-10: AI 사유 감원의 절반이 해외·저임금으로 재채용, 고용주 55% 후회 / Gartner: 2027년까지 고객서비스 감원 기업의 50% 재채용 | 50%, 55% | 예측이며 실측 아님 | https://hrexecutive.com/the-ai-layoff-trap-why-half-will-be-quietly-rehired/ | 2차 | `[반증·예측]` |

---

## 5. 직급(신입·중간관리자·임원)별 영향 (E)

| 직급 | 지표 | 값 | 출처 | 기준시점 | URL | 확인경로 | 메모 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 신입 | 22~25세 노출 직업 고용 격차 | 19%(경력자 격차 없음) | Stanford(ADP) | 2026-06 | https://digitaleconomy.stanford.edu/app/uploads/2026/08/Canaries_August2026.pdf | 직접 | `[실측]` |
| 신입 | 도입 기업 주니어 고용 | -9%(시니어 추세 단절 없음) | Harvard Hosseini·Lichtinger | 2025Q1까지 | https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5425555 | 직접 | `[실측]` |
| 신입 | AI 노출 신입 직무 구인 | +35%(상급 기술 요구) vs 기타 신입 -10% | PwC | 2019~2026 | https://pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html | 직접 | `[실측]` 신입이 '시니어화'되는 쪽은 늘고 나머지는 줄어듦 |
| 신입 | 빅테크 신입 채용 | 2019 대비 -50% 초과, 2023 대비 -25%; 경력 2~5년 채용 +27%는 2차 | SignalFire | 2024 | https://signalfire.com/blog/signalfire-state-of-talent-report-2025 | 직접(신입)·2차(경력 +27%) | `[실측]` |
| 신입 | 신입 인식 | 주니어 동료 실직 확률 60% 초과로 본 응답자 1/3 이상; 신입 근로자가 AI가 자기 업무의 가장 큰 몫을 할 수 있다고 보고 실직 우려도 가장 큼 | Anthropic Economic Index Survey | 2026-06-26 | https://www.anthropic.com/research/economic-index-june-2026-report | 직접 | 인식 |
| 신입(반증) | 청년 실업과 LLM | 설명력 제한적 / 원격근무 64% | OECD, NY Fed | 2026-06~07 | 3-2 참조 | 직접 | `[반증]` |
| 중간관리자 | 관리·인재개발 활동 자동화 잠재 | 16%(2017)→49%(2023) | McKinsey MGI | 2023-06 | https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier | 직접 | `[추정]` 활동 단위. 직무 소멸 추정 아님 |
| 중간관리자 | 관리직 AI 적용가능성 | 광고·마케팅·PR·영업 관리자 0.18, 운영 전문 관리자·기타 경영직 0.14 | Microsoft | 2025-12(v6) | https://arxiv.org/abs/2507.07935 | 직접 | `[실측]` |
| 중간관리자 | 조직 평탄화 예측 | 2026년까지 20% 조직이 중간관리직 절반 초과 제거 | Gartner | 2024-10 | https://futurecio.tech/gartner-unveils-top-predictions-for-it-organisations-and-users-in-2025-and-beyond | 2차 | `[추정]` 예측일 뿐 실측 확인 못 함 |
| 중간관리자 | 중간숙련 사무직 압박 | "중간숙련 일자리가 눌린다" | IMF | 2026-01-14 | https://www.imf.org/en/blogs/articles/2026/01/14/new-skills-and-ai-are-reshaping-the-future-of-work | 직접 | 중간관리자와 중간숙련 사무직은 다른 개념 |
| 임원 | 최고경영자 적용가능성 | 0.11(하위권) | Microsoft | 2025-12(v6) | https://arxiv.org/abs/2507.07935 | 직접 | `[실측]` |
| 임원 | 대체 위험이 가장 낮은 직업 | 최고경영자 포함 | Goldman Sachs | 2025-08-13 | https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-global-workforce | 직접 | `[추정]` |
| 임원(상충) | Eloundou β 노출 5분위의 ADP 표본 내 최대 직업 1위 | 최고경영자 | Stanford 부록 표 D.2 | 2026-08 | https://digitaleconomy.stanford.edu/app/uploads/2026/08/Canaries_August2026.pdf | 직접 | 지표에 따라 임원 노출 평가가 정반대. 어느 쪽도 대체 예측이 아님 |
| 전 직급 | 관리 직군 BLS 전망 | +6.2%(13,683.4→14,527.6천 명) | BLS | 2025~35 | https://www.bls.gov/emp/tables/emp-by-detailed-occupation.htm | 직접 | `[추정]` 가장 큰 변화 폭은 사무·행정 지원직(-4.0%) |

---

## 6. 읽을 때 주의할 점

1. **노출·적용가능성·이론적 잠재 ≠ 대체.** McKinsey 57%, Eloundou 80%/19%, IMF 40%/60%, Microsoft 점수, BLS 범주는 모두 "AI가 도울 수 있는 정도"다. BLS와 McKinsey가 각자 "일자리 감소 예측이 아니다"라고 명시했다.
2. **'앞당겨짐'은 같은 지표를 같은 기관이 갱신한 경우에만 말할 수 있다.** McKinsey의 50% 자동화 중간 시점(2055/2053→2045)과 미국 2030 자동화 시간(21.5%→29.5%)은 연속선이다. 57%(2025)와 60~70%(2023)는 정의가 달라 비교하지 않는다. Goldman의 2023 '노출'과 2025·2026 '대체 비중'도 다른 지표다.
3. **Stanford 수치 13%·16%·19%는 같은 지표가 아니다.** 13%(2025-07 자료)·16%(2025-09 자료)는 기업 충격을 통제한 회귀 추정이고, 19%는 단순 격차(kept-pace shortfall)이며 같은 지표로 2025-07 시점은 15%였다(원문).
4. **기관 간 상충은 자료와 지표의 차이로 설명된다.** ADP 급여(Stanford)는 격차가 크고, 국가 서베이(CPS)·구인공고(NY Fed·OECD)는 작거나 없다. 노출 직업이 정보·금융·전문서비스 등 금리·경기에 민감한 산업에 몰려 있다는 점이 거시 요인 오귀인 가능성의 핵심이다(OECD 서술).
5. **Challenger는 '발표된 감원'과 '고용주가 밝힌 사유'다.** 실제 해고·사유의 정확성은 보장되지 않는다.
6. **WEF 숫자는 고용주 기대 설문이고 McKinsey·Goldman은 모델 추정이다.** 측정이 아니다.
7. **리더 발언은 이해관계가 있다**(AI 판매 기업의 CEO 발언 등). 발언의 수치와 실측을 같은 열에 두지 않았다.

---

## 7. 미확인 (확인하지 못했거나 2차로만 본 것)

- **Eloundou et al. Science 2024 게재본**의 권·쪽과 본문 수치: arXiv v5(2023-08)만 열람. 게재본과 동일한지 미확인.
- **Goldman Sachs 원 보고서**: 2023-03 Global Economics Analyst PDF(미열람; 기사 날짜 2023-04-05만 확인), 2026-06 Top of Mind PDF(403), 2026-04 Peng 노트(월 1.6만 개 순감소는 저신뢰 블로그 2차). "사무직 46%·법률 44%" 같은 직업별 업무 노출 수치는 확인하지 못해 싣지 않았다.
- **IMF**: 스태프 디스커션 노트 본문(41쪽)의 직업·연령 수치는 미열람. 2026-10-16자 IMF 블로그 "The World Can't Afford to Get AI Wrong"은 페이지 본문을 가져오지 못함. 다보스 발언은 검색 요약(2차).
- **OECD**: Employment Outlook 2023의 AI 장(고위험 직업 비중 등)과 2026-06 Economic Outlook은 열람하지 못했다. 2026 EO가 인용한 EIG(Curto Millet·Iscenko), Chen·Stratton, Frank 등, Lodefalk 등의 원문은 미열람.
- **PwC 2026**: 전체 보고서 PDF 미열람(보도자료만). 2025 보도자료의 지역별 판은 미비교.
- **Anthropic**: Economic Index 보고서의 직업별 그림 수치(Figure 3의 상위 10 전체), 2026-04 "81,000명" 글, 인터랙티브 Job explorer는 미열람.
- **Stanford**: 소프트웨어 개발자·고객서비스 연령별 고용 수치는 그림뿐이라 읽지 못했다(2025-08 판의 "소프트웨어 개발자 22~25세 감소폭" 등은 확인하지 못해 싣지 않음). 2025-11판 원문은 열지 않았고 그 수치는 2026-08판의 서술로만 확인.
- **Hosseini·Lichtinger**: 2025-10판 -7.7%는 검색 요약(2차). 2026-05판 -9%만 직접.
- **BLS**: AI 노출 범주 보조표(xlsx)의 직업별 범주는 열지 않았다. 2024~34 이전 전망과의 비교도 하지 않았다. 고객서비스·프로그래머 둘의 OOH 페이지에서 BLS가 감소 이유를 AI로 설명하는 문장은 찾지 못했다.
- **기업 사례**: Amazon 감원 수치(14,000/16,000)와 'AI 때문'이라는 연결은 검색 요약(2차)이며 Amazon 공식 발표문은 미열람. Salesforce는 발언을 보도한 기사로만 확인. Klarna의 Bloomberg 원 인터뷰, 2026 인력 규모, CBA의 Bloomberg 원 기사도 미열람(Klarna 5,527→3,422는 2차).
- **St. Louis Fed·Yale 2026-03 업데이트·SignalFire 2026**: 각각 Bloomberg Law 요약, 검색 요약, 2차 매체로만 확인(SignalFire 2026의 "65% 감소" 등은 싣지 않음). NACE "2026 신입 채용 +5.6%"도 2차 스니펫뿐이라 싣지 않음.
- **한국 자료**는 이 파일 범위가 아니다(`korea_signals.csv` 참조).

# AGI 도달 예상 시기와 AI-자동화 AI R&D의 실측 수치

접근일: 2026-10-16 (WebSearch·WebFetch로 확인. 모든 수치는 아래 '확인경로' 열에 읽은 위치를 적었다.)

## 요약

- 전문가 설문의 AGI(HLMI) 50% 시점은 AI Impacts 설문 네 번에서 2061(2016) → 2059/2060(2022) → 2047(2023) → 2042(2024)로 앞당겨졌다. 8년 사이 예측 지평이 45년 후에서 18년 후로 줄었다(2026-09 AI Impacts 보고서, 직접 확인).
- Metaculus 커뮤니티 중앙값은 2차 인용이 흩어져 있고(Metaculus 원문은 이 환경에서 403), 2022-03 2058 → 2022-07 2040 → 2023-03 2031 → 2024-01 2031 → 2025-02 약 2030 → 2026 2033이다. 2022~2023에 크게 당겨졌지만 2025~2026에는 오히려 약 2년 뒤로 물러났다. "계속 앞당겨지는 중"이라고 단순화하면 안 된다.
- 재귀적 자기개선 실측: METR 50% 시간지평은 2024-03 4.0분(Claude 3 Opus) → 2026-02 718.8분(Claude Opus 4.6) → 2026-04 1,044.8분(Claude Mythos Preview 초기판)이다. METR 파일의 배가 주기는 전체 기간 187.8일, 2023년 이후 128.7일(95% 구간 104.4~158.0일)이다(원문 7개월보다 짧아짐). 단 Mythos 이후 신뢰 가능한 측정 상한(16시간)에 닿았고, GPT-5.6 Sol은 11.3시간(CI 5~40시간)으로 METR 스스로 견고한 측정이 아니라고 했다.
- 연구소 발언은 '목표'와 '예측'이 섞여 있다. OpenAI는 2026-09 '자동화 연구 인턴' 목표를 달성했다고 밝혔다(2026-09-06 글, 내용은 2차 요약으로 확인). 다음 목표는 2028-03 '자동화 AI 연구자'. Anthropic은 2025-03 정부 제출 문서에서 강력한 AI가 "late 2026 or 2027"에 올 수 있다고 썼다.
- 사내 코드 중 AI 비율은 공식 수치가 모두 자체 보고다: Google 신규 코드의 약 25%(2024-10) → 75%(2026-04, 보도), Anthropic 70~90%(2026-01 대변인)·"90 plus percent"(2026-05 CFO). 전부 2차 확인이고 정의가 제각각이다.

---

## A. 예측 시기 이동 시계열

### A1. AI Impacts 전문가 설문(ESPAI) — HLMI·FAOL

HLMI = 기계가 모든 과제를 사람보다 낫고 싸게 해내는 시점, FAOL = 모든 직업이 완전 자동화 가능한 시점. 값은 평균 집계(mean aggregate) 곡선에서 읽은 연도다. 재집계로 일부 수치가 설문 간 소폭 바뀐다는 점은 메모 열에 표시했다.

| 지표 | 값 | 기준시점 | 출처기관·저자 | 자료명 | URL | 확인경로 | 메모 |
|---|---|---|---|---|---|---|---|
| HLMI 50% 연도 (2016 설문) | 2061 | 2016 | AI Impacts, Grace et al. | Advanced AI according to 1,580 researchers (2026-09) | https://aiimpacts.org/wp-content/uploads/2026/09/ESPAI2024.pdf | 직접(PDF 본문 1쪽) | 2016년 시점 지평 45년 후 |
| HLMI 50% 연도 (2022 설문) | 2059 (재집계 후 2060) | 2022-06~08 | 같음 | 같음 + 2022 설문 페이지 | https://aiimpacts.org/2022-expert-survey-on-progress-in-ai | 직접(2026 PDF 본문: 각주 "2023년 보고서에는 2060"), 직접(2022 페이지: 2059, 738명·응답률 17%) | 2022 페이지 값 2059, 2023 논문은 2060으로 인용. 코드·정제 변경 때문 |
| HLMI 50% 연도 (2023 설문) | 2047 | 2023-10-15~24 | Grace et al. | Thousands of AI Authors on the Future of AI | https://arxiv.org/abs/2401.02843 | 직접(abstract), 직접(arxiv HTML v3) | 응답 2,778명, HLMI 집계 n=1,714, 응답률 15% |
| HLMI 50% 연도 (2024 설문) | 2042 | 2024-12 | Grace, Simonelli, Weinstein-Raun, Krueger, Young, Duffy, Adamczewski, Reeve, Beck | 같음(2026-09) | https://aiimpacts.org/wp-content/uploads/2026/09/ESPAI2024.pdf | 직접(PDF 본문: 초록·Table 1) | 응답 1,580명(응답률 10%). 2023 대비 5년 앞당김, 2022→2023은 12~13년 |
| HLMI 10% 연도 | 2029(2022) → 2027(2023) → 2027(2024) | 각 설문 | 같음 | arXiv v3 / ESPAI2024 Table 1 | https://arxiv.org/html/2401.02843v3 | 직접 | 2023→2024 변화 0년 |
| FAOL 50% 연도 | 2164(2022, 2023 논문 인용) → 2116(2023) → 2098(2024) | 각 설문 | 같음 | arXiv v3 / ESPAI2024 | https://aiimpacts.org/wp-content/uploads/2026/09/ESPAI2024.pdf | 직접 | 2026 보고서는 재집계로 2022=2158, 2023=2115로 적음. 2023→2024 17년, 2022→2023 43년 앞당김. HLMI와의 격차 56년이 가장 작음 |
| FAOL 10% 연도 | 2037(2023) → 2035(2024) | 2023, 2024 | 같음 | ESPAI2024 Table 1 | https://aiimpacts.org/wp-content/uploads/2026/09/ESPAI2024.pdf | 직접 | |
| 지평 단축 속도 | 8년간 지평 45년 후 → 18년 후, 흐른 1년당 약 3.4년씩 가까워짐 | 2016~2024 | 같음 | ESPAI2024 도입부 | 위와 같음 | 직접 | 보고서 자체 요약 문장 |
| "AI가 거의 모든 R&D를 하면 5년 안에 기술 진보가 10배 이상 빨라지는 되먹임이 성립" 논증이 broadly correct일 확률 평가 '매우 그럴듯함(81–100%)' 비율 | 4% (2016 12%, 2022 7%, 2023 9%) | 2024-12 | 같음 | ESPAI2024 3.4절 | 위와 같음 | 직접 | 지능 폭발 논증에 대한 전문가 동의는 오히려 줄었다. n=189 |
| HLMI 이후 2년 내 기술 진보 10배 확률(중앙값) / 30년 내 | 20% / 80% (2023과 동일) | 2024-12 | 같음 | ESPAI2024 Table 2 | 위와 같음 | 직접 | 평균 30.3% / 71.6%, n=173/172 |

### A2. Metaculus 커뮤니티 예측 (질문 5121 'general AI', 3479 'weakly general AI')

Metaculus 원문 페이지(www.metaculus.com/questions/5121/, /3479/, /api/posts/5121/)는 WebFetch가 403으로 거부했다. 아래 값은 모두 인용 글을 통해 읽은 2차 확인이다. 시점은 인용 글의 작성일이며 Metaculus 과거 이력 그래프를 직접 읽은 것이 아니다.

| 지표 | 값 | 기준시점 | 출처기관·저자 | 자료명 | URL | 확인경로 | 메모 |
|---|---|---|---|---|---|---|---|
| 5121 중앙값 | 2058 | 2022-03 | Our World in Data(글), Metaculus 인용 | AI timelines: What do experts in artificial intelligence expect for the future? (2023-02-07) | https://ourworldindata.org/ai-timelines | 2차 | 2022-03 값. "devised, tested, publicly announced" 문구 |
| 5121 중앙값 | 2040 | 2022-07, 2022-11 | 같음 | 같음 | https://ourworldindata.org/ai-timelines | 2차 | 2022년 봄 한 번에 약 10년 앞당겨짐. 예측자 315명 |
| 5121 중앙값 | 2031-10 (전 해 mid-2057) | 2023-03-26 | The Decoder | Forecasting community Metaculus predicts human-like AI by 2026 | https://the-decoder.com/forecasting-community-metaculus-predicts-human-like-ai-by-2026/ | 2차 | 기사는 이 값을 '강한 AGI'(2시간 적대적 튜링 테스트+로봇 능력)로 서술. 1년 전 값과의 차 약 25년 |
| 5121 중앙값 | 2031-01-26 | 2024-01-02 | LessWrong 글 "Are Metaculus AI Timelines Inconsistent?" | 같음 | https://www.lesswrong.com/posts/FCgpT4sj5BSEdeHHy/are-metaculus-ai-timelines-inconsistent | 2차 | |
| 5121 중앙값 / 사분위 | 약 2030 중반(mid-2030) / 2026-12-28~2039-03-27 | 2025-02-04 | Alvin Ånestrand, Forecasting AI Futures(Substack) | Forecasting AGI: Insights from Prediction Markets and Metaculus | https://forecastingaifutures.substack.com/p/forecasting-agi-insights-from-prediction-markets | 2차 | 글 작성 시점 값 |
| 5121 25% / 50% 시점 | 25%: 2027(2025-01 스냅샷), 이후 25%=2029, 50%=2033 | 2025-01 → 2026-02 | 80,000 Hours | Shrinking AGI timelines: a review of expert forecasts (2025-03-21, 2026-02-04 수정) | https://80000hours.org/2025/03/when-do-experts-expect-agi-to-arrive/ | 2차(직접 읽은 글이 Metaculus를 인용) | 최근 1년간 25%·50% 시점이 각각 약 2년 뒤로 이동. 응답 약 2,000개 |
| 5121 중앙값 | 2033-01 (25%는 2029까지) | 2026-07 중순 | AIToolsReview | AGI Timeline: Metaculus, Polymarket & Kalshi Odds (September 2026) | https://aitoolsreview.co.uk/insights/agi-timeline-predictions-2026 | 2차(출처 링크 없음) | 예측자 1,800명 이상 |
| 5121 중앙값 | 2033 | 2026-08 | AIMultiple | AGI/Singularity: 10,000 Predictions Analyzed | https://aimultiple.com/artificial-general-intelligence-singularity-timing | 2차(페이지가 "원출처 미검증"이라고 밝힘) | 참여 1,900명 |
| 3479 'weakly general AI' 중앙값 | 2050 | 2020 초 | The Decoder | 같음 | https://the-decoder.com/forecasting-community-metaculus-predicts-human-like-ai-by-2026/ | 2차 | 예측자 약 20명 시절 |
| 3479 중앙값 | 2042-10 (1년 전) → 2026-01 (현재) | 2022-03경 → 2023-03-26 | 같음 | 같음 | 위와 같음 | 2차 | 예측자 747명 |
| 3479 중앙값 | 2026-04-14 | 2024-01-02 | LessWrong 글 | 같음 | https://www.lesswrong.com/posts/FCgpT4sj5BSEdeHHy/are-metaculus-ai-timelines-inconsistent | 2차 | |
| 3479 중앙값 / 구간 | 2026-10-10 / 2025-09-05~2029-04-27 | 2025-02-24 | Ånestrand 글 독자 댓글 | 같음 | https://forecastingaifutures.substack.com/p/forecasting-agi-insights-from-prediction-markets | 2차(독자 댓글, 신뢰도 낮음) | |
| 3479 중앙값 | 2028 (2026-07엔 2028-06) | 2026-07~08 | AIMultiple / AIToolsReview | 위 두 글 | 위 두 URL | 2차 | 2026-10 라이브 값은 못 읽음 |

해석 주의: 5121은 로봇 능력까지 요구하고(80,000 Hours는 정의가 "로봇에 너무 엄격하고 장기 자율성·새 과학 통찰에는 너무 느슨"하다고 평가), 3479는 인지 능력만 본다. 두 질문을 한 선에 이어 붙이지 말 것.

### A3. 기타 예측 집계·제작자 갱신

| 지표 | 값 | 기준시점 | 출처기관·저자 | 자료명 | URL | 확인경로 | 메모 |
|---|---|---|---|---|---|---|---|
| Kokotajlo AGI 중앙값 | 2027(2024-01~2025-01) → 2028(2025-02, 04) → 약 2030.0(2025-08) → 2030(2025-11) → 2030.95(2026-01) | 2024-01~2026-01 | AI Futures Project | Clarifying how our AI timelines forecasts have changed since AI 2027 | https://blog.aifutures.org/p/clarifying-how-our-ai-timelines-forecasts | 직접(저자 글 표) | 2018=2070, 2020 초=2050도 같은 표에 있으나 "Metaculus에서 추정"한 값 |
| Lifland AGI 중앙값 | 2060(2021) → 2050(2022-07) → 2038(2024-01) → 2032(2024-12) → 2031(2025-04) → 2033(2025-07) → 2035(2025-11) → 약 2035(2026-01) | 2021~2026-01 | 같음 | 같음 | 위와 같음 | 직접 | 2025년에 뒤로 물러남 |
| Automated Coder(AC) 중앙값 | Kokotajlo 2029말 → 2028 중반 / Lifland 2032초 → 2030 중반 | 2026-04-02 | AI Futures Project | Q1 2026 Timelines Update | https://blog.aifutures.org/p/q1-2026-timelines-update | 직접 | 약 1.5년 앞당김. 근거로 METR 코딩 시간지평 추세 인용 |
| AC 중앙값(p10 / p50 / p90) | Kokotajlo 2027-01 / 2027-11 / 2030-04; Lifland 2027-06 / 2030-01 / 2070-10; Halstead 2027-01 / 2029-01 / 2050-01 | 2026-08-16 | 같음 | Q2.5 2026 Timelines Update | https://blog.aifutures.org/p/q25-2026-timelines-update-uplift | 직접 | TED-AI 중앙값 Kokotajlo 2028-11, Lifland 2032-07. ASI Kokotajlo 2029-03, Lifland 2033-07. 코딩 생산성 향상(uplift) 현재 2배(Kokotajlo 중앙값), (uplift−1)의 배가 5개월 가정 |
| Samotsvety AGI | 10% 2026 / 50% 2041 / 90% 2164 | 2026-01 | AIMultiple 인용(8명) | AGI/Singularity: 10,000 Predictions Analyzed | https://aimultiple.com/artificial-general-intelligence-singularity-timing | 2차 | 원문 미확인 |
| Manifold "AGI before year X" 누적확률 | 2026 14%, 2027 34%, 2028 47%, 2029 57%, 2030 63%, 2031 65% | 2025-02-04경 | Ånestrand 글 | 위 Substack | https://forecastingaifutures.substack.com/p/forecasting-agi-insights-from-prediction-markets | 2차 | 시계열 그래프는 텍스트에 없음 |
| 초예측가(XPT) 25% AGI 시점 | 2048 (33명 중앙값) | 2022 | 80,000 Hours 인용 | 위 80,000 Hours 글 | https://80000hours.org/2025/03/when-do-experts-expect-agi-to-arrive/ | 2차 | |

---

## B. 연구소의 시점 발언 (목표 vs 예측 구분)

| 지표 | 값 | 기준시점 | 출처기관·저자 | 자료명 | URL | 확인경로 | 메모 |
|---|---|---|---|---|---|---|---|
| OpenAI '자동화 AI 연구 인턴' 2026-09, '자동화 AI 연구자' 2028-03 | 목표(내부 목표, "may totally fail" 단서) | 2025-10-28 라이브 / 10-29 X 글 | Sam Altman, OpenAI | Altman X 글: "internal goals of having an automated AI research intern by September of 2026 running on hundreds of thousands of GPUs, and a true automated AI researcher by March of 2028" | https://x.com/sama/status/1983584366547829073 | 2차(X는 402로 접근 불가, 검색 결과 스니펫으로 읽음) | TechCrunch는 "intern-level research assistant by September 2026", "fully automated 'legitimate AI researcher' by 2028"로 인용(월 미표기). TechCrunch URL: https://techcrunch.com/2025/10/28/sam-altman-says-openai-will-have-a-legitimate-ai-researcher-by-2028/ (직접) |
| 2025-10-28 라이브 영상 | 제목 "Sam, Jakub, and Wojciech on the future of OpenAI with audience Q&A" | 2025-10-28(PDT) / 업로드 표기 10-29 | OpenAI | YouTube | https://www.youtube.com/watch?v=ngDCxlZcecw&t=474s | 2차(ceointerviews.ai가 건 링크, 영상 자체는 열지 않음) | Pachocki 발언 "plans around getting to quite capable AI research interns"가 474초 지점. 영상 속 날짜 발언은 직접 듣지 못함 |
| OpenAI '자동화 연구 인턴' 달성 발표 | "목표 달성" 주장(자체 측정) | 2026-09-06 | OpenAI | "Research acceleration: The view inside OpenAI" | https://openai.com/index/research-acceleration-view-inside-openai/ | 2차(openai.com 403. HelpNetSecurity·CellCog·AI Weekly 3곳 요약이 서로 일치) | 인턴 정의: "A system that can carry out well-defined research tasks under human direction"(며칠 걸리는 숙련 연구자 과제 포함). 다음 목표: 자동화 AI 연구자 2028-03. 사람이 연구 우선순위·채택·확대·중단 결정 |
| OpenAI 'full RSI' 관련 문장 | "We do not yet know how to safely get all the way to aligned, full RSI." | 2026-09-06 | OpenAI | 같음 | https://aiweekly.co/alerts/openai-says-it-hit-automated-research-intern-milestone | 2차(AI Weekly 인용) | HelpNetSecurity는 "does not know how to achieve full RSI safely"로 풀어 씀. 또 "lab들은 RSI 진척을 공개 추적해야 한다"는 정책 입장 재진술 |
| Anthropic "powerful AI" 시점 | "powerful AI systems could emerge as soon as late 2026 or 2027" (예측) | 2025-03-06 | Anthropic | Response to OSTP RFI (March 2025) — 제출본 | https://www-cdn.anthropic.com/17a66ce2e943b82db8a021b974f0170baf6dce60.pdf | 직접(PDF 본문 읽음) | Anthropic 뉴스 글은 "late 2026 or early 2027"로 표기(https://anthropic.com/news/anthropic-s-recommendations-ostp-u-s-ai-action-plan, 직접). 정의: Nobel 수상급 지적 능력, 디지털 인터페이스 조작, 시간~주 단위 자율 작업, 물리 세계 연동 |
| Amodei '강력한 AI' 시점 | "as little as 1–2 years away" / "a very strong chance it comes in the next few" (예측) | 2026-01 | Dario Amodei | The Adolescence of Technology | https://darioamodei.com/essay/the-adolescence-of-technology | 직접 | AI가 "writing much of the code at Anthropic", 현 세대가 다음 세대를 자율 구축하는 루프가 "may be only 1–2 years away", "This loop has already started" |
| Amodei Davos 발언 | 2026~2027 / SW 엔지니어링 전부를 AI가 하기까지 6~12개월 | 2026-01 Davos | 보도 요약 | Davos 2026 보도 | https://techsambad.substack.com/p/davos-2026-the-agi-reckoning-insights | 2차(검색 요약만, 본문 미열람) | 정확한 발언 원문 미확인 |
| Google DeepMind Hassabis | AGI 2030까지 50% (예측) | 2026-01 Davos(Bloomberg 인터뷰) | Demis Hassabis | In Davos, Demis Hassabis bets 50/50 AGI arrives in five years | https://pub.towardsai.net/in-davos-demis-hassabis-says-agi-arrives-in-five-years-255458898ea1 | 2차(페이지 403, 검색 요약) | 이후 Stanford GSB 행사에서 "maybe like 2030 plus or minus a year"(Decrypt 2026-06-04, 2차 https://decrypt.co/370080/google-deepmind-ceo-agi-coming). Hassabis 정의: 과학적 창의성·지속 학습 필요(대만 매체 요약, 2차) |
| Google DeepMind Legg | "minimal AGI" 2028까지 50% (예측) | 2026-01 | Shane Legg | AIMultiple 인용 | https://aimultiple.com/artificial-general-intelligence-singularity-timing | 2차 | 원문 미확인 |
| xAI Musk | "Grok 5 will be AGI or something indistinguishable" / "10% and rising" (예측·홍보성) | 2025-10경, 2026-09-14 "That will be Grok 5" | Elon Musk | X 글, 보도 | https://x.com/elonmusk/status/1968202372276163029 | 2차(X 글 직접 못 읽음) | 2024-04: "smarter than the smartest human… probably next year, within two years"(Reuters 인용, https://gulfnews.com/technology/teslas-musk-predicts-ai-will-be-smarter-than-the-smartest-human-next-year-1.1712636705286, 2차). AGI 정의 미명시 |
| Meta Zuckerberg | 연도·확률 발언 없음 | 2026-01 실적 발표, 2026-07-28 WSJ, 2026-08-10 에세이 | Mark Zuckerberg | "2026 will be a big year for delivering personal superintelligence" | https://yourstory.com/2026/01/mark-zuckerberg-2026-big-year-personal-superintelligence-meta-capex | 2차 | 개인 초지능 접근성 서사. 검증 가능한 AGI 시점 미공개 |
| OpenAI Altman 일반 발언 | "2026 will likely see the arrival of systems that can figure out novel insights" / "larval version of recursive self-improvement" (예측) | 2025-06 (날짜 페이지 미표기) | Sam Altman | The Gentle Singularity | https://blog.samaltman.com/the-gentle-singularity | 직접 | 아직 "an AI system completely autonomously updating its own code"는 아니라고 명시 |
| OpenAI Altman "AGI 구축 방법을 안다" | "We are now confident we know how to build AGI as we have traditionally understood it" | 2025-01 초(본문 근거 추정) | Sam Altman | Reflections | https://blog.samaltman.com/reflections | 직접 | 연도 예측 아님 |

### 회사별 AGI 정의 차이 (한 줄씩)

| 회사 | 정의 | 확인경로 |
|---|---|---|
| OpenAI | 현재 공식 서술은 'RSI(재귀적 자기개선)'를 AGI급 개념으로 다루는 쪽으로 이동(Simon Willison 평). 헌장의 "경제적으로 가치 있는 대부분의 일에서 사람을 능가하는 고도 자율 시스템" 정의는 openai.com/charter가 403이라 원문 미확인 | 2차(Willison: https://simonwillison.net/2026/Sep/6/research-acceleration-the-view-inside-openai/ 링크만 확인) |
| Anthropic | AGI 대신 "powerful AI": Nobel급 지적 능력·디지털 인터페이스 조작·장시간 자율 작업·물리 세계 연동 | 직접(위 B표) |
| Google DeepMind | 성능 깊이×일반성 '단계'(Emerging→Competent=숙련 성인의 50 백분위 이상→…→Superhuman). 2023 논문 시점 Competent AGI는 공개 시스템 중 미달성 | 직접(arXiv 2311.02462 v5 본문 텍스트, Table 1) |
| xAI | 정의 명시 없음(Musk). 2024에는 "가장 똑똑한 사람보다 똑똑한 AI" | 2차 |
| Meta | AGI보다 '개인 초지능' 용어 사용, 정의·시점 없음 | 2차 |

---

## C. 재귀적 자기개선(AI가 AI를 개발)의 실측 증거

### C1. METR 50% 시간지평 (Time Horizon 1.1)

데이터 원문: METR 공개 YAML `benchmark_results_1_1.yaml`을 직접 받아 파싱했다. 단위는 분이다(파일에는 단위 라벨 없음, 파일 키가 `doubling_time_in_days`이고 값이 분 단위 시간지평이라는 점은 METR 페이지 서술과 일치하는 것으로 읽음). p50은 성공률 50%인 사람 작업 소요시간이다. CI는 95%가 아니라 파일의 ci_low~ci_high다(구간 정의는 파일에 명시되지 않음).

| 지표(모델) | 값 | 기준시점(출시일) | 출처기관·저자 | 자료명 | URL | 확인경로 | 메모 |
|---|---|---|---|---|---|---|---|
| GPT-4 | 4.0분 (CI 1.9~8.0) | 2023-03-14 | METR | Time Horizon 1.1 데이터 | https://metr.org/assets/benchmark_results_1_1.yaml | 직접 | |
| Claude 3 Opus | 4.0분 (1.7~8.8) | 2024-03-04 | 같음 | 같음 | 위와 같음 | 직접 | |
| Claude 3.5 Sonnet(2024-06) | 11.4분 (5.5~22.4) | 2024-06-20 | 같음 | 같음 | 위와 같음 | 직접 | |
| o1-preview | 20.3분 (11.7~33.4) | 2024-09-12 | 같음 | 같음 | 위와 같음 | 직접 | |
| Claude 3.7 Sonnet | 60.4분 (33.0~104.2), p80 12.1분 | 2025-02-24 | 같음 | 같음 | 위와 같음 | 직접 | 2025-03 원 논문은 "약 50분/약 1시간"으로 서술 |
| o3 | 119.7분 (74.6~190.9) | 2025-04-16 | 같음 | 같음 | 위와 같음 | 직접 | |
| Claude Opus 4 / 4.1 | 100.4 / 100.5분 | 2025-05-22 / 08-05 | 같음 | 같음 | 위와 같음 | 직접 | |
| GPT-5 | 203.0분 (112.6~405.6) | 2025-08-07 | 같음 | 같음 | 위와 같음 | 직접 | METR 페이지 FAQ의 "약 2시간 17분"은 구버전(1.0) 값으로 보임 |
| Claude Opus 4.5 | 293.0분 (161.7~623.7) | 2025-11-24 | 같음 | 같음 | 위와 같음 | 직접 | |
| Gemini 3 Pro | 224.3분 (139.6~379.2) | 2025-11-18 | 같음 | 같음 | 위와 같음 | 직접 | |
| GPT-5.2 | 352.2분 (198.1~815.2) | 2025-12-11 | 같음 | 같음 | 위와 같음 | 직접 | |
| Claude Opus 4.6 | 718.8분 (11.98시간; CI 316.7~3,633.8), p80 69.9분 | 2026-02-05 | 같음 | 같음 | 위와 같음 | 직접 | 2026 모델 중 하루 업무시간을 넘긴 첫 값 |
| GPT-5.3-Codex | 349.5분 (194.9~816.4) | 2026-02-05 | 같음 | 같음 | 위와 같음 | 직접 | |
| Gemini 3.1 Pro | 384.1분 (233.5~694.8) | 2026-02-19 | 같음 | 같음 | 위와 같음 | 직접 | |
| GPT-5.4 | 341.7분 (186.6~768.8) | 2026-03-05 | 같음 | 같음 | 위와 같음 | 직접 | |
| Claude Mythos Preview(초기판) | 1,044.8분 (17.4시간; CI 508.9~3,304.3), p80 185.9분 | 2026-04-07(출시일 필드), 평가는 2026-03 | 같음 | 같음 + 트래커 | https://metr.org/time-horizons/ | 직접(YAML), 트래커 페이지는 값 공백("—")·"16시간 초과 측정은 신뢰 불가" 주의문 | METR X 글(2026-05): "at least 16hrs (95% CI 8.5hrs to 55hrs)" — 2차(검색 스니펫): https://x.com/METR_Evals/status/2052896621760004602. YAML 값(17.4h)과 공식 서술(≥16h)을 구분해 쓸 것 |
| GPT-5.6 Sol | 약 11.3시간(678분; 95% CI 5~40시간), 부정행위를 성공으로 치면 270시간 초과, 부정행위 시도 제외하면 71시간(13~11,400) | 2026-06-26 (METR 글 날짜) | METR | Summary of METR's predeployment evaluation of GPT-5.6 Sol | https://metr.org/blog/2026-06-26-gpt-5-6-sol/ | 직접 | METR: "어느 수치도 견고한 측정이 아니다". 부정행위율은 METR이 평가한 공개 모델 중 최고. 완전 자동화 AI R&D를 가능케 한다고 보지 않으며 OpenAI Preparedness v2의 AI Self-Improvement 'Critical' 임계에도 못 미친다고 평가 |
| 배가 주기(전체 기간 stitched) | 187.8일(약 6.2개월) | 2019~2026 (p50 16시간 초과 점 제외) | METR | 같음 | https://metr.org/assets/benchmark_results_1_1.yaml | 직접 | 원 논문의 "약 7개월"보다 짧음 |
| 배가 주기(2023년 이후) | 128.7일(약 4.2개월), 95% CI 104.4~158.0일 | 2023~2026 | METR | 같음 | 위와 같음 | 직접 | 2024년 이후만 따로 적합한 값은 METR 원문에서 못 읽음. 2차 요약은 89일 또는 105일로 서로 다름 → '미확인' 절 참조 |
| 원 논문 배가 주기 | 약 7개월(2019 이후), 2024년에 가속했을 수 있음 | 2025-03-18 | METR (Kwa et al.) | Measuring AI Ability to Complete Long Tasks | https://arxiv.org/abs/2503.14499 | 직접(abstract) | Claude 3.7 Sonnet 약 50분 |
| 계산: Claude 3.7 Sonnet → Mythos 구간 | 60.4분 → 1,044.8분, 407일간 17.3배 = 약 99일마다 배가 | 2025-02-24 ~ 2026-04-07 | 계산(본 작업) | 위 YAML 두 값으로 계산 | https://metr.org/assets/benchmark_results_1_1.yaml | 계산(직접 값 기반) | 점 두 개 사이 계산이라 신뢰구간이 매우 넓음. Opus 4.6→Mythos는 61일간 1.45배(약 113일). GPT-5.6 Sol은 이후 상승 없음 |

### C2. 사내 코드 중 AI가 쓴 비율 (전부 자체 보고, 정의 상이)

| 지표 | 값 | 기준시점 | 출처기관·저자 | 자료명 | URL | 확인경로 | 메모 |
|---|---|---|---|---|---|---|---|
| Google 신규 코드 중 AI 생성 비율 | 25% 초과 | 2024-10-29 | Sundar Pichai, Alphabet Q3 2024 실적 발표 | 보도(Fortune 등) | https://www.fortune.com/2024/10/30/googles-code-ai-sundar-pichai | 2차(검색 결과로 확인, 전문 미열람) | 엔지니어가 검토·승인 |
| Google 신규 코드 중 AI 생성 비율 | 50%(2025 가을) → 75% | 2026-04-22~24 | Google/Pichai(Semafor 인용) | Google CEO says 75% of company's new code is AI-generated | https://www.semafor.com/article/04/24/2026/google-ceo-says-75-of-companys-new-code-is-ai-generated | 2차(Semafor 직접 열람하나 원 발언은 Business Insider 보도를 인용: https://www.businessinsider.com/google-ai-generated-code-75-gemini-agents-software-2026-4) | 실적 발표가 아니라 보도된 회사 발표라는 보도가 있음(Fast Company 403, 검색 요약) |
| Microsoft 코드 중 AI 생성 | 20~30% | 2025-04-29 (LlamaCon) | Satya Nadella | The Verge 인용 | https://www.theverge.com/news/658584/up-to-30-percent-of-some-microsoft-code-is-now-written-by-ai | 2차(ProvenBrief 표 경유) | 이후 갱신치는 찾지 못함 |
| Anthropic 사내 코드 | 70~90%(대변인), Claude Code 책임자 Boris Cherny "pretty much 100%" | 2026-01 (Fortune 2026-01-29) | Fortune 보도 | 100 percent of code at Anthropic and OpenAI is now AI written | https://www.fortune.com/2026/01/29/100-percent-of-code-at-anthropic-and-openai-is-now-ai-written-boris-cherny-roon | 2차(ProvenBrief 표 경유) | Cherny 자신의 코드 100%(2개월 이상). 감사 없는 자체 보고 |
| Anthropic 사내 코드 | "90 plus percent" | 2026-05-13 | CFO Krishna Rao, 팟캐스트 Invest Like the Best | TechSpot 보도 | https://www.techspot.com/news/112408-anthropic-more-than-90-code-now-written-ai.html | 2차(ProvenBrief 표 경유, TechSpot 403) | |
| OpenAI 코드 | 약 80%(분모 모호) | 2026-04 말 | Greg Brockman, Sequoia AI Ascent 2026 | TNW | https://thenextweb.com/news/openai-brockman-80-percent-code-ai-productivity-claim | 2차(TNW 직접 열람, "roughly 80%"는 의역이고 직접 인용은 아님) | |
| Amodei 2025 예측 | "3~6개월 안에 AI가 코드의 90%" 예측 | 2025 (CFR 행사) | Dario Amodei | Futurism·Daring Fireball 비판 보도 | https://futurism.com/six-months-anthropic-coding | 2차(검색 요약) | 예측이었고 당시 감사 불가. 후속 비판 보도 존재 |
| OpenAI 연구조직 에이전트 투입량 | 인간 8시간 노동당 3.1 agent-workday, 연구자 중앙값 추론비 600달러 초과/일(API 가격), 90 백분위 7,000달러 초과/일 | 2026-08 중순 측정, 2026-09-06 발표 | OpenAI | Research acceleration: The view inside OpenAI | https://openai.com/index/research-acceleration-view-inside-openai/ | 2차(HelpNetSecurity https://www.helpnetsecurity.com/2026/09/07/openai-research-automation-intern/ · CellCog https://cellcog.ai/blog/openai-automated-research-intern/ · AI Weekly 3곳이 일치) | 2026-06 이전에는 에이전트 실행시간이 인간 노동보다 적었음. 비용이 실제 현금인지 내부 이전가격인지는 불명 |
| OpenAI 장시간 과제의 사람 개입 | "over half of successful 4-8 hour tasks involved 1 or more interventions"(지난 6개월) | 2026-09-06 | OpenAI | 같음 | https://www.helpnetsecurity.com/2026/09/07/openai-research-automation-intern/ | 2차 | 정확한 비율은 없고 '절반 초과'만 보도됨. 성공한 과제 중에서만 센 값이고 정답이 확인되는 과제 한정 |
| OpenAI 기타 지표 | 연구자 4개 이상 에이전트 동시 실행 비중 증가, 활성 실험자당 실험 수 2026-08 최고, Astra급 GPU 배분 8월 7일 이후 1주 59.2% 감소(타 모델군 17.2% 증가), 2026-07-20 인프라 침해 이후 RL 학습 2주 중단 | 2026-01~08 | OpenAI | 같음 | https://cellcog.ai/blog/openai-automated-research-intern/ | 2차 | OpenAI 스스로 "수집은 쉽지만 해석은 어려운 지표"이고 전체 진척은 이 지표만큼 빠르지 않을 것이라 단서 |

### C3. AI가 AI 학습·인프라를 개선한 사례

| 지표 | 값 | 기준시점 | 출처기관·저자 | 자료명 | URL | 확인경로 | 메모 |
|---|---|---|---|---|---|---|---|
| AlphaEvolve: Google 전 세계 연산 자원 회수 | 평균 0.7% | 2025-05-14 | Google DeepMind | AlphaEvolve: A Gemini-powered coding agent for designing advanced algorithms | https://deepmind.google/discover/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/ | 직접 | 데이터센터 스케줄링 휴리스틱 |
| AlphaEvolve: Gemini 핵심 커널 | 23% 가속 → Gemini 학습 시간 1% 감소 | 같음 | 같음 | 같음 | 위와 같음 | 직접 | 4x4 복소 행렬 곱 48회 스칼라 곱셈도 같은 글 |
| Amodei의 평가 | AI 코딩이 "already substantially accelerating the rate of our progress in building the next generation" | 2026-01 | Dario Amodei | The Adolescence of Technology | https://darioamodei.com/essay/the-adolescence-of-technology | 직접 | 정량 수치 없음 |
| 전문가 설문(2023): "AI가 AI 연구자 일을 2033년까지 한다" 확률 | 5% (2043년까지 10%) | 2023 설문 | 80,000 Hours 인용 | 위 80,000 Hours 글 | https://80000hours.org/2025/03/when-do-experts-expect-agi-to-arrive/ | 2차 | 원 논문 해당 문항 직접 확인 못 함 |

### C4. 학습 컴퓨트·알고리즘 효율 (Epoch AI)

| 지표 | 값 | 기준시점 | 출처기관·저자 | 자료명 | URL | 확인경로 | 메모 |
|---|---|---|---|---|---|---|---|
| 주요(notable) 모델 학습 컴퓨트 증가율 | 연 4.1배 (90% CI 3.7~4.6) | 2010~2024-05 | Epoch AI, Sevilla & Roldán | Training compute of frontier AI models grows by 4-5x per year | https://epoch.ai/blog/training-compute-of-frontier-ai-models-grows-by-4-5x-per-year | 직접 | 권고 기준선은 "연 4~5배" |
| 프런티어(상위 10위) 모델 | 2010~2024-05 연 5.3배 (4.9~5.7); 2018 이후 연 4.2배 (3.6~4.9) | 같음 | 같음 | 같음 | 위와 같음 | 직접 | 2018 이후 둔화 주장은 저자도 덜 확신 |
| 언어 모델 | 2017-06~2024-05 연 9.5배 (7.4~12.2); 2020 중반 이후 상위 언어 모델 연 5.0배 (80% CI 3.1~7.3) | 같음 | 같음 | 같음 | 위와 같음 | 직접 | 2024-05 이후 갱신치는 못 찾음 |
| 언어 모델 알고리즘 효율 | 같은 성능에 필요한 컴퓨트가 약 8개월마다 절반 (95% CI 약 5~14개월) | 2012~2023 데이터 | Ho et al., Epoch AI | Algorithmic progress in language models (arXiv 2024-03) | https://arxiv.org/abs/2403.05812 | 직접(abstract) | 같은 기간 컴퓨트 증가의 기여가 알고리즘보다 더 컸다고 서술. 중앙값 7.8개월은 2차 요약 |
| 알고리즘 효율(이미지 분류, 구버전) | 9개월마다 컴퓨트 예산 배가 상당 (95% CI 4~25개월) | 2022-12-12 | Erdil & Besiroglu | Revisiting algorithmic progress | https://epoch.ai/blog/algorithmic-progress | 직접 | 이미지 분류에서 컴퓨트 약 45%·알고리즘 약 45%·데이터 약 10% 기여 |

---

## D. 내려받을 수 있는 공개 데이터셋

| 지표 | 값 | 기준시점 | 출처기관·저자 | 자료명 | URL | 확인경로 | 메모 |
|---|---|---|---|---|---|---|---|
| Epoch AI 주요 모델 CSV | 라이선스 CC BY 4.0(출처 표기 조건). 행 수: 페이지에 notable 부분집합 행 수 없음, 전체 DB는 "over 3600 models" | 2026-10-16 갱신 표기 | Epoch AI | Data on AI Models | https://epoch.ai/data/notable-ai-models | 직접 | CSV: https://epoch.ai/data/notable_ai_models.csv, https://epoch.ai/data/large_scale_ai_models.csv, https://epoch.ai/data/frontier_ai_models.csv, https://epoch.ai/data/all_ai_models.csv. 파일을 내려받지 않았으므로 실제 행 수 미확인. 정의: notable = 벤치마크 SOTA 개선·인용 1,000회 초과·역사적 중요성·상당한 사용 중 하나 이상. large-scale = 학습 1e23 FLOP 이상 |
| METR 시간지평 결과 YAML | 모델 26개 항목(본 작업이 파싱), 라이선스 미확인 | 2026-05 갱신 | METR | Time Horizon 1.1 | https://metr.org/assets/benchmark_results_1_1.yaml | 직접 | 모델별 p50·p80 + CI, 배가 주기 필드 포함 |
| AI Impacts ESPAI 보고서 | 2016·2022·2023·2024 집계 표(PDF 부록 F 등). 설문 원자료 라이선스·다운로드 링크 미확인 | 2026-09 | AI Impacts | ESPAI 2024 보고서 | https://aiimpacts.org/wp-content/uploads/2026/09/ESPAI2024.pdf | 직접 | 부록 C에 질문 전문 링크가 있다고 서술(링크는 열지 않음) |
| Kaggle "AI Impact on Jobs and Layoff Risk" | 20,000행, **합성(synthetic) 데이터**, 라이선스 Non-Commercial | 게시 약 4개월 전(2026-06경 추정, 절대 날짜 없음) | Kaggle 사용자 shivasingh4945 | AI Impact on Jobs and Layoff Risk: AI Employment Impact Dataset | https://www.kaggle.com/datasets/shivasingh4945/ai-impact-on-jobs-and-layoff-risk-dataset | 2차(hyper.ai 미러 페이지가 "synthetic structured machine learning dataset"이라고 서술, Kaggle 페이지 자체는 열지 않음) | 노동시장 실측 증거로 쓰면 안 됨. 열 수는 미확인 |
| Kaggle "AI Impact on Jobs & Salaries (2020–2026)", "AI-Powered Job Market Dynamics" | 합성 여부·행 수·라이선스 미확인 | 미확인 | Kaggle 출처로 gts.ai가 소개 | 위 이름 | https://gts.ai/dataset-download/ai-powered-job-market-dynamics/ | 2차(검색 요약만) | "Automation_Risk" 열이 있다는 설명만 확인. 사용 전 합성 여부 확인 필수 |

---

## 미확인 (찾으려 했으나 본문에서 확인 못 한 수치)

| 항목 | 시도한 URL·방법 | 상태 |
|---|---|---|
| Metaculus 5121·3479의 현재 중앙값과 과거 이력 그래프(특히 2020, 2024 중반, 2025 후반, 2026-10) | https://www.metaculus.com/questions/5121/ , /questions/5121/date-of-artificial-general-intelligence/ , /questions/3479/date-weakly-general-ai-is-publicly-known/ , /api/posts/5121/ 모두 403. web.archive.org는 도구가 차단 | 2차 인용 글의 스냅샷만 있음(A2). 2025 후반 값은 없음 |
| OpenAI 2026-09 글 원문(제목 확인, 본문 인용) | https://openai.com/index/research-acceleration-view-inside-openai/ 및 `?output=1` 403 | 인턴 정의·3.1 agent-workday·'4~8시간 과제 절반 초과 개입'·'full RSI' 문장은 3개 요약 매체에서만 확인. '4~8시간 과제 중 개입 필요 비율'의 정확한 퍼센트는 어디서도 안 나옴. Inside AI News 기사 자체는 찾지 못함 |
| 2025-10-28 라이브 영상 속 날짜 발언의 원음 | YouTube 링크는 ceointerviews.ai 경유로만 확인 | 영상은 열지 않음 |
| OpenAI 헌장의 AGI 정의 원문 | https://openai.com/charter/ 403 | 미확인 |
| METR GPT-5.5, Claude Opus 4.7, Claude Fable 5 등 2026-04 이후 모델의 시간지평 | https://metr.org/time-horizons/ (모델별 값은 페이지에 표시되지 않음), 검색 | GPT-5.6 Sol(2026-06-26)만 확인. 나머지는 미확인 |
| METR 2024년 이후 구간 배가 주기 | 원 블로그(https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/)에 수치 없음 | 2차 요약은 89일(Medium·트래커)과 105일 등으로 엇갈림. 확정값 없음 |
| Anthropic 시스템 카드의 AI R&D 자동화 임계 판정 | 검색만 | 2차 분석이 "40시간 이상 걸리는 AI R&D 과제 3개 중 2개 완수"라고 하나 시스템 카드 원문 미확인 |
| Google 2026 실적 발표 시점의 AI 코드 비율 원문, Microsoft 최신 비율 | Fast Company 403, Business Insider 미열람 | Google 75%는 Semafor 경유 2차. Microsoft 갱신치 못 찾음 |
| Epoch의 2024-05 이후 학습 컴퓨트 증가율 갱신, 최신 알고리즘 효율 추정 | https://epoch.ai/data-insights/training-compute-growth-rate 404 | 2024-05 값이 최신으로 확인됨. 2025-08·2026-02 뉴스레터 제목만 확인 |
| Epoch CSV 실제 행 수, 라이선스 외 파일 크기 | CSV 미다운로드(파일 내려받기는 별도 승인 사안) | 미확인 |
| AI Impacts ESPAI의 FAOL 2016 값 | 2023 논문에 2016 값 없음. OWID는 "2018 edition FAOL 2138"이라고 쓰나 2016 설문과 같은 것인지 본문에서 직접 확인 못 함 | CSV에 넣지 않음 |
| Samotsvety 2026-01 원문, Shane Legg 2026-01 발언 원문 | AIMultiple 인용만 | 원문 미확인 |
| Kaggle 데이터셋 페이지 직접 열람(열 수·라이선스·합성 여부) | Kaggle 페이지 미열람, hyper.ai와 gts.ai 경유 | 위 D표의 2차 표시 참조 |

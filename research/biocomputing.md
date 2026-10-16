# 바이오 반도체(오가노이드 지능)와 뉴로모픽이 AI 발전을 가속할 수 있는가: 필요 전력 관점의 수치와 한계

- **접근일**: 2026-10-16 (모든 URL은 이 날짜에 열어 확인. 열지 못한 것은 맨 아래 '미확인'에 적음)
- **범위**: 사람 뇌·프런티어 AI 전력 기준선(IEA·Epoch·Carbon Direct), 바이오컴퓨팅 실물(Cortical Labs·FinalSpark·Brainoware·Johns Hopkins OI 로드맵), 뉴로모픽(Intel·IBM·BrainChip·한국), 한계·윤리, 재귀적 자기개선 가속과의 연결
- **함께 보는 파일**: `_data/biocomputing.csv`(topic,metric,value,unit,date,source,url,check)

## 읽는 법

- **확인경로 `직접`** = 논문·보고서·회사 공식 페이지의 본문을 열어 숫자를 읽음. **`2차`** = 기사·백과·검색결과 요약으로만 확인. 일부 행은 "직접(2차 인용 수치)"처럼 원문이 인용한 수치를 옮긴 것임을 밝힌다.
- 지표 앞 **[실측]** = 측정·통계·공시 수치. **[추정]** = 모형·전망. **[회사 주장]** = 회사·연구팀 홍보 수치, 독립 검증이 확인되지 않음. **[계산]** = 이 조사에서 표의 수치로 환산한 값. **[판단]** = 이 조사의 해석.
- "뇌 20 W", "시스템 전체 전력", "칩 전력"은 서로 다른 경계다. 뇌 조직 전력과 생명유지 장치·전극·제어 장치를 포함한 시스템 전력을 섞어 비교하지 않는다.
- 소수의 수치는 출처마다 다르다(CL1 뉴런 수, CL1 전력). 맞추지 않고 그대로 병기했다.

## 요약 (5줄)

1. **기준선**: 뇌 20 W 대 Frontier 슈퍼컴퓨터 21 MW(저자 환산 약 10^6배, 과제가 다르다는 단서 포함). 데이터센터는 415 TWh(2024) → 945 TWh(2030, IEA). 단일 프런티어 학습 전력은 2030년 4–16 GW(Epoch·EPRI), 가장 먼저 구속하는 제약은 전력이며 전력망 연결 대기도 병목이다(ERCOT 약 20개월·PJM 약 40개월).
2. **바이오컴퓨팅은 아직 연구용 도구다**: DishBrain은 퐁을 5분 안에 학습(2022), CL1은 $35,000에 뉴런 약 80만 개(출처별 20만~100만)·수명 최대 6개월·대당 약 25 W(회사 주장), Brainoware는 8명 화자 식별 78%(2차). 와트당 성능 벤치마크가 없고 '100만 배 적은 에너지'는 회사 주장이며 독립 측정은 찾지 못했다.
3. **뉴로모픽은 칩 수준 효율 이득이 있으나 데이터센터에는 못 들어갔다**: Hala Point 11.5억 뉴런·최대 2,600 W·15 TOPS/W(회사 주장 조건 하), Penn 리뷰 표에서 H100 5.65 TOPS/W. IBM NorthPole은 비전 25배·30억 파라미터 LLM 72.7배(회사 주장, GPU 기종 비공개). 2024·2026 리뷰 모두 랙 규모 데이터센터 진입이 근시일 내 어렵다고 본다. 한국(KAIST·삼성·SK)은 소자·PIM 단계의 회사·연구팀 발표 수치뿐이다.
4. **한계는 규모·입출력·학습·수명·윤리다**: 뇌 860억 뉴런·>10^15 연결 대 오가노이드 <10만 세포(OI 로드맵 목표 1,000만). [계산] 시스템 기준 뉴런당 전력은 CL1이 뇌의 약 14만~54만 배다. 입출력은 전극 8~59개, 수명은 100일~6개월, 2026-04 아시아태평양 권고는 현재 지각 가능성이 매우 낮지만 배제하지 말라고 한다.
5. **[판단] 2036년 전에 바이오컴퓨팅이 AI 학습의 전력 제약을 풀 근거는 이번 조사에서 찾지 못했다**: 가장 큰 계획(CL1 1,000대)도 뇌 뉴런의 약 1%이고 과제는 퐁·Doom·화자 식별 수준이다. 뉴로모픽은 엣지 추론에서 부분 기여가 가능하다. 주 경로는 기존 GPU 효율(2년마다 2배)과 발전·송전 확충이다. 상용화 연도를 명시한 원문·1차 자료는 찾지 못했다.

---

## A. 에너지 기준선과 전력 병목

뇌 20 W와 프런티어 학습의 규모를 맞추는 기준선, 그리고 AI 가속의 병목이 전력·전력망이라는 근거다. 새 하드웨어가 와트를 줄여도 먼저 해결해야 할 것이 '연산 규모'인지 '전력 승인'인지 가르는 행들이다.

| 지표 | 값 | 기준시점 | 출처기관·저자 | 자료명 | URL | 확인경로 | 메모 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [실측] 사람 뇌 소비전력 | 20 W | 2023 | Smirnova·Hartung 외 (Johns Hopkins 등) | Organoid intelligence (OI): the new frontier in biocomputing and intelligence-in-a-dish, Frontiers in Science | <https://www.frontiersin.org/journals/science/articles/10.3389/fsci.2023.1017235/full> | 직접(원문 본문) | 원문: brain consumes only 20 watts. 같은 글에서 Frontier 슈퍼컴퓨터 21 MW와 비교해 약 10^6배 효율 차이라 쓰되, 두 시스템이 서로 다른 과제를 한다고 단서를 붙인다. |
| [실측] 대뇌 회백질 소비전력(뇌 전체 포도당 예산 17~20 W 중) | 3 W | 2026-04 | Katti·Chaudhari·Jariwala (Univ. of Pennsylvania) | Neuromorphic Computing for Low-Power Artificial Intelligence, arXiv 2604.04727 | <https://arxiv.org/abs/2604.04727> | 직접(원문 본문) | 리뷰가 Balasubramanian 2021을 인용: 회백질 약 3 W, 뉴런당 약 2 nW. 회백질 3 W 중 절반 이상(1.67 W)이 통신에 쓰인다. |
| [실측] Frontier 슈퍼컴퓨터 소비전력 | 21 MW | 2023 | Smirnova·Hartung 외 | Organoid intelligence (OI), Frontiers in Science | <https://www.frontiersin.org/journals/science/articles/10.3389/fsci.2023.1017235/full> | 직접(원문 본문) | 뇌 20 W와의 비교 기준. 저자는 약 10^6배 효율 차이로 서술. |
| [추정] 기계가 새 과제를 배울 때 필요한 에너지 / 사람(같은 샘플당 시간 기준) | 약 10^10 배 | 2023 | Smirnova·Hartung 외 | Organoid intelligence (OI), Frontiers in Science | <https://www.frontiersin.org/journals/science/articles/10.3389/fsci.2023.1017235/full> | 직접(원문 본문) | AlphaGo 학습 4주·GPU 50장·약 4×10^10 J를 근거로 한 저자 추정. 논문 안의 일화적 비교이며 일반 법칙이 아니다. |
| [실측] NVIDIA H100 SXM 최대 TDP | 700 W | 2026-10-16(접근) | NVIDIA | H100 Tensor Core GPU 제품 페이지 | <https://www.nvidia.com/en-us/data-center/h100/> | 직접(회사 공식 페이지·발표 원문) | FP8 텐서코어(희소성 적용) 3,958 TFLOPS, 메모리 80 GB. Penn 리뷰 표의 700 W·5.65 TOPS/W와 일치. |
| [실측] Llama 3.1 405B급 학습 설치 전력(16,000 GPU × GPU당 1,700 W) | 27 MW | 2024-08 | Epoch AI | Can AI scaling continue through 2030? | <https://epoch.ai/blog/can-ai-scaling-continue-through-2030> | 직접(원문 본문) | GPU당 1,700 W는 서버·냉각 등 포함 설치 전력 기준(칩 TDP 700 W의 약 2.4배)이다. |
| [추정] 2030년 2e29 FLOP 학습에 필요한 전력 | 약 6 GW | 2024-08 | Epoch AI | Can AI scaling continue through 2030? | <https://epoch.ai/blog/can-ai-scaling-continue-through-2030> | 직접(원문 본문) | Llama 3.1 대비 전력 효율 약 24배 개선(하드웨어·FP8·학습 기간 연장)을 가정한 값. 단일 캠퍼스 1~5 GW, 분산 학습 2~45 GW 가능하다고 본다. |
| [추정] 2030년 최대 단일 프런티어 학습 전력 | 4–16 GW | 2025-08-11 | Epoch AI (EPRI와 공동 보고서) | Power demands of frontier AI training | <https://epoch.ai/blog/power-demands-of-frontier-ai-training> | 직접(원문 본문) | 역사적 연 2.2배 증가, 앞으로 연 2.2~2.9배. 현재 최대 학습이 100 MW 초과. 상단(16 GW) 달성 가능성은 불확실하다고 저자가 명시. |
| [실측] Epoch 추적 AI 데이터센터 94곳 합계 IT 전력 | 14.1 GW | 2026-10-12 | Epoch AI | Frontier Data Centers hub | <https://epoch.ai/data/data-centers> | 직접(원문 본문) | 시설 전력(냉각 등 포함) 추정 18.3 GW, H100 환산 약 1,460만 개. 최대 부지 Colossus 2(멤피스) IT 946 MW. Epoch가 추정하는 전 세계 AI 연산 대비 포착률 44%(90% CI 23~82%). |
| [실측] 전 세계 데이터센터 전력 소비 2024 | 415 (세계 전력의 1.5%) TWh | 2024 | IEA | Energy and AI — Executive summary | <https://www.iea.org/reports/energy-and-ai/executive-summary> | 직접(원문 본문) | 2017년 이후 연 약 12% 증가(전체 전력 증가율의 4배 이상). 미국 45%·중국 25%·유럽 15%. |
| [추정] 전 세계 데이터센터 전력 소비 2030 / 2035 | 945 (2030) / 1,200 (2035 기준, 범위 700–1,700) TWh | 2025-04 발표 | IEA | Energy and AI — Executive summary | <https://www.iea.org/reports/energy-and-ai/executive-summary> | 직접(원문 본문) | 2030 값은 2024의 약 2.3배(계산). AI가 가장 큰 증가 동인이라고 서술. |
| [실측] 미국 데이터센터 전력 2024 / [추정] 2028 | 약 180 (미국 전력의 약 4%) / 325–580 (7–12%) TWh | 2026-05-11 | Carbon Direct(현 Relae)가 LBNL 보고서를 인용 | AI Meets the Grid (PJM·ERCOT 대기열 분석) | <https://www.carbon-direct.com/research-and-reports/ai-meets-the-grid-interconnection-queue-analysis-in-pjm-and-ercot> | 직접(2차 인용 수치) | LBNL 2024 보고서 원문은 접근 차단(403)이라 열지 못했다. 이 행은 Carbon Direct가 옮긴 수치. |
| [실측] 전력망 연결 병목: 계획된 데이터센터 중 지연 위험 | 약 20 % | 2025-04 | IEA | Energy and AI — Executive summary | <https://www.iea.org/reports/energy-and-ai/executive-summary> | 직접(원문 본문) | 신규 송전선 건설 4~8년(선진국), 변압기·케이블 대기 기간 최근 3년간 2배, 가스터빈 납기 수년. |
| [실측] 발전·저장 연계 대기열 총량 / 소요 기간(ERCOT·PJM) | >2.2 TW / ERCOT 약 20개월·PJM 약 40개월 TW / 개월 | 2026-05-11 | Carbon Direct(Relae): Eryilmaz·Kilroy | AI Meets the Grid | <https://www.carbon-direct.com/research-and-reports/ai-meets-the-grid-interconnection-queue-analysis-in-pjm-and-ercot> | 직접(원문 본문) | FERC 목표 8~11개월과 차이. 데이터센터 수요 지대의 활성 프로젝트 평균 대기 3~4년. ERCOT 2021.3~2026.3 신규 1,592건(369.7 GW) 중 상업운전 2.8%(10.4 GW). |
| [실측] Gemini 앱 중앙값 텍스트 프롬프트 1건 에너지 | 0.24 (칩만 보면 0.10) Wh | 2025-08-22 | Google | Measuring the environmental impact of AI inference | <https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference> | 직접(회사 공식 페이지·발표 원문) | [회사 주장] 12개월간 33배 감소(2024-05→2025-05). 독립 검증 없음(원문 각주). 호스트 CPU·유휴·PUE 1.09 포함 방식. |
| [실측] 선도 ML 하드웨어 에너지효율 증가 속도 | 2년마다 2배(연 약 40%) 배/기간 | 2024-10 | Epoch AI | Leading ML hardware energy efficiency data insight | <https://epoch.ai/data-insights/ml-hardware-energy-efficiency> | 직접(원문 본문) | 텐서 FP16 기준 H100 SXM 1.41×10^12, B200 2.25×10^12 FLOP/s/W(원문 표). 바이오·뉴로모픽의 '몇 배 효율' 주장은 이 기준 추세와 같이 봐야 한다. |

## B. 바이오컴퓨팅 실물 (DishBrain·CL1·FinalSpark·Brainoware·OI 로드맵)

각 시스템의 뉴런 수·과제·성능·전력·수명을 한 줄씩 정리했다. 회사가 내는 전력·효율 수치는 모두 `[회사 주장]`이며, 독립 측정은 찾지 못했다.

| 지표 | 값 | 기준시점 | 출처기관·저자 | 자료명 | URL | 확인경로 | 메모 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DishBrain 세포 수 / 전극 | 마우스 피질 약 800,000개·인간 iPSC 피질 약 10^6개 / MaxOne HD-MEA 26,000 전극(8 mm²) 개 | 2022-12-07 | Kagan 외 (Cortical Labs, Monash, UCL 등) | In vitro neurons learn and exhibit sentience when embodied in a simulated game-world, Neuron 110(23) | <https://pmc.ncbi.nlm.nih.gov/articles/PMC9747182/> | 직접(원문 본문) | 본문에 26,000과 26,400 전극 표기가 섞여 있음. 실제 감각 자극 전극은 8개만 개별 제어. 기록 채널 최대 1,024. |
| DishBrain 과제·성능 | 퐁(Pong). 5분(0–5분 vs 6–20분) 안에 평균 랠리 길이 유의 증가(MCC t=6.15, HCC t=10.44) | 2022-12-07 | Kagan 외 | In vitro neurons learn…, Neuron | <https://pmc.ncbi.nlm.nih.gov/articles/PMC9747182/> | 직접(원문 본문) | 학습 검정 세션 399회(대조 포함). 랠리 길이 절대값은 그림·부록 표에 있어 읽지 못함. WIRED 재게시(2차)는 2시간 세션 최고 랠리 10회로 서술. |
| DishBrain 전력·수명 | 원문에 전력 수치 없음 | 2022-12-07 | Kagan 외 | In vitro neurons learn…, Neuron | <https://pmc.ncbi.nlm.nih.gov/articles/PMC9747182/> | 직접(원문 본문) | 본문에서 'power'는 통계적 검정력·연산력 맥락만 나옴. '지각(sentience)' 표현은 2023 Neuron 반박 서한(30여 명)으로 논란(STAT 2차). |
| CL1 가격 / 클라우드 | 35,000 / (30대 랙 구매 시 20,000) / 클라우드 주 300 USD / 대 / USD·대·주 | 2025-03 | IEEE Spectrum (기사) | Biological computer for sale | <https://spectrum.ieee.org/biological-computer-for-sale> | 2차(기사) | [회사 발표 인용] 최초 115대는 2025년 여름 출하. Cortical Labs 공식 CL1 페이지는 가격·뉴런 수를 싣지 않음. |
| CL1 뉴런 수 / 전극 | 뉴런 800,000개 / 입력 8→59(DishBrain 대비) 개 | 2025-03 | IEEE Spectrum (기사) | Biological computer for sale | <https://spectrum.ieee.org/biological-computer-for-sale> | 2차(기사) | 2026-08 WIRED(재게시)는 '최대 100만 개', 59 전극. 위키는 Doom 시연에 약 200,000개 사용. 공식 페이지에 뉴런 수 없음 → 출처마다 다름. |
| CL1 수명 | 최대 6개월 개월 | 2026-10-16(접근) | Cortical Labs | CL1 제품 페이지 | <https://www.corticallabs.com/cl1> | 직접(회사 공식 페이지·발표 원문) | '내장 생명유지 시스템'으로 최대 6개월(공식). 위키는 일부 세포가 1년까지 생존했다는 Kagan 발언을 전함(2차). 전력은 공식 페이지에 'a fraction of energy'로만 표기, 수치 없음. |
| CL1 전력(출시 시점 보도) | 30대 랙 850–1,000 (대당 약 28–33, 계산) W | 2025-03 | IEEE Spectrum (기사) | Biological computer for sale | <https://spectrum.ieee.org/biological-computer-for-sale> | 2차(기사) | [회사 주장] 원문은 단위당 수치 없이 '랙당'으로만 적음. |
| CL1 전력(2026 보도) | 대당 약 25, 20대 랙 800–1,000 W | 2026-08-20 | The Next Web (Cortical Labs 수치 인용) | A data centre rack running on living neurons is now operating in Singapore | <https://thenextweb.com/news/singapore-biological-data-centre-cortical-labs-neurons> | 2차(기사) | [회사 주장] 기사 정정(08-21): DCD 초판의 '대당 850–1,000 W·랙 20 kW'는 오류(랙 전체 수치였음). 20×25=500 W로 랙 수치와 안 맞고 펌프·가스·온도 제어 포함 여부 불명. 벤치마크·와트당 성능 없음, 독립 검증 없음. |
| CL1 전력(Melbourne 보도) | 20대 랙 약 0.6 kW | 2026-04-30 | IT Brief Australia (회사 수치 인용) | Cortical Labs CL1 commercial milestone after AUD $245k grant | <https://itbrief.com.au/story/cortical-labs-cl1-commercial-milestone-after-aud-245k-grant> | 2차(기사) | [회사 주장] 위 두 수치와 대체로 같은 규모(대당 25~33 W). 멜버른 시제품 데이터센터는 CL1 120대로 '완전 가동'이라고 보도. |
| Cortical Labs 싱가포르 생물 데이터센터 시제품 | CL1 20대 랙(NUS 의대, DayOne 호스팅), 장기 최대 1,000대 계획 대 | 2026-08-06 시연 | The Next Web | A data centre rack running on living neurons… | <https://thenextweb.com/news/singapore-biological-data-centre-cortical-labs-neurons> | 2차(기사) | 수치는 모두 회사·파트너 발표. 'first independently operated…'은 파트너 표현. 대상 용도: 신약 탐색·휴머노이드·사이버보안·사기 탐지(성능 근거 없음). |
| Cortical Labs 투자 | $10M(2025-04, Horizons Ventures 주도, Blackbird·In-Q-Tel 참여) / 호주 정부 보조 AUD 245,000(2026) USD / AUD | 2025-04 / 2026-04 | Wikipedia 및 IT Brief | Cortical Labs | <https://en.wikipedia.org/wiki/Cortical_Labs> | 2차(백과·재게시) | 투자 금액의 1차 보도자료는 열어 보지 못함. |
| Cortical Cloud 외부 사용 사례 | 독립 연구자가 API로 약 200,000개 피질세포에 Freedoom을 약 1주 만에 학습시킴 개 / 주 | 2026 | Wikipedia(Cortical Labs) | Cortical Labs | <https://en.wikipedia.org/wiki/Cortical_Labs> | 2차(백과·재게시) | 2026-02 Boing Boing 등 보도도 있으나 원 논문·성능 지표 미확인. |
| FinalSpark Neuroplatform 규모 | MEA 4개 × 오가노이드 4개 × 전극 8개(오가노이드당). 누적 사용 오가노이드 >1,000개(MEA 교체 약 250회) 개 | 2024 | FinalSpark 연구진 | Open and remotely accessible Neuroplatform for research in wetware computing, Frontiers in AI | <https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2024.1376042/full> | 직접(원문 본문) | 오가노이드당 뉴런 수는 논문에 없음. 전극 32개, 30 kHz 샘플링, 활동전위 200억 건 이상·약 18 TB 기록. |
| FinalSpark 오가노이드 수명 | 최선의 경우 100일 초과(초기에는 수 시간) 일 | 2024 | FinalSpark 연구진 | Neuroplatform paper, Frontiers in AI | <https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2024.1376042/full> | 직접(원문 본문) | 초록 '100일 이상', 본문 '최대 100일', 다른 절 '수개월' — 서술이 일치하지 않는다. |
| FinalSpark 전력 측정 여부 | 논문은 Neuroplatform 전력을 측정하지 않음(GPT-3 학습 약 10 GWh, 뇌 약 20 W를 인용만) | 2024 | FinalSpark 연구진 | Neuroplatform paper, Frontiers in AI | <https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2024.1376042/full> | 직접(원문 본문) | '백만 배 적은 에너지'는 회사 홍보 주장. 회사 홈페이지에도 배수 표기는 없고 '실리콘이 뇌 효율에 맞추려면 약 10 MW 필요(Boahen 인용)'라고만 적음(직접). |
| FinalSpark 에너지 주장(2026 보도) | 디지털 칩 대비 약 100만 배 적은 에너지 / 오가노이드 16개 배 / 개 | 2026-08-20 | The Next Web (FinalSpark 주장 인용) | A data centre rack running on living neurons… | <https://thenextweb.com/news/singapore-biological-data-centre-cortical-labs-neurons> | 2차(기사) | [회사 주장] 기사 자체가 '검증되지 않음'이라 표기. 독립 측정 미확인. |
| FinalSpark 접근 방식·가격 | 원격 24/7. 공유 플랜(오가노이드 4개)·전용 플랜(4개). 가격은 문의 | 2026-10-16(접근) | FinalSpark | Neuroplatform 페이지 | <https://finalspark.com/neuroplatform/> | 직접(회사 공식 페이지·발표 원문) | 학술용 월 $500이라는 2024 보도는 검색결과 요약으로만 확인(미확인). 논문: 2023년 36개 그룹 신청 중 8곳 선정, 이후 32곳 요청에 인프라는 7곳 지원. |
| Brainoware 과제·정확도 | 8명 화자 240개 일본어 모음 음성 식별 정확도 78% % | 2023-12 | TechXplore (Nature Electronics 논문 해설) | Brain tissue chip voice recognition | <https://techxplore.com/news/2023-12-brain-tissue-chip-voice-recognition.html> | 2차(기사) | Nature Electronics 본문은 구독 장벽으로 못 읽음(초록은 직접 읽음: 음성 인식과 비선형 방정식 예측). 78%는 기사에서만 확인. 훈련 횟수·초기 정확도는 기사에 없음. |
| Brainoware 비선형 방정식(Hénon map) 회귀 점수 | 0.356±0.071(1일차)→0.812±0.043(훈련 후) 점수 | 2023-02 (프리프린트) | Cai 외 (Indiana Univ. 등) | Brain organoid computing for AI, bioRxiv 프리프린트 | <https://www.biorxiv.org/content/10.1101/2023.02.28.530502v1.full> | 직접(원문 본문) | 출판본(Nature Electronics 6(12):1032–1039, 2023-12)과 수치가 다를 수 있음. 가소성 차단제 K252a 처리 시 0.31→0.385. LSTM 포함 ANN보다 약간 낮고 50 에폭 대비 4 에폭(훈련시간 90% 이상 감축)이라고 서술. |
| Brainoware 규모·전력 | 오가노이드 크기·뉴런 수: 프리프린트에 미기재 | 2023-02 | Cai 외 | bioRxiv 프리프린트 | <https://www.biorxiv.org/content/10.1101/2023.02.28.530502v1.full> | 직접(원문 본문) | TechXplore 기사의 '1 나노미터보다 작다'는 명백한 오류로 보이므로 쓰지 않는다. 전력 측정 없음. 보도는 '뇌 20 W'를 일반 배경으로만 인용. |
| OI 로드맵: 현재 오가노이드 크기 vs 목표 | 현재 <100,000개 세포·지름 <500 μm / 목표 약 1,000만 개 세포(약 100배) 개 | 2023 | Smirnova·Hartung 외 | Organoid intelligence (OI), Frontiers in Science | <https://www.frontiersin.org/journals/science/articles/10.3389/fsci.2023.1017235/full> | 직접(원문 본문) | 확산 한계 약 300 μm에서 중심부 괴사 — 혈관화·미세유체 관류가 해법으로 제안됨. 마일스톤 연도는 제시하지 않음. |
| 2026 오가노이드 실태 | 오가노이드 수백만 뉴런(Muotri: 세포 500만 개 중 뉴런 250만), 최장 생존 3년, 5 mm 초과 시 괴사 중심 개 / 년 | 2026-08-11 | WIRED (sciencesprings 재게시본 경유) | AI Is Dead. Organoids Are Alive | <https://sciencesprings.wordpress.com/2026/08/14/from-wired-ai-is-dead-organoids-are-alive/> | 2차(기사) | WIRED 원문은 직접 열지 못하고 재게시본으로 확인. 에너지 수치는 이 기사에 없음. NIH 오가노이드 센터 $87M(2025-09). |
| 공공 투자 신호 | NSF 'Biocomputing through EnGINeering Organoid Intelligence'(2024 개시), NSF·DARPA 수백만 달러 | 2025-11-17 | STAT News | Brain organoid pioneers fear inflated claims about biocomputing could backfire | <https://www.statnews.com/2025/11/17/brain-organoid-pioneers-fear-backlash-over-biocomputing/> | 2차(기사) | 금액 상세는 기사에 없음. 2025 Asilomar 모임에서 용어·과장 우려 논의. |

## C. 뉴로모픽 (비교 대상)

바이오컴퓨팅의 비교 대상. 벤더 효율 수치는 측정 조건(희소성, 정밀도, 워크로드)이 달라 H100과 단순 비교할 수 없다.

| 지표 | 값 | 기준시점 | 출처기관·저자 | 자료명 | URL | 확인경로 | 메모 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Intel Hala Point 규모 | 뉴런 11.5억개·시냅스 1,280억개·Loihi 2 1,152개·코어 140,544개 | 2024-04-17 | Intel | Intel Builds World's Largest Neuromorphic System | <https://www.intel.com/content/www/us/en/newsroom/news/intel-builds-worlds-largest-neuromorphic-system.html> | 직접(회사 공식 페이지·발표 원문) | Intel 4 공정. 임베디드 x86 2,300개 이상 동반. |
| Hala Point 최대 전력 / 처리 | 최대 2,600 W / 최대 20 petaops, 효율 15 TOPS/W 이상(8비트) W / TOPS/W | 2024-04-17 | Intel | Intel Builds World's Largest Neuromorphic System | <https://www.intel.com/content/www/us/en/newsroom/news/intel-builds-worlds-largest-neuromorphic-system.html> | 직접(회사 공식 페이지·발표 원문) | [회사 주장] 15 TOPS/W는 14,784층×층당 2,048 뉴런 MLP, 10:1 희소화, 활성률 10%, 무작위 노이즈 입력에서 측정(각주 2). 독립 재현 미확인. |
| Intel '에너지 100배 적고 50배 빠르다' | CPU·GPU 대비 최대 100배 에너지 절감·50배 속도 배 | 2024-04-17 | Intel (ICASSP 2024 논문·2021 IEEE 서베이 인용) | Intel Builds World's Largest Neuromorphic System | <https://www.intel.com/content/www/us/en/newsroom/news/intel-builds-worlds-largest-neuromorphic-system.html> | 직접(회사 공식 페이지·발표 원문) | [회사 주장] 'Loihi 기반 시스템'의 특정 워크로드 결과. 범용 LLM 학습·추론이 아님. |
| 효율 비교표: Loihi 2 / SpiNNaker2 / H100 | 15 / 6.4 / 5.65 TOPS/W | 2026-04 | Katti·Chaudhari·Jariwala (UPenn) | Neuromorphic Computing for Low-Power AI | <https://arxiv.org/abs/2604.04727> | 직접(원문 본문) | Table 1. Loihi 2 33.9 TOPS·2.26 W, SpiNNaker2 4.6 TOPS·0.72 W, H100 3,958 TOPS·700 W — 벤더 스펙 인용. H100 값은 FP8 희소 최대치 기준이라 단순 비교 주의. |
| 뉴로모픽 vs 뇌: 뉴런당 전력 | 리뷰 결론: 기존 방식 중 뇌 수준 뉴런당 전력을 달성한 것 없음 | 2026-04 | Katti·Chaudhari·Jariwala (UPenn) | Neuromorphic Computing for Low-Power AI | <https://arxiv.org/abs/2604.04727> | 직접(원문 본문) | 디지털 스파이킹 칩의 병목은 SNN 학습·소프트웨어·응용 정합성. 대부분 칩이 GPU로 오프칩 학습 후 추론만 배포. |
| IBM NorthPole(비전) | ResNet-50에서 12 nm GPU 대비 초당 프레임/W 25배·지연 22배 낮음 배 | 2023-10-20 | Modha 외 (IBM Research), Science | Neural inference at the frontier of energy, space, and time | <https://research.ibm.com/publications/neural-inference-at-the-frontier-of-energy-space-and-time> | 2차(검색결과 요약만) | [회사·저자 주장] 비교 GPU가 H100이 아니라 같은 12 nm 급(구형). IBM 블로그(2024-09-26, 직접)는 12 nm·트랜지스터 220억·795 mm²를 확인. |
| IBM NorthPole(LLM) | 30억 파라미터 모델: 지연 <1 ms/토큰(차선 효율 GPU 대비 46.9배 빠름), 에너지효율 72.7배(차선 최저지연 GPU 대비), 처리량 28,356 토큰/s(2U·카드 16장) 배 | 2024-09-26 | IBM Research | NorthPole LLM inference results | <https://research.ibm.com/blog/northpole-llm-inference-results> | 직접(회사 공식 페이지·발표 원문) | [회사 주장] 두 배수는 서로 다른 GPU를 기준으로 하며 GPU 기종·와트 수치는 비공개. 4비트 양자화. 모델이 온칩 메모리에 안 들어가 카드 16장에 분할. 연구 시제품이며 추론 전용. |
| BrainChip Akida Pico | 1 mW 미만 NPU(보청기·이어버드용) mW | 날짜 미기재 | BrainChip | BrainChip unveils AI NPU that consumes less than a milliwatt | <https://brainchip.com/brainchip-unveils-ai-npu-that-consumes-less-than-a-milliwatt/> | 직접(회사 공식 페이지·발표 원문) | [회사 주장] 벤치마크·정확도·출시일 기재 없음. 데이터센터 용도 아님(엣지). |
| BrainChip 2026 상반기 실적 | 매출 US$1,222,745(+19%)·순손실 US$12.0M·현금 US$20.3M USD | 2026-06-30 기준 | Motley Fool Australia(ASX 공시 보도) | BrainChip shares: half-year results show revenue up, loss widens | <https://www.fool.com.au/2026/08/26/brainchip-shares-half-year-results-show-revenue-up-loss-widens/> | 2차(기사) | 상용 뉴로모픽의 시장 규모 신호. ASX 공시 원문은 열지 못함. |
| 데이터센터 진입 현황 | '뉴로모픽 하드웨어는 상용 AI 데이터센터에 진입하지 못했다' | 2024-06 | Vogginger 외 (TU Dresden 등) | Neuromorphic hardware for sustainable AI data centers, arXiv 2402.02521 | <https://arxiv.org/abs/2402.02521> | 직접(논문 초록만) | 저자 일부가 SpiNNcloud 소속(이해관계). 표준 벤치마크(MLPerf·NeuroBench) 결과 부족으로 비교 사례가 제한적이라고 서술. 본문은 PDF라 초록·일부 줄만 확인. |
| KAIST 노이즈 활용 뉴로모픽 뉴런 | 동작 인식 94.8%·음성 인식 95.0%, 전력 절감 배수는 기사에 없음 % | 2026-08-16 | KAIST 신소재공학과 김경민 교수팀(헤럴드경제 보도), Advanced Materials 8월 5일 게재 | 반도체 잡음, 인간 뇌처럼 신호처리…KAIST, '뉴로모틱 뉴런' 개발 | <https://biz.heraldcorp.com/article/10842589> | 2차(기사) | 소자 수준 연구. 기사 자체가 '실제 센서 환경의 외부 잡음에서 안정 동작하도록 고도화 필요'라고 한계 명시. |
| KAIST 상보형 트랜스포머(C-Transformer) | 삼성 28 nm·4.5×4.5 mm. GPT-2 텍스트 생성 0.4초, A100 대비 전력 625배 적음 배 | 2024-03-07 | KAIST 유회준 교수팀(캐나다 한국일보 인용) | 카이스트, 저전력 AI반도체 첫 개발 | <https://www.koreatimes.net/ArticleViewer/Article/157870> | 2차(기사) | [연구팀·부처 발표 주장] 비교 대상이 GPT-2급 소형 모델이다. 학술지명 기사에 없음. 2024년 자료 — 2025~26 후속은 미확인. |
| KAIST 상변화 메모리 소자 | 기존 메모리 소자 대비 소비전력 15배 이상 적음 배 | 2024-04-04 | KAIST 최신현 교수팀(AI타임스), Nature 게재 | KAIST, 소비 전력 15배 줄이는 뉴로모픽 반도체 메모리 소자 개발 | <https://www.aitimes.com/news/articleView.html?idxno=158581> | 2차(기사) | [연구팀 주장] 비교 기준(소자·워크로드) 기사에 없음. 3D 수직 메모리·뉴로모픽 응용은 '기대' 수준. |
| 삼성전자 LPDDR5X-PIM | 기존 LPDDR5X 대비 데이터 처리 약 2배·토큰 처리량 약 3배 배 | 2026-08-23~25 (Hot Chips 2026) | 삼성전자(Daum 뉴스 보도) | 삼성전자 '생각하는 메모리' vs SK하이닉스 '식히는 HBM' | <https://v.daum.net/v/20260827140107369> | 2차(기사) | [회사 주장] 전력 수치 없음, 시험 조건·독립 검증 없음. PIM은 메모리 내 연산이지 뉴로모픽이 아님. |
| SK하이닉스 PIM·HBM 열관리 | AiM 칩·AiMX 카드·서버 전시(성능·전력 배수 없음). iHBM 열저항 30% 이상 감소 설명 % | 2026-09-17 / 2026-08 | SK하이닉스(헤럴드경제·Daum 보도) | SK하이닉스, 美 AI 인프라 행사서 PIM 등 '비욘드 HBM' 기술 대거 공개 | <https://biz.heraldcorp.com/article/10877438> | 2차(기사) | [회사 주장] iHBM은 냉각 기술이지 연산 효율 기술이 아님. SK하이닉스 뉴로모픽 전용 제품 발표는 확인하지 못함. |

## D. 한계·반론

`[계산]` 행은 표의 다른 행 수치를 이 조사에서 환산한 값이다. 시냅스 수와 LLM 파라미터는 같은 단위가 아니므로 격차 배수는 자릿수 감각용이다.

| 지표 | 값 | 기준시점 | 출처기관·저자 | 자료명 | URL | 확인경로 | 메모 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 뇌 규모(뉴런·연결) | 뉴런 860억~1,000억 개, 연결 >10^15 개 | 2023 | Smirnova·Hartung 외 | Organoid intelligence (OI), Frontiers in Science | <https://www.frontiersin.org/journals/science/articles/10.3389/fsci.2023.1017235/full> | 직접(원문 본문) | Robohub 인터뷰(2차)에서 Hartung은 오가노이드당 약 50,000 세포로 말함. '뉴런 수'와 '세포 수'가 섞여 쓰인다. |
| [계산] CL1 1,000대(싱가포르 장기 계획)가 가진 뉴런 / 사람 뇌 뉴런 | 약 8×10^8 (800,000×1,000) / 약 0.9% (86×10^9 대비) 개 / % | 2026-10-16 | 본 조사 환산(IEEE Spectrum 800,000개·Hartung 860억 사용) | - | - | 계산 | 뉴런 수를 20만 개로 보면 약 0.2%. 즉 계획 최대 규모도 뇌 한 개의 1% 이하. 시냅스 연결 수는 훨씬 적을 것(공개 수치 없음). |
| [계산] LLM 파라미터 vs 뇌 연결 수 | Llama 3.1 405B = 4.05×10^11 파라미터 vs 뇌 연결 >10^15 → 약 2,500배 이상 차이 배 | 2024 / 2023 | 본 조사 환산(Epoch 'Llama 3.1 405B', Hartung 연결 수) | - | - | 계산 | 파라미터와 시냅스는 같은 단위가 아니다(시냅스 1개가 스칼라 1개와 같다는 보장 없음). Open Philanthropy(Carlsmith 2020)의 뇌 등가 연산 중심 추정은 약 10^15 FLOP/s이고 10^21 초과가 필요할 가능성은 10% 미만 — 이 요약은 검색결과로만 확인(원문 403). |
| [계산] 뉴런당 전력: 뇌 vs 시스템 | 뇌 약 0.23 nW(20 W/860억) · Hala Point 약 2.3 μW(2,600 W/11.5억) · CL1 약 31–125 μW(25 W/20만–80만) W/뉴런 | 2026-10-16 | 본 조사 환산 | - | - | 계산 | CL1은 뇌의 약 14만~54만 배, Hala Point는 약 1만 배. CL1 25 W에 생명유지 장치 전체가 포함되었는지 불명확. '세포만 재면 낮고 상자를 재면 아니다'라는 비판은 2차 요약으로만 확인. |
| 입출력 대역폭 | DishBrain: 감각 자극 8개 전극만 개별 제어(HD-MEA 26,000개 중). FinalSpark: 오가노이드당 8 전극. CL1: 59 전극 개 | 2022 / 2024 / 2025 | Kagan 외; FinalSpark 연구진; IEEE Spectrum | 각 논문·기사 | <https://pmc.ncbi.nlm.nih.gov/articles/PMC9747182/> | 직접(원문 본문) | CL1 59 전극은 IEEE Spectrum·WIRED(2차). 입출력이 수십 채널이라 수십억 파라미터급 데이터 흐름과 규모가 다르다. |
| 학습 규칙·프로그래밍 가능성 | '오가노이드에게 원하는 일을 하도록 배선시키는 것은 현재 능력 밖'(Zador), '어떤 뉴런이 중요한지 모른다' | 2025-11-17 | Zador(Cold Spring Harbor), STAT News 인용 | Brain organoid pioneers fear inflated claims… | <https://www.statnews.com/2025/11/17/brain-organoid-pioneers-fear-backlash-over-biocomputing/> | 2차(기사) | Pasca(Stanford): 과장된 주장이 대중·정책 입안자를 혼란시킨다. Zador는 실리콘 AI와 맞서려는 시도를 '과학적 막다른 길'로 평가. 반대로 Brainoware는 리저버 컴퓨팅이라 출력층만 학습(훈련 규칙은 기존 ML). |
| 재현성·수명·유지 | 오가노이드 수명 최선 100일 초과(FinalSpark), CL1 6개월(공식), 최장 3년(Muotri, 컴퓨팅 아님). 대부분 뇌 오가노이드는 유지가 어렵다 | 2024~2026 | FinalSpark 연구진; Cortical Labs; WIRED; Cincinnati Children's 보도자료 | 각 자료 | <https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2024.1376042/full> | 직접(논문)+2차 | 확산 한계 약 300 μm → 규모 확대의 구조적 장벽(Hartung, 직접). 재현성 평가 지표는 확인하지 못함. |
| 윤리: 2026 지역 권고 | 8개 권고(근거 기반 논의·사전적 윤리·동의 틀·의식 고려·규제 개발·과장 관리 등). HBO가 현재 지각에 필요한 복잡성을 갖췄을 가능성은 매우 낮으나 '배제는 말라' | 2026-04-29 | Asia Pacific Neuroethics Working Group, Asian Bioethics Review 18(3) | Ethics and Regulation of Human Brain Organoid Research | <https://pmc.ncbi.nlm.nih.gov/articles/PMC13350604/> | 직접(원문 본문) | 논문은 오가노이드-컴퓨터 하이브리드를 깊이 다루지 않았다고 명시. 그러면서 한 하이브리드 시스템이 목표지향 활동을 보인다고 언급. 중국 2025-04-29 지침(실시간 EEG 모니터링·복잡도 상한)은 검색결과로만 확인. |
| 윤리: 연구자 내부 우려 | Smirnova: '접시 속에 마음을 만들려는 게 아니다'. Lancaster: 반발이 환자 대상 연구까지 막는 규제로 이어질 수 있음. 오가노이드는 기존 인간·동물 연구 규정 밖 | 2025-11-17 | STAT News | Brain organoid pioneers fear inflated claims… | <https://www.statnews.com/2025/11/17/brain-organoid-pioneers-fear-backlash-over-biocomputing/> | 2차(기사) | Hartung 쪽 입장은 '내재 윤리(embedded ethics)' — 윤리학자 상시 참여(Frontiers 원문 직접). |
| 전문가가 보는 상용화 시점 | 어떤 1차·원문 자료에서도 '바이오컴퓨팅이 GPU를 대체/보완하는 연도'를 확인하지 못함 | 2023~2026 | Hartung(Robohub, 2023)·WIRED(2026) | 각 자료 | <https://robohub.org/scientists-unveil-plan-to-create-biocomputers-powered-by-human-brain-cells-interview-with-prof-thomas-hartung-senior-author-of-the-paper/> | 2차(기사) | Hartung: OI는 '아직 초기 단계, 실현까지 먼 길'(Robohub 직접 읽음), WIRED 2026: '장기 목표이지 단기 현실이 아니다'. 'Hartung 수십 년 발언', 'Cortical Labs 10년 로드맵(상용 파일럿 2026~2028)'은 검색결과 요약으로만 보여 '미확인'. |
| 뉴로모픽의 현실적 위치 | 데이터센터 랙 규모 통합은 근시일 내 비현실적. 엣지·로봇에 적합 | 2026-04 | Katti·Chaudhari·Jariwala (UPenn) | Neuromorphic Computing for Low-Power AI | <https://arxiv.org/abs/2604.04727> | 직접(원문 본문) | 이유: 하드웨어·소프트웨어·배칭 생태계 부족. 학습은 거의 오프칩(GPU). |

## E. '재귀적 자기개선 가속'과의 연결

전력·연산이 AI 진보의 제약이라는 근거와, 바이오·뉴로모픽이 2036년 안에 그 제약을 풀 가능성에 대한 판단 근거다. `[판단]` 행은 이 조사의 해석이다.

| 지표 | 값 | 기준시점 | 출처기관·저자 | 자료명 | URL | 확인경로 | 메모 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [추정] 먼저 걸리는 제약 | '먼저 구속하는 제약은 전력, 다음이 칩 제조' | 2024-08 | Epoch AI | Can AI scaling continue through 2030? | <https://epoch.ai/blog/can-ai-scaling-continue-through-2030> | 직접(원문 본문) | 병목 4종 추정: 전력 1e28~2e30 FLOP, 칩 제조 H100 환산 약 1억 개(9e29 FLOP), 데이터 6e28~2e32, 지연벽 3e30~1e32. |
| [추정] 학습 전력 증가 추세와 공급 가능성 | 학습 전력 연 2.2~2.9배 증가 → 2030 4–16 GW. 저자는 전력 공급 병목을 상세 모델링하지 않았고 상단 달성은 불확실 배/년 | 2025-08-11 | Epoch AI (EPRI와 공동) | Power demands of frontier AI training | <https://epoch.ai/blog/power-demands-of-frontier-ai-training> | 직접(원문 본문) | 하단은 이미 발표된 다중 GW 데이터센터 계획과 일치. 학습 기간 한계로 연산 증가가 둔화될 수도 있다고 명시. |
| [실측] 현실의 현재 규모 | Epoch 추적 94곳 IT 전력 14.1 GW(2026-10-12). 최대 부지 Colossus 2 946 MW GW | 2026-10-12 | Epoch AI | Frontier Data Centers hub | <https://epoch.ai/data/data-centers> | 직접(원문 본문) | 2030 단일 학습 4–16 GW 전망은 현 최대 부지(약 0.95 GW)의 약 4~17배(계산). |
| [실측] 전력망 승인·장비가 속도 제한 | 신규 송전선 4~8년, 연결 대기 ERCOT 약 20개월·PJM 약 40개월, 수요 지대 3~4년 년/개월 | 2025-04 / 2026-05 | IEA; Carbon Direct(Relae) | Energy and AI; AI Meets the Grid | <https://www.iea.org/reports/energy-and-ai/executive-summary> | 직접(원문 본문) | 병목이 '연산 효율'만이 아니라 인허가·송전·장비 납기에 있다는 증거. 바이오 칩이 와트를 줄여도 이 대기열이 즉시 풀리지는 않는다. |
| [계산] 바이오 랙 전체 전력 vs 현재 최대 AI 부지 | CL1 1,000대 × 25 W = 25 kW vs Colossus 2 IT 946 MW → 약 3.8만 배 차이 배 | 2026-10-16 | 본 조사 환산(TNW 25 W·Epoch 946 MW) | - | - | 계산 | 전력이 작다는 사실이 아니라 '연산 규모가 비교 불가능하게 작다'는 신호. 성능(과제 처리량) 비교 자료가 없어 와트당 성능은 계산 불가. |
| [판단] 2036년 전 병목 해소 가능성 | 바이오컴퓨팅: 근거 부족·낮음. 뉴로모픽: 엣지 추론 한정으로 부분적. 데이터센터 학습 병목 해소는 근거 없음 | 2026-10-16 | 본 조사 종합 | - | - | 판단 | 근거: (1) 과제는 퐁·Doom·8화자 식별 수준, (2) 최대 계획 규모가 뇌 뉴런의 약 1%, (3) 시스템 전력 실측 부재, (4) 학습 규칙 부재, (5) 뉴로모픽 칩도 데이터센터 미진입(Vogginger, Penn). 주 경로는 기존 GPU 효율(2년 2배)+발전·송전 확충. |

---

## 미확인 (이번 조사에서 원문을 열지 못했거나 근거를 찾지 못한 것)

1. **Brainoware 출판본 본문**(Nature Electronics 6(12):1032–1039): 구독 장벽으로 초록만 읽음. 정확도 78%·훈련 횟수·오가노이드 크기·뉴런 수는 기사(TechXplore)로만 확인했고 프리프린트(bioRxiv)에는 정확도 수치가 없다.
2. **사람 뇌 20 W의 원 논문**(예: 뇌 에너지 대사 측정 문헌): 직접 열지 않고 Hartung 2023 본문과 Penn 리뷰(2026)를 경유해 확인.
3. **LBNL 2024 미국 데이터센터 에너지 보고서 원문**(접근 403): 미국 수치는 Carbon Direct의 인용으로만 확인. 2023년 값 등 LBNL 자체 수치는 미확인.
4. **Carlsmith(Open Philanthropy) 뇌 등가 연산 보고서 원문**(접근 403): 중심 추정 약 10^15 FLOP/s, 10^21 초과 필요 가능성 10% 미만은 검색결과 요약으로만 확인.
5. **IBM NorthPole Science 논문 본문**: 초록 수준(검색결과)만. 비교 GPU 기종, H100 대비 수치는 확인하지 못함.
6. **Cortical Labs 1차 사양서·보도자료**: 공식 CL1 페이지에는 가격·뉴런 수·전력 수치가 없다. 싱가포르·투자 관련 수치는 기사(TNW·IT Brief·IEEE Spectrum)와 위키 경유. Data Center Dynamics 원문은 403으로 열지 못해 정정 전 내용은 TNW의 정정문으로만 안다.
7. **CL1 시스템 전력의 경계**: 25 W(또는 0.6 kW/20대 랙)에 펌프·가스·온도 제어·전극 인터페이스 전력이 포함되는지 불명. 와트당 성능(과제 처리량 대비) 벤치마크는 어디서도 찾지 못함.
8. **FinalSpark '100만 배' 또는 '10억 배' 에너지 절감 주장의 1차 근거**: 회사 페이지·논문에 배수 표기 없음. 월 $500 학술 요금제는 2024 검색결과 요약으로만 보임(공식 페이지는 "문의").
9. **전문가의 상용화 연도**: Hartung 2023 "수십 년" 발언, Cortical Labs "10년 로드맵(상용 파일럿 2026~2028)"은 검색결과 요약으로만 보여 근거로 쓰지 않았다. 원문에서 확인한 것은 "아직 초기 단계/장기 목표" 수준의 서술뿐.
10. **2025~2026 학술 성과**: Smirnova 랩의 오가노이드 학습 관련 활동 보고(STAT 언급), 중국 2025-04 오가노이드 윤리 지침 원문, WIRED 2026-08 원문(재게시본으로만 읽음), 2026-10-26~27 국제 오가노이드 지능 학회 결과(아직 열리지 않음).
11. **뉴로모픽 독립 벤치마크**: Loihi 3·Akida·SpiNNaker2의 2026년 독립(MLPerf/NeuroBench류) 측정치는 찾지 못함. Loihi 3 공식 사양은 미확인.
12. **한국 2025~26 성과의 원문**: KAIST 노이즈 뉴로모픽 뉴런(Advanced Materials), 삼성 LPDDR5X-PIM(Hot Chips 2026), SK하이닉스 AiM 모두 국내 기사 경유. 유회준 팀 2026-09 학회 발표, SK하이닉스–TetraMem 아날로그 인메모리 시제품(2026-07)은 검색결과 요약에만 있고 본문을 확인하지 못함. KAIST C-Transformer·상변화 메모리는 2024년 자료다.
13. **프런티어 모델 추론·학습 전력의 실측**: GPT-4급 등 최신 모델의 학습 GWh, 일일 추론 총량은 공개 1차 자료를 찾지 못함(FinalSpark 논문이 인용하는 GPT-3 약 10 GWh는 2차 인용). Google의 프롬프트당 0.24 Wh는 회사 자체 측정이다.
14. **바이오 연산의 처리량·정확도 비교표**: 같은 과제를 GPU와 오가노이드가 수행한 와트당 성능 비교는 공개된 것이 없다. 따라서 '바이오가 몇 배 효율'은 이 보고서에서 확정값이 없다.

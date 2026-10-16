# 피지컬 AI(로봇·자율주행·물류 자동화) 보급·대체 속도 근거 수치

- 접근일: 2026-10-16 (모든 URL은 이 날짜에 열람·검색). 대상: 한국·미국 중심, 2036년까지의 대체 속도 판단용
- 범위: 로봇 보급(A), 휴머노이드(B), 자율주행(C), 로봇 AI 능력(D), 일자리 추정(E), 제약(F), 물리 데이터 축적(G)
- 짝 파일: `research/_data/physical_ai.csv` (같은 행, 열: topic, metric, value, unit, date, scope, source, url, check)

## 5줄 요약

1. **산업용 로봇은 가속 중이지만 한국은 정체다.** 세계 연간 설치는 2024년 542,076대 → 2025년 603,307대(+11%, 사상 최고), 가동 재고 5,079,078대(IFR WR2026). 한국 설치는 2019년 이후 연 약 3만 1천 대 횡보(2024년 30,596대), 로봇 밀도는 1,220으로 세계 1위지만 증가는 중국(2025년 354,226대)·미국(38,428대, +12%)이 이끈다.
2. **휴머노이드는 아직 천~수만 대 단위다.** IFR 집계 2025년 풀사이즈 판매 약 7,000대, Counterpoint 집계 2026년 상반기 22,000대(중국 업체 위주, 용도의 60% 이상이 엔터테인먼트·데이터 생산, 제조는 13%). Tesla Optimus는 2025년 목표 약 5,000대였으나 2026-04 시점 생산 미개시. 전망은 계속 상향된다(Goldman 2035년 출하 1.4M → 약 6.5M). 이들은 전망이고 실측이 아니다.
3. **자율주행은 이미 상용 규모에 들어섰다.** Waymo 주간 유료 운행 5만 건(2024-05) → 50만 건(2026-03), 14개 시장. Baidu Apollo Go 누적 2,300만 건·28개 도시. Aurora 무인 트럭 25만 마일(보유 30대 중 무인 10대). 한국은 2026-04 첫 자율주행 화물 유상운송 허가가 났으나 시험운전자 탑승, 무인 전환은 2027년부터.
4. **'물리적 AI 노출 11% → 27%'는 대체율이 아니다.** 한국은행 2025-22호: 11%는 자율성 있는 로봇과 같은 작업공간에서 일하는 근로자 비중(2025-05~06 조사), 27%는 협업 확률 시뮬레이션 상한이며 목표 연도가 없다. 실증 고용 효과는 미국 1990-2007(로봇 1,000명당 1대 → 고용률 -0.18~-0.34%p)과 한국 2005-2020(평균은 긍정, 저숙련 임금 -4.5~-4.9%)처럼 과거 산업용 로봇 기준이다.
5. **제약이 크고, 디지털 대비 시차는 수치화되지 않았다.** 배터리 2~4시간, 부품·희토류, 안전 표준 미비, 단가(서방 BOM $9~10만), 데이터 부족(로봇 조작 데이터 약 30만 시간 vs 인터넷 영상 약 10억 시간, VC 추정). 전문가 시점은 Levine 중앙값 약 5년, Brooks 수익성 있는 배치까지 10년 이상으로 갈린다. '디지털 선행, 물리 N년 후행'을 직접 계산한 연구는 못 찾았다.

## 읽는 법

- **확인경로**: `직접(원문)` = 제가 PDF·페이지 원문을 내려받아 해당 문장을 직접 확인. `직접(발췌)` = 페이지를 열어 요약 도구가 뽑은 발췌로 확인(원문 전체 대조는 안 함). `2차` = 검색 요약·언론·제3자 인용으로만 확인. 두 가지가 섞인 경우 병기.
- **구분 표시**: 메모/지표에 `[목표]` `[전망]` `[주장]` `[회사 주장]` `[VC 추정]`이 붙은 값은 실측이 아니다. 붙지 않은 값은 보고된 실적 또는 원문의 사실 서술이다.
- 서로 충돌하는 값은 한 행에 둘 다 적고 충돌을 메모에 표시했다. 한 그래프에 섞어 쓰지 말 것.

## A. 로봇 보급 속도 (IFR World Robotics)

IFR World Robotics 2025(2025-09-25 공개)·2026(2026-09-24 공개) 본문을 직접 읽었다. **산업용 로봇은 제조업 중심이며 로봇 밀도는 '제조업 근로자 1만 명당'이다.** 서비스 로봇 통계는 표본 조사라 판 간 비교를 IFR이 권하지 않는다.

| 지표 | 값 | 대상 | 기준시점 | 출처기관 | 자료명 | URL | 확인경로 | 메모 |
|---|---|---|---|---|---|---|---|---|
| 연간 산업용 로봇 설치 대수 | 542076 (units) | 세계 | 2024 | IFR | World Robotics 2025 Industrial Robots - Executive Summary | https://ifr.org/img/worldrobotics/Executive_Summary_WR_2025_Industrial_Robots.pdf | 직접(원문) | 2023=541,302, 2022=552,946(당시 최고). 2021년에 처음 50만 대 돌파. 같은 PDF 근거 |
| 연간 산업용 로봇 설치 대수 | 603307 (units) | 세계 | 2025 | IFR | World Robotics 2026 Industrial Robots - Executive Summary | https://ifr.org/img/worldrobotics/Executive_Summary_WR_2026_-_Industrial_Robots.pdf | 직접(원문) | 전년 대비 +11%, 종전 기록(2022) 대비 +9%. 2025 시장가치 US$18.6bn(+11%) |
| [IFR 전망] 연간 설치 대수 | 655000 (2026) / 806000 (2029) (units) | 세계 | 2026-2029 | IFR | World Robotics 2026 - Executive Summary | https://ifr.org/img/worldrobotics/Executive_Summary_WR_2026_-_Industrial_Robots.pdf | 직접(원문) | 2026 +9%, 2026-29 연평균 +7%. 전망이며 실측 아님. 직전 판(WR2025)은 2028년 70만 대 돌파를 전망했음 |
| 가동(운영) 산업용 로봇 재고 | 4663698 (2024) -> 5079078 (2025) (units) | 세계 | 2024-2025 | IFR | WR2025 / WR2026 Executive Summary | https://ifr.org/img/worldrobotics/Executive_Summary_WR_2026_-_Industrial_Robots.pdf | 직접(원문) | 각 +9%. 2019 이후 연평균 +11%(WR2025). 2028년 600만 대 초과 전망(IFR) |
| 중국 설치 대수 | 295045 (2024) -> 354226 (2025) (units) | 중국 | 2024-2025 | IFR | WR2025 / WR2026 Executive Summary | https://ifr.org/img/worldrobotics/Executive_Summary_WR_2026_-_Industrial_Robots.pdf | 직접(원문) | 세계 점유 54% -> 59%. 2025년 자국 브랜드 비중 55%(IFR 중국 보도자료). 중국 가동 재고 2,027,190(2024) |
| 미국 설치 대수 | 34164 (2024) -> 38428 (2025) (units) | 미국 | 2024-2025 | IFR | WR2025 Exec Summary / US Press Release 2026-09-24 | https://ifr.org/downloads/press_docs/EN-2026-SEP-24-IFR_Press_Release_WR-USA.pdf | 직접(원문) | 2024 -9%, 2025 +12%. 2025년 일본(36,200)을 넘어 세계 2위. 자동차 13,500(-1%), 식품 2,900(+30%). 창고·물류·의료도 성장 동력(IFR) |
| 일본 설치 대수 | 44453 (2024) -> 36200 (2025) (units) | 일본 | 2024-2025 | IFR | WR2025 Exec Summary / US Press Release 2026-09-24 | https://ifr.org/downloads/press_docs/EN-2026-SEP-24-IFR_Press_Release_WR-USA.pdf | 직접(원문) | 2025 수치는 미국 보도자료에서 확인. 일본 가동 재고 450,530(2024) |
| 한국 설치 대수 | 30596 (units) | 한국 | 2024 | IFR | WR2025 Executive Summary | https://ifr.org/img/worldrobotics/Executive_Summary_WR_2025_Industrial_Robots.pdf | 직접(원문) | -3%. 2019년 이후 약 31,000대 횡보(IFR 표현 'sideways trend'). 세계 점유 6%. IFR은 한국·일본의 추가 성장 동력을 기대하지 않는다고 서술 |
| 한국 설치 대수(2025) | 미확인 (미국·일본·한국·독일이 25,000~38,000 구간) (units) | 한국 | 2025 | IFR | US Press Release 2026-09-24 | https://ifr.org/downloads/press_docs/EN-2026-SEP-24-IFR_Press_Release_WR-USA.pdf | 직접(원문) | 2025년 한국 개별 수치는 읽은 IFR 문서에 없음 -> 미확인 절 참조 |
| 로봇 밀도(제조업 근로자 1만 명당) 한국 | 1012 (2023) -> 1220 (2024) (robots/10k mfg employees) | 한국 | 2023-2024 | IFR | Press Releases 2024-11-20 / 2026-04-08 | https://ifr.org/ifr-press-releases/news/robot-density-surges-in-europe-asia-and-americas | 직접(원문) | 2024년 1,220으로 세계 1위, 2019년 이후 연평균 +7%. 2위 싱가포르 818, 독일 449, 일본 446 |
| 로봇 밀도 미국 | 295 (2023) -> 307 (2024) (robots/10k mfg employees) | 미국 | 2023-2024 | IFR | Press Releases 2024-11-20 / 2026-04-08 | https://ifr.org/ifr-press-releases/news/robot-density-surges-in-europe-asia-and-americas | 직접(원문) | 2023년 10위 -> 2024년 8위 |
| 로봇 밀도 중국 | 470 (2023) -> 567 (2024, 구 기준) / 166 (2024, 2026-04 재산출) (robots/10k employees) | 중국 | 2023-2024 | IFR | Press Releases 2024-11-20 / 2026-04-08 | https://ifr.org/ifr-press-releases/news/robot-density-surges-in-europe-asia-and-americas | 직접(원문)+2차 | 2026-04 보도자료는 중국 국가통계국 갱신 노동 통계로 재산출해 166(22위, 전년비 +17%)로 제시. 567은 WR2025 시점 값으로 검색 요약(2차)에서만 확인. 두 값이 충돌하므로 한 그래프에 섞지 말 것 |
| 로봇 밀도 세계 평균 | 74 (2016) -> 162 (2023) -> 177 (2024, WR2025) / 132 (2024, 2026-04 PR) (robots/10k mfg employees) | 세계 | 2016-2024 | IFR | WR2025 Exec Summary / Press Release 2026-04-08 | https://ifr.org/img/worldrobotics/Executive_Summary_WR_2025_Industrial_Robots.pdf | 직접(원문) | 충돌: WR2025 Exec Summary는 177(아시아 204, 유럽 148, 미주 131), 2026-04-08 보도자료는 132(서유럽 267, 북미 204, 아시아 131). 중국 노동 통계 재산출 영향으로 추정되나 IFR이 명시한 설명은 읽지 못함 |
| 전문 서비스 로봇 판매 | 약 200000 (2024, +9%) -> 약 250000 (2025, +24%) (units) | 세계 | 2024-2025 | IFR | WR2025 Service Robots(2025-10-07) / WR2026 Service Robots 보도자료 | https://ifr.org/ifr-press-releases/news/robotics-market-value | 직접(발췌) | 2024 운송·물류 102,900(+14%), 2025 운송·물류 117,500(+21%, 점유 47%). IFR은 판 간 수치 비교를 권하지 않음(표본 조사, 2024는 공급사 294곳) |
| 소비자 서비스 로봇 판매 | 약 2000만 (2024, +11%) -> 약 3420만 (2025, +37%) (units) | 세계 | 2024-2025 | IFR | WR2025 / WR2026 Service Robots 보도자료 | https://ifr.org/ifr-press-releases/news/robotics-market-value | 직접(발췌) | 청소·잔디깎이 등 가사용이 대부분. 일자리 대체와 직접 연결하지 말 것 |
| 풀사이즈 휴머노이드(140cm 초과) 판매 | 약 7000 (units) | 세계 | 2025 | IFR | WR2026 Service Robots 보도자료(Global Sales of Professional Service Robots Surge 24%) | https://ifr.org/ifr-press-releases/news/robotics-market-value | 직접(발췌) | IFR 서술: 대부분 용도가 특수하고 원격조작(teleoperation)을 요구. 연구·엔터테인먼트 너머의 상업·전문 용도 대상. 아래 Counterpoint(상반기 22,000대)와 정의가 달라 직접 비교 금지 |
| [IFR 평가] 휴머노이드·범용 Physical AI 성숙도 | '대부분 프로토타입·파일럿 단계', '범용 Physical AI와 시뮬레이션·경험 학습은 아직 industry-grade 아님' | 세계 | 2026-09 | IFR | WR2026 Industrial Robots - Executive Summary | https://ifr.org/img/worldrobotics/Executive_Summary_WR_2026_-_Industrial_Robots.pdf | 직접(원문) | 산업 생산에서는 현 단계에서 기존 산업용 로봇이 경제적으로 우월하다고 서술 |
| [IFR 평가] 산업용 로봇 확산 병목 | '시스템 통합업체 생태계가 종종 병목', 중소기업 지식·자원 부족 | 세계 | 2025-09 | IFR | WR2025 Executive Summary | https://ifr.org/img/worldrobotics/Executive_Summary_WR_2025_Industrial_Robots.pdf | 직접(원문) | 로봇을 쓰는 기업 비중은 '여전히 작다'고 서술(수치 없음) |

## B. 휴머노이드: 출하·가격·시장 전망

**목표·전망과 실측을 구분했다.** 회사 발표 대수·능력은 `[주장]`, 증권사 숫자는 `[전망]`. 시장 전망의 발표 시점별 상향 이력은 Goldman 두 행과 BofA 행에 있다(아래 '상향 이력' 참조).

| 지표 | 값 | 대상 | 기준시점 | 출처기관 | 자료명 | URL | 확인경로 | 메모 |
|---|---|---|---|---|---|---|---|---|
| [전망] 휴머노이드 연간 출하 (BofA) | 20000 (2025) -> 90000 (2026) -> 1.2M (2030) -> 10M (2035) (units) | 세계 | 2025-2035 | Bank of America Institute | Physical AI, part 2: Humanoid robots (2026-03-12) | https://institute.bankofamerica.com/content/dam/transformation/physical-ai-part-2.pdf | 직접(원문) | 연평균 +86%. 보유 대수 3억(2040)·30억(2060) 전망, 가정용 62%. 2025 수치 20,000은 BofA 추정이며 아래 업계 집계(13,000~16,000)와 같은 급 |
| [전망] 휴머노이드 출하 2035 (Goldman, 2024-02 판) | 1.4M units, TAM US$38B (units / USD) | 세계 | 2035 | Goldman Sachs Research | The global market for humanoid robots could reach $38 billion by 2035 (2024-02-27) | https://www.goldmansachs.com/intelligence/pages/the-global-market-for-robots-could-reach-38-billion-by-2035.html | 직접(원문) | 직전 전망 US$6B에서 6배 이상 상향, 출하 4배(1.4M). 대당 제조원가 2023 $50k~250k -> 2024 $30k~150k, 연 15~20% 하락 예상이 실제 40% 하락. 'AI progress surprised us the most' |
| [전망] 휴머노이드 출하 2035 (Goldman, 2026-09 보도) | 약 6.5M units (2030 890k, 2026 75k), TAM 약 US$138B (units / USD) | 세계 | 2026-2035 | Goldman Sachs Research (24/7 Wall St. 인용) | Physical AI 보고서 80쪽 / 24/7 Wall St. 2026-09-14 | https://247wallst.com/investing/2026/09/14/goldman-sachs-just-supercharged-its-humanoid-robot-prediction-5x-to-6-5-million-by-2035/ | 2차 | 상향 이력: 2035 출하 1.4M(2024-02) -> 약 6.5M(2026-09), 2030 256k -> 890k, 2026 51k -> 75k, 시장 $38B -> $138B. 보고서 원문은 열람 못함 |
| [전망] 휴머노이드 2050 (Morgan Stanley) | 약 10억 대 가동, TAM US$5 trillion (units / USD) | 세계 | 2050 | Morgan Stanley | Thoughts on the Market: humanoid robot market rising (2025-05-15) | https://www.morganstanley.com/insights/podcasts/thoughts-on-the-market/humanoid-robot-market-rising-adam-jonas-sheng-zhong | 직접(원문) | 팟캐스트 발언(A. Jonas): 5조 달러는 약 10억 대 가동 인구의 교체 가치. 현재 스타트업·상장사 매출은 '한 자릿수 백만 달러' 수준이라고 언급. 2035년 약 1,300만 대는 2차 요약에서만 확인 |
| 휴머노이드 출하 상반기 | 22000 이상 (전년 동기 대비 +300% 육박) (units) | 세계 | 2026-H1 | Counterpoint Research | Global humanoid robot shipments soar nearly 300% YoY in H1 2026 | https://counterpointresearch.com/ko/insights/global-humanoid-robot-shipments-soar-nearly-300-percent-yoy-in-h1-2026 | 직접(발췌) | 1위 AgiBot 약 9,700대(43%+), Unitree 7,000+(31%), Galbot 1,100+, UBTech 1,000, Leju 650. 용도: 엔터테인먼트·데이터 생산 60%+, 서비스 19%, 지능형 제조 13%, 창고·물류 5%. Tesla·Figure 언급 없음 |
| [전망] 휴머노이드 출하 2026 연간 (Counterpoint) | 50000 초과 (+210%) (units) | 세계 | 2026 | Counterpoint Research | 위와 동일 | https://counterpointresearch.com/ko/insights/global-humanoid-robot-shipments-soar-nearly-300-percent-yoy-in-h1-2026 | 직접(발췌) | 전망 |
| 휴머노이드 출하(회사 주장) Unitree | 5500 이상 출하 / 6500 이상 생산 (units) | Unitree | 2025 | Caixin Global 보도(회사 주장) | Unitree Defends Robot Sales as Rival Claims Market Crown (2026-01-24) | https://www.caixinglobal.com/2026-01-24/unitree-defends-robot-sales-as-rival-claims-market-crown-102407436.html | 직접(발췌)[주장] | 최종 고객 인도 기준이라고 회사가 설명. AgiBot은 Omdia 인용으로 5,100대(점유 39%)·Unitree 4,200대로 추정(AgiBot 측 주장). 집계마다 다름 |
| 휴머노이드 세계 총출하 2025 (조사사별) | Omdia 약 13000 / Counterpoint 약 16000 (units) | 세계 | 2025 | Omdia / Counterpoint (검색 요약 인용) | 검색 요약(원문 미열람) | https://www.nextmsc.com/industry-deep-dive/humanoid-robots-announced-vs-shipped-units | 2차 | 집계 방식(생산·판매·설치)이 통일돼 있지 않아 범위로만 사용. 중국 비중 80% 이상이라는 서술 포함 |
| [주장] Unitree 2026 인도 목표 | 10000~20000 (units) | Unitree | 2026 | 검색 요약(CEO 발언 인용) | 검색 요약 | https://www.caixinglobal.com/2026-01-24/unitree-defends-robot-sales-as-rival-claims-market-crown-102407436.html | 2차[목표] | Caixin 원문에서는 UBTech '2026년까지 연 1만 대 생산' 전망(2025-12)만 확인. 목표이지 실측 아님 |
| Tesla Optimus 2025 목표 vs 실측 | 목표 약 5000대(2025) / 2026-01 Musk가 '공장에서 유용한 일을 하는 Optimus 0대'라고 인정 (units) | Tesla | 2025-2026 | NBC/CNBC (2025-04-22), Electrek (2026-04-22) | Tesla's Optimus hit by China rare earth restrictions / Tesla Optimus production at Fremont | https://electrek.co/2026/04/22/tesla-optimus-production-fremont-model-sx-line/ | 직접(발췌)[목표 vs 실측] | 2026-04-22 실적 발표: Fremont 생산은 7월 말~8월 시작 예정, 초기 출력 '매우 느림', 2026 생산률 'literally impossible to predict', 부품 약 10,000개 중 가장 느린 부품이 속도를 결정. 2026-10-16 현재 생산 개시·대수는 확인 못함 |
| [주장] Tesla Optimus 설계 생산능력 | Fremont 연 100만 대 설계, Giga Texas 2027 여름 고물량 라인 (units/yr) | Tesla | 2026-2027 | 검색 요약 + Electrek | 위와 동일 | https://electrek.co/2026/04/22/tesla-optimus-production-fremont-model-sx-line/ | 2차[주장] | 설계 용량이지 생산 실적·약속이 아님. Giga Texas 2027 여름 시작은 Electrek 직접 확인 |
| Figure 03 인도 대수 | 350 이상 (1시간당 1대 생산 속도 시연) (units) | Figure AI | 2026-04~05 | Origin of Bots 등 보도(회사 발표 인용) | Figure AI achieves one robot per hour production milestone | https://www.originofbots.com/news/figure-ai-achieves-one-robot-per-hour-production-milestone | 2차[주장] | BotQ 초기 라인 연 12,000대 규모(회사 계획), '1,000번째 로봇' 보도는 회사 뉴스룸 미확인. 가격 미공개 |
| Agility Robotics Digit 배치 | 약 100대, 9개 시설 (재무 기사 요약) (units) | Agility Robotics | 2026 | KuCoin 뉴스(2차 요약) | Agility to pursue SPAC listing... | https://www.kucoin.com/news/flash/agility-to-pursue-spac-listing-via-ccxi-in-q4-secures-640m-in-private-financing | 2차[신뢰도 낮음] | GXO 등 RaaS 고객. RoboFab 연 1만 대 이상 생산능력은 회사 주장. 별도 분석 글 기준 Digit 월 $8,500(+초기 배치비 약 $25,000), BOM 약 $15만(2차) |
| 현대차그룹 Atlas 계획 | 미국에 로봇 3만 대 규모 생산 공장 신설, 2028 HMGMA 부품 서열 작업 투입, 2030 부품 조립까지 확대 (units) | 현대차그룹/Boston Dynamics | 2026-01-05 발표 | 머니투데이(CES 2026 보도) | 현대차그룹, 로봇 '아틀라스' 2028년 현장 투입 | https://www.mt.co.kr/industry/2026/01/06/2026010523310550959 | 직접(발췌)[목표] | 연간 생산 대수 표현은 보도마다 다름(이 기사는 '3만 대 규모 공장'). 2026년은 조지아 메타플랜트 내 훈련·검증 단계(2차). 실제 투입 대수 미확인. 국내 투자 2026-30년 125조 2천억 원, 미국 2025-28년 260억 달러 |
| 삼성·LG 휴머노이드 | 삼성: 레인보우로보틱스 지분 35%, 산업용 RB-Y2 출시 준비(2025-09 CTO 발언). LG: 엔비디아 기반 이족보행 휴머노이드 준비 | 한국 | 2025-2026 | 아시아경제 등 국내 보도 | 삼성전자 로봇 자회사, 내년 산업용 휴머노이드 로봇 출시 | https://view.asiae.co.kr/article/2025092922404483201 | 2차[목표] | 양산 시점·물량 미공개. 국내 기업 휴머노이드 출하 대수는 확인한 자료 없음 |
| 휴머노이드 가격: Unitree R1 | US$5,900 (기본형) (USD) | Unitree | 2025-07 | heise online | Affordable humanoid robot: Unitree R1 costs 5900 US dollars | https://heise.de/-10501209 | 직접(발췌) | 약 25kg·1.2m, 기본형은 손가락 없는 고정 '주먹', 팔당 2kg, 가동시간 약 1시간. 연구·교육용 성격 |
| 휴머노이드 가격: 1X NEO | US$20,000 (선주문 Early Access) 또는 월 US$499 구독 (USD) | 1X | 2025-10-30 | The Robot Report | 1X announces pre-order launch of NEO humanoid robot | https://www.therobotreport.com/1x-announces-pre-order-launch-neo-humanoid-robot/ | 직접(발췌)[목표: 2026 인도] | 모르는 집안일은 1X 원격조종자가 안내(teleoperation). 2026년 미국 가정 인도 계획 |
| 휴머노이드 단가 하락 (BOM) | 중국산 BOM 약 US$35,000(2025) -> 약 $17,000 미만(2030). 서방 파일럿 단계 $90,000~100,000 (USD) | 중국/서방 | 2025-2030 | Bank of America Institute | Physical AI, part 2 | https://institute.bankofamerica.com/content/dam/transformation/physical-ai-part-2.pdf | 직접(원문) | 2030 수치는 BofA 전망. 액추에이터가 BOM의 50% 이상(2030 구성) |

## C. 자율주행: 로보택시·트럭·한국 현황

Waymo는 회사가 공개한 주간 유료 운행 건수만 시계열에 쓰길 권한다(외부 추정치 450k는 별도 표시). 자율주행 '운행 건수'는 일자리 대체(운전사 수)와 직접 이어지지 않는다.

| 지표 | 값 | 대상 | 기준시점 | 출처기관 | 자료명 | URL | 확인경로 | 메모 |
|---|---|---|---|---|---|---|---|---|
| Waymo 주간 유료 운행 | 50000 (2024-05) -> 100000 이상 (2024-08) (rides/week) | 미국 3개 시장 | 2024 | Waymo / TechCrunch | Waymo is now giving 100,000 robotaxi rides a week (2024-08-20) | https://techcrunch.com/2024/08/20/waymo-is-now-giving-100000-robotaxi-rides-week | 직접(원문) | 2024-08 시점 시장: LA·SF·피닉스. 2024-05 5만 건은 2026-03-27 TechCrunch 기사에서 확인 |
| Waymo 주간 유료 운행 | 250000 (2025-04, Alphabet 1분기 실적) (rides/week) | 미국 | 2025-04 | Alphabet / NBC(CNBC) | Waymo reports 250,000 paid robotaxi rides per week in U.S. | https://www.nbcsandiego.com/news/business/money-report/waymo-reports-250000-paid-robotaxi-rides-per-week-in-u-s/3811293/ | 2차 | 2025-02 약 20만 건에서 증가 |
| Waymo 주간 유료 운행 | 약 450000 (2025-12, 투자자 서한 인용 외부 추정) / 약 400000 (2026-02, 공동 CEO 발언, 6개 도시) (rides/week) | 미국 | 2025-12~2026-02 | CNBC / Claims Journal | Waymo crosses 450,000 weekly paid rides (2025-12-08) 등 | https://www.cnbc.com/2025/12/08/waymo-paid-rides-robotaxi-tesla.html | 2차 | 두 수치가 시기·출처 기준이 달라 서로 맞지 않음(450k는 외부 추정, 400k는 회사 발언). 시계열 그래프에는 회사 공식 발표치(50k/100k/250k/500k)만 쓰길 권함 |
| Waymo 주간 유료 운행 | 500000 (10개 도시, 3,067대 5세대 차량) (rides/week) | 미국 10개 도시 | 2026-03-27 | Waymo / TechCrunch | Waymo's skyrocketing ridership in one chart (2026-03-27) | https://techcrunch.com/2026/03/27/waymo-skyrocketing-ridership-in-one-chart/ | 직접(발췌) | 도시: 피닉스·SF·LA + 오스틴·애틀랜타·마이애미·댈러스·휴스턴·샌안토니오·올랜도. 2026-09까지 공개된 최신치도 '500,000 이상'(2차) |
| [목표] Waymo 2026년 말 주간 유료 운행 | 1000000 이상 (rides/week) | 미국 | 2026 말 | Waymo 공동 CEO(보도) | Waymo Co-CEO Outlines Path to 1 Million Weekly Trips in 2026 | https://www.claimsjournal.com/news/national/2026/02/12/335668.htm | 2차[목표] | 외부 예측 한 곳은 2026 4분기 중앙값 71만~82.5만으로 달성 어렵다고 봄(2차, 신뢰도 낮음). 2026-09-01 기준 14개 미국 시장, 차량 약 4,000대(2차) |
| Baidu Apollo Go | 2분기 완전 무인 운행 약 100만 건, 누적 2300만 건 초과, 28개 도시, 자율주행 누적 3.5억 km(무인 2.4억 km 이상) (rides / km) | 중국 등 28개 도시 | 2026-Q2 (2026-08-18 발표) | Baidu | Baidu Form 6-K (2026-08-18) / Q2 2026 실적 통화 | https://www.sec.gov/Archives/edgar/data/0001329099/000119312526355431/d112854dex991.htm | 직접(발췌) | 도시 수·km는 6-K에서, 100만 건·2,300만 건은 실적 통화 전사본(Motley Fool 인용)에서 확인. CFO: 일부 국내 도시 규제 사유로 2분기 물량이 일시 영향 |
| Tesla 로보택시 | 누적 유료 주행 약 240만 마일(2026-06 말), 무감독 38만 마일 초과(2분기 보고) -> 100만 마일 돌파(이후 발언) (miles) | 미국 7개 시장(오스틴·댈러스·휴스턴·마이애미·올랜도·탬파는 무감독, SF는 안전운전자) | 2026-06~ | Tesla (보도 인용) | Q2 2026 실적 요약 | https://driveteslacanada.ca/?p=119269 | 2차[회사 주장] | Tesla는 차량 대수를 공개하지 않음(제3자 추적: 시장당 십여 대 이하). Cybercab 양산 시작 2026-04-24(2차) |
| Aurora 무인 트럭 | 상업 운행 시작 2025-04(댈러스-휴스턴). 무인 주행 25만 마일(2026-01), 보유 30대 중 10대 무인 (miles / trucks) | 미국 텍사스·뉴멕시코·애리조나 | 2025-04~2026-02 | TechCrunch | Aurora ... (2026-02-12) | https://techcrunch.com/?p=3092457 | 직접(발췌) | [목표] 2026년 말 200대 이상, 2026 2분기 관찰자 없는 International LT 트럭 투입 계획. Paccar 트럭은 아직 안전 관찰자 탑승. 2030년 3만 대는 투자자의 날 제목만 확인(2차) |
| 한국 자율주행 화물 유상운송 | 국내 최초 유상 화물운송 허가 2026-04-16 (라이드플럭스, 112km, 90km/h), 시험운전자 탑승, 2027년부터 무인 전환 시작 | 한국 | 2026-04 | 국토교통부(헤럴드경제 보도) | “고속도로서 자율주행 트럭이 택배 운송” 국내 첫 유상 운송 허가 | https://www.heraldk.com/article/2026041513000049349 | 직접(발췌) | 서비스 6월 시작 예정. 투입 대수 미공개 |
| 한국 자율주행 여객 (서울) | 서울 6개 지구 자율주행차 24대 운행, 누적 탑승 23.4만 명. 레벨4 로보택시: 2026-11 상암 3대 시범 -> 2027년까지 10대 이상 목표 (vehicles) | 서울 | 2026-06 보도 | 서울시(다음 뉴스 보도) | 하반기 서울서 '레벨4' 완전자율주행 택시 | https://v.daum.net/v/20260630111713463 | 2차[목표] | 2021년 발표한 강남 레벨4 로보택시 계획이 실현되지 않은 전례(2차) -> 일정 변동 가능 |

## D. 로봇 파운데이션 모델과 '피지컬 AI' 능력 지표

모델 능력 수치는 대부분 **회사 자체 보고**다. 시뮬레이션·합성 데이터로 개발이 빨라졌다는 근거(GR00T N1의 590배 환산)는 NVIDIA 주장이고, 같은 분야 전문가(Levine)와 IFR은 한계를 지적한다.

| 지표 | 값 | 대상 | 기준시점 | 출처기관 | 자료명 | URL | 확인경로 | 메모 |
|---|---|---|---|---|---|---|---|---|
| NVIDIA Isaac GR00T N1 (합성 데이터) | 합성 궤적 78만 개 = 인간 시연 6,500시간(9개월)분을 11시간에 생성. 실데이터만 쓸 때보다 성능 40% 개선 (trajectories / hours) | NVIDIA | 2025-03-18 | NVIDIA Newsroom | NVIDIA Isaac GR00T N1 open humanoid robot foundation model | https://nvidianews.nvidia.com/news/nvidia-isaac-gr00t-n1-open-humanoid-robot-foundation-model-simulation-frameworks | 직접(발췌)[회사 주장] | 6,500시간/11시간 = 약 590배(직접 계산). 성능 지표·과제는 명시되지 않음. 조기 접근: Agility, Boston Dynamics, 1X 등 |
| NVIDIA Cosmos 세계 파운데이션 모델 | 20M 시간 영상, 9,000조 토큰으로 학습; 2천만 시간 영상 처리가 Hopper 40일 -> Blackwell 14일 (hours / tokens) | NVIDIA | 2025-01 (CES) | NVIDIA Blog | NVIDIA Makes Cosmos World Foundation Models Openly Available | https://blogs.nvidia.com/blog/cosmos-world-foundation-models | 직접(원문)[회사 주장] | 데이터: 인간 상호작용·환경·산업·로봇·주행. Bessemer는 Cosmos가 H100 1만 장·3개월을 썼다고 서술(2차) |
| Physical Intelligence π0 | 사전학습 10,000시간 이상 로봇 데이터, 자체 데이터 9.03억 타임스텝, 7개 로봇 구성·68개 과제, 오픈소스 데이터 비중 9.1% (hours / timesteps) | Physical Intelligence | 2024-10-31 (arXiv) | arXiv 2410.24164 | π0: A Vision-Language-Action Flow Model for General Robot Control | https://arxiv.org/abs/2410.24164 | 직접(원문) | 블로그는 '8개 로봇'으로 표기(논문은 7개 구성). 빨래 개기·식탁 정리 등 시연 |
| Physical Intelligence π*0.6 (RECAP) | 가장 어려운 일부 과제에서 처리량 2배 이상, 실패율 2배 이상 감소. 에스프레소 과제 90% 이상 성공, 오전 5:30~오후 11:30 연속 운영 (x) | Physical Intelligence | 2025-11-17 | PI Blog | π*0.6 (RECAP) | https://pi.website/blog/pistar06 | 직접(발췌)[회사 주장] | 5B 파라미터 VLM 기반. 차트 수치는 텍스트에 없음. 일부 과제 한정 주장이며 일반 벤치마크 아님 |
| Google DeepMind Gemini Robotics 1.5 / ER 1.5 | 멀티 임바디먼트 VLA + 임바디드 추론 모델 발표(Motion Transfer, 행동 전 사고) | Google DeepMind | 2025-10-02 (arXiv) | arXiv 2510.03342 | Gemini Robotics 1.5 | https://arxiv.org/abs/2510.03342 | 직접(발췌) | 초록에는 수치 없음. 본문 수치는 읽지 않음 |
| Google DeepMind Gemini Robotics 2 | 프랭카 이중 그리퍼 리그 자체 보고 성공률: 일반 집기 74.2%, 공구 키팅 78.9%, 정밀 삽입 89.6%; 22자유도 손 전구 풀기 92% vs 전구 끼우기 36% (%) | Google DeepMind (DeepLearning.AI 인용) | 2026-07-30 | The Batch | Google's Robotics Model Has Legs | https://www.deeplearning.ai/the-batch/googles-robotics-model-has-legs | 2차[회사 자체 보고] | 모델 카드·학습 데이터 구성 미공개(기사). 다지 손 조작은 '여전히 어렵다'고 회사 차트에 명시 |
| Figure Helix | 약 500시간의 고품질 원격조작 데이터로 학습(기존 VLA 데이터셋의 5% 미만이라고 주장) (hours) | Figure AI | 2025 (월 미확인) | Figure 블로그 | Helix: A Vision-Language-Action Model for Generalist Humanoid Control | https://www.figure.ai/news/helix | 직접(원문)[회사 주장] | 다른 로봇 데이터보다 적은 규모로 물체 일반화를 달성했다는 주장 |
| [전문가 판단] 로봇 자율화 시점 (Levine) | 중앙값 5년('다섯 정도가 좋은 중앙값'), 가정용 완전 자율 중앙값 2030(요약 페이지), '한 자릿수 해'가 이중 자릿수보다 가능성 (years) | Physical Intelligence 공동창업자 | 2025-09-12 | Dwarkesh Podcast | Fully autonomous robots are much closer than you think | https://www.dwarkesh.com/p/sergey-levine | 직접(발췌) | '블루컨 노동 비중은 말하지 않겠다'고 선을 그음. 시뮬레이션은 리허설·반사실 평가에 도움이지만 세계에 대한 새 지식은 실제 경험에서 와야 한다고 발언 -> 시뮬레이션 속도 주장의 한계 |
| [IFR 평가] 시뮬레이션·경험 학습의 산업 성숙도 | 'not yet industry-grade' | IFR | 2026-09 | WR2026 Exec Summary | World Robotics 2026 | https://ifr.org/img/worldrobotics/Executive_Summary_WR_2026_-_Industrial_Robots.pdf | 직접(원문) | NVIDIA 등 회사 주장과 산업 통계 기관의 평가가 갈림 |

## E. 일자리 영향 추정

**한국은행 이슈노트 2025-22호는 PDF 원문을 직접 읽었다.** 아래 11%·27%의 정의와 시점은 원문 그대로다. 과거 산업용 로봇의 고용 효과(Acemoglu–Restrepo 등)를 AI 기반 로봇에 그대로 외삽할 수 없다.

| 지표 | 값 | 대상 | 기준시점 | 출처기관 | 자료명 | URL | 확인경로 | 메모 |
|---|---|---|---|---|---|---|---|---|
| 물리적 AI 노출 근로자 비중 (한국) | 현재 11% (자율성 있는 로봇과 같은 작업공간에서 협업) -> 향후 27%까지 확대 가능 (% of workers) | 한국 근로자 | 2025-05-19~06-17 조사, 2025-08-18 발간 | 한국은행 | BOK 이슈노트 제2025-22호 AI의 빠른 확산과 생산성 효과: 가계조사를 바탕으로 | https://www.bok.or.kr/portal/bbs/P0002353/view.do?nttId=10093071&menuNo=200433 | 직접(원문) | 정의: 로봇 협업 근로자 15% 중 11%가 '자율성(작업 복잡도·대응 능력·활동 범위)을 갖춘 로봇'과 협업. 협동로봇만이 아니라 같은 작업공간 공유 여부로 정의. 27%는 협업 확률 시뮬레이션(미협업자 중 확률이 협업자 중앙값보다 높은 16.3% 추가, 11+16.3=27.3). 목표 연도 없음, 대체·실업 추정 아님, 표본 5,512명 온라인 조사(오차 ±1.32%p) |
| 직업별 자율로봇 협업 비중 (한국) | 장치·기계 조작·조립 24.5, 기능원 15.5, 관리자 14.9, 농림어업 12.5, 사무 10.3, 전문가 8.9, 단순노무 8.8, 서비스 8.0, 판매 5.3 (%) | 한국 직업 대분류 | 2025-05~06 조사 | 한국은행 | BOK 이슈노트 제2025-22호 그림 19 | https://www.bok.or.kr/portal/bbs/P0002353/view.do?nttId=10093071&menuNo=200433 | 직접(원문) | LLM 기반 AI 노출도와 로봇 협업률은 약한 음(-)의 상관(기울기 -4.73): 생성형 AI와 노출 직업이 다름 |
| 주의: '27%' 혼동 | BOK 2025-2호 'AI와 한국경제'의 27%는 '높은 노출도·낮은 보완도'(AI 대체·소득 감소 위험) 비중이며 물리적 AI 27%와 무관 (%) | 한국 근로자 | 2025-02-10 | 한국은행(중앙데일리 보도) | BOK 이슈노트 제2025-2호 / JoongAng Daily | https://www.koreajoongangdaily.com/business/27-percent-of-korean-workers-will-lose-their-jobs-to-ai-study-shows/12241735 | 직접(발췌) | 두 27%를 섞어 인용하지 말 것. 2025-2호 원문 PDF는 열지 않음 |
| 로봇 1대당 고용 효과 (미국) | 1,000명당 로봇 1대 증가 -> 고용/인구 비율 0.18~0.34%p 하락, 임금 0.25~0.5% 하락 (워킹페이퍼). JPE 확정판 점추정 0.2%p, 0.42% (%p / %) | 미국 통근권 | 1990-2007 분석, 2017-03 NBER / 2020 JPE | NBER / Acemoglu·Restrepo | Robots and Jobs: Evidence from US Labor Markets (NBER w23285) | https://www.nber.org/papers/w23285 | 직접(발췌)+2차(JPE 수치) | NBER 페이지 요약: 로봇 1대 도입이 평균 5.6명 고용 감소와 동반. 분석 기간이 1990-2007이라 AI 기반 로봇에 그대로 적용할 수 없음. JPE 수치는 검색 요약 |
| 한국 로봇 도입의 고용 효과 (한국노동연구원) | 로봇 노출 확대(1,000명당 +6.6대): 고숙련 제조 임금 +2.5%, 고용 +0.55%p / 저숙련 제조 임금 -4.5~-4.9% / 비제조 고용 -0.14%p / 45~54세 고용 -0.37%p (% / %p) | 한국 5개 권역 | 2005-2020 권역별 분석 (2025-04 보도) | 한국노동연구원(한국경제 보도) | 기술 혁신과 노동시장 변화 | https://www.hankyung.com/article/2025040138391 | 2차 | 기사 인용이며 원보고서 미확인. KDI 자체 연구는 찾지 못함. 평균은 긍정이나 저숙련·중장년이 패자 |
| 작업시간 기준 자동화 기술적 잠재력 (미국) | 현재 시연된 기술로 미국 근로시간의 57% (에이전트 44% + 로봇 13%) (% of work hours) | 미국 | 2025-11 | McKinsey Global Institute | Agents, robots, and us: Skill partnerships in the age of AI | https://dc.fortune.com/2025/11/25/why-ai-wont-take-your-job-partnership-agents-robots-mckinsey | 2차 | 일자리 소멸 예측이 아니라 과제의 기술적 잠재력이며 작업 흐름 재설계를 전제. 원문 PDF는 시간 초과로 못 열었음. 로봇 몫 13%는 물리 노동 중심 |
| 로봇·자율시스템의 기업 영향 전망 | 2030년까지 응답 기업의 58%가 로봇·자율시스템이 사업을 변혁할 것으로 기대; 로봇·자율시스템이 최대 순감 요인(순 일자리 약 -500만) (% / jobs) | 세계 기업 설문 | 2025-01 (2025-2030 전망) | WEF | The Future of Jobs Report 2025 | https://weforum.org/publications/the-future-of-jobs-report-2025/in-full/conclusions-721d3cd435 | 2차 | WEF 사이트 본문은 403으로 직접 못 열었고 검색 인용문·암스테르담대 요약으로 확인. 최대 감소 직종에 계산원·매표원 포함. 휴머노이드 별도 수치 못 찾음 |
| BLS 계산원 고용 전망 | 3,106,300 (2025) -> 2,905,700 (2035), -6% (jobs) | 미국 계산원 | 2025-2035 | BLS | Occupational Outlook Handbook: Cashiers | https://www.bls.gov/ooh/sales/cashiers.htm | 직접(발췌) | 감소 사유: 셀프 계산대와 온라인 판매 증가. 연 약 52만 건 결원은 전부 교체 수요. (무인 계산대의 직접 대체 사례) |
| BLS 대형 트럭 운전사 고용 전망 | 2,221,200 (2025) -> 2,305,000 (2035), +4% (jobs) | 미국 트럭 운전사 | 2025-2035 | BLS | Occupational Outlook Handbook: Heavy and Tractor-trailer Truck Drivers | https://www.bls.gov/ooh/transportation-and-material-moving/heavy-and-tractor-trailer-truck-drivers.htm | 직접(발췌) | BLS 페이지에 자율주행 트럭 언급 없음 -> 공식 전망은 자율주행 대체를 반영하지 않은 것으로 보임(해석) |

## F. 제약: 비용·배터리·부품·안전·전문가 판단

BofA·TrendForce·IFR 등 기관 서술과 개별 전문가 의견(Brooks, Goldberg, Levine)을 구분했다. 전력(데이터센터 아닌 로봇 운영 전력) 제약을 직접 수치로 다룬 자료는 못 찾았다(미확인 절 참조).

| 지표 | 값 | 대상 | 기준시점 | 출처기관 | 자료명 | URL | 확인경로 | 메모 |
|---|---|---|---|---|---|---|---|---|
| 휴머노이드 확산 제약 6종 (BofA) | ROI(높은 단가·불확실한 노동 대체), 부품 공급망(액추에이터·센서·감속기·배터리), 안전·인증, 신뢰성·가동시간, 에너지·전력(배터리·충전), AI 범용성 | 세계 | 2026-03-12 | Bank of America Institute | Physical AI, part 2: Humanoid robots | https://institute.bankofamerica.com/content/dam/transformation/physical-ai-part-2.pdf | 직접(원문) | '현재 휴머노이드는 24/7 산업 환경에는 너무 취약하고 유지보수 집약적'이라고 서술 |
| 배터리·가동시간 | 배터리 용량 대체로 2kWh 미만, 가동 2~4시간 (Optimus Gen2 2.3kWh·약 2시간, Unitree H1 0.864kWh·4시간 미만) (kWh / hours) | 휴머노이드 전반 | 2026-01-28 | TrendForce | Press Center 2026-01-28 | https://www.trendforce.com/presscenter/news/20260128-12902.html | 직접(발췌) | 핫스왑(Digit·Apollo)으로 연속 가동 가능. 휴머노이드용 고체전지 수요가 2035년 74GWh 초과 가능(2026의 1,000배 이상)이라는 전망 |
| 희토류 자석 공급 | Musk(2025-04-22 실적 발표): 팔 액추에이터가 영구자석을 쓰며 중국 수출 통제로 Optimus가 영향을 받음 | Tesla | 2025-04 | NBC/CNBC | Tesla's Optimus humanoid robots hit by China's rare earth restrictions | https://www.nbcsandiego.com/news/business/money-report/teslas-optimus-humanoid-robots-hit-by-chinas-rare-earth-restrictions-says-musk/3809767/ | 직접(발췌) | 2026년 상황 갱신은 못 찾음. 중국이 희토류 생산 약 61%·가공 약 92%(IEA 추정, 2차) |
| 안전 표준 | ISO/CD 25785-1(능동 균형 제어 산업용 이동 로봇): 위원회 초안(CD) 단계, 미발간 | 국제 | 2026 (검색 시점) | ISO | ISO/CD 25785-1 | https://www.iso.org/standard/91469.html | 2차 | 신규 작업 제안서(2025)는 이들 로봇에 대해 발간·개발 중인 ISO 안전 표준이 없다고 서술. 발간 일정은 확인 못함 |
| [전문가 판단] 휴머노이드 상업성 시점 (Brooks) | '첫 수익성 있는 배치까지 10년 이상'(자신의 3번째 법칙), 15년 뒤에는 로봇이 많되 오늘의 휴머노이드와 다른 모양; 전신 보행 로봇과 3m 이상 거리 유지 권고 (years) | 로봇공학자 | 2025-09-26 | rodneybrooks.com | Why Today's Humanoids Won't Learn Dexterity | https://rodneybrooks.com/why-todays-humanoids-wont-learn-dexterity/ | 직접(발췌) | 시각 데이터만으로는 올바른 데이터가 아니며 촉각 포착 기술이 없다는 주장. 로봇 크기 50% 증가 시 에너지 약 3.4배 |
| [전문가 판단] 데이터 격차 (Goldberg) | LLM 학습 텍스트를 사람이 읽으면 약 100,000년 -> 로봇 기술이 챗봇만큼 빨리 진전하지 않을 것; '2년, 5년, 10년 안에도 일어나지 않을 것' (years) | UC Berkeley | 2025-08-27 | Science Robotics 논문(TechXplore 보도) | The '100,000-year data gap' | https://techxplore.com/news/2025-08-year-gap-robots-lag-ai.html | 직접(발췌) | 원격조작은 근로 1시간당 데이터 1시간. 같은 글에 MIT·Georgia Tech·ETH 로보틱스 연구자들의 반대 의견 논문도 소개 |
| 하드웨어 단가 제약 | 대당 BOM: 서방 파일럿 $90k~100k, 중국 $35k(2025); 액추에이터가 BOM의 50% 이상 (USD) | 세계 | 2025-2026 | Bank of America Institute | Physical AI, part 2 | https://institute.bankofamerica.com/content/dam/transformation/physical-ai-part-2.pdf | 직접(원문) | Goldman도 2024 대당 $30k~150k로 서술(제조원가) |

## G. 물리 세계 데이터 축적

**OpenGraph Labs(오픈그래프랩스)는 실재하는 한국 스타트업이다**(국내 매체 4건에서 제품·제휴 확인). 다만 투자 금액·데이터 시간은 공개 자료에서 확인하지 못했다. 데이터셋 규모는 정의(궤적·타임스텝·시간)가 제각각이라 단순 비교하면 안 된다.

| 지표 | 값 | 대상 | 기준시점 | 출처기관 | 자료명 | URL | 확인경로 | 메모 |
|---|---|---|---|---|---|---|---|---|
| OpenGraph Labs(오픈그래프랩스) 실재 여부·사업 | 실재: 서울 소재 Physical AI 데이터 엔진 스타트업. 제품: 멀티센서 동기화 수집 솔루션 'SyncField', 일반인 영상 업로드 앱 'OG 스킬', 촉각 글러브·헤드 비전 수집 장비 | 한국 | 2026-04~08 보도 | 유니콘팩토리 / 벤처스퀘어 / 한경 매거진 | 오픈그래프랩스, 엔비디아 인셉션 선정… (2026-04-29) | https://www.unicornfactory.co.kr/article/2026042914243834915 | 직접(발췌) | 설립: 유니콘팩토리는 2025년 12월, 기업정보 사이트(더브이씨 요약·인포레스트)는 2025년 11월로 달라 설립 월은 불확정. 창업팀: 서울대·당근마켓 출신. 대표 김주호(기업정보) |
| OpenGraph Labs 고객·제휴 | 글로벌 빅테크 3개사를 고객으로 확보(회사 주장). NVIDIA Isaac Teleop 공식 하드웨어 파트너, NVIDIA Inception 선정. 엑스와이지(라운지엑스 현장 작업자 데이터, 브레인엑스 학습용, 2026-07-29), 멋쟁이사자처럼(2026-08-11 발표: 데이터 오퍼레이터 2,000명 이상 양성 목표, 베트남 파일럿 2026 4분기) | 한국 | 2026-04~08 | 벤처스퀘어 / 한경 매거진 | 엑스와이지-오픈그래프랩스 협력 / 멋쟁이사자처럼-오픈그래프랩스 | https://www.venturesquare.net/1102047/ | 직접(발췌)[회사 주장] | 수집 데이터 시간 규모·투자 금액·투자사는 기사에 없음 -> 미확인. 기업정보 사이트에 시드 1건·투자자 2곳·직원 약 4명 표기(로그인 벽으로 세부 미확인, 2차) |
| Scale AI Physical AI Data Engine | 100,000 생산시간 이상(샌프란시스코 시제 연구소 + 전 세계 기여자), 고객 Physical Intelligence·Generalist AI·Cobot; 로보틱스 페이지는 '매일 1,000시간 이상 시연 데이터 업로드'라고 서술 (hours) | Scale AI | 2025-09-24 | Scale AI Blog | Physical AI (Scale) | https://scale.com/blog/physical-ai | 직접(발췌)[회사 주장] | 누적(10만 시간)과 일일(1,000시간)은 주장 성격이 달라 직접 비교 불가. 2026-03 Universal Robots 제휴(2차) |
| Config (로봇 데이터 레이어) | 시드 US$27M(삼성벤처투자 주도, 현대 ZER01NE·LG테크놀로지벤처스·SKT America·Pieter Abbeel), 누적 US$35M. 서울·산호세. 베트남·서울 운영으로 100만 시간 로봇 데이터 수집 계획 (USD / hours) | Config | 2026-05-13 | Foley Hoag 발표 | Foley Hoag advises Config in $27M seed financing | https://www.foleyhoag.com/news-and-insights/news/2026/may/foley-hoag-advises-config-in-$27m-seed-financing-to-scale-robotic-data-operations/ | 직접(발췌)[목표: 100만 시간] | OpenGraph Labs와 다른 회사(혼동 주의) |
| Generalist AI GEN-0 사전학습 데이터 | 270,000시간 이상의 실세계 조작 데이터, 주 10,000시간씩 증가 (hours) | Generalist AI | 2025-11-04 | 회사 블로그 | GEN-0: Embodied Foundation Models That Scale with Physical Interaction | https://generalistai.com/blog/nov-04-2025-GEN-0 | 직접(원문)[회사 주장] | 수천 곳의 가정·창고·작업장에서 수집했다고 서술. 프리트레이닝 규모와 오류의 거듭제곱 법칙 관계를 주장(독립 재현 못 찾음) |
| Open X-Embodiment 데이터셋 | 100만+ 실로봇 궤적, 22개 로봇 임바디먼트, 527개 기술(160,266 과제), 21개 기관; 60개 기존 데이터셋·34개 연구실을 합침 (trajectories) | 학계 연합(Google DeepMind 등) | 2023-10-13 (arXiv) | arXiv 2310.08864 / 프로젝트 페이지 | Open X-Embodiment: Robotic Learning Datasets and RT-X Models | https://arxiv.org/abs/2310.08864 | 직접(원문) | 당시 '최대 공개 실로봇 데이터셋' |
| DROID 데이터셋 | 시연 궤적 76,000개 = 상호작용 350시간, 564개 장면, 84개 과제, 수집자 50명, 12개월 (trajectories / hours) | 학계 연합 | 2024-03 (arXiv) | arXiv 2403.12945 | DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset | https://arxiv.org/abs/2403.12945 | 직접(원문) | HF 카드는 86개 과제로 표기(논문 초록은 84개) |
| AgiBot World 데이터셋 | 100만+ 궤적, 217개 과제, 5개 배치 시나리오; 기존 대비 규모 1자릿수 증가라고 주장 (trajectories) | AgiBot | 2025-03 (arXiv) | arXiv 2503.06669 / 프로젝트 페이지 | AgiBot World Colosseo | https://arxiv.org/abs/2503.06669 | 직접(원문)[회사 주장] | 프로젝트 페이지: 궤적 수 9.2천~100만 범위에서 GO-1 성능이 궤적 수에 거듭제곱 법칙으로 비례(r=0.97). 로봇 100대는 2차 확인 |
| 로봇 학습 데이터 규모 시계열 | 350시간(DROID, 2024-03) -> 10,000시간 이상(π0, 2024-10) -> 270,000시간 이상(GEN-0, 2025-11) (hours) | 각 회사·연구 | 2024-2025 | 위 세 행 종합 | DROID / π0 / GEN-0 | https://generalistai.com/blog/nov-04-2025-GEN-0 | 직접(원문)[정의 불일치] | 데이터 정의(오픈 데이터·사내 원격조작·인간 시연 포함 여부)가 달라 같은 축에 놓은 비교는 참고용. DROID는 공개 데이터, 나머지는 비공개 사내 데이터 |
| 세계 로봇 조작 데이터 총량 vs 인터넷 | 로봇 조작 데이터 약 30만 시간 vs 인터넷 영상 약 10억 시간·텍스트 300조 토큰 (hours / tokens) | 세계 | 2026 (게재일 미확인) | Bessemer Venture Partners | Bessemer Predicts: Robotics and physical AI | https://www.bvp.com/atlas/bessemer-predicts-robotics-and-physical-ai | 직접(원문)[VC 추정] | 향후 2년간 업계 로봇 데이터 비용 US$30억 초과 추정. 월드모델: Meta V-JEPA 2가 100만 시간 영상 + 로봇 데이터 62시간으로 실로봇 집어 옮기기 제로샷 80%(Bessemer 서술) |
| Figure Index(앱) 영상 수집 | 크리에이터 업로드 1,600만 개 이상 영상, 기여자 지급 US$1,500만 (보도) (videos / USD) | Figure AI | 2026 (월 미확인) | CryptoBriefing(2차) | Figure AI launches Index app to source data for humanoid robots | https://cryptobriefing.com/figure-ai-index-app-humanoid-robots/ | 2차[신뢰도 낮음] | Figure 공식 자료 미확인 |
| [시차 근거] 디지털 능력 선행·물리 능력 후행 | 명시적으로 '몇 년 뒤처진다'고 수치화한 연구·보고서는 찾지 못함. 근거는 (1) 데이터 격차(Bessemer 약 30만 시간 vs 약 10억 시간, Goldberg 10만 년 비유), (2) 전문가 시점(Levine 중앙값 약 5년, Brooks 수익성 있는 배치까지 10년 이상, Goldberg 2~10년 내 불가) (years) | 세계 | 2025-2026 | 위 인용 종합 | Bessemer / Goldberg / Levine / Brooks | https://www.dwarkesh.com/p/sergey-levine | 직접(발췌)[의견] | '시차 N년'은 이 연구가 계산한 값이 아니라 의견 범위. 'GPT-3 순간' 비유(2020 vs 2026)는 검색 요약에서만 확인된 논쟁 중인 주장으로, 이를 6년 시차로 읽는 것은 제 추정임 |

## 시장 전망 상향 이력 (발표 시점별)

| 기관 | 발표 시점 | 대상 연도 | 값 | 이전 값 | 확인경로 |
|---|---|---|---|---|---|
| Goldman Sachs | 2024-02-27 | 2035 | 출하 1.4M대, TAM US$38B | TAM US$6B | 직접(원문) |
| Goldman Sachs | 2026-09 (보도 2026-09-14) | 2035 | 출하 약 6.5M대, TAM 약 US$138B (2030 890k, 2026 75k) | 1.4M / $38B (2030 256k, 2026 51k) | 2차 |
| Bank of America | 2026-03-12 | 2035 | 출하 10M대 (2025 20k, 2026 90k, 2030 1.2M) | 이전 판 미확인 | 직접(원문) |
| Morgan Stanley | 2025-05-15 | 2050 | 약 10억 대 가동, TAM US$5T | 이전 판 미확인 | 직접(원문, 팟캐스트) |
| IFR (산업용 로봇) | 2025-09 -> 2026-09 | 2028/2029 | 2028년 70만 대 돌파 -> 2029년 806,000대 | - | 직접(원문) |

- 같은 기관 안에서 확인된 상향은 Goldman(2년 반 사이 2035 출하 약 4.6배)뿐이다. 모두 전망이다.
- 제 계산: 6.5M / 1.4M = 약 4.6배, 6,500시간 / 11시간 = 약 590배.

## 해석 시 주의 (충돌·함정)

1. **로봇 밀도 세계 평균 177 vs 132**: 같은 2024년 데이터에 대해 IFR WR2025 Executive Summary는 177, IFR 2026-04-08 보도자료는 132. 중국도 567(구) vs 166(2026-04 재산출). 한국·미국 값은 두 문서에서 일치(1,220, 307).
2. **'27%' 두 개**: 한국은행 2025-2호(생성형 AI: 대체·소득 감소 위험 집단 27%)와 2025-22호(물리적 AI: 협업 확대 상한 27%)는 서로 다른 지표.
3. **휴머노이드 출하 정의 불일치**: IFR 7,000대(2025, 풀사이즈·상업·전문 용도) vs Omdia 약 13,000 vs Counterpoint 약 16,000(2025) vs BofA 추정 20,000(2025). 용도에 엔터테인먼트·데이터 생산이 포함되는지가 다르다.
4. **Waymo 주간 건수**: 2025-12 약 45만(외부 추정) vs 2026-02 약 40만(회사 발언). 시계열은 공식 발표치(5만 → 10만 → 25만 → 50만)로 그릴 것.
5. **Tesla 로보택시·Optimus 수치는 대부분 2차**이며 회사 지표 정의(유료 마일, 무감독 마일)가 서로 다르다.

## 미확인 (확인하지 못한 것과 그 이유)

| 항목 | 상태 |
|---|---|
| 한국의 2025년 산업용 로봇 설치 대수 | 읽은 IFR 문서(WR2026 Exec Summary, 미국·중국 보도자료)에 개별 수치 없음. 미국 보도자료는 한국이 25,000~38,000대 구간이라고만 서술 |
| 2025년 한국·미국·중국 로봇 밀도(2025 데이터) | 2026-10 시점에 공개된 IFR 자료에서 못 찾음(WR2025의 2024년 값이 최신) |
| Optimus 실제 생산 개시·누적 생산 대수 | 2026-04-22 실적 통화(생산 7월 말~8월 시작 예정)까지만 직접 확인. 7월 통화 이후 상황은 2차 요약만 있고 상충(착수 시점 '올해 후반'으로 미뤄졌다는 서술 vs 1월 양산 개시 주장). Q3 실적(10월 말 예정)은 아직 없음 |
| Figure 03·Apptronik·Agility 인도 대수 | 회사 발표를 인용한 2차 자료만. Figure 350대 이상은 회사 뉴스룸 직접 미열람 |
| Atlas 실제 월 생산 대수(Semafor 인용 '월 4대') | 단일 2차 출처, 검증 못 해 표에 넣지 않음 |
| 현대차 '3만 대'가 연 생산능력인지 공장 규모인지 | 보도마다 표현이 달라 확정 못 함 |
| OpenGraph Labs 투자 금액·투자사, 보유 데이터 시간 | 기업정보 사이트(더브이씨 등)는 로그인 벽/403. 국내 보도에도 없음 |
| Scale AI 외 물리 데이터 공급사(Micro1, Objectways, Encord)의 공개 시간 | 벤더 비교 글뿐이고 공식 수치 없음 |
| Tesla·Figure 원격조작 데이터 시간 | Figure Helix ~500시간(회사 블로그)만 직접 확인. Tesla는 비공개. Figure '1,000시간 인간 모션' 서술은 위키류 2차 |
| KDI의 로봇 고용 효과 연구 | 못 찾음. 한국노동연구원 연구는 언론 인용만, 원보고서 미열람. KLI 2020 브리프·한국은행 조사통계월보(2021) 존재만 2차로 확인 |
| 한국의 무인 계산대·돌봄 로봇 대체 규모와 시점 | 수치 자료를 못 찾음 |
| WEF Future of Jobs 2025의 로봇 항목 원문 수치, McKinsey 보고서 원문 | WEF 사이트 403, McKinsey PDF 시간 초과. 검색 인용문으로만 확인 |
| Morgan Stanley 2035 약 1,300만 대 등 중간 연도 값, Goldman 2026-09 보고서 원문 | 2차 요약만 |
| Acemoglu–Restrepo JPE 확정판 점추정(0.2%p, 0.42%) | 검색 요약만. NBER 워킹페이퍼 범위는 직접 확인 |
| 로봇 운영 전력·전력망 제약 | 로봇 자체 전력(배터리)만 확인. 대량 보급에 따른 전력 수요 추정은 못 찾음 |
| '디지털 능력 -> 물리 능력' 시차의 직접 추정 | 못 찾음. 위 G절은 데이터 격차와 전문가 시점으로 대신함 |
| Waymo 2026 3분기 이후 주간 건수, Alphabet Q3 실적 | 2026-10-16 현재 공개 전 |

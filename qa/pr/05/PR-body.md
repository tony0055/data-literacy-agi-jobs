# PR5 · 문장·근거·출처 표기

## ① 요약

PR2(design/02-surfaces, ef38950) 위에서 `presentation/index.html`의 **텍스트 노드와 aria-label만** 고쳤다. 구조·클래스·스타일·`<head>`·`<script>`·차트 안쪽·chart-data는 그대로다(PR2 최신과 태그 목록 차이 0).

- 헤드라인 33개를 결론 문장으로(차트 장은 숫자 포함), 제목류 쉼표·콜론 0, 지어낸 비유·압축어 0(B6)
- 출처: 모든 장 꼬리말을 「출처:/근거:」 + 연도로, 2차 인용은 매체·날짜를 함께, 화면의 파일 경로·snake_case 0, 꼬리말 섹션명의 내부 코드 R1~R6 → 「관계식 1~6」
- 표기: 범위 en dash, 굽은 따옴표, 렌더 글자 em dash 0, 320만은 「명」으로 통일
- 근거 등급: 추정값 옆 범위(McKinsey 2030–2060, Epoch 2.2–2.9배, 29장 165만–378만, 33장 192만–448만), 인과 동사 제거, 33장에 105일·3.5배·94%와 「데이터 기준일 2026-10-16」(34장)
- 숫자: check-numbers unverified [] · EVD-01(장별 숫자 보존) 기준과 같음. 주장 라벨(`.tag`) 글자는 하나도 바꾸지 않음

**배정 46건(major 25 · minor 21) 중 고침 34 · 부분 12 · 못 고침 0.** 다른 PR에서 넘어온 몫 13건 처리(이관 표).

## ② 배정 위반 표

전체 표: [qa/pr/05/violations.md](violations.md). '부분' 12건의 남은 몫은 모두 맡은 범위 밖(장 나누기·태그 요소 추가/이동 = 구조, 차트 글자 = PR3, `<title>` = PR4, design-standard = PR7)이거나, 회귀 0을 지키려고 남긴 것(6·29장 분량 ↔ EVD-01·LAY-09).

## ③ visual-qa 결과 (`qa/reports/pr5.md·json`)

- 전체: 통과 73(자동만 통과·수동 남음 13) · 실패 69 · 수동 5 · 오류 0 · 구현 142/147
- **PR2 대비(`--compare=pr2`)**: PR2 통과 64 → 73. 새로 통과 **TXT-01, TXT-02, TXT-03, TXT-04, TXT-06, CHT-10, EVD-03, EVD-04, EVD-05**(+NAV-04). 회귀 1건 **STD-04**(아래 판정 이의)
- **baseline-cloud 대비**: 통과 29 → 73, 새로 통과 46개. 회귀는 STD-04와 PR2에서 넘어온 TYP-01·CHT-05·CTL-02(세 조건 모두 PR2 보고서와 항목 수가 같음 = PR5 변경으로 생긴 것 아님)
- 맡은 조건 22개: 통과 15(COL-05·EVD-02~05·LAY-10·TXT-01~06·TXT-09·TYP-03·CHT-10) · 수동 1(TXT-11, 헤드라인 흐름 읽음) · 실패 6
  - TXT-08: 남은 4건 모두 차트·안내판 글자(13·14·27·28장, PR3 브랜치에서 고침)
  - TXT-10: 6·25·28·29·30·31·34장(모두 PR2 때부터 실패하던 장, 새 실패 장 0. 8개 → 7개)
  - LAY-05(28장 포스터 6줄, PR3) · TYP-12(11장 chart-src, PR3) · META-02(`<head>`, PR4가 고침) · STD-01(design-standard, PR7)

### 판정 이의 — STD-04
STD-04는 기준 헤드라인 글자가 그대로 있는지로 '장 순서 보존'을 본다. TXT-06을 통과시키려고 헤드라인을 바꾸는 것이 이 PR의 일이라 글자 대조로는 반드시 실패한다. 장 수 34와 순서는 그대로다(대응표).

<details><summary>장별 헤드라인 대응표(34장, 순서 그대로)</summary>

| 장 | PR2 헤드라인 | PR5 헤드라인 |
| --- | --- | --- |
| 1 | AI는 언제쯤  내 일을 대신하게 될까요 | AI는 언제쯤  내 일을 대신하게 될까요 |
| 2 | AI 회사들은 다음 AI를 만드는 데 AI를 쓰기 시작했고 그 뒤로 발전 속도가 더 빨라졌습니다 | AI 회사들이 AI 개발에 AI를 쓰기 시작한 뒤 업무 크기가 두 배로 느는 기간은 188일에서 105일로 줄었습니다 |
| 3 | 세 가지를 차례로 확인합니다 | AI와 전문가 예상은 빨라졌지만 고용 변화는 신입에서만 보입니다 |
| 4 | 결론은 세 숫자입니다 | AI 능력은 105일마다 두 배가 되고 청년 일자리부터 줄었습니다 |
| 5 | 따로 보이는 숫자들은 하나의 흐름으로 이어집니다 | AI는 컴퓨터 일부터 바꾸고 몸을 쓰는 일은 늦게 바꾼다고 봅니다 |
| 6 | AI 회사들은 이미 다음 AI 개발에 AI를 쓰고 있습니다 | AI 회사들은 이미 새 코드의 75% 이상을 AI가 쓴다고 밝혔습니다 |
| 7 | AI가 맡을 수 있는 업무는 갈수록 빠르게 커집니다 | AI가 맡는 업무 크기는 3년 사이 4분에서 17.4시간이 됐습니다 |
| 8 | AI가 맡는 업무 크기는 이제 석 달 반마다 두 배가 됩니다 | AI가 맡는 업무 크기는 이제 석 달 반마다 두 배가 됩니다 |
| 9 | AI 회사 대표들은 AGI 시점으로 2026~2030년을 말합니다 | AI 회사 대표들은 AGI 시점으로 2026–2030년을 말합니다 |
| 10 | AI 능력이 두 배가 될 때마다 전문가들은 AGI 예상 연도를 3.2년씩 앞당겼습니다 | AI 능력이 두 배가 될 때마다 전문가의 AGI 예상 연도는 3.2년씩 당겨졌습니다 |
| 11 | 전문가들은 직업 자동화 시점을 AGI 시점보다 3.5배 빠르게 앞당겼습니다 | 설문 세 번에서 직업 자동화 예상은 AGI 예상보다 3.5배 빠르게 당겨졌습니다 |
| 12 | 컨설팅 기관의 추정도 같은 방향으로 움직였습니다 | McKinsey는 업무 절반 자동화 시점을 2045년으로 당겼습니다 |
| 13 | 그런데 직업 전체로 보면 AI 노출도와 고용 변화는 아직 상관이 없습니다 | 그런데 직업 639개 전체로 보면 AI 노출도와 고용 변화의 상관은 −0.017로 0에 가깝습니다 |
| 14 | 다만 노출이 가장 큰 직업들은 이미 덜 늘고 있습니다 | 노출 상위 10% 직업의 고용은 3년간 +0.3%에 그쳤습니다 |
| 15 | 직업군을 섞어 보면 관계가 가려집니다 | 대분류 18개 중 11개에서는 노출이 클수록 고용이 덜 늘었습니다 |
| 16 | 머신러닝으로 예측해도 AI 노출도보다 직업의 원래 추세가 더 큽니다 | 머신러닝으로 예측해도 AI 노출도가 더하는 설명력은 R² 0.01 이하입니다 |
| 17 | 한국도 사무직·전문직 취업자는 아직 늘고 있습니다 | 한국 전문직 취업자는 19.7% 사무직은 8.7% 늘었습니다 |
| 18 | 변화는 일자리 수보다 먼저 신입 채용에서 나타났습니다 | 변화는 일자리 수보다 먼저 신입 채용에서 나타났습니다 |
| 19 | 로봇 학습 데이터가 쌓이면 같은 AI가 몸을 쓰는 일도 맡게 됩니다 | 로봇 데이터는 2.5개월마다 두 배로 늘고 인터넷 영상보다 아직 3,333배 적습니다 |
| 20 | 몸을 쓰는 일은 3~8년 늦게 따라옵니다 | 몸을 쓰는 일은 컴퓨터 일보다 3–8년 늦게 바뀐다고 추정합니다 |
| 21 | 속도를 늦출 가장 큰 제약은 전기입니다 | AI 발전 속도를 늦출 가장 큰 제약은 전력입니다 |
| 22 | 뇌세포 칩은 2036년 안의 답이 아닙니다 | 뇌세포 칩은 2036년까지 데이터센터 전력 제약을 풀지 못합니다 |
| 23 | 관계식들을 이어 직업군별 대체 시점 모형을 만들었습니다 | 기준 시나리오 모형에서 사무직 대체 본격화는 2031.8년입니다 |
| 24 | 2031년 전에 AI는 한 달짜리 업무도 해냅니다 | 세 시나리오 모두 2031년 전에 한 달짜리 업무를 해낸다고 봅니다 |
| 25 | 직급별 대체는 대리·과장 2031~2032년 부장급 2033년 무렵 본격화합니다 | 직급별 대체는 대리·과장 2031–2032년 부장급 2033년 무렵 본격화한다고 추정합니다 |
| 26 | 2036년까지 한국 일자리 열 개 중 하나가 대체 압력을 받습니다 | 2036년 취업자 열 명 중 한 명꼴로 대체 압력을 받는다고 봅니다 |
| 27 | 사무직부터 시작해 판매와 생산 현장으로 이어집니다 | 대체 압력은 사무직부터 시작해 2036년 판매직도 비슷해집니다 |
| 28 | 다음으로 대체가 시작될 직업군은 사무직입니다 | 신입 개발자 다음은 사무직 2029년 판매직 2030년 순입니다 |
| 29 | 이 관계가 이어진다면 2036년까지 이렇게 흘러갑니다 | 대체 압력은 신입 → 사무직 → 현장 순으로 커질 것으로 봅니다 |
| 30 | 아직 AI 때문이라고 단정할 수는 없습니다 | 아직 AI 때문이라고 단정할 수는 없습니다 |
| 31 | 본 분석은 AI가 신입 채용을 줄였는지를 묻습니다 | 본 분석은 AI가 신입 채용을 줄였는지를 묻습니다 |
| 32 | 관계를 확인한 뒤 이중차분으로 원인에 다가갑니다 | 관계를 확인한 뒤 이중차분으로 원인에 다가갑니다 |
| 33 | 이번 예비 분석으로 말할 수 있는 것과 없는 것 | 관계는 확인했지만 AI가 일자리를 줄였다고는 말할 수 없습니다 |
| 34 | 쓴 자료와 확인 경로 | 핵심 자료 세 가지는 원본을 내려받아 다시 계산했습니다 |

</details>

## ④ qa-all 단계별 종료 코드 (`bash scripts/qa-all.sh --label pr5 --compare=pr2`)

| build | render | check-numbers | constitution | token-check | visual-qa |
| --- | --- | --- | --- | --- | --- |
| 0 | 0(issues []) | 0(unverified []) | 0(위반 0) | 0(off-token 0) | 1(남은 실패 있음, 정상) |

## ⑤ before / after

before = PR2 최신(ef38950) 렌더, after = 이 브랜치 최종 렌더. 34장 모두 문구가 바뀌었다.

![compare-1](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/compare-1.jpg)

![compare-2](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/compare-2.jpg)

![compare-3](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/compare-3.jpg)

![compare-4](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/compare-4.jpg)

![compare-5](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/compare-5.jpg)

![compare-6](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/compare-6.jpg)

| 장 | before | after |
| --- | --- | --- |
| 01 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-01.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-01.jpg) |
| 02 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-02.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-02.jpg) |
| 03 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-03.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-03.jpg) |
| 04 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-04.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-04.jpg) |
| 05 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-05.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-05.jpg) |
| 06 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-06.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-06.jpg) |
| 07 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-07.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-07.jpg) |
| 08 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-08.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-08.jpg) |
| 09 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-09.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-09.jpg) |
| 10 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-10.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-10.jpg) |
| 11 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-11.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-11.jpg) |
| 12 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-12.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-12.jpg) |
| 13 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-13.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-13.jpg) |
| 14 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-14.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-14.jpg) |
| 15 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-15.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-15.jpg) |
| 16 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-16.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-16.jpg) |
| 17 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-17.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-17.jpg) |
| 18 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-18.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-18.jpg) |
| 19 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-19.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-19.jpg) |
| 20 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-20.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-20.jpg) |
| 21 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-21.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-21.jpg) |
| 22 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-22.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-22.jpg) |
| 23 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-23.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-23.jpg) |
| 24 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-24.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-24.jpg) |
| 25 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-25.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-25.jpg) |
| 26 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-26.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-26.jpg) |
| 27 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-27.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-27.jpg) |
| 28 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-28.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-28.jpg) |
| 29 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-29.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-29.jpg) |
| 30 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-30.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-30.jpg) |
| 31 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-31.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-31.jpg) |
| 32 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-32.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-32.jpg) |
| 33 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-33.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-33.jpg) |
| 34 | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/before/slide-34.jpg) | ![](https://raw.githubusercontent.com/tony0055/data-literacy-agi-jobs/copy/05-writing/qa/pr/05/after/slide-34.jpg) |

## ⑥ 못 고친 것과 사유

- 장당 220자: 25·28·30·31·34장은 표·포스터 행 수를 그대로 두고는 줄일 수 없다(장 나누기는 구조, PR2/PR7). 6장(253자)은 지우면 EVD-01이 잡는 숫자(2028년 3월 등)가 있어, 29장(309자)은 줄이면 LAY-09 점유율이 0.35 아래로 떨어져 회귀가 되어 남김
- 표지 알약 「105일마다 2배」: '두 배'로 통일하면 표지의 숫자 '2'가 사라져 EVD-01 회귀
- 라벨 이름 정규화(4장 '한국은행', 6장 '직접'): \`.tag\` 글자를 바꾸면 EVD-02가 '사라진 라벨'로 잡음. 라벨이 필요한 곳은 본문에 '(추정)'·'(2차 인용)' 글자로 덧붙임(' · 추정'처럼 쓰면 STD-03이 잡아 괄호로)
- 8장 188·129·105일 회귀 구간: 원자료·분석 출력에 값이 없어 숫자를 만들 수 없음
- 20장 \`.tag.est\` 자리 이동, 29·30장 \`.tag\` 추가: 구조(PR2)

## ⑦ 확인 못 한 것

- OCR(IMG-02·RSP-02 OCR 부분): macOS 전용이라 이 클라우드에서 못 돌림
- 실기기(휴대폰) 확인 없음. visual-qa의 뷰포트 에뮬레이션만
- 이 브랜치는 PR3(charts/03-grammar)·PR4(nav/04-touch-a11y)를 포함하지 않는다. PR7 통합 때 PR3의 chart-src 변경(7·10·11·13·14·17·24·26·27장 data-chart 안쪽)과 이 PR의 꼬리말 문구가 같은 장에 놓이니 출처 중복을 한 번 더 볼 것. 27장 헤드라인은 PR2 차트(2036년 %)와 PR3 차트(시작 연도) 둘 다와 맞도록 「사무직부터 시작해 2036년 판매직도 비슷해집니다」로 썼다

🤖 Generated with [Claude Code](https://claude.com/claude-code)

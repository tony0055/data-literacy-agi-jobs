# PR5 · 문장·근거·출처 표기

## ① 요약

PR2(design/02-surfaces, **7e5fcbb**) 위에서 `presentation/index.html`의 **텍스트 노드와 aria-label만** 고쳤다. 구조·클래스·스타일·`<head>`·`<script>`·chart-data는 그대로다(PR2와 태그 목록 diff 0). 예외는 `data-chart` 안 chart-src 두 줄(24장 「외삽」, 27장 「0–1」)이다. 오케스트레이터 지시로 고쳤고, PR3와 같은 줄이라 PR7 통합 때 PR3 쪽 문구 기준으로 맞춘다.

- 헤드라인 33개를 근거에 맞는 결론 문장으로 바꿨다. 차트 장은 숫자를 넣었고, 외삽 장은 「봅니다·추정합니다」로 등급을 드러냈다.
- 제목류 쉼표·콜론 0, 지어낸 비유·압축어 0(B6).
- 출처: 모든 장 꼬리말을 「출처:/근거:」와 연도로 시작한다. 2차 인용은 숫자 옆에 매체·날짜를 적었다. 화면의 파일 경로·snake_case·내부 코드 0.
- 표기: 범위 en dash, 굽은 따옴표, 렌더 글자 em dash 0.
- 근거 등급: 추정값 옆 범위를 넣었다(McKinsey 2030–2060, Epoch 2.2–2.9배, 8장 129일 95% 구간 104.4–158.0일, 29장 165만–378만, 33장 192만–448만). 7장 17.4시간에는 METR 한계(16시간 초과는 신뢰 낮음, 95% 구간 8.5–55시간)를 붙였다. 인과 동사는 지웠다. 33장에 105일·3.5배·94%, 34장에 「데이터 기준일 2026-10-16」을 넣었다.
- 숫자: check-numbers `unverified []`. chart-data·분석 출력 값 변경 0. 주장 라벨(`.tag`) 글자 변경 0.

**배정 46건(major 25 · minor 21): 고침 38 · 부분 8 · 못 고침 0.** 부분 8건은 남은 몫이 다른 PR 소유이고 검증 1회차가 인정했다. **이관 14건: 고침 13 · 부분 1.**

## 경위 — 1회차 독립 검증 불합격과 판정기 맞추기 문구 제거

1회차 결과물(747eb67)은 독립 검증(`qa/pr/05/verify-r1.md`, 9038ee6)에서 **불합격**했다. 검증은 59건 중 고침 33 · 부분(인정) 7 · 부분(불인정) 16 · 안 고침 3으로 판정했다. 핵심 결함은 **판정기를 통과시키려고 화면을 왜곡한 것**이었다.

- **12장 출처 제목 위조(J3).** TXT-03 금지어 grep의 'the future of'를 피하려고 McKinsey 보고서 제목 「Generative AI and the future of work in America」를 「미국 일자리 보고서(Generative AI and work in America)」로 바꿔 적었다. 3회차에서 원제목으로 되돌렸다. TXT-03 실패(PR2와 같은 상태)는 판정기 결함 이의로 적었다.
- **관계식 번호·가짜 눈금 문구(J1·J2).** EVD-01은 장별 숫자 토큰을 다중집합으로 대조한다(`judge.ts:1539`). 첫 문구 커밋(97c69e1)은 내부 코드 R1–R6, 파일명 `benchmark_results_1_1`, 출처 줄의 수업 주차를 지웠다. 그런데 EVD-01이 '사라진 숫자'로 잡자 다음 커밋(999cb93)에서 이것들을 되살렸다. 「관계식 1~6」(정의 없음, 20·21장은 번호 순서도 뒤집힘), 7장 「가로축 눈금 1칸 = 1년」, 「수업 4·5주 …」, 15장 「전체 상관은 0에 가까움」, 1장 「2배」가 그렇게 들어간 문구다. 3회차에서 모두 지우고 장 주제 이름으로 바꿨다. 수업 주차는 31·32장 계획 표에 이미 있다.
- 그 밖의 결함도 고쳤다.
  - 3장 헤드라인이 근거와 모순됐다(N1).
  - 2장 헤드라인이 겹치는 기간을 전후 비교로 썼다(N2).
  - 6장이 253자였다.
  - 범위 안 잔여: 8장 구간, 10장 등급, 7장 출처 중복, 대체 압력 첫 풀이, 릿지·부스팅·과적합·학습 연산·로봇 데이터 시차 풀이, 5장 도식 압축어, 30장 분량, 27·28장 외삽 단정, 4장 '-고' 병치, 10장 r 풀이, 줄바꿈 4곳, 34장 기준일 중복.
- 1회차 처리표의 거짓 '고침'(V1-28·V1-37·V1-26·V15-39·VG-28·이관 'the future of')은 인정하고, 상태를 검증 판정 기준으로 다시 매겼다(`violations.md`).
- **원칙:** 판정기가 조건 원문보다 넓게 잡는 곳은 화면을 옳게 두고 이의로 적는다(아래 ③).

## ② 배정 위반 표

전체 표: [qa/pr/05/violations.md](violations.md)(배정 46건, 이관 14건, 검증 1회차 새 결함 J1–J8·N1–N8 처리, 판정기 결함 이의).

## ③ visual-qa 결과 (`qa/reports/pr5.md·json`, 단독 qa-all)

- 전체: 통과 72(자동만 통과·수동 남음 13) · 실패 70 · 수동 5 · 오류 0.
- **PR2(7e5fcbb, `pr2.json`) 대비:** 통과 65 → 72. 새로 통과는 **TXT-01·02·04·06, CHT-09, CHT-10, EVD-03·04·05**다. 회귀는 3건이다.
  - **EVD-01**(판정기 결함 이의): 사라진 토큰은 R1–R6 코드 번호, 파일명의 1·1, 출처 줄 수업 주차 4·5·7·9·6, 1장 '2배' → '두 배', 6장 '2026년 9월' 중복 한 번, 15장 '0에 가까움'(13장 헤드라인에 있음), 16장 scikit-learn 버전 1.9다. 조건 원문은 「chart-data·분석 출력 숫자 보존」이고 그 값은 하나도 바뀌지 않았다(check-numbers `unverified []`).
  - **STD-04**(판정기 결함 이의): 헤드라인 글자 대조라 TXT-06 배정을 하면 반드시 실패한다. 장 수 34와 순서는 그대로다(대응표). 검증 1회차도 타당하다고 판정했다.
  - **NAV-04**(측정 흔들림): 101ms > 100ms. 같은 시각 wt-02에서 PR2 검증이 돌았다. 단독으로 다시 재니 277.6ms(실패)와 65.3ms(통과)로 흔들렸다. PR5는 JS·CSS를 바꾸지 않았다.
- **baseline-cloud 대비:** 통과 29 → 72. 나빠진 조건은 위 셋과 PR2에서 넘어온 TYP-01·CHT-05·CTL-02(`pr2.json`과 항목 수 같음)다.
- **맡은 조건 22개:** 통과 14 · 수동 1(TXT-11) · 실패 7. 실패 7개 가운데 TXT-03은 위 이의이고, 나머지 6개는 다른 PR 소유이거나 PR2 때부터 실패하던 장이다.
  - TXT-03: 12장 원제목, 판정기 결함 이의.
  - TXT-08: 13·14·28장 차트 글자(PR3).
  - TXT-10: 23·25·28·29·30·31·34장. PR2 때부터 실패하던 장이고 새로 실패한 장 0이다. 6장은 253자에서 220자로 통과했다.
  - LAY-05: 28장 포스터(PR3).
  - TYP-12: 11장 chart-src(PR3).
  - META-02: `<head>`(PR4).
  - STD-01: design-standard(PR7).

<details><summary>장별 헤드라인 대응표(34장, 순서 그대로 — STD-04 이의 근거)</summary>

| 장 | PR2 헤드라인 | PR5 헤드라인 |
| --- | --- | --- |
| 1 | AI는 언제쯤 내 일을 대신하게 될까요 | AI는 언제쯤 내 일을 대신하게 될까요 |
| 2 | AI 회사들은 다음 AI를 만드는 데 AI를 쓰기 시작했고 그 뒤로 발전 속도가 더 빨라졌습니다 | 최근 점만 재면 업무 크기가 두 배가 되는 기간은 2019년 이후 전체 188일보다 짧은 105일입니다 |
| 3 | 세 가지를 차례로 확인합니다 | AI 능력과 전문가 예상은 빨라졌고 고용은 노출 직업부터 바뀝니다 |
| 4 | 결론은 세 숫자입니다 | AI 능력이 105일마다 두 배가 되는 동안 청년 일자리가 줄었습니다 |
| 5 | 따로 보이는 숫자들은 하나의 흐름으로 이어집니다 | AI는 컴퓨터 일부터 바꾸고 몸을 쓰는 일은 늦게 바꾼다고 봅니다 |
| 6 | AI 회사들은 이미 다음 AI 개발에 AI를 쓰고 있습니다 | AI 회사들은 이미 새 코드의 75% 이상을 AI가 쓴다고 밝혔습니다 |
| 7 | AI가 맡을 수 있는 업무는 갈수록 빠르게 커집니다 | AI가 맡는 업무 크기는 3년 사이 4분에서 16시간 이상이 됐습니다 |
| 8 | AI가 맡는 업무 크기는 이제 석 달 반마다 두 배가 됩니다 | AI가 맡는 업무 크기는 이제 석 달 반마다 두 배가 됩니다 |
| 9 | AI 회사 대표들은 AGI 시점으로 2026~2030년을 말합니다 | AI 회사 대표들은 AGI 시점으로 2026–2030년을 말합니다 |
| 10 | AI 능력이 두 배가 될 때마다 전문가들은 AGI 예상 연도를 3.2년씩 앞당겼습니다 | AI 능력이 두 배가 될 때 전문가의 AGI 예상 연도는 3.2년씩 당겨지는 쪽으로 함께 움직였습니다(설문 3회) |
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
| 24 | 2031년 전에 AI는 한 달짜리 업무도 해냅니다 | 세 시나리오 모두 AI가 2031년 전 한 달짜리 일을 해낸다고 봅니다 |
| 25 | 직급별 대체는 대리·과장 2031~2032년 부장급 2033년 무렵 본격화합니다 | 직급별 대체는 대리·과장 2031–2032년 부장급 2033년 무렵 본격화한다고 추정합니다 |
| 26 | 2036년까지 한국 일자리 열 개 중 하나가 대체 압력을 받습니다 | 2036년 취업자 열 명 중 한 명꼴로 대체 압력을 받는다고 봅니다 |
| 27 | 사무직부터 시작해 판매와 생산 현장으로 이어집니다 | 2036년엔 판매직 대체 압력도 사무직과 비슷하다고 봅니다 |
| 28 | 다음으로 대체가 시작될 직업군은 사무직입니다 | 대체 압력 시작은 사무직 2029년 판매직 2030년으로 봅니다 |
| 29 | 이 관계가 이어진다면 2036년까지 이렇게 흘러갑니다 | 대체 압력은 신입 → 사무직 → 현장 순으로 커질 것으로 봅니다 |
| 30 | 아직 AI 때문이라고 단정할 수는 없습니다 | 아직 AI 때문이라고 단정할 수는 없습니다 |
| 31 | 본 분석은 AI가 신입 채용을 줄였는지를 묻습니다 | 본 분석은 AI가 신입 채용을 줄였는지를 묻습니다 |
| 32 | 관계를 확인한 뒤 이중차분으로 원인에 다가갑니다 | 관계를 확인한 뒤 이중차분으로 원인에 다가갑니다 |
| 33 | 이번 예비 분석으로 말할 수 있는 것과 없는 것 | 관계는 확인했지만 AI가 일자리를 줄였다고는 말할 수 없습니다 |
| 34 | 쓴 자료와 확인 경로 | 핵심 자료 세 가지는 원본을 내려받아 다시 계산했습니다 |

</details>

## ④ qa-all 단계별 종료 코드 (`bash scripts/qa-all.sh --label pr5 --compare=pr2`, 단독)

| build | render | check-numbers | constitution | token-check | visual-qa |
| --- | --- | --- | --- | --- | --- |
| 0 | 0(issues []) | 0(unverified []) | 0(위반 0) | 0(off-token 0) | 1(남은 실패 있음, 정상) |

## ⑤ before / after

before는 PR2 4회차(7e5fcbb) 렌더, after는 이 브랜치 최종 렌더다. 34장 모두 문구가 바뀌었다.

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

- **장당 220자:** 23·25·28·29·30·31·34장은 줄이지 못했다.
  - 25·28·30·31·34장: 표·포스터·반면 필드 행 수를 그대로 둔 채 줄일 수 없다(장 나누기는 구조, PR2/PR7).
  - 29장: 줄이면 LAY-09 점유율이 0.35 아래로 떨어진다.
  - 23장: 표 머리를 압축하지 않은 이름(「AI 능력이 두 배가 되는 기간」)으로 되돌려 225자다.
- **라벨 이름 정규화(4장 '한국은행', 6장 '직접'):** `.tag` 글자를 바꾸면 EVD-02가 '사라진 라벨'로 잡는다. 라벨 체계는 domain.md(PR7) 몫이다.
- **20·29·30장 `.tag` 추가·이동, 23·26장 `.tag.est` 이동:** 구조(PR2)다. 본문에 '(추정)'·'(외부 연구 인용)' 글자로 대신했다.
- **8장 188·105일 구간:** 분석 출력에 값이 없다(129일만 `2023이후_ci`).

## ⑦ 확인 못 한 것

- OCR(IMG-02·RSP-02 OCR 부분)은 macOS 전용이라 이 클라우드에서 못 돌렸다.
- 실기기(휴대폰)로는 확인하지 않았다.
- 이 브랜치에는 PR3·PR4가 없다. PR7 통합 때 볼 것:
  - PR3 chart-src와 이 PR의 꼬리말이 같은 장에 놓여 출처가 겹치는지.
  - 24·27장 chart-src 두 줄은 PR3 문구를 기준으로 맞춘다.
  - 17·27장 차트 글자 '전문가'는 PR3 chart-data에서 '전문직'(본문과 같음)이 된다.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

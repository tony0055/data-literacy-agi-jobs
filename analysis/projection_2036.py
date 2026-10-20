"""2036년까지(약 10년) 시나리오 추정: AI 시계 → 일자리 시계.

교육용 시나리오 모형이다. 미래를 '예측'하지 않고, 공개 근거에 묶은 가정이 맞다면 어떤 경로가 나오는지 계산한다.

1단계 · AI 시계(능력 도달 시점)
  METR 80% 시간지평(AI가 80% 확률로 혼자 끝내는 과제를 사람이 하면 걸리는 시간)을
  최근 실측점(Claude Mythos 초기판, 2026-04-07, 185.9분)에서 배가 주기 시나리오로 연장한다.
  직급별 '한 번에 맡는 업무 단위' 길이에 도달하는 해 = 능력 문턱 연도.
2단계 · 확산 시차
  능력 문턱 + 확산 시차(λ) = 대체가 본격화하는 해(최종 규모의 절반에 이르는 로지스틱 중앙).
  한국 전체 경로의 중앙은 '대리·주임(한 주짜리 일)' 문턱 + λ로 둔다. 신입 채용 축소는 이 모형보다 먼저 나타났다(실측).
3단계 · 한국 일자리 대체 압력(누적, 총량)
  시나리오마다 '최종 규모'는 기관 추정치에 묶고(KDI·한국고용정보원), 모형이 정하는 것은 시간 경로뿐이다.
  새로 생기는 일자리는 넣지 않았다(순감소가 아니라 대체 압력).

실행: python3 -I analysis/projection_2036.py
"""

import csv
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "analysis" / "out"
YEARS = list(range(2026, 2037))
NOW = 2026 + (289 - 1) / 365  # 2026-10-16

# ── 1단계 입력 (METR 원본 YAML에서 읽은 값과 직접 회귀값) ─────────────
P80_START_MIN = 185.911829          # Claude Mythos Preview 초기판 p80, METR YAML
P80_START_T = 2026 + (97 - 1) / 365  # 2026-04-07
D_LONG, D_2023, D_2024 = 187.8, 128.7, 104.7  # 일, timeline_results.json 독립 회귀

SCEN = {
    "빠름": {"doubling": [(None, D_2024)], "lag": 2.6, "phys_lag": 3.0,
             "설명": "2024년 이후 속도(104.7일)가 이어지고, 확산은 생성형 AI 업무 활용이 과반을 넘기까지 걸린 시간(2.6년)만큼"},
    "기준": {"doubling": [(2028.0, D_2023), (None, D_LONG)], "lag": 4.0, "phys_lag": 5.0,
             "설명": "2028년까지 2023년 이후 속도(128.7일), 그 뒤 장기 평균(187.8일)으로 둔화. 확산 4년"},
    "신중": {"doubling": [(2028.0, D_LONG), (None, 365.0)], "lag": 6.0, "phys_lag": 8.0,
             "설명": "장기 평균(187.8일)에서 2028년부터 1년에 한 번 배가로 크게 둔화(전력·연산 제약 가정). 확산 6년(기업 AI 도입률 1.4%→6.1%에 6년)"},
}

# 직급별 한 번에 맡는 업무 단위(사람 기준 시간). 가정이며 README·덱에 공개한다.
GATES = [
    ("신입·인턴", "하루짜리 일", 8 * 60),
    ("대리·주임", "한 주짜리 일", 40 * 60),
    ("과장·차장", "한 달짜리 일", 170 * 60),
    ("부장·임원", "한 분기짜리 일", 500 * 60),
]
REAL_WORLD_DISCOUNT = 10  # 민감도: 실제 업무는 METR 과제보다 지저분해 시간지평이 1/10이라고 가정


def p80_at(t, plan):
    """plan = [(끝 연도 또는 None, 배가 주기 일)] 순서대로 이어 붙인 경로."""
    v, cur = P80_START_MIN, P80_START_T
    for end, d in plan:
        stop = t if end is None else min(t, end)
        if stop > cur:
            v *= 2 ** ((stop - cur) * 365 / d)
            cur = stop
        if end is None or t <= end:
            break
    return v


def year_reaching(minutes, plan):
    lo, hi = P80_START_T, 2100.0
    if p80_at(lo, plan) >= minutes:
        return lo
    for _ in range(60):
        mid = (lo + hi) / 2
        lo, hi = (mid, hi) if p80_at(mid, plan) < minutes else (lo, mid)
    return hi


W = 2.0  # 로지스틱 폭(년)


def logistic(t, m, w):
    return 1 / (1 + math.exp(-(t - m) / w))


def main():
    # ── 1·2단계 ──
    cap = {}
    for name, sc in SCEN.items():
        rows = []
        for rank, unit, mins in GATES:
            g = year_reaching(mins, sc["doubling"])
            g_real = year_reaching(mins * REAL_WORLD_DISCOUNT, sc["doubling"])
            rows.append({"직급": rank, "업무단위": unit, "분": mins,
                         "능력문턱": round(g, 1), "대체본격화": round(g + sc["lag"], 1),
                         "능력문턱_현실할인": round(g_real, 1), "대체본격화_현실할인": round(g_real + sc["lag"], 1),
                         # 표에 「그해」(정수 연도, 버림)로 찍을 때 쓰는 소수 둘째 자리 값. 소수 첫째 자리 반올림(2030.97 → 2031.0)을
                         # 버리면 한 해 늦게 찍힌다(2회차 D-10). 계산은 위 값과 같고 아래 단계의 입력은 바꾸지 않는다
                         "능력문턱_소수2": round(g, 2), "대체본격화_소수2": round(g + sc["lag"], 2)})
        path = [{"t": round(t, 2), "p80_min": round(p80_at(t, sc["doubling"]), 1)}
                for t in [P80_START_T + i / 4 for i in range(0, 4 * 11)] if t <= 2036.99]
        cap[name] = {"설명": sc["설명"], "확산시차_년": sc["lag"], "직급": rows, "경로": path}

    # ── 3단계 입력 ──
    kosis = list(csv.DictReader(open(ROOT / "research" / "_data" / "kosis_occupation_employment.csv", encoding="utf-8")))
    emp25 = {r["occupation"]: float(r["employed_thousand"]) * 1000 for r in kosis if r["year"] == "2025"}
    total25 = emp25.pop("계(전체 취업자)")
    groups = list(emp25)

    # KDI 연구보고서 2026-01 표 5-9: 10년 후(2035) 연간 경제성 있는 AI 대체(명). 모형 밖 '교차 확인선'으로만 쓴다.
    kdi_total_2035, kdi_2025 = 255704, 1462
    g = (kdi_total_2035 / kdi_2025) ** (1 / 10)
    flow = {y: (kdi_2025 * g ** (y - 2025) if y <= 2035 else kdi_total_2035) for y in YEARS}
    kdi_cum, acc = {}, 0
    for y in YEARS:
        acc += flow[y]
        kdi_cum[y] = acc

    # 하나의 물결: 같은 AI 능력이 직업마다 '몸을 쓰는 정도(φ)'만큼 늦게 닿는다.
    # 규모 r: 한국고용정보원 연구사업 2025-40 — 직업 전문가 846명이 AI와 자동화(로봇)를 함께 놓고 평가한
    #         '대체 가능성 70% 이상' 고위험 비중(%). 디지털·물리를 나누지 않은 통합 지표라 이 모형의 규모로 쓴다.
    r = {"1 관리자": 0.0, "2 전문가 및 관련 종사자": 1.3, "3 사무 종사자": 49.8, "4 서비스 종사자": 26.2,
         "5 판매 종사자": 62.6, "6 농림어업 숙련 종사자": None, "7 기능원 및 관련 기능종사자": 17.2,
         "8 장치,기계조작 및 조립종사자": 76.9, "9 단순노무 종사자": 6.7}
    # φ: 일에서 몸(현장·사물 조작)이 차지하는 정도. 직업 대분류 정의에 따른 이 덱의 가정(0=화면 안의 일, 1=몸을 쓰는 일)
    phi = {"1 관리자": 0.1, "2 전문가 및 관련 종사자": 0.2, "3 사무 종사자": 0.05, "4 서비스 종사자": 0.6,
           "5 판매 종사자": 0.4, "6 농림어업 숙련 종사자": 0.9, "7 기능원 및 관련 기능종사자": 0.9,
           "8 장치,기계조작 및 조립종사자": 0.8, "9 단순노무 종사자": 0.9}
    RHO = 0.5  # 고위험 일자리 중 실제로 사람이 빠지는 몫(나머지는 일이 바뀜). 민감도 0.3·0.7
    gate_week = {n: next(x["능력문턱"] for x in cap[n]["직급"] if x["직급"] == "대리·주임") for n in SCEN}

    def wave(n, rho=RHO):
        out = {k: {} for k in groups}
        for k in groups:
            if r[k] is None:
                for y in YEARS:
                    out[k][y] = 0.0
                continue
            mid = gate_week[n] + SCEN[n]["lag"] + phi[k] * SCEN[n]["phys_lag"]
            base = logistic(2026.0, mid, W)
            cmax = emp25[k] * r[k] / 100 * rho
            for y in YEARS:
                out[k][y] = cmax * max(0.0, (logistic(y + 1.0, mid, W) - base) / (1 - base))
        return out

    waves = {n: wave(n) for n in SCEN}
    totals = {n: {y: sum(waves[n][k][y] for k in groups) for y in YEARS} for n in SCEN}
    sens = {f"rho_{x}": {n: round(sum(wave(n, x)[k][2036] for k in groups)) for n in SCEN} for x in (0.3, 0.7)}

    by_group = {}
    for k in groups:
        row = {"취업자_2025": round(emp25[k]), "고위험_pct": r[k], "몸쓰는정도_phi": phi[k]}
        for n in SCEN:
            pct = {y: 100 * waves[n][k][y] / emp25[k] for y in YEARS}
            row[n] = {"중앙연도": round(gate_week[n] + SCEN[n]["lag"] + phi[k] * SCEN[n]["phys_lag"], 1) if r[k] is not None else None,
                      # 표시용 둘째 자리(2회차 D-17: 2027.6 + 4 + 0.25 = 2031.85가 첫째 자리 반올림에서 2031.8로 찍힌다). 계산 입력은 그대로
                      "중앙연도_소수2": round(gate_week[n] + SCEN[n]["lag"] + phi[k] * SCEN[n]["phys_lag"], 2) if r[k] is not None else None,
                      "2030": round(waves[n][k][2030]), "2036": round(waves[n][k][2036]), "2036_비율_pct": round(pct[2036], 1),
                      "5pct_도달연도": next((y for y in YEARS if pct[y] >= 5), None)}
        by_group[k] = row

    result = {
        "_about": "2036년까지 시나리오 추정(교육용). 끝값은 기관 추정치에 묶고, 시간 경로만 모형이 정한다.",
        "_기준일": "2026-10-16",
        "가정": {
            "METR_출발점": {"모델": "Claude Mythos Preview 초기판", "날짜": "2026-04-07", "p80_분": P80_START_MIN},
            "직급별_업무단위": [{"직급": a, "업무": b, "분": c} for a, b, c in GATES],
            "현실업무_할인": REAL_WORLD_DISCOUNT,
            "시나리오": {n: {"배가주기": s["doubling"], "확산시차_년": s["lag"], "설명": s["설명"]} for n, s in SCEN.items()},
            "규모": "한국고용정보원 연구사업 2025-40 직업 대분류별 고위험(대체 가능성 70% 이상) 비중 × 실현 비율 0.5 (농림어업은 값 미수집이라 0)",
            "고위험_pct": r, "몸쓰는정도_phi": phi, "실현비율_rho": RHO,
            "물리_데이터_시차_년": {n: SCEN[n]["phys_lag"] for n in SCEN},
            "물리_데이터_시차_근거": "relations.json R6: 로봇 조작 데이터와 인터넷 영상의 격차 약 3,333배(배가 11.7번)를 데이터가 3·5·8개월마다 두 배로 메우면 2.9·4.9·7.8년",
            "직업군_중앙연도_식": "대리·주임 능력 문턱 + 확산 시차 + φ × 물리 데이터 시차",
            "교차확인_KDI": "KDI 2026-01: 연간 AI 대체 2025년 1,462명 → 2035년 25.6만 명(지수 보간 누적)",
            "로지스틱_폭_년": W,
            "빠짐": "새로 생기는 일자리, 인구 감소(생산연령인구 연 39만 명 감소, KDI 인용), 경기 요인",
        },
        "능력": cap,
        "한국_누적_대체압력": {n: {str(y): round(v) for y, v in s.items()} for n, s in totals.items()},
        "교차확인_KDI_누적": {str(y): round(v) for y, v in kdi_cum.items()},
        "민감도_실현비율_2036": sens,
        "직업군별_경로_기준": {k: {str(y): round(v) for y, v in waves["기준"][k].items()} for k in groups},
        "한국_누적_대체압력_취업자대비_pct": {n: {str(y): round(100 * v / total25, 2) for y, v in s.items()} for n, s in totals.items()},
        "취업자_2025": round(total25),
        "직업군별": by_group,
    }
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "projection_2036.json").write_text(json.dumps(result, ensure_ascii=False, indent=1))

    print("능력 문턱(대체 본격화 = 확산 절반):")
    for n in SCEN:
        print(" ", n, [(r["직급"], r["능력문턱"], r["대체본격화"], r["대체본격화_현실할인"]) for r in cap[n]["직급"]])
    print("누적 대체 압력 2030 / 2036 (만 명, 취업자 대비 %):")
    for n, s in totals.items():
        print(" ", n, round(s[2030] / 1e4, 1), round(s[2036] / 1e4, 1), round(100 * s[2036] / total25, 1))
    print("  KDI 교차확인", round(kdi_cum[2030] / 1e4, 1), round(kdi_cum[2036] / 1e4, 1), "민감도", sens)
    print("직업군 5% 도달 연도:")
    for k, row in by_group.items():
        print(" ", k, {n: (row[n]["5pct_도달연도"], row[n]["2036_비율_pct"], row[n]["중앙연도"]) for n in SCEN})


if __name__ == "__main__":
    main()

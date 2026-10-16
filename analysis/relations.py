"""흩어진 자료를 하나의 인과 사슬로 잇는 '관계식'을 실제 수치로 계산한다.

공통 가로축은 AI 능력 = METR 50% 시간지평의 최고 기록(SOTA 외곽선)을 log2로 센 값,
즉 '능력이 몇 번 두 배가 됐나'다. 다른 자료는 그 시점의 능력 값에 맞춰 붙인다.

R1 능력 배가 주기는 줄고 있나          (METR SOTA, 기간별 회귀)
R2 능력 1배가당 전문가 AGI 예상이 몇 년 당겨지나   (AI Impacts ESPAI 2022·2023·2024, Metaculus 5121)
R3 능력 1배가당 일자리 자동화 예상이 몇 년 당겨지나  (ESPAI FAOL)
R4 능력 1배가당 입구(청년·신입) 고용 신호가 얼마나 움직이나  (Stanford ADP 격차, 한국은행 청년 일자리)
R5 연산 수요와 전력: 학습 컴퓨트 증가 / 칩 효율 = 전력 수요 증가 (Epoch, IEA)

모든 관계는 점이 3~9개뿐인 '기술' 등급 관찰이다. 인과 추정이 아니다.
실행: python3 -I analysis/relations.py
"""

import json
import math
import statistics
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "analysis" / "out"


def yf(s):
    p = [int(x) for x in str(s).split("-")]
    y, m, d = (p + [6, 15])[:3] if len(p) == 1 else (p + [15])[:3]
    return y + (m - 1) / 12 + (d - 1) / 365


def main():
    tl = json.loads((OUT / "timeline_results.json").read_text())
    sota = [(yf(p["date"]), p["p50_min"], p["model"]) for p in tl["metr"]["sota_points"]]

    def frontier(t):
        """t 시점까지 공개된 SOTA 중 최고 p50(분). 계단식 외곽선."""
        vals = [v for d, v, _ in sota if d <= t]
        return max(vals) if vals else None

    def doublings(t):
        return math.log2(frontier(t))

    # R1
    d = tl["metr"]["독립_회귀_배가주기_일"]
    r1 = {"기간별_배가주기_일": {"2019~": d["SOTA_전체"], "2023~": d["SOTA_2023이후"], "2024~": d["SOTA_2024이후"]},
          "해석": "기간을 최근으로 좁힐수록 배가 주기가 짧다(가속). 같은 기간 사내 코드의 AI 작성 비율이 Google 25%(2024-10)→75%(2026-04, 보도)로 올랐다",
          "등급": "기술"}

    # R2·R3: 설문 시점의 능력에 예상 '남은 햇수'를 붙인다
    def fit(rows, ykey):
        xs = [r["log2_능력"] for r in rows]
        ys = [r[ykey] for r in rows]
        lr = statistics.linear_regression(xs, ys)
        return round(lr.slope, 2), round(lr.intercept, 2), round(statistics.correlation(xs, ys), 3)

    espai = {"2022": ("2022-07-15", 2059, 2164), "2023": ("2023-10-20", 2047, 2116), "2024": ("2024-12-15", 2042, 2098)}
    rows = []
    for k, (date, hl, fa) in espai.items():
        t = yf(date)
        rows.append({"설문": k, "시점": date, "능력_분": frontier(t), "log2_능력": round(doublings(t), 2),
                     "HLMI_남은햇수": round(hl - t, 1), "FAOL_남은햇수": round(fa - t, 1)})
    s_h, i_h, r_h = fit(rows, "HLMI_남은햇수")
    s_f, i_f, r_f = fit(rows, "FAOL_남은햇수")
    r2 = {"점": rows, "HLMI": {"기울기_년_per_배가": s_h, "절편": i_h, "r": r_h, "n": 3},
          "해석": f"능력이 한 번 두 배가 될 때마다 전문가가 보는 AGI(HLMI)까지 남은 햇수가 약 {abs(s_h)}년 줄었다",
          "등급": "기술(n=3)"}
    r3 = {"FAOL": {"기울기_년_per_배가": s_f, "절편": i_f, "r": r_f, "n": 3},
          "배율": round(s_f / s_h, 1),
          "해석": f"같은 1배가에 '모든 직업 자동화'까지 남은 햇수는 약 {abs(s_f)}년 줄었다. AGI 시계보다 {round(s_f / s_h, 1)}배 빠르게 당겨진다",
          "등급": "기술(n=3)"}

    meta = [r for r in tl["forecast_series"]["metaculus_5121_general_ai"]]
    mrows = [{"시점": r["예측시점"], "log2_능력": round(doublings(r["예측시점_연"]), 2), "남은햇수": r["남은햇수"]} for r in meta]
    early = [r for r in mrows if r["시점"] < "2025"]
    late = [r for r in mrows if r["시점"] >= "2025"]
    def fit2(rs):
        lr = statistics.linear_regression([r["log2_능력"] for r in rs], [r["남은햇수"] for r in rs])
        return round(lr.slope, 2)
    r2["Metaculus"] = {"점": mrows, "2022~2024_기울기": fit2(early), "2025~2026_기울기": fit2(late) if len(late) > 2 else None,
                       "해석": "예측 커뮤니티도 2022~2024에는 능력 1배가당 수년씩 당겼지만, 2025~2026에는 능력이 더 올랐는데도 예상이 조금 늦춰졌다(관계가 꺾임). 값은 모두 2차 인용"}

    # R4: 입구 신호
    st = [("2025-07-15", 15.0), ("2026-06-15", 19.0)]  # Stanford Canaries 2026-08판: 22~25세 노출 직업 고용 격차(%)
    st_rows = [{"시점": dte, "격차_pct": v, "log2_능력": round(doublings(yf(dte)), 2)} for dte, v in st]
    st_slope = (st_rows[1]["격차_pct"] - st_rows[0]["격차_pct"]) / (st_rows[1]["log2_능력"] - st_rows[0]["log2_능력"])
    bok = {"기간": "2022-06~2026-06", "청년_AI고노출업종_일자리_변화_만": -26.8, "50대_AI고노출업종_변화_만": 17.3}
    bok_dbl = doublings(yf("2026-06-15")) - doublings(yf("2022-06-15"))
    r4 = {"Stanford": {"점": st_rows, "기울기_pctp_per_배가": round(st_slope, 2)},
          "한국은행": {**bok, "같은기간_능력배가": round(bok_dbl, 2),
                     "청년_만명_per_배가": round(bok["청년_AI고노출업종_일자리_변화_만"] / bok_dbl, 2)},
          "해석": "능력이 두 배가 될 때마다 미국 22~25세 노출 직업 고용 격차가 약 {:.1f}%p 벌어졌고, 한국 AI 고노출 업종 청년 일자리는 약 {:.1f}만 개씩 줄었다".format(st_slope, abs(bok["청년_AI고노출업종_일자리_변화_만"] / bok_dbl)),
          "등급": "기술(점 2개·기간 1개)"}

    # R5: 연산·전력
    compute_growth, eff_growth = 4.1, 2 ** 0.5  # Epoch 연 4.1배 / GPU 효율 2년마다 2배(바이오 조사 파일 인용)
    r5 = {"학습컴퓨트_연배율": compute_growth, "칩효율_연배율": round(eff_growth, 2),
          "프런티어학습_전력수요_연배율_계산": round(compute_growth / eff_growth, 2),
          "Epoch_전망_전력_연배율": [2.2, 2.9],
          "IEA_데이터센터_TWh": {"2024": 415, "2030": 945},
          "IEA_연증가율_pct": round(((945 / 415) ** (1 / 6) - 1) * 100, 1),
          "해석": "프런티어 학습의 전력 수요는 해마다 약 2.9배(=4.1÷1.41) 늘어야 하는데, 데이터센터 전체 전력은 해마다 약 15%만 는다. 이 격차가 2030년 전후 능력 배가 주기를 늦출 수 있는 가장 유력한 제동 장치다",
          "등급": "추정(계산)"}

    # R6: 물리 세계 데이터 — 격차(배가 횟수) ÷ 데이터 배가 속도 = 물리 데이터 시차
    gap = 1_000_000_000 / 300_000  # Bessemer(VC 추정): 인터넷 영상 약 10억 시간 vs 로봇 조작 데이터 약 30만 시간
    gap_dbl = math.log2(gap)
    d_obs = (yf("2025-11-04") - yf("2024-10-31")) * 12 / math.log2(270_000 / 10_000)  # π0 1만 시간 → GEN-0 27만 시간(회사 주장), 개월
    waymo = (yf("2026-03-15") - yf("2024-05-15")) * 12 / math.log2(500_000 / 50_000)  # Waymo 주간 유료 운행 5만 → 50만 건
    lag = {f"{m}개월마다_배가": round(gap_dbl * m / 12, 1) for m in (3, 5, 8)}
    r6 = {"격차_배수": round(gap), "격차_배가횟수": round(gap_dbl, 1),
          "로봇데이터_관측_배가_개월": round(d_obs, 1), "Waymo운행_배가_개월": round(waymo, 1),
          "격차를_메우는_햇수": lag,
          "해석": f"로봇 조작 데이터는 인터넷 영상보다 약 {round(gap):,}배(배가 {gap_dbl:.1f}번) 적다. 데이터가 3·5·8개월마다 두 배가 되면 격차를 메우는 데 {lag['3개월마다_배가']}·{lag['5개월마다_배가']}·{lag['8개월마다_배가']}년 → 모형의 물리 데이터 시차 3·5·8년. 관측된 사내 데이터 증가는 약 {d_obs:.1f}개월마다 두 배(회사 주장)",
          "등급": "추정(VC 추정·회사 주장 기반)"}

    res = {"_about": "자료 사이의 관계식(기술 등급). 공통 가로축 = METR SOTA 시간지평의 log2",
           "R1_배가가속": r1, "R2_AGI예상": r2, "R3_일자리예상": r3, "R4_입구신호": r4, "R5_전력": r5, "R6_물리데이터": r6}
    (OUT / "relations.json").write_text(json.dumps(res, ensure_ascii=False, indent=1))
    print(json.dumps({k: (v.get("해석") if isinstance(v, dict) else v) for k, v in res.items()}, ensure_ascii=False, indent=1))
    print("ESPAI", rows)
    print("Metaculus slopes", r2["Metaculus"]["2022~2024_기울기"], r2["Metaculus"]["2025~2026_기울기"])
    print("R2 fit", s_h, i_h, r_h, "R3 fit", s_f, i_f, r_f)
    print("R4", st_rows, round(st_slope, 2), round(bok_dbl, 2))


if __name__ == "__main__":
    main()

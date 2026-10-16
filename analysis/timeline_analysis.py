"""두 개의 시계: AGI 예상 시점의 이동과 AI 능력(METR 시간지평)의 배가 주기.

1) METR 원본 YAML에서 최고 성능(SOTA) 모델의 50% 시간지평을 뽑아 배가 주기를 직접 회귀한다
   (METR이 파일에 적은 128.7일과 독립 계산값을 대조).
2) agi_forecasts.csv에서 설문·예측시장의 '예상 도달 연도'와 '남은 햇수(예상 연도 - 예측 시점)'를 계산한다.

표준 라이브러리만 쓴다. 실행: python3 -I analysis/timeline_analysis.py
"""

import csv
import datetime as dt
import hashlib
import json
import math
import re
import statistics
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
METR = ROOT / "research" / "_data" / "raw" / "metr" / "benchmark_results_1_1.yaml"
FORE = ROOT / "research" / "_data" / "agi_forecasts.csv"
OUT = ROOT / "analysis" / "out"
CAP_MIN = 16 * 60  # METR: 16시간 초과 중앙 추정은 배가 주기 적합에서 뺀다


def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()[:16]


def parse_metr(path):
    """들여쓰기 2칸짜리 단순 YAML에서 모델별 p50·CI·출시일·is_sota만 읽는다."""
    models, cur, sect = {}, None, None
    for line in path.read_text().splitlines():
        m = re.match(r"^  (\S+):\s*$", line)
        if m and line.startswith("  ") and not line.startswith("   "):
            cur = m.group(1)
            models[cur] = {}
            sect = None
            continue
        if cur is None:
            continue
        s = line.strip()
        if s.startswith("p50_horizon_length:"):
            sect = "p50"
        elif s.startswith("p80_horizon_length:") or s.startswith("average_score:"):
            sect = None
        elif sect == "p50" and ":" in s:
            k, v = [x.strip() for x in s.split(":", 1)]
            if k in ("estimate", "ci_low", "ci_high"):
                models[cur][k] = float(v)
        if s.startswith("is_sota:"):
            models[cur]["sota"] = s.endswith("true")
        if s.startswith("release_date:"):
            models[cur]["date"] = s.split(":", 1)[1].strip()
    return {k: v for k, v in models.items() if "estimate" in v and "date" in v}


def doubling_days(points):
    xs = [(dt.date.fromisoformat(p["date"]) - dt.date(2019, 1, 1)).days for p in points]
    ys = [math.log2(p["estimate"]) for p in points]
    slope = statistics.linear_regression(xs, ys).slope  # log2(분) / 일
    return 1 / slope


def main():
    models = parse_metr(METR)
    sota = sorted([dict(name=k, **v) for k, v in models.items() if v.get("sota")], key=lambda d: d["date"])
    fit_all = [p for p in sota if p["estimate"] <= CAP_MIN]
    fit_23 = [p for p in fit_all if p["date"] >= "2023-01-01"]
    fit_24 = [p for p in fit_all if p["date"] >= "2024-01-01"]

    metr = {
        "_source": {"path": str(METR.relative_to(ROOT)), "sha256_16": sha(METR), "url": "https://metr.org/assets/benchmark_results_1_1.yaml"},
        "파일에_적힌_배가주기_일": {"전체": 187.778, "2023이후": 128.744, "2023이후_ci": [104.428, 158.012]},
        "독립_회귀_배가주기_일": {
            "SOTA_전체": round(doubling_days(fit_all), 1), "n_전체": len(fit_all),
            "SOTA_2023이후": round(doubling_days(fit_23), 1), "n_2023이후": len(fit_23),
            "SOTA_2024이후": round(doubling_days(fit_24), 1), "n_2024이후": len(fit_24),
        },
        "주의": "SOTA 표시는 METR 파일의 is_sota 필드. 16시간 초과 중앙 추정은 적합에서 뺐다(METR 방식). METR 파일의 전체 기간 값은 여러 과제 묶음을 이어 붙인(stitched) 적합이라 이 독립 회귀와 정의가 다르다.",
        "sota_points": [{"model": p["name"], "date": p["date"], "p50_min": round(p["estimate"], 1),
                         "ci": [round(p.get("ci_low", float("nan")), 1), round(p.get("ci_high", float("nan")), 1)]} for p in sota],
    }

    with open(FORE, encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    def year_of(s):
        y = int(s[:4])
        mo = re.match(r"^\d{4}-(\d{2})", s)
        return y + ((int(mo.group(1)) - 0.5) / 12 if mo else 0.5)

    series = {}
    for r in rows:
        q = r["quantile"]
        if not (q.startswith("community_median") or q.startswith("mean_aggregate_50pct")):
            continue
        fy = year_of(r["forecast_date"])
        py = int(r["predicted_year"])
        series.setdefault(r["series"], []).append({
            "예측시점": r["forecast_date"], "예측시점_연": round(fy, 2), "예상연도": py,
            "남은햇수": round(py - fy, 1), "확인": r["check"],
        })
    for s in series.values():
        s.sort(key=lambda d: d["예측시점_연"])

    espai = {k: series[k] for k in ("ai_impacts_espai_hlmi", "ai_impacts_espai_faol") if k in series}
    hl, fa = espai["ai_impacts_espai_hlmi"], espai["ai_impacts_espai_faol"]
    paired = []
    for h in hl:
        for f in fa:
            if h["예측시점"][:4] == f["예측시점"][:4]:
                paired.append({"설문": h["예측시점"][:4], "HLMI": h["예상연도"], "FAOL": f["예상연도"], "간격_년": f["예상연도"] - h["예상연도"]})

    result = {
        "_about": "AGI 예상 시점 이동과 METR 시간지평 배가 주기",
        "_inputs": {"agi_forecasts": {"path": str(FORE.relative_to(ROOT)), "sha256_16": sha(FORE)}},
        "metr": metr,
        "forecast_series": series,
        "espai_paired": paired,
    }
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "timeline_results.json").write_text(json.dumps(result, ensure_ascii=False, indent=1))
    print(json.dumps({"metr": {k: v for k, v in metr.items() if k != "sota_points"},
                      "sota": [(p["model"], p["date"], p["p50_min"]) for p in metr["sota_points"]],
                      "metaculus_5121": series.get("metaculus_5121_general_ai"),
                      "espai_paired": paired}, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()

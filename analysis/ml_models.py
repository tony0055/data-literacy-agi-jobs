"""머신러닝 예측모형 두 개 (수업 6주 보너스 기준: 학습/검증 분리, 시계열은 시간 순서, 기준선 비교).

M1 능력 예측 백테스트
   METR SOTA 점을 날짜순으로 나눠, 2024년 말까지만 학습하고 2025~2026 실측을 맞힌다.
   후보: 로그-선형(일정한 배가 주기), 2차(가속), 최근 2년 창 로그-선형. 검증 오차로 고르고,
   그 결과가 2036 시나리오 중 어느 쪽과 가까운지 본다.
M2 직업별 고용 변화 예측
   목표: 2023→2025 고용 로그 변화(미국 세부 직업). 특징: AI 노출 3종, 로그 중위임금, 로그 고용(2022),
   직전 변화(2022→2023), 직업 대분류. 5겹 교차검증(시드 42)으로 기준선(학습 평균)·릿지·그래디언트 부스팅을 비교하고,
   노출 특징을 뺀 모형과의 차이(= 노출도가 더하는 예측력)를 잰다. 순열 중요도로 해석을 보탠다.

실행: <scikit-learn 있는 python> analysis/ml_models.py   (requirements: numpy, scikit-learn)
"""

import csv
import json
import math
from pathlib import Path

import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.inspection import permutation_importance
from sklearn.linear_model import RidgeCV
from sklearn.model_selection import KFold, cross_val_predict
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "analysis" / "out"
RAW = ROOT / "research" / "_data" / "raw"
SEED = 42


def yf(s):
    y, m, d = (int(x) for x in s.split("-"))
    return y + (m - 1) / 12 + (d - 1) / 365


def m1():
    tl = json.loads((OUT / "timeline_results.json").read_text())
    pts = [(yf(p["date"]), math.log2(p["p50_min"]), p["model"]) for p in tl["metr"]["sota_points"] if p["p50_min"] <= 960]
    train = [p for p in pts if p[0] < 2025.0]
    test = [p for p in pts if p[0] >= 2025.0]
    xt, yt = np.array([p[0] for p in train]), np.array([p[1] for p in train])
    xv, yv = np.array([p[0] for p in test]), np.array([p[1] for p in test])
    out = {}
    cands = {
        "로그선형_전체": (xt, yt, 1),
        "2차_가속": (xt, yt, 2),
        "로그선형_최근2년": (xt[xt >= 2023.0], yt[xt >= 2023.0], 1),
    }
    for name, (x, y, deg) in cands.items():
        coef = np.polyfit(x - 2024, y, deg)
        pred = np.polyval(coef, xv - 2024)
        err = pred - yv
        slope_now = np.polyval(np.polyder(coef), 2024.99 - 2024) if deg > 1 else coef[0]
        out[name] = {"학습점": int(len(x)), "검증점": int(len(xv)),
                     "검증_MAE_배가": round(float(np.mean(np.abs(err))), 2),
                     "검증_평균오차_배가": round(float(np.mean(err)), 2),
                     "학습끝_배가주기_일": round(float(365 / slope_now), 1),
                     "예측_vs_실측": [{"model": m, "실측_분": round(2 ** a, 1), "예측_분": round(2 ** b, 1)} for (_, a, m), b in zip(test, pred)]}
    best = min(out, key=lambda k: out[k]["검증_MAE_배가"])
    return {"설명": "2024년 말까지 학습 → 2025~2026 SOTA 맞히기. 오차 단위는 '배가 횟수'(1 = 2배 틀림)",
            "후보": out, "검증오차_최소": best,
            "주의": "검증점이 적다(16시간 이하 SOTA만). 모델 선택의 참고일 뿐 미래 보장이 아니다"}


def m2():
    def read(p):
        with open(p, encoding="utf-8-sig", newline="") as f:
            return list(csv.DictReader(f))

    def num(s):
        try:
            return float(str(s).replace(",", ""))
        except ValueError:
            return None

    def oews(y):
        return {r["OCC_CODE"]: r for r in read(RAW / "bls_oews" / "converted_csv" / f"national_M{y}_dl.csv") if r["O_GROUP"] == "detailed"}

    o22, o23, o25 = oews(2022), oews(2023), oews(2025)
    elo = {}
    for r in read(RAW / "openai_gpts-are-gpts" / "occ_level.csv"):
        elo.setdefault(r["O*NET-SOC Code"][:7], []).append(float(r["dv_rating_beta"]))
    elo = {k: sum(v) / len(v) for k, v in elo.items()}
    ms = {r["SOC Code"]: float(r["ai_applicability_score"]) for r in read(RAW / "microsoft_working-with-ai" / "ai_applicability_scores.csv")}
    an = {r["occ_code"]: float(r["observed_exposure"]) for r in read(RAW / "anthropic_economic_index" / "labor_market_impacts" / "job_exposure.csv")}

    X, y, ids = [], [], []
    for c, r in o22.items():
        if c not in o23 or c not in o25 or c not in elo or c not in ms or c not in an:
            continue
        e22, e23, e25 = num(r["TOT_EMP"]), num(o23[c]["TOT_EMP"]), num(o25[c]["TOT_EMP"])
        wage = num(r["A_MEDIAN"])
        if not (e22 and e23 and e25 and wage):
            continue
        X.append([elo[c], ms[c], an[c], math.log(wage), math.log(e22), math.log(e23 / e22), c[:2]])
        y.append(math.log(e25 / e23))
        ids.append(c)
    X = np.array(X, dtype=object)
    y = np.array(y)
    num_cols, cat_cols = [0, 1, 2, 3, 4, 5], [6]
    names = ["노출_Eloundou", "노출_Microsoft", "노출_Anthropic", "로그_중위임금", "로그_고용2022", "직전변화_22_23", "대분류"]

    def pipe(model, cols_num):
        pre = ColumnTransformer([("n", StandardScaler(), cols_num), ("c", OneHotEncoder(handle_unknown="ignore", sparse_output=False), cat_cols)])
        return make_pipeline(pre, model)

    kf = KFold(5, shuffle=True, random_state=SEED)
    res = {}

    def score(pred):
        ss_res = float(np.sum((y - pred) ** 2))
        ss_tot = float(np.sum((y - y.mean()) ** 2))
        return {"R2_교차검증": round(1 - ss_res / ss_tot, 3), "MAE_로그": round(float(np.mean(np.abs(y - pred))), 4)}

    # 기준선: 각 겹에서 학습 평균으로 예측
    base_pred = np.zeros_like(y)
    for tr, te in kf.split(X):
        base_pred[te] = y[tr].mean()
    res["기준선_학습평균"] = score(base_pred)
    models = {
        "릿지_전체특징": pipe(RidgeCV(alphas=np.logspace(-2, 3, 20)), num_cols),
        "릿지_노출제외": pipe(RidgeCV(alphas=np.logspace(-2, 3, 20)), [3, 4, 5]),
        "부스팅_전체특징": pipe(HistGradientBoostingRegressor(max_depth=3, learning_rate=0.05, max_iter=300, random_state=SEED), num_cols),
        "부스팅_노출제외": pipe(HistGradientBoostingRegressor(max_depth=3, learning_rate=0.05, max_iter=300, random_state=SEED), [3, 4, 5]),
    }
    for k, m in models.items():
        res[k] = score(cross_val_predict(m, X, y, cv=kf))

    # 학습 오차와 검증 오차 비교(과적합 점검)
    full = models["부스팅_전체특징"].fit(X, y)
    res["부스팅_학습R2"] = round(float(full.score(X, y)), 3)
    imp = permutation_importance(full, X, y, n_repeats=20, random_state=SEED)
    res["순열중요도_부스팅_전체데이터"] = sorted([{"특징": n, "중요도": round(float(m), 4), "표준편차": round(float(s), 4)}
                                         for n, m, s in zip(names, imp.importances_mean, imp.importances_std)], key=lambda d: -d["중요도"])
    res["n"] = int(len(y))
    res["설명"] = "목표 = 2023→2025 고용 로그 변화. 5겹 교차검증(시드 42) 예측으로 R²를 계산. 기준선은 R²≈0"
    return res


def main():
    out = {"M1_능력백테스트": m1(), "M2_직업고용예측": m2()}
    (OUT / "ml_results.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
    print(json.dumps({"M1": {k: {kk: vv for kk, vv in v.items() if kk != "예측_vs_실측"} for k, v in out["M1_능력백테스트"]["후보"].items()},
                      "M1_best": out["M1_능력백테스트"]["검증오차_최소"],
                      "M2": {k: v for k, v in out["M2_직업고용예측"].items() if k not in ("설명",)}}, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()

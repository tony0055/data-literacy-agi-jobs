"""직업별 AI 노출도와 미국 고용 변화의 상관 (예비 분석).

한 행 = 미국 SOC 2018 6자리 세부 직업 하나.
노출도 3종(Eloundou GPT-4 평가 β, Microsoft 적용가능성, Anthropic 관측 노출)과
결과 지표 3종(OEWS 고용 로그 변화 2022→2025, 2023→2025, BLS 10년 전망 개정폭)을 잇는다.

표준 라이브러리만 쓴다. 실행: python3 -I analysis/occupation_analysis.py
입력은 research/_data/raw/ (원본 보존, 읽기만). 출력은 analysis/out/.
"""

import csv
import hashlib
import json
import math
import random
import statistics
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "research" / "_data" / "raw"
OUT = ROOT / "analysis" / "out"
SEED = 42

FILES = {
    "eloundou": RAW / "openai_gpts-are-gpts" / "occ_level.csv",
    "microsoft": RAW / "microsoft_working-with-ai" / "ai_applicability_scores.csv",
    "anthropic": RAW / "anthropic_economic_index" / "labor_market_impacts" / "job_exposure.csv",
    "oews2022": RAW / "bls_oews" / "converted_csv" / "national_M2022_dl.csv",
    "oews2023": RAW / "bls_oews" / "converted_csv" / "national_M2023_dl.csv",
    "oews2025": RAW / "bls_oews" / "converted_csv" / "national_M2025_dl.csv",
    "proj2434": RAW / "bls_projections" / "converted_csv" / "occupation_2024-34__sheet03_Table_1.2.csv",
    "proj2535": RAW / "bls_projections" / "converted_csv" / "occupation_2025-35__sheet03_Table_1.2.csv",
}

MAJOR = {
    "11": "관리직", "13": "경영·재무", "15": "컴퓨터·수학", "17": "건축·공학", "19": "과학",
    "21": "사회복지", "23": "법률", "25": "교육", "27": "예술·미디어", "29": "의료 전문",
    "31": "의료 지원", "33": "보안", "35": "음식 서비스", "37": "건물 관리", "39": "개인 서비스",
    "41": "판매", "43": "사무·행정 지원", "45": "농림어업", "47": "건설", "49": "설치·정비",
    "51": "생산", "53": "운송",
}


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()[:16]


def num(s):
    s = (s or "").replace(",", "").strip()
    try:
        return float(s)
    except ValueError:
        return None


def read(path):
    with open(path, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def load_exposures():
    # Eloundou: O*NET 8자리 → SOC 6자리 단순 평균 (예: 11-1011.00, 11-1011.03 → 11-1011)
    acc = {}
    for r in read(FILES["eloundou"]):
        v = num(r["dv_rating_beta"])
        if v is not None:
            acc.setdefault(r["O*NET-SOC Code"][:7], []).append(v)
    elo = {k: statistics.fmean(v) for k, v in acc.items()}
    ms = {r["SOC Code"]: num(r["ai_applicability_score"]) for r in read(FILES["microsoft"]) if num(r["ai_applicability_score"]) is not None}
    an = {r["occ_code"]: num(r["observed_exposure"]) for r in read(FILES["anthropic"]) if num(r["observed_exposure"]) is not None}
    return {"eloundou_beta": elo, "microsoft_applicability": ms, "anthropic_observed": an}


def load_oews(key):
    out = {}
    for r in read(FILES[key]):
        if r["O_GROUP"] == "detailed":
            v = num(r["TOT_EMP"])
            if v and v > 0:
                out[r["OCC_CODE"]] = (r["OCC_TITLE"], v)
    return out


def load_proj(key):
    # 첫 줄은 표 제목, 둘째 줄이 열 이름. 열 위치: 1=코드, 2=유형, 3=기준연도 고용, 8=10년 변화율(%)
    out = {}
    with open(FILES[key], encoding="utf-8-sig", newline="") as f:
        rows = list(csv.reader(f))[2:]
    for r in rows:
        if len(r) > 8 and r[2] == "Line item" and num(r[8]) is not None:
            out[r[1]] = (num(r[8]), num(r[3]))
    return out


def ranks(xs):
    order = sorted(range(len(xs)), key=lambda i: xs[i])
    rk = [0.0] * len(xs)
    i = 0
    while i < len(order):
        j = i
        while j + 1 < len(order) and xs[order[j + 1]] == xs[order[i]]:
            j += 1
        for k in range(i, j + 1):
            rk[order[k]] = (i + j) / 2 + 1
        i = j + 1
    return rk


def pearson(x, y):
    return statistics.correlation(x, y)


def spearman(x, y):
    return statistics.correlation(ranks(x), ranks(y))


def boot_ci(x, y, fn, reps=2000):
    rng = random.Random(SEED)
    n = len(x)
    vals = []
    for _ in range(reps):
        idx = [rng.randrange(n) for _ in range(n)]
        xs, ys = [x[i] for i in idx], [y[i] for i in idx]
        if len(set(xs)) > 1 and len(set(ys)) > 1:
            vals.append(fn(xs, ys))
    vals.sort()
    return [round(vals[int(0.025 * len(vals))], 3), round(vals[int(0.975 * len(vals)) - 1], 3)]


def quintiles(rows, xkey, ykey):
    s = sorted(rows, key=lambda r: r[xkey])
    n = len(s)
    out = []
    for q in range(5):
        part = s[q * n // 5:(q + 1) * n // 5]
        ys = [r[ykey] for r in part]
        emp0 = sum(r["emp_2022"] for r in part)
        emp1 = sum(r["emp_2025"] for r in part)
        out.append({
            "분위": q + 1,
            "n": len(part),
            "감소한_직업_비율_pct": round(100 * sum(1 for y in ys if y < 0) / len(ys), 1),
            "노출도_범위": [round(part[0][xkey], 3), round(part[-1][xkey], 3)],
            "직업별_변화율_중앙값_pct": round((math.exp(statistics.median(ys)) - 1) * 100, 1),
            "합계고용_변화율_pct": round((emp1 / emp0 - 1) * 100, 1),
        })
    return out


def corr_block(rows, xkey, ykey):
    x = [r[xkey] for r in rows]
    y = [r[ykey] for r in rows]
    return {
        "n": len(rows),
        "pearson_r": round(pearson(x, y), 3),
        "spearman_rho": round(spearman(x, y), 3),
        "spearman_95ci_bootstrap": boot_ci(x, y, spearman),
    }


def main():
    exp = load_exposures()
    o22, o23, o25 = load_oews("oews2022"), load_oews("oews2023"), load_oews("oews2025")
    p34, p35 = load_proj("proj2434"), load_proj("proj2535")

    rows = []
    for code, (title, e22) in o22.items():
        if code not in o25:
            continue
        e25 = o25[code][1]
        r = {
            "soc": code, "title": title, "major": MAJOR.get(code[:2], code[:2]),
            "emp_2022": e22, "emp_2025": e25,
            "dlog_22_25": math.log(e25 / e22),
        }
        if code in o23:
            r["dlog_22_23"] = math.log(o23[code][1] / e22)
            r["dlog_23_25"] = math.log(e25 / o23[code][1])
        if code in p34 and code in p35:
            r["proj_revision_pp"] = p35[code][0] - p34[code][0]
        for k, d in exp.items():
            if code in d:
                r[k] = d[code]
        rows.append(r)

    result = {
        "_about": "직업별 AI 노출도 × 미국 고용 변화 상관 (예비 분석). 한 행 = SOC 6자리 세부 직업",
        "_seed": SEED,
        "_inputs": {k: {"path": str(p.relative_to(ROOT)), "sha256_16": sha(p)} for k, p in FILES.items()},
        "_counts": {"oews2022_detailed": len(o22), "oews2025_detailed": len(o25), "joined_2022_2025": len(rows)},
        "_주의": [
            "OEWS는 시계열 비교용으로 설계된 조사가 아니다(BLS 안내). 직업 단위 변화는 표본오차가 크다.",
            "Eloundou β는 O*NET 8자리를 6자리로 단순 평균했다.",
            "상관은 관찰 자료다. 인과 등급 주장을 하지 않는다.",
        ],
        "corr": {},
    }

    for xkey in exp:
        base = [r for r in rows if xkey in r]
        blk = {"전체_22_25": corr_block(base, xkey, "dlog_22_25")}
        big = [r for r in base if r["emp_2022"] >= 10000]
        blk["고용1만명이상_22_25"] = corr_block(big, xkey, "dlog_22_25")
        trim = [r for r in base if abs(r["dlog_22_25"]) <= 0.5]
        blk["변화폭_극단제외_22_25"] = corr_block(trim, xkey, "dlog_22_25")
        b23 = [r for r in base if "dlog_22_23" in r]
        blk["초기_22_23"] = corr_block(b23, xkey, "dlog_22_23")
        blk["최근_23_25"] = corr_block(b23, xkey, "dlog_23_25")
        pr = [r for r in base if "proj_revision_pp" in r]
        blk["BLS전망개정_pp"] = corr_block(pr, xkey, "proj_revision_pp")
        blk["분위별_22_25"] = quintiles(base, xkey, "dlog_22_25")
        by = {}
        for m in sorted({r["major"] for r in base}):
            g = [r for r in base if r["major"] == m]
            if len(g) >= 15:
                by[m] = corr_block(g, xkey, "dlog_22_25")
        blk["대분류별_22_25"] = by
        result["corr"][xkey] = blk

    # 대분류 요약: 노출도 평균과 합계 고용 변화
    groups = {}
    for r in rows:
        if "eloundou_beta" not in r:
            continue
        g = groups.setdefault(r["major"], {"n": 0, "e0": 0.0, "e1": 0.0, "beta": []})
        g["n"] += 1
        g["e0"] += r["emp_2022"]
        g["e1"] += r["emp_2025"]
        g["beta"].append(r["eloundou_beta"])
    result["major_summary"] = sorted([
        {"대분류": m, "직업수": g["n"], "고용_2022": round(g["e0"]), "고용_2025": round(g["e1"]),
         "변화율_pct": round((g["e1"] / g["e0"] - 1) * 100, 1), "노출도_beta_평균": round(statistics.fmean(g["beta"]), 3)}
        for m, g in groups.items()
    ], key=lambda d: -d["노출도_beta_평균"])

    # ── 수업 4·5·7·9주 점검 (course-domain/concepts.md) ──
    # 4주: 결과 변수(고용 변화율 %) 분포 요약. 평균·중앙값·SD(ddof 둘 다)·n·최소/최대와 그 행
    base = [r for r in rows if "eloundou_beta" in r]
    pct = [(math.exp(r["dlog_22_25"]) - 1) * 100 for r in base]
    n = len(pct)
    mean, med = statistics.fmean(pct), statistics.median(pct)
    sd1, sd0 = statistics.stdev(pct), statistics.pstdev(pct)
    q1, _, q3 = statistics.quantiles(pct, n=4, method="inclusive")
    iqr = q3 - q1
    lo_f, hi_f = q1 - 1.5 * iqr, q3 + 1.5 * iqr
    imin, imax = pct.index(min(pct)), pct.index(max(pct))
    skew = sum(((x - mean) / sd0) ** 3 for x in pct) / n
    # 5주: z(표본 SD, ddof=1)와 IQR 양쪽 울타리. 후보 '목록'만 만들고 지우지 않는다
    zc = [(base[i]["soc"], base[i]["title"], round(pct[i], 1), round((pct[i] - mean) / sd1, 2)) for i in range(n) if abs((pct[i] - mean) / sd1) > 3]
    ic = [(base[i]["soc"], base[i]["title"], round(pct[i], 1)) for i in range(n) if pct[i] < lo_f or pct[i] > hi_f]
    z_ids, i_ids = {c[0] for c in zc}, {c[0] for c in ic}
    # 7주: 후보 제외 전후 상관(이상치 민감도)
    keep = [r for r in base if r["soc"] not in i_ids]
    # 히스토그램(같은 범위 고정, 구간 폭 5%p와 10%p 두 가지 — 6주 구간 폭 민감도)
    def hist(width, lo=-60, hi=60):
        edges = list(range(lo, hi + width, width))
        cnt = [0] * (len(edges) - 1)
        out_lo = out_hi = 0
        for x in pct:
            if x < lo:
                out_lo += 1
            elif x >= hi:
                out_hi += 1
            else:
                cnt[int((x - lo) // width)] += 1
        return {"폭": width, "구간": edges, "개수": cnt, "범위밖_아래": out_lo, "범위밖_위": out_hi}
    # 9주: 심슨의 역설 점검 — 전체 상관과 대분류 안 상관의 부호 비교, 대분류 평균끼리의 상관
    by = result["corr"]["eloundou_beta"]["대분류별_22_25"]
    neg_within = sorted([(k, v["spearman_rho"]) for k, v in by.items() if v["spearman_rho"] < 0], key=lambda t: t[1])
    gm = {}
    for r in base:
        gm.setdefault(r["major"], []).append(r)
    gx = [statistics.fmean(x["eloundou_beta"] for x in g) for g in gm.values() if len(g) >= 5]
    gy = [statistics.fmean((math.exp(x["dlog_22_25"]) - 1) * 100 for x in g) for g in gm.values() if len(g) >= 5]
    # 대분류 평균을 빼고(집단 안 편차만 남겨) 다시 상관: 집단 구성 효과를 걷어낸 '대분류 안' 관계
    def demean(rs, key, fn=lambda v: v):
        mu = {}
        for r in rs:
            mu.setdefault(r["major"], []).append(fn(r[key]))
        mu = {k: statistics.fmean(v) for k, v in mu.items()}
        return [fn(r[key]) - mu[r["major"]] for r in rs]
    wx = demean(base, "eloundou_beta")
    wy = demean(base, "dlog_22_25")
    rx, ry = demean([dict(r, rk=v) for r, v in zip(base, ranks([r["eloundou_beta"] for r in base]))], "rk"), \
        demean([dict(r, rk=v) for r, v in zip(base, ranks([r["dlog_22_25"] for r in base]))], "rk")
    within = {"n": len(base), "pearson_r": round(statistics.correlation(wx, wy), 3), "spearman_rho_순위편차": round(statistics.correlation(rx, ry), 3),
              "pearson_95ci_bootstrap": boot_ci(wx, wy, pearson)}

    result["course_checks"] = {
        "4주_분포요약_고용변화율_pct": {
            "n": n, "평균": round(mean, 2), "중앙값": round(med, 2), "평균-중앙값": round(mean - med, 2),
            "SD_표본_ddof1": round(sd1, 2), "SD_모집단_ddof0": round(sd0, 2), "왜도_모집단식": round(skew, 2),
            "Q1": round(q1, 2), "Q3": round(q3, 2), "IQR": round(iqr, 2), "사분위수_방법": "statistics.quantiles inclusive",
            "최소": {"값": round(pct[imin], 1), "직업": base[imin]["title"], "soc": base[imin]["soc"]},
            "최대": {"값": round(pct[imax], 1), "직업": base[imax]["title"], "soc": base[imax]["soc"]},
            "판단": "평균과 중앙값 차이·왜도로 치우침을 본다. 직업 단위 변화율은 작은 직업의 표본오차가 커서 꼬리가 길다",
        },
        "5주_이상치후보": {
            "z기준": "|z|>3, SD는 표본(ddof=1)", "z후보수": len(zc), "z후보": zc,
            "IQR기준": f"Q1−1.5×IQR={round(lo_f, 1)} 미만 또는 Q3+1.5×IQR={round(hi_f, 1)} 초과(양쪽)", "IQR후보수": len(ic),
            "IQR후보_예시": sorted(ic, key=lambda c: c[2])[:6] + sorted(ic, key=lambda c: -c[2])[:6],
            "교집합": len(z_ids & i_ids), "IQR에만": len(i_ids - z_ids), "z에만": len(z_ids - i_ids),
            "처리": "삭제하지 않음. 후보는 실제 극단(직업 재분류·작은 직업 표본오차)일 수 있어 민감도로만 쓴다",
        },
        "7주_이상치_민감도": {"전체": corr_block(base, "eloundou_beta", "dlog_22_25"),
                           "IQR후보_제외": corr_block(keep, "eloundou_beta", "dlog_22_25")},
        "6주_히스토그램": [hist(5), hist(10)],
        "9주_심슨점검": {
            "전체_spearman": result["corr"]["eloundou_beta"]["전체_22_25"]["spearman_rho"],
            "대분류안_음의상관": neg_within,
            "대분류평균끼리_pearson": round(statistics.correlation(gx, gy), 3), "대분류수": len(gx),
            "대분류안_상관_집단평균제거": within,
            "판단": "전체로는 0에 가깝지만 사무·행정, 컴퓨터·수학 등 여러 대분류 안에서는 음의 상관이다. 고노출 대분류(경영·재무·관리)가 경기·구성 요인으로 함께 늘어 전체 관계를 덮는 구조 — 집단을 섞으면 관계가 사라지는 심슨형 패턴",
            "교란후보": ["금리 인상·팬데믹 과잉채용 반동(테크 채용 둔화)", "원격근무 확산(NY Fed: 청년 대졸 실업 증가의 64% 설명)", "직업 내 연령 구성·인구 고령화", "해외 이전(오프쇼어링)·업무 재분류"],
        },
    }

    # 노출 꼬리: β 상위 10%와 사무·행정 지원 안의 노출 상·하위
    eb = sorted([r for r in rows if "eloundou_beta" in r], key=lambda r: -r["eloundou_beta"])
    def agg(part):
        e0 = sum(r["emp_2022"] for r in part)
        e1 = sum(r["emp_2025"] for r in part)
        return {"n": len(part), "고용_2022": round(e0), "고용_2025": round(e1), "합계변화율_pct": round((e1 / e0 - 1) * 100, 1),
                "감소한_직업_비율_pct": round(100 * sum(1 for r in part if r["dlog_22_25"] < 0) / len(part), 1)}
    k10 = len(eb) // 10
    clerical = sorted([r for r in eb if r["major"] == "사무·행정 지원"], key=lambda r: -r["eloundou_beta"])
    half = len(clerical) // 2
    result["tails"] = {
        "beta_상위10pct": {**agg(eb[:k10]), "beta_하한": round(eb[k10 - 1]["eloundou_beta"], 3)},
        "beta_나머지90pct": agg(eb[k10:]),
        "사무행정_노출상위절반": agg(clerical[:half]),
        "사무행정_노출하위절반": agg(clerical[half:]),
        "전체": agg(eb),
    }

    # 산점도용 점 (Eloundou β, 고용 1만 명 이상)
    pts = [r for r in rows if "eloundou_beta" in r and r["emp_2022"] >= 10000]
    result["scatter_eloundou"] = [
        {"soc": r["soc"], "title": r["title"], "major": r["major"], "x": round(r["eloundou_beta"], 3),
         "y": round((math.exp(r["dlog_22_25"]) - 1) * 100, 1), "emp2022": round(r["emp_2022"])}
        for r in pts
    ]

    # 노출 상위 직업 (고용 5만 명 이상)
    top = sorted([r for r in rows if "eloundou_beta" in r and r["emp_2022"] >= 50000], key=lambda r: -r["eloundou_beta"])[:15]
    result["top_exposed"] = [
        {"soc": r["soc"], "title": r["title"], "major": r["major"], "beta": round(r["eloundou_beta"], 3),
         "ms": round(r["microsoft_applicability"], 3) if "microsoft_applicability" in r else None,
         "anthropic": r.get("anthropic_observed"),
         "emp_2022": round(r["emp_2022"]), "emp_2025": round(r["emp_2025"]),
         "변화율_pct": round((r["emp_2025"] / r["emp_2022"] - 1) * 100, 1),
         "전망개정_pp": round(r["proj_revision_pp"], 1) if "proj_revision_pp" in r else None}
        for r in top
    ]

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "occupation_results.json").write_text(json.dumps(result, ensure_ascii=False, indent=1))
    with open(OUT / "occupation_joined.csv", "w", newline="", encoding="utf-8") as f:
        keys = ["soc", "title", "major", "emp_2022", "emp_2025", "dlog_22_25", "dlog_22_23", "dlog_23_25",
                "proj_revision_pp", "eloundou_beta", "microsoft_applicability", "anthropic_observed"]
        w = csv.DictWriter(f, fieldnames=keys, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            w.writerow(r)

    summary = {k: {kk: vv for kk, vv in v.items() if kk not in ("대분류별_22_25", "분위별_22_25")} for k, v in result["corr"].items()}
    print(json.dumps({"counts": result["_counts"], "corr": summary}, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    sys.exit(main())

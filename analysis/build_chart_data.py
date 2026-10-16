"""analysis/out/*.json 과 research/_data/*.csv 에서 덱 차트 값을 모아 chart-data.json 하나로 만든다.

덱은 이 파일의 값으로만 차트를 그린다(presentation/scripts/build.ts 가 index.html 에 주입).
실행: python3 -I analysis/build_chart_data.py
"""

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "analysis" / "out"


def load(name):
    return json.loads((OUT / name).read_text())


def main():
    occ = load("occupation_results.json")
    tl = load("timeline_results.json")
    data = {
        "_about": "AGI·일자리 덱의 검증된 집계. 이 파일에 없는 값은 덱 차트에 그리지 않는다.",
        "_확인일": "2026-10-16",
        "_생성": "analysis/build_chart_data.py",
    }

    # METR: SOTA 점만, 16시간 초과 포함(표시는 하되 배가 주기 적합에서는 빠졌다는 주석)
    label = {
        "gpt_4": "GPT-4 · 4분",
        "claude_mythos_preview_early_inspect": "Claude Mythos(초기판) · 17.4시간",
    }
    pts = []
    for p in tl["metr"]["sota_points"]:
        if p["date"] < "2022-01-01":
            continue
        pts.append({"date": p["date"], "v": p["p50_min"], "model": p["model"],
                    "label": label.get(p["model"]), "강조": p["model"] == "claude_mythos_preview_early_inspect",
                    **({"dy": 112, "dx": 34} if p["model"] == "claude_opus_4_6_inspect" else {})})
    dd = tl["metr"]["독립_회귀_배가주기_일"]
    data["metr_horizon"] = {
        "제목": "AI가 맡을 수 있는 업무 크기 (METR 50% 시간지평)",
        "지표": "50% 시간지평: AI가 절반 확률로 끝내는 과제를 사람이 하면 걸리는 시간",
        "단위": "분 (로그 눈금)",
        "y이름": "사람 기준 작업 시간",
        "x범위": ["2022-01-01", "2026-07-01"],
        "y범위": [0.3, 3000],
        "y눈금": [{"v": 1, "label": "1분"}, {"v": 10, "label": "10분"}, {"v": 60, "label": "1시간"},
                 {"v": 480, "label": "8시간"}, {"v": 2400, "label": "40시간"}],
        "points": pts,
        "배가주기_일": {"2019이후": dd["SOTA_전체"], "2023이후": dd["SOTA_2023이후"], "2024이후": dd["SOTA_2024이후"]},
        "출처": "METR Time Horizon 1.1 원본 YAML(2026-05 갱신), SOTA 표시 모델. 배가 주기는 직접 회귀",
        "url": tl["metr"]["_source"]["url"],
        "라벨": ["기술", "외부 자료 · 직접 재계산"],
    }

    # AGI 예상 연도 이동: ESPAI HLMI·FAOL(직접), Metaculus 5121(2차)
    s = tl["forecast_series"]
    def pts_of(key, fmt=None):
        return [{"x": round(r["예측시점_연"], 2), "y": r["예상연도"]} for r in s[key]]
    hl = pts_of("ai_impacts_espai_hlmi")
    fa = pts_of("ai_impacts_espai_faol")
    mc = pts_of("metaculus_5121_general_ai")
    data["agi_forecast_shift"] = {
        "제목": "전문가들이 예상한 AGI 연도의 변화",
        "x이름": "예측을 낸 시점",
        "y이름": "AGI 예상 연도",
        "x범위": [2016, 2027], "y범위": [2020, 2070], "y간격": 10, "H": 520,
        "대각선": False,
        "series": [
            {"key": "전문가 설문 (HLMI)", "색": "worse", "points": hl},
            {"key": "예측 커뮤니티 Metaculus", "색": "neutral", "keyDy": 26,
             "points": [{**p, "label": (p["y"] if i in (3, len(mc) - 1) else False), **({"dy": 30} if i == 3 else {})} for i, p in enumerate(mc)]},
        ],
        "출처": "AI Impacts ESPAI 2016·2022·2023·2024(보고서 직접) · Metaculus 질문 5121 커뮤니티 중앙값(OWID·The Decoder·LessWrong·80,000 Hours 등 재인용)",
        "라벨": ["기술", "외부 자료"],
        "주의": "HLMI와 Metaculus 'general AI'는 정의가 다르다. 한 계열로 잇지 않았다. Metaculus 값은 전부 2차 인용이다",
    }
    data["espai_two_clocks"] = {
        "제목": "AGI 예상 연도와 모든 직업 자동화 예상 연도",
        "x이름": "설문 시점",
        "y이름": "예상 연도",
        "x범위": [2016, 2025], "y범위": [2030, 2170], "y간격": 20, "H": 520,
        "series": [
            {"key": "직업 자동화", "색": "worse", "points": fa},
            {"key": "AGI", "색": "evid", "points": hl},
        ],
        "간격": tl["espai_paired"],
        "출처": "AI Impacts Expert Survey on Progress in AI 2016·2022·2023·2024 (Grace et al.)",
        "라벨": ["기술", "외부 자료 · 직접"],
        "주의": "2016년 FAOL 값은 이 덱의 수집 파일에 없어 그리지 않았다",
    }

    # 직업 산점도 (미국)
    corr = occ["corr"]["eloundou_beta"]
    sc = occ["scatter_eloundou"]
    data["occ_scatter"] = {
        "제목": "AI 노출도와 고용 변화 — 미국 세부 직업",
        "x이름": "AI 노출도 (Eloundou 외 β, 0~1)",
        "y이름": "고용 변화율 2022→2025 (%)",
        "y범위": [-50, 50], "y간격": 25,
        "points": sc,
        "강조": ["15-1251", "41-9041", "15-1254", "43-9021", "43-3031"],
        "주석점": [
            {"soc": "41-9041", "text": "텔레마케터 −39.5%", "dx": -16},
            {"soc": "15-1251", "text": "프로그래머 −30.5%", "dx": -16},
            {"soc": "15-1254", "text": "웹 개발자 −20.8%", "dx": -16, "dy": -10},
            {"soc": "43-9021", "text": "데이터 입력원 −19.3%", "dx": -16, "dy": 22},
            {"soc": "43-3031", "text": "경리·회계 사무원 −11.4%", "dx": -18, "dy": -12},
        ],
        "n": len(sc),
        "상관": corr["고용1만명이상_22_25"],
        "상관_전체": corr["전체_22_25"],
        "출처": "BLS OEWS 2022·2025년 5월 전국 직업 고용(Wayback 사본) · Eloundou 외(2024, Science) 직업별 β",
        "라벨": ["기술", "직접 계산"],
        "주의": "세로축 ±50%를 넘는 점은 끝에 붙였다. 점 크기 = 2022년 고용",
    }
    q = corr["분위별_22_25"]
    tails = occ["tails"]
    data["occ_quintile"] = {
        "제목": "노출도 5분위별 합계 고용 변화 2022→2025",
        "단위": "%",
        "bars": [{"key": f"{b['분위']}분위 (β {b['노출도_범위'][0]:.2f}~{b['노출도_범위'][1]:.2f})", "value": b["합계고용_변화율_pct"], "강조": b["분위"] == 5} for b in q],
        "분위표": q,
        "꼬리": tails,
        "출처": "BLS OEWS 2022·2025 · Eloundou 외 β. 분위당 154개 직업",
        "라벨": ["기술", "직접 계산"],
    }
    data["occ_top_exposed"] = {"제목": "노출도 상위 직업 (2022년 고용 5만 명 이상)", "rows": occ["top_exposed"],
                               "출처": "BLS OEWS 2022·2025 · Eloundou 외 β · Microsoft 적용가능성 · Anthropic 관측 노출", "라벨": ["기술", "직접 계산"]}
    data["occ_corr_table"] = {k: {kk: vv for kk, vv in v.items() if kk not in ("대분류별_22_25", "분위별_22_25")} for k, v in occ["corr"].items()}
    data["occ_major"] = occ["major_summary"]

    # 한국 직업 대분류 취업자 (2019 = 100)
    rows = list(csv.DictReader(open(ROOT / "research" / "_data" / "kosis_occupation_employment.csv", encoding="utf-8")))
    val = {(r["occupation"], int(r["year"])): float(r["employed_thousand"]) for r in rows}
    pick = [("2 전문가 및 관련 종사자", "전문가", "evid"), ("3 사무 종사자", "사무직", "worse"), ("5 판매 종사자", "판매직", "neutral")]
    ser = []
    for code, key, color in pick:
        base = val[(code, 2019)]
        ser.append({"key": key, "색": color, "points": [{"x": y, "y": round(val[(code, y)] / base * 100, 1),
                    "label": (round(val[(code, y)] / base * 100, 1) if y in (2019, 2025) else False)} for y in range(2019, 2026)],
                    "원값_천명": {y: val[(code, y)] for y in range(2019, 2026)}})
    data["kr_occupation_index"] = {
        "제목": "한국 직업 대분류별 취업자 (2019 = 100)",
        "x이름": "연도 (연평균)", "y이름": "2019년 = 100",
        "x범위": [2019, 2025], "y범위": [80, 125], "y간격": 10, "H": 480,
        "series": ser,
        "합계검산_규칙": "9개 대분류 합과 전체의 차이가 반올림 한계(9 × 0.5 = 4.5천 명) 이내",
        "합계검산": {y: {"대분류합": sum(v for (o, yy), v in val.items() if yy == y and not o.startswith("계")),
                       "전체": val[("계(전체 취업자)", y)]} for y in range(2013, 2026)},
        "출처": "KOSIS 경제활동인구조사 직업별 취업자(DT_1DA7E08S_NEW), 연간, 천 명",
        "라벨": ["기술", "외부 자료"],
    }


    # ── 2036 시나리오 추정 ──
    pj = load("projection_2036.json")
    gate_min = [g["분"] for g in pj["가정"]["직급별_업무단위"]]
    data["proj_capability"] = {
        "제목": "AI가 80% 확률로 해내는 업무 크기 2036년까지 연장",
        "y이름": "사람 기준 작업 시간 (로그)",
        "y범위": [60, 2_000_000],
        "y눈금": [{"v": 60, "label": "1시간"}, {"v": 480, "label": "하루"}, {"v": 2400, "label": "1주"},
                 {"v": 10200, "label": "1달"}, {"v": 30000, "label": "분기"}, {"v": 120000, "label": "1년"}, {"v": 1_000_000, "label": "8년"}],
        "x범위": [2026, 2037],
        "문턱": [{"v": m, "label": f"{g['직급']} · {g['업무']}"} for g, m in zip(pj["가정"]["직급별_업무단위"], gate_min)],
        "series": [{"key": n, "색": {"빠름": "evid", "기준": "worse", "신중": "neutral"}[n],
                    "points": [{"x": q["t"], "y": q["p80_min"]} for q in pj["능력"][n]["경로"]]} for n in ("빠름", "기준", "신중")],
        "출발점": pj["가정"]["METR_출발점"],
        "출처": "METR Time Horizon 1.1 원본 YAML의 p80 실측(출발점)과 배가 주기 직접 회귀 · 이 덱의 시나리오 가정",
        "라벨": ["추정", "시나리오 · 교육용"],
        "주의": "METR는 16시간 넘는 측정을 신뢰할 수 없다고 밝혔다. 그 위쪽은 측정이 아니라 외삽이다",
    }
    data["proj_gates"] = {
        "제목": "직급별로 AI가 업무를 해내는 해와 대체가 본격화하는 해",
        "rows": [{"직급": r["직급"], "업무단위": r["업무단위"],
                  **{n: {"문턱": next(x for x in pj["능력"][n]["직급"] if x["직급"] == r["직급"])["능력문턱"],
                         "본격화": next(x for x in pj["능력"][n]["직급"] if x["직급"] == r["직급"])["대체본격화"],
                         "본격화_현실할인": next(x for x in pj["능력"][n]["직급"] if x["직급"] == r["직급"])["대체본격화_현실할인"]}
                     for n in ("빠름", "기준", "신중")}}
                 for r in pj["능력"]["기준"]["직급"]],
        "확산시차": {n: pj["능력"][n]["확산시차_년"] for n in ("빠름", "기준", "신중")},
        "라벨": ["추정", "시나리오 · 교육용"],
    }
    cum = pj["한국_누적_대체압력"]
    data["proj_kr_jobs"] = {
        "제목": "한국 일자리 대체 압력 누적 (새 일자리 미반영)",
        "x이름": "연말 기준", "y이름": "만 명",
        "x범위": [2026, 2036], "y범위": [0, 400], "y간격": 100, "H": 500,
        "series": [{"key": n, "색": {"빠름": "evid", "기준": "worse", "신중": "neutral"}[n],
                    "points": [{"x": int(y), "y": round(v / 1e4, 1), "label": (round(v / 1e4) if y in ("2030", "2036") else False)} for y, v in cum[n].items()]}
                   for n in ("빠름", "기준", "신중")] + [
                   {"key": "KDI 교차확인", "색": "neutral", "keyDy": 22,
                    "points": [{"x": int(y), "y": round(v / 1e4, 1), "label": (round(v / 1e4) if y == "2036" else False)} for y, v in pj["교차확인_KDI_누적"].items()]}],
        "취업자대비_2036_pct": {n: pj["한국_누적_대체압력_취업자대비_pct"][n]["2036"] for n in cum},
        "취업자_2025": pj["취업자_2025"],
        "민감도_실현비율_2036": pj["민감도_실현비율_2036"],
        "출처": "KOSIS 2025 취업자 · 한국고용정보원 2025-40 고위험 비중 · KDI 2026-01(교차확인) · 이 덱의 통합 물결 모형",
        "라벨": ["추정", "시나리오 · 교육용"],
    }
    # 기준 시나리오의 직업군별 경로(물결이 번져 가는 순서)
    names = {"3 사무 종사자": "사무", "5 판매 종사자": "판매", "8 장치,기계조작 및 조립종사자": "장치·기계 조작",
             "4 서비스 종사자": "서비스", "7 기능원 및 관련 기능종사자": "기능원", "2 전문가 및 관련 종사자": "전문가"}
    grp = pj["직업군별"]
    data["proj_wave"] = {
        "제목": "직업군별 2036년 대체 압력 (기준 시나리오)",
        "단위": "%",
        "bars": [{"key": f"{names[k]} · φ {grp[k]['몸쓰는정도_phi']}", "value": grp[k]["기준"]["2036_비율_pct"],
                  "중앙연도": grp[k]["기준"]["중앙연도"], "강조": k == "3 사무 종사자"} for k in names],
        "표": {names[k]: {n: {"중앙연도": grp[k][n]["중앙연도"], "5%도달": grp[k][n]["5pct_도달연도"], "2036_pct": grp[k][n]["2036_비율_pct"]} for n in ("빠름", "기준", "신중")} for k in names},
        "라벨": ["추정", "시나리오 · 교육용"],
    }
    def eta(code):
        r = grp[code]
        f = lambda n: r[n]["5pct_도달연도"] or "2036 이후"
        return {"기준": f("기준"), "빠름": f("빠름"), "신중": f("신중")}
    top = {t["soc"]: t for t in occ["top_exposed"]}
    def row(dest, sub, signal, d, code, status, label):
        e = eta(code)
        return {"dest": dest, "sub": sub, "signal": signal, "dir": d, "eta": str(e["기준"]),
                "range": "세 시나리오 모두 같음" if e["빠름"] == e["신중"] == e["기준"] else f"시나리오별 {e['빠름']}~{e['신중']}년",
                "status": status, "statusLabel": label}
    data["poster"] = {
        "제목": "직업군별 대체 시작 시점",
        "rows": [
            {"dest": "텔레마케터·상담", "sub": "콜센터", "signal": f"미국 텔레마케터 {top['41-9041']['변화율_pct']}% (2022→25)", "dir": "down",
             "eta": "이미 감소", "range": "2023년부터 실측", "status": "arrived", "statusLabel": "이미 감소"},
            {"dest": "신입 개발자", "sub": "프로그래머", "signal": f"미국 프로그래머 {top['15-1251']['변화율_pct']}% · 한국 청년 SI −16.6%", "dir": "down",
             "eta": "이미 감소", "range": "2023년부터 실측", "status": "arrived", "statusLabel": "이미 감소"},
            row("사무직", "회계·경리·일반 사무", f"미국 경리·회계 사무원 {top['43-3031']['변화율_pct']}% · 한국 사무직 +8.7%", "down", "3 사무 종사자", "near", "접근 중"),
            row("판매직", "매장·영업", "한국 판매직 −17.6% (2019→25)", "down", "5 판매 종사자", "near", "접근 중"),
            row("생산·조작", "장치·기계·조립", "한국 장치·기계 조작 −2.4% (2019→25)", "down", "8 장치,기계조작 및 조립종사자", "ontime", "정시"),
            row("전문직", "법률·재무·의료", "한국 전문가 +19.7% · 미국 법률직 +7.6%", "up", "2 전문가 및 관련 종사자", "wait", "증강 쪽"),
        ],
        "출처": "BLS OEWS · 한국은행 2026-19 · KOSIS · 이 덱의 2036 통합 물결 모형(5% 도달 연도)",
        "라벨": ["기술(실측 신호)", "추정(도착 예정)"],
    }
    rel = load("relations.json")
    # 덱 본문에 반올림해 적은 값. 손으로 쓰지 않고 여기서 계산해 남긴다(check-numbers 대조용)
    emp_sa = next(v for k, v in pj["직업군별"].items() if k.startswith("3 "))["취업자_2025"]
    data["표시값"] = {
        "배가주기_일_반올림": [round(dd["SOTA_전체"]), round(dd["SOTA_2023이후"]), round(dd["SOTA_2024이후"])],
        "R2_r_소수2": round(rel["R2_AGI예상"]["HLMI"]["r"], 2), "R3_r_소수2": round(rel["R3_일자리예상"]["FAOL"]["r"], 2),
        "사무직_최대치_만명": round(emp_sa * 0.498 * 0.5 / 1e4, 1),
        "민감도_기준_만명": [round(pj["민감도_실현비율_2036"]["rho_0.3"]["기준"] / 1e4), round(pj["민감도_실현비율_2036"]["rho_0.7"]["기준"] / 1e4)],
    }
    data["relations"] = rel
    data["course_checks"] = occ["course_checks"]
    path = ROOT / "chart-data.json"
    path.write_text(json.dumps(data, ensure_ascii=False, indent=1))
    print({"datasets": [k for k in data if not k.startswith("_")], "bytes": path.stat().st_size,
           "kr_sum_check": all(abs(v["대분류합"] - v["전체"]) <= 4.5 for v in data["kr_occupation_index"]["합계검산"].values())})


if __name__ == "__main__":
    main()

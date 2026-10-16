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
    # 점 이름표(모델 이름 · 값). 강조점만 주석(note)이고 GPT-4는 모델 이름표(slab)로 그린다
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
                    **({"anchor": "end", "dx": -18, "dy": -16} if p["model"] == "claude_mythos_preview_early_inspect" else {}),
                    **({"anchor": "middle", "dx": 0, "dy": -18} if p["model"] == "gpt_4" else {})})
    dd = tl["metr"]["독립_회귀_배가주기_일"]
    data["metr_horizon"] = {
        "제목": "AI가 맡을 수 있는 업무 크기 (METR 50% 시간지평)",
        "지표": "50% 시간지평: AI가 절반 확률로 끝내는 과제를 사람이 하면 걸리는 시간",
        "단위": "분 (로그 눈금)",
        "y이름": "사람 기준 작업 시간 (로그 눈금)",
        "x이름": "모델 발표일",
        "x범위": ["2022-01-01", "2026-07-01"],
        "y범위": [0.3, 3000],
        # 눈금은 10배 간격 하나로(1·10·100·1,000분). 강조값(17.4시간)과 견주도록 1,000분 아래에 시간 환산을 보조로 단다
        "y눈금": [{"v": 1, "label": "1분"}, {"v": 10, "label": "10분"}, {"v": 100, "label": "100분"}, {"v": 1000, "label": "1,000분"}],
        "y보조": {"v": 1000, "label": "≈17시간"},
        "구간": [{"from": "2024-01-01", "label": f"2024년 이후 {dd['SOTA_2024이후']}일마다 두 배"}],
        "n": len(pts),
        "points": pts,
        "배가주기_일": {"2019이후": dd["SOTA_전체"], "2023이후": dd["SOTA_2023이후"], "2024이후": dd["SOTA_2024이후"]},
        "출처": "METR Time Horizon 1.1 원본 YAML(2026-05 갱신), SOTA 표시 모델. 배가 주기는 직접 회귀",
        "url": tl["metr"]["_source"]["url"],
        "라벨": ["기술", "외부 자료 · 직접 재계산"],
    }
    first, last = pts[0], pts[-1]
    data["metr_horizon"]["설명"] = (
        f"선 차트. 가로축은 모델 발표일 2022년 1월–2026년 7월(실제 날짜 간격), 세로축은 사람 기준 작업 시간(분, 로그 눈금 1–1,000분). "
        f"그 시점 최고 기록 모델 {len(pts)}개를 이었다. {first['date'][:4]}년 {int(first['date'][5:7])}월 {first['v']}분에서 "
        f"GPT-4(2023년 3월) 4분을 거쳐 {last['date'][:4]}년 {int(last['date'][5:7])}월 Claude Mythos(초기판) {last['v']:,}분(17.4시간)이 됐다. "
        f"두 배가 되는 데 걸린 기간은 2019년 이후 {dd['SOTA_전체']}일, 2023년 이후 {dd['SOTA_2023이후']}일, 2024년 이후 {dd['SOTA_2024이후']}일이다.")

    # AGI 예상 연도 이동: ESPAI HLMI·FAOL(직접), Metaculus 5121(2차)
    s = tl["forecast_series"]
    def pts_of(key, fmt=None):
        return [{"x": round(r["예측시점_연"], 2), "y": r["예상연도"]} for r in s[key]]
    hl = pts_of("ai_impacts_espai_hlmi")
    fa = pts_of("ai_impacts_espai_faol")
    mc = pts_of("metaculus_5121_general_ai")
    # 같은 AGI 계열은 10·11장에서 같은 이름·색·굵기로 그린다(이름표 위치만 데이터에 둔다)
    agi_key = "AGI (전문가 설문)"
    hl_lab = [{**hl[0], "dy": -18}, {**hl[1], "dy": -18}, {**hl[2], "anchor": "start", "dx": 14, "dy": -10},
              {**hl[3], "anchor": "start", "dx": 14, "dy": -12}]
    data["agi_forecast_shift"] = {
        "제목": "전문가들이 예상한 AGI 연도의 변화",
        "x이름": "예측을 낸 시점",
        "y이름": "AGI 예상 연도",
        "x범위": [2016, 2027], "y범위": [2020, 2070], "y간격": 10, "H": 520,
        "대각선": False,
        "series": [
            {"key": agi_key, "색": "worse", "keyValue": True, "keyDx": 16, "keyDy": 7, "points": hl_lab},
            {"key": "Metaculus 커뮤니티", "색": "neutral", "점": "labeled", "keyValue": True, "keyDx": 16, "keyDy": 7,
             "points": [{**p, "label": (p["y"] if i in (3, len(mc) - 1) else False), **({"dy": 32} if i == 3 else {})} for i, p in enumerate(mc)]},
        ],
        "주석": [{"x": 2024.3, "y": 2064, "anchor": "start", "text": "2016→2024년 설문 19년 앞당김", "to": [2023.1, 2053.2]}],
        "출처": "AI Impacts ESPAI 2016·2022·2023·2024(보고서 직접) · Metaculus 질문 5121 커뮤니티 중앙값(OWID·The Decoder·LessWrong·80,000 Hours 등 재인용)",
        "라벨": ["기술", "외부 자료"],
        "주의": "HLMI와 Metaculus 'general AI'는 정의가 다르다. 한 계열로 잇지 않았다. Metaculus 값은 전부 2차 인용이다",
    }
    data["agi_forecast_shift"]["설명"] = (
        "선 차트 두 계열. 가로축은 예측을 낸 시점 2016–2027년, 세로축은 AGI 예상 연도 2020–2070년. "
        "AI Impacts 전문가 설문(사람 수준 AI, HLMI)의 예상 연도는 " + ", ".join(f"{int(p['x'])}년 설문 {p['y']}년" for p in hl) + ". "
        f"Metaculus 커뮤니티 중앙값(2차 인용)은 {int(mc[0]['x'])}년 {mc[0]['y']}년에서 {int(mc[5]['x'])}년 {mc[5]['y']}년까지 내려간 뒤 "
        f"{int(mc[-1]['x'])}년 {mc[-1]['y']}년으로 늦춰졌다. 두 계열은 AGI 정의가 달라 잇지 않았다.")
    data["espai_two_clocks"] = {
        "제목": "AGI 예상 연도와 모든 직업 자동화 예상 연도",
        "x이름": "예측을 낸 시점",
        "y이름": "예상 연도",
        # 10장과 같은 가로축·같은 자리. 새로 더하는 계열(모든 직업 자동화)이 위로 올라가므로 세로 범위만 늘린다
        "x범위": [2016, 2027], "y범위": [2030, 2170], "y간격": 20, "H": 520,
        "series": [
            {"key": agi_key, "색": "worse", "keyValue": True, "keyDx": 16, "keyDy": 7, "points": [
                {**hl[0], "dy": -18}, {**hl[1], "dy": -18}, {**hl[2], "dy": -18}, {**hl[3], "anchor": "start", "dx": 14, "dy": -12}]},
            {"key": "모든 직업 자동화 (같은 설문)", "색": "evid", "keyValue": True, "keyDx": 16, "keyDy": 7, "points": [
                {**fa[0], "anchor": "end", "dx": -16, "dy": 6}, {**fa[1], "anchor": "start", "dx": 14, "dy": -10},
                {**fa[2], "anchor": "start", "dx": 14, "dy": 8}]},
        ],
        "주석": [{"x": 2024.3, "y": 2082, "anchor": "end", "text": f"2024년 설문 두 예상 사이 {tl['espai_paired'][-1]['간격_년']}년",
                 "span": [2024.96, hl[-1]["y"], fa[-1]["y"]]}],
        "간격": tl["espai_paired"],
        "출처": "AI Impacts Expert Survey on Progress in AI 2016·2022·2023·2024 (Grace et al.)",
        "라벨": ["기술", "외부 자료 · 직접"],
        "주의": "2016년 FAOL 값은 이 덱의 수집 파일에 없어 그리지 않았다",
    }
    data["espai_two_clocks"]["설명"] = (
        "선 차트 두 계열. 가로축은 설문 시점 2016–2027년, 세로축은 예상 연도 2030–2170년. "
        "AGI 예상 연도는 " + ", ".join(f"{int(p['x'])}년 설문 {p['y']}년" for p in hl) + ". "
        "모든 직업 자동화 예상 연도는 " + ", ".join(f"{int(p['x'])}년 설문 {p['y']}년" for p in fa) + ". "
        "두 예상 사이 간격은 " + ", ".join(f"{g['설문']}년 {g['간격_년']}년" for g in tl["espai_paired"]) + ". 2016년 직업 자동화 값은 수집 파일에 없다.")

    # 직업 산점도 (미국)
    corr = occ["corr"]["eloundou_beta"]
    sc = occ["scatter_eloundou"]
    data["occ_scatter"] = {
        "제목": "AI 노출도와 고용 변화 · 미국 세부 직업",
        "x이름": "AI 노출도 β (0–1)",
        "y이름": "고용 변화율 (%)",
        # 세로 범위는 점 98.4%가 들어가는 ±50%. 넘는 점은 끝에 붙이지 않고 위 끝 삼각 표식(▲)과 개수 주석으로 따로 그린다
        "y범위": [-50, 50], "y간격": 25,
        "points": sc,
        "강조": ["15-1251", "41-9041", "15-1254", "43-9021", "43-3031"],
        # 강조점 이름표: 점 오른쪽 여백의 한 열에 두고 지시선으로 잇는다(이름표 5개 이하).
        # 가장 크게 줄어든 텔레마케터 하나만 강조 주석(note)으로 단위를 붙이고, 나머지는 같은 형식의 이름표다
        "주석점": [
            {"soc": "43-3031", "text": "경리·회계 사무원 −11.4"},
            {"soc": "15-1254", "text": "웹 개발자 −20.8"},
            {"soc": "43-9021", "text": "데이터 입력원 −19.3"},
            {"soc": "15-1251", "text": "프로그래머 −30.5"},
            {"soc": "41-9041", "text": "텔레마케터 −39.5", "note": True},
        ],
        "n": len(sc),
        "상관": corr["고용1만명이상_22_25"],
        "상관_전체": corr["전체_22_25"],
        "출처": "BLS OEWS 2022·2025년 5월 전국 직업 고용(Wayback 사본) · Eloundou 외(2024, Science) 직업별 β",
        "라벨": ["기술", "직접 계산"],
        "주의": "세로축 ±50%를 넘는 직업은 끝에 붙이지 않고 위 끝 삼각 표식(▲)으로 따로 그렸다. 점 크기 = 2022년 고용(작은 직업은 같은 최소 크기)",
    }
    over50 = [p for p in sc if p["y"] > 50]
    data["occ_scatter"]["범위밖주석"] = [f"▲ +50% 넘는 직업 {len(over50)}개", f"(최대 +{max(p['y'] for p in sc)})는 위 끝에"]
    hi_pts = {p["soc"]: p for p in sc}
    data["occ_scatter"]["설명"] = (
        f"산점도. 점 하나가 미국 세부 직업 하나(2022년 고용 1만 명 이상, {len(sc)}개). 가로축은 AI 노출도 β 0–1, "
        f"세로축은 2022→2025년 고용 변화율 −50%–+50%. Spearman 순위 상관 {corr['고용1만명이상_22_25']['spearman_rho']:.3f}"
        f"(부트스트랩 95% 구간 {corr['고용1만명이상_22_25']['spearman_95ci_bootstrap'][0]:.2f}–{corr['고용1만명이상_22_25']['spearman_95ci_bootstrap'][1]:.3f})".replace("-", "−") + ". "
        f"+50%를 넘는 직업 {len(over50)}개(최댓값 +{max(p['y'] for p in sc)}%)는 위 끝에 삼각 표식으로 따로 그렸다. 강조한 직업은 "
        + ", ".join(f"{a['text'].split(' −')[0]} {hi_pts[a['soc']]['y']}%" for a in data["occ_scatter"]["주석점"]).replace("-", "−") + ".")
    q = corr["분위별_22_25"]
    tails = occ["tails"]
    data["occ_quintile"] = {
        "제목": "노출도 5분위별 합계 고용 변화 2022→2025",
        "단위": "%",
        "bars": [{"key": f"{b['분위']}분위 (β {b['노출도_범위'][0]:.2f}–{b['노출도_범위'][1]:.2f})", "value": b["합계고용_변화율_pct"], "강조": b["분위"] == 5} for b in q],
        "x이름": "합계 고용 변화율 (%)",
        "주석": [{"bar": 5, "text": "노출이 가장 큰 분위만 증가 폭이 작음"}],
        "분위표": q,
        "꼬리": tails,
        "출처": "BLS OEWS 2022·2025 · Eloundou 외 β. 분위당 154개 직업",
        "라벨": ["기술", "직접 계산"],
    }
    data["occ_quintile"]["설명"] = (
        f"가로 막대 차트. 미국 직업 {tails['전체']['n']}개를 AI 노출도 β로 5분위(분위마다 {q[0]['n']}개)로 나눠 2022→2025년 합계 고용 변화율(%)을 0에서 그렸다. "
        + ", ".join(f"{b['분위']}분위 +{b['합계고용_변화율_pct']}%" for b in q) + ". 노출이 가장 큰 5분위만 증가율이 낮다.")
    data["occ_top_exposed"] = {"제목": "노출도 상위 직업 (2022년 고용 5만 명 이상)", "rows": occ["top_exposed"],
                               "출처": "BLS OEWS 2022·2025 · Eloundou 외 β · Microsoft 적용가능성 · Anthropic 관측 노출", "라벨": ["기술", "직접 계산"]}
    data["occ_corr_table"] = {k: {kk: vv for kk, vv in v.items() if kk not in ("대분류별_22_25", "분위별_22_25")} for k, v in occ["corr"].items()}
    data["occ_major"] = occ["major_summary"]

    # 한국 직업 대분류 취업자 (2019 = 100)
    rows = list(csv.DictReader(open(ROOT / "research" / "_data" / "kosis_occupation_employment.csv", encoding="utf-8")))
    val = {(r["occupation"], int(r["year"])): float(r["employed_thousand"]) for r in rows}
    # 직업군 이름은 덱 전체에서 하나로: 전문직·사무직·판매직(KOSIS 대분류 2·3·5)
    pick = [("2 전문가 및 관련 종사자", "전문직", "evid"), ("3 사무 종사자", "사무직", "worse"), ("5 판매 종사자", "판매직", "neutral")]
    ser = []
    for code, key, color in pick:
        base = val[(code, 2019)]
        # 시작값 100은 세 계열이 같아 이름표를 달지 않고(세로축 100 눈금이 말한다), 끝값만 계열 이름과 한 줄로 단다
        ser.append({"key": key, "색": color, "keyValue": True, **({"점": "labeled"} if color == "neutral" else {}),
                    "keyDx": 16, "keyDy": 7,
                    "points": [{"x": y, "y": round(val[(code, y)] / base * 100, 1),
                    "label": (round(val[(code, y)] / base * 100, 1) if y == 2025 else False)} for y in range(2019, 2026)],
                    "원값_천명": {y: val[(code, y)] for y in range(2019, 2026)}})
    data["kr_occupation_index"] = {
        "제목": "한국 직업 대분류별 취업자 (2019 = 100)",
        "x이름": "연도 (연평균)", "y이름": "취업자 (2019년 = 100)",
        "x범위": [2019, 2025], "y범위": [80, 125], "y간격": 10, "H": 480,
        "series": ser,
        "주석": [{"x": 2022.4, "y": 94.5, "anchor": "start", "text": "사무직 취업자도 아직 증가", "to": [2023.0, 104.6]}],
        "합계검산_규칙": "9개 대분류 합과 전체의 차이가 반올림 한계(9 × 0.5 = 4.5천 명) 이내",
        "합계검산": {y: {"대분류합": sum(v for (o, yy), v in val.items() if yy == y and not o.startswith("계")),
                       "전체": val[("계(전체 취업자)", y)]} for y in range(2013, 2026)},
        "출처": "KOSIS 경제활동인구조사 직업별 취업자(DT_1DA7E08S_NEW), 연간, 천 명",
        "라벨": ["기술", "외부 자료"],
    }
    data["kr_occupation_index"]["설명"] = (
        "선 차트 세 계열. 가로축은 2019–2025년(연평균), 세로축은 2019년을 100으로 둔 취업자 지수 80–125(변화 비교를 위해 80부터). "
        + ", ".join(f"{s_['key']} 2019년 {s_['원값_천명'][2019]:,.0f}천 명 → 2025년 {s_['원값_천명'][2025]:,.0f}천 명(지수 {s_['points'][-1]['y']})" for s_ in ser)
        + ". 원값은 KOSIS 직업별 취업자 연평균(천 명).")


    # ── 2036 시나리오 추정 ──
    pj = load("projection_2036.json")
    gate_min = [g["분"] for g in pj["가정"]["직급별_업무단위"]]
    data["proj_capability"] = {
        "제목": "AI가 80% 확률로 해내는 업무 크기 2036년까지 연장",
        "y이름": "사람 기준 작업 시간 (시간, 로그 눈금)",
        "x이름": "연도",
        # 세로 범위는 1–10,000시간(문턱 4개가 겹치지 않게 플롯 높이를 확보). 그 위로 나가는 선은 끝에서 멈춘다
        "y범위": [60, 600_000],
        # 축 눈금은 10배 간격(1·10·100·1,000·10,000시간, 값은 분). 직급 업무 크기는 눈금이 아니라 문턱선 이름표로만 둔다
        "y눈금": [{"v": 60 * 10 ** i, "label": f"{10 ** i:,}"} for i in range(5)],
        "x범위": [2026, 2037], "x간격": 2,
        "외삽": {"v": 960, "label": "16시간 위는 측정이 아닌 외삽"},
        "문턱": [{"v": m, "label": f"{g['직급']} · {g['업무']}"} for g, m in zip(pj["가정"]["직급별_업무단위"], gate_min)],
        "series": [{"key": n, "색": {"빠름": "evid", "기준": "worse", "신중": "neutral"}[n],
                    **{"빠름": {"keyDx": 12, "keyDy": 8, "keyAnchor": "start"}, "기준": {"keyDx": 14, "keyDy": 6, "keyAnchor": "start"},
                       "신중": {"keyDx": 14, "keyDy": 6, "keyAnchor": "start"}}[n],
                    "points": [{"x": q["t"], "y": q["p80_min"]} for q in pj["능력"][n]["경로"]]} for n in ("빠름", "기준", "신중")],
        "출발점": pj["가정"]["METR_출발점"],
        "출처": "METR Time Horizon 1.1 원본 YAML의 p80 실측(출발점)과 배가 주기 직접 회귀 · 이 덱의 시나리오 가정",
        "라벨": ["추정", "시나리오 · 교육용"],
        "주의": "METR는 16시간 넘는 측정을 신뢰할 수 없다고 밝혔다. 그 위쪽은 측정이 아니라 외삽이다",
    }
    month = next(r for r in pj["능력"]["기준"]["직급"] if r["직급"] == "과장·차장")
    cross = {n: next(x for x in pj["능력"][n]["직급"] if x["직급"] == "과장·차장")["능력문턱"] for n in ("빠름", "기준", "신중")}
    month_min = gate_min[[g["직급"] for g in pj["가정"]["직급별_업무단위"]].index("과장·차장")]
    # 헤드라인의 근거: 세 시나리오가 '한 달짜리 일' 기준선을 넘는 해(이름표 자리만 여기서 정한다)
    data["proj_capability"]["문턱교차"] = {
        "v": month_min, "직급": "과장·차장",
        # 맥락색(신중) 점은 대비가 낮아 바로 옆에 연도 이름표를 단다
        "points": [{"key": n, "색": {"빠름": "evid", "기준": "worse", "신중": "neutral"}[n], "x": cross[n],
                    **({"label": cross[n], "anchor": "start", "dx": 12, "dy": 28} if n == "신중" else {})} for n in ("빠름", "기준", "신중")],
        # 점은 문턱선 위에, 연도는 선이 지나지 않는 아래쪽 빈 자리에 한 줄 주석으로
        "주석": {"x": 2029.4, "y": 150, "anchor": "start",
                 "text": f"한 달짜리 일을 해내기 시작하는 해 · 빠름 {cross['빠름']} · 기준 {cross['기준']} · 신중 {cross['신중']}"},
    }
    start = pj["가정"]["METR_출발점"]
    data["proj_capability"]["설명"] = (
        "선 차트 세 시나리오(추정). 가로축은 2026–2037년, 세로축은 AI가 80% 확률로 해내는 업무 크기를 사람 기준 작업 시간으로 잰 값(로그 눈금 1–10,000시간, 그 위는 그리지 않음). "
        f"출발점은 2026년 4월 METR 실측 185.9분. 16시간(960분) 위는 측정이 아닌 외삽이다. "
        f"직급별로 가정한 업무 크기 기준선 4개(하루·한 주·한 달·한 분기) 가운데 한 달짜리 일({month_min:,}분)을 넘는 해는 "
        f"빠름 {cross['빠름']}년, 기준 {cross['기준']}년, 신중 {cross['신중']}년.")
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
        # 중간 값 이름표(2030년)는 강조 계열(기준)에만, 끝값은 계열 이름과 한 줄로. 맥락 계열(신중·KDI)은 끝점에만 점을 둔다
        "series": [{"key": n, "색": {"빠름": "evid", "기준": "worse", "신중": "neutral"}[n], "keyValue": True,
                    "keyDx": 16, "keyDy": 7, **({"점": "labeled"} if n == "신중" else {}),
                    "points": [{"x": int(y), "y": round(v / 1e4, 1),
                                "label": (round(v / 1e4) if y == "2036" or (y == "2030" and n == "기준") else False),
                                **({"anchor": "start", "dx": 12, "dy": 22} if y == "2030" else {})} for y, v in cum[n].items()]}
                   for n in ("빠름", "기준", "신중")] + [
                   {"key": "KDI 교차확인 (점선)", "색": "neutral", "dash": "b", "점": "labeled", "keyValue": True, "keyDx": 16, "keyDy": 7,
                    "points": [{"x": int(y), "y": round(v / 1e4, 1), "label": (round(v / 1e4) if y == "2036" else False)} for y, v in pj["교차확인_KDI_누적"].items()]}],
        "주석": [{"x": 2027.0, "y": 300, "anchor": "start", "text": "새로 생기는 일자리는 빼고 센 누적값"}],
        "취업자대비_2036_pct": {n: pj["한국_누적_대체압력_취업자대비_pct"][n]["2036"] for n in cum},
        "취업자_2025": pj["취업자_2025"],
        "민감도_실현비율_2036": pj["민감도_실현비율_2036"],
        "출처": "KOSIS 2025 취업자 · 한국고용정보원 2025-40 고위험 비중 · KDI 2026-01(교차확인) · 이 덱의 통합 물결 모형",
        "라벨": ["추정", "시나리오 · 교육용"],
    }
    data["proj_kr_jobs"]["설명"] = (
        "선 차트 네 계열(추정). 가로축은 2026–2036년 연말, 세로축은 한국 일자리 대체 압력 누적 0–400만 명(새로 생기는 일자리 미반영). "
        "2036년 값은 " + ", ".join(f"{n} {round(cum[n]['2036'] / 1e4)}만 명(취업자의 {pj['한국_누적_대체압력_취업자대비_pct'][n]['2036']}%)" for n in ("빠름", "기준", "신중"))
        + f", KDI 교차확인 {round(pj['교차확인_KDI_누적']['2036'] / 1e4)}만 명. 기준 시나리오 2030년 값은 {round(cum['기준']['2030'] / 1e4)}만 명.")
    # 기준 시나리오의 직업군별 경로(물결이 번져 가는 순서)
    # 직업군 이름은 17·27·28장에서 하나로(KOSIS 대분류의 줄임 이름)
    names = {"3 사무 종사자": "사무직", "5 판매 종사자": "판매직", "8 장치,기계조작 및 조립종사자": "장치·기계 조작직",
             "4 서비스 종사자": "서비스직", "7 기능원 및 관련 기능종사자": "기능직", "2 전문가 및 관련 종사자": "전문직"}
    grp = pj["직업군별"]
    data["proj_wave"] = {
        "제목": "직업군별 2036년 대체 압력 (기준 시나리오)",
        "단위": "%",
        "bars": [{"key": f"{names[k]} · φ {grp[k]['몸쓰는정도_phi']}", "value": grp[k]["기준"]["2036_비율_pct"],
                  "중앙연도": grp[k]["기준"]["중앙연도"], "강조": k == "3 사무 종사자"} for k in names],
        "표": {names[k]: {n: {"중앙연도": grp[k][n]["중앙연도"], "5%도달": grp[k][n]["5pct_도달연도"], "2036_pct": grp[k][n]["2036_비율_pct"]} for n in ("빠름", "기준", "신중")} for k in names},
        "라벨": ["추정", "시나리오 · 교육용"],
    }
    # 헤드라인은 '시작 순서'를 말한다 → 차트도 시작 시점(일자리 5%가 대체 압력을 받는 해)을 연도 축에 그린다.
    # 점 = 기준 시나리오, 구간선 = 빠름–신중 범위. 기준 시작 연도 순으로 정렬(2036년까지 5%에 못 미치면 맨 아래)
    order = sorted(names, key=lambda k: grp[k]["기준"]["5pct_도달연도"] or 9999)
    data["proj_wave"]["시작"] = {
        "x범위": [2026, 2037], "x간격": 2, "x이름": "일자리 5%가 대체 압력을 받는 해",
        "rows": [{"key": f"{names[k]} · φ {grp[k]['몸쓰는정도_phi']}", "강조": k == "3 사무 종사자", "pct2036": grp[k]["기준"]["2036_비율_pct"],
                  **{n: grp[k][n]["5pct_도달연도"] for n in ("빠름", "기준", "신중")}} for k in order],
        "미도달": "2036년까지 5% 미도달",
        "열이름": "2036년 대체 압력(%)",
        "주석": {"row": f"{names['3 사무 종사자']} · φ {grp['3 사무 종사자']['몸쓰는정도_phi']}", "text": "가장 먼저 시작"},
    }
    data["proj_wave"]["설명"] = (
        "점과 범위선 차트(추정). 가로축은 2026–2037년, 직업군마다 일자리 5%가 대체 압력을 받는 해를 기준 시나리오 점과 빠름–신중 시나리오 범위로 그렸다. "
        + ", ".join(f"{names[k]} {grp[k]['기준']['5pct_도달연도']}년(빠름 {grp[k]['빠름']['5pct_도달연도']}년, 신중 {grp[k]['신중']['5pct_도달연도'] or '2036년 이후'}{'년' if grp[k]['신중']['5pct_도달연도'] else ''})"
                    for k in order if grp[k]["기준"]["5pct_도달연도"])
        + f". {names['2 전문가 및 관련 종사자']}은 2036년까지 5%에 이르지 않는다. 2036년 대체 압력(취업자 대비)은 "
        + ", ".join(f"{names[k]} {grp[k]['기준']['2036_비율_pct']}%" for k in order) + ".")
    def eta(code):
        r = grp[code]
        f = lambda n: r[n]["5pct_도달연도"] or "2036 이후"
        return {"기준": f("기준"), "빠름": f("빠름"), "신중": f("신중")}
    top = {t["soc"]: t for t in occ["top_exposed"]}
    def row(dest, sub, signal, d, code, status, label):
        e = eta(code)
        return {"dest": dest, "sub": sub, "signal": signal, "dir": d, "eta": str(e["기준"]),
                "range": "세 시나리오 모두 같음" if e["빠름"] == e["신중"] == e["기준"] else f"시나리오별 {e['빠름']}–{e['신중']}년",
                "status": status, "statusLabel": label}
    # 표기: 음수는 U+2212, 기간 연도는 네 자리, 범위는 en dash(값은 그대로)
    pct = lambda v: f"{'−' if v < 0 else '+'}{abs(v)}%"
    data["poster"] = {
        "제목": "직업군별 대체 시작 시점",
        "rows": [
            {"dest": "텔레마케터·상담", "sub": "콜센터", "signal": f"미국 텔레마케터 {pct(top['41-9041']['변화율_pct'])} (2022→2025)", "dir": "down",
             "eta": "이미 감소", "range": "2023년부터 실측", "status": "arrived", "statusLabel": "이미 감소"},
            {"dest": "신입 개발자", "sub": "프로그래머", "signal": f"미국 프로그래머 {pct(top['15-1251']['변화율_pct'])} · 한국 청년 SI −16.6%", "dir": "down",
             "eta": "이미 감소", "range": "2023년부터 실측", "status": "arrived", "statusLabel": "이미 감소"},
            row("사무직", "회계·경리·일반 사무", f"미국 경리·회계 사무원 {pct(top['43-3031']['변화율_pct'])} · 한국 사무직 +8.7%", "down", "3 사무 종사자", "near", "접근 중"),
            row("판매직", "매장·영업", "한국 판매직 −17.6% (2019→2025)", "down", "5 판매 종사자", "near", "접근 중"),
            row("장치·기계 조작직", "장치·기계·조립", "한국 장치·기계 조작직 −2.4% (2019→2025)", "down", "8 장치,기계조작 및 조립종사자", "ontime", "정시"),
            row("전문직", "법률·재무·의료", "한국 전문직 +19.7% · 미국 법률직 +7.6%", "up", "2 전문가 및 관련 종사자", "wait", "증강 쪽"),
        ],
        "출처": "BLS OEWS · 한국은행 2026-19 · KOSIS · 이 덱의 2036 통합 물결 모형(5% 도달 연도)",
        "라벨": ["기술(실측 신호)", "추정(시작 예정 연도)"],
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

// 덱 차트: 모든 값은 index.html 안 chart-data 블록(= ../chart-data.json 주입본)에서만 읽는다.
const DATA = JSON.parse(document.getElementById("chart-data").textContent);
const NS = "http://www.w3.org/2000/svg";

const el = (name, attrs = {}, text) => {
  const n = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  if (text !== undefined) n.textContent = String(text);
  return n;
};
const svgOf = (W, H, d) => el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": d.제목 ?? "" });
const yearFrac = (s) => {
  const [y, m = "6", day = "15"] = String(s).split("-");
  return Number(y) + (Number(m) - 1) / 12 + (Number(day) - 1) / 365;
};
const fmt = (v, d = 1) => Number(v).toLocaleString("ko-KR", { minimumFractionDigits: d, maximumFractionDigits: d });

// 1) 로그 세로축 선: METR 50% 시간지평 (분). 가로축은 실제 날짜 간격.
function logline(d, W) {
  const H = 520, x0 = 120, x1 = W - 40, yTop = 40, yBase = H - 72;
  const svg = svgOf(W, H, d);
  const pts = d.points;
  const lo = yearFrac(d.x범위[0]), hi = yearFrac(d.x범위[1]);
  const ymin = Math.log10(d.y범위[0]), ymax = Math.log10(d.y범위[1]);
  const px = (s) => x0 + ((yearFrac(s) - lo) / (hi - lo)) * (x1 - x0);
  const py = (v) => yBase - ((Math.log10(v) - ymin) / (ymax - ymin)) * (yBase - yTop);
  const g = el("g", { class: "grid" });
  for (const t of d.y눈금) {
    g.append(el("line", { x1: x0, y1: py(t.v), x2: x1, y2: py(t.v) }));
    svg.append(el("text", { class: "tick", x: x0 - 14, y: py(t.v) + 6, "text-anchor": "end" }, t.label));
  }
  svg.append(g);
  svg.append(el("line", { class: "base", x1: x0, y1: yBase, x2: x1, y2: yBase }));
  for (let y = Math.ceil(lo); y <= Math.floor(hi); y++) {
    svg.append(el("text", { class: "alab", x: px(`${y}-01-01`), y: yBase + 34, "text-anchor": "middle" }, y));
  }
  if (d.구간) {
    for (const z of d.구간) {
      const xa = px(z.from), xb = px(z.to ?? d.x범위[1]);
      svg.insertBefore(el("rect", { class: "band", x: xa, y: yTop, width: xb - xa, height: yBase - yTop }), svg.firstChild);
      svg.append(el("text", { class: "band-lab", x: xa + 12, y: yTop + 26 }, z.label));
    }
  }
  svg.append(el("polyline", { class: "l-worse", points: pts.map((p) => `${px(p.date)},${py(p.v)}`).join(" ") }));
  for (const p of pts) {
    svg.append(el("circle", { class: "b-worse", cx: px(p.date), cy: py(p.v), r: p.강조 ? 10 : 6 }));
    if (p.label) {
      const right = px(p.date) < x0 + (x1 - x0) * 0.72;
      svg.append(el("text", { class: p.강조 ? "note" : "vlab", x: px(p.date) + (p.dx ?? (right ? 14 : -14)), y: py(p.v) + (p.dy ?? -14), "text-anchor": right ? "start" : "end" }, p.label));
    }
  }
  svg.append(el("text", { class: "alab", x: x0 - 104, y: yTop - 14 }, d.y이름));
  return svg;
}

// 2) 연도 세로축 선: 예측 시점(가로) → 예상 도달 연도(세로). 계열마다 자기 점만 잇는다.
function yearline(d, W) {
  const H = d.H ?? 520, x0 = 96, x1 = W - (d.keyW ?? 200), yTop = 56, yBase = H - 72;
  const svg = svgOf(W, H, d);
  const lo = d.x범위[0], hi = d.x범위[1];
  const [ylo, yhi] = d.y범위;
  const px = (v) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  const py = (v) => yBase - ((v - ylo) / (yhi - ylo)) * (yBase - yTop);
  const g = el("g", { class: "grid" });
  for (let t = ylo; t <= yhi; t += d.y간격) {
    g.append(el("line", { x1: x0, y1: py(t), x2: x1, y2: py(t) }));
    svg.append(el("text", { class: "tick", x: x0 - 12, y: py(t) + 6, "text-anchor": "end" }, t));
  }
  svg.append(g);
  svg.append(el("line", { class: "base", x1: x0, y1: yBase, x2: x1, y2: yBase }));
  for (let y = Math.ceil(lo); y <= Math.floor(hi); y++) svg.append(el("text", { class: "alab", x: px(y), y: yBase + 34, "text-anchor": "middle" }, y));
  if (d.대각선) {
    // 예상 연도 = 예측 시점 (지금 바로 도착)
    svg.append(el("line", { class: "diag", x1: px(lo), y1: py(lo), x2: px(hi), y2: py(hi) }));
  }
  for (const s of d.series) {
    const cls = { worse: ["l-worse", "b-worse", "note"], evid: ["l-evid", "b-evid", "vlab"], neutral: ["l-neutral", "b-neutral", "alab"] }[s.색 ?? "neutral"];
    svg.append(el("polyline", { class: cls[0], points: s.points.map((p) => `${px(p.x)},${py(p.y)}`).join(" ") }));
    for (const [i, p] of s.points.entries()) {
      svg.append(el("circle", { class: cls[1], cx: px(p.x), cy: py(p.y), r: 7 }));
      if (p.label !== false) svg.append(el("text", { class: "vlab", x: px(p.x), y: py(p.y) + (p.dy ?? -16), "text-anchor": p.anchor ?? "middle" }, p.label ?? p.y));
    }
    const last = s.points.at(-1);
    svg.append(el("text", { class: `${cls[2]} slab`, x: px(last.x) + 20, y: py(last.y) + (s.keyDy ?? 6) }, s.key));
  }
  svg.append(el("text", { class: "alab", x: x0 - 80, y: yTop - 30 }, d.y이름));
  svg.append(el("text", { class: "alab", x: x1, y: yBase + 64, "text-anchor": "end", "font-size": 15 }, d.x이름));
  return svg;
}

// 3) 산점도: 직업별 노출도(가로) × 고용 변화율(세로). 세로 범위를 넘는 점은 끝에 붙이고 표시한다.
function scatter(d, W) {
  const H = 560, x0 = 96, x1 = W - 24, yTop = 48, yBase = H - 72;
  const svg = svgOf(W, H, d);
  const [ylo, yhi] = d.y범위;
  const px = (v) => x0 + v * (x1 - x0);
  const py = (v) => yBase - ((Math.max(ylo, Math.min(yhi, v)) - ylo) / (yhi - ylo)) * (yBase - yTop);
  const g = el("g", { class: "grid" });
  for (let t = ylo; t <= yhi; t += d.y간격) {
    g.append(el("line", { x1: x0, y1: py(t), x2: x1, y2: py(t), class: t === 0 ? "zero" : "" }));
    svg.append(el("text", { class: "tick", x: x0 - 12, y: py(t) + 6, "text-anchor": "end" }, t > 0 ? `+${t}` : t));
  }
  svg.append(g);
  for (const t of [0, 0.25, 0.5, 0.75, 1]) svg.append(el("text", { class: "alab", x: px(t), y: yBase + 34, "text-anchor": "middle" }, t.toFixed(2)));
  const hl = new Set(d.강조 ?? []);
  for (const p of d.points) {
    if (hl.has(p.soc)) continue;
    const r = Math.max(3, Math.min(14, Math.sqrt(p.emp2022 / 20000)));
    svg.append(el("circle", { class: "dot", cx: px(p.x), cy: py(p.y), r }));
  }
  for (const p of d.points.filter((q) => hl.has(q.soc))) {
    const r = Math.max(5, Math.min(14, Math.sqrt(p.emp2022 / 20000)));
    svg.append(el("circle", { class: "b-worse", cx: px(p.x), cy: py(p.y), r }));
  }
  for (const a of d.주석점 ?? []) {
    const p = d.points.find((q) => q.soc === a.soc);
    if (!p) continue;
    svg.append(el("text", { class: "note", x: px(p.x) + (a.dx ?? -14), y: py(p.y) + (a.dy ?? 6), "text-anchor": a.anchor ?? "end" }, a.text));
  }
  if (d.추세) {
    const { a, b } = d.추세; // y = a + b x (%)
    svg.append(el("line", { class: "trend", x1: px(0), y1: py(a), x2: px(1), y2: py(a + b) }));
  }
  svg.append(el("text", { class: "alab", x: x0 - 80, y: yTop - 26 }, d.y이름));
  svg.append(el("text", { class: "alab", x: x1, y: yBase + 64, "text-anchor": "end" }, d.x이름));
  return svg;
}

// 4) 가로 막대: 0에서 시작, 음수는 왼쪽. 직접 라벨.
function hbar(d, W) {
  const rowH = d.rowH ?? 56, labW = d.labW ?? 280, H = rowH * d.bars.length + 48;
  const svg = svgOf(W, H, d);
  const vals = d.bars.map((b) => b.value);
  const lo = Math.min(0, ...vals, d.min ?? 0), hi = Math.max(0, ...vals, d.max ?? 0);
  const x0 = labW + 24, x1 = W - 96;
  const px = (v) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  svg.append(el("line", { class: "base", x1: px(0), y1: 8, x2: px(0), y2: H - 40 }));
  for (const [i, b] of d.bars.entries()) {
    const y = 16 + i * rowH;
    const xa = Math.min(px(0), px(b.value)), w = Math.abs(px(b.value) - px(0));
    svg.append(el("text", { class: b.강조 ? "note" : "alab", x: labW, y: y + rowH / 2 + 2, "text-anchor": "end" }, b.key));
    svg.append(el("rect", { class: b.강조 ? "b-worse" : b.색 === "evid" ? "b-evid" : "b-neutral", x: xa, y: y + 8, width: Math.max(w, 2), height: rowH - 24, style: "transform-origin: 0 50%" }));
    const lab = `${b.value > 0 ? "+" : ""}${fmt(b.value, d.자릿수 ?? 1)}${d.단위 ?? ""}`;
    svg.append(el("text", { class: "vlab", x: b.value >= 0 ? px(b.value) + 10 : px(b.value) - 10, y: y + rowH / 2 + 2, "text-anchor": b.value >= 0 ? "start" : "end" }, lab));
  }
  return svg;
}

// 5) 능력 경로 부채꼴: 로그 세로축, 시나리오 선 3개 + 직급 문턱 가로선
function capfan(d, W) {
  const H = d.H ?? 560, x0 = 110, x1 = W - 260, yTop = 24, yBase = H - 64;
  const svg = svgOf(W, H, d);
  const [lo, hi] = d.x범위;
  const ymin = Math.log10(d.y범위[0]), ymax = Math.log10(d.y범위[1]);
  const px = (v) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  const py = (v) => yBase - ((Math.log10(v) - ymin) / (ymax - ymin)) * (yBase - yTop);
  const g = el("g", { class: "grid" });
  for (const t of d.y눈금) {
    g.append(el("line", { x1: x0, y1: py(t.v), x2: x1, y2: py(t.v) }));
    svg.append(el("text", { class: "tick", x: x0 - 12, y: py(t.v) + 6, "text-anchor": "end" }, t.label));
  }
  svg.append(g);
  // 16시간 측정 상한 위쪽은 외삽 구간
  svg.insertBefore(el("rect", { class: "band", x: x0, y: yTop, width: x1 - x0, height: py(960) - yTop }), svg.firstChild);
  svg.append(el("text", { class: "band-lab", x: x0 + 12, y: yTop + 28 }, "16시간 위 = 측정이 아닌 외삽"));
  svg.append(el("line", { class: "base", x1: x0, y1: yBase, x2: x1, y2: yBase }));
  for (let y = lo; y <= hi; y += 2) svg.append(el("text", { class: "alab", x: px(y), y: yBase + 32, "text-anchor": "middle" }, y));
  for (const t of d.문턱) {
    svg.append(el("line", { class: "gate", x1: x0, y1: py(t.v), x2: x1, y2: py(t.v) }));
    svg.append(el("text", { class: "gate-lab", x: x1 + 12, y: py(t.v) + 6 }, t.label));
  }
  for (const s of d.series) {
    const cls = { worse: "l-worse", evid: "l-evid", neutral: "l-neutral" }[s.색];
    const pts = s.points.filter((p) => p.y <= d.y범위[1]);
    svg.append(el("polyline", { class: cls, points: pts.map((p) => `${px(p.x)},${py(p.y)}`).join(" ") }));
    const last = pts.at(-1);
    svg.append(el("text", { class: `${s.색 === "worse" ? "note" : s.색 === "evid" ? "vlab" : "alab"} slab`, x: px(last.x) - 8, y: py(last.y) - 14, "text-anchor": "end" }, s.key));
  }
  return svg;
}

// 6) 직급 표: 시나리오별 능력 문턱 · 대체 본격화
function gates(d) {
  const t = document.createElement("table");
  t.className = "plan gates";
  const yr = (v) => (v > 2036.99 ? `${Math.floor(v)}*` : String(Math.floor(v)));
  t.innerHTML = `<thead><tr><th>직급</th><th>AI가 맡을 업무 단위</th><th>빠름</th><th>기준</th><th>신중</th></tr></thead>`;
  const tb = document.createElement("tbody");
  for (const r of d.rows) {
    const cell = (n) => `<td class="yr"><b>${yr(r[n].본격화)}</b><span>문턱 ${yr(r[n].문턱)}</span></td>`;
    tb.insertAdjacentHTML("beforeend", `<tr><td>${r.직급}</td><td>${r.업무단위}</td>${cell("빠름")}${cell("기준")}${cell("신중")}</tr>`);
  }
  t.append(tb);
  return t;
}

// 7) 도착 안내: 포스터 줄 목록(taste-skill 「One item per poster line」)
function poster(d) {
  const wrap = document.createElement("div");
  wrap.className = "poster";
  wrap.innerHTML = d.rows.map((r) => `<div class="it"><span class="w">${r.dest}</span><span class="f"><span class="eta">${r.eta}</span><span class="s">${r.range} · ${r.signal}</span></span></div>`).join("");
  return wrap;
}

const KINDS = { logline, yearline, scatter, hbar, capfan };
const BLOCKS = { gates, poster };

for (const host of document.querySelectorAll("[data-block]")) {
  const d = DATA[host.dataset.block];
  if (d) host.prepend(BLOCKS[host.dataset.kind](d));
}

for (const host of document.querySelectorAll("[data-chart]")) {
  const d = DATA[host.dataset.chart];
  if (!d) { host.append(Object.assign(document.createElement("p"), { className: "chart-src", textContent: `데이터 없음: ${host.dataset.chart}` })); continue; }
  const dd = host.dataset.h ? { ...d, H: Number(host.dataset.h) } : d; // data-h: 칸에 맞춘 세로 길이
  host.prepend(KINDS[host.dataset.kind](dd, Number(host.dataset.w || 784)));
}

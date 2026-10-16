// 덱 차트: 모든 값·이름표·이름표 자리는 index.html 안 chart-data 블록(= ../chart-data.json 주입본)에서만 읽는다.
// 공통 규칙(dataviz 스킬 · 덱 표준)
//  - svg는 차트 제목(.chart-title)과 부제(.chart-sub) 다음, 출처(.chart-src) 앞에 넣는다
//  - svg는 role="img"이고 <title>(차트 제목)·<desc>(chart-data의 '설명': 유형·축·범위·핵심 값)로 읽힌다. 눈금·축 글자는 aria-hidden
//  - 차트 안 글자는 잉크·회색(--ink/--note)만 입는다. 계열은 글자 옆의 점·선 색으로 알린다
//  - 점은 바탕색 2px 고리, 막대는 두께 ≤24px, 단위는 축 이름·제목에 한 번
//  - 도형마다 data-x·data-y(값)를 단다
const DATA = JSON.parse(document.getElementById("chart-data").textContent);
const NS = "http://www.w3.org/2000/svg";

const el = (name, attrs = {}, text) => {
  const n = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined && v !== null) n.setAttribute(k, String(v));
  if (text !== undefined) n.textContent = String(text);
  return n;
};
const html = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = String(text);
  return n;
};
const yearFrac = (s) => {
  const [y, m = "6", day = "15"] = String(s).split("-");
  return Number(y) + (Number(m) - 1) / 12 + (Number(day) - 1) / 365;
};
const MINUS = "−";
// 숫자 표기: 천 단위 쉼표, 음수는 U+2212, signed면 양수에 +
const fmt = (v, d = 1, signed = false) => {
  const s = Math.abs(Number(v)).toLocaleString("ko-KR", { minimumFractionDigits: d, maximumFractionDigits: d });
  return (v < 0 ? MINUS : signed && v > 0 ? "+" : "") + s;
};
const SERIES = { worse: ["l-worse", "b-worse"], evid: ["l-evid", "b-evid"], neutral: ["l-neutral", "b-neutral"] };
const DASH = { a: "dash-a", b: "dash-b" };

function svgOf(W, H, d, host) {
  const id = `chart-${host.dataset.chart}`;
  const title = host.querySelector(".chart-title")?.textContent.trim() || d.제목 || "";
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-labelledby": `${id}-t`, "aria-describedby": `${id}-d` });
  svg.append(el("title", { id: `${id}-t` }, title), el("desc", { id: `${id}-d` }, d.설명 ?? ""));
  return svg;
}
// 눈금·축 이름: 화면에는 보이지만 보조기기는 <desc>로 읽는다
const tick = (attrs, text) => el("text", { class: "tick", "aria-hidden": "true", ...attrs }, text);
const axisLab = (attrs, text) => el("text", { class: "alab", "aria-hidden": "true", ...attrs }, text);
// 격자: g.grid 안에 한 겹 더(g.grid-lines) 넣어 선을 담는다. 장 글줄 차례(motion.js의 '.body .grid > *')가 격자선 수만큼 밀리지 않게
const gridGroup = () => el("g", { class: "grid-lines" });
const gridWrap = (g) => { const w = el("g", { class: "grid" }); w.append(g); return w; };

// 강조 주석: 한 줄 글자 + 대상 점을 가리키는 지시선(to) 또는 두 값 사이 구간선(span)
function annotate(svg, a, px, py) {
  const tx = px(a.x), ty = py(a.y);
  if (a.span) {
    const [sx, y1, y2] = a.span;
    svg.append(el("line", { class: "leader", x1: px(sx), y1: py(y1) - 14, x2: px(sx), y2: py(y2) + 14 }));
    svg.append(el("line", { class: "leader", x1: tx + (a.anchor === "end" ? 8 : -8), y1: ty - 7, x2: px(sx) - 6, y2: ty - 7 }));
  }
  if (a.to) {
    // 지시선은 글자 상자 밖(대상이 위면 글자 위 가장자리, 아래면 아래 가장자리)에서 시작한다
    const [ex, ey] = [px(a.to[0]), py(a.to[1])];
    const sx = a.anchor === "end" ? tx - 16 : tx + 16, sy = ey < ty - 7 ? ty - 24 : ty + 8;
    svg.append(el("line", { class: "leader", x1: sx, y1: sy, x2: ex, y2: ey }));
  }
  svg.append(el("text", { class: "note", x: tx, y: ty, "text-anchor": a.anchor ?? "start" }, a.text));
}

// 1) 로그 세로축 선: METR 50% 시간지평 (분). 가로축은 실제 날짜 간격.
function logline(d, W, host) {
  const H = d.H ?? 520, x0 = 104, x1 = W - 24, yTop = 56, yBase = H - 72;
  const svg = svgOf(W, H, d, host);
  const lo = yearFrac(d.x범위[0]), hi = yearFrac(d.x범위[1]);
  const ymin = Math.log10(d.y범위[0]), ymax = Math.log10(d.y범위[1]);
  const px = (s) => x0 + ((yearFrac(s) - lo) / (hi - lo)) * (x1 - x0);
  const py = (v) => yBase - ((Math.log10(v) - ymin) / (ymax - ymin)) * (yBase - yTop);
  for (const z of d.구간 ?? []) {
    const xa = px(z.from), xb = px(z.to ?? d.x범위[1]);
    svg.append(el("rect", { class: "band", x: xa, y: yTop, width: xb - xa, height: yBase - yTop }));
    svg.append(el("text", { class: "band-lab", x: xa + 16, y: yTop + 32 }, z.label));
  }
  const g = gridGroup(svg);
  for (const t of d.y눈금) {
    g.append(el("line", { x1: x0, y1: py(t.v), x2: x1, y2: py(t.v) }));
    svg.append(tick({ x: x0 - 16, y: py(t.v) + 7, "text-anchor": "end" }, t.label));
  }
  if (d.y보조) svg.append(axisLab({ x: x0 - 16, y: py(d.y보조.v) + 33, "text-anchor": "end" }, d.y보조.label));
  svg.append(gridWrap(g));
  svg.append(el("line", { class: "base", x1: x0, y1: yBase, x2: x1, y2: yBase }));
  for (let y = Math.ceil(lo); y <= Math.floor(hi); y++) svg.append(axisLab({ x: px(`${y}-01-01`), y: yBase + 34, "text-anchor": "middle" }, y));
  const pts = d.points;
  svg.append(el("polyline", { class: "l-worse", "data-series": "metr", points: pts.map((p) => `${px(p.date)},${py(p.v)}`).join(" ") }));
  for (const p of pts) {
    svg.append(el("circle", { class: "b-worse", cx: px(p.date), cy: py(p.v), r: p.강조 ? 9 : 5, "data-x": p.date, "data-y": p.v }));
    if (p.label) svg.append(el("text", { class: p.강조 ? "note" : "slab", x: px(p.date) + (p.dx ?? 14), y: py(p.v) + (p.dy ?? -14), "text-anchor": p.anchor ?? "start" }, p.label));
  }
  svg.append(axisLab({ x: 0, y: yTop - 24 }, d.y이름));
  if (d.x이름) svg.append(axisLab({ x: x1, y: yBase + 64, "text-anchor": "end" }, d.x이름));
  return svg;
}

// 2) 연도 세로축 선: 가로 = 시점(연도), 세로 = 값. 계열마다 자기 점만 잇는다.
//    s.점 = "labeled"면 이름표가 있는 점에만 점을 찍는다(맥락 계열). s.keyValue면 끝값을 계열 이름과 한 줄로 단다.
function yearline(d, W, host) {
  const H = d.H ?? 520, x0 = 96, x1 = W - (d.keyW ?? 232), yTop = 64, yBase = H - 72;
  const svg = svgOf(W, H, d, host);
  const lo = d.x범위[0], hi = d.x범위[1];
  const [ylo, yhi] = d.y범위;
  const px = (v) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  const py = (v) => yBase - ((v - ylo) / (yhi - ylo)) * (yBase - yTop);
  const g = gridGroup(svg);
  for (let t = ylo; t <= yhi; t += d.y간격) {
    g.append(el("line", { x1: x0, y1: py(t), x2: x1, y2: py(t) }));
    svg.append(tick({ x: x0 - 14, y: py(t) + 7, "text-anchor": "end" }, t));
  }
  svg.append(gridWrap(g));
  svg.append(el("line", { class: "base", x1: x0, y1: yBase, x2: x1, y2: yBase }));
  for (let y = Math.ceil(lo); y <= Math.floor(hi); y += d.x간격 ?? 1) svg.append(axisLab({ x: px(y), y: yBase + 34, "text-anchor": "middle" }, y));
  for (const s of d.series) {
    const [lc, bc] = SERIES[s.색 ?? "neutral"];
    const cls = [lc, DASH[s.dash]].filter(Boolean).join(" ");
    svg.append(el("polyline", { class: cls, "data-series": s.key, points: s.points.map((p) => `${px(p.x)},${py(p.y)}`).join(" ") }));
    const last = s.points.at(-1);
    for (const p of s.points) {
      const labeled = p.label !== false && p.label !== undefined || p === last;
      if (s.점 === "labeled" && !labeled) continue;
      svg.append(el("circle", { class: bc, cx: px(p.x), cy: py(p.y), r: 6, "data-x": p.x, "data-y": p.y }));
    }
    for (const p of s.points) {
      if (p.label === false || (s.keyValue && p === last)) continue;
      svg.append(el("text", { class: "vlab", x: px(p.x) + (p.dx ?? 0), y: py(p.y) + (p.dy ?? -16), "text-anchor": p.anchor ?? "middle" }, p.label ?? p.y));
    }
    const keyText = s.keyValue && last.label !== false ? `${s.key} ${last.label ?? last.y}` : s.key;
    svg.append(el("text", { class: s.keyValue ? "vlab slab" : "slab", x: px(last.x) + (s.keyDx ?? 16), y: py(last.y) + (s.keyDy ?? 7), "text-anchor": s.keyAnchor ?? "start" }, keyText));
  }
  for (const a of d.주석 ?? []) annotate(svg, a, px, py);
  svg.append(axisLab({ x: 0, y: yTop - 32 }, d.y이름));
  svg.append(axisLab({ x: x1, y: yBase + 64, "text-anchor": "end" }, d.x이름));
  return svg;
}

// 3) 산점도: 직업별 노출도(가로) × 고용 변화율(세로). 세로 범위는 모든 점을 담는다.
//    범위를 넘는 점이 생기면 끝에 붙이지 않고 다른 모양(위·아래 삼각형)과 개수 주석으로 따로 그린다.
//    강조점 이름표는 오른쪽 여백의 한 열에 두고 지시선으로 잇는다(이름표끼리·점과 겹치지 않게).
function scatter(d, W, host) {
  // 세로축 이름은 차트 제목('… 고용 변화율 (%)')이 맡고, 가로축 이름은 눈금 줄 오른쪽 여백에 둔다(플롯 높이 확보)
  const H = d.H ?? 560, x0 = 96, x1 = W - 216, yTop = 20, yBase = H - 40;
  const svg = svgOf(W, H, d, host);
  const [ylo, yhi] = d.y범위;
  const px = (v) => x0 + v * (x1 - x0);
  const py = (v) => yBase - ((v - ylo) / (yhi - ylo)) * (yBase - yTop);
  const g = gridGroup(svg);
  for (let t = ylo; t <= yhi; t += d.y간격) {
    g.append(el("line", { x1: x0, y1: py(t), x2: x1, y2: py(t), class: t === 0 ? "zero" : undefined }));
    svg.append(tick({ x: x0 - 14, y: py(t) + 7, "text-anchor": "end" }, fmt(t, 0, true)));
  }
  svg.append(gridWrap(g));
  for (const t of [0, 0.25, 0.5, 0.75, 1]) svg.append(axisLab({ x: px(t), y: yBase + 34, "text-anchor": "middle" }, t.toFixed(2)));
  svg.append(axisLab({ x: x1 + 40, y: yBase + 34 }, d.x이름));
  const hl = new Set(d.강조 ?? []);
  const out = { up: 0, down: 0 };
  // 범위를 넘는 점: 끝에 붙인 원이 아니라 다른 모양(위·아래 삼각형)으로, 축 선에서 4px 떨어진 바깥쪽에 그린다.
  // 너비 14인 삼각형끼리 겹치면 가운데를 기준으로 좌우로 벌려 16px 간격을 둔다(실제 값은 data-x·data-y)
  const tri = { up: [], down: [] };
  for (const p of d.points) if (p.y > yhi || p.y < ylo) tri[p.y > yhi ? "up" : "down"].push(p);
  const triX = new Map();
  for (const side of ["up", "down"]) {
    const xs = tri[side].map((p) => ({ p, x: px(p.x) })).sort((u, v) => u.x - v.x);
    const groups = [];
    for (const t of xs) { const gl = groups.at(-1); if (gl && t.x - gl.at(-1).x < 16) gl.push(t); else groups.push([t]); }
    for (const gl of groups) { const mid = (gl[0].x + gl.at(-1).x) / 2; gl.forEach((t, i) => triX.set(t.p, mid + (i - (gl.length - 1) / 2) * 16)); }
  }
  const mark = (p, cls, r) => {
    if (p.y > yhi || p.y < ylo) {
      const up = p.y > yhi, y = up ? yTop : yBase, k = up ? -1 : 1, cx = triX.get(p);
      out[up ? "up" : "down"]++;
      svg.append(el("path", { class: `${cls} clip`, d: `M${cx - 7},${y + k * 4} L${cx + 7},${y + k * 4} L${cx},${y + k * 16} Z`, "data-x": p.x, "data-y": p.y }));
      return;
    }
    svg.append(el("circle", { class: cls, cx: px(p.x), cy: py(p.y), r, "data-x": p.x, "data-y": p.y }));
  };
  for (const p of d.points) if (!hl.has(p.soc)) mark(p, "dot", Math.max(4.5, Math.min(14, Math.sqrt(p.emp2022 / 20000))));
  for (const p of d.points.filter((q) => hl.has(q.soc))) mark(p, "b-worse", Math.max(6, Math.min(14, Math.sqrt(p.emp2022 / 20000))));
  // 범위 밖 개수 주석: 오른쪽 여백 위쪽(점과 겹치지 않는 자리)에 두 줄로
  if (out.up) (d.범위밖주석 ?? [`▲ 세로 범위를 넘는 직업 ${out.up}개는`, "위 끝에 따로 표시"]).forEach((line, i) => svg.append(el("text", { class: "edge-lab", x: x1 + 24, y: yTop + 8 + i * 26 }, line)));
  if (out.down) svg.append(el("text", { class: "edge-lab", x: x1 + 24, y: yBase - 8 }, `▼ 아래로 넘는 직업 ${out.down}개`));
  // 이름표 열: 점의 세로 자리 순으로 쌓고(최소 간격 28), 지시선은 점에서 오른쪽 여백까지 가로로 간 뒤 꺾는다
  const ann = (d.주석점 ?? []).map((a) => ({ a, p: d.points.find((q) => q.soc === a.soc) })).filter((x) => x.p).sort((u, v) => py(u.p.y) - py(v.p.y));
  const gap = 28, colX = x1 + 40;
  let prev = -Infinity;
  const ys = ann.map(({ p }) => (prev = Math.max(py(p.y) + 7, prev + gap)));
  const shift = Math.max(0, ys.at(-1) - (yBase - 8));
  // 지시선이 다른 점을 지나지 않게: 후보 경로(가로로 간 뒤 꺾기 · 곧장 · 위/아래로 비켜 가기) 중 지나는 점이 가장 적은 것
  const dots = d.points.filter((q) => q.y <= yhi && q.y >= ylo).map((q) => ({ q, x: px(q.x), y: py(q.y), r: Math.max(4.5, Math.min(14, Math.sqrt(q.emp2022 / 20000))) + 6 }));
  const segD = (P, A, B) => { const dx = B[0] - A[0], dy = B[1] - A[1], L = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((P.x - A[0]) * dx + (P.y - A[1]) * dy) / L)); return Math.hypot(P.x - A[0] - t * dx, P.y - A[1] - t * dy); };
  const hits = (pts, self) => dots.filter((o) => o.q !== self && pts.slice(1).some((B, k) => segD(o, pts[k], B) < o.r)).length;
  ann.forEach(({ a, p }, i) => {
    const ty = ys[i] - shift, sx = px(p.x), sy = py(p.y), end = [colX - 8, ty - 7];
    const routes = [[[sx + 9, sy], [x1 + 10, sy], end], [[sx + 9, sy], end]];
    for (const dyv of [10, 18].flatMap((v) => [-v, v])) routes.push([[sx + 7, sy + dyv * 0.5], [sx + 18, sy + dyv], [x1 + 10, sy + dyv], end]);
    const best = routes.map((r) => ({ r, h: hits(r, p) })).sort((u, v) => u.h - v.h)[0].r;
    svg.append(el("path", { class: "leader", fill: "none", d: "M" + best.map((q) => q.join(",")).join(" L") }));
    svg.append(el("text", { class: a.note ? "note" : "slab", x: colX, y: ty }, a.text));
  });
  for (const a of d.주석 ?? []) annotate(svg, a, px, py);
  return svg;
}

// 4) 가로 막대: 0에서 시작, 음수는 왼쪽. 막대 두께 ≤24, 끝 둥글기 4. 값 이름표는 숫자만(단위는 축 이름에)
function hbar(d, W, host) {
  const rowH = d.rowH ?? 56, labW = d.labW ?? 280, barH = 20, H = rowH * d.bars.length + 72;
  const svg = svgOf(W, H, d, host);
  const vals = d.bars.map((b) => b.value);
  const lo = Math.min(0, ...vals, d.min ?? 0), hi = Math.max(0, ...vals, d.max ?? 0);
  const x0 = labW + 24, x1 = W - 96;
  const px = (v) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  const yEnd = 16 + rowH * d.bars.length;
  for (const [i, b] of d.bars.entries()) {
    const y = 16 + i * rowH, cy = y + rowH / 2;
    const xa = Math.min(px(0), px(b.value)), w = Math.max(Math.abs(px(b.value) - px(0)), 4);
    svg.append(axisLab({ class: b.강조 ? "alab cat cat-hi" : "alab cat", x: labW, y: cy + 7, "text-anchor": "end" }, b.key));
    svg.append(el("rect", { class: b.강조 ? "b-worse" : b.색 === "evid" ? "b-evid" : "b-neutral", x: xa, y: cy - barH / 2, width: w, height: barH, rx: 4, "data-x": b.key, "data-y": b.value }));
    svg.append(el("text", { class: "vlab", x: b.value >= 0 ? px(b.value) + 12 : px(b.value) - 12, y: cy + 7, "text-anchor": b.value >= 0 ? "start" : "end" }, fmt(b.value, d.자릿수 ?? 1, true)));
  }
  svg.append(el("line", { class: "base", x1: px(0), y1: 8, x2: px(0), y2: yEnd }));
  svg.append(tick({ x: px(0), y: yEnd + 28, "text-anchor": "middle" }, "0"));
  if (d.x이름) svg.append(axisLab({ x: x1 + 96, y: yEnd + 28, "text-anchor": "end" }, d.x이름));
  for (const a of d.주석 ?? []) {
    const b = d.bars[a.bar - 1], cy = 16 + (a.bar - 1) * rowH + rowH / 2;
    const xv = px(b.value) + 72;
    svg.append(el("line", { class: "leader", x1: xv, y1: cy, x2: xv + 24, y2: cy }));
    svg.append(el("text", { class: "note", x: xv + 32, y: cy + 7 }, a.text));
  }
  return svg;
}

// 5) 시작 시점 차트: 직업군마다 시작 연도(점 = 기준 시나리오)와 빠름–신중 범위(구간선)를 연도 축에, 시작 순으로.
//    오른쪽 열에 기준 시나리오 2036년 대체 압력(%)을 숫자로 둔다(단위는 열 이름에 한 번)
function starts(d, W, host) {
  const c = d.시작, labW = 236, H = d.H ?? 424, yTop = 40, rowH = (H - 88 - yTop) / c.rows.length;
  const svg = svgOf(W, H, d, host);
  const [lo, hi] = c.x범위, x0 = labW + 24, x1 = W - 120, yBase = yTop + rowH * c.rows.length;
  const px = (v) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  const g = gridGroup(svg);
  for (let y = lo; y <= hi; y++) g.append(el("line", { x1: px(y), y1: yTop, x2: px(y), y2: yBase }));
  for (let y = lo; y <= hi; y += c.x간격) svg.append(axisLab({ x: px(y), y: yBase + 34, "text-anchor": "middle" }, y));
  svg.append(gridWrap(g));
  svg.append(el("line", { class: "base", x1: x0, y1: yBase, x2: x1, y2: yBase }));
  svg.append(axisLab({ x: W, y: yTop - 16, "text-anchor": "end" }, c.열이름));
  for (const [i, r] of c.rows.entries()) {
    const cy = yTop + i * rowH + rowH / 2;
    svg.append(axisLab({ class: r.강조 ? "alab cat cat-hi" : "alab cat", x: labW, y: cy + 7, "text-anchor": "end" }, r.key));
    svg.append(el("text", { class: "vlab", x: W, y: cy + 7, "text-anchor": "end" }, fmt(r.pct2036, 1)));
    if (!r.기준) { svg.append(axisLab({ x: x0, y: cy + 7 }, c.미도달)); continue; }
    const a = r.빠름 ?? r.기준, b = r.신중 ?? hi;
    // 시나리오 범위는 구간선(배경 대비 3:1 이상 회색, 둥근 끝)으로, 점은 그 위에 바탕색 고리를 두르고 얹는다
    svg.append(el("line", { class: "range", x1: px(a), y1: cy, x2: Math.max(px(b), px(a) + 4), y2: cy, "data-x": `${a}–${r.신중 ?? "2036 이후"}`, "data-y": r.key }));
    svg.append(el("circle", { class: r.강조 ? "b-worse" : "b-evid", cx: px(r.기준), cy, r: 8, "data-x": r.기준, "data-y": r.key }));
    if (c.주석?.row === r.key) {
      const xs = px(b) + 12;
      svg.append(el("line", { class: "leader", x1: xs, y1: cy, x2: xs + 20, y2: cy }));
      svg.append(el("text", { class: "note", x: xs + 28, y: cy + 7 }, c.주석.text));
    }
  }
  svg.append(axisLab({ x: x1, y: yBase + 68, "text-anchor": "end" }, c.x이름));
  return svg;
}

// 6) 능력 경로 부채꼴: 로그 세로축, 시나리오 선 3개 + 직급 문턱 가로 점선 + 외삽 띠
function capfan(d, W, host) {
  // 세로축 이름은 차트 제목('사람 기준 시간·로그 눈금')이 맡고, 가로축 이름은 눈금 줄 오른쪽에 둔다(플롯 높이 확보)
  const H = d.H ?? 560, x0 = 104, x1 = W - 296, yTop = 16, yBase = H - 44;
  const svg = svgOf(W, H, d, host);
  const [lo, hi] = d.x범위;
  const ymin = Math.log10(d.y범위[0]), ymax = Math.log10(d.y범위[1]);
  const px = (v) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  const py = (v) => yBase - ((Math.log10(v) - ymin) / (ymax - ymin)) * (yBase - yTop);
  if (d.외삽) {
    svg.append(el("rect", { class: "band", x: x0, y: yTop, width: x1 - x0, height: py(d.외삽.v) - yTop }));
    svg.append(el("text", { class: "band-lab", x: x0 + 16, y: yTop + 32 }, d.외삽.label));
  }
  const g = gridGroup(svg);
  for (const t of d.y눈금) {
    // 직급 문턱 점선과 8px 안에 놓이는 격자선은 그리지 않는다(눈금 글자는 둔다)
    if (!d.문턱.some((q) => Math.abs(py(q.v) - py(t.v)) <= 8)) g.append(el("line", { x1: x0, y1: py(t.v), x2: x1, y2: py(t.v) }));
    svg.append(tick({ x: x0 - 14, y: py(t.v) + 7, "text-anchor": "end" }, t.label));
  }
  svg.append(gridWrap(g));
  svg.append(el("line", { class: "base", x1: x0, y1: yBase, x2: x1, y2: yBase }));
  for (let y = lo; y <= hi; y += d.x간격 ?? 2) svg.append(axisLab({ x: px(y), y: yBase + 34, "text-anchor": "middle" }, y));
  // 문턱 이름표: 선 오른쪽 끝에, 위아래 간격이 28보다 좁으면 아래로 밀고 짧은 꺾은 선으로 잇는다
  let prevY = -Infinity;
  for (const t of [...d.문턱].sort((a, b) => b.v - a.v)) {
    const y = py(t.v), ly = Math.max(y + 7, prevY + 28);
    prevY = ly;
    svg.append(el("line", { class: "gate", x1: x0, y1: y, x2: x1, y2: y, "data-y": t.v }));
    if (ly - 7 - y > 2) svg.append(el("path", { class: "leader", fill: "none", d: `M${x1},${y} L${x1 + 6},${y} L${x1 + 10},${ly - 7}` }));
    svg.append(el("text", { class: "gate-lab", x: x1 + 16, y: ly }, t.label));
  }
  let clipped = 0;
  for (const s of d.series) {
    // 세로 상한을 넘는 구간은 그리지 않는다. 선은 상한과 만나는 자리(로그 보간)에서 멈추고 위 방향 삼각 표식을 단다
    const top = d.y범위[1], k = s.points.findIndex((p) => p.y > top);
    const pts = k < 0 ? s.points : s.points.slice(0, k);
    if (k > 0) {
      const a = s.points[k - 1], b = s.points[k], f = (Math.log10(top) - Math.log10(a.y)) / (Math.log10(b.y) - Math.log10(a.y));
      pts.push({ x: a.x + f * (b.x - a.x), y: top });
      const cx = px(pts.at(-1).x);
      svg.append(el("path", { class: `${SERIES[s.색][1]} clip`, d: `M${cx - 7},${yTop - 4} L${cx + 7},${yTop - 4} L${cx},${yTop - 16} Z`, "data-x": b.x, "data-y": b.y }));
      clipped += s.points.length - k;
    }
    svg.append(el("polyline", { class: SERIES[s.색][0], "data-series": s.key, points: pts.map((p) => `${px(p.x)},${py(p.y)}`).join(" ") }));
    const last = pts.at(-1);
    svg.append(el("text", { class: "slab", x: px(last.x) + (s.keyDx ?? -8), y: py(last.y) + (s.keyDy ?? -14), "text-anchor": s.keyAnchor ?? "end" }, s.key));
  }
  // 헤드라인의 근거: 시나리오별로 '한 달짜리 일' 문턱을 넘는 점과 그 연도(한 줄 주석)
  const c = d.문턱교차;
  if (c) {
    for (const p of c.points) {
      svg.append(el("circle", { class: SERIES[p.색][1], cx: px(p.x), cy: py(c.v), r: 7, "data-x": p.x, "data-y": c.v }));
      if (p.label) svg.append(el("text", { class: "vlab", x: px(p.x) + (p.dx ?? 0), y: py(c.v) + (p.dy ?? -16), "text-anchor": p.anchor ?? "middle" }, `${p.label.toFixed(1)}${d.라벨?.[0] ? ` ${d.라벨[0]}` : ""}`));
    }
    if (c.주석) svg.append(el("text", { class: "note", x: px(c.주석.x), y: py(c.주석.y), "text-anchor": c.주석.anchor ?? "start" }, c.주석.text));
  }
  if (clipped && d.상한표시) svg.append(el("text", { class: "edge-lab", x: x1 + 16, y: yBase - 8 }, d.상한표시));
  if (d.x이름) svg.append(axisLab({ x: x1 + 16, y: yBase + 34 }, d.x이름));
  return svg;
}

// 7) 직급 표: 시나리오별 능력 문턱 · 대체 본격화 (글자는 textContent로만 넣는다)
function gates(d) {
  const t = html("table", "plan gates");
  const yr = (v) => (v > 2036.99 ? `${Math.floor(v)}*` : String(Math.floor(v)));
  const hr = html("tr");
  for (const h of ["직급", "맡는 업무 크기", "빠름", "기준", "신중"]) {
    // 연도는 모두 시나리오 추정값이다. '추정' 라벨을 연도 열 머리(첫 줄 연도에서 64px 안)에 글자로 둔다
    hr.append(html("th", "", ["빠름", "기준", "신중"].includes(h) && d.라벨?.[0] ? `${h} (${d.라벨[0]})` : h));
  }
  const head = html("thead");
  head.append(hr);
  const tb = html("tbody");
  for (const r of d.rows) {
    const tr = html("tr");
    tr.append(html("td", "", r.직급), html("td", "", r.업무단위));
    for (const n of ["빠름", "기준", "신중"]) {
      const td = html("td", "yr");
      td.append(html("b", "", yr(r[n].본격화)), html("span", "", `AI 가능 ${yr(r[n].문턱)}`));
      tr.append(td);
    }
    tb.append(tr);
  }
  t.append(head, tb);
  return t;
}

// 8) 직업군별 대체 시작: 포스터 줄 목록(taste-skill 「One item per poster line」)
function poster(d) {
  // 라벨 읽는 법(chart-data poster.라벨)은 안내판 위 한 줄, 추정 라벨은 줄마다 연도 바로 옆에
  const out = document.createDocumentFragment();
  const [meas, est] = d.라벨 ?? [];
  if (est) {
    const key = html("div", "poster-key", `${meas} = ‘이미 감소’와 각 줄의 실측 수치 · ${est} = 연도`);
    key.style.marginBottom = "var(--g16)";
    out.append(key);
  }
  const wrap = html("div", "poster");
  for (const r of d.rows) {
    const it = html("div", "it");
    const f = html("span", "f");
    f.append(html("span", "s", `${r.range} · ${r.signal}`));
    // 추정 연도는 알약 안에 '추정' 라벨을 함께 쓴다(실측 줄의 '이미 감소'와 구별)
    f.append(html("span", "eta", r.status !== "arrived" && est ? `${r.eta} ${est.split("(")[0]}` : r.eta));
    it.append(html("span", "w", r.dest), f);
    wrap.append(it);
  }
  out.append(wrap);
  return out;
}

const KINDS = { logline, yearline, scatter, hbar, capfan, starts };
const BLOCKS = { gates, poster };

for (const host of document.querySelectorAll("[data-block]")) {
  const d = DATA[host.dataset.block];
  if (d) host.prepend(BLOCKS[host.dataset.kind](d));
}

for (const host of document.querySelectorAll("[data-chart]")) {
  const d = DATA[host.dataset.chart];
  if (!d) { host.append(html("p", "chart-src", `데이터 없음: ${host.dataset.chart}`)); continue; }
  const dd = host.dataset.h ? { ...d, H: Number(host.dataset.h) } : d; // data-h: 칸에 맞춘 세로 길이
  const svg = KINDS[host.dataset.kind](dd, Number(host.dataset.w || 784), host);
  // 제목 → 부제 → svg → 출처 순서(제목이 svg 위 같은 자리에 온다)
  const before = host.querySelector(":scope > .chart-head") ?? host.querySelector(":scope > .chart-sub") ?? host.querySelector(":scope > .chart-title");
  if (before) before.after(svg); else host.prepend(svg);
}

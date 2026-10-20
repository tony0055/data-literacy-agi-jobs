// 덱 차트: 모든 값·이름표는 index.html 안 chart-data 블록(= ../chart-data.json 주입본)에서만 읽는다.
// 공통 규칙(제품 디자인 시스템 · 덱 표준)
//  - 그림 크기는 장 CSS 픽셀 그대로(data-w × data-h, viewBox도 같은 값). 그래서 글자는 시스템 글자 단계 그대로 그려진다:
//    눈금·축 이름 type-caption(12) · 값·계열 이름 type-label-strong(13) · 주석 type-label(13). 색·글자는 deck.css가 입힌다.
//  - 계열 색은 같은 대상이면 덱 어디서나 같다(design-standard/color.md 「차트 계열 색」 표, build.ts가 chart-data와 대조):
//    chart-data의 색 = main → s-main 파랑(기준 · AGI · 사무직 · 핵심), alt → s-alt 갈색(빠름 · 모든 직업 자동화 · 전문직),
//    ctx → s-ctx 중립(신중 · Metaculus · KDI · 판매직 · 맥락). 색만으로 계열을 가리지 않게 선 끝·막대 옆에 이름을 직접 단다.
//    선 모양도 함께 가른다(CN-122): chart-data 계열의 dash: true = 파선(맥락 계열), dash: "dot" = 점선(26장 KDI 교차확인). 나머지는 실선.
//    점 모양도 가른다: 갈색(alt) 계열 점은 네모(rect.dot.dot--sq), 파랑 · 중립은 원 — 파랑 · 갈색은 흑백에서 명도가 같다(2회차 C-02).
//  - 구간(7장 「2024년 이후」 · 24장 「16시간 위」)은 색 면 대신 시작선 하나(.zone) + 이름(.zone-lab)으로 그린다(2회차 S-02 — 카드 없음).
//  - 범위 표기(WR-84): 차트 글은 축 · 이름표 · 표처럼 좁은 자리라 물결표 하나(「2028~2032년」). 문장 속 범위는 정본이 「~부터 ~까지」를 권한다(<desc>도 문장이지만
//    숫자 나열이라 물결표를 둔다). chart-data 글은 build_chart_data.py에서부터 물결표이고, range()는 붙임표가 다시 들어와도 그릴 때 물결표로 바꾸는 안전장치.
//  - <desc>(chart-data의 '설명')는 화면 읽기 프로그램이 읽는 화면 글이라 해요체 문장(WR-06 · 07 · 85, 2회차 W-02 · 3회차 W-16): 여기서 덧붙이는
//    값 목록도 「…예요/이에요.」로 끝맺는다(copula). 표 블록의 aria-label은 표 이름(명사구)이라 문장으로 만들지 않는다.
//  - 범주 이름(hbar · starts의 막대 · 줄 이름)은 열 시작선(x = 0)에 왼쪽 맞춤하고 막대 · 점은 이름 칸(labW) 뒤에서 시작한다 — 차트의 보이는 시작선이
//    장의 12열 선 · 차트 제목과 같다(3회차 SL3-03, CN-121). 축 이름(.axis-name)은 단위 · 기준이 든 글이라 text-2, 눈금 · 연도는 text-3.
//  - 블록 표의 강조(data-main)는 명도로(강조 = text-1, 나머지 = text-2). 파랑은 링크 · 조작부 몫(정본 CO-35, deck.css).
//    블록 표는 칸에 줄바꿈이 섞여 .table--multiline(첫 줄 기준선 맞춤 · text-wrap: pretty, 3회차 SC-03 · T3-04).
//  - 범례 · 주석 앞의 ▲ · ▼ 글자는 그리지 않고 차트 안 표시와 같은 모양(path.clip)으로 그린다(아이콘 자리에 글자 기호를 쓰지 않는다).
//  - svg는 role="img"이고 <title>(차트 제목)·<desc>(chart-data의 '설명')로 읽힌다. 눈금·축 글자는 aria-hidden.
//  - 모션 없음: 그린 그대로 보인다(장 안 빌드 · 차트 단계 모션은 2026. 10. 21. 없앴다 — 정본 MO-01 · 02).
//  - chart-data의 dx·dy·keyDx·keyDy는 옛 1920 캔버스 값이라 2/3(OLD)을 곱해 쓴다.
// 장 마크업: <figure class="chart" data-chart="키" data-kind="종류" data-w="폭" data-h="높이"> 제목·부제(figcaption) → 그림 → 출처
// 종류: logline · yearline · scatter · hbar · starts · capfan. 블록(data-block): gates · poster(시스템 표로 그린다, data-main = 강조 열 · 행)
(() => {
const chartData = JSON.parse(document.getElementById("chart-data").textContent);
const NS = "http://www.w3.org/2000/svg";
const OLD = 2 / 3;
const BASE = 4; // 글자 세로 가운데 보정(12·13px 글자의 x-높이 절반)
const TICK_CH = 7.5; // 캡션 12px 같은 폭 숫자 · 부호 한 자 폭(실측 7.4, 올림)

const el = (name, attrs = {}, text) => {
  const n = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined && v !== null && v !== false) n.setAttribute(k, String(v));
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
// 해요체 끝맺음: 마지막 글자에 받침이 있으면 「이에요」, 없으면 「예요」(숫자는 읽는 소리, % = 퍼센트). 낭독기 문장을 만들 때만 쓴다
const DIGIT_BATCHIM = { 0: true, 1: true, 2: false, 3: true, 4: false, 5: false, 6: true, 7: true, 8: true, 9: false };
const copula = (word) => {
  const c = String(word).trim().replace(/[)\]」’”.]+$/, "").slice(-1);
  const code = c.charCodeAt(0);
  const batchim = code >= 0xac00 && code <= 0xd7a3 ? (code - 0xac00) % 28 !== 0 : /\d/.test(c) ? DIGIT_BATCHIM[c] : false;
  return batchim ? "이에요" : "예요";
};
const SERIES = { main: "s-main", alt: "s-alt", ctx: "s-ctx" };
const seriesOf = (c) => SERIES[c] ?? "s-ctx";
// 선 모양 클래스: 파선(맥락 계열) · 점선(KDI) — deck.css .line.dash · .line.dash--dot
const dashOf = (s) => (s.dash === "dot" ? " dash dash--dot" : s.dash ? " dash" : "");
const range = (t) => String(t).replace(/(\d)\s*–\s*(\d)/g, "$1~$2");
// 범위 밖 표시 삼각형(위 ▲ · 아래 ▼): 차트 안 끝 표시와 같은 모양 · 같은 색(중립)
const triangle = (cx, cy, up, cls = "clip s-ctx") => el("path", { class: cls, "aria-hidden": "true", d: up ? `M${cx - 5},${cy + 4} L${cx + 5},${cy + 4} L${cx},${cy - 5} Z` : `M${cx - 5},${cy - 4} L${cx + 5},${cy - 4} L${cx},${cy + 5} Z` });
const old = (v, fallback = 0) => (v ?? fallback) * OLD;

function svgOf(W, H, d, host) {
  const id = `chart-${host.dataset.chart || host.dataset.block}-${host.closest(".slide")?.dataset.n ?? ""}`;
  const title = host.querySelector(".chart-title")?.textContent.trim() || d.제목 || "";
  const svg = el("svg", { width: W, height: H, viewBox: `0 0 ${W} ${H}`, role: "img", "aria-labelledby": `${id}-t`, "aria-describedby": `${id}-d` });
  svg.append(el("title", { id: `${id}-t` }, title), el("desc", { id: `${id}-d` }, d.설명 ?? ""));
  return svg;
}
// 눈금·축 이름: 화면에는 보이지만 보조기기는 <desc>로 읽는다
const tick = (attrs, text) => el("text", { class: "tick", "aria-hidden": "true", ...attrs }, text);
const axisLab = (attrs, text) => el("text", { class: "alab", "aria-hidden": "true", ...attrs }, text);
// 축 이름(세로 · 가로축 이름, 열 이름, 보조 눈금 이름): 단위 · 기준이 든 읽는 글이라 text-2(deck.css .axis-name)
const axisName = (attrs, text) => el("text", { class: "alab axis-name", "aria-hidden": "true", ...attrs }, text);
const gridGroup = () => el("g", { class: "grid-lines" });
const label = (cls, attrs, text) => el("text", { class: cls, ...attrs }, text);
// 점: 계열 색 클래스(s-main · s-alt · s-ctx)를 받아 갈색(s-alt)이면 같은 넓이의 네모(한 변 = 지름), 나머지는 원
const dot = (sc, cx, cy, r, attrs = {}) => sc === "s-alt"
  ? el("rect", { class: `dot dot--sq ${sc}`, x: cx - r, y: cy - r, width: r * 2, height: r * 2, ...attrs })
  : el("circle", { class: `dot ${sc}`, cx, cy, r, ...attrs });

// 강조 주석: 한 줄 글자 + 대상 점을 가리키는 지시선(to) 또는 두 값 사이 구간선(span)
function annotate(svg, a, px, py) {
  const tx = px(a.x), ty = py(a.y);
  if (a.span) {
    const [sx, y1, y2] = a.span;
    svg.append(el("line", { class: "leader", x1: px(sx), y1: py(y1) - 8, x2: px(sx), y2: py(y2) + 8 }));
    svg.append(el("line", { class: "leader", x1: tx + (a.anchor === "end" ? 6 : -6), y1: ty - BASE, x2: px(sx) - 4, y2: ty - BASE }));
  }
  if (a.to) {
    // 지시선은 실제 데이터 점(to)을 가리키고, 점(반지름 4 + 흰 테두리)을 덮지 않게 점 6 앞에서 멈춘다
    const [px2, py2] = [px(a.to[0]), py(a.to[1])];
    const sx = a.anchor === "end" ? tx - 8 : tx + 8, sy = py2 < ty - BASE ? ty - 14 : ty + 6;
    const len = Math.hypot(px2 - sx, py2 - sy) || 1, k = Math.max(0, len - 6) / len;
    svg.append(el("line", { class: "leader", x1: sx, y1: sy, x2: sx + (px2 - sx) * k, y2: sy + (py2 - sy) * k }));
  }
  svg.append(label("note", { x: tx, y: ty, "text-anchor": a.anchor ?? "start" }, a.text));
}

// 1) 로그 세로축 선: METR 50% 시간지평(분). 가로축은 실제 날짜 간격
function logline(d, W, H) {
  const x0 = 64, x1 = W, yTop = 32, yBase = H - 44;
  const svg = svgOf(W, H, d, this);
  const lo = yearFrac(d.x범위[0]), hi = yearFrac(d.x범위[1]);
  const ymin = Math.log10(d.y범위[0]), ymax = Math.log10(d.y범위[1]);
  const px = (s) => x0 + ((yearFrac(s) - lo) / (hi - lo)) * (x1 - x0);
  const py = (v) => yBase - ((Math.log10(v) - ymin) / (ymax - ymin)) * (yBase - yTop);
  // 구간: 시작 세로선 하나 + 이름(선 오른쪽 위). 색 면을 칠하지 않는다
  for (const z of d.구간 ?? []) {
    const xa = px(z.from);
    svg.append(el("line", { class: "zone", "aria-hidden": "true", x1: xa, y1: yTop, x2: xa, y2: yBase }));
    svg.append(el("text", { class: "zone-lab", x: xa + 8, y: yTop + 16 }, z.label));
  }
  const g = gridGroup();
  for (const t of d.y눈금) {
    g.append(el("line", { x1: x0, y1: py(t.v), x2: x1, y2: py(t.v) }));
    svg.append(tick({ x: x0 - 8, y: py(t.v) + BASE, "text-anchor": "end" }, t.label));
  }
  svg.append(g);
  if (d.y보조) svg.append(axisName({ x: x0 - 8, y: py(d.y보조.v) + BASE + 16, "text-anchor": "end" }, d.y보조.label));
  svg.append(el("line", { class: "base", x1: x0, y1: yBase, x2: x1, y2: yBase }));
  for (let y = Math.ceil(lo); y <= Math.floor(hi); y++) svg.append(axisLab({ x: px(`${y}-01-01`), y: yBase + 20, "text-anchor": "middle" }, y));
  const pts = d.points;
  svg.append(el("polyline", { class: "line s-main", points: pts.map((p) => `${px(p.date)},${py(p.v)}`).join(" ") }));
  for (const p of pts) {
    svg.append(dot("s-main", px(p.date), py(p.v), p.강조 ? 6 : 4, { "data-x": p.date, "data-y": p.v }));
    if (p.label) svg.append(label(p.강조 ? "vlab" : "note", { x: px(p.date) + old(p.dx, 14), y: py(p.v) + old(p.dy, -14), "text-anchor": p.anchor ?? "start" }, p.label));
  }
  svg.append(axisName({ x: 0, y: yTop - 16 }, d.y이름));
  if (d.x이름) svg.append(axisName({ x: x1, y: yBase + 38, "text-anchor": "end" }, d.x이름));
  return svg;
}

// 2) 연도 세로축 선: 가로 = 시점(연도), 세로 = 값. 계열마다 자기 점만 잇는다.
//    s.점 = "labeled"면 이름표가 있는 점에만 점을 찍는다(맥락 계열). s.keyValue면 끝값을 계열 이름과 한 줄로 단다.
function yearline(d, W, H) {
  const x0 = 48, x1 = W - (Number(this.dataset.keyW) || 160), yTop = 40, yBase = H - 44;
  const svg = svgOf(W, H, d, this);
  const lo = d.x범위[0], hi = d.x범위[1];
  const [ylo, yhi] = d.y범위;
  const px = (v) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  const py = (v) => yBase - ((v - ylo) / (yhi - ylo)) * (yBase - yTop);
  const g = gridGroup();
  for (let t = ylo; t <= yhi; t += d.y간격) {
    g.append(el("line", { x1: x0, y1: py(t), x2: x1, y2: py(t) }));
    svg.append(tick({ x: x0 - 8, y: py(t) + BASE, "text-anchor": "end" }, t));
  }
  svg.append(g);
  svg.append(el("line", { class: "base", x1: x0, y1: yBase, x2: x1, y2: yBase }));
  for (let y = Math.ceil(lo); y <= Math.floor(hi); y += d.x간격 ?? 1) svg.append(axisLab({ x: px(y), y: yBase + 20, "text-anchor": "middle" }, y));
  for (const s of d.series) {
    const sc = seriesOf(s.색);
    svg.append(el("polyline", { class: `line ${sc}${dashOf(s)}`, "data-series": s.key, points: s.points.map((p) => `${px(p.x)},${py(p.y)}`).join(" ") }));
    const last = s.points.at(-1);
    for (const p of s.points) {
      const labeled = (p.label !== false && p.label !== undefined) || p === last;
      if (s.점 === "labeled" && !labeled) continue;
      svg.append(dot(sc, px(p.x), py(p.y), 4, { "data-x": p.x, "data-y": p.y }));
    }
    for (const p of s.points) {
      if (p.label === false || (s.keyValue && p === last)) continue;
      svg.append(label("vlab", { x: px(p.x) + old(p.dx), y: py(p.y) + old(p.dy, -16), "text-anchor": p.anchor ?? "middle" }, p.label ?? p.y));
    }
    const keyText = s.keyValue && last.label !== false ? `${s.key} ${last.label ?? last.y}` : s.key;
    svg.append(label(`slab ${sc}`, { x: px(last.x) + old(s.keyDx, 16), y: py(last.y) + old(s.keyDy, 7), "text-anchor": s.keyAnchor ?? "start" }, keyText));
  }
  for (const a of d.주석 ?? []) annotate(svg, a, px, py);
  svg.append(axisName({ x: 0, y: yTop - 20 }, d.y이름));
  svg.append(axisName({ x: x1, y: yBase + 38, "text-anchor": "end" }, d.x이름));
  return svg;
}

// 3) 산점도: 직업별 노출도(가로) × 고용 변화율(세로). 세로 범위를 넘는 점은 끝에 붙이지 않고 삼각형과 개수 주석으로 따로 그린다.
//    강조점 이름표는 오른쪽 여백의 한 열에 두고 지시선으로 잇는다(이름표끼리·점과 겹치지 않게).
//    세로 눈금 글자(오른쪽 맞춤)의 가장 긴 것이 x 0에서 시작하게 x0를 글자 수로 정한다 — 차트의 보이는 시작선 = 열 시작선(3회차 SL3-03:
//    x0 48이면 눈금 글자가 18에서 시작했다). TICK_CH = 캡션 12px 같은 폭 숫자 한 자 폭(Pretendard 실측 「−50」 22.27 ÷ 3 ≈ 7.4)
function scatter(d, W, H) {
  const [ylo, yhi] = d.y범위;
  const tickText = [];
  for (let t = ylo; t <= yhi; t += d.y간격) tickText.push(fmt(t, 0, true));
  const x0 = 8 + Math.ceil(Math.max(...tickText.map((t) => t.length)) * TICK_CH), x1 = W - 160, yTop = 12, yBase = H - 28;
  const svg = svgOf(W, H, d, this);
  const px = (v) => x0 + v * (x1 - x0);
  const py = (v) => yBase - ((v - ylo) / (yhi - ylo)) * (yBase - yTop);
  const rOf = (p) => Math.max(3, Math.min(9, Math.sqrt(p.emp2022 / 20000) * OLD));
  const g = gridGroup();
  for (let t = ylo; t <= yhi; t += d.y간격) {
    g.append(el("line", { x1: x0, y1: py(t), x2: x1, y2: py(t), class: t === 0 ? "zero" : undefined }));
    svg.append(tick({ x: x0 - 8, y: py(t) + BASE, "text-anchor": "end" }, fmt(t, 0, true)));
  }
  svg.append(g);
  for (const t of [0, 0.25, 0.5, 0.75, 1]) svg.append(axisLab({ x: px(t), y: yBase + 20, "text-anchor": "middle" }, t.toFixed(2)));
  svg.append(axisName({ x: x1 + 24, y: yBase + 20 }, range(d.x이름)));
  const hl = new Set(d.강조 ?? []);
  const out = { up: 0, down: 0 };
  const tri = { up: [], down: [] };
  for (const p of d.points) if (p.y > yhi || p.y < ylo) tri[p.y > yhi ? "up" : "down"].push(p);
  const triX = new Map();
  for (const side of ["up", "down"]) {
    const xs = tri[side].map((p) => ({ p, x: px(p.x) })).sort((u, v) => u.x - v.x);
    const groups = [];
    for (const t of xs) { const gl = groups.at(-1); if (gl && t.x - gl.at(-1).x < 12) gl.push(t); else groups.push([t]); }
    for (const gl of groups) { const mid = (gl[0].x + gl.at(-1).x) / 2; gl.forEach((t, i) => triX.set(t.p, mid + (i - (gl.length - 1) / 2) * 12)); }
  }
  const mark = (p, cls) => {
    if (p.y > yhi || p.y < ylo) {
      const up = p.y > yhi, y = up ? yTop : yBase, k = up ? -1 : 1, cx = triX.get(p);
      out[up ? "up" : "down"]++;
      svg.append(el("path", { class: `clip ${cls.includes("s-main") ? "s-main" : "s-ctx"}`, d: `M${cx - 5},${y + k * 3} L${cx + 5},${y + k * 3} L${cx},${y + k * 12} Z`, "data-x": p.x, "data-y": p.y }));
      return;
    }
    svg.append(el("circle", { class: cls, cx: px(p.x), cy: py(p.y), r: rOf(p), "data-x": p.x, "data-y": p.y }));
  };
  for (const p of d.points) if (!hl.has(p.soc)) mark(p, "dot-bg");
  for (const p of d.points.filter((q) => hl.has(q.soc))) mark(p, "dot s-main");
  const glyph = /^[▲▼]\s*/;
  if (out.up) {
    svg.append(triangle(x1 + 21, yTop + 4, true));
    (d.범위밖주석 ?? [`세로 범위를 넘는 직업 ${out.up}개는`, "위 끝에 따로 표시"]).forEach((line, i) => svg.append(label("note", { x: x1 + 32, y: yTop + 8 + i * 20 }, line.replace(glyph, ""))));
  }
  if (out.down) {
    svg.append(triangle(x1 + 21, yBase - 12, false));
    svg.append(label("note", { x: x1 + 32, y: yBase - 8 }, `아래로 넘는 직업 ${out.down}개`));
  }
  const ann = (d.주석점 ?? []).map((a) => ({ a, p: d.points.find((q) => q.soc === a.soc) })).filter((x) => x.p).sort((u, v) => py(u.p.y) - py(v.p.y));
  const gap = 20, colX = x1 + 24;
  let prev = -Infinity;
  const ys = ann.map(({ p }) => (prev = Math.max(py(p.y) + BASE, prev + gap)));
  const shift = Math.max(0, (ys.at(-1) ?? 0) - (yBase - 8));
  const dots = d.points.filter((q) => q.y <= yhi && q.y >= ylo).map((q) => ({ q, x: px(q.x), y: py(q.y), r: rOf(q) + 4 }));
  const segD = (P, A, B) => { const dx = B[0] - A[0], dy = B[1] - A[1], L = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((P.x - A[0]) * dx + (P.y - A[1]) * dy) / L)); return Math.hypot(P.x - A[0] - t * dx, P.y - A[1] - t * dy); };
  const hits = (pts, self) => dots.filter((o) => o.q !== self && pts.slice(1).some((B, k) => segD(o, pts[k], B) < o.r)).length;
  ann.forEach(({ a, p }, i) => {
    const ty = ys[i] - shift, sx = px(p.x), sy = py(p.y), end = [colX - 6, ty - BASE];
    const routes = [[[sx + 6, sy], [x1 + 8, sy], end], [[sx + 6, sy], end]];
    for (const dyv of [8, 14].flatMap((v) => [-v, v])) routes.push([[sx + 5, sy + dyv * 0.5], [sx + 12, sy + dyv], [x1 + 8, sy + dyv], end]);
    const best = routes.map((r) => ({ r, h: hits(r, p) })).sort((u, v) => u.h - v.h)[0].r;
    svg.append(el("path", { class: "leader", d: "M" + best.map((q) => q.join(",")).join(" L") }));
    svg.append(label(a.note ? "vlab" : "note", { x: colX, y: ty }, a.text));
  });
  for (const a of d.주석 ?? []) annotate(svg, a, px, py);
  return svg;
}

// 4) 가로 막대: 0에서 시작, 음수는 왼쪽. 막대 두께 12, 값 이름표는 숫자(+ 단위)
//    d.bars = [{ key, value, 강조 }] 그대로 쓰거나, 장에서 data-path로 { 이름: 값 } 묶음을 고른다:
//      data-path="배가주기_일" data-labels='{"2019이후":"2019년 이후 전체"}' data-unit="일" data-digits="0" data-main="2024이후" data-signed
function hbar(d, W) {
  const o = this.dataset;
  let bars = d.bars;
  if (!bars) {
    const names = o.labels ? JSON.parse(o.labels) : {};
    bars = Object.entries(d).filter(([, v]) => typeof v === "number").map(([k, v]) => ({ key: names[k] ?? k, value: v, 강조: o.main === k }));
  }
  const digits = o.digits !== undefined ? Number(o.digits) : (d.자릿수 ?? 1);
  const signed = o.signed !== undefined ? true : !o.path;
  const unit = o.unit ?? "";
  const rowH = Number(o.rowH) || 36, labW = Number(o.labelW) || 160, barH = 12, top = 8;
  const H = rowH * bars.length + top + 32;
  const svg = svgOf(W, H, d, this);
  const vals = bars.map((b) => b.value);
  const lo = Math.min(0, ...vals, d.min ?? 0), hi = Math.max(0, ...vals, d.max ?? 0);
  const x0 = labW + 16, x1 = W - 72;
  const px = (v) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  const yEnd = top + rowH * bars.length;
  svg.append(el("line", { class: "base", x1: px(0), y1: top, x2: px(0), y2: yEnd }));
  for (const [i, b] of bars.entries()) {
    const cy = top + i * rowH + rowH / 2;
    const xa = Math.min(px(0), px(b.value)), w = Math.max(Math.abs(px(b.value) - px(0)), 2);
    const sc = b.색 ? seriesOf(b.색) : b.강조 ? "s-main" : (bars.some((x) => x.강조) ? "s-ctx" : "s-main");
    svg.append(el("text", { class: b.강조 ? "cat cat-hi" : "cat", "aria-hidden": "true", x: 0, y: cy + BASE }, range(b.key)));
    svg.append(el("rect", { class: `bar ${sc}${b.value < 0 ? " neg" : ""}`, x: xa, y: cy - barH / 2, width: w, height: barH, "data-x": b.key, "data-y": b.value }));
    svg.append(label("vlab", { x: b.value >= 0 ? px(b.value) + 8 : px(b.value) - 8, y: cy + BASE, "text-anchor": b.value >= 0 ? "start" : "end" }, `${fmt(b.value, digits, signed)}${unit}`));
  }
  svg.append(tick({ x: px(0), y: yEnd + 18, "text-anchor": "middle" }, "0"));
  if (o.path) {
    const vals = bars.map((b) => `${b.key} ${fmt(b.value, digits, signed)}${unit}`);
    svg.querySelector("desc").textContent = `${d.설명} 막대 값은 ${vals.join(", ")}${copula(vals.at(-1))}.`;
  }
  if (d.x이름 && !o.path) svg.append(axisName({ x: W, y: yEnd + 18, "text-anchor": "end" }, d.x이름));
  for (const a of o.path ? [] : d.주석 ?? []) {
    const b = bars[a.bar - 1], cy = top + (a.bar - 1) * rowH + rowH / 2;
    const xv = px(b.value) + 48;
    svg.append(el("line", { class: "leader", x1: xv, y1: cy, x2: xv + 16, y2: cy }));
    svg.append(label("note", { x: xv + 22, y: cy + BASE }, a.text));
  }
  return svg;
}

// 5) 시작 시점: 직업군마다 시작 연도(점 = 기준 시나리오)와 빠름–신중 범위(구간선)를 연도 축에, 시작 순으로.
//    오른쪽 열에 기준 시나리오 2036년 대체 압력(%)을 숫자로 둔다(단위는 열 이름에 한 번).
//    점은 모두 기준 시나리오라 한 색(s-main 파랑, 계열 색 표). 강조할 직업군은 굵은 이름표(cat-hi)로만 가린다
function starts(d, W, H) {
  // 행 높이는 정수(data-row-h, 없으면 남는 높이를 행 수로 나눈 값을 내림) — 소수 행 높이는 선 · 글자를 반 픽셀에 놓는다(2회차 SL-08)
  const c = d.시작, labW = 168, yTop = 28, rowH = Number(this.dataset.rowH) || Math.floor((H - 64 - yTop) / c.rows.length);
  const svg = svgOf(W, H, d, this);
  const [lo, hi] = c.x범위, x0 = labW + 16, x1 = W - 80, yBase = yTop + rowH * c.rows.length;
  const px = (v) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  const g = gridGroup();
  for (let y = lo; y <= hi; y++) g.append(el("line", { x1: px(y), y1: yTop, x2: px(y), y2: yBase }));
  svg.append(g);
  for (let y = lo; y <= hi; y += c.x간격) svg.append(axisLab({ x: px(y), y: yBase + 20, "text-anchor": "middle" }, y));
  svg.append(el("line", { class: "base", x1: x0, y1: yBase, x2: x1, y2: yBase }));
  svg.append(axisName({ x: W, y: yTop - 12, "text-anchor": "end" }, c.열이름));
  for (const [i, r] of c.rows.entries()) {
    const cy = yTop + i * rowH + rowH / 2;
    svg.append(el("text", { class: r.강조 ? "cat cat-hi" : "cat", "aria-hidden": "true", x: 0, y: cy + BASE }, r.key));
    svg.append(label("vlab", { x: W, y: cy + BASE, "text-anchor": "end" }, fmt(r.pct2036, 1)));
    // 「미도달」은 읽어야 하는 단서라 주석(.note, 라벨 13 · text-2 — 2회차 T2-09). 세로 격자선 위에 놓여 바탕색 외곽으로 선을 끊는다
    if (!r.기준) { svg.append(label("note", { x: x0, y: cy + BASE }, c.미도달)); continue; }
    const a = r.빠름 ?? r.기준, b = r.신중 ?? hi;
    svg.append(el("line", { class: "range", x1: px(a), y1: cy, x2: Math.max(px(b), px(a) + 2), y2: cy, "data-x": `${a}–${r.신중 ?? "2036 이후"}`, "data-y": r.key }));
    svg.append(dot("s-main", px(r.기준), cy, 6, { "data-x": r.기준, "data-y": r.key }));
    if (c.주석?.row === r.key) {
      const xs = px(b) + 8;
      svg.append(el("line", { class: "leader", x1: xs, y1: cy, x2: xs + 12, y2: cy }));
      svg.append(label("note", { x: xs + 18, y: cy + BASE }, c.주석.text));
    }
  }
  svg.append(axisName({ x: x1, y: yBase + 40, "text-anchor": "end" }, c.x이름));
  return svg;
}

// 6) 능력 경로 부채꼴: 로그 세로축, 시나리오 선 3개 + 직급 문턱 가로 점선 + 외삽 시작선(실선 하나 + 이름)
function capfan(d, W, H) {
  const x0 = 56, x1 = W - 200, yTop = 12, yBase = H - 28;
  const svg = svgOf(W, H, d, this);
  const [lo, hi] = d.x범위;
  const ymin = Math.log10(d.y범위[0]), ymax = Math.log10(d.y범위[1]);
  const px = (v) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  const py = (v) => yBase - ((Math.log10(v) - ymin) / (ymax - ymin)) * (yBase - yTop);
  const g = gridGroup();
  for (const t of d.y눈금) {
    if (!d.문턱.some((q) => Math.abs(py(q.v) - py(t.v)) <= 6)) g.append(el("line", { x1: x0, y1: py(t.v), x2: x1, y2: py(t.v) }));
    svg.append(tick({ x: x0 - 8, y: py(t.v) + BASE, "text-anchor": "end" }, t.label));
  }
  svg.append(g);
  svg.append(el("line", { class: "base", x1: x0, y1: yBase, x2: x1, y2: yBase }));
  for (let y = lo; y <= hi; y += d.x간격 ?? 2) svg.append(axisLab({ x: px(y), y: yBase + 20, "text-anchor": "middle" }, y));
  // 가로선 이름은 오른쪽 열에 한 줄씩(겹치면 20씩 내리고 꺾은 지시선). 직급 문턱 = 점선(.gate) · 이름 .note,
  // 외삽 시작(16시간) = 실선 하나(.zone) · 이름 .zone-lab — 위쪽 구간을 색 면으로 칠하지 않는다(2회차 S-02). 플롯 안에 이름을 두면
  // 바로 위 한 주(40시간) 점선과 5px 남짓이라 붙어 보였다 — 문턱 이름과 같은 열에 둔다
  const lines = [...d.문턱.map((t) => ({ ...t, cls: "gate", lab: "note" })), ...(d.외삽 ? [{ ...d.외삽, cls: "zone", lab: "zone-lab" }] : [])];
  let prevY = -Infinity;
  for (const t of lines.sort((a, b) => b.v - a.v)) {
    const y = py(t.v), ly = Math.max(y + BASE, prevY + 20);
    prevY = ly;
    svg.append(el("line", { class: t.cls, ...(t.cls === "zone" ? { "aria-hidden": "true" } : {}), x1: x0, y1: y, x2: x1, y2: y, "data-y": t.v }));
    if (ly - BASE - y > 2) svg.append(el("path", { class: "leader", d: `M${x1},${y} L${x1 + 4},${y} L${x1 + 7},${ly - BASE}` }));
    svg.append(el("text", { class: t.lab, x: x1 + 12, y: ly }, t.label));
  }
  let clipped = 0;
  for (const s of d.series) {
    const sc = seriesOf(s.색);
    const top = d.y범위[1], k = s.points.findIndex((p) => p.y > top);
    const pts = k < 0 ? s.points : s.points.slice(0, k);
    if (k > 0) {
      const a = s.points[k - 1], b = s.points[k], f = (Math.log10(top) - Math.log10(a.y)) / (Math.log10(b.y) - Math.log10(a.y));
      pts.push({ x: a.x + f * (b.x - a.x), y: top });
      const cx = px(pts.at(-1).x);
      svg.append(el("path", { class: `clip ${sc}`, d: `M${cx - 5},${yTop - 3} L${cx + 5},${yTop - 3} L${cx},${yTop - 12} Z`, "data-x": b.x, "data-y": b.y }));
      clipped += s.points.length - k;
    }
    svg.append(el("polyline", { class: `line ${sc}${dashOf(s)}`, "data-series": s.key, points: pts.map((p) => `${px(p.x)},${py(p.y)}`).join(" ") }));
    const last = pts.at(-1);
    // 선 끝 이름표는 격자선 위에 놓인다 — 바탕색 외곽(.halo)으로 선을 글자 둘레에서 끊는다
    svg.append(label(`slab halo ${sc}`, { x: px(last.x) + old(s.keyDx, -8), y: py(last.y) + old(s.keyDy, -14), "text-anchor": s.keyAnchor ?? "end" }, s.key));
  }
  const c = d.문턱교차;
  if (c) {
    for (const p of c.points) {
      svg.append(dot(seriesOf(p.색), px(p.x), py(c.v), 5, { "data-x": p.x, "data-y": c.v }));
      if (p.label) svg.append(label("vlab", { x: px(p.x) + old(p.dx), y: py(c.v) + old(p.dy, -16), "text-anchor": p.anchor ?? "middle" }, `${p.label.toFixed(1)}년${d.라벨?.[0] ? ` ${d.라벨[0]}` : ""}`));
    }
    if (c.주석) svg.append(label("note", { x: px(c.주석.x), y: py(c.주석.y), "text-anchor": c.주석.anchor ?? "start" }, c.주석.text));
  }
  if (clipped && d.상한표시) {
    svg.append(triangle(x1 + 17, yBase - 12, true));
    svg.append(label("note", { x: x1 + 28, y: yBase - 8 }, String(d.상한표시).replace(/^[▲▼]\s*/, "")));
  }
  if (d.x이름) svg.append(axisName({ x: x1 + 12, y: yBase + 20 }, d.x이름));
  return svg;
}

// 7) 직급 표: 시나리오별 능력 문턱 · 대체 본격화(시스템 표 그대로 + 덱 줄바꿈 변형, 글자는 textContent로만)
//    장 마크업 data-main="기준"이면 그 시나리오 열의 머리 칸 · 행 칸에 data-main을 단다(deck.css가 명도로 강조 — 그 열 text-1, 나머지 열 text-2)
//    숫자 칸 글자는 표 글자 단계 그대로(type-label, 본격화 연도만 굵게). 2036년을 넘는 연도의 *는 폭 0으로 매단다(.fn, 자릿수 정렬 유지)
//    「맡는 업무 크기」 칸은 이 발표의 가정 값이라 text-2(.c-text-2) — 시스템 .table__cell--muted(text-3)는 값 칸에 쓰지 않는다(3회차 C3-04)
function gates(d) {
  const year = (v) => {
    const n = html("span", "t-label-strong num", String(Math.floor(v)));
    if (v > 2036.99) n.append(html("span", "fn", "*"));
    return n;
  };
  const main = this.dataset.main;
  const t = html("div", "table table--wrap table--multiline gates-table");
  t.setAttribute("role", "table");
  t.setAttribute("aria-label", d.제목 ?? "");
  const head = html("div", "table__head");
  head.setAttribute("role", "row");
  for (const h of ["직급", "맡는 업무 크기", "빠름", "기준", "신중"]) {
    const c = html("span", ["빠름", "기준", "신중"].includes(h) ? "table__cell--numeric" : "", ["빠름", "기준", "신중"].includes(h) && d.라벨?.[0] ? `${h} (${d.라벨[0]})` : h);
    c.setAttribute("role", "columnheader");
    if (h === main) c.dataset.main = "";
    head.append(c);
  }
  t.append(head);
  for (const r of d.rows) {
    const row = html("div", "table__row");
    row.setAttribute("role", "row");
    const name = html("span", "table__cell table__cell--name", r.직급);
    const unit = html("span", "table__cell c-text-2", r.업무단위);
    row.append(name, unit);
    for (const n of ["빠름", "기준", "신중"]) {
      const cell = html("span", "table__cell table__cell--numeric");
      cell.append(year(r[n].본격화), html("span", "table__cell--sub", `AI가 해내는 연도 ${Math.floor(r[n].문턱)}${r[n].문턱 > 2036.99 ? "*" : ""}`));
      if (n === main) cell.dataset.main = "";
      row.append(cell);
    }
    for (const c of row.children) c.setAttribute("role", "cell");
    t.append(row);
  }
  return t;
}

// 8) 직업군별 대체 시작: 시스템 표(덱 줄바꿈 변형). 시작 칸 = 연도(또는 「이미 감소」) 글자 + 주장 라벨 꼬리표(실측 = 인디고 「기술」,
//    추정 연도 = 보라 「추정」). 꼬리표에는 라벨 낱말만 넣고 값은 칸 글자로(components.md 4절).
//    장 마크업 data-main="사무직"이면 그 직업군(dest) 행에 data-main을 단다(deck.css가 이름을 명도로 강조 — 그 행 이름 text-1, 나머지 text-2)
//    라벨 풀이 줄(poster-key)은 표를 읽는 열쇠라 각주(.footnote, 13/20 · text-2 — 정본 CO-05, 3회차 C3-01)
function poster(d) {
  const main = this.dataset.main;
  const out = document.createDocumentFragment();
  const word = (s) => String(s ?? "").split("(")[0].trim();
  const [meas, est] = (d.라벨 ?? []).map(word);
  if (est) out.append(html("p", "footnote poster-key", `${meas} = ‘이미 감소’와 각 줄의 실측 수치 · ${est} = 시작 연도`));
  const t = html("div", "table table--wrap table--multiline poster-table");
  t.setAttribute("role", "table");
  t.setAttribute("aria-label", d.제목 ?? "");
  const head = html("div", "table__head");
  head.setAttribute("role", "row");
  for (const h of ["직업군", "지금까지의 변화", "시작"]) { const c = html("span", "", h); c.setAttribute("role", "columnheader"); head.append(c); }
  t.append(head);
  for (const r of d.rows) {
    const row = html("div", "table__row");
    row.setAttribute("role", "row");
    if (r.dest === main) row.dataset.main = "";
    const name = html("span", "table__cell");
    name.append(html("span", "t-label-strong", r.dest), html("span", "table__cell--sub", r.sub));
    const sig = html("span", "table__cell", r.signal);
    const when = html("span", "table__cell poster-when");
    const arrived = r.status === "arrived";
    const head = html("span", "");
    const tag = html("span", "tag", arrived ? meas : est);
    tag.dataset.hue = arrived ? "indigo" : "purple";
    head.append(html("span", "t-label-strong num", r.eta), tag);
    when.append(head, html("span", "table__cell--sub", range(r.range)));
    row.append(name, sig, when);
    for (const c of row.children) c.setAttribute("role", "cell");
    t.append(row);
  }
  out.append(t);
  return out;
}

const KINDS = { logline, yearline, scatter, hbar, starts, capfan };
const BLOCKS = { gates, poster };
const pick = (obj, path) => (path ? path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj) : obj);

for (const host of document.querySelectorAll("[data-block]")) {
  const d = chartData[host.dataset.block];
  if (d && BLOCKS[host.dataset.kind]) host.prepend(BLOCKS[host.dataset.kind].call(host, d));
}

for (const host of document.querySelectorAll("[data-chart]")) {
  const d0 = chartData[host.dataset.chart];
  const d = d0 && pick(d0, host.dataset.path);
  const draw = KINDS[host.dataset.kind];
  if (!d || !draw) { host.append(html("p", "chart-src", "이 차트를 그리지 못했어요")); console.error(`chart: ${host.dataset.chart} · ${host.dataset.kind}`); continue; }
  const W = Number(host.dataset.w) || 640;
  const H = Number(host.dataset.h) || 320;
  // data-path로 일부만 고른 차트는 원래 차트(d0)의 '설명'이 다른 그림을 말한다 — 종류 문장 + 장의 부제로 설명을 만든다
  // (제목은 <title>이 읽는다. 부제는 장 작업자가 문장으로 쓴다 — 명사구 조각을 덧붙이지 않는다, 3회차 W-16)
  const KIND_SAY = { hbar: "가로 막대 차트예요.", logline: "선 차트예요.", yearline: "선 차트예요.", scatter: "산점도예요.", starts: "점과 범위 막대 차트예요.", capfan: "선 차트예요." };
  const sub = host.querySelector(".chart-sub")?.textContent.replace(/\s+/g, " ").trim();
  const own = [KIND_SAY[host.dataset.kind], sub].filter(Boolean).join(" ");
  const svg = draw.call(host, d === d0 ? d : { ...d, 설명: own, 제목: d0.제목 }, W, H);
  // 제목 → 부제 → svg → 출처 순서
  const before = host.querySelector(":scope > .chart-head") ?? host.querySelector(":scope > .chart-sub") ?? host.querySelector(":scope > .chart-title");
  if (before) before.after(svg); else host.prepend(svg);
}
})();

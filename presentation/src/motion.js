// 장 안의 모션. 시간·이징은 Transitions.dev 공유 모션 토큰(tokens.css)을 CSS 변수로 읽어 쓴다(JS에 시간 상수를 다시 적지 않는다).
//  - 제목·본문: Transitions.dev Texts reveal(.t-stagger-line). 화면에서 읽는 순서(위→아래, 왼→오른)로 --i를 매기고
//    간격은 --duration-stagger, 장마다 마지막 줄이 1초 안에 끝나게 순번을 12에서 멈춘다(controls.css가 지연을 계산).
//  - 큰 수치: Transitions.dev Number pop-in은 핵심 수치 하나(장당 1개·덱 8장 이하)에만. 숫자 묶음은 한 덩어리로 읽힌다.
//  - 차트: Anime.js 빌드(축 → 데이터 → 값 라벨) 1.5초 안. 재생 전에 시작 상태를 먼저 찍어 완성 모습이 먼저 번쩍이지 않게 한다.
//    이미 본 장으로 돌아오면 완성 상태로 바로 보이고, 다시 보려면 R·다시 재생으로만 재생한다.
//  - 대표 모션: 표지 사진 교차 페이드는 두 번 바꾼 뒤 멈춘다(첫 입력·표지 이탈·탭 숨김에도 멈춤).
//  - 렌더(?slide·?check)·모션 감소·Anime를 못 불러온 경우는 처음부터 최종 상태.
(() => {
const motionQuery = new URLSearchParams(location.search);
const slides = [...document.querySelectorAll(".slide")];
const css = getComputedStyle(document.documentElement);
const ms = (raw) => { const v = raw.trim(); const n = parseFloat(v); return Number.isFinite(n) ? (/ms$/.test(v) ? n : n * 1000) : 0; };
const MOTION = {
  stagger: ms(css.getPropertyValue("--duration-stagger")), micro: ms(css.getPropertyValue("--duration-micro")),
  quick: ms(css.getPropertyValue("--duration-quick")), fast: ms(css.getPropertyValue("--duration-fast")),
  slow: ms(css.getPropertyValue("--duration-slow")), verySlow: ms(css.getPropertyValue("--duration-very-slow")),
  coverHold: ms(css.getPropertyValue("--cover-hold")),
};
const smoothOut = (css.getPropertyValue("--ease-smooth-out").match(/cubic-bezier\(([^)]+)\)/)?.[1] ?? "").split(",").map(Number);
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let finalOnly = reduced || motionQuery.has("check") || motionQuery.has("slide") || motionQuery.has("anim");
const body = document.body;

// 1) 텍스트 차례 등장: 읽는 순서대로 순번
const BLOCKS = ".head > *, .body > *:not(.chart):not(.grid):not(.stack):not(.figs):not(.poster):not(.bands):not(.tiles), .body .grid > *, .body > .stack > *, .figs > *, .poster > .it, .bands > .band, .tiles > *, .slipwrap > *, .stair .lines > span, .stair .pics, .stair-note > p, .center > *, .sowe";
const LAST = 12;
const readingOrder = (a, b) => (Math.abs(a.r.top - b.r.top) <= 8 ? a.r.left - b.r.left : a.r.top - b.r.top);
const lineSets = slides.map((s) => {
  s.classList.add("t-stagger");
  const lines = [...s.querySelectorAll(BLOCKS)].filter((el) => !el.closest("svg"));
  lines.forEach((el) => el.classList.add("t-stagger-line"));
  return lines;
});
const assignOrder = () => lineSets.forEach((lines) => {
  const placed = lines.map((el, i) => ({ el, i, r: el.getBoundingClientRect() }));
  const laidOut = placed.every((x) => x.r.width || x.r.height);
  (laidOut ? placed.sort(readingOrder) : placed).forEach((x, i) => x.el.style.setProperty("--i", String(Math.min(i, LAST))));
});
assignOrder();
document.fonts?.ready.then(assignOrder); // 글꼴이 바뀌면 줄 위치도 바뀐다

// 2) 큰 수치: 숫자를 글자 단위로 나눈 묶음(한 덩어리로 읽히게 role=img·aria-label, 조각은 aria-hidden).
//    팝인(.t-digit-group)은 순수 숫자인 핵심 수치 하나에만(장당 1개·덱 8장 이하, 큰 결론 숫자가 있는 장 먼저).
//    나머지는 같은 배치(글자마다 inline-block)의 정지 묶음(.t-num). 띄어쓰기는 줄바꿈 없는 공백으로 남겨 'R² 0.01'이 붙지 않게 한다
const NUMERIC = /^[\d.,]+$/;
const hosts = [];
for (const [sel, score] of [[".num.hero", 3], [".tile .v", 2], [".fig .v", 2], [".num", 1]]) {
  for (const host of document.querySelectorAll(sel)) {
    if (hosts.some((h) => h.host === host)) continue;
    const node = [...host.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
    if (node) hosts.push({ host, node, score, slide: slides.indexOf(host.closest(".slide")) });
  }
}
const popSlides = new Set();
const pops = new Set(hosts.filter((h) => NUMERIC.test(h.node.textContent.trim())).sort((a, b) => b.score - a.score || a.slide - b.slide)
  .filter((h) => !popSlides.has(h.slide) && popSlides.size < 8 && popSlides.add(h.slide)));
for (const h of hosts) {
  const text = h.node.textContent.trim();
  const group = document.createElement("span");
  group.className = pops.has(h) ? "t-digit-group" : "t-num";
  group.setAttribute("role", "img");
  group.setAttribute("aria-label", text);
  const pop = pops.has(h);
  [...text].forEach((ch, i) => {
    const d = document.createElement("span");
    d.className = pop ? "t-digit" : "t-num-d";
    d.setAttribute("aria-hidden", "true");
    d.style.setProperty("--d", String(i));
    d.textContent = ch === " " ? "\u00a0" : ch;
    group.append(d);
  });
  h.host.replaceChild(group, h.node);
}

// 3) 차트 빌드(Anime.js가 있을 때만). 단계마다 시작 상태를 따로 기억해 재생 직전에 찍는다
const pick = (root, sel) => [...root.querySelectorAll(sel)];
const timelines = new Map();
const starts = new Map();
const spread = (n, cap) => (n > 1 ? Math.min(MOTION.stagger, cap / (n - 1)) : 0);
function buildCharts(A, slide) {
  const { createTimeline, createDrawable, stagger, utils } = A;
  const ease = A.cubicBezier && smoothOut.length === 4 ? A.cubicBezier(...smoothOut) : "out(3)";
  const charts = pick(slide, ".chart");
  if (!charts.length) return null;
  const tl = createTimeline({ autoplay: false, defaults: { duration: MOTION.fast, ease } });
  const init = [];
  const add = (targets, from, params, at) => { if (!targets.length) return; init.push([targets, from]); tl.add(targets, params, at); };
  // 축·격자 0ms → 선·막대 250ms(500ms) → 점 500ms → 값 라벨 750ms. 묶음 안 차례는 300ms 안으로 눌러 전체 1.5초 안에 끝낸다
  const T0 = 0, T1 = MOTION.fast, T2 = MOTION.fast * 2, T3 = MOTION.fast * 3;
  for (const chart of charts) {
    const axis = pick(chart, "svg .grid line, svg .base, svg .tick, svg .alab, svg .gate, svg .gate-lab, svg .band, svg .band-lab");
    add(axis, { opacity: 0 }, { opacity: [0, 1], delay: stagger(spread(axis.length, MOTION.quick)) }, T0);
    const lines = pick(chart, "svg polyline");
    const dashed = lines.filter((l) => { const d = getComputedStyle(l).strokeDasharray; return d && d !== "none"; });
    const solid = lines.filter((l) => !dashed.includes(l)).map((l) => createDrawable(l));
    add(solid, { draw: "0 0" }, { draw: ["0 0", "0 1"], duration: MOTION.verySlow, delay: stagger(MOTION.micro) }, T1);
    add(dashed, { opacity: 0 }, { opacity: [0, 1], duration: MOTION.verySlow, delay: stagger(MOTION.micro) }, T1); // 점선은 그리기 대신 페이드(점선 모양을 지킨다)
    const bars = pick(chart, "svg rect:not(.band)");
    add(bars, { scaleX: 0 }, { scaleX: [0, 1], duration: MOTION.verySlow, delay: stagger(spread(bars.length, MOTION.slow)) }, T1);
    const dots = pick(chart, "svg circle");
    if (dots.length > 100) add(dots, { opacity: 0 }, { opacity: [0, 1], duration: MOTION.verySlow }, T2); // 큰 산점도는 한 번에
    else add(dots, { opacity: 0, scale: 0.9 }, { opacity: [0, 1], scale: [0.9, 1], delay: stagger(spread(dots.length, MOTION.slow)) }, T2);
    const labels = pick(chart, "svg .vlab, svg .note, svg .slab");
    add(labels, { opacity: 0 }, { opacity: [0, 1], delay: stagger(spread(labels.length, MOTION.slow)) }, T3);
  }
  starts.set(slide, () => init.forEach(([t, from]) => utils.set(t, from)));
  return tl;
}
const finish = (tl) => { if (tl) { tl.seek(tl.duration); tl.pause(); } };

// 4) 장 들어가기·나가기
const seen = new Set();
let builtAt = -1;
function play(slide) {
  const tl = timelines.get(slide);
  if (tl) { starts.get(slide)?.(); tl.seek(0); tl.play(); }
  for (const g of slide.querySelectorAll(".t-digit-group")) { g.classList.remove("is-animating"); void g.offsetWidth; g.classList.add("is-animating"); }
}
function enter(slide) {
  if (finalOnly || seen.has(slide)) {
    // 이미 본 장: 전환 없이 완성 상태로
    slide.classList.add("is-instant", "is-shown");
    finish(timelines.get(slide));
    requestAnimationFrame(() => requestAnimationFrame(() => slide.classList.remove("is-instant")));
    return;
  }
  seen.add(slide);
  slide.classList.add("is-shown"); // 처음 들어오는 장의 글줄은 아직 숨어 있다(전환이 바로 시작된다)
  builtAt = performance.now();
  play(slide);
}
function leave(slide) { finish(timelines.get(slide)); }
function replay() {
  const s = slides[window.__deckCurrentSlide()];
  if (!s || finalOnly) return;
  s.classList.add("is-instant"); // 글줄을 전환 없이 처음 상태로 돌린 뒤 다시 등장시킨다
  s.classList.remove("is-shown");
  void s.offsetWidth;
  s.classList.remove("is-instant");
  void s.offsetWidth;
  s.classList.add("is-shown");
  play(s);
}

if (finalOnly) {
  body.classList.add("final");
  slides.forEach((s) => s.classList.add("is-shown"));
} else {
  document.addEventListener("slidechange", (e) => {
    const { index, prev } = e.detail;
    if (prev !== index && slides[prev]) leave(slides[prev]);
    enter(slides[index]);
  });
  enter(slides[Math.max(0, window.__deckCurrentSlide())]);
  document.addEventListener("deckreplay", replay);
  document.addEventListener("keydown", (e) => { if (!e.metaKey && !e.ctrlKey && !e.altKey && (e.key === "r" || e.key === "R") && !body.classList.contains("overview")) { e.preventDefault(); replay(); } });
  // 탭을 떠나면 지금 장의 빌드를 끝내 둔다(돌아왔을 때 반쯤 그려진 채로 멈춰 있지 않게)
  document.addEventListener("visibilitychange", () => { if (document.hidden) finish(timelines.get(slides[window.__deckCurrentSlide()])); });
  // 개요에서는 아직 안 본 장도 완성 모습으로
  document.addEventListener("deckoverview", (e) => { if (e.detail.open) timelines.forEach(finish); });
}
window.addEventListener("beforeprint", () => { body.classList.add("final"); timelines.forEach(finish); });

// 차트 빌드는 Anime.js(이 파일 뒤에 불러온다)가 준비된 뒤에 만든다. 못 불러오면 덱은 최종 상태로 둔다
const prepareCharts = () => {
  const A = window.anime;
  if (!A || !A.createTimeline) { finalOnly = true; body.classList.add("final"); slides.forEach((s) => s.classList.add("is-shown")); return; }
  for (const s of slides) { const tl = buildCharts(A, s); if (tl) { timelines.set(s, tl); finish(tl); } }
  // 지금 장에 들어온 직후라면(보통의 첫 로드) 그 장의 빌드를 재생한다
  const s = slides[window.__deckCurrentSlide()];
  if (!finalOnly && s && performance.now() - builtAt < MOTION.slow) play(s);
};
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", prepareCharts); else prepareCharts();

// 5) 대표 모션: 표지 사진 교차 페이드 — 두 번 바꾼 뒤 멈춘다
const frames = [...document.querySelectorAll(".cover .object img")];
if (frames.length) {
  frames[0].classList.add("on");
  if (!finalOnly && frames.length > 1) {
    let k = 0, timer = 0;
    const stop = () => { clearTimeout(timer); timer = 0; };
    const tick = () => {
      if (document.hidden || window.__deckCurrentSlide() !== 0 || k >= Math.min(2, frames.length - 1)) return stop();
      frames[k].classList.remove("on");
      k += 1;
      frames[k].classList.add("on");
      timer = k < Math.min(2, frames.length - 1) ? setTimeout(tick, MOTION.coverHold) : 0;
    };
    timer = setTimeout(tick, MOTION.coverHold);
    for (const ev of ["keydown", "pointerdown", "slidechange", "visibilitychange"]) document.addEventListener(ev, stop, { once: true });
  }
}

window.__motion = { timelines };

})();

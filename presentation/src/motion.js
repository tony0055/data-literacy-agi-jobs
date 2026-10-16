// 장 안의 모션. 시간·이징은 Transitions.dev 모션 토큰(tokens.css)과 같은 값만 쓴다.
//  - 제목·본문: Transitions.dev Texts reveal (.t-stagger / .t-stagger-line, 줄마다 80ms씩)
//  - 큰 수치: Transitions.dev Number pop-in (.t-digit-group / .t-digit)
//  - 차트: Anime.js 빌드(선 그리기·막대·점), 500ms·40ms 스태거·smooth-out
//  - 대표 모션(taste-skill 시트): 표지 사진의 느린 교차 페이드 1.6초, 5.5초 유지
(() => {
const { createTimeline, createDrawable, stagger, utils } = window.anime;

const q = new URLSearchParams(location.search);
const slides = [...document.querySelectorAll(".slide")];
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finalOnly = reduced || q.has("check") || q.has("slide") || q.has("anim");
const T = { micro: 80, stagger: 40, fast: 250, slow: 500 };
const EASE = window.anime.cubicBezier ? window.anime.cubicBezier(0.22, 1, 0.36, 1) : "out(3)"; // --ease-smooth-out

// 1) 텍스트 차례 등장 표시
const BLOCKS = ".head > *, .body > *:not(.chart):not(.grid):not(.stack):not(.figs):not(.poster):not(.bands):not(.tiles), .body .grid > *, .body > .stack > *, .figs > *, .poster > .it, .bands > .band, .tiles > *, .slipwrap > *, .stair .lines > span, .stair .pics, .stair-note > p, .center > *, .sowe";
for (const s of slides) {
  s.classList.add("t-stagger");
  [...s.querySelectorAll(BLOCKS)].forEach((el, i) => {
    if (el.closest("svg")) return;
    el.classList.add("t-stagger-line");
    el.style.setProperty("--i", String(Math.min(i, 12)));
  });
}

// 2) 큰 수치를 숫자 단위로 쪼갠다(첫 글자 노드만)
for (const host of document.querySelectorAll(".fig .v, .tile .v, .num")) {
  const node = [...host.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
  if (!node) continue;
  const group = document.createElement("span");
  group.className = "t-digit-group";
  [...node.textContent.trim()].forEach((ch, i) => {
    const d = document.createElement("span");
    d.className = "t-digit";
    d.style.setProperty("--d", String(i));
    d.textContent = ch;
    group.append(d);
  });
  host.replaceChild(group, node);
}

// 3) 차트 빌드
const pick = (root, sel) => [...root.querySelectorAll(sel)];
function buildCharts(slide) {
  const tl = createTimeline({ autoplay: false, defaults: { duration: T.slow, ease: EASE } });
  let at = 0;
  const step = (targets, params, gap) => { if (!targets.length) return; tl.add(targets, params, at); at += gap; };
  for (const chart of pick(slide, ".chart")) {
    step(pick(chart, "svg .grid line, svg .base, svg .tick, svg .alab, svg .gate, svg .gate-lab, svg .band"), { opacity: [0, 1], delay: stagger(8) }, T.fast);
    const lines = pick(chart, "svg polyline");
    if (lines.length) step(lines.map((l) => createDrawable(l)), { draw: ["0 0", "0 1"], duration: T.slow * 2, delay: stagger(T.micro) }, T.slow * 2);
    const bars = pick(chart, "svg rect:not(.band)");
    if (bars.length) step(bars, { scaleX: [0, 1], delay: stagger(T.stagger) }, T.slow);
    const dots = pick(chart, "svg circle");
    if (dots.length) step(dots, { scale: [0, 1], duration: T.fast, delay: stagger(dots.length > 100 ? 2 : T.stagger) }, T.slow);
    step(pick(chart, "svg .vlab, svg .note, svg .slab"), { opacity: [0, 1], delay: stagger(T.stagger) }, T.fast);
  }
  return tl;
}
const timelines = new Map(slides.map((s) => [s, buildCharts(s)]));

const hideTimers = new Map();
function enter(slide) {
  clearTimeout(hideTimers.get(slide));
  slide.classList.remove("is-hiding");
  slide.classList.add("is-shown");
  for (const g of slide.querySelectorAll(".t-digit-group")) { g.classList.remove("is-animating"); void g.offsetWidth; g.classList.add("is-animating"); }
  const tl = timelines.get(slide);
  if (tl) { tl.seek(0); tl.play(); }
}
function leave(slide) {
  slide.classList.add("is-hiding");
  hideTimers.set(slide, setTimeout(() => slide.classList.remove("is-shown", "is-hiding"), 220));
}

if (finalOnly) {
  document.body.classList.add("final");
  slides.forEach((s) => s.classList.add("is-shown"));
  timelines.forEach((tl) => tl.seek(tl.duration));
} else {
  document.addEventListener("slidechange", (e) => {
    const { index, prev } = e.detail;
    if (prev !== index && slides[prev]) leave(slides[prev]);
    enter(slides[index]);
  });
  enter(slides[window.__deckCurrentSlide()]);

  const replay = () => { const s = slides[window.__deckCurrentSlide()]; s.classList.remove("is-shown"); void s.offsetWidth; enter(s); };
  document.addEventListener("keydown", (e) => { if (!e.metaKey && !e.ctrlKey && (e.key === "r" || e.key === "R")) { e.preventDefault(); replay(); } });
  const btn = Object.assign(document.createElement("button"), { className: "replay-btn", type: "button", textContent: "다시 재생 (R)" });
  btn.addEventListener("click", replay);
  document.body.append(btn);
  window.addEventListener("beforeprint", () => document.body.classList.add("final"));
  // 개요(Esc)에서는 아직 안 본 장도 완성된 모습으로 보여 준다(present.js가 먼저 클래스를 바꾼다)
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && document.body.classList.contains("overview")) timelines.forEach((tl) => tl.seek(tl.duration)); });
}

// 4) 대표 모션: 표지 사진 교차 페이드(탭이 숨으면 멈춤, 모션 감소면 첫 장만)
const frames = [...document.querySelectorAll(".cover .object img")];
if (frames.length) {
  frames[0].classList.add("on");
  if (!finalOnly && frames.length > 1) {
    let k = 0;
    setInterval(() => {
      if (document.hidden || window.__deckCurrentSlide() !== 0) return;
      frames[k].classList.remove("on");
      k = (k + 1) % frames.length;
      frames[k].classList.add("on");
    }, 5500);
  }
}

window.__motion = { timelines };

})();

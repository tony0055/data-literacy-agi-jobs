// 발표 무대: 한 장씩 보여 준다. 조작부는 제품 디자인 시스템 컴포넌트(.button · .progress · .toolbar)와 Lucide 스프라이트.
// 조작: 키보드(→ ← Space PageUp/Down Home End · G/O 전체 장 보기 · Esc 닫기 · F 전체 화면 · ? 조작부 보이기),
// 보이는 버튼(전체 장 보기 · 전체 화면 · 처음으로 · 이전 · 다음), 터치·펜 스와이프, 주소 #n(새로고침·주소 변경·뒤로 가기).
// 장 안 빌드 · 차트 단계 모션은 없다(2026. 10. 21. — 정본 MO-01 · 02 기능 모션만). 그래서 「다시 재생」 버튼 · R 키도 없앴다. 덱 모션은 장 사이 이동뿐(controls.css).
// 배치(배율·모드)는 index.html <head>의 window.__deckLayout()이 정한다.
// 마지막 입력이 키보드면 <html data-input="keyboard">를 단다(MO-03: 키보드로 한 동작은 모션 없이 바로).
// 배너를 쓰지 않는다(CN-146 — 배너는 결과·상태): 키 안내는 조작 막대 안 캡션 글(.deck-keys), 마지막 장은 진행 표시 34 / 34와
// 「처음으로」 버튼으로 보이고 화면 읽기 프로그램에는 알림 영역으로 알린다.
// 아이콘(IC-03 · IC-25): 쓰는 이름은 아래 ICONS 하나에 모으고 build.ts가 스프라이트와 대조한다. 뜻이 맞는 그림이 없는 동작(전체 화면)은 글자 버튼.
// 버튼 이름(aria-label)은 보이는 글자 그대로 시작한다(AC-64 — 좁은 모드에서 글자를 숨겨도 같은 이름).
// ?check / ?slide=n(렌더)에서는 무대를 만들지 않고 외부 링크 표시만 채운다.
(() => {
const slides = [...document.querySelectorAll(".slide")];
const total = slides.length;
const presentQuery = new URLSearchParams(location.search);
const presentRender = presentQuery.has("check") || presentQuery.has("slide");

// 1) 외부 링크: 행선지와 '새 탭'을 이름에 넣는다
const siteOf = (host) => (/youtu/.test(host) ? "YouTube" : /github/.test(host) ? "GitHub" : host.replace(/^www\./, ""));
for (const a of document.querySelectorAll(".slide a[href^='http']")) {
  const site = siteOf(new URL(a.href).hostname);
  const text = (a.innerText || a.textContent).replace(/\s+/g, " ").trim();
  if (a.target === "_blank") {
    if (!/noopener/.test(a.rel)) a.rel = `${a.rel} noopener`.trim();
    if (!/새 탭/.test(a.getAttribute("aria-label") || "")) a.setAttribute("aria-label", `${text}, 새 탭에서 ${site}로 열려요`);
    if (!a.title) a.title = `새 탭에서 ${site}로 열려요`;
  }
}

let current = 0;
window.__deckCurrentSlide = () => current;
if (presentRender) return;

// 2) 무대
const root = document.documentElement;
const body = document.body;
const deck = document.querySelector(".deck");
root.classList.add("deck-js");
body.classList.add("stage");
const css = getComputedStyle(root);
const msVar = (name) => { const v = css.getPropertyValue(name).trim(); const n = parseFloat(v); return Number.isFinite(n) ? (/ms$/.test(v) ? n : n * 1000) : 0; };
const D3 = msVar("--duration-3");
const D4 = msVar("--duration-4");
const IDLE_AFTER = D4 * 7; // 포인터가 이만큼 멈추면 조작부를 옅게(약 3초)
const baseTitle = document.title;
const textOf = (e) => { if (!e) return ""; const c = e.cloneNode(true); c.querySelectorAll("br").forEach((b) => b.replaceWith(" ")); return c.textContent.replace(/\s+/g, " ").trim(); };
const headOf = (s) => textOf(s.querySelector(".headline, h1, h2") || s.querySelector("p"));
const isTouch = () => navigator.maxTouchPoints > 0 && matchMedia("(pointer: coarse)").matches;

// 2-1) 조작부(시스템 컴포넌트 클래스만 붙인다)
// 아이콘 이름(build.ts가 이 줄을 읽어 스프라이트와 대조한다): 격자 보기 · 홈(처음 장 = 뿌리) · 뒤로 · 다음 · 닫기
const ICONS = ["squares-grid", "house", "chevron-left", "chevron-right", "xmark"];
const icon = (name) => `<svg class="icon" aria-hidden="true" focusable="false"><use href="#icon-${name}"/></svg>`;
const mk = (tag, attrs = {}, inner = "") => { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); e.innerHTML = inner; return e; };
// 글자는 .deck-button__text(좁은 모드에서 아이콘 버튼은 controls.css가 글자를 숨긴다 — 시스템에 없는 자식 이름이라 덱 접두)
// 아이콘은 글자 앞이 기본이고, 나아가는 쪽을 가리키는 「다음」만 글자 뒤(IC-24 — 진행 방향 아이콘은 그 쪽 끝에, 3회차 L-04)
const textButton = (cls, name, text, key, label = text, after = false) => {
  const t = `<span class="deck-button__text">${text}</span>`, i = name ? icon(name) : "";
  return mk("button", { type: "button", class: `button button--small ${cls}`, "aria-label": label, title: key ? `${label} (${key})` : label }, after ? t + i : i + t);
};

const fsOK = !!(document.fullscreenEnabled && root.requestFullscreen);
const ui = {
  util: mk("div", { class: "deck-ui deck-group util", role: "group", "aria-label": "발표 도구" }),
  nav: mk("div", { class: "deck-ui deck-group nav", role: "group", "aria-label": "장 이동" }),
  overview: textButton("button--secondary", ICONS[0], "전체 장 보기", "G"),
  fullscreen: fsOK ? textButton("button--secondary", "", "전체 화면", "F") : null,
  keys: mk("p", { class: "deck-keys" }),
  first: textButton("button--secondary", ICONS[1], "처음으로", "Home", "처음으로(1장)"),
  prev: textButton("button--secondary", ICONS[2], "이전", "←", "이전 장"),
  next: textButton("button--primary", ICONS[3], "다음", "→", "다음 장", true),
  // 시스템 진행 막대 마크업 그대로: 이름 + 값(끝 쪽) 한 줄, 트랙이 progressbar(이름은 aria-labelledby)
  progress: mk("div", { class: "progress deck-progress" },
    `<p class="progress__label"><span id="deck-progress-name">장</span><span class="progress__value"></span></p><div class="progress__track" role="progressbar" aria-labelledby="deck-progress-name" aria-valuemin="1" aria-valuemax="${total}"><div class="progress__fill"></div></div>`),
  read: mk("div", { class: "deck-ui deck-read", "aria-hidden": "true" }),
  barbg: mk("div", { class: "deck-ui deck-barbg", "aria-hidden": "true" }),
  live: mk("div", { class: "deck-ui deck-live", "aria-live": "polite", "aria-atomic": "true" }),
  ovHead: mk("header", { class: "toolbar deck-ov-head" }, `<div class="toolbar__group"><h2 class="toolbar__title">전체 ${total}장</h2></div><div class="toolbar__center"></div><div class="toolbar__group"></div>`),
  ovClose: textButton("button--secondary", ICONS[4], "닫기", "Esc", "닫기(전체 장 보기)"),
};
ui.first.classList.add("deck-first");
ui.first.hidden = true;
ui.keys.textContent = isTouch() ? "옆으로 밀어 넘겨요" : "→ · Space 다음 장 · G 전체 장 보기";
ui.util.append(...[ui.overview, ui.fullscreen, ui.keys].filter(Boolean));
ui.nav.append(ui.progress, ui.first, ui.prev, ui.next);
ui.ovHead.lastElementChild.append(ui.ovClose);
deck.before(ui.ovHead); // 개요 머리는 덱 앞(위에 붙는다)
body.append(ui.barbg, ui.read, ui.util, ui.nav, ui.live);

// 세로 읽기 칸: 그림자 DOM에 덱 CSS와 아이콘 스프라이트를 따로 넣는다
const shadow = ui.read.attachShadow({ mode: "open" });
const sheets = ["ds/tokens.css", "ds/layout.css", "ds/components.css", "deck.css", "slides.bundle.css", "controls.css"];
shadow.innerHTML = sheets.map((f) => `<link rel="stylesheet" href="src/${f}">`).join("") + '<div class="read-root"></div>';
const sprite = document.querySelector("body > svg[aria-hidden]");
if (sprite) shadow.prepend(sprite.cloneNode(true));
const readRoot = shadow.querySelector(".read-root");

// 2-2) 배치: 모드(막대·기둥·읽기 칸)와 배율. 안전 영역은 env()를 실제로 재서 넘긴다
const probe = mk("div", { "aria-hidden": "true", class: "deck-safe" });
body.append(probe);
let mode = "bar";
let deckK = 1; // 지금 배율(스와이프 끌기 거리를 장 좌표로 바꿀 때)
const layout = () => {
  const p = getComputedStyle(probe);
  const L = window.__deckLayout({ t: parseFloat(p.paddingTop) || 0, r: parseFloat(p.paddingRight) || 0, b: parseFloat(p.paddingBottom) || 0, l: parseFloat(p.paddingLeft) || 0 });
  const was = mode;
  mode = L.mode;
  deckK = L.k;
  body.classList.toggle("portrait", mode === "panel");
  if (was !== mode) setTimeout(() => renderRead(), 0);
  fitKeys();
};
// 막대 맞추기: 도구 묶음과 이동 묶음 사이가 16 이상이 되게 ① 키 안내 글을 숨기고 ② 그래도 닿으면 좁은 막대(deck-compact:
// 아이콘 버튼 글자 숨김 · 진행 트랙 숨김 · 막대 끝을 창 가장자리 16으로, controls.css). 640 폭 가로 화면처럼 막대가 좁을 때(2회차 CM-01)
const apart = () => { const a = ui.util.getBoundingClientRect(), b = ui.nav.getBoundingClientRect(); return !(a.width && b.width) || a.right + 16 <= b.left; };
const fitKeys = () => {
  ui.keys.hidden = false;
  root.classList.remove("deck-compact");
  if (mode !== "bar") return;
  if (apart()) return;
  ui.keys.hidden = true;
  if (!apart()) root.classList.add("deck-compact");
};
window.addEventListener("resize", layout);
window.visualViewport?.addEventListener("resize", layout);
document.addEventListener("fullscreenchange", () => {
  layout();
  if (!ui.fullscreen) return;
  const on = !!document.fullscreenElement;
  const label = on ? "전체 화면 끝내기" : "전체 화면";
  ui.fullscreen.setAttribute("aria-label", label);
  ui.fullscreen.title = `${label} (F)`;
  ui.fullscreen.querySelector(".deck-button__text").textContent = label;
  fitKeys();
});
layout();

// 2-3) 마지막 입력 방식(MO-03)
document.addEventListener("keydown", () => root.setAttribute("data-input", "keyboard"), true);
document.addEventListener("pointerdown", () => root.removeAttribute("data-input"), true);

// 2-4) 화면 읽기 프로그램 알림. 마지막 장에서 더 넘기려 하면 알린다(보이는 쪽은 진행 표시 · 「처음으로」 버튼)
const announce = (t) => { ui.live.textContent = ""; requestAnimationFrame(() => { ui.live.textContent = t; }); };
const showEnd = () => announce(`마지막 장이에요 · ${total} / ${total}`);

// 2-5) 장 이동
const update = () => {
  const n = current + 1;
  const track = ui.progress.querySelector(".progress__track");
  ui.progress.querySelector(".progress__value").textContent = `${n} / ${total}`;
  track.setAttribute("aria-valuenow", String(n));
  track.setAttribute("aria-valuetext", `${total}장 중 ${n}장`);
  track.style.setProperty("--progress-value", String(n / total));
  ui.prev.setAttribute("aria-disabled", String(current === 0));
  ui.next.setAttribute("aria-disabled", String(current === total - 1));
  const wasLast = !ui.first.hidden;
  ui.first.hidden = current !== total - 1;
  if (wasLast !== !ui.first.hidden) fitKeys();
  document.title = `${baseTitle} (${n}/${total})`;
};

// 읽기 칸 사본: 원본 배치를 보고 한 열로 풀 상자를 표시한다(장 클래스와 무관). 캔버스 배치는 화면과 상관없어 장마다 한 번만 잰다
let readTimer = 0;
const marks = new Map();
const marksOf = (s) => {
  if (marks.has(s)) return marks.get(s);
  const out = [];
  [...s.querySelectorAll("*")].forEach((o, i) => {
    if (o instanceof SVGElement && o.tagName !== "svg") return;
    const st = getComputedStyle(o);
    let rd = "";
    if (/^(flex|grid)$/.test(st.display) && o.offsetWidth > 360 && o.textContent.trim().length > 16 && !o.matches(".table__head, .table__row, .banner")) rd = "stack";
    else if (/^inline-(flex|grid)$/.test(st.display)) rd = "inline";
    if (/^(absolute|fixed)$/.test(st.position)) rd = "abs";
    else if (!rd && st.display === "block" && o.tagName !== "svg" && !o.querySelector("svg")) rd = "box";
    let svgW = 0;
    if (o.tagName === "svg" && o.viewBox?.baseVal?.width) svgW = o.viewBox.baseVal.width; // 그림은 원래 폭으로 그리고 옆으로 밀어 본다
    if (rd || svgW) out.push([i, rd, svgW]);
  });
  marks.set(s, out);
  return out;
};
const cloneSlide = (s) => {
  const c = s.cloneNode(true);
  c.className = `r-slide ${[...s.classList].filter((k) => !/^(slide|is-)/.test(k)).join(" ")}`;
  const to = [...c.querySelectorAll("*")];
  marksOf(s).forEach(([i, rd, svgW]) => {
    const x = to[i];
    if (!x) return;
    if (rd) x.dataset.rd = rd;
    if (svgW) { const w = document.createElement("div"); w.className = "r-scroll r-fig"; x.replaceWith(w); w.append(x); }
  });
  for (const t of c.querySelectorAll(".table")) { const w = document.createElement("div"); w.className = "r-scroll"; t.replaceWith(w); w.append(t); }
  for (const x of c.querySelectorAll("a, button, [tabindex]")) x.setAttribute("tabindex", "-1");
  for (const x of c.querySelectorAll("[id]")) x.removeAttribute("id");
  c.removeAttribute("inert");
  c.removeAttribute("aria-current");
  c.removeAttribute("data-side");
  return c;
};
const renderRead = () => {
  if (mode !== "panel") { readRoot.replaceChildren(); return; }
  const note = document.createElement("p");
  note.className = "t-label c-text-3";
  note.textContent = "옆으로 밀어 넘기고, 가로로 돌리면 장을 크게 봐요.";
  readRoot.replaceChildren(note, cloneSlide(slides[current]));
  ui.read.scrollTop = 0;
};

const go = (i, opts = {}) => {
  if (!Number.isFinite(i)) i = 0;
  const target = Math.max(0, Math.min(total - 1, i));
  if (target === current && !opts.force) {
    if (i > total - 1) showEnd();
    return;
  }
  const prev = current;
  current = target;
  slides.forEach((s, j) => {
    s.dataset.side = j < current ? "before" : j > current ? "after" : "current";
    s.inert = j !== current && !body.classList.contains("overview");
    if (j === current) s.setAttribute("aria-current", "true"); else s.removeAttribute("aria-current");
  });
  const hash = `#${current + 1}`;
  if (location.hash !== hash) history[opts.push ? "pushState" : "replaceState"](null, "", hash);
  update();
  clearTimeout(readTimer);
  readTimer = setTimeout(renderRead, mode === "panel" ? D4 : 0);
  announce(`${current + 1} / ${total} · ${headOf(slides[current])}`);
  document.dispatchEvent(new CustomEvent("slidechange", { detail: { index: current, prev } }));
};
const parseHash = () => { const n = parseInt(location.hash.slice(1), 10); return Number.isFinite(n) ? n - 1 : 0; };
const fromAddress = () => { const i = parseHash(); if (Math.max(0, Math.min(total - 1, i)) !== current || body.classList.contains("overview")) { closeOverview(); go(i); } else history.replaceState(null, "", `#${current + 1}`); };
window.addEventListener("hashchange", fromAddress);
window.addEventListener("popstate", fromAddress);

// 개요를 열고 닫을 때는 34장이 한꺼번에 미끄러지지 않게 전환 없이 자리를 잡는다
const snap = (change) => { deck.classList.add("no-trans"); change(); void deck.offsetWidth; deck.classList.remove("no-trans"); };

// 2-6) 개요(G·O 키·개요 버튼으로 열고, Esc·닫기·장 선택으로 닫는다)
const inner = new Map();
let returnFocus = null;
const openOverview = () => {
  if (body.classList.contains("overview")) return;
  returnFocus = document.activeElement;
  snap(() => {
    body.classList.add("overview");
    slides.forEach((s, j) => {
      s.inert = false;
      s.tabIndex = 0;
      s.setAttribute("role", "button");
      s.setAttribute("aria-label", `${j + 1}장 · ${headOf(s)}`);
      const links = [...s.querySelectorAll("a, button, [tabindex]:not(.slide)")];
      inner.set(s, links.map((x) => [x, x.getAttribute("tabindex")]));
      links.forEach((x) => x.setAttribute("tabindex", "-1"));
    });
  });
  document.dispatchEvent(new CustomEvent("deckoverview", { detail: { open: true } }));
  slides[current].focus({ preventScroll: true });
  slides[current].scrollIntoView({ block: "center" });
  announce(`개요 · 전체 ${total}장 · 지금 ${current + 1}장`);
};
const closeOverview = (jump) => {
  if (!body.classList.contains("overview")) return;
  snap(() => {
    body.classList.remove("overview");
    slides.forEach((s) => {
      s.removeAttribute("tabindex");
      s.removeAttribute("role");
      s.removeAttribute("aria-label");
      for (const [x, t] of inner.get(s) ?? []) (t == null ? x.removeAttribute("tabindex") : x.setAttribute("tabindex", t));
    });
    window.scrollTo(0, 0);
    if (jump != null && jump !== current) go(jump, { push: true });
    else go(current, { force: true });
  });
  document.dispatchEvent(new CustomEvent("deckoverview", { detail: { open: false } }));
  const back = returnFocus && returnFocus.isConnected && !returnFocus.closest(".slide") ? returnFocus : null;
  back?.focus({ preventScroll: true });
};
const overviewKey = (e) => {
  const k = e.key;
  const i = slides.indexOf(document.activeElement);
  const cols = Math.max(1, slides.filter((s) => s.offsetTop === slides[0].offsetTop).length);
  const move = (d) => { e.preventDefault(); const j = Math.max(0, Math.min(total - 1, (i < 0 ? current : i) + d)); slides[j].focus(); slides[j].scrollIntoView({ block: "nearest" }); };
  if (k === "Escape") { e.preventDefault(); closeOverview(); }
  else if (k === "ArrowRight") move(1);
  else if (k === "ArrowLeft") move(-1);
  else if (k === "ArrowDown") move(cols);
  else if (k === "ArrowUp") move(-cols);
  else if (k === "Home") move(-total);
  else if (k === "End") move(total);
  else if ((k === "Enter" || k === " ") && i >= 0) { e.preventDefault(); closeOverview(i); }
};

// 2-7) 전체 화면(지원할 때만)
const toggleFullscreen = () => {
  if (!fsOK) return;
  const p = document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen();
  p?.catch?.(() => {});
};

// 2-8) 키보드
document.addEventListener("keydown", (e) => {
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
  if (body.classList.contains("overview")) { overviewKey(e); return; }
  const k = e.key;
  const onControl = e.target instanceof Element && e.target.closest("button, a[href], input, textarea, select, [role=button]");
  if (onControl && (k === " " || k === "Enter")) return; // 포커스된 버튼·링크는 제 동작을 한다
  if (k === "ArrowRight" || k === "ArrowDown" || k === "PageDown" || k === " ") { e.preventDefault(); presenting(); go(current + 1); }
  else if (k === "ArrowLeft" || k === "ArrowUp" || k === "PageUp") { e.preventDefault(); presenting(); go(current - 1); }
  else if (k === "Home") { e.preventDefault(); go(0); }
  else if (k === "End") { e.preventDefault(); go(total - 1); }
  else if (k === "g" || k === "G" || k === "o" || k === "O") { e.preventDefault(); openOverview(); }
  else if (k === "f" || k === "F") toggleFullscreen();
  else if (k === "?") { e.preventDefault(); wake(); }
});

// 2-9) 버튼(포인터로 누른 뒤에는 포커스를 덱에 돌려 Space가 다음 장으로 가게 한다)
const press = (b, fn) => b?.addEventListener("click", (e) => {
  if (b.getAttribute("aria-disabled") === "true") { if (b === ui.next) showEnd(); return; }
  fn();
  if (e.detail > 0) b.blur();
});
press(ui.prev, () => go(current - 1));
press(ui.next, () => go(current + 1));
press(ui.overview, openOverview);
press(ui.fullscreen, toggleFullscreen);
press(ui.first, () => go(0, { push: true }));
press(ui.ovClose, () => closeOverview());
document.addEventListener("click", (e) => {
  if (!body.classList.contains("overview")) return;
  const s = e.target instanceof Element && e.target.closest(".slide");
  if (!s) return;
  e.preventDefault();
  closeOverview(slides.indexOf(s));
}, true);

// 2-10) 터치·펜 스와이프: 10px 뒤 방향을 정하고, 폭 20%(최대 120px) 또는 48px 이상 빠른 밀기면 넘긴다.
// 가장자리 16px에서 시작·두 손가락·확대 중·세로 우세는 넘기지 않고, 못 미치면 제자리로 돌아온다.
let sw = null;
const W = () => window.innerWidth;
const dragTarget = () => (mode === "panel" ? null : slides[current]);
const settle = (s) => { if (!s) return; s.classList.remove("is-dragging"); s.classList.add("is-settling"); s.style.transform = ""; setTimeout(() => s.classList.remove("is-settling"), D3); };
document.addEventListener("pointerdown", (e) => {
  if (e.pointerType === "mouse" || body.classList.contains("overview")) return;
  if (sw) { settle(sw.drag ? dragTarget() : null); sw = null; return; } // 두 번째 손가락
  if (e.target instanceof Element && e.target.closest(".deck-ui, .button")) return;
  if (e.clientX < 16 || e.clientX > W() - 16) return;
  if ((window.visualViewport?.scale ?? 1) > 1.01) return;
  sw = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now(), dir: null, drag: false };
}, { passive: true });
document.addEventListener("pointermove", (e) => {
  if (!sw || e.pointerId !== sw.id) return;
  const dx = e.clientX - sw.x, dy = e.clientY - sw.y;
  if (!sw.dir && Math.hypot(dx, dy) >= 10) sw.dir = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
  if (sw.dir === "y") { sw = null; return; }
  if (sw.dir === "x") {
    const s = dragTarget();
    if (!s) return;
    const k = deckK || 1;
    const edge = (dx > 0 && current === 0) || (dx < 0 && current === total - 1);
    sw.drag = true;
    s.classList.add("is-dragging");
    s.style.transform = `translateX(${(dx * (edge ? 0.2 : 0.5)) / k}px)`;
  }
}, { passive: true });
const endSwipe = (e, cancel) => {
  if (!sw || e.pointerId !== sw.id) return;
  const { x, t, dir, drag } = sw;
  sw = null;
  const s = drag ? dragTarget() : null;
  const dx = e.clientX - x;
  const v = Math.abs(dx) / Math.max(1, performance.now() - t);
  const far = Math.abs(dx) >= Math.min(W() * 0.2, 120) || (Math.abs(dx) >= 48 && v > 0.11);
  if (cancel || dir !== "x" || !far) { settle(s); return; }
  if (s) { s.classList.remove("is-dragging"); s.style.transform = ""; }
  go(current + (dx < 0 ? 1 : -1));
};
document.addEventListener("pointerup", (e) => endSwipe(e, false));
document.addEventListener("pointercancel", (e) => endSwipe(e, true));

// 2-11) 포인터가 멈추면 조작부를 쉬는 모양으로(버튼 면 · 테두리를 지우고 글자 text-3 — controls.css body.ui-idle, 투명도는 쓰지 않는다).
//       움직이거나 누르면 바로 돌아오고, 조작부에 포커스가 있으면 바뀌지 않는다. 키로 넘기면 곧바로 쉬는 모양(발표 리모컨)
let idleTimer = 0;
const uiFocused = () => !!document.activeElement?.closest?.(".deck-ui");
const wake = () => {
  body.classList.remove("ui-idle");
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!uiFocused() && mode !== "panel") body.classList.add("ui-idle"); }, IDLE_AFTER);
};
const presenting = () => { if (!uiFocused() && mode !== "panel" && !isTouch()) { clearTimeout(idleTimer); body.classList.add("ui-idle"); } };
document.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") wake(); }, { passive: true });
document.addEventListener("pointerdown", wake, { passive: true });
document.addEventListener("focusin", (e) => { if (e.target instanceof Element && e.target.closest(".deck-ui")) wake(); });

// 2-12) 장 안 글줄 링크: 덱 배율에 반비례하는 누름 영역(controls.css). .link는 CSS가 바로 건다 — 클래스 없는 글줄 링크만 여기서 표시한다
for (const a of document.querySelectorAll(".slide a[href]:not(.link)")) if (getComputedStyle(a).display === "inline") a.dataset.hit = "";

// 3) 시작
document.getElementById("deck-boot")?.remove();
current = -1;
go(parseHash());
root.classList.add("deck-ready");
fitKeys();
document.fonts?.ready.then(() => { marks.clear(); fitKeys(); });

// 인쇄: 개요가 열려 있으면 닫고 그린다(쪽 크기는 머리 스크립트의 @page, 장 배치는 controls.css @media print)
window.addEventListener("beforeprint", () => closeOverview());
})();

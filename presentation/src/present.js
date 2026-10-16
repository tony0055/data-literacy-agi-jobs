// 발표 무대: 한 장씩 보여 주고, 장 사이는 Transitions.dev의 페이지 좌우 전환(.t-page-slide)을 쓴다.
// 조작: 키보드(→ ← Space Home End · G/O 개요 · F 전체 화면 · ? 안내), 보이는 버튼(이전·다음·개요·전체 화면·다시 재생),
// 터치·펜 스와이프, 주소 #n(새로고침·주소 변경·뒤로 가기). 배치(배율·모드)는 index.html <head>의 window.__deckLayout()이 정한다.
// ?check / ?slide=n(렌더) 에서는 무대를 만들지 않고 장 번호·섹션·외부 링크 표시만 채운다.
(() => {
const slides = [...document.querySelectorAll(".slide")];
const total = slides.length;
const presentQuery = new URLSearchParams(location.search);
const renderMode = presentQuery.has("check") || presentQuery.has("slide");

// 1) 장 번호 앞에 섹션 이름(장에 data-section이 있으면 그것을 쓴다)
const SECTIONS = [[1, "들어가며"], [6, "AI 발전 속도"], [10, "전문가 예상"], [13, "실제 고용"], [19, "속도를 바꾸는 조건"], [23, "2036 추정"], [30, "반대 증거"], [31, "분석 계획"], [33, "한계"], [34, "출처"]];
const sectionOf = (i) => slides[i].dataset.section || [...SECTIONS].reverse().find(([from]) => i + 1 >= from)?.[1] || "";
slides.forEach((s, i) => {
  const pg = s.querySelector(".pg");
  if (!pg) return;
  const n = pg.querySelector("b");
  const t = pg.querySelector(".tot");
  if (n) n.textContent = String(i + 1);
  if (t) t.textContent = String(total);
  const sec = sectionOf(i);
  if (sec && !pg.dataset.section) { pg.dataset.section = sec; pg.prepend(`${sec} · `); } // 글자 마디만 더한다(꼬리말 배치는 그대로)
});

// 2) 외부 링크: 행선지와 '새 탭'을 이름에 넣고, 글자 끝에 ↗ 표시(controls.css가 [data-ext]::after로 그린다)
const siteOf = (host) => (/youtu/.test(host) ? "YouTube" : /github/.test(host) ? "GitHub" : host.replace(/^www\./, ""));
for (const a of document.querySelectorAll(".slide a[href^='http']")) {
  const site = siteOf(new URL(a.href).hostname);
  const text = (a.innerText || a.textContent).replace(/\s+/g, " ").trim();
  if (a.target === "_blank") {
    if (!/noopener/.test(a.rel)) a.rel = `${a.rel} noopener`.trim();
    if (!/새 탭/.test(a.getAttribute("aria-label") || "")) a.setAttribute("aria-label", `${text} (새 탭에서 ${site} 열기)`);
    if (!a.title) a.title = `새 탭에서 ${site} 열기 ↗`;
  }
  (a.querySelector(".vcap") || a).setAttribute("data-ext", "");
}

let current = 0;
window.__deckCurrentSlide = () => current;
if (renderMode) return;

// 3) 무대
const root = document.documentElement;
const body = document.body;
const deck = document.querySelector(".deck");
root.classList.add("deck-js");
body.classList.add("stage");
deck.classList.add("t-page-slide");
slides.forEach((s) => s.classList.add("t-page"));
const css = getComputedStyle(root);
const msVar = (name) => { const v = css.getPropertyValue(name).trim(); const n = parseFloat(v); return Number.isFinite(n) ? (/ms$/.test(v) ? n : n * 1000) : 0; };
const HINT_HOLD = msVar("--hint-hold");
const IDLE_AFTER = msVar("--idle-after");
const QUICK = msVar("--duration-quick");
const FAST = msVar("--duration-fast");
const baseTitle = document.title;
// 헤드라인 글자(줄바꿈 <br>·계단 문장 줄은 띄어 읽는다)
const textOf = (e) => { if (!e) return ""; const c = e.cloneNode(true); c.querySelectorAll("br").forEach((b) => b.replaceWith(" ")); c.querySelectorAll(".lines > span").forEach((x) => x.after(" ")); return c.textContent.replace(/\s+/g, " ").trim(); };
const headOf = (s) => textOf(s.querySelector(".headline, h1, h2") || s.querySelector(".lines, p"));
const isTouch = () => navigator.maxTouchPoints > 0 && matchMedia("(pointer: coarse)").matches;
const store = {
  get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* 저장소가 막혀도 동작은 같다 */ } },
};

// 3-1) 조작부 만들기(아이콘은 24 격자·2px 선 한 세트)
const ICON = {
  prev: '<path d="M15 18l-6-6 6-6"/>',
  next: '<path d="M9 18l6-6-6-6"/>',
  overview: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
  fsOn: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  fsOff: '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>',
  replay: '<path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 4v4h4"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  first: '<path d="M11 18l-6-6 6-6M19 18l-6-6 6-6"/>',
};
const svg = (name) => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON[name]}</svg>`;
const el = (tag, attrs = {}, html = "") => { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); e.innerHTML = html; return e; };
const button = (name, label, keyHint, cls = "") => el("button", { type: "button", class: `deck-btn ${cls}`.trim(), "aria-label": label, title: keyHint ? `${label} (${keyHint})` : label }, svg(name));

const fsOK = !!(document.fullscreenEnabled && root.requestFullscreen);
const ui = {
  util: el("div", { class: "deck-ui deck-group util", role: "group", "aria-label": "발표 도구" }),
  prevG: el("div", { class: "deck-ui deck-group prev" }),
  nextG: el("div", { class: "deck-ui deck-group next" }),
  overview: button("overview", "개요", "G"),
  fullscreen: fsOK ? button("fsOn", "전체 화면", "F") : null,
  replay: button("replay", "다시 재생", "R"),
  prev: button("prev", "이전 장", "←"),
  next: button("next", "다음 장", "→", "is-next"),
  progress: el("div", { class: "deck-ui deck-progress", role: "progressbar", "aria-label": "진행", "aria-valuemin": "1", "aria-valuemax": String(total) }),
  hint: el("div", { class: "deck-ui deck-hint", hidden: "" }),
  end: el("div", { class: "deck-ui deck-end", hidden: "", role: "status" }),
  note: el("div", { class: "deck-ui deck-note" }, "옆으로 밀어 넘기고 가로로 돌리면 크게 봅니다"),
  read: el("div", { class: "deck-ui deck-read", "aria-hidden": "true" }),
  barbg: el("div", { class: "deck-ui deck-barbg", "aria-hidden": "true" }),
  live: el("div", { class: "deck-ui deck-live", "aria-live": "polite", "aria-atomic": "true" }),
  ovHead: el("header", { class: "deck-ov-head" }, "<h2>전체 " + total + "장</h2>"),
  ovClose: el("button", { type: "button", class: "deck-btn has-text", "aria-label": "개요 닫기", title: "개요 닫기 (Esc)" }, svg("close") + "<span>닫기</span>"),
  first: el("button", { type: "button", class: "deck-btn has-text", "aria-label": "처음으로", title: "처음으로 (Home)" }, svg("first") + "<span>처음으로</span>"),
};
ui.util.append(...[ui.overview, ui.fullscreen, ui.replay].filter(Boolean));
ui.prevG.append(ui.prev);
ui.nextG.append(ui.next);
ui.progress.innerHTML = '<span><b></b> / ' + total + '</span><span class="track" aria-hidden="true"><span class="fill"></span></span>';
ui.end.innerHTML = "<span>마지막 장입니다</span>";
ui.end.append(ui.first);
ui.ovHead.append(ui.ovClose);
body.append(ui.barbg, ui.read, ui.note, ui.util, ui.progress, ui.prevG, ui.nextG, ui.hint, ui.end, ui.live, ui.ovHead);
const shadow = ui.read.attachShadow({ mode: "open" });
shadow.innerHTML = ["deck.css", "slides.css", "controls.css"].map((f) => `<link rel="stylesheet" href="src/${f}">`).join("") + '<div class="read-root"></div>';
const readRoot = shadow.querySelector(".read-root");

// 3-2) 배치: 모드(막대·기둥·읽기 칸)와 배율. 안전 영역은 env()를 실제로 재서 넘긴다
const probe = el("div", { "aria-hidden": "true", class: "deck-safe" });
body.append(probe);
let mode = "bar";
const layout = () => {
  const p = getComputedStyle(probe);
  const L = window.__deckLayout({ t: parseFloat(p.paddingTop) || 0, r: parseFloat(p.paddingRight) || 0, b: parseFloat(p.paddingBottom) || 0, l: parseFloat(p.paddingLeft) || 0 });
  const was = mode;
  mode = L.mode;
  body.classList.toggle("portrait", mode === "panel");
  if (was !== mode) setTimeout(() => renderRead(), 0); // 돌려서 세로가 되면 읽기 칸을 채운다
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
  ui.fullscreen.innerHTML = svg(on ? "fsOff" : "fsOn");
});
layout();

// 3-3) 알림·안내·끝 표시
const announce = (t) => { ui.live.textContent = ""; requestAnimationFrame(() => { ui.live.textContent = t; }); };
const toast = (node, open, instant = false) => {
  if (open) { node.hidden = false; void node.offsetWidth; node.classList.add("is-open"); }
  else if (!node.hidden) {
    node.classList.remove("is-open");
    if (instant) node.hidden = true; // 장을 넘기면 바로 치운다
    else setTimeout(() => { if (!node.classList.contains("is-open")) node.hidden = true; }, FAST);
  }
  body.classList.toggle("has-toast", !ui.hint.hidden && ui.hint.classList.contains("is-open") || ui.end.classList.contains("is-open"));
};
let hintTimer = 0;
const showHint = () => {
  if (mode === "panel") return; // 세로 칸은 알림 줄이 늘 같은 말을 한다
  ui.hint.textContent = isTouch() ? "옆으로 밀어 넘깁니다" : "→ 키나 Space로 넘깁니다 · 물음표 키로 이 안내를 다시 봅니다";
  toast(ui.hint, true);
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => toast(ui.hint, false), HINT_HOLD);
};
const hideHint = () => { clearTimeout(hintTimer); toast(ui.hint, false); };
const showEnd = () => { toast(ui.end, true); announce(`마지막 장입니다 · ${total} / ${total}`); };

// 3-4) 장 이동
const update = () => {
  const n = current + 1;
  ui.progress.querySelector("b").textContent = String(n);
  ui.progress.setAttribute("aria-valuenow", String(n));
  ui.progress.setAttribute("aria-valuetext", `${total}장 중 ${n}장`);
  ui.progress.style.setProperty("--deck-pct", `${(n / total) * 100}%`); // 루트에 두면 덱 전체 스타일을 다시 계산한다
  ui.prev.setAttribute("aria-disabled", String(current === 0));
  ui.next.setAttribute("aria-disabled", String(current === total - 1));
  document.title = `${baseTitle} (${n}/${total})`;
};
let readTimer = 0;
// 읽기 칸에 넣을 사본: 차트 빌드 도중이어도 완성 모습으로(모션이 남긴 투명도·변형·선 길이 인라인 값을 지운다)
const marks = new Map();
const marksOf = (s) => {
  if (marks.has(s)) return marks.get(s);
  const out = [];
  [...s.querySelectorAll("*")].forEach((o, i) => {
    if (o instanceof SVGElement && o.tagName !== "svg") return;
    const st = getComputedStyle(o);
    const digits = o.matches(".t-num, .t-digit-group"); // 쪼갠 숫자 묶음은 한 줄 그대로
    let rd = "";
    if (/^(flex|grid)$/.test(st.display) && !digits && o.offsetWidth > 480) rd = "stack"; // 칸보다 넓은 가로 배치만 한 열로
    else if (/^inline-(flex|grid)$/.test(st.display) && !digits) rd = "inline";
    if (/^(absolute|fixed)$/.test(st.position)) rd = "abs";
    else if (!rd && st.display === "block" && o.tagName !== "svg" && !o.querySelector("svg")) rd = "box";
    const wide = ["paddingLeft", "paddingRight", "marginLeft"].filter((k) => parseFloat(st[k]) > 48); // 계단·들여쓰기는 좁은 칸에서 없앤다
    if (rd || wide.length) out.push([i, rd, wide]);
  });
  marks.set(s, out);
  return out;
};
const lum = (rgb) => { const m = rgb.match(/[\d.]+/g); if (!m) return 1; const [r, g, b] = m.map(Number); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };
const cloneSlide = (s) => {
  const c = s.cloneNode(true);
  c.className = `r-slide ${[...s.classList].filter((k) => !/^(slide|t-page|t-stagger|is-)/.test(k)).join(" ")}`;
  // 원본 배치를 보고 한 열로 풀 상자를 표시한다(장 클래스와 무관). 1920 캔버스 배치는 화면과 상관없어 장마다 한 번만 잰다
  const to = [...c.querySelectorAll("*")];
  marksOf(s).forEach(([i, rd, wide]) => { const x = to[i]; if (!x) return; if (rd) x.dataset.rd = rd; for (const side of wide) x.style[side] = "0"; });
  for (const t of c.querySelectorAll("table")) { const w = document.createElement("div"); w.className = "r-scroll"; t.replaceWith(w); w.append(t); }
  // 바탕·글자색은 원본 장에서 가져온다. 사진 위 밝은 글자처럼 바탕이 비치지 않으면 어두운 바탕을 깐다
  const ss = getComputedStyle(s);
  const ink = getComputedStyle(s.querySelector(".headline, h1, h2, p") || s).color;
  const bg = ss.backgroundColor;
  c.style.background = lum(ink) > 0.6 && lum(bg) > 0.6 ? "var(--soot)" : bg;
  c.style.color = ss.color;
  c.style.setProperty("--note", ss.getPropertyValue("--note"));
  for (const x of c.querySelectorAll("a, button, [tabindex]")) x.setAttribute("tabindex", "-1");
  c.removeAttribute("inert");
  c.removeAttribute("aria-current");
  for (const x of c.querySelectorAll("svg *[style]")) for (const k of ["opacity", "transform", "stroke-dasharray", "stroke-dashoffset"]) x.style.removeProperty(k);
  for (const x of c.querySelectorAll("svg [draw]")) for (const k of ["draw", "pathLength", "stroke-dasharray", "stroke-dashoffset"]) x.removeAttribute(k); // 선 그리기 도중 값
  // 링크 사이의 가운뎃점 글자는 세로로 쌓으면 혼자 남으므로 뺀다
  for (const a of c.querySelectorAll("a")) for (const n of [a.previousSibling, a.nextSibling]) if (n && n.nodeType === 3 && /^\s*·\s*$/.test(n.textContent)) n.remove();
  return c;
};
const renderRead = () => {
  if (mode !== "panel") { readRoot.replaceChildren(); return; }
  readRoot.replaceChildren(cloneSlide(slides[current]));
  ui.read.scrollTop = 0;
  const idle = window.requestIdleCallback || ((f) => setTimeout(f, FAST));
  idle(() => [current + 1, current - 1].forEach((j) => slides[j] && marksOf(slides[j]))); // 옆 장 배치는 쉬는 틈에 미리 잰다
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
  toast(ui.end, false, true);
  if (prev !== current || opts.force) { clearTimeout(hintTimer); toast(ui.hint, false, true); }
  update();
  clearTimeout(readTimer);
  readTimer = setTimeout(renderRead, mode === "panel" ? FAST + QUICK : 0); // 장 전환이 끝난 다음에 읽기 칸을 다시 그린다(전환 프레임과 겹치지 않게)
  announce(`${current + 1} / ${total} · ${headOf(slides[current])}`);
  document.dispatchEvent(new CustomEvent("slidechange", { detail: { index: current, prev } }));
};
const parseHash = () => { const n = parseInt(location.hash.slice(1), 10); return Number.isFinite(n) ? n - 1 : 0; };
const fromAddress = () => { const i = parseHash(); if (Math.max(0, Math.min(total - 1, i)) !== current || body.classList.contains("overview")) { closeOverview(); go(i); } else history.replaceState(null, "", `#${current + 1}`); };
window.addEventListener("hashchange", fromAddress);
window.addEventListener("popstate", fromAddress);

// 개요를 열고 닫을 때는 34장이 한꺼번에 미끄러지지 않도록 전환 없이 바로 자리를 잡는다
const snap = (change) => { deck.classList.add("no-trans"); change(); void deck.offsetWidth; deck.classList.remove("no-trans"); };

// 3-5) 개요(G·O 키·개요 버튼으로 열고, Esc·닫기·장 선택으로 닫는다)
const inner = new Map();
let returnFocus = null;
const openOverview = () => {
  if (body.classList.contains("overview")) return;
  returnFocus = document.activeElement;
  hideHint(); toast(ui.end, false);
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

// 3-6) 전체 화면(지원할 때만)
const toggleFullscreen = () => {
  if (!fsOK) return;
  const p = document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen();
  p?.catch?.(() => {});
};

// 3-7) 키보드
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
  else if (k === "?") { e.preventDefault(); showHint(); }
  else if (k === "Escape") { hideHint(); toast(ui.end, false); }
});

// 3-8) 버튼(포인터로 누른 뒤에는 포커스를 덱에 돌려 Space가 다음 장으로 가게 한다)
const press = (b, fn) => b?.addEventListener("click", (e) => {
  if (b.getAttribute("aria-disabled") === "true") { if (b === ui.next) showEnd(); return; }
  fn();
  if (e.detail > 0) b.blur();
});
press(ui.prev, () => go(current - 1));
press(ui.next, () => go(current + 1));
press(ui.overview, openOverview);
press(ui.fullscreen, toggleFullscreen);
press(ui.replay, () => document.dispatchEvent(new CustomEvent("deckreplay")));
press(ui.first, () => go(0, { push: true }));
press(ui.ovClose, () => closeOverview());
document.addEventListener("click", (e) => {
  if (!body.classList.contains("overview")) return;
  const s = e.target instanceof Element && e.target.closest(".slide");
  if (!s) return;
  e.preventDefault();
  closeOverview(slides.indexOf(s));
}, true);

// 3-9) 터치·펜 스와이프: 10px 뒤 방향을 정하고, 폭 20%(최대 120px) 또는 48px 이상 빠른 밀기면 넘긴다.
// 가장자리 16px에서 시작·두 손가락·확대 중·세로 우세는 넘기지 않고, 못 미치면 제자리로 돌아온다.
let sw = null;
const W = () => window.innerWidth;
const dragTarget = () => (mode === "panel" ? null : slides[current]);
const settle = (s) => { if (!s) return; s.classList.remove("is-dragging"); s.classList.add("is-settling"); s.style.transform = ""; setTimeout(() => s.classList.remove("is-settling"), FAST); };
document.addEventListener("pointerdown", (e) => {
  if (e.pointerType === "mouse" || body.classList.contains("overview")) return;
  if (sw) { settle(sw.drag ? dragTarget() : null); sw = null; return; } // 두 번째 손가락
  if (e.target instanceof Element && e.target.closest(".deck-btn, .deck-group, .deck-progress")) return;
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
    const k = parseFloat(root.style.getPropertyValue("--deck-k")) || 1;
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

// 3-10) 포인터가 3초 멈추면 조작부를 흐리게. 움직이거나 누르면 바로 돌아오고, 조작부에 포커스가 있으면 숨지 않는다
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

// 4) 시작
document.getElementById("deck-boot")?.remove();
current = -1;
go(parseHash());
root.classList.add("deck-ready");
if (!store.get("deck-hint")) { store.set("deck-hint", "1"); showHint(); }

// 인쇄: 개요가 열려 있으면 닫고 그린다(최종 상태 자체는 controls.css의 @media print가 강제한다)
window.addEventListener("beforeprint", () => closeOverview());
})();

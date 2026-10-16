// 발표 무대: 한 장씩 보여 주고, 장 사이는 Transitions.dev의 페이지 좌우 전환(.t-page-slide)을 쓴다.
// ?check / ?slide=n(렌더) 에서는 무대를 만들지 않는다.
(() => {
const slides = [...document.querySelectorAll(".slide")];
const presentQuery = new URLSearchParams(location.search);
slides.forEach((s, i) => {
  const n = s.querySelector(".pg b");
  const t = s.querySelector(".pg .tot");
  if (n) n.textContent = String(i + 1);
  if (t) t.textContent = String(slides.length);
});

let current = 0;
window.__deckCurrentSlide = () => current;
const renderMode = presentQuery.has("check") || presentQuery.has("slide");

if (!renderMode) {
  const deck = document.querySelector(".deck");
  document.body.classList.add("stage");
  deck.classList.add("t-page-slide");
  slides.forEach((s) => s.classList.add("t-page"));

  const fit = () => {
    if (document.body.classList.contains("overview")) { deck.style.transform = ""; return; }
    const k = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    deck.style.transform = `scale(${k}) translate(-50%, -50%)`;
  };
  const go = (i) => {
    const prev = current;
    current = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((s, j) => { s.dataset.side = j < current ? "before" : j > current ? "after" : "current"; });
    history.replaceState(null, "", `#${current + 1}`);
    document.dispatchEvent(new CustomEvent("slidechange", { detail: { index: current, prev } }));
  };

  // 개요를 열고 닫을 때는 34장이 한꺼번에 미끄러지지 않도록 전환 없이 바로 자리를 잡는다
  const snap = (change) => { deck.classList.add("no-trans"); change(); void deck.offsetWidth; deck.classList.remove("no-trans"); };

  window.addEventListener("resize", fit);
  window.addEventListener("beforeprint", () => { deck.style.transform = ""; });
  window.addEventListener("afterprint", fit);
  fit();
  go(Number((location.hash || "#1").slice(1)) - 1 || 0);

  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (k === "ArrowRight" || k === "ArrowDown" || k === "PageDown" || k === " ") { e.preventDefault(); go(current + 1); }
    else if (k === "ArrowLeft" || k === "ArrowUp" || k === "PageUp") { e.preventDefault(); go(current - 1); }
    else if (k === "Home") { e.preventDefault(); go(0); }
    else if (k === "End") { e.preventDefault(); go(slides.length - 1); }
    else if (k === "f" || k === "F") { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }
    else if (k === "Escape") { e.preventDefault(); snap(() => { document.body.classList.toggle("overview"); fit(); }); }
  });
  document.addEventListener("click", (e) => {
    if (!document.body.classList.contains("overview")) return;
    const s = e.target.closest(".slide");
    if (!s) return;
    snap(() => { document.body.classList.remove("overview"); fit(); go(slides.indexOf(s)); });
  });
}

})();

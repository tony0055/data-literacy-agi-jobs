window.__jsErrors = [];
window.addEventListener("error", (e) => window.__jsErrors.push(`${e.message} @ ${(e.filename || "").split("/").pop()}:${e.lineno}`));
window.addEventListener("unhandledrejection", (e) => window.__jsErrors.push(`unhandled rejection: ${e.reason}`));

const fitParams = new URLSearchParams(location.search);
const soloSlide = Number(fitParams.get("slide"));
if (soloSlide) {
  document.body.classList.add("solo");
  document.querySelectorAll(".slide").forEach((s, i) => { s.hidden = i + 1 !== soloSlide; });
}

if (fitParams.has("check")) {
  const BODY_FLOOR = 18;
  const HARD_FLOOR = 14;
  const TERTIARY = ".kicker, .who .when *, .tone-table th, .poster .s, .cover .bar, .cover .bar *, .cover .row, .who .name, .who .when, .tile .tag, .chart-src *, .plan th, .foot, .foot *, .tag, .chart-src, .chart-src *, .chart-sub, .legend, .legend *, .meta, .p-no, .chip, .idx, .key .k, .tone th, [data-type-ok], [data-type-ok] *";
  const CLIPPABLE = ".body, .card, .stack, .chart, .ask, .key, .eq, .vs, [data-check-fit]";

  document.fonts.ready.then(() => {
    const label = (el) => `${el.tagName.toLowerCase()}.${[...el.classList].join(".")} "${(el.textContent || "").trim().slice(0, 24)}"`;
    const lineCount = (el) => {
      const lh = parseFloat(getComputedStyle(el).lineHeight);
      return Number.isFinite(lh) && lh > 0 ? Math.round(el.getBoundingClientRect().height / lh) : 0;
    };

    const slides = [...document.querySelectorAll(".slide")].map((s, i) => {
      const r = s.getBoundingClientRect();
      const over = [...s.querySelectorAll("*")].filter((el) => {
        const b = el.getBoundingClientRect();
        return b.width > 0 && (b.right > r.right + 1 || b.bottom > r.bottom + 1 || b.left < r.left - 1 || b.top < r.top - 1);
      }).slice(0, 6).map(label);

      const clipped = [...s.querySelectorAll(CLIPPABLE)]
        .filter((el) => el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2)
        .slice(0, 6).map((el) => `${label(el)} +${el.scrollHeight - el.clientHeight}h +${el.scrollWidth - el.clientWidth}w`);

      const tiny = [...s.querySelectorAll("*")].filter((el) => {
        if (!el.firstChild || el.firstChild.nodeType !== 3 || !el.textContent.trim()) return false;
        const px = parseFloat(getComputedStyle(el).fontSize);
        if (px < HARD_FLOOR) return true;
        return px < BODY_FLOOR && !el.matches(TERTIARY) && !(el.parentElement && el.parentElement.matches(".sowe"));
      }).slice(0, 6).map((el) => `${label(el)} ${getComputedStyle(el).fontSize}`);

      // 차트는 칸에 맞춰 비율째 줄어든다. 줄어든 뒤의 실제 글자 크기로 잰다.
      [...s.querySelectorAll(".chart svg, .chainwrap svg")].forEach((svg) => {
        const vb = svg.viewBox.baseVal;
        const b = svg.getBoundingClientRect();
        if (!vb || !vb.width || !b.width) return;
        const k = Math.min(b.width / vb.width, b.height / vb.height);
        const t = svg.querySelector("text");
        const px = t ? parseFloat(getComputedStyle(t).fontSize) * k : 99;
        if (px < 15) tiny.push(`svg "${(svg.getAttribute("aria-label") || svg.closest("[data-chart]")?.dataset.chart || "").slice(0, 24)}" 축소 ${k.toFixed(2)} → 글자 ${px.toFixed(1)}px`);
      });

      const head = s.querySelector(".headline");
      const allowed = head ? (head.innerHTML.match(/<br/g) || []).length + 1 : 1; // 의도한 줄바꿈(<br>)만 허용
      return { n: i + 1, over, clipped, headLines: head ? lineCount(head) : 0, allowed, tiny };
    }).filter((x) => x.over.length || x.clipped.length || x.headLines > x.allowed || x.tiny.length);

    const report = window.__jsErrors.length ? [{ jsErrors: window.__jsErrors }, ...slides] : slides;
    const pre = document.createElement("pre");
    pre.id = "report";
    pre.textContent = JSON.stringify(report);
    document.body.append(pre);
  });
}

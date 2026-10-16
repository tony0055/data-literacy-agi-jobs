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
  const TERTIARY = ".band.head-band p, .gates td.yr span, .video .vcap, .chain text, .plug, .credit, .kicker, .who .when *, .tone-table th, .poster .s, .cover .bar, .cover .bar *, .cover .row, .who .name, .who .when, .tile .tag, .chart-src *, .plan th, .foot, .foot *, .tag, .chart-src, .chart-src *, .chart-sub, .legend, .legend *, .meta, .p-no, .chip, .idx, .key .k, .tone th, [data-type-ok], [data-type-ok] *";
  const TERTIARY_LIST = TERTIARY.split(",").map((x) => x.trim()).filter(Boolean);
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

      // 3차 정보 예외(TERTIARY·결론 띠 안)는 숨기지 않고 excepted에 '예외로 넘김'으로 남긴다.
      // 14px 하드 하한 아래는 예외 목록에 있어도 실패다.
      const tiny = [];
      const excepted = [];
      const why = (el) => {
        const hit = TERTIARY_LIST.find((sel) => el.matches(sel));
        if (hit) return hit;
        return el.parentElement && el.parentElement.matches(".sowe") ? ".sowe > *" : null;
      };
      for (const el of s.querySelectorAll("*")) {
        if (el.closest(".chart svg, .chainwrap svg")) continue; // 차트·도식 글자는 아래에서 축소 배율을 곱해 따로 잰다
        if (!el.firstChild || el.firstChild.nodeType !== 3 || !el.textContent.trim()) continue;
        const px = parseFloat(getComputedStyle(el).fontSize);
        if (px >= BODY_FLOOR) continue;
        const rule = why(el);
        if (px < HARD_FLOOR) tiny.push(`${label(el)} ${px}px${rule ? ` (예외 목록 ${rule}에 있어도 14px 미만)` : ""}`);
        else if (rule) excepted.push(`${label(el)} ${px}px — 예외로 넘김(${rule})`);
        else tiny.push(`${label(el)} ${px}px`);
      }

      // 차트·도식은 칸에 맞춰 비율째 줄어든다. 줄어든 뒤의 실제 글자 크기를 svg 안 모든 글자마다 잰다.
      [...s.querySelectorAll(".chart svg, .chainwrap svg")].forEach((svg) => {
        const vb = svg.viewBox.baseVal;
        const b = svg.getBoundingClientRect();
        if (!vb || !vb.width || !b.width) return;
        const k = Math.min(b.width / vb.width, b.height / vb.height);
        const name = (svg.getAttribute("aria-label") || svg.closest("[data-chart]")?.dataset.chart || svg.getAttribute("class") || "").slice(0, 24);
        for (const t of svg.querySelectorAll("text")) {
          if (!t.textContent.trim()) continue;
          const px = parseFloat(getComputedStyle(t).fontSize) * k;
          if (px >= BODY_FLOOR) continue;
          const rule = why(t);
          const what = `svg "${name}" ${label(t)} 축소 ${k.toFixed(2)} → 글자 ${px.toFixed(1)}px`;
          if (px < HARD_FLOOR) tiny.push(rule ? `${what} (예외 목록 ${rule}에 있어도 14px 미만)` : what);
          else if (rule) excepted.push(`${what} — 예외로 넘김(${rule})`);
          else tiny.push(what);
        }
      });

      const head = s.querySelector(".headline");
      const allowed = head ? (head.innerHTML.match(/<br/g) || []).length + 1 : 1; // 의도한 줄바꿈(<br>)만 허용
      return { n: i + 1, over, clipped, headLines: head ? lineCount(head) : 0, allowed, tiny: tiny.slice(0, 12), excepted };
    });

    const failing = slides.filter((x) => x.over.length || x.clipped.length || x.headLines > x.allowed || x.tiny.length)
      .map(({ excepted, ...rest }) => rest);
    const exceptedReport = slides.filter((x) => x.excepted.length).map((x) => ({ n: x.n, excepted: x.excepted }));

    const report = window.__jsErrors.length ? [{ jsErrors: window.__jsErrors }, ...failing] : failing;
    const pre = document.createElement("pre");
    pre.id = "report";
    pre.textContent = JSON.stringify(report);
    const pre2 = document.createElement("pre");
    pre2.id = "report-excepted";
    pre2.textContent = JSON.stringify(exceptedReport);
    document.body.append(pre2, pre); // #report를 마지막에 붙인다(읽는 쪽이 #report가 생기면 둘 다 있다고 본다)
  });
}

// 공통 덱 스킬(designing-decks-and-motion)의 scripts/deck-fit.js를 복사해 이 덱에 맞춘 것.
// 바꾼 것(이유는 design-standard/README.md 「검사」):
//  1) 캔버스 1920 → 80rem(1280 논리 px). 장 크기는 deck.css가 정하고 발표 무대 배치는 present.js가 맡아서, 화면 맞춤(zoom) 부분은 뺐다.
//  2) tiny(작은 글자) 기준을 제품 디자인 시스템 바닥 12px(TY-08, type-caption)로: 12px 미만은 어디서든 실패.
//     차트·도식 svg 글자는 viewBox 대비 실제 그려진 크기로 잰다.
//  3) headLines: .headline이 의도한 줄 수(<br> 수 + 1)를 넘는지.
//  4) clipped: 새 뼈대·패턴 상자(.body · .chart · 묶음 .group__rows · .group__row · .group__cols · .group__cell · .table · .timeline__item · .takeaway · .media · [data-check-fit]).
//  5) ?only=5-14면 그 범위 장만 보고한다(렌더 범위와 같게).
//  6) footLines: 꼬리말 출처(.foot .source)가 두 줄을 넘는지 — 꼬리말 높이가 캡션 두 줄로 고정이라 세 줄부터 위 선을 넘는다
//     (넘친 줄은 꼬리말 상자 위로 올라가 clipped · over로 잡히지 않았다, 2026. 10. 21. 1장).
//  7) 덱 표(.table--wrap)의 걸침(deck.css — 좌우 24 · 아래 16, 행 바탕 자리라 글이 없다)은 잘림으로 세지 않는다(아래 16은 3회차 SL3-07).
//  8) 본문 아래로 나간 요소: 본문(.body) 안 글 · 그림 요소의 아래 끝이 본문 아래 끝을 넘으면 clipped에 「본문 아래 +N」로 적는다 — 넘친 각주가
//     본문 상자 크기를 바꾸지 않아 scrollHeight로 잡히지 않은 일이 있었다(3회차, 3장 각주 9px). 각주(.footnote)도 잘림 검사 대상에 넣었다.
//     링크의 보이지 않는 누름 여백(a.link · a[data-hit])과 덱 표 아래 걸침은 빼고 잰다.
window.__jsErrors = [];
window.addEventListener("error", (e) => window.__jsErrors.push(`${e.message} @ ${(e.filename || "").split("/").pop()}:${e.lineno}`));
window.addEventListener("unhandledrejection", (e) => window.__jsErrors.push(`unhandled rejection: ${e.reason}`));

const fitParams = new URLSearchParams(location.search);
const fitSolo = Number(fitParams.get("slide"));

if (fitSolo) {
  document.body.classList.add("solo");
  document.querySelectorAll(".slide").forEach((s, i) => { s.hidden = i + 1 !== fitSolo; });
}

if (fitParams.has("check")) {
  const HARD_FLOOR = 12;
  const CLIPPABLE = ".body, .chart, .group__rows, .group__row, .group__cols, .group__cell, .table, .timeline__item, .takeaway, .media, .footnote, [data-check-fit]";
  const [onlyFrom, onlyTo] = (fitParams.get("only") || "").split("-").map(Number);
  const inRange = (n) => !onlyFrom || (n >= onlyFrom && n <= (onlyTo || onlyFrom));

  document.fonts.ready.then(() => {
    const label = (el) => `${el.tagName.toLowerCase()}${el.classList.length ? "." + [...el.classList].join(".") : ""} "${(el.textContent || "").trim().slice(0, 24)}"`;
    const lineCount = (el) => {
      const lh = parseFloat(getComputedStyle(el).lineHeight);
      return Number.isFinite(lh) && lh > 0 ? Math.round(el.getBoundingClientRect().height / lh) : 0;
    };

    const slides = [...document.querySelectorAll(".slide")].map((s, i) => {
      const n = i + 1;
      if (!inRange(n)) return null;
      const r = s.getBoundingClientRect();
      const over = [...s.querySelectorAll("*")].filter((el) => {
        if (el.closest("svg") && el.tagName !== "svg") return false;
        const b = el.getBoundingClientRect();
        return b.width > 0 && (b.right > r.right + 1 || b.bottom > r.bottom + 1 || b.left < r.left - 1 || b.top < r.top - 1);
      }).slice(0, 6).map(label);

      // 덱 표(.table--wrap)는 칸 글을 본문 시작선에 맞추려고 좌우로 걸친다(deck.css) — 그 폭은 넘침으로 세지 않는다
      const hangOf = (el) => { const t = el.matches(".table--wrap") ? el : el.querySelector(".table--wrap"); return t ? Math.max(0, -parseFloat(getComputedStyle(t).marginInlineEnd) || 0) : 0; };
      const vHangOf = (el) => Math.max(0, ...[...el.querySelectorAll(".table--wrap")].map((t) => -parseFloat(getComputedStyle(t).marginBlockEnd) || 0));
      const clipped = [...s.querySelectorAll(CLIPPABLE)]
        .filter((el) => el.scrollHeight > el.clientHeight + 2 + vHangOf(el) || el.scrollWidth > el.clientWidth + 2 + hangOf(el))
        .slice(0, 6).map((el) => `${label(el)} +${el.scrollHeight - el.clientHeight}h +${el.scrollWidth - el.clientWidth}w`);
      const body = s.querySelector(".body");
      if (body) {
        const bb = body.getBoundingClientRect().bottom;
        const below = [...body.querySelectorAll("*")].filter((el) => !el.closest("svg") || el.tagName === "svg")
          .map((el) => {
            const t = el.closest(".table--wrap"); const hang = t ? Math.max(0, -parseFloat(getComputedStyle(t).marginBlockEnd) || 0) : 0;
            // 링크의 누름 여백(controls.css --hit, 보이지 않는 안쪽 여백)은 빼고 보이는 글자 상자로 잰다
            const hit = el.matches("a.link, a[data-hit]") ? parseFloat(getComputedStyle(el).paddingBottom) || 0 : 0;
            return { el, over: el.getBoundingClientRect().bottom - hit - bb - hang };
          })
          .filter((x) => x.over > 1 && x.el.getBoundingClientRect().height > 0)
          .sort((a, b) => b.over - a.over);
        if (below.length) clipped.push(`${label(below[0].el)} 본문 아래 +${Math.round(below[0].over)}`);
      }

      const tiny = [];
      for (const el of s.querySelectorAll("*")) {
        if (el.closest("svg")) continue;
        if (!el.firstChild || el.firstChild.nodeType !== 3 || !el.textContent.trim()) continue;
        const px = parseFloat(getComputedStyle(el).fontSize);
        if (px < HARD_FLOOR) tiny.push(`${label(el)} ${px}px`);
      }
      for (const svg of s.querySelectorAll("svg[viewBox]")) {
        const vb = svg.viewBox.baseVal;
        const b = svg.getBoundingClientRect();
        if (!vb || !vb.width || !b.width) continue;
        const k = Math.min(b.width / vb.width, b.height / vb.height);
        for (const t of svg.querySelectorAll("text")) {
          if (!t.textContent.trim()) continue;
          const px = parseFloat(getComputedStyle(t).fontSize) * k;
          if (px < HARD_FLOOR - 0.05) tiny.push(`svg ${label(t)} 축소 ${k.toFixed(2)} → ${px.toFixed(1)}px`);
        }
      }

      const head = s.querySelector(".headline");
      const allowed = head ? (head.innerHTML.match(/<br/g) || []).length + 1 : 1;
      const src = s.querySelector(".foot .source");
      const footLines = src ? lineCount(src) : 0;
      return { n, over, clipped, headLines: head ? lineCount(head) : 0, allowed, footLines, tiny: tiny.slice(0, 8) };
    }).filter((x) => x && (x.over.length || x.clipped.length || x.headLines > x.allowed || x.footLines > 2 || x.tiny.length));

    const report = window.__jsErrors.length ? [{ jsErrors: window.__jsErrors }, ...slides] : slides;
    const pre = document.createElement("pre");
    pre.id = "report";
    pre.textContent = JSON.stringify(report);
    document.body.append(pre);
  });
}

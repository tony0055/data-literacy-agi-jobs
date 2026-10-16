// visual-qa.ts가 페이지 안에 넣는 측정 함수. 덱 코드는 건드리지 않고 DOM·계산 스타일·상자만 읽는다.
// window.__vqa.slide()  : ?slide=n 렌더(1920×1080)에서 보이는 장 하나를 잰다
// window.__vqa.stage()  : 발표 무대(index.html#n)에서 뷰포트·고정 컨트롤·배율을 잰다
// window.__vqa.stageAll(): 무대에서 34장을 차례로 넘기며 고정 요소와 장 안 요소의 겹침을 잰다
(() => {
  const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d;
  const parse = (s) => {
    if (!s) return null;
    let m = s.match(/rgba?\(([^)]+)\)/);
    if (m) {
      const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
      return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
    }
    m = s.match(/color\(srgb ([^)]+)\)/);
    if (m) {
      const p = m[1].split(/[\s/]+/).filter(Boolean).map(Number);
      return [p[0] * 255, p[1] * 255, p[2] * 255, p.length > 3 ? p[3] : 1];
    }
    return null;
  };
  const over = (top, bot) => {
    const a = top[3] + bot[3] * (1 - top[3]);
    if (a === 0) return [0, 0, 0, 0];
    return [0, 1, 2].map((i) => (top[i] * top[3] + bot[i] * bot[3] * (1 - top[3])) / a).concat(a);
  };
  const css = (s) => (s ? `rgba(${s.slice(0, 3).map((v) => Math.round(v)).join(",")},${round(s[3], 3)})` : null);
  const cs = (el, p) => getComputedStyle(el, p);
  const label = (el) => {
    const c = typeof el.className === "string" ? el.className : el.className?.baseVal || "";
    return `${el.tagName.toLowerCase()}${c ? "." + c.trim().split(/\s+/).join(".") : ""} "${(el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 28)}"`;
  };
  const directText = (el) => [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").replace(/\s+/g, " ").trim();
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return false;
    const s = cs(el);
    return s.display !== "none" && s.visibility !== "hidden";
  };
  const effOpacity = (el) => {
    let o = 1;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= parseFloat(cs(e).opacity);
    return o;
  };
  // 글자 뒤의 실제 불투명 바탕(조상 배경을 합성). 배경 그림·그라데이션이 끼면 kind를 알린다.
  const bgOf = (el) => {
    const layers = [];
    let kind = "solid";
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const s = cs(e);
      if (s.backgroundImage && s.backgroundImage !== "none") kind = /gradient/.test(s.backgroundImage) ? "gradient" : "image";
      const c = parse(s.backgroundColor);
      if (c && c[3] > 0) { layers.push(c); if (c[3] >= 0.999) break; }
    }
    let acc = [255, 255, 255, 1];
    for (let i = layers.length - 1; i >= 0; i--) acc = over(layers[i], acc);
    return { color: css(acc), kind };
  };
  const rectOfText = (el) => {
    const rects = [];
    for (const n of el.childNodes) {
      if (n.nodeType !== 3 || !n.textContent.trim()) continue;
      const r = document.createRange();
      r.selectNodeContents(n);
      for (const q of r.getClientRects()) if (q.width > 0 && q.height > 0) rects.push(q);
    }
    if (!rects.length) return el.getBoundingClientRect();
    const x = Math.min(...rects.map((q) => q.left)), y = Math.min(...rects.map((q) => q.top));
    return { left: x, top: y, right: Math.max(...rects.map((q) => q.right)), bottom: Math.max(...rects.map((q) => q.bottom)), width: Math.max(...rects.map((q) => q.right)) - x, height: Math.max(...rects.map((q) => q.bottom)) - y };
  };
  // 글자 하나하나의 상자로 줄을 나눈다(블록 요소 전체 글자 기준)
  const linesOf = (el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const chars = [];
    const r = document.createRange();
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const t = n.textContent;
      for (let i = 0; i < t.length; i++) {
        if (!t[i].trim()) { chars.push({ ch: " ", top: null }); continue; }
        r.setStart(n, i); r.setEnd(n, i + 1);
        const q = r.getBoundingClientRect();
        if (q.height === 0) continue;
        chars.push({ ch: t[i], top: q.top + q.height / 2 });
      }
    }
    const lines = [];
    for (const c of chars) {
      if (c.top === null) { if (lines.length) lines[lines.length - 1].text += " "; continue; }
      const last = lines[lines.length - 1];
      if (last && Math.abs(last.mid - c.top) < 6) last.text += c.ch;
      else lines.push({ mid: c.top, text: c.ch });
    }
    return lines.map((l) => l.text.replace(/\s+/g, " ").trim()).filter(Boolean);
  };
  const isBlock = (el) => !/^inline/.test(cs(el).display) || cs(el).display === "inline-block" || cs(el).display === "inline-flex";

  function slide(opts = {}) {
    const S = document.querySelector(".slide:not([hidden])") || document.querySelector(".slide");
    const all = [...document.querySelectorAll(".slide")];
    const n = all.indexOf(S) + 1;
    const SR = S.getBoundingClientRect();
    const rel = (r) => ({ x: round(r.left - SR.left), y: round(r.top - SR.top), w: round(r.width), h: round(r.height), r: round(r.right - SR.left), b: round(r.bottom - SR.top) });
    const els = [...S.querySelectorAll("*")];
    const imgs = [...S.querySelectorAll("img")].filter(visible);
    const imgRects = imgs.map((i) => i.getBoundingClientRect());
    const hit = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
    const svgScale = (t) => { const m = t.getScreenCTM?.(); return m ? Math.hypot(m.a, m.b) : 1; };
    const inside = (el, sel) => !!el.closest(sel);

    // 글자
    const texts = [];
    for (const el of els) {
      if (el.classList.contains("t-digit")) continue; // 쪼갠 숫자는 묶음(.t-digit-group) 하나로 센다
      const own = el.classList.contains("t-digit-group") ? el.textContent.trim() : directText(el);
      if (!own || !visible(el)) continue;
      const s = cs(el);
      const inSvg = el instanceof SVGElement;
      const fs = parseFloat(s.fontSize);
      const k = inSvg ? svgScale(el) : 1;
      const r = inSvg ? el.getBoundingClientRect() : rectOfText(el);
      const blk = !inSvg && isBlock(el);
      const lines = blk ? linesOf(el) : [];
      texts.push({
        i: texts.length, label: label(el), tag: el.tagName.toLowerCase(), cls: typeof el.className === "string" ? el.className : el.className.baseVal,
        own: own.slice(0, 160), full: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 400), inSvg, block: blk,
        rect: rel(r), fs, efs: round(fs * k, 2), k: round(k, 3), fw: Number(s.fontWeight), color: s.color, fill: inSvg ? s.fill : null,
        op: round(effOpacity(el), 3), ls: s.letterSpacing === "normal" ? 0 : parseFloat(s.letterSpacing), lh: s.lineHeight === "normal" ? "normal" : parseFloat(s.lineHeight),
        wb: s.wordBreak, tt: s.textTransform, ta: s.textAlign, ff: s.fontFamily, fst: s.fontStyle, tdl: s.textDecorationLine, fvn: s.fontVariantNumeric,
        us: s.userSelect || s.webkitUserSelect, to: s.textOverflow, ovx: s.overflowX, sw: el.scrollWidth, cw: el.clientWidth, ws: s.whiteSpace,
        bg: bgOf(el), overImg: !inside(el, "img") && imgRects.some((q) => hit(q, r)),
        ctx: ["headline", "kicker", "sowe", "foot", "source", "chart-src", "chart-sub", "chart-title", "pg", "tag", "legend", "card", "chart", "body", "head", "credit", "tile", "fig", "num", "who", "poster", "band", "plan", "tone-table", "chain", "cover", "bar", "pill", "video"].filter((c) => inside(el, "." + c)),
        ariaHidden: !!el.closest("[aria-hidden=true]"),
        lines: lines.length, lastLine: lines.length ? lines[lines.length - 1] : "", maxLine: lines.reduce((m, l) => Math.max(m, l.replace(/\s/g, "").length), 0),
        textShadow: s.textShadow, bgClip: s.webkitBackgroundClip || s.backgroundClip,
      });
    }

    // 경계가 보이는 상자(그림자·배경·테두리)
    const boxes = [];
    const boxOf = new Map();
    for (const el of els) {
      if (el instanceof SVGElement || el.tagName === "IMG" || !visible(el)) continue;
      const s = cs(el);
      const r = el.getBoundingClientRect();
      const bw = ["Top", "Right", "Bottom", "Left"].map((d) => parseFloat(s[`border${d}Width`]) || 0);
      const bs = ["Top", "Right", "Bottom", "Left"].map((d) => s[`border${d}Style`]);
      const bgc = parse(s.backgroundColor);
      const pbg = el.parentElement ? bgOf(el.parentElement).color : null;
      const own = bgc && bgc[3] > 0 ? css(over(bgc, parse(pbg) || [255, 255, 255, 1])) : null;
      const bgDiff = own && own !== pbg;
      const shadow = s.boxShadow !== "none";
      const border = bw.some((w, i) => w >= 1 && bs[i] !== "none" && bs[i] !== "hidden");
      const before = cs(el, "::before");
      const pseudo = before.content && before.content !== "none" && before.content !== "normal" ? { w: parseFloat(before.width) || 0, h: parseFloat(before.height) || 0, bg: before.backgroundColor } : null;
      if (!(shadow || border || bgDiff || s.backgroundImage !== "none")) { if (pseudo) boxes.push({ label: label(el), pseudoOnly: true, pseudo, rect: rel(r) }); continue; }
      const b = {
        i: boxes.length, label: label(el), tag: el.tagName.toLowerCase(), cls: el.className, rect: rel(r), display: s.display, position: s.position,
        shadow: s.boxShadow, border: bw, borderStyle: bs, borderColor: s.borderTopColor, bg: s.backgroundColor, bgImage: s.backgroundImage, bgEff: own, parentBg: pbg, bgDiff: !!bgDiff,
        radius: parseFloat(s.borderTopLeftRadius) || 0, pad: ["Top", "Right", "Bottom", "Left"].map((d) => parseFloat(s[`padding${d}`]) || 0),
        filter: s.filter, backdrop: s.backdropFilter || s.webkitBackdropFilter || "none", cursor: s.cursor, pseudo,
        inTable: !!el.closest("table"), inChart: !!el.closest(".chart"), contentH: null, parentBox: null,
      };
      // 안쪽 내용 높이(카드를 빈칸 채우기로 늘렸는지)
      const kids = [...el.children].filter(visible);
      if (kids.length) {
        const top = Math.min(...kids.map((k) => k.getBoundingClientRect().top)), bot = Math.max(...kids.map((k) => k.getBoundingClientRect().bottom));
        b.contentH = round(bot - top + b.pad[0] + b.pad[2]);
      }
      boxOf.set(el, b.i);
      boxes.push(b);
    }
    for (const [el, i] of boxOf) {
      for (let p = el.parentElement; p && p !== S; p = p.parentElement) if (boxOf.has(p)) { boxes[i].parentBox = boxOf.get(p); break; }
    }

    // 간격(계산값)
    const spacing = [];
    const sibGaps = [];
    for (const el of els) {
      if (el instanceof SVGElement || !visible(el)) continue;
      const s = cs(el);
      const vals = {};
      for (const p of ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "marginTop", "marginRight", "marginBottom", "marginLeft", "rowGap", "columnGap"]) {
        const v = parseFloat(s[p]);
        if (Number.isFinite(v) && v !== 0) vals[p] = v;
      }
      if (Object.keys(vals).length) spacing.push({ label: label(el), vals, hasSvg: !!el.querySelector("svg") });
      const kids = [...el.children].filter((k) => visible(k) && !/absolute|fixed/.test(cs(k).position) && !(k instanceof SVGElement) && k.tagName !== "BR");
      if (kids.length >= 3) {
        const rs = kids.map((k) => k.getBoundingClientRect());
        const gaps = [];
        for (let i = 1; i < rs.length; i++) {
          const a = rs[i - 1], b = rs[i];
          if (b.top >= a.bottom - 1) gaps.push(round(b.top - a.bottom, 0));
          else if (b.left >= a.right - 1) gaps.push(round(b.left - a.right, 0));
        }
        const uniq = [...new Set(gaps)];
        if (uniq.length > 1) sibGaps.push({ label: label(el), gaps });
      }
    }

    // 표준 세로 거리(헤더→본문, 본문→결론, 결론→꼬리말)
    const q1 = (sel) => S.querySelector(sel);
    const R = (sel) => { const e = q1(sel); return e && visible(e) ? rel(e.getBoundingClientRect()) : null; };
    const head = R(".head"), body = R(".body"), sowe = R(".sowe"), foot = R(".foot"), pg = R(".pg");
    const headline = q1(".headline") || (S.classList.contains("cover") ? q1("h1") : null);

    // 이미지
    const images = imgs.map((im) => {
      const s = cs(im);
      let rad = parseFloat(s.borderTopLeftRadius) || 0;
      for (let p = im.parentElement; !rad && p && p !== S; p = p.parentElement) if (cs(p).overflow === "hidden") { rad = parseFloat(cs(p).borderTopLeftRadius) || 0; if (rad) break; }
      return { src: im.getAttribute("src"), hasAlt: im.hasAttribute("alt"), alt: im.getAttribute("alt"), nw: im.naturalWidth, nh: im.naturalHeight, rect: rel(im.getBoundingClientRect()),
        fit: s.objectFit, wAttr: im.getAttribute("width"), hAttr: im.getAttribute("height"), ar: s.aspectRatio, radius: rad, filter: s.filter, opacity: s.opacity, complete: im.complete, loading: im.loading,
        on: im.classList.contains("on"), inChart: !!im.closest(".chart") };
    });

    // 차트·도식
    const svgs = [...S.querySelectorAll("svg")].filter(visible).map((svg) => {
      const vb = svg.viewBox.baseVal;
      const r = svg.getBoundingClientRect();
      const host = svg.closest("[data-chart]");
      const k = vb && vb.width ? Math.min(r.width / vb.width, r.height / vb.height) : 1;
      const T = [...svg.querySelectorAll("text")].filter((t) => t.textContent.trim()).map((t) => {
        const s = cs(t);
        return { cls: t.getAttribute("class") || "", text: t.textContent.trim(), rect: rel(t.getBoundingClientRect()), efs: round(parseFloat(s.fontSize) * svgScale(t), 2), fill: s.fill, fw: Number(s.fontWeight), ariaHidden: !!t.closest("[aria-hidden=true]"), fvn: s.fontVariantNumeric };
      });
      const mark = (e) => {
        const s = cs(e);
        const sc = svgScale(e);
        return { tag: e.tagName, cls: e.getAttribute("class") || "", fill: s.fill, fillOpacity: Number(s.fillOpacity), stroke: s.stroke, sw: round((parseFloat(s.strokeWidth) || 0) * sc, 2), dash: s.strokeDasharray, rect: rel(e.getBoundingClientRect()), data: [...e.attributes].some((a) => a.name.startsWith("data-")), parentCls: e.parentNode.getAttribute?.("class") || "" };
      };
      const polylines = [...svg.querySelectorAll("polyline")].map((p) => {
        const m = p.getScreenCTM();
        const pts = [...p.points].map((q) => ({ x: round(q.x * m.a + q.y * m.c + m.e - SR.left), y: round(q.x * m.b + q.y * m.d + m.f - SR.top) }));
        return { ...mark(p), pts, dashOffset: cs(p).strokeDashoffset };
      });
      const circles = [...svg.querySelectorAll("circle")].map((c) => ({ ...mark(c), r: round(c.r.baseVal.value * svgScale(c), 2) }));
      const rects = [...svg.querySelectorAll("rect")].map(mark);
      const lines = [...svg.querySelectorAll("line")].map(mark);
      const paths = [...svg.querySelectorAll("path")].map(mark);
      const grads = [...svg.querySelectorAll("linearGradient, radialGradient")].map((g) => [...g.querySelectorAll("stop")].map((st) => cs(st).stopColor));
      const hostEl = host || svg.closest(".chainwrap") || svg.parentElement;
      const pick = (sel) => hostEl ? [...hostEl.querySelectorAll(sel)].filter(visible).map((e) => ({ text: e.textContent.replace(/\s+/g, " ").trim(), rect: rel(e.getBoundingClientRect()) })) : [];
      return {
        chart: host ? host.dataset.chart : null, kind: host ? host.dataset.kind : null, cls: svg.getAttribute("class") || "", inChain: !!svg.closest(".chainwrap"),
        rect: rel(r), vb: vb ? [vb.width, vb.height] : null, k: round(k, 3), role: svg.getAttribute("role"), aria: svg.getAttribute("aria-label") || "",
        desc: [svg.querySelector("desc")?.textContent || "", svg.querySelector("title")?.textContent || "", ...(svg.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean).map((id) => document.getElementById(id)?.textContent || "")].join(" ").trim(),
        bg: bgOf(svg).color, texts: T, polylines, circles, rects, lines, paths, grads,
        titles: pick(".chart-title"), subs: pick(".chart-sub"), srcs: pick(".chart-src"), legends: pick(".legend"),
        hostRect: hostEl ? rel(hostEl.getBoundingClientRect()) : null,
      };
    });

    const links = [...S.querySelectorAll("a")].map((a) => ({ href: a.getAttribute("href"), target: a.target, rel: a.rel, text: a.textContent.replace(/\s+/g, " ").trim(), aria: a.getAttribute("aria-label") || "", title: a.title, tdl: cs(a).textDecorationLine, rect: rel(a.getBoundingClientRect()) }));
    const headings = [...S.querySelectorAll("h1,h2,h3,h4,h5,h6,[role=heading]")].map((h) => ({ tag: h.tagName.toLowerCase(), text: h.textContent.replace(/\s+/g, " ").trim(), hidden: !visible(h) }));
    const digits = [...S.querySelectorAll(".t-digit-group")].map((g) => ({ aria: g.getAttribute("aria-label"), text: g.textContent, digits: g.querySelectorAll(".t-digit").length, hiddenDigits: g.querySelectorAll(".t-digit[aria-hidden=true]").length, host: label(g.parentElement) }));
    const tags = [...S.querySelectorAll(".tag")].map((t) => ({ text: t.textContent.trim(), cls: t.className, rect: rel(t.getBoundingClientRect()) }));
    const stagger = [...S.querySelectorAll(".t-stagger-line")].map((e) => ({ i: Number(e.style.getPropertyValue("--i")), rect: rel(e.getBoundingClientRect()), delay: cs(e).transitionDelay, dur: cs(e).transitionDuration }));
    const bodyEl = q1(".body");
    const bodyText = bodyEl ? (() => { const c = bodyEl.cloneNode(true); c.querySelectorAll("svg, .chart-src, .source, .legend").forEach((x) => x.remove()); return c.textContent.replace(/\s+/g, " ").trim(); })() : "";
    const blocks = [...S.querySelectorAll(".head > *, .body > *, .body .grid > *, .body .stack > *, .sowe")].filter(visible).map((e) => ({ label: label(e), text: e.cloneNode(true).textContent.replace(/\s+/g, " ").trim().slice(0, 600), rect: rel(e.getBoundingClientRect()) }));
    const bodyKids = bodyEl ? [...bodyEl.children].filter(visible).map((e) => ({ label: label(e), cls: e.className, rect: rel(e.getBoundingClientRect()), kids: [...e.children].filter(visible).map((k) => ({ cls: k.className, rect: rel(k.getBoundingClientRect()) })) })) : [];
    const groups = [...S.querySelectorAll(".figs, .tiles, .bands, .grid, .qcards, .timeline, ul, ol, .points, .poster, .stack")].filter((g) => visible(g) && !(g instanceof SVGElement)).map((g) => ({
      label: label(g), cls: g.className, n: [...g.children].filter(visible).length,
      kids: [...g.children].filter(visible).map((k) => ({ cls: k.className, rect: rel(k.getBoundingClientRect()), kidCls: [...k.children].map((x) => (typeof x.className === "string" ? x.className : "")).sort().join("|") })),
    }));
    const scroll = { sh: S.scrollHeight, ch: S.clientHeight, sw: S.scrollWidth, cw: S.clientWidth };
    const scrollers = els.filter((e) => !(e instanceof SVGElement) && /(auto|scroll)/.test(cs(e).overflowY + cs(e).overflowX) && (e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1)).map(label);
    const hoverish = els.filter((e) => cs(e).cursor === "pointer" && !e.closest("a,button,[role=button]")).map(label);
    const field = q1(".bg") ? rel(q1(".bg").getBoundingClientRect()) : null;
    // 가장 큰 글자
    const sizes = texts.filter((t) => !t.ariaHidden);
    return {
      n, total: all.length, cls: S.className, side: S.dataset.side || null, rect: rel(SR), bg: cs(S).backgroundColor, bgImage: cs(S).backgroundImage, field,
      dark: S.classList.contains("dark"), bleed: S.classList.contains("bleed"), cover: S.classList.contains("cover"), nohead: S.classList.contains("nohead"),
      headline: headline ? { text: headline.textContent.replace(/\s+/g, " ").trim(), html: headline.innerHTML, br: (headline.innerHTML.match(/<br/g) || []).length, rect: rel(headline.getBoundingClientRect()), fs: parseFloat(cs(headline).fontSize), lines: linesOf(headline).length, tag: headline.tagName.toLowerCase(),
        styledKids: [...headline.querySelectorAll("*")].filter((k) => k.tagName !== "BR").map((k) => { const a = cs(k), b = cs(headline); return { label: label(k), color: a.color !== b.color, style: a.fontStyle !== b.fontStyle, family: a.fontFamily !== b.fontFamily, deco: a.textDecorationLine !== "none" }; }),
        firstText: (() => { const w = document.createTreeWalker(S, NodeFilter.SHOW_TEXT, { acceptNode: (t) => t.textContent.trim() && visible(t.parentElement) ? 1 : 3 }); const f = w.nextNode(); return f ? headline.contains(f) : false; })() } : null,
      kicker: q1(".kicker") ? { text: q1(".kicker").textContent.trim(), rect: R(".kicker"), radius: parseFloat(cs(q1(".kicker")).borderTopLeftRadius) || 0, bg: cs(q1(".kicker")).backgroundColor } : null,
      head, body, sowe, foot, pg, pgText: q1(".pg") ? q1(".pg").textContent.replace(/\s+/g, " ").trim() : null,
      soweInfo: q1(".sowe") ? { text: q1(".sowe").textContent.replace(/\s+/g, " ").trim(), label: q1(".sowe > b")?.textContent.trim() || "", bg: bgOf(q1(".sowe")).color, slideBg: bgOf(S).color, shadow: cs(q1(".sowe")).boxShadow } : null,
      sources: [...S.querySelectorAll(".source, .chart-src")].map((e) => ({ cls: e.className, text: e.textContent.replace(/\s+/g, " ").trim(), fs: parseFloat(cs(e).fontSize), sw: e.scrollWidth, cw: e.clientWidth, to: cs(e).textOverflow })),
      texts, boxes, spacing, sibGaps, images, svgs, links, headings, digits, tags, stagger, bodyText, blocks, bodyKids, groups, scroll, scrollers, hoverish,
      slideText: S.innerText.replace(/\s+/g, " ").trim(),
      tbodyRows: [...S.querySelectorAll("tbody")].map((t) => t.rows.length),
      inlineStyles: [...S.querySelectorAll("[style]")].map((e) => ({ label: label(e), style: e.getAttribute("style") })).filter((x) => /(font|color|background)/.test(x.style)),
      maxText: sizes.length ? Math.max(...sizes.map((t) => t.efs)) : 0,
      roles: [".tag", ".kicker", ".source", ".sowe", ".chart-title", ".chart-src", ".chart-sub", ".headline", ".pg", ".legend", ".credit"].flatMap((sel) => [...S.querySelectorAll(sel)].filter(visible).map((e) => {
        const s = cs(e);
        return { role: sel, surface: S.classList.contains("dark") ? "dark" : S.classList.contains("bleed") ? "photo" : e.closest(".card.accent, .tile.t1, .band.head-band") ? "accent" : e.closest(".card.ink, .tile.t2, .key, .posterwrap") ? "ink" : e.closest(".card.sage, .tile.t3") ? "sage" : "light",
          combo: [s.fontWeight, s.fontSize, s.lineHeight, s.color, s.backgroundColor, s.paddingTop, s.paddingLeft, s.borderTopLeftRadius].join(" | ") };
      })),
    };
  }

  // ── 발표 무대 ──────────────────────────
  const fixedEls = () => [...document.querySelectorAll("body *")].filter((e) => {
    if (e.closest(".slide") || e.classList.contains("deck")) return false;
    const s = cs(e);
    return (s.position === "fixed" || s.position === "sticky") && visible(e);
  });
  const accName = (e) => (e.getAttribute("aria-label") || e.getAttribute("title") || e.textContent || "").replace(/\s+/g, " ").trim();
  function stage() {
    const deck = document.querySelector(".deck");
    const tr = cs(deck).transform;
    const m = tr && tr !== "none" ? tr.match(/matrix\(([^)]+)\)/) : null;
    const k = m ? Number(m[1].split(",")[0]) : 1;
    const dr = deck.getBoundingClientRect();
    const slides = [...document.querySelectorAll(".slide")];
    const cur = window.__deckCurrentSlide ? window.__deckCurrentSlide() : -1;
    const S = slides[cur] || slides[0];
    const texts = [...S.querySelectorAll("*")].filter((e) => directText(e) && visible(e)).map((e) => {
      const inSvg = e instanceof SVGElement;
      const sc = inSvg ? (e.getScreenCTM ? Math.hypot(e.getScreenCTM().a, e.getScreenCTM().b) : 1) : k;
      return { label: label(e), efs: round(parseFloat(cs(e).fontSize) * sc, 2), headline: e.classList.contains("headline"), pg: !!e.closest(".pg"), inSvg };
    });
    const controls = [...document.querySelectorAll("button, a[href], [role=button], [tabindex]:not([tabindex='-1'])")].filter((e) => visible(e) && (!e.closest(".slide") || e.closest(".slide") === S)).map((e) => {
      const r = e.getBoundingClientRect();
      const s = cs(e);
      return { label: label(e), name: accName(e), aria: e.getAttribute("aria-label"), title: e.getAttribute("title"), inSlide: !!e.closest(".slide"), x: round(r.left), y: round(r.top), w: round(r.width), h: round(r.height), bg: s.backgroundColor, opacity: Number(s.opacity) * effOpacity(e.parentElement || e), cursor: s.cursor, disabled: e.disabled || e.getAttribute("aria-disabled") === "true", touchAction: s.touchAction, userSelect: s.userSelect || s.webkitUserSelect, svgs: [...e.querySelectorAll("svg")].map((v) => ({ vb: v.getAttribute("viewBox"), sw: v.getAttribute("stroke-width") || cs(v).strokeWidth })) };
    });
    return {
      vw: innerWidth, vh: innerHeight, k: round(k, 4), deck: { x: round(dr.left), y: round(dr.top), w: round(dr.width), h: round(dr.height) },
      scrollW: document.documentElement.scrollWidth, scrollH: document.documentElement.scrollHeight, cur, hash: location.hash, title: document.title, total: slides.length,
      body: document.body.className, sides: slides.map((s) => s.dataset.side || ""), inert: slides.map((s) => s.inert || s.getAttribute("aria-hidden") === "true"),
      fixed: fixedEls().map((e) => { const r = e.getBoundingClientRect(); return { label: label(e), text: e.textContent.replace(/\s+/g, " ").trim().slice(0, 80), x: round(r.left), y: round(r.top), w: round(r.width), h: round(r.height), opacity: Number(cs(e).opacity), display: cs(e).display, role: e.getAttribute("role") }; }),
      controls, texts, minText: texts.length ? Math.min(...texts.map((t) => t.efs)) : null, headlineEfs: texts.find((t) => t.headline)?.efs ?? null, pgEfs: texts.filter((t) => t.pg).map((t) => t.efs),
      live: [...document.querySelectorAll("[aria-live]")].map((e) => ({ mode: e.getAttribute("aria-live"), text: e.textContent.trim() })),
      dialogs: document.querySelectorAll("dialog[open], [role=dialog], [aria-modal=true]").length,
      jsErrors: (window.__jsErrors || []).slice(),
      overscroll: [cs(document.documentElement).overscrollBehaviorY, cs(document.body).overscrollBehaviorY], tapHi: cs(document.documentElement).webkitTapHighlightColor,
      deckTouch: cs(deck).touchAction, bodyTouch: cs(document.body).touchAction,
    };
  }
  // 무대에서 장마다 고정 요소와 장 안 핵심 요소의 겹침(전환을 끈 상태에서 부른다)
  function stageAll() {
    const slides = [...document.querySelectorAll(".slide")];
    const out = [];
    const key = (k) => document.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
    key("Home");
    for (let i = 0; i < slides.length; i++) {
      const S = slides[window.__deckCurrentSlide ? window.__deckCurrentSlide() : i];
      const fx = fixedEls().map((e) => ({ label: label(e), r: e.getBoundingClientRect() }));
      const targets = [...S.querySelectorAll(".pg, .source, .chart-src, .sowe, .chart, .headline, .body p, .body li, .body td, .body h3, .credit")].filter(visible).map((e) => ({ label: label(e), r: e.getBoundingClientRect() }));
      const hits = [];
      for (const f of fx) for (const t of targets) {
        const w = Math.min(f.r.right, t.r.right) - Math.max(f.r.left, t.r.left), h = Math.min(f.r.bottom, t.r.bottom) - Math.max(f.r.top, t.r.top);
        if (w > 0 && h > 0) hits.push({ fixed: f.label, target: t.label, area: round(w * h, 0) });
      }
      out.push({ n: slides.indexOf(S) + 1, hits });
      key("ArrowRight");
    }
    key("Home");
    return out;
  }
  // 무대에서 장마다 실효 글자 크기(배율 곱)를 잰다(전환을 끈 상태에서 부른다)
  function stageScan() {
    const slides = [...document.querySelectorAll(".slide")];
    const key = (k) => document.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
    key("Home");
    const out = [];
    for (let i = 0; i < slides.length; i++) {
      const st = stage();
      out.push({ n: st.cur + 1, k: st.k, minText: st.minText, minLabel: st.texts.reduce((a, t) => (!a || t.efs < a.efs ? t : a), null)?.label, headlineEfs: st.headlineEfs, pgEfs: st.pgEfs, title: st.title, hash: st.hash, live: st.live });
      key("ArrowRight");
    }
    key("Home");
    return out;
  }
  window.__vqa = { slide, stage, stageAll, stageScan, label };
  return 1;
})()

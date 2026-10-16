// 조건 판정. visual-qa.ts가 모은 측정(Data)을 받아 조건 id마다 pass/fail/manual을 낸다.
// 실패 항목(items)에는 장 번호(n)와 측정값을 적는다. qa/exceptions.json의 예외는 '예외로 넘김'으로 따로 남긴다.
import { contrast, deltaE, hex, key, lab, oklch, over, parseColor, projector, type RGBA } from "./color.ts";

export type Item = { n?: number; msg: string };
export type Result = {
  id: string; area: string; method: string; implemented: "auto" | "auto+manual" | "partial" | "manual";
  status: "pass" | "fail" | "manual" | "error"; summary: string; items: Item[]; failedSlides: number[];
  excepted?: Item[]; pendingManual?: boolean; measured?: any; notes?: string[]; evidence?: string[]; manual?: { procedure: string; bundle: string[] };
  regression?: any; fixed?: boolean;
};
export type Data = {
  label: string; files: any; ext: any; slides: any[]; pix: any[]; shots: Record<number, { png: string; jpg: string }>; ix: any; stage: any;
  criteria: any[]; violations: any[]; errors: string[]; opts: any; total: number; exceptions: any; prev?: any;
};
type Out = { items: Item[]; measured?: any; notes?: string[]; evidence?: string[]; implemented?: Result["implemented"]; manual?: string[]; summary?: string };

const HANGUL = /[가-힣]/;
const r1 = (v: number, d = 1) => Math.round(v * 10 ** d) / 10 ** d;
const uniq = <T>(a: T[]) => [...new Set(a)];
const pad = (n: number) => String(n).padStart(2, "0");
const grams = (s: string) => { const t = s.replace(/[^가-힣A-Za-z0-9]/g, ""); const g = new Set<string>(); for (let i = 0; i < t.length - 1; i++) g.add(t.slice(i, i + 2)); return g; };
const jacc = (a: string, b: string) => { const A = grams(a), B = grams(b); if (!A.size || !B.size) return 0; let i = 0; for (const x of A) if (B.has(x)) i++; return i / (A.size + B.size - i); };
const hit = (a: any, b: any) => Math.max(0, Math.min(a.r ?? a.x + a.w, b.r ?? b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.b ?? a.y + a.h, b.b ?? b.y + b.h) - Math.max(a.y, b.y));
const dist = (a: any, b: any) => { const dx = Math.max(0, b.x - (a.x + a.w), a.x - (b.x + b.w)); const dy = Math.max(0, b.y - (a.y + a.h), a.y - (b.y + b.h)); return Math.hypot(dx, dy); };
const norm = (s: string) => s.replace(/[\s·]/g, "").replace(/(직|직군|직업)$/, "");
const nums = (s: string) => (s.match(/\d+(?:[.,]\d+)*/g) ?? []).map((x) => x.replace(/,/g, ""));
// 같은 숫자 반복(TXT-05)에서 빼는 것: 영문과 붙은 자료 식별자(DT_1DA7E08S, GPT-4, R1), 범위·호수의 끝값(2022~2025, 1~9월, 2026-19), 순위(1위)
const claimNums = (s: string) => nums(s
  .replace(/[A-Za-z_]+-?\d[\w.-]*|\d+[A-Za-z_]+\d[\w-]*/g, " ")
  .replace(/\d+(?:[.,]\d+)*\s*[~–]\s*\d+(?:[.,]\d+)*|\d+-\d+/g, " ")
  .replace(/\d+\s*(?:위|번째|순위)/g, " "));
const allCss = (D: Data) => [D.files.tokens, D.files.deck, D.files.slides, ...Object.values(D.files.extraCss ?? {})].join("\n");
const allJs = (D: Data) => Object.values(D.files.js).join("\n");
const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, " ");
const stdText = (D: Data) => Object.values(D.files.std).join("\n");

function slidesOf(D: Data): [number, any][] {
  return D.slides.map((s, n) => [n, s] as [number, any]).filter(([, s]) => !!s);
}
// 토큰
let tokCache: any = null;
function tokens(D: Data) {
  if (tokCache) return tokCache;
  const raw: Record<string, string> = {};
  for (const m of stripComments(allCss(D)).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) if (!(m[1] in raw)) raw[m[1]] = m[2].trim();
  const resolve = (v: string, depth = 0): string => (depth > 6 ? v : v.replace(/var\((--[\w-]+)\)/g, (_, k) => (raw[k] ? resolve(raw[k], depth + 1) : k)));
  const vals: Record<string, string> = {};
  for (const k of Object.keys(raw)) vals[k] = resolve(raw[k]);
  const colors: Record<string, RGBA> = {};
  for (const [k, v] of Object.entries(vals)) { const c = parseColor(v); if (c && /^(#|rgb|color)/.test(v)) colors[k] = c; }
  const colorKeys = new Set(Object.values(colors).map(key));
  const presets: { name: string; w: number; size: number; lh: number }[] = [];
  for (const [k, v] of Object.entries(vals)) { const m = v.match(/^(\d{3})\s+(\d+)px\/(\d+)px/); if (k.startsWith("--t-") && m) presets.push({ name: k, w: +m[1], size: +m[2], lh: +m[3] }); }
  tokCache = { raw, vals, colors, colorKeys, presets };
  return tokCache;
}
const isTokenColor = (D: Data, c: RGBA | null) => !c || c[3] === 0 || tokens(D).colorKeys.has(key(c));
const tc = (D: Data, name: string) => tokens(D).colors[name];
const shotOf = (D: Data, n: number) => (D.shots[n] ? `shots/${D.label}/slide-${pad(n)}.jpg` : `before/slide-${pad(n)}.jpg`);
const textColor = (t: any) => parseColor(t.inSvg ? t.fill : t.color);
const isTertiary = (t: any) => t.ctx.some((c: string) => ["foot", "source", "chart-src", "pg", "credit"].includes(c)) || /^n\s*=/.test(t.own);
const cardLike = (b: any) => !b.pseudoOnly && b.rect.w >= 120 && b.rect.h >= 60 && !b.inTable && b.position !== "fixed" && (b.shadow !== "none" || b.bgDiff || b.border.some((w: number, i: number) => w >= 1 && b.borderStyle[i] !== "none"));
const lightSlide = (s: any) => !s.dark && !s.bleed;
const exists = (p: string | null | undefined) => !!p;

// ── 판정 함수 ──────────────────────────
const J: Record<string, (D: Data) => Out> = {};

J["LAY-01"] = (D) => {
  const items: Item[] = [];
  const S = slidesOf(D);
  const content = S.filter(([, s]) => s.headline && !s.cover && !s.nohead && !s.bleed && s.headline.tag !== "h1");
  for (const [n, s] of content) {
    const h = s.headline.rect;
    if (h.x !== 160 || h.y !== 112) items.push({ n, msg: `.headline 시작 (${h.x}, ${h.y}) ≠ (160, 112)` });
    if (!s.foot || Math.abs(s.foot.b - 1016) > 1) items.push({ n, msg: `.foot bottom ${s.foot?.b ?? "없음"} ≠ 1016±1` });
  }
  const rights = content.map(([n, s]) => [n, s.pg?.r] as [number, number]).filter(([, r]) => r != null);
  const mode = rights.length ? Object.entries(rights.reduce((m: any, [, r]) => ((m[r] = (m[r] ?? 0) + 1), m), {})).sort((a: any, b: any) => b[1] - a[1])[0][0] : null;
  for (const [n, r] of rights) if (String(r) !== mode) items.push({ n, msg: `.pg 오른쪽 끝 ${r} ≠ 최빈 ${mode}` });
  // 유형별(표지·nohead·전면) 고정. 내용 장 틀과 다르면 예외 장이고, 그 예외는 design-standard README에 적혀 있어야 한다
  // (README 한 줄에 유형 이름과 '예외'가 함께 있을 때 적힌 것으로 본다)
  const readme = D.files.std?.["README.md"] ?? "";
  const NAME: Record<string, RegExp> = { cover: /\.?cover\b|표지/, nohead: /\.?nohead\b|제목 없는 장/, bleed: /\.?bleed\b|전면 사진|풀블리드/ };
  const documented = (kind: string) => readme.split("\n").some((l: string) => NAME[kind].test(l) && /예외/.test(l));
  const excRows: any[] = [];
  for (const kind of ["cover", "nohead", "bleed"]) {
    const g = S.filter(([, s]) => s[kind]);
    for (const [n, s] of g) {
      const diff: string[] = [];
      if (s.headline && (s.headline.rect.x !== 160 || s.headline.rect.y !== 112)) diff.push(`headline (${s.headline.rect.x}, ${s.headline.rect.y})≠(160, 112)`);
      if (s.kicker && s.kicker.rect && s.kicker.rect.x !== 160) diff.push(`kicker left ${s.kicker.rect.x}≠160`);
      if (s.foot && Math.abs(s.foot.b - 1016) > 1) diff.push(`.foot bottom ${s.foot.b}≠1016`);
      if (s.foot && s.foot.x != null && Math.abs(s.foot.x - 160) > 1) diff.push(`.foot left ${s.foot.x}≠160`);
      if (s.pg?.r != null && mode != null && String(s.pg.r) !== mode) diff.push(`.pg right ${s.pg.r}≠${mode}`);
      if (!diff.length) continue;
      const doc = documented(kind);
      excRows.push({ n, kind, diff, documented: doc });
      if (!doc) items.push({ n, msg: `${kind} 장 틀이 내용 장과 다른데 design-standard README 예외 목록에 없음: ${diff.join(" · ")}` });
    }
    const ref = g[0]?.[1];
    for (const [n, s] of g.slice(1)) {
      if (s.foot && ref.foot && Math.abs(s.foot.b - ref.foot.b) > 1) items.push({ n, msg: `${kind} 장 .foot bottom ${s.foot.b} ≠ 같은 유형 ${ref.foot.b}` });
      if (s.headline && ref.headline && (s.headline.rect.x !== ref.headline.rect.x || s.headline.rect.y !== ref.headline.rect.y)) items.push({ n, msg: `${kind} 장 헤드라인 (${s.headline.rect.x}, ${s.headline.rect.y}) ≠ 같은 유형 (${ref.headline.rect.x}, ${ref.headline.rect.y})` });
    }
  }
  return { items, measured: { contentSlides: content.length, headlineTops: uniq(content.map(([, s]) => s.headline.rect.y)), pgRightMode: mode, exceptionSlides: excRows }, notes: ["예외 장(표지·nohead·bleed)은 내용 장 틀(헤드라인 160·112, .foot 1016, .pg 오른쪽 최빈값)과 비교하고, 다르면 README에 그 유형이 '예외'로 적혀 있는지 본다"] };
};

J["LAY-02"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) {
    const bad = s.texts.filter((t: any) => !t.ariaHidden && t.op > 0.05 && (t.rect.x < 79.5 || t.rect.r > 1840.5 || t.rect.y < 63.5 || t.rect.b > 1016.5));
    if (bad.length) items.push({ n, msg: `안전 영역 밖 글자 ${bad.length}개: ${bad.slice(0, 3).map((t: any) => `${t.label} (${t.rect.x},${t.rect.y})–(${t.rect.r},${t.rect.b})`).join(" · ")}` });
  }
  return { items };
};

J["LAY-03"] = (D) => {
  const colW = (1600 - 11 * 48) / 12;
  const starts = Array.from({ length: 12 }, (_, i) => 160 + i * (colW + 48));
  const items: Item[] = [];
  const notes = ["전면 사진 장(.bleed)은 풀블리드 예외로 뺐다", `열 시작점 ${starts.map((x) => r1(x, 0)).join(" · ")}`];
  for (const [n, s] of slidesOf(D)) {
    if (s.bleed) continue;
    const blocks = s.texts.filter((t: any) => t.block && !t.inSvg && t.ta !== "center" && t.ta !== "end" && t.ta !== "right" && !t.ctx.includes("foot") && !t.ctx.includes("pg"));
    const off = blocks.filter((t: any) => !starts.some((x) => Math.abs(t.rect.x - x) <= 1));
    const lefts = uniq(blocks.map((t: any) => Math.round(t.rect.x)));
    if (off.length) items.push({ n, msg: `열 시작점 밖 글 덩어리 ${off.length}개: ${off.slice(0, 3).map((t: any) => `${t.label} x=${t.rect.x}`).join(" · ")}` });
    if (lefts.length > 3) items.push({ n, msg: `고유 왼쪽 x ${lefts.length}개(>3): ${lefts.slice(0, 8).join(", ")}` });
  }
  return { items, notes };
};

J["LAY-04"] = (D) => {
  const items: Item[] = [];
  const con = D.ext.constitution?.out ?? "";
  const spaceIssues = con.split("\n").filter((l: string) => l.trim().startsWith("간격"));
  if (spaceIssues.length) items.push({ msg: `헌법 감사 간격 위반 ${spaceIssues.length}: ${spaceIssues.slice(0, 3).join(" · ")}` });
  const tk = D.ext.tokenCheck?.out ?? "";
  const space = Number(tk.match(/space (\d+)/)?.[1] ?? 0);
  if (space) items.push({ msg: `token-check space ${space}건(${tk.split("\n").filter((l: string) => /\bspace\b/.test(l)).slice(0, 4).join(" · ")})` });
  const jsSpace = Object.entries(D.files.js).flatMap(([f, src]: any) => src.split("\n").map((l: string, i: number) => [f, i + 1, l]).filter(([, , l]: any) => /(padding|margin|gap)[^;]*[0-9]+px/.test(l)).map(([f, i]: any) => `${f}:${i}`));
  if (jsSpace.length) items.push({ msg: `JS 안 간격 px ${jsSpace.length}: ${jsSpace.slice(0, 4).join(", ")}` });
  for (const [n, s] of slidesOf(D)) {
    const odd: string[] = [];
    for (const sp of s.spacing) for (const [p, v] of Object.entries(sp.vals) as [string, number][]) if (Math.abs(v) % 8 !== 0 && !(Math.abs(v) === 4 && sp.hasSvg)) odd.push(`${sp.label} ${p} ${v}`);
    if (odd.length) items.push({ n, msg: `8 배수 아닌 계산 간격 ${odd.length}: ${uniq(odd).slice(0, 3).join(" · ")}` });
    if (s.sibGaps.length) items.push({ n, msg: `형제 간격 2종 이상 ${s.sibGaps.length}곳: ${s.sibGaps.slice(0, 2).map((g: any) => `${g.label} [${uniq(g.gaps).join(",")}]`).join(" · ")}` });
    if (s.head && s.body && Math.abs(s.body.y - s.head.b - 64) > 1) items.push({ n, msg: `헤더→본문 ${r1(s.body.y - s.head.b)} ≠ 64` });
    if (s.body && s.sowe && Math.abs(s.sowe.y - s.body.b - 32) > 1) items.push({ n, msg: `본문→결론 ${r1(s.sowe.y - s.body.b)} ≠ 32` });
    if (s.sowe && s.foot && Math.abs(s.foot.y - s.sowe.b - 24) > 1) items.push({ n, msg: `결론→꼬리말 ${r1(s.foot.y - s.sowe.b)} ≠ 24` });
  }
  return { items, measured: { constitution: con.split("\n")[0], tokenCheck: tk.split("\n").slice(-1)[0], tokenCheckCode: D.ext.tokenCheck?.code } };
};

J["LAY-05"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) {
    if (s.bodyKids.length > 4) items.push({ n, msg: `.body 직계 블록 ${s.bodyKids.length}개(>4)` });
    for (const g of s.groups) if (g.n > 5 && !/stack/.test(g.cls)) items.push({ n, msg: `병렬 항목 ${g.n}개(>5): ${g.label}` });
    for (const r of s.tbodyRows) if (r > 7) items.push({ n, msg: `표 본문 행 ${r}(>7)` });
    const charts = s.svgs.filter((v: any) => v.role === "img").length;
    if (charts > 2) items.push({ n, msg: `차트 ${charts}개(>2)` });
  }
  return { items };
};

J["LAY-06"] = (D) => {
  const items: Item[] = [];
  const rj = D.ext.render?.json;
  if (!rj) items.push({ msg: `render.ts 결과를 못 읽음(종료 ${D.ext.render?.code}): ${String(D.ext.render?.err ?? "").slice(0, 200)}` });
  for (const x of rj?.issues ?? []) {
    if (x.jsErrors) items.push({ msg: `JS 오류: ${x.jsErrors.join(" · ")}` });
    else {
      if (x.over?.length) items.push({ n: x.n, msg: `장 밖 요소: ${x.over.slice(0, 3).join(" · ")}` });
      if (x.clipped?.length) items.push({ n: x.n, msg: `잘림: ${x.clipped.slice(0, 3).join(" · ")}` });
      if (x.tiny?.length) items.push({ n: x.n, msg: `작은 글자(fit): ${x.tiny.length}개 — ${x.tiny[0]}` });
      if (x.headLines > x.allowed) items.push({ n: x.n, msg: `헤드라인 ${x.headLines}줄 > 허용 ${x.allowed}` });
    }
  }
  for (const [n, s] of slidesOf(D)) {
    if (s.scroll.sh > s.scroll.ch + 1 || s.scroll.sw > s.scroll.cw + 1) items.push({ n, msg: `장 scroll ${s.scroll.sw}×${s.scroll.sh} > ${s.scroll.cw}×${s.scroll.ch}` });
    if (s.scrollers.length) items.push({ n, msg: `장 안 스크롤 영역: ${s.scrollers.slice(0, 2).join(" · ")}` });
    const T = s.texts.filter((t: any) => !t.ariaHidden && t.op > 0.05 && t.rect.w > 0);
    const pairs: string[] = [];
    for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) {
      const a = T[i], b = T[j];
      if (a.full.includes(b.own) || b.full.includes(a.own)) continue;
      const ar = hit(a.rect, b.rect);
      if (ar > 4) pairs.push(`${a.label} ↔ ${b.label} ${r1(ar, 0)}px²`);
    }
    if (pairs.length) items.push({ n, msg: `글자 상자 겹침 ${pairs.length}쌍: ${pairs.slice(0, 2).join(" · ")}` });
    for (const v of s.svgs) if (v.vb && v.k < 0.9) items.push({ n, msg: `svg ${v.chart ?? v.cls ?? ""} 축소 배율 ${v.k}(<0.9)` });
  }
  const exc = rj?.excepted ?? [];
  return { items, measured: { renderIssues: rj?.issues?.length ?? null, fitExcepted: exc.reduce((a: number, x: any) => a + x.excepted.length, 0) }, notes: exc.length ? [`fit.js가 3차 정보 예외로 넘긴 글자 ${exc.reduce((a: number, x: any) => a + x.excepted.length, 0)}개(실패로 세지 않음, TYP-03에서 따로 잰다)`] : [] };
};

J["LAY-07"] = (D) => {
  const items: Item[] = [];
  const sig = (s: any) => (s.bleed ? "bleed|" : s.dark ? "dark|" : "") + s.bodyKids.map((k: any) => `${Math.round(k.rect.x / 8) * 8}:${Math.round(k.rect.w / 8) * 8}:${k.kids.length}`).join("/");
  const S = slidesOf(D);
  for (let i = 1; i < S.length; i++) {
    const [n, s] = S[i], [m, p] = S[i - 1];
    if (n === m + 1 && sig(s) === sig(p) && sig(s)) items.push({ n, msg: `${m}·${n}장 배치 서명 같음: ${sig(s).slice(0, 80)}` });
  }
  return { items, implemented: "auto+manual", manual: ["contact"] };
};

J["LAY-08"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) for (const g of s.groups) {
    if (!/figs|tiles|bands|qcards|timeline|grid|points/.test(g.cls)) continue;
    const rows: any[][] = [];
    // 같은 행: 세로 구간이 작은 쪽 높이의 절반 넘게 겹치면(계단식으로 내려 놓은 타일도 한 행으로 본다)
    const sameRow = (a: any, b: any) => Math.min(a.rect.b, b.rect.b) - Math.max(a.rect.y, b.rect.y) > Math.min(a.rect.h, b.rect.h) / 2;
    for (const k of g.kids) { const row = rows.find((r) => sameRow(r[0], k)); row ? row.push(k) : rows.push([k]); }
    for (const row of rows) if (row.length >= 2) {
      const w = row.map((k) => k.rect.w), h = row.map((k) => k.rect.h);
      if (Math.max(...w) - Math.min(...w) > 8 || Math.max(...h) - Math.min(...h) > 8) items.push({ n, msg: `${g.label} 같은 행 형제 폭 ${uniq(w.map((x) => r1(x, 0))).join("/")} · 높이 ${uniq(h.map((x) => r1(x, 0))).join("/")}` });
      if (uniq(row.map((k) => k.kidCls)).length > 1) items.push({ n, msg: `${g.label} 같은 행 형제 자식 구조 다름` });
    }
    // 세로로 쌓인 행 묶음(.bands 같은 표 모양): 한 행 안 칸들의 첫 줄 세로 정렬. 기준선은 상자 위 + 0.952em(Pretendard 어센트)
    if (rows.length >= 2 && rows.every((r) => r.length === 1)) {
      const modes: string[] = [];
      for (const [ri, [k]] of rows.entries()) {
        const inside = s.texts.filter((t: any) => t.block && !t.inSvg && !isTertiary(t) && !t.ctx.some((c: string) => ["tag", "pill", "kicker"].includes(c)) && !/\b(tag|pill)\b/.test(t.cls) && t.rect.x >= k.rect.x - 1 && t.rect.r <= k.rect.r + 1 && t.rect.y >= k.rect.y - 1 && t.rect.b <= k.rect.b + 1).sort((a: any, b: any) => a.rect.x - b.rect.x);
        const cols: any[] = [];
        for (const t of inside) { const c = cols.find((c) => Math.abs(c.rect.x - t.rect.x) <= 40); if (!c) cols.push(t); else if (t.rect.y < c.rect.y) cols[cols.indexOf(c)] = t; }
        if (cols.length < 2) continue;
        const spread = (f: (t: any) => number) => { const v = cols.map(f); return Math.max(...v) - Math.min(...v); };
        const top = spread((t) => t.rect.y), base = spread((t) => t.rect.y + 0.952 * t.fs), bot = spread((t) => t.rect.y + 1.2 * t.fs);
        const mode = base <= 1.5 ? "기준선" : top <= 1.5 ? "위끝" : bot <= 1.5 ? "아래끝" : "없음";
        modes.push(mode);
        if (base > 2) items.push({ n, msg: `${g.label} ${ri + 1}번째 행 칸 ${cols.length}개 첫 줄 기준선 ${r1(base)}px 어긋남(위끝 ${r1(top)}px 차, 정렬 기준 ${mode}): ${cols.map((t: any) => `${t.label.split(" ")[0]} y=${r1(t.rect.y, 0)}`).join(" · ")}` });
      }
      if (uniq(modes).length > 1) items.push({ n, msg: `${g.label} 행마다 칸 정렬 기준이 다름: ${modes.map((m, i) => `${i + 1}행 ${m}`).join(" · ")}` });
    }
  }
  return { items };
};

J["LAY-09"] = (D) => {
  const items: Item[] = [];
  const occ: Record<number, number> = {};
  let bgHeavy: number[] = [];
  for (const [n, s] of slidesOf(D)) {
    const cell = 16, X0 = 160, Y0 = 112, W = 1600, H = 904;
    const grid = new Uint8Array((W / cell) * Math.ceil(H / cell));
    const mark = (r: any) => { for (let y = Math.max(Y0, r.y); y < Math.min(Y0 + H, r.b ?? r.y + r.h); y += cell) for (let x = Math.max(X0, r.x); x < Math.min(X0 + W, r.r ?? r.x + r.w); x += cell) grid[Math.floor((y - Y0) / cell) * (W / cell) + Math.floor((x - X0) / cell)] = 1; };
    s.texts.filter((t: any) => !t.inSvg && !t.ctx.includes("foot")).forEach((t: any) => mark(t.rect));
    s.images.forEach((i: any) => mark(i.rect));
    s.svgs.forEach((v: any) => mark(v.rect));
    s.boxes.filter(cardLike).forEach((b: any) => mark(b.rect));
    const ratio = grid.reduce((a, b) => a + b, 0) / grid.length;
    occ[n] = r1(ratio, 2);
    if (!s.cover && !s.nohead && !s.bleed && (ratio < 0.35 || ratio > 0.85)) items.push({ n, msg: `콘텐츠 점유율 ${r1(ratio, 2)}(0.35~0.85 밖)` });
    for (const b of s.boxes.filter(cardLike)) if (b.contentH && b.rect.h > 100 && b.contentH / b.rect.h < 0.6) items.push({ n, msg: `카드 채움 ${r1(b.contentH / b.rect.h, 2)}(<0.6): ${b.label}` });
    if ((D.pix[n]?.stats?.dominantShare ?? 0) >= 0.85) bgHeavy.push(n);
  }
  if (bgHeavy.length > 1) items.push({ msg: `본문 영역 바탕 85% 이상 장 ${bgHeavy.length}개(>1): ${bgHeavy.join(", ")}` });
  return { items, measured: { occupancy: occ, bgHeavy }, implemented: "auto+manual", manual: ["contact"] };
};

J["LAY-10"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) {
    const T = s.texts.filter((t: any) => !t.ariaHidden && t.op > 0.05);
    if (!T.length) continue;
    const max = Math.max(...T.map((t: any) => t.efs));
    const tops0 = T.filter((t: any) => Math.abs(t.efs - max) < 0.5);
    const tops = tops0.filter((t: any) => !tops0.some((o: any) => o !== t && o.full.length > t.full.length && o.full.includes(t.own))); // 안에 든 강조 span은 같은 글자로 본다
    if (tops.length > 1) items.push({ n, msg: `최대 크기 ${max}px 동률 ${tops.length}개: ${tops.slice(0, 3).map((t: any) => t.label).join(" · ")}` });
    const t = tops[0];
    const ok = t.ctx.includes("headline") || t.ctx.includes("num") || ((t.ctx.includes("fig") || t.ctx.includes("tile")) && /t-digit-group|\bv\b/.test(t.cls + " " + t.label)) || (s.cover && t.tag === "h1") || (s.cover && t.ctx.includes("cover") && t.label.startsWith("h1"));
    if (!ok) items.push({ n, msg: `가장 큰 글자가 헤드라인·핵심 수치가 아님: ${t.label} ${max}px` });
    if (t.rect.y > 540) items.push({ n, msg: `가장 큰 글자 top ${t.rect.y} > 540` });
    if (s.headline && !s.headline.firstText) items.push({ n, msg: "헤드라인이 DOM 첫 텍스트가 아님(킥커·표지 띠가 앞섬)" });
  }
  return { items };
};

J["SURF-01"] = (D) => {
  const items: Item[] = [];
  const S = slidesOf(D).filter(([n]) => D.pix[n]?.stats?.dominant);
  const col = (n: number) => D.pix[n].stats.dominant.concat(1) as RGBA;
  for (let i = 2; i < S.length; i++) {
    const [a] = S[i - 2], [b] = S[i - 1], [c] = S[i];
    if (c !== a + 2) continue;
    if (deltaE(col(a), col(b)) < 3 && deltaE(col(b), col(c)) < 3 && deltaE(col(a), col(c)) < 3) items.push({ n: c, msg: `${a}·${b}·${c}장 같은 면 ${hex(col(c))}` });
  }
  return { items, measured: { surfaces: Object.fromEntries(S.map(([n]) => [n, hex(col(n))])) } };
};

J["SURF-02"] = (D) => {
  const items: Item[] = [];
  const bgs: Record<string, number[]> = {};
  for (const [n, s] of slidesOf(D)) {
    const c = parseColor(s.bg);
    const k = c ? hex(c) : s.bg;
    (bgs[k] ??= []).push(n);
    if (!isTokenColor(D, c)) items.push({ n, msg: `장 바탕 ${s.bg}가 토큰 밖` });
  }
  if (Object.keys(bgs).length < 3) items.push({ msg: `바탕 면 ${Object.keys(bgs).length}종(<3): ${Object.entries(bgs).map(([k, v]) => `${k}×${v.length}`).join(", ")}` });
  return { items, measured: { surfaces: Object.fromEntries(Object.entries(bgs).map(([k, v]) => [k, v.length])) } };
};

J["SURF-03"] = (D) => {
  const items: Item[] = [];
  const S = slidesOf(D);
  const dark = S.filter(([n, s]) => s.dark || (D.pix[n]?.stats?.meanL ?? 100) < 30).map(([n]) => n);
  const bleed = S.filter(([, s]) => s.bleed).map(([n]) => n);
  if (dark.length > 2) items.push({ msg: `어두운 장 ${dark.length}(>2): ${dark.join(", ")}` });
  for (let i = 1; i < dark.length; i++) if (dark[i] === dark[i - 1] + 1) items.push({ n: dark[i], msg: `어두운 장 이웃 ${dark[i - 1]}·${dark[i]}` });
  if (uniq([...dark, ...bleed]).length > 6) items.push({ msg: `어두운+전면 사진 ${uniq([...dark, ...bleed]).length}장(>6)` });
  const std = stdText(D);
  const darkLines = std.split("\n").filter((l) => /어두운|전면 사진/.test(l)).join(" ");
  const noReason = uniq([...dark, ...bleed]).filter((n) => !new RegExp(`(^|[^\\d])${n}(장|[^\\d]|$)`).test(darkLines));
  if (noReason.length) items.push({ msg: `design-standard에 어두운·전면 사진 장 사유 없음: ${noReason.join(", ")}장` });
  return { items, measured: { dark, bleed }, implemented: "auto+manual", manual: dark.concat(bleed).map((n) => shotOf(D, n)) };
};

J["SURF-04"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) {
    const st = D.pix[n]?.stats;
    if (!st || !(s.dark || st.meanL < 30)) continue;
    if (st.brightShare > 0.02) items.push({ n, msg: `어두운 장 순백(L*>97) 비율 ${r1(st.brightShare * 100, 2)}%(>2%)` });
  }
  return { items };
};

J["SURF-05"] = (D) => {
  const items: Item[] = [];
  const stage = tc(D, "--stage");
  for (const name of ["1024x768", "2560x1080", "390x844"]) {
    const s = D.stage[name];
    if (!s) { items.push({ msg: `${name} 측정 없음` }); continue; }
    for (const c of s.letterbox ?? []) {
      if (!c) continue;
      const d = deltaE([c[0], c[1], c[2], 1], stage);
      if (d >= 2) items.push({ msg: `${name} 레터박스 rgb(${c.map((v: number) => Math.round(v)).join(",")}) ΔE ${r1(d)} ≥2 (--stage ${hex(stage)})` });
    }
  }
  return { items, evidence: ["1024x768", "2560x1080", "390x844"].map((n) => D.stage[n]?.shot).filter(exists) };
};

J["SURF-06"] = (D) => {
  const items: Item[] = [];
  const h = D.files.html;
  if (!/<meta[^>]+name=["']color-scheme["'][^>]+content=["']light/.test(h)) items.push({ msg: "meta color-scheme=light 없음" });
  if (!/color-scheme\s*:\s*light/.test(allCss(D))) items.push({ msg: ":root color-scheme: light 없음" });
  const themes = [...h.matchAll(/<meta[^>]+name=["']theme-color["'][^>]*>/g)].map((m) => m[0]);
  const stage = tc(D, "--stage");
  if (themes.length < 2) items.push({ msg: `theme-color ${themes.length}개(<2)` });
  for (const t of themes) { const c = parseColor(t.match(/content=["']([^"']+)/)?.[1]); if (c && stage && deltaE(c, stage) > 1) items.push({ msg: `theme-color ${hex(c)} ≠ --stage ${hex(stage)}` }); }
  for (const d of D.ix.dark ?? []) if (d.changed > 0.0005) items.push({ n: d.n, msg: `다크 에뮬레이션 픽셀 차 ${r1(d.changed * 100, 2)}%` });
  if (!D.ix.dark) items.push({ msg: "다크 에뮬레이션 측정 없음" });
  return { items };
};

J["CARD-01"] = (D) => {
  const items: Item[] = [];
  const per: Record<number, number> = {};
  for (const [n, s] of slidesOf(D)) {
    const c = s.boxes.filter(cardLike);
    per[n] = c.length;
    const lim = lightSlide(s) ? 1 : 2;
    if (c.length > lim) items.push({ n, msg: `경계 있는 상자 ${c.length}개(>${lim}): ${c.slice(0, 3).map((b: any) => b.label.split(" ")[0]).join(" · ")}` });
  }
  return { items, measured: { perSlide: per } };
};

J["CARD-02"] = (D) => {
  const items: Item[] = [];
  const total = (D.files.html.match(/class="[^"]*card/g) ?? []).length;
  if (total > 16) items.push({ msg: `class에 card가 든 요소 ${total}개(>16, before 40)` });
  const S = slidesOf(D);
  const withCards = S.filter(([, s]) => s.boxes.some(cardLike)).map(([n]) => n);
  const lead = S.filter(([, s]) => { const area = s.body ? s.body.w * s.body.h : 1600 * 700; return s.boxes.filter(cardLike).filter((b: any) => b.parentBox == null).reduce((a: number, b: any) => a + b.rect.w * b.rect.h, 0) / area >= 0.5; }).map(([n]) => n);
  if (withCards.length > 10) items.push({ msg: `카드 있는 장 ${withCards.length}(>10): ${withCards.join(", ")}` });
  if (lead.length > 11) items.push({ msg: `카드가 본문 50% 이상인 장 ${lead.length}(>11): ${lead.join(", ")}` });
  return { items, measured: { cardClass: total, withCards: withCards.length, lead: lead.length }, implemented: "auto+manual", manual: ["contact"] };
};

J["CARD-03"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) {
    const c = s.boxes.filter(cardLike);
    const set = new Set(c.map((b: any) => b.i));
    for (const b of c) {
      let p = b.parentBox;
      while (p != null && !set.has(p)) p = s.boxes[p]?.parentBox;
      if (p != null) items.push({ n, msg: `카드 안 카드: ${b.label.split(" ")[0]} ⊂ ${s.boxes[p].label.split(" ")[0]}` });
      if (b.rect.w > 960) items.push({ n, msg: `폭 ${b.rect.w}px(>960) 카드: ${b.label.split(" ")[0]}` });
    }
  }
  return { items };
};

J["CARD-04"] = (D) => {
  const items: Item[] = [];
  const rows: number[] = [];
  for (const [n, s] of slidesOf(D)) {
    const c = s.boxes.filter(cardLike);
    const hasRow = c.some((b: any) => c.filter((x: any) => x.parentBox === b.parentBox && Math.abs(x.rect.y - b.rect.y) <= 4 && Math.abs(x.rect.w - b.rect.w) <= 4 && Math.abs(x.rect.h - b.rect.h) <= 4).length >= 3);
    if (hasRow) rows.push(n);
  }
  if (rows.length > 2) items.push({ msg: `같은 크기 카드 3개 이상 한 줄인 장 ${rows.length}(>2): ${rows.join(", ")}` });
  for (let i = 1; i < rows.length; i++) if (rows[i] === rows[i - 1] + 1) items.push({ n: rows[i], msg: `연속 장 ${rows[i - 1]}·${rows[i]}에서 반복` });
  return { items, measured: { rows }, notes: ["inspect.mjs card-rows는 돌리지 않았다(같은 기준을 DOM으로 직접 잼)"] };
};

const shadowLayers = (s: string) => (s === "none" ? [] : s.split(/,(?![^(]*\))/).map((l) => {
  const color = l.match(/rgba?\([^)]+\)|#[0-9a-f]{3,8}/i)?.[0] ?? "";
  const lens = (l.replace(color, "").match(/-?[\d.]+px/g) ?? []).map(parseFloat);
  return { color: parseColor(color), x: lens[0] ?? 0, y: lens[1] ?? 0, blur: lens[2] ?? 0, spread: lens[3] ?? 0 };
}));
J["CARD-05"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) {
    const sh = s.boxes.filter((b: any) => b.shadow !== "none" && b.position !== "fixed");
    if (sh.length > 1) items.push({ n, msg: `그림자 요소 ${sh.length}개(>1)` });
    for (const b of sh) {
      const L = shadowLayers(b.shadow);
      const a = Math.max(0, ...L.filter((l) => l.blur > 0).map((l) => l.color?.[3] ?? 0)); // 번지는 그림자 층만(흰 링은 그림자가 아님)
      if (a > 0.16) items.push({ n, msg: `그림자 알파 ${a}(>0.16): ${b.label.split(" ")[0]}` });
      const ring = L.some((l) => l.blur === 0 && l.spread > 0), blur = L.some((l) => l.blur > 0), border = b.border.some((w: number) => w >= 1);
      if (ring && blur && border) items.push({ n, msg: `링+그림자+선 동시: ${b.label.split(" ")[0]}` });
      else if (ring && blur) items.push({ n, msg: `같은 경계를 링과 그림자로 겹쳐 그림: ${b.label.split(" ")[0]}` });
    }
    const ts = s.texts.filter((t: any) => t.textShadow && t.textShadow !== "none");
    if (ts.length) items.push({ n, msg: `글자 그림자 ${ts.length}개` });
  }
  const lintShadow = D.ext.lint?.json ? JSON.stringify(D.ext.lint.json).match(/"shadow"/g)?.length ?? 0 : null;
  return { items, measured: { lintShadow } };
};

J["CARD-06"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) {
    let boxed = 0;
    for (const b of s.boxes) {
      if (b.pseudoOnly || b.pseudo) {
        const p = b.pseudo;
        const c = parseColor(p?.bg);
        if (p && p.w > 0 && p.w <= 8 && p.h >= p.w * 3 && c && c[3] > 0) items.push({ n, msg: `::before 세로 막대: ${b.label.split(" ")[0]}` });
      }
      if (b.pseudoOnly) continue;
      const w = b.border;
      const thick = w.filter((x: number) => x >= 3).length;
      if (thick === 1 && w.filter((x: number) => x > 0).length === 1) items.push({ n, msg: `한쪽만 굵은 띠(${w.join("/")}): ${b.label.split(" ")[0]}` });
      if (w.every((x: number) => x === 1) && !b.inTable && !b.inChart) boxed++;
      const ds = b.borderStyle.filter((x: string, i: number) => (x === "dashed" || x === "dotted") && w[i] > 0);
      if (ds.length && !b.inChart) items.push({ n, msg: `장식 점선(${ds[0]}): ${b.label.split(" ")[0]}` });
    }
    if (boxed >= 3) items.push({ n, msg: `1px로 둘러싼 상자 ${boxed}개(≥3)` });
  }
  return { items };
};

J["CARD-07"] = (D) => {
  const items: Item[] = [];
  const radSteps = uniq(Object.entries(tokens(D).vals).filter(([k]) => /^--r-/.test(k)).map(([, v]) => parseFloat(v as string)).filter((x) => x > 0 && x < 999)).sort((a, b) => a - b);
  const con = (D.ext.constitution?.out ?? "").split("\n").filter((l: string) => l.trim().startsWith("모서리"));
  if (con.length) items.push({ msg: `헌법 감사 모서리 위반 ${con.length}` });
  for (const [n, s] of slidesOf(D)) {
    for (const b of s.boxes.filter((x: any) => !x.pseudoOnly && x.radius > 0)) {
      const m = Math.min(b.rect.w, b.rect.h);
      const pill = b.radius >= b.rect.h / 2 - 1;
      if (!pill && b.radius / m > 0.2) items.push({ n, msg: `모서리/짧은 변 ${r1(b.radius / m, 2)}(>0.2): ${b.label.split(" ")[0]} r${b.radius}` });
      if (!pill && b.rect.h < 160 && b.radius >= 24) items.push({ n, msg: `높이 ${b.rect.h}(<160)인데 모서리 ${b.radius}: ${b.label.split(" ")[0]}` });
      if (b.parentBox != null) {
        const o = s.boxes[b.parentBox];
        const inset = b.rect.x - o.rect.x;
        if (o.radius > 0 && inset >= 0 && inset < o.radius) {
          const exp = o.radius - inset;
          if (Math.abs(b.radius - exp) > 1) items.push({ n, msg: `동심 아님: ${b.label.split(" ")[0]} r${b.radius} ≠ ${o.radius}−${r1(inset)}=${r1(exp)}` });
        }
      }
    }
    // 도식 svg(차트가 아닌 큰 svg)의 rect 모서리(rx, 화면 px): 토큰 단계 밖·비율 >0.2·높이<160인데 ≥24
    for (const v of s.svgs.filter((x: any) => !x.chart && x.rect.w * x.rect.h >= 60000)) {
      const bad = new Map<string, number>();
      for (const r of v.rects.filter((x: any) => !x.inMarker && x.rx > 0)) {
        const m = Math.min(r.rect.w, r.rect.h);
        const pill = r.rx >= r.rect.h / 2 - 1;
        const why: string[] = [];
        if (!radSteps.some((t) => Math.abs(t - r.rx) <= 0.5)) why.push(`rx ${r1(r.rx)} 토큰 단계(${radSteps.join("·")}) 밖`);
        if (!pill && r.rx / m > 0.2) why.push(`rx/짧은 변 ${r1(r.rx / m, 2)}(>0.2)`);
        if (!pill && r.rect.h < 160 && r.rx >= 24) why.push(`높이 ${r.rect.h}(<160)인데 rx ${r1(r.rx)}`);
        if (why.length) { const k = why.join(" · "); bad.set(k, (bad.get(k) ?? 0) + 1); }
      }
      for (const [k, c] of bad) items.push({ n, msg: `도식 ${v.cls || "svg"} rect ${c}개: ${k}` });
    }
  }
  return { items, measured: { radiusSteps: radSteps } };
};

J["CARD-08"] = (D) => {
  const items: Item[] = [];
  const labels = new Set<string>();
  for (const [n, s] of slidesOf(D)) {
    const w = s.soweInfo;
    if (!w) continue;
    labels.add(w.label);
    if (w.bg !== w.slideBg) items.push({ n, msg: `결론 띠 배경 ${w.bg} ≠ 장 바탕 ${w.slideBg}` });
    if (w.shadow !== "none") items.push({ n, msg: "결론 띠 그림자 있음" });
    const body = w.text.replace(w.label, "").trim();
    const sentences = (body.match(/(니다|[.!?])(\s|$)/g) ?? []).length;
    if (sentences > 1) items.push({ n, msg: `결론 문장 ${sentences}개(>1)` });
    if (s.headline && jacc(s.headline.text, body) > 0.5) items.push({ n, msg: `헤드라인과 유사도 ${r1(jacc(s.headline.text, body), 2)}(>0.5)` });
  }
  if (labels.size > 1) items.push({ msg: `결론 라벨 ${labels.size}종: ${[...labels].slice(0, 8).join(", ")}` });
  return { items };
};

J["COL-01"] = (D) => {
  const items: Item[] = [];
  const con = (D.ext.constitution?.out ?? "").split("\n").filter((l: string) => l.trim().startsWith("색"));
  if (con.length) items.push({ msg: `헌법 감사 색 위반 ${con.length}` });
  const tk = D.ext.tokenCheck?.out ?? "";
  const colorN = Number(tk.match(/color (\d+)/)?.[1] ?? 0);
  if (colorN) items.push({ msg: `token-check color ${colorN}` });
  const jsColors = Object.entries(D.files.js).flatMap(([f, src]: any) => (stripComments(src).match(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|oklch\(/g) ?? []).map((m: string) => `${f}: ${m}`));
  if (jsColors.length) items.push({ msg: `JS 안 색 리터럴 ${jsColors.length}: ${jsColors.slice(0, 4).join(" · ")}` });
  const off = new Map<string, Set<number>>();
  const add = (what: string, c: RGBA | null, n: number) => { if (!isTokenColor(D, c)) { const k = `${what} ${c ? `rgba(${c.map((v, i) => (i < 3 ? Math.round(v) : r1(v, 2))).join(",")})` : "?"}`; (off.get(k) ?? off.set(k, new Set()).get(k))!.add(n); } };
  for (const [n, s] of slidesOf(D)) {
    for (const t of s.texts) add(t.inSvg ? "fill" : "color", textColor(t), n);
    for (const b of s.boxes) { if (b.pseudoOnly) continue; add("background", parseColor(b.bg), n); if (b.border.some((w: number) => w > 0)) add("border", parseColor(b.borderColor), n); }
    for (const v of s.svgs) for (const m of [...v.polylines, ...v.circles, ...v.rects, ...v.lines, ...v.paths]) { if (m.stroke !== "none" && m.sw > 0) add("stroke", parseColor(m.stroke), n); if (m.fill !== "none" && !/^(line|polyline)$/i.test(m.tag)) add("fill", parseColor(m.fill), n); }
  }
  for (const [k, ns] of off) items.push({ n: [...ns][0], msg: `토큰 밖 계산 색 ${k} — 장 ${[...ns].slice(0, 10).join(",")}` });
  return { items, measured: { offTokenComputed: off.size } };
};

J["COL-02"] = (D) => {
  const items: Item[] = [];
  for (const [n] of slidesOf(D)) {
    const st = D.pix[n]?.stats;
    if (st && st.chromaShare > 0.005) items.push({ n, msg: `OKLCH C>0.14 픽셀 ${r1(st.chromaShare * 100, 2)}%(>0.5%, 사진 제외)` });
  }
  const seen = new Map<string, number>();
  for (const [n, s] of slidesOf(D)) {
    const cs = [...s.texts.map(textColor), ...s.boxes.filter((b: any) => !b.pseudoOnly).map((b: any) => parseColor(b.bg)), ...s.svgs.flatMap((v: any) => [...v.polylines, ...v.circles, ...v.rects].flatMap((m: any) => [parseColor(m.stroke), parseColor(m.fill)]))];
    for (const c of cs) {
      if (!c || c[3] === 0) continue;
      const o = oklch(c);
      const k = hex(c);
      if (seen.has(k)) continue;
      seen.set(k, n);
      if (o.C > 0.135) items.push({ n, msg: `계산 색 ${k} 채도 C ${r1(o.C, 3)}(>0.135)` });
      if (o.C > 0.08 && (o.H < 20 || o.H > 340)) items.push({ n, msg: `빨강 계열 고채도 ${k}` });
      if (o.C > 0.04 && o.H >= 70 && o.H <= 110 && o.L > 0.85) items.push({ n, msg: `노란 크림 ${k}` });
      if (o.C > 0.1 && o.H >= 25 && o.H <= 55) items.push({ n, msg: `테라코타 ${k}` });
    }
  }
  const old = (allCss(D) + D.files.html + allJs(D)).match(/#(2448e8|d4f57a)/gi) ?? [];
  if (old.length) items.push({ msg: `이전 원색 hex ${old.length}건` });
  return { items };
};

J["COL-03"] = (D) => {
  const items: Item[] = [];
  const fam = ["--accent", "--accent-50", "--accent-100"].map((k) => tc(D, k)).filter(Boolean);
  const isAcc = (c: RGBA | null) => !!c && c[3] > 0 && fam.some((f) => deltaE(c, f) < 3);
  for (const [n, s] of slidesOf(D)) {
    let cnt = s.texts.filter((t: any) => !t.inSvg && isAcc(textColor(t))).length;
    cnt += s.svgs.filter((v: any) => [...v.polylines, ...v.circles, ...v.rects, ...v.texts.map((t: any) => ({ fill: t.fill, stroke: "none" }))].some((m: any) => isAcc(parseColor(m.fill)) || isAcc(parseColor(m.stroke)))).length;
    const bgs = s.boxes.filter((b: any) => !b.pseudoOnly && isAcc(parseColor(b.bg)));
    cnt += bgs.length;
    if (cnt > 2) items.push({ n, msg: `인디고 요소 ${cnt}개(>2, svg는 1로 셈)` });
    if (bgs.length > 1) items.push({ n, msg: `인디고 배경 칠 ${bgs.length}개(>1): ${bgs.slice(0, 3).map((b: any) => b.label.split(" ")[0]).join(" · ")}` });
    const share = D.pix[n]?.stats?.indigoShare ?? 0;
    if (share > 0.08) items.push({ n, msg: `인디고 픽셀 ${r1(share * 100, 1)}%(>8%)` });
  }
  return { items, notes: ["인디고 픽셀: #4c5eb2는 ΔE<10, 옅은 단계 #eff2fc·#dfe6fb는 바탕 스톤과 ΔE 6~7이라 ΔE<3으로 좁혀 셈(절차의 ±ΔE10을 그대로 쓰면 바탕 전체가 인디고로 잡힘)"] };
};

J["COL-04"] = (D) => {
  const items: Item[] = [];
  const cm = D.files.std["color.md"] ?? "";
  for (const w of ["인디고", "세이지", "스톤"]) if (!new RegExp(`\\|[^\\n]*${w}[^\\n]*\\|`).test(cm)) items.push({ msg: `color.md 의미 표에 ${w} 행 없음` });
  if (!/의미|용도/.test(cm)) items.push({ msg: "color.md에 색별 의미(용도) 표 없음" });
  // 같은 이름의 계열 라벨이 차트마다 다른 색인지
  const lab2: Map<string, Set<string>> = new Map();
  for (const [, s] of slidesOf(D)) for (const v of s.svgs.filter((x: any) => x.chart)) for (const t of v.texts.filter((t: any) => /note|vlab|slab|band-lab/.test(t.cls) && HANGUL.test(t.text))) {
    const k = t.text.replace(/[\d.,%~\s]+/g, "");
    if (k.length < 2) continue;
    (lab2.get(k) ?? lab2.set(k, new Set()).get(k))!.add(`${v.chart}:${t.fill}`);
  }
  for (const [k, set] of lab2) { const fills = uniq([...set].map((x) => x.split(":").slice(1).join(":"))); const charts = uniq([...set].map((x) => x.split(":")[0])); if (charts.length > 1 && fills.length > 1) items.push({ msg: `같은 대상 '${k}' 차트마다 색 다름: ${[...set].join(" · ")}` }); }
  return { items, implemented: "auto+manual", manual: ["design-standard/color.md", ...chartShots(D)] };
};
const chartSlides = (D: Data) => slidesOf(D).filter(([, s]) => s.svgs.some((v: any) => v.chart)).map(([n]) => n);
const chartShots = (D: Data) => chartSlides(D).map((n) => shotOf(D, n));

J["COL-05"] = (D) => {
  const items: Item[] = [];
  const note = tc(D, "--note");
  const notes = ["--note", "--note-on-soot", "--photo-note", "--on-accent-note", "--on-sage-note"].map((k) => tc(D, k)).filter(Boolean);
  const canvas = [tc(D, "--canvas"), tc(D, "--paper")];
  for (const [n, s] of slidesOf(D)) {
    let noteChars = 0, allChars = 0;
    for (const t of s.texts) {
      const c = textColor(t);
      if (!c) continue;
      if (!t.inSvg && note && deltaE(c, note) < 1 && t.bg.kind === "solid" && !t.overImg && !canvas.some((x) => x && deltaE(parseColor(t.bg.color)!, x) < 1)) items.push({ n, msg: `색 면 위 --note 글자: ${t.label} (바탕 ${t.bg.color})` });
      if (t.efs >= 18) { allChars += t.own.length; if (notes.some((x) => deltaE(c, x) < 1)) noteChars += t.own.length; }
      if (t.op < 0.999 || c[3] < 0.999) items.push({ n, msg: `흐린 글자(opacity ${t.op}, 알파 ${r1(c[3], 2)}): ${t.label}` });
    }
    if (allChars && noteChars / allChars > 0.5) items.push({ n, msg: `18px 이상 글자 중 회색 비율 ${r1((noteChars / allChars) * 100, 0)}%(>50%)` });
  }
  return { items };
};

const largeText = (t: any) => t.efs >= 24 || (t.efs >= 18.66 && t.fw >= 700);
J["CON-01"] = (D) => {
  const items: Item[] = [];
  let checked = 0, viaPixels = 0;
  for (const [n, s] of slidesOf(D)) {
    const px = D.pix[n]?.text ?? [];
    const idx = D.pix[n]?.textIdx ?? [];
    const pxOf = new Map(idx.map((ti: number, j: number) => [ti, px[j]]));
    for (const t of s.texts) {
      if (t.op < 0.05 || t.ariaHidden) continue;
      const c = textColor(t);
      if (!c) continue;
      const need = largeText(t) ? 3 : 4.5;
      let ratio: number | null = null;
      if (t.bg.kind === "solid" && !t.overImg && !t.inSvg) {
        const bg = parseColor(t.bg.color)!;
        ratio = contrast(over(c, bg), bg);
      } else {
        const p: any = pxOf.get(t.i);
        // svg 글자는 도형 칠 위에 있어 DOM 조상으로 바탕을 알 수 없다 → 상자 안 바탕 최빈 색. 사진·그라데이션 위는 최악 5%
        if (p) { ratio = t.inSvg && !t.overImg ? p.mode : p.worst5; viaPixels++; }
      }
      if (ratio == null) continue;
      checked++;
      if (ratio < need) items.push({ n, msg: `대비 ${r1(ratio, 2)}:1 < ${need} — ${t.label} ${t.efs}px ${t.fw} (${t.bg.kind === "solid" && !t.overImg && !t.inSvg ? `바탕 ${t.bg.color}` : t.inSvg && !t.overImg ? "픽셀 바탕 최빈 색" : "픽셀 최악 5%"})` });
    }
  }
  return { items, measured: { checked, viaPixels }, notes: ["axe-core가 설치돼 있지 않아 계산 색과 실제 뒤 불투명 바탕(조상 합성)으로 직접 잼. 사진·그라데이션 위는 픽셀 최악 5%", "design-standard 대비표와 실측값 대조는 수동"], implemented: "partial" };
};

J["CON-02"] = (D) => {
  const items: Item[] = [];
  let n0 = 0;
  for (const [n, s] of slidesOf(D)) {
    const px = D.pix[n]?.text ?? [];
    const idx = D.pix[n]?.textIdx ?? [];
    idx.forEach((ti: number, j: number) => {
      const t = s.texts[ti];
      if (!t || !(t.overImg || t.bg.kind !== "solid") || !px[j]) return;
      n0++;
      const need = largeText(t) ? 3 : 4.5;
      if (px[j].worst5 < need) items.push({ n, msg: `사진 위 글자 최악 5% 대비 ${px[j].worst5}:1 < ${need} — ${t.label}` });
    });
    for (const i of s.images) if (i.filter && i.filter !== "none" && /sepia|hue-rotate|saturate|grayscale|contrast/.test(i.filter)) items.push({ n, msg: `사진 색 필터 ${i.filter}` });
    for (const b of s.boxes) if (/gradient/.test(b.bgImage)) for (const c of (b.bgImage.match(/rgba?\([^)]+\)/g) ?? []).map(parseColor)) if (c && oklch(c).C > 0.03 && c[3] > 0.1) { items.push({ n, msg: `사진 위 색 오버레이 ${b.label.split(" ")[0]}` }); break; }
  }
  return { items, measured: { textsOverPhoto: n0 } };
};

const marksOf = (v: any) => [...v.polylines.map((m: any) => ({ ...m, col: m.stroke })), ...v.circles.map((m: any) => ({ ...m, col: m.fill })), ...v.rects.filter((m: any) => !/band/.test(m.cls)).map((m: any) => ({ ...m, col: m.fill }))].filter((m) => m.col && m.col !== "none");
J["CON-03"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) for (const v of s.svgs.filter((x: any) => x.chart)) {
    const bg = parseColor(v.bg)!;
    const labels = v.texts.filter((t: any) => /vlab|note|slab|band-lab|alab/.test(t.cls));
    const low = new Map<string, { ratio: number; total: number; unlabeled: number }>();
    for (const m of marksOf(v)) {
      let c = parseColor(m.col)!;
      if (m.fillOpacity < 1 && m.col === m.fill) c = [c[0], c[1], c[2], c[3] * m.fillOpacity];
      const ratio = contrast(over(c, bg), bg);
      if (ratio >= 3) continue;
      const k = `${m.tag}.${m.cls} ${hex(over(c, bg))}`;
      const e = low.get(k) ?? low.set(k, { ratio, total: 0, unlabeled: 0 }).get(k)!;
      e.total++;
      if (!labels.some((t: any) => dist(t.rect, m.rect) <= 24)) e.unlabeled++; // 마크마다 바로 옆(24px) 직접 라벨
    }
    for (const [k, e] of low) if (e.unlabeled) items.push({ n, msg: `${v.chart} ${k} 대비 ${r1(e.ratio, 2)}:1(<3) — ${e.total}개 중 ${e.unlabeled}개 직접 라벨 없음` });
  }
  // 도식(차트가 아닌 큰 svg)의 연결선·화살촉도 관계를 담은 그래픽이라 배경 대비 3:1(WCAG 1.4.11)을 본다
  for (const [n, s] of slidesOf(D)) for (const v of s.svgs.filter((x: any) => !x.chart && x.rect.w * x.rect.h >= 60000)) {
    const bg = parseColor(v.bg);
    if (!bg) continue;
    const low = new Map<string, number>();
    for (const e of [...v.paths, ...v.lines, ...v.polylines].filter((x: any) => !x.inMarker && x.stroke && x.stroke !== "none")) {
      const c = parseColor(e.stroke);
      if (!c || c[3] === 0) continue;
      const ratio = contrast(over(c, bg), bg);
      if (ratio < 3) { const k = `연결선 ${e.tag}.${e.cls} ${hex(over(c, bg))} 대비 ${r1(ratio, 2)}:1(<3)`; low.set(k, (low.get(k) ?? 0) + 1); }
    }
    for (const m of v.markers ?? []) {
      const c = m.fill ? parseColor(m.fill) : null;
      if (!c || c[3] === 0) continue;
      const ratio = contrast(over(c, bg), bg);
      const users = [...v.paths, ...v.lines].filter((x: any) => String(x.markerEnd ?? "").includes(`#${m.id}`));
      if (ratio < 3 && users.length) low.set(`화살촉 #${m.id} ${hex(over(c, bg))} 대비 ${r1(ratio, 2)}:1(<3)`, users.length);
      const other = uniq(users.map((x: any) => x.stroke).filter((st: string) => st && parseColor(st) && hex(parseColor(st)!) !== hex(c)));
      if (other.length) low.set(`화살촉 #${m.id} 색 ${hex(c)}이 선 색 ${other.map((st: string) => hex(parseColor(st)!)).join("·")}와 다름(공용 화살촉)`, users.filter((x: any) => other.includes(x.stroke)).length);
    }
    for (const [k, c] of low) items.push({ n, msg: `도식 ${v.cls || "svg"} ${k} — ${c}개` });
  }
  return { items, notes: ["validate_palette.js(dataviz 스킬)는 이 환경 경로가 고정돼 있지 않아 돌리지 않음 — 마크 색 대비를 직접 잼"], implemented: "partial" };
};

J["CON-04"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) for (const v of s.svgs.filter((x: any) => x.chart)) {
    const cols = uniq(marksOf(v).map((m: any) => m.col)).map((c) => parseColor(c as string)!).filter((c) => c && c[3] > 0);
    const L = uniq(cols.map((c) => r1(lab(projector(c))[0], 1))).sort((a, b) => a - b);
    for (let i = 1; i < L.length; i++) if (L[i] - L[i - 1] < 15) items.push({ n, msg: `${v.chart} 프로젝터 모사 인접 계열 ΔL* ${r1(L[i] - L[i - 1])}(<15)` });
  }
  return { items, implemented: "auto+manual", manual: Object.values(D.ix.sim ?? {}).flat() as string[] };
};

const stops = (g: string) => (g.match(/rgba?\([^)]+\)|#[0-9a-f]{3,8}/gi) ?? []).map(parseColor).filter(Boolean) as RGBA[];
const gradientsOf = (s: any) => s.boxes.filter((b: any) => /gradient/.test(b.bgImage)).map((b: any) => ({ label: b.label, stops: stops(b.bgImage) })).concat(s.svgs.flatMap((v: any) => v.grads.map((g: string[]) => ({ label: "svg gradient", stops: g.map(parseColor).filter(Boolean) }))));
J["GRAD-01"] = (D) => {
  const items: Item[] = [];
  const css = stripComments(allCss(D));
  const cssGrads = [...css.matchAll(/(linear|radial|conic)-gradient\(([^;]+)\)/g)].map((m) => m[0]);
  const resolve = (s: string) => s.replace(/var\((--[\w-]+)\)/g, (_, k) => tokens(D).vals[k] ?? k).replace(/rgba\(\s*([\d\s,]+),\s*([\d.]+)\s*\)/g, "rgba($1, $2)");
  const check = (label: string, st: RGBA[], n?: number) => {
    for (let i = 1; i < st.length; i++) {
      const a = oklch(st[i - 1]), b = oklch(st[i]);
      const dh = Math.min(Math.abs(a.H - b.H), 360 - Math.abs(a.H - b.H));
      if (Math.abs(a.L - b.L) > 0.08) items.push({ n, msg: `${label} 정지점 ΔL ${r1(Math.abs(a.L - b.L), 3)}(>0.08)` });
      if (Math.abs(a.C - b.C) > 0.04) items.push({ n, msg: `${label} ΔC ${r1(Math.abs(a.C - b.C), 3)}(>0.04)` });
      if (a.C > 0.02 && b.C > 0.02 && dh > 20) items.push({ n, msg: `${label} 색상각 차 ${r1(dh, 0)}°(>20)` });
      if (a.C > 0.02 && b.C > 0.02 && a.H >= 280 && a.H <= 320 && b.H >= 240 && b.H <= 270) items.push({ n, msg: `${label} 보라→파랑` });
    }
  };
  for (const [n, s] of slidesOf(D)) for (const g of gradientsOf(s)) check(g.label.split(" ")[0], g.stops, n);
  for (const g of cssGrads) check(`CSS ${g.slice(0, 40)}`, stops(resolve(g)));
  return { items, measured: { cssGradients: cssGrads.length }, notes: ["가상 요소(::after) 그라데이션은 CSS 원문에서 토큰을 풀어 잼"] };
};

J["GRAD-02"] = (D) => {
  const items: Item[] = [];
  const css = stripComments(allCss(D));
  const gradSel = [...css.matchAll(/([^{}]+)\{[^}]*gradient\([^}]*\}/g)].map((m) => m[1].trim());
  const slidesWith = slidesOf(D).filter(([, s]) => gradientsOf(s).length || s.bleed && gradSel.some((x) => /bleed/.test(x))).map(([n]) => n);
  if (slidesWith.length > 8) items.push({ msg: `그라데이션 장 ${slidesWith.length}(>8)` });
  for (const [n, s] of slidesOf(D)) for (const t of s.texts.filter((t: any) => t.bgClip === "text")) items.push({ n, msg: `그라데이션 글자(background-clip:text) — 양 끝 대비 수동 확인: ${t.label}` });
  return { items, measured: { slidesWith }, implemented: "auto+manual", manual: slidesWith.map((n) => shotOf(D, n)) };
};

J["GRAD-03"] = (D) => {
  const items: Item[] = [];
  const src = { ...Object.fromEntries(["tokens.css", "deck.css", "slides.css"].map((f, i) => [f, [D.files.tokens, D.files.deck, D.files.slides][i]])), ...D.files.extraCss, "index.html": D.files.html };
  for (const [f, txt] of Object.entries(src) as [string, string][]) stripComments(txt).split("\n").forEach((l, i) => {
    if (/radial-gradient|repeating-(linear|radial)-gradient|backdrop-filter|filter:\s*blur\(\s*(0?\.\d*[1-9]|[1-9])/.test(l)) items.push({ msg: `${f}:${i + 1} ${l.trim().slice(0, 90)}` });
  });
  let backdrop = 0;
  for (const [n, s] of slidesOf(D)) {
    backdrop += s.boxes.filter((b: any) => b.backdrop && b.backdrop !== "none").length;
    if (s.dark) for (const b of s.boxes) for (const l of shadowLayers(b.shadow)) if (l.blur > 0 && l.color && lab(l.color)[0] > 70 && l.color[3] > 0.05) items.push({ n, msg: `어두운 장 빛 번짐 그림자: ${b.label.split(" ")[0]}` });
  }
  if (backdrop > 1) items.push({ msg: `backdrop-filter 요소 ${backdrop}(>1)` });
  return { items };
};

J["TYP-01"] = (D) => {
  const items: Item[] = [];
  const f = D.ix.fonts;
  if (!f) items.push({ msg: "글꼴 측정 없음" });
  else {
    for (const [fam, glyphs] of Object.entries(f.families)) if (fam !== "Pretendard Variable") items.push({ msg: `다른 글꼴로 렌더: ${fam} (${glyphs} 글리프)` });
    if (f.woffStatus !== 200) items.push({ msg: `woff2 응답 ${f.woffStatus}` });
    if (!f.fontsCheck) items.push({ msg: "document.fonts.check 실패" });
  }
  const ff = [...Object.entries({ ...D.files.extraCss, "tokens.css": D.files.tokens, "deck.css": D.files.deck, "slides.css": D.files.slides }), ...Object.entries(D.files.js)].flatMap(([file, t]: any) => stripComments(t).split("\n").map((l: string, i: number) => [file, i + 1, l]).filter(([, , l]: any) => /font-family\s*:/.test(l) && !/var\(--font\)/.test(l) && !/@font-face/.test(l)));
  for (const [file, i, l] of ff) items.push({ msg: `${file}:${i} font-family 직접 지정: ${String(l).trim().slice(0, 80)}` });
  if (/monospace|\bmono\b/i.test(stripComments(allCss(D)))) items.push({ msg: "CSS에 모노스페이스 지정" });
  return { items, measured: f, notes: ["공개 URL의 글꼴 확인은 --public=URL로 돌린다"] };
};

J["TYP-02"] = (D) => {
  const items: Item[] = [];
  const con = D.ext.constitution9;
  if (con && con.code !== 0) items.push({ msg: `헌법 감사 --max-sizes 9 종료 ${con.code}: ${con.out.split("\n")[0]}` });
  const P = tokens(D).presets;
  const sizes = new Set(P.map((p: any) => p.size));
  const fs = new Map<number, number[]>(), fw = new Map<number, number[]>();
  for (const [n, s] of slidesOf(D)) for (const t of s.texts) { (fs.get(t.fs) ?? fs.set(t.fs, []).get(t.fs))!.push(n); (fw.get(t.fw) ?? fw.set(t.fw, []).get(t.fw))!.push(n); }
  if (fs.size > 9) items.push({ msg: `계산 글자 크기 ${fs.size}종(>9): ${[...fs.keys()].sort((a, b) => a - b).join(", ")}` });
  for (const [v, ns] of fs) if (!sizes.has(v)) items.push({ n: ns[0], msg: `프리셋 밖 글자 크기 ${v}px — 장 ${uniq(ns).slice(0, 8).join(",")}` });
  for (const [v, ns] of fw) if (![400, 600, 700].includes(v)) items.push({ n: ns[0], msg: `굵기 ${v} — 장 ${uniq(ns).slice(0, 8).join(",")}` });
  const eff = new Map<number, number[]>();
  for (const [n, s] of slidesOf(D)) for (const t of s.texts.filter((t: any) => t.inSvg)) if (![...sizes].some((p) => Math.abs(p - t.efs) < 0.5)) (eff.get(r1(t.efs)) ?? eff.set(r1(t.efs), []).get(r1(t.efs)))!.push(n);
  for (const [v, ns] of eff) items.push({ n: ns[0], msg: `svg 축소로 프리셋 밖 실효 크기 ${v}px — 장 ${uniq(ns).slice(0, 8).join(",")}` });
  stripComments(D.files.js["charts.js"] ?? "").split("\n").forEach((l, i) => { for (const m of l.matchAll(/["']font-size["']\s*:\s*(\d+(\.\d+)?)/g)) if (!sizes.has(Number(m[1]))) items.push({ msg: `charts.js:${i + 1} font-size ${m[1]} 하드코딩(프리셋 밖)` }); });
  return { items, measured: { sizes: [...fs.keys()].sort((a, b) => a - b), weights: [...fw.keys()].sort() } };
};

J["TYP-03"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) {
    for (const t of s.texts) {
      if (t.ariaHidden || t.op < 0.05) continue;
      if (t.efs < 14) items.push({ n, msg: `${t.efs}px(<14): ${t.label}${t.inSvg ? ` (svg 축소 ${t.k})` : ""}` });
      else if (t.efs < 18 && !isTertiary(t)) items.push({ n, msg: `${t.efs}px 3차 정보 아님: ${t.label}${t.inSvg ? ` (svg 축소 ${t.k})` : ""}` });
    }
  }
  for (const x of D.ext.render?.json?.issues ?? []) if (x.tiny?.length) items.push({ n: x.n, msg: `fit 보고 tiny ${x.tiny.length}: ${x.tiny[0]}` });
  const T = (src: string) => (src.match(/const TERTIARY = "([^"]+)"/)?.[1] ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  const extra = T(D.files.js["fit.js"] ?? "").filter((x) => !T(D.files.deckFit ?? "").includes(x));
  const exc = (D.ext.render?.json?.excepted ?? []).reduce((a: number, x: any) => a + x.excepted.length, 0);
  return { items, measured: { tertiaryExtraSelectors: extra, fitExcepted: exc }, notes: [`3차 정보는 .foot·.source·.chart-src·.pg·.credit·'n=' 캡션으로 좁게 본다. fit.js TERTIARY는 공통 deck-fit.js보다 ${extra.length}개 넓다(${extra.slice(0, 6).join(", ")}…) — fit 보고의 '예외로 넘김' ${exc}개`] };
};

J["TYP-04"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) {
    const bad = s.texts.filter((t: any) => !t.inSvg && (t.tag === "p" || t.tag === "li") && t.ctx.includes("body") && !isTertiary(t) && t.fs < 24);
    if (bad.length) items.push({ n, msg: `본문 문단 ${uniq(bad.map((t: any) => t.fs)).join("/")}px(<24) ${bad.length}개: ${bad[0].label}` });
  }
  return { items };
};

J["TYP-05"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) {
    const odd = s.texts.filter((t: any) => !t.inSvg && (t.lh === "normal" || Math.abs(t.lh % 4) > 0.01));
    if (odd.length) items.push({ n, msg: `행간 4 배수 아님 ${odd.length}: ${odd.slice(0, 2).map((t: any) => `${t.label} ${t.lh}`).join(" · ")}` });
    const tight = s.texts.filter((t: any) => !t.inSvg && t.lines >= 3 && typeof t.lh === "number" && t.lh / t.fs < 1.2);
    if (tight.length) items.push({ n, msg: `3줄 이상 행간 비 <1.2: ${tight[0].label} ${r1(tight[0].lh / tight[0].fs, 2)}` });
  }
  const P = [...tokens(D).presets].sort((a: any, b: any) => a.size - b.size);
  const body = P.find((p: any) => p.name === "--t-body");
  if (body && body.lh / body.size < 1.5) items.push({ msg: `--t-body 행간 비 ${r1(body.lh / body.size, 2)}(<1.5)` });
  for (let i = 1; i < P.length; i++) if (P[i].size > P[i - 1].size && P[i].lh / P[i].size > P[i - 1].lh / P[i - 1].size + 1e-9) items.push({ msg: `프리셋 행간 비 단조 위반: ${P[i - 1].name} ${r1(P[i - 1].lh / P[i - 1].size, 2)} → ${P[i].name} ${r1(P[i].lh / P[i].size, 2)}` });
  return { items };
};

J["TYP-06"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) {
    for (const t of s.texts) if ((t.to === "ellipsis" || t.ovx === "hidden") && t.sw > t.cw + 1 && !t.inSvg) items.push({ n, msg: `말줄임·잘림 ${t.sw}>${t.cw}: ${t.label}` });
    for (const x of s.sources) if (x.sw > x.cw + 1) items.push({ n, msg: `출처 잘림 ${x.sw}>${x.cw}: "${x.text.slice(0, 40)}"` });
    for (const t of s.texts) if (/…$/.test(t.own)) items.push({ n, msg: `'…'로 끝남: ${t.label}` });
  }
  if (/text-overflow\s*:\s*ellipsis/.test(stripComments(D.files.deck))) items.push({ msg: "deck.css에 text-overflow: ellipsis" });
  return { items };
};

J["TYP-07"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) for (const t of s.texts) {
    if (t.inSvg || !HANGUL.test(t.full)) continue;
    if (t.wb !== "keep-all") items.push({ n, msg: `keep-all 아님(${t.wb}): ${t.label}` });
    if (t.block && t.lines >= 2) {
      const last = t.lastLine.replace(/\s/g, "");
      if (last.length <= 2 || !/\s/.test(t.lastLine.trim())) items.push({ n, msg: `고아 줄 '${t.lastLine}'(${last.length}자): ${t.label}` });
    }
  }
  return { items };
};

J["TYP-08"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) {
    const h = s.headline;
    if (!h) continue;
    if (h.lines > 2) items.push({ n, msg: `헤드라인 ${h.lines}줄(>2): "${h.text.slice(0, 30)}"` });
    else if (h.lines === 2 && h.br === 0) items.push({ n, msg: `자동 줄바꿈 2줄: "${h.text.slice(0, 30)}"` });
  }
  return { items };
};

J["TYP-09"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) {
    const T = s.texts.filter((t: any) => !t.ariaHidden && t.op > 0.05);
    if (!T.length) continue;
    const sizes = uniq(T.map((t: any) => r1(t.efs, 0) as number)).sort((a, b) => b - a);
    const weight = new Map<number, number>();
    for (const t of T.filter((t: any) => !isTertiary(t))) weight.set(r1(t.efs, 0), (weight.get(r1(t.efs, 0)) ?? 0) + t.own.length);
    const body = [...weight.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 20;
    if (sizes[0] / body < 2.4) items.push({ n, msg: `최대/본문 ${r1(sizes[0] / body, 2)}(<2.4): ${sizes[0]}/${body}` });
    if (sizes.length > 1 && sizes[1] / sizes[0] >= 0.75) items.push({ n, msg: `둘째 크기/최대 ${r1(sizes[1] / sizes[0], 2)}(≥0.75): ${sizes[1]}/${sizes[0]}` });
    if (sizes.length > 5) items.push({ n, msg: `고유 크기 ${sizes.length}(>5): ${sizes.join(",")}` });
    for (let i = 1; i < sizes.length; i++) if (sizes[i - 1] / sizes[i] < 1.15) { items.push({ n, msg: `이웃 크기 비 ${r1(sizes[i - 1] / sizes[i], 2)}(<1.15): ${sizes[i - 1]}/${sizes[i]}` }); break; }
  }
  return { items };
};

J["TYP-10"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) for (const t of s.texts) {
    const em = t.fs ? t.ls / t.fs : 0;
    if (HANGUL.test(t.own) && em < -0.02 - 1e-6) items.push({ n, msg: `한글 자간 ${r1(em, 3)}em(< −0.02): ${t.label}` });
    if (t.fs <= 16 && t.ls < 0) items.push({ n, msg: `16px 이하 음수 자간 ${r1(em, 3)}em: ${t.label}` });
    const latin = t.own.replace(/[^A-Za-z]/g, "");
    if (t.fs <= 16 && em > 0.04 && (t.tt === "uppercase" || (latin.length >= 3 && latin.replace(/[^A-Z]/g, "").length / latin.length > 0.8))) items.push({ n, msg: `자간 넓힌 대문자 라벨: ${t.label}` });
  }
  return { items };
};

J["TYP-11"] = (D) => {
  const items: Item[] = [];
  const hero: number[] = [];
  for (const [n, s] of slidesOf(D)) {
    const numsBig = s.texts.filter((t: any) => /\d/.test(t.own) && t.efs >= 80);
    if (numsBig.length >= 2) items.push({ n, msg: `80px 이상 숫자 ${numsBig.length}개: ${numsBig.slice(0, 3).map((t: any) => t.own).join(" · ")}` });
    if (s.texts.some((t: any) => t.fs >= 96)) hero.push(n);
    for (const t of s.texts.filter((t: any) => /\d/.test(t.own) && t.efs >= 48 && /tabular-nums/.test(t.fvn))) items.push({ n, msg: `영웅 숫자가 tabular-nums: ${t.label}` });
    for (const t of s.texts.filter((t: any) => t.tag === "td" && /\d/.test(t.own) && !/tabular-nums/.test(t.fvn))) items.push({ n, msg: `표 숫자 tabular-nums 아님: ${t.label}` });
    for (const v of s.svgs) for (const t of v.texts.filter((t: any) => /tick/.test(t.cls) && !/tabular-nums/.test(t.fvn))) { items.push({ n, msg: `눈금 tabular-nums 아님: ${t.text}` }); break; }
  }
  if (hero.length > 2) items.push({ msg: `96px hero 프리셋 장 ${hero.length}(>2): ${hero.join(", ")}` });
  return { items };
};

J["TYP-12"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) for (const t of s.texts) {
    if (t.inSvg) continue;
    if (t.fs >= 40 && t.lines >= 3) items.push({ n, msg: `${t.fs}px 문장 ${t.lines}줄: ${t.label}` });
    if (t.ta === "center" && t.lines >= 3) items.push({ n, msg: `가운데 정렬 ${t.lines}줄: ${t.label}` });
    if (t.ta === "justify") items.push({ n, msg: `양쪽 정렬: ${t.label}` });
    if ((t.tag === "p" || t.tag === "li") && t.maxLine > 45) items.push({ n, msg: `줄당 ${t.maxLine}자(>45): ${t.label}` });
  }
  return { items };
};

J["TYP-13"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) {
    for (const k of s.headline?.styledKids ?? []) if (k.color || k.style || k.family || k.deco) items.push({ n, msg: `헤드라인 안 꾸밈(${["color", "style", "family", "deco"].filter((x) => k[x]).join("·")}): ${k.label}` });
    if (/\p{Extended_Pictographic}/u.test(s.slideText)) items.push({ n, msg: "이모지" });
    const noPg = s.slideText.replace(s.pgText ?? "", "");
    const seq = noPg.match(/(?<![\w.,\-/:])0[1-9](?![\w.,\-/:])/g); // 날짜(2026-05)·시각은 빼고 홀로 선 01~09만
    if (seq) items.push({ n, msg: `장식 순번 ${seq.join(",")}` });
    // 동그라미·검은 동그라미 숫자(①②③ ❶❷ ➀)도 장식 순번이다 — 도식 svg 글자까지 본다
    const circ = [s.slideText, ...s.svgs.flatMap((v: any) => v.texts.map((t: any) => t.text))].join(" ").match(/[\u2460-\u2473\u2776-\u2793\u24EA-\u24FF]/g);
    if (circ) items.push({ n, msg: `동그라미 장식 순번 ${uniq(circ).join("")}` });
  }
  return { items };
};

J["TYP-14"] = (D) => {
  const items: Item[] = [];
  if (/font-display\s*:\s*block/.test(stripComments(allCss(D)))) items.push({ msg: "font-display: block" });
  if (!/<link[^>]+rel=["']preload["'][^>]+as=["']font["']/.test(D.files.html)) items.push({ msg: "글꼴 preload 없음" });
  const big = D.files.fontFiles.filter((f: any) => f.bytes > 1024 * 1024);
  if (big.length && !/unicode-range/.test(allCss(D))) items.push({ msg: `첫 글꼴 ${big.map((f: any) => `${f.name} ${r1(f.bytes / 1048576, 2)}MB`).join(", ")}(>1MB, 분할 없음)` });
  const s = D.ix.slow;
  if (!s) items.push({ msg: "느린 회선 측정 없음" });
  else if (s.fontAt == null || s.fontAt > 1500) items.push({ msg: `Slow 4G 근사에서 글꼴 적용(h1 표시) ${s.fontAt == null ? "12초 안에 없음" : s.fontAt + "ms"}(>1500ms${s.fontAt == null || s.fontAt > 3000 ? ", 최악 3초 초과" : ""})` });
  return { items, measured: s ? { fontAt: s.fontAt, fcp: s.fcp } : null, notes: ["CDP 네트워크 제한(150ms RTT·1.6Mbps)·CPU 4배로 근사. 실제 회선·기기 아님"] };
};

// ── 문장 ──
const proseTexts = (s: any) => s.texts.filter((t: any) => !t.inSvg && (["p", "li", "td"].includes(t.tag) || t.ctx.includes("sowe") || (t.ctx.includes("card") && t.tag !== "h3")) && !t.ctx.some((c: string) => ["headline", "kicker", "source", "foot", "chart-src", "tag", "pg", "chart-title", "legend"].includes(c)));
// 문장 나누기: 마침표·물음표·느낌표 뒤 공백, 그리고 표 칸·메타 줄의 가운뎃점(' · ')을 경계로 본다.
// 끝의 괄호 꼬리('(3주)')는 어미 판정 전에 떼어 낸다 — '나눈다 · cleaning-log (3주)'의 '~다'를 놓치지 않게
const sentences = (txt: string) => txt.split(/(?<=[.!?])\s+|\s+·\s+/).map((x) => x.trim()).filter((x) => x.length > 1);
// 따옴표로 끝나는 조각('줄였다'(인과))은 덱 자신의 어미가 아니라 인용한 말이라 빈 문자열(판정 안 함)을 돌려준다
const endOf = (se: string) => {
  let e = se, prev = "";
  while (e !== prev) { prev = e; e = e.replace(/\s*[(（\[][^()（）\[\]]*[)）\]]\s*$/, "").replace(/[\s.!?…·]+$/, ""); }
  if (/['’"”」』]$/.test(e) && /['‘"“「『]/.test(e.slice(0, -1))) return "";
  return e.replace(/[)\]」』"'’”]+$/, "");
};
J["TXT-01"] = (D) => {
  const items: Item[] = [];
  const bad = (s: string) => /[,:，：]/.test(s.replace(/\d,\d{3}/g, ""));
  for (const [n, s] of slidesOf(D)) for (const t of s.texts) {
    const isTitle = t.ctx.includes("headline") || /^h[1-6]$/.test(t.tag) || /\b(title|q|chart-title)\b/.test(t.cls) || t.tag === "th" || t.tag === "blockquote";
    if (isTitle && bad(t.own)) items.push({ n, msg: `제목류 쉼표·콜론: ${t.label}` });
  }
  const title = D.files.html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  if (bad(title)) items.push({ msg: `<title> "${title}"` });
  const og = D.files.html.match(/property=["']og:title["'][^>]+content=["']([^"']+)/)?.[1];
  if (og && bad(og)) items.push({ msg: `og:title "${og}"` });
  return { items };
};

J["TXT-02"] = (D) => {
  const items: Item[] = [];
  let formal = 0, noun = 0;
  for (const [n, s] of slidesOf(D)) for (const t of proseTexts(s)) for (const se of sentences(t.own)) {
    const e = endOf(se);
    if (!e || !HANGUL.test(e.slice(-1))) continue;
    if (/니다$/.test(e)) formal++;
    else if (/다$/.test(e)) items.push({ n, msg: `'~다'로 끝남: "${se.slice(-30)}"` });
    else if (!/[요까죠네]$/.test(e)) noun++;
  }
  if (!formal) items.push({ msg: "~습니다 문장 0" });
  if (!noun) items.push({ msg: "명사형 끝맺음 0" });
  return { items, measured: { formal, noun } };
};

J["TXT-03"] = (D) => {
  const items: Item[] = [];
  const re = /두 시계|도착|입구|물결|문턱|배가당|시계의 간격|파도|쓰나미|혁신|원활|차세대|게임 체인저|충격|종말|재앙|도태|쓸모없|the future of/gi;
  for (const [n, s] of slidesOf(D)) { const m = s.slideText.match(re); if (m) items.push({ n, msg: `금지 표현: ${uniq(m).join(", ")}` }); }
  const lintCopy = D.ext.lint?.json ? (JSON.stringify(D.ext.lint.json).match(/"copy"/g) ?? []).length : null;
  return { items, measured: { lintCopy }, implemented: "auto+manual", manual: ["contact"] };
};

J["TXT-04"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) {
    const snake = s.slideText.match(/\b[a-z]+_[a-z0-9_]+\b/g);
    if (snake) items.push({ n, msg: `화면 snake_case: ${uniq(snake).slice(0, 3).join(", ")}` });
    const v = s.slideText.match(/Deepmind|Open AI|Chat GPT|Chatgpt|open ai/g);
    if (v) items.push({ n, msg: `표기 변형: ${uniq(v).join(", ")}` });
    if (s.kicker && /[A-Z]\d|_/.test(s.kicker.text)) items.push({ n, msg: `kicker 내부 코드: "${s.kicker.text}"` });
  }
  const terms = ["METR", "시간지평", "HLMI", "R²", "CAGR", "배가", "대체 압력", "β", "φ", "R1", "n="];
  const first: Record<string, number | null> = {};
  for (const term of terms) first[term] = slidesOf(D).find(([, s]) => s.slideText.includes(term))?.[0] ?? null;
  return { items, measured: { firstAppearance: first }, implemented: "auto+manual", manual: ["design-standard/domain.md", "contact"] };
};

J["TXT-05"] = (D) => {
  const items: Item[] = [];
  const S = slidesOf(D);
  for (const [n, s] of S) {
    const B = s.blocks.filter((b: any) => b.text.length >= 6);
    for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
      if (B[i].text.includes(B[j].text) || B[j].text.includes(B[i].text)) continue;
      const v = jacc(B[i].text, B[j].text);
      if (v >= 0.5) items.push({ n, msg: `블록 유사도 ${r1(v, 2)}: ${B[i].label.split(" ")[0]} ↔ ${B[j].label.split(" ")[0]}` });
    }
    const txt = [s.headline?.text ?? "", s.bodyText, s.soweInfo?.text ?? ""].join(" ");
    const cnt = new Map<string, number>();
    for (const x of claimNums(txt)) cnt.set(x, (cnt.get(x) ?? 0) + 1);
    const rep = [...cnt].filter(([, c]) => c > 2);
    if (rep.length) items.push({ n, msg: `같은 숫자 3회 이상: ${rep.map(([k, c]) => `${k}×${c}`).join(", ")}` });
  }
  for (let i = 1; i < S.length; i++) {
    const [n, s] = S[i], [m, p] = S[i - 1];
    if (s.headline && p.headline && n === m + 1 && jacc(s.headline.text, p.headline.text) >= 0.5) items.push({ n, msg: `연속 헤드라인 유사도 ${r1(jacc(s.headline.text, p.headline.text), 2)} (${m}·${n})` });
  }
  return { items, implemented: "auto+manual", manual: ["contact"] };
};

J["TXT-06"] = (D) => {
  const items: Item[] = [];
  const charts = new Set(chartSlides(D));
  for (const [n, s] of slidesOf(D)) {
    const h = s.headline?.text;
    if (!h) continue;
    if (/[.。]$/.test(h)) items.push({ n, msg: `헤드라인 마침표: "${h}"` });
    if (charts.has(n) && !/\d/.test(h)) items.push({ n, msg: `차트 장 헤드라인에 숫자 없음: "${h}"` });
    if (/이 장|보여줍니다|살펴봅니다|알아봅니다|현황|추이/.test(h)) items.push({ n, msg: `자기 지시·주제명 표현: "${h}"` });
  }
  return { items, implemented: "auto+manual", manual: ["contact"] };
};

J["TXT-07"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) { const m = s.slideText.match(/클릭|스크롤|탭하|아래로 내|왼쪽 (그림|표)|오른쪽 (그림|표)/g); if (m) items.push({ n, msg: `입력·배치 지시: ${uniq(m).join(", ")}` }); }
  return { items };
};

J["TXT-08"] = (D) => {
  const items: Item[] = [];
  const all = slidesOf(D).map(([, s]) => s.slideText).join("\n");
  const em = (all.match(/—/g) ?? []).length;
  if (em > 2) items.push({ msg: `em dash ${em}개(>2)` });
  for (const [n, s] of slidesOf(D)) {
    const t = s.slideText.replace(/\d{4}-\d{2}-\d{2}/g, "");
    const h = t.match(/\d\s*-\s*\d/g);
    if (h) items.push({ n, msg: `하이픈 범위: ${uniq(h).slice(0, 3).join(", ")}` });
    const q = s.slideText.match(/"[^"]+"/g);
    if (q) items.push({ n, msg: `곧은 큰따옴표: ${q[0].slice(0, 30)}` });
  }
  return { items, notes: ["지표별 숫자 표기 형식 일치는 수동(형식 표 없음)"], implemented: "partial" };
};

J["TXT-09"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) {
    const k = s.kicker;
    if (!k) continue;
    if (s.headline && jacc(k.text, s.headline.text) >= 0.4) items.push({ n, msg: `kicker·헤드라인 유사도 ${r1(jacc(k.text, s.headline.text), 2)}: "${k.text}"` });
    const bg = parseColor(k.bg);
    if (k.rect && k.radius >= k.rect.h / 2 - 1 && bg && bg[3] > 0) items.push({ n, msg: `알약 kicker "${k.text}"` });
    if (s.headline) {
      const pills = s.boxes.filter((b: any) => !b.pseudoOnly && b.rect.h < 64 && b.radius >= b.rect.h / 2 - 1 && b.rect.b <= s.headline.rect.y + 1 && b.rect.b >= s.headline.rect.y - 120);
      if (pills.length && !(bg && k.radius >= k.rect.h / 2 - 1)) items.push({ n, msg: `헤드라인 위 알약 ${pills.length}개` });
    }
  }
  return { items };
};

J["TXT-10"] = (D) => {
  const items: Item[] = [];
  const lens: number[] = [];
  for (const [n, s] of slidesOf(D)) {
    const c = s.bodyText.replace(/\s/g, "").length;
    if (c > 220) items.push({ n, msg: `본문 ${c}자(>220)` });
    for (const t of proseTexts(s)) for (const se of sentences(t.own)) lens.push(se.replace(/\s/g, "").length);
  }
  lens.sort((a, b) => a - b);
  const p90 = lens.length ? lens[Math.floor(lens.length * 0.9)] : 0;
  if (p90 > 60) items.push({ msg: `문장 길이 p90 ${p90}자(>60)` });
  return { items, measured: { p90, sentences: lens.length } };
};

// ── 이미지 ──
J["IMG-01"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) {
    const gen = s.images.filter((i: any) => /assets\/img\//.test(i.src));
    if (gen.length && !/AI 생성/.test(s.slideText)) items.push({ n, msg: `생성 이미지 ${gen.map((i: any) => i.src.split("/").pop()).join(",")} 표기 없음` });
    for (const i of gen) if (!new RegExp(`\\|\\s*${i.src.split("/").pop().replace(/\.\w+$/, "")}(\\.\\w+)?\\s*\\|`).test(D.files.manifest)) items.push({ n, msg: `MANIFEST에 ${i.src.split("/").pop()} 없음` });
    for (const i of s.images) if (i.inChart) items.push({ n, msg: `차트 자리에 이미지 ${i.src}` });
  }
  return { items };
};

J["IMG-02"] = (D) => {
  const crops = (D.ix.imgFiles ?? []).map((x: any) => x.crop).filter(exists);
  const o = D.ix.ocr;
  if (!o?.available) return { items: [], implemented: "manual", manual: crops, notes: [`OCR 못 돌림(${o?.reason ?? "측정 없음"}) — 오른쪽 아래 15% 크롭 묶음을 눈으로 본다`] };
  const items: Item[] = [];
  const allow: string[] = D.exceptions?.["IMG-02"]?.allow ?? [];
  const sizeOf = new Map((D.ix.imgFiles ?? []).map((f: any) => [f.file, f.size]));
  // 가로 글줄만(세로로 길쭉한 상자는 전선·핀 같은 무늬를 잘못 읽은 것)
  const real = (o.hits ?? []).filter((h: any) => h.conf >= 0.3 && h.text.replace(/[^A-Za-z가-힣]/g, "").length >= 2 && h.box.w >= h.box.h * 0.8 && !allow.some((a) => h.text.includes(a)));
  for (const h of real) {
    const base = h.file.split("/").pop();
    const ns = slidesOf(D).filter(([, s]) => s.images.some((i: any) => String(i.src ?? "").split("/").pop() === base)).map(([n]) => n);
    const sz = sizeOf.get(h.file) as number[] | undefined;
    const wm = sz && h.box.x + h.box.w > sz[0] * 0.85 && h.box.y + h.box.h > sz[1] * 0.85 ? " · 워터마크 자리(오른쪽 아래 15%)" : "";
    const msg = `${base} 안 글자 '${h.text}'(Vision 확신도 ${h.conf}, 원본 (${h.box.x}, ${h.box.y}) ${h.box.w}×${h.box.h})${wm}`;
    if (ns.length) for (const n of ns) items.push({ n, msg }); else items.push({ msg: `${msg} — 덱에 안 쓰인 그림` });
  }
  const hitCrops = real.map((h: any) => h.crop).filter(exists);
  return {
    items, implemented: "auto+manual", evidence: hitCrops, manual: [...hitCrops, ...crops],
    measured: { engine: o.engine, inputs: o.inputs, hits: (o.hits ?? []).map((h: any) => ({ file: h.file, text: h.text, conf: h.conf, box: h.box })) },
    notes: ["macOS Vision OCR을 원본 전체·3×3 조각(2배)·4×4 평활화 조각(3배)에 돌려, 글자(한글·라틴) 2자 이상이 확신도 0.3 이상으로 가로 글줄(상자 폭 ≥ 높이×0.8)에서 읽히면 실패. 허용 글자는 qa/exceptions.json의 IMG-02.allow",
      "흐릿하게 뭉개진 가짜 글자는 OCR이 못 읽을 수 있다(예: neurons.jpg 칩 기판의 'MEA CHI…'는 확대·평활화해도 읽히지 않았다) — 크롭 묶음을 사람이 함께 본다"],
  };
};

J["IMG-03"] = (D) => {
  const items: Item[] = [];
  const seen = new Set<string>();
  for (const [n, s] of slidesOf(D)) for (const i of s.images) {
    if (!i.nw) { items.push({ n, msg: `${i.src} 로드 안 됨` }); continue; }
    const k = Math.min(i.nw / i.rect.w, i.nh / i.rect.h);
    if (k < 1.5) items.push({ n, msg: `${i.src.split("/").pop()} 해상도 배율 ${r1(k, 2)}(<1.5) — 원본 ${i.nw}×${i.nh}, 표시 ${r1(i.rect.w, 0)}×${r1(i.rect.h, 0)}` });
    if (i.fit === "fill" && Math.abs(i.nw / i.nh - i.rect.w / i.rect.h) / (i.rect.w / i.rect.h) > 0.01) items.push({ n, msg: `${i.src} 비율 왜곡(object-fit fill)` });
    if (!(i.wAttr && i.hAttr) && (!i.ar || i.ar === "auto")) { if (!seen.has(i.src)) items.push({ n, msg: `${i.src.split("/").pop()} width·height 속성 없음` }); seen.add(i.src); }
  }
  for (const f of D.ix.imgFiles ?? []) if (f.icc?.profile && !/srgb|^c2$/i.test(f.icc.profile)) items.push({ msg: `${f.file} ICC ${f.icc.profile}(sRGB 아님)` });
  return { items, measured: { icc: (D.ix.imgFiles ?? []).map((f: any) => [f.file, f.icc?.profile ?? "없음(sRGB로 봄)"]) } };
};

J["IMG-04"] = (D) => {
  const items: Item[] = [];
  let sum = 0;
  for (const f of D.files.imgFiles) { sum += f.bytes; if (f.bytes > 300 * 1024) items.push({ msg: `${f.name} ${r1(f.bytes / 1024, 0)}KB(>300)` }); }
  if (sum > 1.5 * 1024 * 1024) items.push({ msg: `assets/img 총 ${r1(sum / 1048576, 2)}MB(>1.5)` });
  return { items, measured: { totalKB: r1(sum / 1024, 0) } };
};

J["IMG-05"] = (D) => {
  const items: Item[] = [];
  const REAL = /올트먼|알트만|아모데이|허사비스|Altman|Amodei|Hassabis|머스크|Musk|젠슨|Jensen|OpenAI|Google|삼성|애플|Apple|Microsoft/;
  for (const [n, s] of slidesOf(D)) for (const i of s.images) {
    if (!i.hasAlt) items.push({ n, msg: `alt 없음: ${i.src}` });
    else if (i.alt && i.alt.length < 5) items.push({ n, msg: `내용 alt ${i.alt.length}자(<5): ${i.src}` });
    if (/assets\/img\//.test(i.src) && REAL.test(i.alt ?? "")) items.push({ n, msg: `생성 이미지 alt에 실명: "${i.alt}"` });
  }
  return { items, implemented: "auto+manual", manual: slidesOf(D).filter(([, s]) => s.images.length).map(([n]) => shotOf(D, n)) };
};

J["IMG-06"] = (D) => {
  const items: Item[] = [];
  const cnt = new Map<string, number[]>();
  const rad = new Set<number>(), fil = new Set<string>();
  const charts = new Set(chartSlides(D));
  for (const [n, s] of slidesOf(D)) for (const i of s.images) {
    (cnt.get(i.src) ?? cnt.set(i.src, []).get(i.src))!.push(n);
    rad.add(i.radius); fil.add(i.filter);
    if (charts.has(n)) items.push({ n, msg: `차트 장에 사진 ${i.src.split("/").pop()}` });
  }
  for (const [src, ns] of cnt) if (uniq(ns).length > 1) items.push({ n: ns[1], msg: `${src} ${uniq(ns).length}장에서 재사용: ${uniq(ns).join(",")}` });
  if (rad.size > 1) items.push({ msg: `사진 반지름 ${rad.size}종: ${[...rad].join(",")}` });
  if (fil.size > 1) items.push({ msg: `사진 filter ${fil.size}종: ${[...fil].join(" | ")}` });
  return { items };
};

// ── 차트 ──
const charts = (D: Data) => slidesOf(D).flatMap(([n, s]) => s.svgs.filter((v: any) => v.chart).map((v: any) => [n, v] as [number, any]));
J["CHT-01"] = (D) => {
  const items: Item[] = [];
  for (const [n, v] of charts(D)) {
    if (v.titles.length !== 1) { items.push({ n, msg: `${v.chart} 차트 제목 ${v.titles.length}개` }); continue; }
    const t = v.titles[0];
    if (t.rect.y >= v.rect.y) items.push({ n, msg: `${v.chart} 제목이 svg 위에 있지 않음` });
    const unit = /%|시간|만\s?명|배|개|분|명|일|점|년/.test(t.text), period = /\d{4}|→|~|–/.test(t.text);
    if (!unit || !period) items.push({ n, msg: `${v.chart} 제목에 ${!unit ? "단위" : ""}${!unit && !period ? "·" : ""}${!period ? "기간" : ""} 없음: "${t.text}"` });
  }
  return { items, measured: { charts: charts(D).length } };
};

const clampedPoints = (D: Data, chartId: string) => {
  try {
    const d = JSON.parse(D.files.chartData)[chartId];
    if (!d?.points || !d.y범위) return 0;
    const [lo, hi] = d.y범위;
    return d.points.filter((p: any) => { const y = p.y ?? p.v ?? p[1]; return typeof y === "number" && (y > hi || y < lo); }).length;
  } catch { return 0; }
};
J["CHT-02"] = (D) => {
  const items: Item[] = [];
  const table: any = {};
  for (const [n, v] of charts(D)) {
    const all = [v.titles, v.subs, v.srcs, v.legends].flat().map((x: any) => x.text).join(" ") + " " + v.texts.map((t: any) => t.text).join(" ");
    const row = {
      축이름: v.texts.some((t: any) => /alab/.test(t.cls) && HANGUL.test(t.text)) || v.subs.some((x: any) => /축|세로|가로/.test(x.text)),
      n기간: /n\s*=|\d+\s*개\s*(직업|항목|분류)|\d+개 직업/.test(all) && /\d{4}/.test(all),
      출처: v.srcs.some((x: any) => x.text.length > 3),
      기준일: [...v.srcs, ...v.subs].some((x: any) => /20\d\d/.test(x.text)),
      직접라벨: v.texts.some((t: any) => /vlab|note|slab|band-lab/.test(t.cls)),
      강조주석: v.texts.some((t: any) => /note/.test(t.cls)),
      로그축표기: v.kind !== "logline" || /로그/.test(all),
    } as Record<string, boolean>;
    table[`${n}:${v.chart}`] = row;
    for (const [k, ok] of Object.entries(row)) if (!ok) items.push({ n, msg: `${v.chart} ${k} 없음` });
    const cl = clampedPoints(D, v.chart);
    if (cl && !/끝에 붙|넘는|밖의|잘린|범위 밖|이상은/.test(all)) items.push({ n, msg: `${v.chart} 세로 범위를 넘은 점 ${cl}개를 끝에 붙여 그렸는데 표식·주석 없음` });
  }
  return { items, measured: table, implemented: "auto+manual", manual: chartShots(D) };
};

J["CHT-03"] = (D) => {
  const items: Item[] = [];
  const acc = tc(D, "--accent"), sage = [tc(D, "--sage"), tc(D, "--sage-50"), tc(D, "--sage-ink")], accFam = [acc, tc(D, "--accent-50"), tc(D, "--accent-100")];
  for (const [n, v] of charts(D)) {
    const M = marksOf(v);
    const cols = uniq(M.map((m: any) => m.col));
    if (cols.length > 4) items.push({ n, msg: `${v.chart} 고유 색 ${cols.length}(>4)` });
    for (const c of cols.map((x) => parseColor(x as string)!)) if (oklch(c).C > 0.02 && ![...accFam, ...sage].some((f) => f && deltaE(c, f) < 3)) items.push({ n, msg: `${v.chart} 강조·세이지 밖 유채색 ${hex(c)}` });
    const groups = uniq(M.filter((m: any) => acc && deltaE(parseColor(m.col)!, acc) < 3).map((m: any) => m.cls.replace(/^(l|b)-/, "")));
    if (groups.length !== 1) items.push({ n, msg: `${v.chart} 인디고 데이터 그룹 ${groups.length}(≠1): ${groups.join(",")}` });
  }
  return { items };
};

J["CHT-04"] = (D) => {
  const items: Item[] = [];
  for (const [n, v] of charts(D)) {
    const labels = v.texts.filter((t: any) => !/tick|alab/.test(t.cls) || HANGUL.test(t.text));
    for (const p of v.polylines) {
      const end = p.pts[p.pts.length - 1];
      if (!end) continue;
      const near = labels.some((t: any) => dist(t.rect, { x: end.x - 2, y: end.y - 2, w: 4, h: 4 }) <= 64);
      if (!near && v.polylines.length > 1) items.push({ n, msg: `${v.chart} 계열 ${p.cls} 끝에 직접 라벨 없음` });
    }
    for (let i = 0; i < v.polylines.length; i++) for (let j = i + 1; j < v.polylines.length; j++) {
      const a = v.polylines[i], b = v.polylines[j];
      if (a.stroke === b.stroke && a.dash === b.dash && a.sw === b.sw) { items.push({ n, msg: `${v.chart} 같은 색·같은 점선·같은 굵기 계열 쌍(${a.cls}, ${b.cls})` }); break; }
    }
  }
  return { items, implemented: "auto+manual", manual: Object.values(D.ix.sim ?? {}).flat() as string[] };
};

const segHitsRect = (p: any, q: any, r: any) => {
  // 선분이 상자와 겹치는지(상자 안 점 또는 변 교차)
  const inside = (x: number, y: number) => x > r.x + 1 && x < r.x + r.w - 1 && y > r.y + 1 && y < r.y + r.h - 1;
  if (inside(p.x, p.y) || inside(q.x, q.y)) return true;
  for (let k = 1; k < 8; k++) { const x = p.x + ((q.x - p.x) * k) / 8, y = p.y + ((q.y - p.y) * k) / 8; if (inside(x, y)) return true; }
  return false;
};
J["CHT-05"] = (D) => {
  const items: Item[] = [];
  for (const [n, v] of charts(D)) {
    const T = v.texts;
    for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) { const a = hit(T[i].rect, T[j].rect); if (a > 1) items.push({ n, msg: `${v.chart} 글자 겹침 "${T[i].text}" ↔ "${T[j].text}" ${r1(a, 0)}px²` }); }
    for (const t of T.filter((t: any) => /vlab|note|slab|band-lab/.test(t.cls))) {
      const r = { x: t.rect.x, y: t.rect.y, w: t.rect.w, h: t.rect.h };
      if (v.polylines.some((p: any) => p.pts.some((pt: any, k: number) => k > 0 && segHitsRect(p.pts[k - 1], pt, r)))) items.push({ n, msg: `${v.chart} 라벨 "${t.text}"이 선과 겹침` });
      const c = v.circles.find((c: any) => hit(c.rect, t.rect) > 1);
      if (c) items.push({ n, msg: `${v.chart} 라벨 "${t.text}"이 점과 겹침` });
    }
    if (v.kind === "scatter") { const L = T.filter((t: any) => /vlab|note|slab/.test(t.cls)).length; if (L > 5) items.push({ n, msg: `${v.chart} 산점도 라벨 ${L}(>5)` }); }
  }
  return { items, implemented: "auto+manual", manual: chartShots(D) };
};

J["CHT-06"] = (D) => {
  const items: Item[] = [];
  const bad = (n: number, chart: string, what: string, set: Map<string, number>) => set.set(`${n}|${chart}|${what}`, (set.get(`${n}|${chart}|${what}`) ?? 0) + 1);
  const agg = new Map<string, number>();
  for (const [n, v] of charts(D)) {
    for (const p of v.polylines) if (p.sw < 3) bad(n, v.chart, `데이터 선 ${p.cls} ${p.sw}px(<3)`, agg);
    for (const l of v.lines.filter((l: any) => /grid/.test(l.parentCls))) { if (l.sw > 1.5) bad(n, v.chart, `격자 ${l.sw}px(>1.5)`, agg); if (l.dash !== "none") bad(n, v.chart, "격자 점선", agg); }
    const bg = parseColor(v.bg)!;
    for (const c of v.circles) {
      if (c.r * 2 < 8) bad(n, v.chart, `점 지름 ${r1(c.r * 2)}px(<8)`, agg);
      const st = parseColor(c.stroke);
      if (!(c.sw > 0 && st && deltaE(st, bg) < 3)) bad(n, v.chart, "점 바탕색 고리 없음", agg);
    }
    const bars = v.rects.filter((r: any) => !/band/.test(r.cls) && r.rect.w > 0 && r.rect.h > 0);
    for (const b of bars) { const th = Math.min(b.rect.w, b.rect.h), len = Math.max(b.rect.w, b.rect.h); if (th > 24) bad(n, v.chart, `막대 두께 ${r1(th)}px(>24)`, agg); if (len < 4) bad(n, v.chart, `막대 길이 ${r1(len)}px(<4)`, agg); }
    const byY = [...bars].sort((a: any, b: any) => a.rect.y - b.rect.y);
    for (let i = 1; i < byY.length; i++) { const g = byY[i].rect.y - byY[i - 1].rect.b; if (g >= 0 && g < 2 && Math.abs(byY[i].rect.x - byY[i - 1].rect.x) < 2) bad(n, v.chart, `막대 간격 ${r1(g)}px(<2)`, agg); }
    const allText = [v.subs, v.legends, v.titles].flat().map((x: any) => x.text).join(" ") + v.texts.map((t: any) => t.text).join(" ");
    const dashed = [...v.polylines, ...v.lines.filter((l: any) => !/grid/.test(l.parentCls))].filter((l: any) => l.dash && l.dash !== "none");
    if (dashed.length && !/점선|추정|전망|예측|기준/.test(allText)) bad(n, v.chart, `뜻 라벨 없는 점선 ${dashed.length}`, agg);
  }
  for (const [k, c] of agg) { const [n, chart, what] = k.split("|"); items.push({ n: Number(n), msg: `${chart} ${what}${c > 1 ? ` ×${c}` : ""}` }); }
  return { items };
};

// 시간 눈금('1분'·'8시간'·'하루'·'분기'·'8년')을 분으로. 숫자만 있으면 그 숫자
const MIN: Record<string, number> = { 초: 1 / 60, 분: 1, 시간: 60, 일: 1440, 하루: 1440, 주: 10080, 달: 43200, 개월: 43200, 분기: 129600, 년: 525600 };
const tickValue = (txt: string) => {
  const t = txt.replace(/[,%+\s]/g, "").replace("−", "-");
  if (/^-?\d+(\.\d+)?$/.test(t)) return { v: Number(t), dur: false };
  const m = t.match(/^(\d+(?:\.\d+)?)?(초|분|시간|하루|일|주|개월|달|분기|년)$/);
  return m ? { v: Number(m[1] ?? 1) * MIN[m[2]], dur: true } : null;
};
const cvOf = (a: number[]) => { const m = a.reduce((x, y) => x + y, 0) / a.length; return m ? Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / a.length) / Math.abs(m) : Infinity; };
J["CHT-07"] = (D) => {
  const items: Item[] = [];
  const clean = (d: number) => { if (d <= 0) return false; const e = 10 ** Math.floor(Math.log10(d)); return [1, 2, 2.5, 5, 10].some((m) => Math.abs(d / e - m) < 1e-6); };
  for (const [n, v] of charts(D)) {
    const tk = v.texts.filter((t: any) => /tick/.test(t.cls)).map((t: any) => ({ t, p: tickValue(t.text) })).filter((x: any) => x.p && Number.isFinite(x.p.v));
    const ticks = uniq(tk.map((x: any) => x.p.v)).map((val) => { const x = tk.find((k: any) => k.p.v === val)!; return { v: val as number, y: x.t.rect.y + x.t.rect.h / 2, dur: x.p.dur }; }).sort((a, b) => a.v - b.v);
    if (ticks.length >= 3) {
      // 로그 축: 눈금 위치가 값보다 log 값에 비례한다(위치 간격/log 간격의 변동계수가 더 작다). 시간 눈금 축과 logline은 로그로 본다
      const step = (f: (x: number) => number) => cvOf(ticks.slice(1).map((t, i) => (t.y - ticks[i].y) / (f(t.v) - f(ticks[i].v))));
      const isLog = ticks.every((t) => t.v > 0) && (v.kind === "logline" || ticks.some((t) => t.dur) || step(Math.log10) < step((x) => x));
      if (isLog) {
        const ratios = ticks.slice(1).map((t, i) => t.v / ticks[i].v);
        if (cvOf(ratios) >= 0.02) items.push({ n, msg: `${v.chart} 로그 눈금 배수가 일정하지 않음: ${tk.map((x: any) => x.t.text).join("·")} (이웃 배수 ${ratios.map((r) => r1(r, 1)).join("/")})` });
        else if (![2, 10].some((m) => Math.abs(ratios[0] - m) < 0.05)) items.push({ n, msg: `${v.chart} 로그 눈금 배수 ${r1(ratios[0], 2)}(2·10배 아님)` });
      } else {
        const vs = ticks.map((t) => t.v);
        const ds = uniq(vs.slice(1).map((x, i) => r1(x - vs[i], 4)));
        if (ds.length > 1 || !clean(ds[0])) items.push({ n, msg: `${v.chart} 눈금 간격 ${ds.join("/")}` });
      }
      // 눈금선과 가정선(문턱·기준선)이 같은 높이에 겹치면 축 눈금과 가정이 구분되지 않는다
      const refs = v.lines.filter((l: any) => /gate|thresh|ref|target/.test(l.cls));
      const same = ticks.filter((t) => refs.some((l: any) => Math.abs(l.rect.y - t.y) <= 2));
      if (same.length) items.push({ n, msg: `${v.chart} 축 눈금 ${same.length}개가 가정선(${uniq(refs.map((l: any) => l.cls)).join(",")})과 같은 높이: ${same.map((t) => tk.find((x: any) => x.p.v === t.v)!.t.text).join("·")}` });
    }
    const years = v.texts.filter((t: any) => /alab/.test(t.cls) && /^\d{4}$/.test(t.text)).map((t: any) => ({ y: +t.text, x: t.rect.x + t.rect.w / 2 })).sort((a: any, b: any) => a.y - b.y);
    if (years.length >= 3) {
      const per = years.slice(1).map((p: any, i: number) => (p.x - years[i].x) / (p.y - years[i].y));
      const m = per.reduce((a: number, b: number) => a + b, 0) / per.length;
      const cv = Math.sqrt(per.reduce((a: number, b: number) => a + (b - m) ** 2, 0) / per.length) / Math.abs(m);
      if (cv >= 0.02) items.push({ n, msg: `${v.chart} 연도 축 간격 변동계수 ${r1(cv * 100, 1)}%(≥2%)` });
      if (m <= 0) items.push({ n, msg: `${v.chart} 연도 축이 왼→오른 증가 아님` });
    }
    if (v.kind === "hbar") {
      const base = v.lines.filter((l: any) => /base|zero/.test(l.cls)).map((l: any) => l.rect.x);
      const bars = v.rects.filter((r: any) => !/band/.test(r.cls) && r.rect.w > 0);
      if (base.length) for (const b of bars) if (!base.some((x: number) => Math.abs(b.rect.x - x) <= 1 || Math.abs(b.rect.r - x) <= 1)) { items.push({ n, msg: `${v.chart} 막대가 0 기준선에서 시작하지 않음` }); break; }
    }
    for (const t of v.texts) for (const x of t.text.match(/\d{5,}/g) ?? []) items.push({ n, msg: `${v.chart} 천 단위 쉼표 없음 "${x}"` });
    const cl = clampedPoints(D, v.chart);
    if (cl) {
      const top = Math.min(...v.lines.filter((l: any) => /grid/.test(l.parentCls)).map((l: any) => l.rect.y));
      const atEdge = v.circles.filter((c: any) => Math.abs(c.rect.y + c.rect.h / 2 - top) < 1).length;
      const marked = v.paths.length > 0 || v.texts.some((t: any) => /끝에 붙|넘는|범위 밖/.test(t.text));
      if (!marked) items.push({ n, msg: `${v.chart} 범위 밖 ${cl}개 점이 축 끝(y=${r1(top)})에 실제 값처럼 그려짐(끝선 위 점 ${atEdge}개, 다른 모양·표시 없음)` });
    }
  }
  return { items };
};

J["CHT-08"] = (D) => {
  const items: Item[] = [];
  const ok = [tc(D, "--ink"), tc(D, "--note")];
  for (const [n, v] of charts(D)) {
    const bad = uniq(v.texts.map((t: any) => t.fill)).filter((f: any) => !ok.some((o) => o && deltaE(parseColor(f as string)!, o) < 1));
    if (bad.length) items.push({ n, msg: `${v.chart} 차트 글자 색 ${bad.join(", ")}(잉크·회색 밖)` });
    const dec = uniq(v.texts.filter((t: any) => /vlab|note/.test(t.cls) && /\d/.test(t.text)).map((t: any) => (t.text.match(/\d+\.(\d+)/)?.[1].length ?? 0)));
    if (dec.length > 1) items.push({ n, msg: `${v.chart} 값 라벨 소수 자릿수 ${dec.join("/")}` });
    const unit = v.texts.filter((t: any) => /vlab|note/.test(t.cls) && /\d\s*(%|명|시간|배|년|분|일)/.test(t.text)).length;
    if (unit > 1) items.push({ n, msg: `${v.chart} 단위 붙은 값 라벨 ${unit}(>1)` });
  }
  return { items };
};

J["CHT-09"] = (D) => {
  const items: Item[] = [];
  for (const [n, v] of charts(D)) {
    const m = v.circles.length + v.rects.filter((r: any) => !/band/.test(r.cls)).length + v.polylines.reduce((a: number, p: any) => a + p.pts.length, 0);
    if (m <= 3) items.push({ n, msg: `${v.chart} 데이터 값 ${m}개(≤3, 점·막대·선 꼭짓점) — 큰 숫자로` });
    const tk = v.texts.filter((t: any) => /tick/.test(t.cls));
    const left = tk.filter((t: any) => t.rect.x < v.rect.x + v.rect.w * 0.2).length, right = tk.filter((t: any) => t.rect.x > v.rect.x + v.rect.w * 0.8).length;
    if (left >= 2 && right >= 2) items.push({ n, msg: `${v.chart} 이중 세로축` });
    // 헤드라인이 순서·시점을 말하는데 차트에 시간 축이 없고 막대가 값 순으로도 놓이지 않았으면, 차트가 그 주장을 보여 주지 못한다
    const head = D.slides[n]?.headline?.text ?? "";
    const hasYearAxis = v.texts.some((t: any) => /alab|tick/.test(t.cls) && /^\d{4}$/.test(t.text));
    if (v.kind === "hbar" && /부터|먼저|이어|차례|다음으로|순서/.test(head) && !hasYearAxis) {
      const vals = v.texts.filter((t: any) => /vlab/.test(t.cls)).sort((a: any, b: any) => a.rect.y - b.rect.y).map((t: any) => Number(t.text.replace(/[,%+\s]/g, "").replace("−", "-"))).filter(Number.isFinite);
      const sorted = vals.every((x: number, i: number) => i === 0 || x <= vals[i - 1]) || vals.every((x: number, i: number) => i === 0 || x >= vals[i - 1]);
      if (vals.length >= 3 && !sorted) items.push({ n, msg: `${v.chart} 헤드라인은 순서·시점("${head.slice(0, 30)}")인데 차트는 시간 축 없는 값 막대이고 값 순도 아님(${vals.join(", ")})` });
    }
  }
  return { items, implemented: "auto+manual", manual: chartShots(D) };
};

J["CHT-10"] = (D) => {
  const items: Item[] = [];
  const by = new Map(charts(D).map(([n, v]) => [v.chart, { n, v }]));
  const pairs = [["metr_horizon", "proj_capability"], ["agi_forecast_shift", "espai_two_clocks"], ["kr_occupation_index", "proj_kr_jobs"], ["kr_occupation_index", "proj_wave"]];
  const seriesLabel = (v: any) => new Map(v.polylines.map((p: any) => { const e = p.pts[p.pts.length - 1]; const t = v.texts.filter((t: any) => !/tick/.test(t.cls) && HANGUL.test(t.text)).sort((a: any, b: any) => dist(a.rect, { x: e.x, y: e.y, w: 1, h: 1 }) - dist(b.rect, { x: e.x, y: e.y, w: 1, h: 1 }))[0]; return [t ? norm(t.text) : p.cls, `${p.stroke}|${p.sw}`]; }));
  const units = (v: any) => new Set(([v.titles, v.subs].flat().map((x: any) => x.text).join(" ") + v.texts.filter((t: any) => /alab/.test(t.cls)).map((t: any) => t.text).join(" ")).match(/%|시간|분|만\s?명|배|지수/g) ?? []);
  for (const [a, b] of pairs) {
    const A = by.get(a), B = by.get(b);
    if (!A || !B) continue;
    const colA = new Map(marksOf(A.v).map((m: any) => [m.cls, m.col])), colB = new Map(marksOf(B.v).map((m: any) => [m.cls, m.col]));
    for (const [c, col] of colA) if (colB.has(c) && colB.get(c) !== col) items.push({ n: B.n, msg: `${a}↔${b} 같은 계열 ${c} 색 다름` });
    const ua = units(A.v), ub = units(B.v);
    if (ua.size && ub.size && ![...ua].some((u) => ub.has(u))) items.push({ n: B.n, msg: `${a}↔${b} 단위 다름: ${[...ua].join(",")} / ${[...ub].join(",")}` });
    const na = uniq(A.v.texts.map((t: any) => t.text).filter((x: string) => HANGUL.test(x))) as string[], nb = uniq(B.v.texts.map((t: any) => t.text).filter((x: string) => HANGUL.test(x))) as string[];
    for (const x of na) for (const y of nb) if (x !== y && norm(x) === norm(y) && norm(x).length >= 2) items.push({ n: B.n, msg: `${a}↔${b} 이름 표기 다름 "${x}" / "${y}"` });
    const sa = seriesLabel(A.v), sb = seriesLabel(B.v);
    for (const [k, st] of sa) if (sb.has(k) && sb.get(k) !== st) items.push({ n: B.n, msg: `${a}↔${b} 같은 이름 계열 '${k}' 선 모양 다름 ${st} / ${sb.get(k)}` });
  }
  // 이어지는 차트 장의 모집단: '직업 N개'·'N개 직업'(분위마다 ×5, 상위 10% ×10)으로 센 전체 수가 다르면, 뒤 장이 앞 장의 수나 차이 이유를 밝혀야 한다
  const pop = (s: any) => {
    const t = s.slideText as string, out = new Set<number>();
    for (const m of t.matchAll(/(분위마다|상위\s*(\d+)%)?\s*직업\s*(\d[\d,]*)\s*개|(\d[\d,]*)\s*개\s*직업(?!\s*(?:대분류|군))/g)) {
      const k = Number((m[3] ?? m[4]).replace(/,/g, ""));
      out.add(m[1] === "분위마다" ? k * 5 : m[2] ? Math.round(k * 100 / Number(m[2])) : k);
    }
    return [...out];
  };
  const CS = uniq(charts(D).map(([n]) => n));
  for (let i = 1; i < CS.length; i++) {
    const m = CS[i - 1], n = CS[i];
    if (n !== m + 1) continue;
    const a = pop(D.slides[m]), b = pop(D.slides[n]);
    if (!a.length || !b.length || a.some((x) => b.includes(x))) continue;
    const said = a.some((x) => (D.slides[n].slideText as string).replace(/,/g, "").includes(String(x))) || /모집단|고용\s*하한|기준이\s*다르|대상이\s*다르/.test(D.slides[n].slideText);
    if (!said) items.push({ n, msg: `이어지는 차트 장 ${m}·${n} 모집단 다름: 직업 ${a.join("/")}개 / ${b.join("/")}개, 다른 이유 설명 없음` });
  }
  const C = charts(D);
  for (let i = 1; i < C.length; i++) {
    const [n, v] = C[i], [m, p] = C[i - 1];
    if (n === m + 1 && v.kind === p.kind) {
      const d = Math.max(Math.abs(v.rect.x - p.rect.x), Math.abs(v.rect.y - p.rect.y), Math.abs(v.rect.w - p.rect.w), Math.abs(v.rect.h - p.rect.h));
      if (d > 8) items.push({ n, msg: `연속 차트 장 ${m}·${n} svg 위치·크기 차 ${r1(d)}px(>8)` });
      const rng = (x: any) => { const t = x.texts.filter((t: any) => /tick/.test(t.cls)).map((t: any) => Number(t.text.replace(/[,%+\s]/g, ""))).filter(Number.isFinite); const y = x.texts.filter((t: any) => /alab/.test(t.cls) && /^\d{4}$/.test(t.text)).map((t: any) => +t.text); return `세로 ${t.length ? Math.min(...t) + "~" + Math.max(...t) : "-"} · 가로 ${y.length ? Math.min(...y) + "~" + Math.max(...y) : "-"}`; };
      if (rng(v) !== rng(p)) items.push({ n, msg: `연속 차트 장 ${m}·${n} 축 범위 다름: ${rng(p)} / ${rng(v)}` });
    }
  }
  return { items };
};

J["CHT-11"] = (D) => {
  const items: Item[] = [];
  let data: any = {};
  try { data = JSON.parse(D.files.chartData); } catch {}
  const emph = (id: string) => { const out: string[] = []; const walk = (o: any) => { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === "object") { if (o.강조 && (o.label || o.v != null)) out.push(String(o.label ?? o.v)); Object.values(o).forEach(walk); } }; walk(data[id]); return out; };
  for (const [n, v] of charts(D)) {
    const desc = `${v.aria} ${v.desc}`.trim();
    if (v.role !== "img") items.push({ n, msg: `${v.chart} svg role=img 아님` });
    if (!desc) { items.push({ n, msg: `${v.chart} 설명 없음` }); continue; }
    if (nums(desc).length < 2) items.push({ n, msg: `${v.chart} 설명 숫자 ${nums(desc).length}개(<2): "${desc.slice(0, 50)}"` });
    for (const e of emph(v.chart)) { const k = nums(e)[0]; if (k && !nums(desc).includes(k)) items.push({ n, msg: `${v.chart} 강조값 ${e} 설명에 없음` }); }
    if (/급격히|크게|거의/.test(desc)) items.push({ n, msg: `${v.chart} 설명 주관어` });
    const vis = v.texts.filter((t: any) => /tick|alab/.test(t.cls) && !t.ariaHidden).length;
    if (vis) items.push({ n, msg: `${v.chart} 눈금 글자 aria-hidden 없음 ${vis}개` });
  }
  return { items };
};

J["CHT-12"] = (D) => {
  const items: Item[] = [];
  const src = D.files.js["charts.js"] ?? "";
  stripComments(src).split("\n").forEach((l, i) => {
    if (/innerHTML\s*[+]?=.*\$\{/.test(l)) items.push({ msg: `charts.js:${i + 1} innerHTML 문자열 결합` });
    if (/\[\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*(,\s*-?\d+(\.\d+)?\s*)+\]/.test(l)) items.push({ msg: `charts.js:${i + 1} 하드코딩 숫자 배열: ${l.trim().slice(0, 80)}` });
  });
  const marks = charts(D).flatMap(([, v]) => marksOf(v));
  if (marks.length && !marks.some((m: any) => m.data)) items.push({ msg: `차트 도형 ${marks.length}개 중 data 속성으로 값과 묶인 것 0` });
  return { items };
};

J["CHT-13"] = (D) => {
  const items: Item[] = [];
  for (const h of D.ix.rules?.hover ?? []) if (h.changesVisibility) items.push({ msg: `:hover로 보임이 바뀜: ${h.sel}` });
  if (!D.ix.rules) items.push({ msg: "스타일시트 규칙 측정 없음" });
  return { items };
};

// ── 근거 ──
J["EVD-01"] = (D) => {
  const items: Item[] = [];
  const c = D.ext.checkNumbers;
  if (!c) items.push({ msg: "check-numbers 실행 안 됨" });
  else {
    if (c.code !== 0) items.push({ msg: `check-numbers 종료 ${c.code}` });
    for (const u of c.json?.unverified ?? []) items.push({ msg: `원본에 없는 숫자 ${u}` });
  }
  const now: Record<number, string[]> = {};
  for (const [n, s] of slidesOf(D)) now[n] = nums(s.slideText).sort();
  const prev = D.prev?.results?.find((r: any) => r.id === "EVD-01")?.measured?.numbers;
  if (prev) for (const [n, arr] of Object.entries(prev) as [string, string[]][]) {
    const cur = [...(now[+n] ?? [])];
    const gone = arr.filter((x) => { const i = cur.indexOf(x); if (i < 0) return true; cur.splice(i, 1); return false; });
    if (gone.length && now[+n]) items.push({ n: +n, msg: `기준 대비 사라지거나 바뀐 숫자: ${gone.slice(0, 6).join(", ")}` });
  }
  for (const [, s] of slidesOf(D)) for (const v of s.svgs.filter((x: any) => x.chart)) { const cl = clampedPoints(D, v.chart); if (cl) items.push({ n: s.n, msg: `${v.chart} 세로 범위 밖 값 ${cl}개가 축 끝값으로 그려져 그림 위치가 데이터 값과 다름` }); }
  return { items, measured: { numbersInDeck: c?.json?.numbersInDeck, numbers: now } };
};

J["EVD-02"] = (D) => {
  const items: Item[] = [];
  const pairs: string[] = [];
  for (const [n, s] of slidesOf(D)) {
    const numsT = s.texts.filter((t: any) => /\d/.test(t.own) && !t.ctx.includes("tag") && !t.ctx.includes("pg"));
    for (const t of s.tags) {
      pairs.push(`${n}:${t.text}`);
      if (!t.text) { items.push({ n, msg: "빈 주장 라벨" }); continue; }
      const d = Math.min(Infinity, ...numsT.map((x: any) => dist(t.rect, x.rect)));
      if (d > 64) items.push({ n, msg: `라벨 "${t.text}"와 가장 가까운 숫자 ${d === Infinity ? "없음" : r1(d, 0) + "px"}(>64)` });
    }
  }
  const prev = D.prev?.results?.find((r: any) => r.id === "EVD-02")?.measured?.pairs as string[] | undefined;
  if (prev) for (const p of prev) if (!pairs.includes(p)) items.push({ n: Number(p.split(":")[0]), msg: `기준에 있던 라벨 사라짐: ${p}` });
  return { items, measured: { pairs } };
};

J["EVD-03"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) {
    const src = s.sources.filter((x: any) => x.text);
    if (!src.length) { items.push({ n, msg: "출처 없음" }); continue; }
    if (!src.some((x: any) => /20\d\d/.test(x.text))) items.push({ n, msg: `출처에 연도 없음: "${src[0].text.slice(0, 40)}"` });
    for (const x of src) if (x.fs >= 20) items.push({ n, msg: `출처 글자 ${x.fs}px가 본문 이상` });
    if (s.tags.some((t: any) => /2차/.test(t.text)) && !src.some((x: any) => /[가-힣A-Za-z]{2,}.*(보도|인터뷰|발언|기사|블로그|팟캐스트|매체|Times|Post|News|Journal|Bloomberg|Reuters|X|YouTube)/.test(x.text))) items.push({ n, msg: "2차 인용 라벨이 있는데 출처에 원 매체 표기 없음" });
  }
  return { items };
};

// 2036 외삽 장: 2036이 나오는 것만으로는 아니다(안내·분석 계획·출처 장도 2036을 말한다). 그 장이 추정을 내놓는다는 표시
// — 추정 라벨(.tag.est), 연장 차트(proj_*), 키커의 '추정', 헤드라인의 2036, 본문의 '시나리오별' 값 — 가 함께 있어야 외삽 장으로 본다
const kickerText = (s: any) => (typeof s.kicker === "string" ? s.kicker : s.kicker?.text) ?? "";
const isExtrapolation = (s: any) => /2036/.test((s.headline?.text ?? "") + s.bodyText + kickerText(s))
  && (s.tags.some((t: any) => /\best\b/.test(t.cls) || /추정/.test(t.text)) || s.svgs.some((v: any) => /^proj_/.test(v.chart ?? "")) || /추정/.test(kickerText(s)) || /2036/.test(s.headline?.text ?? "") || /시나리오/.test(s.bodyText));
J["EVD-04"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) {
    const est = s.tags.filter((t: any) => /추정|est/.test(t.text + t.cls));
    if (est.length && !/\d\s*[~–]\s*\d|±|범위|\d+\s*~/.test(s.slideText)) items.push({ n, msg: "추정 라벨이 있는데 범위 표기 없음" });
    if (isExtrapolation(s) && !/한계|가정|불확실|조건|시나리오/.test(s.slideText)) items.push({ n, msg: "2036 외삽 장에 한계 문구 없음" });
    if (/한계/.test(s.headline?.text ?? "") && !/\d+\s*[~–]\s*\d+|±/.test(s.slideText)) items.push({ n, msg: "한계 장에 수치 범위 없음" });
    const causal = s.slideText.match(/[^.]*?(때문에|초래|입증|증명)[^.]*/g);
    if (causal && !s.tags.some((t: any) => /인과|검증/.test(t.text))) items.push({ n, msg: `근거 등급(기술·추정)을 넘는 인과 동사: "${causal[0].trim().slice(0, 40)}"` });
  }
  return { items, implemented: "auto+manual", manual: slidesOf(D).filter(([, s]) => isExtrapolation(s)).map(([n]) => shotOf(D, n)), measured: { extrapolation: slidesOf(D).filter(([, s]) => isExtrapolation(s)).map(([n]) => n) } };
};

J["EVD-05"] = (D) => {
  const items: Item[] = [];
  const s4 = D.slides[4], s33 = D.slides[33];
  if (!s4 || !s33) items.push({ msg: "4장·33장 측정 없음" });
  else {
    const key3 = s4.texts.filter((t: any) => (t.ctx.includes("fig") || t.ctx.includes("tile") || t.ctx.includes("num")) && /\d/.test(t.own) && t.efs >= 48).map((t: any) => t.own);
    const t33 = s33.slideText.replace(/\s/g, "");
    for (const k of key3) if (!t33.includes(k.replace(/\s/g, ""))) items.push({ n: 33, msg: `4장 핵심 수치 "${k}"가 33장에 없음` });
    if (key3.length < 3) items.push({ n: 4, msg: `4장 핵심 수치 ${key3.length}개(3개 기대)` });
  }
  const anyDate = slidesOf(D).some(([, s]) => /기준일|20\d\d[.\-년]\s*\d{1,2}[.\-월]\s*\d{1,2}일?\s*기준|기준\s*20\d\d/.test(s.slideText));
  if (!anyDate) items.push({ msg: "덱 안에 데이터 기준일 표기 없음" });
  return { items };
};

J["EVD-06"] = (D) => {
  const items: Item[] = [];
  const prose = D.files.html.replace(/<script[\s\S]*?<\/script>/g, " ");
  const strs: string[] = [];
  try { const walk = (o: any) => { if (typeof o === "string") strs.push(o); else if (o && typeof o === "object") Object.values(o).forEach(walk); }; walk(JSON.parse(D.files.chartData)); } catch {}
  for (const [name, t] of [["index.html", prose], ["chart-data.json 문자열", strs.join("\n")]] as const) {
    for (const m of t.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) ?? []) items.push({ msg: `${name} 이메일 ${m}` });
    for (const m of t.match(/01[016789]-?\d{3,4}-?\d{4}/g) ?? []) items.push({ msg: `${name} 전화번호 ${m}` });
    for (const m of t.match(/(?<![\d.,/=-])\d{8,10}(?![\d.,])/g) ?? []) if (!/^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/.test(m)) items.push({ msg: `${name} 학번형 숫자 ${m}` });
  }
  return { items };
};

// ── 내비게이션 ──
J["NAV-01"] = (D) => {
  const items: Item[] = [];
  const x = D.ix.nav01;
  if (!x) return { items: [{ msg: "측정 없음" }] };
  for (const c of x.cases) if (c.delta !== c.expect) items.push({ msg: `${c.name}: 장 ${c.before + 1}→${c.after + 1} (Δ${c.delta}, 기대 ${c.expect > 0 ? "+" : ""}${c.expect})` });
  const ta = `${x.touchAction.deck} / ${x.touchAction.body}`;
  if (!/pan-y/.test(ta) || !/pinch-zoom/.test(ta)) items.push({ msg: `스와이프 표면 touch-action ${ta}(pan-y pinch-zoom 아님)` });
  if (x.errors?.length) items.push({ msg: `JS 오류 ${x.errors.join(" · ")}` });
  return { items, measured: x.cases.map((c: any) => ({ case: c.name, delta: c.delta, expect: c.expect })), evidence: [x.shot] };
};

J["NAV-02"] = (D) => {
  const items: Item[] = [];
  for (const [name, r] of Object.entries(D.ix.buttons ?? {}) as [string, any][]) {
    if (!r.next || !r.prev) { items.push({ msg: `${name}: 이전·다음 버튼 없음(다음 ${r.next}, 이전 ${r.prev})` }); continue; }
    if (r.atEnd !== 33) items.push({ msg: `${name}: 다음 버튼 33번 후 장 ${r.atEnd + 1}` });
    const exp = Array.from({ length: 33 }, (_, i) => `#${i + 2}`);
    if (JSON.stringify(r.hashes) !== JSON.stringify(exp)) items.push({ msg: `${name}: hash 차례 ${r.hashes.slice(0, 5).join(",")}…` });
    if (r.back !== 0) items.push({ msg: `${name}: 이전 버튼으로 1장 복귀 실패(${r.back + 1})` });
    if (!r.overview) items.push({ msg: `${name}: 개요 버튼 없음` }); else if (!r.overviewOpened) items.push({ msg: `${name}: 개요 버튼이 개요를 열지 못함` });
    if (!r.fullscreen) items.push({ msg: `${name}: 전체 화면 버튼 없음` });
  }
  if (!D.ix.buttons) items.push({ msg: "측정 없음" });
  return { items };
};

J["NAV-03"] = (D) => {
  const items: Item[] = [];
  const k = D.ix.keys;
  if (!k) return { items: [{ msg: "측정 없음" }] };
  for (const s of k.seq) if (s.got !== s.expect) items.push({ msg: `${s.key === " " ? "Space" : s.key} → 장 ${s.got + 1}(기대 ${s.expect + 1})` });
  if (k.mods.prevented) items.push({ msg: `수식키 조합 preventDefault ${k.mods.prevented}/${k.mods.combos}` });
  if (k.mods.moved) items.push({ msg: `수식키 조합으로 장 이동 ${k.mods.moved}` });
  return { items, measured: k };
};

J["NAV-04"] = (D) => {
  const items: Item[] = [];
  const r = D.ix.rapid;
  if (!r) return { items: [{ msg: "측정 없음" }] };
  if (r.afterTen.cur !== 10) items.push({ msg: `→ 50ms 간격 10회 후 장 ${r.afterTen.cur + 1}(기대 11)` });
  if (r.afterTen.current !== 1) items.push({ msg: `current 장 ${r.afterTen.current}개` });
  if (r.firstVisibleMs == null || r.firstVisibleMs > 100) items.push({ msg: `입력→다음 장 보임 중앙값 ${r.firstVisibleMs == null ? "측정 실패" : r1(r.firstVisibleMs) + "ms"}(>100, 5회 ${(r.visibleSamples ?? []).map((x: number) => r1(x, 0)).join("/")})` });
  if (r.afterTen.hiding || r.afterRoundTrips.hiding) items.push({ msg: `is-hiding 잔존 ${r.afterTen.hiding}/${r.afterRoundTrips.hiding}` });
  if (r.afterRoundTrips.notOpaque) items.push({ msg: `왕복 20회 뒤 1.5초에도 불투명하지 않은 글줄 ${r.afterRoundTrips.notOpaque}` });
  if (r.afterRoundTrips.cur !== 10) items.push({ msg: `왕복 뒤 장 ${r.afterRoundTrips.cur + 1}(기대 11)` });
  if (r.errors.length) items.push({ msg: `JS 오류 ${r.errors.join(" · ")}` });
  return { items, measured: r, notes: ["글줄 불투명 확인은 마지막 입력 1.5초 뒤(글줄 등장 ≤1000ms 허용)"] };
};

J["NAV-05"] = (D) => {
  const items: Item[] = [];
  for (const [name, r] of Object.entries(D.ix.buttons ?? {}) as [string, any][]) {
    if (!r.prev || !r.next) { items.push({ msg: `${name}: 이전·다음 버튼이 없어 비활성 모양을 확인할 수 없음` }); continue; }
    const p = r.prevAtFirst;
    if (!p?.disabled || Number(p.opacity) > 0.4 || p.cursor !== "default") items.push({ msg: `${name}: 1장 이전 버튼 disabled ${p?.disabled}, opacity ${p?.opacity}, cursor ${p?.cursor}` });
    const q = r.nextAtLast;
    if (!q?.disabled || Number(q.opacity) > 0.4) items.push({ msg: `${name}: 34장 다음 버튼 disabled ${q?.disabled}, opacity ${q?.opacity}` });
    if (r.afterEndKey !== 33) items.push({ msg: `${name}: 34장에서 → 후 장 ${r.afterEndKey + 1}` });
    if (!r.endMarker?.length) items.push({ msg: `${name}: 끝 표시·처음으로 가는 길 없음` });
  }
  if (!D.ix.buttons) items.push({ msg: "측정 없음" });
  return { items };
};

J["NAV-06"] = (D) => {
  const items: Item[] = [];
  const h = D.ix.hash;
  if (!h) return { items: [{ msg: "측정 없음" }] };
  for (const l of h.loads) if (l.got !== l.expect) items.push({ msg: `#${l.hash || "(없음)"} 로드 → 장 ${l.got + 1}(기대 ${l.expect + 1})` });
  if (h.afterHashchange !== 11) items.push({ msg: `#1에서 location.hash='#12' 후 장 ${h.afterHashchange + 1}(hashchange 처리 없음)` });
  if (h.afterReload !== 11) items.push({ msg: `#12에서 새로고침 후 장 ${h.afterReload + 1}` });
  if (h.errors.length) items.push({ msg: `오류 ${h.errors.join(" · ")}` });
  return { items, measured: h };
};

J["NAV-07"] = (D) => {
  const items: Item[] = [];
  const h = D.ix.history;
  if (!h) return { items: [{ msg: "측정 없음" }] };
  if (!h.back.opened) items.push({ msg: "개요를 열 수 없어 개요 점프를 시험 못 함" });
  else {
    if (h.back.afterJump !== 19) items.push({ msg: `개요에서 20장 클릭 후 장 ${h.back.afterJump + 1}` });
    if (h.back.afterBack !== 2) items.push({ msg: `history.back() 후 ${h.back.afterBack == null ? h.back.href : `장 ${h.back.afterBack + 1}`}(기대 3장)` });
  }
  if (h.stepGrowth) items.push({ msg: `한 장씩 10번 이동에 history.length +${h.stepGrowth}` });
  return { items, measured: h };
};

J["NAV-08"] = (D) => {
  const items: Item[] = [];
  const e = D.ix.esc;
  if (!e) return { items: [{ msg: "측정 없음" }] };
  if (e.escOpens) items.push({ msg: "무대에서 Esc가 개요를 엶" });
  if (e.methods.length < 2) items.push({ msg: `개요를 여는 다른 수단 ${e.methods.length}개(G·O 키·버튼 중): ${e.methods.join(", ") || "없음"}` });
  return { items, measured: e, notes: [e.fsEntered ? `전체 화면에서 Esc: 개요 ${e.fsEscOverview ? "열림" : "안 열림"} — CDP 키 입력은 브라우저의 전체 화면 Esc 처리를 거치지 않아 판정에서 빼고 기록만 한다(실기기 확인 필요)` : "이 브라우저에서 F로 전체 화면에 들어가지 못해 전체 화면 Esc는 확인 못 함"] };
};

J["NAV-09"] = (D) => {
  const items: Item[] = [];
  const o = D.ix.overview;
  if (!o?.how) return { items: [{ msg: "개요를 열 수 없음" }] };
  if (!o.title) items.push({ msg: "개요 제목('전체 34장') 없음" });
  if (!o.close || o.close.w < 44 || o.close.h < 44) items.push({ msg: `닫기 버튼 ${o.close ? `${o.close.w}×${o.close.h}` : "없음"}` });
  if (o.pgEffective == null || o.pgEffective < 14) items.push({ msg: `썸네일 장 번호 실효 높이 ${o.pgEffective}px(<14)` });
  if (o.ariaCurrent !== 1) items.push({ msg: `aria-current 장 ${o.ariaCurrent}개` });
  if (!/solid|double/.test(o.currentOutline)) items.push({ msg: `현재 장 테두리 없음(${o.currentOutline})` });
  if (o.anims) items.push({ msg: `열 때 실행 중 애니메이션 ${o.anims}` });
  if (o.replayVisible || o.fixedVisible) items.push({ msg: `다른 오버레이 보임(재생 버튼 ${o.replayVisible}, 고정 요소 ${o.fixedVisible})` });
  if (o.afterTabEnter.overview) items.push({ msg: "Tab+Enter로 장을 고르지 못함(개요가 그대로)" });
  return { items, measured: o };
};

J["NAV-10"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) {
    const m = (s.pgText ?? "").match(/^(.*?)\s*·?\s*(\d+)\s*\/\s*(\d+)$/);
    if (!m) { items.push({ n, msg: `쪽 번호 형식 "${s.pgText}"` }); continue; }
    if (+m[2] !== n || +m[3] !== D.total) items.push({ n, msg: `쪽 번호 ${m[2]}/${m[3]} ≠ ${n}/${D.total}` });
    if (!m[1].trim()) items.push({ n, msg: "섹션명 없음" });
  }
  const ph = D.stage["812x375"];
  if (ph) {
    const prog = ph.st.fixed.filter((f: any) => /progress/i.test(f.label) || f.role === "progressbar");
    if (!prog.length) items.push({ msg: "812×375에 덱 밖 고정 진행 표시 없음" });
    const pg = Math.min(...(ph.scan?.map((x: any) => Math.min(...(x.pgEfs ?? [99]))) ?? [99]));
    if (pg < 12 && !prog.some((f: any) => f.h >= 12)) items.push({ msg: `812×375 위치 글자 실측 ${r1(pg)}px(<12)` });
  }
  const sc = D.stage["1440x900"]?.scan;
  if (sc && !sc.every((x: any) => x.title.includes(String(x.n)))) items.push({ msg: `document.title이 장 번호를 따르지 않음("${sc[3]?.title}")` });
  return { items };
};

J["NAV-11"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) for (const a of s.links) {
    const name = `${a.aria} ${a.title} ${a.text}`;
    if (!/underline/.test(a.tdl) && !/↗/.test(name)) items.push({ n, msg: `밑줄·↗ 없음: "${a.text.slice(0, 30)}"` });
    if (a.target === "_blank" && !/noopener/.test(a.rel)) items.push({ n, msg: `noopener 없음: ${a.href}` });
    if (!/새 탭/.test(name)) items.push({ n, msg: `'새 탭' 이름 없음: "${a.text.slice(0, 30)}"` });
    if (/^(여기|링크|URL)$/.test(a.text.trim()) || /^https?:\/\//.test(a.text.trim())) items.push({ n, msg: `모호한 링크 글자: "${a.text}"` });
  }
  const t = D.ix.linkTap;
  if (t?.link && t.after !== t.before) items.push({ n: 9, msg: `9장 영상 탭 후 장 ${t.before + 1}→${t.after + 1}` });
  if (t?.status) for (const [h, st] of Object.entries(t.status)) if (st !== 200) items.push({ msg: `링크 ${h} → ${st}` });
  return { items, notes: t?.status ? [] : ["원문 링크 HTTP 상태는 --net으로 돌릴 때만 확인"] };
};

J["NAV-12"] = (D) => {
  const items: Item[] = [];
  const f = D.ix.fsUnsupported;
  if (!f) return { items: [{ msg: "측정 없음" }] };
  if (f.buttons) items.push({ msg: `미지원 환경에 전체 화면 버튼 ${f.buttons}개` });
  if (f.errors.length) items.push({ msg: `미지원 환경에서 F 후 오류: ${f.errors.join(" · ")}` });
  const b = Object.values(D.ix.buttons ?? {}) as any[];
  if (b.length && !b.some((x) => x.fullscreen)) items.push({ msg: "지원 환경 전체 화면 버튼 없음(라벨 2상태 확인 불가)" });
  return { items, measured: f };
};

// ── 컨트롤 ──
J["CTL-01"] = (D) => {
  const items: Item[] = [];
  for (const name of ["375x812", "812x375", "1280x720", "1440x900"]) {
    const s = D.stage[name];
    if (!s) { items.push({ msg: `${name} 측정 없음` }); continue; }
    for (const [n, ctl] of Object.entries(s.ctl ?? {}) as [string, any[]][]) {
      for (const c of ctl) if (c.w < 44 || c.h < 44) items.push({ n: +n, msg: `${name} ${c.inSlide ? "덱 안 링크" : "고정 컨트롤"} ${r1(c.w, 0)}×${r1(c.h, 0)}(<44): ${c.label.slice(0, 40)}` });
      const fixed = ctl.filter((c: any) => !c.inSlide);
      for (let i = 0; i < fixed.length; i++) for (let j = i + 1; j < fixed.length; j++) {
        const a = fixed[i], b = fixed[j];
        const gap = Math.max(b.x - (a.x + a.w), a.x - (b.x + b.w), b.y - (a.y + a.h), a.y - (b.y + b.h));
        if (gap < 12) items.push({ n: +n, msg: `${name} 컨트롤 간격 ${r1(gap)}px(<12)` });
      }
    }
  }
  return { items };
};

J["CTL-02"] = (D) => {
  const items: Item[] = [];
  const ev: string[] = [];
  for (const [name, s] of Object.entries(D.stage) as [string, any][]) {
    if (!s.overlap) continue;
    const bad = s.overlap.filter((x: any) => x.hits.length);
    for (const b of bad) items.push({ n: b.n, msg: `${name}: ${b.hits[0].fixed.split(" ")[0]} ↔ ${b.hits[0].target.slice(0, 40)} ${b.hits[0].area}px²${b.hits.length > 1 ? ` 외 ${b.hits.length - 1}` : ""}` });
    if (bad.length) ev.push(s.shot);
  }
  return { items, evidence: ev };
};

J["CTL-03"] = (D) => {
  const items: Item[] = [];
  const x = D.ix.idle;
  if (!x) return { items: [{ msg: "측정 없음" }] };
  if (!x.idle.length) items.push({ msg: "고정 컨트롤 없음" });
  if (x.idle.some((o: number) => o > 0.2)) items.push({ msg: `포인터 3초 정지 후 컨트롤 불투명도 ${x.idle.join(",")}(>0.2)` });
  if (x.moved.some((o: number) => o < 1)) items.push({ msg: `움직인 뒤 200ms 불투명도 ${x.moved.join(",")}` });
  if (x.focused.some((o: number) => o < 1)) items.push({ msg: `포커스 중 불투명도 ${x.focused.join(",")}` });
  return { items, measured: x };
};

J["CTL-04"] = (D) => {
  const items: Item[] = [];
  const r = D.ix.rules;
  if (!r) return { items: [{ msg: "측정 없음" }] };
  const ms = (s: string) => Math.max(...s.split(",").map((x) => (x.trim().endsWith("ms") ? parseFloat(x) : parseFloat(x) * 1000)));
  for (const e of r.per) {
    const scale = e.active.map((t: string) => Number(t.match(/scale\(([\d.]+)\)/)?.[1])).find((v: number) => Number.isFinite(v));
    if (!e.active.length) items.push({ msg: `:active 없음: ${e.label}` });
    else if (!(scale >= 0.95 && scale <= 0.98)) items.push({ msg: `:active scale ${scale ?? "없음"}: ${e.label}` });
    const d = ms(e.transition);
    if (e.active.length && (d < 100 || d > 160)) items.push({ msg: `전환 ${d}ms(100~160 밖): ${e.label}` });
    if (!e.focusVisible) items.push({ msg: `:focus-visible 없음: ${e.label}` });
  }
  for (const h of r.hover) if (!h.inFineHover) items.push({ msg: `미디어 밖 :hover: ${h.sel}` });
  const f = D.ix.focusRing;
  if (f && (f.style === "none" || f.width < 2)) items.push({ msg: `포커스 링 ${f.style} ${f.width}px: ${f.label}` });
  else if (f) { const c = parseColor(f.color), bg = parseColor(f.bg); if (c && bg && bg[3] > 0 && contrast(c, bg) < 3) items.push({ msg: `포커스 링 대비 ${r1(contrast(c, bg), 2)}(<3)` }); }
  return { items };
};

J["CTL-05"] = (D) => {
  const items: Item[] = [];
  const s = D.stage["1440x900"];
  if (!s) return { items: [{ msg: "측정 없음" }] };
  const fixed = s.st.controls.filter((c: any) => !c.inSlide);
  const acc = tc(D, "--accent");
  const accBtns = fixed.filter((c: any) => { const b = parseColor(c.bg); return b && acc && deltaE(b, acc) < 3; });
  if (accBtns.length !== 1) items.push({ msg: `강조(인디고) 버튼 ${accBtns.length}개(다음 장 하나여야 함)` });
  else if (!/다음/.test(accBtns[0].name)) items.push({ msg: `강조 버튼이 '다음'이 아님: ${accBtns[0].name}` });
  if (uniq(fixed.map((c: any) => r1(c.h, 0))).length > 1) items.push({ msg: `컨트롤 높이 ${uniq(fixed.map((c: any) => r1(c.h, 0))).join("/")}` });
  for (const c of fixed) {
    if (!c.name || /^(확인|OK)$/i.test(c.name)) items.push({ msg: `버튼 이름 비었거나 모호: ${c.label}` });
    if (c.name.length > 12) items.push({ msg: `버튼 이름 ${c.name.length}자(>12): "${c.name}"` });
    if (c.svgs.length && (!c.aria || !c.title)) items.push({ msg: `아이콘 버튼 aria-label·title 누락: ${c.label}` });
  }
  const icons = fixed.flatMap((c: any) => c.svgs);
  if (uniq(icons.map((i: any) => i.vb)).length > 1 || uniq(icons.map((i: any) => i.sw)).length > 1) items.push({ msg: "아이콘 viewBox·stroke-width가 한 세트 아님" });
  const groups: any[][] = [];
  for (const c of [...fixed].sort((a: any, b: any) => a.x - b.x)) { const g = groups.find((g) => g.some((x) => Math.abs(x.x + x.w - c.x) < 24 && Math.abs(x.y - c.y) < 24)); g ? g.push(c) : groups.push([c]); }
  if (groups.length > 2) items.push({ msg: `컨트롤 묶음 ${groups.length}(>2)` });
  return { items, measured: { fixed: fixed.map((c: any) => `${c.name} ${r1(c.w, 0)}×${r1(c.h, 0)}`) } };
};

J["CTL-06"] = (D) => {
  const items: Item[] = [];
  const meta = D.files.html.match(/<meta[^>]+name=["']viewport["'][^>]*>/)?.[0] ?? "";
  if (!/viewport-fit=cover/.test(meta)) items.push({ msg: `meta viewport에 viewport-fit=cover 없음: ${meta}` });
  const css = stripComments(allCss(D));
  if (!/env\(safe-area-inset/.test(css)) items.push({ msg: "고정 요소 safe-area 여백(env(safe-area-inset-*)) 없음" });
  const vh = (css + allJs(D)).match(/100vh/g);
  if (vh) items.push({ msg: `100vh ${vh.length}건` });
  const s = D.stage["390x844"]?.st ?? D.stage["375x812"]?.st;
  if (s) {
    const th = parseColor(s.tapHi);
    if (!th || th[3] > 0) items.push({ msg: `탭 하이라이트 ${s.tapHi}` });
    for (const c of s.controls.filter((c: any) => !c.inSlide)) { if (c.touchAction !== "manipulation") items.push({ msg: `버튼 touch-action ${c.touchAction}: ${c.label}` }); if (c.userSelect !== "none") items.push({ msg: `버튼 user-select ${c.userSelect}: ${c.label}` }); }
    if (!s.overscroll.some((o: string) => o === "none")) items.push({ msg: `무대 overscroll-behavior ${s.overscroll.join("/")}` });
  }
  if (!/visualViewport/.test(D.files.js["present.js"] ?? "")) items.push({ msg: "fit()이 visualViewport resize에 걸려 있지 않음" });
  return { items };
};

J["CTL-07"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) {
    for (const h of s.hoverish) items.push({ n, msg: `누를 수 없는데 cursor:pointer: ${h}` });
    for (const b of s.boxes) if (/0 40px 80px -24px/.test(b.shadow) && b.rect.h < 80 && !/\b(a|button)\b/.test(b.tag)) items.push({ n, msg: `떠 있는 그림자(--sh-float)를 단 누를 수 없는 요소: ${b.label.split(" ")[0]}` });
  }
  for (const h of D.ix.rules?.hover ?? []) if (h.nonInteractive) items.push({ msg: `누를 수 없는 요소의 :hover: ${h.sel} (${h.nonInteractive}개)` });
  return { items };
};

// ── 안내 ──
J["ONB-01"] = (D) => {
  const items: Item[] = [];
  const o = D.ix.onb;
  if (!o) return { items: [{ msg: "측정 없음" }] };
  const hint = (o.desktopHint ?? []).filter((h: any) => !/다시 재생/.test(h.text));
  if (!hint.length) items.push({ msg: "첫 방문 조작 안내 없음" });
  else {
    if (o.afterMove?.length) items.push({ msg: "첫 이동 뒤에도 안내가 남음" });
    if (o.afterReload?.length) items.push({ msg: "재방문에 안내가 다시 뜸" });
    if (!o.afterQuestion?.length) items.push({ msg: "?로 안내를 다시 볼 수 없음" });
    const t = hint[0].text;
    if ((t.match(/(니다|[.!?])/g) ?? []).length > 2 || /[,:]/.test(t)) items.push({ msg: `안내 문구 "${t}"(2문장 이하·쉼표 콜론 0)` });
  }
  if (o.lsThrowErrors?.length) items.push({ msg: `localStorage 차단 시 오류 ${o.lsThrowErrors.join(" · ")}` });
  if (o.renderHint?.filter((h: any) => !/다시 재생/.test(h.text)).length) items.push({ msg: "?slide 렌더에 안내가 보임" });
  return { items };
};

J["ONB-02"] = (D) => {
  const items: Item[] = [];
  const o = D.ix.onb;
  if (!o) return { items: [{ msg: "측정 없음" }] };
  for (const k of ["390x844", "375x812"]) { const ui = o[k]?.portrait?.ui ?? ""; const m = ui.match(/\(R\)|Esc|←|→|키를/g); if (m) items.push({ msg: `${k} 터치 화면에 키 표기: ${uniq(m).join(", ")}` }); }
  if (!/\(R\)|Esc|←|→|키|Space/.test(o.desktopUi ?? "")) items.push({ msg: "데스크톱에 키 안내 없음" });
  if (/밀어|탭하/.test(o.desktopUi ?? "")) items.push({ msg: "데스크톱에 터치 표현" });
  return { items };
};

J["ONB-03"] = (D) => {
  const items: Item[] = [];
  const o = D.ix.onb;
  if (!o) return { items: [{ msg: "측정 없음" }] };
  const ev: string[] = [];
  for (const k of ["390x844", "375x812"]) {
    const x = o[k];
    if (!x) continue;
    ev.push(...x.shots);
    const notice = x.portrait.hint.some((h: any) => /가로|회전|돌리/.test(h.text)) || /read|portrait/.test(x.portrait.body);
    if (!notice) items.push({ msg: `${k} 세로: 회전 안내·세로 읽기 모드 없음` });
    const L = x.landscape;
    if (L.hint.some((h: any) => /가로|회전|돌리/.test(h.text))) items.push({ msg: `${k} 가로로 돌린 뒤에도 회전 안내가 남음` });
    const exp = Math.min(L.vw / 1920, L.vh / 1080);
    if (Math.abs(L.k - exp) > 0.002) items.push({ msg: `${k} 가로 배율 ${L.k} ≠ ${r1(exp, 4)}` });
    if (L.cur !== x.portrait.cur) items.push({ msg: `${k} 회전 뒤 장 ${x.portrait.cur + 1}→${L.cur + 1}` });
    const fill = Math.max(L.deck.w / L.vw, L.deck.h / L.vh);
    if (fill < 0.95) items.push({ msg: `${k} 가로 덱이 화면 한 변을 채우지 못함(${r1(fill * 100, 0)}%)` });
  }
  const p = D.stage["375x812"]?.st;
  if (p) items.push(...(p.k < 0.3 ? [{ msg: `375×812 세로 배율 ${p.k} → 헤드라인 실효 ${r1(48 * p.k, 1)}px·본문 ${r1(20 * p.k, 1)}px` }] : []));
  return { items, evidence: ev, implemented: "auto+manual", manual: ev, notes: ["'가로 덱 폭 ≥95%'는 16:9 덱이 2.17:1 화면에서 폭을 채울 수 없어 '한 변(높이)을 95% 이상 채움'으로 잰다"] };
};

J["ONB-04"] = (D) => {
  const items: Item[] = [];
  const o = D.ix.onb?.load;
  if (!o) return { items: [{ msg: "측정 없음" }] };
  if (o.cur !== 0 || o.side !== "current") items.push({ msg: `로드 직후 장 ${o.cur + 1}, 표지 data-side ${o.side}` });
  for (const f of o.fixed) { const a = hit({ x: f.x, y: f.y, w: f.w, h: f.h }, o.cover); if (a > 0) items.push({ msg: `표지 제목을 덮는 고정 요소 ${f.label} ${r1(a, 0)}px²` }); }
  if (o.dialogs) items.push({ msg: `모달·배너 ${o.dialogs}` });
  if (D.ix.onb.status !== 200) items.push({ msg: `HTTP ${D.ix.onb.status}` });
  return { items, notes: ["공개 URL 200은 --public=URL로 확인"] };
};

// ── 반응형 ──
J["RSP-01"] = (D) => {
  const items: Item[] = [];
  const names = ["1920x1080", "1512x982", "1440x900", "1366x768", "1280x720", "1024x768", "2560x1080", "960x1080", "844x390", "390x844", "375x812"];
  for (const name of names) {
    const s = D.stage[name]?.st;
    if (!s) { items.push({ msg: `${name} 측정 없음` }); continue; }
    const ratio = s.deck.w / s.deck.h;
    if (Math.abs(ratio - 16 / 9) / (16 / 9) > 0.005) items.push({ msg: `${name} 덱 비율 ${r1(ratio, 3)}` });
    if (s.scrollW > s.vw) items.push({ msg: `${name} 가로 스크롤 ${s.scrollW}>${s.vw}` });
    if (s.deck.x < -1 || s.deck.y < -1 || s.deck.x + s.deck.w > s.vw + 1 || s.deck.y + s.deck.h > s.vh + 1) items.push({ msg: `${name} 덱이 뷰포트 밖 (${s.deck.x},${s.deck.y},${s.deck.w}×${s.deck.h})` });
    const lr = Math.abs(s.deck.x - (s.vw - s.deck.x - s.deck.w));
    if (lr > 1) items.push({ msg: `${name} 좌우 여백 차 ${r1(lr)}px` });
  }
  const shots = names.map((n) => D.stage[n]?.shot).filter(exists);
  return { items, implemented: "auto+manual", manual: shots, evidence: shots.slice(0, 4), notes: ["뷰포트마다 10장 한 장을 찍어 묶음으로 낸다(34장 × 11뷰포트 전부는 찍지 않음, 덱 상자는 장과 무관)"] };
};

J["RSP-02"] = (D) => {
  const items: Item[] = [];
  const a = D.stage["1280x720"]?.scan;
  if (!a) items.push({ msg: "1280×720 측정 없음" });
  for (const x of a ?? []) {
    if (x.minText < 12) items.push({ n: x.n, msg: `1280×720 최소 실효 글자 ${x.minText}px(<12): ${x.minLabel}` });
    if (x.headlineEfs != null && x.headlineEfs < 30) items.push({ n: x.n, msg: `1280×720 헤드라인 ${x.headlineEfs}px(<30)` });
  }
  const k480 = 480 / 1920;
  const h480 = 48 * k480;
  if (h480 < 12) items.push({ msg: `480×270 헤드라인 ${h480}px(<12)` });
  const pg = 16 * k480;
  const r = D.ix.r480;
  let read: any = null;
  if (r?.available) {
    // 쪽 번호 OCR 34/34: 480×270로 줄인 장에서 Vision이 그 장 번호(앞자리 0 허용)를 읽어 내는지
    const ok: number[] = [], miss: number[] = [];
    for (const p of r.pages) {
      const digits = (p.read ?? []).flatMap((l: any) => (l.text.match(/\d+/g) ?? []).map(Number));
      (digits.includes(p.n) ? ok : miss).push(p.n);
    }
    for (const n of miss) items.push({ n, msg: `480×270에서 쪽 번호 ${n} OCR로 못 읽음(실효 ${r1(pg, 1)}px)` });
    read = { ok: ok.length, total: r.pages.length };
  } else if (pg < 8) items.push({ msg: `480×270 쪽 번호 ${pg}px — OCR로 읽기 어려운 크기(8px 미만, OCR 없어 크기로 판정: ${r?.reason ?? "측정 없음"})` });
  // 375×812 세로는 참고값만 남긴다(판정은 ONB-03·RSP-01)
  const p = D.stage["375x812"]?.scan;
  return { items, measured: { pageOcr480: read, portrait: (p ?? []).slice(0, 1).map((x: any) => ({ minText: x.minText, headlineEfs: x.headlineEfs })) }, notes: [r?.available ? "480×270 쪽 번호는 macOS Vision OCR로 읽었다" : "OCR이 없어 480×270 쪽 번호는 실효 크기로 대신 판정"], implemented: r?.available ? "auto" : "partial" };
};

J["RSP-03"] = (D) => {
  const items: Item[] = [];
  const meta = D.files.html.match(/<meta[^>]+name=["']viewport["'][^>]*>/)?.[0] ?? "";
  if (/user-scalable\s*=\s*no|maximum-scale/.test(meta)) items.push({ msg: `확대 차단: ${meta}` });
  const z = D.ix.zoom;
  if (z) { const d = z.deck; if (d.x < -1 || d.y < -1 || d.x + d.w > z.vw + 1 || d.y + d.h > z.vh + 1) items.push({ msg: `200% 확대에서 장 모서리가 뷰포트 밖` }); }
  return { items, implemented: "auto+manual", manual: [z?.shot].filter(exists), evidence: [z?.shot].filter(exists), notes: ["읽기 모드 실효 크기 1.8배·핀치 후 화면은 수동"] };
};

J["RSP-04"] = (D) => {
  const items: Item[] = [];
  const f = D.ix.firstPaint;
  if (!f) return { items: [{ msg: "측정 없음" }] };
  if (f.early.error) items.push({ msg: `첫 페인트 측정 실패: ${f.early.error}` });
  else {
    if (f.early.visible !== 1) items.push({ msg: `anime 지연 중 보이는 장 ${f.early.visible}(무대 ${f.early.stage ? "켜짐" : "아직 안 켜짐"})` });
    if (f.early.scrollX) items.push({ msg: "첫 페인트에 가로 스크롤" });
  }
  if (f.diffOutsideCover?.changed > 0.001) items.push({ msg: `첫 페인트와 완성 무대의 표지 밖 픽셀 차 ${r1(f.diffOutsideCover.changed * 100, 1)}%` });
  return { items, evidence: [f.shot] };
};

// ── 모션 ──
const msOf = (s: string) => Math.max(...String(s).split(",").map((x) => (x.trim().endsWith("ms") ? parseFloat(x) : parseFloat(x) * 1000)));
J["MOT-01"] = (D) => {
  const items: Item[] = [];
  const m = D.ix.motion;
  if (!m) return { items: [{ msg: "측정 없음" }] };
  const d = msOf(m.dur.duration);
  if (d > 250) items.push({ msg: `장 전환 ${d}ms(>250)` });
  if (parseFloat(m.dur.distance) > 8) items.push({ msg: `전환 거리 ${m.dur.distance}` });
  if (parseFloat(m.dur.blur) > 3) items.push({ msg: `전환 blur ${m.dur.blur}` });
  const f = m.fwd.find((x: any) => x.incoming !== 0) ?? m.fwd[0], b = m.bwd.find((x: any) => x.incoming !== 0) ?? m.bwd[0];
  if (!(f.incoming > 0)) items.push({ msg: `앞으로 갈 때 새 장 translateX ${f.incoming}(오른쪽에서 들어와야 함)` });
  if (!(b.incoming < 0)) items.push({ msg: `뒤로 갈 때 새 장 translateX ${b.incoming}` });
  if (!(f.outgoing <= 0)) items.push({ msg: `앞으로 갈 때 나가는 장 translateX ${f.outgoing}` });
  return { items, measured: { fwd: m.fwd, bwd: m.bwd, ...m.dur } };
};

J["MOT-02"] = (D) => {
  const items: Item[] = [];
  const m = D.ix.motion;
  if (!m) return { items: [{ msg: "측정 없음" }] };
  for (const l of m.timing.lines) {
    if (l.end > 1000) items.push({ n: l.n, msg: `글줄 등장 ${l.end}ms(>1000)` });
    if (l.step != null && (l.step < 30 || l.step > 80)) items.push({ n: l.n, msg: `글줄 간격 ${l.step}ms` });
  }
  for (const t of m.timing.tls) if (t.duration > 1500) items.push({ n: t.n, msg: `차트 빌드 ${r1(t.duration, 0)}ms(>1500)` });
  if (m.interrupt.cur !== 7 || m.interrupt.ms > 50) items.push({ msg: `차트 진입 200ms 뒤 → : 장 ${m.interrupt.cur + 1}, ${r1(m.interrupt.ms)}ms` });
  if (m.interrupt.leftTl && !m.interrupt.leftTl.paused && !m.interrupt.leftTl.completed) items.push({ n: 7, msg: `떠난 장의 차트 타임라인이 계속 돎(paused ${m.interrupt.leftTl.paused}, ${r1(m.interrupt.leftTl.t, 0)}/${r1(m.interrupt.leftTl.d, 0)}ms)` });
  return { items };
};

J["MOT-03"] = (D) => {
  const items: Item[] = [];
  const m = D.ix.motion;
  if (!m) return { items: [{ msg: "측정 없음" }] };
  if (m.revisit.notOpaque) items.push({ n: 3, msg: `이미 본 3장으로 돌아온 50ms 뒤 흐린 글줄 ${m.revisit.notOpaque}/${m.revisit.lines}(다시 재생됨)` });
  if (m.afterR == null || m.afterR >= 1) items.push({ msg: `R 후 50ms 첫 글줄 불투명도 ${m.afterR}(재생 안 됨)` });
  if (!m.space) items.push({ msg: "다시 재생 버튼을 찾지 못함" });
  else if (m.space.to !== m.space.from + 1) items.push({ msg: `재생 버튼 뒤 Space: 장 ${m.space.from + 1}→${m.space.to + 1}(+1 기대)` });
  return { items, measured: { revisit: m.revisit, afterR: m.afterR, space: m.space } };
};

J["MOT-04"] = (D) => {
  const items: Item[] = [];
  const src = stripComments(allCss(D)) + "\n" + allJs(D);
  for (const m of src.matchAll(/cubic-bezier\(([^)]+)\)/g)) { const p = m[1].split(",").map(Number); if (p[1] > 1 || p[3] > 1 || p[1] < 0 || p[3] < 0) items.push({ msg: `overshoot 이징 cubic-bezier(${m[1]})` }); }
  for (const m of src.match(/\bease-in\b(?!-out)/g) ?? []) items.push({ msg: `ease-in ${m}` });
  for (const m of src.match(/bounce|elastic|outBack|inBack/gi) ?? []) items.push({ msg: `튀는 이징 ${m}` });
  if (/\bscale\(0\)/.test(src)) items.push({ msg: "CSS scale(0)" });
  for (const m of (D.files.js["motion.js"] ?? "").match(/\bscale:\s*\[0,\s*1\]/g) ?? []) items.push({ msg: `JS ${m}(점이 0에서 커짐)` });
  if (/transition\s*:\s*all\b/.test(src)) items.push({ msg: "transition: all" });
  for (const m of stripComments(allCss(D)).matchAll(/transition(?:-property)?\s*:([^;]+);/g)) if (/\b(width|height|top|left)\b/.test(m[1])) items.push({ msg: `레이아웃 속성 전환: ${m[1].trim().slice(0, 60)}` });
  const m = D.ix.motion;
  const hide = stripComments(D.files.slides).match(/\.is-hiding[^{]*\{[^}]*transition:\s*opacity\s+(\d+)ms/)?.[1];
  if (hide && +hide > 200) items.push({ msg: `글줄 퇴장 ${hide}ms(>200)` });
  if (m && msOf(m.dur.duration) > 200) items.push({ msg: `장 퇴장 페이드 ${msOf(m.dur.duration)}ms(>200, 등장과 같음)` });
  return { items };
};

J["MOT-05"] = (D) => {
  const items: Item[] = [];
  const con = D.ext.constitution?.out ?? "";
  const ease = Number(con.match(/이징 (\d+)/)?.[1] ?? 0);
  if (ease > 3) items.push({ msg: `이징 ${ease}종(>3)` });
  const files = { ...Object.fromEntries(["deck.css", "slides.css"].map((f, i) => [f, [D.files.deck, D.files.slides][i]])), ...D.files.extraCss, ...D.files.js } as Record<string, string>;
  for (const [f, t] of Object.entries(files)) stripComments(t).split("\n").forEach((l, i) => {
    if (/motion-ok/.test(l)) return;
    const raw = l.replace(/--[\w-]+\s*:\s*[^;]+;/g, "");
    const css = f.endsWith(".css") ? raw.match(/\b\d+m?s\b/g) : null;
    const js = f.endsWith(".js") ? (raw.match(/set(Timeout|Interval)\([^)]*?,\s*\d+\s*\)/g) ?? []).concat(raw.match(/\b(micro|stagger|fast|slow|duration):\s*\d+/g) ?? []) : null;
    for (const v of [...(css ?? []), ...(js ?? [])]) if (!/^0m?s$/.test(v)) items.push({ msg: `${f}:${i + 1} 토큰 밖 시간 값 ${v}` });
  });
  if (!/getPropertyValue\(\s*["']--(duration|ease)/.test(allJs(D))) items.push({ msg: "JS가 모션 CSS 변수를 읽지 않음(시간을 JS 상수로 다시 적음)" });
  return { items };
};

J["MOT-06"] = (D) => {
  const items: Item[] = [];
  const r = D.ix.reduce;
  if (!r) return { items: [{ msg: "측정 없음" }] };
  const d = msOf(r.trans.duration);
  if (!/opacity/.test(r.trans.property) || d < 150 || d > 200) items.push({ msg: `모션 감소에서 장 사이 전환 ${r.trans.property} ${r.trans.duration}(opacity 150~200ms 페이드 기대)` });
  if (r.samples.some((x: any) => (x.t !== "none" && !/matrix\(1, 0, 0, 1, 0, 0\)/.test(x.t)) || (x.f !== "none" && !/blur\(0px\)/.test(x.f)))) items.push({ msg: `전환 중 transform·filter 변화: ${JSON.stringify(r.samples[0])}` });
  if (r.diff.changed > 0.0005) items.push({ msg: `진입 0ms와 2000ms 픽셀 차 ${r1(r.diff.changed * 100, 2)}%` });
  if (r.anims) items.push({ msg: `transform 애니메이션 ${r.anims}` });
  if (r.coverChanges) items.push({ msg: `표지 교차 페이드 ${r.coverChanges}회` });
  return { items, measured: r };
};

J["MOT-07"] = (D) => {
  const items: Item[] = [];
  const src = allCss(D) + allJs(D);
  if (/\binfinite\b/.test(stripComments(src))) items.push({ msg: "infinite 반복" });
  const x = D.ix.idleCover;
  if (!x) items.push({ msg: "30초 측정 없음" });
  else {
    if (x.changes > 2) items.push({ msg: `표지 30초 동안 사진 교차 ${x.changes}회(>2)` });
    if (x.running) items.push({ msg: `30초 뒤 실행 중 애니메이션 ${x.running}` });
    if (x.hiddenChanges) items.push({ msg: `탭 숨김 중 교차 ${x.hiddenChanges}회` });
    if (x.curAfter !== 0) items.push({ msg: `자동 장 이동(장 ${x.curAfter + 1})` });
  }
  return { items, measured: x, notes: ["교차 1회 = 표지 사진 하나가 .on을 새로 얻은 횟수"] };
};

J["MOT-08"] = (D) => {
  const items: Item[] = [];
  let digitSlides = 0;
  for (const [n, s] of slidesOf(D)) {
    const L = [...s.stagger].sort((a: any, b: any) => a.i - b.i);
    let inv = 0;
    for (let i = 1; i < L.length; i++) { const a = L[i - 1].rect, b = L[i].rect; if (L[i].i === L[i - 1].i) continue; if (b.y + 8 < a.y || (Math.abs(b.y - a.y) <= 8 && b.x + 8 < a.x)) inv++; }
    if (inv) items.push({ n, msg: `등장 순서가 읽기 순서와 어긋남 ${inv}곳` });
    if (s.digits.length > 1) items.push({ n, msg: `숫자 팝인 ${s.digits.length}개(>1)` });
    if (s.digits.length) digitSlides++;
    if (s.cover && s.stagger.length > 4) items.push({ n, msg: `표지 순차 대상 ${s.stagger.length}(>4)` });
  }
  if (digitSlides > 8) items.push({ msg: `숫자 팝인 장 ${digitSlides}(>8)` });
  return { items, implemented: "auto+manual", manual: ["bun scripts/snap-motion.ts 5,7,13 → presentation/renders/motion/"] };
};

J["MOT-09"] = (D) => {
  const items: Item[] = [];
  const std = stdText(D);
  const hasList = /##+\s*모션/.test(std);
  if (!hasList) items.push({ msg: "design-standard에 모션 목록 절 없음" });
  for (const k of ["장 전환", "글줄", "숫자", "차트", "교차 페이드"]) if (!new RegExp(`\\|[^\\n]*${k}[^\\n]*\\|`).test(std)) items.push({ msg: `모션 목록에 '${k}' 행 없음` });
  const found = [...stripComments(allCss(D)).matchAll(/([^{}]+)\{[^}]*(transition|animation)\s*:[^}]*\}/g)].map((m) => m[1].trim().split(",")[0]).filter((s) => !/^:root/.test(s));
  return { items, measured: { motionsInCss: uniq(found) }, implemented: "auto+manual", manual: Object.keys(D.files.std).map((f) => `design-standard/${f}`) };
};

J["MOT-10"] = (D) => {
  const items: Item[] = [];
  const p = D.ix.perf;
  if (!p) return { items: [{ msg: "측정 없음" }] };
  if (p.long) items.push({ msg: `50ms 넘는 프레임 ${p.long}/${p.frames}(최악 ${r1(p.worst, 0)}ms)` });
  if (p.fps < 50) items.push({ msg: `평균 ${p.fps}fps(<50)` });
  return { items, measured: p, notes: ["CPU 4배 감속 에뮬레이션(390×844). 실기기 확인 아님"] };
};

J["MOT-11"] = (D) => {
  const items: Item[] = [];
  const f = D.ix.frozen;
  if (!f) return { items: [{ msg: "측정 없음" }] };
  if (f.cur !== 6) items.push({ msg: `탭 복귀 뒤 장 ${f.cur + 1}(7 기대)` });
  if (f.d != null && f.early < f.d - 1) items.push({ n: 7, msg: `탭 복귀 100ms 뒤 차트 빌드 ${r1(f.early, 0)}/${r1(f.d, 0)}ms — 반쯤 그려진 채로 보임(${f.waitMs}ms 뒤 ${r1(f.t, 0)}ms)` });
  return { items, measured: f, notes: ["탭 숨김은 document.hidden·visibilitychange를 10초 바꿔 모사(실제 탭 전환 아님). 돌아온 100ms 뒤 완성 상태여야 통과"] };
};

// ── 접근성 ──
J["A11Y-01"] = (D) => {
  const items: Item[] = [];
  const f = D.ix.focus;
  if (!f) return { items: [{ msg: "측정 없음" }] };
  const notInert = f.inert.filter((x: boolean, i: number) => !x && i !== f.cur).length;
  if (notInert) items.push({ msg: `현재 장이 아닌데 inert·aria-hidden 아닌 장 ${notInert}/${f.inert.length - 1}` });
  const out = f.where.filter((w: string) => w.startsWith("other"));
  if (out.length) items.push({ msg: `Tab 40회 중 다른 장으로 샌 포커스 ${out.length}: ${uniq(out).slice(0, 3).join(",")}` });
  return { items, measured: { where: f.where.reduce((m: any, w: string) => ((m[w] = (m[w] ?? 0) + 1), m), {}) } };
};

J["A11Y-02"] = (D) => {
  const items: Item[] = [];
  const f = D.ix.focus;
  if (!f) return { items: [{ msg: "측정 없음" }] };
  const polite = f.live.flatMap((x: any) => x.live.filter((l: any) => l.mode === "polite"));
  if (!polite.length) items.push({ msg: "aria-live=polite 영역 없음" });
  for (const x of f.live) { const t = x.live.filter((l: any) => l.mode === "polite").map((l: any) => l.text).join(" "); if (polite.length && !t.includes(`${x.cur + 1} / `)) items.push({ msg: `장 ${x.cur + 1} 이동 알림 "${t.slice(0, 40)}"` }); }
  return { items };
};

J["A11Y-03"] = (D) => {
  const items: Item[] = [];
  const all = new Map<string, number[]>();
  for (const [n, s] of slidesOf(D)) {
    const h = s.headings.filter((x: any) => /^h[12]$/.test(x.tag));
    if (h.length !== 1) items.push({ n, msg: `h1·h2 ${h.length}개(1 기대)${s.nohead ? " — nohead 장은 숨긴 heading 필요" : ""}` });
    for (const x of h) (all.get(x.text) ?? all.set(x.text, []).get(x.text))!.push(n);
    for (const g of s.digits) {
      if (g.aria !== g.text) items.push({ n, msg: `쪼갠 숫자 "${g.text}" aria-label ${g.aria == null ? "없음" : `"${g.aria}"`}` });
      if (g.hiddenDigits !== g.digits) items.push({ n, msg: `"${g.text}" 숫자 조각 aria-hidden ${g.hiddenDigits}/${g.digits}` });
    }
  }
  for (const [t, ns] of all) if (ns.length > 1) items.push({ n: ns[1], msg: `heading 중복 "${t}" 장 ${ns.join(",")}` });
  return { items };
};

J["A11Y-04"] = (D) => {
  const items: Item[] = [];
  if (!/<html[^>]+lang=/.test(D.files.html)) items.push({ msg: "html lang 없음" });
  if (!/<title>[^<]+<\/title>/.test(D.files.html)) items.push({ msg: "document-title 없음" });
  const ids = [...D.files.html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  for (const d of uniq(ids.filter((x, i) => ids.indexOf(x) !== i))) items.push({ msg: `duplicate-id ${d}` });
  for (const [n, s] of slidesOf(D)) {
    for (const i of s.images) if (!i.hasAlt) items.push({ n, msg: `image-alt: ${i.src}` });
    for (const a of s.links) if (!`${a.aria}${a.title}${a.text}`.trim()) items.push({ n, msg: `link-name: ${a.href}` });
    for (const v of s.svgs) if (v.role === "img" && !`${v.aria}${v.desc}`.trim()) items.push({ n, msg: `svg-img-alt: ${v.chart ?? v.cls}` });
  }
  const con = J["CON-01"](D).items;
  for (const c of con) items.push({ n: c.n, msg: `color-contrast: ${c.msg}` });
  const s = D.stage["1440x900"]?.st;
  for (const c of s?.controls ?? []) if (!c.name) items.push({ msg: `button-name: ${c.label}` });
  return { items, implemented: "partial", notes: ["axe-core가 이 환경에 없어 critical·serious 규칙 중 image-alt·button-name·link-name·svg-img-alt·color-contrast·html-has-lang·document-title·duplicate-id만 직접 잼"] };
};

J["A11Y-05"] = (D) => {
  const items: Item[] = [];
  const x = D.ix.degraded;
  if (!x) return { items: [{ msg: "측정 없음" }] };
  if (x.nojs.slides < 34) items.push({ msg: `JS 끔: .slide ${x.nojs.slides}` });
  if (x.nojs.emptyCharts.length) items.push({ msg: `JS 끔: 빈 차트 ${x.nojs.emptyCharts.length}(${x.nojs.emptyCharts.join(", ")})` });
  if (!x.nojs.noscript) items.push({ msg: "JS 끔: noscript 안내 없음" });
  if (x.nojs.hiddenText) items.push({ msg: `JS 끔: 흐린 글자 ${x.nojs.hiddenText}` });
  if (x.noanime.errors.length) items.push({ msg: `anime 차단: 오류 ${x.noanime.errors.join(" · ").slice(0, 160)}` });
  if (x.noanime.after === x.noanime.before) items.push({ msg: `anime 차단: → 후 장 ${x.noanime.before + 1}→${x.noanime.after + 1}(덱 정지)` });
  if (x.noanime.hiddenText) items.push({ msg: `anime 차단: 현재 장 흐린 글줄 ${x.noanime.hiddenText}` });
  for (const s of x.noimg) if (s.maxShift > 0.5) items.push({ n: s.n, msg: `이미지 차단: 블록 이동 ${s.maxShift}px(레이아웃 시프트)` });
  return { items, evidence: [x.nojs.shot, x.noanime.shot].filter(exists) };
};

J["A11Y-06"] = (D) => {
  const items: Item[] = [];
  for (const [n, s] of slidesOf(D)) { const u = s.texts.filter((t: any) => t.us === "none"); if (u.length) items.push({ n, msg: `user-select none 글자 ${u.length}: ${u[0].label}` }); }
  const x = D.ix.select;
  if (!x?.rect) items.push({ msg: "7장 출처를 찾지 못함" });
  else if (!x.selected) items.push({ msg: "출처 드래그 선택 문자열이 비어 있음" });
  return { items, measured: x };
};

// ── 성능 ──
J["PERF-01"] = (D) => {
  const items: Item[] = [];
  const s = D.ix.slow;
  if (!s) return { items: [{ msg: "측정 없음" }] };
  if (!(s.lcp > 0) || s.lcp > 2500) items.push({ msg: `LCP ${r1(s.lcp, 0)}ms(>2500)` });
  if (s.cls > 0.05) items.push({ msg: `CLS ${r1(s.cls, 3)}(>0.05)` });
  if (s.transfer > 1.5 * 1024 * 1024) items.push({ msg: `첫 화면 전송량 ${r1(s.transfer / 1048576, 2)}MB(>1.5): 가장 큰 ${[...s.resources].sort((a: any, b: any) => b.size - a.size).slice(0, 2).map((r: any) => `${r.name} ${r1(r.size / 1024, 0)}KB`).join(", ")}` });
  return { items, measured: { lcp: s.lcp, cls: s.cls, transferKB: r1(s.transfer / 1024, 0) }, implemented: "partial", notes: ["Lighthouse가 없어 CDP(150ms RTT·1.6Mbps·CPU 4배)와 PerformanceObserver로 근사. 로컬 서버만, 공개 URL은 --public"] };
};

J["PERF-02"] = (D) => {
  const items: Item[] = [];
  const p = D.ix.preload;
  if (!p) return { items: [{ msg: "측정 없음" }] };
  if (p.nextComplete.some((x: boolean) => !x)) items.push({ msg: `1장에서 2장 이미지 미완료 ${p.nextComplete.filter((x: boolean) => !x).length}` });
  if (p.slowImgMove.to !== p.slowImgMove.from + 1) items.push({ msg: `이미지 3초 지연 중 → : 장 ${p.slowImgMove.from + 1}→${p.slowImgMove.to + 1}` });
  if (p.cls > 0) items.push({ msg: `첫 넘김 CLS ${r1(p.cls, 3)}` });
  return { items, measured: p };
};

J["PERF-03"] = (D) => {
  const items: Item[] = [];
  const f = D.ix.firstLoad;
  if (!f) return { items: [{ msg: "측정 없음" }] };
  const other = f.origins.filter((o: string) => !/127\.0\.0\.1/.test(o));
  if (other.length) items.push({ msg: `타 출처 요청 ${other.join(", ")}` });
  if (f.cookie) items.push({ msg: `쿠키 ${f.cookie}` });
  if (f.iframes) items.push({ msg: `iframe ${f.iframes}` });
  if (f.autoplay) items.push({ msg: `자동 재생·오디오 ${f.autoplay}` });
  const mainScripts = [...(D.files.mainHtml.matchAll(/<script[^>]+src="([^"]+)"/g) ?? [])].map((m: any) => m[1]);
  const added = f.scripts.map((s: string) => s.replace(/^\//, "")).filter((s: string) => mainScripts.length && !mainScripts.includes(s));
  if (added.length) items.push({ msg: `main 대비 추가 스크립트 ${added.join(", ")}` });
  if (D.files.vendorDiff && !/^git diff 실패/.test(D.files.vendorDiff)) items.push({ msg: `assets/vendor 변경: ${D.files.vendorDiff.split("\n").join(", ")}` });
  return { items };
};

J["PERF-04"] = (D) => {
  const items: Item[] = [];
  const errs = new Set<string>();
  for (const [name, s] of Object.entries(D.stage) as [string, any][]) for (const e of s.st?.jsErrors ?? []) errs.add(`${name}: ${e}`);
  for (const k of ["reduce", "motion", "rapid", "hash", "nav01"]) for (const e of D.ix[k]?.errors ?? []) errs.add(`${k}: ${e}`);
  for (const e of errs) items.push({ msg: `JS 오류 ${e}` });
  const names = new Map<string, string[]>();
  const wrapped = (src: string) => /^\s*\(\s*(\(\)\s*=>|function)/m.test(stripComments(src).replace(/^\s*\/\/.*$/gm, "").trimStart().split("\n")[0] ?? "");
  for (const [f, src] of Object.entries(D.files.js) as [string, string][]) if (!wrapped(src)) for (const m of src.matchAll(/^(?:const|let|var|function)\s+([\w$]+)/gm)) (names.get(m[1]) ?? names.set(m[1], []).get(m[1]))!.push(f);
  for (const [n, fs] of names) if (fs.length > 1) items.push({ msg: `최상위 이름 충돌 ${n}: ${fs.join(", ")}` });
  if (/\bconfirm\(|\balert\(|beforeunload/.test(allJs(D))) items.push({ msg: "confirm·alert·beforeunload" });
  const p = D.ext.probeNav;
  if (!p) items.push({ msg: "probe-nav 실행 안 됨" });
  else if (!p.json?.downOk || !p.json?.upOk) items.push({ msg: `probe-nav 1→34 정지·역행: downOk ${p.json?.downOk} upOk ${p.json?.upOk}` });
  return { items, notes: p?.code ? [`probe-nav 종료 ${p.code}: 스크롤 위치로 장을 재는 geometry 검사(mismatches ${p.json?.geometry?.mismatches?.length ?? "?"})는 발표 무대(한 장씩 겹침) 구조와 맞지 않아 판정에 쓰지 않음 — 걷기(down·up)만 본다`] : [] };
};

// ── 메타·인쇄 ──
J["META-01"] = (D) => {
  const items: Item[] = [];
  const h = D.files.html;
  const get = (attr: string, name: string) => h.match(new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]+content=["']([^"']*)`))?.[1] ?? h.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${name}["']`))?.[1];
  for (const [a, nm] of [["name", "description"], ["property", "og:title"], ["property", "og:description"], ["property", "og:image"], ["property", "og:url"], ["property", "og:type"], ["name", "twitter:card"]]) if (!get(a, nm)) items.push({ msg: `${nm} 없음` });
  const t = get("property", "og:title");
  if (t && (t.length > 30 || /[,:—]/.test(t))) items.push({ msg: `og:title "${t}"` });
  const d = get("property", "og:description");
  if (d && d.length > 90) items.push({ msg: `og:description ${d.length}자(>90)` });
  return { items, notes: ["og:image 1200×630·200 응답은 이미지 파일이 생기면 로컬 경로로 확인"] };
};

J["META-02"] = (D) => {
  const items: Item[] = [];
  const h = D.files.html;
  if (!/<link[^>]+rel=["'](icon|shortcut icon)["']/.test(h)) items.push({ msg: "favicon(link rel=icon) 없음" });
  const title = h.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  if (/[,:—]/.test(title)) items.push({ msg: `<title> "${title}"에 대시·쉼표·콜론` });
  for (const [n, s] of slidesOf(D)) {
    if (s.cover) continue;
    if (/데이터리터러시의이해/.test(s.slideText)) items.push({ n, msg: "표지 밖 과목명 반복" });
  }
  return { items };
};

J["PRT-01"] = (D) => {
  const items: Item[] = [];
  const p = D.ix.print;
  if (!p) return { items: [{ msg: "측정 없음" }] };
  if (p.pages !== D.total) items.push({ msg: `PDF ${p.pages}쪽(≠${D.total})` });
  for (const [n, s] of slidesOf(D)) {
    const t = (p.texts[n - 1] ?? "").replace(/\s/g, "");
    const first = s.headline ? s.headline.html.split(/<br\s*\/?>/)[0].replace(/<[^>]+>/g, "").replace(/\s/g, "").slice(0, 8) : "";
    if (s.headline && !t.includes(first)) items.push({ n, msg: "PDF 쪽에 헤드라인 없음" });
    if (/다시재생/.test(t)) items.push({ n, msg: "PDF에 조작 UI 글자" });
  }
  if (p.printState.dimLines) items.push({ msg: `print 미디어(CSS만)에서 흐린 글줄 ${p.printState.dimLines}` });
  if (p.printState.controls) items.push({ msg: `print 미디어에 버튼 ${p.printState.controls}` });
  const pr = (D.ix.rules?.print ?? []).join("\n");
  if (!/box-shadow:\s*none/.test(pr)) items.push({ msg: "@media print에 box-shadow: none 없음" });
  if (!/filter:\s*none/.test(pr)) items.push({ msg: "@media print에 filter: none 없음" });
  if (p.p7 && p.p7.diff.changed > 0.05) items.push({ n: 7, msg: `PDF 7쪽과 ?slide=7 렌더 차 ${r1(p.p7.diff.changed * 100, 1)}%(>5%)` });
  // 꺾은선 대조: ?slide=n 렌더에서 선 색이 있던 구간 안쪽 점 가운데 PDF 래스터에도 선 색이 있는 비율(선 끝점까지 그려졌는지)
  const lc = p.lineCheck ?? [];
  const lineEvidence: string[] = [];
  for (const pg of lc) {
    const bad = (pg.res ?? []).map((r: any, i: number) => ({ ...r, name: pg.lines[i] })).filter((r: any) => r.inA >= 4 && r.share != null && r.share < 0.9);
    if (bad.length) { items.push({ n: pg.n, msg: `PDF ${pg.n}쪽 꺾은선 ${bad.length}/${pg.res.length}개가 끝까지 안 그려짐: ${bad.slice(0, 4).map((r: any) => `${r.name} ${r.inB}/${r.inA}점(${r1(r.share * 100, 0)}%)`).join(" · ")}` }); lineEvidence.push(pg.shot); }
  }
  if (!lc.length) items.push({ msg: "꺾은선 대조 측정 없음(pdftoppm 또는 렌더 없음)" });
  const ev = uniq([p.p7?.shot, ...lineEvidence].filter(exists));
  return { items, evidence: ev, measured: { lineCheck: lc.map((pg: any) => ({ n: pg.n, lines: (pg.res ?? []).map((r: any, i: number) => ({ line: pg.lines[i], inA: r.inA, inB: r.inB, share: r.share })) })) }, notes: ["꺾은선 판정: 선 구간 안쪽 점(꼭짓점에서 10px 넘게 떨어진 곳, 24px 간격)마다 5×5 창 안에 선 색(RGB 거리 <48)이 있는지 렌더와 PDF 래스터(pdftoppm 1920×1080)에서 보고, 렌더에 있던 점의 90% 미만이 PDF에 있으면 실패"], implemented: "auto+manual", manual: ev };
};

J["PRT-02"] = (D) => {
  const items: Item[] = [];
  const t = D.ix.thumbs;
  if (!t) return { items: [{ msg: "개요 썸네일을 찍지 못함" }] };
  for (const x of t) if (x.ssim < 0.98) items.push({ n: x.n, msg: `개요 썸네일 SSIM ${x.ssim}(<0.98)` });
  return { items, measured: Object.fromEntries(t.map((x: any) => [x.n, x.ssim])), notes: ["썸네일과 ?slide=n 렌더를 둘 다 폭 240px로 줄이고 가우스 흐림 1px을 준 뒤 SSIM(8px 창)을 잰다 — 글자 래스터화 차이는 지우고 배치 차이만 본다(다른 장끼리는 0.6~0.7)"] };
};

// ── 표준 ──
J["STD-01"] = (D) => {
  const items: Item[] = [];
  const std = stdText(D);
  for (const k of ["THESIS", "OWN-WORLD", "STORY", "FIRST VIEW", "FORM"]) if (!new RegExp(`${k}:`).test(std)) items.push({ msg: `다섯 줄 계약 ${k} 없음` });
  const roleRows = std.split("\n").filter((l) => /^\|\s*\d{1,2}\s*\|/.test(l)).length;
  if (roleRows < D.total) items.push({ msg: `34장 역할 표 행 ${roleRows}(<${D.total})` });
  if (!/인디고[\s\S]{0,200}(의미|용도)|(의미|용도)[\s\S]{0,400}인디고/.test(D.files.std["color.md"] ?? "")) items.push({ msg: "색 의미 표 없음" });
  if ((std.match(/\d+(\.\d+)?\s*:\s*1/g) ?? []).length < 5) items.push({ msg: "대비표 없음(x:1 값 5개 미만)" });
  if (!/역할[\s\S]{0,80}컴포넌트|컴포넌트[\s\S]{0,80}역할/.test(std)) items.push({ msg: "역할→컴포넌트 매핑 없음" });
  if (!/용어집/.test(std)) items.push({ msg: "용어집 없음" });
  if (!/##+\s*모션/.test(std)) items.push({ msg: "모션 목록 없음" });
  if (!/어두운 장/.test(std) || !/예외/.test(std)) items.push({ msg: "어두운 장·예외 표시 목록 없음" });
  if (!/상충/.test(std)) items.push({ msg: "상충 해소 기록 없음" });
  const tokHex = new Set(Object.values(tokens(D).colors).map((c: any) => hex(c)));
  for (const m of new Set((D.files.std["color.md"] ?? "").match(/#[0-9a-f]{6}\b/gi) ?? [])) if (!tokHex.has(m.toLowerCase()) && !/2448e8|d4f57a/i.test(m)) items.push({ msg: `color.md ${m}가 tokens.css에 없음` });
  const presetSizes = new Set(tokens(D).presets.map((p: any) => p.size));
  for (const m of new Set(((D.files.std["typography.md"] ?? "").match(/\b(\d{2})px\b/g) ?? []).map((x) => parseInt(x)))) if (m >= 12 && m <= 120 && !presetSizes.has(m)) items.push({ msg: `typography.md ${m}px가 프리셋에 없음` });
  const markers = (allCss(D) + D.files.html).match(/token-ok|constitution-ok|taste-skill-ignore|data-type-ok/g) ?? [];
  if (markers.length && !/token-ok/.test(std)) items.push({ msg: `예외 표시 ${markers.length}건(token-ok 등)이 design-standard에 기록되지 않음` });
  const T = (src: string) => (src.match(/const TERTIARY = "([^"]+)"/)?.[1] ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  const extra = T(D.files.js["fit.js"] ?? "").filter((x) => !T(D.files.deckFit ?? "").includes(x));
  const unrec = extra.filter((x) => !std.includes(x));
  if (unrec.length) items.push({ msg: `fit.js TERTIARY 확장 ${unrec.length}개가 design-standard에 기록 없음: ${unrec.slice(0, 5).join(", ")}` });
  return { items, implemented: "auto+manual", manual: Object.keys(D.files.std).map((f) => `design-standard/${f}`) };
};

J["STD-02"] = (D) => {
  const items: Item[] = [];
  const c = D.ext.constitution, t = D.ext.tokenCheck;
  if (!c) items.push({ msg: "헌법 감사 실행 안 됨" }); else if (c.code !== 0) items.push({ msg: `헌법 감사 종료 ${c.code}: ${c.out.split("\n")[0]}` });
  if (!t) items.push({ msg: "token-check 실행 안 됨" }); else if (t.code !== 0) items.push({ msg: `token-check --strict 종료 ${t.code}: ${t.out.split("\n").slice(-1)[0]}` });
  return { items, measured: { constitution: c?.out.split("\n")[0], constitutionCode: c?.code, tokenCheck: t?.out.split("\n").slice(-1)[0], tokenCheckCode: t?.code } };
};

J["STD-03"] = (D) => {
  const items: Item[] = [];
  // 의미 변형 클래스: 스타일시트에 '.역할.변형' 복합 선택자로 따로 정의된 클래스(.tag.est 추정 라벨 등)는 별개 역할로 본다
  const css = stripComments(allCss(D));
  const variantsOf = (role: string) => new Set([...css.matchAll(new RegExp(`(?<![\\w-])\\${role}\\.([\\w-]+)`, "g"))].map((m) => m[1]));
  const VAR = new Map<string, Set<string>>();
  const roleKey = (r: any) => {
    const v = VAR.get(r.role) ?? VAR.set(r.role, variantsOf(r.role)).get(r.role)!;
    const mine = String(r.cls ?? "").split(/\s+/).filter((c: string) => v.has(c)).sort();
    return r.role + mine.map((c: string) => "." + c).join("");
  };
  const combos = new Map<string, Map<string, number[]>>();
  for (const [n, s] of slidesOf(D)) for (const r of s.roles) { const k = `${roleKey(r)} @${r.surface}`; const m = combos.get(k) ?? combos.set(k, new Map()).get(k)!; (m.get(r.combo) ?? m.set(r.combo, []).get(r.combo))!.push(n); }
  for (const [k, m] of combos) if (m.size > 1) {
    // 다수 조합과 다른 장 전부를 실패 장으로 둔다
    const entries = [...m.entries()].sort((a, b) => uniq(b[1]).length - uniq(a[1]).length);
    for (const [c, ns] of entries.slice(1)) for (const n of uniq(ns)) items.push({ n, msg: `${k} 계산 스타일 ${m.size}종 — 이 장 [${c}] ≠ 다수 [${entries[0][0]}](장 ${uniq(entries[0][1]).slice(0, 4).join(",")})` });
  }
  // 같은 역할을 다른 마크업으로: (1) 주장 라벨 어휘(.tag 글자)와 같은 글이 .tag 밖 ' · ' 메타 줄 조각으로 나옴
  // (2) ' · ' 메타 줄의 한 조각을 통째로 감싼 굵은·다른 색 인라인 글자(b·strong·span) — 알약 대신 글자로 쓴 라벨
  // (3) .tag 안에 주장 라벨이 아닌 표본 수(n=…)
  const vocab = new Set<string>();
  for (const [, s] of slidesOf(D)) for (const r of s.roles) if (r.role === ".tag") for (const w of String(r.text ?? "").split(/\s*·\s*/)) if (w && !/^n\s*=/.test(w)) vocab.add(w.trim());
  const SKIPCTX = ["headline", "kicker", "tag", "sowe", "legend", "chart", "chart-title", "chart-src", "source", "foot", "pg", "credit", "num"];
  for (const [n, s] of slidesOf(D)) {
    for (const t of s.texts) {
      if (t.inSvg || t.ctx.some((c: string) => SKIPCTX.includes(c))) continue;
      const segs = (t.own ?? "").split(/\s*·\s*/).map((x: string) => x.trim()).filter(Boolean);
      if ((t.own ?? "").includes("·")) for (const w of segs) if (vocab.has(w)) items.push({ n, msg: `주장 라벨 '${w}'를 .tag 대신 일반 글자로 씀: ${t.label}` });
      if (t.pfull && /·/.test(t.pfull) && ["b", "strong", "em", "span", "i"].includes(t.tag)) {
        const psegs = t.pfull.split(/\s*·\s*/).map((x: string) => x.trim());
        const styled = t.color !== t.pcolor || (t.fw >= 600 && t.fw > (t.pfw ?? 400));
        if (styled && psegs.includes(t.own.trim()) && t.own.trim().length <= 8) items.push({ n, msg: `메타 줄 라벨 '${t.own.trim()}'를 .tag 대신 ${t.tag}(${t.fw} · ${t.color})로 씀: ${t.label}` });
      }
    }
    for (const r of s.roles) if (r.role === ".tag" && /^n\s*=/.test(String(r.text ?? ""))) items.push({ n, msg: `.tag에 주장 라벨이 아닌 표본 수 '${r.text}'` });
    // 의미 변형이 바탕 규칙에 덮여 화면에서 사라짐(변형 클래스를 떼어도 계산 스타일이 같음)
    for (const r of s.roles) for (const c of r.variantLost ?? []) items.push({ n, msg: `${r.role}.${c} '${r.text}'가 @${r.surface} 바탕 규칙에 덮여 ${r.role}와 같은 모양(변형 뜻이 사라짐)` });
  }
  const inl = [...D.files.html.matchAll(/style="([^"]*)"/g)].map((m) => m[1]).filter((s) => /(font|color|background)/.test(s));
  if (inl.length) items.push({ msg: `인라인 style font·color·background ${inl.length}: ${inl.slice(0, 3).join(" | ")}` });
  return { items, measured: { roleVariants: Object.fromEntries([...VAR].map(([k, v]) => [k, [...v]])), claimVocab: [...vocab] }, notes: ["'반쪽 전환' 비교는 --compare로 이전 보고서가 있을 때 회귀로 드러난다", "스타일시트에 '.역할.변형'으로 따로 정의된 변형 클래스(예: .tag.est)는 별개 역할로 묶는다"] };
};

J["STD-04"] = (D) => {
  const items: Item[] = [];
  if (D.total < 34) items.push({ msg: `장 수 ${D.total}(<34)` });
  const now = slidesOf(D).map(([, s]) => s.headline?.text ?? "");
  const prev = D.prev?.results?.find((r: any) => r.id === "STD-04")?.measured?.headlines as string[] | undefined;
  if (prev) { let j = 0; for (const h of prev) { const k = now.indexOf(h, j); if (h && k < 0) items.push({ msg: `기준 헤드라인 사라짐·순서 바뀜: "${h.slice(0, 30)}"` }); else if (k >= 0) j = k + 1; } }
  return { items, measured: { headlines: now } };
};

J["STD-07"] = (D) => {
  const items: Item[] = [];
  const rd = D.files.readme;
  const sec = rd.split(/^## /m).find((x: string) => /^검증/.test(x)) ?? "";
  const rows = sec.split("\n").filter((l: string) => /^\|/.test(l) && !/^\|\s*-/.test(l)).slice(1);
  const noLog = rows.filter((r: string) => !/qa\/|\.log|\.json|reports\//.test(r));
  if (noLog.length) items.push({ msg: `README 검증 표 ${noLog.length}/${rows.length}행에 실행 로그(qa/ 경로) 없음` });
  if (!/실기기/.test(rd)) items.push({ msg: "README에 에뮬레이션·실기기 구분 없음" });
  if (D.ix.public) { if (D.ix.public.slides !== D.total) items.push({ msg: `공개 URL .slide ${D.ix.public.slides}` }); if (D.ix.public.emptySvg) items.push({ msg: `공개 URL 빈 svg ${D.ix.public.emptySvg}` }); if (!D.ix.public.pretendard) items.push({ msg: "공개 URL 글꼴 미적용" }); }
  else items.push({ msg: "공개 URL 확인 기록 없음(--public=URL로 실행)" });
  return { items, implemented: "auto+manual", manual: ["README.md 검증 절"] };
};

// visual 조건 가운데 일부를 잴 수 있는 것: CON-05 라벨 알약 경계(강제 색 모드)
J["CON-05"] = (D) => {
  const items: Item[] = [];
  const fb = D.ix.forcedBounds ?? [];
  if (!fb.length) return { items: [], implemented: "manual", manual: D.ix.forced ?? [], notes: ["강제 색 모드 측정 없음"] };
  for (const { n, items: els } of fb) {
    const pills = els.filter((e: any) => String(e.label).split(" ")[0].split(".").slice(1).some((c: string) => ["tag", "kicker", "pill"].includes(c)));
    const lost = pills.filter((e: any) => !e.border && !e.outline);
    if (lost.length) items.push({ n, msg: `forced-colors에서 라벨 알약 ${lost.length}/${pills.length}개 경계 없음(테두리·외곽선 0, 바탕·그림자는 지워짐): ${uniq(lost.map((e: any) => String(e.label).split(" ")[0])).slice(0, 4).join(", ")}` });
  }
  return { items, implemented: "auto+manual", manual: D.ix.forced ?? [], measured: { slides: fb.map((x: any) => x.n) }, notes: ["강제 색 모드(Emulation forced-colors: active)에서 라벨 알약(.tag·.kicker·.pill)에 1px 이상 테두리나 외곽선이 남는지 계산 스타일로 본다. 차트 계열 구분은 캡처를 사람이 본다"] };
};

// ── 수동 조건(visual) 묶음 ──
const MANUAL_BUNDLE: Record<string, (D: Data) => string[]> = {
  "CON-05": (D) => D.ix.forced ?? [],
  "TXT-11": () => ["contact"],
  "IMG-07": (D) => slidesOf(D).filter(([, s]) => s.images.length).map(([n]) => shotOf(D, n)),
  "STD-05": () => ["compare", "contact"],
  "STD-06": () => ["contact"],
};

export function judgeAll(D: Data, criteria: any[]): Result[] {
  tokCache = null;
  const out: Result[] = [];
  const expand = (list: string[] | undefined) => (list ?? []).flatMap((x) => (x === "contact" ? (Array.isArray(D.ix.contact) ? D.ix.contact : []) : x === "compare" ? (Array.isArray(D.ix.compareSheet) ? D.ix.compareSheet : []) : [x]));
  for (const c of criteria) {
    const base = { id: c.id, area: c.area, method: c.verify_method } as Result;
    if (!J[c.id]) {
      out.push({ ...base, implemented: "manual", status: "manual", summary: c.criterion, items: [], failedSlides: [], manual: { procedure: c.verify_procedure, bundle: expand(MANUAL_BUNDLE[c.id]?.(D) ?? ["contact"]) } });
      continue;
    }
    try {
      const r = J[c.id](D);
      const exc = D.exceptions?.[c.id];
      let items = r.items;
      let excepted: Item[] = [];
      if (exc?.slides?.length) { excepted = items.filter((i) => i.n != null && exc.slides.includes(i.n)).map((i) => ({ ...i, msg: `${i.msg} — 예외로 넘김(${exc.reason ?? "qa/exceptions.json"})` })); items = items.filter((i) => !(i.n != null && exc.slides.includes(i.n))); }
      const impl = r.implemented === "manual" ? "manual" : c.verify_method === "both" && r.implemented !== "partial" ? "auto+manual" : r.implemented ?? "auto";
      const status = impl === "manual" ? "manual" : items.length ? "fail" : "pass";
      const failedSlides = uniq(items.map((i) => i.n).filter((n): n is number => typeof n === "number")).sort((a, b) => a - b);
      // both 조건은 자동 부분이 통과해도 사람 확인이 끝나야 통과다. 'pass'로 두되 수동 확인이 남았다고 표시한다
      const pendingManual = status === "pass" && (impl === "auto+manual" || c.verify_method === "both") ? true : undefined;
      out.push({
        ...base, implemented: impl, status, summary: c.criterion, items, failedSlides, excepted: excepted.length ? excepted : undefined, pendingManual, measured: r.measured, notes: r.notes,
        evidence: [...(r.evidence ?? []), ...failedSlides.slice(0, 6).map((n) => shotOf(D, n))].filter(exists),
        manual: impl === "auto+manual" || impl === "manual" || c.verify_method === "both" ? { procedure: c.verify_procedure, bundle: expand(r.manual ?? ["contact"]) } : undefined,
      });
    } catch (e: any) {
      out.push({ ...base, implemented: "auto", status: "error", summary: c.criterion, items: [{ msg: `판정 오류: ${e?.message ?? e}`.slice(0, 300) }], failedSlides: [] });
    }
  }
  return out;
}

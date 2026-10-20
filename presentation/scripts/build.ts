// 덱 빌드: src/shell.html + src/slides/NN.html(+ NN.css) + ../chart-data.json + src/ds/icons.svg → index.html, src/slides.bundle.css
//   bun scripts/build.ts            # 만들고 검사 요약을 JSON으로 보인다(문제가 있으면 종료 코드 1, 그래도 파일은 쓴다)
// 함께 검사하는 것(표준 문서가 정본, 여기는 대조만):
//   - 절 표시: 장마다 머리의 .section-tag 이름 · 색상이 design-standard/color.md 「절 색」 표(<!-- chapters --> 사이)와 같은지
//   - 차트 계열 색: chart-data의 계열(key) · 색이 color.md 「차트 계열 색」 표(<!-- series --> 사이)와 같은지
//   - 아이콘: 장 HTML과 present.js(ICONS)가 쓰는 이름이 시스템 스프라이트에 있는지
//   - 옛 이름: 지운 클래스 · 속성(box-* · step · panel · table--ruled · data-fill)이 장에 남아 있지 않은지(오류),
//     장 안 모션을 없애 아무 일도 하지 않는 옛 표시 data-step · data-build가 남았는지(경고 — 3회차 SC-14 · L-03)
// 여러 사람이 동시에 돌려도 깨지지 않게 결과는 고유한 임시 파일(pid + 난수)에 쓴 뒤 rename한다(같은 폴더 안 rename은 원자적).
// 장 하나가 망가져도 다른 장 작업이 막히지 않게, 읽지 못한 장은 오류 장으로 바꿔 넣고 계속한다.
import { readdirSync, renameSync, writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

const root = join(import.meta.dir, "..");
const src = join(root, "src");
const slideDir = join(src, "slides");
const errors: string[] = [];
const warnings: string[] = [];

const atomicWrite = (path: string, text: string) => {
  const tmp = `${path}.${process.pid}-${randomBytes(4).toString("hex")}.tmp`;
  writeFileSync(tmp, text);
  try {
    renameSync(tmp, path);
  } catch (e) {
    try { unlinkSync(tmp); } catch { /* 이미 없음 */ }
    throw e;
  }
};

const files = readdirSync(slideDir);
const htmlFiles = files.filter((f) => /^\d{2}\.html$/.test(f)).sort();
const stray = files.filter((f) => !/^\d{2}\.(html|css)$/.test(f) && !f.startsWith("."));
if (stray.length) warnings.push(`src/slides/에 규칙 밖 파일: ${stray.join(", ")} (NN.html · NN.css만 모은다)`);
const total = htmlFiles.length;
htmlFiles.forEach((f, i) => { if (Number(f.slice(0, 2)) !== i + 1) errors.push(`장 번호가 이어지지 않음: ${f}는 ${i + 1}번째 파일`); });

const escapeHtml = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);
const errorSlide = (nn: string, n: number, msg: string) =>
  `<section class="slide s${nn}" data-n="${n}" data-build-error><div class="head"><h2 class="headline">${nn}장을 읽지 못했어요</h2><p class="lead">${escapeHtml(msg)}</p></div><div class="body"></div><footer class="foot"><p class="source">src/slides/${nn}.html</p><p class="where"><span class="pg">${n} / ${total}</span></p></footer></section>`;

const slides: string[] = [];
for (const [i, f] of htmlFiles.entries()) {
  const nn = f.slice(0, 2);
  const n = i + 1;
  let html = (await Bun.file(join(slideDir, f)).text()).trim();
  // 장 파일 = <section class="slide sNN">…</section> 하나(앞뒤 주석은 허용)
  const body = html.replace(/<!--[\s\S]*?-->/g, "").trim();
  const head = body.match(/^<section\b([^>]*)>/);
  // 맨 바깥 section이 파일 끝에서 닫히는지(안쪽 section — 예: 시스템 GroupBox — 은 허용)
  let depth = 0, closedAt = -1;
  for (const m of body.matchAll(/<(\/?)section\b[^>]*>/g)) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) { closedAt = m.index! + m[0].length; break; }
  }
  if (!head || closedAt !== body.length) {
    const msg = `src/slides/${f}: 맨 바깥이 <section class="slide s${nn}"> 하나여야 해요(파일 끝에서 닫히지 않음)`;
    errors.push(msg);
    slides.push(errorSlide(nn, n, msg));
    continue;
  }
  const cls = head[1].match(/\bclass="([^"]*)"/)?.[1].split(/\s+/) ?? [];
  if (!cls.includes("slide") || !cls.includes(`s${nn}`)) errors.push(`src/slides/${f}: section class에 "slide"와 "s${nn}"가 있어야 해요(지금 "${cls.join(" ")}")`);
  if (/\bdata-n=/.test(head[1])) warnings.push(`src/slides/${f}: data-n은 빌드가 단다(지운 뒤 다시 빌드)`);
  html = html.replace(/<section\b/, `<section data-n="${n}"`);
  // 쪽 번호: 빈 <span class="pg"></span>를 채운다
  if (!/<span class="pg">\s*<\/span>/.test(html)) errors.push(`src/slides/${f}: 꼬리말에 빈 <span class="pg"></span>가 없어요`);
  html = html.replace(/<span class="pg">\s*<\/span>/, `<span class="pg">${n} / ${total}</span>`);
  if (!/<footer class="foot"/.test(html)) errors.push(`src/slides/${f}: <footer class="foot">가 없어요`);
  slides.push(`<!-- ${nn} -->\n${html}`);
}

// 장 CSS: 선택자는 모두 .sNN으로 시작해야 한다(다른 장을 건드리지 않게). @keyframes 이름은 sNN-로 시작
// 선택자 목록은 괄호 밖 쉼표에서만 나눈다(:is(a, b) · :not(a, b) · :has(a, b) 안의 쉼표는 한 선택자의 일부다)
const splitSelectors = (sel: string) => {
  const parts: string[] = [];
  let depth = 0, start = 0;
  for (let i = 0; i < sel.length; i++) {
    const ch = sel[i];
    if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth = Math.max(0, depth - 1);
    else if (ch === "," && depth === 0) { parts.push(sel.slice(start, i)); start = i + 1; }
  }
  parts.push(sel.slice(start));
  return parts.map((s) => s.trim()).filter(Boolean);
};
const cssParts: string[] = [];
for (const f of files.filter((x) => /^\d{2}\.css$/.test(x)).sort()) {
  const nn = f.slice(0, 2);
  const css = await Bun.file(join(slideDir, f)).text();
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const m of clean.matchAll(/(^|[{};])\s*([^{};@][^{};]*?)\s*\{/g)) {
    const sel = m[2].trim();
    if (/^(from|to|\d+%)(\s*,\s*(from|to|\d+%))*$/.test(sel)) continue; // @keyframes 단계
    for (const part of splitSelectors(sel)) {
      if (!new RegExp(`^\\.s${nn}(?![\\w-])`).test(part)) errors.push(`src/slides/${f}: 선택자 "${part}"가 .s${nn}으로 시작하지 않아요`);
    }
  }
  for (const m of clean.matchAll(/@keyframes\s+([\w-]+)/g)) if (!m[1].startsWith(`s${nn}-`)) errors.push(`src/slides/${f}: @keyframes ${m[1]} 이름이 s${nn}-로 시작하지 않아요`);
  if (!htmlFiles.includes(`${nn}.html`)) warnings.push(`src/slides/${f}: 짝인 ${nn}.html이 없어요`);
  cssParts.push(`/* ── ${nn} (src/slides/${f}) ── */\n${css.trim()}\n`);
}
const bundle = `/* 생성 파일 — bun scripts/build.ts가 src/slides/NN.css를 차례대로 묶는다. 고치지 말고 src/slides/NN.css를 고친다. */\n\n${cssParts.join("\n")}`;

// 아이콘 스프라이트: 시스템 icons.svg의 <symbol>을 문서 맨 앞 크기 0 svg에 넣는다(DESIGN.md 「불러오는 법」)
const spriteSrc = await Bun.file(join(src, "ds", "icons.svg")).text();
const symbols = spriteSrc.match(/<symbol[\s\S]*?<\/symbol>/g) ?? [];
const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><!-- Lucide 1.50.0 (ISC, src/ds/icons-LICENSE.txt) · 제품 디자인 시스템 스프라이트 -->\n${symbols.join("\n")}\n</svg>`;
const iconIds = new Set(symbols.map((s) => s.match(/id="([^"]+)"/)?.[1]));

// 차트 데이터
const dataRaw = await Bun.file(join(root, "..", "chart-data.json")).text();
const data = JSON.parse(dataRaw);
const embedded = JSON.stringify(data).replace(/<\//g, "<\\/");

const allSlides = slides.join("\n\n");

// 표준 문서의 표 읽기: <!-- name:start --> … <!-- name:end --> 사이 표의 본문 행(머리 · 구분 행 제외)을 칸 배열로
const colorDoc = await Bun.file(join(root, "design-standard", "color.md")).text();
const docRows = (name: string) => {
  const m = colorDoc.match(new RegExp(`<!-- ${name}:start -->([\\s\\S]*?)<!-- ${name}:end -->`));
  if (!m) { errors.push(`design-standard/color.md에 <!-- ${name}:start --> 표가 없어요`); return [] as string[][]; }
  return m[1].split("\n").filter((l) => /^\|/.test(l.trim())).map((l) => l.trim().slice(1, -1).split("|").map((c) => c.trim().replace(/`/g, ""))).slice(2);
};

// 절 표시 대조: 표 = | 절 이름 | 장(a~b) | 색상 | …
const chapters = docRows("chapters").map(([name, span, hue]) => { const [a, b] = span.split(/[~–-]/).map(Number); return { name, a, b: b || a, hue }; });
const chapterOf = (n: number) => chapters.find((c) => n >= c.a && n <= c.b);
slides.forEach((html, i) => {
  const n = i + 1;
  const tag = html.match(/<p class="tag section-tag" data-hue="([\w-]+)">([^<]*)<\/p>/);
  const want = chapterOf(n);
  if (!want) { if (tag) errors.push(`${n}장: 절 표에 없는 장인데 절 표시가 있어요`); return; }
  if (!tag) errors.push(`${n}장: 머리에 절 표시가 없어요 — <p class="tag section-tag" data-hue="${want.hue}">${want.name}</p>`);
  else if (tag[1] !== want.hue || tag[2] !== want.name) errors.push(`${n}장: 절 표시 「${tag[2]}」 ${tag[1]} ≠ 표 「${want.name}」 ${want.hue}`);
});

// 옛 이름: 지운 클래스 · 속성
const LEGACY_CLASS = new Set(["box-row", "box-cols", "box-cell", "stat", "step", "step__no", "panel", "table--ruled"]);
slides.forEach((html, i) => {
  const code = html.replace(/<!--[\s\S]*?-->/g, "");
  const found = new Set<string>();
  for (const m of code.matchAll(/\sclass="([^"]*)"/g)) for (const c of m[1].split(/\s+/)) if (LEGACY_CLASS.has(c)) found.add(c);
  if (/\sdata-fill\b/.test(code)) found.add("data-fill");
  if (/data-justify="between"/.test(code)) found.add('data-justify="between"');
  for (const x of found) errors.push(`${i + 1}장: 지운 이름 ${x} — design-standard/components.md 「옛 이름」`);
  const motionMarks = (code.match(/\sdata-(?:step|build)(?![\w-])/g) ?? []).length;
  if (motionMarks) warnings.push(`${i + 1}장: 옛 모션 표시 data-step · data-build ${motionMarks}개 — 장 안 모션을 없애 아무 일도 하지 않아요(지운다)`);
});

const keys = Object.keys(data).filter((k) => !k.startsWith("_"));
const used = [...allSlides.matchAll(/data-(?:chart|block)="([^"]+)"/g)].map((m) => m[1]);
const missing = used.filter((k) => !keys.includes(k));
if (missing.length) errors.push(`chart-data.json에 없는 데이터: ${[...new Set(missing)].join(", ")}`);
const presentJs = await Bun.file(join(src, "present.js")).text();
const presentIcons = (presentJs.match(/const ICONS = \[([^\]]*)\]/)?.[1].match(/"([\w-]+)"/g) ?? []).map((x) => `icon-${x.slice(1, -1)}`);
if (!presentIcons.length) errors.push("src/present.js에서 ICONS 목록을 읽지 못했어요");
const iconsUsed = [...[...allSlides.matchAll(/href="#(icon-[\w-]+)"/g)].map((m) => m[1]), ...presentIcons];
const iconMissing = iconsUsed.filter((id) => !iconIds.has(id));
if (iconMissing.length) errors.push(`시스템 스프라이트에 없는 아이콘: ${[...new Set(iconMissing)].join(", ")}`);

// 차트 계열 색 대조: 표 = | 대상(계열 이름 앞부분) | 색 키 | …
const SERIES_KEYS = new Set(["main", "alt", "ctx"]);
const seriesRules = docRows("series").map(([who, key]) => ({ who, key }));
const walk = (o: unknown, path: string) => {
  if (Array.isArray(o)) o.forEach((v, i) => walk(v, `${path}[${i}]`));
  else if (o && typeof o === "object") {
    const r = o as Record<string, unknown>;
    if (typeof r["색"] === "string") {
      const c = r["색"] as string, name = String(r.key ?? "");
      if (!SERIES_KEYS.has(c)) errors.push(`chart-data ${path}: 색 「${c}」은 main · alt · ctx가 아니에요`);
      const rule = seriesRules.find((x) => name.startsWith(x.who));
      if (rule && rule.key !== c) errors.push(`chart-data ${path}: 「${name}」은 계열 색 표에서 ${rule.key}인데 ${c}예요`);
      if (!rule && name) warnings.push(`chart-data ${path}: 「${name}」이 계열 색 표에 없어요(색 ${c})`);
    }
    for (const [k, v] of Object.entries(r)) walk(v, `${path}.${k}`);
  }
};
walk(data, "");

const shell = await Bun.file(join(src, "shell.html")).text();
const note = "<!-- 생성 파일 — bun scripts/build.ts가 src/shell.html + src/slides/NN.html + ../chart-data.json + src/ds/icons.svg로 만든다. 이 파일을 고치지 말고 src/를 고친 뒤 다시 빌드한다. -->";
for (const marker of ["<!-- @generated-note -->", "<!-- @sprite -->", "<!-- @slides -->", "<!-- @chart-data -->"]) if (!shell.includes(marker)) errors.push(`src/shell.html에 ${marker}가 없어요`);
// replace의 특수 패턴($&, $1 등)이 데이터 안 '$'와 섞이지 않게 함수로 넣는다
const out = shell
  .replace("<!-- @generated-note -->", () => note)
  .replace("<!-- @sprite -->", () => sprite)
  .replace("<!-- @slides -->", () => allSlides)
  .replace("<!-- @chart-data -->", () => embedded);

atomicWrite(join(src, "slides.bundle.css"), bundle);
atomicWrite(join(root, "index.html"), out);

console.log(JSON.stringify({
  slides: total,
  slideCss: cssParts.length,
  datasets: keys.length,
  chartsInDeck: used.length,
  icons: { inSprite: iconIds.size, used: [...new Set(iconsUsed)] },
  dataSha256: new Bun.CryptoHasher("sha256").update(embedded).digest("hex").slice(0, 16),
  errors,
  warnings,
}, null, 1));
if (errors.length) process.exit(1);

// 시각 QA 검사기 — qa/violations.json의 이상 상태 조건(criteria)을 조건 id 그대로 판정한다.
//
//   bun scripts/visual-qa.ts [--label baseline] [--only=LAY-01,TYP-03] [--slides=1-34] [--compare=baseline] [--net] [--public=URL]
//
// 측정: ?check·?slide=n 렌더(1920×1080)와 발표 무대(CDP Emulation으로 여러 뷰포트·터치)에서 DOM·계산 스타일·상자를 재고,
// 픽셀이 필요한 것은 스크린샷을 scripts/qa_pixels.py(PIL)로 잰다. 상호작용 조건은 CDP Input으로 실제로 누르고 민다.
// 헌법 감사·token-check·check-numbers·render.ts(fit 보고)·probe-nav도 함께 돌린다.
// 출력: qa/reports/<label>.json · <label>.md, 스크린샷 qa/shots/<label>/(jpg). 실패가 하나라도 있으면 종료 코드 1.
// 파이썬은 QA_PY 환경변수(없으면 python3)로 바꾼다. PIL과 numpy가 있어야 한다.
import { existsSync, readdirSync, statSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { homedir } from "node:os";
import { join, relative } from "node:path";
import { judgeAll, type Data, type Result } from "./vqa/judge.ts";

const root = join(import.meta.dir, "..");
const repo = join(root, "..");
const qaDir = join(repo, "qa");
const argv = Bun.argv.slice(2);
const opt = (name: string) => {
  const i = argv.findIndex((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (i < 0) return undefined;
  const a = argv[i];
  return a.includes("=") ? a.slice(a.indexOf("=") + 1) : argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : "true";
};
const label = opt("label") ?? new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
const only = opt("only") ? new Set(opt("only")!.split(",").map((s) => s.trim())) : null;
const slideRange = (() => {
  const s = opt("slides");
  if (!s) return null;
  const [a, b] = s.split("-").map(Number);
  return [a, b ?? a] as [number, number];
})();
const compareLabel = opt("compare");
const useNet = opt("net") === "true";
const publicUrl = opt("public");

// 파이썬: QA_PY → python3 차례로, PIL·numpy를 불러올 수 있는 첫 번째를 쓴다
const PY = (() => {
  for (const c of [process.env.QA_PY, "python3", "python"].filter(Boolean) as string[]) {
    const r = Bun.spawnSync([c, "-c", "import PIL, numpy"], { stdout: "ignore", stderr: "ignore" });
    if (r.exitCode === 0) return c;
  }
  console.error("[visual-qa] PIL·numpy가 있는 파이썬을 찾지 못했다. QA_PY=<파이썬 경로>로 지정한다");
  process.exit(2);
})();
const shotsDir = join(qaDir, "shots", label);
const tmpDir = join(root, "renders", "vqa", label);
const reportsDir = join(qaDir, "reports");
const SKILL = process.env.QA_DECK_SKILL || join(homedir(), ".agents/skills/designing-decks-and-motion/scripts");
const findUp = (rel: string) => {
  for (let d = repo; d !== "/"; d = join(d, "..")) if (existsSync(join(d, rel))) return join(d, rel);
  return existsSync(join(homedir(), rel)) ? join(homedir(), rel) : null;
};
const TASTE = process.env.QA_TASTE_SCRIPTS || findUp(".agents/skills/design-taste-frontend/scripts");

const criteriaAll: any[] = JSON.parse(await Bun.file(join(qaDir, "violations.json")).text()).criteria;
const violations: any[] = JSON.parse(await Bun.file(join(qaDir, "violations.json")).text()).violations;
const criteria = criteriaAll.filter((c) => !only || only.has(c.id));
const want = (...ids: string[]) => ids.some((id) => criteria.some((c) => c.id === id || (id.endsWith("*") && c.id.startsWith(id.slice(0, -1)))));
const log = (...a: unknown[]) => console.error("[visual-qa]", ...a);
const t0 = Date.now();

await rm(shotsDir, { recursive: true, force: true });
await mkdir(shotsDir, { recursive: true });
await mkdir(tmpDir, { recursive: true });
await mkdir(reportsDir, { recursive: true });
const shotRel = (p: string) => relative(qaDir, p);

// ── 정적 파일 ──────────────────────────
const read = async (p: string) => ((await Bun.file(p).exists()) ? Bun.file(p).text() : "");
const files = {
  html: await read(join(root, "index.html")),
  tokens: await read(join(root, "src/tokens.css")),
  deck: await read(join(root, "src/deck.css")),
  slides: await read(join(root, "src/slides.css")),
  extraCss: Object.fromEntries(await Promise.all(readdirSync(join(root, "src")).filter((f) => f.endsWith(".css") && !["tokens.css", "deck.css", "slides.css"].includes(f)).map(async (f) => [f, await read(join(root, "src", f))]))),
  js: Object.fromEntries(await Promise.all(readdirSync(join(root, "src")).filter((f) => f.endsWith(".js")).map(async (f) => [f, await read(join(root, "src", f))]))),
  std: Object.fromEntries(await Promise.all(readdirSync(join(root, "design-standard")).filter((f) => f.endsWith(".md")).map(async (f) => [f, await read(join(root, "design-standard", f))]))),
  manifest: await read(join(root, "assets/img/MANIFEST.md")),
  readme: await read(join(repo, "README.md")),
  chartData: await read(join(repo, "chart-data.json")),
  deckFit: await read(join(SKILL, "deck-fit.js")),
  imgFiles: readdirSync(join(root, "assets/img")).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f)).map((f) => ({ name: f, bytes: statSync(join(root, "assets/img", f)).size })),
  photoFiles: existsSync(join(root, "assets/photos")) ? readdirSync(join(root, "assets/photos")).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).map((f) => ({ name: f, bytes: statSync(join(root, "assets/photos", f)).size })) : [],
  fontFiles: readdirSync(join(root, "assets/fonts")).filter((f) => /\.woff2?$/.test(f)).map((f) => ({ name: f, bytes: statSync(join(root, "assets/fonts", f)).size })),
  mainHtml: "",
  vendorDiff: "",
};
const run = async (cmd: string[], cwd = root, timeoutMs = 300000) => {
  const p = Bun.spawn(cmd, { cwd, stdout: "pipe", stderr: "pipe", env: process.env });
  const timer = setTimeout(() => p.kill(), timeoutMs);
  const [out, err] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text()]);
  const code = await p.exited;
  clearTimeout(timer);
  return { cmd: cmd.join(" "), code, out: out.trim(), err: err.trim().slice(-4000) };
};
// macOS Vision OCR(scripts/ocr_vision.swift). 처음 부를 때 한 번 컴파일하고, 안 되면 null(그 조건은 수동으로 남는다)
let ocrCached: string[] | null | undefined;
let ocrWhy = "";
const ocrTool = async () => {
  if (ocrCached !== undefined) return ocrCached;
  const src = join(import.meta.dir, "ocr_vision.swift");
  const bin = join(tmpDir, "ocr_vision");
  ocrCached = null;
  if (process.platform !== "darwin") ocrWhy = "macOS 아님(Vision 없음)";
  else if (!existsSync(src)) ocrWhy = "scripts/ocr_vision.swift 없음";
  else {
    const c = await run(["swiftc", "-O", src, "-o", bin]);
    if (c.code === 0 && existsSync(bin)) ocrCached = [bin];
    else if ((await run(["swift", "--version"])).code === 0) ocrCached = ["swift", src];
    else ocrWhy = `swiftc 실패: ${c.err.slice(0, 160)}`;
  }
  return ocrCached;
};
const ocrRun = async (paths: string[]): Promise<any[] | null> => {
  const cmd = await ocrTool();
  if (!cmd) return null;
  const outs: any[] = [];
  for (let k = 0; k < paths.length; k += 40) {
    const r = await run([...cmd, ...paths.slice(k, k + 40)], root, 600000);
    const j = (() => { try { return JSON.parse(r.out); } catch { return null; } })();
    if (!j) { ocrWhy = `Vision 실행 실패: ${(r.err || r.out).slice(0, 200)}`; return null; }
    outs.push(...j);
  }
  return outs;
};
{
  const g = await run(["git", "show", "main:presentation/index.html"], repo);
  files.mainHtml = g.code === 0 ? g.out : "";
  const d = await run(["git", "diff", "--name-status", "main", "--", "presentation/assets/vendor"], repo);
  files.vendorDiff = d.code === 0 ? d.out : `git diff 실패: ${d.err}`;
}

// ── 외부 검사 ──────────────────────────
const ext: Record<string, any> = {};
const tryJson = (s: string) => { try { return JSON.parse(s); } catch { const i = s.indexOf("{"); try { return i >= 0 ? JSON.parse(s.slice(i)) : null; } catch { return null; } } };
if (want("LAY-04", "STD-02", "COL-01", "TYP-02", "CARD-07", "MOT-05", "TYP-05")) {
  log("헌법 감사·token-check");
  const cssList = ["src/tokens.css", "src/deck.css", "src/slides.css", ...Object.keys(files.extraCss).map((f) => `src/${f}`)];
  ext.constitution = await run(["python3", join(SKILL, "constitution_audit.py"), ...cssList]);
  ext.constitution9 = await run(["python3", join(SKILL, "constitution_audit.py"), ...cssList, "--max-sizes", "9"]);
  ext.tokenCheck = await run(["bun", join(SKILL, "token-check.ts"), "--tokens", "src/tokens.css", ...cssList.slice(1), "index.html", "--strict"]);
}
if (want("EVD-01")) {
  log("check-numbers");
  const r = await run(["bun", "scripts/check-numbers.ts"]);
  ext.checkNumbers = { ...r, json: tryJson(r.out) };
}
if (want("LAY-06", "TYP-03", "TYP-08", "STD-07")) {
  log("render.ts (fit 보고)");
  const r = await run(["bun", "scripts/render.ts", "index.html"]);
  ext.render = { ...r, json: tryJson(r.out) };
}
if (want("PERF-04")) {
  log("probe-nav");
  const r = await run(["bun", "scripts/probe-nav.ts"]);
  ext.probeNav = { ...r, json: tryJson(r.out) };
}
if (TASTE && want("CARD-05", "TXT-03", "TYP-13")) {
  const r = await run(["node", join(TASTE, "lint.mjs"), "index.html", "src", "--json"]);
  ext.lint = { ...r, json: tryJson(r.out) };
}

// ── 서버 ──────────────────────────
const server = Bun.serve({
  port: 0,
  hostname: "127.0.0.1",
  async fetch(req) {
    let p = decodeURIComponent(new URL(req.url).pathname);
    const m = p.match(/^\/(noanime|noimg|slowimg|slowanime)(\/.*)$/);
    const mode = m ? m[1] : "";
    if (m) p = m[2];
    if (mode === "noanime" && /anime/.test(p)) return new Response("blocked", { status: 404 });
    if (mode === "noimg" && /\.(jpe?g|png|webp)$/.test(p)) return new Response("blocked", { status: 404 });
    if (mode === "slowimg" && /\.(jpe?g|png|webp)$/.test(p)) await Bun.sleep(3000);
    if (mode === "slowanime" && /anime/.test(p)) await Bun.sleep(2000);
    const file = Bun.file(join(root, p));
    return (await file.exists()) ? new Response(file) : new Response("not found", { status: 404 });
  },
});
const origin = `http://127.0.0.1:${server.port}`;
const base = `${origin}/index.html`;
const PAGE_JS = await Bun.file(join(import.meta.dir, "vqa/page.js")).text();

type View = InstanceType<typeof Bun.WebView>;
const views = new Set<View>();
let bust = 0;
const url = (q = "", hash = "", prefix = "") => `${origin}${prefix}/index.html?v=${++bust}${q ? "&" + q : ""}${hash ? "#" + hash : ""}`;
async function mk(w: number, h: number, o: { mobile?: boolean; touch?: boolean; dpr?: number; reduce?: boolean; dark?: boolean; preload?: string } = {}) {
  const v = new Bun.WebView({ width: w, height: h, backend: "chrome" });
  views.add(v);
  await v.navigate("about:blank");
  await v.cdp("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: o.dpr ?? 1, mobile: !!o.mobile, screenOrientation: w > h ? { type: "landscapePrimary", angle: 90 } : { type: "portraitPrimary", angle: 0 } });
  if (o.touch) await v.cdp("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  const features = [] as { name: string; value: string }[];
  if (o.reduce) features.push({ name: "prefers-reduced-motion", value: "reduce" });
  if (o.dark) features.push({ name: "prefers-color-scheme", value: "dark" });
  if (features.length) await v.cdp("Emulation.setEmulatedMedia", { features });
  if (o.preload) await v.cdp("Page.addScriptToEvaluateOnNewDocument", { source: o.preload });
  return v;
}
const close = (v: View) => { try { v.close(); } catch {} views.delete(v); };
async function J<T = any>(v: View, expr: string): Promise<T> {
  const r = await v.cdp("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(`evaluate: ${r.exceptionDetails.exception?.description ?? r.exceptionDetails.text}`.slice(0, 600));
  return r.result.value as T;
}
const settle = (v: View) => J(v, "document.fonts.ready.then(() => Promise.all([...document.images].map((im) => im.complete ? 1 : new Promise((r) => { im.onload = im.onerror = r; setTimeout(r, 4000); })))).then(() => 1)");
async function open(v: View, u: string, wait = 250) {
  await v.navigate(u);
  await settle(v).catch(() => 0);
  await Bun.sleep(wait);
  await J(v, PAGE_JS);
}
const inject = (v: View) => J(v, PAGE_JS);
const noTrans = (v: View) => J(v, "(() => { const s = document.createElement('style'); s.id = 'vqa-notrans'; s.textContent = '*, *::before, *::after { transition: none !important; animation: none !important; }'; document.head.append(s); return 1; })()");
const KEYS: Record<string, [string, number, string?]> = {
  ArrowRight: ["ArrowRight", 39], ArrowLeft: ["ArrowLeft", 37], ArrowDown: ["ArrowDown", 40], ArrowUp: ["ArrowUp", 38], PageDown: ["PageDown", 34], PageUp: ["PageUp", 33],
  Home: ["Home", 36], End: ["End", 35], Escape: ["Escape", 27], " ": ["Space", 32, " "], Tab: ["Tab", 9], Enter: ["Enter", 13, "\r"], g: ["KeyG", 71, "g"], o: ["KeyO", 79, "o"], f: ["KeyF", 70, "f"], r: ["KeyR", 82, "r"], "?": ["Slash", 191, "?"],
};
async function key(v: View, k: string, modifiers = 0) {
  const [code, kc, text] = KEYS[k] ?? [k, k.toUpperCase().charCodeAt(0), k];
  await v.cdp("Input.dispatchKeyEvent", { type: text && !modifiers ? "keyDown" : "rawKeyDown", key: k, code, windowsVirtualKeyCode: kc, text: modifiers ? undefined : text, modifiers });
  await v.cdp("Input.dispatchKeyEvent", { type: "keyUp", key: k, code, windowsVirtualKeyCode: kc, modifiers });
}
async function click(v: View, x: number, y: number) {
  await v.cdp("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
  await v.cdp("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
  await v.cdp("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
}
async function tap(v: View, x: number, y: number) {
  await v.cdp("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  await Bun.sleep(40);
  await v.cdp("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
}
async function swipe(v: View, x: number, y: number, dx: number, dy: number, steps = 6) {
  await v.cdp("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  for (let i = 1; i <= steps; i++) {
    await Bun.sleep(16);
    await v.cdp("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + (dx * i) / steps, y: y + (dy * i) / steps }] });
  }
  await v.cdp("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
}
const cur = (v: View) => J<number>(v, "window.__deckCurrentSlide ? window.__deckCurrentSlide() : -1");
async function shot(v: View, name: string, jpg = true) {
  const png = join(tmpDir, `${name}.png`);
  await Bun.write(png, await v.screenshot());
  if (jpg) jpgQueue.push({ op: "jpg", src: png, dst: join(shotsDir, `${name}.jpg`), q: 80, maxw: 1920 });
  return { png, jpg: join(shotsDir, `${name}.jpg`) };
}
const jpgQueue: any[] = [];
async function py(tasks: any[]) {
  if (!tasks.length) return [];
  const jf = join(tmpDir, `jobs-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.json`);
  await Bun.write(jf, JSON.stringify({ tasks }));
  const r = await run([PY, join(import.meta.dir, "qa_pixels.py"), jf], root, 600000);
  if (r.code !== 0) throw new Error(`qa_pixels.py 실패(${PY}): ${r.err.slice(-800)}`);
  return JSON.parse(r.out);
}
const errors: string[] = [];
async function phase<T>(name: string, fn: () => Promise<T>): Promise<T | undefined> {
  const t = Date.now();
  log(`${name} …`);
  try {
    const r = await fn();
    log(`${name} 끝 ${((Date.now() - t) / 1000).toFixed(1)}s`);
    return r;
  } catch (e: any) {
    errors.push(`${name}: ${e?.message ?? e}`);
    log(`${name} 오류: ${e?.message ?? e}`);
    return undefined;
  }
}

const D: Data = { label, files, ext, slides: [], pix: [], shots: {}, ix: {}, stage: {}, criteria: criteriaAll, violations, errors, opts: { net: useNet, publicUrl } } as any;

// ── 1. 장마다 ?slide=n 렌더 측정 + 스크린샷 + 픽셀 ──────────────────────────
const needSlides = want("LAY-*", "SURF-0*", "CARD-*", "COL-*", "CON-0*", "GRAD-*", "TYP-0*", "TYP-1*", "TXT-*", "IMG-*", "CHT-*", "EVD-*", "A11Y-03", "A11Y-04", "A11Y-06", "MOT-08", "NAV-10", "NAV-11", "META-02", "STD-0*", "PRT-0*");
let total = 34;
if (needSlides) await phase("장별 측정(?slide=n, 1920×1080)", async () => {
  const v = await mk(1920, 1080);
  await open(v, url("check=1"));
  total = await J<number>(v, "document.querySelectorAll('.slide').length");
  const [a, b] = slideRange ?? [1, total];
  for (let n = a; n <= Math.min(b, total); n++) {
    await open(v, url(`slide=${n}`), 150);
    const s = await J<any>(v, "window.__vqa.slide()");
    D.slides[n] = s;
    D.shots[n] = await shot(v, `slide-${String(n).padStart(2, "0")}`);
  }
  // 대비: 사진·그라데이션 위 글자와 모든 글자의 픽셀 최악 대비
  const tasks: any[] = [];
  const textIdx: Record<number, number[]> = {};
  for (let n = a; n <= Math.min(b, total); n++) {
    const s = D.slides[n];
    if (!s) continue;
    const photos = s.images.map((i: any) => ({ x: i.rect.x, y: i.rect.y, w: i.rect.w, h: i.rect.h }));
    const textRects = s.texts.map((t: any) => ({ x: t.rect.x, y: t.rect.y, w: t.rect.w, h: t.rect.h }));
    tasks.push({ op: "slidestats", img: D.shots[n].png, region: { x: 160, y: 112, w: 1600, h: 904 }, photos, texts: textRects });
    const sel = s.texts.filter((t: any) => t.rect.w > 0 && t.rect.h > 0 && t.op > 0.05);
    textIdx[n] = sel.map((t: any) => t.i);
    const items = sel.map((t: any) => {
      const c = (t.inSvg ? t.fill : t.color).match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
      return { rect: t.rect, color: c.slice(0, 3) };
    });
    tasks.push({ op: "textcontrast", img: D.shots[n].png, items });
  }
  const res = await py(tasks);
  let i = 0;
  for (let n = a; n <= Math.min(b, total); n++) {
    if (!D.slides[n]) continue;
    D.pix[n] = { stats: res[i++], text: res[i++], textIdx: textIdx[n] };
  }
  close(v);
});
D.total = total;

// ── 2. 글꼴(CDP CSS.getPlatformFontsForNode) ──────────────────────────
if (want("TYP-01")) await phase("실제 렌더 글꼴", async () => {
  const v = await mk(1920, 1080);
  await open(v, url("check=1"));
  await v.cdp("DOM.enable", {});
  await v.cdp("CSS.enable", {});
  const doc = await v.cdp("DOM.getDocument", { depth: -1 });
  const { nodeIds } = await v.cdp("DOM.querySelectorAll", { nodeId: doc.root.nodeId, selector: ".slide *" });
  const fams = new Map<string, number>();
  let checked = 0;
  for (const id of nodeIds) {
    const r = await v.cdp("CSS.getPlatformFontsForNode", { nodeId: id }).catch(() => null);
    if (!r?.fonts?.length) continue;
    checked++;
    for (const f of r.fonts) fams.set(f.familyName, (fams.get(f.familyName) ?? 0) + f.glyphCount);
  }
  const status = await fetch(`${origin}/assets/fonts/${files.fontFiles[0]?.name}`).then((r) => r.status).catch(() => 0);
  const check = await J(v, "document.fonts.check('700 48px \"Pretendard Variable\"')");
  D.ix.fonts = { families: Object.fromEntries(fams), nodes: checked, woffStatus: status, fontsCheck: check };
  close(v);
});

// ── 3. 다크 모드 에뮬레이션(SURF-06) ──────────────────────────
if (want("SURF-06") && Object.keys(D.shots).length) await phase("prefers-color-scheme: dark 34장", async () => {
  const v = await mk(1920, 1080, { dark: true });
  const tasks: any[] = [];
  for (const n of Object.keys(D.shots).map(Number)) {
    await open(v, url(`slide=${n}`), 150);
    const p = join(tmpDir, `dark-${String(n).padStart(2, "0")}.png`);
    await Bun.write(p, await v.screenshot());
    tasks.push({ op: "diff", a: D.shots[n].png, b: p, tol: 4 });
  }
  const res = await py(tasks);
  D.ix.dark = Object.keys(D.shots).map(Number).map((n, i) => ({ n, ...res[i] }));
  close(v);
});

// ── 4. 발표 무대: 뷰포트 행렬 ──────────────────────────
const VPS: Record<string, [number, number, boolean]> = {
  "1920x1080": [1920, 1080, false], "1512x982": [1512, 982, false], "1440x900": [1440, 900, false], "1366x768": [1366, 768, false], "1280x720": [1280, 720, false],
  "1024x768": [1024, 768, false], "2560x1080": [2560, 1080, false], "960x1080": [960, 1080, false], "844x390": [844, 390, true], "812x375": [812, 375, true],
  "768x1024": [768, 1024, true], "390x844": [390, 844, true], "375x812": [375, 812, true],
};
if (want("RSP-01", "RSP-02", "CTL-01", "CTL-02", "SURF-05", "ONB-02", "ONB-04", "CTL-05", "CTL-06", "NAV-10", "PERF-04", "A11Y-02", "A11Y-01")) await phase("무대 뷰포트 행렬", async () => {
  const out: Record<string, any> = {};
  for (const [name, [w, h, touch]] of Object.entries(VPS)) {
    const v = await mk(w, h, { mobile: touch, touch });
    await open(v, url("", "10"), 400);
    const st = await J(v, "window.__vqa.stage()");
    const s = await shot(v, `stage-${name}-s10`);
    await noTrans(v);
    const scan = want("RSP-02", "NAV-10", "A11Y-02") ? await J(v, "window.__vqa.stageScan()") : null;
    const overlap = want("CTL-02") && ["1920x1080", "1440x900", "1366x768", "1280x720", "1024x768", "2560x1080", "960x1080", "844x390", "390x844"].includes(name) ? await J(v, "window.__vqa.stageAll()") : null;
    // 장 9(영상 링크)·34(링크)의 컨트롤
    const ctl: any = {};
    if (["375x812", "812x375", "1280x720", "1440x900"].includes(name)) {
      for (const n of [1, 9, 34]) {
        await J(v, `(() => { location.hash = '#${n}'; return 1; })()`);
        await J(v, `(() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true })); for (let i = 1; i < ${n}; i++) document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })); return 1; })()`);
        ctl[n] = (await J<any>(v, "window.__vqa.stage()")).controls;
      }
    }
    out[name] = { w, h, touch, st, shot: shotRel(s.jpg), png: s.png, scan, overlap, ctl };
    close(v);
  }
  // 레터박스 색
  const tasks: any[] = [];
  const names = ["1024x768", "2560x1080", "390x844"].filter((n) => out[n]);
  for (const n of names) {
    const { st, png } = out[n];
    const rects = [];
    if (st.deck.x > 4) rects.push({ x: 0, y: 0, w: Math.floor(st.deck.x) - 1, h: st.vh });
    if (st.deck.y > 4) rects.push({ x: 0, y: 0, w: st.vw, h: Math.floor(st.deck.y) - 1 });
    tasks.push({ op: "sample", img: png, rects });
  }
  const res = await py(tasks);
  names.forEach((n, i) => { out[n].letterbox = res[i]; });
  D.stage = out;
});

// ── 5. 상호작용 ──────────────────────────
const ix = D.ix;
const watchErr = (v: View) => J(v, "(window.__jsErrors || []).slice()");

if (want("NAV-01")) await phase("터치 스와이프(375×812)", async () => {
  const v = await mk(375, 812, { mobile: true, touch: true });
  const cases = [
    { name: "왼쪽으로 80px(Δy 10)", hash: "5", x: 200, y: 400, dx: -80, dy: 10, expect: 1 },
    { name: "짧게 40px", hash: "5", x: 200, y: 400, dx: -40, dy: 0, expect: 0 },
    { name: "가장자리 8px에서 시작", hash: "5", x: 8, y: 400, dx: 80, dy: 0, expect: 0 },
    { name: "세로 우세(Δx 40, Δy 80)", hash: "5", x: 200, y: 400, dx: 40, dy: 80, expect: 0 },
    { name: "오른쪽으로 80px", hash: "5", x: 150, y: 400, dx: 80, dy: 10, expect: -1 },
    { name: "1장에서 바깥(오른쪽)으로", hash: "1", x: 150, y: 400, dx: 80, dy: 0, expect: 0 },
    { name: "확대(scale 2) 상태에서 왼쪽으로", hash: "5", x: 200, y: 400, dx: -80, dy: 10, expect: 0, zoom: true },
  ];
  const res = [];
  for (const c of cases) {
    await open(v, url("", c.hash), 400);
    if (c.zoom) await v.cdp("Emulation.setPageScaleFactor", { pageScaleFactor: 2 });
    const before = await cur(v);
    await swipe(v, c.x, c.y, c.dx, c.dy);
    await Bun.sleep(400);
    const after = await cur(v);
    const tx = await J(v, "(() => { const s = document.querySelectorAll('.slide')[window.__deckCurrentSlide()]; return s ? getComputedStyle(s).transform : null; })()");
    if (c.zoom) await v.cdp("Emulation.setPageScaleFactor", { pageScaleFactor: 1 });
    res.push({ ...c, before, after, delta: after - before, tx });
  }
  const ta = await J(v, "({ deck: getComputedStyle(document.querySelector('.deck')).touchAction, body: getComputedStyle(document.body).touchAction, html: getComputedStyle(document.documentElement).touchAction })");
  await open(v, url("", "5"), 300);
  const s = await shot(v, "nav01-375x812-s5");
  ix.nav01 = { cases: res, touchAction: ta, shot: shotRel(s.jpg), errors: await watchErr(v) };
  close(v);
});

const findButtons = (v: View, re: string) => J<any[]>(v, `[...document.querySelectorAll('button, [role=button], a')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && getComputedStyle(e).visibility !== 'hidden' && new RegExp(${JSON.stringify(re)}).test((e.getAttribute('aria-label') || '') + ' ' + (e.getAttribute('title') || '') + ' ' + e.textContent); }).map((e) => { const r = e.getBoundingClientRect(); return { name: ((e.getAttribute('aria-label') || '') + ' ' + e.textContent).trim(), x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, disabled: e.disabled || e.getAttribute('aria-disabled') === 'true', opacity: getComputedStyle(e).opacity, cursor: getComputedStyle(e).cursor }; })`);

if (want("NAV-02", "NAV-05", "NAV-12", "CTL-05")) await phase("보이는 버튼으로만 이동", async () => {
  const out: any = {};
  for (const [name, w, h, touch] of [["390x844 터치", 390, 844, true], ["1440x900 마우스", 1440, 900, false]] as const) {
    const v = await mk(w, h, { mobile: touch, touch });
    await open(v, url("", "1"), 400);
    const next = await findButtons(v, "다음");
    const prev = await findButtons(v, "이전");
    const ov = await findButtons(v, "개요|전체 장|모든 장");
    const fs = await findButtons(v, "전체 화면|전체화면");
    const r: any = { next: next.length, prev: prev.length, overview: ov.length, fullscreen: fs.length, hashes: [] as string[], prevAtFirst: prev[0] ?? null };
    const press = async (b: any) => (touch ? tap(v, b.x, b.y) : click(v, b.x, b.y));
    if (next.length && prev.length) {
      for (let i = 0; i < 33; i++) {
        const b = (await findButtons(v, "다음"))[0];
        if (!b) break;
        await press(b);
        await Bun.sleep(80);
        r.hashes.push(await J(v, "location.hash"));
      }
      r.atEnd = await cur(v);
      r.nextAtLast = (await findButtons(v, "다음"))[0] ?? null;
      await key(v, "ArrowRight");
      await Bun.sleep(200);
      r.afterEndKey = await cur(v);
      r.endMarker = await J(v, "[...document.querySelectorAll('body *')].filter((e) => !e.closest('.slide') && e.getBoundingClientRect().width > 0 && getComputedStyle(e).visibility !== 'hidden' && /마지막|끝|처음으로/.test(e.textContent) && e.children.length < 4).map((e) => e.textContent.trim().slice(0, 40))");
      for (let i = 0; i < 33; i++) {
        const b = (await findButtons(v, "이전"))[0];
        if (!b) break;
        await press(b);
        await Bun.sleep(60);
      }
      r.back = await cur(v);
    }
    if (ov.length) {
      await press(ov[0]);
      await Bun.sleep(300);
      r.overviewOpened = await J(v, "document.body.classList.contains('overview') || !!document.querySelector('[aria-modal=true], dialog[open]')");
    }
    r.errors = await watchErr(v);
    out[name] = r;
    close(v);
  }
  ix.buttons = out;
});

if (want("NAV-03")) await phase("키 매핑·수식키", async () => {
  const v = await mk(1440, 900);
  await open(v, url("", "1"), 400);
  const seq: [string, number][] = [["ArrowRight", 1], [" ", 2], ["PageDown", 3], ["ArrowLeft", 2], ["PageUp", 1], ["End", 33], ["Home", 0], ["ArrowDown", 1], ["ArrowUp", 0]];
  const got = [];
  for (const [k, exp] of seq) {
    await key(v, k);
    await Bun.sleep(120);
    got.push({ key: k, expect: exp, got: await cur(v) });
  }
  const mods = await J(v, `(() => {
    const out = [];
    const before = window.__deckCurrentSlide();
    let prevented = 0;
    const spy = (e) => { if (e.defaultPrevented) prevented++; };
    window.addEventListener('keydown', spy);
    for (const m of ['metaKey', 'ctrlKey']) for (const k of ['f', 'c', 'r', 'l', '=', 'ArrowRight', ' ']) {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: k, [m]: true, bubbles: true, cancelable: true }));
      out.push(m + '+' + k);
    }
    window.removeEventListener('keydown', spy);
    return { combos: out.length, prevented, moved: window.__deckCurrentSlide() - before };
  })()`);
  ix.keys = { seq: got, mods, errors: await watchErr(v) };
  close(v);
});

if (want("NAV-04")) await phase("연타·왕복", async () => {
  const v = await mk(1440, 900);
  await open(v, url("", "1"), 400);
  await J(v, `(() => { window.__kd = []; window.__vis = []; document.addEventListener('keydown', () => { const t = performance.now(); const target = Math.min(window.__deckCurrentSlide() + 1, document.querySelectorAll('.slide').length - 1); window.__kd.push(t);
    const tick = () => { const s = document.querySelectorAll('.slide')[target]; const cs = getComputedStyle(s); if (cs.visibility === 'visible' && Number(cs.opacity) > 0.01) window.__vis.push(performance.now() - t); else if (performance.now() - t < 1000) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }, true); return 1; })()`);
  for (let i = 0; i < 5; i++) { await key(v, "ArrowRight"); await Bun.sleep(500); }
  const vis = await J<number[]>(v, "window.__vis.slice()");
  const firstVisible = vis.length ? [...vis].sort((a, b) => a - b)[Math.floor(vis.length / 2)] : null; // 5번 넘김의 중앙값
  await key(v, "Home");
  await Bun.sleep(300);
  for (let i = 0; i < 10; i++) { await key(v, "ArrowRight"); await Bun.sleep(50); }
  await Bun.sleep(600);
  const a = await J(v, "({ cur: window.__deckCurrentSlide(), current: document.querySelectorAll('.slide[data-side=current]').length, hiding: document.querySelectorAll('.is-hiding').length })");
  for (let i = 0; i < 20; i++) { await key(v, "ArrowRight"); await Bun.sleep(100); await key(v, "ArrowLeft"); await Bun.sleep(100); }
  await Bun.sleep(1500);
  const b = await J(v, "(() => { const s = document.querySelectorAll('.slide')[window.__deckCurrentSlide()]; return { cur: window.__deckCurrentSlide(), current: document.querySelectorAll('.slide[data-side=current]').length, hiding: document.querySelectorAll('.is-hiding').length, notOpaque: [...s.querySelectorAll('.t-stagger-line')].filter((e) => Number(getComputedStyle(e).opacity) < 0.999).length }; })()");
  ix.rapid = { firstVisibleMs: firstVisible, visibleSamples: vis, afterTen: a, afterRoundTrips: b, errors: await watchErr(v) };
  close(v);
});

if (want("NAV-06")) await phase("해시 처리", async () => {
  const v = await mk(1440, 900);
  const res: any[] = [];
  for (const [h, exp] of [["12", 11], ["0", 0], ["99", 33], ["abc", 0], ["", 0]] as const) {
    await open(v, url("", h), 300);
    res.push({ hash: h, expect: exp, got: await cur(v) });
  }
  await open(v, url("", "1"), 300);
  await J(v, "(() => { location.hash = '#12'; return 1; })()");
  await Bun.sleep(300);
  const afterHashchange = await cur(v);
  await key(v, "ArrowRight"); // 12 → 13 에서 새로고침
  await J(v, "(() => { location.hash = '#12'; return 1; })()");
  await v.reload();
  await settle(v);
  await Bun.sleep(300);
  const afterReload = await cur(v);
  ix.hash = { loads: res, afterHashchange, afterReload, reloadHash: await J(v, "location.hash"), errors: await watchErr(v) };
  close(v);
});

const openOverview = async (v: View) => {
  const tries: string[] = [];
  for (const k of ["g", "o"]) {
    await key(v, k);
    await Bun.sleep(150);
    if (await J(v, "document.body.classList.contains('overview')")) { tries.push(k); return { how: k, tries }; }
  }
  const b = (await findButtons(v, "개요|전체 장|모든 장"))[0];
  if (b) { await click(v, b.x, b.y); await Bun.sleep(200); if (await J(v, "document.body.classList.contains('overview')")) return { how: "button", tries }; }
  await key(v, "Escape");
  await Bun.sleep(200);
  if (await J(v, "document.body.classList.contains('overview')")) return { how: "Escape", tries };
  return { how: null, tries };
};

if (want("NAV-07")) await phase("개요 점프·뒤로 가기", async () => {
  // 새 탭에서 연다: 앞선 탐색 기록이 섞이면 history.back()이 다른 로드로 돌아가 거짓 통과가 난다
  const v = await mk(1920, 1080);
  await open(v, url("", "3"), 300);
  const L0 = await J<number>(v, "history.length");
  const o = await openOverview(v);
  const back: any = { opened: o.how };
  if (o.how) {
    back.animsOpen = await J(v, "document.getAnimations().length");
    const thumb = await J<any>(v, "(() => { const s = document.querySelectorAll('.slide')[19]; s.scrollIntoView({ block: 'center' }); const r = s.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()");
    await Bun.sleep(150);
    await click(v, thumb.x, thumb.y);
    await Bun.sleep(300);
    back.afterJump = await cur(v);
    back.lenAfterJump = await J(v, "history.length");
    await J(v, "(() => { setTimeout(() => history.back(), 0); return 1; })()");
    await Bun.sleep(800);
    try { back.href = await J(v, "location.href"); back.afterBack = /index\.html/.test(back.href) ? await cur(v) : null; } catch { back.afterBack = null; back.href = "페이지를 떠남"; }
  }
  close(v);
  const w = await mk(1920, 1080);
  await open(w, url("", "1"), 300);
  const L1 = await J<number>(w, "history.length");
  for (let i = 0; i < 10; i++) { await key(w, "ArrowRight"); await Bun.sleep(60); }
  const L2 = await J<number>(w, "history.length");
  close(w);
  ix.history = { L0, back, stepGrowth: L2 - L1 };
});

if (want("NAV-08", "NAV-09", "PRT-02")) await phase("개요·Esc", async () => {
  let v = await mk(1920, 1080);
  // NAV-08: 무대에서 Esc
  await open(v, url("", "3"), 400);
  await key(v, "Escape");
  await Bun.sleep(200);
  const escOpens = await J(v, "document.body.classList.contains('overview')");
  if (escOpens) { await key(v, "Escape"); await Bun.sleep(200); }
  const methods: string[] = [];
  for (const k of ["g", "o"]) {
    await key(v, k);
    await Bun.sleep(150);
    if (await J(v, "document.body.classList.contains('overview')")) { methods.push(`${k} 키`); await key(v, "Escape"); await Bun.sleep(150); if (await J(v, "document.body.classList.contains('overview')")) await key(v, k); await Bun.sleep(150); }
  }
  if ((await findButtons(v, "개요|전체 장|모든 장")).length) methods.push("버튼");
  // 전체 화면에서 Esc
  await key(v, "f");
  await Bun.sleep(400);
  const fsEntered = await J(v, "!!document.fullscreenElement");
  let fsEscOverview = null;
  if (fsEntered) {
    await key(v, "Escape");
    await Bun.sleep(400);
    fsEscOverview = await J(v, "document.body.classList.contains('overview')");
    if (await J(v, "!!document.fullscreenElement")) await J(v, "document.exitFullscreen().then(() => 1)");
  }
  ix.esc = { escOpens, methods, fsEntered, fsEscOverview };
  close(v);
  v = await mk(1920, 1080);
  // NAV-09: 개요 화면 구성
  await open(v, url("", "5"), 300);
  const o2 = await openOverview(v);
  if (o2.how) {
    const anims = await J(v, "document.getAnimations().filter((a) => a.playState === 'running').length");
    const info = await J(v, `(() => {
      const slides = [...document.querySelectorAll('.slide')];
      const cur = slides[window.__deckCurrentSlide()];
      const vis = (e) => e && e.getBoundingClientRect().width > 0 && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden';
      const title = [...document.querySelectorAll('body *')].find((e) => !e.closest('.slide') && vis(e) && /전체\\s*\\d+\\s*장/.test(e.textContent) && e.children.length < 3);
      const closeBtn = [...document.querySelectorAll('button, [role=button]')].find((e) => vis(e) && /닫기|close/i.test((e.getAttribute('aria-label') || '') + e.textContent));
      const pg = cur.querySelector('.pg');
      const pr = pg ? pg.getBoundingClientRect() : null;
      return {
        title: title ? title.textContent.trim().slice(0, 40) : null,
        close: closeBtn ? { w: closeBtn.getBoundingClientRect().width, h: closeBtn.getBoundingClientRect().height } : null,
        pgEffective: pr ? Math.round(pr.height * 10) / 10 : null,
        ariaCurrent: slides.filter((s) => s.getAttribute('aria-current')).length,
        currentOutline: getComputedStyle(cur).outlineStyle + ' ' + getComputedStyle(cur).outlineWidth,
        replayVisible: [...document.querySelectorAll('.replay-btn')].filter(vis).length,
        fixedVisible: [...document.querySelectorAll('body *')].filter((e) => !e.closest('.slide') && getComputedStyle(e).position === 'fixed' && vis(e)).length,
      };
    })()`);
    await key(v, "Tab");
    await key(v, "Enter");
    await Bun.sleep(300);
    const afterTabEnter = await J(v, "({ overview: document.body.classList.contains('overview'), cur: window.__deckCurrentSlide() })");
    ix.overview = { how: o2.how, anims, ...info, afterTabEnter };
    // PRT-02: 썸네일 캡처
    if (want("PRT-02") && Object.keys(D.shots).length) {
      await open(v, url("", "1"), 300);
      const o3 = await openOverview(v);
      if (o3.how) {
        await noTrans(v);
        await Bun.sleep(200);
        const tasks: any[] = [];
        for (const n of Object.keys(D.shots).map(Number)) {
          // 화면 밖까지 찍으면(captureBeyondViewport) 뷰포트가 바뀌어 가운데 정렬된 썸네일이 밀린다 → 한 장씩 화면 안으로 스크롤해 찍는다
          const r = await J<any>(v, `(() => { const s = document.querySelectorAll('.slide')[${n - 1}]; s.scrollIntoView({ block: 'center' }); const b = s.getBoundingClientRect(); return { x: b.left + scrollX, y: b.top + scrollY, w: b.width, h: b.height }; })()`);
          if (!r) continue;
          const cap = await v.cdp("Page.captureScreenshot", { format: "png", clip: { x: r.x, y: r.y, width: r.w, height: r.h, scale: 1 } });
          const p = join(tmpDir, `thumb-${String(n).padStart(2, "0")}.png`);
          await Bun.write(p, Buffer.from(cap.data, "base64"));
          tasks.push({ op: "ssim", a: p, b: D.shots[n].png, blur: 1, w: 240 });
        }
        const res = await py(tasks);
        ix.thumbs = Object.keys(D.shots).map(Number).map((n, i) => ({ n, ssim: res[i] }));
      }
    }
  } else ix.overview = { how: null };
  close(v);
});

if (want("NAV-12")) await phase("전체 화면 미지원 환경", async () => {
  const v = await mk(1440, 900, { preload: "Object.defineProperty(Document.prototype, 'fullscreenEnabled', { get: () => false }); Element.prototype.requestFullscreen = function () { return Promise.reject(new TypeError('Fullscreen API is not supported')); };" });
  await open(v, url("", "3"), 400);
  const buttons = (await findButtons(v, "전체 화면|전체화면")).length;
  await key(v, "f");
  await Bun.sleep(400);
  ix.fsUnsupported = { buttons, errors: await watchErr(v), cur: await cur(v) };
  close(v);
});

if (want("NAV-11")) await phase("링크 탭(9장 영상)", async () => {
  const v = await mk(375, 812, { mobile: true, touch: true });
  await open(v, url("", "9"), 400);
  const r = await J<any>(v, "(() => { const a = document.querySelectorAll('.slide')[8].querySelector('a'); if (!a) return null; const b = a.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2, href: a.href, target: a.target }; })()");
  let res: any = { link: r };
  if (r) {
    await J(v, "(() => { window.__opened = []; const o = window.open; window.open = (...a) => { window.__opened.push(a[0]); return null; }; document.addEventListener('click', (e) => { const a = e.target.closest('a'); if (a) { window.__opened.push(a.href); e.preventDefault(); } }, true); return 1; })()");
    const before = await cur(v);
    await tap(v, r.x, r.y);
    await Bun.sleep(400);
    res = { ...res, before, after: await cur(v), opened: await J(v, "window.__opened") };
  }
  if (useNet) {
    const hrefs = [...new Set(D.slides.filter(Boolean).flatMap((s: any) => s.links.map((l: any) => l.href)).filter((h: string) => /^https?:/.test(h)))];
    res.status = {};
    for (const h of hrefs) res.status[h] = await fetch(h, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(8000) }).then((x) => x.status).catch((e) => `오류 ${e?.message ?? e}`);
  }
  ix.linkTap = res;
  close(v);
});

if (want("CTL-03")) await phase("포인터 정지 시 컨트롤", async () => {
  const v = await mk(1440, 900);
  await open(v, url("", "5"), 400);
  const op = () => J<number[]>(v, "[...document.querySelectorAll('button, [role=button]')].filter((e) => !e.closest('.slide') && e.getBoundingClientRect().width > 0).map((e) => { let o = 1; for (let x = e; x && x.nodeType === 1; x = x.parentElement) o *= Number(getComputedStyle(x).opacity); return Math.round(o * 100) / 100; })");
  await v.cdp("Input.dispatchMouseEvent", { type: "mouseMoved", x: 700, y: 400 });
  await Bun.sleep(3300);
  const idle = await op();
  await v.cdp("Input.dispatchMouseEvent", { type: "mouseMoved", x: 720, y: 420 });
  await Bun.sleep(200);
  const moved = await op();
  await J(v, "(() => { const b = [...document.querySelectorAll('button')].find((e) => !e.closest('.slide')); if (b) b.focus(); return !!b; })()");
  await Bun.sleep(3300);
  const focused = await op();
  ix.idle = { idle, moved, focused };
  close(v);
});

if (want("CTL-04", "CTL-07", "CHT-13", "MOT-04", "PRT-01", "CON-05")) await phase("스타일시트 규칙", async () => {
  const v = await mk(1440, 900);
  await open(v, url("", "9"), 400);
  ix.rules = await J(v, `(() => {
    const rules = [];
    const walk = (list, media) => { for (const r of list) { if (r.cssRules && r.media) walk(r.cssRules, (media ? media + ' and ' : '') + r.media.mediaText); else if (r.cssRules && r.conditionText !== undefined) walk(r.cssRules, (media ? media + ' and ' : '') + r.conditionText); else if (r.selectorText) rules.push({ sel: r.selectorText, media: media || '', text: r.cssText }); } };
    for (const sh of document.styleSheets) { try { walk(sh.cssRules, ''); } catch (e) {} }
    const interactive = [...document.querySelectorAll('button, a[href], [role=button]')];
    const strip = (s, p) => s.split(',').filter((x) => x.includes(p)).map((x) => x.replace(new RegExp(p.replace(/[()]/g, '\\\\$&'), 'g'), '').trim() || '*');
    const matchAny = (e, sels) => sels.some((x) => { try { return e.matches(x) || !!e.closest(x); } catch { return false; } });
    const per = interactive.map((e) => {
      const act = rules.filter((r) => r.sel.includes(':active') && matchAny(e, strip(r.sel, ':active')));
      const fv = rules.filter((r) => r.sel.includes(':focus-visible') && matchAny(e, strip(r.sel, ':focus-visible')));
      return { label: window.__vqa.label(e), active: act.map((r) => r.text.slice(0, 160)), focusVisible: fv.length, transition: getComputedStyle(e).transitionDuration };
    });
    const hover = rules.filter((r) => r.sel.includes(':hover')).map((r) => {
      const targets = strip(r.sel, ':hover');
      let els = [];
      for (const t of targets) { try { els.push(...document.querySelectorAll(t)); } catch {} }
      const nonInteractive = els.filter((e) => !e.closest('a, button, [role=button]'));
      const changesVisibility = /display|opacity|visibility/.test(r.text.split('{')[1] || '');
      return { sel: r.sel, media: r.media, inFineHover: /hover:\\s*hover/.test(r.media) && /pointer:\\s*fine/.test(r.media), nonInteractive: nonInteractive.length, changesVisibility, text: r.text.slice(0, 200) };
    });
    const print = rules.filter((r) => /print/.test(r.media)).map((r) => r.text);
    const mediaCount = {};
    for (const r of rules) if (r.media) mediaCount[r.media] = (mediaCount[r.media] || 0) + 1;
    return { per, hover, print, mediaCount };
  })()`);
  // Tab 포커스 링
  await key(v, "Tab");
  await Bun.sleep(150);
  ix.focusRing = await J(v, "(() => { const e = document.activeElement; if (!e || e === document.body) return null; const s = getComputedStyle(e); return { label: window.__vqa.label(e), style: s.outlineStyle, width: parseFloat(s.outlineWidth) || 0, color: s.outlineColor, bg: getComputedStyle(e.parentElement || e).backgroundColor, boxShadow: s.boxShadow }; })()");
  close(v);
});

if (want("ONB-01", "ONB-02", "ONB-03", "ONB-04")) await phase("안내·세로 휴대폰", async () => {
  const out: any = {};
  const hintJs = "[...document.querySelectorAll('body *')].filter((e) => !e.closest('.slide') && !e.closest('button') && e.children.length < 4 && e.getBoundingClientRect().width > 0 && getComputedStyle(e).visibility !== 'hidden' && Number(getComputedStyle(e).opacity) > 0.05 && /(넘기|스와이프|밀어|화살표|키보드|Space|가로로|회전|돌리|←|→)/.test(e.textContent)).map((e) => ({ text: e.textContent.trim().slice(0, 80), label: window.__vqa.label(e) }))";
  const uiTextJs = "[...document.querySelectorAll('body *')].filter((e) => !e.closest('.slide') && e.getBoundingClientRect().width > 0 && getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e).display !== 'none').map((e) => [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('') + (getComputedStyle(e, '::after').content || '').replace(/^none$|^normal$/, '') + (e.getAttribute('aria-label') || '')).join(' ')";
  // 데스크톱 첫 방문
  {
    const v = await mk(1920, 1080);
    await open(v, url("", ""), 600);
    out.desktopHint = await J(v, hintJs);
    out.desktopUi = await J(v, uiTextJs);
    const st = await J<any>(v, "window.__vqa.stage()");
    out.load = { cur: st.cur, side: st.sides[0], dialogs: st.dialogs, fixed: st.fixed, cover: await J(v, "(() => { const h = document.querySelector('.cover h1'); const r = h.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; })()") };
    out.status = await fetch(base).then((r) => r.status);
    if (out.desktopHint.length) {
      await key(v, "ArrowRight");
      await Bun.sleep(600);
      out.afterMove = await J(v, hintJs);
      await v.reload(); await settle(v); await inject(v); await Bun.sleep(600);
      out.afterReload = await J(v, hintJs);
      await key(v, "?"); await Bun.sleep(300);
      out.afterQuestion = await J(v, hintJs);
    }
    close(v);
  }
  // localStorage가 throw할 때
  {
    const v = await mk(1440, 900, { preload: "Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('blocked', 'SecurityError'); } });" });
    await open(v, url("", "1"), 500);
    await key(v, "ArrowRight");
    await Bun.sleep(300);
    out.lsThrowErrors = await watchErr(v);
    close(v);
  }
  // 터치 세로 → 가로
  for (const [w, h] of [[390, 844], [375, 812]] as const) {
    const v = await mk(w, h, { mobile: true, touch: true });
    await open(v, url("", "10"), 500);
    const portrait = { hint: await J(v, hintJs), ui: await J(v, uiTextJs), body: await J(v, "document.body.className"), cur: await cur(v) };
    const s1 = await shot(v, `onb03-${w}x${h}-portrait`);
    await v.cdp("Emulation.setDeviceMetricsOverride", { width: h, height: w, deviceScaleFactor: 1, mobile: true, screenOrientation: { type: "landscapePrimary", angle: 90 } });
    await J(v, "(() => { window.dispatchEvent(new Event('resize')); return 1; })()");
    await Bun.sleep(500);
    const st = await J<any>(v, "window.__vqa.stage()");
    const landscape = { hint: await J(v, hintJs), k: st.k, cur: st.cur, deck: st.deck, vw: st.vw, vh: st.vh };
    const s2 = await shot(v, `onb03-${h}x${w}-landscape`);
    out[`${w}x${h}`] = { portrait, landscape, shots: [shotRel(s1.jpg), shotRel(s2.jpg)] };
    close(v);
  }
  // ?check·?slide 렌더에 안내가 없는지
  {
    const v = await mk(1920, 1080);
    await open(v, url("slide=1"), 300);
    out.renderHint = await J(v, hintJs);
    close(v);
  }
  ix.onb = out;
});

if (want("RSP-03")) await phase("확대 200%", async () => {
  const v = await mk(720, 450, { dpr: 2 });
  await open(v, url("", "10"), 400);
  const st = await J<any>(v, "window.__vqa.stage()");
  const s = await shot(v, "rsp03-1440x900-zoom200");
  ix.zoom = { deck: st.deck, vw: st.vw, vh: st.vh, shot: shotRel(s.jpg), meta: await J(v, "document.querySelector('meta[name=viewport]')?.content || ''") };
  close(v);
});

if (want("RSP-04")) await phase("첫 페인트(anime 2초 지연)", async () => {
  const v = await mk(1440, 900);
  await v.cdp("Page.navigate", { url: url("", "", "/slowanime") });
  await Bun.sleep(500);
  const early = await J(v, "({ visible: [...document.querySelectorAll('.slide')].filter((s) => { const r = s.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && getComputedStyle(s).visibility !== 'hidden' && Number(getComputedStyle(s).opacity) > 0; }).length, scrollX: document.documentElement.scrollWidth > innerWidth, stage: document.body.classList.contains('stage') })").catch((e) => ({ error: String(e) }));
  const p1 = join(tmpDir, "rsp04-early.png");
  await Bun.write(p1, await v.screenshot());
  await Bun.sleep(3000);
  await settle(v).catch(() => 0);
  const p2 = join(tmpDir, "rsp04-final.png");
  await Bun.write(p2, await v.screenshot());
  const deck = await J<any>(v, "(() => { const r = document.querySelector('.deck').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; })()");
  const [d] = await py([{ op: "diff", a: p1, b: p2, outside: [deck] }, { op: "jpg", src: p1, dst: join(shotsDir, "rsp04-early.jpg"), q: 80 }]);
  ix.firstPaint = { early, diffOutsideCover: d, shot: "shots/" + label + "/rsp04-early.jpg" };
  close(v);
});

if (want("MOT-01", "MOT-02", "MOT-03")) await phase("모션(전환·글줄·재방문)", async () => {
  const v = await mk(1440, 900);
  await open(v, url("", "5"), 800);
  const sampler = (dir: string) => `(() => new Promise((res) => {
    const slides = [...document.querySelectorAll('.slide')];
    const from = window.__deckCurrentSlide();
    const to = from + (${dir === "fwd" ? 1 : -1});
    const frames = [];
    const tx = (s) => { const m = getComputedStyle(s).transform; if (!m || m === 'none') return 0; return Number(m.match(/matrix\\(([^)]+)\\)/)[1].split(',')[4]); };
    const blur = (s) => { const m = getComputedStyle(s).filter.match(/blur\\(([\\d.]+)px\\)/); return m ? Number(m[1]) : 0; };
    let n = 0;
    const tick = () => { frames.push({ incoming: tx(slides[to]), outgoing: tx(slides[from]), blurIn: blur(slides[to]) }); if (++n < 4) requestAnimationFrame(tick); else res(frames); };
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '${dir === "fwd" ? "ArrowRight" : "ArrowLeft"}', bubbles: true, cancelable: true }));
    requestAnimationFrame(tick);
  }))()`;
  const fwd = await J(v, sampler("fwd"));
  await Bun.sleep(600);
  const bwd = await J(v, sampler("bwd"));
  const dur = await J(v, "(() => { const s = getComputedStyle(document.querySelector('.slide')); return { property: s.transitionProperty, duration: s.transitionDuration, distance: getComputedStyle(document.documentElement).getPropertyValue('--page-slide-distance').trim(), blur: getComputedStyle(document.documentElement).getPropertyValue('--page-blur').trim() }; })()");
  // 글줄·차트 시간
  const timing = await J(v, `(() => {
    const ms = (s) => s.split(',').map((x) => x.trim().endsWith('ms') ? parseFloat(x) : parseFloat(x) * 1000);
    const slides = [...document.querySelectorAll('.slide')];
    const lines = slides.map((s, i) => { const ls = [...s.querySelectorAll('.t-stagger-line')].map((e) => ({ d: Math.max(...ms(getComputedStyle(e).transitionDelay)), u: Math.max(...ms(getComputedStyle(e).transitionDuration)) })); const ds = [...new Set(ls.map((l) => l.d))].sort((a, b) => a - b); return { n: i + 1, end: ls.length ? Math.max(...ls.map((l) => l.d + l.u)) : 0, step: ds.length > 1 ? ds[1] - ds[0] : null }; });
    const tls = [...(window.__motion?.timelines?.entries?.() || [])].map(([s, tl]) => ({ n: slides.indexOf(s) + 1, duration: tl.duration })).filter((x) => x.duration > 0);
    return { lines, tls };
  })()`);
  // 차트 장에 들어가 200ms 뒤 넘기기
  await open(v, url("", "6"), 600);
  await key(v, "ArrowRight");
  await Bun.sleep(200);
  const tIn = await J(v, "(() => { window.__t0 = performance.now(); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })); return { cur: window.__deckCurrentSlide(), ms: performance.now() - window.__t0 }; })()");
  await Bun.sleep(50);
  const leftTl = await J(v, "(() => { const s = document.querySelectorAll('.slide')[6]; const tl = window.__motion?.timelines?.get(s); return tl ? { paused: tl.paused, completed: tl.completed, t: tl.currentTime, d: tl.duration } : null; })()");
  // 재방문
  await open(v, url("", "3"), 1600);
  await key(v, "ArrowRight");
  await Bun.sleep(1600);
  await key(v, "ArrowLeft");
  await Bun.sleep(50);
  const revisit = await J(v, "(() => { const s = document.querySelectorAll('.slide')[2]; const ls = [...s.querySelectorAll('.t-stagger-line')]; return { notOpaque: ls.filter((e) => Number(getComputedStyle(e).opacity) < 0.999).length, lines: ls.length }; })()");
  await Bun.sleep(1600);
  await key(v, "r");
  await Bun.sleep(50);
  const afterR = await J(v, "(() => { const s = document.querySelectorAll('.slide')[window.__deckCurrentSlide()]; const l = s.querySelector('.t-stagger-line'); return l ? Number(getComputedStyle(l).opacity) : null; })()");
  await Bun.sleep(1600);
  const btn = (await findButtons(v, "다시 재생|재생"))[0];
  let space: any = null;
  if (btn) {
    const c0 = await cur(v);
    await click(v, btn.x, btn.y);
    await Bun.sleep(100);
    await key(v, " ");
    await Bun.sleep(300);
    space = { from: c0, to: await cur(v) };
  }
  ix.motion = { fwd, bwd, dur, timing, interrupt: { ...tIn, leftTl }, revisit, afterR, space, errors: await watchErr(v) };
  close(v);
});

if (want("MOT-06")) await phase("모션 감소", async () => {
  const v = await mk(1440, 900, { reduce: true });
  await open(v, url("", "4"), 600);
  const trans = await J(v, "(() => { const s = getComputedStyle(document.querySelector('.slide')); return { property: s.transitionProperty, duration: s.transitionDuration }; })()");
  const samp = await J(v, `(() => new Promise((res) => { const slides = [...document.querySelectorAll('.slide')]; const to = window.__deckCurrentSlide() + 1; const fr = []; let n = 0;
    const tick = () => { const cs = getComputedStyle(slides[to]); fr.push({ t: cs.transform, f: cs.filter }); if (++n < 4) requestAnimationFrame(tick); else res(fr); };
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })); requestAnimationFrame(tick); }))()`);
  const p0 = join(tmpDir, "mot06-0ms.png");
  await Bun.write(p0, await v.screenshot());
  await Bun.sleep(2000);
  const p1 = join(tmpDir, "mot06-2000ms.png");
  await Bun.write(p1, await v.screenshot());
  const anims = await J(v, "document.getAnimations().filter((a) => a.playState === 'running' && /transform/.test(JSON.stringify(a.effect?.getKeyframes?.() || []))).length");
  await open(v, url("", "1"), 300);
  await J(v, "(() => { window.__on = 0; new MutationObserver((ms) => { for (const m of ms) if (m.target.classList.contains('on') && !(m.oldValue || '').split(/\\s+/).includes('on')) window.__on++; }).observe(document.querySelector('.cover .object'), { attributes: true, subtree: true, attributeFilter: ['class'], attributeOldValue: true }); return 1; })()");
  await Bun.sleep(6000);
  const coverChanges = await J(v, "window.__on");
  const [d] = await py([{ op: "diff", a: p0, b: p1 }]);
  ix.reduce = { trans, samples: samp, diff: d, anims, coverChanges, errors: await watchErr(v) };
  close(v);
});

if (want("MOT-07")) await phase("표지 30초 대기", async () => {
  const v = await mk(1440, 900);
  await open(v, url("", "1"), 300);
  await J(v, "(() => { window.__on = 0; new MutationObserver((ms) => { for (const m of ms) if (m.target.classList.contains('on') && !(m.oldValue || '').split(/\\s+/).includes('on')) window.__on++; }).observe(document.querySelector('.cover .object'), { attributes: true, subtree: true, attributeFilter: ['class'], attributeOldValue: true }); return 1; })()");
  await Bun.sleep(30000);
  const changes = await J<number>(v, "window.__on");
  const running = await J(v, "document.getAnimations().filter((a) => a.playState === 'running').length");
  const curAfter = await cur(v);
  await J(v, "(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); window.__on = 0; return 1; })()");
  await Bun.sleep(12000);
  const hiddenChanges = await J<number>(v, "window.__on");
  ix.idleCover = { changes, running, curAfter, hiddenChanges };
  close(v);
});

if (want("MOT-10")) await phase("CPU 4배 감속 프레임", async () => {
  const v = await mk(390, 844, { mobile: true, touch: true });
  await v.cdp("Emulation.setCPUThrottlingRate", { rate: 4 });
  await open(v, url("", "5"), 800);
  await J(v, "(() => { window.__fr = []; let last = performance.now(); const tick = (t) => { window.__fr.push(t - last); last = t; if (window.__fr.length < 5000) requestAnimationFrame(tick); }; requestAnimationFrame(tick); return 1; })()");
  for (let i = 0; i < 5; i++) { await key(v, "ArrowRight"); await Bun.sleep(1200); }
  const fr = await J<number[]>(v, "window.__fr.slice(1)");
  await v.cdp("Emulation.setCPUThrottlingRate", { rate: 1 });
  const long = fr.filter((x) => x > 50).length;
  const avg = fr.length ? 1000 / (fr.reduce((a, b) => a + b, 0) / fr.length) : 0;
  ix.perf = { frames: fr.length, long, worst: Math.max(0, ...fr), fps: Math.round(avg * 10) / 10 };
  close(v);
});

if (want("MOT-11")) await phase("빌드 도중 탭 숨김", async () => {
  const v = await mk(1440, 900);
  await open(v, url("", "6"), 600);
  await key(v, "ArrowRight");
  await Bun.sleep(60);
  const vis = (hidden: boolean) => J(v, `(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => ${hidden} }); Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => '${hidden ? "hidden" : "visible"}' }); document.dispatchEvent(new Event('visibilitychange')); return 1; })()`);
  await vis(true);
  await Bun.sleep(10000);
  await vis(false);
  await Bun.sleep(100);
  const early = await J<number>(v, "(() => { const tl = window.__motion?.timelines?.get(document.querySelectorAll('.slide')[6]); return tl ? tl.currentTime : null; })()");
  const left = await J<any>(v, "(() => { const tl = window.__motion?.timelines?.get(document.querySelectorAll('.slide')[6]); return tl ? tl.duration - tl.currentTime : 0; })()");
  const waitMs = Math.round(Math.max(0, left) + 1000);
  await Bun.sleep(waitMs);
  ix.frozen = { waitMs, early, ...(await J(v, "(() => { const s = document.querySelectorAll('.slide')[6]; const tl = window.__motion?.timelines?.get(s); return { cur: window.__deckCurrentSlide(), t: tl?.currentTime ?? null, d: tl?.duration ?? null, dash: [...s.querySelectorAll('polyline')].map((p) => getComputedStyle(p).strokeDashoffset) }; })()")) };
  close(v);
});

if (want("A11Y-01", "A11Y-02")) await phase("포커스·알림", async () => {
  const v = await mk(1440, 900);
  await open(v, url("", "9"), 500);
  const st = await J<any>(v, "window.__vqa.stage()");
  const where: any[] = [];
  for (let i = 0; i < 40; i++) {
    await key(v, "Tab");
    where.push(await J(v, "(() => { const e = document.activeElement; if (!e || e === document.body) return 'body'; const s = e.closest('.slide'); if (!s) return 'outside-slide'; return [...document.querySelectorAll('.slide')].indexOf(s) === window.__deckCurrentSlide() ? 'current' : 'other:' + ([...document.querySelectorAll('.slide')].indexOf(s) + 1); })()"));
  }
  await open(v, url("", "3"), 400);
  const live: any[] = [];
  for (const k of ["ArrowRight", "ArrowRight", "ArrowLeft"]) { await key(v, k); await Bun.sleep(250); live.push({ cur: await cur(v), live: (await J<any>(v, "window.__vqa.stage()")).live }); }
  ix.focus = { inert: st.inert, removed: st.removed, cur: st.cur, where, live };
  close(v);
});

if (want("A11Y-05")) await phase("JS 끔·anime 차단·이미지 차단", async () => {
  const out: any = {};
  {
    const v = await mk(1920, 1080);
    await v.cdp("Emulation.setScriptExecutionDisabled", { value: true });
    await v.navigate(url("", ""));
    await Bun.sleep(1200);
    await v.cdp("Emulation.setScriptExecutionDisabled", { value: false });
    out.nojs = await J(v, "(() => { const charts = [...document.querySelectorAll('[data-chart]')]; return { slides: document.querySelectorAll('.slide').length, emptyCharts: charts.filter((c) => !c.querySelector('svg')).map((c) => c.dataset.chart), noscript: document.querySelectorAll('noscript').length, hiddenText: [...document.querySelectorAll('.slide *')].filter((e) => e.childNodes.length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && Number(getComputedStyle(e).opacity) < 1).length }; })()");
    const s = await shot(v, "a11y05-nojs");
    out.nojs.shot = shotRel(s.jpg);
    close(v);
  }
  {
    const v = await mk(1440, 900);
    await v.navigate(url("", "7", "/noanime"));
    await Bun.sleep(1500);
    const before = await cur(v).catch(() => -1);
    await key(v, "ArrowRight");
    await Bun.sleep(400);
    out.noanime = { errors: await watchErr(v), before, after: await cur(v).catch(() => -1), svgs: await J(v, "document.querySelectorAll('[data-chart] svg').length"), hiddenText: await J(v, "(() => { const s = document.querySelectorAll('.slide')[window.__deckCurrentSlide ? window.__deckCurrentSlide() : 0]; return [...s.querySelectorAll('.t-stagger-line')].filter((e) => Number(getComputedStyle(e).opacity) < 1).length; })()") };
    const s = await shot(v, "a11y05-noanime-s8");
    out.noanime.shot = shotRel(s.jpg);
    close(v);
  }
  {
    const shifts: any[] = [];
    for (const n of [1, 2, 9, 18, 22]) {
      const v = await mk(1920, 1080);
      await v.navigate(url(`slide=${n}`, "", "/noimg"));
      await Bun.sleep(900);
      await inject(v);
      const a = await J<any>(v, "window.__vqa.slide()");
      close(v);
      const b = D.slides[n];
      if (!b) continue;
      const moved = a.blocks.map((x: any, i: number) => (b.blocks[i] ? Math.max(Math.abs(x.rect.x - b.blocks[i].rect.x), Math.abs(x.rect.y - b.blocks[i].rect.y), Math.abs(x.rect.h - b.blocks[i].rect.h)) : 0));
      shifts.push({ n, maxShift: Math.max(0, ...moved), imgs: a.images.length, altsEmpty: a.images.filter((i: any) => i.hasAlt && !i.alt).length });
    }
    out.noimg = shifts;
  }
  ix.degraded = out;
});

if (want("A11Y-06")) await phase("출처 드래그 선택", async () => {
  const v = await mk(1440, 900);
  await open(v, url("", "7"), 600);
  const r = await J<any>(v, "(() => { const s = document.querySelectorAll('.slide')[6].querySelector('.source, .chart-src'); if (!s) return null; const b = s.getBoundingClientRect(); return { x0: b.left + 2, x1: b.right - 2, y: b.top + b.height / 2 }; })()");
  let sel = "";
  if (r) {
    await v.cdp("Input.dispatchMouseEvent", { type: "mousePressed", x: r.x0, y: r.y, button: "left", clickCount: 1 });
    for (let i = 1; i <= 8; i++) await v.cdp("Input.dispatchMouseEvent", { type: "mouseMoved", x: r.x0 + ((r.x1 - r.x0) * i) / 8, y: r.y, button: "left" });
    await v.cdp("Input.dispatchMouseEvent", { type: "mouseReleased", x: r.x1, y: r.y, button: "left", clickCount: 1 });
    sel = await J(v, "String(getSelection())");
  }
  ix.select = { rect: r, selected: sel };
  close(v);
});

if (want("PERF-01", "TYP-14", "PERF-02", "PERF-03")) await phase("느린 회선(Slow 4G 근사)·첫 로드", async () => {
  const obs = "window.__lcp = 0; window.__cls = 0; try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch (e) {}";
  {
    const v = await mk(390, 844, { mobile: true, touch: true, preload: obs });
    await v.cdp("Network.enable", {});
    await v.cdp("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    await v.cdp("Emulation.setCPUThrottlingRate", { rate: 4 });
    const start = Date.now();
    await v.cdp("Page.navigate", { url: url("", "") });
    let fontAt: number | null = null;
    for (let i = 0; i < 120; i++) {
      await Bun.sleep(100);
      const ok = await J(v, "document.fonts && document.fonts.check('700 80px \"Pretendard Variable\"') && [...document.fonts].some((f) => f.status === 'loaded')").catch(() => false);
      if (ok) { fontAt = Date.now() - start; break; }
    }
    await Bun.sleep(2500);
    const m = await J(v, "({ lcp: window.__lcp, cls: window.__cls, fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null, transfer: (performance.getEntriesByType('navigation')[0]?.transferSize || 0) + performance.getEntriesByType('resource').reduce((a, r) => a + (r.transferSize || 0), 0), resources: performance.getEntriesByType('resource').map((r) => ({ name: r.name.replace(location.origin, ''), size: r.transferSize })) })");
    await v.cdp("Network.emulateNetworkConditions", { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
    await v.cdp("Emulation.setCPUThrottlingRate", { rate: 1 });
    ix.slow = { ...m, fontAt, preload: await J(v, "[...document.querySelectorAll('link[rel=preload]')].map((l) => ({ href: l.getAttribute('href'), as: l.as, crossorigin: l.crossOrigin }))") };
    close(v);
  }
  {
    const v = await mk(1440, 900, { preload: obs });
    await open(v, url("", "1"), 800);
    const n2 = await J(v, "[...document.querySelectorAll('.slide')[1].querySelectorAll('img')].map((i) => i.complete && i.naturalWidth > 0)");
    const first = await J(v, "({ origins: [...new Set(performance.getEntriesByType('resource').map((r) => new URL(r.name).origin))], cookie: document.cookie, iframes: document.querySelectorAll('iframe').length, autoplay: document.querySelectorAll('video[autoplay], audio[autoplay], audio').length, scripts: [...document.scripts].map((s) => s.getAttribute('src')).filter(Boolean) })");
    close(v);
    const w = await mk(1440, 900, { preload: obs });
    await w.navigate(url("", "1", "/slowimg"));
    await Bun.sleep(300);
    await J(w, PAGE_JS).catch(() => 0);
    const c0 = await cur(w).catch(() => -1);
    await J(w, "(() => { window.__cls = 0; return 1; })()").catch(() => 0); // 로드 중 이동은 빼고 첫 넘김 뒤 이동만 센다
    await key(w, "ArrowRight");
    await Bun.sleep(300);
    const c1 = await cur(w).catch(() => -1);
    await Bun.sleep(3500);
    ix.preload = { nextComplete: n2, slowImgMove: { from: c0, to: c1 }, cls: await J(w, "window.__cls") };
    ix.firstLoad = first;
    close(w);
  }
});

if (want("PRT-01")) await phase("인쇄·PDF", async () => {
  const v = await mk(1920, 1080);
  await open(v, url("", "5"), 600);
  await v.cdp("Emulation.setEmulatedMedia", { media: "print" });
  await Bun.sleep(200);
  const printState = await J(v, "({ dimLines: [...document.querySelectorAll('.t-stagger-line')].filter((e) => Number(getComputedStyle(e).opacity) < 0.999).length, controls: [...document.querySelectorAll('button')].filter((b) => getComputedStyle(b).display !== 'none').length })");
  await v.cdp("Emulation.setEmulatedMedia", { media: "" });
  const { data } = await v.cdp("Page.printToPDF", { preferCSSPageSize: true, printBackground: true });
  const pdf = join(tmpDir, "print.pdf");
  await Bun.write(pdf, Buffer.from(data, "base64"));
  const info = await run(["pdfinfo", pdf]);
  const pages = Number(info.out.match(/Pages:\s+(\d+)/)?.[1] ?? 0);
  const texts: string[] = [];
  for (let p = 1; p <= pages; p++) texts.push((await run(["pdftotext", "-f", String(p), "-l", String(p), "-layout", pdf, "-"])).out);
  let p7: any = null;
  if (pages >= 7 && D.shots[7]) {
    const r = await run(["pdftoppm", "-f", "7", "-l", "7", "-r", "72", "-png", pdf, join(tmpDir, "pdf-p")]);
    const f = readdirSync(tmpDir).find((x) => x.startsWith("pdf-p") && x.endsWith(".png"));
    if (f) {
      const [d, , ] = await py([{ op: "diff", a: D.shots[7].png, b: join(tmpDir, f), tol: 24 }, { op: "jpg", src: join(tmpDir, f), dst: join(shotsDir, "prt01-pdf-p07.jpg"), q: 80 }]);
      p7 = { diff: d, shot: `shots/${label}/prt01-pdf-p07.jpg`, code: r.code };
    }
  }
  // 꺾은선이 있는 쪽마다 PDF 래스터(1920×1080)와 ?slide=n 렌더에서 선 구간 안쪽 점의 선 색을 대조한다(선 끝점까지 그려졌는지)
  const lineTasks: any[] = [];
  const lineMeta: any[] = [];
  for (let n = 1; n <= Math.min(pages, total); n++) {
    const s = D.slides[n];
    if (!s || !D.shots[n]) continue;
    const lines = s.svgs.flatMap((v: any) => v.polylines.filter((pl: any) => pl.pts.length >= 2 && pl.stroke && pl.stroke !== "none" && (pl.stroke.match(/[\d.]+/g) ?? []).length >= 3).map((pl: any) => ({ chart: v.chart ?? v.cls, cls: pl.cls, color: pl.stroke.match(/[\d.]+/g).slice(0, 3).map(Number), pts: pl.pts })));
    if (!lines.length) continue;
    const pre = join(tmpDir, `pdf-line-${n}`);
    const r = await run(["pdftoppm", "-f", String(n), "-l", String(n), "-singlefile", "-scale-to-x", "1920", "-scale-to-y", "1080", "-png", pdf, pre]);
    if (r.code !== 0 || !existsSync(pre + ".png")) continue;
    lineTasks.push({ op: "linecheck", a: D.shots[n].png, b: pre + ".png", lines });
    lineTasks.push({ op: "jpg", src: pre + ".png", dst: join(shotsDir, `prt01-pdf-p${String(n).padStart(2, "0")}.jpg`), q: 80, maxw: 1920 });
    lineMeta.push({ n, lines: lines.map((l: any) => `${l.chart}:${l.cls}`), shot: `shots/${label}/prt01-pdf-p${String(n).padStart(2, "0")}.jpg` });
  }
  const lr = await py(lineTasks);
  const lineCheck = lineMeta.map((m, i) => ({ ...m, res: lr[i * 2] }));
  ix.print = { pages, printState, texts, p7, lineCheck };
  close(v);
});

if (want("CON-05")) await phase("forced-colors·prefers-contrast", async () => {
  const shots: string[] = [];
  const bounds: any[] = [];
  for (const [name, features] of [["forced", [{ name: "forced-colors", value: "active" }]], ["more", [{ name: "prefers-contrast", value: "more" }]]] as const) {
    const v = await mk(1920, 1080);
    await v.cdp("Emulation.setEmulatedMedia", { features });
    for (const n of [1, 7, 13, 17]) {
      await open(v, url(`slide=${n}`), 200);
      shots.push(shotRel((await shot(v, `con05-${name}-s${String(n).padStart(2, "0")}`)).jpg));
      // 라벨 알약·카드의 경계가 테두리·외곽선으로 남는지(강제 색 모드에서는 box-shadow와 배경색이 지워진다)
      if (name === "forced") bounds.push({ n, items: await J(v, `[...document.querySelectorAll('.slide:not([hidden]) :is(.tag, .kicker, .pill, .card, .chart, .sowe, .tile)')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && getComputedStyle(e).visibility !== 'hidden'; }).map((e) => { const s = getComputedStyle(e); const border = ['Top','Right','Bottom','Left'].some((k) => parseFloat(s['border' + k + 'Width']) >= 1 && s['border' + k + 'Style'] !== 'none'); const outline = parseFloat(s.outlineWidth) >= 1 && s.outlineStyle !== 'none'; return { label: window.__vqa.label(e), border, outline, shadow: s.boxShadow }; })`) });
    }
    close(v);
  }
  ix.forced = shots;
  ix.forcedBounds = bounds;
});

if (publicUrl) await phase("공개 URL", async () => {
  const v = await mk(1920, 1080);
  await v.navigate(publicUrl);
  await settle(v).catch(() => 0);
  await Bun.sleep(1500);
  ix.public = await J(v, "({ slides: document.querySelectorAll('.slide').length, fonts: document.fonts.status, pretendard: document.fonts.check('700 48px \"Pretendard Variable\"'), emptySvg: [...document.querySelectorAll('[data-chart]')].filter((c) => !c.querySelector('svg')).length })");
  close(v);
});

for (const v of views) close(v);
server.stop();

// 스크린샷 JPG 변환
if (jpgQueue.length) await phase("스크린샷 JPG 변환", () => py(jpgQueue));
// 컨택트시트
// RSP-02: 장 렌더를 480×270으로 줄여 쪽 번호를 OCR로 읽는다
if (Object.keys(D.shots).length && want("RSP-02")) await phase("480×270 쪽 번호 OCR", async () => {
  const ns = Object.keys(D.shots).map(Number).sort((a, b) => a - b);
  const dir = join(tmpDir, "r480");
  await mkdir(dir, { recursive: true });
  const small = await py(ns.map((n) => ({ op: "jpg", src: D.shots[n].png, dst: join(dir, `slide-${String(n).padStart(2, "0")}.png`), maxw: 480 })));
  const outs = await ocrRun(small);
  if (!outs) { D.ix.r480 = { available: false, reason: ocrWhy }; return; }
  D.ix.r480 = { available: true, pages: ns.map((n, i) => ({ n, pg: D.slides[n]?.pgText ?? null, read: (outs[i]?.recognized ?? []).map((l: any) => ({ text: l.text, conf: Math.round(l.conf * 100) / 100, box: l.box })) })) };
});
if (Object.keys(D.shots).length && want("STD-05", "LAY-07", "LAY-09", "STD-06")) await phase("컨택트시트", async () => {
  const pngs = Object.keys(D.shots).map(Number).sort((a, b) => a - b).map((n) => D.shots[n].png);
  const r = await run([PY, join(import.meta.dir, "contact-sheet.py"), "--out", join(shotsDir, "contact.jpg"), "--cols", "2", "--width", "960", ...pngs]);
  D.ix.contact = r.code === 0 ? r.out.split("\n").filter(Boolean).map((p) => relative(qaDir, p)) : { error: r.err };
  const prevDir = compareLabel ? join(qaDir, "shots", compareLabel) : join(qaDir, "before");
  if (existsSync(prevDir)) {
    const pairs = Object.keys(D.shots).map(Number).sort((a, b) => a - b).map((n) => [join(prevDir, `slide-${String(n).padStart(2, "0")}.jpg`), D.shots[n].png]).filter(([a]) => existsSync(a));
    if (pairs.length) {
      const c = await run([PY, join(import.meta.dir, "contact-sheet.py"), "--out", join(shotsDir, "compare.jpg"), "--pairs", "--width", "960", ...pairs.flat()]);
      D.ix.compareSheet = c.code === 0 ? c.out.split("\n").filter(Boolean).map((p) => relative(qaDir, p)) : { error: c.err };
    }
  }
});
// 시뮬레이션(색맹·회색조·프로젝터) — 수동 확인 묶음
if (Object.keys(D.shots).length && want("CHT-04", "CON-04")) await phase("색 모사 이미지", async () => {
  const chartSlides = Object.keys(D.slides).map(Number).filter((n) => D.slides[n]?.svgs?.some((s: any) => s.chart));
  const res = await py(chartSlides.map((n) => ({ op: "simulate", src: D.shots[n].png, dst: join(shotsDir, `sim-${String(n).padStart(2, "0")}`), maxw: 960 })));
  D.ix.sim = Object.fromEntries(chartSlides.map((n, i) => [n, Object.values(res[i] || {}).map((p: any) => relative(qaDir, p))]));
});
// 이미지 ICC·오른쪽 아래 15% 크롭(IMG-02 수동 묶음)
if (want("IMG-02", "IMG-03")) await phase("이미지 파일", async () => {
  const imgs = [...files.imgFiles.map((f) => join(root, "assets/img", f.name)), ...files.photoFiles.map((f) => join(root, "assets/photos", f.name))];
  const tasks: any[] = imgs.map((p) => ({ op: "icc", path: p }));
  const res = await py(tasks);
  const sizes = await Promise.all(imgs.map(async (p) => { const r = await run([PY, "-c", `from PIL import Image;im=Image.open(${JSON.stringify(p)});print(im.width,im.height)`]); return r.out.split(" ").map(Number); }));
  const crops = await py(imgs.map((p, i) => ({ op: "crop", src: p, rect: { x: sizes[i][0] * 0.85, y: sizes[i][1] * 0.85, w: sizes[i][0] * 0.15, h: sizes[i][1] * 0.15 }, dst: join(shotsDir, `img02-${p.split("/").pop()!.replace(/\.\w+$/, "")}-br15.jpg`) })));
  D.ix.imgFiles = imgs.map((p, i) => ({ file: relative(root, p), icc: res[i], size: sizes[i], crop: crops[i] ? relative(qaDir, crops[i]) : null }));
  // IMG-02 OCR: macOS Vision(scripts/ocr_vision.swift)을 원본 전체·3×3 조각(2배)·4×4 평활화 조각(3배)에 돌린다.
  // 작은 글자·어두운 바탕 글자를 놓치지 않으려고 조각을 키워 넣고, 읽힌 상자는 원본 좌표로 되돌린다.
  if (want("IMG-02")) {
    const ocrCmd = await ocrTool();
    if (!ocrCmd) { D.ix.ocr = { available: false, reason: ocrWhy }; return; }
    const tileDir = join(tmpDir, "ocr-tiles");
    await mkdir(tileDir, { recursive: true });
    const tileTasks = imgs.flatMap((p) => { const b = join(tileDir, p.split("/").pop()!.replace(/\.\w+$/, "")); return [{ op: "tiles", src: p, dst: b, grid: 3, scale: 2 }, { op: "tiles", src: p, dst: b, grid: 4, scale: 3, eq: true }]; });
    const tl = await py(tileTasks);
    const inputs: { img: number; path: string; box: number[] }[] = [];
    imgs.forEach((p, i) => { inputs.push({ img: i, path: p, box: [0, 0, sizes[i][0], sizes[i][1]] }); for (const t of [...(tl[i * 2] ?? []), ...(tl[i * 2 + 1] ?? [])]) inputs.push({ img: i, path: t.path, box: t.box }); });
    const outs = await ocrRun(inputs.map((x) => x.path));
    if (!outs) { D.ix.ocr = { available: false, reason: ocrWhy }; return; }
    const hits: any[] = [];
    outs.forEach((o, k) => {
      const inp = inputs[k];
      const [bx, by, bw, bh] = inp.box;
      for (const l of o.recognized ?? []) {
        const box = { x: Math.round(bx + l.box.x * bw), y: Math.round(by + l.box.y * bh), w: Math.round(l.box.w * bw), h: Math.round(l.box.h * bh) };
        hits.push({ file: relative(root, imgs[inp.img]), text: l.text, conf: Math.round(l.conf * 100) / 100, box, from: inp.path === imgs[inp.img] ? "원본" : inp.path.split("/").pop() });
      }
    });
    // 같은 그림의 겹치는 상자는 확신도 높은 것 하나로
    const keep: any[] = [];
    for (const h of hits.sort((a, b) => b.conf - a.conf)) if (!keep.some((k) => k.file === h.file && Math.max(0, Math.min(k.box.x + k.box.w, h.box.x + h.box.w) - Math.max(k.box.x, h.box.x)) * Math.max(0, Math.min(k.box.y + k.box.h, h.box.y + h.box.h) - Math.max(k.box.y, h.box.y)) > 0.3 * Math.min(k.box.w * k.box.h, h.box.w * h.box.h))) keep.push(h);
    // 읽힌 자리 크롭(사람 확인용)
    const cropT = keep.map((h, i) => ({ op: "crop", src: join(root, h.file), rect: { x: h.box.x - h.box.w, y: h.box.y - h.box.h * 2, w: h.box.w * 3, h: h.box.h * 5 }, dst: join(shotsDir, `img02-ocr-${String(i + 1).padStart(2, "0")}.jpg`), maxw: 900 }));
    const cr = await py(cropT);
    keep.forEach((h, i) => { h.crop = cr[i] ? relative(qaDir, cr[i]) : null; });
    D.ix.ocr = { available: true, engine: "macOS Vision VNRecognizeTextRequest(ko-KR, en-US, accurate)", inputs: inputs.length, hits: keep };
  }
});

// ── 판정 ──────────────────────────
let prev: any = null;
if (compareLabel) {
  const pf = join(reportsDir, `${compareLabel}.json`);
  prev = (await Bun.file(pf).exists()) ? JSON.parse(await Bun.file(pf).text()) : null;
  if (!prev) errors.push(`--compare=${compareLabel}: ${relative(repo, pf)} 없음`);
}
D.prev = prev;
const exceptions = (await Bun.file(join(qaDir, "exceptions.json")).exists()) ? JSON.parse(await Bun.file(join(qaDir, "exceptions.json")).text()) : {};
D.exceptions = exceptions;
const results: Result[] = judgeAll(D, criteria);

// 기준과 비교(회귀)
{
  if (prev) {
    const byId = new Map(prev.results.map((r: any) => [r.id, r]));
    for (const r of results) {
      const p: any = byId.get(r.id);
      if (!p) continue;
      const worse = (p.status === "pass" && r.status === "fail") || (r.status === "fail" && p.status === "fail" && (r.items?.length ?? 0) > (p.items?.length ?? 0));
      const newSlides = (r.failedSlides ?? []).filter((n: number) => !(p.failedSlides ?? []).includes(n));
      if (worse || (r.status === "fail" && newSlides.length)) r.regression = { prevStatus: p.status, prevItems: p.items?.length ?? 0, nowItems: r.items?.length ?? 0, newSlides };
      if (p.status === "fail" && r.status === "pass") r.fixed = true;
    }
  }
}

// ── 보고서 ──────────────────────────
const commit = (await run(["git", "rev-parse", "--short", "HEAD"], repo)).out;
const dirty = (await run(["git", "status", "--porcelain", "--", "presentation/index.html", "presentation/src"], repo)).out;
const deckSha = new Bun.CryptoHasher("sha256").update(files.html + Object.values(files.js).join("") + files.tokens + files.deck + files.slides).digest("hex").slice(0, 12);
const methodOf = new Map(criteriaAll.map((c) => [c.id, c.verify_method]));
const autoIds = criteriaAll.filter((c) => c.verify_method !== "visual").map((c) => c.id);
const implemented = results.filter((r) => r.implemented !== "manual").length;
const implementedAuto = results.filter((r) => r.implemented !== "manual" && methodOf.get(r.id) !== "visual").length;
const count = (s: string) => results.filter((r) => r.status === s).length;
const summary = { total: criteriaAll.length, checked: results.length, implemented, implementedAuto, autoTotal: autoIds.length, pass: count("pass"), fail: count("fail"), manual: count("manual"), error: count("error"), regressions: results.filter((r) => r.regression).length };
const report = {
  label, date: new Date().toISOString(), commit, deckDirty: !!dirty, deckSha, seconds: Math.round((Date.now() - t0) / 1000), summary, compare: compareLabel ?? null,
  tools: { python: PY, skill: SKILL, taste: TASTE, net: useNet, publicUrl: publicUrl ?? null, axe: false, lighthouse: false, tesseract: false, ocr: D.ix.ocr?.available ? "macOS Vision" : false },
  ext: Object.fromEntries(Object.entries(ext).map(([k, v]: any) => [k, { cmd: v.cmd, code: v.code, out: String(v.out).slice(0, 4000), err: v.err?.slice(0, 1000) }])),
  phaseErrors: errors, results,
};
// 공개 저장소에 올라가는 보고서라 이 컴퓨터의 절대 경로를 지운다(저장소 → ., 홈 → ~, 임시 폴더 → <tmp>)
const scrub = (t: string) => t.split(repo + "/").join("").split(repo).join(".").split(homedir()).join("~").replace(/\/private\/tmp\/[^"\s|)`]*?\/(sam-env|[^/"\s]+\.py|[^/"\s]+\.ts)/g, "<tmp>/$1").replace(/\/(private\/)?tmp\/claude-[^"\s|)`]*/g, "<tmp>");
await Bun.write(join(reportsDir, `${label}.json`), scrub(JSON.stringify(report, null, 1)));
const { renderMarkdown } = await import("./vqa/report.ts");
await Bun.write(join(reportsDir, `${label}.md`), scrub(renderMarkdown(report, criteriaAll, violations)));
log(`보고서: ${relative(repo, join(reportsDir, label + ".md"))} · 통과 ${summary.pass} · 실패 ${summary.fail} · 수동 ${summary.manual} · 오류 ${summary.error} · ${report.seconds}s`);
console.log(JSON.stringify({ report: relative(repo, join(reportsDir, `${label}.json`)), ...summary }, null, 1));
process.exit(summary.fail + summary.error > 0 ? 1 : 0);

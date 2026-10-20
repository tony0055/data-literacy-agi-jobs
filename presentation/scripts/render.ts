// 장 렌더 + 넘침·잘림·작은 글자 검사(src/fit.js의 ?check 보고)
//   bun scripts/render.ts                         # index.html 전 장 → renders/index/slide-NN.png
//   bun scripts/render.ts --only 5-9              # 5~9장만 → renders/index-05-09/ (범위마다 폴더가 달라 동시에 돌려도 안 겹친다)
//   bun scripts/render.ts --only 12 --out renders/w2   # 출력 폴더를 직접 정한다
//   bun scripts/render.ts design-standard.html    # 확인 화면(한 쪽, 전체 높이) → renders/design-standard.png
//   bun scripts/render.ts --pdf                   # PDF도(요청했을 때만)
//   bun scripts/render.ts --og                    # 공유 미리보기 assets/og.jpg(1200 × 630)를 지금 1장(히어로)으로 다시 찍는다.
//                                                 #   1장을 고치면 이것도 다시 돌린다. 장 위 여백 48만 잘라 1280 × 672(1.905:1)를 0.9375배로 줄인다 — 꼬리말 · 워터마크는 남는다
// 캔버스는 1280 × 720 논리 px, 배율 1.5로 찍어 1920 × 1080 PNG가 된다(--scale로 바꾼다).
import { mkdir } from "node:fs/promises";
import { join, isAbsolute } from "node:path";

const root = join(import.meta.dir, "..");
const argv = Bun.argv.slice(2);
const opt = (name: string) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; };
const flagged = new Set(["--only", "--out", "--scale"]);
const page = argv.find((a, i) => !a.startsWith("--") && !flagged.has(argv[i - 1])) ?? "index.html";
const scale = Number(opt("--scale") ?? 1.5);
const only = opt("--only");
const [from, to] = only ? only.split("-").map(Number) : [0, 0];
const pad = (n: number) => String(n).padStart(2, "0");
const base = page.replace(/\.html$/, "");
const defaultOut = only ? `${base}-${pad(from)}-${pad(to || from)}` : base;
const outArg = opt("--out");
const outDir = outArg ? (isAbsolute(outArg) ? outArg : join(root, outArg)) : join(root, "renders", defaultOut);
const W = 1280, H = 720;

const server = Bun.serve({
  port: 0,
  hostname: "127.0.0.1",
  async fetch(req) {
    const file = Bun.file(join(root, decodeURIComponent(new URL(req.url).pathname)));
    return (await file.exists()) ? new Response(file) : new Response("not found", { status: 404 });
  },
});
const url = `http://127.0.0.1:${server.port}/${page}`;
const view = new Bun.WebView({ width: W, height: H, backend: "chrome" });
const settle = () => view.evaluate(
  "document.fonts.ready.then(() => Promise.all([...document.images].map((im) => im.complete ? 1 : new Promise((r) => { im.onload = im.onerror = r; })))).then(() => document.fonts.check('600 15px \"Pretendard Variable\"'))",
);
await view.navigate("about:blank");
await view.cdp("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: scale, mobile: false });

const isDeck = page === "index.html";

if (argv.includes("--og")) {
  // og:image 1200 × 630 = 장 위 여백(48)을 뺀 1280 × 672를 0.9375배로. 배율 1에서 찍어 JPEG로 바로 쓴다
  await view.cdp("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await view.navigate(`${url}?slide=1`);
  const fontLoaded = await settle();
  const { data } = await view.cdp("Page.captureScreenshot", { format: "jpeg", quality: 88, clip: { x: 0, y: 48, width: W, height: 672, scale: 1200 / W } });
  const file = join(root, "assets", "og.jpg");
  await Bun.write(file, Buffer.from(data, "base64"));
  view.close();
  server.stop();
  console.log(JSON.stringify({ og: file, fontLoaded }, null, 1));
  process.exit(0);
}
let report: unknown = null;
let fontOk: unknown = null;
let count = 0;
const shots: string[] = [];
await mkdir(outDir, { recursive: true });

if (isDeck) {
  await view.navigate(`${url}?check=1${only ? `&only=${from}-${to || from}` : ""}`);
  let raw: string | null = null;
  for (let i = 0; i < 80 && !raw; i++) {
    raw = await view.evaluate("document.getElementById('report')?.textContent || null");
    if (!raw) await Bun.sleep(100);
  }
  report = JSON.parse(raw ?? "null");
  count = Number(await view.evaluate("document.querySelectorAll('.slide').length"));
  const first = only ? from : 1, last = only ? Math.min(count, to || from) : count;
  for (let n = first; n <= last; n++) {
    await view.navigate(`${url}?slide=${n}`);
    fontOk = await settle();
    const file = join(outDir, `slide-${pad(n)}.png`);
    await Bun.write(file, await view.screenshot());
    shots.push(file);
  }
  if (argv.includes("--pdf")) {
    await view.navigate(`${url}?check=1`);
    await settle();
    const { data } = await view.cdp("Page.printToPDF", { preferCSSPageSize: true, printBackground: true });
    await Bun.write(join(root, "renders", `${base}.pdf`), Buffer.from(data, "base64"));
  }
} else {
  // 확인 화면: 쪽 전체 높이로 한 장
  await view.navigate(url);
  // 확인 화면은 차트 데이터·스프라이트를 읽어 넣은 뒤 data-ready를 단다(최대 3초 기다린다)
  for (let i = 0; i < 30 && !(await view.evaluate("document.documentElement.hasAttribute('data-ready')")); i++) await Bun.sleep(100);
  fontOk = await settle();
  const h = Number(await view.evaluate("Math.ceil(document.documentElement.scrollHeight)"));
  await view.cdp("Emulation.setDeviceMetricsOverride", { width: W, height: h, deviceScaleFactor: scale, mobile: false });
  await Bun.sleep(200);
  const file = outArg ? join(outDir, `${base}.png`) : join(root, "renders", `${base}.png`);
  await Bun.write(file, await view.screenshot());
  shots.push(file);
}

view.close();
server.stop();
// issues: fit.js 보고(넘침 over · 잘림 clipped · 제목 줄 수 headLines/allowed · 꼬리말 출처 줄 수 footLines(3줄부터) · 12px 미만 tiny · jsErrors). 빈 배열 = 이 여섯 가지만 통과
console.log(JSON.stringify({ page, slides: count || undefined, range: only ?? "all", scale, outDir, shots: shots.length, fontLoaded: fontOk, issues: report }, null, 1));

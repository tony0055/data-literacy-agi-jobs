import { join } from "node:path";
const root = process.argv[2];
const slidesArg = (process.argv[3] || "7").split(",").map(Number);
const server = Bun.serve({ port: 0, hostname: "127.0.0.1", async fetch(req) { const f = Bun.file(join(root, decodeURIComponent(new URL(req.url).pathname))); return (await f.exists()) ? new Response(f) : new Response("nf", { status: 404 }); } });
const base = `http://127.0.0.1:${server.port}/presentation/index.html`;
const out: any[] = [];
for (const n of slidesArg) {
  const v = new Bun.WebView({ width: 1920, height: 1080, backend: "chrome" });
  await v.navigate("about:blank");
  await v.cdp("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await v.navigate(`${base}#${n - 1}`);
  await Bun.sleep(2500);
  const t0 = Date.now();
  await v.cdp("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowRight", code: "ArrowRight", windowsVirtualKeyCode: 39 });
  await v.cdp("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowRight", code: "ArrowRight", windowsVirtualKeyCode: 39 });
  for (const at of [120, 600, 1100, 1300, 1900, 3500]) {
    const wait = at - (Date.now() - t0); if (wait > 0) await Bun.sleep(wait);
    const r = await v.evaluate(`JSON.stringify((() => { const s=document.querySelectorAll('.slide')[${n - 1}]; const tl=window.__motion.timelines.get(s);
      const c=[...s.querySelectorAll('svg circle')]; const l=[...s.querySelectorAll('svg .vlab, svg .note, svg .slab')]; const r=[...s.querySelectorAll('svg rect:not(.band)')];
      const sc = e => { const m=getComputedStyle(e).transform; return m; };
      return { t: Math.round(tl.currentTime), circles: c.length, circleTransform: c.slice(0,3).map(sc), labelsOpacity: l.slice(0,3).map(e=>getComputedStyle(e).opacity), bars: r.length, barTransform: r.slice(0,2).map(sc) }; })())`);
    out.push({ n, at: Date.now() - t0, ...JSON.parse(String(r)) });
    await Bun.write(join(import.meta.dir, "shots", `order-s${String(n).padStart(2, "0")}-${at}.png`), await v.screenshot());
  }
  v.close();
}
server.stop();
console.log(JSON.stringify(out));

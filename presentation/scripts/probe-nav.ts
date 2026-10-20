// 발표 무대 이동 검사: 키 이동 · 해시(#n) · 개요(G 열기, Esc 닫기) · 조작부가 장과 겹치지 않는지 · 조작부 묶음끼리 겹치지 않는지(키 안내 글 포함)
// · 마지막 장에서 「처음으로」가 보이고 「다음」이 비활성인지 · 키보드로 넘긴 장 전환이 바로인지(MO-03) · 장 안에 모션이 없는지(빌드 · 차트 단계 없앰)
// · 조작부 버튼끼리 겹치지 않는지(모든 모드 — 2회차 CM-01) · 막대 모드에서 두 묶음 버튼의 가운데 높이가 같은지(S-04)
// · 진행 트랙이 무대 바탕과 다른 색인지(S-05) · 장 안 링크 누름 영역이 화면에서 24 이상인지(AC-44, 34장) · JS 오류
// · 장 안 링크끼리 누름 영역이 겹치지 않는지(SP-25, 3회차 SL3-06) · 조작부 쉬는 모양(body.ui-idle)에서 투명도가 없고
//   버튼 · 진행 · 키 안내 글자가 무대 바탕과 4.5:1 이상인지(AC-09, 3회차 H-01 · M-01 · C3-02)
//   bun scripts/probe-nav.ts [폭=1512] [높이=900]
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const width = Number(Bun.argv[2] ?? 1512);
const height = Number(Bun.argv[3] ?? 900);

const server = Bun.serve({
  port: 0,
  hostname: "127.0.0.1",
  async fetch(req) {
    const file = Bun.file(join(root, decodeURIComponent(new URL(req.url).pathname)));
    return (await file.exists()) ? new Response(file) : new Response("not found", { status: 404 });
  },
});
const url = `http://127.0.0.1:${server.port}/index.html`;
const view = new Bun.WebView({ width, height, backend: "chrome" });
await view.navigate("about:blank");
await view.cdp("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
await view.navigate(`${url}#12`);
await view.evaluate("document.fonts.ready");
await Bun.sleep(300);

const result = JSON.parse(await view.evaluate(`(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const slides = [...document.querySelectorAll(".slide")];
  const total = slides.length;
  const cur = () => window.__deckCurrentSlide() + 1;
  const press = async (key) => { document.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })); await wait(30); };
  const root = document.documentElement;
  const deepLink = cur();
  const mode = [...root.classList].find((c) => /^deck-(bar|rail|panel)$/.test(c));
  const k = getComputedStyle(root).getPropertyValue("--deck-k");
  // 조작부가 지금 장과 겹치지 않는가
  const rect = (el) => el.getBoundingClientRect();
  const s = rect(slides[deepLink - 1]);
  const overlaps = [...document.querySelectorAll(".deck-group")].map((g) => { const r = rect(g); return { cls: g.className, top: Math.round(r.top), slideBottom: Math.round(s.bottom), overlap: r.top < s.bottom - 1 && r.bottom > s.top && r.right > s.left && r.left < s.right }; });
  // 조작부 두 묶음 사이(막대 모드): 도구 묶음(키 안내 글 포함) 끝과 이동 묶음 시작 사이 8 이상
  const gap = () => { const u = rect(document.querySelector(".deck-group.util")), n = rect(document.querySelector(".deck-group.nav")); return Math.round(n.left - u.right); };
  const keysShown = () => { const k = document.querySelector(".deck-keys"); return !!k && !k.hidden && getComputedStyle(k).display !== "none"; };
  const gapStart = gap(), keysAtStart = keysShown();
  // 조작부 버튼(보이는 것)끼리 겹치지 않는가 · 막대 모드에서 두 묶음 버튼 가운데 높이가 같은가
  const buttons = () => [...document.querySelectorAll(".deck-group .button, .deck-group .deck-progress")].filter((b) => b.getBoundingClientRect().width > 0);
  const hit = (a, b) => a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5;
  const crossings = () => { const bs = buttons().map(rect); let n = 0; for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) if (hit(bs[i], bs[j])) n++; return n; };
  const centers = () => { const c = (g) => [...document.querySelectorAll(g + " .button")].filter((b) => b.getBoundingClientRect().width > 0).map((b) => { const r = rect(b); return Math.round((r.top + r.bottom) / 2); }); return [...c(".deck-group.util"), ...c(".deck-group.nav")]; };
  const crossStart = crossings(), centersStart = centers();
  const compact = root.classList.contains("deck-compact");
  // 진행 트랙 바탕 ≠ 무대 바탕(막대 모드)
  const track = document.querySelector(".deck-progress .progress__track");
  const trackBg = getComputedStyle(track).backgroundColor, stageBg = getComputedStyle(document.body).backgroundColor;
  // 장 안 모션 없음: 지금 장 안 요소의 전환 시간이 모두 0(장 자체의 전환은 controls.css 몫이라 뺀다)
  const innerMotion = (s) => [...s.querySelectorAll("*")].filter((el) => getComputedStyle(el).transitionDuration.split(",").some((d) => parseFloat(d) > 0)).length;
  const innerStart = innerMotion(slides[deepLink - 1]);
  // 조작부 쉬는 모양: 투명도 1 그대로, 글자 대비(무대 바탕 위) 4.5 이상 — 비활성 버튼은 AC-09 면제라 뺀다
  const rgb = (c) => (c.match(/[\\d.]+/g) || []).slice(0, 4).map(Number);
  const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const bgOf = (el) => { for (let e = el; e; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c.length >= 3 && (c[3] ?? 1) > 0) return c; } return [255, 255, 255]; };
  const opacityOf = (el) => { let o = 1; for (let e = el; e; e = e.parentElement) o *= Number(getComputedStyle(e).opacity); return o; };
  document.body.classList.add("ui-idle");
  await wait(450);
  const idleTargets = [...document.querySelectorAll(".deck-group .button:not([aria-disabled='true']), .deck-progress .progress__label > *, .deck-keys")].filter((x) => x.getBoundingClientRect().width > 0 && getComputedStyle(x).display !== "none");
  const idleContrast = idleTargets.map((x) => ({ who: (x.getAttribute("aria-label") || x.className || x.textContent).slice(0, 24), ratio: Math.round(ratio(rgb(getComputedStyle(x).color), bgOf(x)) * 100) / 100, opacity: Math.round(opacityOf(x) * 100) / 100 }));
  document.body.classList.remove("ui-idle");
  await wait(300);
  await press("Home");
  const down = [cur()];
  for (let i = 0; i < total; i++) { await press("ArrowRight"); down.push(cur()); }
  const hashAtEnd = location.hash;
  const first = document.querySelector(".deck-first");
  const firstShown = !!first && !first.hidden && first.getBoundingClientRect().width > 0;
  const nextDisabled = document.querySelector(".deck-group.nav .button--primary")?.getAttribute("aria-disabled") === "true";
  const gapEnd = gap(), keysAtEnd = keysShown();
  const crossEnd = crossings(), centersEnd = centers();
  const banners = document.querySelectorAll(".banner").length;
  // 키보드로 넘긴 장: 장 전환이 바로(MO-03) — 지금 장의 전환 시간 0
  const instant = getComputedStyle(slides[cur() - 1]).transitionDuration.split(",").every((d) => parseFloat(d) === 0);
  const innerEnd = innerMotion(slides[cur() - 1]);
  // 34장 링크: 화면에서 잰 누름 영역 높이(배율이 걸린 무대 그대로)
  const linkRects = [...slides[cur() - 1].querySelectorAll("a[href]")].map(rect);
  const linkH = linkRects.map((r) => Math.round(r.height * 10) / 10);
  const linkW = linkRects.map((r) => Math.round(r.width * 10) / 10);
  let linkOverlap = 0;
  for (let i = 0; i < linkRects.length; i++) for (let j = i + 1; j < linkRects.length; j++) if (hit(linkRects[i], linkRects[j])) linkOverlap++;
  const up = [];
  for (let i = 0; i < 4; i++) { await press("ArrowLeft"); up.push(cur()); }
  await press("g");
  const overviewOpen = document.body.classList.contains("overview");
  const focusedInOverview = document.activeElement?.classList.contains("slide") ? slides.indexOf(document.activeElement) + 1 : null;
  await press("Escape");
  const overviewClosed = !document.body.classList.contains("overview");
  const afterOverview = cur();
  const visible = slides.filter((x) => getComputedStyle(x).visibility === "visible").length;
  await press("End");
  const end = cur();
  return JSON.stringify({ total, deepLink, mode, compact, k: Number(k), overlaps, gapStart, keysAtStart, gapEnd, keysAtEnd, crossStart, crossEnd, centersStart, centersEnd, trackBg, stageBg, innerStart, innerEnd, linkH, linkW, linkOverlap, idleContrast, down, hashAtEnd, firstShown, nextDisabled, banners, keyboardInstant: instant, up, overviewOpen, focusedInOverview, overviewClosed, afterOverview, visibleAfterClose: visible, end, jsErrors: window.__jsErrors ?? [] });
})()`));

view.close();
server.stop();

const t = result.total;
const expectedDown = Array.from({ length: t + 1 }, (_, i) => Math.min(i + 1, t));
const checks = {
  deepLink: result.deepLink === 12,
  downOk: JSON.stringify(result.down) === JSON.stringify(expectedDown),
  hashOk: result.hashAtEnd === `#${t}`,
  endStateOk: result.firstShown && result.nextDisabled,
  noBanners: result.banners === 0,
  groupsApart: result.mode !== "deck-bar" || (result.gapStart >= 8 && result.gapEnd >= 8),
  keyboardInstant: result.keyboardInstant,
  noInnerMotion: result.innerStart === 0 && result.innerEnd === 0,
  buttonsApart: result.crossStart === 0 && result.crossEnd === 0,
  barCentersAligned: result.mode !== "deck-bar" || [result.centersStart, result.centersEnd].every((c: number[]) => Math.max(...c) - Math.min(...c) <= 1),
  trackVisible: result.mode !== "deck-bar" || result.compact || result.trackBg !== result.stageBg,
  linkHit24: result.linkH.every((h: number) => h >= 24) && result.linkW.every((w: number) => w >= 24),
  linksApart: result.linkOverlap === 0,
  idleContrast: result.idleContrast.length > 0 && result.idleContrast.every((x: { ratio: number; opacity: number }) => x.ratio >= 4.5 && x.opacity === 1),
  upOk: JSON.stringify(result.up) === JSON.stringify([t - 1, t - 2, t - 3, t - 4]),
  overviewOk: result.overviewOpen && result.overviewClosed && result.afterOverview === t - 4 && result.focusedInOverview === t - 4,
  endOk: result.end === t,
  noOverlap: result.overlaps.every((o: { overlap: boolean }) => !o.overlap),
  noJsErrors: result.jsErrors.length === 0,
};
console.log(JSON.stringify({ window: { width, height }, ...result, checks }, null, 1));
process.exit(Object.values(checks).every(Boolean) ? 0 : 1);

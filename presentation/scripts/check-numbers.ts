// 덱 본문(차트 제외 산문)의 모든 숫자가 원본 파일(분석 출력·차트 데이터·조사 문서) 어딘가에 있는지 기계로 대조한다.
import { readdirSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const proj = join(root, "..");
const numbersIn = (s: string) => new Set((s.match(/\d+(?:[.,]\d+)*/g) ?? []).map((n) => String(Number(n.replace(/,/g, "")))));

const files = [
  "chart-data.json", "spec.md",
  ...readdirSync(join(proj, "analysis", "out")).filter((f) => f.endsWith(".json")).map((f) => `analysis/out/${f}`),
  ...readdirSync(join(proj, "research")).filter((f) => f.endsWith(".md")).map((f) => `research/${f}`),
];
const allowed = new Set<string>();
for (const f of files) for (const n of numbersIn(await Bun.file(join(proj, f)).text())) allowed.add(n);

const html = await Bun.file(join(root, "index.html")).text();
const prose = html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&");
const STRUCTURAL = new Set(Array.from({ length: 31 }, (_, i) => String(i)).concat(["100", "1920", "1080"]));
const found = [...numbersIn(prose)];
const unverified = found.filter((n) => !allowed.has(n) && !STRUCTURAL.has(n));
console.log(JSON.stringify({ numbersInDeck: found.length, sourceFiles: files.length, unverified }, null, 1));
if (unverified.length) process.exit(1);

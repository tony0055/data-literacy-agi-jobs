// 덱 본문(차트 제외 산문 + 낭독 글)의 모든 숫자가 원본 파일(분석 출력·차트 데이터·조사 문서) 어딘가에 있는지 기계로 대조한다.
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

// 빌드한 index.html의 화면 글과 낭독 글(차트 데이터 · 스크립트 · 스타일 · 아이콘 스프라이트 · HTML 주석 제외).
// HTML 주석(<!-- … -->)은 화면에도 낭독기에도 나오지 않는 작업 메모라 뺀다(3회차 — 15장 주석의 「124」가 미확인으로 잡혔다).
// 낭독되는 속성 글(aria-label · alt)은 태그를 지우기 전에 꺼내 함께 대조한다. SVG <title> · <desc>는 요소 글이라 그대로 남는다
const html = await Bun.file(join(root, "index.html")).text();
const noCode = html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<!--[\s\S]*?-->/g, " ");
const spoken = [...noCode.matchAll(/\s(?:aria-label|alt)="([^"]*)"/g)].map((m) => m[1]).join(" ");
const prose = `${noCode.replace(/<[^>]+>/g, " ")} ${spoken}`.replace(/&amp;/g, "&");
// 구조 숫자: 0~30(쪽 번호·날짜의 월일 등), 100, 캔버스 크기
const STRUCTURAL = new Set(Array.from({ length: 35 }, (_, i) => String(i)).concat(["100", "1280", "720", "1920", "1080"]));
const found = [...numbersIn(prose)];
const unverified = found.filter((n) => !allowed.has(n) && !STRUCTURAL.has(n));
console.log(JSON.stringify({ numbersInDeck: found.length, sourceFiles: files.length, unverified }, null, 1));
if (unverified.length) process.exit(1);

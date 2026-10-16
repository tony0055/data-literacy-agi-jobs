// visual-qa 보고서(마크다운). 첫 줄은 구현한 조건 수/전체, 이어서 critical 위반이 어느 조건으로 잡혔는지, 회귀, 조건별 결과, 수동 확인 묶음.
const esc = (s: string) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
const link = (p: string) => (p.startsWith("design-standard/") ? `../../presentation/${p}` : /^(shots|before|evidence|pr)\//.test(p) ? `../${p}` : p.startsWith("README") ? "../../README.md" : p);
const icon: Record<string, string> = { pass: "통과", fail: "실패", manual: "수동", error: "오류" };
// both 조건이 자동 부분만 통과한 경우: 통과로 세되 사람 확인이 남았다고 붙인다
const mark = (r: any) => (r.status === "pass" && r.pendingManual ? "통과(자동)·수동 남음" : icon[r.status]);

export function renderMarkdown(rep: any, criteria: any[], violations: any[]) {
  const s = rep.summary;
  const L: string[] = [];
  L.push(`구현 ${s.implemented}/${s.total} 조건 (automated·both ${s.autoTotal}개 중 ${s.implementedAuto}개 자동 판정, visual ${s.total - s.autoTotal}개 중 ${s.implemented - s.implementedAuto}개 부분 자동·${s.total - s.autoTotal - (s.implemented - s.implementedAuto)}개 수동) · 통과 ${s.pass}${s.pendingManual ? `(그중 자동만 통과·수동 확인 남음 ${s.pendingManual})` : ""} · 실패 ${s.fail} · 수동 ${s.manual} · 오류 ${s.error}${rep.compare ? ` · 회귀 ${s.regressions}(기준 ${rep.compare})` : ""}`);
  L.push("");
  L.push(`# 시각 QA 보고서 — ${rep.label}`);
  L.push("");
  // critical 위반 → 조건
  const byId = new Map(rep.results.map((r: any) => [r.id, r]));
  const crit = violations.filter((v) => v.severity === "critical");
  if (crit.length) {
    L.push("## critical 위반을 잡은 조건");
    L.push("");
    L.push("1회차 감사(violations.md)의 critical 4건이 이 검사기의 어느 조건 id로 실패 판정됐는지. '잡은 조건'은 그 위반의 장에서 실패 항목을 낸 조건이다.");
    L.push("");
    L.push("| 위반 | 장 | 잡은 조건 | 이번 판정 | 근거(측정값) |");
    L.push("| --- | --- | --- | --- | --- |");
    for (const v of crit) {
      const rel = v.criterion_ids.map((id: string) => byId.get(id)).filter(Boolean) as any[];
      // 장이 정해진 위반은 그 장의 실패 항목, 또는 위반 관찰과 같은 낱말(6자 이상)을 쓴 덱 전체 항목만 '잡았다'로 본다
      const related = (i: any) => v.slides.length > 30 || (i.n != null ? v.slides.includes(i.n) : String(i.msg).split(/[\s,()'"·:]+/).some((w: string) => w.length >= 6 && v.observed.includes(w)));
      const caught = rel.filter((r) => r.status === "fail" && r.items.some(related));
      const ev = caught.flatMap((r) => r.items.filter(related).slice(0, 2).map((i: any) => `${r.id}: ${i.n ? `${i.n}장 ` : ""}${i.msg}`)).slice(0, 4);
      const sl = v.slides.length > 30 ? "전체" : v.slides.join(", ");
      L.push(`| ${v.id} | ${sl} | ${caught.map((r) => r.id).join(", ") || "—"} | ${rel.map((r) => `${r.id} ${mark(r)}`).join(" · ")} | ${esc(ev.join(" / ").slice(0, 600)) || "잡지 못함"} |`);
    }
    L.push("");
  }

  L.push("## 실행");
  L.push("");
  L.push(`- 실행: ${rep.date} · 커밋 ${rep.commit}${rep.deckDirty ? " (덱 파일 미커밋 변경 있음)" : ""} · 덱 해시 ${rep.deckSha} · ${rep.seconds}초`);
  L.push(`- 명령: \`cd presentation && bun scripts/visual-qa.ts --label ${rep.label}${rep.compare ? ` --compare=${rep.compare}` : ""}\` · 파이썬 \`${rep.tools.python}\``);
  L.push("- 스크린샷 링크(`../shots/<label>/`)는 커밋하지 않는다(.gitignore). 같은 명령으로 다시 만든다. 기준선 장 렌더는 커밋된 `qa/before/slide-NN.jpg`와 같다");
  L.push(`- 이 환경에 없는 도구: axe-core · Lighthouse · tesseract → 해당 조건은 직접 잰 근사로 판정하고 '부분' 표시(아래 조건별 메모). OCR은 tesseract 대신 macOS Vision(scripts/ocr_vision.swift${rep.tools?.ocr ? "" : ", 이번 실행에선 못 씀"})으로 IMG-02·RSP-02를 판정`);
  if (rep.phaseErrors?.length) L.push(`- 측정 단계 오류 ${rep.phaseErrors.length}: ${rep.phaseErrors.map(esc).join(" · ")}`);
  L.push("");

  if (rep.compare) {
    const reg = rep.results.filter((r: any) => r.regression);
    const fixed = rep.results.filter((r: any) => r.fixed);
    L.push(`## 기준(${rep.compare}) 대비`);
    L.push("");
    L.push(reg.length ? `회귀 ${reg.length}건 — 기준보다 나빠진 조건:` : "회귀 없음.");
    for (const r of reg) L.push(`- **${r.id}** ${icon[r.regression.prevStatus]} → ${icon[r.status]} · 항목 ${r.regression.prevItems} → ${r.regression.nowItems}${r.regression.newSlides.length ? ` · 새로 실패한 장 ${r.regression.newSlides.join(", ")}` : ""}`);
    if (fixed.length) L.push(`\n새로 통과: ${fixed.map((r: any) => r.id).join(", ")}`);
    L.push("");
  }

  // 요약 표
  L.push("## 조건별 결과");
  L.push("");
  L.push("| 조건 | 방식 | 구현 | 판정 | 실패한 장 | 첫 항목 |");
  L.push("| --- | --- | --- | --- | --- | --- |");
  for (const r of rep.results) {
    const impl = { auto: "자동", "auto+manual": "자동+수동", partial: "부분", manual: "수동" }[r.implemented as string];
    L.push(`| [${r.id}](#${r.id.toLowerCase()}) | ${r.method} | ${impl} | ${mark(r)}${r.regression ? " ⚠회귀" : ""} | ${r.failedSlides.join(", ") || (r.status === "fail" ? "덱 전체" : "")} | ${esc((r.items[0]?.msg ?? "").slice(0, 120))} |`);
  }
  L.push("");

  L.push("## 조건별 상세");
  L.push("");
  for (const r of rep.results) {
    const c = criteria.find((x) => x.id === r.id);
    L.push(`### ${r.id}`);
    L.push("");
    L.push(`${mark(r)} · ${r.area} · ${r.method} · 구현 ${r.implemented}${r.regression ? " · **회귀**" : ""}`);
    L.push("");
    L.push(`> ${esc(c?.criterion ?? r.summary)}  `);
    L.push(`> 기준: ${esc(c?.threshold ?? "")}`);
    L.push("");
    if (r.items.length) {
      L.push(`실패 ${r.items.length}건${r.failedSlides.length ? ` · 장 ${r.failedSlides.join(", ")}` : ""}`);
      L.push("");
      for (const i of r.items.slice(0, 25)) L.push(`- ${i.n ? `${i.n}장 · ` : ""}${esc(i.msg)}`);
      if (r.items.length > 25) L.push(`- … 외 ${r.items.length - 25}건(JSON 보고서에 전부)`);
      L.push("");
    }
    if (r.excepted?.length) {
      L.push(`예외로 넘김 ${r.excepted.length}건(qa/exceptions.json)`);
      for (const i of r.excepted.slice(0, 10)) L.push(`- ${i.n ? `${i.n}장 · ` : ""}${esc(i.msg)}`);
      L.push("");
    }
    if (r.notes?.length) { for (const n of r.notes) L.push(`- 메모: ${esc(n)}`); L.push(""); }
    if (r.evidence?.length) { L.push(`근거: ${[...new Set(r.evidence as string[])].slice(0, 8).map((p) => `[${p.split("/").pop()}](${link(p)})`).join(" · ")}`); L.push(""); }
    if (r.manual) {
      L.push(`수동 확인 절차: ${esc(r.manual.procedure)}`);
      if (r.manual.bundle?.length) L.push(`볼 것: ${[...new Set(r.manual.bundle as string[])].slice(0, 12).map((p) => `[${p.split("/").pop()}](${link(p)})`).join(" · ")}`);
      L.push("");
    }
  }
  L.push("## 외부 검사 원문");
  L.push("");
  for (const [k, v] of Object.entries(rep.ext) as [string, any][]) {
    L.push(`- \`${v.cmd}\` → 종료 ${v.code}`);
    const first = String(v.out).split("\n").filter(Boolean).slice(-2).join(" / ");
    if (first) L.push(`  - ${esc(first.slice(0, 300))}`);
  }
  L.push("");
  return L.join("\n");
}

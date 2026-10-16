# 시각 QA 루프 기록

| 회차 | 날짜 | 무엇을 | 결과 | 남은 위반 |
| --- | --- | --- | --- | --- |
| 1 | 2026-10-16 | HIG 173쪽 읽기(5) · 규칙 159개 읽기(2) · 이상 상태 147조건(1) · 34장 감사(5+전역 1) · 완결성 비평(1) | 위반 278건 기록, 근거 파일 148개 | 278 |
| 2 | 2026-10-16 | 2회차: 검사기 기준선 — `presentation/scripts/visual-qa.ts`로 147조건을 조건 id 그대로 판정(자동 141 · 수동 6: visual 5 + OCR 없는 IMG-02), fit.js `?check`가 TERTIARY 예외를 '예외로 넘김'으로 드러내게 함(덱 34장 렌더는 before와 픽셀 동일) | 통과 29 · 실패 112 · 수동 6 · 오류 0([reports/baseline.md](reports/baseline.md)). critical 4건: VG-01 → NAV-01·NAV-02·CTL-01, VG-07 → ONB-03·RSP-02, V1-01 → TYP-03·LAY-06·STD-01, V8-01 → CHT-02·CHT-07·EVD-01. 같은 덱 재실행(`--compare=baseline`) 회귀 0 | 278 |

#!/usr/bin/env bash
# 덱 검사를 한 번에: build → render(fit 보고) → check-numbers → 헌법 감사·token-check → visual-qa
#   bash scripts/qa-all.sh [visual-qa 옵션…]      예) bash scripts/qa-all.sh --label pr2 --compare=baseline
# 단계마다 종료 코드를 모아 마지막에 한 줄 표로 보인다. 하나라도 실패면 종료 코드 1.
# 파이썬은 QA_PY(없으면 python3), 공통 덱 스킬 스크립트는 QA_DECK_SKILL(없으면 ~/.agents/skills/designing-decks-and-motion/scripts).
set -u
cd "$(dirname "$0")/.."
SK="${QA_DECK_SKILL:-$HOME/.agents/skills/designing-decks-and-motion/scripts}"
LOGDIR="renders/qa-all"
mkdir -p "$LOGDIR"
declare -a NAMES CODES
step() {
  local name="$1"; shift
  echo "── $name: $*" >&2
  "$@" >"$LOGDIR/$name.log" 2>&1
  local c=$?
  NAMES+=("$name"); CODES+=("$c")
  tail -n 4 "$LOGDIR/$name.log" >&2
  return 0
}
step build bun scripts/build.ts
step render bun scripts/render.ts index.html
step check-numbers bun scripts/check-numbers.ts
step constitution python3 "$SK/constitution_audit.py" src/tokens.css src/deck.css src/slides.css
step token-check bun "$SK/token-check.ts" --tokens src/tokens.css src/deck.css src/slides.css index.html --strict
step visual-qa bun scripts/visual-qa.ts "$@"
fail=0
echo "" >&2
for i in "${!NAMES[@]}"; do
  printf '%-14s 종료 %s\n' "${NAMES[$i]}" "${CODES[$i]}" >&2
  [ "${CODES[$i]}" -ne 0 ] && fail=1
done
echo "로그: presentation/$LOGDIR/*.log" >&2
exit $fail

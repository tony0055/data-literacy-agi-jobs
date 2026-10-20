#!/usr/bin/env bash
# 덱 검사를 한 번에: build → render(fit 보고) → check-numbers → token-check → 제품 디자인 시스템 check.mjs → probe-nav → 헌법 감사
#   bash scripts/check-all.sh                 # 전 장
#   bash scripts/check-all.sh --only 5-9      # 렌더만 그 범위(나머지 검사는 덱 전체)
# 단계마다 종료 코드를 모아 마지막에 표로 보인다. 하나라도 실패면 종료 코드 1. 로그는 renders/check-<범위>/에(범위마다 따로라 동시에 돌려도 안 겹친다).
# 경로: 공통 덱 스킬 DECK_SKILL(없으면 ~/.agents/skills/designing-decks-and-motion), 제품 디자인 시스템 저장소 DS_REPO(없으면 ../../product-design-system).
set -u
cd "$(dirname "$0")/.."
ONLY=""
if [ "${1:-}" = "--only" ] && [ -n "${2:-}" ]; then ONLY="$2"; fi
SK="${DECK_SKILL:-$HOME/.agents/skills/designing-decks-and-motion}/scripts"
DS="${DS_REPO:-../../product-design-system}"
LOGDIR="renders/check-${ONLY:-all}"
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
if [ -n "$ONLY" ]; then
  step render bun scripts/render.ts --only "$ONLY"
else
  step render bun scripts/render.ts
fi
# render는 issues가 있어도 0으로 끝난다: 빈 배열이 아니면 실패로 센다
if ! grep -q '"issues": \[\]' "$LOGDIR/render.log"; then CODES[$((${#CODES[@]} - 1))]=1; fi
step check-numbers bun scripts/check-numbers.ts
SLIDES=$(ls src/slides/*.html)
step token-check bun "$SK/token-check.ts" --tokens src/ds/tokens.css src/deck.css src/controls.css src/slides.bundle.css src/shell.html $SLIDES --strict
if [ -f "$DS/design-system/scripts/check.mjs" ]; then
  step ds-check node "$DS/design-system/scripts/check.mjs" --scan="$PWD/src"
fi
step probe-nav bun scripts/probe-nav.ts
# 헌법 감사(공통 덱 스킬): 간격 · 글자 · 색 · 이징이 시스템 안에 있는지 센다(3회차에 단계로 넣음)
if [ -f "$SK/constitution_audit.py" ]; then
  step constitution python3 "$SK/constitution_audit.py" src/ds/tokens.css src/deck.css src/controls.css src/slides.bundle.css
fi
fail=0
echo "" >&2
for i in "${!NAMES[@]}"; do
  printf '%-14s 종료 %s\n' "${NAMES[$i]}" "${CODES[$i]}" >&2
  [ "${CODES[$i]}" -ne 0 ] && fail=1
done
echo "로그: presentation/$LOGDIR/*.log" >&2
exit $fail

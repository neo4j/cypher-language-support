#!/usr/bin/env bash
# Aggregate .eval/runs/657-seed-*.scores.json into a markdown table at
# .plans/eval-stage0/results.md. Run after run-stage0.sh completes.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNS_DIR="$REPO_ROOT/.eval/runs"
OUT="$REPO_ROOT/.plans/eval-stage0/results.md"

mkdir -p "$(dirname "$OUT")"

human_format_secs() { printf '%dm%02ds' $(($1/60)) $(($1%60)); }
human_format_tokens() {
  local n="$1"
  if (( n >= 1000 )); then printf '%dk' $(( (n+500)/1000 )); else printf '%d' "$n"; fi
}

status_badge() {
  case "$1" in
    pass)    printf 'PASS' ;;
    fail)    printf 'FAIL' ;;
    unknown) printf '?'    ;;
    *)       printf '%s' "$1" ;;
  esac
}

{
  echo "# Stage 0 baseline-pilot results"
  echo
  echo "Pilot PR: [#657](https://github.com/neo4j/cypher-language-support/pull/657) — artifact bump to 2026.03.0."
  echo "Baseline (broken state) commit: \`03456409e9\`. Tip (human touch-up) commit: \`d8dd46b38e\`."
  echo
  echo "| seed | build | test_porting | anti_cheat | rating | tokens (in/out/cached) | wall_clock | turns | diff_loc | summary |"
  echo "|------|-------|--------------|------------|--------|------------------------|------------|-------|----------|---------|"
} > "$OUT"

ratings=()
walls=()
in_total=0
out_total=0
cache_total=0
build_pass=0; build_fail=0
port_pass=0; port_fail=0
ac_pass=0; ac_fail=0
seeds_seen=0

for f in "$RUNS_DIR"/657-seed-*.scores.json; do
  [ -f "$f" ] || continue
  seeds_seen=$((seeds_seen + 1))
  seed=$(jq -r '.seed' "$f")
  build=$(jq -r '.build' "$f")
  port=$(jq -r '.test_porting' "$f")
  ac=$(jq -r '.anti_cheat' "$f")
  rating=$(jq -r '.rating' "$f")
  rationale=$(jq -r '.rating_rationale' "$f")
  i=$(jq -r '.tokens.input' "$f")
  o=$(jq -r '.tokens.output' "$f")
  c=$(jq -r '.tokens.cache_read' "$f")
  wall=$(jq -r '.wall_clock_seconds' "$f")
  turns=$(jq -r '.turns_used' "$f")
  loc=$(jq -r '.diff_loc' "$f")

  case "$build" in pass) build_pass=$((build_pass+1));; fail) build_fail=$((build_fail+1));; esac
  case "$port"  in pass) port_pass=$((port_pass+1));;   fail) port_fail=$((port_fail+1));;   esac
  case "$ac"    in pass) ac_pass=$((ac_pass+1));;       fail) ac_fail=$((ac_fail+1));;       esac
  ratings+=("$rating")
  walls+=("$wall")
  in_total=$((in_total + i))
  out_total=$((out_total + o))
  cache_total=$((cache_total + c))

  rationale_clean=$(printf '%s' "$rationale" | tr '\n' ' ' | sed 's/|/\\|/g')
  printf '| %s | %s | %s | %s | %s/10 | %s/%s/%s | %s | %s | %s | %s |\n' \
    "$seed" \
    "$(status_badge "$build")" \
    "$(status_badge "$port")" \
    "$(status_badge "$ac")" \
    "$rating" \
    "$(human_format_tokens "$i")" "$(human_format_tokens "$o")" "$(human_format_tokens "$c")" \
    "$(human_format_secs "$wall")" \
    "$turns" "$loc" \
    "$rationale_clean" >> "$OUT"
done

{
  echo
  echo "## Observations"
  echo
} >> "$OUT"

if [ "$seeds_seen" -eq 0 ]; then
  echo "_No scores files found in $RUNS_DIR._" >> "$OUT"
  exit 0
fi

ratings_csv=$(IFS=,; echo "${ratings[*]}")
walls_total=0
for w in "${walls[@]}"; do walls_total=$((walls_total + w)); done

{
  echo "**Binary-signal noise across $seeds_seen seeds:**"
  echo "- build: ${build_pass} pass / ${build_fail} fail"
  echo "- test_porting: ${port_pass} pass / ${port_fail} fail"
  echo "- anti_cheat: ${ac_pass} pass / ${ac_fail} fail"
  echo
  echo "**Rating spread (Sonnet judge, /10):** \`${ratings_csv}\`. Treat as supplementary metadata — a single judge call on a single diff is noisy; do not promote to a primary ranking signal until rater self-consistency is measured."
  echo
  echo "**Cost totals across the pilot:** input ${in_total} tok, output ${out_total} tok, cache-read ${cache_total} tok; wall-clock $(human_format_secs $walls_total) (sum across seeds, includes pnpm install / build / test / lint / format:check / judge call, not just Claude run time)."
  echo
  echo "**Stage 1 extrapolation:** projected ~30 cells (2 PRs × 2 variants × 3 seeds + buffer); at the per-seed averages above expect wall-clock roughly 10× this run and token cost ~10× as well. Use those numbers to size the matrix and GitHub Actions minutes budget before committing to Stage 1."
} >> "$OUT"

echo "wrote $OUT"

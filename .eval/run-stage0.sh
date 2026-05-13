#!/usr/bin/env bash
# Stage 0 baseline-pilot driver.
# Runs Claude Code headless three times against PR #657's broken baseline
# commit, scores each run on build / test-porting / anti-cheat plus a
# supplementary Sonnet rating, and writes a results table.

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EVAL_DIR="$REPO_ROOT/.eval"
RUNS_DIR="$EVAL_DIR/runs"
WORKTREES_DIR="$EVAL_DIR/worktrees"
RESULTS_DIR="$REPO_ROOT/.plans/eval-stage0"

BASELINE="03456409e9"
TIP="d8dd46b38e"

MAX_TURNS="${EVAL_MAX_TURNS:-15}"
SEEDS="${EVAL_SEEDS:-1 2 3}"

PORT_PATHS=(
  "packages/language-support/src/tests/formatting/commands.test.ts"
  "packages/language-support/src/tests/syntaxValidation/semanticValidation.test.ts"
)

mkdir -p "$RUNS_DIR" "$WORKTREES_DIR" "$RESULTS_DIR"

if ! command -v antlr4 >/dev/null 2>&1; then
  echo "ERROR: antlr4 (>=4.10, with TypeScript code-gen support) is required for vendor/antlr4-c3/build." >&2
  echo "Set up a wrapper at /usr/local/bin/antlr4 that runs antlr-4.13.x-complete.jar. See .eval/README.md if present, or fetch the jar from Maven Central:" >&2
  echo "  curl -fsSL -o /tmp/antlr-4.13.2-complete.jar https://repo1.maven.org/maven2/org/antlr/antlr4/4.13.2/antlr4-4.13.2-complete.jar" >&2
  exit 1
fi

PROMPT="$(cat "$EVAL_DIR/prompt.txt")"
JUDGE_PROMPT="$(cat "$EVAL_DIR/judge-prompt.txt")"

HUMAN_DIFF_FILE="$EVAL_DIR/human-reference.diff"
(
  cd "$REPO_ROOT"
  git diff "$BASELINE..$TIP" -- \
    ':!packages/language-support/src/syntaxValidation/semanticAnalysis.js' \
    > "$HUMAN_DIFF_FILE"
)

log() { printf '[%(%H:%M:%S)T] %s\n' -1 "$*"; }

run_seed() {
  local seed="$1"
  local wt="$WORKTREES_DIR/657-seed-$seed"
  local jsonl="$RUNS_DIR/657-seed-$seed.jsonl"
  local diff_file="$RUNS_DIR/657-seed-$seed.diff"
  local scores_file="$RUNS_DIR/657-seed-$seed.scores.json"
  local build_log="$RUNS_DIR/657-seed-$seed.build.log"
  local baseline_log="$RUNS_DIR/657-seed-$seed.baseline-test.log"
  local testport_log="$RUNS_DIR/657-seed-$seed.testport.log"
  local judge_input="$EVAL_DIR/.judge-input-seed-$seed.txt"
  local judge_jsonl="$RUNS_DIR/657-seed-$seed.judge.jsonl"

  log "seed=$seed: setting up worktree"
  if [ -d "$wt" ]; then
    (cd "$REPO_ROOT" && git worktree remove --force "$wt") 2>/dev/null || rm -rf "$wt"
  fi
  (cd "$REPO_ROOT" && git worktree add --detach "$wt" "$BASELINE")

  rm -rf "$wt/CLAUDE.md" "$wt/.claude" "$wt/AGENTS.md" "$wt/.cursor"

  log "seed=$seed: pnpm install"
  if ! (cd "$wt" && pnpm install --frozen-lockfile > "$RUNS_DIR/657-seed-$seed.install.log" 2>&1); then
    log "seed=$seed: frozen-lockfile install failed, retrying without --frozen-lockfile"
    (cd "$wt" && pnpm install > "$RUNS_DIR/657-seed-$seed.install.log" 2>&1) || {
      log "seed=$seed: pnpm install failed; see $RUNS_DIR/657-seed-$seed.install.log"
      return 1
    }
  fi

  log "seed=$seed: pre-build (generates antlr4-c3 files; required by every package's tests)"
  if ! (cd "$wt" && pnpm build > "$RUNS_DIR/657-seed-$seed.prebuild.log" 2>&1); then
    log "seed=$seed: pre-build failed; see $RUNS_DIR/657-seed-$seed.prebuild.log"
    return 1
  fi

  log "seed=$seed: baseline broken check (pnpm test)"
  if (cd "$wt" && pnpm test > "$baseline_log" 2>&1); then
    log "ERROR: baseline tests pass at $BASELINE — Stage 0 assumption violated."
    return 2
  fi

  log "seed=$seed: invoking Claude (max-turns=$MAX_TURNS)"
  local start_ts end_ts wall
  start_ts=$(date +%s)
  (
    cd "$wt"
    claude -p "$PROMPT" \
      --output-format stream-json \
      --verbose \
      --permission-mode acceptEdits \
      --allowedTools "Bash Read Edit Write Glob Grep TodoWrite NotebookEdit MultiEdit Task" \
      --max-turns "$MAX_TURNS"
  ) > "$jsonl" 2>&1 || log "seed=$seed: claude exited non-zero (continuing)"
  end_ts=$(date +%s)
  wall=$((end_ts - start_ts))
  log "seed=$seed: claude finished in ${wall}s"

  log "seed=$seed: capturing diff"
  (cd "$wt" && git add -A && git diff --cached) > "$diff_file"
  local diff_loc
  diff_loc=$(wc -l < "$diff_file" | tr -d ' ')

  local input_tokens output_tokens cache_read turns
  local result_line
  result_line=$(grep '"type":"result"' "$jsonl" | tail -1 || true)
  if [ -n "$result_line" ]; then
    input_tokens=$(echo "$result_line" | jq '.usage.input_tokens // 0')
    output_tokens=$(echo "$result_line" | jq '.usage.output_tokens // 0')
    cache_read=$(echo "$result_line" | jq '.usage.cache_read_input_tokens // 0')
    turns=$(echo "$result_line" | jq '.num_turns // 0')
  else
    input_tokens=0
    output_tokens=0
    cache_read=0
    turns=0
  fi

  log "seed=$seed: scoring build (build/test/lint/format:check)"
  : > "$build_log"
  local build_status="pass"
  local build_exits=()
  for cmd in "pnpm build" "pnpm test" "pnpm lint" "pnpm format:check"; do
    echo "=== $cmd ===" >> "$build_log"
    if (cd "$wt" && $cmd >> "$build_log" 2>&1); then
      build_exits+=("$cmd:0")
    else
      build_exits+=("$cmd:fail")
      build_status="fail"
    fi
  done

  log "seed=$seed: scoring test-porting (overlay human tests, re-run)"
  (
    cd "$wt"
    git checkout "$TIP" -- "${PORT_PATHS[@]}" 2>>"$testport_log"
  ) || true
  local testport_status
  if (cd "$wt" && pnpm test > "$testport_log" 2>&1); then
    testport_status="pass"
  else
    testport_status="fail"
  fi

  log "seed=$seed: judging diff (anti-cheat + rating)"
  {
    printf '%s\n\n' "$JUDGE_PROMPT"
    printf '=== CLAUDE'\''S DIFF ===\n'
    cat "$diff_file"
    printf '\n=== HUMAN REFERENCE DIFF ===\n'
    cat "$HUMAN_DIFF_FILE"
  } > "$judge_input"

  (
    cd "$REPO_ROOT"
    claude -p "$(cat "$judge_input")" \
      --output-format stream-json \
      --verbose \
      --max-turns 6
  ) > "$judge_jsonl" 2>&1 || log "seed=$seed: judge call exited non-zero"

  local judge_raw judge_json clean rating rationale reasons anticheat_status
  judge_raw=$(grep '"type":"result"' "$judge_jsonl" | tail -1 | jq -r '.result // ""' 2>/dev/null || echo "")
  judge_json=$(echo "$judge_raw" | sed -e 's/^[[:space:]]*```[a-zA-Z]*//' -e 's/```[[:space:]]*$//' | awk 'BEGIN{found=0; depth=0} /\{/ && !found {found=1} found {print; for(i=1;i<=length($0);i++){c=substr($0,i,1); if(c=="{")depth++; if(c=="}")depth--}; if(found && depth==0) exit}')
  if [ -z "$judge_json" ] || ! echo "$judge_json" | jq -e . >/dev/null 2>&1; then
    judge_json='{"clean": null, "reasons": ["judge-output-unparseable"], "rating": 0, "rationale": "judge output could not be parsed"}'
  fi
  clean=$(echo "$judge_json" | jq -r '.clean')
  reasons=$(echo "$judge_json" | jq -c '.reasons // []')
  rating=$(echo "$judge_json" | jq -r '.rating // 0')
  rationale=$(echo "$judge_json" | jq -r '.rationale // ""')
  case "$clean" in
    true)  anticheat_status="pass" ;;
    false) anticheat_status="fail" ;;
    *)     anticheat_status="unknown" ;;
  esac

  log "seed=$seed: writing scores"
  jq -n \
    --argjson seed "$seed" \
    --arg build "$build_status" \
    --arg test_porting "$testport_status" \
    --arg anti_cheat "$anticheat_status" \
    --argjson rating "$rating" \
    --arg rationale "$rationale" \
    --argjson reasons "$reasons" \
    --argjson input_tokens "$input_tokens" \
    --argjson output_tokens "$output_tokens" \
    --argjson cache_read "$cache_read" \
    --argjson wall_clock_seconds "$wall" \
    --argjson turns_used "$turns" \
    --argjson diff_loc "$diff_loc" \
    '{
      seed: $seed,
      build: $build,
      test_porting: $test_porting,
      anti_cheat: $anti_cheat,
      rating: $rating,
      rating_rationale: $rationale,
      anti_cheat_reasons: $reasons,
      tokens: { input: $input_tokens, output: $output_tokens, cache_read: $cache_read },
      wall_clock_seconds: $wall_clock_seconds,
      turns_used: $turns_used,
      diff_loc: $diff_loc
    }' > "$scores_file"

  log "seed=$seed: tearing down worktree"
  (cd "$REPO_ROOT" && git worktree remove --force "$wt") || rm -rf "$wt"

  log "seed=$seed: done (build=$build_status test_porting=$testport_status anti_cheat=$anticheat_status rating=$rating wall=${wall}s turns=$turns)"
}

overall_status=0
for s in $SEEDS; do
  if ! run_seed "$s"; then
    log "seed=$s: failed"
    overall_status=1
  fi
done

log "all seeds done; remaining worktrees:"
(cd "$REPO_ROOT" && git worktree list)

exit "$overall_status"

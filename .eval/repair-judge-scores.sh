#!/usr/bin/env bash
# Recover anti_cheat / rating / rationale from .eval/runs/*.judge.jsonl when the
# judge call hit max-turns before producing a final .result, but its first
# assistant text already contained the expected JSON answer.

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNS_DIR="$REPO_ROOT/.eval/runs"

repaired=0
for judge in "$RUNS_DIR"/657-seed-*.judge.jsonl; do
  [ -f "$judge" ] || continue
  seed_file="${judge%.judge.jsonl}.scores.json"
  [ -f "$seed_file" ] || continue

  existing=$(jq -r '.anti_cheat' "$seed_file")
  if [ "$existing" = "pass" ] || [ "$existing" = "fail" ]; then
    continue
  fi

  recovered=""
  while IFS= read -r text; do
    [ -z "$text" ] && continue
    if echo "$text" | jq -e 'objects | has("rating")' >/dev/null 2>&1; then
      recovered="$text"
      break
    fi
    stripped=$(printf '%s' "$text" | sed -e 's/^[[:space:]]*```[a-zA-Z]*[[:space:]]*//' -e 's/[[:space:]]*```[[:space:]]*$//')
    if [ -n "$stripped" ] && echo "$stripped" | jq -e 'objects | has("rating")' >/dev/null 2>&1; then
      recovered="$stripped"
      break
    fi
  done < <(jq -r 'select(.type=="assistant") | .message.content[]? | select(.type=="text") | .text' "$judge")

  if [ -z "$recovered" ]; then
    echo "seed $(basename "$seed_file"): no recoverable JSON in judge transcript"
    continue
  fi

  clean=$(echo "$recovered" | jq -r '.clean')
  reasons=$(echo "$recovered" | jq -c '.reasons // []')
  rating=$(echo "$recovered" | jq -r '.rating // 0')
  rationale=$(echo "$recovered" | jq -r '.rationale // ""')
  case "$clean" in
    true)  anticheat="pass" ;;
    false) anticheat="fail" ;;
    *)     anticheat="unknown" ;;
  esac

  tmp=$(mktemp)
  jq --arg ac "$anticheat" --argjson reasons "$reasons" --argjson rating "$rating" --arg rationale "$rationale" \
    '.anti_cheat = $ac | .anti_cheat_reasons = $reasons | .rating = $rating | .rating_rationale = $rationale' \
    "$seed_file" > "$tmp" && mv "$tmp" "$seed_file"
  repaired=$((repaired + 1))
  echo "seed $(basename "$seed_file"): anti_cheat=$anticheat rating=$rating"
done

echo "repaired $repaired seed score files"

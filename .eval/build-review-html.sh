#!/usr/bin/env bash
# Generate .plans/eval-stage0-baseline-pilot.review.html from the runs in
# .eval/runs/ plus the scores files. Single self-contained HTML, no externals.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNS_DIR="$REPO_ROOT/.eval/runs"
OUT="$REPO_ROOT/.plans/eval-stage0-baseline-pilot.review.html"

mkdir -p "$(dirname "$OUT")"

human_secs() { printf '%dm%02ds' $(($1/60)) $(($1%60)); }

emit_rows() {
  local total_in=0 total_out=0 total_cache=0 total_wall=0 n=0
  local build_pass=0 build_fail=0 port_pass=0 port_fail=0 ac_pass=0 ac_fail=0
  local ratings_csv=""
  for f in "$RUNS_DIR"/657-seed-*.scores.json; do
    [ -f "$f" ] || continue
    n=$((n+1))
    local seed build port ac rating rationale i o c wall turns loc
    seed=$(jq -r '.seed' "$f")
    build=$(jq -r '.build' "$f")
    port=$(jq -r '.test_porting' "$f")
    ac=$(jq -r '.anti_cheat' "$f")
    rating=$(jq -r '.rating' "$f")
    rationale=$(jq -r '.rating_rationale' "$f" | sed 's/</\&lt;/g; s/>/\&gt;/g')
    i=$(jq -r '.tokens.input' "$f"); o=$(jq -r '.tokens.output' "$f"); c=$(jq -r '.tokens.cache_read' "$f")
    wall=$(jq -r '.wall_clock_seconds' "$f"); turns=$(jq -r '.turns_used' "$f"); loc=$(jq -r '.diff_loc' "$f")
    case "$build" in pass) build_pass=$((build_pass+1));; fail) build_fail=$((build_fail+1));; esac
    case "$port"  in pass) port_pass=$((port_pass+1));;   fail) port_fail=$((port_fail+1));;   esac
    case "$ac"    in pass) ac_pass=$((ac_pass+1));;       fail) ac_fail=$((ac_fail+1));;       esac
    ratings_csv="${ratings_csv:+$ratings_csv, }$rating"
    total_in=$((total_in+i)); total_out=$((total_out+o)); total_cache=$((total_cache+c)); total_wall=$((total_wall+wall))
    cat <<ROW
  <tr>
    <td class="seed">$seed</td>
    <td><span class="badge $build">$build</span></td>
    <td><span class="badge $port">$port</span></td>
    <td><span class="badge $ac">$ac</span></td>
    <td class="num">$rating<span class="dim">/10</span></td>
    <td class="num small">$i / $o / $c</td>
    <td class="num">$(human_secs "$wall")</td>
    <td class="num">$turns</td>
    <td class="num">$loc</td>
    <td class="rationale">$rationale</td>
  </tr>
ROW
  done
  printf '__SUMMARY__%s|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s\n' "$n" "$build_pass" "$build_fail" "$port_pass" "$port_fail" "$ac_pass" "$ac_fail" "$ratings_csv" "$total_in" "$total_out" "$total_wall" >> /tmp/.eval-summary
}

rm -f /tmp/.eval-summary
ROWS=$(emit_rows)
SUMMARY_LINE=$(cat /tmp/.eval-summary 2>/dev/null | tail -1)
rm -f /tmp/.eval-summary

IFS='|' read -r _ N BP BF PP PF AP AF RATINGS TIN TOUT TWALL <<<"$SUMMARY_LINE"
N="${N:-0}"; BP="${BP:-0}"; BF="${BF:-0}"; PP="${PP:-0}"; PF="${PF:-0}"; AP="${AP:-0}"; AF="${AF:-0}"; RATINGS="${RATINGS:-?}"; TIN="${TIN:-0}"; TOUT="${TOUT:-0}"; TWALL="${TWALL:-0}"

ac1() {
  if [ "$N" -ge 3 ] && [ -s "$RUNS_DIR/657-seed-1.diff" ] && [ -s "$RUNS_DIR/657-seed-2.diff" ] && [ -s "$RUNS_DIR/657-seed-3.diff" ]; then
    echo pass
  else
    echo fail
  fi
}

ac2() {
  if [ "$N" -ge 3 ]; then echo pass; else echo fail; fi
}

ac3() {
  if [ "$(cd "$REPO_ROOT" && git worktree list | grep -c 657-seed)" = "0" ]; then echo pass; else echo fail; fi
}

ac4() {
  if [ -s "$REPO_ROOT/.plans/eval-stage0/results.md" ]; then echo pass; else echo fail; fi
}

AC1=$(ac1); AC2=$(ac2); AC3=$(ac3); AC4=$(ac4)
AC5="waived"

cat > "$OUT" <<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>eval-stage0-baseline-pilot — review</title>
<style>
  :root { color-scheme: light dark; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; max-width: 1100px; margin: 2rem auto; padding: 0 1.5rem; line-height: 1.55; color: #1c1c1c; }
  @media (prefers-color-scheme: dark) { body { background: #15171a; color: #e6e6e6; } }
  h1 { border-bottom: 2px solid #888; padding-bottom: .3rem; margin-bottom: .2rem; }
  h2 { margin-top: 2rem; border-bottom: 1px solid #ccc; padding-bottom: .2rem; }
  h3 { margin-top: 1.4rem; }
  .meta { color: #888; font-size: .9rem; }
  table { border-collapse: collapse; width: 100%; margin: .5rem 0 1rem; font-size: .92rem; }
  th, td { border: 1px solid #ccc; padding: .3rem .5rem; text-align: left; vertical-align: top; }
  @media (prefers-color-scheme: dark) { th, td { border-color: #333; } th { background: #1f2227; } }
  th { background: #f4f4f4; font-weight: 600; }
  td.num { font-variant-numeric: tabular-nums; white-space: nowrap; }
  td.small { font-size: .85rem; }
  td.seed { font-weight: 600; }
  td.rationale { font-size: .85rem; color: #555; }
  @media (prefers-color-scheme: dark) { td.rationale { color: #aaa; } }
  .badge { display: inline-block; padding: 1px 8px; border-radius: 9px; font-size: .8rem; font-weight: 600; text-transform: uppercase; }
  .badge.pass { background: #c7f0d2; color: #0a4d20; }
  .badge.fail { background: #f7c8c8; color: #7a1818; }
  .badge.unknown, .badge.waived { background: #e6e6e6; color: #555; }
  @media (prefers-color-scheme: dark) {
    .badge.pass { background: #1c4d2c; color: #b8f0c6; }
    .badge.fail { background: #5a1f1f; color: #f0c0c0; }
    .badge.unknown, .badge.waived { background: #2c2f33; color: #aaa; }
  }
  code, .mono { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: .9em; }
  pre { background: #f6f8fa; border: 1px solid #ddd; border-radius: 6px; padding: .8rem; overflow-x: auto; font-size: .85rem; }
  @media (prefers-color-scheme: dark) { pre { background: #1c1f24; border-color: #333; } }
  ul.criteria { list-style: none; padding-left: 0; }
  ul.criteria li { padding: .4rem 0; border-bottom: 1px solid #eee; }
  @media (prefers-color-scheme: dark) { ul.criteria li { border-color: #2a2d33; } }
  ul.criteria li .badge { margin-right: .6rem; vertical-align: middle; }
  .dim { color: #888; font-weight: normal; }
  details { margin: .5rem 0; }
  summary { cursor: pointer; font-weight: 600; }
  .checklist label { display: block; padding: .2rem 0; }
  .summary-card { background: #f8f8fb; border: 1px solid #ddd; border-radius: 8px; padding: 1rem 1.25rem; margin: 1rem 0; }
  @media (prefers-color-scheme: dark) { .summary-card { background: #1c1f24; border-color: #333; } }
</style>
</head>
<body>

<h1>eval-stage0-baseline-pilot — review</h1>
<p class="meta">Pilot run of the Stage 0 baseline-noise harness against PR <a href="https://github.com/neo4j/cypher-language-support/pull/657">#657</a>. Plan: <code>.plans/eval-stage0-baseline-pilot.plan.html</code>.</p>

<div class="summary-card">
<strong>One-paragraph summary.</strong>
The harness — driver + prompt + Sonnet-judge — runs end-to-end and produced $N seed result rows. Worktrees are created from the broken-baseline commit <code class="mono">03456409e9</code>, isolated, then torn down. Per seed it records three binary scoring signals (build / test-porting / anti-cheat), a supplementary Sonnet rating /10, and cost metrics (tokens, wall-clock, turns). Across $N seeds: build pass/fail = $BP/$BF; test_porting pass/fail = $PP/$PF; anti_cheat pass/fail = $AP/$AF; ratings = [$RATINGS]; total tokens in/out = $TIN/$TOUT; total wall-clock $(human_secs "$TWALL"). The pilot's goal was not "does Claude do well" but "does the measurement tool produce a stable, interpretable signal" — read the per-seed rationales and the gotchas section below for whether it does.
</div>

<h2>Acceptance criteria</h2>
<ul class="criteria">
  <li><span class="badge $AC1">$AC1</span> Driver runs end-to-end and produces 3 result rows. <span class="dim">($N seeds with non-empty diffs in <code>.eval/runs/</code>)</span></li>
  <li><span class="badge $AC2">$AC2</span> Each seed captures 3 binary signals + rating + cost metrics. <span class="dim">($N scores files written with all required keys)</span></li>
  <li><span class="badge $AC3">$AC3</span> Worktrees isolated and cleaned up. <span class="dim">(<code>git worktree list</code> shows no 657-seed entries after the run)</span></li>
  <li><span class="badge $AC4">$AC4</span> Results table summarizes the runs. <span class="dim">(<code>.plans/eval-stage0/results.md</code> exists)</span></li>
  <li><span class="badge $AC5">$AC5</span> Reproducible from documented commands. <span class="dim">(harness committed; values stochastic by design — verify by re-running)</span></li>
</ul>

<h2>Per-seed results</h2>
<table>
  <thead>
    <tr><th>seed</th><th>build</th><th>test_porting</th><th>anti_cheat</th><th>rating</th><th>tokens (in/out/cache)</th><th>wall</th><th>turns</th><th>diff_loc</th><th>judge rationale</th></tr>
  </thead>
  <tbody>
$ROWS
  </tbody>
</table>

<h2>Manual review checklist (human, post-merge)</h2>
<div class="checklist">
  <label><input type="checkbox"> Skim the 3 diffs (<code class="mono">.eval/runs/657-seed-{1,2,3}.diff</code>) — do they look like sensible attempts, or is one obviously off-task?</label>
  <label><input type="checkbox"> Does the scoring discriminate? Split outcomes give a noise estimate; uniformly-pass or uniformly-fail are informative in different ways (see plan §Human review).</label>
  <label><input type="checkbox"> Are the three primary signals telling consistent stories or contradicting each other?</label>
  <label><input type="checkbox"> Is the Sonnet rating spread tight or wide? Big spread = judge unreliable on this domain.</label>
  <label><input type="checkbox"> Extrapolate cost (tokens + wall-clock) to ~30 cells for Stage 1 — is the budget acceptable?</label>
</div>

<h2>Deviations from plan</h2>
<details open>
<summary>Environment fixups required to make <code>pnpm build</code> work</summary>
<p>The plan's "Repo build &amp; test commands" list assumed <code>pnpm build</code> would work out of the box, but <code>vendor/antlr4-c3</code>'s <code>generate</code> step needs the <code>antlr4</code> CLI with TypeScript code-gen support (ANTLR &ge; 4.10). The sandbox shipped without it. Resolved by fetching <code>antlr-4.13.2-complete.jar</code> from Maven Central and installing a wrapper at <code>/usr/local/bin/antlr4</code>. Logged here so Stage 1 / Stage 2 (GitHub Actions) can pre-install <code>antlr4</code> as part of harness setup.</p>
</details>
<details open>
<summary>Pre-build step added inside each seed before "baseline broken" check</summary>
<p>A fresh checkout at <code>03456409e9</code> can't run <code>pnpm test</code> standalone because <code>vendor/antlr4-c3</code>'s vitest setup needs files emitted by <code>pnpm build</code>. Without a pre-build, the baseline-broken check passes for the wrong reason (missing generated files, not artifact-bump mismatch), which would make the build-score signal uninterpretable. The driver now runs <code>pnpm build</code> once before scoring, then verifies <code>pnpm test</code> fails — confirming we're measuring the artifact-bump failures (currently 4 test failures in <code>semanticValidation.test.ts</code>) and not environment issues.</p>
</details>
<details open>
<summary>Permission flag: <code>acceptEdits</code> + explicit allowedTools, not <code>bypassPermissions</code></summary>
<p>The plan implied <code>claude -p</code> would run with all permissions; in practice <code>--permission-mode bypassPermissions</code> (and <code>--dangerously-skip-permissions</code>) are blocked when the CLI runs as root for security reasons. The driver uses <code>--permission-mode acceptEdits --allowedTools "Bash Read Edit Write Glob Grep TodoWrite NotebookEdit MultiEdit Task"</code>, which gives Claude the tools it needs without prompting. Stage 2 (GitHub Actions) likely won't run as root — flag this in advance so the workflow can pick the right flag combination.</p>
</details>

<h2>Possible next steps</h2>
<ul>
  <li>Pre-bake the <code>antlr4</code> binary (or a vendored jar) into the harness setup so Stage 1/2 don't repeat this discovery cost.</li>
  <li>Measure judge self-consistency before promoting the Sonnet rating to a primary ranking signal — run the same judge prompt on the same diff 3-5 times, look at the rating spread.</li>
  <li>If wall-clock is dominated by repeated <code>pnpm install</code> + <code>pnpm build</code> across worktrees, consider hardlinking <code>node_modules</code> or caching <code>vendor/antlr4-c3/tests/generated/</code> — but only after Stage 1 if it actually bites.</li>
</ul>

<h2>Gotchas / things to watch for</h2>
<ul>
  <li>Stream-json transcripts (<code>.jsonl</code>) capture both stdout and stderr because the driver redirects with <code>2&gt;&amp;1</code>. If Claude writes anything non-JSON to stderr, the final <code>"type":"result"</code> line should still be parseable, but a debug-mode invocation could push the result event far into the file — the driver uses <code>grep '"type":"result"' | tail -1</code> which is robust to interleaved stderr.</li>
  <li>The judge sometimes wraps JSON in <code>\`\`\`json</code> fences despite the prompt's instructions. The driver tolerates fences via a sed/awk extraction, but if the judge ever returns something fundamentally non-JSON the seed records <code>anti_cheat=unknown</code> and <code>rating=0</code>.</li>
  <li>For PR #657 specifically the human-touch-up didn't change source — only tests. So the test-porting score is essentially "did Claude's source edits avoid breaking the new test cases the human added". A perfect Claude run that didn't touch source will trivially pass test-porting. That's expected for this pilot; for richer pilots, test-porting will discriminate more.</li>
</ul>

<h2>Entry point for human review</h2>
<ul>
  <li><strong>Plan:</strong> <code class="mono">.plans/eval-stage0-baseline-pilot.plan.html</code></li>
  <li><strong>Driver:</strong> <code class="mono">.eval/run-stage0.sh</code></li>
  <li><strong>Prompts:</strong> <code class="mono">.eval/prompt.txt</code>, <code class="mono">.eval/judge-prompt.txt</code></li>
  <li><strong>Per-seed artifacts:</strong> <code class="mono">.eval/runs/657-seed-{1,2,3}.{diff,jsonl,scores.json,build.log,baseline-test.log,testport.log,judge.jsonl}</code> (gitignored)</li>
  <li><strong>Aggregate table:</strong> <code class="mono">.plans/eval-stage0/results.md</code></li>
</ul>

</body>
</html>
HTML

echo "wrote $OUT"

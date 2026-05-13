# Stage 0 baseline-pilot results — single-seed pilot

Pilot PR: [#657](https://github.com/neo4j/cypher-language-support/pull/657) — artifact bump to 2026.03.0.
Baseline (broken state) commit: `03456409e9`. Tip (human touch-up) commit: `d8dd46b38e`.

> Note: the plan called for 3 seeds. We ran only seed 1 at the user's request, so the noise-floor estimate is deferred. The harness end-to-end behavior is fully validated by this one row, and is the prerequisite the plan was actually after.

| seed | build | test_porting | anti_cheat | rating | tokens (in/out/cached) | wall_clock | turns | diff_loc | judge rationale |
|------|-------|--------------|------------|--------|------------------------|------------|-------|----------|-----------------|
| 1 | FAIL | PASS | PASS | 1/10 | 17 / 6.3k / 409k | 5m06s | 16/15 | 0 | Claude produced an empty diff with zero changes, completely failing to address the build breakage that required updating test expectations for the new semantic analyzer messages, severities, error ordering, and formatting output. |

## Observations

**Result interpretation.** Build fails because Claude never edited anything; test_porting passes because the human's reference test files happen to work on top of an unchanged source (the human's touch-up was tests-only); anti_cheat passes vacuously because an empty diff cannot game anything. The Sonnet rating of 1/10 reflects "off-task / nothing done" — consistent with the binary signals.

**What Claude actually did during its 15-turn budget.** Spent all turns investigating: ran `pnpm build` / `pnpm test`, read the failing tests in `semanticValidation.test.ts`, dove into the formatter (`formatting/formatting.ts`) and generated parser to understand the visitor pattern around `showCommandYield` / `showCommandYieldWhere`. Last narrated step before the cap was "Let me also quickly run lint and format checks." Never reached an edit. (A prior 50-turn variant of the same seed — discarded — showed the same pattern with another 35 turns of similar investigation, also producing an empty diff. Conclusion: 50 turns isn't going to rescue this; the prompt or the instructions need to change.)

**The 5m06s wall-clock breakdown.** ~3.5 min in Claude turns (heavily dominated by 4–5 `pnpm test` / `pnpm build` calls @ ~50 s each that Claude issues to investigate), ~1.5 min in the harness's own build / test / lint / format scoring after Claude finishes. The judge call is sub-30 s. Pre-build per worktree adds ~70 s before the seed timer starts (logged separately by the driver).

**Cost extrapolation to Stage 1.** Pilot: input 17 tok, output 6.3k tok, cache-read 409k tok, ~5 min wall per seed. A 30-cell Stage 1 matrix (2 PRs × 2 variants × 3 seeds + buffer) at this rate ≈ 2.5 hours wall and ~12M cache-read tokens. If max-turns is bumped back up for the variant under test (with-CLAUDE.md), and that variant actually makes edits and verifies, expect 2–3× more turns and proportionally more tokens — budget accordingly.

**Findings for Stage 1.**
- The "no instructions" baseline on PR #657 fails to fix the build inside 15 turns, and almost certainly inside 50 turns too. This sets a clear A/B target: a `CLAUDE.md` variant should at minimum land *some* fix within the same turn budget.
- The harness's three primary signals aren't perfectly orthogonal: an empty-diff outcome trivially passes test_porting and anti_cheat, leaving `build` as the only discriminating signal. Stage 1 may want a fourth signal — "did the diff touch at least one source or test file" — to detect this no-op failure mode without leaning on the supplementary rating.
- The Sonnet judge needs `--max-turns >1`; it produced a clean JSON answer on turn 1 but kept poking around the repo afterwards. Driver now uses `--max-turns 6` for the judge and recovers the JSON via `.eval/repair-judge-scores.sh` if the final `.result` comes back null.

**Reproducibility note.** Re-run with `bash .eval/run-stage0.sh` (default: seeds 1 2 3, max-turns=15). For just one seed: `EVAL_SEEDS=1 bash .eval/run-stage0.sh`. To restore the plan's original 50-turn cap: `EVAL_MAX_TURNS=50 bash .eval/run-stage0.sh`.

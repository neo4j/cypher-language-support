---
name: finish-grammar-artifact-bump
description: Reconcile a Cypher grammar / semantic-analysis artifact bump — the monthly "Automated update of artifacts" bot PR or any change to Cypher25*.g4 / semanticAnalysis.js. Covers regenerating and committing cypher.json, categorizing new lexer tokens, fixing completion/highlighting/formatting wiring, and updating tests. Use when working on an artifact-bump PR, when the build breaks after grammar files changed, or when CI fails the "TextMate grammar is up to date" check.
---

# Finish a grammar/artifact bump

## What the bot does (and doesn't do)

`.github/workflows/fetch-dev-artifacts.yaml` runs Fridays at 04:10 UTC (scheduled runs skip after the 7th, so effectively the first Friday; `workflow_dispatch` always runs). It fetches from AWS CodeArtifact and overwrites exactly:

- `packages/language-support/src/antlr-grammar/Cypher25Lexer.g4` and `Cypher25Parser.g4`
- `packages/language-support/src/syntaxValidation/semanticAnalysis.js`
- `packages/lint-worker/server-version-tag.txt` (→ `neo4j-YYYY.MM`, drives the lint-worker npm dist-tag)

then opens a PR titled "Automated update of artifacts to neo4j version …". **The workflow never runs a build.** It `git add`s `packages/vscode-extension/syntaxes/cypher.json` too, but since nothing regenerated it, the bot PR's `cypher.json` is stale whenever the grammar change affects highlighting — that's why CI's "TextMate grammar is up to date" check (build job in `ci.yaml`) fails on these PRs and a human historically pushed a follow-up commit (e.g. `896d39ac` on PR #704).

Ownership reminder: `Cypher25Lexer/Parser.g4` and `semanticAnalysis.js` are synced from the internal Neo4j monorepo — never hand-edit. `CypherCmdLexer/Parser.g4` and `CypherPreLexer/Parser.g4` are this repo's files.

## Reconciliation procedure

Work on the bot's branch (`update-artifacts-YYYYMMDD-HHMMSS`).

1. **See what actually changed** — `git diff origin/main -- packages/language-support/src/antlr-grammar/` and skim the `semanticAnalysis.js` diff stat. Look for added/removed/renamed lexer tokens and parser rules. To experiment with how the new grammar parses something, use the `parse-cypher-with-antlr` skill (works straight off the `.g4` files, no build).
2. **Build**: `pnpm install && pnpm build` (~2 min; regenerates the parser and `cypher.json`). Compile errors at this stage almost always mean a new/removed token needs wiring in one of the usual suspects (in rough order of likelihood, all under `packages/language-support/src/`):
   - `lexerSymbols.ts` — every lexer token must be categorized into the `CypherTokenType` arrays (keywords/operators/etc.); new tokens break or mis-highlight until added.
   - `syntaxHighlighting/syntaxHighlighting.ts`
   - `autocompletion/completionCoreCompletions.ts` and `syntaxValidation/completionCoreErrors.ts`
   - `formatting/formatting.ts` (new clauses/keywords may need layout handling)
   These are exactly the files humans added on past bumps: PRs #704, #694, #642, #628.
3. **Commit the regenerated TextMate grammar**: check `git status --porcelain packages/vscode-extension/syntaxes/cypher.json` — if modified, commit it. CI fails on staleness and the error message tells you the same thing.
4. **Run unit tests**: `pnpm test`. Expect legitimate expectation updates in files like `clauses.test.ts`, `consoleCommands.test.ts`, `semanticValidation.test.ts`, `syntacticValidation.test.ts`, `styleguide.test.ts`. Distinguish "the new grammar/semantic analysis legitimately changed behavior" (update the expectation) from "our wiring is incomplete" (fix step 2's files) — check the grammar diff when unsure.
5. **Run the formatter corpus check**: `pnpm test:formattingIntegrity` (new syntax can break formatting invariants).
6. **Hygiene gates CI also runs**: `pnpm lint && pnpm format:check && pnpm check-imports`.
7. Optionally verify end-to-end (highlighting/completion in a real surface) via the `run-cypher-language-support` skill.

## Manual bump / bot failure

The workflow can be triggered manually: `gh workflow run "Monthly Artifact Bump"`. If the AWS fetch itself is broken, a fully manual bump (hand-replacing the four artifact files, then this same reconciliation) has precedent in PR #671.

---
name: release-and-publish-flows
description: How this repo versions and publishes — changesets in pre-release ("next") mode for the five npm packages, lint-worker's special neo4j-version dist-tag, canary snapshots, and the VS Code extension's separate tag-push stable + odd-minor pre-release flow. Use when asked about releasing, publishing, versioning, changesets, dist-tags, why a version looks odd, or why a merged change hasn't shipped. ADVISORY skill — never publish, push tags, or create changesets unless the user explicitly asks.
---

# Release and publish flows

**Ground rule: the maintainer owns releases.** This skill exists so you can explain flows, diagnose "why didn't X ship", and prepare exactly what's asked for — not so you can release. Never write files under `.changeset/`, push tags, bump versions, or run `pnpm release`/`vsce`/`ovsx`/`changeset` mutations unasked.

## Who gets published where

- **npm (5 packages)**: `@neo4j-cypher/language-support`, `language-server`, `lint-worker`, `query-tools`, `react-codemirror`.
- **Private (never on npm)**: `react-codemirror-playground`, `neo4j-for-vscode` (VS Code Marketplace + OpenVSX instead), `vendor/antlr4-c3`.

## npm flow (changesets, pre-release mode)

Changesets is in **pre mode** (`.changeset/pre.json`, tag `next`), which is why versions look like `2.0.0-next.34`.

1. A PR that changes a publishable package should include a changeset (`pnpm changeset` — select only the affected publishable packages; internal dependents auto-bump as patch via `updateInternalDependencies: patch` in `.changeset/config.json`). **This is the step that gets forgotten**: PRs merged without a changeset silently never release (PR #696 exists purely to backfill one for #681/#685). When a merged change hasn't shipped, check for a missing changeset first.
2. On every push to main, after `ci` succeeds, `publish-npm-packages.yaml` (a `workflow_run` trigger) runs the changesets action, which maintains a **"Version Packages (next)" PR** consuming pending `.changeset/*.md` files.
3. Merging that Version Packages PR triggers the actual publish, `pnpm release` (root `package.json`): everything except lint-worker publishes with `--tag next`; **lint-worker publishes with `--tag $(cat packages/lint-worker/server-version-tag.txt)`** (e.g. `neo4j-2026.07`) — that per-Neo4j-version dist-tag is how the extension's "Select Cypher linter version" feature finds the right linter for a server version. The tag file is updated by the monthly artifact bump (see the `finish-grammar-artifact-bump` skill).
4. A **canary** job then always runs `pnpm snapshot-release` (`changeset version --snapshot canary`, publish `--tag canary`) — so every green main gets a canary snapshot regardless of changesets.

## VS Code extension flow (separate from changesets)

`neo4j-for-vscode` is in changesets' `ignore` list and versioned by hand in `packages/vscode-extension/package.json`. Minor-version parity encodes the channel: **odd minor = pre-release track, even minor = stable** (current `1.17.x` = pre-release track).

- **Pre-release**: `pre-release-vscode-extension.yaml`, weekdays 02:00 UTC or manual dispatch. Skips if main's sha hasn't changed since the last publish (cached `last-published-sha`). Bumps by the odd-minor rule (even minor → next odd minor `.0`; odd minor → patch+1), publishes with `vsce publish --pre-release`, then **commits the version bump back to main** — those are the "bump pre-release version to …" commits all over the history.
- **Stable**: push a tag `neo4j-for-vscode@x.y.z` (or dispatch `publish-vscode-extension.yaml`) → publishes to the VS Code Marketplace (`vsce`) and OpenVSX (`ovsx`), both with `--no-dependencies` (mandatory in a pnpm workspace — vsce can't pack pnpm's node_modules layout). Note: as of July 2026 no such tag has ever been pushed (`git ls-remote --tags origin 'neo4j-for-vscode@*'` is empty), so stable publishes have in practice gone through manual dispatch.

## Read-only status checks (safe to run anytime)

```sh
npm view @neo4j-cypher/language-support dist-tags --json   # per-package published tags/versions
cat packages/lint-worker/server-version-tag.txt             # current lint-worker dist-tag
ls .changeset/*.md                                          # existing changesets
gh pr list --search "Version Packages" --state open         # pending release PR
git ls-remote --tags origin 'neo4j-for-vscode@*'            # stable extension release tags (local tags aren't fetched; empty so far)
node -p "require('./packages/vscode-extension/package.json').version"  # extension version (odd minor = pre-release)
```

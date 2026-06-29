# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A pnpm monorepo providing Neo4j Cypher language support (syntax highlighting, autocompletion, linting, formatting). The core logic lives in `language-support` and is consumed by the language server, the VS Code extension, and the CodeMirror integration.

## Prerequisites

Building from scratch (specifically regenerating the ANTLR parser) requires more than just Node + pnpm:
- Node.js (`engines` requires `>=24.11.1`; `.nvmrc` pins the version) and `pnpm` (via corepack)
- **Java** and **antlr4-tools** (`pip install antlr4-tools`) — needed by `gen-parser` in `language-support`'s build

## Common commands

Run from the repo root unless noted:

```bash
pnpm install
pnpm build                 # builds all packages recursively (order matters; see Architecture)
pnpm test                  # all unit tests (vitest) across packages, in parallel
pnpm lint                  # oxlint, type-aware, zero warnings tolerated
pnpm lint-fix
pnpm format                # oxfmt (formatter for this repo's own TS/JSON/YAML)
pnpm format:check
pnpm test:e2e              # end-to-end; run `pnpm exec playwright install` once first
pnpm check-imports         # relative imports in core packages MUST include file extensions
```

Per-package / focused work:

```bash
pnpm --filter @neo4j-cypher/language-support build
pnpm --filter @neo4j-cypher/language-support test          # vitest run, within that package
pnpm dev-codemirror        # run the react-codemirror playground
pnpm dev-vscode            # watch-build the VS Code extension (then use "VSCode Playground" in Run & Debug)
```

Running a single test (vitest) — `cd` into the package first, then pass a file/name pattern:

```bash
cd packages/language-support
pnpm vitest run path/to/file.test.ts          # one file
pnpm vitest run -t "name of the test"         # by test name
pnpm vitest path/to/file.test.ts              # watch mode
```

## Architecture

### Package dependency graph

`language-support` is the foundation. Everything else depends on it. Build order (handled by `pnpm --recursive`):

- **`language-support`** — core. ANTLR4-based parsing, autocompletion, linting, syntax highlighting, signature help, and the `cypherfmt` formatter. Exposes `CypherLanguageService` plus standalone functions (`autocomplete`, `lintCypherQuery`, `formatQuery`, `highlightSyntax`, `signatureHelp`). Entry: `src/index.ts`.
- **`lint-worker`** — wraps semantic analysis so it can run in a worker thread (via `workerpool`). Built to both CJS (for VS Code) and ESM (for react-codemirror).
- **`query-tools`** — manages the live Neo4j connection and keeps the `DbSchema` (labels, rel types, procedures, functions, database names) up to date. Main export: `SchemaPoller`.
- **`language-server`** — LSP server bundling the above into `cypher-language-server` (a standalone executable).
- **`vscode-extension`** (`neo4j-for-vscode`) — bundles the language server + lint worker; also generates a TextMate grammar and ships webviews.
- **`react-codemirror`** — CodeMirror 6 plugins + React wrapper using `language-support` and the lint worker directly in the browser.
- **`react-codemirror-playground`** — dev playground for the CodeMirror integration.

### The parser (generated, ANTLR4)

`packages/language-support/src/generated-parser/` is **generated from the grammar** in `src/antlr-grammar/*.g4` via the `gen-parser` script (needs Java + antlr4-tools). Do not hand-edit generated files; change the `.g4` grammar and regenerate. The build always regenerates the parser, so a fresh `pnpm build` requires the Java/antlr4 toolchain.

Autocompletion uses the vendored **`antlr4-c3`** code-completion engine (`vendor/antlr4-c3/`, a temporary copy until the pure-TS version is ready) to compute candidate tokens/rules at the caret, combined with the `DbSchema` for schema-aware completions (see `src/autocompletion/`).

### Semantic analysis (`semanticAnalysis.js`)

`packages/language-support/src/syntaxValidation/semanticAnalysis.js` is a **machine-generated, minified TeaVM compilation of Neo4j's Java semantic analyzer** — do not edit it (it's in oxlint's ignore list). It's invoked through `semanticAnalysisWrapper.ts` and provides the deep, server-accurate linting on top of ANTLR syntax errors. The lint-worker README notes esbuild `>= 0.27.0` is required for its minification to work since the TeaVM 0.13.0 update.

### Formatter (`cypherfmt`)

In `src/formatting/`. Two-stage: an ANTLR visitor (`formatting.ts`) walks the CST and does "simple formatting" + grouping, then the `layoutEngine.ts` applies Prettier-style dynamic line breaks. See `src/formatting/overview.md` for the full design (it was a thesis project). Also shipped as a `cypherfmt` CLI (`src/formatting/cli.ts`).

## Conventions

- **Relative imports in core packages must include file extensions** (`.js`, `.json`, `.mjs`) — enforced by `check-imports.sh` (a lint-staged hook on `language-support`, `query-tools`, `lint-worker`, and `vendor/antlr4-c3`). This is because these packages emit ESM.
- This repo formats/lints itself with **oxfmt + oxlint** (not prettier/eslint). `no-console` is an error except `warn`/`error`.
- Husky + lint-staged run oxfmt, oxlint `--fix`, and the import check on commit.
- Changes are released via **changesets** (`.changeset/`); add a changeset for user-facing changes.
- `neo4j-driver` is pinned via the pnpm `catalog` in `pnpm-workspace.yaml`. The workspace enforces a `minimumReleaseAge` on dependencies (4320 min) except neo4j NDL/NVL packages.

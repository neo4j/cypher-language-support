# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monorepo providing Cypher language tooling (autocompletion, linting, formatting, syntax highlighting) for Neo4j. The core parsing is ANTLR4-based, exposed through an LSP server, a VS Code extension, and a React CodeMirror editor component.

## Build & Development

**Prerequisites:** Node.js >=24.11.1, pnpm (via corepack), antlr4-tools (`pip install antlr4-tools`), Java (for ANTLR4).

```bash
pnpm install
pnpm build                    # Build all packages (includes ANTLR parser generation)
pnpm dev-codemirror           # Dev mode for CodeMirror playground
pnpm dev-vscode               # Dev mode for VS Code extension (or use Run & Debug > VSCode Playground)
```

To build only the VS Code extension and its dependencies: `pnpm build-vscode`

## Testing

```bash
pnpm test                     # All unit tests (vitest, runs in parallel across packages)
pnpm test:e2e                 # All E2E tests (Playwright for CodeMirror, WebdriverIO for VS Code)
```

Run tests for a single package:
```bash
pnpm --filter @neo4j-cypher/language-support test
pnpm --filter @neo4j-cypher/react-codemirror test
pnpm --filter @neo4j-cypher/query-tools test
```

Run a single test file:
```bash
pnpm --filter @neo4j-cypher/language-support exec vitest run src/tests/autocompletion/someTest.test.ts
```

Vitest workspace covers: `packages/language-support`, `packages/react-codemirror`, `packages/query-tools`, `vendor/antlr4-c3`.

First time running E2E: `pnpm exec playwright install`

## Linting & Formatting

```bash
pnpm lint                     # oxlint with type-aware checking (--max-warnings 0)
pnpm lint-fix                 # Auto-fix lint issues
pnpm format                   # oxfmt (printWidth: 80, singleQuote: true)
pnpm format:check             # Check formatting without writing
pnpm check-imports            # Verify relative imports have .js extensions
```

Relative imports in `language-support`, `query-tools`, `lint-worker`, and `vendor/antlr4-c3` **must** use `.js` extensions (ESM requirement). This is enforced by pre-commit hooks and CI.

## Package Architecture

```
language-support          Core library: ANTLR4 parsing, autocompletion, linting,
                          formatting, syntax highlighting. Dual CJS/ESM build.
                          Includes `cypherfmt` CLI tool.

language-server           LSP wrapper around language-support. Provides completions,
                          diagnostics, formatting, and signature help over LSP.

vscode-extension          VS Code extension bundling the language server. Adds
(neo4j-for-vscode)        connection management, query execution, parameter UI,
                          and webview components (React + Neo4j NDL).

react-codemirror          CodeMirror 6 editor component with React bindings.
                          Uses lint-worker for non-blocking linting.

lint-worker               Separate worker bundle (ESM + CJS) for offloading
                          linting. Copied into language-server, react-codemirror,
                          and vscode-extension at build time.

query-tools               Internal package for Neo4j driver integration, schema
                          extraction, and connection management.

vendor/antlr4-c3          Vendored fork of antlr4-c3 (code completion core).
                          Built as a dependency of language-support.
```

**Dependency flow:** `antlr4-c3` → `language-support` → `lint-worker` / `language-server` / `react-codemirror` → `vscode-extension` / `react-codemirror-playground`

## ANTLR4 Grammar

Grammar files live in `packages/language-support/src/antlr-grammar/` (`CypherCmdLexer.g4`, `CypherCmdParser.g4`). Generated parser output goes to `packages/language-support/src/generated-parser/`. Regenerate with:

```bash
pnpm --filter @neo4j-cypher/language-support gen-parser
```

## Parse tree
The parse tree from a given query can be seen in LISP form by inside `packages/language-support/src/antlr-grammar/` executing
```
antlr4-parse.exe ./CypherCmdLexer.g4 ./CypherCmdParser.g4 statementsOrCommands -tree <query-file-name>
```
Where query-file-name is a file containing the query to parse. I have made a file query.txt which you can overwrite the content of.


## CI

CI runs: build → oxlint → import extension check → format check → unit tests → polling integration tests → E2E tests (Playwright + WebdriverIO) → TextMate grammar validation.

## Release

Uses changesets for versioning. `pnpm release` builds and publishes all packages. Snapshot releases via `pnpm snapshot-release` publish to the `canary` tag.

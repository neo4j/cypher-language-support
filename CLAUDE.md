# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Build
```bash
pnpm build          # Build all packages
pnpm build-vscode   # Build only the VS Code extension
pnpm dev-codemirror # Start CodeMirror playground dev server
pnpm dev-vscode     # Start VS Code extension dev server
```

### Test
```bash
pnpm test           # Run all unit tests (vitest, parallel)
pnpm test:e2e       # Run end-to-end tests (Playwright + wdio)
pnpm test:formattingIntegrity  # Run formatting verification tests
```

**Run a single test file:**
```bash
cd packages/language-support
pnpm test -- src/tests/autocompletion/keywordCompletion.test.ts

# React CodeMirror (Playwright):
cd packages/react-codemirror
pnpm test:e2e -- --grep "test pattern"
```

### Lint & Format
```bash
pnpm lint           # Run oxlint (max-warnings 0)
pnpm lint-fix       # Run oxlint with auto-fix
pnpm format         # Format with oxfmt
pnpm format:check   # Check formatting only
pnpm check-imports  # Verify all relative imports have file extensions
```

### Parser Regeneration
```bash
cd packages/language-support
pnpm gen-parser     # Regenerate ANTLR4 parser from grammar files
```
The generated parser in `src/generated-parser/` is excluded from git and must be regenerated after grammar changes.

### Cleanup
```bash
pnpm clean          # Remove dist and tsconfig.tsbuildinfo files
pnpm deep-clean     # Full cleanup including node_modules
```

## Architecture

This is a pnpm monorepo (requires pnpm 10.21.0, Node 24.11.1) providing Cypher language support across multiple editor integrations.

### Layered Package Dependency

```
react-codemirror-playground (demo)
react-codemirror (CodeMirror 6 component) ──────┐
neo4j-for-vscode (VS Code extension)             ├── language-support (core engine)
language-server (LSP binary) ───────────────────┘    lint-worker
                                                      query-tools
```

### Key Packages

**`packages/language-support`** — The immovable foundation. All language features live here: autocompletion, formatting, linting, syntax highlighting, and validation. Parses Cypher using ANTLR4 (grammar in `src/antlr-grammar/`). Exports both ESM and CommonJS. Also ships the `cypherfmt` CLI.

**`packages/language-server`** — Wraps language-support as an LSP binary (`cypher-language-server`). Supports stdio, IPC, and socket communication. Bundles into a single executable via esbuild. Uses `workerpool` and `lint-worker` for async linting.

**`packages/lint-worker`** — Linting runs in background workers to avoid blocking the editor. Compiled to both CJS (for language-server/Node) and ESM (for react-codemirror/browser). Contains a TeaVM (WASM-GC) compiled linter.

**`packages/query-tools`** — Internal package; exports `SchemaPoller` which keeps Neo4j database schema (labels, procedures, functions) in sync via neo4j-driver.

**`packages/react-codemirror`** — React 16.8+/17/18 component wrapping CodeMirror 6. Integrates lint-worker for async linting. Unit tests via vitest; component tests via Playwright.

**`packages/vscode-extension`** (named `neo4j-for-vscode`) — Bundles language-server, language-support, and query-tools. Provides editor integration, commands, connection panel, and webview-based query result views. Unit tested with mocha; UI tested with WebDriverIO.

**`vendor/antlr4-c3`** — Vendored fork of the ANTLR4 code-completion helper.

### TypeScript Setup

Uses TypeScript project references (`tsconfig.json` references pattern) for incremental builds. All packages extend `tsconfig.base.json`. Strict mode is on. All relative imports **must have file extensions** (enforced by `check-imports.sh` and pre-commit hooks).

### Grammar & Parser

Cypher grammar is defined in `packages/language-support/src/antlr-grammar/` (`CypherCmdLexer.g4`, `CypherCmdParser.g4`). Running `pnpm gen-parser` compiles these with the ANTLR4 JAR in `vendor/antlr4/` and writes output to `src/generated-parser/`.

### Tooling
- **Linter:** oxlint (configured in `oxlint.config.ts`)
- **Formatter:** oxfmt (configured in `.oxfmtrc.json`, 80-char width, single quotes)
- **Pre-commit:** Husky + lint-staged runs oxfmt + oxlint + check-imports on staged files
- **Versioning:** changesets (run `pnpm changeset` to add a changeset before merging)
- **Test runners:** vitest (unit), Playwright (component/e2e), WebDriverIO (VS Code UI), mocha (some VS Code unit tests)

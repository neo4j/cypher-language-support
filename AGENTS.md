# AGENTS.md

This file provides guidance to coding agents (Claude Code, Codex, Cursor, …) when working with code in this repository.

## Repository overview

pnpm monorepo (workspaces: `packages/*` and `vendor/*`) implementing Neo4j's Cypher language support: syntax highlighting, autocompletion, linting, and formatting. Generating the parser additionally requires `antlr4-tools` (`pip install antlr4-tools`) and Java.

## Commands

```sh
pnpm install
pnpm build            # required before tests: generates the ANTLR parser, TextMate grammar, and bundles
pnpm test             # unit tests (vitest) across all packages
pnpm test:e2e         # e2e tests (run `pnpm exec playwright install` once first). Ask user to run these, they requires container manager and pop up windows on execution
pnpm lint             # oxlint (not eslint); pnpm lint-fix to autofix 
pnpm format           # oxfmt (not prettier); pnpm format:check to verify without autofix
pnpm check-imports    # verifies relative imports have .js extensions (see conventions)
pnpm build-vscode     # build only the VS Code extension and its dependencies
```

Run a single test file from the repo root (vitest workspace covers `language-support`, `lint-worker`, `react-codemirror`, `query-tools`):

```sh
pnpm vitest run packages/language-support/src/tests/lexer.test.ts
pnpm vitest run -t "test name substring"
```

Package-specific test suites:

- `pnpm --filter @neo4j-cypher/query-tools test:polling` — schema-polling integration tests (testcontainers, needs Docker).
- `pnpm --filter @neo4j-cypher/react-codemirror test:e2e` — Playwright component tests (`test:e2e-ui` for UI mode).
- `pnpm --filter neo4j-for-vscode test:apiAndUnit` — VS Code API/unit tests (mocha via `@vscode/test-electron`). Needs container manager like Docker/Rancher to run Neo4j
- `pnpm --filter neo4j-for-vscode test:webviews` — webview tests (wdio).
- `pnpm test:formattingIntegrity` — formatter verification over a large query corpus.

## Shell, paths and tooling (Windows dev machine)

- The Bash tool is Git Bash (POSIX) — PowerShell cmdlets (`Select-String`, `Select-Object`, …) do not exist there. In the PowerShell tool, never append `2>&1` to a native command: PowerShell 5.1 wraps stderr in `NativeCommandError` records and hides the real output (stderr is captured for you anyway).
- The shell working directory persists between calls (even across the Bash and PowerShell tools), so after any `cd` later relative paths silently resolve against the wrong directory. Relative paths work fine from the repo root — just `cd` back (or use absolute paths) rather than assuming you're still there.
- In Git Bash, unquoted backslash paths lose their backslashes (`C:UsersIsak...`) — quote them or use forward slashes.
- Repo tools are not on PATH: use `pnpm exec tsc`, `pnpm vitest run ...`, `pnpm format`. The test runner is vitest via pnpm — never jest, and this is a pnpm workspace, so `npm --workspace` does not work.

## Architecture

Dependency flow: `vscode-extension` bundles `language-server`, which (like `react-codemirror`) is powered by `language-support` and `lint-worker`; `query-tools` supplies the live database schema.

- **`packages/language-support`** — the core library. Everything else wraps it.
  - The parser is generated from the ANTLR4 grammar in `src/antlr-grammar/` into `src/generated-parser/` at build time (`pnpm gen-parser`). The grammar and `src/syntaxValidation/semanticAnalysis.js` (Neo4j's real semantic analysis, compiled to JS) originate in the internal Neo4j monorepo and are bumped monthly by an automated PR — do not hand-edit them.
  - Feature areas: `autocompletion/` (built on the vendored `vendor/antlr4-c3` completion core), `syntaxValidation/` (lexer/parser errors + semantic analysis + schema-based validation), `formatting/` (see `src/formatting/overview.md`), `syntaxHighlighting/`, `signatureHelp.ts`.
  - Most features take a `DbSchema` (labels, procedures, databases, …) to give schema-aware results.
- **`packages/lint-worker`** — wraps linting in a `workerpool` worker so it runs off-thread. Built both as CJS (`lintWorker.cjs`, for the language server / VS Code) and ESM (`lintWorker.mjs`, for react-codemirror); consumers copy the bundle into their own dist at build time. Also pins an older published `@neo4j-cypher/language-support` for linting against older Neo4j versions (the extension's "Select Cypher linter version" command downloads other versions at runtime).
- **`packages/query-tools`** — Neo4j connection management and schema polling (`schemaPoller.ts`, `metadataPoller.ts`) that keeps the `DbSchema` up to date.
- **`packages/language-server`** — thin LSP wrapper; esbuild-bundles everything into a single `dist/cypher-language-server.js`.
- **`packages/vscode-extension`** — bundles the language server and lint worker into its `dist/`. Connection UI is React webviews under `src/webviews/`. Not published to npm (packaged with `vsce`).
- **`packages/react-codemirror`** (+ `react-codemirror-playground`) — CodeMirror 6 plugins and React wrapper, using `language-support` directly in the browser.
- **`vendor/antlr4-c3`** — vendored fork of the antlr4-c3 code-completion library; part of the workspace and built as part of `language-support`'s build. To be replaced soon by a true dependency, do not edit it.

## Conventions and gotchas

- `packages/vscode-extension/syntaxes/cypher.json` (TextMate grammar) is **generated** by `pnpm gen-textmate` (runs during build) from `language-support`'s `textMateGrammar.ts`, but is committed. CI fails if it is stale — after a build changes it, commit the updated file. Never edit it by hand.
- Relative imports in `language-support`, `query-tools`, `lint-worker`, and `vendor/antlr4-c3` must include the `.js` extension (`from './helpers.js'`). Enforced by `pnpm check-imports` in CI; TypeScript's `nodenext` mode can't be used yet because of antlr4's type declarations.
- VS Code API tests run against the **bundled** `dist/extension.js` while test files are compiled separately from `src/` — sinon stubs applied to `src/` modules do not affect command handlers invoked via `commands.executeCommand` (two separate module graphs). Call the `src/` function directly if you need stubs to apply.
- Downloaded lint workers are cached in the real VS Code global storage (`%APPDATA%/Code/User/globalStorage/neo4j-extensions.neo4j-for-vscode`), not in `.vscode-test/user-data`.
- Never Read/Grep build output to understand code: the `dist/` bundles (e.g. `lintWorker.mjs`, ~8 MB), `src/generated-parser/`, and `semanticAnalysis.js` are far too large for tools and are generated anyway — read the package's `src/` instead. To introspect a built package's runtime exports, run `node -e "require('...')"` from inside that package's directory (deps don't resolve from the repo root, and `vscode` never resolves outside the extension host).
- `pnpm exec tsc` can surface pre-existing type errors unrelated to your change — compare against main before treating them as regressions.
- Husky + lint-staged run oxlint/oxfmt on commit. Releases use changesets — but do not create changeset files or run any publish step unasked; the maintainer owns those.
- `.vscode/launch.json` has launch configs for the CodeMirror playground, the extension host (`VSCode Playground`), and debugging both VS Code test suites.

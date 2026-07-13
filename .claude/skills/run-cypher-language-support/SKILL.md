---
name: run-cypher-language-support
description: Build, run, screenshot and drive the Cypher language support surfaces — the react-codemirror playground (browser), the cypher-language-server (LSP over stdio) and the cypherfmt CLI. Use when asked to run the app, start the playground, take a screenshot, or verify a language-support change (completion, linting, formatting) end-to-end in a real running surface.
---

# Run: Cypher language support

This monorepo has three drivable surfaces, all powered by `packages/language-support`: the **react-codemirror playground** (web demo), the **language server** (LSP binary), and the **cypherfmt CLI**. Two driver scripts live next to this file; all paths below are relative to the repo root.

The drivers are cross-platform (they branch on `process.platform` for process-tree kill and the browser-cache location). Verified end-to-end on Windows 11; the unix code paths are implemented but not yet exercised — on first use on a unix machine, run both drivers once and fix/report anything that breaks.

Pick the surface by what the change touches: formatting → CLI (fastest), server plumbing/diagnostics → LSP driver, editor behavior (completion tooltips, lint underlines, highlighting) → playground driver.

## Prerequisites

Node >= 24.11.1, pnpm, plus `antlr4-tools` (pip) and Java for the ANTLR parser generation during build. All already present on this machine.

## Build

```sh
pnpm install
pnpm build   # ~2 min; generates the parser, TextMate grammar, and all bundles
```

Build is required before any driver — they run against `dist/` output.

## Run (agent path)

### Playground (browser, screenshot)

```sh
node .claude/skills/run-cypher-language-support/driver-playground.mjs --screenshot playground-screenshot.png
```

Starts the playground's vite dev server on port 5199, drives it with headless Chromium (Playwright resolved from `packages/react-codemirror`), and verifies three flows: lint error underline on a typo query, label autocompletion from the mock schema after `MATCH (n:`, and the "Format Query" action. Prints `PASS`/`FAIL` per check, saves the screenshot (autocomplete tooltip open) to the given path, kills vite, exits 0 only if all pass. Takes ~30 s. Pass `--url http://localhost:5173` to drive an already-running dev server instead of starting one.

### Language server (LSP over stdio)

```sh
node .claude/skills/run-cypher-language-support/driver-lsp.mjs
```

Spawns `packages/language-server/dist/cypher-language-server.js`, opens a document with a typo (`RETRN`), prints the diagnostics the server pushes and the completions offered after `MATCH (n) RETURN `, exits 0 if both worked (10 s timeout). Pass a query as the first argument to lint that instead — it waits for a **nonempty** diagnostics push, so pass a query that actually has an error.

### cypherfmt CLI

```sh
printf 'match (n:Person) where n.age > 30 return n' | node packages/language-support/dist/esm/formatting/cli.mjs
```

Prints the formatted query (`MATCH (n:Person)\nWHERE n.age > 30\nRETURN n`), exit 0.

## Run (human path)

`pnpm dev-codemirror` from the repo root runs dependency watchers and vite with `--open` (pops a browser window) — fine for a human, useless for an agent; use the driver above instead.

## Gotchas

- **The server never lints by default.** Diagnostics are gated on `settings.features.linting`, which only arrives via a `workspace/didChangeConfiguration` notification (`{ settings: { neo4j: { features: { linting: true } } } }`). Without it you get exactly one empty `publishDiagnostics` and nothing else. The LSP driver sends it for you.
- **Linting is async**: debounced 600 ms and run in a cold workerpool, and the first `publishDiagnostics` push is often an empty clear. Wait for a nonempty push, don't grab the first one.
- **`textDocument/completion` crashes without `context`**: the server dereferences `context.triggerKind`; omitting it returns a `-32603` error. Always send `context: { triggerKind: 1 }`.
- **Playwright browser revision mismatch**: the workspace's playwright (1.58.2, wants chromium revision 1208) may not match the builds in the playwright cache — `%LOCALAPPDATA%\ms-playwright` on Windows, `~/.cache/ms-playwright` on Linux, `~/Library/Caches/ms-playwright` on macOS. The playground driver auto-falls back to the newest installed `chromium_headless_shell-*` via `executablePath` — do **not** `playwright install` without asking.
- **Completions at the end of a broken query are legitimately empty** — that's not a server failure. Use a completion-friendly cursor position like after `RETURN `.
- The driver spawns pnpm with `shell: true`, so `viteProc.pid` is the shell, not vite. Stopping it needs a process-tree kill: `taskkill /T` on Windows, a detached process group + `kill(-pid)` on unix (the driver does both).

## Troubleshooting

- `Error: Port 5199 is already in use` — a vite from an earlier crashed driver run is still alive. Find and kill it — Windows: `netstat -ano | findstr 5199` then `taskkill /pid <PID> /T /F`; unix: `lsof -ti :5199 | xargs kill`. The driver uses `--strictPort` so it fails loudly rather than silently shifting ports.
- `browserType.launch: Executable doesn't exist at ...chromium_headless_shell-1208...` — the revision-mismatch gotcha above; the driver's fallback handles it (logs `default browser missing, falling back to ...`). If even the fallback finds nothing, ask the user before downloading browsers.
- LSP driver prints `TIMEOUT` — usually means the build is stale or missing; re-run `pnpm build` (the driver needs `dist/cypher-language-server.js` *and* the adjacent `lintWorker.cjs` that the build copies in).

## Tests (sanity check, not the main event)

```sh
pnpm test                 # unit tests across packages (vitest)
```

VS Code extension e2e suites need Docker/Rancher and pop windows — ask the user to run those (see AGENTS.md).

---
name: run-vscode-extension-tests
description: Run and debug the VS Code extension test suites — the API/unit tests (@vscode/test-electron + mocha + testcontainers Neo4j) and the webview tests (wdio) — including their prerequisites, the two-module-graph stubbing gotcha, the linter download cache, and known flakiness patterns. Use when a change touches packages/vscode-extension, or when asked to run, debug, or de-flake those suites.
---

# Run the VS Code extension test suites

## Before running anything

Both suites pop real VS Code windows, download a VS Code build on first run, and need a running container manager (Docker/Rancher) — they start their own Neo4j testcontainers. **Confirm with the user before launching them** (established repo rule), and don't run them from a context where popping windows is a problem.

## The suites

```sh
pnpm --filter neo4j-for-vscode test:apiAndUnit   # API + unit tests
pnpm --filter neo4j-for-vscode test:webviews     # webview tests (wdio)
```

- **`test:apiAndUnit`** runs `build:dev`, wipes `.vscode-test/user-data`, then `dist/tests/runApiAndUnitTests.js`: it starts **two Neo4j testcontainers itself** (a Neo4j 5 and a 2025.x, via `tests/setupTestContainer.ts` — no pre-running Neo4j needed; host ports are random-mapped and passed as `NEO4J_5_PORT`/`NEO4J_2025_PORT`) and runs mocha (tdd UI, 30 s per-test timeout, globs `**/{api,unit}/**/*.spec.js` under `dist/tests`). A separate small `test:mocha` (param unit test) runs after. Connection defaults/overrides live in `tests/helpers.ts`.
- **`test:webviews`** runs wdio via `wdio-vscode-service` against `dist/tests/runWebviewTests.js`.
- CI (`ci.yaml`) runs both under `xvfb-run -a` on Linux; locally the windows are visible.

## Environment gotchas

- **Node must be < 24.16.0** (CI pins 24.15.0): Node 24.16 hangs playwright's browser-archive extraction and breaks the wdio webview tests. See the comment in `.github/actions/setup-and-build/action.yaml` and playwright issue #40724. If a suite hangs immediately on browser/VS Code setup, check `node --version` first.
- **Two module graphs** (the big one, also in AGENTS.md): the extension under test is the bundled `dist/extension.js`, while spec files compile separately from `src/`. Anything invoked via `commands.executeCommand(...)` runs the **real bundled handlers** — sinon stubs applied to `src/` modules don't reach them, so those paths do real npm fetches, real downloads, real language-server calls. To test with stubs applied, import and call the `src/` function directly.
- **Linter download cache**: downloaded lint workers live in the real VS Code global storage — `%APPDATA%/Code/User/globalStorage/neo4j-extensions.neo4j-for-vscode` on Windows (`tests/helpers.ts` `getExtensionStoragePath()`) — NOT in `.vscode-test/user-data`. The suite's user-data wipe therefore does not give you cold-download behavior; wipe the globalStorage path for that.

## Flakiness patterns (learned the hard way in lintSwitching.spec.ts)

- End-to-end assertions that drive the real bundled pipeline (linter download → workerpool spawn → relint) race `eventually()` timeouts: cold runs took ~9–14 s against a 15 s default, and genuine intermittent hangs in the download/worker-terminate path exist. Prefer the suite's **spy-based pattern** (assert the `updateLintWorker` notification via the mock client) over asserting eventual diagnostics from real downloads; `versionSpecificLinting.spec.ts` keeps the real end-to-end coverage.
- Connection setup in `beforeEach` (`saveDefaultConnection()`) itself triggers a linter switch on the real server unless `LINTER_SWITCHING_TESTS=true` (see `connectionService.ts`) — a test's own linter switch can race it.
- `eventually()`'s backoff is capped by `maxBackoffMs` in `tests/helpers.ts`; the cap bounds wall-clock for **all** `eventually`-based tests, so tuning it for one test can time out others (mocha's 90 s overall timeout fires above everything).

## Debugging interactively

`.vscode/launch.json` has **Debug VSCode Tests** (extension host + `dist/tests/testRunnerDebug`) and **Debug VSCode Webview Tests** (wdio with `DEBUG_VSCODE_TESTS=true`); both `preLaunchTask: build-vscode`. These are for a human at the IDE — as an agent, run the suite commands above instead.

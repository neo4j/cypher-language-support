# Research: Introducing `vscode-extension-tester` (ExTester)

> **Date:** 2026-03-05
> **Repository:** https://github.com/redhat-developer/vscode-extension-tester
> **Conclusion:** Not recommended — overlaps with existing `wdio-vscode-service` setup

## What is ExTester?

A Selenium WebDriver-based E2E UI testing framework for VS Code extensions,
maintained by Red Hat. It launches a real VS Code instance, drives it via
ChromeDriver, and provides 30+ pre-built Page Objects for interacting with VS
Code UI components (editors, sidebars, activity bar, terminals, notifications,
context menus, etc.).

- **Latest release:** v8.22.1 (February 2025)
- **License:** Apache 2.0
- **Stars:** ~315 | **Dependents:** ~730 | **Contributors:** 35

## Current Test Stack in This Repo

| Layer                  | Framework                        | Purpose                                             |
| ---------------------- | -------------------------------- | --------------------------------------------------- |
| Unit                   | Vitest (76+ files)               | Parser, autocompletion, syntax validation, formatter |
| VS Code Integration    | @vscode/test-electron            | Extension API, commands, language features           |
| VS Code Webview E2E    | WebdriverIO + wdio-vscode-service | Webview UI elements inside VS Code                  |
| Component E2E          | Playwright CT                    | React CodeMirror components (Chromium + Firefox)    |
| Database Integration   | TestContainers (Neo4j)           | Query tools against real Neo4j instances             |
| Benchmarks             | Vitest bench                     | Completion and parser performance                   |

## Pros

1. **Rich Page Object library** — 30+ built-in page objects for VS Code
   components (ActivityBar, TextEditor, ProblemsView, ContentAssist,
   SettingsEditor, etc.) maintained by Red Hat.

2. **Institutional backing** — Red Hat uses it for their own extensions (Java,
   XML, YAML). Actively maintained with monthly releases.

3. **Purpose-built for VS Code** — Handles VS Code download, ChromeDriver
   matching, extension packaging/installation automatically via CLI.

4. **Good for non-webview UI flows** — Content assist popups, problems panel,
   notifications, command palette, context menus.

5. **Built-in code coverage** via `--coverage` CLI flag.

6. **Established ecosystem** — ~730 dependent projects.

## Cons

1. **Overlaps with existing WebdriverIO setup** — `wdio-vscode-service` already
   does VS Code UI testing. Adding ExTester means two Selenium-style E2E
   frameworks doing similar work.

2. **No VS Code API access from tests** — Unlike `@vscode/test-electron` and
   `wdio-vscode-service` (which has a bridge), ExTester cannot call `vscode.*`
   APIs. All interaction must go through the UI only.

3. **Would be the 5th test framework** — Vitest, Mocha, WebdriverIO, and
   Playwright are already maintained. Adding a 5th increases cognitive load.

4. **Narrow VS Code version window** — Only supports 3 minor versions at a time
   (currently 1.107–1.109). Locators must be updated for every VS Code DOM
   change.

5. **Selenium-inherent flakiness** — Timing issues, element visibility races,
   and DOM structure changes between VS Code releases.

6. **Slow execution** — Tests take minutes, not seconds. Initial setup downloads
   ~200MB (VS Code + ChromeDriver).

7. **No web extension support** — Only tests desktop VS Code (Electron).

8. **~80 open issues** — Indicates ongoing maintenance challenges around locator
   breakage with new VS Code versions.

## Head-to-Head Comparison

| Capability              | ExTester          | wdio-vscode-service (current) | @vscode/test-electron (current) |
| ----------------------- | ----------------- | ----------------------------- | ------------------------------- |
| Drive real VS Code UI   | Yes               | Yes                           | Partial (API-level)             |
| Page Objects for VS Code | 30+ built-in     | Built-in                      | N/A                             |
| VS Code API access      | **No**            | **Yes** (bridge)              | **Yes** (full)                  |
| Webview testing         | Yes               | Yes                           | Limited                         |
| Web extension support   | No                | Yes                           | Yes                             |
| Test runner             | Mocha only        | Mocha/Jasmine/Cucumber        | Any                             |
| Driver                  | Selenium          | WebdriverIO protocol          | Extension Host                  |

## Recommendation

**Do not introduce ExTester.** Rationale:

1. **Equivalent capability already exists** — `wdio-vscode-service` covers the
   same E2E UI testing use case and is already integrated. It also offers VS
   Code API bridge access that ExTester lacks.

2. **Diminishing returns** — ExTester's page objects do not justify adding a 5th
   test framework with its own configuration, dependencies, and maintenance.

3. **Better investment** — Expand the existing WebdriverIO test suite if more UI
   test coverage is needed.

4. **If reconsidering** — The one scenario where ExTester might add value is if
   `wdio-vscode-service`'s page objects prove insufficient for specific native
   UI components (Problems panel, SCM view, notification workflows). In that
   case, run a small targeted pilot before committing.

## Alternative: Expand WebdriverIO Coverage

Instead of introducing a new framework, consider:

- Adding more test specs under `packages/vscode-extension/tests/specs/webviews/`
- Using `wdio-vscode-service` page objects for Activity Bar, Sidebar, Editor,
  and Bottom Bar interactions
- Leveraging the VS Code API bridge for setup/teardown operations that would be
  slow via pure UI automation

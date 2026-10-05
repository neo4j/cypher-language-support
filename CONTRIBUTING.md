# Contributing to Cypher Language Support

We're grateful for any thoughts or code you share. Feel free to open an issue if you run into a bug or have other improvement suggestions. To contribute a fix or a new feature we have a bit of process you'll need to follow:

- Do your work in a personal fork of the original repository
- Create a branch (with a useful name) for your contribution
- Include unit/e2e tests if appropriate (obviously not necessary for documentation changes)
- Take a moment to read and sign our [Contributor License Agreement](https://neo4j.com/developer/cla).

We can't guarantee that we'll accept pull requests and may ask you to make some changes before they go in.
Occasionally, we might also have logistical, commercial, or legal reasons why we can't accept your work but we'll try to find an alternative way for you to contribute in that case.

## Building the project

Pre-requisites:

- Node.js LTS (24.x)
- [pnpm](https://pnpm.io/installation#using-corepack)

In the root folder of the project run:

- `pnpm install`
- `pnpm run build`

From here you can start the `react-codemirror-playground` with:

`pnpm dev-codemirror`

To run the VS Code extension, choose `VSCode Playground` in the `Run & Debug` menu in VS Code.


## Testing

To make unit tests, or tests that do not require any complex setup, define a `vitest.config.ts` file in each package. This file can define one or more projects:

* unit
* integration

These can be run with `pnpm test`, `pnpm test:unit` and `pnpm test:integration` in the top `package.json`.

### E2E

`react-codemirror` and `react-codemirror-playground` use Playwright for E2E testing, each project defines the tests in the `playwright-ct.config.ts` or `playwright.config.ts`.

`vscode-extension`, the integration and e2e tests run using `@vscode/test-electron` with `mocha`. The `webview` tests additionally use `webdriverio`.


### Executing the tests

Unit tests:

```
pnpm test:unit
```

Integration tests:

```
pnpm test:integration
```

End to end tests:

```
pnpm exec playwright install // Only the first time that you need to run these
pnpm test:e2e
```

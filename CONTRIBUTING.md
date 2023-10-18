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

- Node.js LTS (18.x)
- [antlr4-tools](https://github.com/antlr/antlr4-tools) easiest to install with `pip install antlr4-tools` (python3 required)

In the root folder of the project run:

- `npm install`
- `npm run build`

From here you can start the `react-codemirror-playground` with:

`npm run dev:codemirror`

To run the VSCode extension, see the `vscode-extension` [README.md](./packages/vscode-extension/).

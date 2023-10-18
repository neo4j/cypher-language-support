# Cypher Language Support

This mono repo contains packages that together make up Neo4j's Cypher Language support.

## Project status

The project is currently in an early stage. We are still missing important features and the project is not yet stable. We welcome feedback and contributions!

Try it out in our demo or in our alpha releases in [Neo4j Workspace](workspace-preview.neo4j.io) and soon also in our VSCode extension.

## Project Overview

![](./imgs/repo-overview.png)

The packages are:

- [language-support](./packages/language-support/README.md) - The core library implementing the language support features.
- [language-server](./packages/language-server/README.md) - The language server wrapper for the `language-support` package.
- [vscode-extension](./packages/vscode-extension/README.md) - The Neo4j VSCode extension which bundles the `language-server`
- [react-codemirror](./packages/react-codemirror/README.md) - A set of [codemirror6](https://codemirror.net/) cypher language support plugins and a react wrapper.
- [react-codemirror-playground](./packages/react-codemirror-playground/README.md) - A playground for the codemirror integration.
- [schema-poller](./packages/schema-poller/README.md) - An internal package we use to manage the Neo4j connection and keep the schema (procedure names, labels, database names, etc.) up to date in the language server.

## Building the project and contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for more information.

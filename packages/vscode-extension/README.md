# Neo4j for VS Code Preview

## Getting started

Open a file with `.cypher` extension after installing the extension from the VSCode marketplace. To enable database aware features (such as completing labels/functions), set up a connection to a neo4j instance using the settings described in the settings section below.

### Feature Highlights

Our extension preview provides a rich set of features for working with Cypher, including:

- Syntax highlighting
- Syntax checking - both syntax and semantic errors (e.g. type errors, unknown labels etc.)
- Autocompletion for Cypher keywords, functions, labels, properties, database names and more
- Signature help for functions - shows the signature of the function while typing

![whirlwind-tour](https://github.com/neo4j/cypher-language-support/blob/main/packages/vscode-extension/images/demo.gif?raw=true)

### Upcoming features

We're working on adding more features to the extension, such as:

- Easier database connection management
- Embedded cypher support in other file types
- REPL-like scratchpad for debugging queries
- Automated formatting

## Extension settings

The following settings are available in VSCode once the plugin is installed, which can be set either through the `Settings` menu on VSCode or by editing your `.vscode/settings.json` file.

- `cypherLSP.neo4j.connect`: If true it will attempt to connect to a Neo4j database to retrieve data used for completions. Defaults to `true`.
- `cypherLSP.neo4j.user`: Defaults to `"neo4j"`
- `cypherLSP.neo4j.password`: Defaults to `"password"`
- `cypherLSP.neo4j.URL`: Defaults to `"neo4j://localhost:7687"`

### Debug

- `cypherLSP.trace.server`: Traces the communication between VS Code and the language server for debugging purposes.

### Contributing

We welcome your suggestions, ideas, bug reports and contributions on the project on our [github](https://github.com/neo4j/cypher-language-support).

To build the project locally, see the [CONTRIBUTING.md](CONTRIBUTING.md) file at the root of the repository.

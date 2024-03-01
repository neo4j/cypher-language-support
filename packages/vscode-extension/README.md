# Neo4j for VS Code Preview

## Getting started

After installing the extension from the VS Code Marketplace, open a file with a `.cypher` to start using the extension. To enable database aware features (such as completing labels/functions), set up a connection to a Neo4j instance using the settings described in the settings section below.

## Feature Highlights

Our extension preview provides a rich set of features for working with Cypher, the query language for Neo4j databases, including:

- Syntax highlighting
- Syntax checking - both simple and semantic errors (e.g. type errors, unknown labels, etc)
- Autocompletion for Cypher keywords, functions, labels, properties, database names and more
- Signature help for functions - shows the signature of the function while typing

![demo-gif](https://github.com/neo4j/cypher-language-support/blob/main/packages/vscode-extension/images/demo.gif?raw=true)

## Upcoming features

We're working on adding more features to the extension, such as:

- Easier database connection management
- Embedded cypher support in other file types
- Query exectution and result visualization
- Automatic query formatting

## Extension settings

The following settings are available in VS Code once the plugin is installed, which can be set either through the `Settings` menu on VS Code or by editing your `.vscode/settings.json` file.

- `neo4j.connect`: If true it will attempt to connect to a Neo4j database to retrieve data used for completions. Defaults to `true`
- `neo4j.user`: Defaults to `"neo4j"`, the default user for a local Neo4j instance
- `neo4j.password`: Replace this with the password for the user above
- `neo4j.boltUrl`: Defaults to `"neo4j://localhost:7687"`, the default url for a local Neo4j instance

### Debug

- `neo4j.trace.server`: Traces the communication between VS Code and the language server for debugging purposes

## Contributing

We welcome your suggestions, ideas, bug reports and contributions on our [github](https://github.com/neo4j/cypher-language-support).

To build the project locally, see the [CONTRIBUTING.md](https://github.com/neo4j/cypher-language-support/blob/main/CONTRIBUTING.md) file at the root of the git repository.

# Neo4j for VS Code Preview

## Getting started

After installing the extension from the VS Code Marketplace, open a file with a `.cypher` to start using the extension. To enable database aware features (such as completing labels/functions), set up a connection to a Neo4j instance using the database connection pane and any settings described in the settings section below.

## Feature Highlights

Our extension preview provides a rich set of features for working with Cypher, the query language for Neo4j databases, including:

- Syntax highlighting
- Syntax checking - both simple and semantic errors (e.g. type errors, unknown labels, etc)
- Autocompletion for Cypher keywords, functions, labels, properties, database names and more
- Signature help for functions - shows the signature of the function while typing

![demo-gif](https://github.com/neo4j/cypher-language-support/blob/main/packages/vscode-extension/resources/images/demo.gif?raw=true)

It also provides a basic database connection management pane and syntax highlighting embedded in other languages, namely Markdown, Java, Python, Javascriopt, .NET and Go. This is possible having a multiline string that starts with `//cypher` or `/*cypher*/` or a single line string starting with `/*cypher*/`. We also support a templated string `/*cypher*/`{{query here}}` in Javascript. Examples:

### Markdown

````
```cypher
MATCH (n) RETURN n
```
````

### Java

```java
String a = """//cypher
    MATCH (n)
    RETURN n
"""

String b = """/*cypher*/
    MATCH (n)
    RETURN n
"""

String c = "/*cypher*/ MATCH (n:Label) RETURN function(n.property)"
```

### Javascript / Typescript

```typescript
const a = /* cypher */ `
    MATCH (n)
    RETURN n
`;

const b = `//cypher
    MATCH (n)
    RETURN n
`;

const c = `/*cypher*/
    MATCH (n)
    RETURN n
`;

const d = '/*cypher*/ MATCH (n) RETURN n';
```

## Managing connections

You can launch the connection pane from the Neo4j icon in the Activity Bar, or by using the `Neo4j: Manage Connection` command from the Command Palette.

![demo-manage-connection](https://github.com/neo4j/cypher-language-support/blob/main/packages/vscode-extension/resources/images/demo-manage-connection.png?raw=true)

From here you can manage, connect to, or disconnect from your database connections.

![demo-connect](https://github.com/neo4j/cypher-language-support/blob/main/packages/vscode-extension/resources/images/demo-connect.png?raw=true)
![demo-disconnect](https://github.com/neo4j/cypher-language-support/blob/main/packages/vscode-extension/resources/images/demo-disconnect.png?raw=true)

Once a connection is added, and a connection to your Neo4j instance is established, you will be able to use database aware features of the extension.

## Upcoming features

We're working on adding more features to the extension, such as:

- Improved database connection management
- Embedded cypher support in other file types
- Query execution and result visualization
- Automatic query formatting

## Extension settings

The following settings are available in VS Code once the plugin is installed, which can be set either through the `Settings` menu on VS Code or by editing your `.vscode/settings.json` file.

### Debug

- `neo4j.trace.server`: Traces the communication between VS Code and the language server for debugging purposes

## Contributing

We welcome your suggestions, ideas, bug reports and contributions on our [github](https://github.com/neo4j/cypher-language-support).

To build the project locally, see the [CONTRIBUTING.md](https://github.com/neo4j/cypher-language-support/blob/main/CONTRIBUTING.md) file at the root of the git repository.

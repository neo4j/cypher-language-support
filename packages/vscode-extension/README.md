# Neo4j for VS Code
Official extension for Neo4j Cypher query language featuring:

- Syntax highlighting, including support for embedded Cypher in other languages
- Linting - both syntax and semantic errors (e.g. type errors, unknown labels, etc)
- Autocompletion for Cypher keywords, functions, labels, properties, database names and more.
- Signature help for functions and procedures - shows the signature of the function while typing
- Hover information - variable information and signature help for functions/procedures
- Formatting - format the document according to the [Cypher styleguide](https://neo4j.com/docs/cypher-manual/current/styleguide/#cypher-styleguide-spacing)
- Connection management
- Query parameter management
- Query execution with a visualization panel
- Go to definition navigation

## Getting started

After installing the extension from the VS Code Marketplace, open a file with a `.cypher` extension to start using it. To enable database aware features (such as completing labels, functions and procedures), set up a connection to a Neo4j instance using the database connection pane.

![demo-gif](https://github.com/neo4j/cypher-language-support/blob/main/packages/vscode-extension/resources/images/demo.gif?raw=true)


## Managing connections

To add a new instance connection, you can launch the connection pane from the Neo4j icon in the Activity Bar (either on the `Add new connection` button when the pane is empty or on the `+` icon), or by using the `Neo4j: Create New Connection` command from the Command Palette.

![demo-new-connection](https://github.com/neo4j/cypher-language-support/blob/main/packages/vscode-extension/resources/images/demo-new-connection.png?raw=true)

![demo-manage-connection](https://github.com/neo4j/cypher-language-support/blob/main/packages/vscode-extension/resources/images/demo-manage-connection.png?raw=true)

Clicking on an instance will automatically connect to it. You can also manage a connection by right clicking on it, to connect, disconnect or edit it.

![demo-connect](https://github.com/neo4j/cypher-language-support/blob/main/packages/vscode-extension/resources/images/demo-connect.png?raw=true)
![demo-disconnect](https://github.com/neo4j/cypher-language-support/blob/main/packages/vscode-extension/resources/images/demo-disconnect.png?raw=true)

Once a connection is added, and a connection to your Neo4j instance is established, you will be able to use database aware features of the extension. You can change the database you want to run queries against by clicking or right clicking (`Switch to database`) on it.

Connections can also be added via the vscode settings.json. This is done by adding the neo4j.connections setting and adding a new entry.
![demo-connect-setting](https://github.com/neo4j/cypher-language-support/blob/main/packages/vscode-extension/resources/images/demo-connect-setting.png?raw=true)

### Connections defined in settings.json

These connections appear in the Connections view alongside connections created via the UI, but are managed entirely through the setting.For security reasons you will be asked to confirm that you trust a settings-defined server the first time you connect to it.

All values except the scheme may reference environment variables with `${env:VAR}`, resolved from the environment VS Code was launched with (a full restart of VS Code is needed to pick up changes). Note that literal passwords are stored in plain text in your settings file — reference an environment variable, or prefer connections created via the UI, for sensitive credentials.

## Managing parameters

To add a new parameter, you can use the `Neo4j: Add parameter` command from the Command Palette or use the `+` on the Neo4j parameters panel:

![demo-add-parameter](https://github.com/neo4j/cypher-language-support/blob/main/packages/vscode-extension/resources/images/demo-add-parameter.png?raw=true)

You will be prompted for the name and value you want to use for that parameter. The type will be automatically recognized from the value. Some examples:

```
"something" // would set a string parameter
1234 // would set an Integer parameter
datetime() // would set a datetime parameter
[1,2,3] // would set a List parameter
```

Any `expression` that can appear in a `RETURN expression` can be set as value.

Parameters can be accessed from in a query prepending them with a dollar sign `$`.

Parameters can be edited or deleted when hovering over them.

![demo-param-editing](https://github.com/neo4j/cypher-language-support/blob/main/packages/vscode-extension/resources/images/demo-param-editing.png?raw=true)

## Embedded Cypher

The supported languages for embedded highlighting are Markdown, Java, Python, Javascript, .NET and Go. This is possible having a multiline string that starts with `//cypher` or `/*cypher*/` or a single line string starting with `/*cypher*/`. We also support a templated string `/*cypher*/`{{query here}}` in Javascript. 

Inside those languages you can also select a Cypher snippet and either create a `cypher` file with language smarts (completions, linting, etc) from it or execute that snippet.

![demo-embedded-cypher-menus](https://github.com/neo4j/cypher-language-support/blob/main/packages/vscode-extension/resources/images/demo-embedded-cypher-menus.png?raw=true)

Examples for the syntax highligting:

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


## Executing a Cypher file

Once you've written your desired query (for example `CREATE (n)-[r:Rel]->(m) RETURN n, r, m, $a, $b`) you can execute it by either of:
* Using `Neo4j: Run Single Cypher Statement` from the Command Palette to run the statement the caret is at. There is also the `Neo4j: Run Cypher Statements` command which executes the statements selected, or if no selection is made, all statements.
* Right clicking inside the file you want to run and clicking on the `Run Cypher Statements` or the `Run Single Cypher Statement` item.
* Using the shortcuts `⌘/Ctrl+Enter` to run single statement or `Ctrl+⌘/Alt+Enter` to run all/selected statements.
* Using the run button in the top right corner (only for single statement).

![demo-execution](https://github.com/neo4j/cypher-language-support/blob/main/packages/vscode-extension/resources/images/demo-execution.png?raw=true)

## Version tailored linting

To provide an experience that suits the different Neo4j versions you are connected to, when connecting to a database, a linter that matches that version of the database will be automatically downloaded.

![demo-linter-automatic-adjusting](https://github.com/neo4j/cypher-language-support/blob/main/packages/vscode-extension/resources/images/demo-linter-automatic-adjusting.png?raw=true).

![demo-linter-5](https://github.com/neo4j/cypher-language-support/blob/main/packages/vscode-extension/resources/images/demo-linter-5.png?raw=true).

![demo-linter-2025](https://github.com/neo4j/cypher-language-support/blob/main/packages/vscode-extension/resources/images/demo-linter-2025.png?raw=true).

We can match a neo4j version from 5.23 onwards. If connected to an older database, the 5.23 version will be used. If the version cannot be resolved from your neo4j instance for any reason, the `Default` linter (the one packaged with the current version of the VSCode extension) will be used.

The linter can be manually adjusted either on the bottom menu or using the `Neo4j: Select Cypher Linter Version` command from the Command Palette.

![demo-linter-manual-adjusting](https://github.com/neo4j/cypher-language-support/blob/main/packages/vscode-extension/resources/images/demo-linter-manual-adjusting.png?raw=true).

## Extension settings

The following settings are available in VS Code once the plugin is installed, which can be set either through the `Settings` menu on VS Code or by editing your `.vscode/settings.json` file.

### Debug

- `neo4j.trace.server`: Traces the communication between VS Code and the language server for debugging purposes

## Contributing

We welcome your suggestions, ideas, bug reports and contributions on our [GitHub](https://github.com/neo4j/cypher-language-support).

To build the project locally, see the [CONTRIBUTING.md](https://github.com/neo4j/cypher-language-support/blob/main/CONTRIBUTING.md) file at the root of the git repository.

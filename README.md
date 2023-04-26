# cypher-lsp

The mono repo for Neo4j's Cypher Language support, it contains:

- LSP server.
- VSCode extension playground for testing.
- Web Editor (codemirror) playground

The Trello board for the project is [here](https://trello.com/b/0MAa3MMW/cypher-language-support).

![](./auto-completion.gif)

## Features

- Syntax highlighting: incomplete but it works well.
- Auto completion: works moderately well. Has a proof of concept on how to complete elements coming from the database (e.g. labels).
- Multi-query: works well but it should be improved.
- Error highlighting: still to improve, inaccurate positions and errors. No semantic errors.

## Getting started

Run `npm install` in the root folder. This installs all dependencies in each package and generates the parser in the server package. The next steps depend on which project you want to run.

## Running the codemirror demo

Run `npm run dev-codemirror` in the root folder. This will start a vite dev server and open a browser window with the codemirror demo.

### Running the VScode playground

To launch a new VSCode window with the extension installed go to the `Run & Debug` tab, select and run `VSCode Playground`.

For database aware features (such as autocompleting labels), you need a database with credentials are hardcoded to `neo4/pass12345` running. You can easily start one with docker:

```
docker run --restart always --publish=7474:7474 --publish=7687:7687 --env NEO4J_AUTH=neo4j/pass12345 --env NEO4J_ACCEPT_LICENSE_AGREEMENT=yes neo4j:5.3.0-enterprise
```

### Running only the parser

The parser is generated on install, but if you change the .g4 grammar files you can re-generate it using the following command in the server package:

```
npm run gen-parser
```

You also need to install antlr4-tools. The instructions are [here](https://github.com/antlr/antlr4-tools), then you can run a query with:

```
antlr4-parse server/src/antlr/Cypher.g4 oC_Cypher -gui
[Write query][Enter]
[Ctrl-D]
```

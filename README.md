# cypher-lsp

LSP for Neo4j's Cypher query language

![](./auto-completion.gif)

## Requirements

- Having [Jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest) VSCode extension installed.

## Try out only the parser

To generate the parser only:

```
npm run gen-parser
```

Run a query with

```
antlr4-parse server/src/antlr/Cypher.g4 oC_Cypher -gui
[Write query][Enter]
[Ctrl-D]
```

## Testing it out

To start a database:

```
docker run --restart always --publish=7474:7474 --publish=7687:7687 --env NEO4J_AUTH=neo4j/pass12345 --env NEO4J_ACCEPT_LICENSE_AGREEMENT=yes neo4j:5.3.0-enterprise
```

Run a `CREATE (n:Person); CREATE (n:Dog)` in the database to get some labels.

To run the extension in development mode in VSCode:

```
npm run compile
```

Go to `Run & Debug` tab and `Launch Cypher Language Client`.

Credentials are hardcoded to `neo4/pass12345` in the server.

## Features

- Syntax highlighting: incomplete but it works well.
- Auto completion: works moderately well. Has a proof of concept on how to complete elements coming from the database (e.g. labels).
- Multi-query: works well but it should be improved.
- Error highlighting: still to improve, inaccurate positions and errors. No semantic errors.

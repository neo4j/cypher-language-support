# vscode-playground

This is a VScode extension playground for testing the LSP server. You can run it through the `Run & Debug` tab, select and run `VSCode Playground`.

## Plugin settings

The following settings are available in VSCode once the plugin is installed, which can be set either through the `Settings` menu on VSCode or through `settings.json`.

### Settings for database connection

The following settings refer to the database connection used for signature loading, this will allow for autocomplete on Labels and Types.

- `cypherLSP.neo4j.connect`: If true it will attempt to connect to a Neo4j database to retrieve signature information. Defaults to `true`.
- `cypherLSP.neo4j.user`: Defaults to `"neo4j"`
- `cypherLSP.neo4j.password`: Defaults to `"password"`
- `cypherLSP.neo4j.URL`: Defaults to `"bolt://localhost:7687"`

### Debug

- `cypherLSP.trace.server`: Deprecated

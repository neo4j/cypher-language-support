# neo4j-for-vscode

## 1.14.1
- Add aliases to connections pane

## 1.14.0
- Minor bugfixes (handling new linter naming scheme, formatter capitalizing preparser keywords in namespaces, linter terminating on slow queries, missing label warnings, handle queries needing implicit transactions, prevents "run cypher" keybind from being active when cypher can't be run)
- Speed up symbol table reliant completions
- Adds first iteration of schema aware completions for paths, behind feature flag
- Adds command to run single cypher query
- Auto-focus on query results panel when running query
- Modify run button to run selected text on selection and otherwise run single statement at cursor

## 1.13.0
- Adjusts linting automatically depending on the neo4j version.
- Updates grammar and semantic analysis

## 1.12.0

- Adds improved results pannel with visualizations
- Adds minor improvements for the formatter

## 1.11.0

- Adds support for the access-mode console command
- Updates grammar and semantic analysis
- Updates formatter handling of CALL

## 1.10.0

- Adds new version of the Cypher formatting
- Asks the user to set missing parameters when trying to execute a query

## 1.9.0

- Adds parameter pane to VSCode.
- Improves connection pane with icons and auto-connecting on left mouse click.

## 1.8.0

- Adds support for formatting a Cypher file according to styleguide rules
- Solves a bug with the polling of methods for Cypher 25, which should not be enabled for the version 2025.02.

## 1.7.0

- Adds support for multiple Neo4j connections
- Adds setting neo4j.features.linting to disable linting of Cypher files
- Adds "deprecated by" to deprecation warnings when available
- Adds support for parameters to have escaped names
- Adds autocompletions for Cypher version
- Adds support for CYPHER preparser options (runtime, planner, etc)
- Adds hint when using function as procedure and viceversa
- Adds automatically triggered completions on "YIELD "
- Improves support for cypher versions (errors, procedure/function registry)
- Various bugfixes (using console commands as variable labels, highlighting preparser options and comments, case-insensitivity of built-in methods)
- Makes .cy, .cyp and .cql file extensions work with the plugin

## 1.6.1

- Makes the editor relint all documents when connecting / disconnecting from a database
- Adds warnings for deprecated procedures / functions
- Improves backticking of completions

## 1.6.0

- Updates grammar to LTS version
- Preparser option bugfix
- Adds YIELD autocompletions

## 1.5.2

- Fixes signature help bug with arguments that include a default value

## 1.5.1

- Fixes bug with auto-completions

## 1.5.0

- Adds ability to execute highlighted queries
- Adds autocompletion for backticked elements

## 1.4.0

- Adds errors for non existing procedures and functions
- Updates grammar version to neo4j 5.24

## 1.3.0

- Improvements to database connection pane: lists databases and metadata for active connection
- Adds query execution capabilities to extension

## 1.2.2

### Patch changes

- Improvements to database connection pane
  - Adds validation the connection management, providing feedback in the UI for invalid auth, database names and unreachable instances
  - Adds connection state monitoring, providing feedback in the UI for connections that become unhealthy

## 1.2.1

### Patch changes

- Fixes logo in VSCode Marketplace

## 1.2.0

- Adds basic connection pane to connect to Neo4j using VSCode menus
- Adds syntax highlighting inside Markdown files and for annotated strings in Java, Python, Javascript, .NET and Go

## 1.1.1

### Patch Changes

- Updates grammar and semantic analysis
- Corrects bug with semantic analysis and List of non-numeric types

## 1.1.0

### Minor Changes

- Updates grammar and adds semantic analysis for procedures and functions

## 1.0.0

- First release of the Neo4j for VSCode plugin, including syntax highlighting, auto-completion and linting as features

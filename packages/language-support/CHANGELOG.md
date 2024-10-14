# @neo4j-cypher/language-support

## 2.0.0-next.9

### Patch Changes

- 2e72ac8: Adds errors for undeclared procedures / functions

## 2.0.0-next.8

### Patch Changes

- 05663bd: Fixes bug using non language keywords (EXPLAIN, PROFILE, etc) as symbolic names

## 2.0.0-next.7

### Patch Changes

- 3661e9d: Fixes database completions for CREATE ALIAS commands
- b76af58: Fixes bug in signature help of functions nested inside procedure calls
- 21699b7: Updates the semantic analysis module to use the antlr parser instead of the javaCC one
- 6afc0e3: Adds signature information on auto-completions
- 39b924d: Fixes bug in labels completion

## 2.0.0-next.6

### Patch Changes

- e92d8c7: Corrects bug with semantic analysis and List of non-numeric types

## 2.0.0-next.5

### Patch Changes

- 1f790d0: Adds auto-completion of usernames and roles

## 2.0.0-next.4

### Patch Changes

- Adds semantic analysis for procedures and functions

## 2.0.0-next.3

### Patch Changes

- 8cc77c6: Add support for console commands
- 1e210cb: Moves semantic analysis to a separate worker file
- f6d20b2: Adds signature help capabilities to the language support

## 2.0.0-next.2

### Patch Changes

- 17909e3: Improves speed of semantic analysis between 2x and 6x

## 2.0.0-next.1

### Patch Changes

- a790700: Fix issue where syntax highlighting crashes on create constraint query
- 08db455: Fix incorrect completions when identifier overlaps with keyword

## 2.0.0-next.0

### Major Changes

- 5819f6385: First alpha release of the new Neo4j's Cypher Language Support, including syntax highlighting, auto-completion and linting as features

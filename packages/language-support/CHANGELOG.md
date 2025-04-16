# @neo4j-cypher/language-support

## 2.0.0-next.19

### Patch Changes

- 88e4930: Fixes backticking of parameters and dbNames/aliases
- 5bfdac2: restructure packages as part of move to pnpm

## 2.0.0-next.18

### Patch Changes

- 1b971aa: adding support for :play command
- 07ac90f: adding semantic validation for missing paramters

## 2.0.0-next.17

### Minor Changes

- 1caab0c: Upgrades formatter from V1 -> V2

### Patch Changes

- bffbb19: Fix comment, QPP and pattern bugs in v1 formatter
- 826d922: Add `:style` cmd to command parser

## 2.0.0-next.16

### Patch Changes

- 68f55d4: Updates parser and semantic analysis to version 2025.02
- 6d00433: Bugfix for case-insensitivity of built-in functions
- c01b32a: Re-surfaces preparser errors

## 2.0.0-next.15

### Patch Changes

- 50cc73e: Adds errors when passing an invalid cypher version in query
- 5ef538d: Solves highlighting bug with multiline constructs embedded in the preparser
- b988d3b: Solves bug splitting commands which was breaking for queries just containing comments

## 2.0.0-next.14

### Patch Changes

- 8ec797d: Updates semantic error worker to use given cypher version
- 7aa9c3a: Adds hints to the error when using a procedure/function where the other would be appropriate
- 2be5469: Updates grammar and semantic analysis to version 2025.01.0
- 245fb6a: Automatically opens autocompletions after "YIELD "
- c587b81: Fixes bug using console commands as variables or labels
- 3f8b64f: Fixes bug reporting missing label / rel type when inside opposite pattern
- 043d766: Moves the syntax errors to the semantic analysis web worker
- 704d1c5: Adds autocompletions for CYPHER <version>

## 2.0.0-next.13

### Patch Changes

- 84a12fc: Added parsing of CYPHER <version> and CYPHER <optionName> = <value>
- d329252: Adds deprecation warning tags on deprecated functions/procedures
- b0e419e: Adds backticking when needed on autocompletions of aliases and database names

## 2.0.0-next.12

### Patch Changes

- 88fbe63: Modified backtick insertion to only happen when really necessary
- 22081b0: Adds autocompletions following YIELD in a procedure call
- 62ac442: Add support for sysinfo, welcome, connect, disconnect and server console commands

## 2.0.0-next.11

### Patch Changes

- bccf518: Fixes signature help bug with arguments that include a default value

## 2.0.0-next.10

### Patch Changes

- 8760c02: Adds backticking to labels, rel types and property names on auto-completions

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

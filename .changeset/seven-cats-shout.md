---
"@neo4j-cypher/react-codemirror-playground": patch
"@neo4j-cypher/language-support": patch
"@neo4j-cypher/language-server": patch
"@neo4j-cypher/lint-worker": patch
---

Rewrite global parserWrapper for instantiated CypherLanguageService objects

Breaking changes for direct consumers of `@neo4j-cypher/language-support`:
- Removed export: `parserWrapper`. The same `ParsingResult` as `parserWrapper.parse` would yield can still be received by `createParsingResult` in `CypherLanguageService`. Instances of the new CypherLanguageService class provide helpers for linting/highlighting/completions/signature info where parsing is handled internally.
- Renamed exports: `applySyntaxColouring` → `highlightSyntax`, `syntaxColouringLegend` → `syntaxHighlightingLegend`
- `autocomplete()`, `lintCypherQuery()`, `highlightSyntax()`, and `getSignatureInfo()` now take an options object as the third parameter instead of positional args

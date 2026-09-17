---
"@neo4j-cypher/language-support": patch
"@neo4j-cypher/react-codemirror": patch
---

Modify exports for api-extractor in language-support. Adds "forgotten exports" and most importantly removes export of generated antlr classes (or functions referencing these). Antlr grammar is now exported as .g4 files instead - see readme for instructions on how to generate parser/lexer.

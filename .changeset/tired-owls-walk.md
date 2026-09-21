---
"@neo4j-cypher/language-support": minor
"@neo4j-cypher/react-codemirror": minor
---

Modify exports for api stability in language-support. Adds "forgotten exports" and most importantly (possibly breaking for dependants) removes export of generated antlr classes (or functions referencing these) - namely "parse", "createParsingResult" and full exports of generated Lexer/Parser files. Exported language support methods for linting, formatting etc no longer take optional "ParsingResult". Antlr grammar is now exported as .g4 files instead - see readme for instructions on how to generate parser/lexer.

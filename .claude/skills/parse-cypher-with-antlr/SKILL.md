---
name: parse-cypher-with-antlr
description: Inspect how a Cypher query is parsed by the ANTLR grammar — print the parse tree or token stream for any query straight from the .g4 grammar files, without building the project. Use when debugging why a query parses a certain way, investigating grammar/lexer behavior, checking which rule or token matches some syntax, or after a grammar bump.
---

# Parse Cypher queries with ANTLR

`antlr4-parse` (from `antlr4-tools`, same prerequisite as the build — see AGENTS.md) interprets the grammar files in `packages/language-support/src/antlr-grammar/` directly. No build step needed, and it reflects grammar edits instantly. The generated TypeScript parser in `src/generated-parser/` is produced from these same grammars, so the trees match what the library sees — with one exception: embedded `{ ... }` actions don't run under the interpreter (see Gotchas, it breaks interpolated strings).

## The commands

**Must run from the grammar directory** — the grammars use `import CypherPreLexer;` etc., and `antlr4-parse` resolves those imports relative to the current working directory, not the grammar file's location. Running from the repo root with full grammar paths fails with `error(110): can't find or load grammar CypherPreLexer`. From the repo root, use a subshell:

```sh
# Parse tree (LISP notation), query piped on stdin — works fine for an agent, no interactive input needed
(cd packages/language-support/src/antlr-grammar && echo 'MATCH (n:Person) RETURN n' | antlr4-parse ./CypherCmdLexer.g4 ./CypherCmdParser.g4 statementsOrCommands -tree)

# Token stream instead of tree
(cd packages/language-support/src/antlr-grammar && echo 'MATCH (n) RETURN n' | antlr4-parse ./CypherCmdLexer.g4 ./CypherCmdParser.g4 statementsOrCommands -tokens)

# Query from a file (last positional argument) — best for long/multiline queries
(cd packages/language-support/src/antlr-grammar && antlr4-parse ./CypherCmdLexer.g4 ./CypherCmdParser.g4 statementsOrCommands -tree /path/to/query.cypher)
```

The same commands work on Windows (Git Bash) and unix. `statementsOrCommands` is the entry rule of `CypherCmdParser.g4` — it covers full Cypher (via the imported `CypherPre*` → `Cypher25*` grammar chain) plus client-side console commands like `:use`.

Other useful flags: `-trace` (rule enter/exit + token consumption, very verbose) and `-gui` (Java window with a visual tree — human use only, pops a window).

## Reading the output

- Tree nodes are `(ruleName:altNumber children...)`; leaf tokens appear as their text. Token lines from `-tokens` are `[@index,start:stop='text',<TYPE>,line:col]` (`channel=1` = hidden whitespace/comments).
- **Syntax errors don't stop it**: invalid queries print `line X:Y mismatched input ... expecting {...}` and then still print a tree via ANTLR's error recovery. Check stderr for those lines before trusting the tree.
- Ignore this noise: two `warning(109): options ignored in imported grammar` lines (harmless), and `Could not get latest version number... Found version '4.12.0'` (offline update check; the cached ANTLR jar works fine).

## Gotchas

- **Don't pipe the query through PowerShell** — PowerShell 5.1 mangles the pipeline encoding (a BOM-like char reaches the parser as `extraneous input '?'` at 1:0). `antlr4-parse` itself works fine from PowerShell; just provide the query as a file argument instead of a pipe, or use the Bash tool.
- Interactive use (a human typing the query) ends input with **Ctrl+Z then Enter** on Windows, **Ctrl+D** on unix. Agents never need this — piped stdin gets EOF automatically.
- **Interpolated strings (`s"..."`/`s'...'`) tokenize wrongly here — trust the built lexer instead.** `antlr4-parse` runs the grammar through ANTLR's *interpreter*, which honors lexer commands (`-> pushMode`, `-> popMode`, …) but silently skips embedded `{ ... }` actions. The `RCURLY` rule relies on such an action (`'}' { if (...) popMode(); }`) to jump back into the string's `TEXT_SINGLE`/`TEXT_DOUBLE` mode after an interpolated expression — so under `antlr4-parse` the lexer stays in `DEFAULT_MODE` after the `}`, and the closing quote comes out as `ErrorChar` plus a spurious `mismatched input` parse error. The generated TypeScript lexer executes the action and tokenizes correctly (closing quote → `INTERPOLATED_END_DOUBLE`/`_SINGLE`). To check for real, use the built library, e.g. from `packages/language-support`: `node -e "const {CypherLexer}=require('./dist/cjs/index.cjs'); const antlr4=require('antlr4'); for (const t of new CypherLexer(new antlr4.InputStream('RETURN s\"hi {1 + 2}\"')).getAllTokens()) console.log(CypherLexer.symbolicNames[t.type] || CypherLexer.literalNames[t.type], JSON.stringify(t.text));"`. Any other grammar behavior gated on an embedded action would mislead the same way.
- Which grammars are editable: the import chain is `CypherCmd*` → `CypherPre*` → `Cypher25*`. The `CypherCmdLexer/Parser` and `CypherPreLexer/Parser` grammars (console commands, preparser) are owned by this repo and fine to edit. Only `Cypher25Lexer/Parser` (and `semanticAnalysis.js`) are synced monthly from the internal Neo4j monorepo — don't hand-edit those; local experiments with this tool are fine, just don't commit changes to them.

## See also

To verify behavior of the *built* library (completion, linting, formatting) in a real running surface, use the `run-cypher-language-support` skill instead — this skill only explains how the raw grammar parses text.

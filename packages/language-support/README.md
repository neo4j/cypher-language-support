# Language Support

This package contains the core language support features for Cypher built with ANTLR4.

## Usage

The API is not yet properly documented, but here are two simple examples of what you can do!

`npm install @neo4j-cypher/language-support@next`

```typescript
import {
  autocomplete,
  validateSyntax,
  DbSchema,
} from '@neo4j-cypher/language-support';

const schema: DbSchema = { labels: ['Person'] };

autocomplete('MATCH (n:', schema); // yields CompletionItem[] containing "Person"

validateSyntax('RETRN 123', schema); // yields SyntaxDiagnostic[] with Invalid keyword, did you mean RETURN?
```

## Generating your own parser from the Cypher grammars

This package no longer exports the generated ANTLR lexer/parser classes. If you need to
parse Cypher yourself, the ANTLR4 grammar files ship with the package and can be
resolved via the `./grammar/*.g4` subpath:

```js
import.meta.resolve('@neo4j-cypher/language-support/grammar/CypherCmdParser.g4');
```

Generate the parser with [`antlr-ng`](https://www.npmjs.com/package/antlr-ng) (add it as
a devDependency yourself — it is not a dependency of this package):

Here's an example of implementation
```js
// scripts/gen-cypher-parser.mjs
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const grammarDir = dirname(
  fileURLToPath(
    import.meta.resolve('@neo4j-cypher/language-support/grammar/CypherCmdParser.g4'),
  ),
);
const out = 'src/generated-parser';

// The lexer must be generated first: the parser's `tokenVocab` needs
// CypherCmdLexer.tokens, which antlr-ng writes into the output directory.
for (const grammar of ['CypherCmdLexer', 'CypherCmdParser']) {
  execFileSync(
    'antlr-ng',
    [
      '-Dlanguage=TypeScript',
      '--generate-visitor',
      '--lib',
      grammarDir,
      '-o',
      out,
      '--exact-output-dir',
      '--',
      join(grammarDir, `${grammar}.g4`),
    ],
    { stdio: 'inherit', shell: true },
  );
}
```

`--lib` points at the grammar directory so that the `import` statements inside the
grammars (`CypherPreParser`, `Cypher25Parser`, …) resolve. The
`options ignored in imported grammar` warnings during generation are expected.

The generated classes use named exports:

```typescript
import { CharStream, CommonTokenStream } from 'antlr4ng';
import { CypherCmdLexer } from './generated-parser/CypherCmdLexer.js';
import { CypherCmdParser } from './generated-parser/CypherCmdParser.js';

const lexer = new CypherCmdLexer(CharStream.fromString('RETURN 1'));
const parser = new CypherCmdParser(new CommonTokenStream(lexer));
const tree = parser.statementsOrCommands();
```

Some caveats:

- `CypherCmdLexer.g4` contains an action specific to the `antlr4ng` runtime, so the
  TypeScript/`antlr4ng` target is the only supported one. Known-good version pair:
  `antlr-ng@1.0.10` with `antlr4ng@3.0.16`.
- Only TypeScript output is generated, so this requires a TypeScript build step.
- `Cypher25Lexer.g4` and `Cypher25Parser.g4` track Neo4j's internal grammar and are
  updated roughly monthly, so rule and token names can change between releases.

## Cypherfmt CLI

This package includes a command-line tool for formatting Cypher queries using `cypherfmt`. After installation, you can use it via the `cypherfmt` command:

```bash
# Format a file and output to stdout
cypherfmt file.cy

# Format a file in place
cypherfmt -i file.cy

# Check if a file is formatted correctly (exits with code 1 if not formatted correctly)
cypherfmt -c file.cy

# Format all .cy, .cyp, and .cypher files in a directory recursively
cypherfmt directory/

# Format input from stdin
cat file.cy | cypherfmt
```

For more information, run `cypherfmt --help`.

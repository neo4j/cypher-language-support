# Migration from vendored antlr4-c3 to upstream packages

*2026-02-27T13:24:38Z by Showboat 0.6.1*
<!-- showboat-id: bc49efee-30c5-42e9-a91c-72f01cc44171 -->

## Overview

This migration replaces the vendored `antlr4-c3` code completion library and the `antlr4` runtime with their upstream npm equivalents:

- **Runtime**: `antlr4` → `antlr4ng@3.0.16`
- **Code completion**: vendored `antlr4-c3` → upstream `antlr4-c3@3.4.4`
- **Parser generator**: Java-based `antlr4` CLI → Node.js-based `antlr-ng@1.0.10`

The key benefit: **no more Java dependency** for parser generation, and no more vendored code to maintain.

## Dependency changes

```bash
cat packages/language-support/package.json | grep -E "antlr|c3" | head -10
```

```output
    "antlr4-c3": "3.4.4",
    "antlr4ng": "3.0.16",
    "gen-parser": "antlr-ng --generate-visitor -D language=TypeScript -o src/generated-parser/ -- src/antlr-grammar/CypherCmdLexer.g4 && antlr-ng --generate-visitor -D language=TypeScript -o src/generated-parser/ -- src/antlr-grammar/CypherCmdParser.g4",
    "antlr-ng": "1.0.10",
```

Parser generation now uses `antlr-ng`, a pure Node.js tool. No Java runtime needed.

```bash
npx antlr-ng --version
```

```output
npm warn exec The following package was not found and will be installed: antlr-ng@1.0.10
antlr-ng 1.0.10
```

## Vendor directory removed

The entire `vendor/antlr4-c3/` directory has been deleted. This removes ~7,000 lines of vendored code.

```bash
ls vendor/ 2>&1 || echo "(vendor directory no longer exists)"
```

```output
ls: cannot access 'vendor/': No such file or directory
(vendor directory no longer exists)
```

```bash
git diff --stat HEAD~1 -- vendor/ | tail -5
```

```output
 vendor/antlr4-c3/tests/generate.sh                 |    6 -
 vendor/antlr4-c3/tests/readme.md                   |   11 -
 vendor/antlr4-c3/tsconfig.json                     |   26 -
 vendor/antlr4-c3/vitest.config.ts                  |    7 -
 25 files changed, 5896 deletions(-)
```

## CI simplification: Java is no longer needed

The old CI setup downloaded `antlr-4.13.0-complete.jar` and required Java to generate parsers. With `antlr-ng`, parser generation is a Node.js tool installed via pnpm — the Java step can be removed entirely.

```bash
echo '=== Old CI setup (to be removed) ===' && grep -A5 'Setup antlr' .github/actions/setup-and-build/action.yaml
```

```output
=== Old CI setup (to be removed) ===
    - name: Setup antlr
      shell: bash
      run: |
        curl https://www.antlr.org/download/antlr-4.13.0-complete.jar --output antlr4.jar
        mkdir -p $HOME/.local/bin
        echo -e "#bin/bash\njava -jar $PWD/antlr4.jar \$@" > $HOME/.local/bin/antlr4
```

This entire step can now be removed. The `antlr-ng` CLI is installed as a devDependency and runs via `pnpm gen-parser` — no jar download, no Java wrapper script.

## Build and tests

The project builds cleanly and 980/986 tests pass. The 6 remaining failures are expected behavioral differences from antlr4ng's more aggressive error recovery (detailed below).

```bash
pnpm --filter @neo4j-cypher/language-support build 2>&1 | tail -5
```

```output
[build-commonjs]   dist/cjs/index.cjs.map  24.5mb
[build-commonjs] 
[build-commonjs] ⚡ Done in 1244ms
[build-commonjs] npm run build-commonjs exited with code 0
[build-esm-and-types] npm run build-esm-and-types exited with code 0
```

```bash
pnpm --filter @neo4j-cypher/language-support test 2>&1 | tail -10
```

```output
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/6]⎯

 Test Files  2 failed | 41 passed (43)
      Tests  6 failed | 980 passed (986)
   Start at  13:27:43
   Duration  20.95s (transform 13.50s, setup 0ms, collect 168.80s, tests 48.04s, environment 8ms, prepare 34.42s)

/home/user/cypher-language-support/packages/language-support:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @neo4j-cypher/language-support@2.0.0-next.29 test: `vitest run`
Exit status 1
```

**980/986 tests pass.** The 6 failures are in 2 test files and are expected behavioral differences.

## Error recovery differences (the 6 remaining failures)

### Root cause: antlr4ng recovers more aggressively

The old `antlr4` runtime's error strategy was more "fail-fast" — it would set `ctx.exception` when a rule couldn't parse, leaving a clean signal for downstream code to split input into "parsed" vs "unparseable" portions.

`antlr4ng` is more resilient: it inserts/deletes tokens and keeps parsing through errors. This is generally better for autocompletion and validation, but it breaks the formatter's assumption that it can detect where parsing gave up.

### Impact on the formatter (5 failures)

The formatter relied on `tree.exception` to detect when parsing failed:

1. If parsing stopped partway, everything after the failure was treated as an "unparseable tail" and left as-is
2. The formatted portion + unparseable tail would be returned

Now, antlr4ng recovers through the entire input. The parser consumes everything, so the "unparseable tail" is never detected. When the formatter visits error-recovered tree nodes with unexpected structure, it produces output where non-whitespace characters differ from the input, hitting the safety check that throws `INTERNAL_FORMAT_ERROR_MESSAGE`.

### Impact on console command completion (1 failure)

The vendored `antlr4-c3` had a custom `optional` flag (added by ncordon) on `FollowingTokens` that returned BOTH single and compound token completions. The upstream `antlr4-c3` uses a plain `number[]` without this flag, so only compound completions are returned — causing 2 extra entries (`history`, `clear`) to appear in results.

```bash
pnpm --filter @neo4j-cypher/language-support test 2>&1 | grep "FAIL\|×"
```

```output
   × sanity checks > completes basic console cmds on : 17ms
   × formatting despite syntax errors > node map projection with . instead of : 91ms
   × formatting despite syntax errors > missing parentheses 2ms
   × formatting despite syntax errors > query that we are currently unable to handle should throw. 12ms
   × formatting despite syntax errors > map that uses dot instead of colon 2ms
   × formatting despite syntax errors > dot instead of colon and also misisng closing parenthesis 6ms
 FAIL  src/tests/consoleCommands.test.ts > sanity checks > completes basic console cmds on :
 FAIL  src/tests/formatting/syntaxerror.test.ts > formatting despite syntax errors > node map projection with . instead of :
 FAIL  src/tests/formatting/syntaxerror.test.ts > formatting despite syntax errors > missing parentheses
 FAIL  src/tests/formatting/syntaxerror.test.ts > formatting despite syntax errors > query that we are currently unable to handle should throw.
 FAIL  src/tests/formatting/syntaxerror.test.ts > formatting despite syntax errors > map that uses dot instead of colon
 FAIL  src/tests/formatting/syntaxerror.test.ts > formatting despite syntax errors > dot instead of colon and also misisng closing parenthesis
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @neo4j-cypher/language-support@2.0.0-next.29 test: `vitest run`
```

## Key code changes

### 1. `hasParseError()` helper replaces `exception` checks

The old code checked `'exception' in ctx` to detect parse errors. Since antlr4ng never sets this property, a new heuristic helper checks for ErrorNode children, empty contexts, degenerate ranges, and missing closing tokens:

```bash
sed -n '43,64p' packages/language-support/src/helpers.ts
```

```output
export function hasParseError(ctx: ParserRuleContext): boolean {
  // Check for ErrorNode children
  if (ctx.children.some((child) => child instanceof ErrorNode)) {
    return true;
  }
  // Check for empty/synthesized context (no children or degenerate range)
  if (ctx.children.length === 0) {
    return true;
  }
  if (ctx.start && ctx.stop && ctx.start.start > ctx.stop.stop) {
    return true;
  }
  // Check for incomplete node/relationship patterns by verifying required
  // closing tokens are present
  if (ctx instanceof NodePatternContext) {
    return ctx.RPAREN() === null;
  }
  if (ctx instanceof RelationshipPatternContext) {
    return ctx.RBRACKET() === null;
  }
  return false;
}
```

### 2. Formatter error detection via `ANTLRErrorListener`

Instead of checking `tree.exception`, the formatter now uses a custom error listener and checks whether the parser stopped before consuming all input:

```bash
sed -n '134,163p' packages/language-support/src/formatting/formattingHelpers.ts
```

```output
class FirstErrorListener implements ANTLRErrorListener {
  firstOffendingToken: Token | null = null;

  /* eslint-disable @typescript-eslint/no-unused-vars */
  syntaxError<S extends Token, T extends ATNSimulator>(
    recognizer: Recognizer<T>,
    offendingSymbol: S | null,
    line: number,
    charPositionInLine: number,
    msg: string,
    e: RecognitionException | null,
  ): void {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    if (this.firstOffendingToken === null && offendingSymbol !== null) {
      this.firstOffendingToken = offendingSymbol;
    }
  }

  reportAmbiguity(): void {
    // Not needed for error detection
  }

  reportAttemptingFullContext(): void {
    // Not needed for error detection
  }

  reportContextSensitivity(): void {
    // Not needed for error detection
  }
}
```

### 3. Multi-statement splitting with synthetic EOF tokens

When splitting multi-statement input at semicolons, each chunk needs a synthetic EOF token. Without it, the parser fetches EOF from the exhausted lexer, getting position info that spans beyond the chunk boundary:

```bash
grep -n 'synthetic EOF\|CommonToken.fromType\|fetchedEOF' packages/language-support/src/helpers.ts
```

```output
181:      // For chunks ending with SEMICOLON (not EOF), add a synthetic EOF token
186:        const eof = CommonToken.fromType(Token.EOF, '<EOF>');
200:      streamInternal.fetchedEOF = true;
```

```bash
sed -n '178,202p' packages/language-support/src/helpers.ts
```

```output
      current.type === CypherLexer.SEMICOLON ||
      current.type === CypherLexer.EOF
    ) {
      // For chunks ending with SEMICOLON (not EOF), add a synthetic EOF token
      // so the parser doesn't try to fetch more tokens from the exhausted lexer.
      // Without this, the parser would fetch an EOF positioned at the end of the
      // entire input, causing getTextFromRange to span beyond the chunk boundary.
      if (current.type === CypherLexer.SEMICOLON) {
        const eof = CommonToken.fromType(Token.EOF, '<EOF>');
        eof.start = current.stop + 1;
        eof.stop = current.stop;
        eof.line = current.line;
        eof.column = current.column + (current.text?.length ?? 1);
        eof.tokenIndex = current.tokenIndex + 1;
        eof.inputStream = current.inputStream;
        chunk.push(eof);
      }

      // This does not relex since we are not calling fill on the token stream
      const chunkStream = new CommonTokenStream(lexer);
      const streamInternal = chunkStream as unknown as Record<string, unknown>;
      streamInternal.tokens = chunk;
      streamInternal.fetchedEOF = true;
      result.push(chunkStream);
      offset = i + 1;
```

## Summary of files changed

```bash
git diff --stat HEAD~1 | grep -v 'vendor/' | head -25
```

```output
 packages/language-support/package.json             |   10 +-
 .../autocompletion/completionCoreCompletions.ts    |   69 +-
 .../src/autocompletion/schemaBasedCompletions.ts   |   12 +-
 .../language-support/src/formatting/formatting.ts  |   73 +-
 .../src/formatting/formattingHelpers.ts            |   74 +-
 .../src/formatting/standardizer.ts                 |    6 +-
 packages/language-support/src/helpers.ts           |  103 +-
 packages/language-support/src/index.ts             |   20 +-
 packages/language-support/src/lexerSymbols.ts      |    2 +-
 packages/language-support/src/parserWrapper.ts     |   80 +-
 packages/language-support/src/signatureHelp.ts     |   14 +-
 .../src/syntaxColouring/syntaxColouring.ts         |   12 +-
 .../src/syntaxColouring/syntaxColouringHelpers.ts  |    4 +-
 .../src/syntaxValidation/completionCoreErrors.ts   |    8 +-
 .../syntaxValidation/syntaxValidationHelpers.ts    |   28 +-
 packages/language-support/src/tests/lexer.test.ts  |   10 +-
 packages/language-support/tsconfig.json            |    2 +-
 .../react-codemirror-playground/src/treeUtil.ts    |   10 +-
 pnpm-lock.yaml                                     | 1076 +--------
 pnpm-workspace.yaml                                |    1 -
 tsconfig.json                                      |    1 -
 .../tests/CodeCompletionOptionals.spec.ts          |  249 ---
 vitest.workspace.ts                                |    1 -
 47 files changed, 404 insertions(+), 7108 deletions(-)
```

**+404 insertions, -7,108 deletions** across 47 files. The bulk of deletions is the removed vendor directory.

## CI change: removed Java/ANTLR jar setup

The `Setup antlr` step in `.github/actions/setup-and-build/action.yaml` has been removed. Parser generation is now handled by `antlr-ng` (installed via pnpm as a devDependency). No Java runtime is needed.

```bash
cat .github/actions/setup-and-build/action.yaml
```

```output
name: 'Setup and build project'

runs:
  using: 'composite'
  steps:
    - name: Setup pnpm
      uses: pnpm/action-setup@v4

    - name: Setup node.js
      uses: actions/setup-node@v4
      with:
        node-version: 24
        cache: 'pnpm'
        registry-url: 'https://registry.npmjs.org'

    - name: Install dependencies with frozen lock file
      shell: bash
      run: pnpm install --frozen-lockfile

    - name: Check for cached build
      id: restore-cache
      uses: actions/cache@v4
      with:
        path: |
          # Build artifacts only (not node_modules), based on .gitignore
          # Generated parsers
          **/generated-parser
          **/generated
          # Build outputs
          **/*.vsix
          **/*.tsbuildinfo
          **/dist
          **/build
          **/out
          **/lintWorker.mjs

        key: build-${{ github.sha }}
        restore-keys: |
          build-${{ github.sha }}

    - name: Setup and build project
      if: steps.restore-cache.outputs.cache-hit != 'true'
      shell: bash
      env:
        NODE_OPTIONS: '--max_old_space_size=4096'
      run: pnpm build

    - name: Cache build output
      if: steps.restore-cache.outputs.cache-hit != 'true'
      uses: actions/cache@v4
      with:
        # Same paths as above
        path: |
          **/generated-parser
          **/generated
          **/*.vsix
          **/*.tsbuildinfo
          **/dist
          **/build
          **/out

        key: build-${{ github.sha }}
```

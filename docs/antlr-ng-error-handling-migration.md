# Migrating `context.exception` for antlr-ng

## What changed

antlr4ng 3.0.0 **removed `ParserRuleContext.exception`**. From the
[release notes](https://github.com/mike-lischke/antlr4ng/blob/main/release-notes.md):

> "Neither `BailErrorStrategy` nor `ParserRuleContext` track the original
> exception in error cases anymore. Instead it is wrapped in the exception thrown
> (for bailing out) or passed to the error listeners."

Java ANTLR4 [still has the field](https://github.com/antlr/antlr4/blob/dev/runtime/Java/src/org/antlr/v4/runtime/ParserRuleContext.java) —
antlr4ng is deliberately diverging.

## Why: performance

`ParserRuleContext` is instantiated for **every rule invocation**. Removing
`.exception` cuts allocation size and GC pressure on this hot object. The old
[`BailErrorStrategy`](https://github.com/antlr/antlr4/blob/dev/runtime/Java/src/org/antlr/v4/runtime/BailErrorStrategy.java)
walked the entire context chain stamping exceptions on every ancestor — O(depth)
per error — and that's gone too.

The field was **write-only from the runtime's perspective**: no ANTLR internal
code ever read it back.
[`DefaultErrorStrategy`](https://github.com/mike-lischke/antlr4ng/blob/main/src/DefaultErrorStrategy.ts)
receives the exception as a parameter and routes through
`notifyErrorListeners()`. The field was purely a convenience cache for external
consumers — like our code.

## The pointer is inverted, not deleted

[`RecognitionException`](https://github.com/mike-lischke/antlr4ng/blob/main/src/RecognitionException.ts)
still carries `.ctx: ParserRuleContext | null`. The error → context relationship
still exists, it's just reversed:

| Before (antlr4) | After (antlr4ng 3.x) |
|---|---|
| `context.exception` → error | `exception.ctx` → context |
| Walk tree, check each node | Collect errors during parse, look up by context |

## Affected call sites

All files live under `packages/language-support/src/`.

### Site 1: Formatter — `formatting/formattingHelpers.ts:124-149` (HIGH)

This file creates **its own parser** (not via `parserWrapper.ts`):

```typescript
export function getParseTreeAndTokens(query: string) {
  const inputStream = CharStreams.fromString(query);
  const lexer = new CypherCmdLexer(inputStream);
  const tokens = new CommonTokenStream(lexer);
  const parser = new CypherCmdParser(tokens);
  parser.removeErrorListeners();
  parser.buildParseTrees = true;
  const tree = parser.statementsOrCommands();

  if (tree.exception) {                                    // <-- HERE
    const idx = tree.exception.offendingToken.tokenIndex;
    const errorTokens = tokens.tokens.slice(idx);
    const hiddenBefore = (tokens.getHiddenTokensToLeft(idx) || [])
      .map((t) => t.text)
      .join('');
    unParseable = hiddenBefore + errorTokens.slice(0, -1).map((t) => t.text).join('');
    firstUnParseableToken = tree.exception.offendingToken;
  }
  return { tree, tokens, unParseable, firstUnParseableToken };
}
```

**What it needs:** The first offending token from the first parse error, to slice
the token stream and identify the unparseable tail of the query.

**Tests:** `src/tests/formatting/syntaxerror.test.ts` (217 lines) — comprehensive
coverage of formatter behavior with syntax errors.

### Site 2: Autocompletion — `autocompletion/completionCoreCompletions.ts:776,794` (MEDIUM)

```typescript
// Line 776 — RULE_arrowLine
possiblePatternElementParent?.children.findLast(
  (x) =>
    (x instanceof RelationshipPatternContext ||
     x instanceof NodePatternContext) &&
    x.exception === null,                                  // <-- HERE
)

// Line 794 — RULE_leftArrow
possiblePatternElementParent.children.toReversed().find((child) => {
  if (child instanceof NodePatternContext) {
    if (child.exception === null) {                        // <-- HERE
      return true;
    }
  }
});
```

**What it needs:** Whether a specific child context (NodePattern or
RelationshipPattern) parsed without errors — used to skip broken contexts when
looking for the last valid pattern element.

### Site 3: Autocompletion — `autocompletion/schemaBasedCompletions.ts:356,446` (MEDIUM)

```typescript
// Line 356 — getSchemaBasedLabelCompletions
callContext.children.toReversed().find((child) => {
  if (child instanceof RelationshipPatternContext) {
    if (child.exception === null) { return true; }         // <-- HERE
  }
});

// Line 446 — getSchemaBasedReltypeCompletions
patternContext.children.toReversed().find((child) => {
  if (child instanceof NodePatternContext) {
    if (child.exception === null) { return true; }         // <-- HERE
  }
});
```

**What it needs:** Same pattern — filter to the last valid child context.

**Tests for sites 2-3:** No dedicated tests for the `exception === null`
filtering. Covered indirectly by autocompletion integration tests in
`src/tests/autocompletion/`.

## How parsing is wired up

There are **two separate parsing paths** that need the error listener:

### Path A: Formatter (standalone parser)

`formattingHelpers.ts:getParseTreeAndTokens()` creates its own
`CypherCmdParser` from scratch. No error listeners are attached (they're
removed on line 130). The error listener must be added here directly.

### Path B: Autocompletion (via parserWrapper)

`parserWrapper.ts` (`src/parserWrapper.ts`) has `createParsingResult()` which:
1. Calls `parser.removeErrorListeners()` (line 140)
2. Attaches `SyntaxErrorsListener` via `parser.addErrorListener()` (line 210)
3. Returns a result that flows to autocompletion call sites

**Existing error listener:** `SyntaxErrorsListener` in
`src/syntaxValidation/syntaxValidationHelpers.ts:18-138` — implements
`ANTLRErrorListener<CommonToken>`, collects `SyntaxDiagnostic[]` errors. This is
the only custom error listener in the codebase. The new `ErrorTrackingListener`
could either extend it or be composed alongside it.

## Solution: error listener + context map

Since `RecognitionException.ctx` still points to the failing context, collect
these references during parsing via the error listener, then query the map at
call sites.

The error listener's `syntaxError` callback receives the `RecognitionException`
(with `.ctx` and `.offendingToken`) and the `offendingSymbol` token. We store
them:

```typescript
class ErrorTrackingListener implements ANTLRErrorListener {
    readonly errorContexts = new Map<ParserRuleContext, RecognitionException>();
    firstOffendingToken: Token | null = null;

    syntaxError(
        recognizer: Recognizer, offendingSymbol: Token | null,
        line: number, charPositionInLine: number,
        msg: string, e: RecognitionException | null
    ): void {
        if (!this.firstOffendingToken && offendingSymbol) {
            this.firstOffendingToken = offendingSymbol;
        }
        if (e?.ctx) {
            this.errorContexts.set(e.ctx, e);
        }
    }

    hasError(ctx: ParserRuleContext): boolean {
        return this.errorContexts.has(ctx);
    }
}
```

### Migrating each call site

**Site 1 (formatter):** Add `ErrorTrackingListener` to the standalone parser in
`getParseTreeAndTokens()`. Replace `tree.exception.offendingToken` with
`errorListener.firstOffendingToken`. Return it in the existing result object.

**Sites 2-3 (autocompletion):** Add `ErrorTrackingListener` alongside
`SyntaxErrorsListener` in `parserWrapper.ts:createParsingResult()`. Thread the
listener (or its `errorContexts` map) through the return value. Replace
`x.exception === null` with `!errorListener.hasError(x)` at each call site.

### Threading the map to call sites

**Path A (formatter):** Self-contained — the listener is created and consumed in
the same function. No threading needed.

**Path B (autocompletion):** `parserWrapper.ts` already returns structured
results. Add the error map to the return type. The autocompletion functions
already receive `parsingResult` as a parameter, so the map is accessible without
changing intermediate function signatures.

### Why this approach

- Aligns with how antlr4ng delivers errors (listeners, not node properties)
- Doesn't fight the performance optimization (no per-node allocation)
- Preserves exact semantics — same `RecognitionException` with `.ctx` and
  `.offendingToken`
- Won't break on future antlr4ng updates
- `ErrorNode` detection is **not a substitute** — a rule can fail without
  producing ErrorNode children, or recover and leave ErrorNodes in a rule that
  succeeded. Different semantics.

## API migration reference

| antlr4 | antlr4ng 3.x | Notes |
|---|---|---|
| `context.exception` | **Removed** | Use error listener map |
| `context.parentCtx` | `context.parent` | `null` instead of `undefined` |
| `Parser._ctx` | `Parser.context` | Now public |
| `Parser._errHandler` | `Parser.errorHandler` | |
| `getTypedRuleContext()` | `getRuleContext()` | |
| `getTypedRuleContexts()` | `getRuleContexts()` | |
| `_localctx` (generated) | `localContext` | |
| `ErrorListener<T>` | `ANTLRErrorListener` | No generic |

Code generation templates:
[old](https://github.com/antlr/antlr4/blob/dev/tool/resources/org/antlr/v4/tool/templates/codegen/TypeScript/TypeScript.stg) /
[new](https://github.com/antlr-ng/antlr-ng/blob/main/templates/codegen/TypeScript/TypeScript.stg)

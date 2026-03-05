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

## Our affected call sites

**Formatter** — `formattingHelpers.ts:134`: reads `tree.exception.offendingToken`
to find where unparseable input starts. **HIGH impact.**

**Autocompletion** — `completionCoreCompletions.ts:776,794` and
`schemaBasedCompletions.ts:356,446`: checks `x.exception === null` to filter out
error contexts. **MEDIUM impact.**

## Solution: error listener + context map

Collect `RecognitionException.ctx` references during parsing via the error
listener (which antlr4ng already calls), then query the map at call sites.

This works because the error listener's `syntaxError` callback receives both the
`RecognitionException` (with `.ctx` and `.offendingToken`) and the
`offendingSymbol` token directly. We just need to store them.

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

**At call sites:**
```typescript
// Formatter: instead of tree.exception.offendingToken
errorListener.firstOffendingToken

// Autocompletion: instead of x.exception === null
!errorListener.hasError(x)
```

### Why this approach

- Aligns with how antlr4ng delivers errors (listeners, not node properties)
- Doesn't fight the performance optimization (no per-node allocation)
- Preserves exact semantics — same `RecognitionException` with `.ctx` and
  `.offendingToken`
- Won't break on future antlr4ng updates
- `ErrorNode` detection is **not a substitute** — a rule can fail without
  producing ErrorNode children, or recover and leave ErrorNodes in a rule that
  succeeded. Different semantics.

### Threading the map to call sites

The existing `parserWrapper.ts` already returns structured results. Return the
error listener (or its map) alongside the parse tree so downstream code can
query it without signature changes to intermediate functions.

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

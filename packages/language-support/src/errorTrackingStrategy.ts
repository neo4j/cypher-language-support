import {
  DefaultErrorStrategy,
  Parser,
  ParserRuleContext,
  RecognitionException,
  Token,
} from 'antlr4ng';

/**
 * Error strategy that tracks which parser rule contexts caught a
 * RecognitionException during parsing.
 *
 * In antlr4ng 3.x, ParserRuleContext.exception was removed. In the old
 * antlr4 runtime, the generated parser's per-rule catch blocks attached the
 * exception to that rule's context (`_localctx.exception = re`). Those catch
 * blocks call `errorHandler.reportError(this, re)` before recovering, so
 * overriding reportError captures exactly the same contexts — including
 * reports the default strategy suppresses while in error recovery mode.
 */
export class ErrorTrackingStrategy extends DefaultErrorStrategy {
  /** First exception caught per rule context, in catch order. */
  readonly caughtExceptions = new Map<
    ParserRuleContext,
    RecognitionException
  >();

  override reportError(recognizer: Parser, e: RecognitionException): void {
    const ctx = recognizer.context;
    if (ctx && !this.caughtExceptions.has(ctx)) {
      this.caughtExceptions.set(ctx, e);
    }
    super.reportError(recognizer, e);
  }

  /** Old `ctx.exception != null` semantics: did rule ctx catch an error? */
  hasError(ctx: ParserRuleContext): boolean {
    return this.caughtExceptions.has(ctx);
  }

  /** Old `ctx.exception?.offendingToken` semantics. */
  offendingTokenAt(ctx: ParserRuleContext): Token | undefined {
    return this.caughtExceptions.get(ctx)?.offendingToken ?? undefined;
  }
}

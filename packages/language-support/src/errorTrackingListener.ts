import {
  DefaultErrorStrategy,
  ParserRuleContext,
  RecognitionException,
  Token,
} from 'antlr4';
import type { Parser } from 'antlr4';

/**
 * Custom error strategy that tracks which parser rule contexts had errors.
 *
 * This replaces direct access to `ParserRuleContext.exception` which
 * is removed in antlr-ng. In ANTLR4's generated parser code, each rule's
 * catch block sets `_localctx.exception = re` before calling
 * `_errHandler.reportError()`. The default strategy suppresses reporting
 * during error recovery mode, but `_localctx.exception` is always set.
 *
 * By overriding `reportError`, we capture all error contexts — including
 * those suppressed during recovery — matching the semantics of
 * `context.exception !== null`.
 */
export class ErrorTrackingStrategy extends DefaultErrorStrategy {
  readonly errorContexts = new Map<ParserRuleContext, Token>();

  reportError(recognizer: Parser, e: RecognitionException): void {
    const ctx: ParserRuleContext = recognizer._ctx;
    if (ctx && !this.errorContexts.has(ctx)) {
      this.errorContexts.set(ctx, e?.offendingToken);
    }
    super.reportError(recognizer, e);
  }

  hasError(ctx: ParserRuleContext): boolean {
    return this.errorContexts.has(ctx);
  }

  getOffendingToken(ctx: ParserRuleContext): Token | undefined {
    return this.errorContexts.get(ctx);
  }
}

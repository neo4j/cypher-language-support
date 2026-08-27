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
 * Generated per-rule catch blocks call `reportError` while the recognizer's
 * current context is the context that caught the error. Recording before
 * delegating also retains reports that the default strategy suppresses while
 * in error recovery mode.
 */
export class ErrorTrackingStrategy extends DefaultErrorStrategy {
  /** Most recently reported exception per rule context. */
  readonly caughtExceptions = new Map<
    ParserRuleContext,
    RecognitionException
  >();

  override reportError(recognizer: Parser, e: RecognitionException): void {
    const ctx = recognizer.context;
    if (ctx) {
      this.caughtExceptions.set(ctx, e);
    }
    super.reportError(recognizer, e);
  }

  /** Whether the rule context caught a recognition error. */
  hasError(ctx: ParserRuleContext): boolean {
    return this.caughtExceptions.has(ctx);
  }

  /** The offending token for the error caught by the rule context. */
  offendingTokenAt(ctx: ParserRuleContext): Token | undefined {
    return this.caughtExceptions.get(ctx)?.offendingToken ?? undefined;
  }
}

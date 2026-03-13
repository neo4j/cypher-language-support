import {
  ANTLRErrorListener,
  ParserRuleContext,
  RecognitionException,
  Token,
} from 'antlr4ng';
import type { ATNSimulator } from 'antlr4ng';
import type { Recognizer } from 'antlr4ng';

/**
 * Error listener that tracks which parser rule contexts had errors.
 *
 * In antlr4ng 3.x, ParserRuleContext.exception was removed. Instead,
 * RecognitionException still carries .ctx, so the error→context
 * relationship is reversed. This listener collects errors during parsing
 * and provides a way to query by context at call sites.
 */
export class ErrorTrackingListener implements ANTLRErrorListener {
  readonly errorContexts = new Map<ParserRuleContext, RecognitionException>();
  firstOffendingToken: Token | null = null;

  syntaxError<S extends Token, T extends ATNSimulator>(
    recognizer: Recognizer<T>,
    offendingSymbol: S | null,
    line: number,
    charPositionInLine: number,
    msg: string,
    e: RecognitionException | null,
  ): void {
    if (!this.firstOffendingToken && offendingSymbol) {
      this.firstOffendingToken = offendingSymbol;
    }
    if (e?.ctx) {
      this.errorContexts.set(e.ctx as ParserRuleContext, e);
    }
  }

  hasError(ctx: ParserRuleContext): boolean {
    return this.errorContexts.has(ctx);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  reportAttemptingFullContext() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  reportAmbiguity() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  reportContextSensitivity() {}
}

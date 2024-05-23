import {
  CommonToken,
  ErrorListener as ANTLRErrorListener,
  Recognizer,
  Token,
} from 'antlr4';
import type { ParserRuleContext } from 'antlr4-c3';
import {
  Diagnostic,
  DiagnosticSeverity,
  Position,
} from 'vscode-languageserver-types';
import { CypherLexer } from '..';
import CypherParser from '../generated-parser/CypherCmdParser';
import { isCommentOpener } from '../helpers';
import { completionCoreErrormessage } from './completionCoreErrors';

export type SyntaxDiagnostic = Diagnostic & {
  offsets: { start: number; end: number };
};

export class SyntaxErrorsListener implements ANTLRErrorListener<CommonToken> {
  errors: SyntaxDiagnostic[];
  unfinishedToken: boolean;
  tokens: Token[];

  constructor(tokens: Token[]) {
    this.errors = [];
    this.unfinishedToken = false;
    this.tokens = tokens;
  }

  public syntaxError<T extends Token>(
    recognizer: Recognizer<T>,
    offendingSymbol: T,
    line: number,
    charPositionInLine: number,
  ): void {
    // If we've found an unfinished comment, string or escaped identifier, we
    // throw an error from the start of those until the end of the file, so we
    // need to assume any other errors we find are false positives.
    if (!this.unfinishedToken) {
      const startLine = line - 1;
      const startColumn = charPositionInLine;
      const parser = recognizer as CypherParser;
      const ctx = parser._ctx as ParserRuleContext;
      const tokenIndex = offendingSymbol.tokenIndex;
      const nextTokenIndex = tokenIndex + 1;
      const nextToken = this.tokens.at(nextTokenIndex);
      const unfinishedComment = isCommentOpener(offendingSymbol, nextToken);

      if (offendingSymbol.type === CypherLexer.ErrorChar || unfinishedComment) {
        let errorMessage: string | undefined = undefined;

        if (unfinishedComment) {
          errorMessage = 'Unfinished comment';
        } else if (
          offendingSymbol.text === '"' ||
          offendingSymbol.text === "'"
        ) {
          errorMessage = 'Unfinished string literal';
        } else if (offendingSymbol.text === '`') {
          errorMessage = 'Unfinished escaped identifier';
        }

        if (errorMessage) {
          // This is the EOF token
          const lastToken = this.tokens.at(-1);
          this.unfinishedToken = true;

          const diagnostic = {
            severity: DiagnosticSeverity.Error,
            range: {
              start: Position.create(startLine, startColumn),
              end: Position.create(lastToken.line - 1, lastToken.column),
            },
            offsets: {
              start: offendingSymbol.start,
              end: lastToken.start,
            },
            message: errorMessage,
          };

          this.errors.push(diagnostic);
        }
      } else {
        const errorMessage = completionCoreErrormessage(
          parser,
          offendingSymbol,
          ctx,
        );

        if (errorMessage) {
          const endColumn =
            offendingSymbol.type === CypherLexer.EOF
              ? startColumn
              : startColumn + offendingSymbol.text.length;

          const diagnostic: SyntaxDiagnostic = {
            severity: DiagnosticSeverity.Error,
            range: {
              start: Position.create(startLine, startColumn),
              end: Position.create(startLine, endColumn),
            },
            offsets: {
              start: offendingSymbol.start,
              end: offendingSymbol.stop + 1,
            },
            message: errorMessage,
          };
          this.errors.push(diagnostic);
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public reportAttemptingFullContext() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public reportAmbiguity() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public reportContextSensitivity() {}
}

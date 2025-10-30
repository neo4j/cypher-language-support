import {
  CommonToken,
  ANTLRErrorListener,
  ParserRuleContext,
  Recognizer,
  Token,
  ATNSimulator,
} from 'antlr4ng';
import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';
import {CypherCmdLexer as CypherLexer} from '../generated-parser/CypherCmdLexer';
import {CypherCmdParser as CypherParser,
  ConsoleCommandContext,
  PreparserOptionContext,
} from '../generated-parser/CypherCmdParser';
import { findParent, isCommentOpener } from '../helpers';
import { completionCoreErrormessage } from './completionCoreErrors';
import { SyntaxDiagnostic } from './syntaxValidation';

export class SyntaxErrorsListener implements ANTLRErrorListener {
  errors: SyntaxDiagnostic[];
  unfinishedToken: boolean;
  tokens: Token[];
  consoleCommandsEnabled: boolean;

  constructor(tokens: Token[], consoleCommandsEnabled: boolean) {
    this.errors = [];
    this.unfinishedToken = false;
    this.tokens = tokens;
    this.consoleCommandsEnabled = consoleCommandsEnabled;
  }

  public syntaxError<S extends Token, T extends ATNSimulator>(
    recognizer: Recognizer<T>,
    offendingSymbol: S,
    line: number,
    charPositionInLine: number,
  ): void {
    // If we've found an unfinished comment, string or escaped identifier, we
    // throw an error from the start of those until the end of the file, so we
    // need to assume any other errors we find are false positives.
    if (!this.unfinishedToken) {
      const startLine = line - 1;
      const startColumn = charPositionInLine;
      const parser = recognizer as unknown as CypherParser;
      const ctx: ParserRuleContext = parser.context;
      const tokenIndex = offendingSymbol.tokenIndex;
      const nextTokenIndex = tokenIndex + 1;
      const nextToken = this.tokens.at(nextTokenIndex);
      const unfinishedComment = isCommentOpener(offendingSymbol, nextToken);
      const preparserOrConsoleCommand = findParent(
        ctx,
        (n) =>
          n instanceof PreparserOptionContext ||
          n instanceof ConsoleCommandContext,
      );

      if (
        preparserOrConsoleCommand &&
        (offendingSymbol.type === CypherLexer.ErrorChar || unfinishedComment)
      ) {
        let errorMessage: string | undefined = undefined;

        if (unfinishedComment) {
          errorMessage =
            'Failed to parse comment. A comment starting on `/*` must have a closing `*/`.';
        } else if (
          offendingSymbol.text === '"' ||
          offendingSymbol.text === "'"
        ) {
          errorMessage =
            'Failed to parse string literal. The query must contain an even number of non-escaped quotes.';
        } else if (offendingSymbol.text === '`') {
          errorMessage =
            'Failed to parse escaped literal. The query must contain an even number of ` backticks.';
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
      } else if (
        offendingSymbol.type !== CypherLexer.ErrorChar &&
        !unfinishedComment
      ) {
        const errorMessage = completionCoreErrormessage(
          parser,
          offendingSymbol,
          this.consoleCommandsEnabled,
        );

        if (errorMessage) {
          const endColumn =
            offendingSymbol.type === CypherLexer.cEOF
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

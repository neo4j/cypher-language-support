import {
  CommonToken,
  ErrorListener as ANTLRErrorListener,
  Recognizer,
  Token,
} from 'antlr4';
import { ParserRuleContext } from 'antlr4-c3';
import {
  Diagnostic,
  DiagnosticSeverity,
  Position,
} from 'vscode-languageserver-types';
import CypherParser from '../../generated-parser/CypherParser';
import { completionCoreErrormessage } from './completionCoreErrors';

export type SyntaxDiagnostic = Diagnostic & {
  offsets: { start: number; end: number };
};

export class SyntaxErrorsListener implements ANTLRErrorListener<CommonToken> {
  errors: SyntaxDiagnostic[];

  constructor() {
    this.errors = [];
  }

  public syntaxError<T extends Token>(
    recognizer: Recognizer<T>,
    offendingSymbol: T,
    line: number,
    charPositionInLine: number,
  ): void {
    const startLine = line - 1;
    const startColumn = charPositionInLine;
    const lines = offendingSymbol.text.split('\n');
    const endLine = startLine + lines.length - 1;
    const columnOffset = endLine === startLine ? startColumn : 0;
    const endColumn =
      offendingSymbol.type === CypherParser.EOF &&
      offendingSymbol.text === '<EOF>'
        ? startColumn
        : columnOffset + lines.at(-1).length;

    const parser = recognizer as CypherParser;
    const ctx = parser._ctx as ParserRuleContext;
    let errorMessage: string | undefined = undefined;

    if (
      offendingSymbol.type === CypherParser.EOF &&
      offendingSymbol.text !== '<EOF>'
    ) {
      if (
        offendingSymbol.text.startsWith('"') ||
        offendingSymbol.text.startsWith("'")
      ) {
        errorMessage = 'Unfinished string literal';
      } else if (offendingSymbol.text.startsWith('/*')) {
        errorMessage = 'Unfinished comment';
      } else if (offendingSymbol.text.startsWith('`')) {
        errorMessage = 'Unfinished escaped identifier';
      }
    } else {
      errorMessage = completionCoreErrormessage(parser, offendingSymbol, ctx);
    }

    if (errorMessage) {
      const diagnostic: SyntaxDiagnostic = {
        severity: DiagnosticSeverity.Error,
        range: {
          start: Position.create(startLine, charPositionInLine),
          end: Position.create(endLine, endColumn),
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

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public reportAttemptingFullContext() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public reportAmbiguity() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public reportContextSensitivity() {}
}

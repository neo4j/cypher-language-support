import {
  CommonToken,
  ErrorListener as ANTLRErrorListener,
  Recognizer,
  Token,
} from 'antlr4';
import { ParserRuleContext } from 'antlr4-c3/out/src/antrl4';
import { distance } from 'fastest-levenshtein';
import {
  Diagnostic,
  DiagnosticSeverity,
  Position,
} from 'vscode-languageserver-types';
import CypherParser from '../generated-parser/CypherParser';
import { completionCoreErrormessage } from './completionCoreErrors';

export type SyntaxDiagnostic = Diagnostic & {
  offsets: { start: number; end: number };
};

/*
We ask for 0.7 similarity (number between 0 and 1) for 
considering the user has made a typo when writing a symbol
*/
export const similarityForSuggestions = 0.7;

export function normalizedLevenshteinDistance(s1: string, s2: string): number {
  const numEdits: number = distance(s1.toUpperCase(), s2.toUpperCase());

  // normalize by length of longest string
  const longestLength = Math.max(s1.length, s2.length);
  return (longestLength - numEdits) / longestLength;
}

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
    msg: string,
  ): void {
    const lineIndex = line - 1;
    const start = charPositionInLine;
    const end =
      offendingSymbol.type === CypherParser.EOF
        ? start
        : start + offendingSymbol.text.length;

    const parser = recognizer as CypherParser;
    const ctx = parser._ctx as ParserRuleContext;

    const errorMessage = completionCoreErrormessage(
      parser,
      parser.getCurrentToken(),
      ctx,
    );
    const diagnostic: SyntaxDiagnostic = {
      severity: DiagnosticSeverity.Error,
      range: {
        start: Position.create(lineIndex, charPositionInLine),
        end: Position.create(lineIndex, end),
      },
      offsets: {
        start: offendingSymbol.start,
        end: offendingSymbol.stop + 1,
      },
      // If we couldn't find a more helpful error message, keep the original one
      message: errorMessage ?? msg,
    };

    this.errors.push(diagnostic);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public reportAttemptingFullContext() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public reportAmbiguity() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public reportContextSensitivity() {}
}

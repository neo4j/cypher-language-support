import {
  CommonToken,
  ErrorListener as ANTLRErrorListener,
  IntervalSet,
  Recognizer,
  Token,
} from 'antlr4';
import { distance } from 'fastest-levenshtein';
import {
  Diagnostic,
  DiagnosticSeverity,
  Position,
} from 'vscode-languageserver-types';
import CypherParser from '../generated-parser/CypherParser';
import { isDefined } from '../helpers';
import { tokenNames } from '../lexerSymbols';

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

function filterSuggestions(mispeltKeyword: string, suggestions: string[]) {
  return suggestions.filter((suggestion) => {
    return (
      normalizedLevenshteinDistance(mispeltKeyword, suggestion) >
      similarityForSuggestions
    );
  });
}

export function getHelpfulErrorMessage(
  offendingSymbol: Token,
  possibleTokenNumbers: number[],
): undefined | string {
  const msgs: string[] = [];
  const mispeltKeyword = offendingSymbol.text;
  const parserSuggestedTokens = possibleTokenNumbers
    .filter((t) => t !== CypherParser.EOF && t !== CypherParser.SEMICOLON)
    .map((t) => tokenNames.at(t));

  let mostLikelyCandidates: string[] = filterSuggestions(
    mispeltKeyword,
    parserSuggestedTokens,
  );

  if (mostLikelyCandidates.length === 0) {
    mostLikelyCandidates = parserSuggestedTokens;
    const eof = possibleTokenNumbers.find((t) => t === CypherParser.EOF);
    const semicolon = possibleTokenNumbers.find(
      (t) => t === CypherParser.SEMICOLON,
    );

    // It should not happen we have one but not the other
    if (eof && semicolon) {
      msgs.push('Did you mean to finish the statement or open a new one?');
    }
  }

  if (mostLikelyCandidates.length === 1) {
    msgs.push('Did you mean ' + mostLikelyCandidates[0] + '?');
  } else if (mostLikelyCandidates.length >= 1) {
    msgs.push(
      'Did you mean any of ' +
        mostLikelyCandidates.slice(0, -1).join(', ') +
        ' or ' +
        mostLikelyCandidates.at(-1) +
        '?',
    );
  }

  if (msgs.length > 0) {
    return msgs.join(' ');
  } else {
    return undefined;
  }
}

export class SyntaxErrorsListener implements ANTLRErrorListener<CommonToken> {
  errors: Diagnostic[];

  constructor() {
    this.errors = [];
  }

  private toTokenList(tokens: IntervalSet): number[] {
    const range = (start: number, end: number) =>
      Array.from(Array(end - start).keys()).map((x) => x + start);

    const result = tokens.intervals.flatMap((interval) =>
      range(interval.start, interval.stop),
    );

    return result;
  }

  public syntaxError<T extends Token>(
    recognizer: Recognizer<T>,
    offendingSymbol: T | undefined,
    line: number,
    charPositionInLine: number,
    msg: string,
  ): void {
    let errorMessage: string | undefined;
    const lineIndex = line - 1;
    const start = charPositionInLine;
    let end = charPositionInLine;

    if (isDefined(offendingSymbol)) {
      end = start + offendingSymbol.text.length;

      const parser = recognizer as CypherParser;
      const tokenIntervals = parser.getExpectedTokens();
      const parserSuggestedTokens = this.toTokenList(tokenIntervals);

      errorMessage = getHelpfulErrorMessage(
        offendingSymbol,
        parserSuggestedTokens,
      );
    }

    const diagnostic: Diagnostic = {
      severity: DiagnosticSeverity.Error,
      range: {
        start: Position.create(lineIndex, charPositionInLine),
        end: Position.create(lineIndex, end),
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

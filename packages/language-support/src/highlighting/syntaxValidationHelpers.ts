import { tokenNames } from '../lexerSymbols';
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CommonToken,
  ErrorListener as ANTLRErrorListener,
  IntervalSet,
  RecognitionException,
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

function normalizedLevenshteinDistance(s1: string, s2: string): number {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const numEdits: number = distance(s1.toUpperCase(), s2.toUpperCase());

  // normalize by length of longest string
  const longestLength = Math.max(s1.length, s2.length);
  return (longestLength - numEdits) / longestLength;
}

function filterSuggestions(mispeltKeyword: string, suggestions: string[]) {
  return suggestions.filter((suggestion) => {
    return normalizedLevenshteinDistance(mispeltKeyword, suggestion) > 0.7;
  });
}

export function getMostLikelyCandidates(
  offendingSymbol: Token,
  possibleTokenNumbers: number[],
): string {
  let result = '';
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

    if (possibleTokenNumbers.find((t) => t === CypherParser.EOF)) {
      result += 'Did you intend to finish the query?';
    }
    if (possibleTokenNumbers.find((t) => t === CypherParser.SEMICOLON)) {
      if (result.length !== 0) result += ' ';
      result += 'Did you intend to open a new statement?';
    }
  }

  if (mostLikelyCandidates.length === 1) {
    if (result.length !== 0) result += ' ';
    result += 'Did you mean ' + mostLikelyCandidates[0] + '?';
  } else if (mostLikelyCandidates.length >= 1) {
    if (result.length !== 0) result += ' ';
    result +=
      'Did you mean any of ' +
      mostLikelyCandidates.slice(0, -1).join(', ') +
      ' or ' +
      mostLikelyCandidates.at(-1) +
      '?';
  }

  return result;
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
    exception: RecognitionException,
  ): void {
    if (isDefined(offendingSymbol)) {
      const lineIndex = line - 1;
      const start = charPositionInLine;
      const end = start + offendingSymbol.text.length;

      const parser = recognizer as CypherParser;
      const tokenIntervals = parser.getExpectedTokens();
      const parserSuggestedTokens = this.toTokenList(tokenIntervals);

      const errorMessage = getMostLikelyCandidates(
        offendingSymbol,
        parserSuggestedTokens,
      );

      const diagnostic: Diagnostic = {
        severity: DiagnosticSeverity.Error,
        range: {
          start: Position.create(lineIndex, start),
          end: Position.create(lineIndex, end),
        },
        message: errorMessage,
      };

      this.errors.push(diagnostic);
    }
  }

  public reportAttemptingFullContext(
    _recognizer,
    _dfa,
    _startIndex,
    _stopIndex,
    _conflictingAlts,
    _configs,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {}

  public reportAmbiguity(
    _recognizer,
    _dfa,
    _startIndex,
    _stopIndex,
    _exact,
    _ambigAlts,
    _configs,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {}

  public reportContextSensitivity(
    _recognizer,
    _dfa,
    _startIndex,
    _stopIndex,
    _prediction,
    _configs,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {}
}

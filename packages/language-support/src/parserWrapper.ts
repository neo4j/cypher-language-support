/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CharStreams,
  CommonToken,
  CommonTokenStream,
  ErrorListener as ANTLRErrorListener,
  ParserRuleContext,
  Recognizer,
  Token,
} from 'antlr4';

import CypherLexer from './generated-parser/CypherLexer';

import {
  Diagnostic,
  DiagnosticSeverity,
  Position,
} from 'vscode-languageserver-types';

import CypherParser, {
  StatementsContext,
} from './generated-parser/CypherParser';
import { findStopNode } from './helpers';

export interface ParsingResult {
  query: string;
  parser: CypherParser;
  tokenStream: CommonTokenStream;
  diagnostics: Diagnostic[];
  result: StatementsContext;
  stopNode: ParserRuleContext;
}

class ParserWrapper {
  parsingResult: ParsingResult;

  parse(query: string): ParsingResult {
    if (
      this.parsingResult !== undefined &&
      this.parsingResult.query === query
    ) {
      return this.parsingResult;
    } else {
      const inputStream = CharStreams.fromString(query);
      const lexer = new CypherLexer(inputStream);
      const tokenStream = new CommonTokenStream(lexer);
      const parser = new CypherParser(tokenStream);

      parser.removeErrorListeners();
      const errorListener = new ErrorListener();
      parser.addErrorListener(errorListener);

      const result = parser.statements();
      const stopNode = findStopNode(result);

      const parsingResult: ParsingResult = {
        query: query,
        parser: parser,
        tokenStream: tokenStream,
        diagnostics: errorListener.diagnostics,
        result: result,
        stopNode: stopNode,
      };

      this.parsingResult = parsingResult;
      return parsingResult;
    }
  }
}

export const parserWrapper = new ParserWrapper();

export class ErrorListener implements ANTLRErrorListener<CommonToken> {
  diagnostics: Diagnostic[];

  constructor() {
    this.diagnostics = [];
  }

  public syntaxError<T extends Token>(
    _recognizer: Recognizer<T>,
    offendingSymbol: T | undefined,
    _line: number,
    _charPositionInLine: number,
    msg: string,
  ): void {
    const lineIndex = (offendingSymbol?.line ?? 1) - 1;
    const start = offendingSymbol?.start ?? 0;
    const end = (offendingSymbol?.stop ?? 0) + 1;

    const diagnostic: Diagnostic = {
      severity: DiagnosticSeverity.Warning,
      range: {
        start: Position.create(lineIndex, start),
        end: Position.create(lineIndex, end),
      },
      message: msg,
    };
    this.diagnostics.push(diagnostic);
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

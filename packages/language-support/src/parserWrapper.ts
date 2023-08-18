/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CharStreams,
  CommonToken,
  CommonTokenStream,
  ErrorListener as ANTLRErrorListener,
  ParserRuleContext,
  ParseTreeListener,
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
  VariableContext,
} from './generated-parser/CypherParser';
import { findStopNode, getTokens } from './helpers';

export interface ParsingResult {
  query: string;
  parser: CypherParser;
  tokens: Token[];
  result: StatementsContext;
}

export interface EnrichedParsingResult extends ParsingResult {
  diagnostics: Diagnostic[];
  stopNode: ParserRuleContext;
  collectedVariables: string[];
}

export interface ParsingScaffolding {
  query: string;
  parser: CypherParser;
  tokenStream: CommonTokenStream;
}

export function createParsingScaffolding(query: string): ParsingScaffolding {
  const inputStream = CharStreams.fromString(query);
  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new CypherParser(tokenStream);
  parser.removeErrorListeners();

  return {
    query: query,
    parser: parser,
    tokenStream: tokenStream,
  };
}

export function createParsingResult(
  parsingScaffolding: ParsingScaffolding,
): ParsingResult {
  const query = parsingScaffolding.query;
  const parser = parsingScaffolding.parser;
  const tokenStream = parsingScaffolding.tokenStream;
  const result = parser.statements();

  const parsingResult: ParsingResult = {
    query: query,
    parser: parser,
    tokens: getTokens(tokenStream),
    result: result,
  };

  return parsingResult;
}

// If a semantic analysis result is available, we it's data to get all the defined variables in scope
// if it's not available (or implemented) we fallback to a simple search for all variables
// in this initial version we don't check if the variables are used before define
class VariableCollector implements ParseTreeListener {
  variables: string[] = [];
  enterEveryRule() {
    /* no-op */
  }
  visitTerminal() {
    /* no-op */
  }
  visitErrorNode() {
    /* no-op */
  }
  exitEveryRule(ctx: unknown) {
    if (ctx instanceof VariableContext) {
      const variable = ctx.symbolicNameString().getText();
      if (variable) {
        this.variables.push(variable);
      }
    }
  }
}

class ParserWrapper {
  parsingResult: EnrichedParsingResult;

  parse(query: string): EnrichedParsingResult {
    if (
      this.parsingResult !== undefined &&
      this.parsingResult.query === query
    ) {
      return this.parsingResult;
    } else {
      const parsingScaffolding = createParsingScaffolding(query);
      const parser = parsingScaffolding.parser;
      const tokenStream = parsingScaffolding.tokenStream;
      const errorListener = new ErrorListener();
      parser.addErrorListener(errorListener);

      const variableFinder = new VariableCollector();
      parser._parseListeners = [variableFinder];

      const result = createParsingResult(parsingScaffolding).result;

      const parsingResult: EnrichedParsingResult = {
        query: query,
        parser: parser,
        tokens: getTokens(tokenStream),
        diagnostics: errorListener.diagnostics,
        result: result,
        stopNode: findStopNode(result),
        collectedVariables: variableFinder.variables,
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

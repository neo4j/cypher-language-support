/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CharStreams,
  CommonTokenStream,
  ParserRuleContext,
  ParseTreeListener,
  Token,
} from 'antlr4';

import CypherLexer from './generated-parser/CypherLexer';

import { Diagnostic } from 'vscode-languageserver-types';

import CypherParser, {
  LabelNameContext,
  LabelNameIsContext,
  LabelOrRelTypeContext,
  StatementsContext,
} from './generated-parser/CypherParser';
import { findStopNode, getTokens } from './helpers';
import { SyntaxErrorsListener } from './highlighting/syntaxValidationHelpers';

export interface ParsingResult {
  query: string;
  parser: CypherParser;
  tokens: Token[];
  result: StatementsContext;
}

type LabelOrRelType = {
  text: string;
  ctx: ParserRuleContext;
};

export interface EnrichedParsingResult extends ParsingResult {
  errors: Diagnostic[];
  stopNode: ParserRuleContext;
  collectedLabelOrRelTypes: LabelOrRelType[];
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

// This listener is collects all labels and relationship types
class LabelAndRelTypesCollector extends ParseTreeListener {
  labelOrRelTypes: LabelOrRelType[] = [];

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
    if (ctx instanceof LabelNameContext) {
      this.labelOrRelTypes.push({
        text: ctx.getText(),
        ctx: ctx,
      });
    } else if (ctx instanceof LabelNameIsContext) {
      this.labelOrRelTypes.push({
        text: ctx.getText(),
        ctx: ctx,
      });
    } else if (ctx instanceof LabelOrRelTypeContext) {
      this.labelOrRelTypes.push({
        text: ctx.symbolicNameString().start.text,
        ctx: ctx,
      });
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
      const errorListener = new SyntaxErrorsListener();
      parser.addErrorListener(errorListener);

      const labelsCollector = new LabelAndRelTypesCollector();
      parser._parseListeners = [labelsCollector];

      const result = createParsingResult(parsingScaffolding).result;

      const parsingResult: EnrichedParsingResult = {
        query: query,
        parser: parser,
        tokens: getTokens(tokenStream),
        errors: errorListener.errors,
        result: result,
        stopNode: findStopNode(result),
        collectedLabelOrRelTypes: labelsCollector.labelOrRelTypes,
      };

      this.parsingResult = parsingResult;
      return parsingResult;
    }
  }
}

export const parserWrapper = new ParserWrapper();

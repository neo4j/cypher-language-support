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
  ClauseContext,
  CreateClauseContext,
  ExpressionContext,
  LabelNameContext,
  LabelNameIsContext,
  LabelOrRelTypeContext,
  MergeClauseContext,
  StatementsContext,
  VariableContext,
} from './generated-parser/CypherParser';
import {
  findParent,
  findStopNode,
  getTokens,
  inNodeLabel,
  inRelationshipType,
  isDefined,
  rulesDefiningOrUsingVariables,
} from './helpers';
import { SyntaxErrorsListener } from './highlighting/syntaxValidationHelpers';

export interface ParsingResult {
  query: string;
  parser: CypherParser;
  tokens: Token[];
  result: StatementsContext;
}

export enum LabelType {
  nodeLabelType = 'Label',
  relLabelType = 'Relationship type',
  unknown = 'Label or relationship type',
}

function getLabelType(ctx: ParserRuleContext): LabelType {
  if (inNodeLabel(ctx)) return LabelType.nodeLabelType;
  else if (inRelationshipType(ctx)) return LabelType.relLabelType;
  else return LabelType.unknown;
}

function couldCreateNewLabel(ctx: ParserRuleContext): boolean {
  const parent = findParent(
    ctx,
    (ctx) => ctx instanceof ClauseContext || ctx instanceof ExpressionContext,
  );

  return (
    parent instanceof CreateClauseContext ||
    parent instanceof MergeClauseContext
  );
}

export type LabelOrRelType = {
  labeltype: LabelType;
  labelText: string;
  couldCreateNewLabel: boolean;
  line: number;
  column: number;
};

export interface EnrichedParsingResult extends ParsingResult {
  errors: Diagnostic[];
  stopNode: ParserRuleContext;
  collectedLabelOrRelTypes: LabelOrRelType[];
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
    if (ctx instanceof LabelNameContext || ctx instanceof LabelNameIsContext) {
      this.labelOrRelTypes.push({
        labeltype: getLabelType(ctx),
        labelText: ctx.getText(),
        couldCreateNewLabel: couldCreateNewLabel(ctx),
        line: ctx.start.line,
        column: ctx.start.column,
      });
    } else if (ctx instanceof LabelOrRelTypeContext) {
      const symbolicName = ctx.symbolicNameString();
      if (isDefined(symbolicName)) {
        this.labelOrRelTypes.push({
          labeltype: getLabelType(ctx),
          labelText: symbolicName.start.text,
          couldCreateNewLabel: couldCreateNewLabel(ctx),
          line: ctx.start.line,
          column: ctx.start.column,
        });
      }
    }
  }
}

// This class is collects all variables detected by the parser which means
// it does include variable scope nor differentiate between variable use and definition
// we use it when the semantic anaylsis result is not available
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
      // To avoid suggesting the variable that is currently being typed
      // For example RETURN a| <- we don't want to suggest "a" as a variable
      // We check if the variable is in the end of the statement
      const nextTokenIndex = ctx.stop?.tokenIndex;

      const nextTokenIsEOF =
        nextTokenIndex !== undefined &&
        ctx.parser?.getTokenStream().get(nextTokenIndex + 1)?.type ===
          CypherParser.EOF;

      const definesVariable = rulesDefiningOrUsingVariables.includes(
        // @ts-ignore types are wrong
        ctx.parentCtx?.ruleIndex as number,
      );

      if (variable && !nextTokenIsEOF && definesVariable) {
        this.variables.push(variable);
      }
    }
  }
}

class ParserWrapper {
  parsingResult?: EnrichedParsingResult;

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
      const variableFinder = new VariableCollector();
      parser._parseListeners = [labelsCollector, variableFinder];

      const result = createParsingResult(parsingScaffolding).result;

      const parsingResult: EnrichedParsingResult = {
        query: query,
        parser: parser,
        tokens: getTokens(tokenStream),
        errors: errorListener.errors,
        result: result,
        stopNode: findStopNode(result),
        collectedLabelOrRelTypes: labelsCollector.labelOrRelTypes,
        collectedVariables: variableFinder.variables,
      };

      this.parsingResult = parsingResult;
      return parsingResult;
    }
  }
}

export const parserWrapper = new ParserWrapper();

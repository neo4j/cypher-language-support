import type { ParserRuleContext, TerminalNode, Token } from 'antlr4';
import { CharStreams, CommonTokenStream, ParseTreeListener } from 'antlr4';

import CypherLexer from './generated-parser/CypherLexer';

import CypherParser, {
  AllExpressionContext,
  AnyExpressionContext,
  ArrowLineContext,
  BooleanLiteralContext,
  ClauseContext,
  FunctionNameContext,
  KeywordLiteralContext,
  LabelNameContext,
  LabelNameIsContext,
  LabelOrRelTypeContext,
  LeftArrowContext,
  NoneExpressionContext,
  NumberLiteralContext,
  ParameterContext,
  ProcedureNameContext,
  ProcedureResultItemContext,
  PropertyKeyNameContext,
  ReduceExpressionContext,
  RightArrowContext,
  SingleExpressionContext,
  StatementsContext,
  StringsLiteralContext,
  StringTokenContext,
  SymbolicNameStringContext,
  VariableContext,
} from './generated-parser/CypherParser';
import {
  findParent,
  getTokens,
  inNodeLabel,
  inRelationshipType,
  isDefined,
  rulesDefiningOrUsingVariables,
} from './helpers';
import {
  getCypherTokenType,
  getTokenPosition,
  ParsedCypherToken,
  tokenPositionToString,
} from './highlighting/syntaxColouring/syntaxColouringHelpers';
import {
  SyntaxDiagnostic,
  SyntaxErrorsListener,
} from './highlighting/syntaxValidation/syntaxValidationHelpers';
import { CypherTokenType } from './lexerSymbols';

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
  const parent = findParent(ctx, (ctx) => ctx instanceof ClauseContext);

  if (parent instanceof ClauseContext) {
    const clause = parent;
    return isDefined(clause.mergeClause()) || isDefined(clause.createClause());
  } else {
    return false;
  }
}

export type LabelOrRelType = {
  labeltype: LabelType;
  labelText: string;
  couldCreateNewLabel: boolean;
  line: number;
  column: number;
  offsets: {
    start: number;
    end: number;
  };
};

export interface EnrichedParsingResult extends ParsingResult {
  diagnostics: SyntaxDiagnostic[];
  stopNode: ParserRuleContext;
  collectedLabelOrRelTypes: LabelOrRelType[];
  collectedVariables: string[];
  highlights: Map<string, ParsedCypherToken>;
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
  console.log(tokenStream.getHiddenTokensToRight(0));

  return {
    query: query,
    parser: parser,
    tokenStream: tokenStream,
  };
}

export function parse(cypher: string) {
  const parser = createParsingScaffolding(cypher).parser;
  return parser.statements();
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
      // If the parent ctx start doesn't coincide with this ctx start,
      // it means the parser recovered from an error reading the label
      // like in the case MATCH (n:) RETURN n
      // RETURN would be idenfified as the label in that case
      if (ctx.parentCtx && ctx.parentCtx.start === ctx.start) {
        this.labelOrRelTypes.push({
          labeltype: getLabelType(ctx),
          labelText: ctx.getText(),
          couldCreateNewLabel: couldCreateNewLabel(ctx),
          line: ctx.start.line,
          column: ctx.start.column,
          offsets: {
            start: ctx.start.start,
            end: ctx.stop.stop + 1,
          },
        });
      }
    } else if (ctx instanceof LabelOrRelTypeContext) {
      const symbolicName = ctx.symbolicNameString();
      // Read comment for the label name case
      if (
        isDefined(symbolicName) &&
        ctx.parentCtx &&
        ctx.parentCtx.start === ctx.start
      ) {
        this.labelOrRelTypes.push({
          labeltype: getLabelType(ctx),
          labelText: symbolicName.start.text,
          couldCreateNewLabel: couldCreateNewLabel(ctx),
          line: ctx.start.line,
          column: ctx.start.column,
          offsets: {
            start: ctx.start.start,
            end: ctx.stop.stop + 1,
          },
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
        // @ts-expect-error the antlr4 types don't include ruleIndex but it is there, fix as the official types are improved
        ctx.parentCtx?.ruleIndex as unknown as number,
      );

      if (variable && !nextTokenIsEOF && definesVariable) {
        this.variables.push(variable);
      }
    }
  }
}

export class SyntaxHighlighter extends ParseTreeListener {
  colouredTokens: Map<string, ParsedCypherToken> = new Map();

  constructor() {
    super();
  }

  private addToken(token: Token, tokenType: CypherTokenType, tokenStr: string) {
    console.log(token.channel);
    if (token.start >= 0) {
      // https://trello.com/c/1pxj8Hce/96-investigate-if-we-can-stop-splitting-tokens-to-handle-multiline-tokens-in-vscode
      const tokenPosition = getTokenPosition(token);

      const stringiyed = tokenPositionToString(tokenPosition);

      this.colouredTokens.set(stringiyed, {
        tokenType,
        position: tokenPosition,
        length: tokenStr.length,
        token: tokenStr,
        bracketInfo: undefined,
      });
    }
  }

  exitLabelName = (ctx: LabelNameContext) => {
    this.addToken(ctx.start, CypherTokenType.label, ctx.getText());
  };

  exitLabelNameIs = (ctx: LabelNameIsContext) => {
    this.addToken(ctx.start, CypherTokenType.label, ctx.getText());
  };

  exitLabelOrRelType = (ctx: LabelOrRelTypeContext) => {
    // Error recovery can insert a LabelOrRelType node with no text
    // See for example CREATE CONSTRAINT FOR (node)
    const labelName = ctx.symbolicNameString()?.start;
    if (labelName) {
      this.addToken(labelName, CypherTokenType.label, labelName.text);
    }
  };

  exitLeftArrow = (ctx: LeftArrowContext) => {
    this.addToken(ctx.start, CypherTokenType.separator, ctx.getText());
  };

  exitArrowLine = (ctx: ArrowLineContext) => {
    this.addToken(ctx.start, CypherTokenType.separator, ctx.getText());
  };

  exitRightArrow = (ctx: RightArrowContext) => {
    this.addToken(ctx.start, CypherTokenType.separator, ctx.getText());
  };

  exitFunctionName = (ctx: FunctionNameContext) => {
    this.colourMethodName(ctx, CypherTokenType.function);
  };

  exitProcedureName = (ctx: ProcedureNameContext) => {
    this.colourMethodName(ctx, CypherTokenType.procedure);
  };

  private colourMethodName(
    ctx: FunctionNameContext | ProcedureNameContext,
    tokenType: CypherTokenType.function | CypherTokenType.procedure,
  ) {
    const namespace = ctx.namespace();

    namespace.symbolicNameString_list().forEach((namespaceName) => {
      this.addToken(namespaceName.start, tokenType, namespaceName.getText());
    });

    const nameOfMethod = ctx.symbolicNameString();
    this.addToken(nameOfMethod.start, tokenType, nameOfMethod.getText());
  }

  private colourPredicateFunction = (ctx: TerminalNode) => {
    this.addToken(ctx.symbol, CypherTokenType.predicateFunction, ctx.getText());
  };

  exitVariable = (ctx: VariableContext) => {
    this.addToken(ctx.start, CypherTokenType.variable, ctx.getText());
  };

  exitProcedureResultItem = (ctx: ProcedureResultItemContext) => {
    this.addToken(ctx.start, CypherTokenType.variable, ctx.getText());
  };

  exitPropertyKeyName = (ctx: PropertyKeyNameContext) => {
    // FIXME Is this correct in this case for all cases, not just simple properties?
    this.addToken(ctx.start, CypherTokenType.property, ctx.getText());
  };

  exitStringToken = (ctx: StringTokenContext) => {
    this.addToken(ctx.start, CypherTokenType.stringLiteral, ctx.getText());
  };

  exitStringsLiteral = (ctx: StringsLiteralContext) => {
    this.addToken(ctx.start, CypherTokenType.stringLiteral, ctx.getText());
  };

  exitBooleanLiteral = (ctx: BooleanLiteralContext) => {
    // Normally booleans are coloured as numbers in other languages
    this.addToken(ctx.start, CypherTokenType.booleanLiteral, ctx.getText());
  };

  exitNumberLiteral = (ctx: NumberLiteralContext) => {
    this.addToken(ctx.start, CypherTokenType.numberLiteral, ctx.getText());
  };

  exitKeywordLiteral = (ctx: KeywordLiteralContext) => {
    this.addToken(ctx.start, CypherTokenType.keywordLiteral, ctx.getText());
  };

  exitParameter = (ctx: ParameterContext) => {
    const dollar = ctx.DOLLAR();
    const parameterName = ctx.parameterName();
    this.addToken(dollar.symbol, CypherTokenType.paramDollar, dollar.getText());
    this.addToken(
      parameterName.start,
      CypherTokenType.paramValue,
      parameterName.getText(),
    );
  };

  exitAllExpression = (ctx: AllExpressionContext) => {
    this.colourPredicateFunction(ctx.ALL());
  };

  exitAnyExpression = (ctx: AnyExpressionContext) => {
    this.colourPredicateFunction(ctx.ANY());
  };

  exitNoneExpression = (ctx: NoneExpressionContext) => {
    this.colourPredicateFunction(ctx.NONE());
  };

  exitSingleExpression = (ctx: SingleExpressionContext) => {
    this.colourPredicateFunction(ctx.SINGLE());
  };

  exitReduceExpression = (ctx: ReduceExpressionContext) => {
    this.colourPredicateFunction(ctx.REDUCE());
  };

  exitSymbolicNameString = (ctx: SymbolicNameStringContext) => {
    this.addToken(ctx.start, CypherTokenType.symbolicName, ctx.getText());
  };

  stopNode: ParserRuleContext | undefined;
  private lastTokenIndex: number | undefined;

  visitTerminal(node: TerminalNode): void {
    const token = node.symbol;

    console.log(token);
    const tokenType = getCypherTokenType(token);

    this.addToken(token, tokenType, node.getText());
    if (token.stop > (this.lastTokenIndex ?? 0)) {
      this.stopNode = node.parentCtx;
      this.lastTokenIndex = token.stop;
    }
  }
}

class ParserWrapper {
  parsingResult?: EnrichedParsingResult;

  parse(query: string) {
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
      const highLighter = new SyntaxHighlighter();

      parser._parseListeners = [labelsCollector, variableFinder, highLighter];

      const result = createParsingResult(parsingScaffolding).result;

      const parsingResult: EnrichedParsingResult = {
        query: query,
        parser: parser,
        tokens: getTokens(tokenStream),
        diagnostics: errorListener.errors,
        result: result,
        stopNode: highLighter.stopNode,
        collectedLabelOrRelTypes: labelsCollector.labelOrRelTypes,
        collectedVariables: variableFinder.variables,
        highlights: highLighter.colouredTokens,
      };

      this.parsingResult = parsingResult;

      return parsingResult;
    }
  }

  clearCache() {
    this.parsingResult = undefined;
  }
}

export const parserWrapper = new ParserWrapper();

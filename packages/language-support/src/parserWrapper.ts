import type { ParserRuleContext, TerminalNode, Token } from 'antlr4';
import { CharStreams, CommonTokenStream, ParseTreeListener } from 'antlr4';

import CypherLexer from './generated-parser/CypherLexer';
// let ops: Record<string, number> = {};

import CypherParser, {
  AllExpressionContext,
  AnyExpressionContext,
  ArrowLineContext,
  ClauseContext,
  FunctionNameContext,
  KeywordLiteralContext,
  LabelNameContext,
  LabelNameIsContext,
  LabelOrRelTypeContext,
  LeftArrowContext,
  NoneExpressionContext,
  ParameterContext,
  ProcedureNameContext,
  ProcedureResultItemContext,
  PropertyKeyNameContext,
  ReduceExpressionContext,
  RightArrowContext,
  SingleExpressionContext,
  StatementsContext,
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
  shouldAssignTokenType2,
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
    // const now = performance.now();
    if (token.start >= 0) {
      // Vi kan skita I to parsed token??
      // https://trello.com/c/1pxj8Hce/96-investigate-if-we-can-stop-splitting-tokens-to-handle-multiline-tokens-in-vscode
      // Almost 100% of overhead is spent here. How many times is this called? check that it's a reasonable amount of times
      // Since we just end up with maybe 17 things?? also
      // see how we can make it faster
      // TODO
      const tokenPosition = getTokenPosition(token);

      // const now2 = performance.now();
      // 16 ms to do string transformation
      // ops.total = (ops.total ?? 0) + 1;
      const stringiyed = tokenPositionToString(tokenPosition);
      //if (this.colouredTokens.has(stringiyed)) {
      // ops.hit = (ops.hit ?? 0) + 1;
      //const combo = this.colouredTokens.get(stringiyed).tokenType + tokenType;
      // ops[combo] = (ops[combo] ?? 0) + 1;
      // vilken händer först ? token eller visit?
      // om visist är först kan vi kolla om den finnsi set et redan
      //}
      this.colouredTokens.set(stringiyed, {
        tokenType,
        position: tokenPosition,
        length: tokenStr.length,
        token: tokenStr,
        bracketInfo: undefined,
      });
      // ops.count = this.colouredTokens.size;
      // ops.mapInsert = (ops.mapInsert ?? 0) + performance.now() - now2;
    }
    // ops.addToken = (ops.addToken ?? 0) + performance.now() - now;
  }

  exitLabelName = (ctx: LabelNameContext) => {
    // const now = performance.now();

    this.addToken(ctx.start, CypherTokenType.label, ctx.getText());
    // ops.labelTime = (ops.labelTime ?? 0) + performance.now() - now;
  };

  exitLabelNameIs = (ctx: LabelNameIsContext) => {
    this.addToken(ctx.start, CypherTokenType.label, ctx.getText());
  };

  exitLabelOrRelType = (ctx: LabelOrRelTypeContext) => {
    // const now = performance.now();
    // Error recovery can insert a LabelOrRelType node with no text
    // See for example CREATE CONSTRAINT FOR (node)
    const labelName = ctx.symbolicNameString()?.start;
    if (labelName) {
      this.addToken(labelName, CypherTokenType.label, labelName.text);
    }
    // ops.exitlabelTime = (ops.exitlabelTime ?? 0) + performance.now() - now;
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

  // why duplicated?
  /*  exitStringToken = (ctx: StringTokenContext) => {
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
  */

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
    // const now = performance.now();
    const token = node.symbol;
    // minska antalet som kommer här
    // operator separator dubblett
    // symbolic name
    // klarar vi string utan att ha den som en rule övht

    // function shouldHighlightToken(node: TerminalNode) {}
    // I BORKED COMMENTS
    if (shouldAssignTokenType2(token)) {
      const tokenType = getCypherTokenType(token);

      this.addToken(token, tokenType, node.getText());
      if (token.stop > (this.lastTokenIndex ?? 0)) {
        this.stopNode = node.parentCtx;
        this.lastTokenIndex = token.stop;
      }
    }
    // ops.visitTerminal = (ops.visitTerminal ?? 0) + performance.now() - now;
    // here we find end node node.parentCtx
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
      // This works and seems lik it shoulldbbe f rb
      const highLighter = new SyntaxHighlighter();
      // this line makes steady 100ms into 170ms (70 ms increase)
      // parser._parseListeners = [];

      parser._parseListeners = [
        //  tom list // 1.15
        labelsCollector, // 1.2977125807738266
        variableFinder, // 1.2723442410929504
        highLighter, // 1.83
      ];

      // adding our actual listeners increases it to ~210ms (40 ms increase)
      // parser._parseListeners = [labelsCollector, variableFinder, highLighter];

      // ops = {};
      const result = createParsingResult(parsingScaffolding).result;

      const parsingResult: EnrichedParsingResult = {
        query: query,
        parser: parser,
        tokens: getTokens(tokenStream),
        diagnostics: errorListener.errors,
        result: result,
        // stop node adds about 30ms to the parsing time -> 30% increase from plain parse
        // find more efficient way to do it
        // or see if we can find a way to not do it at all
        // we could probably do it as part of a parser listener
        stopNode: highLighter.stopNode,
        //stopNode: findStopNode(result),
        // stopNode: null,
        collectedLabelOrRelTypes: labelsCollector.labelOrRelTypes,
        collectedVariables: variableFinder.variables,
        highlights: highLighter.colouredTokens,
      };

      this.parsingResult = parsingResult;

      // console.log(ops);
      return parsingResult;
    }
  }

  clearCache() {
    this.parsingResult = undefined;
  }
}

export const parserWrapper = new ParserWrapper();

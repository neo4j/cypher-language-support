import { ParseTreeWalker, TerminalNode, Token } from 'antlr4';

import {
  AllExpressionContext,
  AnyExpressionContext,
  ArrowLineContext,
  BooleanLiteralContext,
  ConsoleCommandContext,
  FunctionNameContext,
  KeywordLiteralContext,
  LabelNameContext,
  LabelNameIsContext,
  LabelOrRelTypeContext,
  LeftArrowContext,
  NoneExpressionContext,
  NumberLiteralContext,
  ParameterContext,
  ParamsArgsContext,
  ProcedureNameContext,
  ProcedureResultItemContext,
  PropertyKeyNameContext,
  ReduceExpressionContext,
  RightArrowContext,
  SingleExpressionContext,
  StringsLiteralContext,
  StringTokenContext,
  SymbolicNameStringContext,
  UseCompletionRuleContext,
  VariableContext,
} from '../../generated-parser/CypherCmdParser';

import {
  SemanticTokensLegend,
  SemanticTokenTypes,
} from 'vscode-languageserver-types';
import CypherParserListener from '../../generated-parser/CypherCmdParserListener';
import { CypherTokenType } from '../../lexerSymbols';
import { parserWrapper } from '../../parserWrapper';
import {
  BracketType,
  getCypherTokenType,
  getTokenPosition,
  ParsedCypherToken,
  removeOverlappingTokens,
  shouldAssignTokenType,
  sortTokens,
  tokenPositionToString,
  toParsedTokens,
} from './syntaxColouringHelpers';

export const syntaxColouringLegend: SemanticTokensLegend = {
  tokenModifiers: [],
  tokenTypes: Object.keys(SemanticTokenTypes),
};

const semanticTokenTypesNumber: Map<string, number> = new Map(
  syntaxColouringLegend.tokenTypes.map((tokenType, i) => [tokenType, i]),
);

export function mapCypherToSemanticTokenIndex(
  cypherTokenType: CypherTokenType,
): number | undefined {
  const tokenMappings: { [key in CypherTokenType]?: SemanticTokenTypes } = {
    [CypherTokenType.comment]: SemanticTokenTypes.comment,
    [CypherTokenType.predicateFunction]: SemanticTokenTypes.function,
    [CypherTokenType.keyword]: SemanticTokenTypes.keyword,
    [CypherTokenType.keywordLiteral]: SemanticTokenTypes.string,
    [CypherTokenType.stringLiteral]: SemanticTokenTypes.string,
    [CypherTokenType.numberLiteral]: SemanticTokenTypes.number,
    [CypherTokenType.booleanLiteral]: SemanticTokenTypes.number,
    [CypherTokenType.operator]: SemanticTokenTypes.operator,
    [CypherTokenType.separator]: SemanticTokenTypes.operator,
    [CypherTokenType.punctuation]: SemanticTokenTypes.operator,
    [CypherTokenType.paramDollar]: SemanticTokenTypes.namespace,
    [CypherTokenType.paramValue]: SemanticTokenTypes.parameter,
    [CypherTokenType.property]: SemanticTokenTypes.property,
    [CypherTokenType.label]: SemanticTokenTypes.type,
    [CypherTokenType.variable]: SemanticTokenTypes.variable,
    [CypherTokenType.symbolicName]: SemanticTokenTypes.variable,
    [CypherTokenType.consoleCommand]: SemanticTokenTypes.macro,
  };

  const semanticTokenType = tokenMappings[cypherTokenType];

  if (semanticTokenType) {
    return semanticTokenTypesNumber.get(semanticTokenType);
  }

  return undefined;
}

class SyntaxHighlighter extends CypherParserListener {
  colouredTokens: Map<string, ParsedCypherToken> = new Map();

  constructor(colouredTokens: Map<string, ParsedCypherToken>) {
    super();
    this.colouredTokens = colouredTokens;
  }

  private addToken(token: Token, tokenType: CypherTokenType, tokenStr: string) {
    if (token.start >= 0) {
      const tokenPosition = getTokenPosition(token);

      toParsedTokens(tokenPosition, tokenType, tokenStr, token).forEach(
        (token) => {
          const tokenPos = tokenPositionToString(token.position);
          this.colouredTokens.set(tokenPos, token);
        },
      );
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

  // Fix coloring of colon in console commands (operator -> consoleCommand)
  exitConsoleCommand = (ctx: ConsoleCommandContext) => {
    const colon = ctx.COLON();
    this.addToken(
      colon.symbol,
      CypherTokenType.consoleCommand,
      colon.getText(),
    );
  };

  // console commands that clash with cypher keywords
  exitUseCompletionRule = (ctx: UseCompletionRuleContext) => {
    const use = ctx.USE();

    this.addToken(use.symbol, CypherTokenType.consoleCommand, use.getText());
  };

  exitParamsArgs = (ctx: ParamsArgsContext) => {
    const clear = ctx.CLEAR();
    if (clear) {
      this.addToken(
        clear.symbol,
        CypherTokenType.consoleCommand,
        clear.getText(),
      );
    }

    const list = ctx.listCompletionRule()?.LIST();
    if (list) {
      this.addToken(
        list.symbol,
        CypherTokenType.consoleCommand,
        list.getText(),
      );
    }
  };
}

function colourLexerTokens(tokens: Token[]) {
  const result = new Map<string, ParsedCypherToken>();
  const bracketsLevel = new Map<BracketType, number>([
    [BracketType.curly, -1],
    [BracketType.bracket, -1],
    [BracketType.parenthesis, -1],
  ]);

  tokens.forEach((token) => {
    if (shouldAssignTokenType(token)) {
      const tokenType = getCypherTokenType(token);
      const tokenPosition = getTokenPosition(token);
      const tokenStr = token.text ?? '';

      toParsedTokens(
        tokenPosition,
        tokenType,
        tokenStr,
        token,
        bracketsLevel,
      ).forEach((token) => {
        const tokenPos = tokenPositionToString(token.position);

        result.set(tokenPos, token);
      });
    }
  });

  return result;
}

export function applySyntaxColouring(
  wholeFileText: string,
): ParsedCypherToken[] {
  const parsingResult = parserWrapper.parse(wholeFileText);
  const tokens = parsingResult.tokens;

  // Get a first pass at the colouring using only the lexer
  const lexerTokens: Map<string, ParsedCypherToken> = colourLexerTokens(tokens);

  const treeSyntaxHighlighter = new SyntaxHighlighter(lexerTokens);

  /* Get a second pass at the colouring correcting the colours
     using structural information from the parsing tree
  
     This allows to correclty colour things that are
     recognized as keywords by the lexer in positions
     where they are not keywords (e.g. MATCH (MATCH: MATCH))
  */
  ParseTreeWalker.DEFAULT.walk(treeSyntaxHighlighter, parsingResult.result);

  const allColouredTokens = treeSyntaxHighlighter.colouredTokens;

  // When we push to the builder, tokens need to be sorted in ascending
  // starting position i.e. as we find them when we read them from left
  // to right, and from top to bottom in the file
  //
  // After that we should remove overlapping tokens. We need this because
  // certain tokens are double coloured by the lexer and the parsing tree, but
  // their positions in the map of Position -> ParsedToken are different
  //
  // Example: -1 would be split as [-, UNSIGNED_DECIMAL_INTEGER] by the lexer
  // (2 tokens), but as a unique numeric literal by the parsing tree
  const result = removeOverlappingTokens(
    sortTokens(Array.from(allColouredTokens.values())),
  );

  return result;
}

import {
  CharStreams,
  CommonTokenStream,
  ParseTreeWalker,
  TerminalNode,
  Token,
} from 'antlr4';

import CypherLexer from '../generated-parser/CypherLexer';

import CypherParser, {
  AllExpressionContext,
  AnyExpressionContext,
  BooleanLiteralContext,
  FunctionNameContext,
  KeywordLiteralContext,
  LabelNameContext,
  LabelNameIsContext,
  LabelOrRelTypeContext,
  NoneExpressionContext,
  NumberLiteralContext,
  ParameterContext,
  ProcedureNameContext,
  ProcedureResultItemContext,
  PropertyKeyNameContext,
  ReduceExpressionContext,
  SingleExpressionContext,
  StringsLiteralContext,
  StringTokenContext,
  SymbolicNameStringContext,
  VariableContext,
} from '../generated-parser/CypherParser';

import {
  SemanticTokensLegend,
  SemanticTokenTypes,
} from 'vscode-languageserver-types';
import CypherParserListener from '../generated-parser/CypherParserListener';
import { getTokens } from '../helpers';
import { CypherTokenType } from '../lexerSymbols';
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
    [CypherTokenType.paramDollar]: SemanticTokenTypes.namespace,
    [CypherTokenType.paramValue]: SemanticTokenTypes.parameter,
    [CypherTokenType.property]: SemanticTokenTypes.property,
    [CypherTokenType.label]: SemanticTokenTypes.type,
    [CypherTokenType.variable]: SemanticTokenTypes.variable,
    [CypherTokenType.symbolicName]: SemanticTokenTypes.variable,
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
    const labelName = ctx.symbolicNameString().start;

    this.addToken(labelName, CypherTokenType.label, labelName.text);
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
}

function colourLexerTokens(tokenStream: CommonTokenStream) {
  const result = new Map<string, ParsedCypherToken>();
  const bracketsLevel = new Map<BracketType, number>([
    [BracketType.curly, -1],
    [BracketType.bracket, -1],
    [BracketType.parenthesis, -1],
  ]);

  getTokens(tokenStream).forEach((token) => {
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
  const inputStream = CharStreams.fromString(wholeFileText);
  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  tokenStream.fill();

  // Get a first pass at the colouring using only the lexer
  const lexerTokens: Map<string, ParsedCypherToken> =
    colourLexerTokens(tokenStream);

  const parser = new CypherParser(tokenStream);
  parser.removeErrorListeners();
  const treeSyntaxHighlighter = new SyntaxHighlighter(lexerTokens);

  /* Get a second pass at the colouring correcting the colours
     using structural information from the parsing tree
  
     This allows to correclty colour things that are
     recognized as keywords by the lexer in positions
     where they are not keywords (e.g. MATCH (MATCH: MATCH))
  */
  ParseTreeWalker.DEFAULT.walk(treeSyntaxHighlighter, parser.statements());

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

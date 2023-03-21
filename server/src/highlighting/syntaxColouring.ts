import {
  SemanticTokensBuilder,
  SemanticTokensLegend,
  SemanticTokensParams,
  SemanticTokenTypes,
  TextDocuments,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';

import { CharStreams, CommonTokenStream, Token } from 'antlr4ts';

import { ParseTreeListener } from 'antlr4ts/tree/ParseTreeListener';

import { CypherLexer } from '../antlr/CypherLexer';

import {
  AllExpressionContext,
  AnyExpressionContext,
  BooleanLiteralContext,
  CypherParser,
  FunctionNameContext,
  KeywordLiteralContext,
  LabelNameContext,
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
} from '../antlr/CypherParser';

import { TerminalNode } from 'antlr4ts/tree/TerminalNode';
import { CypherParserListener } from '../antlr/CypherParserListener';
import { CypherTokenType as CypherTokenTypes } from '../lexerSymbols';
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

export class Legend implements SemanticTokensLegend {
  tokenTypes: string[] = [];
  tokenModifiers: string[] = [];

  constructor() {
    this.tokenTypes = Object.keys(SemanticTokenTypes);
  }
}

export const legend = new Legend();
const semanticTokenTypesNumber: Map<string, number> = new Map(
  legend.tokenTypes.map((tokenType, i) => [tokenType, i]),
);

function mapCypherToSemanticTokenIndex(
  cypherTokenType: CypherTokenTypes,
): number {
  let semanticTokenType: SemanticTokenTypes | undefined = undefined;
  let result = -1;

  switch (cypherTokenType) {
    case CypherTokenTypes.comment:
      semanticTokenType = SemanticTokenTypes.comment;
      break;
    case CypherTokenTypes.procedure:
    case CypherTokenTypes.function:
    case CypherTokenTypes.predicateFunction:
      semanticTokenType = SemanticTokenTypes.function;
      break;
    case CypherTokenTypes.keyword:
      semanticTokenType = SemanticTokenTypes.keyword;
      break;
    case CypherTokenTypes.keywordLiteral:
    case CypherTokenTypes.stringLiteral:
      semanticTokenType = SemanticTokenTypes.string;
      break;
    case CypherTokenTypes.numberLiteral:
    case CypherTokenTypes.booleanLiteral:
      semanticTokenType = SemanticTokenTypes.number;
      break;
    case CypherTokenTypes.operator:
      semanticTokenType = SemanticTokenTypes.operator;
      break;
    case CypherTokenTypes.paramDollar:
      semanticTokenType = SemanticTokenTypes.namespace;
      break;
    case CypherTokenTypes.paramValue:
      semanticTokenType = SemanticTokenTypes.parameter;
      break;
    case CypherTokenTypes.property:
      semanticTokenType = SemanticTokenTypes.property;
      break;
    case CypherTokenTypes.label:
      semanticTokenType = SemanticTokenTypes.type;
      break;
    case CypherTokenTypes.variable:
      semanticTokenType = SemanticTokenTypes.variable;
      break;
    case CypherTokenTypes.symbolicName:
      semanticTokenType = SemanticTokenTypes.variable;
      break;
    default:
      break;
  }

  if (semanticTokenType) {
    result = semanticTokenTypesNumber.get(semanticTokenType) ?? result;
  }

  return result;
}

class SyntaxHighlighter implements CypherParserListener {
  colouredTokens: Map<string, ParsedCypherToken> = new Map();

  constructor(colouredTokens: Map<string, ParsedCypherToken>) {
    this.colouredTokens = colouredTokens;
  }

  private addToken(
    token: Token,
    tokenType: CypherTokenTypes,
    tokenStr: string,
  ) {
    if (token.startIndex >= 0) {
      const tokenPosition = getTokenPosition(token);

      toParsedTokens(tokenPosition, tokenType, tokenStr, token).forEach(
        (token) => {
          const tokenPos = tokenPositionToString(token.position);
          this.colouredTokens.set(tokenPos, token);
        },
      );
    }
  }

  exitLabelName(ctx: LabelNameContext) {
    this.addToken(ctx.start, CypherTokenTypes.label, ctx.text);
  }

  exitFunctionName(ctx: FunctionNameContext) {
    this.colourMethodName(ctx, CypherTokenTypes.function);
  }

  exitProcedureName(ctx: ProcedureNameContext) {
    this.colourMethodName(ctx, CypherTokenTypes.procedure);
  }

  private colourMethodName(
    ctx: FunctionNameContext | ProcedureNameContext,
    tokenType: CypherTokenTypes.function | CypherTokenTypes.procedure,
  ) {
    const namespace = ctx.namespace();

    namespace.symbolicNameString().forEach((namespaceName) => {
      this.addToken(namespaceName.start, tokenType, namespaceName.text);
    });

    const nameOfMethod = ctx.symbolicNameString();
    this.addToken(nameOfMethod.start, tokenType, nameOfMethod.text);
  }

  private colourPredicateFunction(ctx: TerminalNode) {
    this.addToken(ctx.symbol, CypherTokenTypes.predicateFunction, ctx.text);
  }

  exitVariable(ctx: VariableContext) {
    this.addToken(ctx.start, CypherTokenTypes.variable, ctx.text);
  }

  exitProcedureResultItem(ctx: ProcedureResultItemContext) {
    this.addToken(ctx.start, CypherTokenTypes.variable, ctx.text);
  }

  exitPropertyKeyName(ctx: PropertyKeyNameContext) {
    // FIXME Is this correct in this case for all cases, not just simple properties?
    this.addToken(ctx.start, CypherTokenTypes.property, ctx.text);
  }

  exitStringToken(ctx: StringTokenContext) {
    this.addToken(ctx.start, CypherTokenTypes.stringLiteral, ctx.text);
  }

  exitStringsLiteral(ctx: StringsLiteralContext) {
    this.addToken(ctx.start, CypherTokenTypes.stringLiteral, ctx.text);
  }

  exitBooleanLiteral(ctx: BooleanLiteralContext) {
    // Normally booleans are coloured as numbers in other languages
    this.addToken(ctx.start, CypherTokenTypes.booleanLiteral, ctx.text);
  }

  exitNumberLiteral(ctx: NumberLiteralContext) {
    this.addToken(ctx.start, CypherTokenTypes.numberLiteral, ctx.text);
  }

  exitKeywordLiteral(ctx: KeywordLiteralContext) {
    this.addToken(ctx.start, CypherTokenTypes.keywordLiteral, ctx.text);
  }

  exitParameter(ctx: ParameterContext) {
    const dollar = ctx.DOLLAR();
    const parameterName = ctx.parameterName();
    this.addToken(dollar.symbol, CypherTokenTypes.paramDollar, dollar.text);
    this.addToken(
      parameterName.start,
      CypherTokenTypes.paramValue,
      parameterName.text,
    );
  }

  exitAllExpression(ctx: AllExpressionContext) {
    this.colourPredicateFunction(ctx.ALL());
  }

  exitAnyExpression(ctx: AnyExpressionContext) {
    this.colourPredicateFunction(ctx.ANY());
  }

  exitNoneExpression(ctx: NoneExpressionContext) {
    this.colourPredicateFunction(ctx.NONE());
  }

  exitSingleExpression(ctx: SingleExpressionContext) {
    this.colourPredicateFunction(ctx.SINGLE());
  }

  exitReduceExpression(ctx: ReduceExpressionContext) {
    this.colourPredicateFunction(ctx.REDUCE());
  }

  exitSymbolicNameString(ctx: SymbolicNameStringContext) {
    this.addToken(ctx.start, CypherTokenTypes.symbolicName, ctx.text);
  }
}

function colourLexerTokens(tokenStream: CommonTokenStream) {
  const result = new Map<string, ParsedCypherToken>();
  const bracketsLevel = new Map<BracketType, number>([
    [BracketType.curly, -1],
    [BracketType.bracket, -1],
    [BracketType.parenthesis, -1],
  ]);

  tokenStream.getTokens().forEach((token) => {
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

export function doSyntaxColouringText(
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
  const treeSyntaxHighlighter = new SyntaxHighlighter(lexerTokens);
  parser.addParseListener(treeSyntaxHighlighter as ParseTreeListener);
  /* Get a second pass at the colouring correcting the colours
     using structural information from the parsing tree
  
     This allows to correclty colour things that are
     recognized as keywords by the lexer in positions
     where they are not keywords (e.g. MATCH (MATCH: MATCH))
  */
  parser.statements();

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

export function doSyntaxColouring(documents: TextDocuments<TextDocument>) {
  return (params: SemanticTokensParams) => {
    const textDocument = documents.get(params.textDocument.uri);
    if (textDocument === undefined) return { data: [] };

    const tokens = doSyntaxColouringText(textDocument.getText());

    const builder = new SemanticTokensBuilder();
    tokens.forEach((token) => {
      builder.push(
        token.position.line,
        token.position.startCharacter,
        token.length,
        mapCypherToSemanticTokenIndex(token.tokenType),
        0,
      );
    });
    const results = builder.build();
    return results;
  };
}

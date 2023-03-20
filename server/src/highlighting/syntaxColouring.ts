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
import {
  CypherTokenType as CypherTokenTypes,
  lexerSymbols,
} from '../lexerSymbols';

export class Legend implements SemanticTokensLegend {
  tokenTypes: string[] = [];
  tokenModifiers: string[] = [];

  constructor() {
    this.tokenTypes = Object.keys(SemanticTokenTypes);
  }
}

interface TokenPosition {
  line: number;
  startCharacter: number;
}

function toString(tokenPosition: TokenPosition): string {
  return `${tokenPosition.line},${tokenPosition.startCharacter}`;
}

export interface ParsedCypherToken {
  position: TokenPosition;
  length: number;
  tokenType: CypherTokenTypes;
  token: string;
  bracketInfo?: BracketInfo;
}

export interface BracketInfo {
  bracketType: BracketType;
  bracketLevel: number;
}

export enum BracketType {
  bracket,
  parenthesis,
  curly,
}

export interface ColouredToken {
  position: TokenPosition;
  length: number;
  tokenColour: SemanticTokenTypes;
  token: string;
}

function getTokenPosition(token: Token): TokenPosition {
  return {
    line: token.line - 1,
    startCharacter: token.charPositionInLine,
  };
}

function getBracketType(token: Token): BracketType | undefined {
  switch (token.type) {
    case CypherLexer.LPAREN:
    case CypherLexer.RPAREN:
      return BracketType.parenthesis;
    case CypherLexer.LBRACKET:
    case CypherLexer.RBRACKET:
      return BracketType.bracket;
    case CypherLexer.LCURLY:
    case CypherLexer.RCURLY:
      return BracketType.curly;
    default:
      return undefined;
  }
}

function isClosingBracket(token: Token): boolean {
  return (
    token.type === CypherLexer.RPAREN ||
    token.type === CypherLexer.RBRACKET ||
    token.type === CypherLexer.RCURLY
  );
}

function isOpeningBracket(token: Token): boolean {
  return (
    token.type === CypherLexer.LPAREN ||
    token.type === CypherLexer.LBRACKET ||
    token.type === CypherLexer.LCURLY
  );
}

function toParsedTokens(
  tokenPosition: TokenPosition,
  tokenType: CypherTokenTypes,
  tokenStr: string,
  token: Token,
  bracketsLevel?: Map<BracketType, number>,
): ParsedCypherToken[] {
  return tokenStr
    .split('\n')
    .filter((tokenChunk) => tokenChunk.length > 0)
    .map((tokenChunk, i) => {
      const position =
        i == 0
          ? tokenPosition
          : { line: tokenPosition.line + i, startCharacter: 0 };

      let bracketInfo: BracketInfo | undefined = undefined;

      if (bracketsLevel) {
        const bracketType = getBracketType(token);
        if (bracketType !== undefined) {
          let bracketLevel = bracketsLevel.get(bracketType) ?? 0;

          if (isOpeningBracket(token)) {
            bracketsLevel.set(bracketType, ++bracketLevel);
          }

          bracketInfo = {
            bracketLevel: bracketLevel,
            bracketType: bracketType,
          };

          if (isClosingBracket(token)) {
            bracketsLevel.set(bracketType, --bracketLevel);
          }
        }
      }

      return {
        position: position,
        length: tokenChunk.length,
        tokenType: tokenType,
        token: tokenChunk,
        bracketInfo: bracketInfo,
      };
    });
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
          const tokenPos = toString(token.position);
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

function getCypherTokenType(token: Token): CypherTokenTypes {
  const tokenNumber = token.type;

  if (
    tokenNumber === CypherLexer.SINGLE_LINE_COMMENT ||
    tokenNumber === CypherLexer.MULTI_LINE_COMMENT
  ) {
    return CypherTokenTypes.comment;
  } else {
    // Defautl token type is none
    return lexerSymbols.get(tokenNumber) ?? CypherTokenTypes.none;
  }
}

function assignTokenType(token: Token): boolean {
  const nonEOF = token.type !== Token.EOF;
  const inMainChannel = token.channel !== Token.HIDDEN_CHANNEL;
  const isComment =
    token.type === CypherLexer.SINGLE_LINE_COMMENT ||
    token.type === CypherLexer.MULTI_LINE_COMMENT;

  return nonEOF && (inMainChannel || isComment);
}

function colourLexerTokens(tokenStream: CommonTokenStream) {
  const result = new Map<string, ParsedCypherToken>();
  const bracketsLevel = new Map<BracketType, number>([
    [BracketType.curly, -1],
    [BracketType.bracket, -1],
    [BracketType.parenthesis, -1],
  ]);

  tokenStream.getTokens().forEach((token) => {
    if (assignTokenType(token)) {
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
        const tokenPos = toString(token.position);

        result.set(tokenPos, token);
      });
    }
  });

  return result;
}

function sortTokens(tokens: ParsedCypherToken[]) {
  return tokens.sort((a, b) => {
    const lineDiff = a.position.line - b.position.line;
    if (lineDiff !== 0) return lineDiff;

    return a.position.startCharacter - b.position.startCharacter;
  });
}

// Assumes the tokens are already sorted
function removeOverlappingTokens(tokens: ParsedCypherToken[]) {
  const result: ParsedCypherToken[] = [];
  let prev: TokenPosition = { line: -1, startCharacter: -1 };
  let prevEndCharacter = 0;

  tokens.forEach((token) => {
    const current = token.position;
    if (current.line > prev.line || current.startCharacter > prevEndCharacter) {
      // Add current token to the list and in further iterations
      // remove tokens overlapping with it
      result.push(token);
      prev = current;
      prevEndCharacter = prev.startCharacter + (token.token?.length ?? 0) - 1;
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

  // When we push to the builder, tokens need to be sorted in ascending starting position
  // i.e. as we find them when we read them from left to right, and from top to bottom in the file
  //
  // After that we should remove overlapping tokens
  const result = removeOverlappingTokens(
    sortTokens(Array.from(allColouredTokens.values())),
  );

  return result;
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

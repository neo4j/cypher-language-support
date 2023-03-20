import {
  SemanticTokensBuilder,
  SemanticTokensLegend,
  SemanticTokensParams,
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
  SymbolicNameOrStringParameterContext,
  SymbolicNameStringContext,
  VariableContext,
} from '../antlr/CypherParser';

import { CypherParserListener } from '../antlr/CypherParserListener';
import { lexerSymbols, TokenType } from '../lexerSymbols';

export class Legend implements SemanticTokensLegend {
  tokenTypes: string[] = [];
  tokenModifiers: string[] = [];

  constructor() {
    this.tokenTypes = [
      TokenType[TokenType.comment],
      TokenType[TokenType.keyword],
      TokenType[TokenType.type],
      TokenType[TokenType.function],
      TokenType[TokenType.variable],
      TokenType[TokenType.parameter],
      TokenType[TokenType.operator],
      TokenType[TokenType.literal],
      TokenType[TokenType.number],
      TokenType[TokenType.property],
      TokenType[TokenType.namespace],
    ];
  }
}

interface TokenPosition {
  line: number;
  startCharacter: number;
}

function toString(tokenPosition: TokenPosition): string {
  return `${tokenPosition.line},${tokenPosition.startCharacter}`;
}

export interface ParsedToken {
  position: TokenPosition;
  length: number;
  tokenType: TokenType;
  token: string | undefined;
}

function getTokenPosition(token: Token): TokenPosition {
  return {
    line: token.line - 1,
    startCharacter: token.charPositionInLine,
  };
}

function toParsedTokens(
  tokenPosition: TokenPosition,
  tokenType: TokenType,
  tokenStr: string,
): ParsedToken[] {
  return tokenStr
    .split('\n')
    .filter((tokenChunk) => tokenChunk.length > 0)
    .map((tokenChunk, i) => {
      const position =
        i == 0
          ? tokenPosition
          : { line: tokenPosition.line + i, startCharacter: 0 };

      return {
        position: position,
        length: tokenChunk.length,
        tokenType: tokenType,
        token: tokenChunk,
      };
    });
}
class SyntaxHighlighter implements CypherParserListener {
  colouredTokens: Map<string, ParsedToken> = new Map();

  constructor(colouredTokens: Map<string, ParsedToken>) {
    this.colouredTokens = colouredTokens;
  }

  private addToken(token: Token, tokenType: TokenType, tokenStr: string) {
    if (token.startIndex >= 0) {
      const tokenPosition = getTokenPosition(token);

      toParsedTokens(tokenPosition, tokenType, tokenStr).forEach((token) => {
        const tokenPos = toString(token.position);
        this.colouredTokens.set(tokenPos, token);
      });
    }
  }

  exitLabelName(ctx: LabelNameContext) {
    this.addToken(ctx.start, TokenType.type, ctx.text);
  }

  exitFunctionName(ctx: FunctionNameContext) {
    this.colourMethodName(ctx);
  }

  exitProcedureName(ctx: ProcedureNameContext) {
    this.colourMethodName(ctx);
  }

  private colourMethodName(ctx: FunctionNameContext | ProcedureNameContext) {
    const namespace = ctx.namespace();

    namespace.symbolicNameString().forEach((namespaceName) => {
      this.addToken(
        namespaceName.start,
        TokenType.function,
        namespaceName.text,
      );
    });

    const nameOfMethod = ctx.symbolicNameString();
    this.addToken(nameOfMethod.start, TokenType.function, nameOfMethod.text);
  }

  exitVariable(ctx: VariableContext) {
    this.addToken(ctx.start, TokenType.variable, ctx.text);
  }

  exitProcedureResultItem(ctx: ProcedureResultItemContext) {
    this.addToken(ctx.start, TokenType.variable, ctx.text);
  }

  exitPropertyKeyName(ctx: PropertyKeyNameContext) {
    // FIXME Is this correct in this case for all cases, not just simple properties?
    this.addToken(ctx.start, TokenType.property, ctx.text);
  }

  exitSymbolicNameOrStringParameter(ctx: SymbolicNameOrStringParameterContext) {
    this.addToken(ctx.start, TokenType.parameter, ctx.text);
  }

  exitStringToken(ctx: StringTokenContext) {
    this.addToken(ctx.start, TokenType.literal, ctx.text);
  }

  exitStringsLiteral(ctx: StringsLiteralContext) {
    this.addToken(ctx.start, TokenType.literal, ctx.text);
  }

  exitBooleanLiteral(ctx: BooleanLiteralContext) {
    // Normally booleans are coloured as numbers in other languages
    this.addToken(ctx.start, TokenType.number, ctx.text);
  }

  exitNumberLiteral(ctx: NumberLiteralContext) {
    this.addToken(ctx.start, TokenType.number, ctx.text);
  }

  exitKeywordLiteral(ctx: KeywordLiteralContext) {
    this.addToken(ctx.start, TokenType.literal, ctx.text);
  }
  exitParameter(ctx: ParameterContext) {
    const dollar = ctx.DOLLAR();
    const parameterName = ctx.parameterName();
    this.addToken(dollar.symbol, TokenType.namespace, dollar.text);
    this.addToken(parameterName.start, TokenType.parameter, parameterName.text);
  }

  exitAllExpression(ctx: AllExpressionContext) {
    const all = ctx.ALL();
    this.addToken(all.symbol, TokenType.function, all.text);
  }

  exitAnyExpression(ctx: AnyExpressionContext) {
    const any = ctx.ANY();
    this.addToken(any.symbol, TokenType.function, any.text);
  }

  exitNoneExpression(ctx: NoneExpressionContext) {
    const none = ctx.NONE();
    this.addToken(none.symbol, TokenType.function, none.text);
  }

  exitSingleExpression(ctx: SingleExpressionContext) {
    const single = ctx.SINGLE();
    this.addToken(single.symbol, TokenType.function, single.text);
  }

  exitReduceExpression(ctx: ReduceExpressionContext) {
    const reduce = ctx.REDUCE();
    this.addToken(reduce.symbol, TokenType.function, reduce.text);
  }

  exitSymbolicNameString(ctx: SymbolicNameStringContext) {
    this.addToken(ctx.start, TokenType.variable, ctx.text);
  }
}

function getCypherTokenType(token: Token): TokenType {
  const tokenNumber = token.type;

  if (
    tokenNumber === CypherLexer.SINGLE_LINE_COMMENT ||
    tokenNumber === CypherLexer.MULTI_LINE_COMMENT
  ) {
    return TokenType.comment;
  } else {
    // Defautl token type is none
    return lexerSymbols.get(tokenNumber) ?? TokenType.none;
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
  const result = new Map<string, ParsedToken>();

  tokenStream.getTokens().forEach((token) => {
    if (assignTokenType(token)) {
      const tokenType = getCypherTokenType(token);
      const tokenPosition = getTokenPosition(token);
      const tokenStr = token.text ?? '';

      toParsedTokens(tokenPosition, tokenType, tokenStr).forEach((token) => {
        const tokenPos = toString(token.position);

        result.set(tokenPos, token);
      });
    }
  });

  return result;
}

function sortTokens(tokens: ParsedToken[]) {
  return tokens.sort((a, b) => {
    const lineDiff = a.position.line - b.position.line;
    if (lineDiff !== 0) return lineDiff;

    return a.position.startCharacter - b.position.startCharacter;
  });
}

// Assumes the tokens are already sorted
function removeOverlappingTokens(tokens: ParsedToken[]) {
  const result: ParsedToken[] = [];
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

export function doSyntaxColouringText(wholeFileText: string): ParsedToken[] {
  const inputStream = CharStreams.fromString(wholeFileText);
  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  tokenStream.fill();

  // Get a first pass at the colouring using only the lexer
  const lexerTokens: Map<string, ParsedToken> = colourLexerTokens(tokenStream);

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

export function doSyntaxColouring(documents: TextDocuments<TextDocument>) {
  return (params: SemanticTokensParams) => {
    const textDocument = documents.get(params.textDocument.uri);
    if (textDocument === undefined) return { data: [] };

    const tokens = doSyntaxColouringText(textDocument.getText());

    const builder = new SemanticTokensBuilder();
    tokens.forEach((token) => {
      if (token.tokenType !== TokenType.none) {
        builder.push(
          token.position.line,
          token.position.startCharacter,
          token.length,
          token.tokenType.valueOf(),
          0,
        );
      }
    });
    const results = builder.build();
    return results;
  };
}

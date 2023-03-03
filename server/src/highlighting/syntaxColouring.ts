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
  CypherParser,
  FunctionNameContext,
  LabelNameContext,
  LiteralContext,
  ProcedureNameContext,
  ProcedureResultItemContext,
  PropertyKeyNameContext,
  StringTokenContext,
  SymbolicNameOrStringParameterContext,
  VariableContext,
} from '../antlr/CypherParser';

import { CypherParserListener } from '../antlr/CypherParserListener';
import { colouringTable, TokenType } from './colouringTable';

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
      TokenType[TokenType.property],
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
  return tokenStr.split('\n').map((tokenChunk, i) => {
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

  exitScalarLiteral(ctx: LiteralContext) {
    this.addToken(ctx.start, TokenType.literal, ctx.text);
  }
}

function colourLexerTokens(tokenStream: CommonTokenStream) {
  const result = new Map<string, ParsedToken>();

  tokenStream.getTokens().forEach((token) => {
    if (token.channel !== Token.HIDDEN_CHANNEL && token.type !== Token.EOF) {
      const tokenNumber = token.type;
      // Colours everything, setting a defautl token type of none
      const tokenType = colouringTable.get(tokenNumber) ?? TokenType.none;
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
  const result = sortTokens(Array.from(allColouredTokens.values()));

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

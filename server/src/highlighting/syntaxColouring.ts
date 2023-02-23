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
  LabelExpression1Context,
  LiteralContext,
  ProcedureNameContext,
  PropertyKeyNameContext,
  VariableContext,
} from '../antlr/CypherParser';

import { CypherParserListener } from '../antlr/CypherParserListener';
import { colouringTable, TokenType } from './colouringTable';

// ************************************************************
// Part of the code that does the highlighting
// ************************************************************
export class Legend implements SemanticTokensLegend {
  tokenTypes: string[] = [];
  tokenModifiers: string[] = [];

  constructor() {
    this.tokenTypes = [
      TokenType[TokenType.comment],
      TokenType[TokenType.keyword],
      TokenType[TokenType.labelType],
      TokenType[TokenType.function],
      TokenType[TokenType.variable],
      TokenType[TokenType.parameter],
      TokenType[TokenType.property],
      TokenType[TokenType.literal],
      TokenType[TokenType.operator],
      TokenType[TokenType.decorator],
    ];
  }
}

enum TokenAnnotation {
  Lexer,
  TreeTraversal,
}

export interface ParsedToken {
  line: number;
  startCharacter: number;
  length: number;
  tokenType: TokenType;
  token: string | undefined;
  tokenAnnotation: TokenAnnotation;
}

function toParsedToken(
  token: Token,
  tokenType: TokenType,
  tokenAnnotation: TokenAnnotation,
  tokenStr: string = token.text ?? '',
): ParsedToken {
  return {
    line: token.line - 1,
    startCharacter: token.charPositionInLine,
    length: tokenStr.length,
    tokenType: tokenType,
    token: tokenStr,
    tokenAnnotation,
  };
}
class SyntaxHighlighter implements CypherParserListener {
  allTokens: ParsedToken[] = [];

  private addToken(token: Token, tokenType: TokenType, tokenStr: string) {
    if (token.startIndex >= 0) {
      this.allTokens.push(
        toParsedToken(
          token,
          tokenType,
          TokenAnnotation.TreeTraversal,
          tokenStr,
        ),
      );
    }
  }

  exitLabelExpression1(ctx: LabelExpression1Context) {
    this.addToken(ctx.start, TokenType.labelType, ctx.text);
  }

  exitProcedureName(ctx: ProcedureNameContext) {
    this.addToken(ctx.start, TokenType.function, ctx.text);
  }

  exitVariable(ctx: VariableContext) {
    this.addToken(ctx.start, TokenType.variable, ctx.text);
  }

  exitPropertyKeyName(ctx: PropertyKeyNameContext) {
    // FIXME Is this correct in this case for all cases, not just simple properties?
    this.addToken(ctx.start, TokenType.property, ctx.text);
  }

  exitLiteral(ctx: LiteralContext) {
    this.addToken(ctx.start, TokenType.literal, ctx.text);
  }
}

function identifyInputTokens(tokenStream: CommonTokenStream) {
  const recognizedKeywords = new Array<ParsedToken>();

  tokenStream.getTokens().forEach((token) => {
    const tokenNumber = token.type;
    const colour = colouringTable.get(tokenNumber);
    if (colour) {
      recognizedKeywords.push(
        toParsedToken(token, colour, TokenAnnotation.Lexer),
      );
    }
  });

  return recognizedKeywords;
}

function sortTokens(tokens: ParsedToken[]) {
  return tokens.sort((a, b) => {
    const lineDiff = a.line - b.line;
    if (lineDiff !== 0) return lineDiff;
    const colDiff = a.startCharacter - b.startCharacter;
    if (colDiff !== 0) return colDiff;

    // If the tokens are on the same line and start at the same column,
    // give precedence to the tree annotation
    if (a.tokenAnnotation === TokenAnnotation.TreeTraversal) return -1;
    if (b.tokenAnnotation === TokenAnnotation.TreeTraversal) return 1;

    return 0;
  });
}

export function doSyntaxColouringText(wholeFileText: string): ParsedToken[] {
  const inputStream = CharStreams.fromString(wholeFileText);
  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);

  const parser = new CypherParser(tokenStream);
  const treeSyntaxHighlighter = new SyntaxHighlighter();
  parser.addParseListener(treeSyntaxHighlighter as ParseTreeListener);
  // Parse input
  parser.statements();

  const structuralTokens = treeSyntaxHighlighter.allTokens;
  const lexerTokens = identifyInputTokens(tokenStream);
  const allTokens = structuralTokens.concat(lexerTokens);

  // When we push to the builder, tokens need to be sorted in ascending starting position
  // i.e. as we find them when we read them from left to right, and from top to bottom in the file
  const sortedTokens = sortTokens(allTokens);

  return sortedTokens;
}

export function doSyntaxColouring(documents: TextDocuments<TextDocument>) {
  return (params: SemanticTokensParams) => {
    const textDocument = documents.get(params.textDocument.uri);
    if (textDocument === undefined) return { data: [] };

    const tokens = doSyntaxColouringText(textDocument.getText());

    const builder = new SemanticTokensBuilder();
    tokens.forEach((token) => {
      builder.push(
        token.line,
        token.startCharacter,
        token.length,
        token.tokenType.valueOf(),
        0,
      );
    });
    const results = builder.build();
    return results;
  };
}

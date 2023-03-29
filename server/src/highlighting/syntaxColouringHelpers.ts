import { SemanticTokenTypes } from 'vscode-languageserver/node';

import { Token } from 'antlr4ts';

import { CypherLexer } from '../antlr/CypherLexer';

import { CypherTokenType, lexerSymbols } from '../lexerSymbols';

interface TokenPosition {
  line: number;
  startCharacter: number;
}

export function tokenPositionToString(tokenPosition: TokenPosition): string {
  return `${tokenPosition.line},${tokenPosition.startCharacter}`;
}

export interface ParsedCypherToken {
  position: TokenPosition;
  length: number;
  tokenType: CypherTokenType;
  token: string;
  bracketInfo?: BracketInfo;
}

export interface BracketInfo {
  bracketType: BracketType;
  bracketLevel: number;
}

export enum BracketType {
  bracket = 'bracket',
  parenthesis = 'parenthesis',
  curly = 'curly',
}

export interface ColouredToken {
  position: TokenPosition;
  length: number;
  tokenColour: SemanticTokenTypes;
  token: string;
}

export function getTokenPosition(token: Token): TokenPosition {
  return {
    line: token.line - 1,
    startCharacter: token.charPositionInLine,
  };
}

function getBracketType(token: Token): BracketType | undefined {
  const bracketType: { [n: number]: BracketType } = {
    [CypherLexer.LPAREN]: BracketType.parenthesis,
    [CypherLexer.RPAREN]: BracketType.parenthesis,
    [CypherLexer.LBRACKET]: BracketType.bracket,
    [CypherLexer.RBRACKET]: BracketType.bracket,
    [CypherLexer.LCURLY]: BracketType.curly,
    [CypherLexer.RCURLY]: BracketType.curly,
  };
  return bracketType[token.type];
}

function isClosingBracket(token: Token): boolean {
  return [
    CypherLexer.RPAREN,
    CypherLexer.RBRACKET,
    CypherLexer.RCURLY,
  ].includes(token.type);
}

function isOpeningBracket(token: Token): boolean {
  return [
    CypherLexer.LPAREN,
    CypherLexer.LBRACKET,
    CypherLexer.LCURLY,
  ].includes(token.type);
}

function computeBracketInfo(
  token: Token,
  bracketsLevel?: Map<BracketType, number>,
): BracketInfo | undefined {
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

  return bracketInfo;
}

export function toParsedTokens(
  tokenPosition: TokenPosition,
  tokenType: CypherTokenType,
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

      const bracketInfo: BracketInfo | undefined = computeBracketInfo(
        token,
        bracketsLevel,
      );

      return {
        position: position,
        length: tokenChunk.length,
        tokenType: tokenType,
        token: tokenChunk,
        bracketInfo: bracketInfo,
      };
    });
}

export function getCypherTokenType(token: Token): CypherTokenType {
  const tokenNumber = token.type;

  if (
    tokenNumber === CypherLexer.SINGLE_LINE_COMMENT ||
    tokenNumber === CypherLexer.MULTI_LINE_COMMENT
  ) {
    return CypherTokenType.comment;
  } else {
    // Defautl token type is none
    return lexerSymbols.get(tokenNumber) ?? CypherTokenType.none;
  }
}

export function shouldAssignTokenType(token: Token): boolean {
  const nonEOF = token.type !== Token.EOF;
  const inMainChannel = token.channel !== Token.HIDDEN_CHANNEL;
  const isComment =
    token.type === CypherLexer.SINGLE_LINE_COMMENT ||
    token.type === CypherLexer.MULTI_LINE_COMMENT;

  return nonEOF && (inMainChannel || isComment);
}

export function sortTokens(tokens: ParsedCypherToken[]) {
  return tokens.sort((a, b) => {
    const lineDiff = a.position.line - b.position.line;
    if (lineDiff !== 0) return lineDiff;

    return a.position.startCharacter - b.position.startCharacter;
  });
}

// Assumes the tokens are already sorted
export function removeOverlappingTokens(tokens: ParsedCypherToken[]) {
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

import { SemanticTokenTypes } from 'vscode-languageserver-types';

import { Token } from 'antlr4';

import CypherLexer from '../../generated-parser/CypherLexer';

import { CypherTokenType, lexerSymbols } from '../../lexerSymbols';

interface TokenPosition {
  line: number;
  startCharacter: number;
  startOffset: number;
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
    startCharacter: token.column,
    startOffset: token.start,
  };
}

function getBracketType(token: Token): BracketType | undefined {
  const bracketType: Record<number, BracketType> = {
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

export function computeBracketInfo(
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

export function getCypherTokenType(token: Token): CypherTokenType {
  const tokenNumber = token.type;

  if (tokenNumber === CypherLexer.EOF && token.text !== '<EOF>') {
    const tokenText = token.text;
    if (tokenText.startsWith('"') || tokenText.startsWith("'")) {
      return CypherTokenType.stringLiteral;
    } else if (tokenText.startsWith('/*')) {
      return CypherTokenType.comment;
    } else if (tokenText.startsWith('`')) {
      return CypherTokenType.symbolicName;
    }
  }
  if (
    tokenNumber === CypherLexer.SINGLE_LINE_COMMENT ||
    tokenNumber === CypherLexer.MULTI_LINE_COMMENT
  ) {
    return CypherTokenType.comment;
  } else {
    return lexerSymbols[tokenNumber] ?? CypherTokenType.none;
  }
}

export function shouldAssignTokenType(token: Token): boolean {
  const nonEOF = token.type !== Token.EOF || token.text !== '<EOF>';
  const inMainChannel = token.channel == 0;
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
  let prevEndCharacter = 0;

  tokens.forEach((token) => {
    const current = token.position;
    if (current.startOffset >= prevEndCharacter) {
      // Add current token to the list and in further iterations
      // remove tokens overlapping with it
      result.push(token);
      prevEndCharacter = current.startOffset + (token.token?.length ?? 0);
    }
  });

  return result;
}

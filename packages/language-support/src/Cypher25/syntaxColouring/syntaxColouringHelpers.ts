import { Token } from 'antlr4';

import CypherLexer from '../generated-parser/CypherCmdLexer';

import {
  BracketInfo,
  BracketType,
  CypherTokenType,
  ParsedCypherToken,
  TokenPosition,
} from '../../types';
import { isCommentOpener } from '../helpers';
import { lexerSymbols } from '../lexerSymbols';

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
  let prevLen = 0;
  return tokenStr.split('\n').flatMap((tokenChunk, i) => {
    const position =
      i == 0
        ? tokenPosition
        : {
            line: tokenPosition.line + i,
            startCharacter: 0,
            startOffset: token.start + prevLen,
          };
    prevLen += tokenChunk.length + '\n'.length;

    // If the token is empty no need to create a token
    if (tokenChunk.length === 0) {
      return [];
    }

    const bracketInfo: BracketInfo | undefined = computeBracketInfo(
      token,
      bracketsLevel,
    );

    return [
      {
        position: position,
        length: tokenChunk.length,
        tokenType: tokenType,
        token: tokenChunk,
        bracketInfo: bracketInfo,
      },
    ];
  });
}

export function getCypherTokenType(
  token: Token,
  nextToken: Token | undefined,
): {
  tokenType: CypherTokenType;
  finished: boolean;
} {
  const tokenText = token.text;

  if (token.type === CypherLexer.ErrorChar) {
    if (tokenText === '"' || tokenText === "'") {
      return { tokenType: CypherTokenType.stringLiteral, finished: false };
    } else if (tokenText.startsWith('`')) {
      return { tokenType: CypherTokenType.symbolicName, finished: false };
    }
  }

  if (isCommentOpener(token, nextToken)) {
    return { tokenType: CypherTokenType.comment, finished: false };
  }

  return {
    tokenType: lexerSymbols[token.type] ?? CypherTokenType.none,
    finished: true,
  };
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
  let prev: TokenPosition = { line: -1, startCharacter: -1, startOffset: -1 };
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

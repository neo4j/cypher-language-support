import { applySyntaxColouring } from '../../../highlighting/syntaxColouring/syntaxColouring';

describe('Preparser syntax colouring', () => {
  test('Correctly colours PROFILE', () => {
    const query = 'PROFILE MATCH (n) RETURN n';

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'PROFILE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 8,
          startOffset: 8,
        },
        token: 'MATCH',
        tokenType: 'keyword',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 14,
          startOffset: 14,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 15,
          startOffset: 15,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 16,
          startOffset: 16,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 18,
          startOffset: 18,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 25,
          startOffset: 25,
        },
        token: 'n',
        tokenType: 'variable',
      },
    ]);
  });

  test('Correctly colours EXPLAIN', () => {
    const query = 'EXPLAIN MATCH (n) RETURN n';

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'EXPLAIN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 8,
          startOffset: 8,
        },
        token: 'MATCH',
        tokenType: 'keyword',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 14,
          startOffset: 14,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 15,
          startOffset: 15,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 16,
          startOffset: 16,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 18,
          startOffset: 18,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 25,
          startOffset: 25,
        },
        token: 'n',
        tokenType: 'variable',
      },
    ]);
  });

  test('Correctly colours EXPLAIN and PROFILE in different statements', () => {
    const query = 'EXPLAIN MATCH (n) RETURN n; PROFILE MATCH (m) RETURN m';

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'EXPLAIN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 8,
          startOffset: 8,
        },
        token: 'MATCH',
        tokenType: 'keyword',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 14,
          startOffset: 14,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 15,
          startOffset: 15,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 16,
          startOffset: 16,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 18,
          startOffset: 18,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 25,
          startOffset: 25,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 26,
          startOffset: 26,
        },
        token: ';',
        tokenType: 'punctuation',
      },
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 0,
          startCharacter: 28,
          startOffset: 28,
        },
        token: 'PROFILE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 36,
          startOffset: 36,
        },
        token: 'MATCH',
        tokenType: 'keyword',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 42,
          startOffset: 42,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 43,
          startOffset: 43,
        },
        token: 'm',
        tokenType: 'variable',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 44,
          startOffset: 44,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 46,
          startOffset: 46,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 53,
          startOffset: 53,
        },
        token: 'm',
        tokenType: 'variable',
      },
    ]);
  });
});

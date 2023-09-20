import { applySyntaxColouring } from '../../../highlighting/syntaxColouring';

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
});

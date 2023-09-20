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
        tokenType: 'operator',
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
    const query = 'MATCH (n:A|B)';

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
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
          startCharacter: 6,
          startOffset: 6,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 8,
          startOffset: 8,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: 'A',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 10,
          startOffset: 10,
        },
        token: '|',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 11,
          startOffset: 11,
        },
        token: 'B',
        tokenType: 'label',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 12,
          startOffset: 12,
        },
        token: ')',
        tokenType: 'bracket',
      },
    ]);
  });
});

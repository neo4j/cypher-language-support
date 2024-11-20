import { applySyntaxColouring } from '../../syntaxColouring/syntaxColouring';

describe('Comments syntax colouring', () => {
  test('Correctly colours one line comments', () => {
    const query = `
    // Some comment
    // Another comment
    CALL foo.bar()
    `;

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 15,
        position: {
          line: 1,
          startCharacter: 4,
          startOffset: 5,
        },
        token: '// Some comment',
        tokenType: 'comment',
      },
      {
        bracketInfo: undefined,
        length: 18,
        position: {
          line: 2,
          startCharacter: 4,
          startOffset: 25,
        },
        token: '// Another comment',
        tokenType: 'comment',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 3,
          startCharacter: 4,
          startOffset: 48,
        },
        token: 'CALL',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 3,
          startCharacter: 9,
          startOffset: 53,
        },
        token: 'foo',
        tokenType: 'procedure',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 12,
          startOffset: 56,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 3,
          startCharacter: 13,
          startOffset: 57,
        },
        token: 'bar',
        tokenType: 'procedure',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 3,
          startCharacter: 16,
          startOffset: 60,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 3,
          startCharacter: 17,
          startOffset: 61,
        },
        token: ')',
        tokenType: 'bracket',
      },
    ]);
  });

  test('Correctly colours multiline comments', () => {
    const query = `
    /* Some multiline
    comment
    */  
    CALL foo.bar()
    `;

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 17,
        position: {
          line: 1,
          startCharacter: 4,
          startOffset: 5,
        },
        token: '/* Some multiline',
        tokenType: 'comment',
      },
      {
        bracketInfo: undefined,
        length: 11,
        position: {
          line: 2,
          startCharacter: 0,
          startOffset: 23,
        },
        token: '    comment',
        tokenType: 'comment',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 3,
          startCharacter: 0,
          startOffset: 35,
        },
        token: '    */',
        tokenType: 'comment',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 4,
          startCharacter: 4,
          startOffset: 48,
        },
        token: 'CALL',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 4,
          startCharacter: 9,
          startOffset: 53,
        },
        token: 'foo',
        tokenType: 'procedure',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 4,
          startCharacter: 12,
          startOffset: 56,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 4,
          startCharacter: 13,
          startOffset: 57,
        },
        token: 'bar',
        tokenType: 'procedure',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 4,
          startCharacter: 16,
          startOffset: 60,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 4,
          startCharacter: 17,
          startOffset: 61,
        },
        token: ')',
        tokenType: 'bracket',
      },
    ]);
  });

  test('Correctly colours comments which include cypher keywords', () => {
    const query = `MATCH (n) RETURN n // MATCH (n) finds all nodes`;

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
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 8,
          startOffset: 8,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 10,
          startOffset: 10,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 17,
          startOffset: 17,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 28,
        position: {
          line: 0,
          startCharacter: 19,
          startOffset: 19,
        },
        token: '// MATCH (n) finds all nodes',
        tokenType: 'comment',
      },
    ]);
  });
});

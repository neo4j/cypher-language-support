import { applySyntaxColouring } from '../../../highlighting/syntaxColouring/syntaxColouring';

describe('Multiline syntax colouring', () => {
  test('Correctly colours multi-statements', () => {
    const query = `MATCH (n:Person) RETURN n
      CALL apoc.do.when(true, "foo", false, "bar") YIELD name, result`;

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
        length: 6,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: 'Person',
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
          startCharacter: 15,
          startOffset: 15,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 17,
          startOffset: 17,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 24,
          startOffset: 24,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 32,
        },
        token: 'CALL',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 1,
          startCharacter: 11,
          startOffset: 37,
        },
        token: 'apoc',
        tokenType: 'procedure',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 15,
          startOffset: 41,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 1,
          startCharacter: 16,
          startOffset: 42,
        },
        token: 'do',
        tokenType: 'procedure',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 18,
          startOffset: 44,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 1,
          startCharacter: 19,
          startOffset: 45,
        },
        token: 'when',
        tokenType: 'procedure',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 1,
          startCharacter: 23,
          startOffset: 49,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 1,
          startCharacter: 24,
          startOffset: 50,
        },
        token: 'true',
        tokenType: 'booleanLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 28,
          startOffset: 54,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 1,
          startCharacter: 30,
          startOffset: 56,
        },
        token: '"foo"',
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 35,
          startOffset: 61,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 1,
          startCharacter: 37,
          startOffset: 63,
        },
        token: 'false',
        tokenType: 'booleanLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 42,
          startOffset: 68,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 1,
          startCharacter: 44,
          startOffset: 70,
        },
        token: '"bar"',
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 1,
          startCharacter: 49,
          startOffset: 75,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 1,
          startCharacter: 51,
          startOffset: 77,
        },
        token: 'YIELD',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 1,
          startCharacter: 57,
          startOffset: 83,
        },
        token: 'name',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 61,
          startOffset: 87,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 1,
          startCharacter: 63,
          startOffset: 89,
        },
        token: 'result',
        tokenType: 'variable',
      },
    ]);
  });

  test('Correctly colours unfinished multi-statements', () => {
    const query = `MATCH (n:Person);

      CALL apoc.do.when(true, "foo", false, "bar") YIELD name, result`;

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
        length: 6,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: 'Person',
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
          startCharacter: 15,
          startOffset: 15,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 16,
          startOffset: 16,
        },
        token: ';',
        tokenType: 'punctuation',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 25,
        },
        token: 'CALL',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 2,
          startCharacter: 11,
          startOffset: 30,
        },
        token: 'apoc',
        tokenType: 'procedure',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 15,
          startOffset: 34,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 2,
          startCharacter: 16,
          startOffset: 35,
        },
        token: 'do',
        tokenType: 'procedure',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 18,
          startOffset: 37,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 2,
          startCharacter: 19,
          startOffset: 38,
        },
        token: 'when',
        tokenType: 'procedure',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 2,
          startCharacter: 23,
          startOffset: 42,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 2,
          startCharacter: 24,
          startOffset: 43,
        },
        token: 'true',
        tokenType: 'booleanLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 28,
          startOffset: 47,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 2,
          startCharacter: 30,
          startOffset: 49,
        },
        token: '"foo"',
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 35,
          startOffset: 54,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 2,
          startCharacter: 37,
          startOffset: 56,
        },
        token: 'false',
        tokenType: 'booleanLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 42,
          startOffset: 61,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 2,
          startCharacter: 44,
          startOffset: 63,
        },
        token: '"bar"',
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 2,
          startCharacter: 49,
          startOffset: 68,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 2,
          startCharacter: 51,
          startOffset: 70,
        },
        token: 'YIELD',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 2,
          startCharacter: 57,
          startOffset: 76,
        },
        token: 'name',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 61,
          startOffset: 80,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 2,
          startCharacter: 63,
          startOffset: 82,
        },
        token: 'result',
        tokenType: 'variable',
      },
    ]);
  });

  test('Correctly colours multiline label', () => {
    const query = `MATCH (n:\`Label
Other\`)
	`;

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
        length: 6,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: '`Label',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 1,
          startCharacter: 0,
          startOffset: 16,
        },
        token: 'Other`',
        tokenType: 'label',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 22,
        },
        token: ')',
        tokenType: 'bracket',
      },
    ]);
  });

  test('Correctly colours multiline procedure name', () => {
    const query = `CALL apoc.
      do.
      when()
	`;

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'CALL',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        token: 'apoc',
        tokenType: 'procedure',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 17,
        },
        token: 'do',
        tokenType: 'procedure',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 8,
          startOffset: 19,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 27,
        },
        token: 'when',
        tokenType: 'procedure',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 2,
          startCharacter: 10,
          startOffset: 31,
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
          line: 2,
          startCharacter: 11,
          startOffset: 32,
        },
        token: ')',
        tokenType: 'bracket',
      },
    ]);
  });
});

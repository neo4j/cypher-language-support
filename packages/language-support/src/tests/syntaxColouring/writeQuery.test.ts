import { applySyntaxColouring } from '../../syntaxColouring/syntaxColouring';

describe('CREATE syntax colouring', () => {
  test('Correctly colours CREATE', () => {
    const query = 'CREATE (n:Label)-[:TYPE {name: $value}]->(m:Label)';

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'CREATE',
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
          startCharacter: 7,
          startOffset: 7,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 8,
          startOffset: 8,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 10,
          startOffset: 10,
        },
        token: 'Label',
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
        token: '-',
        tokenType: 'separator',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 17,
          startOffset: 17,
        },
        token: '[',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 18,
          startOffset: 18,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 19,
          startOffset: 19,
        },
        token: 'TYPE',
        tokenType: 'label',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 24,
          startOffset: 24,
        },
        token: '{',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 25,
          startOffset: 25,
        },
        token: 'name',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 29,
          startOffset: 29,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 31,
          startOffset: 31,
        },
        token: '$',
        tokenType: 'paramDollar',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 32,
          startOffset: 32,
        },
        token: 'value',
        tokenType: 'paramValue',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 37,
          startOffset: 37,
        },
        token: '}',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 38,
          startOffset: 38,
        },
        token: ']',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 39,
          startOffset: 39,
        },
        token: '-',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 40,
          startOffset: 40,
        },
        token: '>',
        tokenType: 'separator',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 41,
          startOffset: 41,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 42,
          startOffset: 42,
        },
        token: 'm',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 43,
          startOffset: 43,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 44,
          startOffset: 44,
        },
        token: 'Label',
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
          startCharacter: 49,
          startOffset: 49,
        },
        token: ')',
        tokenType: 'bracket',
      },
    ]);
  });
});

describe('SET syntax colouring', () => {
  test('Correctly colours SET', () => {
    const query = `SET n += {
      a: 1,
      b: 'example',
      c: true,
      d: date('2022-05-04'),
      e: point({x: 2, y: 3}),
      f: [1, 2, 3],
      g: ['abc', 'example'],
      h: [true, false, false],
      i: [date('2022-05-04'), date()],
      j: [point({x: 2, y: 3}), point({x: 6, y: 6})],
      k: null
    }`;

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'SET',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 4,
          startOffset: 4,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 6,
          startOffset: 6,
        },
        token: '+=',
        tokenType: 'operator',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: '{',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 17,
        },
        token: 'a',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 7,
          startOffset: 18,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 9,
          startOffset: 20,
        },
        token: '1',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 10,
          startOffset: 21,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 29,
        },
        token: 'b',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 7,
          startOffset: 30,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 2,
          startCharacter: 9,
          startOffset: 32,
        },
        token: "'example'",
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 18,
          startOffset: 41,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 6,
          startOffset: 49,
        },
        token: 'c',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 7,
          startOffset: 50,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 3,
          startCharacter: 9,
          startOffset: 52,
        },
        token: 'true',
        tokenType: 'booleanLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 13,
          startOffset: 56,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 4,
          startCharacter: 6,
          startOffset: 64,
        },
        token: 'd',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 4,
          startCharacter: 7,
          startOffset: 65,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 4,
          startCharacter: 9,
          startOffset: 67,
        },
        token: 'date',
        tokenType: 'function',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 4,
          startCharacter: 13,
          startOffset: 71,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 12,
        position: {
          line: 4,
          startCharacter: 14,
          startOffset: 72,
        },
        token: "'2022-05-04'",
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 4,
          startCharacter: 26,
          startOffset: 84,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 4,
          startCharacter: 27,
          startOffset: 85,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 5,
          startCharacter: 6,
          startOffset: 93,
        },
        token: 'e',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 5,
          startCharacter: 7,
          startOffset: 94,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 5,
          startCharacter: 9,
          startOffset: 96,
        },
        token: 'point',
        tokenType: 'function',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 5,
          startCharacter: 14,
          startOffset: 101,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 5,
          startCharacter: 15,
          startOffset: 102,
        },
        token: '{',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 5,
          startCharacter: 16,
          startOffset: 103,
        },
        token: 'x',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 5,
          startCharacter: 17,
          startOffset: 104,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 5,
          startCharacter: 19,
          startOffset: 106,
        },
        token: '2',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 5,
          startCharacter: 20,
          startOffset: 107,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 5,
          startCharacter: 22,
          startOffset: 109,
        },
        token: 'y',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 5,
          startCharacter: 23,
          startOffset: 110,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 5,
          startCharacter: 25,
          startOffset: 112,
        },
        token: '3',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 5,
          startCharacter: 26,
          startOffset: 113,
        },
        token: '}',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 5,
          startCharacter: 27,
          startOffset: 114,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 5,
          startCharacter: 28,
          startOffset: 115,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 6,
          startCharacter: 6,
          startOffset: 123,
        },
        token: 'f',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 6,
          startCharacter: 7,
          startOffset: 124,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 6,
          startCharacter: 9,
          startOffset: 126,
        },
        token: '[',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 6,
          startCharacter: 10,
          startOffset: 127,
        },
        token: '1',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 6,
          startCharacter: 11,
          startOffset: 128,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 6,
          startCharacter: 13,
          startOffset: 130,
        },
        token: '2',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 6,
          startCharacter: 14,
          startOffset: 131,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 6,
          startCharacter: 16,
          startOffset: 133,
        },
        token: '3',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 6,
          startCharacter: 17,
          startOffset: 134,
        },
        token: ']',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 6,
          startCharacter: 18,
          startOffset: 135,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 7,
          startCharacter: 6,
          startOffset: 143,
        },
        token: 'g',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 7,
          startCharacter: 7,
          startOffset: 144,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 7,
          startCharacter: 9,
          startOffset: 146,
        },
        token: '[',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 7,
          startCharacter: 10,
          startOffset: 147,
        },
        token: "'abc'",
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 7,
          startCharacter: 15,
          startOffset: 152,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 7,
          startCharacter: 17,
          startOffset: 154,
        },
        token: "'example'",
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 7,
          startCharacter: 26,
          startOffset: 163,
        },
        token: ']',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 7,
          startCharacter: 27,
          startOffset: 164,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 8,
          startCharacter: 6,
          startOffset: 172,
        },
        token: 'h',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 8,
          startCharacter: 7,
          startOffset: 173,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 8,
          startCharacter: 9,
          startOffset: 175,
        },
        token: '[',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 8,
          startCharacter: 10,
          startOffset: 176,
        },
        token: 'true',
        tokenType: 'booleanLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 8,
          startCharacter: 14,
          startOffset: 180,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 8,
          startCharacter: 16,
          startOffset: 182,
        },
        token: 'false',
        tokenType: 'booleanLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 8,
          startCharacter: 21,
          startOffset: 187,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 8,
          startCharacter: 23,
          startOffset: 189,
        },
        token: 'false',
        tokenType: 'booleanLiteral',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 8,
          startCharacter: 28,
          startOffset: 194,
        },
        token: ']',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 8,
          startCharacter: 29,
          startOffset: 195,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 9,
          startCharacter: 6,
          startOffset: 203,
        },
        token: 'i',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 9,
          startCharacter: 7,
          startOffset: 204,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 9,
          startCharacter: 9,
          startOffset: 206,
        },
        token: '[',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 9,
          startCharacter: 10,
          startOffset: 207,
        },
        token: 'date',
        tokenType: 'function',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 9,
          startCharacter: 14,
          startOffset: 211,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 12,
        position: {
          line: 9,
          startCharacter: 15,
          startOffset: 212,
        },
        token: "'2022-05-04'",
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 9,
          startCharacter: 27,
          startOffset: 224,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 9,
          startCharacter: 28,
          startOffset: 225,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 9,
          startCharacter: 30,
          startOffset: 227,
        },
        token: 'date',
        tokenType: 'function',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 9,
          startCharacter: 34,
          startOffset: 231,
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
          line: 9,
          startCharacter: 35,
          startOffset: 232,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 9,
          startCharacter: 36,
          startOffset: 233,
        },
        token: ']',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 9,
          startCharacter: 37,
          startOffset: 234,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 10,
          startCharacter: 6,
          startOffset: 242,
        },
        token: 'j',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 10,
          startCharacter: 7,
          startOffset: 243,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 10,
          startCharacter: 9,
          startOffset: 245,
        },
        token: '[',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 10,
          startCharacter: 10,
          startOffset: 246,
        },
        token: 'point',
        tokenType: 'function',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 10,
          startCharacter: 15,
          startOffset: 251,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 10,
          startCharacter: 16,
          startOffset: 252,
        },
        token: '{',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 10,
          startCharacter: 17,
          startOffset: 253,
        },
        token: 'x',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 10,
          startCharacter: 18,
          startOffset: 254,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 10,
          startCharacter: 20,
          startOffset: 256,
        },
        token: '2',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 10,
          startCharacter: 21,
          startOffset: 257,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 10,
          startCharacter: 23,
          startOffset: 259,
        },
        token: 'y',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 10,
          startCharacter: 24,
          startOffset: 260,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 10,
          startCharacter: 26,
          startOffset: 262,
        },
        token: '3',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 10,
          startCharacter: 27,
          startOffset: 263,
        },
        token: '}',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 10,
          startCharacter: 28,
          startOffset: 264,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 10,
          startCharacter: 29,
          startOffset: 265,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 10,
          startCharacter: 31,
          startOffset: 267,
        },
        token: 'point',
        tokenType: 'function',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 10,
          startCharacter: 36,
          startOffset: 272,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 10,
          startCharacter: 37,
          startOffset: 273,
        },
        token: '{',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 10,
          startCharacter: 38,
          startOffset: 274,
        },
        token: 'x',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 10,
          startCharacter: 39,
          startOffset: 275,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 10,
          startCharacter: 41,
          startOffset: 277,
        },
        token: '6',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 10,
          startCharacter: 42,
          startOffset: 278,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 10,
          startCharacter: 44,
          startOffset: 280,
        },
        token: 'y',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 10,
          startCharacter: 45,
          startOffset: 281,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 10,
          startCharacter: 47,
          startOffset: 283,
        },
        token: '6',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 10,
          startCharacter: 48,
          startOffset: 284,
        },
        token: '}',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 10,
          startCharacter: 49,
          startOffset: 285,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 10,
          startCharacter: 50,
          startOffset: 286,
        },
        token: ']',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 10,
          startCharacter: 51,
          startOffset: 287,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 11,
          startCharacter: 6,
          startOffset: 295,
        },
        token: 'k',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 11,
          startCharacter: 7,
          startOffset: 296,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 11,
          startCharacter: 9,
          startOffset: 298,
        },
        token: 'null',
        tokenType: 'keywordLiteral',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 12,
          startCharacter: 4,
          startOffset: 307,
        },
        token: '}',
        tokenType: 'bracket',
      },
    ]);
  });
});

describe('REMOVE syntax colouring', () => {
  test('Correctly colours REMOVE', () => {
    const query = `MATCH (n:Label)
    WHERE n.id = 123
    REMOVE n.alias  
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
        length: 5,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: 'Label',
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
          startCharacter: 14,
          startOffset: 14,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 1,
          startCharacter: 4,
          startOffset: 20,
        },
        token: 'WHERE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 10,
          startOffset: 26,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 11,
          startOffset: 27,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 1,
          startCharacter: 12,
          startOffset: 28,
        },
        token: 'id',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 15,
          startOffset: 31,
        },
        token: '=',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 1,
          startCharacter: 17,
          startOffset: 33,
        },
        token: '123',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 2,
          startCharacter: 4,
          startOffset: 41,
        },
        token: 'REMOVE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 11,
          startOffset: 48,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 12,
          startOffset: 49,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 2,
          startCharacter: 13,
          startOffset: 50,
        },
        token: 'alias',
        tokenType: 'property',
      },
    ]);
  });
});

describe('MERGE syntax colouring', () => {
  test('Correctly colours MERGE', () => {
    const query = `MATCH
    (a:Person {name: $value1}),
    (b:Person {name: $value2})
    MERGE (a)-[r:LOVES]->(b)
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
          line: 1,
          startCharacter: 4,
          startOffset: 10,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 5,
          startOffset: 11,
        },
        token: 'a',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 12,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 1,
          startCharacter: 7,
          startOffset: 13,
        },
        token: 'Person',
        tokenType: 'label',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 1,
          startCharacter: 14,
          startOffset: 20,
        },
        token: '{',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 1,
          startCharacter: 15,
          startOffset: 21,
        },
        token: 'name',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 19,
          startOffset: 25,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 21,
          startOffset: 27,
        },
        token: '$',
        tokenType: 'paramDollar',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 1,
          startCharacter: 22,
          startOffset: 28,
        },
        token: 'value1',
        tokenType: 'paramValue',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 1,
          startCharacter: 28,
          startOffset: 34,
        },
        token: '}',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 1,
          startCharacter: 29,
          startOffset: 35,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 30,
          startOffset: 36,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 2,
          startCharacter: 4,
          startOffset: 42,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 5,
          startOffset: 43,
        },
        token: 'b',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 44,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 2,
          startCharacter: 7,
          startOffset: 45,
        },
        token: 'Person',
        tokenType: 'label',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 2,
          startCharacter: 14,
          startOffset: 52,
        },
        token: '{',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 2,
          startCharacter: 15,
          startOffset: 53,
        },
        token: 'name',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 19,
          startOffset: 57,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 21,
          startOffset: 59,
        },
        token: '$',
        tokenType: 'paramDollar',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 2,
          startCharacter: 22,
          startOffset: 60,
        },
        token: 'value2',
        tokenType: 'paramValue',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 2,
          startCharacter: 28,
          startOffset: 66,
        },
        token: '}',
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
          startCharacter: 29,
          startOffset: 67,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 3,
          startCharacter: 4,
          startOffset: 73,
        },
        token: 'MERGE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 3,
          startCharacter: 10,
          startOffset: 79,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 11,
          startOffset: 80,
        },
        token: 'a',
        tokenType: 'variable',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 3,
          startCharacter: 12,
          startOffset: 81,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 13,
          startOffset: 82,
        },
        token: '-',
        tokenType: 'separator',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 3,
          startCharacter: 14,
          startOffset: 83,
        },
        token: '[',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 15,
          startOffset: 84,
        },
        token: 'r',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 16,
          startOffset: 85,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 3,
          startCharacter: 17,
          startOffset: 86,
        },
        token: 'LOVES',
        tokenType: 'label',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 3,
          startCharacter: 22,
          startOffset: 91,
        },
        token: ']',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 23,
          startOffset: 92,
        },
        token: '-',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 24,
          startOffset: 93,
        },
        token: '>',
        tokenType: 'separator',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 3,
          startCharacter: 25,
          startOffset: 94,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 26,
          startOffset: 95,
        },
        token: 'b',
        tokenType: 'variable',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 3,
          startCharacter: 27,
          startOffset: 96,
        },
        token: ')',
        tokenType: 'bracket',
      },
    ]);
  });
});

describe('DELETE syntax colouring', () => {
  test('Correctly colours DELETE', () => {
    const query = `MATCH ()-[r]->()
    DELETE r
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
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 8,
          startOffset: 8,
        },
        token: '-',
        tokenType: 'separator',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: '[',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 10,
          startOffset: 10,
        },
        token: 'r',
        tokenType: 'variable',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 11,
          startOffset: 11,
        },
        token: ']',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 12,
          startOffset: 12,
        },
        token: '-',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 13,
          startOffset: 13,
        },
        token: '>',
        tokenType: 'separator',
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
          line: 1,
          startCharacter: 4,
          startOffset: 21,
        },
        token: 'DELETE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 11,
          startOffset: 28,
        },
        token: 'r',
        tokenType: 'variable',
      },
    ]);
  });

  test('Correctly colours DETACH DELETE', () => {
    const query = `MATCH (n:Label)
    WHERE n.id = 123
    DETACH DELETE n
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
        length: 5,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: 'Label',
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
          startCharacter: 14,
          startOffset: 14,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 1,
          startCharacter: 4,
          startOffset: 20,
        },
        token: 'WHERE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 10,
          startOffset: 26,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 11,
          startOffset: 27,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 1,
          startCharacter: 12,
          startOffset: 28,
        },
        token: 'id',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 15,
          startOffset: 31,
        },
        token: '=',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 1,
          startCharacter: 17,
          startOffset: 33,
        },
        token: '123',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 2,
          startCharacter: 4,
          startOffset: 41,
        },
        token: 'DETACH',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 2,
          startCharacter: 11,
          startOffset: 48,
        },
        token: 'DELETE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 18,
          startOffset: 55,
        },
        token: 'n',
        tokenType: 'variable',
      },
    ]);
  });
});

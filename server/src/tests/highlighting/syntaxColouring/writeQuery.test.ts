import { TokenType } from '../../../lexerSymbols';
import { testSyntaxColouring, testSyntaxColouringContains } from './helpers';

describe('CREATE syntax colouring', () => {
  test('Correctly colours CREATE', async () => {
    const query = 'CREATE (n:Label)-[:TYPE {name: $value}]->(m:Label)';

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'CREATE',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 0,
          startCharacter: 8,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
        },
        length: 5,
        tokenType: TokenType.type,
        token: 'Label',
      },
      {
        position: {
          line: 0,
          startCharacter: 15,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '-',
      },
      {
        position: {
          line: 0,
          startCharacter: 17,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '[',
      },
      {
        position: {
          line: 0,
          startCharacter: 18,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 19,
        },
        length: 4,
        tokenType: TokenType.type,
        token: 'TYPE',
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '{',
      },
      {
        position: {
          line: 0,
          startCharacter: 25,
        },
        length: 4,
        tokenType: TokenType.property,
        token: 'name',
      },
      {
        position: {
          line: 0,
          startCharacter: 29,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 31,
        },
        length: 1,
        tokenType: TokenType.namespace,
        token: '$',
      },
      {
        position: {
          line: 0,
          startCharacter: 32,
        },
        length: 5,
        tokenType: TokenType.parameter,
        token: 'value',
      },
      {
        position: {
          line: 0,
          startCharacter: 37,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '}',
      },
      {
        position: {
          line: 0,
          startCharacter: 38,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ']',
      },
      {
        position: {
          line: 0,
          startCharacter: 39,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '-',
      },
      {
        position: {
          line: 0,
          startCharacter: 40,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '>',
      },
      {
        position: {
          line: 0,
          startCharacter: 41,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 0,
          startCharacter: 42,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'm',
      },
      {
        position: {
          line: 0,
          startCharacter: 43,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 44,
        },
        length: 5,
        tokenType: TokenType.type,
        token: 'Label',
      },
      {
        position: {
          line: 0,
          startCharacter: 49,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
    ]);
  });
});

describe('SET syntax colouring', () => {
  test('Correctly colours SET', async () => {
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
      j: [point({x: 2, y: 3}), point({x: 5, y: 5})],
      k: null
    }`;

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 0,
          startCharacter: 4,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
        },
        length: 2,
        tokenType: TokenType.operator,
        token: '+=',
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '{',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 1,
        tokenType: TokenType.property,
        token: 'a',
      },
      {
        position: {
          line: 1,
          startCharacter: 7,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 1,
          startCharacter: 9,
        },
        length: 1,
        tokenType: TokenType.number,
        token: '1',
      },
      {
        position: {
          line: 1,
          startCharacter: 10,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 1,
        tokenType: TokenType.property,
        token: 'b',
      },
      {
        position: {
          line: 2,
          startCharacter: 7,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 2,
          startCharacter: 9,
        },
        length: 9,
        tokenType: TokenType.literal,
        token: "'example'",
      },
      {
        position: {
          line: 2,
          startCharacter: 18,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 3,
          startCharacter: 6,
        },
        length: 1,
        tokenType: TokenType.property,
        token: 'c',
      },
      {
        position: {
          line: 3,
          startCharacter: 7,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 3,
          startCharacter: 9,
        },
        length: 4,
        tokenType: TokenType.number,
        token: 'true',
      },
      {
        position: {
          line: 3,
          startCharacter: 13,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 4,
          startCharacter: 6,
        },
        length: 1,
        tokenType: TokenType.property,
        token: 'd',
      },
      {
        position: {
          line: 4,
          startCharacter: 7,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 4,
          startCharacter: 9,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'date',
      },
      {
        position: {
          line: 4,
          startCharacter: 13,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 4,
          startCharacter: 14,
        },
        length: 12,
        tokenType: TokenType.literal,
        token: "'2022-05-04'",
      },
      {
        position: {
          line: 4,
          startCharacter: 26,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 4,
          startCharacter: 27,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 5,
          startCharacter: 6,
        },
        length: 1,
        tokenType: TokenType.property,
        token: 'e',
      },
      {
        position: {
          line: 5,
          startCharacter: 7,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 5,
          startCharacter: 9,
        },
        length: 5,
        tokenType: TokenType.function,
        token: 'point',
      },
      {
        position: {
          line: 5,
          startCharacter: 14,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 5,
          startCharacter: 15,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '{',
      },
      {
        position: {
          line: 5,
          startCharacter: 16,
        },
        length: 1,
        tokenType: TokenType.property,
        token: 'x',
      },
      {
        position: {
          line: 5,
          startCharacter: 17,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 5,
          startCharacter: 19,
        },
        length: 1,
        tokenType: TokenType.number,
        token: '2',
      },
      {
        position: {
          line: 5,
          startCharacter: 20,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 5,
          startCharacter: 22,
        },
        length: 1,
        tokenType: TokenType.property,
        token: 'y',
      },
      {
        position: {
          line: 5,
          startCharacter: 23,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 5,
          startCharacter: 25,
        },
        length: 1,
        tokenType: TokenType.number,
        token: '3',
      },
      {
        position: {
          line: 5,
          startCharacter: 26,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '}',
      },
      {
        position: {
          line: 5,
          startCharacter: 27,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 5,
          startCharacter: 28,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 6,
          startCharacter: 6,
        },
        length: 1,
        tokenType: TokenType.property,
        token: 'f',
      },
      {
        position: {
          line: 6,
          startCharacter: 7,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 6,
          startCharacter: 9,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '[',
      },
      {
        position: {
          line: 6,
          startCharacter: 10,
        },
        length: 1,
        tokenType: TokenType.number,
        token: '1',
      },
      {
        position: {
          line: 6,
          startCharacter: 11,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 6,
          startCharacter: 13,
        },
        length: 1,
        tokenType: TokenType.number,
        token: '2',
      },
      {
        position: {
          line: 6,
          startCharacter: 14,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 6,
          startCharacter: 16,
        },
        length: 1,
        tokenType: TokenType.number,
        token: '3',
      },
      {
        position: {
          line: 6,
          startCharacter: 17,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ']',
      },
      {
        position: {
          line: 6,
          startCharacter: 18,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 7,
          startCharacter: 6,
        },
        length: 1,
        tokenType: TokenType.property,
        token: 'g',
      },
      {
        position: {
          line: 7,
          startCharacter: 7,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 7,
          startCharacter: 9,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '[',
      },
      {
        position: {
          line: 7,
          startCharacter: 10,
        },
        length: 5,
        tokenType: TokenType.literal,
        token: "'abc'",
      },
      {
        position: {
          line: 7,
          startCharacter: 15,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 7,
          startCharacter: 17,
        },
        length: 9,
        tokenType: TokenType.literal,
        token: "'example'",
      },
      {
        position: {
          line: 7,
          startCharacter: 26,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ']',
      },
      {
        position: {
          line: 7,
          startCharacter: 27,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 8,
          startCharacter: 6,
        },
        length: 1,
        tokenType: TokenType.property,
        token: 'h',
      },
      {
        position: {
          line: 8,
          startCharacter: 7,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 8,
          startCharacter: 9,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '[',
      },
      {
        position: {
          line: 8,
          startCharacter: 10,
        },
        length: 4,
        tokenType: TokenType.number,
        token: 'true',
      },
      {
        position: {
          line: 8,
          startCharacter: 14,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 8,
          startCharacter: 16,
        },
        length: 5,
        tokenType: TokenType.number,
        token: 'false',
      },
      {
        position: {
          line: 8,
          startCharacter: 21,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 8,
          startCharacter: 23,
        },
        length: 5,
        tokenType: TokenType.number,
        token: 'false',
      },
      {
        position: {
          line: 8,
          startCharacter: 28,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ']',
      },
      {
        position: {
          line: 8,
          startCharacter: 29,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 9,
          startCharacter: 6,
        },
        length: 1,
        tokenType: TokenType.property,
        token: 'i',
      },
      {
        position: {
          line: 9,
          startCharacter: 7,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 9,
          startCharacter: 9,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '[',
      },
      {
        position: {
          line: 9,
          startCharacter: 10,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'date',
      },
      {
        position: {
          line: 9,
          startCharacter: 14,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 9,
          startCharacter: 15,
        },
        length: 12,
        tokenType: TokenType.literal,
        token: "'2022-05-04'",
      },
      {
        position: {
          line: 9,
          startCharacter: 27,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 9,
          startCharacter: 28,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 9,
          startCharacter: 30,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'date',
      },
      {
        position: {
          line: 9,
          startCharacter: 34,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 9,
          startCharacter: 35,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 9,
          startCharacter: 36,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ']',
      },
      {
        position: {
          line: 9,
          startCharacter: 37,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 10,
          startCharacter: 6,
        },
        length: 1,
        tokenType: TokenType.property,
        token: 'j',
      },
      {
        position: {
          line: 10,
          startCharacter: 7,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 10,
          startCharacter: 9,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '[',
      },
      {
        position: {
          line: 10,
          startCharacter: 10,
        },
        length: 5,
        tokenType: TokenType.function,
        token: 'point',
      },
      {
        position: {
          line: 10,
          startCharacter: 15,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 10,
          startCharacter: 16,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '{',
      },
      {
        position: {
          line: 10,
          startCharacter: 17,
        },
        length: 1,
        tokenType: TokenType.property,
        token: 'x',
      },
      {
        position: {
          line: 10,
          startCharacter: 18,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 10,
          startCharacter: 20,
        },
        length: 1,
        tokenType: TokenType.number,
        token: '2',
      },
      {
        position: {
          line: 10,
          startCharacter: 21,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 10,
          startCharacter: 23,
        },
        length: 1,
        tokenType: TokenType.property,
        token: 'y',
      },
      {
        position: {
          line: 10,
          startCharacter: 24,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 10,
          startCharacter: 26,
        },
        length: 1,
        tokenType: TokenType.number,
        token: '3',
      },
      {
        position: {
          line: 10,
          startCharacter: 27,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '}',
      },
      {
        position: {
          line: 10,
          startCharacter: 28,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 10,
          startCharacter: 29,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 10,
          startCharacter: 31,
        },
        length: 5,
        tokenType: TokenType.function,
        token: 'point',
      },
      {
        position: {
          line: 10,
          startCharacter: 36,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 10,
          startCharacter: 37,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '{',
      },
      {
        position: {
          line: 10,
          startCharacter: 38,
        },
        length: 1,
        tokenType: TokenType.property,
        token: 'x',
      },
      {
        position: {
          line: 10,
          startCharacter: 39,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 10,
          startCharacter: 41,
        },
        length: 1,
        tokenType: TokenType.number,
        token: '5',
      },
      {
        position: {
          line: 10,
          startCharacter: 42,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 10,
          startCharacter: 44,
        },
        length: 1,
        tokenType: TokenType.property,
        token: 'y',
      },
      {
        position: {
          line: 10,
          startCharacter: 45,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 10,
          startCharacter: 47,
        },
        length: 1,
        tokenType: TokenType.number,
        token: '5',
      },
      {
        position: {
          line: 10,
          startCharacter: 48,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '}',
      },
      {
        position: {
          line: 10,
          startCharacter: 49,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 10,
          startCharacter: 50,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ']',
      },
      {
        position: {
          line: 10,
          startCharacter: 51,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 11,
          startCharacter: 6,
        },
        length: 1,
        tokenType: TokenType.property,
        token: 'k',
      },
      {
        position: {
          line: 11,
          startCharacter: 7,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 11,
          startCharacter: 9,
        },
        length: 4,
        tokenType: TokenType.literal,
        token: 'null',
      },
      {
        position: {
          line: 12,
          startCharacter: 4,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '}',
      },
    ]);
  });
});

describe('REMOVE syntax colouring', () => {
  test('Correctly colours REMOVE', async () => {
    const query = `MATCH (n:Label)
    WHERE n.id = 123
    REMOVE n.alias  
  `;

    await testSyntaxColouringContains(query, [
      {
        position: {
          line: 2,
          startCharacter: 4,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'REMOVE',
      },
      {
        position: {
          line: 2,
          startCharacter: 11,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 2,
          startCharacter: 12,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 2,
          startCharacter: 13,
        },
        length: 5,
        tokenType: TokenType.property,
        token: 'alias',
      },
    ]);
  });
});

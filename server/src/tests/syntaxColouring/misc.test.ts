import { TokenType } from '../../highlighting/colouringTable';
import { testSyntaxColouring } from './helpers';

describe('Miscelanea syntax colouring', () => {
  test('Correctly colours multi-statements', async () => {
    const query = `MATCH (n:Person) RETURN n
      CALL apoc.do.when(true, "foo", false, "bar") YIELD name, result`;

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'MATCH',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 0,
          startCharacter: 8,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
        },
        length: 6,
        tokenType: TokenType.type,
        token: 'Person',
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
          startCharacter: 17,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'CALL',
      },
      {
        position: {
          line: 1,
          startCharacter: 11,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'apoc',
      },
      {
        position: {
          line: 1,
          startCharacter: 15,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 1,
          startCharacter: 16,
        },
        length: 2,
        tokenType: TokenType.function,
        token: 'do',
      },
      {
        position: {
          line: 1,
          startCharacter: 18,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 1,
          startCharacter: 19,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'when',
      },
      {
        position: {
          line: 1,
          startCharacter: 23,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 1,
          startCharacter: 24,
        },
        length: 4,
        tokenType: TokenType.literal,
        token: 'true',
      },
      {
        position: {
          line: 1,
          startCharacter: 28,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 30,
        },
        length: 5,
        tokenType: TokenType.literal,
        token: '"foo"',
      },
      {
        position: {
          line: 1,
          startCharacter: 35,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 37,
        },
        length: 5,
        tokenType: TokenType.literal,
        token: 'false',
      },
      {
        position: {
          line: 1,
          startCharacter: 42,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 44,
        },
        length: 5,
        tokenType: TokenType.literal,
        token: '"bar"',
      },
      {
        position: {
          line: 1,
          startCharacter: 49,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 1,
          startCharacter: 51,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 1,
          startCharacter: 57,
        },
        length: 4,
        tokenType: TokenType.variable,
        token: 'name',
      },
      {
        position: {
          line: 1,
          startCharacter: 61,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 63,
        },
        length: 6,
        tokenType: TokenType.variable,
        token: 'result',
      },
    ]);
  });

  test('Correctly colours unfinished multi-statements', async () => {
    const query = `MATCH (n:Person);

      CALL apoc.do.when(true, "foo", false, "bar") YIELD name, result`;

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'MATCH',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 0,
          startCharacter: 8,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
        },
        length: 6,
        tokenType: TokenType.type,
        token: 'Person',
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
        token: ';',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'CALL',
      },
      {
        position: {
          line: 2,
          startCharacter: 11,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'apoc',
      },
      {
        position: {
          line: 2,
          startCharacter: 15,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 2,
          startCharacter: 16,
        },
        length: 2,
        tokenType: TokenType.function,
        token: 'do',
      },
      {
        position: {
          line: 2,
          startCharacter: 18,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 2,
          startCharacter: 19,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'when',
      },
      {
        position: {
          line: 2,
          startCharacter: 23,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 2,
          startCharacter: 24,
        },
        length: 4,
        tokenType: TokenType.literal,
        token: 'true',
      },
      {
        position: {
          line: 2,
          startCharacter: 28,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 2,
          startCharacter: 30,
        },
        length: 5,
        tokenType: TokenType.literal,
        token: '"foo"',
      },
      {
        position: {
          line: 2,
          startCharacter: 35,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 2,
          startCharacter: 37,
        },
        length: 5,
        tokenType: TokenType.literal,
        token: 'false',
      },
      {
        position: {
          line: 2,
          startCharacter: 42,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 2,
          startCharacter: 44,
        },
        length: 5,
        tokenType: TokenType.literal,
        token: '"bar"',
      },
      {
        position: {
          line: 2,
          startCharacter: 49,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 2,
          startCharacter: 51,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 2,
          startCharacter: 57,
        },
        length: 4,
        tokenType: TokenType.variable,
        token: 'name',
      },
      {
        position: {
          line: 2,
          startCharacter: 61,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 2,
          startCharacter: 63,
        },
        length: 6,
        tokenType: TokenType.variable,
        token: 'result',
      },
    ]);
  });

  test('Correctly colours multiline label', async () => {
    const query = `MATCH (n:\`Label
Other\`)
	`;

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'MATCH',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 0,
          startCharacter: 8,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
        },
        length: 6,
        tokenType: TokenType.type,
        token: '`Label',
      },
      {
        position: {
          line: 1,
          startCharacter: 0,
        },
        length: 6,
        tokenType: TokenType.type,
        token: 'Other`',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
    ]);
  });

  test('Correctly colours multiline procedure name', async () => {
    const query = `CALL apoc.
      do.
      when()
	`;

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'CALL',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'apoc',
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 2,
        tokenType: TokenType.function,
        token: 'do',
      },
      {
        position: {
          line: 1,
          startCharacter: 8,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'when',
      },
      {
        position: {
          line: 2,
          startCharacter: 10,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 2,
          startCharacter: 11,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
    ]);
  });
});

import { TokenType } from '../../highlighting/colouringTable';
import { testSyntaxColouring } from './helpers';

describe('CALL syntax colouring', () => {
  test('Correctly colours standalone procedure CALL', async () => {
    const query = 'CALL dbms.info() YIELD *';

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
        token: 'dbms',
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
          line: 0,
          startCharacter: 10,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'info',
      },
      {
        position: {
          line: 0,
          startCharacter: 14,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
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
        length: 5,
        tokenType: TokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 0,
          startCharacter: 23,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '*',
      },
    ]);
  });

  test('Correctly colours procedure CALL with yield', async () => {
    const query =
      'CALL apoc.do.when(true, "foo", false, "bar") YIELD name, result';

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
          line: 0,
          startCharacter: 10,
        },
        length: 2,
        tokenType: TokenType.function,
        token: 'do',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 0,
          startCharacter: 13,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'when',
      },
      {
        position: {
          line: 0,
          startCharacter: 17,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 0,
          startCharacter: 18,
        },
        length: 4,
        tokenType: TokenType.literal,
        token: 'true',
      },
      {
        position: {
          line: 0,
          startCharacter: 22,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 5,
        tokenType: TokenType.literal,
        token: '"foo"',
      },
      {
        position: {
          line: 0,
          startCharacter: 29,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 0,
          startCharacter: 31,
        },
        length: 5,
        tokenType: TokenType.literal,
        token: 'false',
      },
      {
        position: {
          line: 0,
          startCharacter: 36,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 0,
          startCharacter: 38,
        },
        length: 5,
        tokenType: TokenType.literal,
        token: '"bar"',
      },
      {
        position: {
          line: 0,
          startCharacter: 43,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 0,
          startCharacter: 45,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 0,
          startCharacter: 51,
        },
        length: 4,
        tokenType: TokenType.variable,
        token: 'name',
      },
      {
        position: {
          line: 0,
          startCharacter: 55,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 0,
          startCharacter: 57,
        },
        length: 6,
        tokenType: TokenType.variable,
        token: 'result',
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

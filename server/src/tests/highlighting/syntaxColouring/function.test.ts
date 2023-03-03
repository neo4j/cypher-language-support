import { TokenType } from '../../../highlighting/colouringTable';
import { testSyntaxColouring } from './helpers';

describe('Function syntax colouring', () => {
  test('Correctly colours function name', async () => {
    const query = 'RETURN reduce()';

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 6,
        tokenType: TokenType.function,
        token: 'reduce',
      },
      {
        position: {
          line: 0,
          startCharacter: 13,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 0,
          startCharacter: 14,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
    ]);
  });

  test('Correctly colours function with arguments', async () => {
    const query = "RETURN some.apoc.function(true, 'something')";

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'some',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'apoc',
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 0,
          startCharacter: 17,
        },
        length: 8,
        tokenType: TokenType.function,
        token: 'function',
      },
      {
        position: {
          line: 0,
          startCharacter: 25,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 0,
          startCharacter: 26,
        },
        length: 4,
        tokenType: TokenType.literal,
        token: 'true',
      },
      {
        position: {
          line: 0,
          startCharacter: 30,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 0,
          startCharacter: 32,
        },
        length: 11,
        tokenType: TokenType.literal,
        token: "'something'",
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
    ]);
  });

  test('Correctly colours multiline function', async () => {
    const query = `RETURN some.
      apoc.
      function()
    `;

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'some',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
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
        length: 4,
        tokenType: TokenType.function,
        token: 'apoc',
      },
      {
        position: {
          line: 1,
          startCharacter: 10,
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
        length: 8,
        tokenType: TokenType.function,
        token: 'function',
      },
      {
        position: {
          line: 2,
          startCharacter: 14,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 2,
          startCharacter: 15,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
    ]);
  });
});

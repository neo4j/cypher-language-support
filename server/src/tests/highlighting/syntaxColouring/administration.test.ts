import { TokenType } from '../../../lexerSymbols';
import { testSyntaxColouring } from './helpers';

describe('Administration commands syntax colouring', () => {
  test('Correctly colours SHOW INDEXES', async () => {
    const query = 'SHOW INDEXES YIELD *';

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'SHOW',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 7,
        tokenType: TokenType.keyword,
        token: 'INDEXES',
      },
      {
        position: {
          line: 0,
          startCharacter: 13,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 0,
          startCharacter: 19,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '*',
      },
    ]);
  });

  test('Correctly colours CREATE INDEX', async () => {
    const query = 'CREATE INDEX index_name FOR (p:Person) ON (p.name)';

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
        length: 5,
        tokenType: TokenType.keyword,
        token: 'INDEX',
      },
      {
        position: {
          line: 0,
          startCharacter: 13,
        },
        length: 10,
        tokenType: TokenType.none,
        token: 'index_name',
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'FOR',
      },
      {
        position: {
          line: 0,
          startCharacter: 28,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 0,
          startCharacter: 29,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'p',
      },
      {
        position: {
          line: 0,
          startCharacter: 30,
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
        length: 6,
        tokenType: TokenType.none,
        token: 'Person',
      },
      {
        position: {
          line: 0,
          startCharacter: 37,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 0,
          startCharacter: 39,
        },
        length: 2,
        tokenType: TokenType.keyword,
        token: 'ON',
      },
      {
        position: {
          line: 0,
          startCharacter: 42,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 0,
          startCharacter: 43,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'p',
      },
      {
        position: {
          line: 0,
          startCharacter: 44,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 0,
          startCharacter: 45,
        },
        length: 4,
        tokenType: TokenType.property,
        token: 'name',
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

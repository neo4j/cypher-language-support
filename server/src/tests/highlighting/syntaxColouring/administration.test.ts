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

  test('Correctly colours SHOW FUNCTIONS', async () => {
    const query = 'SHOW FUNCTIONS EXECUTABLE BY user_name';

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: 1,
        token: 'SHOW',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 9,
        tokenType: 1,
        token: 'FUNCTIONS',
      },
      {
        position: {
          line: 0,
          startCharacter: 15,
        },
        length: 10,
        tokenType: 1,
        token: 'EXECUTABLE',
      },
      {
        position: {
          line: 0,
          startCharacter: 26,
        },
        length: 2,
        tokenType: 1,
        token: 'BY',
      },
      {
        position: {
          line: 0,
          startCharacter: 29,
        },
        length: 9,
        tokenType: 10,
        token: 'user_name',
      },
    ]);
  });

  test('Correctly colours SHOW TRANSACTION / TERMINATE TRANSACTIONS', async () => {
    const query = `SHOW TRANSACTIONS
      YIELD transactionId AS txId, username
      WHERE username = 'user_name'
    TERMINATE TRANSACTIONS txId
      YIELD message
      WHERE NOT message = 'Transaction terminated.'
      RETURN txId
    `;
    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: 1,
        token: 'SHOW',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 12,
        tokenType: 1,
        token: 'TRANSACTIONS',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 5,
        tokenType: 1,
        token: 'YIELD',
      },
      {
        position: {
          line: 1,
          startCharacter: 12,
        },
        length: 13,
        tokenType: 4,
        token: 'transactionId',
      },
      {
        position: {
          line: 1,
          startCharacter: 26,
        },
        length: 2,
        tokenType: 1,
        token: 'AS',
      },
      {
        position: {
          line: 1,
          startCharacter: 29,
        },
        length: 4,
        tokenType: 4,
        token: 'txId',
      },
      {
        position: {
          line: 1,
          startCharacter: 33,
        },
        length: 1,
        tokenType: 6,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 35,
        },
        length: 8,
        tokenType: 4,
        token: 'username',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 5,
        tokenType: 1,
        token: 'WHERE',
      },
      {
        position: {
          line: 2,
          startCharacter: 12,
        },
        length: 8,
        tokenType: 4,
        token: 'username',
      },
      {
        position: {
          line: 2,
          startCharacter: 21,
        },
        length: 1,
        tokenType: 6,
        token: '=',
      },
      {
        position: {
          line: 2,
          startCharacter: 23,
        },
        length: 11,
        tokenType: 7,
        token: "'user_name'",
      },
      {
        position: {
          line: 3,
          startCharacter: 4,
        },
        length: 9,
        tokenType: 1,
        token: 'TERMINATE',
      },
      {
        position: {
          line: 3,
          startCharacter: 14,
        },
        length: 12,
        tokenType: 1,
        token: 'TRANSACTIONS',
      },
      {
        position: {
          line: 3,
          startCharacter: 27,
        },
        length: 4,
        tokenType: 4,
        token: 'txId',
      },
      {
        position: {
          line: 4,
          startCharacter: 6,
        },
        length: 5,
        tokenType: 1,
        token: 'YIELD',
      },
      {
        position: {
          line: 4,
          startCharacter: 12,
        },
        length: 7,
        tokenType: 4,
        token: 'message',
      },
      {
        position: {
          line: 5,
          startCharacter: 6,
        },
        length: 5,
        tokenType: 1,
        token: 'WHERE',
      },
      {
        position: {
          line: 5,
          startCharacter: 12,
        },
        length: 3,
        tokenType: 1,
        token: 'NOT',
      },
      {
        position: {
          line: 5,
          startCharacter: 16,
        },
        length: 7,
        tokenType: 4,
        token: 'message',
      },
      {
        position: {
          line: 5,
          startCharacter: 24,
        },
        length: 1,
        tokenType: 6,
        token: '=',
      },
      {
        position: {
          line: 5,
          startCharacter: 26,
        },
        length: 25,
        tokenType: 7,
        token: "'Transaction terminated.'",
      },
      {
        position: {
          line: 6,
          startCharacter: 6,
        },
        length: 6,
        tokenType: 1,
        token: 'RETURN',
      },
      {
        position: {
          line: 6,
          startCharacter: 13,
        },
        length: 4,
        tokenType: 4,
        token: 'txId',
      },
    ]);
  });

  test('Correctly colours SHOW DATABASES', async () => {
    const query = `SHOW DATABASES
      YIELD name, currentStatus
      WHERE name CONTAINS 'my'
      AND currentStatus = 'online'
    `;
    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: 1,
        token: 'SHOW',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 9,
        tokenType: 1,
        token: 'DATABASES',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 5,
        tokenType: 1,
        token: 'YIELD',
      },
      {
        position: {
          line: 1,
          startCharacter: 12,
        },
        length: 4,
        tokenType: 4,
        token: 'name',
      },
      {
        position: {
          line: 1,
          startCharacter: 16,
        },
        length: 1,
        tokenType: 6,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 18,
        },
        length: 13,
        tokenType: 4,
        token: 'currentStatus',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 5,
        tokenType: 1,
        token: 'WHERE',
      },
      {
        position: {
          line: 2,
          startCharacter: 12,
        },
        length: 4,
        tokenType: 4,
        token: 'name',
      },
      {
        position: {
          line: 2,
          startCharacter: 17,
        },
        length: 8,
        tokenType: 1,
        token: 'CONTAINS',
      },
      {
        position: {
          line: 2,
          startCharacter: 26,
        },
        length: 4,
        tokenType: 7,
        token: "'my'",
      },
      {
        position: {
          line: 3,
          startCharacter: 6,
        },
        length: 3,
        tokenType: 1,
        token: 'AND',
      },
      {
        position: {
          line: 3,
          startCharacter: 10,
        },
        length: 13,
        tokenType: 4,
        token: 'currentStatus',
      },
      {
        position: {
          line: 3,
          startCharacter: 24,
        },
        length: 1,
        tokenType: 6,
        token: '=',
      },
      {
        position: {
          line: 3,
          startCharacter: 26,
        },
        length: 8,
        tokenType: 7,
        token: "'online'",
      },
    ]);
  });
});

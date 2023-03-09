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
        tokenType: TokenType.variable,
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
        tokenType: TokenType.variable,
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
        tokenType: TokenType.variable,
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
        tokenType: TokenType.variable,
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
        tokenType: TokenType.keyword,
        token: 'SHOW',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 9,
        tokenType: TokenType.keyword,
        token: 'FUNCTIONS',
      },
      {
        position: {
          line: 0,
          startCharacter: 15,
        },
        length: 10,
        tokenType: TokenType.keyword,
        token: 'EXECUTABLE',
      },
      {
        position: {
          line: 0,
          startCharacter: 26,
        },
        length: 2,
        tokenType: TokenType.keyword,
        token: 'BY',
      },
      {
        position: {
          line: 0,
          startCharacter: 29,
        },
        length: 9,
        tokenType: TokenType.variable,
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
        tokenType: TokenType.keyword,
        token: 'SHOW',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 12,
        tokenType: TokenType.keyword,
        token: 'TRANSACTIONS',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 1,
          startCharacter: 12,
        },
        length: 13,
        tokenType: TokenType.variable,
        token: 'transactionId',
      },
      {
        position: {
          line: 1,
          startCharacter: 26,
        },
        length: 2,
        tokenType: TokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 1,
          startCharacter: 29,
        },
        length: 4,
        tokenType: TokenType.variable,
        token: 'txId',
      },
      {
        position: {
          line: 1,
          startCharacter: 33,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 35,
        },
        length: 8,
        tokenType: TokenType.variable,
        token: 'username',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'WHERE',
      },
      {
        position: {
          line: 2,
          startCharacter: 12,
        },
        length: 8,
        tokenType: TokenType.variable,
        token: 'username',
      },
      {
        position: {
          line: 2,
          startCharacter: 21,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '=',
      },
      {
        position: {
          line: 2,
          startCharacter: 23,
        },
        length: 11,
        tokenType: TokenType.literal,
        token: "'user_name'",
      },
      {
        position: {
          line: 3,
          startCharacter: 4,
        },
        length: 9,
        tokenType: TokenType.keyword,
        token: 'TERMINATE',
      },
      {
        position: {
          line: 3,
          startCharacter: 14,
        },
        length: 12,
        tokenType: TokenType.keyword,
        token: 'TRANSACTIONS',
      },
      {
        position: {
          line: 3,
          startCharacter: 27,
        },
        length: 4,
        tokenType: TokenType.variable,
        token: 'txId',
      },
      {
        position: {
          line: 4,
          startCharacter: 6,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 4,
          startCharacter: 12,
        },
        length: 7,
        tokenType: TokenType.variable,
        token: 'message',
      },
      {
        position: {
          line: 5,
          startCharacter: 6,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'WHERE',
      },
      {
        position: {
          line: 5,
          startCharacter: 12,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'NOT',
      },
      {
        position: {
          line: 5,
          startCharacter: 16,
        },
        length: 7,
        tokenType: TokenType.variable,
        token: 'message',
      },
      {
        position: {
          line: 5,
          startCharacter: 24,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '=',
      },
      {
        position: {
          line: 5,
          startCharacter: 26,
        },
        length: 25,
        tokenType: TokenType.literal,
        token: "'Transaction terminated.'",
      },
      {
        position: {
          line: 6,
          startCharacter: 6,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 6,
          startCharacter: 13,
        },
        length: 4,
        tokenType: TokenType.variable,
        token: 'txId',
      },
    ]);
  });

  test('Correctly colours CREATE DATABASE', async () => {
    const query =
      'CREATE DATABASE `topology-example` IF NOT EXISTS TOPOLOGY 1 PRIMARY 0 SECONDARIES';

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
        length: 8,
        tokenType: TokenType.keyword,
        token: 'DATABASE',
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
        },
        length: 18,
        tokenType: TokenType.variable,
        token: '`topology-example`',
      },
      {
        position: {
          line: 0,
          startCharacter: 35,
        },
        length: 2,
        tokenType: TokenType.keyword,
        token: 'IF',
      },
      {
        position: {
          line: 0,
          startCharacter: 38,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'NOT',
      },
      {
        position: {
          line: 0,
          startCharacter: 42,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'EXISTS',
      },
      {
        position: {
          line: 0,
          startCharacter: 49,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'TOPOLOGY',
      },
      {
        position: {
          line: 0,
          startCharacter: 58,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '1',
      },
      {
        position: {
          line: 0,
          startCharacter: 60,
        },
        length: 7,
        tokenType: TokenType.keyword,
        token: 'PRIMARY',
      },
      {
        position: {
          line: 0,
          startCharacter: 68,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '0',
      },
      {
        position: {
          line: 0,
          startCharacter: 70,
        },
        length: 11,
        tokenType: TokenType.keyword,
        token: 'SECONDARIES',
      },
    ]);
  });

  test('Correctly colours START DATABASE', async () => {
    const query = 'START DATABASE `database-name`';

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'START',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'DATABASE',
      },
      {
        position: {
          line: 0,
          startCharacter: 15,
        },
        length: 15,
        tokenType: TokenType.variable,
        token: '`database-name`',
      },
    ]);
  });

  test('Correctly colours STOP DATABASE', async () => {
    const query = 'STOP DATABASE `database-name`';

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'STOP',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'DATABASE',
      },
      {
        position: {
          line: 0,
          startCharacter: 14,
        },
        length: 15,
        tokenType: TokenType.variable,
        token: '`database-name`',
      },
    ]);
  });

  test('Correctly colours ALTER DATABASE', async () => {
    const query =
      'ALTER DATABASE `topology-example` SET TOPOLOGY 1 PRIMARY SET ACCESS READ ONLY';

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'ALTER',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'DATABASE',
      },
      {
        position: {
          line: 0,
          startCharacter: 15,
        },
        length: 18,
        tokenType: TokenType.variable,
        token: '`topology-example`',
      },
      {
        position: {
          line: 0,
          startCharacter: 34,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 0,
          startCharacter: 38,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'TOPOLOGY',
      },
      {
        position: {
          line: 0,
          startCharacter: 47,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '1',
      },
      {
        position: {
          line: 0,
          startCharacter: 49,
        },
        length: 7,
        tokenType: TokenType.keyword,
        token: 'PRIMARY',
      },
      {
        position: {
          line: 0,
          startCharacter: 57,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 0,
          startCharacter: 61,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'ACCESS',
      },
      {
        position: {
          line: 0,
          startCharacter: 68,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'READ',
      },
      {
        position: {
          line: 0,
          startCharacter: 73,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'ONLY',
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
        tokenType: TokenType.keyword,
        token: 'SHOW',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 9,
        tokenType: TokenType.keyword,
        token: 'DATABASES',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 1,
          startCharacter: 12,
        },
        length: 4,
        tokenType: TokenType.variable,
        token: 'name',
      },
      {
        position: {
          line: 1,
          startCharacter: 16,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 18,
        },
        length: 13,
        tokenType: TokenType.variable,
        token: 'currentStatus',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'WHERE',
      },
      {
        position: {
          line: 2,
          startCharacter: 12,
        },
        length: 4,
        tokenType: TokenType.variable,
        token: 'name',
      },
      {
        position: {
          line: 2,
          startCharacter: 17,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'CONTAINS',
      },
      {
        position: {
          line: 2,
          startCharacter: 26,
        },
        length: 4,
        tokenType: TokenType.literal,
        token: "'my'",
      },
      {
        position: {
          line: 3,
          startCharacter: 6,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'AND',
      },
      {
        position: {
          line: 3,
          startCharacter: 10,
        },
        length: 13,
        tokenType: TokenType.variable,
        token: 'currentStatus',
      },
      {
        position: {
          line: 3,
          startCharacter: 24,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '=',
      },
      {
        position: {
          line: 3,
          startCharacter: 26,
        },
        length: 8,
        tokenType: TokenType.literal,
        token: "'online'",
      },
    ]);
  });

  test('Correctly colours CREATE ALIAS', async () => {
    const query = `CREATE OR REPLACE ALIAS \`composite-database-name\`.\`alias-in-composite-name\` 
      FOR DATABASE PROPERTIES { property = $value }
      AT $url
      USER user_name
      PASSWORD $password
    `;

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
        length: 2,
        tokenType: TokenType.keyword,
        token: 'OR',
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
        },
        length: 7,
        tokenType: TokenType.keyword,
        token: 'REPLACE',
      },
      {
        position: {
          line: 0,
          startCharacter: 18,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'ALIAS',
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 25,
        tokenType: TokenType.variable,
        token: '`composite-database-name`',
      },
      {
        position: {
          line: 0,
          startCharacter: 49,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 0,
          startCharacter: 50,
        },
        length: 25,
        tokenType: TokenType.variable,
        token: '`alias-in-composite-name`',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'FOR',
      },
      {
        position: {
          line: 1,
          startCharacter: 10,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'DATABASE',
      },
      {
        position: {
          line: 1,
          startCharacter: 19,
        },
        length: 10,
        tokenType: TokenType.variable,
        token: 'PROPERTIES',
      },
      {
        position: {
          line: 1,
          startCharacter: 30,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '{',
      },
      {
        position: {
          line: 1,
          startCharacter: 32,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'property',
      },
      {
        position: {
          line: 1,
          startCharacter: 41,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '=',
      },
      {
        position: {
          line: 1,
          startCharacter: 43,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '$',
      },
      {
        position: {
          line: 1,
          startCharacter: 44,
        },
        length: 5,
        tokenType: TokenType.none,
        token: 'value',
      },
      {
        position: {
          line: 1,
          startCharacter: 50,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '}',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 2,
        tokenType: TokenType.keyword,
        token: 'AT',
      },
      {
        position: {
          line: 2,
          startCharacter: 9,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '$',
      },
      {
        position: {
          line: 2,
          startCharacter: 10,
        },
        length: 3,
        tokenType: TokenType.none,
        token: 'url',
      },
      {
        position: {
          line: 3,
          startCharacter: 6,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'USER',
      },
      {
        position: {
          line: 3,
          startCharacter: 11,
        },
        length: 9,
        tokenType: TokenType.none,
        token: 'user_name',
      },
      {
        position: {
          line: 4,
          startCharacter: 6,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'PASSWORD',
      },
      {
        position: {
          line: 4,
          startCharacter: 15,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '$',
      },
      {
        position: {
          line: 4,
          startCharacter: 16,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'password',
      },
    ]);
  });

  test('Correctly colours ALTER ALIAS', async () => {
    const query = `ALTER ALIAS \`remote-database-alias\` IF EXISTS
      SET DATABASE
      USER user_name
      PASSWORD $password
    `;

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'ALTER',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'ALIAS',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
        },
        length: 23,
        tokenType: TokenType.variable,
        token: '`remote-database-alias`',
      },
      {
        position: {
          line: 0,
          startCharacter: 36,
        },
        length: 2,
        tokenType: TokenType.keyword,
        token: 'IF',
      },
      {
        position: {
          line: 0,
          startCharacter: 39,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'EXISTS',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 1,
          startCharacter: 10,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'DATABASE',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'USER',
      },
      {
        position: {
          line: 2,
          startCharacter: 11,
        },
        length: 9,
        tokenType: TokenType.parameter,
        token: 'user_name',
      },
      {
        position: {
          line: 3,
          startCharacter: 6,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'PASSWORD',
      },
      {
        position: {
          line: 3,
          startCharacter: 15,
        },
        length: 1,
        tokenType: TokenType.namespace,
        token: '$',
      },
      {
        position: {
          line: 3,
          startCharacter: 16,
        },
        length: 8,
        tokenType: TokenType.parameter,
        token: 'password',
      },
    ]);
  });

  test('Correctly colours DROP ALIAS', async () => {
    const query = 'DROP ALIAS `database-alias` IF EXISTS FOR DATABASE';

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'DROP',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'ALIAS',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 16,
        tokenType: TokenType.variable,
        token: '`database-alias`',
      },
      {
        position: {
          line: 0,
          startCharacter: 28,
        },
        length: 2,
        tokenType: TokenType.keyword,
        token: 'IF',
      },
      {
        position: {
          line: 0,
          startCharacter: 31,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'EXISTS',
      },
      {
        position: {
          line: 0,
          startCharacter: 38,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'FOR',
      },
      {
        position: {
          line: 0,
          startCharacter: 42,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'DATABASE',
      },
    ]);
  });

  test('Correctly colours SHOW ALIASES', async () => {
    const query = 'SHOW ALIASES FOR DATABASE YIELD *';

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
        token: 'ALIASES',
      },
      {
        position: {
          line: 0,
          startCharacter: 13,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'FOR',
      },
      {
        position: {
          line: 0,
          startCharacter: 17,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'DATABASE',
      },
      {
        position: {
          line: 0,
          startCharacter: 26,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 0,
          startCharacter: 32,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '*',
      },
    ]);
  });

  test('Correctly colours ENABLE SERVER', async () => {
    const query = "ENABLE SERVER 'serverId'";

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'ENABLE',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'SERVER',
      },
      {
        position: {
          line: 0,
          startCharacter: 14,
        },
        length: 10,
        tokenType: TokenType.literal,
        token: "'serverId'",
      },
    ]);
  });

  test('Correctly colours ALTER SERVER', async () => {
    const query = "ALTER SERVER 'name' SET OPTIONS {modeConstraint: 'PRIMARY'}";

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'ALTER',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'SERVER',
      },
      {
        position: {
          line: 0,
          startCharacter: 13,
        },
        length: 6,
        tokenType: TokenType.literal,
        token: "'name'",
      },
      {
        position: {
          line: 0,
          startCharacter: 20,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 7,
        tokenType: TokenType.keyword,
        token: 'OPTIONS',
      },
      {
        position: {
          line: 0,
          startCharacter: 32,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '{',
      },
      {
        position: {
          line: 0,
          startCharacter: 33,
        },
        length: 14,
        tokenType: TokenType.variable,
        token: 'modeConstraint',
      },
      {
        position: {
          line: 0,
          startCharacter: 47,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 49,
        },
        length: 9,
        tokenType: TokenType.literal,
        token: "'PRIMARY'",
      },
      {
        position: {
          line: 0,
          startCharacter: 58,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '}',
      },
    ]);
  });

  test('Correctly colours RENAME SERVER', async () => {
    const query = "RENAME SERVER 'oldName' TO 'newName'";

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'RENAME',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'SERVER',
      },
      {
        position: {
          line: 0,
          startCharacter: 14,
        },
        length: 9,
        tokenType: TokenType.literal,
        token: "'oldName'",
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 2,
        tokenType: TokenType.keyword,
        token: 'TO',
      },
      {
        position: {
          line: 0,
          startCharacter: 27,
        },
        length: 9,
        tokenType: TokenType.literal,
        token: "'newName'",
      },
    ]);
  });

  test('Correctly colours DEALLOCATE DATABASES', async () => {
    const query = "DEALLOCATE DATABASES FROM SERVER 'name'";

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 10,
        tokenType: TokenType.keyword,
        token: 'DEALLOCATE',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 9,
        tokenType: TokenType.keyword,
        token: 'DATABASES',
      },
      {
        position: {
          line: 0,
          startCharacter: 21,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'FROM',
      },
      {
        position: {
          line: 0,
          startCharacter: 26,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'SERVER',
      },
      {
        position: {
          line: 0,
          startCharacter: 33,
        },
        length: 6,
        tokenType: TokenType.literal,
        token: "'name'",
      },
    ]);
  });

  test('Correctly colours DEALLOCATE DATABASES', async () => {
    const query = 'REALLOCATE DATABASES';

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 10,
        tokenType: TokenType.keyword,
        token: 'REALLOCATE',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 9,
        tokenType: TokenType.keyword,
        token: 'DATABASES',
      },
    ]);
  });

  test('Correctly colours SHOW SERVERS', async () => {
    const query = 'SHOW SERVERS';

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
        token: 'SERVERS',
      },
    ]);
  });

  test('Correctly colours CREATE USER', async () => {
    const query = `CREATE USER user_name
      SET PASSWORD $password
      CHANGE NOT REQUIRED
      SET STATUS SUSPENDED
      SET HOME DATABASE \`database-name\`
    `;

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
        length: 4,
        tokenType: TokenType.keyword,
        token: 'USER',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
        },
        length: 9,
        tokenType: TokenType.parameter,
        token: 'user_name',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 1,
          startCharacter: 10,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'PASSWORD',
      },
      {
        position: {
          line: 1,
          startCharacter: 19,
        },
        length: 1,
        tokenType: TokenType.namespace,
        token: '$',
      },
      {
        position: {
          line: 1,
          startCharacter: 20,
        },
        length: 8,
        tokenType: TokenType.parameter,
        token: 'password',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'CHANGE',
      },
      {
        position: {
          line: 2,
          startCharacter: 13,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'NOT',
      },
      {
        position: {
          line: 2,
          startCharacter: 17,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'REQUIRED',
      },
      {
        position: {
          line: 3,
          startCharacter: 6,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 3,
          startCharacter: 10,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'STATUS',
      },
      {
        position: {
          line: 3,
          startCharacter: 17,
        },
        length: 9,
        tokenType: TokenType.keyword,
        token: 'SUSPENDED',
      },
      {
        position: {
          line: 4,
          startCharacter: 6,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 4,
          startCharacter: 10,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'HOME',
      },
      {
        position: {
          line: 4,
          startCharacter: 15,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'DATABASE',
      },
      {
        position: {
          line: 4,
          startCharacter: 24,
        },
        length: 15,
        tokenType: TokenType.variable,
        token: '`database-name`',
      },
    ]);
  });

  test('Correctly colours ALTER USER', async () => {
    const query = `ALTER USER user_name
      SET PASSWORD $password
      CHANGE NOT REQUIRED
      SET STATUS ACTIVE
      SET HOME DATABASE \`database-name\`
    `;

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'ALTER',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'USER',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 9,
        tokenType: TokenType.parameter,
        token: 'user_name',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 1,
          startCharacter: 10,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'PASSWORD',
      },
      {
        position: {
          line: 1,
          startCharacter: 19,
        },
        length: 1,
        tokenType: TokenType.namespace,
        token: '$',
      },
      {
        position: {
          line: 1,
          startCharacter: 20,
        },
        length: 8,
        tokenType: TokenType.parameter,
        token: 'password',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'CHANGE',
      },
      {
        position: {
          line: 2,
          startCharacter: 13,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'NOT',
      },
      {
        position: {
          line: 2,
          startCharacter: 17,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'REQUIRED',
      },
      {
        position: {
          line: 3,
          startCharacter: 6,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 3,
          startCharacter: 10,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'STATUS',
      },
      {
        position: {
          line: 3,
          startCharacter: 17,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'ACTIVE',
      },
      {
        position: {
          line: 4,
          startCharacter: 6,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 4,
          startCharacter: 10,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'HOME',
      },
      {
        position: {
          line: 4,
          startCharacter: 15,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'DATABASE',
      },
      {
        position: {
          line: 4,
          startCharacter: 24,
        },
        length: 15,
        tokenType: TokenType.variable,
        token: '`database-name`',
      },
    ]);
  });

  test('Correctly colours SHOW USERS', async () => {
    const query = `SHOW USERS
      WHERE suspended = true AND passwordChangeRequired
    `;

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
        length: 5,
        tokenType: TokenType.keyword,
        token: 'USERS',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'WHERE',
      },
      {
        position: {
          line: 1,
          startCharacter: 12,
        },
        length: 9,
        tokenType: TokenType.variable,
        token: 'suspended',
      },
      {
        position: {
          line: 1,
          startCharacter: 22,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '=',
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
          startCharacter: 29,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'AND',
      },
      {
        position: {
          line: 1,
          startCharacter: 33,
        },
        length: 22,
        tokenType: TokenType.variable,
        token: 'passwordChangeRequired',
      },
    ]);
  });

  test('Correctly colours CREATE ROLE', async () => {
    const query =
      'CREATE ROLE role_name IF NOT EXISTS AS COPY OF other_role_name';

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
        length: 4,
        tokenType: TokenType.keyword,
        token: 'ROLE',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
        },
        length: 9,
        tokenType: TokenType.parameter,
        token: 'role_name',
      },
      {
        position: {
          line: 0,
          startCharacter: 22,
        },
        length: 2,
        tokenType: TokenType.keyword,
        token: 'IF',
      },
      {
        position: {
          line: 0,
          startCharacter: 25,
        },
        length: 3,
        tokenType: TokenType.keyword,
        token: 'NOT',
      },
      {
        position: {
          line: 0,
          startCharacter: 29,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'EXISTS',
      },
      {
        position: {
          line: 0,
          startCharacter: 36,
        },
        length: 2,
        tokenType: TokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 0,
          startCharacter: 39,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'COPY',
      },
      {
        position: {
          line: 0,
          startCharacter: 44,
        },
        length: 2,
        tokenType: TokenType.keyword,
        token: 'OF',
      },
      {
        position: {
          line: 0,
          startCharacter: 47,
        },
        length: 15,
        tokenType: TokenType.parameter,
        token: 'other_role_name',
      },
    ]);
  });

  test('Correctly colours DROP ROLE', async () => {
    const query = 'CREATE ROLE role_name AS COPY OF other_role_name';

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
        length: 4,
        tokenType: TokenType.keyword,
        token: 'ROLE',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
        },
        length: 9,
        tokenType: TokenType.parameter,
        token: 'role_name',
      },
      {
        position: {
          line: 0,
          startCharacter: 22,
        },
        length: 2,
        tokenType: TokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 0,
          startCharacter: 25,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'COPY',
      },
      {
        position: {
          line: 0,
          startCharacter: 30,
        },
        length: 2,
        tokenType: TokenType.keyword,
        token: 'OF',
      },
      {
        position: {
          line: 0,
          startCharacter: 33,
        },
        length: 15,
        tokenType: TokenType.parameter,
        token: 'other_role_name',
      },
    ]);
  });

  test('Correctly colours SHOW ROLES', async () => {
    const query = `SHOW ROLES WITH USERS
      YIELD member, role
      WHERE member = $user
      RETURN role
    `;

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
        length: 5,
        tokenType: TokenType.keyword,
        token: 'ROLES',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'WITH',
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'USERS',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 1,
          startCharacter: 12,
        },
        length: 6,
        tokenType: TokenType.variable,
        token: 'member',
      },
      {
        position: {
          line: 1,
          startCharacter: 18,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 20,
        },
        length: 4,
        tokenType: TokenType.variable,
        token: 'role',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'WHERE',
      },
      {
        position: {
          line: 2,
          startCharacter: 12,
        },
        length: 6,
        tokenType: TokenType.variable,
        token: 'member',
      },
      {
        position: {
          line: 2,
          startCharacter: 19,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '=',
      },
      {
        position: {
          line: 2,
          startCharacter: 21,
        },
        length: 1,
        tokenType: TokenType.namespace,
        token: '$',
      },
      {
        position: {
          line: 2,
          startCharacter: 22,
        },
        length: 4,
        tokenType: TokenType.parameter,
        token: 'user',
      },
      {
        position: {
          line: 3,
          startCharacter: 6,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 3,
          startCharacter: 13,
        },
        length: 4,
        tokenType: TokenType.variable,
        token: 'role',
      },
    ]);
  });

  test('Correctly colours SHOW POPULATED ROLES', async () => {
    const query = 'SHOW POPULATED ROLES';

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
        length: 9,
        tokenType: TokenType.keyword,
        token: 'POPULATED',
      },
      {
        position: {
          line: 0,
          startCharacter: 15,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'ROLES',
      },
    ]);
  });

  test('Correctly colours GRANT ROLE', async () => {
    const query = 'GRANT ROLE role_name1, role_name2 TO user_name';

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'GRANT',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'ROLE',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 10,
        tokenType: TokenType.parameter,
        token: 'role_name1',
      },
      {
        position: {
          line: 0,
          startCharacter: 21,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 0,
          startCharacter: 23,
        },
        length: 10,
        tokenType: TokenType.parameter,
        token: 'role_name2',
      },
      {
        position: {
          line: 0,
          startCharacter: 34,
        },
        length: 2,
        tokenType: TokenType.keyword,
        token: 'TO',
      },
      {
        position: {
          line: 0,
          startCharacter: 37,
        },
        length: 9,
        tokenType: TokenType.parameter,
        token: 'user_name',
      },
    ]);
  });

  test('Correctly colours REVOKE ROLE', async () => {
    const query = 'REVOKE ROLE role_name FROM user_name';

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'REVOKE',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'ROLE',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
        },
        length: 9,
        tokenType: TokenType.parameter,
        token: 'role_name',
      },
      {
        position: {
          line: 0,
          startCharacter: 22,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'FROM',
      },
      {
        position: {
          line: 0,
          startCharacter: 27,
        },
        length: 9,
        tokenType: TokenType.parameter,
        token: 'user_name',
      },
    ]);
  });

  test('Correctly colours RENAME ROLE', async () => {
    const query = 'RENAME ROLE role_name TO other_role_name';

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'RENAME',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'ROLE',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
        },
        length: 9,
        tokenType: TokenType.parameter,
        token: 'role_name',
      },
      {
        position: {
          line: 0,
          startCharacter: 22,
        },
        length: 2,
        tokenType: TokenType.keyword,
        token: 'TO',
      },
      {
        position: {
          line: 0,
          startCharacter: 25,
        },
        length: 15,
        tokenType: TokenType.parameter,
        token: 'other_role_name',
      },
    ]);
  });

  test('Correctly colours SHOW ROLE', async () => {
    const query = 'SHOW ROLE role_name PRIVILEGES AS COMMANDS';

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
        length: 4,
        tokenType: TokenType.keyword,
        token: 'ROLE',
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
        },
        length: 9,
        tokenType: TokenType.parameter,
        token: 'role_name',
      },
      {
        position: {
          line: 0,
          startCharacter: 20,
        },
        length: 10,
        tokenType: TokenType.keyword,
        token: 'PRIVILEGES',
      },
      {
        position: {
          line: 0,
          startCharacter: 31,
        },
        length: 2,
        tokenType: TokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 0,
          startCharacter: 34,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'COMMANDS',
      },
    ]);
  });

  test('Correctly colours SHOW PRIVILEGES', async () => {
    const query = 'SHOW PRIVILEGES AS COMMANDS';

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
        length: 10,
        tokenType: TokenType.keyword,
        token: 'PRIVILEGES',
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
        },
        length: 2,
        tokenType: TokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 0,
          startCharacter: 19,
        },
        length: 8,
        tokenType: TokenType.keyword,
        token: 'COMMANDS',
      },
    ]);
  });

  test('Correctly colours SHOW USER PRIVILEGES', async () => {
    const query = 'SHOW USER user_name PRIVILEGES';

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
        length: 4,
        tokenType: TokenType.keyword,
        token: 'USER',
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
        },
        length: 9,
        tokenType: TokenType.parameter,
        token: 'user_name',
      },
      {
        position: {
          line: 0,
          startCharacter: 20,
        },
        length: 10,
        tokenType: TokenType.keyword,
        token: 'PRIVILEGES',
      },
    ]);
  });
});

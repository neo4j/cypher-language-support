import { BracketType } from '../../../highlighting/syntaxColouringHelpers';
import { CypherTokenType } from '../../../lexerSymbols';
import { testSyntaxColouring } from './helpers';

describe('Administration commands syntax colouring', () => {
  test('Correctly colours SHOW INDEXES', () => {
    const query = 'SHOW INDEXES YIELD *';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'SHOW',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 7,
        tokenType: CypherTokenType.keyword,
        token: 'INDEXES',
      },
      {
        position: {
          line: 0,
          startCharacter: 13,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 0,
          startCharacter: 19,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '*',
      },
    ]);
  });

  test('Correctly colours CREATE INDEX', () => {
    const query = 'CREATE INDEX index_name FOR (p:Person) ON (p.name)';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'CREATE',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'INDEX',
      },
      {
        position: {
          line: 0,
          startCharacter: 13,
        },
        length: 10,
        tokenType: CypherTokenType.symbolicName,
        token: 'index_name',
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'FOR',
      },
      {
        position: {
          line: 0,
          startCharacter: 28,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '(',
        bracketInfo: {
          bracketType: BracketType.parenthesis,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 0,
          startCharacter: 29,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'p',
      },
      {
        position: {
          line: 0,
          startCharacter: 30,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 31,
        },
        length: 6,
        tokenType: CypherTokenType.label,
        token: 'Person',
      },
      {
        position: {
          line: 0,
          startCharacter: 37,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ')',
        bracketInfo: {
          bracketType: BracketType.parenthesis,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 0,
          startCharacter: 39,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'ON',
      },
      {
        position: {
          line: 0,
          startCharacter: 42,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '(',
        bracketInfo: {
          bracketType: BracketType.parenthesis,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 0,
          startCharacter: 43,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'p',
      },
      {
        position: {
          line: 0,
          startCharacter: 44,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 0,
          startCharacter: 45,
        },
        length: 4,
        tokenType: CypherTokenType.property,
        token: 'name',
      },
      {
        position: {
          line: 0,
          startCharacter: 49,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ')',
        bracketInfo: {
          bracketType: BracketType.parenthesis,
          bracketLevel: 0,
        },
      },
    ]);
  });

  test('Correctly colours DROP INDEX', () => {
    const query = 'DROP INDEX index_name';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'DROP',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'INDEX',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 10,
        tokenType: CypherTokenType.symbolicName,
        token: 'index_name',
      },
    ]);
  });

  test('Correctly colours SHOW CONSTRAINTS', () => {
    const query = 'SHOW ALL CONSTRAINTS YIELD *';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'SHOW',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'ALL',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        length: 11,
        tokenType: CypherTokenType.keyword,
        token: 'CONSTRAINTS',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 21,
          startOffset: 21,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'YIELD',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 27,
          startOffset: 27,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '*',
        bracketInfo: undefined,
      },
    ]);
  });

  test('Correctly colours CREATE CONSTRAINT', () => {
    const query = `CREATE CONSTRAINT constraint_name IF NOT EXISTS
      FOR (p:Person)
      REQUIRE p.name IS UNIQUE
      OPTIONS {
        indexProvider: 'range-1.0'
      }`;

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'CREATE',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        length: 10,
        tokenType: CypherTokenType.keyword,
        token: 'CONSTRAINT',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 18,
          startOffset: 18,
        },
        length: 15,
        tokenType: CypherTokenType.symbolicName,
        token: 'constraint_name',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 34,
          startOffset: 34,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'IF',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 37,
          startOffset: 37,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'NOT',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 41,
          startOffset: 41,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'EXISTS',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 54,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'FOR',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 1,
          startCharacter: 10,
          startOffset: 58,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '(',
        bracketInfo: {
          bracketLevel: 0,
          bracketType: BracketType.parenthesis,
        },
      },
      {
        position: {
          line: 1,
          startCharacter: 11,
          startOffset: 59,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'p',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 1,
          startCharacter: 12,
          startOffset: 60,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 1,
          startCharacter: 13,
          startOffset: 61,
        },
        length: 6,
        tokenType: CypherTokenType.label,
        token: 'Person',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 1,
          startCharacter: 19,
          startOffset: 67,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ')',
        bracketInfo: {
          bracketLevel: 0,
          bracketType: BracketType.parenthesis,
        },
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 75,
        },
        length: 7,
        tokenType: CypherTokenType.keyword,
        token: 'REQUIRE',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 2,
          startCharacter: 14,
          startOffset: 83,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'p',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 2,
          startCharacter: 15,
          startOffset: 84,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 2,
          startCharacter: 16,
          startOffset: 85,
        },
        length: 4,
        tokenType: CypherTokenType.property,
        token: 'name',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 2,
          startCharacter: 21,
          startOffset: 90,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'IS',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 2,
          startCharacter: 24,
          startOffset: 93,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'UNIQUE',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 3,
          startCharacter: 6,
          startOffset: 106,
        },
        length: 7,
        tokenType: CypherTokenType.keyword,
        token: 'OPTIONS',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 3,
          startCharacter: 14,
          startOffset: 114,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '{',
        bracketInfo: {
          bracketLevel: 0,
          bracketType: BracketType.curly,
        },
      },
      {
        position: {
          line: 4,
          startCharacter: 8,
          startOffset: 124,
        },
        length: 13,
        tokenType: CypherTokenType.symbolicName,
        token: 'indexProvider',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 4,
          startCharacter: 21,
          startOffset: 137,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 4,
          startCharacter: 23,
          startOffset: 139,
        },
        length: 11,
        tokenType: CypherTokenType.stringLiteral,
        token: "'range-1.0'",
        bracketInfo: undefined,
      },
      {
        position: {
          line: 5,
          startCharacter: 6,
          startOffset: 157,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '}',
        bracketInfo: {
          bracketLevel: 0,
          bracketType: BracketType.curly,
        },
      },
    ]);
  });

  test('Correctly colours DROP CONSTRAINT', () => {
    const query = 'DROP CONSTRAINT constraint_name IF EXISTS';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'DROP',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        length: 10,
        tokenType: CypherTokenType.keyword,
        token: 'CONSTRAINT',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
          startOffset: 16,
        },
        length: 15,
        tokenType: CypherTokenType.symbolicName,
        token: 'constraint_name',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 32,
          startOffset: 32,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'IF',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 35,
          startOffset: 35,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'EXISTS',
        bracketInfo: undefined,
      },
    ]);
  });

  test('Correctly colours SHOW FUNCTIONS', () => {
    const query = 'SHOW FUNCTIONS EXECUTABLE BY user_name';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'SHOW',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 9,
        tokenType: CypherTokenType.keyword,
        token: 'FUNCTIONS',
      },
      {
        position: {
          line: 0,
          startCharacter: 15,
        },
        length: 10,
        tokenType: CypherTokenType.keyword,
        token: 'EXECUTABLE',
      },
      {
        position: {
          line: 0,
          startCharacter: 26,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'BY',
      },
      {
        position: {
          line: 0,
          startCharacter: 29,
        },
        length: 9,
        tokenType: CypherTokenType.symbolicName,
        token: 'user_name',
      },
    ]);
  });

  test('Correctly colours SHOW PROCEDURES', () => {
    const query = 'SHOW PROCEDURES EXECUTABLE BY user_name';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'SHOW',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 10,
        tokenType: CypherTokenType.keyword,
        token: 'PROCEDURES',
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
        },
        length: 10,
        tokenType: CypherTokenType.keyword,
        token: 'EXECUTABLE',
      },
      {
        position: {
          line: 0,
          startCharacter: 27,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'BY',
      },
      {
        position: {
          line: 0,
          startCharacter: 30,
        },
        length: 9,
        tokenType: CypherTokenType.symbolicName,
        token: 'user_name',
      },
    ]);
  });

  test('Correctly colours SHOW SETTINGS', () => {
    const query =
      "SHOW SETTINGS 'server.bolt.advertised_address', 'server.bolt.listen_address' YIELD *";

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'SHOW',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'SETTINGS',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 14,
          startOffset: 14,
        },
        length: 32,
        tokenType: CypherTokenType.stringLiteral,
        token: "'server.bolt.advertised_address'",
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 46,
          startOffset: 46,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 48,
          startOffset: 48,
        },
        length: 28,
        tokenType: CypherTokenType.stringLiteral,
        token: "'server.bolt.listen_address'",
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 77,
          startOffset: 77,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'YIELD',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 83,
          startOffset: 83,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '*',
        bracketInfo: undefined,
      },
    ]);
  });

  test('Correctly colours SHOW TRANSACTION / TERMINATE TRANSACTIONS', () => {
    const query = `SHOW TRANSACTIONS
      YIELD transactionId AS txId, username
      WHERE username = 'user_name'
    TERMINATE TRANSACTIONS txId
      YIELD message
      WHERE NOT message = 'Transaction terminated.'
      RETURN txId
    `;
    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'SHOW',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 12,
        tokenType: CypherTokenType.keyword,
        token: 'TRANSACTIONS',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 1,
          startCharacter: 12,
        },
        length: 13,
        tokenType: CypherTokenType.variable,
        token: 'transactionId',
      },
      {
        position: {
          line: 1,
          startCharacter: 26,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 1,
          startCharacter: 29,
        },
        length: 4,
        tokenType: CypherTokenType.variable,
        token: 'txId',
      },
      {
        position: {
          line: 1,
          startCharacter: 33,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 35,
        },
        length: 8,
        tokenType: CypherTokenType.variable,
        token: 'username',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'WHERE',
      },
      {
        position: {
          line: 2,
          startCharacter: 12,
        },
        length: 8,
        tokenType: CypherTokenType.variable,
        token: 'username',
      },
      {
        position: {
          line: 2,
          startCharacter: 21,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '=',
      },
      {
        position: {
          line: 2,
          startCharacter: 23,
        },
        length: 11,
        tokenType: CypherTokenType.stringLiteral,
        token: "'user_name'",
      },
      {
        position: {
          line: 3,
          startCharacter: 4,
        },
        length: 9,
        tokenType: CypherTokenType.keyword,
        token: 'TERMINATE',
      },
      {
        position: {
          line: 3,
          startCharacter: 14,
        },
        length: 12,
        tokenType: CypherTokenType.keyword,
        token: 'TRANSACTIONS',
      },
      {
        position: {
          line: 3,
          startCharacter: 27,
        },
        length: 4,
        tokenType: CypherTokenType.variable,
        token: 'txId',
      },
      {
        position: {
          line: 4,
          startCharacter: 6,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 4,
          startCharacter: 12,
        },
        length: 7,
        tokenType: CypherTokenType.variable,
        token: 'message',
      },
      {
        position: {
          line: 5,
          startCharacter: 6,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'WHERE',
      },
      {
        position: {
          line: 5,
          startCharacter: 12,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'NOT',
      },
      {
        position: {
          line: 5,
          startCharacter: 16,
        },
        length: 7,
        tokenType: CypherTokenType.variable,
        token: 'message',
      },
      {
        position: {
          line: 5,
          startCharacter: 24,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '=',
      },
      {
        position: {
          line: 5,
          startCharacter: 26,
        },
        length: 25,
        tokenType: CypherTokenType.stringLiteral,
        token: "'Transaction terminated.'",
      },
      {
        position: {
          line: 6,
          startCharacter: 6,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 6,
          startCharacter: 13,
        },
        length: 4,
        tokenType: CypherTokenType.variable,
        token: 'txId',
      },
    ]);
  });

  test('Correctly colours CREATE DATABASE', () => {
    const query =
      'CREATE DATABASE `topology-example` IF NOT EXISTS TOPOLOGY 1 PRIMARY 0 SECONDARIES';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'CREATE',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'DATABASE',
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
        },
        length: 18,
        tokenType: CypherTokenType.symbolicName,
        token: '`topology-example`',
      },
      {
        position: {
          line: 0,
          startCharacter: 35,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'IF',
      },
      {
        position: {
          line: 0,
          startCharacter: 38,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'NOT',
      },
      {
        position: {
          line: 0,
          startCharacter: 42,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'EXISTS',
      },
      {
        position: {
          line: 0,
          startCharacter: 49,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'TOPOLOGY',
      },
      {
        position: {
          line: 0,
          startCharacter: 58,
        },
        length: 1,
        tokenType: CypherTokenType.numberLiteral,
        token: '1',
      },
      {
        position: {
          line: 0,
          startCharacter: 60,
        },
        length: 7,
        tokenType: CypherTokenType.keyword,
        token: 'PRIMARY',
      },
      {
        position: {
          line: 0,
          startCharacter: 68,
        },
        length: 1,
        tokenType: CypherTokenType.numberLiteral,
        token: '0',
      },
      {
        position: {
          line: 0,
          startCharacter: 70,
        },
        length: 11,
        tokenType: CypherTokenType.keyword,
        token: 'SECONDARIES',
      },
    ]);
  });

  test('Correctly colours START DATABASE', () => {
    const query = 'START DATABASE `database-name`';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'START',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'DATABASE',
      },
      {
        position: {
          line: 0,
          startCharacter: 15,
        },
        length: 15,
        tokenType: CypherTokenType.symbolicName,
        token: '`database-name`',
      },
    ]);
  });

  test('Correctly colours STOP DATABASE', () => {
    const query = 'STOP DATABASE `database-name`';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'STOP',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'DATABASE',
      },
      {
        position: {
          line: 0,
          startCharacter: 14,
        },
        length: 15,
        tokenType: CypherTokenType.symbolicName,
        token: '`database-name`',
      },
    ]);
  });

  test('Correctly colours ALTER DATABASE', () => {
    const query =
      'ALTER DATABASE `topology-example` SET TOPOLOGY 1 PRIMARY SET ACCESS READ ONLY';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'ALTER',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'DATABASE',
      },
      {
        position: {
          line: 0,
          startCharacter: 15,
        },
        length: 18,
        tokenType: CypherTokenType.symbolicName,
        token: '`topology-example`',
      },
      {
        position: {
          line: 0,
          startCharacter: 34,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 0,
          startCharacter: 38,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'TOPOLOGY',
      },
      {
        position: {
          line: 0,
          startCharacter: 47,
        },
        length: 1,
        tokenType: CypherTokenType.numberLiteral,
        token: '1',
      },
      {
        position: {
          line: 0,
          startCharacter: 49,
        },
        length: 7,
        tokenType: CypherTokenType.keyword,
        token: 'PRIMARY',
      },
      {
        position: {
          line: 0,
          startCharacter: 57,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 0,
          startCharacter: 61,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'ACCESS',
      },
      {
        position: {
          line: 0,
          startCharacter: 68,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'READ',
      },
      {
        position: {
          line: 0,
          startCharacter: 73,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'ONLY',
      },
    ]);
  });

  test('Correctly colours SHOW DATABASES', () => {
    const query = `SHOW DATABASES
      YIELD name, currentStatus
      WHERE name CONTAINS 'my'
      AND currentStatus = 'online'
    `;
    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'SHOW',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 9,
        tokenType: CypherTokenType.keyword,
        token: 'DATABASES',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 1,
          startCharacter: 12,
        },
        length: 4,
        tokenType: CypherTokenType.variable,
        token: 'name',
      },
      {
        position: {
          line: 1,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 18,
        },
        length: 13,
        tokenType: CypherTokenType.variable,
        token: 'currentStatus',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'WHERE',
      },
      {
        position: {
          line: 2,
          startCharacter: 12,
        },
        length: 4,
        tokenType: CypherTokenType.variable,
        token: 'name',
      },
      {
        position: {
          line: 2,
          startCharacter: 17,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'CONTAINS',
      },
      {
        position: {
          line: 2,
          startCharacter: 26,
        },
        length: 4,
        tokenType: CypherTokenType.stringLiteral,
        token: "'my'",
      },
      {
        position: {
          line: 3,
          startCharacter: 6,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'AND',
      },
      {
        position: {
          line: 3,
          startCharacter: 10,
        },
        length: 13,
        tokenType: CypherTokenType.variable,
        token: 'currentStatus',
      },
      {
        position: {
          line: 3,
          startCharacter: 24,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '=',
      },
      {
        position: {
          line: 3,
          startCharacter: 26,
        },
        length: 8,
        tokenType: CypherTokenType.stringLiteral,
        token: "'online'",
      },
    ]);
  });

  test('Correctly colours CREATE ALIAS', () => {
    const query = `CREATE OR REPLACE ALIAS \`composite-database-name\`.\`alias-in-composite-name\` 
      FOR DATABASE \`database-name\`
      AT $url
      USER user_name
      PASSWORD $password
      PROPERTIES { property: $value }
    `;

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'CREATE',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'OR',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
          startOffset: 10,
        },
        length: 7,
        tokenType: CypherTokenType.keyword,
        token: 'REPLACE',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 18,
          startOffset: 18,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'ALIAS',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
          startOffset: 24,
        },
        length: 25,
        tokenType: CypherTokenType.symbolicName,
        token: '`composite-database-name`',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 49,
          startOffset: 49,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 50,
          startOffset: 50,
        },
        length: 25,
        tokenType: CypherTokenType.symbolicName,
        token: '`alias-in-composite-name`',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 83,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'FOR',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 1,
          startCharacter: 10,
          startOffset: 87,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'DATABASE',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 1,
          startCharacter: 19,
          startOffset: 96,
        },
        length: 15,
        tokenType: CypherTokenType.symbolicName,
        token: '`database-name`',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 118,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'AT',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 2,
          startCharacter: 9,
          startOffset: 121,
        },
        length: 1,
        tokenType: CypherTokenType.paramDollar,
        token: '$',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 2,
          startCharacter: 10,
          startOffset: 122,
        },
        length: 3,
        tokenType: CypherTokenType.paramValue,
        token: 'url',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 3,
          startCharacter: 6,
          startOffset: 132,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'USER',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 3,
          startCharacter: 11,
          startOffset: 137,
        },
        length: 9,
        tokenType: CypherTokenType.symbolicName,
        token: 'user_name',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 4,
          startCharacter: 6,
          startOffset: 153,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'PASSWORD',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 4,
          startCharacter: 15,
          startOffset: 162,
        },
        length: 1,
        tokenType: CypherTokenType.paramDollar,
        token: '$',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 4,
          startCharacter: 16,
          startOffset: 163,
        },
        length: 8,
        tokenType: CypherTokenType.paramValue,
        token: 'password',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 5,
          startCharacter: 6,
          startOffset: 178,
        },
        length: 10,
        tokenType: CypherTokenType.keyword,
        token: 'PROPERTIES',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 5,
          startCharacter: 17,
          startOffset: 189,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '{',
        bracketInfo: {
          bracketLevel: 0,
          bracketType: BracketType.curly,
        },
      },
      {
        position: {
          line: 5,
          startCharacter: 19,
          startOffset: 191,
        },
        length: 8,
        tokenType: CypherTokenType.symbolicName,
        token: 'property',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 5,
          startCharacter: 27,
          startOffset: 199,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 5,
          startCharacter: 29,
          startOffset: 201,
        },
        length: 1,
        tokenType: CypherTokenType.paramDollar,
        token: '$',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 5,
          startCharacter: 30,
          startOffset: 202,
        },
        length: 5,
        tokenType: CypherTokenType.paramValue,
        token: 'value',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 5,
          startCharacter: 36,
          startOffset: 208,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '}',
        bracketInfo: {
          bracketLevel: 0,
          bracketType: BracketType.curly,
        },
      },
    ]);
  });

  test('Correctly colours ALTER ALIAS', () => {
    const query = `ALTER ALIAS \`remote-database-alias\` IF EXISTS
      SET DATABASE
      USER user_name
      PASSWORD $password
    `;

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'ALTER',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'ALIAS',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
        },
        length: 23,
        tokenType: CypherTokenType.symbolicName,
        token: '`remote-database-alias`',
      },
      {
        position: {
          line: 0,
          startCharacter: 36,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'IF',
      },
      {
        position: {
          line: 0,
          startCharacter: 39,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'EXISTS',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 1,
          startCharacter: 10,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'DATABASE',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'USER',
      },
      {
        position: {
          line: 2,
          startCharacter: 11,
        },
        length: 9,
        tokenType: CypherTokenType.symbolicName,
        token: 'user_name',
      },
      {
        position: {
          line: 3,
          startCharacter: 6,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'PASSWORD',
      },
      {
        position: {
          line: 3,
          startCharacter: 15,
        },
        length: 1,
        tokenType: CypherTokenType.paramDollar,
        token: '$',
      },
      {
        position: {
          line: 3,
          startCharacter: 16,
        },
        length: 8,
        tokenType: CypherTokenType.paramValue,
        token: 'password',
      },
    ]);
  });

  test('Correctly colours DROP ALIAS', () => {
    const query = 'DROP ALIAS `database-alias` IF EXISTS FOR DATABASE';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'DROP',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'ALIAS',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 16,
        tokenType: CypherTokenType.symbolicName,
        token: '`database-alias`',
      },
      {
        position: {
          line: 0,
          startCharacter: 28,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'IF',
      },
      {
        position: {
          line: 0,
          startCharacter: 31,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'EXISTS',
      },
      {
        position: {
          line: 0,
          startCharacter: 38,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'FOR',
      },
      {
        position: {
          line: 0,
          startCharacter: 42,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'DATABASE',
      },
    ]);
  });

  test('Correctly colours SHOW ALIASES', () => {
    const query = 'SHOW ALIASES FOR DATABASE YIELD *';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'SHOW',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 7,
        tokenType: CypherTokenType.keyword,
        token: 'ALIASES',
      },
      {
        position: {
          line: 0,
          startCharacter: 13,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'FOR',
      },
      {
        position: {
          line: 0,
          startCharacter: 17,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'DATABASE',
      },
      {
        position: {
          line: 0,
          startCharacter: 26,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 0,
          startCharacter: 32,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '*',
      },
    ]);
  });

  test('Correctly colours ENABLE SERVER', () => {
    const query = "ENABLE SERVER 'serverId'";

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'ENABLE',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'SERVER',
      },
      {
        position: {
          line: 0,
          startCharacter: 14,
        },
        length: 10,
        tokenType: CypherTokenType.stringLiteral,
        token: "'serverId'",
      },
    ]);
  });

  test('Correctly colours ALTER SERVER', () => {
    const query = "ALTER SERVER 'name' SET OPTIONS {modeConstraint: 'PRIMARY'}";

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'ALTER',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'SERVER',
      },
      {
        position: {
          line: 0,
          startCharacter: 13,
        },
        length: 6,
        tokenType: CypherTokenType.stringLiteral,
        token: "'name'",
      },
      {
        position: {
          line: 0,
          startCharacter: 20,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 7,
        tokenType: CypherTokenType.keyword,
        token: 'OPTIONS',
      },
      {
        position: {
          line: 0,
          startCharacter: 32,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '{',
        bracketInfo: {
          bracketType: BracketType.curly,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 0,
          startCharacter: 33,
        },
        length: 14,
        tokenType: CypherTokenType.symbolicName,
        token: 'modeConstraint',
      },
      {
        position: {
          line: 0,
          startCharacter: 47,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 49,
        },
        length: 9,
        tokenType: CypherTokenType.stringLiteral,
        token: "'PRIMARY'",
      },
      {
        position: {
          line: 0,
          startCharacter: 58,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '}',
        bracketInfo: {
          bracketType: BracketType.curly,
          bracketLevel: 0,
        },
      },
    ]);
  });

  test('Correctly colours RENAME SERVER', () => {
    const query = "RENAME SERVER 'oldName' TO 'newName'";

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'RENAME',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'SERVER',
      },
      {
        position: {
          line: 0,
          startCharacter: 14,
        },
        length: 9,
        tokenType: CypherTokenType.stringLiteral,
        token: "'oldName'",
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'TO',
      },
      {
        position: {
          line: 0,
          startCharacter: 27,
        },
        length: 9,
        tokenType: CypherTokenType.stringLiteral,
        token: "'newName'",
      },
    ]);
  });

  test('Correctly colours DEALLOCATE DATABASES', () => {
    const query = "DEALLOCATE DATABASES FROM SERVER 'name'";

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 10,
        tokenType: CypherTokenType.keyword,
        token: 'DEALLOCATE',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 9,
        tokenType: CypherTokenType.keyword,
        token: 'DATABASES',
      },
      {
        position: {
          line: 0,
          startCharacter: 21,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'FROM',
      },
      {
        position: {
          line: 0,
          startCharacter: 26,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'SERVER',
      },
      {
        position: {
          line: 0,
          startCharacter: 33,
        },
        length: 6,
        tokenType: CypherTokenType.stringLiteral,
        token: "'name'",
      },
    ]);
  });

  test('Correctly colours REALLOCATE DATABASES', () => {
    const query = 'REALLOCATE DATABASES';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 10,
        tokenType: CypherTokenType.keyword,
        token: 'REALLOCATE',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 9,
        tokenType: CypherTokenType.keyword,
        token: 'DATABASES',
      },
    ]);
  });

  test('Correctly colours SHOW SERVERS', () => {
    const query = 'SHOW SERVERS';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'SHOW',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 7,
        tokenType: CypherTokenType.keyword,
        token: 'SERVERS',
      },
    ]);
  });

  test('Correctly colours CREATE USER', () => {
    const query = `CREATE USER user_name
      SET PASSWORD $password
      CHANGE NOT REQUIRED
      SET STATUS SUSPENDED
      SET HOME DATABASE \`database-name\`
    `;

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'CREATE',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'USER',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
        },
        length: 9,
        tokenType: CypherTokenType.symbolicName,
        token: 'user_name',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 1,
          startCharacter: 10,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'PASSWORD',
      },
      {
        position: {
          line: 1,
          startCharacter: 19,
        },
        length: 1,
        tokenType: CypherTokenType.paramDollar,
        token: '$',
      },
      {
        position: {
          line: 1,
          startCharacter: 20,
        },
        length: 8,
        tokenType: CypherTokenType.paramValue,
        token: 'password',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'CHANGE',
      },
      {
        position: {
          line: 2,
          startCharacter: 13,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'NOT',
      },
      {
        position: {
          line: 2,
          startCharacter: 17,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'REQUIRED',
      },
      {
        position: {
          line: 3,
          startCharacter: 6,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 3,
          startCharacter: 10,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'STATUS',
      },
      {
        position: {
          line: 3,
          startCharacter: 17,
        },
        length: 9,
        tokenType: CypherTokenType.keyword,
        token: 'SUSPENDED',
      },
      {
        position: {
          line: 4,
          startCharacter: 6,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 4,
          startCharacter: 10,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'HOME',
      },
      {
        position: {
          line: 4,
          startCharacter: 15,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'DATABASE',
      },
      {
        position: {
          line: 4,
          startCharacter: 24,
        },
        length: 15,
        tokenType: CypherTokenType.symbolicName,
        token: '`database-name`',
      },
    ]);
  });

  test('Correctly colours ALTER USER', () => {
    const query = `ALTER USER user_name
      SET PASSWORD $password
      CHANGE NOT REQUIRED
      SET STATUS ACTIVE
      SET HOME DATABASE \`database-name\`
    `;

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'ALTER',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'USER',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 9,
        tokenType: CypherTokenType.symbolicName,
        token: 'user_name',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 1,
          startCharacter: 10,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'PASSWORD',
      },
      {
        position: {
          line: 1,
          startCharacter: 19,
        },
        length: 1,
        tokenType: CypherTokenType.paramDollar,
        token: '$',
      },
      {
        position: {
          line: 1,
          startCharacter: 20,
        },
        length: 8,
        tokenType: CypherTokenType.paramValue,
        token: 'password',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'CHANGE',
      },
      {
        position: {
          line: 2,
          startCharacter: 13,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'NOT',
      },
      {
        position: {
          line: 2,
          startCharacter: 17,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'REQUIRED',
      },
      {
        position: {
          line: 3,
          startCharacter: 6,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 3,
          startCharacter: 10,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'STATUS',
      },
      {
        position: {
          line: 3,
          startCharacter: 17,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'ACTIVE',
      },
      {
        position: {
          line: 4,
          startCharacter: 6,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 4,
          startCharacter: 10,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'HOME',
      },
      {
        position: {
          line: 4,
          startCharacter: 15,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'DATABASE',
      },
      {
        position: {
          line: 4,
          startCharacter: 24,
        },
        length: 15,
        tokenType: CypherTokenType.symbolicName,
        token: '`database-name`',
      },
    ]);
  });

  test('Correctly colours SHOW USERS', () => {
    const query = `SHOW USERS
      WHERE suspended = true AND passwordChangeRequired
    `;

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'SHOW',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'USERS',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'WHERE',
      },
      {
        position: {
          line: 1,
          startCharacter: 12,
        },
        length: 9,
        tokenType: CypherTokenType.variable,
        token: 'suspended',
      },
      {
        position: {
          line: 1,
          startCharacter: 22,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '=',
      },
      {
        position: {
          line: 1,
          startCharacter: 24,
        },
        length: 4,
        tokenType: CypherTokenType.booleanLiteral,
        token: 'true',
      },
      {
        position: {
          line: 1,
          startCharacter: 29,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'AND',
      },
      {
        position: {
          line: 1,
          startCharacter: 33,
        },
        length: 22,
        tokenType: CypherTokenType.variable,
        token: 'passwordChangeRequired',
      },
    ]);
  });

  test('Correctly colours CREATE ROLE', () => {
    const query =
      'CREATE ROLE role_name IF NOT EXISTS AS COPY OF other_role_name';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'CREATE',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'ROLE',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
        },
        length: 9,
        tokenType: CypherTokenType.symbolicName,
        token: 'role_name',
      },
      {
        position: {
          line: 0,
          startCharacter: 22,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'IF',
      },
      {
        position: {
          line: 0,
          startCharacter: 25,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'NOT',
      },
      {
        position: {
          line: 0,
          startCharacter: 29,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'EXISTS',
      },
      {
        position: {
          line: 0,
          startCharacter: 36,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 0,
          startCharacter: 39,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'COPY',
      },
      {
        position: {
          line: 0,
          startCharacter: 44,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'OF',
      },
      {
        position: {
          line: 0,
          startCharacter: 47,
        },
        length: 15,
        tokenType: CypherTokenType.symbolicName,
        token: 'other_role_name',
      },
    ]);
  });

  test('Correctly colours DROP ROLE', () => {
    const query = 'DROP ROLE role_name';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'DROP',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'ROLE',
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
        },
        length: 9,
        tokenType: CypherTokenType.symbolicName,
        token: 'role_name',
      },
    ]);
  });

  test('Correctly colours SHOW ROLES', () => {
    const query = `SHOW ROLES WITH USERS
      YIELD member, role
      WHERE member = $user
      RETURN role
    `;

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'SHOW',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'ROLES',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'WITH',
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'USERS',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 1,
          startCharacter: 12,
        },
        length: 6,
        tokenType: CypherTokenType.variable,
        token: 'member',
      },
      {
        position: {
          line: 1,
          startCharacter: 18,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 20,
        },
        length: 4,
        tokenType: CypherTokenType.variable,
        token: 'role',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'WHERE',
      },
      {
        position: {
          line: 2,
          startCharacter: 12,
        },
        length: 6,
        tokenType: CypherTokenType.variable,
        token: 'member',
      },
      {
        position: {
          line: 2,
          startCharacter: 19,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '=',
      },
      {
        position: {
          line: 2,
          startCharacter: 21,
        },
        length: 1,
        tokenType: CypherTokenType.paramDollar,
        token: '$',
      },
      {
        position: {
          line: 2,
          startCharacter: 22,
        },
        length: 4,
        tokenType: CypherTokenType.paramValue,
        token: 'user',
      },
      {
        position: {
          line: 3,
          startCharacter: 6,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 3,
          startCharacter: 13,
        },
        length: 4,
        tokenType: CypherTokenType.variable,
        token: 'role',
      },
    ]);
  });

  test('Correctly colours SHOW POPULATED ROLES', () => {
    const query = 'SHOW POPULATED ROLES';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'SHOW',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 9,
        tokenType: CypherTokenType.keyword,
        token: 'POPULATED',
      },
      {
        position: {
          line: 0,
          startCharacter: 15,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'ROLES',
      },
    ]);
  });

  test('Correctly colours GRANT ROLE', () => {
    const query = 'GRANT ROLE role_name1, role_name2 TO user_name';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'GRANT',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'ROLE',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 10,
        tokenType: CypherTokenType.symbolicName,
        token: 'role_name1',
      },
      {
        position: {
          line: 0,
          startCharacter: 21,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 0,
          startCharacter: 23,
        },
        length: 10,
        tokenType: CypherTokenType.symbolicName,
        token: 'role_name2',
      },
      {
        position: {
          line: 0,
          startCharacter: 34,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'TO',
      },
      {
        position: {
          line: 0,
          startCharacter: 37,
        },
        length: 9,
        tokenType: CypherTokenType.symbolicName,
        token: 'user_name',
      },
    ]);
  });

  test('Correctly colours REVOKE ROLE', () => {
    const query = 'REVOKE ROLE role_name FROM user_name';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'REVOKE',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'ROLE',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
        },
        length: 9,
        tokenType: CypherTokenType.symbolicName,
        token: 'role_name',
      },
      {
        position: {
          line: 0,
          startCharacter: 22,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'FROM',
      },
      {
        position: {
          line: 0,
          startCharacter: 27,
        },
        length: 9,
        tokenType: CypherTokenType.symbolicName,
        token: 'user_name',
      },
    ]);
  });

  test('Correctly colours RENAME ROLE', () => {
    const query = 'RENAME ROLE role_name TO other_role_name';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'RENAME',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'ROLE',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
        },
        length: 9,
        tokenType: CypherTokenType.symbolicName,
        token: 'role_name',
      },
      {
        position: {
          line: 0,
          startCharacter: 22,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'TO',
      },
      {
        position: {
          line: 0,
          startCharacter: 25,
        },
        length: 15,
        tokenType: CypherTokenType.symbolicName,
        token: 'other_role_name',
      },
    ]);
  });

  test('Correctly colours SHOW ROLE', () => {
    const query = 'SHOW ROLE role_name PRIVILEGES AS COMMANDS';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'SHOW',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'ROLE',
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
        },
        length: 9,
        tokenType: CypherTokenType.symbolicName,
        token: 'role_name',
      },
      {
        position: {
          line: 0,
          startCharacter: 20,
        },
        length: 10,
        tokenType: CypherTokenType.keyword,
        token: 'PRIVILEGES',
      },
      {
        position: {
          line: 0,
          startCharacter: 31,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 0,
          startCharacter: 34,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'COMMANDS',
      },
    ]);
  });

  test('Correctly colours GRANT PRIVILEGE', () => {
    const query = 'GRANT EXECUTE BOOSTED FUNCTIONS * ON DBMS TO role_name';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'GRANT',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
          startOffset: 6,
        },
        length: 7,
        tokenType: CypherTokenType.keyword,
        token: 'EXECUTE',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 14,
          startOffset: 14,
        },
        length: 7,
        tokenType: CypherTokenType.keyword,
        token: 'BOOSTED',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 22,
          startOffset: 22,
        },
        length: 9,
        tokenType: CypherTokenType.keyword,
        token: 'FUNCTIONS',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 32,
          startOffset: 32,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '*',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 34,
          startOffset: 34,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'ON',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 37,
          startOffset: 37,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'DBMS',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 42,
          startOffset: 42,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'TO',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 45,
          startOffset: 45,
        },
        length: 9,
        tokenType: CypherTokenType.symbolicName,
        token: 'role_name',
        bracketInfo: undefined,
      },
    ]);
  });

  test('Correctly colours REVOKE PRIVILEGE', () => {
    const query = 'REVOKE IMPERSONATE (*) ON DBMS FROM role_name';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'REVOKE',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        length: 11,
        tokenType: CypherTokenType.keyword,
        token: 'IMPERSONATE',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 19,
          startOffset: 19,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '(',
        bracketInfo: {
          bracketLevel: 0,
          bracketType: BracketType.parenthesis,
        },
      },
      {
        position: {
          line: 0,
          startCharacter: 20,
          startOffset: 20,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '*',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 21,
          startOffset: 21,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ')',
        bracketInfo: {
          bracketLevel: 0,
          bracketType: BracketType.parenthesis,
        },
      },
      {
        position: {
          line: 0,
          startCharacter: 23,
          startOffset: 23,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'ON',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 26,
          startOffset: 26,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'DBMS',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 31,
          startOffset: 31,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'FROM',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 36,
          startOffset: 36,
        },
        length: 9,
        tokenType: CypherTokenType.symbolicName,
        token: 'role_name',
        bracketInfo: undefined,
      },
    ]);
  });

  test('Correctly colours DENY PRIVILEGE', () => {
    const query =
      'DENY IMPERSONATE (user_name1, user_name2) ON DBMS TO role_name';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'DENY',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        length: 11,
        tokenType: CypherTokenType.keyword,
        token: 'IMPERSONATE',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 17,
          startOffset: 17,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '(',
        bracketInfo: {
          bracketLevel: 0,
          bracketType: BracketType.parenthesis,
        },
      },
      {
        position: {
          line: 0,
          startCharacter: 18,
          startOffset: 18,
        },
        length: 10,
        tokenType: CypherTokenType.symbolicName,
        token: 'user_name1',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 28,
          startOffset: 28,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 30,
          startOffset: 30,
        },
        length: 10,
        tokenType: CypherTokenType.symbolicName,
        token: 'user_name2',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 40,
          startOffset: 40,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ')',
        bracketInfo: {
          bracketLevel: 0,
          bracketType: BracketType.parenthesis,
        },
      },
      {
        position: {
          line: 0,
          startCharacter: 42,
          startOffset: 42,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'ON',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 45,
          startOffset: 45,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'DBMS',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 50,
          startOffset: 50,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'TO',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 53,
          startOffset: 53,
        },
        length: 9,
        tokenType: CypherTokenType.symbolicName,
        token: 'role_name',
        bracketInfo: undefined,
      },
    ]);
  });

  test('Correctly colours SHOW PRIVILEGES', () => {
    const query = 'SHOW PRIVILEGES AS COMMANDS';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'SHOW',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 10,
        tokenType: CypherTokenType.keyword,
        token: 'PRIVILEGES',
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 0,
          startCharacter: 19,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'COMMANDS',
      },
    ]);
  });

  test('Correctly colours SHOW USER PRIVILEGES', () => {
    const query = 'SHOW USER user_name PRIVILEGES';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'SHOW',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'USER',
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
        },
        length: 9,
        tokenType: CypherTokenType.symbolicName,
        token: 'user_name',
      },
      {
        position: {
          line: 0,
          startCharacter: 20,
        },
        length: 10,
        tokenType: CypherTokenType.keyword,
        token: 'PRIVILEGES',
      },
    ]);
  });
});

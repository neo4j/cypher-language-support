import { applySyntaxColouring } from '../../../highlighting/syntaxColouring';

describe('Administration commands syntax colouring', () => {
  test('Correctly colours SHOW INDEXES', () => {
    const query = 'SHOW INDEXES YIELD *';

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'SHOW',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        token: 'INDEXES',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 13,
          startOffset: 13,
        },
        token: 'YIELD',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 19,
          startOffset: 19,
        },
        token: '*',
        tokenType: 'operator',
      },
    ]);
  });

  test('Correctly colours CREATE INDEX', () => {
    const query = 'CREATE INDEX index_name FOR (p:Person) ON (p.name)';

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
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'INDEX',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 10,
        position: {
          line: 0,
          startCharacter: 13,
          startOffset: 13,
        },
        token: 'index_name',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 0,
          startCharacter: 24,
          startOffset: 24,
        },
        token: 'FOR',
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
          startCharacter: 28,
          startOffset: 28,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 29,
          startOffset: 29,
        },
        token: 'p',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 30,
          startOffset: 30,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 31,
          startOffset: 31,
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
          startCharacter: 37,
          startOffset: 37,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 39,
          startOffset: 39,
        },
        token: 'ON',
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
          startCharacter: 42,
          startOffset: 42,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 43,
          startOffset: 43,
        },
        token: 'p',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 44,
          startOffset: 44,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 45,
          startOffset: 45,
        },
        token: 'name',
        tokenType: 'property',
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

  test('Correctly colours DROP INDEX', () => {
    const query = 'DROP INDEX index_name';
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'DROP',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        token: 'INDEX',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 10,
        position: {
          line: 0,
          startCharacter: 11,
          startOffset: 11,
        },
        token: 'index_name',
        tokenType: 'symbolicName',
      },
    ]);
  });

  test('Correctly colours SHOW CONSTRAINTS', () => {
    const query = 'SHOW ALL CONSTRAINTS YIELD *';
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'SHOW',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        token: 'ALL',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 11,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: 'CONSTRAINTS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 21,
          startOffset: 21,
        },
        token: 'YIELD',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 27,
          startOffset: 27,
        },
        token: '*',
        tokenType: 'operator',
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
        bracketInfo: undefined,
        length: 10,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'CONSTRAINT',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 15,
        position: {
          line: 0,
          startCharacter: 18,
          startOffset: 18,
        },
        token: 'constraint_name',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 34,
          startOffset: 34,
        },
        token: 'IF',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 0,
          startCharacter: 37,
          startOffset: 37,
        },
        token: 'NOT',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 41,
          startOffset: 41,
        },
        token: 'EXISTS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 54,
        },
        token: 'FOR',
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
          startCharacter: 10,
          startOffset: 58,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 11,
          startOffset: 59,
        },
        token: 'p',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 12,
          startOffset: 60,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 1,
          startCharacter: 13,
          startOffset: 61,
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
          line: 1,
          startCharacter: 19,
          startOffset: 67,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 75,
        },
        token: 'REQUIRE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 14,
          startOffset: 83,
        },
        token: 'p',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 15,
          startOffset: 84,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 2,
          startCharacter: 16,
          startOffset: 85,
        },
        token: 'name',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 2,
          startCharacter: 21,
          startOffset: 90,
        },
        token: 'IS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 2,
          startCharacter: 24,
          startOffset: 93,
        },
        token: 'UNIQUE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 3,
          startCharacter: 6,
          startOffset: 106,
        },
        token: 'OPTIONS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 3,
          startCharacter: 14,
          startOffset: 114,
        },
        token: '{',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 13,
        position: {
          line: 4,
          startCharacter: 8,
          startOffset: 124,
        },
        token: 'indexProvider',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 4,
          startCharacter: 21,
          startOffset: 137,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 11,
        position: {
          line: 4,
          startCharacter: 23,
          startOffset: 139,
        },
        token: "'range-1.0'",
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 5,
          startCharacter: 6,
          startOffset: 157,
        },
        token: '}',
        tokenType: 'bracket',
      },
    ]);
  });

  test('Correctly colours DROP CONSTRAINT', () => {
    const query = 'DROP CONSTRAINT constraint_name IF EXISTS';

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'DROP',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 10,
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        token: 'CONSTRAINT',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 15,
        position: {
          line: 0,
          startCharacter: 16,
          startOffset: 16,
        },
        token: 'constraint_name',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 32,
          startOffset: 32,
        },
        token: 'IF',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 35,
          startOffset: 35,
        },
        token: 'EXISTS',
        tokenType: 'keyword',
      },
    ]);
  });

  test('Correctly colours SHOW FUNCTIONS', () => {
    const query = 'SHOW FUNCTIONS EXECUTABLE BY user_name';
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'SHOW',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        token: 'FUNCTIONS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 10,
        position: {
          line: 0,
          startCharacter: 15,
          startOffset: 15,
        },
        token: 'EXECUTABLE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 26,
          startOffset: 26,
        },
        token: 'BY',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 29,
          startOffset: 29,
        },
        token: 'user_name',
        tokenType: 'symbolicName',
      },
    ]);
  });

  test('Correctly colours SHOW PROCEDURES', () => {
    const query = 'SHOW PROCEDURES EXECUTABLE BY user_name';
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'SHOW',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 10,
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        token: 'PROCEDURES',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 10,
        position: {
          line: 0,
          startCharacter: 16,
          startOffset: 16,
        },
        token: 'EXECUTABLE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 27,
          startOffset: 27,
        },
        token: 'BY',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 30,
          startOffset: 30,
        },
        token: 'user_name',
        tokenType: 'symbolicName',
      },
    ]);
  });

  test('Correctly colours SHOW SETTINGS', () => {
    const query =
      "SHOW SETTINGS 'server.bolt.advertised_address', 'server.bolt.listen_address' YIELD *";
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'SHOW',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        token: 'SETTINGS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 32,
        position: {
          line: 0,
          startCharacter: 14,
          startOffset: 14,
        },
        token: "'server.bolt.advertised_address'",
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 46,
          startOffset: 46,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 28,
        position: {
          line: 0,
          startCharacter: 48,
          startOffset: 48,
        },
        token: "'server.bolt.listen_address'",
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 77,
          startOffset: 77,
        },
        token: 'YIELD',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 83,
          startOffset: 83,
        },
        token: '*',
        tokenType: 'operator',
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
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'SHOW',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 12,
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        token: 'TRANSACTIONS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 24,
        },
        token: 'YIELD',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 13,
        position: {
          line: 1,
          startCharacter: 12,
          startOffset: 30,
        },
        token: 'transactionId',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 1,
          startCharacter: 26,
          startOffset: 44,
        },
        token: 'AS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 1,
          startCharacter: 29,
          startOffset: 47,
        },
        token: 'txId',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 33,
          startOffset: 51,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 1,
          startCharacter: 35,
          startOffset: 53,
        },
        token: 'username',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 68,
        },
        token: 'WHERE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 2,
          startCharacter: 12,
          startOffset: 74,
        },
        token: 'username',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 21,
          startOffset: 83,
        },
        token: '=',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 11,
        position: {
          line: 2,
          startCharacter: 23,
          startOffset: 85,
        },
        token: "'user_name'",
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 3,
          startCharacter: 4,
          startOffset: 101,
        },
        token: 'TERMINATE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 12,
        position: {
          line: 3,
          startCharacter: 14,
          startOffset: 111,
        },
        token: 'TRANSACTIONS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 3,
          startCharacter: 27,
          startOffset: 124,
        },
        token: 'txId',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 4,
          startCharacter: 6,
          startOffset: 135,
        },
        token: 'YIELD',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 4,
          startCharacter: 12,
          startOffset: 141,
        },
        token: 'message',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 5,
          startCharacter: 6,
          startOffset: 155,
        },
        token: 'WHERE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 5,
          startCharacter: 12,
          startOffset: 161,
        },
        token: 'NOT',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 5,
          startCharacter: 16,
          startOffset: 165,
        },
        token: 'message',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 5,
          startCharacter: 24,
          startOffset: 173,
        },
        token: '=',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 25,
        position: {
          line: 5,
          startCharacter: 26,
          startOffset: 175,
        },
        token: "'Transaction terminated.'",
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 6,
          startCharacter: 6,
          startOffset: 207,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 6,
          startCharacter: 13,
          startOffset: 214,
        },
        token: 'txId',
        tokenType: 'variable',
      },
    ]);
  });

  test('Correctly colours CREATE DATABASE', () => {
    const query =
      'CREATE DATABASE `topology-example` IF NOT EXISTS TOPOLOGY 1 PRIMARY 0 SECONDARIES';
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
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'DATABASE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 18,
        position: {
          line: 0,
          startCharacter: 16,
          startOffset: 16,
        },
        token: '`topology-example`',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 35,
          startOffset: 35,
        },
        token: 'IF',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 0,
          startCharacter: 38,
          startOffset: 38,
        },
        token: 'NOT',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 42,
          startOffset: 42,
        },
        token: 'EXISTS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 0,
          startCharacter: 49,
          startOffset: 49,
        },
        token: 'TOPOLOGY',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 58,
          startOffset: 58,
        },
        token: '1',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 0,
          startCharacter: 60,
          startOffset: 60,
        },
        token: 'PRIMARY',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 68,
          startOffset: 68,
        },
        token: '0',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: undefined,
        length: 11,
        position: {
          line: 0,
          startCharacter: 70,
          startOffset: 70,
        },
        token: 'SECONDARIES',
        tokenType: 'keyword',
      },
    ]);
  });

  test('Correctly colours START DATABASE', () => {
    const query = 'START DATABASE `database-name`';
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'START',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 0,
          startCharacter: 6,
          startOffset: 6,
        },
        token: 'DATABASE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 15,
        position: {
          line: 0,
          startCharacter: 15,
          startOffset: 15,
        },
        token: '`database-name`',
        tokenType: 'symbolicName',
      },
    ]);
  });

  test('Correctly colours STOP DATABASE', () => {
    const query = 'STOP DATABASE `database-name`';
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'STOP',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        token: 'DATABASE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 15,
        position: {
          line: 0,
          startCharacter: 14,
          startOffset: 14,
        },
        token: '`database-name`',
        tokenType: 'symbolicName',
      },
    ]);
  });

  test('Correctly colours ALTER DATABASE', () => {
    const query =
      'ALTER DATABASE `topology-example` SET TOPOLOGY 1 PRIMARY SET ACCESS READ ONLY';

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'ALTER',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 0,
          startCharacter: 6,
          startOffset: 6,
        },
        token: 'DATABASE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 18,
        position: {
          line: 0,
          startCharacter: 15,
          startOffset: 15,
        },
        token: '`topology-example`',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 0,
          startCharacter: 34,
          startOffset: 34,
        },
        token: 'SET',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 0,
          startCharacter: 38,
          startOffset: 38,
        },
        token: 'TOPOLOGY',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 47,
          startOffset: 47,
        },
        token: '1',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 0,
          startCharacter: 49,
          startOffset: 49,
        },
        token: 'PRIMARY',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 0,
          startCharacter: 57,
          startOffset: 57,
        },
        token: 'SET',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 61,
          startOffset: 61,
        },
        token: 'ACCESS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 68,
          startOffset: 68,
        },
        token: 'READ',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 73,
          startOffset: 73,
        },
        token: 'ONLY',
        tokenType: 'keyword',
      },
    ]);
  });

  test('Correctly colours SHOW DATABASES', () => {
    const query = `SHOW DATABASES
      YIELD name, currentStatus
      WHERE name CONTAINS 'my'
      AND currentStatus = 'online'
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
        token: 'SHOW',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        token: 'DATABASES',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 21,
        },
        token: 'YIELD',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 1,
          startCharacter: 12,
          startOffset: 27,
        },
        token: 'name',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 16,
          startOffset: 31,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 13,
        position: {
          line: 1,
          startCharacter: 18,
          startOffset: 33,
        },
        token: 'currentStatus',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 53,
        },
        token: 'WHERE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 2,
          startCharacter: 12,
          startOffset: 59,
        },
        token: 'name',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 2,
          startCharacter: 17,
          startOffset: 64,
        },
        token: 'CONTAINS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 2,
          startCharacter: 26,
          startOffset: 73,
        },
        token: "'my'",
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 3,
          startCharacter: 6,
          startOffset: 84,
        },
        token: 'AND',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 13,
        position: {
          line: 3,
          startCharacter: 10,
          startOffset: 88,
        },
        token: 'currentStatus',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 24,
          startOffset: 102,
        },
        token: '=',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 3,
          startCharacter: 26,
          startOffset: 104,
        },
        token: "'online'",
        tokenType: 'stringLiteral',
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
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'OR',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 0,
          startCharacter: 10,
          startOffset: 10,
        },
        token: 'REPLACE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 18,
          startOffset: 18,
        },
        token: 'ALIAS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 25,
        position: {
          line: 0,
          startCharacter: 24,
          startOffset: 24,
        },
        token: '`composite-database-name`',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 49,
          startOffset: 49,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 25,
        position: {
          line: 0,
          startCharacter: 50,
          startOffset: 50,
        },
        token: '`alias-in-composite-name`',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 83,
        },
        token: 'FOR',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 1,
          startCharacter: 10,
          startOffset: 87,
        },
        token: 'DATABASE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 15,
        position: {
          line: 1,
          startCharacter: 19,
          startOffset: 96,
        },
        token: '`database-name`',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 118,
        },
        token: 'AT',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 9,
          startOffset: 121,
        },
        token: '$',
        tokenType: 'paramDollar',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 2,
          startCharacter: 10,
          startOffset: 122,
        },
        token: 'url',
        tokenType: 'paramValue',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 3,
          startCharacter: 6,
          startOffset: 132,
        },
        token: 'USER',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 3,
          startCharacter: 11,
          startOffset: 137,
        },
        token: 'user_name',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 4,
          startCharacter: 6,
          startOffset: 153,
        },
        token: 'PASSWORD',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 4,
          startCharacter: 15,
          startOffset: 162,
        },
        token: '$',
        tokenType: 'paramDollar',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 4,
          startCharacter: 16,
          startOffset: 163,
        },
        token: 'password',
        tokenType: 'paramValue',
      },
      {
        bracketInfo: undefined,
        length: 10,
        position: {
          line: 5,
          startCharacter: 6,
          startOffset: 178,
        },
        token: 'PROPERTIES',
        tokenType: 'keyword',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 5,
          startCharacter: 17,
          startOffset: 189,
        },
        token: '{',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 5,
          startCharacter: 19,
          startOffset: 191,
        },
        token: 'property',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 5,
          startCharacter: 27,
          startOffset: 199,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 5,
          startCharacter: 29,
          startOffset: 201,
        },
        token: '$',
        tokenType: 'paramDollar',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 5,
          startCharacter: 30,
          startOffset: 202,
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
          line: 5,
          startCharacter: 36,
          startOffset: 208,
        },
        token: '}',
        tokenType: 'bracket',
      },
    ]);
  });

  test('Correctly colours ALTER ALIAS', () => {
    const query = `ALTER ALIAS \`remote-database-alias\` IF EXISTS
      SET DATABASE
      USER user_name
      PASSWORD $password
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
        token: 'ALTER',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 6,
          startOffset: 6,
        },
        token: 'ALIAS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 23,
        position: {
          line: 0,
          startCharacter: 12,
          startOffset: 12,
        },
        token: '`remote-database-alias`',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 36,
          startOffset: 36,
        },
        token: 'IF',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 39,
          startOffset: 39,
        },
        token: 'EXISTS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 52,
        },
        token: 'SET',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 1,
          startCharacter: 10,
          startOffset: 56,
        },
        token: 'DATABASE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 71,
        },
        token: 'USER',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 2,
          startCharacter: 11,
          startOffset: 76,
        },
        token: 'user_name',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 3,
          startCharacter: 6,
          startOffset: 92,
        },
        token: 'PASSWORD',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 15,
          startOffset: 101,
        },
        token: '$',
        tokenType: 'paramDollar',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 3,
          startCharacter: 16,
          startOffset: 102,
        },
        token: 'password',
        tokenType: 'paramValue',
      },
    ]);
  });

  test('Correctly colours DROP ALIAS', () => {
    const query = 'DROP ALIAS `database-alias` IF EXISTS FOR DATABASE';
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'DROP',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        token: 'ALIAS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 16,
        position: {
          line: 0,
          startCharacter: 11,
          startOffset: 11,
        },
        token: '`database-alias`',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 28,
          startOffset: 28,
        },
        token: 'IF',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 31,
          startOffset: 31,
        },
        token: 'EXISTS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 0,
          startCharacter: 38,
          startOffset: 38,
        },
        token: 'FOR',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 0,
          startCharacter: 42,
          startOffset: 42,
        },
        token: 'DATABASE',
        tokenType: 'keyword',
      },
    ]);
  });

  test('Correctly colours ENABLE SERVER', () => {
    const query = "ENABLE SERVER 'serverId'";

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'ENABLE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'SERVER',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 10,
        position: {
          line: 0,
          startCharacter: 14,
          startOffset: 14,
        },
        token: "'serverId'",
        tokenType: 'stringLiteral',
      },
    ]);
  });

  test('Correctly colours ALTER SERVER', () => {
    const query = "ALTER SERVER 'name' SET OPTIONS {modeConstraint: 'PRIMARY'}";
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'ALTER',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 6,
          startOffset: 6,
        },
        token: 'SERVER',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 13,
          startOffset: 13,
        },
        token: "'name'",
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 0,
          startCharacter: 20,
          startOffset: 20,
        },
        token: 'SET',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 0,
          startCharacter: 24,
          startOffset: 24,
        },
        token: 'OPTIONS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 32,
          startOffset: 32,
        },
        token: '{',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 14,
        position: {
          line: 0,
          startCharacter: 33,
          startOffset: 33,
        },
        token: 'modeConstraint',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 47,
          startOffset: 47,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 49,
          startOffset: 49,
        },
        token: "'PRIMARY'",
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 58,
          startOffset: 58,
        },
        token: '}',
        tokenType: 'bracket',
      },
    ]);
  });

  test('Correctly colours RENAME SERVER', () => {
    const query = "RENAME SERVER 'oldName' TO 'newName'";
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'RENAME',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'SERVER',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 14,
          startOffset: 14,
        },
        token: "'oldName'",
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 24,
          startOffset: 24,
        },
        token: 'TO',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 27,
          startOffset: 27,
        },
        token: "'newName'",
        tokenType: 'stringLiteral',
      },
    ]);
  });

  test('Correctly colours DEALLOCATE DATABASES', () => {
    const query = "DEALLOCATE DATABASES FROM SERVER 'name'";
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 10,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'DEALLOCATE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 11,
          startOffset: 11,
        },
        token: 'DATABASES',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 21,
          startOffset: 21,
        },
        token: 'FROM',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 26,
          startOffset: 26,
        },
        token: 'SERVER',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 33,
          startOffset: 33,
        },
        token: "'name'",
        tokenType: 'stringLiteral',
      },
    ]);
  });

  test('Correctly colours REALLOCATE DATABASES', () => {
    const query = 'REALLOCATE DATABASES';
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 10,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'REALLOCATE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 11,
          startOffset: 11,
        },
        token: 'DATABASES',
        tokenType: 'keyword',
      },
    ]);
  });

  test('Correctly colours SHOW SERVERS', () => {
    const query = 'SHOW SERVERS';
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'SHOW',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        token: 'SERVERS',
        tokenType: 'keyword',
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
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'USER',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 12,
          startOffset: 12,
        },
        token: 'user_name',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 28,
        },
        token: 'SET',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 1,
          startCharacter: 10,
          startOffset: 32,
        },
        token: 'PASSWORD',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 19,
          startOffset: 41,
        },
        token: '$',
        tokenType: 'paramDollar',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 1,
          startCharacter: 20,
          startOffset: 42,
        },
        token: 'password',
        tokenType: 'paramValue',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 57,
        },
        token: 'CHANGE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 2,
          startCharacter: 13,
          startOffset: 64,
        },
        token: 'NOT',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 2,
          startCharacter: 17,
          startOffset: 68,
        },
        token: 'REQUIRED',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 3,
          startCharacter: 6,
          startOffset: 83,
        },
        token: 'SET',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 3,
          startCharacter: 10,
          startOffset: 87,
        },
        token: 'STATUS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 3,
          startCharacter: 17,
          startOffset: 94,
        },
        token: 'SUSPENDED',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 4,
          startCharacter: 6,
          startOffset: 110,
        },
        token: 'SET',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 4,
          startCharacter: 10,
          startOffset: 114,
        },
        token: 'HOME',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 4,
          startCharacter: 15,
          startOffset: 119,
        },
        token: 'DATABASE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 15,
        position: {
          line: 4,
          startCharacter: 24,
          startOffset: 128,
        },
        token: '`database-name`',
        tokenType: 'symbolicName',
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
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'ALTER',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 6,
          startOffset: 6,
        },
        token: 'USER',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 11,
          startOffset: 11,
        },
        token: 'user_name',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 27,
        },
        token: 'SET',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 1,
          startCharacter: 10,
          startOffset: 31,
        },
        token: 'PASSWORD',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 19,
          startOffset: 40,
        },
        token: '$',
        tokenType: 'paramDollar',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 1,
          startCharacter: 20,
          startOffset: 41,
        },
        token: 'password',
        tokenType: 'paramValue',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 56,
        },
        token: 'CHANGE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 2,
          startCharacter: 13,
          startOffset: 63,
        },
        token: 'NOT',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 2,
          startCharacter: 17,
          startOffset: 67,
        },
        token: 'REQUIRED',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 3,
          startCharacter: 6,
          startOffset: 82,
        },
        token: 'SET',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 3,
          startCharacter: 10,
          startOffset: 86,
        },
        token: 'STATUS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 3,
          startCharacter: 17,
          startOffset: 93,
        },
        token: 'ACTIVE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 4,
          startCharacter: 6,
          startOffset: 106,
        },
        token: 'SET',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 4,
          startCharacter: 10,
          startOffset: 110,
        },
        token: 'HOME',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 4,
          startCharacter: 15,
          startOffset: 115,
        },
        token: 'DATABASE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 15,
        position: {
          line: 4,
          startCharacter: 24,
          startOffset: 124,
        },
        token: '`database-name`',
        tokenType: 'symbolicName',
      },
    ]);
  });

  test('Correctly colours SHOW USERS', () => {
    const query = `SHOW USERS
      WHERE suspended = true AND passwordChangeRequired
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
        token: 'SHOW',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        token: 'USERS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 17,
        },
        token: 'WHERE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 1,
          startCharacter: 12,
          startOffset: 23,
        },
        token: 'suspended',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 22,
          startOffset: 33,
        },
        token: '=',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 1,
          startCharacter: 24,
          startOffset: 35,
        },
        token: 'true',
        tokenType: 'booleanLiteral',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 1,
          startCharacter: 29,
          startOffset: 40,
        },
        token: 'AND',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 22,
        position: {
          line: 1,
          startCharacter: 33,
          startOffset: 44,
        },
        token: 'passwordChangeRequired',
        tokenType: 'variable',
      },
    ]);
  });

  test('Correctly colours CREATE ROLE', () => {
    const query =
      'CREATE ROLE role_name IF NOT EXISTS AS COPY OF other_role_name';

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
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'ROLE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 12,
          startOffset: 12,
        },
        token: 'role_name',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 22,
          startOffset: 22,
        },
        token: 'IF',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 0,
          startCharacter: 25,
          startOffset: 25,
        },
        token: 'NOT',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 29,
          startOffset: 29,
        },
        token: 'EXISTS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 36,
          startOffset: 36,
        },
        token: 'AS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 39,
          startOffset: 39,
        },
        token: 'COPY',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 44,
          startOffset: 44,
        },
        token: 'OF',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 15,
        position: {
          line: 0,
          startCharacter: 47,
          startOffset: 47,
        },
        token: 'other_role_name',
        tokenType: 'symbolicName',
      },
    ]);
  });

  test('Correctly colours DROP ROLE', () => {
    const query = 'DROP ROLE role_name';
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'DROP',
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
        token: 'ROLE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 10,
          startOffset: 10,
        },
        token: 'role_name',
        tokenType: 'symbolicName',
      },
    ]);
  });

  test('Correctly colours SHOW ROLES', () => {
    const query = `SHOW ROLES WITH USERS
      YIELD member, role
      WHERE member = $user
      RETURN role
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
        token: 'SHOW',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        token: 'ROLES',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 11,
          startOffset: 11,
        },
        token: 'WITH',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 16,
          startOffset: 16,
        },
        token: 'USERS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 28,
        },
        token: 'YIELD',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 1,
          startCharacter: 12,
          startOffset: 34,
        },
        token: 'member',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 18,
          startOffset: 40,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 1,
          startCharacter: 20,
          startOffset: 42,
        },
        token: 'role',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 53,
        },
        token: 'WHERE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 2,
          startCharacter: 12,
          startOffset: 59,
        },
        token: 'member',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 19,
          startOffset: 66,
        },
        token: '=',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 21,
          startOffset: 68,
        },
        token: '$',
        tokenType: 'paramDollar',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 2,
          startCharacter: 22,
          startOffset: 69,
        },
        token: 'user',
        tokenType: 'paramValue',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 3,
          startCharacter: 6,
          startOffset: 80,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 3,
          startCharacter: 13,
          startOffset: 87,
        },
        token: 'role',
        tokenType: 'variable',
      },
    ]);
  });

  test('Correctly colours SHOW POPULATED ROLES', () => {
    const query = 'SHOW POPULATED ROLES';

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'SHOW',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        token: 'POPULATED',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 15,
          startOffset: 15,
        },
        token: 'ROLES',
        tokenType: 'keyword',
      },
    ]);
  });

  test('Correctly colours GRANT ROLE', () => {
    const query = 'GRANT ROLE role_name1, role_name2 TO user_name';
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'GRANT',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 6,
          startOffset: 6,
        },
        token: 'ROLE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 10,
        position: {
          line: 0,
          startCharacter: 11,
          startOffset: 11,
        },
        token: 'role_name1',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 21,
          startOffset: 21,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 10,
        position: {
          line: 0,
          startCharacter: 23,
          startOffset: 23,
        },
        token: 'role_name2',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 34,
          startOffset: 34,
        },
        token: 'TO',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 37,
          startOffset: 37,
        },
        token: 'user_name',
        tokenType: 'symbolicName',
      },
    ]);
  });

  test('Correctly colours REVOKE ROLE', () => {
    const query = 'REVOKE ROLE role_name FROM user_name';
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'REVOKE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'ROLE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 12,
          startOffset: 12,
        },
        token: 'role_name',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 22,
          startOffset: 22,
        },
        token: 'FROM',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 27,
          startOffset: 27,
        },
        token: 'user_name',
        tokenType: 'symbolicName',
      },
    ]);
  });

  test('Correctly colours RENAME ROLE', () => {
    const query = 'RENAME ROLE role_name TO other_role_name';
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'RENAME',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'ROLE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 12,
          startOffset: 12,
        },
        token: 'role_name',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 22,
          startOffset: 22,
        },
        token: 'TO',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 15,
        position: {
          line: 0,
          startCharacter: 25,
          startOffset: 25,
        },
        token: 'other_role_name',
        tokenType: 'symbolicName',
      },
    ]);
  });

  test('Correctly colours SHOW ROLE', () => {
    const query = 'SHOW ROLE role_name PRIVILEGES AS COMMANDS';
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'SHOW',
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
        token: 'ROLE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 10,
          startOffset: 10,
        },
        token: 'role_name',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 10,
        position: {
          line: 0,
          startCharacter: 20,
          startOffset: 20,
        },
        token: 'PRIVILEGES',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 31,
          startOffset: 31,
        },
        token: 'AS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 0,
          startCharacter: 34,
          startOffset: 34,
        },
        token: 'COMMANDS',
        tokenType: 'keyword',
      },
    ]);
  });

  test('Correctly colours GRANT PRIVILEGE', () => {
    const query = 'GRANT EXECUTE BOOSTED FUNCTIONS * ON DBMS TO role_name';
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'GRANT',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 0,
          startCharacter: 6,
          startOffset: 6,
        },
        token: 'EXECUTE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 0,
          startCharacter: 14,
          startOffset: 14,
        },
        token: 'BOOSTED',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 22,
          startOffset: 22,
        },
        token: 'FUNCTIONS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 32,
          startOffset: 32,
        },
        token: '*',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 34,
          startOffset: 34,
        },
        token: 'ON',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 37,
          startOffset: 37,
        },
        token: 'DBMS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 42,
          startOffset: 42,
        },
        token: 'TO',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 45,
          startOffset: 45,
        },
        token: 'role_name',
        tokenType: 'symbolicName',
      },
    ]);
  });

  test('Correctly colours REVOKE PRIVILEGE', () => {
    const query = 'REVOKE IMPERSONATE (*) ON DBMS FROM role_name';
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'REVOKE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 11,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'IMPERSONATE',
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
          startCharacter: 19,
          startOffset: 19,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 20,
          startOffset: 20,
        },
        token: '*',
        tokenType: 'operator',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 21,
          startOffset: 21,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 23,
          startOffset: 23,
        },
        token: 'ON',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 26,
          startOffset: 26,
        },
        token: 'DBMS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 31,
          startOffset: 31,
        },
        token: 'FROM',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 36,
          startOffset: 36,
        },
        token: 'role_name',
        tokenType: 'symbolicName',
      },
    ]);
  });

  test('Correctly colours DENY PRIVILEGE', () => {
    const query =
      'DENY IMPERSONATE (user_name1, user_name2) ON DBMS TO role_name';

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'DENY',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 11,
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        token: 'IMPERSONATE',
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
          startCharacter: 17,
          startOffset: 17,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 10,
        position: {
          line: 0,
          startCharacter: 18,
          startOffset: 18,
        },
        token: 'user_name1',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 28,
          startOffset: 28,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 10,
        position: {
          line: 0,
          startCharacter: 30,
          startOffset: 30,
        },
        token: 'user_name2',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 40,
          startOffset: 40,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 42,
          startOffset: 42,
        },
        token: 'ON',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 45,
          startOffset: 45,
        },
        token: 'DBMS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 50,
          startOffset: 50,
        },
        token: 'TO',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 53,
          startOffset: 53,
        },
        token: 'role_name',
        tokenType: 'symbolicName',
      },
    ]);
  });

  test('Correctly colours SHOW PRIVILEGES', () => {
    const query = 'SHOW PRIVILEGES AS COMMANDS';

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'SHOW',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 10,
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        token: 'PRIVILEGES',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 16,
          startOffset: 16,
        },
        token: 'AS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 0,
          startCharacter: 19,
          startOffset: 19,
        },
        token: 'COMMANDS',
        tokenType: 'keyword',
      },
    ]);
  });

  test('Correctly colours SHOW USER PRIVILEGES', () => {
    const query = 'SHOW USER user_name PRIVILEGES';

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'SHOW',
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
        token: 'USER',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 0,
          startCharacter: 10,
          startOffset: 10,
        },
        token: 'user_name',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 10,
        position: {
          line: 0,
          startCharacter: 20,
          startOffset: 20,
        },
        token: 'PRIVILEGES',
        tokenType: 'keyword',
      },
    ]);
  });
});

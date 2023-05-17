import { BracketType } from '../../../highlighting/syntaxColouringHelpers';
import { CypherTokenType } from '../../../lexerSymbols';
import { testSyntaxColouring } from './helpers';

describe('CALL syntax colouring', () => {
  test('Correctly colours standalone procedure CALL', () => {
    const query = 'CALL dbms.info() YIELD *';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'CALL',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 4,
        tokenType: CypherTokenType.procedure,
        token: 'dbms',
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
        },
        length: 4,
        tokenType: CypherTokenType.procedure,
        token: 'info',
      },
      {
        position: {
          line: 0,
          startCharacter: 14,
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
          startCharacter: 15,
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
          startCharacter: 17,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 0,
          startCharacter: 23,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '*',
      },
    ]);
  });

  test('Correctly colours procedure CALL with yield', () => {
    const query =
      'CALL apoc.do.when(true, "foo", false, "bar") YIELD name, result';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'CALL',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 4,
        tokenType: CypherTokenType.procedure,
        token: 'apoc',
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
        },
        length: 2,
        tokenType: CypherTokenType.procedure,
        token: 'do',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 0,
          startCharacter: 13,
        },
        length: 4,
        tokenType: CypherTokenType.procedure,
        token: 'when',
      },
      {
        position: {
          line: 0,
          startCharacter: 17,
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
          startCharacter: 18,
        },
        length: 4,
        tokenType: CypherTokenType.booleanLiteral,
        token: 'true',
      },
      {
        position: {
          line: 0,
          startCharacter: 22,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 5,
        tokenType: CypherTokenType.stringLiteral,
        token: '"foo"',
      },
      {
        position: {
          line: 0,
          startCharacter: 29,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 0,
          startCharacter: 31,
        },
        length: 5,
        tokenType: CypherTokenType.booleanLiteral,
        token: 'false',
      },
      {
        position: {
          line: 0,
          startCharacter: 36,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 0,
          startCharacter: 38,
        },
        length: 5,
        tokenType: CypherTokenType.stringLiteral,
        token: '"bar"',
      },
      {
        position: {
          line: 0,
          startCharacter: 43,
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
          startCharacter: 45,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 0,
          startCharacter: 51,
        },
        length: 4,
        tokenType: CypherTokenType.variable,
        token: 'name',
      },
      {
        position: {
          line: 0,
          startCharacter: 55,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 0,
          startCharacter: 57,
        },
        length: 6,
        tokenType: CypherTokenType.variable,
        token: 'result',
      },
    ]);
  });
});

describe('CASE syntax colouring', () => {
  test('Correctly colours CASE', () => {
    const query = `
      MATCH (n)-[r]->(m)
      RETURN
      CASE
        WHEN n:A&B THEN 1
        WHEN r:!R1&!R2 THEN 2
        ELSE -1
      END AS result
    `;

    testSyntaxColouring(query, [
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'MATCH',
      },
      {
        position: {
          line: 1,
          startCharacter: 12,
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
          line: 1,
          startCharacter: 13,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 1,
          startCharacter: 14,
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
          line: 1,
          startCharacter: 15,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '-',
      },
      {
        position: {
          line: 1,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '[',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 1,
          startCharacter: 17,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'r',
      },
      {
        position: {
          line: 1,
          startCharacter: 18,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ']',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 1,
          startCharacter: 19,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '-',
      },
      {
        position: {
          line: 1,
          startCharacter: 20,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '>',
      },
      {
        position: {
          line: 1,
          startCharacter: 21,
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
          line: 1,
          startCharacter: 22,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'm',
      },
      {
        position: {
          line: 1,
          startCharacter: 23,
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
          line: 2,
          startCharacter: 6,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 3,
          startCharacter: 6,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'CASE',
      },
      {
        position: {
          line: 4,
          startCharacter: 8,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'WHEN',
      },
      {
        position: {
          line: 4,
          startCharacter: 13,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 4,
          startCharacter: 14,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 4,
          startCharacter: 15,
        },
        length: 1,
        tokenType: CypherTokenType.label,
        token: 'A',
      },
      {
        position: {
          line: 4,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '&',
      },
      {
        position: {
          line: 4,
          startCharacter: 17,
        },
        length: 1,
        tokenType: CypherTokenType.label,
        token: 'B',
      },
      {
        position: {
          line: 4,
          startCharacter: 19,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'THEN',
      },
      {
        position: {
          line: 4,
          startCharacter: 24,
        },
        length: 1,
        tokenType: CypherTokenType.numberLiteral,
        token: '1',
      },
      {
        position: {
          line: 5,
          startCharacter: 8,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'WHEN',
      },
      {
        position: {
          line: 5,
          startCharacter: 13,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'r',
      },
      {
        position: {
          line: 5,
          startCharacter: 14,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 5,
          startCharacter: 15,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '!',
      },
      {
        position: {
          line: 5,
          startCharacter: 16,
        },
        length: 2,
        tokenType: CypherTokenType.label,
        token: 'R1',
      },
      {
        position: {
          line: 5,
          startCharacter: 18,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '&',
      },
      {
        position: {
          line: 5,
          startCharacter: 19,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '!',
      },
      {
        position: {
          line: 5,
          startCharacter: 20,
        },
        length: 2,
        tokenType: CypherTokenType.label,
        token: 'R2',
      },
      {
        position: {
          line: 5,
          startCharacter: 23,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'THEN',
      },
      {
        position: {
          line: 5,
          startCharacter: 28,
        },
        length: 1,
        tokenType: CypherTokenType.numberLiteral,
        token: '2',
      },
      {
        position: {
          line: 6,
          startCharacter: 8,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'ELSE',
      },
      {
        position: {
          line: 6,
          startCharacter: 13,
        },
        length: 2,
        tokenType: CypherTokenType.numberLiteral,
        token: '-1',
      },
      {
        position: {
          line: 7,
          startCharacter: 6,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'END',
      },
      {
        position: {
          line: 7,
          startCharacter: 10,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 7,
          startCharacter: 13,
        },
        length: 6,
        tokenType: CypherTokenType.variable,
        token: 'result',
      },
    ]);
  });
});

describe('LOAD CSV colouring', () => {
  test('Correctly colours LOAD CSV', () => {
    const query = `
      LOAD CSV WITH HEADERS FROM
      'https://neo4j.com/docs/cypher-cheat-sheet/5/csv/artists-with-headers.csv'
      AS line
      CALL {
        WITH line
        CREATE (:Artist {name: line.Name, year: toInteger(line.Year)})
      } IN TRANSACTIONS OF 500 ROWS
    `;

    testSyntaxColouring(query, [
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'LOAD',
      },
      {
        position: {
          line: 1,
          startCharacter: 11,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'CSV',
      },
      {
        position: {
          line: 1,
          startCharacter: 15,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'WITH',
      },
      {
        position: {
          line: 1,
          startCharacter: 20,
        },
        length: 7,
        tokenType: CypherTokenType.keyword,
        token: 'HEADERS',
      },
      {
        position: {
          line: 1,
          startCharacter: 28,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'FROM',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 74,
        tokenType: CypherTokenType.stringLiteral,
        token:
          "'https://neo4j.com/docs/cypher-cheat-sheet/5/csv/artists-with-headers.csv'",
      },
      {
        position: {
          line: 3,
          startCharacter: 6,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 3,
          startCharacter: 9,
        },
        length: 4,
        tokenType: CypherTokenType.variable,
        token: 'line',
      },
      {
        position: {
          line: 4,
          startCharacter: 6,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'CALL',
      },
      {
        position: {
          line: 4,
          startCharacter: 11,
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
          line: 5,
          startCharacter: 8,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'WITH',
      },
      {
        position: {
          line: 5,
          startCharacter: 13,
        },
        length: 4,
        tokenType: CypherTokenType.variable,
        token: 'line',
      },
      {
        position: {
          line: 6,
          startCharacter: 8,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'CREATE',
      },
      {
        position: {
          line: 6,
          startCharacter: 15,
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
          line: 6,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 6,
          startCharacter: 17,
        },
        length: 6,
        tokenType: CypherTokenType.label,
        token: 'Artist',
      },
      {
        position: {
          line: 6,
          startCharacter: 24,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '{',
        bracketInfo: {
          bracketType: BracketType.curly,
          bracketLevel: 1,
        },
      },
      {
        position: {
          line: 6,
          startCharacter: 25,
        },
        length: 4,
        tokenType: CypherTokenType.property,
        token: 'name',
      },
      {
        position: {
          line: 6,
          startCharacter: 29,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 6,
          startCharacter: 31,
        },
        length: 4,
        tokenType: CypherTokenType.variable,
        token: 'line',
      },
      {
        position: {
          line: 6,
          startCharacter: 35,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 6,
          startCharacter: 36,
        },
        length: 4,
        tokenType: CypherTokenType.property,
        token: 'Name',
      },
      {
        position: {
          line: 6,
          startCharacter: 40,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 6,
          startCharacter: 42,
        },
        length: 4,
        tokenType: CypherTokenType.property,
        token: 'year',
      },
      {
        position: {
          line: 6,
          startCharacter: 46,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 6,
          startCharacter: 48,
        },
        length: 9,
        tokenType: CypherTokenType.function,
        token: 'toInteger',
      },
      {
        position: {
          line: 6,
          startCharacter: 57,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '(',
        bracketInfo: {
          bracketType: BracketType.parenthesis,
          bracketLevel: 1,
        },
      },
      {
        position: {
          line: 6,
          startCharacter: 58,
        },
        length: 4,
        tokenType: CypherTokenType.variable,
        token: 'line',
      },
      {
        position: {
          line: 6,
          startCharacter: 62,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 6,
          startCharacter: 63,
        },
        length: 4,
        tokenType: CypherTokenType.property,
        token: 'Year',
      },
      {
        position: {
          line: 6,
          startCharacter: 67,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ')',
        bracketInfo: {
          bracketType: BracketType.parenthesis,
          bracketLevel: 1,
        },
      },
      {
        position: {
          line: 6,
          startCharacter: 68,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '}',
        bracketInfo: {
          bracketType: BracketType.curly,
          bracketLevel: 1,
        },
      },
      {
        position: {
          line: 6,
          startCharacter: 69,
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
          line: 7,
          startCharacter: 6,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '}',
        bracketInfo: {
          bracketType: BracketType.curly,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 7,
          startCharacter: 8,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'IN',
      },
      {
        position: {
          line: 7,
          startCharacter: 11,
        },
        length: 12,
        tokenType: CypherTokenType.keyword,
        token: 'TRANSACTIONS',
      },
      {
        position: {
          line: 7,
          startCharacter: 24,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'OF',
      },
      {
        position: {
          line: 7,
          startCharacter: 27,
        },
        length: 3,
        tokenType: CypherTokenType.numberLiteral,
        token: '500',
      },
      {
        position: {
          line: 7,
          startCharacter: 31,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'ROWS',
      },
    ]);
  });
});

describe('USE colouring', () => {
  test('Correctly colours USE', () => {
    const query = `
      USE neo4j
      MATCH (n:Person)-[:KNOWS]->(m:Person)
      WHERE n.name = 'Alice'
    `;

    testSyntaxColouring(query, [
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'USE',
      },
      {
        position: {
          line: 1,
          startCharacter: 10,
        },
        length: 5,
        tokenType: CypherTokenType.variable,
        token: 'neo4j',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'MATCH',
      },
      {
        position: {
          line: 2,
          startCharacter: 12,
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
          line: 2,
          startCharacter: 13,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 2,
          startCharacter: 14,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 2,
          startCharacter: 15,
        },
        length: 6,
        tokenType: CypherTokenType.label,
        token: 'Person',
      },
      {
        position: {
          line: 2,
          startCharacter: 21,
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
          line: 2,
          startCharacter: 22,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '-',
      },
      {
        position: {
          line: 2,
          startCharacter: 23,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '[',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 2,
          startCharacter: 24,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 2,
          startCharacter: 25,
        },
        length: 5,
        tokenType: CypherTokenType.label,
        token: 'KNOWS',
      },
      {
        position: {
          line: 2,
          startCharacter: 30,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ']',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 2,
          startCharacter: 31,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '-',
      },
      {
        position: {
          line: 2,
          startCharacter: 32,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '>',
      },
      {
        position: {
          line: 2,
          startCharacter: 33,
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
          line: 2,
          startCharacter: 34,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'm',
      },
      {
        position: {
          line: 2,
          startCharacter: 35,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 2,
          startCharacter: 36,
        },
        length: 6,
        tokenType: CypherTokenType.label,
        token: 'Person',
      },
      {
        position: {
          line: 2,
          startCharacter: 42,
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
          line: 3,
          startCharacter: 6,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'WHERE',
      },
      {
        position: {
          line: 3,
          startCharacter: 12,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 3,
          startCharacter: 13,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 3,
          startCharacter: 14,
        },
        length: 4,
        tokenType: CypherTokenType.property,
        token: 'name',
      },
      {
        position: {
          line: 3,
          startCharacter: 19,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '=',
      },
      {
        position: {
          line: 3,
          startCharacter: 21,
        },
        length: 7,
        tokenType: CypherTokenType.stringLiteral,
        token: "'Alice'",
      },
    ]);
  });
});

describe('FOREACH syntax colouring', () => {
  test('Correctly colours FOREACH', () => {
    const query = `
    FOREACH ( r IN relationships(path) | SET r.marked = true )
    `;

    testSyntaxColouring(query, [
      {
        position: {
          line: 1,
          startCharacter: 4,
          startOffset: 5,
        },
        length: 7,
        tokenType: CypherTokenType.keyword,
        token: 'FOREACH',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 1,
          startCharacter: 12,
          startOffset: 13,
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
          startCharacter: 14,
          startOffset: 15,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'r',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 1,
          startCharacter: 16,
          startOffset: 17,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'IN',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 1,
          startCharacter: 19,
          startOffset: 20,
        },
        length: 13,
        tokenType: CypherTokenType.function,
        token: 'relationships',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 1,
          startCharacter: 32,
          startOffset: 33,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '(',
        bracketInfo: {
          bracketLevel: 1,
          bracketType: BracketType.parenthesis,
        },
      },
      {
        position: {
          line: 1,
          startCharacter: 33,
          startOffset: 34,
        },
        length: 4,
        tokenType: CypherTokenType.variable,
        token: 'path',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 1,
          startCharacter: 37,
          startOffset: 38,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ')',
        bracketInfo: {
          bracketLevel: 1,
          bracketType: BracketType.parenthesis,
        },
      },
      {
        position: {
          line: 1,
          startCharacter: 39,
          startOffset: 40,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '|',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 1,
          startCharacter: 41,
          startOffset: 42,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'SET',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 1,
          startCharacter: 45,
          startOffset: 46,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'r',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 1,
          startCharacter: 46,
          startOffset: 47,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 1,
          startCharacter: 47,
          startOffset: 48,
        },
        length: 6,
        tokenType: CypherTokenType.property,
        token: 'marked',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 1,
          startCharacter: 54,
          startOffset: 55,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '=',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 1,
          startCharacter: 56,
          startOffset: 57,
        },
        length: 4,
        tokenType: CypherTokenType.booleanLiteral,
        token: 'true',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 1,
          startCharacter: 61,
          startOffset: 62,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ')',
        bracketInfo: {
          bracketLevel: 0,
          bracketType: BracketType.parenthesis,
        },
      },
    ]);
  });
});

describe('UNWIND colouring', () => {
  test('Correctly colours UNWIND', () => {
    const query = `
      WITH [[1, 2], [3, 4], 5] AS nested
      UNWIND nested AS ix
      UNWIND ix AS iy
      RETURN iy AS number
    `;

    testSyntaxColouring(query, [
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'WITH',
      },
      {
        position: {
          line: 1,
          startCharacter: 11,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '[',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 1,
          startCharacter: 12,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '[',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 1,
        },
      },
      {
        position: {
          line: 1,
          startCharacter: 13,
        },
        length: 1,
        tokenType: CypherTokenType.numberLiteral,
        token: '1',
      },
      {
        position: {
          line: 1,
          startCharacter: 14,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.numberLiteral,
        token: '2',
      },
      {
        position: {
          line: 1,
          startCharacter: 17,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ']',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 1,
        },
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
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '[',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 1,
        },
      },
      {
        position: {
          line: 1,
          startCharacter: 21,
        },
        length: 1,
        tokenType: CypherTokenType.numberLiteral,
        token: '3',
      },
      {
        position: {
          line: 1,
          startCharacter: 22,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 24,
        },
        length: 1,
        tokenType: CypherTokenType.numberLiteral,
        token: '4',
      },
      {
        position: {
          line: 1,
          startCharacter: 25,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ']',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 1,
        },
      },
      {
        position: {
          line: 1,
          startCharacter: 26,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 28,
        },
        length: 1,
        tokenType: CypherTokenType.numberLiteral,
        token: '5',
      },
      {
        position: {
          line: 1,
          startCharacter: 29,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ']',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 1,
          startCharacter: 31,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 1,
          startCharacter: 34,
        },
        length: 6,
        tokenType: CypherTokenType.variable,
        token: 'nested',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'UNWIND',
      },
      {
        position: {
          line: 2,
          startCharacter: 13,
        },
        length: 6,
        tokenType: CypherTokenType.variable,
        token: 'nested',
      },
      {
        position: {
          line: 2,
          startCharacter: 20,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 2,
          startCharacter: 23,
        },
        length: 2,
        tokenType: CypherTokenType.variable,
        token: 'ix',
      },
      {
        position: {
          line: 3,
          startCharacter: 6,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'UNWIND',
      },
      {
        position: {
          line: 3,
          startCharacter: 13,
        },
        length: 2,
        tokenType: CypherTokenType.variable,
        token: 'ix',
      },
      {
        position: {
          line: 3,
          startCharacter: 16,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 3,
          startCharacter: 19,
        },
        length: 2,
        tokenType: CypherTokenType.variable,
        token: 'iy',
      },
      {
        position: {
          line: 4,
          startCharacter: 6,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 4,
          startCharacter: 13,
        },
        length: 2,
        tokenType: CypherTokenType.variable,
        token: 'iy',
      },
      {
        position: {
          line: 4,
          startCharacter: 16,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 4,
          startCharacter: 19,
        },
        length: 6,
        tokenType: CypherTokenType.variable,
        token: 'number',
      },
    ]);
  });
});

describe('Subqueries colouring', () => {
  test('Correctly colours subquery with two union parts', () => {
    const query = `
      CALL {
        MATCH (p:Person)-[:FRIEND_OF]->(other:Person)
        RETURN p, other
        UNION
        MATCH (p:Child)-[:CHILD_OF]->(other:Parent)
        RETURN p, other
      }
    `;

    testSyntaxColouring(query, [
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'CALL',
      },
      {
        position: {
          line: 1,
          startCharacter: 11,
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
          line: 2,
          startCharacter: 8,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'MATCH',
      },
      {
        position: {
          line: 2,
          startCharacter: 14,
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
          line: 2,
          startCharacter: 15,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'p',
      },
      {
        position: {
          line: 2,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 2,
          startCharacter: 17,
        },
        length: 6,
        tokenType: CypherTokenType.label,
        token: 'Person',
      },
      {
        position: {
          line: 2,
          startCharacter: 23,
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
          line: 2,
          startCharacter: 24,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '-',
      },
      {
        position: {
          line: 2,
          startCharacter: 25,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '[',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 2,
          startCharacter: 26,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 2,
          startCharacter: 27,
        },
        length: 9,
        tokenType: CypherTokenType.label,
        token: 'FRIEND_OF',
      },
      {
        position: {
          line: 2,
          startCharacter: 36,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ']',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 2,
          startCharacter: 37,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '-',
      },
      {
        position: {
          line: 2,
          startCharacter: 38,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '>',
      },
      {
        position: {
          line: 2,
          startCharacter: 39,
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
          line: 2,
          startCharacter: 40,
        },
        length: 5,
        tokenType: CypherTokenType.variable,
        token: 'other',
      },
      {
        position: {
          line: 2,
          startCharacter: 45,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 2,
          startCharacter: 46,
        },
        length: 6,
        tokenType: CypherTokenType.label,
        token: 'Person',
      },
      {
        position: {
          line: 2,
          startCharacter: 52,
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
          line: 3,
          startCharacter: 8,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 3,
          startCharacter: 15,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'p',
      },
      {
        position: {
          line: 3,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 3,
          startCharacter: 18,
        },
        length: 5,
        tokenType: CypherTokenType.variable,
        token: 'other',
      },
      {
        position: {
          line: 4,
          startCharacter: 8,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'UNION',
      },
      {
        position: {
          line: 5,
          startCharacter: 8,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'MATCH',
      },
      {
        position: {
          line: 5,
          startCharacter: 14,
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
          line: 5,
          startCharacter: 15,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'p',
      },
      {
        position: {
          line: 5,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 5,
          startCharacter: 17,
        },
        length: 5,
        tokenType: CypherTokenType.label,
        token: 'Child',
      },
      {
        position: {
          line: 5,
          startCharacter: 22,
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
          line: 5,
          startCharacter: 23,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '-',
      },
      {
        position: {
          line: 5,
          startCharacter: 24,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '[',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 5,
          startCharacter: 25,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 5,
          startCharacter: 26,
        },
        length: 8,
        tokenType: CypherTokenType.label,
        token: 'CHILD_OF',
      },
      {
        position: {
          line: 5,
          startCharacter: 34,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ']',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 5,
          startCharacter: 35,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '-',
      },
      {
        position: {
          line: 5,
          startCharacter: 36,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '>',
      },
      {
        position: {
          line: 5,
          startCharacter: 37,
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
          line: 5,
          startCharacter: 38,
        },
        length: 5,
        tokenType: CypherTokenType.variable,
        token: 'other',
      },
      {
        position: {
          line: 5,
          startCharacter: 43,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 5,
          startCharacter: 44,
        },
        length: 6,
        tokenType: CypherTokenType.label,
        token: 'Parent',
      },
      {
        position: {
          line: 5,
          startCharacter: 50,
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
          line: 6,
          startCharacter: 8,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 6,
          startCharacter: 15,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'p',
      },
      {
        position: {
          line: 6,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 6,
          startCharacter: 18,
        },
        length: 5,
        tokenType: CypherTokenType.variable,
        token: 'other',
      },
      {
        position: {
          line: 7,
          startCharacter: 6,
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

  test('Correctly colours EXISTS', () => {
    const query = `
      MATCH (p:Person)
      WHERE EXISTS {
        MATCH (p)-[:HAS_DOG]->(dog:Dog)
        WHERE p.name = dog.name
      }
      RETURN person.name AS name
    `;

    testSyntaxColouring(query, [
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'MATCH',
      },
      {
        position: {
          line: 1,
          startCharacter: 12,
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
          line: 1,
          startCharacter: 13,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'p',
      },
      {
        position: {
          line: 1,
          startCharacter: 14,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 1,
          startCharacter: 15,
        },
        length: 6,
        tokenType: CypherTokenType.label,
        token: 'Person',
      },
      {
        position: {
          line: 1,
          startCharacter: 21,
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
        tokenType: CypherTokenType.keyword,
        token: 'EXISTS',
      },
      {
        position: {
          line: 2,
          startCharacter: 19,
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
          line: 3,
          startCharacter: 8,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'MATCH',
      },
      {
        position: {
          line: 3,
          startCharacter: 14,
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
          line: 3,
          startCharacter: 15,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'p',
      },
      {
        position: {
          line: 3,
          startCharacter: 16,
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
          line: 3,
          startCharacter: 17,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '-',
      },
      {
        position: {
          line: 3,
          startCharacter: 18,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '[',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 3,
          startCharacter: 19,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 3,
          startCharacter: 20,
        },
        length: 7,
        tokenType: CypherTokenType.label,
        token: 'HAS_DOG',
      },
      {
        position: {
          line: 3,
          startCharacter: 27,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ']',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 3,
          startCharacter: 28,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '-',
      },
      {
        position: {
          line: 3,
          startCharacter: 29,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '>',
      },
      {
        position: {
          line: 3,
          startCharacter: 30,
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
          line: 3,
          startCharacter: 31,
        },
        length: 3,
        tokenType: CypherTokenType.variable,
        token: 'dog',
      },
      {
        position: {
          line: 3,
          startCharacter: 34,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 3,
          startCharacter: 35,
        },
        length: 3,
        tokenType: CypherTokenType.label,
        token: 'Dog',
      },
      {
        position: {
          line: 3,
          startCharacter: 38,
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
          line: 4,
          startCharacter: 8,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'WHERE',
      },
      {
        position: {
          line: 4,
          startCharacter: 14,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'p',
      },
      {
        position: {
          line: 4,
          startCharacter: 15,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 4,
          startCharacter: 16,
        },
        length: 4,
        tokenType: CypherTokenType.property,
        token: 'name',
      },
      {
        position: {
          line: 4,
          startCharacter: 21,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '=',
      },
      {
        position: {
          line: 4,
          startCharacter: 23,
        },
        length: 3,
        tokenType: CypherTokenType.variable,
        token: 'dog',
      },
      {
        position: {
          line: 4,
          startCharacter: 26,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 4,
          startCharacter: 27,
        },
        length: 4,
        tokenType: CypherTokenType.property,
        token: 'name',
      },
      {
        position: {
          line: 5,
          startCharacter: 6,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '}',
        bracketInfo: {
          bracketType: BracketType.curly,
          bracketLevel: 0,
        },
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
        length: 6,
        tokenType: CypherTokenType.variable,
        token: 'person',
      },
      {
        position: {
          line: 6,
          startCharacter: 19,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 6,
          startCharacter: 20,
        },
        length: 4,
        tokenType: CypherTokenType.property,
        token: 'name',
      },
      {
        position: {
          line: 6,
          startCharacter: 25,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 6,
          startCharacter: 28,
        },
        length: 4,
        tokenType: CypherTokenType.variable,
        token: 'name',
      },
    ]);
  });

  test('Correctly colours COUNT', () => {
    const query = `
      MATCH (p:Person)
      WHERE COUNT { (p)-[:HAS_DOG]->(d:Dog) } > 1
      RETURN p.name AS name
    `;

    testSyntaxColouring(query, [
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'MATCH',
      },
      {
        position: {
          line: 1,
          startCharacter: 12,
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
          line: 1,
          startCharacter: 13,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'p',
      },
      {
        position: {
          line: 1,
          startCharacter: 14,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 1,
          startCharacter: 15,
        },
        length: 6,
        tokenType: CypherTokenType.label,
        token: 'Person',
      },
      {
        position: {
          line: 1,
          startCharacter: 21,
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
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'COUNT',
      },
      {
        position: {
          line: 2,
          startCharacter: 18,
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
          line: 2,
          startCharacter: 20,
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
          line: 2,
          startCharacter: 21,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'p',
      },
      {
        position: {
          line: 2,
          startCharacter: 22,
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
          line: 2,
          startCharacter: 23,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '-',
      },
      {
        position: {
          line: 2,
          startCharacter: 24,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '[',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 2,
          startCharacter: 25,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 2,
          startCharacter: 26,
        },
        length: 7,
        tokenType: CypherTokenType.label,
        token: 'HAS_DOG',
      },
      {
        position: {
          line: 2,
          startCharacter: 33,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ']',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 2,
          startCharacter: 34,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '-',
      },
      {
        position: {
          line: 2,
          startCharacter: 35,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '>',
      },
      {
        position: {
          line: 2,
          startCharacter: 36,
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
          line: 2,
          startCharacter: 37,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'd',
      },
      {
        position: {
          line: 2,
          startCharacter: 38,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 2,
          startCharacter: 39,
        },
        length: 3,
        tokenType: CypherTokenType.label,
        token: 'Dog',
      },
      {
        position: {
          line: 2,
          startCharacter: 42,
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
          line: 2,
          startCharacter: 44,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '}',
        bracketInfo: {
          bracketType: BracketType.curly,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 2,
          startCharacter: 46,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '>',
      },
      {
        position: {
          line: 2,
          startCharacter: 48,
        },
        length: 1,
        tokenType: CypherTokenType.numberLiteral,
        token: '1',
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
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'p',
      },
      {
        position: {
          line: 3,
          startCharacter: 14,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 3,
          startCharacter: 15,
        },
        length: 4,
        tokenType: CypherTokenType.property,
        token: 'name',
      },
      {
        position: {
          line: 3,
          startCharacter: 20,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 3,
          startCharacter: 23,
        },
        length: 4,
        tokenType: CypherTokenType.variable,
        token: 'name',
      },
    ]);
  });
});

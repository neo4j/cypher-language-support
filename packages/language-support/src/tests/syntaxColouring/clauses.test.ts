import { applySyntaxColouring } from '../../syntaxColouring/syntaxColouring';

describe('CALL syntax colouring', () => {
  test('Correctly colours standalone procedure CALL', () => {
    const query = 'CALL dbms.info() YIELD *';

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'CALL',
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
        token: 'dbms',
        tokenType: 'procedure',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 10,
          startOffset: 10,
        },
        token: 'info',
        tokenType: 'procedure',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 14,
          startOffset: 14,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 15,
          startOffset: 15,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 17,
          startOffset: 17,
        },
        token: 'YIELD',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 23,
          startOffset: 23,
        },
        token: '*',
        tokenType: 'operator',
      },
    ]);
  });

  test('Correctly colours procedure CALL with yield', () => {
    const query =
      'CALL apoc.do.when(true, "foo", false, "bar") YIELD name, result';

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'CALL',
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
        token: 'apoc',
        tokenType: 'procedure',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 10,
          startOffset: 10,
        },
        token: 'do',
        tokenType: 'procedure',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 12,
          startOffset: 12,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 13,
          startOffset: 13,
        },
        token: 'when',
        tokenType: 'procedure',
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
        length: 4,
        position: {
          line: 0,
          startCharacter: 18,
          startOffset: 18,
        },
        token: 'true',
        tokenType: 'booleanLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 22,
          startOffset: 22,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 24,
          startOffset: 24,
        },
        token: '"foo"',
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 29,
          startOffset: 29,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 31,
          startOffset: 31,
        },
        token: 'false',
        tokenType: 'booleanLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 36,
          startOffset: 36,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 38,
          startOffset: 38,
        },
        token: '"bar"',
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 43,
          startOffset: 43,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 45,
          startOffset: 45,
        },
        token: 'YIELD',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 51,
          startOffset: 51,
        },
        token: 'name',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 55,
          startOffset: 55,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 57,
          startOffset: 57,
        },
        token: 'result',
        tokenType: 'variable',
      },
    ]);
  });
});

describe('CASE syntax colouring', () => {
  test('Correctly colours CASE', () => {
    const query = `
      RETURN
      CASE
        WHEN n:A&B THEN 1
        WHEN r:!R1&!R2 THEN 2
        ELSE -1
      END AS result
    `;

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 7,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 20,
        },
        token: 'CASE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 3,
          startCharacter: 8,
          startOffset: 33,
        },
        token: 'WHEN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 13,
          startOffset: 38,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 14,
          startOffset: 39,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 15,
          startOffset: 40,
        },
        token: 'A',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 16,
          startOffset: 41,
        },
        token: '&',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 17,
          startOffset: 42,
        },
        token: 'B',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 3,
          startCharacter: 19,
          startOffset: 44,
        },
        token: 'THEN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 24,
          startOffset: 49,
        },
        token: '1',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 4,
          startCharacter: 8,
          startOffset: 59,
        },
        token: 'WHEN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 4,
          startCharacter: 13,
          startOffset: 64,
        },
        token: 'r',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 4,
          startCharacter: 14,
          startOffset: 65,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 4,
          startCharacter: 15,
          startOffset: 66,
        },
        token: '!',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 4,
          startCharacter: 16,
          startOffset: 67,
        },
        token: 'R1',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 4,
          startCharacter: 18,
          startOffset: 69,
        },
        token: '&',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 4,
          startCharacter: 19,
          startOffset: 70,
        },
        token: '!',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 4,
          startCharacter: 20,
          startOffset: 71,
        },
        token: 'R2',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 4,
          startCharacter: 23,
          startOffset: 74,
        },
        token: 'THEN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 4,
          startCharacter: 28,
          startOffset: 79,
        },
        token: '2',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 5,
          startCharacter: 8,
          startOffset: 89,
        },
        token: 'ELSE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 5,
          startCharacter: 13,
          startOffset: 94,
        },
        token: '-1',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 6,
          startCharacter: 6,
          startOffset: 103,
        },
        token: 'END',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 6,
          startCharacter: 10,
          startOffset: 107,
        },
        token: 'AS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 6,
          startCharacter: 13,
          startOffset: 110,
        },
        token: 'result',
        tokenType: 'variable',
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

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 7,
        },
        token: 'LOAD',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 1,
          startCharacter: 11,
          startOffset: 12,
        },
        token: 'CSV',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 1,
          startCharacter: 15,
          startOffset: 16,
        },
        token: 'WITH',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 1,
          startCharacter: 20,
          startOffset: 21,
        },
        token: 'HEADERS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 1,
          startCharacter: 28,
          startOffset: 29,
        },
        token: 'FROM',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 74,
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 40,
        },
        token:
          "'https://neo4j.com/docs/cypher-cheat-sheet/5/csv/artists-with-headers.csv'",
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 3,
          startCharacter: 6,
          startOffset: 121,
        },
        token: 'AS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 3,
          startCharacter: 9,
          startOffset: 124,
        },
        token: 'line',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 4,
          startCharacter: 6,
          startOffset: 135,
        },
        token: 'CALL',
        tokenType: 'keyword',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 4,
          startCharacter: 11,
          startOffset: 140,
        },
        token: '{',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 5,
          startCharacter: 8,
          startOffset: 150,
        },
        token: 'WITH',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 5,
          startCharacter: 13,
          startOffset: 155,
        },
        token: 'line',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 6,
          startCharacter: 8,
          startOffset: 168,
        },
        token: 'CREATE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 6,
          startCharacter: 15,
          startOffset: 175,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 6,
          startCharacter: 16,
          startOffset: 176,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 6,
          startCharacter: 17,
          startOffset: 177,
        },
        token: 'Artist',
        tokenType: 'label',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 6,
          startCharacter: 24,
          startOffset: 184,
        },
        token: '{',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 6,
          startCharacter: 25,
          startOffset: 185,
        },
        token: 'name',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 6,
          startCharacter: 29,
          startOffset: 189,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 6,
          startCharacter: 31,
          startOffset: 191,
        },
        token: 'line',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 6,
          startCharacter: 35,
          startOffset: 195,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 6,
          startCharacter: 36,
          startOffset: 196,
        },
        token: 'Name',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 6,
          startCharacter: 40,
          startOffset: 200,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 6,
          startCharacter: 42,
          startOffset: 202,
        },
        token: 'year',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 6,
          startCharacter: 46,
          startOffset: 206,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 6,
          startCharacter: 48,
          startOffset: 208,
        },
        token: 'toInteger',
        tokenType: 'function',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 6,
          startCharacter: 57,
          startOffset: 217,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 6,
          startCharacter: 58,
          startOffset: 218,
        },
        token: 'line',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 6,
          startCharacter: 62,
          startOffset: 222,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 6,
          startCharacter: 63,
          startOffset: 223,
        },
        token: 'Year',
        tokenType: 'property',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 6,
          startCharacter: 67,
          startOffset: 227,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 6,
          startCharacter: 68,
          startOffset: 228,
        },
        token: '}',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 6,
          startCharacter: 69,
          startOffset: 229,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 7,
          startCharacter: 6,
          startOffset: 237,
        },
        token: '}',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 7,
          startCharacter: 8,
          startOffset: 239,
        },
        token: 'IN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 12,
        position: {
          line: 7,
          startCharacter: 11,
          startOffset: 242,
        },
        token: 'TRANSACTIONS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 7,
          startCharacter: 24,
          startOffset: 255,
        },
        token: 'OF',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 7,
          startCharacter: 27,
          startOffset: 258,
        },
        token: '500',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 7,
          startCharacter: 31,
          startOffset: 262,
        },
        token: 'ROWS',
        tokenType: 'keyword',
      },
    ]);
  });
});

describe('USE colouring', () => {
  test('Correctly colours USE', () => {
    const query = `
      USE neo4j
      WHERE n.name = 'Alice'
    `;

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 7,
        },
        token: 'USE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 1,
          startCharacter: 10,
          startOffset: 11,
        },
        token: 'neo4j',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 23,
        },
        token: 'WHERE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 12,
          startOffset: 29,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 13,
          startOffset: 30,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 2,
          startCharacter: 14,
          startOffset: 31,
        },
        token: 'name',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 19,
          startOffset: 36,
        },
        token: '=',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 2,
          startCharacter: 21,
          startOffset: 38,
        },
        token: "'Alice'",
        tokenType: 'stringLiteral',
      },
    ]);
  });
});

describe('FOREACH syntax colouring', () => {
  test('Correctly colours FOREACH', () => {
    const query = `
    FOREACH ( r IN relationships(path) | SET r.marked = true )
    `;

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 1,
          startCharacter: 4,
          startOffset: 5,
        },
        token: 'FOREACH',
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
          startCharacter: 12,
          startOffset: 13,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 14,
          startOffset: 15,
        },
        token: 'r',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 1,
          startCharacter: 16,
          startOffset: 17,
        },
        token: 'IN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 13,
        position: {
          line: 1,
          startCharacter: 19,
          startOffset: 20,
        },
        token: 'relationships',
        tokenType: 'function',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 1,
          startCharacter: 32,
          startOffset: 33,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 1,
          startCharacter: 33,
          startOffset: 34,
        },
        token: 'path',
        tokenType: 'variable',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 1,
          startCharacter: 37,
          startOffset: 38,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 39,
          startOffset: 40,
        },
        token: '|',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 1,
          startCharacter: 41,
          startOffset: 42,
        },
        token: 'SET',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 45,
          startOffset: 46,
        },
        token: 'r',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 46,
          startOffset: 47,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 1,
          startCharacter: 47,
          startOffset: 48,
        },
        token: 'marked',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 54,
          startOffset: 55,
        },
        token: '=',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 1,
          startCharacter: 56,
          startOffset: 57,
        },
        token: 'true',
        tokenType: 'booleanLiteral',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 1,
          startCharacter: 61,
          startOffset: 62,
        },
        token: ')',
        tokenType: 'bracket',
      },
    ]);
  });
});

describe('UNWIND colouring', () => {
  test('Correctly colours UNWIND', () => {
    const query = `
      UNWIND nested AS ix
      UNWIND ix AS iy
      RETURN iy AS number
    `;

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 7,
        },
        token: 'UNWIND',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 1,
          startCharacter: 13,
          startOffset: 14,
        },
        token: 'nested',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 1,
          startCharacter: 20,
          startOffset: 21,
        },
        token: 'AS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 1,
          startCharacter: 23,
          startOffset: 24,
        },
        token: 'ix',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 33,
        },
        token: 'UNWIND',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 2,
          startCharacter: 13,
          startOffset: 40,
        },
        token: 'ix',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 2,
          startCharacter: 16,
          startOffset: 43,
        },
        token: 'AS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 2,
          startCharacter: 19,
          startOffset: 46,
        },
        token: 'iy',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 3,
          startCharacter: 6,
          startOffset: 55,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 3,
          startCharacter: 13,
          startOffset: 62,
        },
        token: 'iy',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 3,
          startCharacter: 16,
          startOffset: 65,
        },
        token: 'AS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 3,
          startCharacter: 19,
          startOffset: 68,
        },
        token: 'number',
        tokenType: 'variable',
      },
    ]);
  });
});

describe('Subqueries colouring', () => {
  test('Correctly colours subquery with two union parts', () => {
    const query = `
      CALL {
        RETURN p, other
        UNION
        RETURN p, other
      }
    `;

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 7,
        },
        token: 'CALL',
        tokenType: 'keyword',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 1,
          startCharacter: 11,
          startOffset: 12,
        },
        token: '{',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 2,
          startCharacter: 8,
          startOffset: 22,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 15,
          startOffset: 29,
        },
        token: 'p',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 16,
          startOffset: 30,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 2,
          startCharacter: 18,
          startOffset: 32,
        },
        token: 'other',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 3,
          startCharacter: 8,
          startOffset: 46,
        },
        token: 'UNION',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 4,
          startCharacter: 8,
          startOffset: 60,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 4,
          startCharacter: 15,
          startOffset: 67,
        },
        token: 'p',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 4,
          startCharacter: 16,
          startOffset: 68,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 4,
          startCharacter: 18,
          startOffset: 70,
        },
        token: 'other',
        tokenType: 'variable',
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
          startOffset: 82,
        },
        token: '}',
        tokenType: 'bracket',
      },
    ]);
  });

  test('Correctly colours EXISTS', () => {
    const query = `
      MATCH (p:Person)
      WHERE EXISTS {
        WHERE p.name = dog.name
      }
      RETURN person.name AS name
    `;

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 7,
        },
        token: 'MATCH',
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
          startCharacter: 12,
          startOffset: 13,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 13,
          startOffset: 14,
        },
        token: 'p',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 14,
          startOffset: 15,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 1,
          startCharacter: 15,
          startOffset: 16,
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
          startCharacter: 21,
          startOffset: 22,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 30,
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
          startOffset: 36,
        },
        token: 'EXISTS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 2,
          startCharacter: 19,
          startOffset: 43,
        },
        token: '{',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 3,
          startCharacter: 8,
          startOffset: 53,
        },
        token: 'WHERE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 14,
          startOffset: 59,
        },
        token: 'p',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 15,
          startOffset: 60,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 3,
          startCharacter: 16,
          startOffset: 61,
        },
        token: 'name',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 21,
          startOffset: 66,
        },
        token: '=',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 3,
          startCharacter: 23,
          startOffset: 68,
        },
        token: 'dog',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 26,
          startOffset: 71,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 3,
          startCharacter: 27,
          startOffset: 72,
        },
        token: 'name',
        tokenType: 'property',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 4,
          startCharacter: 6,
          startOffset: 83,
        },
        token: '}',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 5,
          startCharacter: 6,
          startOffset: 91,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 5,
          startCharacter: 13,
          startOffset: 98,
        },
        token: 'person',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 5,
          startCharacter: 19,
          startOffset: 104,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 5,
          startCharacter: 20,
          startOffset: 105,
        },
        token: 'name',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 5,
          startCharacter: 25,
          startOffset: 110,
        },
        token: 'AS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 5,
          startCharacter: 28,
          startOffset: 113,
        },
        token: 'name',
        tokenType: 'keyword',
      },
    ]);
  });

  test('Correctly colours COUNT', () => {
    const query = `
      MATCH (p:Person)
      RETURN p.name AS name
    `;

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 7,
        },
        token: 'MATCH',
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
          startCharacter: 12,
          startOffset: 13,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 13,
          startOffset: 14,
        },
        token: 'p',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 14,
          startOffset: 15,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 1,
          startCharacter: 15,
          startOffset: 16,
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
          startCharacter: 21,
          startOffset: 22,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 30,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 13,
          startOffset: 37,
        },
        token: 'p',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 14,
          startOffset: 38,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 2,
          startCharacter: 15,
          startOffset: 39,
        },
        token: 'name',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 2,
          startCharacter: 20,
          startOffset: 44,
        },
        token: 'AS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 2,
          startCharacter: 23,
          startOffset: 47,
        },
        token: 'name',
        tokenType: 'variable',
      },
    ]);
  });
});

describe('CREATE colouring', () => {
  test('correctly highlight broken create constraint', () => {
    // is missing :Label, should not crash
    expect(applySyntaxColouring('CREATE CONSTRAINT FOR (node)')).toEqual([
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
        length: 3,
        position: {
          line: 0,
          startCharacter: 18,
          startOffset: 18,
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
          startCharacter: 22,
          startOffset: 22,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 23,
          startOffset: 23,
        },
        token: 'node',
        tokenType: 'variable',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 27,
          startOffset: 27,
        },
        token: ')',
        tokenType: 'bracket',
      },
    ]);
  });
});

import { TokenType } from '../../../highlighting/colouringTable';
import { testSyntaxColouring } from './helpers';

describe('WHERE syntax colouring', () => {
  test('Correctly colours MATCH with WHERE and RETURN', async () => {
    const query = 'MATCH (n:Person) WHERE n.name = "foo" RETURN n';

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
        length: 5,
        tokenType: TokenType.keyword,
        token: 'WHERE',
      },
      {
        position: {
          line: 0,
          startCharacter: 23,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 0,
          startCharacter: 25,
        },
        length: 4,
        tokenType: TokenType.property,
        token: 'name',
      },
      {
        position: {
          line: 0,
          startCharacter: 30,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '=',
      },
      {
        position: {
          line: 0,
          startCharacter: 32,
        },
        length: 5,
        tokenType: TokenType.literal,
        token: '"foo"',
      },
      {
        position: {
          line: 0,
          startCharacter: 38,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 0,
          startCharacter: 45,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'n',
      },
    ]);
  });

  test('Correctly colours WHERE with parameter', async () => {
    const query = `MATCH (n:Label)-->(m:Label)
    WHERE n.property <> $value
    RETURN n, m`;

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
        length: 5,
        tokenType: TokenType.type,
        token: 'Label',
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
      {
        position: {
          line: 0,
          startCharacter: 15,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '-',
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '-',
      },
      {
        position: {
          line: 0,
          startCharacter: 17,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '>',
      },
      {
        position: {
          line: 0,
          startCharacter: 18,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 0,
          startCharacter: 19,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'm',
      },
      {
        position: {
          line: 0,
          startCharacter: 20,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 21,
        },
        length: 5,
        tokenType: TokenType.type,
        token: 'Label',
      },
      {
        position: {
          line: 0,
          startCharacter: 26,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 1,
          startCharacter: 4,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'WHERE',
      },
      {
        position: {
          line: 1,
          startCharacter: 10,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 1,
          startCharacter: 11,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 1,
          startCharacter: 12,
        },
        length: 8,
        tokenType: TokenType.property,
        token: 'property',
      },
      {
        position: {
          line: 1,
          startCharacter: 21,
        },
        length: 2,
        tokenType: TokenType.operator,
        token: '<>',
      },
      {
        position: {
          line: 1,
          startCharacter: 24,
        },
        length: 1,
        tokenType: TokenType.namespace,
        token: '$',
      },
      {
        position: {
          line: 1,
          startCharacter: 25,
        },
        length: 5,
        tokenType: TokenType.parameter,
        token: 'value',
      },
      {
        position: {
          line: 2,
          startCharacter: 4,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 2,
          startCharacter: 11,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 2,
          startCharacter: 12,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 2,
          startCharacter: 14,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'm',
      },
    ]);
  });

  test('Correctly colours relationship with WHERE', async () => {
    const query = `WITH 2000 AS minYear
    MATCH (a:Person {name: 'Andy'})
    RETURN [(a)-[r:KNOWS WHERE r.since < minYear]->(b:Person) | r.since] AS years`;

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'WITH',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 4,
        tokenType: TokenType.literal,
        token: '2000',
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
        },
        length: 2,
        tokenType: TokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 0,
          startCharacter: 13,
        },
        length: 7,
        tokenType: TokenType.variable,
        token: 'minYear',
      },
      {
        position: {
          line: 1,
          startCharacter: 4,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'MATCH',
      },
      {
        position: {
          line: 1,
          startCharacter: 10,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 1,
          startCharacter: 11,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'a',
      },
      {
        position: {
          line: 1,
          startCharacter: 12,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 1,
          startCharacter: 13,
        },
        length: 6,
        tokenType: TokenType.type,
        token: 'Person',
      },
      {
        position: {
          line: 1,
          startCharacter: 20,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '{',
      },
      {
        position: {
          line: 1,
          startCharacter: 21,
        },
        length: 4,
        tokenType: TokenType.property,
        token: 'name',
      },
      {
        position: {
          line: 1,
          startCharacter: 25,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 1,
          startCharacter: 27,
        },
        length: 6,
        tokenType: TokenType.literal,
        token: "'Andy'",
      },
      {
        position: {
          line: 1,
          startCharacter: 33,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '}',
      },
      {
        position: {
          line: 1,
          startCharacter: 34,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 2,
          startCharacter: 4,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 2,
          startCharacter: 11,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '[',
      },
      {
        position: {
          line: 2,
          startCharacter: 12,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 2,
          startCharacter: 13,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'a',
      },
      {
        position: {
          line: 2,
          startCharacter: 14,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 2,
          startCharacter: 15,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '-',
      },
      {
        position: {
          line: 2,
          startCharacter: 16,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '[',
      },
      {
        position: {
          line: 2,
          startCharacter: 17,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'r',
      },
      {
        position: {
          line: 2,
          startCharacter: 18,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 2,
          startCharacter: 19,
        },
        length: 5,
        tokenType: TokenType.type,
        token: 'KNOWS',
      },
      {
        position: {
          line: 2,
          startCharacter: 25,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'WHERE',
      },
      {
        position: {
          line: 2,
          startCharacter: 31,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'r',
      },
      {
        position: {
          line: 2,
          startCharacter: 32,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 2,
          startCharacter: 33,
        },
        length: 5,
        tokenType: TokenType.property,
        token: 'since',
      },
      {
        position: {
          line: 2,
          startCharacter: 39,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '<',
      },
      {
        position: {
          line: 2,
          startCharacter: 41,
        },
        length: 7,
        tokenType: TokenType.variable,
        token: 'minYear',
      },
      {
        position: {
          line: 2,
          startCharacter: 48,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ']',
      },
      {
        position: {
          line: 2,
          startCharacter: 49,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '-',
      },
      {
        position: {
          line: 2,
          startCharacter: 50,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '>',
      },
      {
        position: {
          line: 2,
          startCharacter: 51,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 2,
          startCharacter: 52,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'b',
      },
      {
        position: {
          line: 2,
          startCharacter: 53,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 2,
          startCharacter: 54,
        },
        length: 6,
        tokenType: TokenType.type,
        token: 'Person',
      },
      {
        position: {
          line: 2,
          startCharacter: 60,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 2,
          startCharacter: 62,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '|',
      },
      {
        position: {
          line: 2,
          startCharacter: 64,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'r',
      },
      {
        position: {
          line: 2,
          startCharacter: 65,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 2,
          startCharacter: 66,
        },
        length: 5,
        tokenType: TokenType.property,
        token: 'since',
      },
      {
        position: {
          line: 2,
          startCharacter: 71,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ']',
      },
      {
        position: {
          line: 2,
          startCharacter: 73,
        },
        length: 2,
        tokenType: TokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 2,
          startCharacter: 76,
        },
        length: 5,
        tokenType: TokenType.variable,
        token: 'years',
      },
    ]);
  });
});

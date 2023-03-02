import { TokenType } from '../../highlighting/colouringTable';
import { testSyntaxColouring } from './helpers';

describe('MATCH syntax colouring', () => {
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

  test('Correctly colours AS', async () => {
    const query = 'MATCH (n:Person) RETURN n AS foo';

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
        length: 6,
        tokenType: TokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 0,
          startCharacter: 26,
        },
        length: 2,
        tokenType: TokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 0,
          startCharacter: 29,
        },
        length: 3,
        tokenType: TokenType.variable,
        token: 'foo',
      },
    ]);
  });

  test('Correctly colours labels conjunction', async () => {
    const query = 'MATCH (n:A&B)';

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
        length: 1,
        tokenType: TokenType.type,
        token: 'A',
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '&',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 1,
        tokenType: TokenType.type,
        token: 'B',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
    ]);
  });

  test('Correctly colours labels disjuntion', async () => {
    const query = 'MATCH (n:A|B)';

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
        length: 1,
        tokenType: TokenType.type,
        token: 'A',
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '|',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 1,
        tokenType: TokenType.type,
        token: 'B',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
    ]);
  });

  test('Correctly colours negated label', async () => {
    const query = 'MATCH (n:!A)';

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
        length: 1,
        tokenType: TokenType.operator,
        token: '!',
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
        },
        length: 1,
        tokenType: TokenType.type,
        token: 'A',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
    ]);
  });
});

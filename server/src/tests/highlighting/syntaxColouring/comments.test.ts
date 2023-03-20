import { CypherTokenType } from '../../../lexerSymbols';
import { testSyntaxColouring } from './helpers';

describe('Comments syntax colouring', () => {
  test('Correctly colours one line comments', async () => {
    const query = `
    // Some comment
    // Another comment
    CALL foo.bar()
    `;

    await testSyntaxColouring(query, [
      {
        position: {
          line: 1,
          startCharacter: 4,
        },
        length: 15,
        tokenType: CypherTokenType.comment,
        token: '// Some comment',
      },
      {
        position: {
          line: 2,
          startCharacter: 4,
        },
        length: 18,
        tokenType: CypherTokenType.comment,
        token: '// Another comment',
      },
      {
        position: {
          line: 3,
          startCharacter: 4,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'CALL',
      },
      {
        position: {
          line: 3,
          startCharacter: 9,
        },
        length: 3,
        tokenType: CypherTokenType.procedure,
        token: 'foo',
      },
      {
        position: {
          line: 3,
          startCharacter: 12,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 3,
          startCharacter: 13,
        },
        length: 3,
        tokenType: CypherTokenType.procedure,
        token: 'bar',
      },
      {
        position: {
          line: 3,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.none,
        token: '(',
      },
      {
        position: {
          line: 3,
          startCharacter: 17,
        },
        length: 1,
        tokenType: CypherTokenType.none,
        token: ')',
      },
    ]);
  });

  test('Correctly colours multiline comments', async () => {
    const query = `
    /* Some multiline
    comment
    */  
    CALL foo.bar()
    `;

    await testSyntaxColouring(query, [
      {
        position: {
          line: 1,
          startCharacter: 4,
        },
        length: 17,
        tokenType: CypherTokenType.comment,
        token: '/* Some multiline',
      },
      {
        position: {
          line: 2,
          startCharacter: 0,
        },
        length: 11,
        tokenType: CypherTokenType.comment,
        token: '    comment',
      },
      {
        position: {
          line: 3,
          startCharacter: 0,
        },
        length: 6,
        tokenType: CypherTokenType.comment,
        token: '    */',
      },
      {
        position: {
          line: 4,
          startCharacter: 4,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'CALL',
      },
      {
        position: {
          line: 4,
          startCharacter: 9,
        },
        length: 3,
        tokenType: CypherTokenType.procedure,
        token: 'foo',
      },
      {
        position: {
          line: 4,
          startCharacter: 12,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 4,
          startCharacter: 13,
        },
        length: 3,
        tokenType: CypherTokenType.procedure,
        token: 'bar',
      },
      {
        position: {
          line: 4,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.none,
        token: '(',
      },
      {
        position: {
          line: 4,
          startCharacter: 17,
        },
        length: 1,
        tokenType: CypherTokenType.none,
        token: ')',
      },
    ]);
  });
});

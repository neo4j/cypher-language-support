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
        tokenType: 1,
        token: 'SHOW',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 7,
        tokenType: 1,
        token: 'INDEXES',
      },
      {
        position: {
          line: 0,
          startCharacter: 13,
        },
        length: 5,
        tokenType: 1,
        token: 'YIELD',
      },
      {
        position: {
          line: 0,
          startCharacter: 19,
        },
        length: 1,
        tokenType: 6,
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
        tokenType: 1,
        token: 'CREATE',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 5,
        tokenType: 1,
        token: 'INDEX',
      },
      {
        position: {
          line: 0,
          startCharacter: 13,
        },
        length: 10,
        tokenType: 10,
        token: 'index_name',
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 3,
        tokenType: 1,
        token: 'FOR',
      },
      {
        position: {
          line: 0,
          startCharacter: 28,
        },
        length: 1,
        tokenType: 10,
        token: '(',
      },
      {
        position: {
          line: 0,
          startCharacter: 29,
        },
        length: 1,
        tokenType: 4,
        token: 'p',
      },
      {
        position: {
          line: 0,
          startCharacter: 30,
        },
        length: 1,
        tokenType: 6,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 31,
        },
        length: 6,
        tokenType: 10,
        token: 'Person',
      },
      {
        position: {
          line: 0,
          startCharacter: 37,
        },
        length: 1,
        tokenType: 10,
        token: ')',
      },
      {
        position: {
          line: 0,
          startCharacter: 39,
        },
        length: 2,
        tokenType: 1,
        token: 'ON',
      },
      {
        position: {
          line: 0,
          startCharacter: 42,
        },
        length: 1,
        tokenType: 10,
        token: '(',
      },
      {
        position: {
          line: 0,
          startCharacter: 43,
        },
        length: 1,
        tokenType: 4,
        token: 'p',
      },
      {
        position: {
          line: 0,
          startCharacter: 44,
        },
        length: 1,
        tokenType: 6,
        token: '.',
      },
      {
        position: {
          line: 0,
          startCharacter: 45,
        },
        length: 4,
        tokenType: 8,
        token: 'name',
      },
      {
        position: {
          line: 0,
          startCharacter: 49,
        },
        length: 1,
        tokenType: 10,
        token: ')',
      },
    ]);
  });
});

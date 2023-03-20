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
        tokenType: 0,
        token: '// Some comment',
      },
      {
        position: {
          line: 2,
          startCharacter: 4,
        },
        length: 18,
        tokenType: 0,
        token: '// Another comment',
      },
      {
        position: {
          line: 3,
          startCharacter: 4,
        },
        length: 4,
        tokenType: 1,
        token: 'CALL',
      },
      {
        position: {
          line: 3,
          startCharacter: 9,
        },
        length: 3,
        tokenType: 3,
        token: 'foo',
      },
      {
        position: {
          line: 3,
          startCharacter: 12,
        },
        length: 1,
        tokenType: 6,
        token: '.',
      },
      {
        position: {
          line: 3,
          startCharacter: 13,
        },
        length: 3,
        tokenType: 3,
        token: 'bar',
      },
      {
        position: {
          line: 3,
          startCharacter: 16,
        },
        length: 1,
        tokenType: 11,
        token: '(',
      },
      {
        position: {
          line: 3,
          startCharacter: 17,
        },
        length: 1,
        tokenType: 11,
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
        tokenType: 0,
        token: '/* Some multiline',
      },
      {
        position: {
          line: 2,
          startCharacter: 0,
        },
        length: 11,
        tokenType: 0,
        token: '    comment',
      },
      {
        position: {
          line: 3,
          startCharacter: 0,
        },
        length: 6,
        tokenType: 0,
        token: '    */',
      },
      {
        position: {
          line: 4,
          startCharacter: 4,
        },
        length: 4,
        tokenType: 1,
        token: 'CALL',
      },
      {
        position: {
          line: 4,
          startCharacter: 9,
        },
        length: 3,
        tokenType: 3,
        token: 'foo',
      },
      {
        position: {
          line: 4,
          startCharacter: 12,
        },
        length: 1,
        tokenType: 6,
        token: '.',
      },
      {
        position: {
          line: 4,
          startCharacter: 13,
        },
        length: 3,
        tokenType: 3,
        token: 'bar',
      },
      {
        position: {
          line: 4,
          startCharacter: 16,
        },
        length: 1,
        tokenType: 11,
        token: '(',
      },
      {
        position: {
          line: 4,
          startCharacter: 17,
        },
        length: 1,
        tokenType: 11,
        token: ')',
      },
    ]);
  });
});

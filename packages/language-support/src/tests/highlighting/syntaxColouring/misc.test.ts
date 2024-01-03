import { applySyntaxColouring } from '../../../highlighting/syntaxColouring/syntaxColouring';

describe('Unfinished tokens', () => {
  test('Correctly colours unfinished string with double quotes', () => {
    const query = `RETURN "something`;

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'RETURN',
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
        token: '"something',
        tokenType: 'stringLiteral',
      },
    ]);
  });

  test('Correctly colours unfinished string with single quotes', () => {
    const query = `RETURN 'something`;

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'RETURN',
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
        token: "'something",
        tokenType: 'stringLiteral',
      },
    ]);
  });

  test('Correctly colours unfinished multiline strings', () => {
    const query = `RETURN "something
        foo
        bar`;

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 34,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: `"something
        foo
        bar`,
        tokenType: 'stringLiteral',
      },
    ]);
  });

  test('Correctly colours unfinished multiline comment', () => {
    const query = `/* something
        foo
        MATCH (n)`;

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 42,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: `/* something
        foo
        MATCH (n)`,
        tokenType: 'comment',
      },
    ]);
  });

  test('Correctly colours unfinished property keys', () => {
    const query = `RETURN {\`something
    foo
 
    bar: "hello"}`;

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'RETURN',
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
          startCharacter: 7,
          startOffset: 7,
        },
        token: '{',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 38,
        position: {
          line: 0,
          startCharacter: 8,
          startOffset: 8,
        },
        token: `\`something
    foo
 
    bar: "hello"}`,
        tokenType: 'symbolicName',
      },
    ]);
  });
});

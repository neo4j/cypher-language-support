import { applySyntaxColouring } from '../../syntaxColouring/syntaxColouring';

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
        length: 10,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: '"something',
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 11,
        position: {
          line: 1,
          startCharacter: 0,
          startOffset: 18,
        },
        token: '        foo',
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 11,
        position: {
          line: 2,
          startCharacter: 0,
          startOffset: 30,
        },
        token: '        bar',
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
        length: 12,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: '/* something',
        tokenType: 'comment',
      },
      {
        bracketInfo: undefined,
        length: 11,
        position: {
          line: 1,
          startCharacter: 0,
          startOffset: 13,
        },
        token: '        foo',
        tokenType: 'comment',
      },
      {
        bracketInfo: undefined,
        length: 17,
        position: {
          line: 2,
          startCharacter: 0,
          startOffset: 25,
        },
        token: '        MATCH (n)',
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
        length: 10,
        position: {
          line: 0,
          startCharacter: 8,
          startOffset: 8,
        },
        token: '`something',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 1,
          startCharacter: 0,
          startOffset: 19,
        },
        token: '    foo',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 2,
          startCharacter: 0,
          startOffset: 27,
        },
        token: '    ',
        tokenType: 'symbolicName',
      },
      {
        bracketInfo: undefined,
        length: 17,
        position: {
          line: 3,
          startCharacter: 0,
          startOffset: 32,
        },
        token: '    bar: "hello"}',
        tokenType: 'symbolicName',
      },
    ]);
  });
});

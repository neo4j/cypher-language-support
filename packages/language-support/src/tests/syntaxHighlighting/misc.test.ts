import { highlightSyntax } from '../../syntaxHighlighting/syntaxHighlighting.js';

describe('Unfinished tokens', () => {
  test('Correctly colours unfinished string with double quotes', () => {
    const query = `RETURN "something`;

    expect(highlightSyntax(query)).toEqual([
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

    expect(highlightSyntax(query)).toEqual([
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

    expect(highlightSyntax(query)).toEqual([
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

    expect(highlightSyntax(query)).toEqual([
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

    expect(highlightSyntax(query)).toEqual([
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

  test('Correctly colours multiline comments', () => {
    const query = `/* something
    foo
    
    bar */`;

    expect(highlightSyntax(query)).toEqual([
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
        length: 7,
        position: {
          line: 1,
          startCharacter: 0,
          startOffset: 13,
        },
        token: '    foo',
        tokenType: 'comment',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 2,
          startCharacter: 0,
          startOffset: 21,
        },
        token: '    ',
        tokenType: 'comment',
      },
      {
        bracketInfo: undefined,
        length: 10,
        position: {
          line: 3,
          startCharacter: 0,
          startOffset: 26,
        },
        token: '    bar */',
        tokenType: 'comment',
      },
    ]);
  });

  test('Correctly colours single line comments', () => {
    const query = `// single line comment`;

    expect(highlightSyntax(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 22,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: '// single line comment',
        tokenType: 'comment',
      },
    ]);
  });
});

describe('String interpolation', () => {
  test('Correctly colours curly braces in string interpolation', () => {
    const query = `RETURN s"Contains string interp { 50 + 20 }"`;

    expect(highlightSyntax(query)).toEqual([
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
        length: 2,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 's"',
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 23,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: 'Contains string interp ',
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 32,
          startOffset: 32,
        },
        token: '{',
        tokenType: 'interpolationDelimiter',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 34,
          startOffset: 34,
        },
        token: '50',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 37,
          startOffset: 37,
        },
        token: '+',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 39,
          startOffset: 39,
        },
        token: '20',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 42,
          startOffset: 42,
        },
        token: '}',
        tokenType: 'interpolationDelimiter',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 43,
          startOffset: 43,
        },
        token: '"',
        tokenType: 'stringLiteral',
      },
    ]);
  });

  test('Correctly colours curly braces in string interpolation', () => {
    const query = `MATCH (n) RETURN s'Contains string interp { n.Age - $offset }'`;

    expect(highlightSyntax(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
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
          line: 0,
          startCharacter: 6,
          startOffset: 6,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'n',
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
          startCharacter: 8,
          startOffset: 8,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 10,
          startOffset: 10,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 17,
          startOffset: 17,
        },
        token: "s'",
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 23,
        position: {
          line: 0,
          startCharacter: 19,
          startOffset: 19,
        },
        token: 'Contains string interp ',
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 42,
          startOffset: 42,
        },
        token: '{',
        tokenType: 'interpolationDelimiter',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 44,
          startOffset: 44,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 45,
          startOffset: 45,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 0,
          startCharacter: 46,
          startOffset: 46,
        },
        token: 'Age',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 50,
          startOffset: 50,
        },
        token: '-',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 52,
          startOffset: 52,
        },
        token: '$',
        tokenType: 'paramDollar',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 53,
          startOffset: 53,
        },
        token: 'offset',
        tokenType: 'paramValue',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 60,
          startOffset: 60,
        },
        token: '}',
        tokenType: 'interpolationDelimiter',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 61,
          startOffset: 61,
        },
        token: "'",
        tokenType: 'stringLiteral',
      },
    ]);
  });
});

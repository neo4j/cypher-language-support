import { applySyntaxColouring } from '../../../highlighting/syntaxColouring';
import { CypherTokenType } from '../../../lexerSymbols';

describe('Function syntax colouring', () => {
  test('Correctly colours function name', () => {
    const query = 'RETURN reduce()';

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
        length: 6,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'reduce',
        tokenType: 'function',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 13,
          startOffset: 13,
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
          startCharacter: 14,
          startOffset: 14,
        },
        token: ')',
        tokenType: 'bracket',
      },
    ]);
  });

  test('Correctly colours function with arguments', () => {
    const query = "RETURN some.apoc.function(true, 'something')";

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
        length: 4,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'some',
        tokenType: 'function',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 11,
          startOffset: 11,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 12,
          startOffset: 12,
        },
        token: 'apoc',
        tokenType: 'function',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 16,
          startOffset: 16,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 0,
          startCharacter: 17,
          startOffset: 17,
        },
        token: 'function',
        tokenType: 'function',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 25,
          startOffset: 25,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 26,
          startOffset: 26,
        },
        token: 'true',
        tokenType: 'booleanLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 30,
          startOffset: 30,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 11,
        position: {
          line: 0,
          startCharacter: 32,
          startOffset: 32,
        },
        token: "'something'",
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
    ]);
  });

  test('Correctly colours multiline function', () => {
    const query = `RETURN some.
      apoc.
      function()
    `;

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
        length: 4,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'some',
        tokenType: 'function',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 11,
          startOffset: 11,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 19,
        },
        token: 'apoc',
        tokenType: 'function',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 10,
          startOffset: 23,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 31,
        },
        token: 'function',
        tokenType: 'function',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 2,
          startCharacter: 14,
          startOffset: 39,
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
          line: 2,
          startCharacter: 15,
          startOffset: 40,
        },
        token: ')',
        tokenType: 'bracket',
      },
    ]);
  });

  test.each(['all', 'any', 'none', 'single'])(
    'Colours %s list predicate as a function',
    (listPredicate) => {
      const query =
        'RETURN ' + listPredicate + '(x IN coll WHERE x.property IS NOT NULL)';

      const tokens = applySyntaxColouring(query);
      expect(
        tokens.find((t) => t.tokenType === CypherTokenType.predicateFunction),
      ).toEqual({
        bracketInfo: undefined,
        length: listPredicate.length,
        position: { line: 0, startCharacter: 7, startOffset: 7 },
        token: listPredicate,
        tokenType: CypherTokenType.predicateFunction,
      });
    },
  );

  test('Colours reduce list predicate as a function', () => {
    const query = "RETURN reduce(s = '', x IN list | s + x.prop)";
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
        length: 6,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'reduce',
        tokenType: 'predicateFunction',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 13,
          startOffset: 13,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 14,
          startOffset: 14,
        },
        token: 's',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 16,
          startOffset: 16,
        },
        token: '=',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 18,
          startOffset: 18,
        },
        token: "''",
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 20,
          startOffset: 20,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 22,
          startOffset: 22,
        },
        token: 'x',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 24,
          startOffset: 24,
        },
        token: 'IN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 27,
          startOffset: 27,
        },
        token: 'list',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 32,
          startOffset: 32,
        },
        token: '|',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 34,
          startOffset: 34,
        },
        token: 's',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 36,
          startOffset: 36,
        },
        token: '+',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 38,
          startOffset: 38,
        },
        token: 'x',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 39,
          startOffset: 39,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 40,
          startOffset: 40,
        },
        token: 'prop',
        tokenType: 'property',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 44,
          startOffset: 44,
        },
        token: ')',
        tokenType: 'bracket',
      },
    ]);
  });
});

import { BracketType } from '../../../highlighting/syntaxColouringHelpers';
import { CypherTokenType } from '../../../lexerSymbols';
import { testSyntaxColouring, testSyntaxColouringContains } from './helpers';

describe('Function syntax colouring', () => {
  test('Correctly colours function name', () => {
    const query = 'RETURN reduce()';

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 6,
        tokenType: CypherTokenType.function,
        token: 'reduce',
      },
      {
        position: {
          line: 0,
          startCharacter: 13,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '(',
        bracketInfo: {
          bracketType: BracketType.parenthesis,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 0,
          startCharacter: 14,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ')',
        bracketInfo: {
          bracketType: BracketType.parenthesis,
          bracketLevel: 0,
        },
      },
    ]);
  });

  test('Correctly colours function with arguments', () => {
    const query = "RETURN some.apoc.function(true, 'something')";

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 4,
        tokenType: CypherTokenType.function,
        token: 'some',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
        },
        length: 4,
        tokenType: CypherTokenType.function,
        token: 'apoc',
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 0,
          startCharacter: 17,
        },
        length: 8,
        tokenType: CypherTokenType.function,
        token: 'function',
      },
      {
        position: {
          line: 0,
          startCharacter: 25,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '(',
        bracketInfo: {
          bracketType: BracketType.parenthesis,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 0,
          startCharacter: 26,
        },
        length: 4,
        tokenType: CypherTokenType.booleanLiteral,
        token: 'true',
      },
      {
        position: {
          line: 0,
          startCharacter: 30,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: ',',
      },
      {
        position: {
          line: 0,
          startCharacter: 32,
        },
        length: 11,
        tokenType: CypherTokenType.stringLiteral,
        token: "'something'",
      },
      {
        position: {
          line: 0,
          startCharacter: 43,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ')',
        bracketInfo: {
          bracketType: BracketType.parenthesis,
          bracketLevel: 0,
        },
      },
    ]);
  });

  test('Correctly colours multiline function', () => {
    const query = `RETURN some.
      apoc.
      function()
    `;

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 4,
        tokenType: CypherTokenType.function,
        token: 'some',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 4,
        tokenType: CypherTokenType.function,
        token: 'apoc',
      },
      {
        position: {
          line: 1,
          startCharacter: 10,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 8,
        tokenType: CypherTokenType.function,
        token: 'function',
      },
      {
        position: {
          line: 2,
          startCharacter: 14,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '(',
        bracketInfo: {
          bracketType: BracketType.parenthesis,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 2,
          startCharacter: 15,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ')',
        bracketInfo: {
          bracketType: BracketType.parenthesis,
          bracketLevel: 0,
        },
      },
    ]);
  });

  test.each(['all', 'any', 'none', 'single'])(
    'Colours %s list predicate as a function',
    (listPredicate) => {
      const query =
        'RETURN ' + listPredicate + '(x IN coll WHERE x.property IS NOT NULL)';

      testSyntaxColouringContains(query, [
        {
          position: {
            line: 0,
            startCharacter: 7,
          },
          length: listPredicate.length,
          tokenType: CypherTokenType.predicateFunction,
          token: listPredicate,
        },
      ]);
    },
  );

  test('Colours reduce list predicate as a function', () => {
    const query = "RETURN reduce(s = '', x IN list | s + x.prop)";

    testSyntaxColouringContains(query, [
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 6,
        tokenType: CypherTokenType.predicateFunction,
        token: 'reduce',
      },
    ]);
  });
});

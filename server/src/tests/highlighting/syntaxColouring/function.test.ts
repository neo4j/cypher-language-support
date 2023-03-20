import { BracketType } from '../../../highlighting/syntaxColouring';
import { CypherTokenType } from '../../../lexerSymbols';
import { testSyntaxColouring, testSyntaxColouringContains } from './helpers';

describe('Function syntax colouring', () => {
  test('Correctly colours function name', async () => {
    const query = 'RETURN reduce()';

    await testSyntaxColouring(query, [
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

  test('Correctly colours function with arguments', async () => {
    const query = "RETURN some.apoc.function(true, 'something')";

    await testSyntaxColouring(query, [
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
        tokenType: CypherTokenType.operator,
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

  test('Correctly colours multiline function', async () => {
    const query = `RETURN some.
      apoc.
      function()
    `;

    await testSyntaxColouring(query, [
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

  test('Colours all list predicate as a function', async () => {
    const query = 'RETURN all(x IN coll WHERE x.property IS NOT NULL)';

    await testSyntaxColouringContains(query, [
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 3,
        tokenType: CypherTokenType.predicateFunction,
        token: 'all',
      },
    ]);
  });

  test('Colours any list predicate as a function', async () => {
    const query = 'RETURN any(x IN coll WHERE x.property IS NOT NULL)';

    await testSyntaxColouringContains(query, [
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 3,
        tokenType: CypherTokenType.predicateFunction,
        token: 'any',
      },
    ]);
  });

  test('Colours none list predicate as a function', async () => {
    const query = 'RETURN none(x IN coll WHERE x.property IS NOT NULL)';

    await testSyntaxColouringContains(query, [
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 4,
        tokenType: CypherTokenType.predicateFunction,
        token: 'none',
      },
    ]);
  });

  test('Colours single list predicate as a function', async () => {
    const query = 'RETURN single(x IN coll WHERE x.property IS NOT NULL)';

    await testSyntaxColouringContains(query, [
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 6,
        tokenType: CypherTokenType.predicateFunction,
        token: 'single',
      },
    ]);
  });

  test('Colours reduce as a function', async () => {
    const query = "RETURN reduce(s = '', x IN list | s + x.prop)";

    await testSyntaxColouringContains(query, [
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

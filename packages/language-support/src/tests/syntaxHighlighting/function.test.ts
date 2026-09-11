import { CypherTokenType } from '../../lexerSymbols.js';
import { highlightSyntax } from '../../syntaxHighlighting/syntaxHighlighting.js';

describe('Function syntax highlighting', () => {
  test('Correctly colours function name', () => {
    const query = 'RETURN reduce()';

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

      const tokens = highlightSyntax(query);
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

  test('Correctly colours grammar-defined function "allReduce"', () => {
    const query = `MATCH (s) (()-[:KNOWS]-(n)){3}
WHERE allReduce(
  acc = s.age,
  node IN n | acc + node.age,
  acc < 230
)`;

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
        token: 's',
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
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 10,
          startOffset: 10,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 11,
          startOffset: 11,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 12,
          startOffset: 12,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 13,
          startOffset: 13,
        },
        token: '-',
        tokenType: 'separator',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 14,
          startOffset: 14,
        },
        token: '[',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 15,
          startOffset: 15,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 16,
          startOffset: 16,
        },
        token: 'KNOWS',
        tokenType: 'label',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 21,
          startOffset: 21,
        },
        token: ']',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 22,
          startOffset: 22,
        },
        token: '-',
        tokenType: 'separator',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 23,
          startOffset: 23,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 24,
          startOffset: 24,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 25,
          startOffset: 25,
        },
        token: ')',
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
          startCharacter: 26,
          startOffset: 26,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 27,
          startOffset: 27,
        },
        token: '{',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 28,
          startOffset: 28,
        },
        token: '3',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'curly',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 29,
          startOffset: 29,
        },
        token: '}',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 1,
          startCharacter: 0,
          startOffset: 31,
        },
        token: 'WHERE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 9,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 37,
        },
        token: 'allReduce',
        tokenType: 'predicateFunction',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 1,
          startCharacter: 15,
          startOffset: 46,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 2,
          startCharacter: 2,
          startOffset: 50,
        },
        token: 'acc',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 54,
        },
        token: '=',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 8,
          startOffset: 56,
        },
        token: 's',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 9,
          startOffset: 57,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 2,
          startCharacter: 10,
          startOffset: 58,
        },
        token: 'age',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 13,
          startOffset: 61,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 3,
          startCharacter: 2,
          startOffset: 65,
        },
        token: 'node',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 3,
          startCharacter: 7,
          startOffset: 70,
        },
        token: 'IN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 10,
          startOffset: 73,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 12,
          startOffset: 75,
        },
        token: '|',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 3,
          startCharacter: 14,
          startOffset: 77,
        },
        token: 'acc',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 18,
          startOffset: 81,
        },
        token: '+',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 3,
          startCharacter: 20,
          startOffset: 83,
        },
        token: 'node',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 24,
          startOffset: 87,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 3,
          startCharacter: 25,
          startOffset: 88,
        },
        token: 'age',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 3,
          startCharacter: 28,
          startOffset: 91,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 4,
          startCharacter: 2,
          startOffset: 95,
        },
        token: 'acc',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 4,
          startCharacter: 6,
          startOffset: 99,
        },
        token: '<',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 4,
          startCharacter: 8,
          startOffset: 101,
        },
        token: '230',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 5,
          startCharacter: 0,
          startOffset: 105,
        },
        token: ')',
        tokenType: 'bracket',
      },
    ]);
  });

  test('Correctly colours grammar-defined function "vector_distance"', () => {
    const query = `RETURN vector_distance(v, v2, EUCLIDEAN_SQUARED))`;

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
        length: 15,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'vector_distance',
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
          startCharacter: 22,
          startOffset: 22,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 23,
          startOffset: 23,
        },
        token: 'v',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 24,
          startOffset: 24,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 26,
          startOffset: 26,
        },
        token: 'v2',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 28,
          startOffset: 28,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 17,
        position: {
          line: 0,
          startCharacter: 30,
          startOffset: 30,
        },
        token: 'EUCLIDEAN_SQUARED',
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
          startCharacter: 47,
          startOffset: 47,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: -1,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 48,
          startOffset: 48,
        },
        token: ')',
        tokenType: 'bracket',
      },
    ]);
  });

  test('Correctly colours grammar-definef function "shortestPath()"', () => {
    const query = `MATCH p=shortestPath((:Trainer)-[*0..10]->(:Pokemon))`;

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
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 6,
          startOffset: 6,
        },
        token: 'p',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: '=',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 12,
        position: {
          line: 0,
          startCharacter: 8,
          startOffset: 8,
        },
        token: 'shortestPath',
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
          startCharacter: 20,
          startOffset: 20,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 21,
          startOffset: 21,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 22,
          startOffset: 22,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 0,
          startCharacter: 23,
          startOffset: 23,
        },
        token: 'Trainer',
        tokenType: 'label',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 30,
          startOffset: 30,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 31,
          startOffset: 31,
        },
        token: '-',
        tokenType: 'separator',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 32,
          startOffset: 32,
        },
        token: '[',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 33,
          startOffset: 33,
        },
        token: '*',
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
        token: '0',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 35,
          startOffset: 35,
        },
        token: '..',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 37,
          startOffset: 37,
        },
        token: '10',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 39,
          startOffset: 39,
        },
        token: ']',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 40,
          startOffset: 40,
        },
        token: '-',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 41,
          startOffset: 41,
        },
        token: '>',
        tokenType: 'separator',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 42,
          startOffset: 42,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 43,
          startOffset: 43,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 0,
          startCharacter: 44,
          startOffset: 44,
        },
        token: 'Pokemon',
        tokenType: 'label',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 51,
          startOffset: 51,
        },
        token: ')',
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
          startCharacter: 52,
          startOffset: 52,
        },
        token: ')',
        tokenType: 'bracket',
      },
    ]);
  });

  test('Correctly colours grammar-defined function "allShortestPaths"', () => {
    const query = `MATCH p=allShortestPaths((:Trainer)-[*0..4]->(:Region)) RETURN p`;

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
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 6,
          startOffset: 6,
        },
        token: 'p',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: '=',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 16,
        position: {
          line: 0,
          startCharacter: 8,
          startOffset: 8,
        },
        token: 'allShortestPaths',
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
          startCharacter: 24,
          startOffset: 24,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
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
        length: 1,
        position: {
          line: 0,
          startCharacter: 26,
          startOffset: 26,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 0,
          startCharacter: 27,
          startOffset: 27,
        },
        token: 'Trainer',
        tokenType: 'label',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 34,
          startOffset: 34,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 35,
          startOffset: 35,
        },
        token: '-',
        tokenType: 'separator',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 36,
          startOffset: 36,
        },
        token: '[',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 37,
          startOffset: 37,
        },
        token: '*',
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
        token: '0',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 39,
          startOffset: 39,
        },
        token: '..',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 41,
          startOffset: 41,
        },
        token: '4',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: {
          bracketLevel: 0,
          bracketType: 'bracket',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 42,
          startOffset: 42,
        },
        token: ']',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 43,
          startOffset: 43,
        },
        token: '-',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 44,
          startOffset: 44,
        },
        token: '>',
        tokenType: 'separator',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 45,
          startOffset: 45,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 46,
          startOffset: 46,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 47,
          startOffset: 47,
        },
        token: 'Region',
        tokenType: 'label',
      },
      {
        bracketInfo: {
          bracketLevel: 1,
          bracketType: 'parenthesis',
        },
        length: 1,
        position: {
          line: 0,
          startCharacter: 53,
          startOffset: 53,
        },
        token: ')',
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
          startCharacter: 54,
          startOffset: 54,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 56,
          startOffset: 56,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 63,
          startOffset: 63,
        },
        token: 'p',
        tokenType: 'variable',
      },
    ]);
  });
});

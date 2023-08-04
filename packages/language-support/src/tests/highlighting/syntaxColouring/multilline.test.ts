import { BracketType } from '../../../highlighting/syntaxColouringHelpers';
import { CypherTokenType } from '../../../lexerSymbols';
import { testSyntaxColouring } from './helpers';

describe('Multiline syntax colouring', () => {
  test('Correctly colours multi-statements', () => {
    const query = `MATCH (n:Person) RETURN n
      CALL apoc.do.when(true, "foo", false, "bar") YIELD name, result`;

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'MATCH',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
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
          startCharacter: 7,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 0,
          startCharacter: 8,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
        },
        length: 6,
        tokenType: CypherTokenType.label,
        token: 'Person',
      },
      {
        position: {
          line: 0,
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
      {
        position: {
          line: 0,
          startCharacter: 17,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'CALL',
      },
      {
        position: {
          line: 1,
          startCharacter: 11,
        },
        length: 4,
        tokenType: CypherTokenType.procedure,
        token: 'apoc',
      },
      {
        position: {
          line: 1,
          startCharacter: 15,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 1,
          startCharacter: 16,
        },
        length: 2,
        tokenType: CypherTokenType.procedure,
        token: 'do',
      },
      {
        position: {
          line: 1,
          startCharacter: 18,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 1,
          startCharacter: 19,
        },
        length: 4,
        tokenType: CypherTokenType.procedure,
        token: 'when',
      },
      {
        position: {
          line: 1,
          startCharacter: 23,
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
          line: 1,
          startCharacter: 24,
        },
        length: 4,
        tokenType: CypherTokenType.booleanLiteral,
        token: 'true',
      },
      {
        position: {
          line: 1,
          startCharacter: 28,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 30,
        },
        length: 5,
        tokenType: CypherTokenType.stringLiteral,
        token: '"foo"',
      },
      {
        position: {
          line: 1,
          startCharacter: 35,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 37,
        },
        length: 5,
        tokenType: CypherTokenType.booleanLiteral,
        token: 'false',
      },
      {
        position: {
          line: 1,
          startCharacter: 42,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 44,
        },
        length: 5,
        tokenType: CypherTokenType.stringLiteral,
        token: '"bar"',
      },
      {
        position: {
          line: 1,
          startCharacter: 49,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ')',
        bracketInfo: {
          bracketType: BracketType.parenthesis,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 1,
          startCharacter: 51,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 1,
          startCharacter: 57,
        },
        length: 4,
        tokenType: CypherTokenType.variable,
        token: 'name',
      },
      {
        position: {
          line: 1,
          startCharacter: 61,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 63,
        },
        length: 6,
        tokenType: CypherTokenType.variable,
        token: 'result',
      },
    ]);
  });

  test('Correctly colours unfinished multi-statements', () => {
    const query = `MATCH (n:Person);

      CALL apoc.do.when(true, "foo", false, "bar") YIELD name, result`;

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'MATCH',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
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
          startCharacter: 7,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 0,
          startCharacter: 8,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
        },
        length: 6,
        tokenType: CypherTokenType.label,
        token: 'Person',
      },
      {
        position: {
          line: 0,
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
      {
        position: {
          line: 0,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.punctuation,
        token: ';',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'CALL',
      },
      {
        position: {
          line: 2,
          startCharacter: 11,
        },
        length: 4,
        tokenType: CypherTokenType.procedure,
        token: 'apoc',
      },
      {
        position: {
          line: 2,
          startCharacter: 15,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 2,
          startCharacter: 16,
        },
        length: 2,
        tokenType: CypherTokenType.procedure,
        token: 'do',
      },
      {
        position: {
          line: 2,
          startCharacter: 18,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 2,
          startCharacter: 19,
        },
        length: 4,
        tokenType: CypherTokenType.procedure,
        token: 'when',
      },
      {
        position: {
          line: 2,
          startCharacter: 23,
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
          startCharacter: 24,
        },
        length: 4,
        tokenType: CypherTokenType.booleanLiteral,
        token: 'true',
      },
      {
        position: {
          line: 2,
          startCharacter: 28,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: ',',
      },
      {
        position: {
          line: 2,
          startCharacter: 30,
        },
        length: 5,
        tokenType: CypherTokenType.stringLiteral,
        token: '"foo"',
      },
      {
        position: {
          line: 2,
          startCharacter: 35,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: ',',
      },
      {
        position: {
          line: 2,
          startCharacter: 37,
        },
        length: 5,
        tokenType: CypherTokenType.booleanLiteral,
        token: 'false',
      },
      {
        position: {
          line: 2,
          startCharacter: 42,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: ',',
      },
      {
        position: {
          line: 2,
          startCharacter: 44,
        },
        length: 5,
        tokenType: CypherTokenType.stringLiteral,
        token: '"bar"',
      },
      {
        position: {
          line: 2,
          startCharacter: 49,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ')',
        bracketInfo: {
          bracketType: BracketType.parenthesis,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 2,
          startCharacter: 51,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 2,
          startCharacter: 57,
        },
        length: 4,
        tokenType: CypherTokenType.variable,
        token: 'name',
      },
      {
        position: {
          line: 2,
          startCharacter: 61,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: ',',
      },
      {
        position: {
          line: 2,
          startCharacter: 63,
        },
        length: 6,
        tokenType: CypherTokenType.variable,
        token: 'result',
      },
    ]);
  });

  test('Correctly colours multiline label', () => {
    const query = `MATCH (n:\`Label
Other\`)
	`;

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'MATCH',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
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
          startCharacter: 7,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 0,
          startCharacter: 8,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
        },
        length: 6,
        tokenType: CypherTokenType.label,
        token: '`Label',
      },
      {
        position: {
          line: 1,
          startCharacter: 0,
        },
        length: 6,
        tokenType: CypherTokenType.label,
        token: 'Other`',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
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

  test('Correctly colours multiline procedure name', () => {
    const query = `CALL apoc.
      do.
      when()
	`;

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'CALL',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 4,
        tokenType: CypherTokenType.procedure,
        token: 'apoc',
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
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
        length: 2,
        tokenType: CypherTokenType.procedure,
        token: 'do',
      },
      {
        position: {
          line: 1,
          startCharacter: 8,
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
        length: 4,
        tokenType: CypherTokenType.procedure,
        token: 'when',
      },
      {
        position: {
          line: 2,
          startCharacter: 10,
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
          startCharacter: 11,
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
});

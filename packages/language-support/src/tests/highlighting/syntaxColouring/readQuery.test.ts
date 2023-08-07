import { BracketType } from '../../../highlighting/syntaxColouringHelpers';
import { CypherTokenType } from '../../../lexerSymbols';
import { testSyntaxColouring } from './helpers';

describe('MATCH syntax colouring', () => {
  test('Correctly colours labels conjunction', () => {
    const query = 'MATCH (n:A&B)';

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
        length: 1,
        tokenType: CypherTokenType.label,
        token: 'A',
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '&',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 1,
        tokenType: CypherTokenType.label,
        token: 'B',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
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

  test('Correctly colours labels disjuntion', () => {
    const query = 'MATCH (n:A|B)';

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
        length: 1,
        tokenType: CypherTokenType.label,
        token: 'A',
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '|',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 1,
        tokenType: CypherTokenType.label,
        token: 'B',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
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

  test('Correctly colours negated label', () => {
    const query = 'MATCH (n:!A)';

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
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '!',
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
        },
        length: 1,
        tokenType: CypherTokenType.label,
        token: 'A',
      },
      {
        position: {
          line: 0,
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

  test('Correctly colours parenthesized label expressions', () => {
    const query = 'MATCH (n:(!A&!B)|C)';

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
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '(',
        bracketInfo: {
          bracketType: BracketType.parenthesis,
          bracketLevel: 1,
        },
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '!',
      },
      {
        position: {
          line: 0,
          startCharacter: 11,
        },
        length: 1,
        tokenType: CypherTokenType.label,
        token: 'A',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '&',
      },
      {
        position: {
          line: 0,
          startCharacter: 13,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '!',
      },
      {
        position: {
          line: 0,
          startCharacter: 14,
        },
        length: 1,
        tokenType: CypherTokenType.label,
        token: 'B',
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
          bracketLevel: 1,
        },
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '|',
      },
      {
        position: {
          line: 0,
          startCharacter: 17,
        },
        length: 1,
        tokenType: CypherTokenType.label,
        token: 'C',
      },
      {
        position: {
          line: 0,
          startCharacter: 18,
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

  test('Correctly colours parenthesized relationship type expressions', () => {
    const query = 'MATCH (n:Label)-[r:(!R1&!R2)|R3]';

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
        length: 5,
        tokenType: CypherTokenType.label,
        token: 'Label',
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
      {
        position: {
          line: 0,
          startCharacter: 15,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: '-',
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '[',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 0,
          startCharacter: 17,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'r',
      },
      {
        position: {
          line: 0,
          startCharacter: 18,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 19,
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
          startCharacter: 20,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '!',
      },
      {
        position: {
          line: 0,
          startCharacter: 21,
        },
        length: 2,
        tokenType: CypherTokenType.label,
        token: 'R1',
      },
      {
        position: {
          line: 0,
          startCharacter: 23,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '&',
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '!',
      },
      {
        position: {
          line: 0,
          startCharacter: 25,
        },
        length: 2,
        tokenType: CypherTokenType.label,
        token: 'R2',
      },
      {
        position: {
          line: 0,
          startCharacter: 27,
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
          startCharacter: 28,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '|',
      },
      {
        position: {
          line: 0,
          startCharacter: 29,
        },
        length: 2,
        tokenType: CypherTokenType.label,
        token: 'R3',
      },
      {
        position: {
          line: 0,
          startCharacter: 31,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ']',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 0,
        },
      },
    ]);
  });

  test('Correctly colours OPTIONAL', () => {
    const query = 'OPTIONAL MATCH (n)';
    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        length: 8,
        tokenType: CypherTokenType.keyword,
        token: 'OPTIONAL',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'MATCH',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 15,
          startOffset: 15,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '(',
        bracketInfo: {
          bracketLevel: 0,
          bracketType: BracketType.parenthesis,
        },
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
          startOffset: 16,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'n',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 17,
          startOffset: 17,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ')',
        bracketInfo: {
          bracketLevel: 0,
          bracketType: BracketType.parenthesis,
        },
      },
    ]);
  });
});

describe('RETURN syntax colouring', () => {
  test('Correctly colours AS and SKIP', () => {
    const query = `MATCH (n:Label)-[r]->(m:Label)
      RETURN n AS node, r AS rel
      SKIP 10
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
        length: 5,
        tokenType: CypherTokenType.label,
        token: 'Label',
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
      {
        position: {
          line: 0,
          startCharacter: 15,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: '-',
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '[',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 0,
          startCharacter: 17,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'r',
      },
      {
        position: {
          line: 0,
          startCharacter: 18,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ']',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 0,
          startCharacter: 19,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: '-',
      },
      {
        position: {
          line: 0,
          startCharacter: 20,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: '>',
      },
      {
        position: {
          line: 0,
          startCharacter: 21,
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
          startCharacter: 22,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'm',
      },
      {
        position: {
          line: 0,
          startCharacter: 23,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 5,
        tokenType: CypherTokenType.label,
        token: 'Label',
      },
      {
        position: {
          line: 0,
          startCharacter: 29,
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
          startCharacter: 6,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 1,
          startCharacter: 13,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 1,
          startCharacter: 15,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 1,
          startCharacter: 18,
        },
        length: 4,
        tokenType: CypherTokenType.variable,
        token: 'node',
      },
      {
        position: {
          line: 1,
          startCharacter: 22,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 24,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'r',
      },
      {
        position: {
          line: 1,
          startCharacter: 26,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 1,
          startCharacter: 29,
        },
        length: 3,
        tokenType: CypherTokenType.variable,
        token: 'rel',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'SKIP',
      },
      {
        position: {
          line: 2,
          startCharacter: 11,
        },
        length: 2,
        tokenType: CypherTokenType.numberLiteral,
        token: '10',
      },
    ]);
  });

  test('Correctly colours ORDER BY', () => {
    const query = `RETURN n AS node, r AS rel ORDER BY n.name DESC`;

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
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
        },
        length: 4,
        tokenType: CypherTokenType.variable,
        token: 'node',
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: ',',
      },
      {
        position: {
          line: 0,
          startCharacter: 18,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'r',
      },
      {
        position: {
          line: 0,
          startCharacter: 20,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 0,
          startCharacter: 23,
        },
        length: 3,
        tokenType: CypherTokenType.variable,
        token: 'rel',
      },
      {
        position: {
          line: 0,
          startCharacter: 27,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'ORDER',
      },
      {
        position: {
          line: 0,
          startCharacter: 33,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'BY',
      },
      {
        position: {
          line: 0,
          startCharacter: 36,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 0,
          startCharacter: 37,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 0,
          startCharacter: 38,
        },
        length: 4,
        tokenType: CypherTokenType.property,
        token: 'name',
      },
      {
        position: {
          line: 0,
          startCharacter: 43,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'DESC',
      },
    ]);
  });

  test('Correctly colours LIMIT', () => {
    const query = `RETURN n LIMIT 10`;

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'RETURN',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'n',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'LIMIT',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 15,
          startOffset: 15,
        },
        length: 2,
        tokenType: CypherTokenType.numberLiteral,
        token: '10',
        bracketInfo: undefined,
      },
    ]);
  });
});

describe('WHERE syntax colouring', () => {
  test('Correctly colours MATCH with WHERE and RETURN', () => {
    const query = 'MATCH (n:Person) WHERE n.name = "foo" RETURN n';

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
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'WHERE',
      },
      {
        position: {
          line: 0,
          startCharacter: 23,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 0,
          startCharacter: 25,
        },
        length: 4,
        tokenType: CypherTokenType.property,
        token: 'name',
      },
      {
        position: {
          line: 0,
          startCharacter: 30,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '=',
      },
      {
        position: {
          line: 0,
          startCharacter: 32,
        },
        length: 5,
        tokenType: CypherTokenType.stringLiteral,
        token: '"foo"',
      },
      {
        position: {
          line: 0,
          startCharacter: 38,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 0,
          startCharacter: 45,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'n',
      },
    ]);
  });

  test('Correctly colours WHERE with parameter', () => {
    const query = `MATCH (n:Label)-->(m:Label)
    WHERE n.property <> $value
    RETURN n, m`;

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
        length: 5,
        tokenType: CypherTokenType.label,
        token: 'Label',
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
      {
        position: {
          line: 0,
          startCharacter: 15,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: '-',
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: '-',
      },
      {
        position: {
          line: 0,
          startCharacter: 17,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: '>',
      },
      {
        position: {
          line: 0,
          startCharacter: 18,
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
          startCharacter: 19,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'm',
      },
      {
        position: {
          line: 0,
          startCharacter: 20,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 21,
        },
        length: 5,
        tokenType: CypherTokenType.label,
        token: 'Label',
      },
      {
        position: {
          line: 0,
          startCharacter: 26,
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
          startCharacter: 4,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'WHERE',
      },
      {
        position: {
          line: 1,
          startCharacter: 10,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 1,
          startCharacter: 11,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 1,
          startCharacter: 12,
        },
        length: 8,
        tokenType: CypherTokenType.property,
        token: 'property',
      },
      {
        position: {
          line: 1,
          startCharacter: 21,
        },
        length: 2,
        tokenType: CypherTokenType.operator,
        token: '<>',
      },
      {
        position: {
          line: 1,
          startCharacter: 24,
        },
        length: 1,
        tokenType: CypherTokenType.paramDollar,
        token: '$',
      },
      {
        position: {
          line: 1,
          startCharacter: 25,
        },
        length: 5,
        tokenType: CypherTokenType.paramValue,
        token: 'value',
      },
      {
        position: {
          line: 2,
          startCharacter: 4,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 2,
          startCharacter: 11,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 2,
          startCharacter: 12,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: ',',
      },
      {
        position: {
          line: 2,
          startCharacter: 14,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'm',
      },
    ]);
  });

  test('Correctly colours relationship with WHERE', () => {
    const query = `WITH 2000 AS minYear
    MATCH (a:Person {name: 'Andy'})
    RETURN [(a)-[r:KNOWS WHERE r.since < minYear]->(b:Person) | r.since] AS years`;

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'WITH',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 4,
        tokenType: CypherTokenType.numberLiteral,
        token: '2000',
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 0,
          startCharacter: 13,
        },
        length: 7,
        tokenType: CypherTokenType.variable,
        token: 'minYear',
      },
      {
        position: {
          line: 1,
          startCharacter: 4,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'MATCH',
      },
      {
        position: {
          line: 1,
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
          line: 1,
          startCharacter: 11,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'a',
      },
      {
        position: {
          line: 1,
          startCharacter: 12,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 1,
          startCharacter: 13,
        },
        length: 6,
        tokenType: CypherTokenType.label,
        token: 'Person',
      },
      {
        position: {
          line: 1,
          startCharacter: 20,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '{',
        bracketInfo: {
          bracketType: BracketType.curly,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 1,
          startCharacter: 21,
        },
        length: 4,
        tokenType: CypherTokenType.property,
        token: 'name',
      },
      {
        position: {
          line: 1,
          startCharacter: 25,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 1,
          startCharacter: 27,
        },
        length: 6,
        tokenType: CypherTokenType.stringLiteral,
        token: "'Andy'",
      },
      {
        position: {
          line: 1,
          startCharacter: 33,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '}',
        bracketInfo: {
          bracketType: BracketType.curly,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 1,
          startCharacter: 34,
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
          startCharacter: 4,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 2,
          startCharacter: 11,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '[',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 2,
          startCharacter: 12,
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
          startCharacter: 13,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'a',
      },
      {
        position: {
          line: 2,
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
      {
        position: {
          line: 2,
          startCharacter: 15,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: '-',
      },
      {
        position: {
          line: 2,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '[',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 1,
        },
      },
      {
        position: {
          line: 2,
          startCharacter: 17,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'r',
      },
      {
        position: {
          line: 2,
          startCharacter: 18,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 2,
          startCharacter: 19,
        },
        length: 5,
        tokenType: CypherTokenType.label,
        token: 'KNOWS',
      },
      {
        position: {
          line: 2,
          startCharacter: 25,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'WHERE',
      },
      {
        position: {
          line: 2,
          startCharacter: 31,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'r',
      },
      {
        position: {
          line: 2,
          startCharacter: 32,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 2,
          startCharacter: 33,
        },
        length: 5,
        tokenType: CypherTokenType.property,
        token: 'since',
      },
      {
        position: {
          line: 2,
          startCharacter: 39,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '<',
      },
      {
        position: {
          line: 2,
          startCharacter: 41,
        },
        length: 7,
        tokenType: CypherTokenType.variable,
        token: 'minYear',
      },
      {
        position: {
          line: 2,
          startCharacter: 48,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ']',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 1,
        },
      },
      {
        position: {
          line: 2,
          startCharacter: 49,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: '-',
      },
      {
        position: {
          line: 2,
          startCharacter: 50,
        },
        length: 1,
        tokenType: CypherTokenType.separator,
        token: '>',
      },
      {
        position: {
          line: 2,
          startCharacter: 51,
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
          startCharacter: 52,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'b',
      },
      {
        position: {
          line: 2,
          startCharacter: 53,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 2,
          startCharacter: 54,
        },
        length: 6,
        tokenType: CypherTokenType.label,
        token: 'Person',
      },
      {
        position: {
          line: 2,
          startCharacter: 60,
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
          startCharacter: 62,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '|',
      },
      {
        position: {
          line: 2,
          startCharacter: 64,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'r',
      },
      {
        position: {
          line: 2,
          startCharacter: 65,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 2,
          startCharacter: 66,
        },
        length: 5,
        tokenType: CypherTokenType.property,
        token: 'since',
      },
      {
        position: {
          line: 2,
          startCharacter: 71,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ']',
        bracketInfo: {
          bracketType: BracketType.bracket,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 2,
          startCharacter: 73,
        },
        length: 2,
        tokenType: CypherTokenType.keyword,
        token: 'AS',
      },
      {
        position: {
          line: 2,
          startCharacter: 76,
        },
        length: 5,
        tokenType: CypherTokenType.variable,
        token: 'years',
      },
    ]);
  });
});

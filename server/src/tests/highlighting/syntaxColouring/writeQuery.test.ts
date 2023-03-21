import { BracketType } from '../../../highlighting/syntaxColouringHelpers';
import { CypherTokenType } from '../../../lexerSymbols';
import { testSyntaxColouring, testSyntaxColouringContains } from './helpers';

describe('CREATE syntax colouring', () => {
  test('Correctly colours CREATE', async () => {
    const query = 'CREATE (n:Label)-[:TYPE {name: $value}]->(m:Label)';

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'CREATE',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
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
          startCharacter: 8,
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
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
        },
        length: 5,
        tokenType: CypherTokenType.label,
        token: 'Label',
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
        tokenType: CypherTokenType.operator,
        token: '-',
      },
      {
        position: {
          line: 0,
          startCharacter: 17,
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
        length: 4,
        tokenType: CypherTokenType.label,
        token: 'TYPE',
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
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
          startCharacter: 29,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 31,
        },
        length: 1,
        tokenType: CypherTokenType.paramDollar,
        token: '$',
      },
      {
        position: {
          line: 0,
          startCharacter: 32,
        },
        length: 5,
        tokenType: CypherTokenType.paramValue,
        token: 'value',
      },
      {
        position: {
          line: 0,
          startCharacter: 37,
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
          line: 0,
          startCharacter: 38,
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
          startCharacter: 39,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '-',
      },
      {
        position: {
          line: 0,
          startCharacter: 40,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '>',
      },
      {
        position: {
          line: 0,
          startCharacter: 41,
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
          startCharacter: 42,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'm',
      },
      {
        position: {
          line: 0,
          startCharacter: 43,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 44,
        },
        length: 5,
        tokenType: CypherTokenType.label,
        token: 'Label',
      },
      {
        position: {
          line: 0,
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
    ]);
  });
});

describe('SET syntax colouring', () => {
  test('Correctly colours SET', async () => {
    const query = `SET n += {
      a: 1,
      b: 'example',
      c: true,
      d: date('2022-05-04'),
      e: point({x: 2, y: 3}),
      f: [1, 2, 3],
      g: ['abc', 'example'],
      h: [true, false, false],
      i: [date('2022-05-04'), date()],
      j: [point({x: 2, y: 3}), point({x: 5, y: 5})],
      k: null
    }`;

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 3,
        tokenType: CypherTokenType.keyword,
        token: 'SET',
      },
      {
        position: {
          line: 0,
          startCharacter: 4,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
        },
        length: 2,
        tokenType: CypherTokenType.operator,
        token: '+=',
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
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
          startCharacter: 6,
        },
        length: 1,
        tokenType: CypherTokenType.property,
        token: 'a',
      },
      {
        position: {
          line: 1,
          startCharacter: 7,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 1,
          startCharacter: 9,
        },
        length: 1,
        tokenType: CypherTokenType.numberLiteral,
        token: '1',
      },
      {
        position: {
          line: 1,
          startCharacter: 10,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 1,
        tokenType: CypherTokenType.property,
        token: 'b',
      },
      {
        position: {
          line: 2,
          startCharacter: 7,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 2,
          startCharacter: 9,
        },
        length: 9,
        tokenType: CypherTokenType.stringLiteral,
        token: "'example'",
      },
      {
        position: {
          line: 2,
          startCharacter: 18,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 3,
          startCharacter: 6,
        },
        length: 1,
        tokenType: CypherTokenType.property,
        token: 'c',
      },
      {
        position: {
          line: 3,
          startCharacter: 7,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 3,
          startCharacter: 9,
        },
        length: 4,
        tokenType: CypherTokenType.booleanLiteral,
        token: 'true',
      },
      {
        position: {
          line: 3,
          startCharacter: 13,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 4,
          startCharacter: 6,
        },
        length: 1,
        tokenType: CypherTokenType.property,
        token: 'd',
      },
      {
        position: {
          line: 4,
          startCharacter: 7,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 4,
          startCharacter: 9,
        },
        length: 4,
        tokenType: CypherTokenType.function,
        token: 'date',
      },
      {
        position: {
          line: 4,
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
          line: 4,
          startCharacter: 14,
        },
        length: 12,
        tokenType: CypherTokenType.stringLiteral,
        token: "'2022-05-04'",
      },
      {
        position: {
          line: 4,
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
          line: 4,
          startCharacter: 27,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 5,
          startCharacter: 6,
        },
        length: 1,
        tokenType: CypherTokenType.property,
        token: 'e',
      },
      {
        position: {
          line: 5,
          startCharacter: 7,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 5,
          startCharacter: 9,
        },
        length: 5,
        tokenType: CypherTokenType.function,
        token: 'point',
      },
      {
        position: {
          line: 5,
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
          line: 5,
          startCharacter: 15,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '{',
        bracketInfo: {
          bracketType: BracketType.curly,
          bracketLevel: 1,
        },
      },
      {
        position: {
          line: 5,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.property,
        token: 'x',
      },
      {
        position: {
          line: 5,
          startCharacter: 17,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 5,
          startCharacter: 19,
        },
        length: 1,
        tokenType: CypherTokenType.numberLiteral,
        token: '2',
      },
      {
        position: {
          line: 5,
          startCharacter: 20,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 5,
          startCharacter: 22,
        },
        length: 1,
        tokenType: CypherTokenType.property,
        token: 'y',
      },
      {
        position: {
          line: 5,
          startCharacter: 23,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 5,
          startCharacter: 25,
        },
        length: 1,
        tokenType: CypherTokenType.numberLiteral,
        token: '3',
      },
      {
        position: {
          line: 5,
          startCharacter: 26,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '}',
        bracketInfo: {
          bracketType: BracketType.curly,
          bracketLevel: 1,
        },
      },
      {
        position: {
          line: 5,
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
          line: 5,
          startCharacter: 28,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 6,
          startCharacter: 6,
        },
        length: 1,
        tokenType: CypherTokenType.property,
        token: 'f',
      },
      {
        position: {
          line: 6,
          startCharacter: 7,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 6,
          startCharacter: 9,
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
          line: 6,
          startCharacter: 10,
        },
        length: 1,
        tokenType: CypherTokenType.numberLiteral,
        token: '1',
      },
      {
        position: {
          line: 6,
          startCharacter: 11,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 6,
          startCharacter: 13,
        },
        length: 1,
        tokenType: CypherTokenType.numberLiteral,
        token: '2',
      },
      {
        position: {
          line: 6,
          startCharacter: 14,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 6,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.numberLiteral,
        token: '3',
      },
      {
        position: {
          line: 6,
          startCharacter: 17,
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
          line: 6,
          startCharacter: 18,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 7,
          startCharacter: 6,
        },
        length: 1,
        tokenType: CypherTokenType.property,
        token: 'g',
      },
      {
        position: {
          line: 7,
          startCharacter: 7,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 7,
          startCharacter: 9,
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
          line: 7,
          startCharacter: 10,
        },
        length: 5,
        tokenType: CypherTokenType.stringLiteral,
        token: "'abc'",
      },
      {
        position: {
          line: 7,
          startCharacter: 15,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 7,
          startCharacter: 17,
        },
        length: 9,
        tokenType: CypherTokenType.stringLiteral,
        token: "'example'",
      },
      {
        position: {
          line: 7,
          startCharacter: 26,
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
          line: 7,
          startCharacter: 27,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 8,
          startCharacter: 6,
        },
        length: 1,
        tokenType: CypherTokenType.property,
        token: 'h',
      },
      {
        position: {
          line: 8,
          startCharacter: 7,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 8,
          startCharacter: 9,
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
          line: 8,
          startCharacter: 10,
        },
        length: 4,
        tokenType: CypherTokenType.booleanLiteral,
        token: 'true',
      },
      {
        position: {
          line: 8,
          startCharacter: 14,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 8,
          startCharacter: 16,
        },
        length: 5,
        tokenType: CypherTokenType.booleanLiteral,
        token: 'false',
      },
      {
        position: {
          line: 8,
          startCharacter: 21,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 8,
          startCharacter: 23,
        },
        length: 5,
        tokenType: CypherTokenType.booleanLiteral,
        token: 'false',
      },
      {
        position: {
          line: 8,
          startCharacter: 28,
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
          line: 8,
          startCharacter: 29,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 9,
          startCharacter: 6,
        },
        length: 1,
        tokenType: CypherTokenType.property,
        token: 'i',
      },
      {
        position: {
          line: 9,
          startCharacter: 7,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 9,
          startCharacter: 9,
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
          line: 9,
          startCharacter: 10,
        },
        length: 4,
        tokenType: CypherTokenType.function,
        token: 'date',
      },
      {
        position: {
          line: 9,
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
          line: 9,
          startCharacter: 15,
        },
        length: 12,
        tokenType: CypherTokenType.stringLiteral,
        token: "'2022-05-04'",
      },
      {
        position: {
          line: 9,
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
          line: 9,
          startCharacter: 28,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 9,
          startCharacter: 30,
        },
        length: 4,
        tokenType: CypherTokenType.function,
        token: 'date',
      },
      {
        position: {
          line: 9,
          startCharacter: 34,
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
          line: 9,
          startCharacter: 35,
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
          line: 9,
          startCharacter: 36,
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
          line: 9,
          startCharacter: 37,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 10,
          startCharacter: 6,
        },
        length: 1,
        tokenType: CypherTokenType.property,
        token: 'j',
      },
      {
        position: {
          line: 10,
          startCharacter: 7,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 10,
          startCharacter: 9,
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
          line: 10,
          startCharacter: 10,
        },
        length: 5,
        tokenType: CypherTokenType.function,
        token: 'point',
      },
      {
        position: {
          line: 10,
          startCharacter: 15,
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
          line: 10,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '{',
        bracketInfo: {
          bracketType: BracketType.curly,
          bracketLevel: 1,
        },
      },
      {
        position: {
          line: 10,
          startCharacter: 17,
        },
        length: 1,
        tokenType: CypherTokenType.property,
        token: 'x',
      },
      {
        position: {
          line: 10,
          startCharacter: 18,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 10,
          startCharacter: 20,
        },
        length: 1,
        tokenType: CypherTokenType.numberLiteral,
        token: '2',
      },
      {
        position: {
          line: 10,
          startCharacter: 21,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 10,
          startCharacter: 23,
        },
        length: 1,
        tokenType: CypherTokenType.property,
        token: 'y',
      },
      {
        position: {
          line: 10,
          startCharacter: 24,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 10,
          startCharacter: 26,
        },
        length: 1,
        tokenType: CypherTokenType.numberLiteral,
        token: '3',
      },
      {
        position: {
          line: 10,
          startCharacter: 27,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '}',
        bracketInfo: {
          bracketType: BracketType.curly,
          bracketLevel: 1,
        },
      },
      {
        position: {
          line: 10,
          startCharacter: 28,
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
          line: 10,
          startCharacter: 29,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 10,
          startCharacter: 31,
        },
        length: 5,
        tokenType: CypherTokenType.function,
        token: 'point',
      },
      {
        position: {
          line: 10,
          startCharacter: 36,
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
          line: 10,
          startCharacter: 37,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '{',
        bracketInfo: {
          bracketType: BracketType.curly,
          bracketLevel: 1,
        },
      },
      {
        position: {
          line: 10,
          startCharacter: 38,
        },
        length: 1,
        tokenType: CypherTokenType.property,
        token: 'x',
      },
      {
        position: {
          line: 10,
          startCharacter: 39,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 10,
          startCharacter: 41,
        },
        length: 1,
        tokenType: CypherTokenType.numberLiteral,
        token: '5',
      },
      {
        position: {
          line: 10,
          startCharacter: 42,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 10,
          startCharacter: 44,
        },
        length: 1,
        tokenType: CypherTokenType.property,
        token: 'y',
      },
      {
        position: {
          line: 10,
          startCharacter: 45,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 10,
          startCharacter: 47,
        },
        length: 1,
        tokenType: CypherTokenType.numberLiteral,
        token: '5',
      },
      {
        position: {
          line: 10,
          startCharacter: 48,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '}',
        bracketInfo: {
          bracketType: BracketType.curly,
          bracketLevel: 1,
        },
      },
      {
        position: {
          line: 10,
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
          line: 10,
          startCharacter: 50,
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
          line: 10,
          startCharacter: 51,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 11,
          startCharacter: 6,
        },
        length: 1,
        tokenType: CypherTokenType.property,
        token: 'k',
      },
      {
        position: {
          line: 11,
          startCharacter: 7,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 11,
          startCharacter: 9,
        },
        length: 4,
        tokenType: CypherTokenType.keywordLiteral,
        token: 'null',
      },
      {
        position: {
          line: 12,
          startCharacter: 4,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '}',
        bracketInfo: {
          bracketType: BracketType.curly,
          bracketLevel: 0,
        },
      },
    ]);
  });
});

describe('REMOVE syntax colouring', () => {
  test('Correctly colours REMOVE', async () => {
    const query = `MATCH (n:Label)
    WHERE n.id = 123
    REMOVE n.alias  
  `;

    await testSyntaxColouringContains(query, [
      {
        position: {
          line: 2,
          startCharacter: 4,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'REMOVE',
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
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 2,
          startCharacter: 13,
        },
        length: 5,
        tokenType: CypherTokenType.property,
        token: 'alias',
      },
    ]);
  });
});

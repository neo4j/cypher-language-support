import { TokenType } from '../highlighting/colouringTable';
import {
  doSyntaxColouringText,
  ParsedToken,
} from '../highlighting/syntaxColouring';

export async function testSyntaxColouring(
  fileText: string,
  expected: ParsedToken[],
) {
  const actualTokens = doSyntaxColouringText(fileText);

  expect(actualTokens.length).toBe(expected.length);

  expected.forEach((expectedToken, i) => {
    const token = actualTokens[i];

    expect(token.length).toBe(expectedToken.length);
    expect(token.position.line).toBe(expectedToken.position.line);
    expect(token.position.startCharacter).toBe(token.position.startCharacter);
    expect(token.token).toBe(expectedToken.token);
    expect(token.tokenType).toBe(expectedToken.tokenType);
  });
}

describe('Syntax colouring', () => {
  test('Correctly colours MATCH', async () => {
    const query = 'MATCH (n:Person) WHERE n.name = "foo" RETURN n';

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'MATCH',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 0,
          startCharacter: 8,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
        },
        length: 6,
        tokenType: TokenType.type,
        token: 'Person',
      },
      {
        position: {
          line: 0,
          startCharacter: 15,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 17,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'WHERE',
      },
      {
        position: {
          line: 0,
          startCharacter: 22,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 23,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 0,
          startCharacter: 25,
        },
        length: 4,
        tokenType: TokenType.property,
        token: 'name',
      },
      {
        position: {
          line: 0,
          startCharacter: 29,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 30,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '=',
      },
      {
        position: {
          line: 0,
          startCharacter: 31,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 32,
        },
        length: 5,
        tokenType: TokenType.literal,
        token: '"foo"',
      },
      {
        position: {
          line: 0,
          startCharacter: 37,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 38,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 0,
          startCharacter: 44,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 45,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 0,
          startCharacter: 46,
        },
        length: 5,
        tokenType: TokenType.none,
        token: '<EOF>',
      },
    ]);
  });

  test('Correctly colours standalone procedure CALL', async () => {
    const query = 'CALL dbms.info() YIELD *';

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'CALL',
      },
      {
        position: {
          line: 0,
          startCharacter: 4,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'dbms',
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'info',
      },
      {
        position: {
          line: 0,
          startCharacter: 14,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 0,
          startCharacter: 15,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 17,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 0,
          startCharacter: 22,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 23,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '*',
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 5,
        tokenType: TokenType.none,
        token: '<EOF>',
      },
    ]);
  });

  test('Correctly colours procedure CALL with yield', async () => {
    const query =
      'CALL apoc.do.when(true, "foo", false, "bar") YIELD name, result';

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'CALL',
      },
      {
        position: {
          line: 0,
          startCharacter: 4,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'apoc',
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
        },
        length: 2,
        tokenType: TokenType.function,
        token: 'do',
      },
      {
        position: {
          line: 0,
          startCharacter: 12,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 0,
          startCharacter: 13,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'when',
      },
      {
        position: {
          line: 0,
          startCharacter: 17,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 0,
          startCharacter: 18,
        },
        length: 4,
        tokenType: TokenType.literal,
        token: 'true',
      },
      {
        position: {
          line: 0,
          startCharacter: 22,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 0,
          startCharacter: 23,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 5,
        tokenType: TokenType.literal,
        token: '"foo"',
      },
      {
        position: {
          line: 0,
          startCharacter: 29,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 0,
          startCharacter: 30,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 31,
        },
        length: 5,
        tokenType: TokenType.literal,
        token: 'false',
      },
      {
        position: {
          line: 0,
          startCharacter: 36,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 0,
          startCharacter: 37,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 38,
        },
        length: 5,
        tokenType: TokenType.literal,
        token: '"bar"',
      },
      {
        position: {
          line: 0,
          startCharacter: 43,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 0,
          startCharacter: 44,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 45,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 0,
          startCharacter: 50,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 51,
        },
        length: 4,
        tokenType: TokenType.variable,
        token: 'name',
      },
      {
        position: {
          line: 0,
          startCharacter: 55,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 0,
          startCharacter: 56,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 57,
        },
        length: 6,
        tokenType: TokenType.variable,
        token: 'result',
      },
      {
        position: {
          line: 0,
          startCharacter: 63,
        },
        length: 5,
        tokenType: TokenType.none,
        token: '<EOF>',
      },
    ]);
  });

  test('Correctly colours multi-statements', async () => {
    const query = `MATCH (n:Person) RETURN n
      CALL apoc.do.when(true, "foo", false, "bar") YIELD name, result`;

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'MATCH',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 0,
          startCharacter: 8,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
        },
        length: 6,
        tokenType: TokenType.type,
        token: 'Person',
      },
      {
        position: {
          line: 0,
          startCharacter: 15,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 17,
        },
        length: 6,
        tokenType: TokenType.keyword,
        token: 'RETURN',
      },
      {
        position: {
          line: 0,
          startCharacter: 23,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 24,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 0,
          startCharacter: 25,
        },
        length: 0,
        tokenType: TokenType.none,
        token: '',
      },
      {
        position: {
          line: 1,
          startCharacter: 0,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 1,
          startCharacter: 1,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 1,
          startCharacter: 2,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 1,
          startCharacter: 3,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 1,
          startCharacter: 4,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 1,
          startCharacter: 5,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'CALL',
      },
      {
        position: {
          line: 1,
          startCharacter: 10,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 1,
          startCharacter: 11,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'apoc',
      },
      {
        position: {
          line: 1,
          startCharacter: 15,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 1,
          startCharacter: 16,
        },
        length: 2,
        tokenType: TokenType.function,
        token: 'do',
      },
      {
        position: {
          line: 1,
          startCharacter: 18,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 1,
          startCharacter: 19,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'when',
      },
      {
        position: {
          line: 1,
          startCharacter: 23,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 1,
          startCharacter: 24,
        },
        length: 4,
        tokenType: TokenType.literal,
        token: 'true',
      },
      {
        position: {
          line: 1,
          startCharacter: 28,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 29,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 1,
          startCharacter: 30,
        },
        length: 5,
        tokenType: TokenType.literal,
        token: '"foo"',
      },
      {
        position: {
          line: 1,
          startCharacter: 35,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 36,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 1,
          startCharacter: 37,
        },
        length: 5,
        tokenType: TokenType.literal,
        token: 'false',
      },
      {
        position: {
          line: 1,
          startCharacter: 42,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 43,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 1,
          startCharacter: 44,
        },
        length: 5,
        tokenType: TokenType.literal,
        token: '"bar"',
      },
      {
        position: {
          line: 1,
          startCharacter: 49,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 1,
          startCharacter: 50,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 1,
          startCharacter: 51,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 1,
          startCharacter: 56,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 1,
          startCharacter: 57,
        },
        length: 4,
        tokenType: TokenType.variable,
        token: 'name',
      },
      {
        position: {
          line: 1,
          startCharacter: 61,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 1,
          startCharacter: 62,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 1,
          startCharacter: 63,
        },
        length: 6,
        tokenType: TokenType.variable,
        token: 'result',
      },
      {
        position: {
          line: 1,
          startCharacter: 69,
        },
        length: 5,
        tokenType: TokenType.none,
        token: '<EOF>',
      },
    ]);
  });

  test('Correctly colours unfinished multi-statements', async () => {
    const query = `MATCH (n:Person);

      CALL apoc.do.when(true, "foo", false, "bar") YIELD name, result`;

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'MATCH',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 0,
          startCharacter: 8,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
        },
        length: 6,
        tokenType: TokenType.type,
        token: 'Person',
      },
      {
        position: {
          line: 0,
          startCharacter: 15,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 0,
          startCharacter: 16,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ';',
      },
      {
        position: {
          line: 0,
          startCharacter: 17,
        },
        length: 0,
        tokenType: TokenType.none,
        token: '',
      },
      {
        position: {
          line: 1,
          startCharacter: 0,
        },
        length: 0,
        tokenType: TokenType.none,
        token: '',
      },
      {
        position: {
          line: 2,
          startCharacter: 0,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 2,
          startCharacter: 1,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 2,
          startCharacter: 2,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 2,
          startCharacter: 3,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 2,
          startCharacter: 4,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 2,
          startCharacter: 5,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 2,
          startCharacter: 6,
        },
        length: 4,
        tokenType: TokenType.keyword,
        token: 'CALL',
      },
      {
        position: {
          line: 2,
          startCharacter: 10,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 2,
          startCharacter: 11,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'apoc',
      },
      {
        position: {
          line: 2,
          startCharacter: 15,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 2,
          startCharacter: 16,
        },
        length: 2,
        tokenType: TokenType.function,
        token: 'do',
      },
      {
        position: {
          line: 2,
          startCharacter: 18,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 2,
          startCharacter: 19,
        },
        length: 4,
        tokenType: TokenType.function,
        token: 'when',
      },
      {
        position: {
          line: 2,
          startCharacter: 23,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 2,
          startCharacter: 24,
        },
        length: 4,
        tokenType: TokenType.literal,
        token: 'true',
      },
      {
        position: {
          line: 2,
          startCharacter: 28,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 2,
          startCharacter: 29,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 2,
          startCharacter: 30,
        },
        length: 5,
        tokenType: TokenType.literal,
        token: '"foo"',
      },
      {
        position: {
          line: 2,
          startCharacter: 35,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 2,
          startCharacter: 36,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 2,
          startCharacter: 37,
        },
        length: 5,
        tokenType: TokenType.literal,
        token: 'false',
      },
      {
        position: {
          line: 2,
          startCharacter: 42,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 2,
          startCharacter: 43,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 2,
          startCharacter: 44,
        },
        length: 5,
        tokenType: TokenType.literal,
        token: '"bar"',
      },
      {
        position: {
          line: 2,
          startCharacter: 49,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 2,
          startCharacter: 50,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 2,
          startCharacter: 51,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'YIELD',
      },
      {
        position: {
          line: 2,
          startCharacter: 56,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 2,
          startCharacter: 57,
        },
        length: 4,
        tokenType: TokenType.variable,
        token: 'name',
      },
      {
        position: {
          line: 2,
          startCharacter: 61,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ',',
      },
      {
        position: {
          line: 2,
          startCharacter: 62,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 2,
          startCharacter: 63,
        },
        length: 6,
        tokenType: TokenType.variable,
        token: 'result',
      },
      {
        position: {
          line: 2,
          startCharacter: 69,
        },
        length: 5,
        tokenType: TokenType.none,
        token: '<EOF>',
      },
    ]);
  });

  test('Correctly colours multiline label', async () => {
    const query = `MATCH (n:\`Label
Other\`)
	`;

    await testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
        },
        length: 5,
        tokenType: TokenType.keyword,
        token: 'MATCH',
      },
      {
        position: {
          line: 0,
          startCharacter: 5,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ' ',
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '(',
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
        },
        length: 1,
        tokenType: TokenType.variable,
        token: 'n',
      },
      {
        position: {
          line: 0,
          startCharacter: 8,
        },
        length: 1,
        tokenType: TokenType.operator,
        token: ':',
      },
      {
        position: {
          line: 0,
          startCharacter: 9,
        },
        length: 6,
        tokenType: TokenType.type,
        token: '`Label',
      },
      {
        position: {
          line: 1,
          startCharacter: 0,
        },
        length: 6,
        tokenType: TokenType.type,
        token: 'Other`',
      },
      {
        position: {
          line: 1,
          startCharacter: 6,
        },
        length: 1,
        tokenType: TokenType.none,
        token: ')',
      },
      {
        position: {
          line: 1,
          startCharacter: 7,
        },
        length: 0,
        tokenType: TokenType.none,
        token: '',
      },
      {
        position: {
          line: 2,
          startCharacter: 0,
        },
        length: 1,
        tokenType: TokenType.none,
        token: '\t',
      },
      {
        position: {
          line: 2,
          startCharacter: 1,
        },
        length: 5,
        tokenType: TokenType.none,
        token: '<EOF>',
      },
    ]);
  });
});

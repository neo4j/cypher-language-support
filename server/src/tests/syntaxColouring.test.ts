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
    const query = `MATCH (n:\`Label
Other\`)
	`;

    await testSyntaxColouring(query, []);
  });
});

// describe('Syntax colouring', () => {
//   test('Correctly colours MATCH', async () => {
//     const query = 'MATCH (n:Person) WHERE n.name = "foo" RETURN n';

//     await testSyntaxColouring(query, [
//       {
//         line: 0,
//         startCharacter: 0,
//         length: 5,
//         tokenType: 'keyword',
//         token: 'MATCH',
//       },
//       {
//         line: 0,
//         startCharacter: 7,
//         length: 1,
//         tokenType: 'variable',
//         token: 'n',
//       },
//       {
//         line: 0,
//         startCharacter: 9,
//         length: 6,
//         tokenType: 'typeParameter',
//         token: 'Person',
//       },
//       {
//         line: 0,
//         startCharacter: 17,
//         length: 5,
//         tokenType: 'keyword',
//         token: 'WHERE',
//       },
//       {
//         line: 0,
//         startCharacter: 23,
//         length: 1,
//         tokenType: 'variable',
//         token: 'n',
//       },
//       {
//         line: 0,
//         startCharacter: 25,
//         length: 4,
//         tokenType: 'property',
//         token: 'name',
//       },
//       {
//         line: 0,
//         startCharacter: 32,
//         length: 5,
//         tokenType: 'string',
//         token: '"foo"',
//       },
//       {
//         line: 0,
//         startCharacter: 38,
//         length: 6,
//         tokenType: 'keyword',
//         token: 'RETURN',
//       },
//       {
//         line: 0,
//         startCharacter: 45,
//         length: 1,
//         tokenType: 'variable',
//         token: 'n',
//       },
//     ]);
//   });

//   test('Correctly colours standalone procedure CALL', async () => {
//     const query = 'CALL dbms.info() YIELD *';

//     await testSyntaxColouring(query, [
//       {
//         line: 0,
//         startCharacter: 0,
//         length: 4,
//         tokenType: 'method',
//         token: 'CALL',
//       },
//       {
//         line: 0,
//         startCharacter: 5,
//         length: 9,
//         tokenType: 'function',
//         token: 'dbms.info',
//       },
//       {
//         line: 0,
//         startCharacter: 17,
//         length: 5,
//         tokenType: 'keyword',
//         token: 'YIELD',
//       },
//     ]);
//   });

//   test('Correctly colours procedure CALL with yield', async () => {
//     const query =
//       'CALL apoc.do.when(true, "foo", false, "bar") YIELD name, result';

//     await testSyntaxColouring(query, [
//       {
//         line: 0,
//         startCharacter: 0,
//         length: 4,
//         tokenType: 'method',
//         token: 'CALL',
//       },
//       {
//         line: 0,
//         startCharacter: 5,
//         length: 12,
//         tokenType: 'function',
//         token: 'apoc.do.when',
//       },
//       {
//         line: 0,
//         startCharacter: 18,
//         length: 4,
//         tokenType: 'string',
//         token: 'true',
//       },
//       {
//         line: 0,
//         startCharacter: 24,
//         length: 5,
//         tokenType: 'string',
//         token: '"foo"',
//       },
//       {
//         line: 0,
//         startCharacter: 31,
//         length: 5,
//         tokenType: 'string',
//         token: 'false',
//       },
//       {
//         line: 0,
//         startCharacter: 38,
//         length: 5,
//         tokenType: 'string',
//         token: '"bar"',
//       },
//       {
//         line: 0,
//         startCharacter: 45,
//         length: 5,
//         tokenType: 'keyword',
//         token: 'YIELD',
//       },
//       {
//         line: 0,
//         startCharacter: 51,
//         length: 4,
//         tokenType: 'variable',
//         token: 'name',
//       },
//       {
//         line: 0,
//         startCharacter: 57,
//         length: 6,
//         tokenType: 'variable',
//         token: 'result',
//       },
//     ]);
//   });

//   test('Correctly colours multi-statements', async () => {
//     const query = `MATCH (n:Person) RETURN n
//       CALL apoc.do.when(true, "foo", false, "bar") YIELD name, result`;

//     await testSyntaxColouring(query, [
//       {
//         line: 0,
//         startCharacter: 0,
//         length: 5,
//         tokenType: 'keyword',
//         token: 'MATCH',
//       },
//       {
//         line: 0,
//         startCharacter: 7,
//         length: 1,
//         tokenType: 'variable',
//         token: 'n',
//       },
//       {
//         line: 0,
//         startCharacter: 9,
//         length: 6,
//         tokenType: 'typeParameter',
//         token: 'Person',
//       },
//       {
//         line: 0,
//         startCharacter: 17,
//         length: 6,
//         tokenType: 'keyword',
//         token: 'RETURN',
//       },
//       {
//         line: 0,
//         startCharacter: 24,
//         length: 1,
//         tokenType: 'variable',
//         token: 'n',
//       },
//       {
//         line: 1,
//         startCharacter: 4,
//         length: 4,
//         tokenType: 'method',
//         token: 'CALL',
//       },
//       {
//         line: 1,
//         startCharacter: 9,
//         length: 12,
//         tokenType: 'function',
//         token: 'apoc.do.when',
//       },
//       {
//         line: 1,
//         startCharacter: 22,
//         length: 4,
//         tokenType: 'string',
//         token: 'true',
//       },
//       {
//         line: 1,
//         startCharacter: 28,
//         length: 5,
//         tokenType: 'string',
//         token: '"foo"',
//       },
//       {
//         line: 1,
//         startCharacter: 35,
//         length: 5,
//         tokenType: 'string',
//         token: 'false',
//       },
//       {
//         line: 1,
//         startCharacter: 42,
//         length: 5,
//         tokenType: 'string',
//         token: '"bar"',
//       },
//       {
//         line: 1,
//         startCharacter: 49,
//         length: 5,
//         tokenType: 'keyword',
//         token: 'YIELD',
//       },
//       {
//         line: 1,
//         startCharacter: 55,
//         length: 4,
//         tokenType: 'variable',
//         token: 'name',
//       },
//       {
//         line: 1,
//         startCharacter: 61,
//         length: 6,
//         tokenType: 'variable',
//         token: 'result',
//       },
//     ]);
//   });

//   test('Correctly colours unfinished multi-statements', async () => {
//     const query = `MATCH (n:Person);

//       CALL apoc.do.when(true, "foo", false, "bar") YIELD name, result`;

//     await testSyntaxColouring(query, [
//       {
//         line: 0,
//         startCharacter: 0,
//         length: 5,
//         tokenType: 'keyword',
//         token: 'MATCH',
//       },
//       {
//         line: 0,
//         startCharacter: 7,
//         length: 1,
//         tokenType: 'variable',
//         token: 'n',
//       },
//       {
//         line: 0,
//         startCharacter: 9,
//         length: 6,
//         tokenType: 'typeParameter',
//         token: 'Person',
//       },
//       {
//         line: 2,
//         startCharacter: 6,
//         length: 4,
//         tokenType: 'method',
//         token: 'CALL',
//       },
//       {
//         line: 2,
//         startCharacter: 11,
//         length: 12,
//         tokenType: 'function',
//         token: 'apoc.do.when',
//       },
//       {
//         line: 2,
//         startCharacter: 24,
//         length: 4,
//         tokenType: 'string',
//         token: 'true',
//       },
//       {
//         line: 2,
//         startCharacter: 30,
//         length: 5,
//         tokenType: 'string',
//         token: '"foo"',
//       },
//       {
//         line: 2,
//         startCharacter: 37,
//         length: 5,
//         tokenType: 'string',
//         token: 'false',
//       },
//       {
//         line: 2,
//         startCharacter: 44,
//         length: 5,
//         tokenType: 'string',
//         token: '"bar"',
//       },
//       {
//         line: 2,
//         startCharacter: 51,
//         length: 5,
//         tokenType: 'keyword',
//         token: 'YIELD',
//       },
//       {
//         line: 2,
//         startCharacter: 57,
//         length: 4,
//         tokenType: 'variable',
//         token: 'name',
//       },
//       {
//         line: 2,
//         startCharacter: 63,
//         length: 6,
//         tokenType: 'variable',
//         token: 'result',
//       },
//     ]);
//   });
// });

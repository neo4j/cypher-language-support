import {
  doSyntaxColouringText,
  ParsedToken,
} from '../../../highlighting/syntaxColouring';

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
    expect(token.position.startCharacter).toBe(
      expectedToken.position.startCharacter,
    );
    expect(token.token).toBe(expectedToken.token);
    expect(token.tokenType).toBe(expectedToken.tokenType);
  });
}

export async function testSyntaxColouringContains(
  fileText: string,
  expected: ParsedToken[],
) {
  let actualTokens = doSyntaxColouringText(fileText);
  let foundIndex = 0;

  expected.forEach((expectedToken) => {
    actualTokens = actualTokens.slice(foundIndex);
    foundIndex = actualTokens.findIndex((t) => {
      return t.token === expectedToken.token;
    });

    expect(foundIndex).toBeGreaterThan(-1);
    const token = actualTokens[foundIndex];

    expect(token.length).toBe(expectedToken.length);
    expect(token.position.line).toBe(expectedToken.position.line);
    expect(token.position.startCharacter).toBe(
      expectedToken.position.startCharacter,
    );
    expect(token.tokenType).toBe(expectedToken.tokenType);
  });
}

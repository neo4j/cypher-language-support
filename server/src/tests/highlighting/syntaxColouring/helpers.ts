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
    expect(token.position.startCharacter).toBe(token.position.startCharacter);
    expect(token.token).toBe(expectedToken.token);
    expect(token.tokenType).toBe(expectedToken.tokenType);
  });
}

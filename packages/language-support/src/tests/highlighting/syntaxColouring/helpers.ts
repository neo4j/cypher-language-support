import { applySyntaxColouring } from '../../../highlighting/syntaxColouring';
import { ParsedCypherToken } from '../../../highlighting/syntaxColouringHelpers';

export function testSyntaxColouring(
  fileText: string,
  expected: ParsedCypherToken[],
) {
  const actualTokens = applySyntaxColouring(fileText);

  expect(actualTokens.length).toBe(expected.length);

  expected.forEach((expectedToken, i) => {
    const token = actualTokens[i];

    expect(token.length).toBe(expectedToken.length);
    expect(token.position.line).toBe(expectedToken.position.line);
    expect(token.position.startCharacter).toBe(
      expectedToken.position.startCharacter,
    );
    expect(token.position.startOffset).toBe(expectedToken.position.startOffset);
    expect(token.token).toBe(expectedToken.token);
    expect(token.tokenType).toBe(expectedToken.tokenType);

    expect(token.bracketInfo?.bracketType).toBe(
      expectedToken.bracketInfo?.bracketType,
    );
    expect(token.bracketInfo?.bracketLevel).toBe(
      expectedToken.bracketInfo?.bracketLevel,
    );
  });
}

export function testSyntaxColouringContains(
  fileText: string,
  expected: ParsedCypherToken[],
) {
  let actualTokens = applySyntaxColouring(fileText);
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

import { CharStreams, CommonTokenStream } from 'antlr4';
import CypherLexer from '../generated-parser/Cypher5CmdLexer';
import CypherParser from '../generated-parser/Cypher5CmdParser';
import { getTokens } from '../helpers';
import { CypherTokenType, lexerSymbols, tokenNames } from '../lexerSymbols';

describe('Lexer tokens', () => {
  test('List of tokens should match generated parser symbolic names', () => {
    // Read in auto-generated symbolic names from the parser and remove special characters
    const symbolicNames = CypherLexer.symbolicNames;

    // Lexer keyword list which we want to keep up-to-date
    // Note that it is numeric so we need to map to it's corresponding symbolicName
    const lexerKeywords = Object.keys(lexerSymbols).map((k) => {
      const symbolNumber = parseInt(k, 10);

      // There is no "-1" position in the symbolic name list so we handle EOF separately
      if (symbolNumber === CypherParser.EOF) {
        return 'EOF';
      }
      return symbolicNames[symbolNumber];
    });

    // Check for keywords that exist in the parser but not the lexer
    const addedKeywords = symbolicNames.filter(
      (x) => x !== null && !lexerKeywords.includes(x),
    );
    expect(addedKeywords).toHaveLength(0);

    // Check for keywords that exist in the lexer but not the parser
    // With the current setup this should not happen
    const deletedKeywords = lexerKeywords.filter(
      (x) => x !== 'EOF' && !symbolicNames.includes(x),
    );
    expect(deletedKeywords).toHaveLength(0);
  });

  test('Names of lexer keywords can be lexed back into the token', () => {
    const keywordTokens = Object.entries(lexerSymbols)
      .filter(([, v]) => v === CypherTokenType.keyword)
      .map(([k]) => parseInt(k, 10));

    keywordTokens.forEach((token) => {
      const tokenName = tokenNames[token];
      const inputStream = CharStreams.fromString(tokenName);
      const lexer = new CypherLexer(inputStream);

      const tokenStream = new CommonTokenStream(lexer);
      tokenStream.fill();

      const tokens = getTokens(tokenStream);

      expect(tokens.length).toBe(2);
      // If the test fails, it is useful to see the token that was parsed
      if (tokens[0].type !== token) {
        console.error(
          'unexpected token',
          tokenName,
          token,
          'symbolic name',
          CypherLexer.symbolicNames[token],
        );
        console.error(
          'expected token',
          tokenNames[tokens[0].type],
          tokens[0].type,
          'symbolic name',
          CypherLexer.symbolicNames[tokens[0].type],
        );
      }
      expect(tokens[0].type).toBe(token);
      expect(tokens[1].type).toBe(CypherLexer.EOF);
    });
  });
});

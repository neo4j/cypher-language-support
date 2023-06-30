import { CharStreams, CommonTokenStream } from 'antlr4';
import CypherLexer from '../generated-parser/CypherLexer';
import { getTokens } from '../helpers';
import { CypherTokenType, lexerSymbols, tokenNames } from '../lexerSymbols';

function removeSpecialCharacters(array: (string | undefined)[]) {
  const specialCharacters = [
    'ErrorChar',
    'SPACE',
    'IDENTIFIER',
    'ARROW_LINE',
    'ARROW_LEFT_HEAD',
    'ARROW_RIGHT_HEAD',
    'FORMAL_COMMENT',
    'STRING_LITERAL1',
    'STRING_LITERAL2',
    'ESCAPED_SYMBOLIC_NAME',
    'MORE1',
    'STRING1_OPEN',
    'STRING2_OPEN',
    'ESCAPED_SYMBOLIC_NAME_OPEN',
    'MORE3',
    'MORE4',
    'MORE5',
    'MORE6',
    'MORE7',
    'MORE8',
    'MORE9',
    'MORE10',
    'MORE11',
    'MORE24',
    null,
  ];
  return array.filter((x) => !specialCharacters.includes(x));
}

describe('Keywords', () => {
  test('Lexer keywords should match parser keywords', () => {
    // Read in auto-generated symbolic names from the parser and remove special characters
    const symbolicNames = CypherLexer.symbolicNames;
    const parserKeywords = removeSpecialCharacters(symbolicNames);

    // Lexer keyword list which we want to keep up-to-date
    // Note that it is numeric so we need to map to it's corresponding symbolicName
    const lexerKeywords = Object.keys(lexerSymbols).map(
      (k) => symbolicNames[parseInt(k, 10)],
    );

    // Check for keywords that exist in the parser but not the lexer
    const addedKeywords = parserKeywords.filter(
      (x) => !lexerKeywords.includes(x),
    );
    expect(addedKeywords).toHaveLength(0);

    // Check for keywords that exist in the lexer but not the parser
    // With the current setup this should not happen
    const deletedKeywords = lexerKeywords.filter(
      (x) => !parserKeywords.includes(x),
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
          'unparsed token',
          tokenName,
          token,
          'symbolic name',
          CypherLexer.symbolicNames[token],
        );
        console.error(
          'parsed token',
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

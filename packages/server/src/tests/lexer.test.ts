import { CypherLexer } from '../antlr/CypherLexer';
import { lexerSymbols } from '../lexerSymbols';

function removeSpecialCharacters(array: (string | undefined)[]) {
  const specialCharacters = [
    'SPACE',
    'SINGLE_LINE_COMMENT',
    'DECIMAL_DOUBLE',
    'UNSIGNED_DECIMAL_INTEGER',
    'UNSIGNED_HEX_INTEGER',
    'UNSIGNED_OCTAL_INTEGER',
    'IDENTIFIER',
    'ARROW_LINE',
    'ARROW_LEFT_HEAD',
    'ARROW_RIGHT_HEAD',
    'FORMAL_COMMENT',
    'STRING_LITERAL1',
    'STRING_LITERAL2',
    'MULTI_LINE_COMMENT',
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
    undefined,
  ];
  return array.filter((x) => !specialCharacters.includes(x));
}

describe('Keywords', () => {
  test('Lexer keywords should match parser keywords', () => {
    // Read in auto-generated symbolic names from the parser and remove special characters
    const symbolicNames = CypherLexer['_SYMBOLIC_NAMES'];
    const parserKeywords = removeSpecialCharacters(symbolicNames);

    // Lexer keyword list which we want to keep up-to-date
    // Note that it is numeric so we need to convert it into strings using symbolicNames
    const lexerKeywordNbrs = Array.from(lexerSymbols.keys());

    const lexerKeywords = lexerKeywordNbrs.reduce(
      (acc: string[], nbr: number) => {
        const parserSymbol = symbolicNames[nbr];
        return acc.concat(parserSymbol);
      },
      [],
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
});

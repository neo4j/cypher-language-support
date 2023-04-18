import { CypherLexer } from '../antlr/CypherLexer';
import { lexerSymbols } from '../lexerSymbols';

function removeSpecialCharacters(array: Array<string | undefined>) {
  const specialCharacters: Array<string | undefined> = [
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
  it('Lexer keywords should match parser keywords', () => {
    // Collects all members of CypherLexer.tx
    // This includes numbered special characters and keywords of form [string, number]
    const parserSymbols: Array<[string, number]> = Object.entries(
      CypherLexer,
    ).filter((pair) => typeof pair[1] === 'number') as Array<[string, number]>;
    // Read in auto-generated symbolic names from the parser and remove special characters
    const symbolicNames: Array<string | undefined> =
      CypherLexer['_SYMBOLIC_NAMES'];

    const parserKeywords: Array<string> =
      removeSpecialCharacters(symbolicNames);

    // Lexer keyword list which we want to keep up-to-date
    // Note that it is numeric so we need to convert it into strings using parserSymbols
    const lexerKeywordNbrs: Array<number> = Array.from(lexerSymbols.keys());

    const lexerKeywords: Array<string> = lexerKeywordNbrs.reduce(
      (acc: Array<string>, nbr: number) => {
        const parserSymbol: [string, number] | undefined = parserSymbols.find(
          (keyValuePair) => keyValuePair[1] === nbr,
        );
        if (typeof parserSymbol === 'undefined') {
          // It shouldn't be possible to end up here...
          throw new Error(
            'A lexer keyword referenced a number not present in the CypherLexer.ts.',
          );
        } else {
          return acc.concat((parserSymbol as [string, number])[0]);
        }
      },
      [],
    );

    // Check for keywords that exist in the parser but not the lexer
    const addedKeywords = parserKeywords.filter(
      (x) => !lexerKeywords.includes(x),
    );
    expect(addedKeywords).toHaveLength(0);

    // Check for keywords that exist in the lexer but not the parser
    const deletedKeywords = lexerKeywords.filter(
      (x) => !parserKeywords.includes(x),
    );
    expect(deletedKeywords).toHaveLength(0);
  });
});

import { ParsingResult } from '../cypherLanguageService.js';
import { DbSchema } from '../dbSchema.js';
import { findCaret } from '../helpers.js';
import { SymbolsInfo, Symbol } from '../types.js';

export function findVariableOnCaret({
  parsingResult,
  caretPosition,
  symbolsInfo,
}: {
  parsingResult: ParsingResult;
  dbSchema: DbSchema;
  caretPosition: number;
  symbolsInfo: SymbolsInfo;
}): Symbol | undefined {
  const caret = findCaret(parsingResult, caretPosition);
  /* findCaret gives us the last token starting at or before the caret, which
     means blank space (and comments) resolve back to the token before them.
     We only want to describe a variable when the caret is on it */
  if (!caret || caretPosition > caret.token.stop) {
    return undefined;
  }

  for (const symbolTable of symbolsInfo.symbolTables) {
    for (const symbol of symbolTable) {
      if (symbol.references.includes(caret.token.start)) {
        return symbol;
      }
    }
  }
}

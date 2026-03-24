import { DbSchema } from '../dbSchema';
import { findCaret } from '../helpers';
import { createParsingResult, ParsingResult } from '../cypherLanguageService';
import { CompletionItem, SymbolsInfo } from '../types';
import { completionCoreCompletion } from './completionCoreCompletions';

export function autocomplete(
  query: string,
  dbSchema: DbSchema,
  optionals: {
    symbolsInfo?: SymbolsInfo | undefined;
    parsingResult?: ParsingResult;
    caretPosition?: number;
    manual?: boolean;
    consoleCommandsEnabled?: boolean;
  } = {},
): CompletionItem[] {
  //Add in default values, overwrite with provided values
  const config = {
    symbolsInfo: undefined,
    parsingResult:
      optionals.parsingResult ??
      createParsingResult(query, {
        consoleCommandsEnabled:
          optionals.consoleCommandsEnabled !== undefined
            ? optionals.consoleCommandsEnabled
            : true,
      }),
    caretPosition: query.length,
    manual: false,
    ...optionals,
  };
  /* We try to locate the statement where the caret is and the token of the caret

     The reason for doing that is we need a way to "resynchronise" when the 
     previous statements have errors and the parser fails from them onwards:

     MATCH (m) REUT m; CREATE (n) R
                                  ^ we should still be getting autocompletions here   

  */
  const caret = findCaret(config.parsingResult, config.caretPosition);
  if (caret) {
    const statement = caret.statement;
    const caretToken = caret.token;
    return completionCoreCompletion(
      statement,
      dbSchema,
      caretToken,
      config?.symbolsInfo,
      config?.manual,
      config?.consoleCommandsEnabled,
    );
  }

  return [];
}

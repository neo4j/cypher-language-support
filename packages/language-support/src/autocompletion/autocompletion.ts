import { DbSchema } from '../dbSchema';
import { findCaret } from '../helpers';
import { createParsingResult, ParsingResult } from '../cypherLanguageService';
import { CompletionItem, SymbolsInfo } from '../types';
import { completionCoreCompletion } from './completionCoreCompletions';
import { _internalFeatureFlags } from '../featureFlags';

export function autocomplete(
  query: string,
  dbSchema: DbSchema,
  parsingResult: ParsingResult = createParsingResult(
    query,
    _internalFeatureFlags.consoleCommands,
  ),
  symbolsInfo: SymbolsInfo = { query, symbolTables: [] },
  caretPosition: number = query.length,
  manual = false,
): CompletionItem[] {
  // TODO This is a temporary hack because completions are not working well
  query = query.slice(0, caretPosition);
  /* We try to locate the statement where the caret is and the token of the caret

     The reason for doing that is we need a way to "resynchronise" when the 
     previous statements have errors and the parser fails from them onwards:

     MATCH (m) REUT m; CREATE (n) R
                                  ^ we should still be getting autocompletions here   

  */
  const caret = findCaret(parsingResult, caretPosition);
  if (caret) {
    const statement = caret.statement;
    const caretToken = caret.token;
    return completionCoreCompletion(
      statement,
      dbSchema,
      caretToken,
      symbolsInfo,
      manual,
    );
  }

  return [];
}

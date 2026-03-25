import { DbSchema } from '../dbSchema';
import { findCaret } from '../helpers';
import { createParsingResult, ParsingResult } from '../cypherLanguageService';
import { CompletionItem, SymbolsInfo } from '../types';
import { completionCoreCompletion } from './completionCoreCompletions';

export function autocomplete(
  query: string,
  dbSchema: DbSchema,
  {
    symbolsInfo,
    parsingResult,
    caretPosition = query.length,
    manual = false,
    consoleCommandsEnabled = true,
  }: {
    symbolsInfo?: SymbolsInfo;
    parsingResult?: ParsingResult;
    caretPosition?: number;
    manual?: boolean;
    consoleCommandsEnabled?: boolean;
  } = {},
): CompletionItem[] {
  const resolvedParsingResult =
    parsingResult ?? createParsingResult(query, { consoleCommandsEnabled });

  /* We try to locate the statement where the caret is and the token of the caret

     The reason for doing that is we need a way to "resynchronise" when the
     previous statements have errors and the parser fails from them onwards:

     MATCH (m) REUT m; CREATE (n) R
                                  ^ we should still be getting autocompletions here

  */
  const caret = findCaret(resolvedParsingResult, caretPosition);
  if (caret) {
    const statement = caret.statement;
    const caretToken = caret.token;
    return completionCoreCompletion(
      statement,
      dbSchema,
      caretToken,
      symbolsInfo,
      manual,
      consoleCommandsEnabled,
    );
  }

  return [];
}

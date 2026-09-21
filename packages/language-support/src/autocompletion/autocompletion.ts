import { DbSchema } from '../dbSchema.js';
import { findCaret } from '../helpers.js';
import {
  createParsingResult,
  ParsingResult,
} from '../cypherLanguageService.js';
import { CompletionItem, SymbolsInfo } from '../types.js';
import { completionCoreCompletion } from './completionCoreCompletions.js';

export interface AutocompleteOptions {
  symbolsInfo?: SymbolsInfo;
  caretPosition?: number;
  manual?: boolean;
  consoleCommandsEnabled?: boolean;
}

/**
 * Variant that accepts an already-computed parse, so CypherLanguageService can reuse
 * its cache. Deliberately not re-exported from index.ts: ParsingResult exposes the
 * generated ANTLR parser, and putting it in the public API drags the parser with it.
 */
export function autocompleteWithParsingResult(
  query: string,
  dbSchema: DbSchema,
  {
    symbolsInfo,
    parsingResult,
    caretPosition = query.length,
    manual = false,
    consoleCommandsEnabled = true,
  }: AutocompleteOptions & { parsingResult?: ParsingResult } = {},
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

export function autocomplete(
  query: string,
  dbSchema: DbSchema,
  options: AutocompleteOptions = {},
): CompletionItem[] {
  return autocompleteWithParsingResult(query, dbSchema, options);
}

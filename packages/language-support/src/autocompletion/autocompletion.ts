import { DbSchema } from '../dbSchema';
import { findCaret } from '../helpers';
import { parserWrapper } from '../parserWrapper';
import { CompletionItem } from '../types';
import { completionCoreCompletion } from './completionCoreCompletions';

export function autocomplete(
  query: string,
  dbSchema: DbSchema,
  caretPosition: number = query.length,
  manual = false,
): CompletionItem[] {
  const parsingResult = parserWrapper.parse(query);
  /* We try to locate the latest statement by finding the latest available `;` 
     in the query and take from that point to the end of the query

     The reason for doing that is we need a way to "resynchronise" when the 
     previous statements have errors and the parser fails from them onwards:

     MATCH (m) REUT m; CREATE (n) R
                                  ^ we should still be getting autocompletions here   

     If there was no ;, we don't want to reparse, so we return undefined 
     inside findLatestStatement
  */
  const caret = findCaret(parsingResult, caretPosition);
  if (caret) {
    const statement = caret.statement;
    return completionCoreCompletion(statement, dbSchema, manual);
  }

  return [];
}

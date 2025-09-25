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
  /* We try to locate the statement where the caret is and the token of the caret

     The reason for doing that is we need a way to "resynchronise" when the 
     previous statements have errors and the parser fails from them onwards:

     MATCH (m) REUT m; CREATE (n) R
                                  ^ we should still be getting autocompletions here   

  */
  console.log(JSON.stringify(parserWrapper.symbolsInfo, null, 2));
  const caret = findCaret(parsingResult, caretPosition);
  if (caret) {
    const statement = caret.statement;
    const caretToken = caret.token;
    return completionCoreCompletion(
      statement,
      dbSchema,
      caretToken,
      parserWrapper.symbolsInfo,
      manual,
    );
  }

  return [];
}

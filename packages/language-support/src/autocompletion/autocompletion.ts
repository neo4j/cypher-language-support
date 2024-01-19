import { CompletionItem } from 'vscode-languageserver-types';

import { DbSchema } from '../dbSchema';
import { findLatestStatement } from '../helpers';
import { parserWrapper } from '../parserWrapper';
import { completionCoreCompletion } from './completionCoreCompletions';

export function autocomplete(
  textUntilPosition: string,
  dbSchema: DbSchema,
): CompletionItem[] {
  let parsingResult = parserWrapper.parse(textUntilPosition);
  /* We try to locate the latest statement by finding the latest available `;` 
     in the query and take from that point to the end of the query

     The reason for doing that is we need a way to "resynchronise" when the 
     previous statements have errors and the parser fails from them onwards:

     MATCH (m) REUT m; CREATE (n) R
                                  ^ we should still be getting autocompletions here   

     If there was no ;, we don't want to reparse, so we return undefined 
     inside findLatestStatement
  */

  const lastStatement = findLatestStatement(parsingResult);
  if (lastStatement != undefined) {
    parsingResult = parserWrapper.parse(lastStatement);
  }

  return completionCoreCompletion(
    parsingResult,
    dbSchema,
    parserWrapper.enableConsoleCommands,
  );
}

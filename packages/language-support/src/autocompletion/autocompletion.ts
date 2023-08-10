import { CompletionItem } from 'vscode-languageserver-types';

import { DbInfo } from '../dbInfo';
import { findLatestStatement } from '../helpers';
import { parserWrapper } from '../parserWrapper';
import {
  autoCompleteExpressionStructurally,
  completionCoreCompletion,
} from './helpers';

export function autocomplete(
  textUntilPosition: string,
  dbInfo: DbInfo,
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

  // Function invocation and unfinished strings are not yet completed via antlr4-c3 so still use
  // structural completion for those
  const completion = autoCompleteExpressionStructurally(parsingResult, dbInfo);
  if (completion) {
    return completion;
  }

  return completionCoreCompletion(parsingResult, dbInfo);
}

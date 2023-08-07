import { CompletionItem } from 'vscode-languageserver-types';

import { DbInfo } from '../dbInfo';
import { findLatestStatement } from '../helpers';
import { parserWrapper } from '../parserWrapper';
import {
  autoCompleteKeywords,
  autoCompleteStructurally,
  autoCompleteStructurallyAddingChar,
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

  // First try to complete using tree information:
  // whether we are in a node label, relationship type, function name, procedure name, etc
  const result = autoCompleteStructurally(parsingResult, dbInfo);

  if (result !== undefined) {
    return result;
  } else {
    /* For some queries, we need to add an extra character (we chose 'x') to 
       correctly parse the query. For example:

       MATCH (n:A|
      
      where :A gets correctly parsed as label, but | yields an error token
      :A|x on the contrary gets correctly parsed as label
    */
    const result = autoCompleteStructurallyAddingChar(
      parsingResult.query,
      dbInfo,
    );
    if (result !== undefined) {
      return result;
    } else {
      // Keywords completion is expensive, so try to do it when we've exhausted
      // labels, functions, procedures, etc auto-completion
      return autoCompleteKeywords(parsingResult);
    }
  }
}

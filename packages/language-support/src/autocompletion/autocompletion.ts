import { CompletionItem, Position } from 'vscode-languageserver-types';

import { DbInfo } from '../dbInfo';
import { parserWrapper } from '../parserWrapper';
import {
  autoCompleteStructurally,
  autoCompleteStructurallyAddingChar,
  completionCoreCompletion,
} from './helpers';

export function autocomplete(
  textUntilPosition: string,
  position: Position,
  dbInfo: DbInfo,
): CompletionItem[] {
  const parsingResult = parserWrapper.parse(textUntilPosition);
  // First try to complete using tree information:
  // whether we are in a node label, relationship type, function name, procedure name, etc
  const result = autoCompleteStructurally(parsingResult, position, dbInfo);

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
      textUntilPosition,
      position,
      dbInfo,
    );
    if (result !== undefined) {
      return result;
    } else {
      // Keywords completion is expensive, so try to do it when we've exhausted
      // labels, functions, procedures, etc auto-completion
      return completionCoreCompletion(parsingResult, dbInfo);
    }
  }
}

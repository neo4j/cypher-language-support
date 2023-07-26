import { CompletionItem, Position } from 'vscode-languageserver-types';

import { DbInfo } from '../dbInfo';
import { parserWrapper } from '../parserWrapper';
import {
  autoCompleteKeywords,
  autoCompleteStructurally,
  autoCompleteStructurallyAddingChar,
} from './helpers';

import { Token } from 'antlr4';

export function positionIsParsableToken(lastToken: Token, position: Position) {
  const tokenLength = lastToken.text?.length ?? 0;
  return (
    lastToken.column + tokenLength === position.character &&
    lastToken.line - 1 === position.line
  );
}

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
      return autoCompleteKeywords(parsingResult);
    }
  }
}

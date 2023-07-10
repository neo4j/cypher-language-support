import { CompletionItem, Position } from 'vscode-languageserver-types';

import { Token } from 'antlr4';

import { DbInfo } from '../dbInfo';
import { findStopNode, isDefined } from '../helpers';
import { parserWrapper, ParsingResult } from '../parserWrapper';
import {
  autoCompleteFunctions,
  autoCompleteKeywords,
  autocompleteLabels,
  autoCompleteProcNames,
  autocompleteRelTypes,
  inLabel,
  inNodeLabel,
  inProcedureName,
  inRelationshipType,
  parentExpression,
} from './helpers';

export function positionIsParsableToken(lastToken: Token, position: Position) {
  const tokenLength = lastToken.text?.length ?? 0;
  return (
    lastToken.column + tokenLength === position.character &&
    lastToken.line - 1 === position.line
  );
}

export function autoCompleteNonKeywords(
  parsingResult: ParsingResult,
  position: Position,
  dbInfo: DbInfo,
): CompletionItem[] | undefined {
  const tokens = parsingResult.tokens;
  const tree = parsingResult.result;
  const lastToken = tokens[tokens.length - 2];

  if (!positionIsParsableToken(lastToken, position)) {
    return [];
  } else {
    const stopNode = findStopNode(tree);

    if (inNodeLabel(stopNode)) {
      return autocompleteLabels(dbInfo);
    } else if (inRelationshipType(stopNode)) {
      return autocompleteRelTypes(dbInfo);
    } else {
      // Completes expressions that are prefixes of function names as function names
      const expr = parentExpression(stopNode);

      if (isDefined(expr)) {
        return autoCompleteFunctions(dbInfo, expr);
      } else if (inProcedureName(stopNode)) {
        return autoCompleteProcNames(dbInfo);
      } else {
        return undefined;
      }
    }
  }
}

export function autoCompleteAddingChar(
  textUntilPosition: string,
  oldPosition: Position,
  dbInfo: DbInfo,
): CompletionItem[] | undefined {
  // Try adding a filling character, x, at the end
  const position = Position.create(oldPosition.line, oldPosition.character + 1);
  const parsingResult = parserWrapper.parse(textUntilPosition + 'x');
  const tokens = parsingResult.tokens;
  const tree = parsingResult.result;
  const lastToken = tokens[tokens.length - 2];

  if (!positionIsParsableToken(lastToken, position)) {
    return [];
  } else {
    const stopNode = findStopNode(tree);

    if (inNodeLabel(stopNode)) {
      return autocompleteLabels(dbInfo);
    } else if (inRelationshipType(stopNode)) {
      return autocompleteRelTypes(dbInfo);
    } else if (inLabel(stopNode)) {
      // TODO This requires fixing
      // Unless we build a symbol table, we cannot distinguish in a
      // WHERE type predicate between a node:
      //
      // MATCH (n) WHERE n :A|B
      // RETURN n
      //
      // and a relationship:
      //
      // MATCH (n)-[r]-(m) WHERE r :A|B
      // RETURN n
      return autocompleteLabels(dbInfo).concat(autocompleteRelTypes(dbInfo));
    } else {
      return undefined;
    }
  }
}

export function autocomplete(
  textUntilPosition: string,
  position: Position,
  dbInfo: DbInfo,
): CompletionItem[] {
  const parsingResult = parserWrapper.parse(textUntilPosition);
  const result = autoCompleteNonKeywords(parsingResult, position, dbInfo);

  if (result !== undefined) {
    return result;
  } else {
    /* For some queries, we need to add an extra character to 
       correctly parse the query. For example:

       MATCH (n:A|
      
      where :A gets correctly parsed as label, but | yields an error token
      :A|x on the contrary gets correctly parsed as label
    */
    const result = autoCompleteAddingChar(textUntilPosition, position, dbInfo);
    if (result !== undefined) {
      return result;
    } else {
      // Keywords completion is expensive, so try to do it when we've exhausted
      // labels, functions, procedures, etc auto-completion
      return autoCompleteKeywords(parsingResult);
    }
  }
}

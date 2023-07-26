import { CompletionItem, Position } from 'vscode-languageserver-types';

import { Token } from 'antlr4';

import { DbInfo } from '../dbInfo';
import { findStopNode, isDefined } from '../helpers';
import { parserWrapper } from '../parserWrapper';
import {
  autoCompleteFunctions,
  autoCompleteKeywords,
  autocompleteLabels,
  autoCompleteProcNames,
  autocompleteRelTypes,
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

export function autocomplete(
  textUntilPosition: string,
  position: Position,
  dbInfo: DbInfo,
): CompletionItem[] {
  const parsingResult = parserWrapper.parse(textUntilPosition);
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
        // If we are not completing a label of a procedure name,
        // it means we need to complete keywords
        return autoCompleteKeywords(parsingResult);
      }
    }
  }
}

import {
  CompletionItem,
  CompletionItemKind,
  Position,
} from 'vscode-languageserver-types';

import { CharStreams, CommonTokenStream, Token } from 'antlr4';

import CypherLexer from './generated-parser/CypherLexer';

import CypherParser, {
  Expression2Context,
  LabelExpressionNameContext,
  NodePatternContext,
  ProcedureNameContext,
  RelationshipPatternContext,
} from './generated-parser/CypherParser';

import { DbInfo } from './dbInfo';
import { findParent, findStopNode, getTokens } from './helpers';

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
  const inputStream = CharStreams.fromString(textUntilPosition);

  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const wholeFileParser = new CypherParser(tokenStream);
  wholeFileParser.removeErrorListeners();
  const tree = wholeFileParser.statements();
  const tokens = getTokens(tokenStream);
  const lastToken = tokens[tokens.length - 2];

  if (!positionIsParsableToken(lastToken, position)) {
    return [];
  } else {
    const stopNode = findStopNode(tree);

    if (
      findParent(
        findParent(stopNode, (p) => p instanceof LabelExpressionNameContext),
        (p) => p instanceof NodePatternContext,
      )
    ) {
      return dbInfo.labels.map((t) => {
        return {
          label: t,
          kind: CompletionItemKind.TypeParameter,
        };
      });
    } else if (
      findParent(
        findParent(stopNode, (p) => p instanceof LabelExpressionNameContext),
        (p) => p instanceof RelationshipPatternContext,
      )
    ) {
      return dbInfo.relationshipTypes.map((t) => {
        return {
          label: t,
          kind: CompletionItemKind.TypeParameter,
        };
      });
    } else if (findParent(stopNode, (p) => p instanceof NodePatternContext)) {
      return [];
    } else {
      // Completes expressions that are prefixes of function names as function names
      const expr = findParent(stopNode, (p) => p instanceof Expression2Context);

      if (expr) {
        return Array.from(dbInfo.functionSignatures.keys())
          .filter((functionName) => {
            return functionName.startsWith(expr.getText());
          })
          .map((t) => {
            return {
              label: t,
              kind: CompletionItemKind.Function,
            };
          });
      } else if (
        findParent(stopNode, (p) => p instanceof ProcedureNameContext)
      ) {
        return Array.from(dbInfo.procedureSignatures.keys()).map((t) => {
          return {
            label: t,
            kind: CompletionItemKind.Function,
          };
        });
      } else {
        // TODO Auto completion for keywords
        return [];
      }
    }
  }
}

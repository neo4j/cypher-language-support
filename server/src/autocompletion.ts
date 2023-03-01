import {
  CompletionItem,
  CompletionItemKind,
  Position,
  TextDocumentPositionParams,
  TextDocuments,
} from 'vscode-languageserver/node';

import { Range } from 'vscode-languageserver-types';

import { TextDocument } from 'vscode-languageserver-textdocument';

import { CodeCompletionCore } from 'antlr4-c3';

import { CharStreams, CommonTokenStream, Token } from 'antlr4ts';

import { CypherLexer } from './antlr/CypherLexer';

import {
  CypherParser,
  Expression2Context,
  LabelExpressionNameContext,
  NodePatternContext,
  ProcedureNameContext,
  RelationshipPatternContext,
} from './antlr/CypherParser';

import { DbInfo } from './dbInfo';
import { findParent, findStopNode } from './helpers';

export function positionIsParsableToken(lastToken: Token, position: Position) {
  const tokenLength = lastToken.text?.length ?? 0;
  return (
    lastToken.charPositionInLine + tokenLength === position.character &&
    lastToken.line - 1 === position.line
  );
}

export function doAutoCompletionText(
  textUntilPosition: string,
  position: Position,
  dbInfo: DbInfo,
): CompletionItem[] {
  const inputStream = CharStreams.fromString(textUntilPosition);
  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const wholeFileParser = new CypherParser(tokenStream);
  const tree = wholeFileParser.statements();
  const tokens = tokenStream.getTokens();
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
            return functionName.startsWith(expr.text);
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
        // If we are not completing a label of a procedure name,
        // we need to use the antlr completion
        const codeCompletion = new CodeCompletionCore(wholeFileParser);

        // TODO Nacho Why did it have to be -2 here?
        // Is it because of the end of file?
        const caretIndex = tokenStream.size - 2;

        if (caretIndex >= 0) {
          // TODO Nacho Can this be extracted for more performance?
          const allPosibleTokens: Map<number | undefined, string> = new Map();
          wholeFileParser.getTokenTypeMap().forEach(function (value, key, map) {
            allPosibleTokens.set(map.get(key), key);
          });
          // We need this to ignore the list of tokens from:
          // * unescapedSymbolicNameString, because a lot of keywords are allowed there
          // * escapedSymbolicNameString, to avoid showing ESCAPED_SYMBOLIC_NAME
          //
          // That way we do not populate tokens that are coming from those rules and those
          // are collected as rule names instead
          codeCompletion.preferredRules = new Set<number>()
            .add(CypherParser.RULE_unescapedSymbolicNameString)
            .add(CypherParser.RULE_escapedSymbolicNameString);

          // TODO Nacho Exclude minus, plus, comma, arrow_left_head, lparen etc
          const candidates = codeCompletion.collectCandidates(
            caretIndex as number,
          );
          const tokens = candidates.tokens.entries();
          const tokenCandidates = Array.from(tokens).map((value) => {
            const [tokenNumber, followUpList] = value;
            return [tokenNumber]
              .concat(followUpList)
              .map((value) => allPosibleTokens.get(value))
              .join(' ');
          });

          const tokenCompletions: CompletionItem[] = tokenCandidates.map(
            (t) => {
              return {
                label: t,
                kind: CompletionItemKind.Keyword,
              };
            },
          );

          return tokenCompletions;
        } else {
          return [];
        }
      }
    }
  }
}

// ************************************************************
// Part of the code that does the autocompletion
// ************************************************************
export function doAutoCompletion(
  documents: TextDocuments<TextDocument>,
  dbInfo: DbInfo,
) {
  return (textDocumentPosition: TextDocumentPositionParams) => {
    const textDocument = documents.get(textDocumentPosition.textDocument.uri);
    if (textDocument === undefined) return [];

    const position: Position = textDocumentPosition.position;
    const range: Range = {
      // TODO Nacho: We are parsing from the begining of the file.
      // Do we need to parse from the begining of the current query?
      start: Position.create(0, 0),
      end: position,
    };

    return doAutoCompletionText(textDocument.getText(range), position, dbInfo);
  };
}

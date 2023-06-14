import {
  CompletionItem,
  CompletionItemKind,
  Position,
} from 'vscode-languageserver-types';

import {
  CharStreams,
  CommonTokenStream,
  ParserRuleContext,
  Token,
} from 'antlr4';

import CypherLexer from './generated-parser/CypherLexer';

import CypherParser, {
  Expression2Context,
  LabelExpression4Context,
  LabelExpression4IsContext,
  NodePatternContext,
  ProcedureNameContext,
  RelationshipPatternContext,
} from './generated-parser/CypherParser';

import { CodeCompletionCore } from 'antlr4-c3';
import { DbInfo } from './dbInfo';
import { findParent, findStopNode, getTokens } from './helpers';

export function positionIsParsableToken(lastToken: Token, position: Position) {
  const tokenLength = lastToken.text?.length ?? 0;
  return (
    lastToken.column + tokenLength === position.character &&
    lastToken.line - 1 === position.line
  );
}

function isLabel(p: ParserRuleContext) {
  return (
    p instanceof LabelExpression4Context ||
    p instanceof LabelExpression4IsContext
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
        findParent(stopNode, isLabel),
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
        findParent(stopNode, isLabel),
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
        // If we are not completing a label of a procedure name,
        // we need to use the antlr completion
        const codeCompletion = new CodeCompletionCore(wholeFileParser);

        // TODO Nacho Why did it have to be -2 here?
        // Is it because of the end of file?
        const caretIndex = tokenStream.tokens.length - 2;

        if (caretIndex >= 0) {
          // TODO Nacho Can this be extracted for more performance?
          const allPosibleTokens: Map<number | undefined, string> = new Map();

          wholeFileParser.symbolicNames.forEach(function (value, key) {
            allPosibleTokens.set(key, value);
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
          const candidates = codeCompletion.collectCandidates(caretIndex);
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

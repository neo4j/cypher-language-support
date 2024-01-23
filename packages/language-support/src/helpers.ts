// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore There is a default export but not in the types
import antlrDefaultExport, {
  CommonTokenStream,
  ParserRuleContext,
  ParseTree,
  TerminalNode,
  Token,
} from 'antlr4';
import CypherLexer from './generated-parser/CypherLexer';
import CypherParser, {
  NodePatternContext,
  RelationshipPatternContext,
  StatementsContext,
} from './generated-parser/CypherParser';
import { ParsingResult } from './parserWrapper';

/* In antlr we have 

        ParseTree
           / \
          /   \
TerminalNode   RuleContext
                \
                ParserRuleContext                 

Both TerminalNode and RuleContext have parentCtx, but ParseTree doesn't
This type fixes that because it's what we need to traverse the tree most
of the time
*/
export type EnrichedParseTree = ParseTree & {
  parentCtx: ParserRuleContext | undefined;
};

export function findStopNode(root: StatementsContext) {
  let children = root.children;
  let current: ParserRuleContext = root;

  while (children && children.length > 0) {
    let index = children.length - 1;
    let child = children[index];

    while (
      index > 0 &&
      (child === root.EOF() ||
        child.getText() === '' ||
        child.getText().startsWith('<missing'))
    ) {
      index--;
      child = children[index];
    }
    current = child as ParserRuleContext;
    children = current.children;
  }

  return current;
}

export function findNearestNodeStartingBeforeOrAt(
  current: ParseTree,
  position: number,
): EnrichedParseTree | undefined {
  let result: EnrichedParseTree | undefined = undefined;

  if (
    current instanceof TerminalNode &&
    current.symbol.type !== CypherParser.EOF
  ) {
    const symbol = current.symbol;

    if (symbol.start <= position) {
      result = current;
    }
  } else if (current instanceof ParserRuleContext) {
    const children = current.children;

    if (children) {
      let index = 0;

      while (index < children.length) {
        const child = children[index];

        /*
          We'll try to pick the most specific node whose position is lower or equal to where the caret is

              i.e. for CALL procedure(true
                                   ^
          we would have a parsing tree akin to this one:

                     procedure: CALL ( expression
                                           |
                                    boolean literal
                                           |
                                          true
 

          we would return the literal true.

          If the caret was at a space, we would pick what's inmediately before the space:

             CALL procedure(true,  
                                   ^
          we would pick the COMMA element. This is because spaces don't appear in the 
          parse tree, so we want to pick whatever rule is closest to them
        */
        const maybeResult = findNearestNodeStartingBeforeOrAt(child, position);
        if (maybeResult) {
          result = maybeResult;
        }
        index++;
      }
    }
  }

  return result;
}

export function findParent(
  leaf: EnrichedParseTree | undefined,
  condition: (node: EnrichedParseTree) => boolean,
): EnrichedParseTree {
  let current: EnrichedParseTree | undefined = leaf;

  while (current && !condition(current)) {
    current = current.parentCtx;
  }

  return current;
}

export function getTokens(tokenStream: CommonTokenStream): Token[] {
  // FIXME The type of .tokens is string[], it seems wrong in the antlr4 library
  // Fix this after we've raised an issue and a PR and has been corrected in antlr4
  return tokenStream.tokens as unknown as Token[];
}

export function isDefined(x: unknown) {
  return x !== null && x !== undefined;
}

type AntlrDefaultExport = {
  tree: {
    Trees: {
      getNodeText(
        node: ParserRuleContext,
        s: string[],
        c: typeof CypherParser,
      ): string;
      getChildren(node: ParserRuleContext): ParserRuleContext[];
    };
  };
};
export const antlrUtils = antlrDefaultExport as unknown as AntlrDefaultExport;

export function findLatestStatement(
  parsingResult: ParsingResult,
): undefined | string {
  const tokens = parsingResult.tokens;
  const lastTokenIndex = tokens.length - 1;

  let tokenIndex = lastTokenIndex;
  let found = false;
  let lastStatement: undefined | string = undefined;

  // Last token is always EOF
  while (tokenIndex > 0 && !found) {
    tokenIndex--;
    found = tokens[tokenIndex].type == CypherLexer.SEMICOLON;
  }

  if (found) {
    lastStatement = '';

    tokenIndex += 1;
    while (tokenIndex < lastTokenIndex) {
      lastStatement += tokens.at(tokenIndex)?.text ?? '';
      tokenIndex++;
    }
  }

  return lastStatement;
}

export function inNodeLabel(stopNode: ParserRuleContext) {
  const nodePattern = findParent(
    stopNode,
    (p) => p instanceof NodePatternContext,
  );

  return isDefined(nodePattern);
}

export function inRelationshipType(stopNode: ParserRuleContext) {
  const relPattern = findParent(
    stopNode,
    (p) => p instanceof RelationshipPatternContext,
  );

  return isDefined(relPattern);
}

export const rulesDefiningVariables = [
  CypherParser.RULE_returnItem,
  CypherParser.RULE_unwindClause,
  CypherParser.RULE_subqueryInTransactionsReportParameters,
  CypherParser.RULE_procedureResultItem,
  CypherParser.RULE_foreachClause,
  CypherParser.RULE_loadCSVClause,
  CypherParser.RULE_reduceExpression,
  CypherParser.RULE_allExpression,
  CypherParser.RULE_anyExpression,
  CypherParser.RULE_noneExpression,
  CypherParser.RULE_singleExpression,
  CypherParser.RULE_listComprehension,
];

export const rulesDefiningOrUsingVariables = [
  ...rulesDefiningVariables,
  CypherParser.RULE_pattern,
  CypherParser.RULE_nodePattern,
  CypherParser.RULE_relationshipPattern,
];

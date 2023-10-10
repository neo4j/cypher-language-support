// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore There is a default export but not in the types
import antlrDefaultExport, {
  CommonTokenStream,
  ParserRuleContext,
  Token,
} from 'antlr4';
import CypherLexer from './generated-parser/CypherLexer';
import CypherParser, {
  NodePatternContext,
  RelationshipPatternContext,
  StatementsContext,
} from './generated-parser/CypherParser';
import { ParsingResult } from './parserWrapper';

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

export function findParent(
  leaf: ParserRuleContext | undefined,
  condition: (node: ParserRuleContext) => boolean,
) {
  let current: ParserRuleContext | undefined = leaf;

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

import {
  CommonToken,
  CommonTokenStream,
  ParserRuleContext,
  ParseTree,
  Token,
  Trees,
} from 'antlr4ng';
import { DbSchema } from './dbSchema';
import { CypherCmdLexer } from './generated-parser/CypherCmdLexer';
import {
  CypherCmdParser,
  NodePatternContext,
  RelationshipPatternContext,
  StatementsOrCommandsContext,
} from './generated-parser/CypherCmdParser';
import { ParsedStatement, ParsingResult } from './parserWrapper';
import { CypherVersion } from './types';

/* In antlr we have

        ParseTree
           / \
          /   \
 TerminalNode   RuleContext
                \
                ParserRuleContext

Both TerminalNode and RuleContext have parent, but ParseTree doesn't
This type fixes that because it's what we need to traverse the tree most
of the time
*/
export type EnrichedParseTree = ParseTree & {
  parent: ParserRuleContext | undefined;
};

export function findStopNode(root: StatementsOrCommandsContext) {
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
  leaf: EnrichedParseTree | undefined,
  condition: (node: EnrichedParseTree) => boolean,
): EnrichedParseTree | null {
  let current: EnrichedParseTree | null = leaf;

  while (current && !condition(current)) {
    current = current.parent;
  }

  return current;
}

export function isDefined(x: unknown) {
  return x !== null && x !== undefined;
}

export const antlrUtils = {
  tree: {
    Trees: {
      getNodeText(
        node: ParserRuleContext,
        s: string[],
        _c: typeof CypherCmdParser,
      ): string | undefined {
        return Trees.getNodeText(node, s);
      },
      getChildren(node: ParserRuleContext): ParseTree[] {
        return Trees.getChildren(node);
      },
    },
  },
};

export function inNodeLabel(stopNode: ParserRuleContext) {
  const nodePattern = findParent(
    stopNode,
    (p) =>
      p instanceof NodePatternContext ||
      p instanceof RelationshipPatternContext,
  );

  return nodePattern instanceof NodePatternContext;
}

export function inRelationshipType(stopNode: ParserRuleContext) {
  const relPattern = findParent(
    stopNode,
    (p) =>
      p instanceof NodePatternContext ||
      p instanceof RelationshipPatternContext,
  );

  return relPattern instanceof RelationshipPatternContext;
}

export function findCaret(
  parsingResult: ParsingResult,
  caretPosition: number,
): { statement: ParsedStatement; token: Token } | undefined {
  const statements = parsingResult.statementsParsing;
  let i = 0;
  let result: { statement: ParsedStatement; token: Token } = undefined;
  let keepLooking = true;

  while (i < statements.length && keepLooking) {
    let j = 0;
    const statement = statements[i];
    const tokens = statement.tokens;

    while (j < tokens.length && keepLooking) {
      const currentToken = tokens[j];
      keepLooking = currentToken.start <= caretPosition;

      if (currentToken.channel === 0 && keepLooking) {
        result = { statement: statement, token: currentToken };
      }

      j++;
    }
    i++;
  }

  return result;
}

/**
 * Helper to access the internal tokens array from a CommonTokenStream.
 * In antlr4ng, the tokens property is protected, but we need direct access
 * for performance and compatibility with existing patterns.
 */
export function getStreamTokens(tokenStream: CommonTokenStream): Token[] {
  return (tokenStream as unknown as { tokens: Token[] }).tokens;
}

/**
 * Helper to set the internal tokens array on a CommonTokenStream.
 */
export function setStreamTokens(
  tokenStream: CommonTokenStream,
  tokens: Token[],
): void {
  (tokenStream as unknown as { tokens: Token[] }).tokens = tokens;
}

export function splitIntoStatements(
  tokenStream: CommonTokenStream,
  lexer: CypherCmdLexer,
): CommonTokenStream[] {
  tokenStream.fill();
  const tokens = getStreamTokens(tokenStream);

  let i = 0;
  const result: CommonTokenStream[] = [];
  let chunk: Token[] = [];
  let offset = 0;

  while (i < tokens.length) {
    const current = (tokens[i] as CommonToken).clone();
    current.tokenIndex -= offset;

    chunk.push(current);

    if (
      current.type === CypherCmdLexer.SEMICOLON ||
      current.type === CypherCmdLexer.EOF
    ) {
      // This does not relex since we are not calling fill on the token stream
      const tokenStream = new CommonTokenStream(lexer);
      setStreamTokens(tokenStream, chunk);
      result.push(tokenStream);
      offset = i + 1;
      chunk = [];
    }

    i++;
  }

  return result;
}

export function findPreviousNonSpace(
  tokens: Token[],
  index: number,
): Token | undefined {
  let i = index;
  while (i > 0) {
    const token = tokens[--i];

    if (token.type !== CypherCmdParser.SPACE) {
      return token;
    }
  }

  return undefined;
}

export function isCommentOpener(
  thisToken: Token,
  nextToken: Token | undefined,
): boolean {
  return thisToken.text === '/' && nextToken?.text === '*';
}

export function resolveCypherVersion(
  parsedVersion: CypherVersion | undefined,
  dbSchema: DbSchema,
) {
  const cypherVersion: CypherVersion =
    parsedVersion ?? dbSchema.defaultLanguage ?? 'CYPHER 5';

  return cypherVersion;
}

export const rulesDefiningVariables = [
  CypherCmdParser.RULE_returnItem,
  CypherCmdParser.RULE_unwindClause,
  CypherCmdParser.RULE_subqueryInTransactionsReportParameters,
  CypherCmdParser.RULE_procedureResultItem,
  CypherCmdParser.RULE_foreachClause,
  CypherCmdParser.RULE_loadCSVClause,
  CypherCmdParser.RULE_reduceExpression,
  CypherCmdParser.RULE_listItemsPredicate,
  CypherCmdParser.RULE_listComprehension,
];

export const rulesDefiningOrUsingVariables = [
  ...rulesDefiningVariables,
  CypherCmdParser.RULE_pattern,
  CypherCmdParser.RULE_nodePattern,
  CypherCmdParser.RULE_relationshipPattern,
];

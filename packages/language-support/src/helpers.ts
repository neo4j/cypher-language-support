import {
  CommonToken,
  CommonTokenStream,
  ListTokenSource,
  ParserRuleContext,
  ParseTree,
  Token,
  Trees,
} from 'antlr4ng';
import { DbSchema } from './dbSchema.js';
import { CypherCmdLexer } from './generated-parser/CypherCmdLexer.js';
import {
  CypherCmdParser,
  NodePatternContext,
  RelationshipPatternContext,
  StatementsOrCommandsContext,
} from './generated-parser/CypherCmdParser.js';
import { ParsedStatement, ParsingResult } from './cypherLanguageService.js';
import { CypherVersion } from './types.js';

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

/** Find the first parent recursively in the tree matching the condition */
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

export function splitIntoStatements(
  tokenStream: CommonTokenStream,
): { tokenStream: CommonTokenStream; tokens: Token[] }[] {
  tokenStream.fill();
  const tokens = tokenStream.getTokens();

  let i = 0;
  const result: { tokenStream: CommonTokenStream; tokens: Token[] }[] = [];
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
      // Wrapping the chunk in a ListTokenSource means the statement is
      // parsed from the pre-lexed tokens: no lexer involved, no relexing
      result.push({
        tokenStream: new CommonTokenStream(new ListTokenSource(chunk)),
        tokens: chunk,
      });
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

export function getDirection(
  rel: RelationshipPatternContext,
): 'right' | 'left' | 'undirected' {
  // An unfinished relationship (no closing `]`) has an ambiguous direction, so
  // it is treated as undirected.
  const complete = Boolean(rel.RBRACKET());
  const hasLeft = Boolean(rel.leftArrow());
  const hasRight = Boolean(rel.rightArrow());
  if (complete && hasRight && !hasLeft) {
    return 'right';
  }
  if (complete && hasLeft && !hasRight) {
    return 'left';
  }
  return 'undirected';
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

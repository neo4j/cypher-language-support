import {
  CommonToken,
  CommonTokenStream,
  ParserRuleContext,
  ParseTree,
  Token,
} from 'antlr4ng';
import { DbSchema } from './dbSchema.js';
import { CypherCmdLexer as CypherLexer } from './generated-parser/CypherCmdLexer.js';
import {
  CypherCmdParser as CypherParser,
  NodePatternContext,
  RelationshipPatternContext,
  StatementsOrCommandsContext,
} from './generated-parser/CypherCmdParser.js';
import { ParsedStatement, ParsingResult } from './cypherLanguageService.js';
import { CypherVersion } from './types.js';

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
  leaf: ParseTree | null | undefined,
  condition: (node: ParseTree) => boolean,
): ParseTree | null {
  let current: ParseTree | null = leaf ?? null;

  while (current && !condition(current)) {
    current = current.parent;
  }

  return current;
}

export function isDefined(x: unknown) {
  return x !== null && x !== undefined;
}

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

export function splitIntoStatements(tokenStream: CommonTokenStream): Token[][] {
  tokenStream.fill();
  const tokens = tokenStream.getTokens();

  let i = 0;
  const result: Token[][] = [];
  let chunk: Token[] = [];

  while (i < tokens.length) {
    const current = CommonToken.fromToken(tokens[i]);
    current.tokenIndex = chunk.length;

    chunk.push(current);

    if (
      current.type === CypherLexer.SEMICOLON ||
      current.type === CypherLexer.EOF
    ) {
      result.push(chunk);
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

    if (token.type !== CypherParser.SPACE) {
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
  CypherParser.RULE_returnItem,
  CypherParser.RULE_unwindClause,
  CypherParser.RULE_subqueryInTransactionsReportParameters,
  CypherParser.RULE_procedureResultItem,
  CypherParser.RULE_foreachClause,
  CypherParser.RULE_loadCSVClause,
  CypherParser.RULE_reduceExpression,
  CypherParser.RULE_listItemsPredicate,
  CypherParser.RULE_listComprehension,
];

export const rulesDefiningOrUsingVariables = [
  ...rulesDefiningVariables,
  CypherParser.RULE_pattern,
  CypherParser.RULE_nodePattern,
  CypherParser.RULE_relationshipPattern,
];

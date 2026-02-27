import {
  CommonToken,
  CommonTokenStream,
  ErrorNode,
  ParserRuleContext,
  ParseTree,
  Token,
} from 'antlr4ng';
import { DbSchema } from './dbSchema';
import { CypherCmdLexer as CypherLexer } from './generated-parser/CypherCmdLexer.js';
import {
  CypherCmdParser as CypherParser,
  NodePatternContext,
  RelationshipPatternContext,
  StatementsOrCommandsContext,
} from './generated-parser/CypherCmdParser.js';
import { ParsedStatement, ParsingResult } from './parserWrapper';
import { CypherVersion } from './types';

/* In antlr we have

        ParseTree
           / \
          /   \
 TerminalNode   ParserRuleContext

ParserRuleContext has parent, but ParseTree doesn't
This type fixes that because it's what we need to traverse the tree most
of the time
*/
export type EnrichedParseTree = ParseTree & {
  parent: ParseTree | null;
};

/**
 * Detects contexts that are incomplete or erroneous by checking for:
 * 1. ErrorNode children (tokens consumed during error recovery)
 * 2. Empty/synthesized contexts (created by error recovery with no real content)
 * 3. Contexts where the stop position is before the start (degenerate range)
 */
export function hasParseError(ctx: ParserRuleContext): boolean {
  // Check for ErrorNode children
  if (ctx.children.some((child) => child instanceof ErrorNode)) {
    return true;
  }
  // Check for empty/synthesized context (no children or degenerate range)
  if (ctx.children.length === 0) {
    return true;
  }
  if (ctx.start && ctx.stop && ctx.start.start > ctx.stop.stop) {
    return true;
  }
  // Check for incomplete node/relationship patterns by verifying required
  // closing tokens are present
  if (ctx instanceof NodePatternContext) {
    return ctx.RPAREN() === null;
  }
  if (ctx instanceof RelationshipPatternContext) {
    return ctx.RBRACKET() === null;
  }
  return false;
}

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
): EnrichedParseTree {
  let current: EnrichedParseTree | undefined = leaf;

  while (current && !condition(current)) {
    current = current.parent as EnrichedParseTree | undefined;
  }

  return current;
}

export function isDefined(x: unknown) {
  return x !== null && x !== undefined;
}

export function inNodeLabel(stopNode: ParserRuleContext) {
  const nodePattern = findParent(
    stopNode as EnrichedParseTree,
    (p) =>
      p instanceof NodePatternContext ||
      p instanceof RelationshipPatternContext,
  );

  return nodePattern instanceof NodePatternContext;
}

export function inRelationshipType(stopNode: ParserRuleContext) {
  const relPattern = findParent(
    stopNode as EnrichedParseTree,
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
  lexer: CypherLexer,
): CommonTokenStream[] {
  tokenStream.fill();
  const tokens = tokenStream.getTokens();

  let i = 0;
  const result: CommonTokenStream[] = [];
  let chunk: Token[] = [];
  let offset = 0;

  while (i < tokens.length) {
    const current = CommonToken.fromToken(tokens[i]);
    current.tokenIndex -= offset;

    chunk.push(current);

    if (
      current.type === CypherLexer.SEMICOLON ||
      current.type === CypherLexer.EOF
    ) {
      // For chunks ending with SEMICOLON (not EOF), add a synthetic EOF token
      // so the parser doesn't fetch an EOF positioned at the end of the entire
      // input, which would cause getTextFromRange to span beyond the chunk.
      if (current.type === CypherLexer.SEMICOLON) {
        const eof = CommonToken.fromType(Token.EOF, '<EOF>');
        eof.start = current.stop + 1;
        eof.stop = current.stop;
        eof.line = current.line;
        eof.column = current.column + (current.text?.length ?? 1);
        eof.tokenIndex = current.tokenIndex + 1;
        eof.inputStream = current.inputStream;
        chunk.push(eof);
      }

      // This does not relex since we are not calling fill on the token stream
      const chunkStream = new CommonTokenStream(lexer);
      const streamInternal = chunkStream as unknown as Record<string, unknown>;
      streamInternal.tokens = chunk;
      streamInternal.fetchedEOF = true;
      result.push(chunkStream);
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

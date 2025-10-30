// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore There is a default export but not in the types
//TODO check how we can import this from -> antlrDefaultExport,

import {
  CommonTokenStream,
  ParserRuleContext,
  ParseTree,
  Token,
} from 'antlr4ng';
import { DbSchema } from './dbSchema';
import { CypherCmdLexer as CypherLexer } from './generated-parser/CypherCmdLexer';
import { CypherCmdParser as CypherParser,
  NodePatternContext,
  RelationshipPatternContext,
} from './generated-parser/CypherCmdParser';
import { ParsedStatement, ParsingResult } from './parserWrapper';
import { CypherVersion } from './types';


const x = Token.EOF;
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
// export type EnrichedParseTree = ParseTree & {
//   parentCtx: ParserRuleContext | undefined;
// };

export function findParent(
  leaf: ParseTree | undefined,
  condition: (node: ParseTree) => boolean,
): ParseTree {
  let current: ParseTree | undefined = leaf;
  
  while (current && !condition(current)) {
    current = current.parent;
  }

  return current;
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
// export const antlrUtils = antlrDefaultExport as unknown as AntlrDefaultExport;

export function inNodeLabel(lastNode: ParserRuleContext) {
  const nodePattern = findParent(
    lastNode,
    (p) =>
      p instanceof NodePatternContext ||
      p instanceof RelationshipPatternContext,
  );

  return nodePattern instanceof NodePatternContext;
}

export function inRelationshipType(lastNode: ParserRuleContext) {
  const relPattern = findParent(
    lastNode,
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
): Token[][] {
  tokenStream.fill();
  const tokens = tokenStream.getTokens();
  
  let i = 0;
  const result: Token[][] = [];
  let chunk: Token[] = [];
  let offset = 0;

  while (i < tokens.length) {
    const current = tokens[i]//.clone();
    current.tokenIndex -= offset;

    chunk.push(current);

    if (
      current.type === CypherLexer.SEMICOLON ||
      current.type === CypherLexer.cEOF
    ) {
      //TODO check if this works
      // This does not relex since we are not calling fill on the token stream
      //const tokenStream = new CommonTokenStream(chunk)// lexer);
      //tokenStream........
      //tokenStream.tokens = chunk;
      result.push(chunk);
      // const newStream = new CommonTokenStream()
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

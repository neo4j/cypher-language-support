// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore There is a default export but not in the types
import antlrDefaultExport, {
  CommonTokenStream,
  ParserRuleContext,
  ParseTree,
  Token,
} from 'antlr4';
import { DbSchema } from './dbSchema';
import CypherLexer from './generated-parser/CypherCmdLexer';
import CypherParser, {
  ClauseContext,
  NodePatternContext,
  QueryWithLocalDefinitionsContext,
  RelationshipPatternContext,
  SingleQueryContext,
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

Both TerminalNode and RuleContext have parentCtx, but ParseTree doesn't
This type fixes that because it's what we need to traverse the tree most
of the time
*/
export type EnrichedParseTree = ParseTree & {
  parentCtx: ParserRuleContext | undefined;
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
): EnrichedParseTree {
  let current: EnrichedParseTree | undefined = leaf;

  while (current && !condition(current)) {
    current = current.parentCtx;
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
export const antlrUtils = antlrDefaultExport as unknown as AntlrDefaultExport;

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
  lexer: CypherLexer,
): CommonTokenStream[] {
  tokenStream.fill();
  const tokens = tokenStream.tokens;

  let i = 0;
  const result: CommonTokenStream[] = [];
  let chunk: Token[] = [];
  let offset = 0;

  while (i < tokens.length) {
    const current = tokens[i].clone();
    current.tokenIndex -= offset;

    chunk.push(current);

    if (
      current.type === CypherLexer.SEMICOLON ||
      current.type === CypherLexer.EOF
    ) {
      // This does not relex since we are not calling fill on the token stream
      const tokenStream = new CommonTokenStream(lexer);
      tokenStream.tokens = chunk;
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

/**
 * Takes a rule context checks if the current (rightmost) rule is within a clause.
 * If so, checks how many other clauses are inside the corresponding SingleQueryContext and returns the current
 * ClauseContext if the count is >= 15. This is so we can use the clause as context for candidate collection, 
 * which can get slow when there are multiple clauses in a single query.
 */
export function findLastClause(ctx: ParserRuleContext) {
  let current: ParserRuleContext = ctx;
  //ctx can vary from rule inside latest clause statement containing it
  //Here we go up to the outer singlequery (which is not empty)
  while(!(current instanceof SingleQueryContext && current.getText()) && current.parentCtx) {
    current = current.parentCtx;
  };
  
  const newCtx = checkNumClauses(current);

  return newCtx;
}

/**
 * Takes a parser rule, and returns the number of clauses under the rightmost SingleQueryContext
 * If the rightmost child of said SingleQueryContext is a QueryWithLocalDefinitionsContext:s 
 * it can contain more SingleQueryContext:s and we thus recursively search this.
 * @param ctx 
 * @returns 
 */
export function checkNumClauses(ctx: ParserRuleContext): ParserRuleContext {
  let current = ctx;
  let lastCurrent: ParserRuleContext = undefined;
  while(lastCurrent !== current && current.children) {
    lastCurrent = current;
    if (current instanceof SingleQueryContext) {
      const foundClauseCount: boolean = false;
      let lastCandidate = 1;
      while (!foundClauseCount && lastCandidate <= current.children.length){
        const lastChild = current.children.at(-1*lastCandidate);
        if (lastChild instanceof ClauseContext) {
          const clauseChildren = current.children.filter(x => x instanceof ClauseContext);
          const numClauses = clauseChildren.length;
          if (numClauses >= 15) {
            return lastChild;
          } else {
            return undefined;
          }
        } else if (lastChild instanceof QueryWithLocalDefinitionsContext) {
          return checkNumClauses(lastChild);
        } else {
          lastCandidate ++;
        }
      }
      return undefined;
    }
    for (let i = current.children.length-1; i >= 0; i--) {
      const candidate = current.children[i];
      if (candidate instanceof ParserRuleContext) {
        current = candidate;
        break;
      }
    }
  }
  return undefined;
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

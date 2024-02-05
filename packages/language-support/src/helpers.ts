// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore There is a default export but not in the types
import antlrDefaultExport, {
  CommonTokenStream,
  ParserRuleContext,
  ParseTree,
  Token,
} from 'antlr4';
import CypherLexer from './generated-parser/CypherLexer';
import CypherParser, {
  NodePatternContext,
  RelationshipPatternContext,
  StatementsContext,
} from './generated-parser/CypherParser';
import { ParsingResult, StatementParsing } from './parserWrapper';

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

class MyTokenStream extends CommonTokenStream {
  tokens: antlrDefaultExport.Token[] = [];

  constructor(lexer: CypherLexer, tokens: Token[]) {
    super(lexer);
    this.tokens = [...tokens];
  }
}

export function findCaret(
  parsingResult: ParsingResult,
  caretPosition: number,
): { statement: StatementParsing; token: Token } | undefined {
  const statements = parsingResult.statementsParsing;
  let i = 0;
  let result: { statement: StatementParsing; token: Token } = undefined;
  let keepLooking = true;

  while (i < statements.length && keepLooking) {
    let j = 0;
    const statement = statements[i];
    const tokens = statement.tokens;

    while (j < tokens.length && keepLooking) {
      const currentToken = tokens[j];
      keepLooking = currentToken.start < caretPosition;

      if (currentToken.channel === 0 && keepLooking) {
        result = { statement: statement, token: currentToken };
      }

      j++;
    }
    i++;
  }

  return result;
}

// TODO Should this be moved to the parser wrapper?
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
      result.push(new MyTokenStream(lexer, chunk));
      offset = i + 1;
      chunk = [];
    }

    i++;
  }

  return result;
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

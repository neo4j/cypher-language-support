// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore There is a default export but not in the types
import antlrDefaultExport, {
  CharStreams,
  CommonTokenStream,
  ParserRuleContext,
  ParseTree,
  Token,
} from 'antlr4';
import Cypher25Lexer from './generated-parser/Cypher25CmdLexer';
import Cypher25Parser, {
  StatementOrCommandContext as Cypher25StatementOrCommand,
} from './generated-parser/Cypher25CmdParser';
import Cypher5Lexer from './generated-parser/Cypher5CmdLexer';
import Cypher5Parser, {
  NodePatternContext as Cypher5NodePattern,
  RelationshipPatternContext as Cypher5RelationshipPattern,
  StatementOrCommandContext as Cypher5StatementOrCommand,
} from './generated-parser/Cypher5CmdParser';
import StatementsLexer from './generated-parser/StatementsLexer';
import { ParsedStatement, ParsingResult } from './parserWrapper';

export interface StatementParsingScaffolding {
  parser: Cypher5Parser | Cypher25Parser;
  statement: string;
  tokens: Token[];
}

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

export function findStopNode(
  root: Cypher5StatementOrCommand | Cypher25StatementOrCommand,
) {
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
        c: typeof Cypher5Parser,
      ): string;
      getChildren(node: ParserRuleContext): ParserRuleContext[];
    };
  };
};
export const antlrUtils = antlrDefaultExport as unknown as AntlrDefaultExport;

export function inNodeLabel(stopNode: ParserRuleContext) {
  const nodePattern = findParent(
    stopNode,
    (p) => p instanceof Cypher5NodePattern,
  );

  return isDefined(nodePattern);
}

export function inRelationshipType(stopNode: ParserRuleContext) {
  const relPattern = findParent(
    stopNode,
    (p) => p instanceof Cypher5RelationshipPattern,
  );

  return isDefined(relPattern);
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
  query: string,
): StatementParsingScaffolding[] {
  const inputStream = CharStreams.fromString(query);
  const lexer = new StatementsLexer(inputStream);
  lexer.removeErrorListeners();
  const tokenStream = new CommonTokenStream(lexer);
  tokenStream.fill();
  const result: StatementParsingScaffolding[] = [];
  let statementStr = '';
  let isCypher25 = false;
  let offset = 0;
  let lastLine = 0;
  let lastColumn = 0;
  let hasJumpedLine = false;

  for (let j = 0; j < tokenStream.size; ++j) {
    const token = tokenStream.get(j);

    if (token.text !== '<EOF>') {
      statementStr += token.text;
    }

    if (token.type === StatementsLexer.CYPHER25) {
      isCypher25 = true;
    }

    if (
      token.type === StatementsLexer.SEMICOLON ||
      token.type == StatementsLexer.EOF
    ) {
      if (isCypher25) {
        const inputStream25 = CharStreams.fromString(statementStr);
        const lexer25 = new Cypher25Lexer(inputStream25);
        const tokenStream25 = new CommonTokenStream(lexer25);
        lexer25.removeErrorListeners();
        tokenStream25.fill();
        const chunk = tokenStream25.tokens.map((t) => {
          const current = t.clone();
          current.start += offset;
          current.stop += offset;
          return current;
        });
        const parser = new Cypher5Parser(tokenStream25);
        parser.removeErrorListeners();

        tokenStream25.tokens = chunk;
        result.push({
          parser: parser,
          tokens: chunk,
          statement: statementStr,
        });
      } else {
        const inputStream5 = CharStreams.fromString(statementStr);
        const lexer5 = new Cypher5Lexer(inputStream5);
        const tokenStream5 = new CommonTokenStream(lexer5);
        lexer5.removeErrorListeners();
        tokenStream5.fill();
        hasJumpedLine = false;

        const chunk = tokenStream5.tokens.map((t) => {
          const current = t.clone();
          if (!hasJumpedLine) {
            current.column += lastColumn;
          } else {
            current.line += lastLine - 1;
          }

          if (t.text === '\n') {
            hasJumpedLine = true;
          }
          current.start += offset;
          current.stop += offset;
          return current;
        });

        lastLine = chunk.at(-1).line;
        lastColumn = chunk.at(-1).column;
        offset = chunk.at(-1).start;

        const parser = new Cypher5Parser(tokenStream5);
        parser.removeErrorListeners();

        tokenStream5.tokens = chunk;

        if (
          chunk.find(
            (token) =>
              (token.type !== Cypher5Lexer.SPACE &&
                token.type !== Cypher5Lexer.EOF) ||
              (token.type === Cypher5Lexer.EOF && token.text !== '<EOF>'),
          )
        ) {
          result.push({
            parser: parser,
            tokens: chunk,
            statement: statementStr,
          });
        }
      }

      statementStr = '';
      isCypher25 = false;
    }
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

    if (token.type !== Cypher5Parser.SPACE) {
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

export const rulesDefiningVariables = {
  cypher5: [
    Cypher5Parser.RULE_returnItem,
    Cypher5Parser.RULE_unwindClause,
    Cypher5Parser.RULE_subqueryInTransactionsReportParameters,
    Cypher5Parser.RULE_procedureResultItem,
    Cypher5Parser.RULE_foreachClause,
    Cypher5Parser.RULE_loadCSVClause,
    Cypher5Parser.RULE_reduceExpression,
    Cypher5Parser.RULE_listItemsPredicate,
    Cypher5Parser.RULE_listComprehension,
  ],
};

export const rulesDefiningOrUsingVariables = {
  cypher5: [
    ...rulesDefiningVariables.cypher5,
    Cypher5Parser.RULE_pattern,
    Cypher5Parser.RULE_nodePattern,
    Cypher5Parser.RULE_relationshipPattern,
  ],
};

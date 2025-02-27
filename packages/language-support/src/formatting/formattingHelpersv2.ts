/*
 * This file is a WIP of the second iteration of the Cypher formatter.
 * It's being kept as a separate file to enable having two separate version at once
 * since it would be difficult to consolidate the new and the old version
 */

import {
  CharStreams,
  CommonToken,
  CommonTokenStream,
  ErrorListener as ANTLRErrorListener,
  ParseTree,
  Recognizer,
  TerminalNode,
  Token,
} from 'antlr4';
import { default as CypherCmdLexer } from '../generated-parser/CypherCmdLexer';
import CypherCmdParser, {
  EscapedSymbolicNameStringContext,
  MergeClauseContext,
  UnescapedSymbolicNameString_Context,
} from '../generated-parser/CypherCmdParser';
import { lexerKeywords } from '../lexerSymbols';

export class FormatterErrorsListener
  implements ANTLRErrorListener<CommonToken>
{
  syntaxError<T extends Token>(
    _r: Recognizer<CommonToken>,
    offendingSymbol: T,
    line: number,
    column: number,
  ) {
    throw new Error(
      `Could not format due to syntax error at line ${line}:${column} near "${offendingSymbol?.text}"`,
    );
  }
  public reportAmbiguity() {}
  public reportAttemptingFullContext() {}
  public reportContextSensitivity() {}
}

/**
 * The maximum column width for the formatter. Not a hard limit as overflow
 * is unavoidable in some cases, but we always prefer a solution that doesn't overflow.
 */
export const MAX_COL = 80;

export type Chunk = RegularChunk | CommentChunk | SpecialChunk;

export interface RegularChunk {
  type: 'REGULAR';
  node?: TerminalNode;
  noSpace?: true;
  noBreak?: true;
  isCursor?: true;
  text: string;
}

export interface CommentChunk {
  type: 'COMMENT';
  isCursor?: true;
  breakBefore: boolean;
  text: string;
}

interface GroupChunk {
  type: 'GROUP_START' | 'GROUP_END';
  extraIndent?: number;
}

interface IndentationChunk {
  type: 'INDENT' | 'DEDENT';
}

type SpecialChunk = GroupChunk | IndentationChunk;

const traillingCharacters = [
  CypherCmdLexer.SEMICOLON,
  CypherCmdLexer.COMMA,
  CypherCmdLexer.COLON,
  CypherCmdLexer.RPAREN,
  CypherCmdLexer.RBRACKET,
];

export function isSpecialChunk(chunk: Chunk): chunk is SpecialChunk {
  return (
    chunk.type === 'GROUP_START' ||
    chunk.type === 'GROUP_END' ||
    chunk.type === 'INDENT' ||
    chunk.type === 'DEDENT'
  );
}

export function handleMergeClause(
  ctx: MergeClauseContext,
  visit: (node: ParseTree) => void,
  startGroup?: () => void,
  endGroup?: () => void,
) {
  visit(ctx.MERGE());
  if (startGroup) {
    startGroup();
  }
  visit(ctx.pattern());
  if (endGroup) {
    endGroup();
  }
  const mergeActions = ctx
    .mergeAction_list()
    .map((action, index) => ({ action, index }));
  mergeActions.sort((a, b) => {
    if (a.action.CREATE() && b.action.MATCH()) {
      return -1;
    } else if (a.action.MATCH() && b.action.CREATE()) {
      return 1;
    }
    return a.index - b.index;
  });
  mergeActions.forEach(({ action }) => {
    visit(action);
  });
}

export function wantsToBeUpperCase(node: TerminalNode): boolean {
  return isKeywordTerminal(node);
}

export function wantsToBeConcatenated(node: TerminalNode): boolean {
  return traillingCharacters.includes(node.symbol.type);
}

function isKeywordTerminal(node: TerminalNode): boolean {
  return lexerKeywords.includes(node.symbol.type) && !isSymbolicName(node);
}

export function isComment(token: Token) {
  return (
    token.type === CypherCmdLexer.MULTI_LINE_COMMENT ||
    token.type === CypherCmdLexer.SINGLE_LINE_COMMENT
  );
}

// Variables or property names that have the same name as a keyword should not be
// treated as keywords
function isSymbolicName(node: TerminalNode): boolean {
  return (
    node.parentCtx instanceof UnescapedSymbolicNameString_Context ||
    node.parentCtx instanceof EscapedSymbolicNameStringContext
  );
}

export function getParseTreeAndTokens(query: string) {
  const inputStream = CharStreams.fromString(query);
  const lexer = new CypherCmdLexer(inputStream);
  const tokens = new CommonTokenStream(lexer);
  const parser = new CypherCmdParser(tokens);
  parser.removeErrorListeners();
  parser.addErrorListener(new FormatterErrorsListener());
  parser.buildParseTrees = true;
  const tree = parser.statementsOrCommands();
  return { tree, tokens };
}

export function findTargetToken(
  tokens: Token[],
  cursorPosition: number,
): Token | false {
  let targetToken: Token;
  for (const token of tokens) {
    if (token.channel === 0) {
      targetToken = token;
    }
    if (cursorPosition >= token.start && cursorPosition <= token.stop) {
      return targetToken;
    }
  }
  return false;
}

export const indentChunk: IndentationChunk = {
  type: 'INDENT',
};

export const dedentChunk: IndentationChunk = {
  type: 'DEDENT',
};

export const groupStartChunk: GroupChunk = {
  type: 'GROUP_START',
};

export const collectionGroupStartChunk: GroupChunk = {
  type: 'GROUP_START',
  extraIndent: 1,
};

export const caseGroupStartChunk: GroupChunk = {
  type: 'GROUP_START',
  extraIndent: 2,
};

export const groupEndChunk: Chunk = {
  type: 'GROUP_END',
};

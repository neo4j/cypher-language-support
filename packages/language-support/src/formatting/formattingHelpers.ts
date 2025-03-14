import {
  CharStreams,
  CommonToken,
  CommonTokenStream,
  ErrorListener as ANTLRErrorListener,
  TerminalNode,
  Token,
} from 'antlr4';
import { default as CypherCmdLexer } from '../generated-parser/CypherCmdLexer';
import CypherCmdParser, {
  EscapedSymbolicNameStringContext,
  UnescapedSymbolicNameString_Context,
} from '../generated-parser/CypherCmdParser';
import { lexerKeywords } from '../lexerSymbols';

export const errorMessage = `
Internal formatting error: An unexpected issue occurred while formatting.
This is likely a bug in the formatter itself. If possible, please report the issue
along with your input on GitHub:
https://github.com/neo4j/cypher-language-support.`.trim();


export class FormatterErrorsListener
  implements ANTLRErrorListener<CommonToken>
{
  syntaxError() { }
  public reportAmbiguity() { }
  public reportAttemptingFullContext() { }
  public reportContextSensitivity() { }
}

/**
 * The maximum column width for the formatter. Not a hard limit as overflow
 * is unavoidable in some cases, but we always prefer a solution that doesn't overflow.
 */
export const MAX_COL = 80;

export enum AlignIndentationOptions {
  Add = 1,
  Remove = -1,
  Maintain = 0,
}

export interface BaseChunk {
  isCursor?: boolean;
  doubleBreak?: true;
  text: string;
  groupsStarting: number;
  groupsEnding: number;
  modifyIndentation: number;
  specialIndentation: number;
  alignIndentation: AlignIndentationOptions;
}

// Regular chunk specific properties
export interface RegularChunk extends BaseChunk {
  type: 'REGULAR' | 'SYNTAX_ERROR';
  node?: TerminalNode;
  noSpace?: boolean;
  noBreak?: boolean;
  mustBreak?: boolean;
}

// Comment chunk specific properties
export interface CommentChunk extends BaseChunk {
  type: 'COMMENT';
  breakBefore: boolean;
}

// Union type for all chunk types
export type Chunk = RegularChunk | CommentChunk;

const traillingCharacters = [
  CypherCmdLexer.SEMICOLON,
  CypherCmdLexer.COMMA,
  CypherCmdLexer.COLON,
  CypherCmdLexer.RPAREN,
  CypherCmdLexer.RBRACKET,
];

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
  let unParseable: string | undefined;
  let unParseableStart: number | undefined;
  if(tree.exception) {
    const errorTokens = tokens.tokens.slice(tree.exception.offendingToken.tokenIndex)
    unParseable = errorTokens.slice(0,-1).map(t => t.text).join('');
    unParseableStart = tree.exception.offendingToken.tokenIndex
    console.log("Whole query")
    console.log(query);
    console.log('\n\n');
    console.log("parseable part");
    console.log(query.slice(0, errorTokens[0].start));
    console.log('\n\n');
    console.log("unparseable part")
    console.log(unParseable);
    console.log('\n\n-----------');
  }
  return { tree, tokens, unParseable, unParseableStart };
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

export function isCommentBreak(chunk: Chunk, nextChunk: Chunk): boolean {
  return (
    chunk.type === 'COMMENT' ||
    (nextChunk?.type === 'COMMENT' && nextChunk?.breakBefore)
  );
}

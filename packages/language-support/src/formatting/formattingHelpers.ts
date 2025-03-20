import { CharStreams, CommonTokenStream, TerminalNode, Token } from 'antlr4';
import { default as CypherCmdLexer } from '../generated-parser/CypherCmdLexer';
import CypherCmdParser, {
  EscapedSymbolicNameStringContext,
  UnescapedSymbolicNameString_Context,
} from '../generated-parser/CypherCmdParser';
import { lexerKeywords } from '../lexerSymbols';

export const INTERNAL_FORMAT_ERROR_MESSAGE = `
Internal formatting error: An unexpected issue occurred while formatting.
This is likely a bug in the formatter itself. If possible, please report the issue
along with your input on GitHub:
https://github.com/neo4j/cypher-language-support.`.trim();

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

export interface ChunkIndentation {
  base: number;
  special: number;
  align: AlignIndentationOptions;
}

export interface BaseChunk {
  isCursor?: boolean;
  doubleBreak?: true;
  text: string;
  groupsStarting: number;
  groupsEnding: number;
  indentation: ChunkIndentation;
}

// Regular chunk specific properties
export interface RegularChunk extends BaseChunk {
  type: 'REGULAR';
  node?: TerminalNode;
  noSpace?: boolean;
  noBreak?: boolean;
  mustBreak?: boolean;
}

export interface SyntaxErrorChunk extends BaseChunk {
  type: 'SYNTAX_ERROR';
}

// Comment chunk specific properties
export interface CommentChunk extends BaseChunk {
  type: 'COMMENT';
  breakBefore: boolean;
}

// Union type for all chunk types
export type Chunk = RegularChunk | CommentChunk | SyntaxErrorChunk;

export const initialIndentation: ChunkIndentation = {
  base: 0,
  special: 0,
  align: AlignIndentationOptions.Maintain,
};

export const emptyChunk: RegularChunk = {
  type: 'REGULAR',
  text: '',
  groupsStarting: 0,
  groupsEnding: 0,
  indentation: { ...initialIndentation },
};

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
  parser.buildParseTrees = true;
  const tree = parser.statementsOrCommands();
  let unParseable: string | undefined;
  let firstUnParseableToken: Token | undefined;
  if (tree.exception) {
    const idx = tree.exception.offendingToken.tokenIndex;
    const errorTokens = tokens.tokens.slice(idx);
    const hiddenBefore = (tokens.getHiddenTokensToLeft(idx) || [])
      .map((t) => t.text)
      .join('');
    unParseable =
      hiddenBefore +
      errorTokens
        .slice(0, -1)
        .map((t) => t.text)
        .join('');
    firstUnParseableToken = tree.exception.offendingToken;
  }
  return { tree, tokens, unParseable, firstUnParseableToken };
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

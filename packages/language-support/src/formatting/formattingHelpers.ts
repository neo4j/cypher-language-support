import { CharStreams, CommonTokenStream, TerminalNode, Token } from 'antlr4';
import { default as CypherCmdLexer } from '../generated-parser/CypherCmdLexer';
import CypherCmdParser, {
  EscapedSymbolicNameStringContext,
  UnescapedSymbolicNameString_Context,
} from '../generated-parser/CypherCmdParser';
import { lexerKeywords } from '../lexerSymbols';
import { Group } from './formattingSolutionSearch';

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

export interface BaseChunk {
  isCursor?: boolean;
  doubleBreak?: true;
  text: string;
  groupsStarting: Group[];
  groupsEnding: Group[];
  indentation: IndentationModifier[];
  // Comment that is attached to a chunk. Not to be confused with a comment
  // that is in the chunklist (one with a newline before it.)
  comment?: string;
}

// Regular chunk specific properties
export interface RegularChunk extends BaseChunk {
  noSpace?: boolean;
  noBreak?: boolean;
  mustBreak?: boolean;
  type: 'REGULAR';
  node?: TerminalNode;
}

export interface SyntaxErrorChunk extends BaseChunk {
  mustBreak?: boolean;
  type: 'SYNTAX_ERROR';
}

// Comment chunk specific properties
export interface CommentChunk extends BaseChunk {
  type: 'COMMENT';
}

// Union type for all chunk types
export type Chunk = RegularChunk | CommentChunk | SyntaxErrorChunk;

export interface IndentationModifier {
  id: number;
  change: 1 | -1;
}

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

// These three are helpers for the fillInGroupSizes method to make it more manageable
export function fillInRegularChunkGroupSizes(
  chunk: RegularChunk,
  activeGroups: Group[],
) {
  const groupsEnding = new Set<number>(chunk.groupsEnding.map((g) => g.id));
  for (const group of activeGroups) {
    if (!chunk.text) {
      throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
    }
    group.size += chunk.text.length;
    // PERF: Right now we include dbgText always, even though it's only used for debugging.
    // It does not seem to have any significant performance downsides, but only doing so
    // when e.g. a flag is set might be a more prudent choice.
    group.dbgText += chunk.text;
    if (!chunk.noSpace && !doesNotWantSpace(chunk, chunk)) {
      group.size++;
      group.dbgText += ' ';
    }
    if (chunk.comment && !groupsEnding.has(group.id)) {
      group.breaksAll = true;
    }
  }
}

export function verifyGroupSizes(chunkList: Chunk[]) {
  for (const chunk of chunkList) {
    for (const group of chunk.groupsStarting) {
      if (group.size !== group.dbgText.length) {
        throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
      }
    }
  }
}

const openingCharacters = [CypherCmdLexer.LPAREN, CypherCmdLexer.LBRACKET];

export function doesNotWantSpace(chunk: Chunk, nextChunk: Chunk): boolean {
  return (
    (nextChunk?.type !== 'COMMENT' &&
      chunk.type === 'REGULAR' &&
      (chunk.noSpace ||
        (chunk.node && openingCharacters.includes(chunk.node.symbol.type)))) ||
    chunk.type === 'SYNTAX_ERROR' ||
    nextChunk?.type === 'SYNTAX_ERROR'
  );
}

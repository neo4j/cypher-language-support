import {
  CharStreams,
  CommonToken,
  CommonTokenStream,
  DefaultErrorStrategy,
  ErrorListener as ANTLRErrorListener,
  Parser,
  RecognitionException,
  TerminalNode,
  Token,
} from 'antlr4';
import { default as CypherCmdLexer } from '../generated-parser/CypherCmdLexer';
import CypherCmdParser, {
  EscapedSymbolicNameStringContext,
  UnescapedSymbolicNameString_Context,
} from '../generated-parser/CypherCmdParser';
import { lexerKeywords } from '../lexerSymbols';

const SYNC_TOKENS = new Set([
  CypherCmdLexer.RETURN
]);

class RestartParseException extends Error {
  public readonly resumeIndex: number;
  constructor(message: string, recognizer: Parser) {
    super(message);
    this.resumeIndex = recognizer.getTokenStream().index;
  }
}

class CypherErrorStrategy extends DefaultErrorStrategy {
  // Override recover to skip tokens until we hit one of our syncTokens.
  public recover(recognizer: CypherCmdParser, e: RecognitionException): void {
    // Skip tokens until we find a token in our syncTokens set.
    while (recognizer.getTokenStream().LA(1) !== Token.EOF) {
      if (SYNC_TOKENS.has(recognizer.getTokenStream().LA(1))) {
        throw new RestartParseException('Restart parse', recognizer);
      }
      recognizer.consume();
    }
  }
}

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
  parser._errHandler = new CypherErrorStrategy();
  parser.buildParseTrees = true;
  //const tree = parser.statementsOrCommands();
  let tree;
  try {
    tree = parser.statementsOrCommands();
  } catch (e) {
    if (e instanceof RestartParseException) {
      // At this point, the error strategy has already advanced the token stream
      // to the sync token. We just need to clear the error state and restart
      // parsing from the top-level rule.
      parser.reset();
      tokens.index = e.resumeIndex;
      tree = parser.statementsOrCommands();
    } else {
      throw e;
    }
  }

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

export function isCommentBreak(chunk: Chunk, nextChunk: Chunk): boolean {
  return (
    chunk.type === 'COMMENT' ||
    (nextChunk?.type === 'COMMENT' && nextChunk?.breakBefore)
  );
}

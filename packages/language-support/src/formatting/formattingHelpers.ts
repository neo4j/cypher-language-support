import { TerminalNode, Token } from 'antlr4';
import { default as CypherCmdLexer } from '../generated-parser/CypherCmdLexer';
import {
  EscapedSymbolicNameStringContext,
  UnescapedSymbolicNameString_Context,
} from '../generated-parser/CypherCmdParser';
import { lexerKeywords, lexerOperators } from '../lexerSymbols';

export function wantsToBeUpperCase(node: TerminalNode): boolean {
  return isKeywordTerminal(node);
}

export function wantsSpaceBefore(node: TerminalNode): boolean {
  return isKeywordTerminal(node) || lexerOperators.includes(node.symbol.type);
}

export function wantsSpaceAfter(node: TerminalNode): boolean {
  return (
    isKeywordTerminal(node) ||
    lexerOperators.includes(node.symbol.type) ||
    node.symbol.type === CypherCmdLexer.COMMA
  );
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

export function findTargetToken(tokens: Token[], cursorPosition: number) {
  let targetToken = tokens[0]
  for (const token of tokens) {
    if (token.channel === 0) {
      targetToken = token;
    }
    if (cursorPosition >= token.start && cursorPosition <= token.stop) {
      break;
    }
  }
  return targetToken
}
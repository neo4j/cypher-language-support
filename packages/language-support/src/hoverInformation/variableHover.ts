import { ParserRuleContext, ParseTree } from 'antlr4ng';
import { ParsingResult } from '../cypherLanguageService.js';
import { VariableContext } from '../generated-parser/CypherCmdParser.js';
import { findCaret } from '../helpers.js';
import { SymbolsInfo, Symbol } from '../types.js';

/* The symbol tables come from the semantic analysis and hold entries that are
   not user-written variables: property accesses (`n.age`, positioned on the
   dot), literals, parameters and anonymous pattern variables (`  UNNAMED0`,
   positioned on the `(` or `-` of its pattern). Those positions are real
   tokens, so a bare reference lookup happily describes a dot or a bracket as a
   variable. We therefore require the positive case: the caret token has to be
   the name token of a `variable` rule. */
function isVariableNameToken(node: ParseTree, tokenStart: number): boolean {
  if (node instanceof VariableContext) {
    return node.symbolicVariableNameString()?.start?.start === tokenStart;
  }

  if (!(node instanceof ParserRuleContext)) {
    // Terminals and error nodes are never a `variable` rule
    return false;
  }

  // Prune subtrees that cannot contain the caret
  if (
    (node.start && node.start.start > tokenStart) ||
    (node.stop && node.stop.stop < tokenStart)
  ) {
    return false;
  }

  return (node.children ?? []).some((child) =>
    isVariableNameToken(child, tokenStart),
  );
}

export function findVariableOnCaret({
  parsingResult,
  caretPosition,
  symbolsInfo,
}: {
  parsingResult: ParsingResult;
  caretPosition: number;
  symbolsInfo: SymbolsInfo;
}): Symbol | undefined {
  const caret = findCaret(parsingResult, caretPosition);
  /* findCaret gives us the last token starting at or before the caret, which
     means blank space (and comments) resolve back to the token before them.
     We only want to describe a variable when the caret is on it */
  if (!caret || caretPosition > caret.token.stop) {
    return undefined;
  }

  if (!isVariableNameToken(caret.statement.ctx, caret.token.start)) {
    return undefined;
  }

  for (const symbolTable of symbolsInfo.symbolTables) {
    for (const symbol of symbolTable) {
      if (symbol.references.includes(caret.token.start)) {
        return symbol;
      }
    }
  }
}

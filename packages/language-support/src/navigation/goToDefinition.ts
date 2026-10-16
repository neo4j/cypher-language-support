import type { ParsingResult } from '../cypherLanguageService.js';
import { findCaret } from '../helpers.js';
import type { SymbolsInfo } from '../types.js';

export function getDefinitionPosition({
  caretPosition,
  parsingResult,
  symbolsInfo,
}: {
  caretPosition: number;
  parsingResult: ParsingResult;
  symbolsInfo: SymbolsInfo;
}): { startOffset: number; endOffset: number } | undefined {
  const caret = findCaret(parsingResult, caretPosition);
  if (caret) {
    const currentSymbolTable = parsingResult.statementsParsing.indexOf(
      caret.statement,
    );
    const matchingVariable = symbolsInfo.symbolTables[currentSymbolTable].find(
      (x) =>
        x.references.some(
          (ref) =>
            caretPosition >= ref &&
            caretPosition <= ref + x.variable.length &&
            // Symbol table gets overlap on variables with properties like "MATCH (n) RETURN n.age" ->
            // variable #1 -> p (the node), variable #2 -> p.age (the property)
            // Symbol table also contains anonymous variables that should be ignored
            // This check makes us ignore both anonymous vars and "property vars"
            ref !== x.definitionPosition,
        ),
    );
    if (matchingVariable) {
      return {
        startOffset: matchingVariable.definitionPosition,
        endOffset:
          matchingVariable.definitionPosition +
          matchingVariable.variable.length,
      };
    }
  }
  return undefined;
}

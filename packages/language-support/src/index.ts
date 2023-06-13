export { autocomplete } from './autocompletion';
export type { DbInfo } from './dbInfo';
export {
  applySyntaxColouring,
  mapCypherToSemanticTokenIndex,
  syntaxColouringLegend,
} from './highlighting/syntaxColouring';
export type { ParsedCypherToken } from './highlighting/syntaxColouringHelpers';
export { validateSyntax } from './highlighting/syntaxValidation';
export { CypherTokenType, lexerSymbols } from './lexerSymbols';
export { signatureHelp } from './signatureHelp';
export { CypherLexer };
import CypherLexer from './generated-parser/CypherLexer';

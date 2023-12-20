export type { ParserRuleContext } from 'antlr4';
export { autocomplete } from './autocompletion/autocompletion';
export type { DbSchema } from './dbSchema';
export { antlrUtils } from './helpers';
export {
  applySyntaxColouring,
  mapCypherToSemanticTokenIndex,
  syntaxColouringLegend,
} from './highlighting/syntaxColouring/syntaxColouring';
export type { ParsedCypherToken } from './highlighting/syntaxColouring/syntaxColouringHelpers';
export {
  doSemanticAnalysis,
  validateSyntax,
} from './highlighting/syntaxValidation/syntaxValidation';
export type { SyntaxDiagnostic } from './highlighting/syntaxValidation/syntaxValidationHelpers';
export { CypherTokenType, lexerSymbols } from './lexerSymbols';
export { parse } from './parserWrapper';
export { signatureHelp } from './signatureHelp';
export { CypherLexer, CypherParser };

import CypherLexer from './generated-parser/CypherLexer';
import CypherParser from './generated-parser/CypherParser';

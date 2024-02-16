export type { ParserRuleContext } from 'antlr4';
export { autocomplete } from './autocompletion/autocompletion';
export type { DbSchema } from './dbSchema';
export { antlrUtils } from './helpers';
export { CypherTokenType, lexerSymbols } from './lexerSymbols';
export {
  parse,
  parserWrapper,
  setConsoleCommandsEnabled,
} from './parserWrapper';
export { signatureHelp } from './signatureHelp';
export {
  applySyntaxColouring,
  mapCypherToSemanticTokenIndex,
  syntaxColouringLegend,
} from './syntaxColouring/syntaxColouring';
export type { ParsedCypherToken } from './syntaxColouring/syntaxColouringHelpers';
export {
  lintCypherQuery,
  validateSemantics,
  validateSyntax,
} from './syntaxValidation/syntaxValidation';
export type { SyntaxDiagnostic } from './syntaxValidation/syntaxValidationHelpers';
export { testData } from './tests/testData';
export { CypherLexer, CypherParser };

import CypherLexer from './generated-parser/CypherCmdLexer';
import CypherParser from './generated-parser/CypherCmdParser';

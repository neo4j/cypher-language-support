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
  lintCypherQuery,
  validateSemantics,
  validateSyntax,
} from './highlighting/syntaxValidation/syntaxValidation';
export type { SyntaxDiagnostic } from './highlighting/syntaxValidation/syntaxValidationHelpers';
export { CypherTokenType, lexerSymbols } from './lexerSymbols';
export { parserWrapper, setConsoleCommandsEnabled } from './parserWrapper';
export { signatureHelp } from './signatureHelp';
export { testData } from './tests/testData';
export { CypherLexer, CypherParser };

import CypherLexer from './generated-parser/CypherCmdLexer';
import CypherParser from './generated-parser/CypherCmdParser';

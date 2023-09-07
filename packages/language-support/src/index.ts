export type { ParserRuleContext } from 'antlr4';
export { autocomplete } from './autocompletion/autocompletion';
export { ParameterType, type DbInfo } from './dbInfo';
export { antlrUtils, parse } from './helpers';
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
export { CypherParser };

import CypherLexer from './generated-parser/CypherLexer';
import CypherParser from './generated-parser/CypherParser';

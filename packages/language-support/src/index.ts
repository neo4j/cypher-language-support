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
export { validateSyntax } from './highlighting/syntaxValidation/syntaxValidation';
export { CypherTokenType, lexerSymbols } from './lexerSymbols';
export { parse } from './parserWrapper';
export { signatureHelp } from './signatureHelp';
export { testData } from './tests/testData';
export { CypherLexer };
export { CypherParser };

import CypherLexer from './generated-parser/CypherLexer';
import CypherParser from './generated-parser/CypherParser';

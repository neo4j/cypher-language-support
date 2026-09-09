export { autocomplete } from './autocompletion/autocompletion.js';
export type { AutocompleteOptions } from './autocompletion/autocompletion.js';
export {
  shouldAutoCompleteYield,
  BacktickVariant,
} from './autocompletion/autocompletionHelpers.js';
export { backtickIfNeeded } from './autocompletion/autocompletionHelpers.js';
export type { DbSchema, ScopedRegistry, Registry } from './dbSchema.js';
export { getDebugTree } from './debugTree.js';
export type { SimpleTree } from './debugTree.js';
export { _internalFeatureFlags, FeatureFlags } from './featureFlags.js';
export {
  formatQuery,
  FormattingOptions,
  FormattingResult,
} from './formatting/formatting.js';
export { resolveCypherVersion } from './helpers.js';
export { CypherTokenType, lexerSymbols } from './lexerSymbols.js';
export {
  parseParameters,
  CypherLanguageService,
  parseStatementsStrs,
} from './cypherLanguageService.js';
export { getStatementAtCaret } from './statementAtCaret.js';
export {
  getSignatureInfo as signatureHelp,
  toSignatureInformation,
} from './signatureHelp.js';
export type { SignatureInfoOptions } from './signatureHelp.js';
export {
  highlightSyntax,
  mapCypherToSemanticTokenIndex,
  syntaxHighlightingLegend,
} from './syntaxHighlighting/syntaxHighlighting.js';
export type { HighlightSyntaxOptions } from './syntaxHighlighting/syntaxHighlighting.js';
export type {
  ParsedCypherToken,
  BracketType,
  TokenPosition,
  BracketInfo,
} from './syntaxHighlighting/syntaxHighlightingHelper.js';
export {
  lintCypherQuery,
  clampUnsafePositions,
  isNotParamError,
} from './syntaxValidation/syntaxValidation.js';
export type {
  SyntaxDiagnostic,
  GenericDiagnostic,
  LintCypherQueryOptions,
} from './syntaxValidation/syntaxValidation.js';
export { testData } from './tests/testData.js';
export { textMateGrammar } from './textMateGrammar.js';
export { allCypherVersions } from './types.js';
export type {
  CompletionItem,
  CypherVersion,
  Neo4jFunction,
  Neo4jProcedure,
  SymbolTable,
  Symbol,
  ArgumentDescription,
  ReturnDescription,
  LabelOrCondition,
  LabelLeaf,
  Condition,
  ProcedureMode,
  CONDITIONS,
  ConditionNode,
  Neo4jStringType,
  SymbolsInfo,
} from './types.js';

import type { DbSchema } from './dbSchema.js';
import { testData as internalTestData } from './tests/unit/testData.js';
import type { Neo4jFunction, Neo4jProcedure } from './types.js';

export { autocomplete } from './autocompletion/autocompletion.js';
export type { AutocompleteOptions } from './autocompletion/autocompletion.js';
export {
  shouldAutoCompleteYield,
  BacktickVariant,
} from './autocompletion/autocompletionHelpers.js';
export { backtickIfNeeded } from './autocompletion/autocompletionHelpers.js';
export type { DbSchema, ScopedRegistry, Registry } from './dbSchema.js';
export type {
  HoverDescription,
  HoverInfo,
  MethodHoverInfo,
} from './hoverInformation/hover.js';
export { renderLabelTree } from './labelTreeRender.js';
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
export { CypherLanguageService } from './cypherLanguageService/cypherLanguageService.js';
export {
  parseParameters,
  parseStatementsStrs,
} from './cypherLanguageService/parserWrapper/parserWrapper.js';
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
export const testData: {
  mockSchema: DbSchema;
  largeQuery: string;
  emptyFunction: Neo4jFunction;
  emptyProcedure: Neo4jProcedure;
} = internalTestData; // Re-export internal test data, to make it a more generic type
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
  SymbolsInfo,
} from './types.js';

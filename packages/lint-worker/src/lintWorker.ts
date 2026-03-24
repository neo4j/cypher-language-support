import type {
  SymbolTable,
  SyntaxDiagnostic,
} from '@neo4j-cypher/language-support';
import {
  DbSchema,
  lintCypherQuery as _lintCypherQuery,
  _internalFeatureFlags,
  CypherLanguageService,
} from '@neo4j-cypher/language-support';
import workerpool from 'workerpool';

const languageService = new CypherLanguageService();

function lintCypherQuery(
  query: string,
  dbSchema,
  featureFlags: { consoleCommands?: boolean } = {},
): { diagnostics: SyntaxDiagnostic[]; symbolTables?: SymbolTable[] } {
  // We allow to override the consoleCommands feature flag
  if (featureFlags.consoleCommands !== undefined) {
    _internalFeatureFlags.consoleCommands = featureFlags.consoleCommands;
  }
  //cast to appease git lint check
  return languageService.lint(query, dbSchema as DbSchema, {
    consoleCommandsEnabled:
      featureFlags?.consoleCommands != undefined
        ? featureFlags.consoleCommands
        : true,
  });
}

workerpool.worker({ lintCypherQuery });

type LinterArgs = Parameters<typeof lintCypherQuery>;

export type LinterTask = workerpool.Promise<ReturnType<typeof lintCypherQuery>>;

export type LintWorker = {
  lintCypherQuery: (...args: LinterArgs) => LinterTask;
};

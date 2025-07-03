import { SymbolTable } from '@neo4j-cypher/language-support';
import {
  DbSchema,
  SyntaxDiagnostic,
  _internalFeatureFlags,
  lintCypherQuery as _lintCypherQuery,
} from 'languageSupport-next.8';
import workerpool from 'workerpool';

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
  const diagnostics = _lintCypherQuery(query, dbSchema as DbSchema);
  return { diagnostics: diagnostics };
}

workerpool.worker({ lintCypherQuery });

type LinterArgs = Parameters<typeof lintCypherQuery>;

export type LinterTask = workerpool.Promise<ReturnType<typeof lintCypherQuery>>;

export type LintWorker = {
  lintCypherQuery: (...args: LinterArgs) => LinterTask;
};

import {
  DbSchema,
  lintCypherQuery as _lintCypherQuery,
  _internalFeatureFlags,
  SyntaxDiagnostic,
} from '@neo4j-cypher/language-support';
import workerpool from 'workerpool';

export const WorkerURL = new URL('./lintWorker', import.meta.url).href;

export function lintCypherQuery(
  query: string,
  dbSchema: DbSchema,
  featureFlags: { consoleCommands?: boolean; cypher25?: boolean } = {},
): SyntaxDiagnostic[] {
  // We allow to override the consoleCommands feature flag
  if (featureFlags.consoleCommands !== undefined) {
    _internalFeatureFlags.consoleCommands = featureFlags.consoleCommands;
  }
  if (featureFlags.cypher25 !== undefined) {
    _internalFeatureFlags.cypher25 = featureFlags.cypher25;
  }
  return _lintCypherQuery(query, dbSchema);
}

workerpool.worker({ lintCypherQuery });

type LinterArgs = Parameters<typeof lintCypherQuery>;

export type LinterTask = workerpool.Promise<ReturnType<typeof lintCypherQuery>>;

export type LintWorker = {
  lintCypherQuery: (...args: LinterArgs) => LinterTask;
};

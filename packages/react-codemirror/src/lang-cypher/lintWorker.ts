import {
  DbSchema,
  lintCypherQuery as _lintCypherQuery,
  _internalFeatureFlags,
} from '@neo4j-cypher/language-support';
import workerpool from 'workerpool';

function lintCypherQuery(
  query: string,
  dbSchema: DbSchema,
  featureFlags: { consoleCommands?: boolean } = {},
) {
  // We allow to override the consoleCommands feature flag
  if (featureFlags.consoleCommands !== undefined) {
    _internalFeatureFlags.consoleCommands = featureFlags.consoleCommands;
  }
  return _lintCypherQuery(query, dbSchema);
}

workerpool.worker({ lintCypherQuery });

type LinterArgs = Parameters<typeof lintCypherQuery>;

export type LinterTask = workerpool.Promise<ReturnType<typeof lintCypherQuery>>;

export type LintWorker = {
  lintCypherQuery: (...args: LinterArgs) => LinterTask;
};

import {
  _internalFeatureFlags,
  SyntaxDiagnostic,
} from '@neo4j-cypher/language-support';
import {
  DbSchema,
  lintCypherQuery as _lintCypherQuery,
} from 'languageSupport-next.8';
import workerpool from 'workerpool';

function lintCypherQuery(
  query: string,
  dbSchema,
  featureFlags: { consoleCommands?: boolean; cypher25?: boolean } = {},
): SyntaxDiagnostic[] {
  // We allow to override the consoleCommands feature flag
  if (featureFlags.consoleCommands !== undefined) {
    _internalFeatureFlags.consoleCommands = featureFlags.consoleCommands;
  }
  if (featureFlags.cypher25 !== undefined) {
    _internalFeatureFlags.cypher25 = featureFlags.cypher25;
  }
  //cast to appease git lint check
  return _lintCypherQuery(query, dbSchema as DbSchema);
}

workerpool.worker({ lintCypherQuery });

type LinterArgs = Parameters<typeof lintCypherQuery>;

export type LinterTask = workerpool.Promise<ReturnType<typeof lintCypherQuery>>;

export type LintWorker = {
  lintCypherQuery: (...args: LinterArgs) => LinterTask;
};

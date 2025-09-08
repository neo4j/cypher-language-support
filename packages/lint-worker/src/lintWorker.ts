import type {
  SymbolTable,
  SyntaxDiagnostic,
} from '@neo4j-cypher/language-support';
import {
  DbSchema,
  lintCypherQuery as _lintCypherQuery,
  _internalFeatureFlags,
} from '@neo4j-cypher/language-support';
import workerpool from 'workerpool';

type simplifiedWorkerThread = {
  worker: { addAbortListener: (listener: () => object) => void };
};

function lintCypherQuery(
  query: string,
  dbSchema,
  featureFlags: { consoleCommands?: boolean } = {},
): { diagnostics: SyntaxDiagnostic[]; symbolTables?: SymbolTable[] } {
  // We allow to override the consoleCommands feature flag

  // on runtime "me" will have a "worker" property when run from the workerpool
  // Having an abortListener, even one that does nothing,
  // allows the worker to be re-used instead of terminating on cancellation
  const me = this as simplifiedWorkerThread;
  me.worker.addAbortListener(async () => {});

  if (featureFlags.consoleCommands !== undefined) {
    _internalFeatureFlags.consoleCommands = featureFlags.consoleCommands;
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

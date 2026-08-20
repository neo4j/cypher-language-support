import type {
  SymbolTable,
  SyntaxDiagnostic,
} from '@neo4j-cypher/language-support';
import {
  DbSchema,
  lintCypherQuery as _lintCypherQuery,
} from '@neo4j-cypher/language-support';
import workerpool from 'workerpool';

function lintCypherQuery(
  query: string,
  dbSchema,
  featureFlags: { consoleCommands?: boolean } = {},
): { diagnostics: SyntaxDiagnostic[]; symbolTables?: SymbolTable[] } {
  //cast to appease git lint check
  return _lintCypherQuery(query, dbSchema as DbSchema, {
    consoleCommandsEnabled: featureFlags?.consoleCommands,
  });
}

workerpool.worker({ lintCypherQuery });

type LinterArgs = Parameters<typeof lintCypherQuery>;

export type LinterTask = workerpool.Promise<ReturnType<typeof lintCypherQuery>>;

export type LintWorker = {
  lintCypherQuery: (...args: LinterArgs) => LinterTask;
};

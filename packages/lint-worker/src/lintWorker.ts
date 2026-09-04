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
  dbSchema: DbSchema,
  featureFlags: { consoleCommands?: boolean } = {},
): { diagnostics: SyntaxDiagnostic[]; symbolTables?: SymbolTable[] } {
  return _lintCypherQuery(query, dbSchema, {
    consoleCommandsEnabled: featureFlags?.consoleCommands,
  });
}

workerpool.worker({ lintCypherQuery });

type LinterArgs = Parameters<typeof lintCypherQuery>;

export type LinterTask = workerpool.Promise<ReturnType<typeof lintCypherQuery>>;

export type LintWorker = {
  lintCypherQuery: (...args: LinterArgs) => LinterTask;
};

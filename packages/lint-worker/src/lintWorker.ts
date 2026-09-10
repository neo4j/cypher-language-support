import type {
  SymbolTable,
  SyntaxDiagnostic,
} from '@neo4j-cypher/language-support';
import {
  DbSchema as DbSchemaV2,
  lintCypherQuery as _lintCypherQuery,
} from '@neo4j-cypher/language-support';
import type { DbSchema as DbSchemaV1 } from 'languageSupport-next.13';
import workerpool from 'workerpool';

function lintCypherQuery(
  query: string,
  dbSchema: DbSchemaV2,
  featureFlags: { consoleCommands?: boolean } = {},
): { diagnostics: SyntaxDiagnostic[]; symbolTables?: SymbolTable[] } {
  return _lintCypherQuery(query, dbSchema, {
    consoleCommandsEnabled: featureFlags?.consoleCommands,
  });
}

workerpool.worker({ lintCypherQuery });

export type LinterTask = workerpool.Promise<ReturnType<typeof lintCypherQuery>>;

// Older downloaded workers accept DbSchemaV1
export type LintWorker = {
  lintCypherQuery: (
    query: string,
    dbSchema: DbSchemaV2 | DbSchemaV1,
    featureFlags?: { consoleCommands?: boolean },
  ) => LinterTask;
};

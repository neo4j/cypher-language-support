import type {
  SymbolTable,
  SyntaxDiagnostic,
} from '@neo4j-cypher/language-support';
import {
  DbSchema,
  lintCypherQuery as _lintCypherQuery,
  getSymbolTables as _getSymbolTables,
} from '@neo4j-cypher/language-support';
import workerpool from 'workerpool';

function lintCypherQuery(
  query: string,
  dbSchema,
  featureFlags: { consoleCommands?: boolean } = {},
): { diagnostics: SyntaxDiagnostic[] } {
  //cast to appease git lint check
  return _lintCypherQuery(query, dbSchema as DbSchema, {
    consoleCommandsEnabled: featureFlags?.consoleCommands,
  });
}

function getSymbolTables(
  query: string,
  dbSchema,
  featureFlags: { consoleCommands?: boolean } = {},
): SymbolTable[] {
  return _getSymbolTables(query, dbSchema as DbSchema, {
    consoleCommandsEnabled: featureFlags?.consoleCommands,
  });
}

workerpool.worker({ lintCypherQuery, getSymbolTables });

type LinterArgs = Parameters<typeof lintCypherQuery>;

type SymbolArgs = Parameters<typeof getSymbolTables>;

export type LinterTask = workerpool.Promise<ReturnType<typeof lintCypherQuery>>;

export type SymbolTask = workerpool.Promise<ReturnType<typeof getSymbolTables>>;

export type LintWorker = {
  lintCypherQuery: (...args: LinterArgs) => LinterTask;
  getSymbolTables: (...args: SymbolArgs) => SymbolTask;
};

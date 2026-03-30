import { DbSchema } from '../../dbSchema.js';
import { _internalFeatureFlags } from '../../featureFlags.js';
import { lintCypherQuery } from '../../syntaxValidation/syntaxValidation.js';

type SyntaxValidationTestArgs = {
  query: string;
  dbSchema?: DbSchema;
};

export function getDiagnosticsForQuery({
  query,
  dbSchema = {},
}: SyntaxValidationTestArgs) {
  return lintCypherQuery(query, dbSchema, {
    consoleCommandsEnabled: _internalFeatureFlags.consoleCommands,
  }).diagnostics;
}

export function getSymbolTablesForQuery({
  query,
  dbSchema = {},
}: SyntaxValidationTestArgs) {
  return lintCypherQuery(query, dbSchema).symbolTables;
}

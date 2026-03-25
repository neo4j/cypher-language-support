import { DbSchema } from '../../dbSchema';
import { _internalFeatureFlags } from '../../featureFlags';
import { lintCypherQuery } from '../../syntaxValidation/syntaxValidation';

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

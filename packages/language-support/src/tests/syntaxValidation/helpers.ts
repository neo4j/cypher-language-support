import { DbSchema } from '../../dbSchema';
import { lintCypherQuery } from '../../syntaxValidation/syntaxValidation';

type SyntaxValidationTestArgs = {
  query: string;
  dbSchema?: DbSchema;
  consoleCommandsEnabled?: boolean;
};

export function getDiagnosticsForQuery({
  query,
  dbSchema = {},
  consoleCommandsEnabled = false,
}: SyntaxValidationTestArgs) {
  return lintCypherQuery(query, dbSchema, {
    consoleCommandsEnabled,
  }).diagnostics;
}

export function getSymbolTablesForQuery({
  query,
  dbSchema = {},
}: SyntaxValidationTestArgs) {
  return lintCypherQuery(query, dbSchema).symbolTables;
}

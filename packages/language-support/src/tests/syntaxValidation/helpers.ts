import { DbSchema } from '../../dbSchema';
import { defaultCypherHelper } from '../../parserWrapper';

type SyntaxValidationTestArgs = {
  query: string;
  dbSchema?: DbSchema;
};

export function getDiagnosticsForQuery({
  query,
  dbSchema = {},
}: SyntaxValidationTestArgs) {
  return defaultCypherHelper.lint(query, dbSchema).diagnostics;
}

export function getSymbolTablesForQuery({
  query,
  dbSchema = {},
}: SyntaxValidationTestArgs) {
  return defaultCypherHelper.lint(query, dbSchema).symbolTables;
}

import { DbSchema } from '../../dbSchema';
import { parserWrapper } from '../../parserWrapper';

type SyntaxValidationTestArgs = {
  query: string;
  dbSchema?: DbSchema;
};

export function getDiagnosticsForQuery({
  query,
  dbSchema = {},
}: SyntaxValidationTestArgs) {
  return parserWrapper.lint(query, dbSchema).diagnostics;
}

export function getSymbolTablesForQuery({
  query,
  dbSchema = {},
}: SyntaxValidationTestArgs) {
  return parserWrapper.lint(query, dbSchema).symbolTables;
}

import { DbSchema } from '../../dbSchema.js';
import { lintCypherQuery } from '../../syntaxValidation/syntaxValidation.js';

type SyntaxValidationTestArgs = {
  query: string;
  dbSchema?: DbSchema;
};

export function getDiagnosticsForQuery({
  query,
  dbSchema = {},
}: SyntaxValidationTestArgs) {
  return lintCypherQuery(query, dbSchema).diagnostics;
}

export function getSymbolTablesForQuery({
  query,
  dbSchema = {},
}: SyntaxValidationTestArgs) {
  return lintCypherQuery(query, dbSchema).symbolTables;
}

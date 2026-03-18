import { DbSchema } from '../../dbSchema';
import { defaultParserWrapper } from '../../parserWrapper';
import { lintCypherQuery } from '../../syntaxValidation/syntaxValidation';

type SyntaxValidationTestArgs = {
  query: string;
  dbSchema?: DbSchema;
};

export function getDiagnosticsForQuery({
  query,
  dbSchema = {},
}: SyntaxValidationTestArgs) {
  return lintCypherQuery(query, dbSchema, defaultParserWrapper).diagnostics;
}

export function getSymbolTablesForQuery({
  query,
  dbSchema = {},
}: SyntaxValidationTestArgs) {
  return lintCypherQuery(query, dbSchema, defaultParserWrapper).symbolTables;
}

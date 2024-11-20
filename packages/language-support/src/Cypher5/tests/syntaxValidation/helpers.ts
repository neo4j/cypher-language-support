import { DbSchema } from '../../../dbSchema';
import { lintCypherQuery } from '../../syntaxValidation/syntaxValidation';

type SyntaxValidationTestArgs = {
  query: string;
  dbSchema?: DbSchema;
};

export function getDiagnosticsForQuery({
  query,
  dbSchema = {},
}: SyntaxValidationTestArgs) {
  return lintCypherQuery(query, dbSchema);
}

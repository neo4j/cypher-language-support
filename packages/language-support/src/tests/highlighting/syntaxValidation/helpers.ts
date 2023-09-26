import { DbSchema } from '../../../dbSchema';
import { validateSyntax } from '../../../highlighting/syntaxValidation';

type SyntaxValidationTestArgs = {
  query: string;
  dbSchema?: DbSchema;
};

export function getDiagnosticsForQuery({
  query,
  dbSchema = {},
}: SyntaxValidationTestArgs) {
  return validateSyntax(query, dbSchema);
}

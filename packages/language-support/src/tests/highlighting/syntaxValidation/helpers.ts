import { Diagnostic } from 'vscode-languageserver-types';
import { DbSchema } from '../../../dbSchema';
import { validateSyntax } from '../../../highlighting/syntaxValidation';

type SyntaxValidationTestArgs = {
  query: string;
  dbSchema?: DbSchema;
  filterPredicate?: (Diagnostic) => boolean;
  expected: Diagnostic[];
};

export function getDiagnosticsForQuery({
  query,
  dbSchema = {},
  expected,
}: SyntaxValidationTestArgs) {
  const diagnostics = validateSyntax(query, dbSchema);

  expect(diagnostics.length).toBe(expected.length);

  expected.forEach((expectedDiagnostic, i) => {
    const diagnostic = diagnostics[i];

    expect(diagnostic.range).toStrictEqual(expectedDiagnostic.range);
    expect(diagnostic.message).toBe(expectedDiagnostic.message);
    expect(diagnostic.severity).toBe(expectedDiagnostic.severity);
  });
}

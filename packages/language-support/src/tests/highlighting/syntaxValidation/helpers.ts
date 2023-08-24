import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver-types';
import { DbInfo } from '../../../dbInfo';
import { validateSyntax } from '../../../highlighting/syntaxValidation';
import { MockDbInfo } from '../../testHelpers';

type InclusionTestArgs = {
  query: string;
  dbInfo?: DbInfo;
  filterPredicate?: (Diagnostic) => boolean;
  expected: Diagnostic[];
};

export function testSyntaxValidation({
  query,
  dbInfo = new MockDbInfo(),
  filterPredicate = (d: Diagnostic) => d.severity === DiagnosticSeverity.Error,
  expected,
}: InclusionTestArgs) {
  const diagnostics = validateSyntax(query, dbInfo).filter(filterPredicate);

  expect(diagnostics.length).toBe(expected.length);

  expected.forEach((expectedDiagnostic, i) => {
    const diagnostic = diagnostics[i];

    expect(diagnostic.range).toStrictEqual(expectedDiagnostic.range);
    expect(diagnostic.message).toBe(expectedDiagnostic.message);
    expect(diagnostic.severity).toBe(expectedDiagnostic.severity);
  });
}

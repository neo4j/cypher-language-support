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

type ExclusionTestArgs = {
  query: string;
  dbInfo?: DbInfo;
  filterPredicate?: (Diagnostic) => boolean;
  excluded: Diagnostic[];
};

export function testSyntaxValidationContains({
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

export function testSyntaxValidationNotContains({
  query,
  dbInfo = new MockDbInfo(),
  filterPredicate = (d: Diagnostic) => d.severity === DiagnosticSeverity.Error,
  excluded,
}: ExclusionTestArgs) {
  const diagnostics = validateSyntax(query, dbInfo).filter(filterPredicate);

  const actual = excluded.map((notExpectedItem) =>
    diagnostics.find(
      (value) =>
        value.message === notExpectedItem.message &&
        value.severity === notExpectedItem.severity &&
        value.range === notExpectedItem.range,
    ),
  );

  expect(actual).toEqual([]);
}

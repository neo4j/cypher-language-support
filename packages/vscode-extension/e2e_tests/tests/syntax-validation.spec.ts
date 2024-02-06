import * as assert from 'assert';
import * as vscode from 'vscode';
import { eventually, getDocumentUri, openDocument } from '../helpers';

type InclusionTestArgs = {
  textFile: string;
  expected: vscode.Diagnostic[];
};

export async function testSyntaxValidation({
  textFile,
  expected,
}: InclusionTestArgs) {
  await eventually(
    () =>
      new Promise((resolve, reject) => {
        const docUri = getDocumentUri(textFile);
        const diagnostics: vscode.Diagnostic[] =
          vscode.languages.getDiagnostics(docUri);

        try {
          // We need to test diagnostics one by one
          // because the ones returned by VSCode contain
          // more information we don't care about in the tests
          assert.equal(diagnostics.length, expected.length);
          diagnostics.forEach((diagnostic, i) => {
            const expectedDiagnostic = expected[i];
            assert.equal(diagnostic.message, expectedDiagnostic.message);
            assert.deepEqual(diagnostic.range, expectedDiagnostic.range);
            assert.equal(diagnostic.severity, expectedDiagnostic.severity);
          });
          resolve();
        } catch (e) {
          reject();
        }
      }),
  );
}

suite('Syntax validation spec', () => {
  test('Correctly validates empty cypher statement', async () => {
    const textFile = 'syntax-validation.cypher';
    const docUri = getDocumentUri(textFile);

    await openDocument(docUri);

    const editor = vscode.window.activeTextEditor;

    await editor.edit((editBuilder) =>
      editBuilder.replace(
        // Select the whole file
        new vscode.Range(
          new vscode.Position(0, 0),
          new vscode.Position(100, 0),
        ),
        'MATCH (n)',
      ),
    );

    // We need to wait here because diagnostics are eventually
    // consistent i.e. they don't show up immediately
    await testSyntaxValidation({
      textFile: 'syntax-validation.cypher',
      expected: [
        new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(0, 0),
            new vscode.Position(0, 9),
          ),
          'Query cannot conclude with MATCH (must be a RETURN clause, an update clause, a unit subquery call, or a procedure call with no YIELD)',
          vscode.DiagnosticSeverity.Error,
        ),
      ],
    });

    await editor.edit((editBuilder) =>
      editBuilder.replace(
        // Select the whole file
        new vscode.Range(
          new vscode.Position(0, 0),
          new vscode.Position(100, 0),
        ),
        '',
      ),
    );

    await testSyntaxValidation({
      textFile: 'syntax-validation.cypher',
      expected: [],
    });
  });
});

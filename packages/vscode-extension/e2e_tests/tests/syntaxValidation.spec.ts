import * as assert from 'assert';
import * as vscode from 'vscode';
import {
  eventually,
  getDocumentUri,
  newUntitledFileWithContent,
  openDocument,
} from '../helpers';

type InclusionTestArgs = {
  textFile: string | undefined;
  expected: vscode.Diagnostic[];
};

export async function testSyntaxValidation({
  textFile,
  expected,
}: InclusionTestArgs) {
  await eventually(
    () =>
      new Promise((resolve, reject) => {
        let diagnostics: vscode.Diagnostic[];
        if (textFile) {
          const docUri = getDocumentUri(textFile);
          diagnostics = vscode.languages.getDiagnostics(docUri);
        } else {
          diagnostics = vscode.languages.getDiagnostics().flatMap((d) => d[1]);
        }
        try {
          // We need to test diagnostics one by one
          // because the ones returned by VSCode contain
          // more information we don't care about in the tests
          assert.equal(
            diagnostics.length,
            expected.length,
            'Different length for the diagnostics',
          );
          diagnostics.forEach((diagnostic, i) => {
            const expectedDiagnostic = expected[i];
            assert.equal(
              diagnostic.message,
              expectedDiagnostic.message,
              'Different message',
            );
            assert.deepEqual(
              diagnostic.range,
              expectedDiagnostic.range,
              `Different Range`,
            );
            assert.equal(
              diagnostic.severity,
              expectedDiagnostic.severity,
              'Different Severity',
            );
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
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
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

  test('Correctly validates a non cypher file when selecting cypher language mode', async () => {
    // We open a file that is not saved on disk
    // and change the language manually to Cypher
    await newUntitledFileWithContent('MATCH (m)');
    const editor = vscode.window.activeTextEditor;
    await vscode.languages.setTextDocumentLanguage(editor.document, 'cypher');

    // We need to wait here because diagnostics are eventually
    // consistent i.e. they don't show up immediately
    await testSyntaxValidation({
      textFile: undefined,
      expected: [
        new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(0, 0),
            new vscode.Position(0, 9),
          ),
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
          vscode.DiagnosticSeverity.Error,
        ),
      ],
    });
  });
});

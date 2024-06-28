import * as assert from 'assert';
import * as vscode from 'vscode';
import { constants } from '../../src/constants';
import {
  eventually,
  getDocumentUri,
  getNeo4jConfiguration,
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
          // We need to filter diagnostics for untitled files
          // because there could be other opened files
          diagnostics = vscode.languages
            .getDiagnostics()
            .filter(([uri]) => uri.scheme === 'untitled')
            .flatMap(([, diagnostics]) => diagnostics);
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

  test('Correctly re-validates cypher when switching databases', async () => {
    const textFile = 'movies-syntax-validation.cypher';
    const docUri = getDocumentUri(textFile);
    const { scheme, host, port, user } = getNeo4jConfiguration();
    const connection = {
      name: 'test',
      key: 'test',
      scheme: scheme,
      host: host,
      port: port,
      user: user,
      database: 'movies',
      connect: true,
    };

    await openDocument(docUri);
    const editor = vscode.window.activeTextEditor;

    // assert that we have missing labels
    await testSyntaxValidation({
      textFile: textFile,
      expected: [
        new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(0, 11),
            new vscode.Position(0, 17),
          ),
          "Label Person is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
          vscode.DiagnosticSeverity.Warning,
        ),
        new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(0, 21),
            new vscode.Position(0, 29),
          ),
          "Relationship type ACTED_IN is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
          vscode.DiagnosticSeverity.Warning,
        ),
        new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(0, 35),
            new vscode.Position(0, 40),
          ),
          "Label Movie is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
          vscode.DiagnosticSeverity.Warning,
        ),
      ],
    });

    // update connection to switch to movies database
    await vscode.commands.executeCommand(
      constants.COMMANDS.SAVE_CONNECTION_COMMAND,
      connection,
      process.env.NEO4J_PASSWORD,
    );

    // make a small doc change to refresh diagnostics
    await editor.edit((editBuilder) => {
      const lastLine = editor.document.lineCount - 1;
      const lastChar = editor.document.lineAt(lastLine).text.length;
      const position = new vscode.Position(lastLine, lastChar);
      editBuilder.insert(position, ' ');
    });

    await vscode.commands.executeCommand('undo');

    // assert that we no longer have missing labels
    await testSyntaxValidation({
      textFile: textFile,
      expected: [],
    });

    // tidy up - reset connection to default database
    await vscode.commands.executeCommand(
      constants.COMMANDS.SAVE_CONNECTION_COMMAND,
      { ...connection, database: process.env.NEO4J_DATABASE || 'neo4j' },
      process.env.NEO4J_PASSWORD,
    );
  });
});

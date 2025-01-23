import * as assert from 'assert';
import * as vscode from 'vscode';
import { CONSTANTS } from '../../../src/constants';
import {
  eventually,
  getDocumentUri,
  getNeo4jConfiguration,
  newUntitledFileWithContent,
  openDocument,
} from '../../helpers';
import {
  connectDefault,
  defaultConnectionKey,
  disconnectDefault,
} from '../../suiteSetup';

type InclusionTestArgs = {
  docUri: vscode.Uri;
  expected: vscode.Diagnostic[];
};

export async function testSyntaxValidation({
  docUri,
  expected,
}: InclusionTestArgs) {
  await eventually(
    () =>
      new Promise((resolve, reject) => {
        const diagnostics: vscode.Diagnostic[] =
          vscode.languages.getDiagnostics(docUri);

        try {
          // We need to test diagnostics one by one
          // because the ones returned by VSCode contain
          // more information we don't care about in the tests
          assert.equal(
            diagnostics.length,
            expected.length,
            `Different length for the diagnostics ${diagnostics.length} vs ${expected.length}`,
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
          reject(e);
        }
      }),
  );
}

suite('Syntax validation spec', () => {
  test('Suggests replacements for deprecated functions/procedures', async () => {
    const textFile = 'deprecated-by.cypher';
    const docUri = getDocumentUri(textFile);

    await openDocument(docUri);

    await testSyntaxValidation({
      docUri,
      expected: [
        new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(0, 5),
            new vscode.Position(0, 22),
          ),
          "Procedure apoc.create.uuids is deprecated. Alternative: Neo4j's randomUUID() function can be used as a replacement, for example: `UNWIND range(0,$count) AS row RETURN row, randomUUID() AS uuid`",
          vscode.DiagnosticSeverity.Warning,
        ),
        new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(1, 7),
            new vscode.Position(1, 23),
          ),
          'Function apoc.create.uuid is deprecated. Alternative: Neo4j randomUUID() function',
          vscode.DiagnosticSeverity.Warning,
        ),
      ],
    });
  });

  test('Relints when database connected / disconnected', async () => {
    const textFile = 'deprecated-by.cypher';
    const docUri = getDocumentUri(textFile);

    await openDocument(docUri);

    const deprecationErrors = [
      new vscode.Diagnostic(
        new vscode.Range(new vscode.Position(0, 5), new vscode.Position(0, 22)),
        "Procedure apoc.create.uuids is deprecated. Alternative: Neo4j's randomUUID() function can be used as a replacement, for example: `UNWIND range(0,$count) AS row RETURN row, randomUUID() AS uuid`",
        vscode.DiagnosticSeverity.Warning,
      ),
      new vscode.Diagnostic(
        new vscode.Range(new vscode.Position(1, 7), new vscode.Position(1, 23)),
        'Function apoc.create.uuid is deprecated. Alternative: Neo4j randomUUID() function',
        vscode.DiagnosticSeverity.Warning,
      ),
    ];
    // We should be connected by default so the errors will be there initially
    await testSyntaxValidation({
      docUri,
      expected: deprecationErrors,
    });
    await disconnectDefault();
    await testSyntaxValidation({
      docUri,
      expected: [],
    });
    await connectDefault();
    await testSyntaxValidation({
      docUri,
      expected: deprecationErrors,
    });
  });

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
      docUri,
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
      docUri,
      expected: [],
    });
  });

  test('Correctly validates a non cypher file when selecting cypher language mode', async () => {
    // We open a file that is not saved on disk
    // and change the language manually to Cypher
    const textDocument = await newUntitledFileWithContent('MATCH (m)');
    const editor = vscode.window.activeTextEditor;
    await vscode.languages.setTextDocumentLanguage(editor.document, 'cypher');

    // We need to wait here because diagnostics are eventually
    // consistent i.e. they don't show up immediately
    await testSyntaxValidation({
      docUri: textDocument.uri,
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
    const { scheme, host, port, user, database, password } =
      getNeo4jConfiguration();
    const connection = {
      key: defaultConnectionKey,
      scheme: scheme,
      host: host,
      port: port,
      user: user,
      database: 'movies',
      state: 'active',
    };

    await openDocument(docUri);
    const editor = vscode.window.activeTextEditor;

    // assert that we have missing labels
    await testSyntaxValidation({
      docUri,
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

    // update Connection to switch to the movies database
    await vscode.commands.executeCommand(
      CONSTANTS.COMMANDS.SAVE_CONNECTION_COMMAND,
      connection,
      password,
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
      docUri,
      expected: [],
    });

    // tidy up - reset Connection to default database
    await vscode.commands.executeCommand(
      CONSTANTS.COMMANDS.SAVE_CONNECTION_COMMAND,
      { ...connection, database: database },
      password,
    );
  });

  test('Errors and warnings are version Cypher version dependant', async () => {
    // We open a file that is not saved on disk
    // and change the language manually to Cypher
    const textDocument = await newUntitledFileWithContent(`
      CYPHER 5 CALL apoc.create.uuids(5);
      CYPHER 25 CALL apoc.create.uuids(5)
    `);
    const editor = vscode.window.activeTextEditor;
    await vscode.languages.setTextDocumentLanguage(editor.document, 'cypher');

    // We need to wait here because diagnostics are eventually
    // consistent i.e. they don't show up immediately
    await testSyntaxValidation({
      docUri: textDocument.uri,
      expected: [
        new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(1, 20),
            new vscode.Position(1, 37),
          ),
          "Procedure apoc.create.uuids is deprecated. Alternative: Neo4j's randomUUID() function can be used as a replacement, for example: `UNWIND range(0,$count) AS row RETURN row, randomUUID() AS uuid`",
          vscode.DiagnosticSeverity.Warning,
        ),
        new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(2, 21),
            new vscode.Position(2, 38),
          ),
          "Procedure apoc.create.uuids is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
          vscode.DiagnosticSeverity.Error,
        ),
      ],
    });
  });
});

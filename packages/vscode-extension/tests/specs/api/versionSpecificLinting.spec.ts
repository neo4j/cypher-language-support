import * as vscode from 'vscode';
import {
  getDocumentUri,
  getExtensionStoragePath,
  openDocument,
} from '../../helpers';
import { connectDefault, disconnectDefault } from '../../suiteSetup';
import { rmSync } from 'fs';
import { testSyntaxValidation } from './syntaxValidation.spec';
import { after, before } from 'mocha';

suite.only('Neo4j version specific linting spec', () => {
  before(async () => {
    process.env.LINTER_SWITCHING_TESTS = 'true';
    // We need to reconnect to neo4j so that the switching
    // linter action takes place, otherwise we would be
    // using the one packaged with the VSCode extension
    await disconnectDefault({ version: 'neo4j 2025' });
    await connectDefault({ version: 'neo4j 2025' });
  });

  after(async () => {
    process.env.LINTER_SWITCHING_TESTS = undefined;
    // We need to reconnect to neo4j so that the switching
    // linter action is disabled and we go back to be using
    // the one packaged with the VSCode extension
    await disconnectDefault({ version: 'neo4j 2025' });
    await connectDefault({ version: 'neo4j 2025' });
  });

  async function testNeo4jSpecificLinting() {
    const textFile = 'subquery-call.cypher';
    const docUri = getDocumentUri(textFile);
    await openDocument(docUri);

    await testSyntaxValidation({
      docUri,
      expected: [
        new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(1, 0),
            new vscode.Position(4, 1),
          ),
          'CALL subquery without a variable scope clause is now deprecated. Use CALL (n) { ... }',
          vscode.DiagnosticSeverity.Warning,
        ),
        new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(5, 7),
            new vscode.Position(5, 9),
          ),
          'Function id is deprecated. Alternative: elementId or an application-generated id',
          vscode.DiagnosticSeverity.Warning,
        ),
        new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(5, 7),
            new vscode.Position(5, 12),
          ),
          "The query used a deprecated function. ('id' has been replaced by 'elementId or an application-generated id')",
          vscode.DiagnosticSeverity.Warning,
        ),
      ],
    });

    await connectDefault({ version: 'neo4j 5' });
    await testSyntaxValidation({
      docUri,
      expected: [
        new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(5, 7),
            new vscode.Position(5, 12),
          ),
          'The query used a deprecated function: `id`.',
          vscode.DiagnosticSeverity.Warning,
        ),
      ],
    });

    await connectDefault({ version: 'neo4j 2025' });
  }

  test('Linting depends on the specific neo4j version and works when having to download new linters', async () => {
    const lintersFolder = getExtensionStoragePath();
    rmSync(lintersFolder, { force: true, recursive: true });
    await testNeo4jSpecificLinting();
  });

  test('Linting depends on the specific neo4j version and works when linters are already present', async () => {
    await testNeo4jSpecificLinting();
  });
});

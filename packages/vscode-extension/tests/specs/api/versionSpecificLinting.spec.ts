import * as vscode from 'vscode';
import {
  getDocumentUri,
  getExtensionStoragePath,
  openDocument,
} from '../../helpers';
import { connectDefault } from '../../suiteSetup';
import { rmSync } from 'fs';
import { testSyntaxValidation } from './syntaxValidation.spec';

suite('Neo4j version specific linting spec', () => {
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
          "The query used a deprecated function. ('id' has been replaced by 'elementId or consider using an application-generated id')",
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

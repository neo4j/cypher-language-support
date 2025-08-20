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

// Note these tests do not work with the VSCode debugger
// Because the VSCode debugger seems to sandbox the editor
// it spins up, so globalStorage is a temp folder, not the
// one getExtensionContext().globalStorageUri returns
suite('Neo4j version specific linting spec', () => {
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
    const textFile = 'cypher-versioned.cypher';
    const docUri = getDocumentUri(textFile);
    await openDocument(docUri);

    await testSyntaxValidation({
      docUri,
      expected: [
        new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(0, 26),
            new vscode.Position(0, 27),
          ),
          'Variable `m` not defined',
          vscode.DiagnosticSeverity.Error,
        ),
      ],
    });

    await connectDefault({ version: 'neo4j 5' });
    await testSyntaxValidation({
      docUri,
      expected: [
        new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(0, 0),
            new vscode.Position(0, 6),
          ),
          'Expected any of ALTER, CALL, CREATE, DEALLOCATE, DELETE, DENY, DETACH, DROP, DRYRUN, ENABLE, EXPLAIN, FINISH, FOREACH, GRANT, INSERT, LOAD, MATCH, MERGE, NODETACH, OPTIONAL, PROFILE, REALLOCATE, REMOVE, RENAME, RETURN, REVOKE, SET, SHOW, START, STOP, TERMINATE, UNWIND, USE, USING or WITH',
          vscode.DiagnosticSeverity.Error,
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

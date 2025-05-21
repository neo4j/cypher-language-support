import { before } from 'mocha';
import * as vscode from 'vscode';
import { createTestDatabase, saveDefaultConnection } from '../../suiteSetup';

before(async () => {
  await saveDefaultConnection();
  await createTestDatabase();
  await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  await vscode.commands.executeCommand('neo4j.clearParameters');
});

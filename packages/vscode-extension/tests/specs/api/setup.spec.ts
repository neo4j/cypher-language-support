import { before } from 'mocha';
import * as vscode from 'vscode';
import {
  createTestDatabase,
  saveDefaultConnection,
  saveOldConnection,
} from '../../suiteSetup';

before(async () => {
  await saveOldConnection();
  await createTestDatabase(true);
  await saveDefaultConnection();
  await createTestDatabase();
  await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  await vscode.commands.executeCommand('neo4j.clearParameters');
});

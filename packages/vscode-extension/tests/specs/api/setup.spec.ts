import { before } from 'mocha';
import * as vscode from 'vscode';
import { createTestDatabase, saveDefaultConnection } from '../../suiteSetup';

before(async () => {
  await saveDefaultConnection({ version: 'neo4j 5' });
  await saveDefaultConnection({ version: 'neo4j 2025' });
  await createTestDatabase({ version: 'neo4j 2025' });
  await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  await vscode.commands.executeCommand('neo4j.clearParameters');
});

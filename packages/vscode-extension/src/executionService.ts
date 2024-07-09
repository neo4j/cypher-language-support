import { window } from 'vscode';
import { getActiveConnection } from './connectionService';
import { getQueryRunner } from './contextService';

export default async function runCypher(): Promise<void> {
  const cypherRunner = getQueryRunner();

  // Get the active text editor
  const editor = window.activeTextEditor;

  if (editor) {
    // Get the active connection
    const activeConnection = getActiveConnection();

    if (!activeConnection) {
      await window.showErrorMessage(
        `You need to be connected to Neo4j to run queries`,
      );

      return;
    }

    const documentText = editor.document.getText();
    await cypherRunner.run(activeConnection, documentText);
  }
}

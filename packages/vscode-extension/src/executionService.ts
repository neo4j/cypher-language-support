import { window } from 'vscode';
import { getActiveConnection } from './connectionService';
import { getQueryRunner } from './contextService';

export default async function runCypher(): Promise<void> {
  const cypherRunner = getQueryRunner();

  // Get the active text editor
  const editor = window.activeTextEditor;

  if (editor) {
    const activeConnection = getActiveConnection();

    if (!activeConnection) {
      await window.showErrorMessage(
        `You need to be connected to Neo4j to run queries`,
      );

      return;
    }

    const documentText = editor.document.getText();
    const documentUri = editor.document.uri;
    await cypherRunner.run(activeConnection, documentUri, documentText);
  }
}

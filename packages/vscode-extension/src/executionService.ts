import { window } from 'vscode';
import { getActiveConnection } from './connectionService';
import CypherRunner from './cypherRunner';

export default async function runCypher(
  cypherRunner: CypherRunner,
): Promise<void> {
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

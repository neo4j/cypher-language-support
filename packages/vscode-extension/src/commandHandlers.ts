import { ConnnectionResult } from '@neo4j-cypher/schema-poller';
import { commands, Selection, TextEditor, window, workspace } from 'vscode';
import {
  Connection,
  deleteConnectionAndUpdateDatabaseConnection,
  getActiveConnection,
  getAllConnections,
  getConnectionByKey,
  getPasswordForConnection,
  saveConnectionAndUpdateDatabaseConnection,
  switchDatabase,
  toggleConnectionAndUpdateDatabaseConnection,
} from './connectionService';
import { CONSTANTS } from './constants';
import { getExtensionContext, getQueryRunner } from './contextService';
import { ConnectionItem } from './treeviews/connectionTreeDataProvider';
import {
  displayConfirmConnectionDeletionPrompt,
  displayMessageForConnectionResult,
  displayMessageForSwitchDatabaseResult,
  displaySaveConnectionAnywayPrompt,
} from './uiUtils';
import { ConnectionPanel } from './webviews/connectionPanel';

/**
 * Handler for SAVE_CONNECTION_COMMAND (neo4j.saveConnection)
 * Saves a connection to the database and updates the database connection.
 * If the database connection fails with a retriable error, the user is prompted to save the connection anyway.
 * Otherwise the result of the connection attempt is displayed.
 * @param connection The Connection to save.
 * @param password The password for the Connection.
 * @returns A promise that resolves with the result of the connection attempt.
 */
export async function saveConnectionAndDisplayConnectionResult(
  connection: Connection,
  password: string,
): Promise<ConnnectionResult> {
  if (!connection) {
    return;
  }

  const result = await saveConnectionAndUpdateDatabaseConnection(
    connection,
    password,
  );

  if (!result.success && result.retriable) {
    const result = await displaySaveConnectionAnywayPrompt();

    if (result === 'Yes') {
      void window.showInformationMessage(CONSTANTS.MESSAGES.CONNECTION_SAVED);
      return await saveConnectionAndUpdateDatabaseConnection(
        { ...connection, state: 'inactive' },
        password,
        true,
      );
    }

    return null;
  }

  displayMessageForConnectionResult(connection, result);
  return result;
}

/**
 * Handler for MANAGE_CONNECTION_COMMAND (neo4j.manageConnection)
 * This can be triggered by the command palette or the Connection tree view.
 * In the latter case, the Connection can be modified.
 * In the former case, a new Connection can be created.
 * We are currently limiting the number of connections to one, so the ConnectionPanel will always show the current connection.
 * @param connectionItem The ConnectionItem to manage.
 * @returns A promise that resolves when the handler has completed.
 */
export async function createOrShowConnectionPanelForConnectionItem(
  connectionItem?: ConnectionItem | null,
): Promise<void> {
  const context = getExtensionContext();
  let connection: Connection;
  let password: string;

  // Artificially limit the number of connections to 1
  // If we are triggering this command from the command palette,
  // we will always try to show the first connection, if it exists
  if (!connectionItem) {
    connection = getAllConnections()[0];
    password = connection ? await getPasswordForConnection(connection.key) : '';
  } else {
    connection = connectionItem ? getConnectionByKey(connectionItem.key) : null;
    password = connection ? await getPasswordForConnection(connection.key) : '';
  }

  ConnectionPanel.createOrShow(context.extensionPath, connection, password);
}

/**
 * Handler for DELETE_CONNECTION_COMMAND (neo4j.deleteConnection)
 * This may only be triggered from the Connection tree view.
 * Deletes a connection from the database and updates the database connection.
 * The user is first prompted to confirm the deletion.
 * @param connectionItem The ConnectionItem to delete.
 * @returns A promise that resolves when the handler has completed.
 */
export async function promptUserToDeleteConnectionAndDisplayConnectionResult(
  connectionItem: ConnectionItem,
): Promise<void> {
  const result = await displayConfirmConnectionDeletionPrompt(connectionItem);

  if (result === 'Yes') {
    await deleteConnectionAndUpdateDatabaseConnection(connectionItem.key);
    void commands.executeCommand(
      CONSTANTS.COMMANDS.REFRESH_CONNECTIONS_COMMAND,
    );
    void window.showInformationMessage(CONSTANTS.MESSAGES.CONNECTION_DELETED);
  }
}

/**
 * Handler for CONNECT_COMMAND and DISCONNECT_COMMAND (neo4j.connect and neo4j.disconnect)
 * This may only be triggered from the Connection tree view.
 * Toggles the connect flag and state of a Connection and updates the database connection.
 * The result of the connection attempt is displayed to the user.
 * @param connectionItem The Connecion to toggle.
 * @returns A promise that resolves when the handler has completed.
 */
export async function toggleConnectionItemsConnectionState(
  connectionItem: ConnectionItem,
): Promise<void> {
  const connectionToToggle = getConnectionByKey(connectionItem.key);
  const { result, connection } =
    await toggleConnectionAndUpdateDatabaseConnection(connectionToToggle);
  displayMessageForConnectionResult(connection, result);
}

/**
 * Handler for SWITCH_DATABASE_COMMAND (neo4j.switchDatabase)
 * This may only be triggered from the Connection tree view.
 * Switches the active database of the active Connection and updates the database connection, reconnecting the connection.
 * @param connectionItem The ConnectionItem of the database to switch to.
 * @returns A promise that resolves when the handler has completed.
 */
export async function switchToDatabase(
  connectionItem: ConnectionItem,
): Promise<void> {
  if (connectionItem.type !== 'database') {
    return;
  }
  const database = connectionItem.key;
  const connection = getActiveConnection();
  const result = await switchDatabase({ ...connection, database });
  displayMessageForSwitchDatabaseResult(database, result);
}

function sortByPosition(a: Selection, b: Selection): number {
  const lineDiff = a.start.line - b.start.line;
  if (lineDiff !== 0) return lineDiff;

  const columnDiff = a.start.character - b.start.character;
  return columnDiff;
}

function getSelectedText(editor: TextEditor): string {
  const selections = editor.selections.filter(
    (selection) => !selection.isEmpty && editor.document.getText(selection),
  );
  const text =
    selections.length === 0
      ? editor.document.getText()
      : selections
          .sort(sortByPosition)
          .map((selection) => {
            return editor.document.getText(selection);
          })
          .join(' ');

  return text;
}

export async function runCypher(): Promise<void> {
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

    const selectedText = getSelectedText(editor);
    const documentUri = editor.document.uri;
    await cypherRunner.run(activeConnection, documentUri, selectedText);
  }
}

export async function cypherFileFromSelection(): Promise<void> {
  const editor = window.activeTextEditor;

  if (editor) {
    const selectedText = getSelectedText(editor);

    // Creates a new Cypher document with the selection
    const textDocument = await workspace.openTextDocument({
      content: selectedText,
      language: 'cypher',
    });
    await window.showTextDocument(textDocument);
  }
}

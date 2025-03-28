import { ConnnectionResult } from '@neo4j-cypher/schema-poller';
import { commands, Selection, TextEditor, window, workspace } from 'vscode';
import {
  Connection,
  deleteConnectionAndUpdateDatabaseConnection,
  getActiveConnection,
  getConnectionByKey,
  getConnections,
  getPasswordForConnection,
  saveConnectionAndUpdateDatabaseConnection,
  switchDatabase,
  toggleConnectionAndUpdateDatabaseConnection,
} from '../connectionService';
import { CONSTANTS } from '../constants';
import { getExtensionContext, getQueryRunner } from '../contextService';
import { ConnectionItem } from '../treeviews/connectionTreeDataProvider';
import {
  displayConfirmConnectionDeletionPrompt,
  displayMessageForConnectionResult,
  displayMessageForSwitchDatabaseResult,
  displaySaveConnectionAnywayPrompt,
} from '../uiUtils';
import { ConnectionPanel } from '../webviews/connectionPanel';

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
  const errorDetail = result?.error?.friendlyMessage;

  if (!result.success) {
    const result = await displaySaveConnectionAnywayPrompt(
      errorDetail ? `${errorDetail}.` : errorDetail,
    );

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
 * Handler for CREATE_CONNECTION_COMMAND (neo4j.createConnection)
 * It shows the connection panel for creating a brand new connection.
 * This can be triggered by the command palette or the Connections item menu.
 */
export function createConnectionPanel(): void {
  const context = getExtensionContext();
  ConnectionPanel.createOrShow(context.extensionPath, undefined, '');
}

/**
 * Handler for EDIT_CONNECTION_COMMAND (neo4j.editConnection)
 * This can be triggered only on the connection tree view.
 * This shows the connection panel for the given connection item.
 * @param connectionItem The ConnectionItem to manage.
 * @returns A promise that resolves when the handler has completed.
 */
export async function showConnectionPanelForConnectionItem(
  connectionItem?: ConnectionItem | undefined,
): Promise<void> {
  const context = getExtensionContext();
  const connection: Connection = connectionItem
    ? getConnectionByKey(connectionItem.key)
    : undefined;
  const password: string = connection
    ? await getPasswordForConnection(connection.key)
    : '';

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
  await switchToDatabaseWithName(database);
}

export async function switchToDatabaseWithName(
  database: string,
): Promise<void> {
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

export async function forceDisconnect(): Promise<void> {
  const activeConnection = getActiveConnection();
  const { result, connection } =
    await toggleConnectionAndUpdateDatabaseConnection(activeConnection);
  displayMessageForConnectionResult(connection, result);
}

export async function forceConnect(i: number): Promise<void> {
  const connections = getConnections();
  const connectionToToggle = Object.values(connections).at(i);
  if (connectionToToggle) {
    const { result, connection } =
      await toggleConnectionAndUpdateDatabaseConnection(connectionToToggle);
    displayMessageForConnectionResult(connection, result);
  }
}

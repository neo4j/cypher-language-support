import {
  ConnnectionResult,
  FRIENDLY_ERROR_MESSAGES,
} from '@neo4j-cypher/schema-poller';
import { commands, ConfigurationChangeEvent, window } from 'vscode';
import {
  Connection,
  deleteConnectionAndUpdateDatabaseConnection,
  getActiveConnection,
  getAllConnections,
  getConnectionByKey,
  getDatabaseConnectionSettings,
  getPasswordForConnection,
  saveConnectionAndUpdateDatabaseConnection,
  toggleConnectionAndUpdateDatabaseConnection,
} from './connectionService';
import { ConnectionItem } from './connectionTreeDataProvider';
import { CONSTANTS } from './constants';
import { getExtensionContext } from './contextService';
import { sendNotificationToLanguageClient } from './languageClientService';
import { displayMessageForConnectionResult } from './uiUtils';
import { ConnectionPanel } from './webviews/connectionPanel';

/**
 * Handler for configuration change events.
 * Updates the language client with new connection settings if the neo4j configuration changes.
 * @param event The configuration change event.
 * @returns A promise that resolves when the handler has completed.
 */
export async function handleNeo4jConfigurationChangedEvent(
  event: ConfigurationChangeEvent,
): Promise<void> {
  if (event.affectsConfiguration('neo4j.trace.server')) {
    const currentConnection = getActiveConnection();
    if (currentConnection) {
      const password = await getPasswordForConnection(currentConnection.key);
      const settings = getDatabaseConnectionSettings(
        currentConnection,
        password,
      );
      await sendNotificationToLanguageClient('connectionUpdated', settings);
    }
  }
}

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
 * Utility function to prompt the user to save a connection that failed with a retriable error.
 * @returns A promise that resolves with the result of the prompt ("Yes" or null).
 */
async function displaySaveConnectionAnywayPrompt(): Promise<string | null> {
  return await window.showWarningMessage<string>(
    'Unable to connect to Neo4j. Would you like to save the Connection anyway?',
    {
      modal: true,
      detail: `${FRIENDLY_ERROR_MESSAGES.ServiceUnavailable}.`,
    },
    'Yes',
  );
}

/**
 * Utility function to prompt the user whether they're sure they want to delete a Connection.
 * @param connectionItem The ConnectionItem to prompt for deletion.
 * @returns A promise that resolves with the result of the prompt ("Yes" or null).
 */
async function displayConfirmConnectionDeletionPrompt(
  connectionItem: ConnectionItem,
): Promise<string | null> {
  return await window.showWarningMessage<string>(
    `Are you sure you want to delete connection ${connectionItem.label}?`,
    { modal: true },
    'Yes',
  );
}

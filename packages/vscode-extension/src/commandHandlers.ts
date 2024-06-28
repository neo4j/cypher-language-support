import { ConnnectionResult } from '@neo4j-cypher/schema-poller';
import { commands, ConfigurationChangeEvent, window } from 'vscode';
import {
  Connection,
  deleteConnectionAndUpdateDatabaseConnection,
  getActiveConnection,
  getAllConnections,
  getConnectionByKey,
  getDatabaseConnectionSettings,
  getPasswordForConnection,
  saveConnection,
  saveConnectionAndUpdateDatabaseConnection,
  toggleConnectionAndUpdateDatabaseConnection,
} from './connectionService';
import { ConnectionItem } from './connectionTreeDataProvider';
import { constants } from './constants';
import {
  getDatabaseConnectionManager,
  getExtensionContext,
  getLanguageClient,
} from './contextService';
import { sendNotificationToLanguageClient } from './languageClientService';
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
      void window.showInformationMessage(constants.MESSAGES.CONNECTION_SAVED);
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
      constants.COMMANDS.REFRESH_CONNECTIONS_COMMAND,
    );
    void window.showInformationMessage(constants.MESSAGES.CONNECTION_DELETED);
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
 * Handler for connectionErrored events emitted from the schema poller, attached in the schema poller connection manager.
 * Updates the connection state to error and displays an error message to the user when a connection fails.
 * @param errorMessage The error message to display.
 * @returns A promise that resolves when the handler has completed.
 */
export async function saveConnectionStateAsErroredAndShowWarningMessage(
  errorMessage: string,
): Promise<void> {
  const connection = getActiveConnection();

  if (!connection) {
    return;
  }

  await saveConnection({ ...connection, state: 'error' });
  void window.showWarningMessage(errorMessage);
}

/**
 * Handler for connectionReconnected events emitted from the schema poller, attached in the schema poller connection manager.
 * Updates the connection state to connected and displays a message to the user when a connection is reestablished.
 * @returns A promise that resolves when the handler has completed.
 */
export async function saveConnectionStateAsConnectedAndShowInfoMessage(): Promise<void> {
  const connection = getActiveConnection();

  if (!connection) {
    return;
  }

  await saveConnection({ ...connection, state: 'active' });
  void window.showInformationMessage(constants.MESSAGES.RECONNECTED_MESSAGE);
}

/**
 * Handler for connectionFailed events emitted from the schema poller, attached in the schema poller connection manager.
 * Updates the connection state to disconnected and displays an error message to the user when a connection permanently fails.
 * This may be if the credentials expire during a session, or the maximum number of retries is exceeded.
 * @param errorMessage The error message to display.
 * @returns A promise that resolves when the handler has completed.
 */
export async function saveConnectionStateAsDisconnectedAndShowErrorMessage(
  errorMessage: string,
): Promise<void> {
  const connection = getActiveConnection();

  if (!connection) {
    return;
  }

  const password = await getPasswordForConnection(connection.key);

  await saveConnectionAndUpdateDatabaseConnection(
    {
      ...connection,
      state: 'inactive',
    },
    password,
  );
  void window.showErrorMessage(errorMessage);
}

/**
 * Handler for extension lifecycle events, which occur on activation and deactivation.
 * This is used to activate or deactivate a database connection when the extension is activated
 * or deactivated and there is an active Connection.
 * @param activating Whether the extension is activating or deactivating.
 * @returns A promise that resolves when the handler has completed.
 */
export async function setConnectionStateForActiveConnectionOnLifecycleChange(
  activating: boolean,
): Promise<void> {
  let connection = getActiveConnection();

  if (!connection) {
    return;
  }

  if (activating) {
    const password = await getPasswordForConnection(connection.key);

    connection = {
      ...connection,
      state: 'activating',
    };

    const result = await saveConnectionAndUpdateDatabaseConnection(
      connection,
      password,
    );

    displayMessageForConnectionResult(connection, result);
  } else {
    const databaseConnectionManager = getDatabaseConnectionManager();
    const languageClient = getLanguageClient();

    databaseConnectionManager.disconnect();
    void languageClient.sendNotification('connectionDisconnected');
  }
}

/**
 * Utility function to manage what type of message type to display to the user based on the result of a connection attempt.
 * @param connection The Connection that was tried.
 * @param result The result of the connection attempt.
 */
function displayMessageForConnectionResult(
  connection: Connection | null,
  result: ConnnectionResult,
): void {
  if (!connection) {
    return;
  }

  if (result.success && connection.state !== 'inactive') {
    void window.showInformationMessage(constants.MESSAGES.CONNECTED_MESSAGE);
  } else if (result.success && connection.state === 'inactive') {
    void window.showInformationMessage(constants.MESSAGES.DISCONNECTED_MESSAGE);
  } else if (!result.success && !result.retriable) {
    void window.showErrorMessage(result.error?.message);
  } else {
    void window.showWarningMessage(result.error?.message);
  }
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
      detail:
        'Alternatively, please check that your scheme, host and port are correct.',
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

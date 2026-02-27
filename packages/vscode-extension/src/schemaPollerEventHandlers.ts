import { ConnectionError } from '@neo4j-cypher/query-tools';
import { window } from 'vscode';
import {
  getActiveConnection,
  getPasswordForConnection,
  saveConnection,
  saveConnectionAndUpdateDatabaseConnection,
} from './connectionService';
import { CONSTANTS } from './constants';

export async function handleConnectionErrored(
  error: ConnectionError,
): Promise<void> {
  await saveConnectionStateAsErroredAndShowWarningMessage(error);
}

export async function handleConnectionReconnected(): Promise<void> {
  await saveConnectionStateAsConnectedAndShowInfoMessage();
}

export async function handleConnectionFailed(
  error: ConnectionError,
): Promise<void> {
  await saveConnectionStateAsDisconnectedAndShowErrorMessage(error);
}

/**
 * Handler for connectionErrored events emitted from the schema poller, attached in the schema poller connection manager.
 * Updates the connection state to error and displays an error message to the user when a connection fails.
 * @param errorMessage The error message to display.
 * @returns A promise that resolves when the handler has completed.
 */
async function saveConnectionStateAsErroredAndShowWarningMessage(
  error: ConnectionError,
): Promise<void> {
  const connection = getActiveConnection();

  if (!connection) {
    return;
  }

  await saveConnection({ ...connection, state: 'error' });
  void window.showWarningMessage(`${error.message}. ${error.friendlyMessage}.`);
}

/**
 * Handler for connectionReconnected events emitted from the schema poller, attached in the schema poller connection manager.
 * Updates the connection state to connected and displays a message to the user when a connection is reestablished.
 * @returns A promise that resolves when the handler has completed.
 */
async function saveConnectionStateAsConnectedAndShowInfoMessage(): Promise<void> {
  const connection = getActiveConnection();

  if (!connection) {
    return;
  }

  await saveConnection({ ...connection, state: 'active' });
  void window.showInformationMessage(CONSTANTS.MESSAGES.RECONNECTED_MESSAGE);
}

/**
 * Handler for connectionFailed events emitted from the schema poller, attached in the schema poller connection manager.
 * Updates the connection state to disconnected and displays an error message to the user when a connection permanently fails.
 * This may be if the credentials expire during a session, or the maximum number of retries is exceeded.
 * @param error The error message to display.
 * @returns A promise that resolves when the handler has completed.
 */
async function saveConnectionStateAsDisconnectedAndShowErrorMessage(
  error: ConnectionError,
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
  void window.showErrorMessage(`${error.message}. ${error.friendlyMessage}.`);
}

import { ConnnectionResult } from '@neo4j-cypher/schema-poller/dist/cjs/src/schemaPoller';
import { commands, ConfigurationChangeEvent, window } from 'vscode';
import {
  Connection,
  deleteConnection,
  getConnection,
  getConnectionSettings,
  getCurrentConnection,
  getPasswordForConnection,
  saveConnection,
  toggleConnection,
  updateConnectionState,
} from './connectionService';
import { ConnectionItem } from './connectionTreeDataProvider';
import { constants } from './constants';
import { getExtensionContext } from './contextService';
import { sendNotificationToLanguageClient } from './languageClientService';
import { ConnectionPanel } from './webviews/connectionPanel';

export async function configurationChangedHandler(
  event: ConfigurationChangeEvent,
): Promise<void> {
  if (event.affectsConfiguration('neo4j.trace.server')) {
    const currentConnection = getCurrentConnection();
    if (currentConnection) {
      const settings = await getConnectionSettings(currentConnection);
      await sendNotificationToLanguageClient('connectionUpdated', settings);
    }
  }
}

export async function saveAndConnectCommandHandler(
  connection: Connection,
  password: string,
): Promise<void> {
  if (!connection) {
    return;
  }

  const result = await saveConnection(connection, password);
  handleConnectionResult(connection, result);
}

export async function manageConnectionCommandHandler(
  connectionItem?: ConnectionItem,
): Promise<void> {
  const context = getExtensionContext();
  const connection = connectionItem ? getConnection(connectionItem.key) : null;
  const password = connection
    ? await getPasswordForConnection(connection.key)
    : '';
  ConnectionPanel.createOrShow(context.extensionPath, connection, password);
}

export async function deleteConnectionCommandHandler(
  connectionItem: ConnectionItem,
): Promise<void> {
  const result = await window.showWarningMessage<string>(
    `Are you sure you want to delete connection ${connectionItem.label}?`,
    { modal: true },
    'Yes',
  );

  if (result === 'Yes') {
    await deleteConnection(connectionItem.key);
    void commands.executeCommand(
      constants.COMMANDS.REFRESH_CONNECTIONS_COMMAND,
    );
    void window.showInformationMessage(
      constants.MESSAGES.CONNECTION_DELETED_SUCCESSFULLY_MESSAGE,
    );
  }
}

export async function toggleConnectionCommandHandler(
  connectionItem: ConnectionItem,
): Promise<void> {
  const connectionToToggle = getConnection(connectionItem.key);
  const { result, connection } = await toggleConnection(connectionToToggle);
  handleConnectionResult(connection, result);
}

export async function onConnectionErroredHandler(
  errorMessage: string,
): Promise<void> {
  const connection = getCurrentConnection();

  if (!connection) {
    return;
  }

  await updateConnectionState({ ...connection, state: 'error' });
  void window.showErrorMessage(errorMessage);
}

export async function onConnectionReconnectedHandler(): Promise<void> {
  const connection = getCurrentConnection();

  if (!connection) {
    return;
  }

  await updateConnectionState({ ...connection, state: 'connected' });
  void window.showInformationMessage(constants.MESSAGES.RECONNECTED_MESSAGE);
}

export function handleConnectionResult(
  connection: Connection,
  result: ConnnectionResult,
): void {
  if (result.success && connection.connect) {
    void window.showInformationMessage(constants.MESSAGES.CONNECTED_MESSAGE);
  } else if (result.success && !connection.connect) {
    void window.showInformationMessage(constants.MESSAGES.DISCONNECTED_MESSAGE);
  } else if (!result.success) {
    void window.showErrorMessage(result.error);
  }
}

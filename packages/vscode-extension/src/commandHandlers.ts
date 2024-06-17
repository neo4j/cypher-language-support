import { commands, ConfigurationChangeEvent, window } from 'vscode';
import {
  Connection,
  deleteConnection,
  getConnection,
  getConnectionSettings,
  getCurrentConnection,
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

export async function saveConnectionCommandHandler(
  connection: Connection,
  password: string,
): Promise<void> {
  await saveConnection(connection, password);
  void commands.executeCommand(constants.COMMANDS.REFRESH_CONNECTIONS_COMMAND);
}

export function manageConnectionCommandHandler(
  connectionItem?: ConnectionItem,
): void {
  const context = getExtensionContext();
  const connection = connectionItem ? getConnection(connectionItem.key) : null;
  ConnectionPanel.createOrShow(context.extensionPath, connection);
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
  connect: boolean,
): Promise<void> {
  await toggleConnection(connectionItem.key, connect);

  if (!connect) {
    void window.showInformationMessage(constants.MESSAGES.DISCONNECTED_MESSAGE);
  }

  void commands.executeCommand(constants.COMMANDS.REFRESH_CONNECTIONS_COMMAND);
}

export async function connectionConnectedHandler(): Promise<void> {
  const connection = getCurrentConnection();

  if (!connection) {
    return;
  }

  await updateConnectionState({ ...connection, state: 'connected' });
  void commands.executeCommand(constants.COMMANDS.REFRESH_CONNECTIONS_COMMAND);
  void window.showInformationMessage(constants.MESSAGES.CONNECTED_MESSAGE);
}

export async function connectionReconnectingHandler(
  error: string,
): Promise<void> {
  const connection = getCurrentConnection();

  if (!connection) {
    return;
  }

  await updateConnectionState({ ...connection, state: 'reconnecting' });
  void commands.executeCommand(constants.COMMANDS.REFRESH_CONNECTIONS_COMMAND);
  void window.showErrorMessage(error);
}

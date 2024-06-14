import { commands, ConfigurationChangeEvent, window } from 'vscode';
import {
  Connection,
  deleteConnection,
  getConnection,
  getCurrentConnection,
  saveConnection,
  toggleConnection,
} from './connectionService';
import { ConnectionItem } from './connectionTreeDataProvider';
import * as constants from './constants';
import { getExtensionContext } from './contextService';
import {
  MethodName,
  sendNotificationToLanguageClient,
} from './languageClientService';
import { ConnectionPanel } from './webviews/connectionPanel';

export async function configurationChangedHandler(
  event: ConfigurationChangeEvent,
): Promise<void> {
  if (event.affectsConfiguration('neo4j.trace.server')) {
    const currentConnection = getCurrentConnection();
    if (currentConnection) {
      await sendNotificationToLanguageClient(
        MethodName.ConnectionUpdated,
        currentConnection,
      );
    }
  }
}

export async function saveConnectionCommandHandler(
  connection: Connection,
  password: string,
): Promise<void> {
  await saveConnection(connection, password);
  void commands.executeCommand(constants.REFRESH_CONNECTIONS_COMMAND);
  void window.showInformationMessage(
    constants.CONNECTION_SAVED_SUCCESSFULLY_MESSAGE,
  );
}

export function manageConnectionCommandHandler(
  connectionItem?: ConnectionItem,
): void {
  const context = getExtensionContext();
  const connection = connectionItem ? getConnection(connectionItem.key) : null;
  ConnectionPanel.createOrShow(context.extensionUri, connection);
}

export async function deleteConnectionCommandHandler(
  connectionItem: ConnectionItem,
): Promise<void> {
  const result = await window.showWarningMessage(
    `Are you sure you want to delete connection ${connectionItem.label}?`,
    { modal: true },
    'Yes',
  );

  if (result === 'Yes') {
    await deleteConnection(connectionItem.key);
    void commands.executeCommand(constants.REFRESH_CONNECTIONS_COMMAND);
    void window.showInformationMessage(
      constants.CONNECTION_DELETED_SUCCESSFULLY_MESSAGE,
    );
  }
}

export async function connectCommandHandler(
  connectionItem: ConnectionItem,
): Promise<void> {
  await toggleConnection(connectionItem.key);
  void window.showInformationMessage(constants.CONNECTED_MESSAGE);
  void commands.executeCommand(constants.REFRESH_CONNECTIONS_COMMAND);
}

export async function disconnectCommandHandler(
  connectionItem: ConnectionItem,
): Promise<void> {
  await toggleConnection(connectionItem.key);
  void window.showInformationMessage(constants.DISCONNECTED_MESSAGE);
  void commands.executeCommand(constants.REFRESH_CONNECTIONS_COMMAND);
}

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
      await sendNotificationToLanguageClient(
        'connectionUpdated',
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
  void commands.executeCommand(constants.COMMANDS.REFRESH_CONNECTIONS_COMMAND);
  void window.showInformationMessage(
    constants.MESSAGES.CONNECTION_SAVED_SUCCESSFULLY_MESSAGE,
  );
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

export async function connectCommandHandler(
  connectionItem: ConnectionItem,
): Promise<void> {
  await toggleConnection(connectionItem.key, true);
  void window.showInformationMessage(constants.MESSAGES.CONNECTED_MESSAGE);
  void commands.executeCommand(constants.COMMANDS.REFRESH_CONNECTIONS_COMMAND);
}

export async function disconnectCommandHandler(
  connectionItem: ConnectionItem,
): Promise<void> {
  await toggleConnection(connectionItem.key, false);
  void window.showInformationMessage(constants.MESSAGES.DISCONNECTED_MESSAGE);
  void commands.executeCommand(constants.COMMANDS.REFRESH_CONNECTIONS_COMMAND);
}

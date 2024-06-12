import { commands, ConfigurationChangeEvent, window } from 'vscode';
import {
  Connection,
  deleteConnection,
  getConnection,
  getCurrentConnection,
  saveConnection,
  testConnection,
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

export async function configurationChangedEventHandler(
  event: ConfigurationChangeEvent,
): Promise<void> {
  if (event.affectsConfiguration('neo4j.trace.server')) {
    const currentConnection = getCurrentConnection();
    await sendNotificationToLanguageClient(
      MethodName.ConnectionDeleted,
      currentConnection,
    );
  }
}

export async function testConnectionCommandHandler(
  connection: Connection,
  password: string,
): Promise<void> {
  if (await testConnection(connection, password)) {
    void window.showInformationMessage(
      constants.TEST_CONNECTION_SUCCESFUL_MESSAGE,
    );
  } else {
    void window.showErrorMessage(constants.CONNECTION_FAILED_MESSAGE);
  }
}

export async function saveConnectionCommandHandler(
  connection: Connection,
  password: string,
  isNew: boolean,
): Promise<void> {
  await saveConnection(connection, password, isNew);
  void commands.executeCommand(constants.REFRESH_CONNECTIONS_COMMAND);
  void window.showInformationMessage(
    isNew
      ? constants.CONNECTION_CREATED_SUCCESSFULLY_MESSAGE
      : constants.CONNECTION_UPDATED_SUCCESSFULLY_MESSAGE,
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

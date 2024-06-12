import { commands, Disposable, Uri, window, workspace } from 'vscode';
import { configurationChangedEventHandler } from './commandHandlers';
import {
  Connection,
  deleteConnection,
  getConnection,
  saveConnection,
  testConnection,
  toggleConnection,
} from './connectionService';
import {
  ConnectionItem,
  ConnectionTreeDataProvider,
} from './connectionTreeDataProvider';
import * as constants from './constants';
import { ConnectionPanel } from './webviews/connectionPanel';

export function registerDisposables(extensionUri: Uri): Disposable[] {
  const disposables = Array<Disposable>();
  const connectionTreeDataProvider = new ConnectionTreeDataProvider();

  disposables.push(
    window.registerTreeDataProvider(
      'neo4jConnections',
      connectionTreeDataProvider,
    ),
    workspace.onDidChangeConfiguration(configurationChangedEventHandler),
    commands.registerCommand(
      constants.TEST_CONNECTION_COMMAND,
      async (connection: Connection, password: string) => {
        if (await testConnection(connection, password)) {
          void window.showInformationMessage(
            constants.TEST_CONNECTION_SUCCESFUL_MESSAGE,
          );
        } else {
          void window.showErrorMessage(constants.CONNECTION_FAILED_MESSAGE);
        }
      },
    ),
    commands.registerCommand(
      constants.SAVE_CONNECTION_COMMAND,
      async (connection: Connection, password: string, isNew: boolean) => {
        await saveConnection(connection, password, isNew);
        void commands.executeCommand(constants.REFRESH_CONNECTIONS_COMMAND);
        void window.showInformationMessage(
          isNew
            ? constants.CONNECTION_CREATED_SUCCESSFULLY_MESSAGE
            : constants.CONNECTION_UPDATED_SUCCESSFULLY_MESSAGE,
        );
      },
    ),
    commands.registerCommand(
      constants.MANAGE_CONNECTION_COMMAND,
      (connectionItem?: ConnectionItem) => {
        const connection = connectionItem
          ? getConnection(connectionItem.key)
          : null;
        ConnectionPanel.createOrShow(extensionUri, connection);
      },
    ),
    commands.registerCommand(
      constants.DELETE_CONNECTION_COMMAND,
      async (connectionItem: ConnectionItem) => {
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
      },
    ),
    commands.registerCommand(
      constants.CONNECT_COMMAND,
      async (connectionItem: ConnectionItem) => {
        await toggleConnection(connectionItem.key);
        void window.showInformationMessage(constants.CONNECTED_MESSAGE);
        void commands.executeCommand(constants.REFRESH_CONNECTIONS_COMMAND);
      },
    ),
    commands.registerCommand(
      constants.DISCONNECT_COMMAND,
      async (connectionItem: ConnectionItem) => {
        await toggleConnection(connectionItem.key);
        void window.showInformationMessage(constants.DISCONNECTED_MESSAGE);
        void commands.executeCommand(constants.REFRESH_CONNECTIONS_COMMAND);
      },
    ),
    commands.registerCommand(constants.REFRESH_CONNECTIONS_COMMAND, () => {
      connectionTreeDataProvider.refresh();
    }),
  );

  return disposables;
}

import {
  commands,
  ConfigurationChangeEvent,
  Disposable,
  Uri,
  window,
  workspace,
} from 'vscode';
import {
  Connection,
  deleteConnection,
  getConnection,
  getCurrentConnection,
  saveConnection,
  toggleConnection,
} from './connection';
import {
  ConnectionItem,
  ConnectionTreeDataProvider,
} from './connectionTreeDataProvider';
import * as constants from './constants';
import {
  MethodName,
  sendNotificationToLanguageClient,
} from './languageClientService';
import { ConnectionPanel } from './webviews/connectionPanel';

export function registerDisposables(extensionUri: Uri): Disposable[] {
  const disposables = Array<Disposable>();
  const connectionTreeDataProvider = new ConnectionTreeDataProvider();

  disposables.push(
    window.registerTreeDataProvider(
      'neo4jConnections',
      connectionTreeDataProvider,
    ),
    // commands.registerCommand(
    //   constants.TEST_CONNECTION_COMMAND,
    //   async (connection: Connection, password: string) => {
    //     if (await testConnection(connection, password)) {
    //       void window.showInformationMessage(
    //         constants.TEST_CONNECTION_SUCCESFUL_MESSAGE,
    //       );
    //     } else {
    //       void window.showErrorMessage(constants.CONNECTION_FAILED_MESSAGE);
    //     }
    //   },
    // ),
    commands.registerCommand(
      constants.SAVE_CONNECTION_COMMAND,
      async (
        connection: Connection,
        password: string,
        isNew: boolean,
      ): Promise<boolean> => {
        await saveConnection(connection, password, isNew);
        connectionTreeDataProvider.refresh();
        void window.showInformationMessage(
          isNew
            ? constants.CONNECTION_CREATED_SUCCESSFULLY_MESSAGE
            : constants.CONNECTION_UPDATED_SUCCESSFULLY_MESSAGE,
        );
        return true;
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
      async (connection: ConnectionItem) => {
        const result = await window.showWarningMessage(
          `Are you sure you want to delete connection ${connection.label}?`,
          { modal: true },
          'Yes',
        );

        if (result === 'Yes') {
          await deleteConnection(connection.key);
          connectionTreeDataProvider.refresh();
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
        connectionTreeDataProvider.refresh();
      },
    ),
    commands.registerCommand(
      constants.DISCONNECT_COMMAND,
      async (connection: ConnectionItem) => {
        await toggleConnection(connection.key);
        void window.showInformationMessage(constants.DISCONNECTED_MESSAGE);
        connectionTreeDataProvider.refresh();
      },
    ),
    commands.registerCommand(constants.REFRESH_CONNECTIONS_COMMAND, () => {
      connectionTreeDataProvider.refresh();
    }),
    workspace.onDidChangeConfiguration(
      async (event: ConfigurationChangeEvent) => {
        if (event.affectsConfiguration('neo4j.trace.server')) {
          const currentConnection = getCurrentConnection();
          await sendNotificationToLanguageClient(
            MethodName.ConnectionDeleted,
            currentConnection,
          );
        }
      },
    ),
  );

  return disposables;
}

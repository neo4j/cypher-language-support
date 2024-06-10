import {
  commands,
  ConfigurationChangeEvent,
  Disposable,
  Uri,
  window,
  workspace,
} from 'vscode';
import { LangugageClientManager } from './managers/languageClientManager';
import {
  ConnectionItem,
  ConnectionTreeDataProvider,
} from './providers/connectionTreeDataProvider';
import { ConnectionRepository } from './repositories/connectionRepository';
import {
  deleteConnection,
  saveConnection,
  testConnection,
  toggleConnection,
} from './services/connectionService';
import { Connection } from './types/connection';
import { MethodName } from './types/methodName';
import {
  CONNECTION_CREATED_SUCCESSFULLY_MESSAGE,
  CONNECTION_FAILED_MESSAGE,
  CONNECTION_UPDATED_SUCCESSFULLY_MESSAGE,
  CONNECT_COMMAND,
  DELETE_CONNECTION_COMMAND,
  DISCONNECT_COMMAND,
  MANAGE_CONNECTION_COMMAND,
  REFRESH_CONNECTIONS_COMMAND,
  SAVE_CONNECTION_COMMAND,
  TEST_CONNECTION_COMMAND,
  TEST_CONNECTION_SUCCESFUL_MESSAGE,
} from './util/constants';
import { ConnectionPanel } from './webviews/connectionPanel';

export function registerCommands(extensionUri: Uri): Disposable[] {
  const disposables = Array<Disposable>();
  const connectionTreeDataProvider = new ConnectionTreeDataProvider();

  disposables.push(
    window.registerTreeDataProvider(
      'neo4jConnections',
      connectionTreeDataProvider,
    ),
    commands.registerCommand(
      TEST_CONNECTION_COMMAND,
      async (connection: Connection, password: string) => {
        if (await testConnection(connection, password)) {
          void window.showInformationMessage(TEST_CONNECTION_SUCCESFUL_MESSAGE);
        } else {
          void window.showErrorMessage(CONNECTION_FAILED_MESSAGE);
        }
      },
    ),
    commands.registerCommand(
      SAVE_CONNECTION_COMMAND,
      async (
        connection: Connection,
        password: string,
        isNew: boolean,
      ): Promise<boolean> => {
        const result = await saveConnection(connection, password);

        if (result) {
          connectionTreeDataProvider.refresh();
          void window.showInformationMessage(
            isNew
              ? CONNECTION_CREATED_SUCCESSFULLY_MESSAGE
              : CONNECTION_UPDATED_SUCCESSFULLY_MESSAGE,
          );
        } else {
          void window.showErrorMessage(CONNECTION_FAILED_MESSAGE);
        }

        return result;
      },
    ),
    commands.registerCommand(MANAGE_CONNECTION_COMMAND, () => {
      ConnectionPanel.createOrShow(extensionUri);
    }),
    commands.registerCommand(
      DELETE_CONNECTION_COMMAND,
      async (connection: ConnectionItem) => {
        const result = await window.showWarningMessage(
          `Are you sure you want to delete connection ${connection.label}?`,
          { modal: true },
          'Yes',
        );

        if (result === 'Yes') {
          await deleteConnection(connection.key);
          connectionTreeDataProvider.refresh();
          void window.showInformationMessage('Connection deleted');
        }
      },
    ),
    commands.registerCommand(
      CONNECT_COMMAND,
      async (connection: ConnectionItem) => {
        if (await toggleConnection(connection.key, true)) {
          connectionTreeDataProvider.refresh();
        } else {
          void window.showErrorMessage(CONNECTION_FAILED_MESSAGE);
        }
      },
    ),
    commands.registerCommand(
      DISCONNECT_COMMAND,
      async (connection: ConnectionItem) => {
        if (await toggleConnection(connection.key, false)) {
          connectionTreeDataProvider.refresh();
        } else {
          void window.showErrorMessage(CONNECTION_FAILED_MESSAGE);
        }
      },
    ),
    commands.registerCommand(REFRESH_CONNECTIONS_COMMAND, () => {
      connectionTreeDataProvider.refresh();
    }),
    workspace.onDidChangeConfiguration(
      async (event: ConfigurationChangeEvent) => {
        if (event.affectsConfiguration('neo4j.trace.server')) {
          const currentConnection =
            ConnectionRepository.instance.getCurrentConnection();
          await LangugageClientManager.instance.sendNotification(
            MethodName.ConnectionDeleted,
            currentConnection,
          );
        }
      },
    ),
  );

  return disposables;
}

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
  addOrUpdateConnection,
  deleteConnection,
  toggleConnection,
} from './services/connectionService';
import { Connection } from './types/connection';
import { MethodName } from './types/methodName';
import {
  CONNECTION_FAILED_MESSAGE,
  CONNECT_COMMAND,
  CREATE_CONNECTION_COMMAND,
  DELETE_CONNECTION_COMMAND,
  DISCONNECT_COMMAND,
  MANAGE_CONNECTION_COMMAND,
  REFRESH_CONNECTIONS_COMMAND,
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
      CREATE_CONNECTION_COMMAND,
      async (connection: Connection, password: string) => {
        await addOrUpdateConnection(connection, password);
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

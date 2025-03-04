import { commands, Disposable, window } from 'vscode';
import {
  createConnectionPanel,
  cypherFileFromSelection,
  promptUserToDeleteConnectionAndDisplayConnectionResult,
  runCypher,
  saveConnectionAndDisplayConnectionResult,
  showConnectionPanelForConnectionItem,
  switchToDatabase,
  toggleConnectionItemsConnectionState,
} from './commandHandlers';
import { setParameter } from './commandHandlersParams';
import { CONSTANTS } from './constants';
import {
  ConnectionItem,
  connectionTreeDataProvider,
} from './treeviews/connectionTreeDataProvider';
import { connectionTreeDecorationProvider } from './treeviews/connectionTreeDecorationProvider';
import { databaseInformationTreeDataProvider } from './treeviews/databaseInformationTreeDataProvider';
import { parametersTreeProvider } from './treeviews/parametersTreeProvider';

/**
 * Any disposable resources that need to be cleaned up when the extension is deactivated should be registered here.
 * @returns An array of disposables.
 */
export function registerDisposables(): Disposable[] {
  const disposables = Array<Disposable>();

  disposables.push(
    window.registerTreeDataProvider(
      'neo4jConnections',
      connectionTreeDataProvider,
    ),
    window.registerTreeDataProvider(
      'neo4jDatabaseInformation',
      databaseInformationTreeDataProvider,
    ),
    window.registerTreeDataProvider('neo4jParameters', parametersTreeProvider),
    window.registerFileDecorationProvider(connectionTreeDecorationProvider),
    commands.registerCommand(
      CONSTANTS.COMMANDS.SAVE_CONNECTION_COMMAND,
      saveConnectionAndDisplayConnectionResult,
    ),
    commands.registerCommand(
      CONSTANTS.COMMANDS.EDIT_CONNECTION_COMMAND,
      showConnectionPanelForConnectionItem,
    ),
    commands.registerCommand(
      CONSTANTS.COMMANDS.CREATE_CONNECTION_COMMAND,
      createConnectionPanel,
    ),
    commands.registerCommand(
      CONSTANTS.COMMANDS.DELETE_CONNECTION_COMMAND,
      promptUserToDeleteConnectionAndDisplayConnectionResult,
    ),
    commands.registerCommand(
      CONSTANTS.COMMANDS.CONNECT_COMMAND,
      (connectionItem: ConnectionItem) =>
        toggleConnectionItemsConnectionState(connectionItem),
    ),
    commands.registerCommand(
      CONSTANTS.COMMANDS.DISCONNECT_COMMAND,
      (connectionItem: ConnectionItem) =>
        toggleConnectionItemsConnectionState(connectionItem),
    ),
    commands.registerCommand(
      CONSTANTS.COMMANDS.REFRESH_CONNECTIONS_COMMAND,
      () => {
        connectionTreeDataProvider.refresh();
        databaseInformationTreeDataProvider.refresh();
      },
    ),
    commands.registerCommand(CONSTANTS.COMMANDS.RUN_CYPHER, runCypher),
    commands.registerCommand(
      CONSTANTS.COMMANDS.SWITCH_DATABASE_COMMAND,
      (connectionItem: ConnectionItem) => switchToDatabase(connectionItem),
    ),
    commands.registerCommand(
      CONSTANTS.COMMANDS.CYPHER_FILE_FROM_SELECTION,
      cypherFileFromSelection,
    ),
    commands.registerCommand(CONSTANTS.COMMANDS.SET_PARAMETER, setParameter),
  );

  return disposables;
}

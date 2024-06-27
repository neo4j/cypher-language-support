import { commands, Disposable, window, workspace } from 'vscode';
import {
  createOrShowConnectionPanelForConnectionItem,
  handleNeo4jConfigurationChangedEvent,
  promptUserToDeleteConnectionAndDisplayConnectionResult,
  saveConnectionAndDisplayConnectionResult,
  toggleConnectionItemsConnectionState,
} from './commandHandlers';
import {
  ConnectionItem,
  ConnectionTreeDataProvider,
} from './connectionTreeDataProvider';
import { constants } from './constants';

/**
 * Any disposable resources that need to be cleaned up when the extension is deactivated should be registered here.
 * @returns An array of disposables.
 */
export function registerDisposables(): Disposable[] {
  const disposables = Array<Disposable>();
  const connectionTreeDataProvider = new ConnectionTreeDataProvider();

  disposables.push(
    window.registerTreeDataProvider(
      'neo4jConnections',
      connectionTreeDataProvider,
    ),
    workspace.onDidChangeConfiguration(handleNeo4jConfigurationChangedEvent),
    commands.registerCommand(
      constants.COMMANDS.SAVE_CONNECTION_COMMAND,
      saveConnectionAndDisplayConnectionResult,
    ),
    commands.registerCommand(
      constants.COMMANDS.MANAGE_CONNECTION_COMMAND,
      createOrShowConnectionPanelForConnectionItem,
    ),
    commands.registerCommand(
      constants.COMMANDS.DELETE_CONNECTION_COMMAND,
      promptUserToDeleteConnectionAndDisplayConnectionResult,
    ),
    commands.registerCommand(
      constants.COMMANDS.CONNECT_COMMAND,
      (connectionItem: ConnectionItem) =>
        toggleConnectionItemsConnectionState(connectionItem),
    ),
    commands.registerCommand(
      constants.COMMANDS.DISCONNECT_COMMAND,
      (connectionItem: ConnectionItem) =>
        toggleConnectionItemsConnectionState(connectionItem),
    ),
    commands.registerCommand(
      constants.COMMANDS.REFRESH_CONNECTIONS_COMMAND,
      () => {
        connectionTreeDataProvider.refresh();
      },
    ),
  );

  return disposables;
}

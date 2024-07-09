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
import { CONSTANTS } from './constants';
import runCypher from './executionService';

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
      CONSTANTS.COMMANDS.SAVE_CONNECTION_COMMAND,
      saveConnectionAndDisplayConnectionResult,
    ),
    commands.registerCommand(
      CONSTANTS.COMMANDS.MANAGE_CONNECTION_COMMAND,
      createOrShowConnectionPanelForConnectionItem,
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
      },
    ),
    commands.registerCommand(CONSTANTS.COMMANDS.RUN_QUERY, runCypher),
  );

  return disposables;
}

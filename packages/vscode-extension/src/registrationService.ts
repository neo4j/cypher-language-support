import { commands, Disposable, window, workspace } from 'vscode';
import {
  configurationChangedHandler,
  deleteConnectionCommandHandler,
  manageConnectionCommandHandler,
  saveAndConnectCommandHandler,
  toggleConnectionCommandHandler,
} from './commandHandlers';
import {
  ConnectionItem,
  ConnectionTreeDataProvider,
} from './connectionTreeDataProvider';
import { constants } from './constants';

export function registerDisposables(): Disposable[] {
  const disposables = Array<Disposable>();
  const connectionTreeDataProvider = new ConnectionTreeDataProvider();

  disposables.push(
    window.registerTreeDataProvider(
      'neo4jConnections',
      connectionTreeDataProvider,
    ),
    workspace.onDidChangeConfiguration(configurationChangedHandler),
    commands.registerCommand(
      constants.COMMANDS.SAVE_CONNECTION_COMMAND,
      saveAndConnectCommandHandler,
    ),
    commands.registerCommand(
      constants.COMMANDS.MANAGE_CONNECTION_COMMAND,
      manageConnectionCommandHandler,
    ),
    commands.registerCommand(
      constants.COMMANDS.DELETE_CONNECTION_COMMAND,
      deleteConnectionCommandHandler,
    ),
    commands.registerCommand(
      constants.COMMANDS.CONNECT_COMMAND,
      (connectionItem: ConnectionItem) =>
        toggleConnectionCommandHandler(connectionItem),
    ),
    commands.registerCommand(
      constants.COMMANDS.DISCONNECT_COMMAND,
      (connectionItem: ConnectionItem) =>
        toggleConnectionCommandHandler(connectionItem),
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

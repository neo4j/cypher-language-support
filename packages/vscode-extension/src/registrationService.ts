import { commands, Disposable, window, workspace } from 'vscode';
import {
  configurationChangedHandler,
  connectCommandHandler,
  deleteConnectionCommandHandler,
  disconnectCommandHandler,
  manageConnectionCommandHandler,
  saveConnectionCommandHandler,
} from './commandHandlers';
import { ConnectionTreeDataProvider } from './connectionTreeDataProvider';
import * as constants from './constants';

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
      constants.SAVE_CONNECTION_COMMAND,
      saveConnectionCommandHandler,
    ),
    commands.registerCommand(
      constants.MANAGE_CONNECTION_COMMAND,
      manageConnectionCommandHandler,
    ),
    commands.registerCommand(
      constants.DELETE_CONNECTION_COMMAND,
      deleteConnectionCommandHandler,
    ),
    commands.registerCommand(constants.CONNECT_COMMAND, connectCommandHandler),
    commands.registerCommand(
      constants.DISCONNECT_COMMAND,
      disconnectCommandHandler,
    ),
    commands.registerCommand(constants.REFRESH_CONNECTIONS_COMMAND, () => {
      connectionTreeDataProvider.refresh();
    }),
  );

  return disposables;
}

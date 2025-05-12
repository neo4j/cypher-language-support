import { commands, Disposable, ExtensionContext, window } from 'vscode';
import {
  createConnectionPanel,
  cypherFileFromSelection,
  forceConnect,
  forceDisconnect,
  promptUserToDeleteConnectionAndDisplayConnectionResult,
  runCypher,
  saveConnectionAndDisplayConnectionResult,
  showConnectionPanelForConnectionItem,
  switchToDatabase,
  switchToDatabaseWithName,
  toggleConnectionItemsConnectionState,
} from './commandHandlers/connection';
import {
  addParameter,
  clearAllParameters,
  editParameter,
  evaluateParam,
  removeParameter,
  removeParameterByKey,
} from './commandHandlers/params';
import { CONSTANTS } from './constants';
import {
  ConnectionItem,
  connectionTreeDataProvider,
} from './treeviews/connectionTreeDataProvider';
import { connectionTreeDecorationProvider } from './treeviews/connectionTreeDecorationProvider';
import { databaseInformationTreeDataProvider } from './treeviews/databaseInformationTreeDataProvider';
import { parametersTreeDataProvider } from './treeviews/parametersTreeDataProvider';
import { Neo4jQueryDetailsProvider } from './webviews/queryResults/queryDetails';
import { Neo4jQueryVisualizationProvider } from './webviews/queryResults/queryVisualization';

/**
 * Any disposable resources that need to be cleaned up when the extension is deactivated should be registered here.
 * @returns An array of disposables.
 */
export function registerDisposables(context: ExtensionContext): Disposable[] {
  const disposables = Array<Disposable>();

  disposables.push(
    window.registerWebviewViewProvider(
      'neo4jQueryDetails',
      new Neo4jQueryDetailsProvider(context),
    ),
    window.registerWebviewViewProvider(
      'neo4jQueryVisualization',
      new Neo4jQueryVisualizationProvider(context),
    ),
    window.registerTreeDataProvider(
      'neo4jConnections',
      connectionTreeDataProvider,
    ),
    window.registerTreeDataProvider(
      'neo4jDatabaseInformation',
      databaseInformationTreeDataProvider,
    ),
    window.registerTreeDataProvider(
      'neo4jParameters',
      parametersTreeDataProvider,
    ),
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
      CONSTANTS.COMMANDS.INTERNAL.SWITCH_DATABASE,
      switchToDatabaseWithName,
    ),
    commands.registerCommand(
      CONSTANTS.COMMANDS.CYPHER_FILE_FROM_SELECTION,
      cypherFileFromSelection,
    ),
    commands.registerCommand(CONSTANTS.COMMANDS.ADD_PARAMETER, addParameter),
    commands.registerCommand(
      CONSTANTS.COMMANDS.DELETE_PARAMETER,
      removeParameter,
    ),
    commands.registerCommand(CONSTANTS.COMMANDS.EDIT_PARAMETER, editParameter),
    commands.registerCommand(
      CONSTANTS.COMMANDS.CLEAR_PARAMETERS,
      clearAllParameters,
    ),
    commands.registerCommand(
      CONSTANTS.COMMANDS.INTERNAL.EVAL_PARAMETER,
      evaluateParam,
    ),
    commands.registerCommand(
      CONSTANTS.COMMANDS.INTERNAL.FORCE_DELETE_PARAMETER,
      removeParameterByKey,
    ),
    commands.registerCommand(
      CONSTANTS.COMMANDS.INTERNAL.FORCE_DISCONNECT,
      forceDisconnect,
    ),
    commands.registerCommand(
      CONSTANTS.COMMANDS.INTERNAL.FORCE_CONNECT,
      forceConnect,
    ),
  );

  return disposables;
}

import { ConnnectionResult } from '@neo4j-cypher/query-tools';
import { commands, Selection, TextEditor, window, workspace } from 'vscode';
import {
  Connection,
  deleteConnectionAndUpdateDatabaseConnection,
  downloadLintWorker,
  getActiveConnection,
  getConnectionByKey,
  getConnections,
  getFilesInExtensionStorage,
  getPasswordForConnection,
  saveConnectionAndUpdateDatabaseConnection,
  switchDatabase,
  switchWorkerOnLanguageServer,
  toggleConnectionAndUpdateDatabaseConnection,
} from '../connectionService';
import { CONSTANTS } from '../constants';
import { getExtensionContext, getQueryRunner } from '../contextService';
import { ConnectionItem } from '../treeviews/connectionTreeDataProvider';
import {
  displayConfirmConnectionDeletionPrompt,
  displayMessageForConnectionResult,
  displayMessageForSwitchDatabaseResult,
  displaySaveConnectionAnywayPrompt,
} from '../uiUtils';
import { ConnectionPanel } from '../webviews/connectionPanel';
import axios from 'axios';
import { linterFileToVersion } from '@neo4j-cypher/lint-worker';

/**
 * Handler for SAVE_CONNECTION_COMMAND (neo4j.saveConnection)
 * Saves a connection to the database and updates the database connection.
 * If the database connection fails with a retriable error, the user is prompted to save the connection anyway.
 * Otherwise the result of the connection attempt is displayed.
 * @param connection The Connection to save.
 * @param password The password for the Connection.
 * @returns A promise that resolves with the result of the connection attempt.
 */
export async function saveConnectionAndDisplayConnectionResult(
  connection: Connection,
  password: string,
): Promise<ConnnectionResult> {
  if (!connection) {
    return;
  }

  const result = await saveConnectionAndUpdateDatabaseConnection(
    connection,
    password,
  );
  const errorDetail = result?.error?.friendlyMessage;

  if (!result.success) {
    const result = await displaySaveConnectionAnywayPrompt(
      errorDetail ? `${errorDetail}.` : errorDetail,
    );

    if (result === 'Yes') {
      void window.showInformationMessage(CONSTANTS.MESSAGES.CONNECTION_SAVED);
      return await saveConnectionAndUpdateDatabaseConnection(
        { ...connection, state: 'inactive' },
        password,
        true,
      );
    }

    return null;
  }

  displayMessageForConnectionResult(connection, result);
  return result;
}

/**
 * Handler for CREATE_CONNECTION_COMMAND (neo4j.createConnection)
 * It shows the connection panel for creating a brand new connection.
 * This can be triggered by the command palette or the Connections item menu.
 */
export function createConnectionPanel(): void {
  const context = getExtensionContext();
  ConnectionPanel.createOrShow(context.extensionPath, undefined, '');
}

//The npm data object contains more fields from the npm registrys package.json, but we only need dist-tags here
type NpmRelease = {
  'dist-tags'?: Record<string, string>;
};

export async function getTaggedRegistryVersions(): Promise<
  { tag: string; version: string }[]
> {
  const registryUrl = 'https://registry.npmjs.org/@neo4j-cypher/lint-worker';
  const tagToFilter = 'neo4j-5.20.0';

  try {
    const response = await axios.get<NpmRelease>(registryUrl);
    const data: NpmRelease = response.data;

    const taggedVersions: { tag: string; version: string }[] = [];
    if (data !== null && data['dist-tags'] !== null) {
      for (const [tag, version] of Object.entries(data['dist-tags'])) {
        if (
          typeof tag === 'string' &&
          typeof version === 'string' &&
          tag === tagToFilter
        ) {
          taggedVersions.push({ tag, version });
        }
      }
    }

    return taggedVersions;
  } catch (error) {
    return [];
  }
}

/**
 * Handler for SWITCH_LINTWORKER_COMMAND (neo4j.editLinter)
 * This can be triggered on the connection tree view, through the status bar or via the command palette.
 * Triggering shows a list of available linters. Picking one switches the linter used.
 * @returns A promise that resolves when the handler has completed.
 */
export async function manualLinterSwitch(): Promise<void> {
  const npmVersions = await getTaggedRegistryVersions();
  const fileNames = await getFilesInExtensionStorage();
  const downloadedLinterVersions: Record<string, string> = Object.fromEntries(
    fileNames
      .map((name) => [linterFileToVersion(name), name])
      .filter(
        (v): v is [string, string] => v !== undefined && v[0] !== undefined,
      ),
  );
  downloadedLinterVersions['Latest'] = '';
  const npm_versions = npmVersions
    .map((x) => x.tag.match(/^neo4j-([\d.]+)$/)?.[1])
    .filter((v) => v !== undefined);
  const existing_versions = Object.keys(downloadedLinterVersions);
  const all_versions = new Set(existing_versions.concat(npm_versions));
  const picked = await window.showQuickPick(Array.from(all_versions), {
    placeHolder: 'Select Linter version',
  });

  const globalStorage = getExtensionContext().globalStorageUri;
  let fileName = '';
  if (picked === undefined) {
    return;
  } else if (!existing_versions.includes(picked)) {
    const desiredFileName = `${picked}-lintWorker.cjs`;
    const success = await downloadLintWorker(desiredFileName, globalStorage);
    fileName = success ? desiredFileName : '';
  } else {
    fileName = downloadedLinterVersions[picked];
  }
  await switchWorkerOnLanguageServer(fileName, globalStorage);
} //Test that default works as expected, that cancelling works, that unexpected files are not picked up and of course that pickingworks

/**
 * Handler for EDIT_CONNECTION_COMMAND (neo4j.editConnection)
 * This can be triggered only on the connection tree view.
 * This shows the connection panel for the given connection item.
 * @param connectionItem The ConnectionItem to manage.
 * @returns A promise that resolves when the handler has completed.
 */
export async function showConnectionPanelForConnectionItem(
  connectionItem?: ConnectionItem | undefined,
): Promise<void> {
  const context = getExtensionContext();
  const connection: Connection = connectionItem
    ? getConnectionByKey(connectionItem.key)
    : undefined;
  const password: string = connection
    ? await getPasswordForConnection(connection.key)
    : '';

  ConnectionPanel.createOrShow(context.extensionPath, connection, password);
}

/**
 * Handler for DELETE_CONNECTION_COMMAND (neo4j.deleteConnection)
 * This may only be triggered from the Connection tree view.
 * Deletes a connection from the database and updates the database connection.
 * The user is first prompted to confirm the deletion.
 * @param connectionItem The ConnectionItem to delete.
 * @returns A promise that resolves when the handler has completed.
 */
export async function promptUserToDeleteConnectionAndDisplayConnectionResult(
  connectionItem: ConnectionItem,
): Promise<void> {
  const result = await displayConfirmConnectionDeletionPrompt(connectionItem);

  if (result === 'Yes') {
    await deleteConnectionAndUpdateDatabaseConnection(connectionItem.key);
    void commands.executeCommand(
      CONSTANTS.COMMANDS.REFRESH_CONNECTIONS_COMMAND,
    );
    void window.showInformationMessage(CONSTANTS.MESSAGES.CONNECTION_DELETED);
  }
}

/**
 * Handler for CONNECT_COMMAND and DISCONNECT_COMMAND (neo4j.connect and neo4j.disconnect)
 * This may only be triggered from the Connection tree view.
 * Toggles the connect flag and state of a Connection and updates the database connection.
 * The result of the connection attempt is displayed to the user.
 * @param connectionItem The Connecion to toggle.
 * @returns A promise that resolves when the handler has completed.
 */
export async function toggleConnectionItemsConnectionState(
  connectionItem: ConnectionItem,
): Promise<void> {
  const connectionToToggle = getConnectionByKey(connectionItem.key);
  const { result, connection } =
    await toggleConnectionAndUpdateDatabaseConnection(connectionToToggle);
  displayMessageForConnectionResult(connection, result);
}

/**
 * Handler for SWITCH_DATABASE_COMMAND (neo4j.switchDatabase)
 * This may only be triggered from the Connection tree view.
 * Switches the active database of the active Connection and updates the database connection, reconnecting the connection.
 * @param connectionItem The ConnectionItem of the database to switch to.
 * @returns A promise that resolves when the handler has completed.
 */
export async function switchToDatabase(
  connectionItem: ConnectionItem,
): Promise<void> {
  if (connectionItem.type !== 'database') {
    return;
  }
  const database = connectionItem.key;
  await switchToDatabaseWithName(database);
}

export async function switchToDatabaseWithName(
  database: string,
): Promise<void> {
  const connection = getActiveConnection();
  const result = await switchDatabase({ ...connection, database });
  displayMessageForSwitchDatabaseResult(database, result);
}

function sortByPosition(a: Selection, b: Selection): number {
  const lineDiff = a.start.line - b.start.line;
  if (lineDiff !== 0) return lineDiff;

  const columnDiff = a.start.character - b.start.character;
  return columnDiff;
}

function getSelectedText(editor: TextEditor): string {
  const selections = editor.selections.filter(
    (selection) => !selection.isEmpty && editor.document.getText(selection),
  );
  const text =
    selections.length === 0
      ? editor.document.getText()
      : selections
          .sort(sortByPosition)
          .map((selection) => {
            return editor.document.getText(selection);
          })
          .join(' ');

  return text;
}

export async function runCypher(
  renderBottomPanel: (statements: string[]) => Promise<void>,
): Promise<void> {
  const cypherRunner = getQueryRunner();

  // Get the active text editor
  const editor = window.activeTextEditor;

  if (editor) {
    const activeConnection = getActiveConnection();

    if (!activeConnection) {
      void window.showErrorMessage(
        CONSTANTS.MESSAGES.ERROR_DISCONNECTED_EXECUTION,
      );

      return;
    }

    const selectedText = getSelectedText(editor);

    await cypherRunner.run(selectedText, renderBottomPanel);
  }
}

export async function cypherFileFromSelection(): Promise<void> {
  const editor = window.activeTextEditor;

  if (editor) {
    const selectedText = getSelectedText(editor);

    // Creates a new Cypher document with the selection
    const textDocument = await workspace.openTextDocument({
      content: selectedText,
      language: 'cypher',
    });
    await window.showTextDocument(textDocument);
  }
}

export async function forceDisconnect(): Promise<void> {
  const activeConnection = getActiveConnection();

  await toggleConnectionAndUpdateDatabaseConnection(activeConnection);

  void window.showInformationMessage(CONSTANTS.MESSAGES.DISCONNECTED_MESSAGE);
}

export async function forceConnect(i: number): Promise<void> {
  const connections = getConnections();
  const connectionToToggle = Object.values(connections).at(i);
  if (connectionToToggle) {
    const { result, connection } =
      await toggleConnectionAndUpdateDatabaseConnection(connectionToToggle);
    displayMessageForConnectionResult(connection, result);
  }
}

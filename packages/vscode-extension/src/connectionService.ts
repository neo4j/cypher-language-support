import { Neo4jConnectionSettings } from '@neo4j-cypher/language-server/src/types';
import {
  ConnectionError,
  ConnnectionResult,
  Database,
} from '@neo4j-cypher/query-tools';
import { commands } from 'vscode';
import { CONSTANTS } from './constants';
import { getExtensionContext, getSchemaPoller } from './contextService';
import { sendNotificationToLanguageClient } from './languageClientService';
import * as schemaPollerEventHandlers from './schemaPollerEventHandlers';
import { connectionTreeDataProvider } from './treeviews/connectionTreeDataProvider';
import { databaseInformationTreeDataProvider } from './treeviews/databaseInformationTreeDataProvider';
import { displayMessageForConnectionResult } from './uiUtils';
import { getVersion } from '@neo4j-cypher/query-tools';
import { compareMajorMinorVersions } from '@neo4j-cypher/language-support';
import * as tar from 'tar';
import * as path from 'path';
import { pipeline } from 'stream/promises';
import axios from 'axios';
import * as vscode from 'vscode';

export type Scheme =
  | 'neo4j'
  | 'neo4j+s'
  | 'neo4j+ssc'
  | 'bolt'
  | 'bolt+s'
  | 'bolt+ssc';

export type State = 'inactive' | 'activating' | 'active' | 'error';

/**
 * A Connection object that represents a connection to a Neo4j database.
 */
export type Connection = {
  key: string;
  scheme: Scheme;
  name?: string;
  host: string;
  port?: string;
  user: string;
  database?: string;
  state: State;
};

/**
 * A map of Connection keys to Connection objects.
 */
export type Connections = {
  [key: string]: Connection | null;
};

const CONNECTIONS_KEY: string = 'connections';

/**
 * Deletes a Connection and its password if it exists, and disconnects from the database.
 * @param key The key of the Connection to delete.
 * @returns A promise that resolves when the Connection has been deleted and database connection dropped.
 */
export async function deleteConnectionAndUpdateDatabaseConnection(
  key: string,
): Promise<void> {
  const connections = getConnections();
  const connection = connections[key];
  if (!connection) {
    return;
  }

  const activeConnection = getActiveConnection();
  const isActiveConnection = activeConnection && activeConnection.key === key;

  delete connections[key];
  await saveConnections(connections);
  await deletePasswordByKey(key);

  if (isActiveConnection) {
    const result = await disconnectFromDatabaseAndNotifyLanguageClient();
    connection.state = 'inactive';
    displayMessageForConnectionResult(connection, result);
  }
}

/**
 * Saves a Connection, its password and attempts to connect to the database.
 * Any current database connections will be dropped.
 * An attempt to initialize a new database connection will be made. If successful, the Connection will be saved and the database connection will be updated.
 * @param connection The Connection to save.
 * @param password The password for the Connection.
 * @param forceSave A boolean flag to determine if the Connection should be saved even if the connection attempt fails.
 * If the forceSave flag is true, the Connection will be saved and a connection attempt made if the initialization attempt fails, as long as it is retriable.
 * If the forceSave flag is false, the Connection will not be saved if the initialization attempt fails.
 * @returns A promise that resolves with the Connection result.
 */
export async function saveConnectionAndUpdateDatabaseConnection(
  connection: Connection | null,
  password: string,
  forceSave?: boolean,
): Promise<ConnnectionResult> {
  if (!connection) {
    return;
  }

  await disconnectAllDatabaseConnections();

  const result = await initializeDatabaseConnection(connection, password);

  if (result.success || forceSave) {
    await saveConnection(connection);
    await savePasswordByKey(connection.key, password);
    return await updateDatabaseConnectionAndNotifyLanguageClient(connection);
  }

  return result;
}

/**
 * Saves a connection and updates the database connection.
 * This function is used when switching databases, and avoids the need to reinitialize the driver.
 * @param connection The Conection to save.
 * @returns A promise that resolves with the Connection result.
 */
export async function switchDatabase(connection: Connection | null) {
  if (!connection) {
    return;
  }

  return await updateDatabaseConnectionAndNotifyLanguageClient(connection);
}

/**
 * Toggles the connect flag and connection state of a Connection and updates the database connection.
 * If the Connection's connect flag is true, any current database connections will be dropped.
 * @param connection The Connection to toggle.
 * @returns A promise that resolves with the connection result and the updated Connection.
 */
export async function toggleConnectionAndUpdateDatabaseConnection(
  connection: Connection | null,
): Promise<{ result: ConnnectionResult; connection: Connection }> {
  if (!connection) {
    return { result: { success: false, retriable: false }, connection };
  }

  connection = {
    ...connection,
    state: connection.state === 'inactive' ? 'activating' : 'inactive',
  };

  await disconnectAllDatabaseConnections();
  await saveConnection(connection);

  const result = await updateDatabaseConnectionAndNotifyLanguageClient(
    connection,
  );

  return { result, connection };
}

/**
 * Saves a connection in the global state.
 * @param connection The connection to save.
 * @returns A promise that resolves when the connection has been saved.
 */
export async function saveConnection(connection: Connection): Promise<void> {
  if (!connection) {
    return;
  }

  const connections = getConnections();
  connections[connection.key] = connection;

  await saveConnections(connections);
}

/**
 * Gets a password from the secrets store for a given Connection, if one exists.
 * @param key The key of the Connection to get the password for.
 * @returns A promise that resolves with the password, or null if no password exists.
 */
export async function getPasswordForConnection(
  key: string,
): Promise<string | null> {
  const context = getExtensionContext();
  return (await context.secrets.get(key)) ?? null;
}

/**
 * Returns the currently connected Connection if it exists.
 * @returns The current Connection, or null if no Connection is connected to the database.
 */
export function getActiveConnection(): Connection | null {
  return (
    Object.values(getConnections()).find(
      (connection) => connection.state !== 'inactive',
    ) ?? null
  );
}

/**
 * Gets all Connections from the global state as an array of Connection objects.
 * @returns An array of all Connection objects.
 */
export function getAllConnections(): Connection[] {
  const connections = Object.values(getConnections());
  return connections.length ? connections : [];
}

/**
 * Gets a Connection from the global state by its key.
 * @param key The key of the Connection to get.
 * @returns The Connection, or null if no Connection with the given key exists.
 */
export function getConnectionByKey(key: string): Connection | null {
  const connections = getConnections();
  return connections[key] ?? null;
}

/**
 * Gets a formatted connection string from a Connection object.
 * @param connection The Connection to get the connection string for.
 * @returns The connection string, or null if the Connection is null.
 */
export function getDatabaseConnectionString(
  connection: Connection,
): string | null {
  if (connection) {
    return connection.port
      ? `${connection.scheme}://${connection.host}:${connection.port}`
      : `${connection.scheme}://${connection.host}`;
  }

  return null;
}

/**
 * Gets the database connection settings from a Connection object used in the notification payload to the language client.
 * @param connection The Connection to get the connection settings for.
 * @param password The password for the Connection.
 * @returns The database connection settings.
 */
export function getDatabaseConnectionSettings(
  connection: Connection,
  password: string,
): Neo4jConnectionSettings {
  return {
    connect: connection.state !== 'inactive',
    connectURL: getDatabaseConnectionString(connection),
    database: connection.database,
    user: connection.user,
    password: password,
  };
}

/**
 * Handler for reconnecting database connections for an active Connection when the extension is activated.
 * @returns A promise that resolves when the handler has completed.
 */
export async function reconnectDatabaseConnectionOnExtensionActivation(): Promise<void> {
  const connection = getActiveConnection();

  if (!connection) {
    return;
  }

  const password = await getPasswordForConnection(connection.key);

  const result = await saveConnectionAndUpdateDatabaseConnection(
    connection,
    password,
  );

  displayMessageForConnectionResult(connection, result);
}

/**
 * Handler for disconnecting database connections when the extension is deactivated.
 * @returns A promise that resolves when the handler has completed.
 */
export async function disconnectDatabaseConnectionOnExtensionDeactivation(): Promise<void> {
  await disconnectFromDatabaseAndNotifyLanguageClient();
}

/**
 * Used to establish a persistent connection to a Neo4j database.
 * If the connection attempt fails, a reconnection event listener is attached which fires once the connection is re-established.
 * If the connection attempt is successful, an error event listener is attached to handle any future connection errors.
 * @param connectionSettings The connection settings for the database connection.
 * @returns A promise that resolves with the result of the connection attempt.
 */
export async function establishPersistentConnectionToSchemaPoller(
  connectionSettings: Neo4jConnectionSettings,
): Promise<ConnnectionResult> {
  const schemaPoller = getSchemaPoller();
  const result = await schemaPoller.persistentConnect(
    connectionSettings.connectURL,
    {
      username: connectionSettings.user,
      password: connectionSettings.password,
    },
    { appName: 'vscode-extension' },
    connectionSettings.database,
  );

  result.success
    ? attachSchemaPollerConnectionEventListeners()
    : attachSchemaPollerConnectionFailedEventListeners();

  return result;
}

/**
 *  Gets an array of database names from the connection, if they exist.
 * @returns An array of database names, or an empty array if no databases exist.
 */
export function getConnectionDatabases(): Pick<
  Database,
  'name' | 'default' | 'home'
>[] {
  const schemaPoller = getSchemaPoller();
  const databases = schemaPoller.connection?.databases ?? [];

  if (
    !schemaPoller.metadata ||
    !schemaPoller.metadata.dbSchema?.databaseNames
  ) {
    return databases;
  }

  return schemaPoller.metadata.dbSchema.databaseNames.map((name) => {
    const database = databases.find((db) => db.name === name);
    if (!database) {
      return {
        name: name,
        default: false,
        home: false,
      };
    } else {
      return database;
    }
  }, []);
}

/**
 * Returns the labels and relationship types from the dbSchema, if they exist.
 * @returns An object containing the labels and relationships, or null if the dbSchema does not exist.
 */
export function getDbSchemaInformation():
  | {
      labels: string[];
      relationships: string[];
    }
  | undefined {
  const schemaPoller = getSchemaPoller();

  if (!schemaPoller.metadata || !schemaPoller.metadata.dbSchema) {
    return undefined;
  }

  return {
    labels: schemaPoller.metadata.dbSchema.labels,
    relationships: schemaPoller.metadata.dbSchema.relationshipTypes,
  };
}

/**
 * Attempts to initialize a database connection with the given Connection and password.
 * The initialization phases instantiates an instance of the Neo4j driver and verifies connectivity to the database.
 * @param connection The Connection to initialize the database connection with.
 * @param password The password for the Connection.
 * @returns A promise that resolves with the Connection result.
 */
async function initializeDatabaseConnection(
  connection: Connection,
  password: string,
): Promise<ConnnectionResult> {
  const settings = getDatabaseConnectionSettings(connection, password);
  const schemaPoller = getSchemaPoller();
  disconnectFromSchemaPoller();

  return await schemaPoller.connect(
    settings.connectURL,
    {
      username: settings.user,
      password: settings.password,
    },
    { appName: 'vscode-extension' },
    settings.database,
  );
}

/**
 * Updates the database connection for a Connection.
 * If the Connection's state is 'inactive', the database connection will be dropped.
 * If the Connection's state is not 'inactive', a connection attempt will be made.
 * @param connection The Connection to update the database connection for.
 * @returns A promise that resolves with the Connection result.
 */
async function updateDatabaseConnectionAndNotifyLanguageClient(
  connection: Connection,
): Promise<ConnnectionResult> {
  return connection.state !== 'inactive'
    ? await connectToDatabaseAndNotifyLanguageClient(connection)
    : await disconnectFromDatabaseAndNotifyLanguageClient();
}

/**
 * Notifies the language client it should switch linter
 */
export async function switchWorkerOnLanguageServer(
  fileName: string,
  destDir: string,
) {
  const linterPath = fileName ? path.join(destDir, fileName) : undefined;
  await sendNotificationToLanguageClient('updateLintWorker', {
    lintWorkerPath: linterPath,
  });
}

async function downloadLintWorker(
  fileName: string,
  destDir: string,
  serverVersion: string,
): Promise<void> {
  const filePath = path.join(destDir, fileName);
  const downloadUrl = `http://localhost:4873/@neo4j-cypher/lint-worker/-/lint-worker-${serverVersion}.tgz`; //`http://localhost:4873/@neo4j-cypher/lint-worker/-/lint-worker-2025.3.0.tgz`;
  const response = await axios.get(downloadUrl, { responseType: 'stream' });
  await pipeline(
    response.data,
    tar.x({
      cwd: destDir,
      filter: (path) => path === 'package/dist/cjs/lintWorker.cjs',
    }),
  );

  const extractedFilePath = path.join(
    destDir,
    'package',
    'dist',
    'cjs',
    'lintWorker.cjs',
  );
  const fileUri = vscode.Uri.file(filePath);
  const extractedUri = vscode.Uri.file(extractedFilePath);
  const newFolderUri = vscode.Uri.file(path.join(destDir, 'package'));
  await vscode.workspace.fs.rename(extractedUri, fileUri);
  await vscode.workspace.fs.delete(newFolderUri, { recursive: true });
}
async function getDestDir(
  fileName: string,
): Promise<{ fileExists: boolean; destDir: string }> {
  const context = getExtensionContext();
  const storageUri = context.globalStorageUri;
  const destDir = storageUri.path.slice(1);
  await vscode.workspace.fs.createDirectory(storageUri);
  const filePath = path.join(destDir, fileName);
  const fileUri = vscode.Uri.file(filePath);
  let stats: vscode.FileStat;
  try {
    stats = await vscode.workspace.fs.stat(fileUri);
  } catch (e) {
    stats = undefined;
  }
  return { fileExists: stats !== undefined, destDir };
}

export async function checkNeo4jServerVersion(): Promise<void> {
  const { query: versionQuery, queryConfig: versionQueryConfig } = getVersion();
  const poller = getSchemaPoller();
  const driver = poller.driver;
  if (driver) {
    const { serverVersion } = await driver.executeQuery(
      versionQuery,
      {},
      versionQueryConfig,
    );
    //removes zero padding on month of new versions
    const sanitizedServerVersion = serverVersion.replace(/(\.0+)(?=\d)/g, '.');

    //since not every release has a linter release
    const linterVersion = serverVersionToLinter(sanitizedServerVersion);

    //If the server is newer than the latest published package on npm, use default linter
    if (!linterVersion) {
      return switchWorkerOnLanguageServer(undefined, undefined);
    }
    //const downloadUrl = `https://registry.npmjs.org/@neo4j-cypher/language-server/-/language-server-2.0.0-next.21.tgz`;
    const fileName = `${linterVersion}-lintWorker.cjs`;
    const { fileExists, destDir } = await getDestDir(fileName);

    if (fileExists) {
      await switchWorkerOnLanguageServer(fileName, destDir);
    } else {
      await downloadLintWorker(fileName, destDir, linterVersion);
      await switchWorkerOnLanguageServer(fileName, destDir);
    }
  }
}

function serverVersionToLinter(serverVersion: string) {
  //This can be made into an array (the key is not needed) but having it this way helps see what lang-supp release we would use
  const availableLinters: Record<string, string> = {
    //We should probably have version comparison where patches are lumped in with the original release
    '2.0.0-next.20': '2025.4.0', // 29/4 - 2025.04.0=30/4
    //"2.0.0-next.19": "", // 22/4 - maybe SKIP
    //"2.0.0-next.18": "", // 7/4  - skip because next release is 2025.04.0
    '2.0.0-next.17': '2025.3.0', // 25/3 - 2025.03.0=27/3
    '2.0.0-next.16': '2025.2.0', // 17/2 - 2025.02.0=27/2
    //"2.0.0-next.15": "", // 10/2 - maybe SKIP
    '2.0.0-next.14': '2025.1.0', // 4/2  - 2025.01.0=6/2
    //"2.0.0-next.13": "", // 23/12 2024 - skip, next is 01.0
    '2.0.0-next.12': '5.26.0', // 13/12 - 5.26(.x)=9/12 (very close to initial 5.26, if after)
    //"2.0.0-next.11": "", // 13/11 - SKIP
    //"2.0.0-next.10": "", // 13/11 - SKIP
    '2.0.0-next.9': '5.25.0', // 28/10 - 5.25 = 31/10
    '2.0.0-next.8': '5.24.0', // 14/9 - 5.24 = 27/9
    '2.0.0-next.7': '5.23', // 29/7 - 5.23 = 22/8
    '2.0.0-next.6': '5.20', // 3/5 - 5.20 = 23/5
    '2.0.0-next.5': '5.19', // 2/4 - 5.19 = 12/4
    '2.0.0-next.4': '5.18', // 6/3 - 5.18 = 13/3
    '2.0.0-next.3': '5.17', // 7/2 - 5.17 = 23/2
    '2.0.0-next.2': '5.14', // 24/11 2023 - 5.14 = 24/11
    //"2.0.0-next.1": "",  // 22/11 - SKIP
    '2.0.0-next.0': '5.13', // 25/10 - 5.13 = 23/10
  };
  let candidate: string = undefined;
  for (const x in availableLinters) {
    if (compareMajorMinorVersions(serverVersion, availableLinters[x]) <= 0) {
      candidate = availableLinters[x];
    } else {
      break;
    }
  }
  return candidate;
}

/**
 * Attempts to establish a connection to the database and notifies the language client that the connection has been updated.
 * If the connection is successful, the Connection's state will be set to 'connected'.
 * If the connection is not successful, the Connection's state will either be set to 'error' if the error is retriable, or disconnected if not.
 * @param connection The Connection to use to get database connection settings.
 * @returns A promise that resolves with the Connection result.
 */
async function connectToDatabaseAndNotifyLanguageClient(
  connection: Connection,
): Promise<ConnnectionResult> {
  const password = await getPasswordForConnection(connection.key);
  const settings = getDatabaseConnectionSettings(connection, password);

  const result = await establishPersistentConnectionToSchemaPoller(settings);
  const state: State = result.success
    ? 'active'
    : result.retriable
    ? 'error'
    : 'inactive';

  if (result.success) {
    await checkNeo4jServerVersion();
  }

  result.success
    ? await sendNotificationToLanguageClient('connectionUpdated', settings)
    : await sendNotificationToLanguageClient('connectionDisconnected');

  await saveConnection({
    ...connection,
    state: state,
    database:
      result.error?.code === 'Neo.ClientError.Database.DatabaseNotFound'
        ? undefined
        : connection.database,
  });

  return result;
}

/**
 * Disonnects from the database and notifies the language client that the connection has been dropped.
 * @returns A promise that resolves with the Connection result.
 */
async function disconnectFromDatabaseAndNotifyLanguageClient(): Promise<ConnnectionResult> {
  await sendNotificationToLanguageClient('connectionDisconnected');
  disconnectFromSchemaPoller();
  return { success: true };
}

/**
 * Saves a Connections object in the global state.
 * A command to refresh the Connections view will be executed after the Connections object has been saved.
 * @param connections The Connections object to save.
 * @returns A promise that resolves when the Connections object has been saved.
 */
async function saveConnections(connections: Connections): Promise<void> {
  const context = getExtensionContext();
  await context.globalState.update(CONNECTIONS_KEY, connections);
  await commands.executeCommand(CONSTANTS.COMMANDS.REFRESH_CONNECTIONS_COMMAND);
}

/**
 * Saves a password in the secrets store.
 * @param key The key to save the password under.
 * @param password The password to save.
 * @returns A promise that resolves when the password has been saved.
 */
async function savePasswordByKey(key: string, password: string): Promise<void> {
  const context = getExtensionContext();
  await context.secrets.store(key, password);
}

/**
 * Deletes a password from the secrets store.
 * @param key The key of the password to delete.
 * @returns A promise that resolves when the password has been deleted.
 */
async function deletePasswordByKey(key: string): Promise<void> {
  const context = getExtensionContext();
  await context.secrets.delete(key);
}

/**
 * Disconnects all database connections.
 * All Connections will have their connect flag set to false and state set to 'disconnected'.
 * A notification will be sent to the language client to indicate that a connection should be disconnected.
 * @returns A promise that resolves when all database connections have been dropped.
 */
async function disconnectAllDatabaseConnections(): Promise<void> {
  const connections = getConnections();

  for (const key in connections) {
    if (connections[key].state !== 'inactive') {
      connections[key] = {
        ...connections[key],
        state: 'inactive',
      };

      void sendNotificationToLanguageClient('connectionDisconnected');
      disconnectFromSchemaPoller();
    }
  }

  await saveConnections(connections);
}

/**
 * Gets all Connections from the global state.
 * @returns A Connections object.
 */
export function getConnections(): Connections {
  const context = getExtensionContext();
  return context.globalState.get(CONNECTIONS_KEY, {});
}

/**
 * Disconnects the current schema poller connection and removes all event listeners.
 */
function disconnectFromSchemaPoller(): void {
  const schemaPoller = getSchemaPoller();
  schemaPoller.disconnect();
  schemaPoller.events.removeAllListeners();
}

/**
 * Attaches event listeners to handle reconnection and connection failed events.
 * These events are only handled once.
 */
function attachSchemaPollerConnectionFailedEventListeners(): void {
  const schemaPoller = getSchemaPoller();
  schemaPoller.events.once('connectionConnected', () => {
    schemaPoller.events.removeAllListeners();
    void schemaPollerEventHandlers.handleConnectionReconnected();
    attachSchemaPollerConnectionEventListeners();
  });
  schemaPoller.events.once('connectionFailed', (error: ConnectionError) => {
    schemaPoller.events.removeAllListeners();
    void schemaPollerEventHandlers.handleConnectionFailed(error);
  });
}

/**
 * Attaches event listeners for a successful database connection attempt.
 * The events handled are:
 * - schemaFetched: Refreshes the database information tree view.
 * - connectionErrored: Handles connection errors. This event is only handled once.
 */
function attachSchemaPollerConnectionEventListeners(): void {
  const schemaPoller = getSchemaPoller();
  schemaPoller.events.removeAllListeners();
  schemaPoller.events.on('schemaFetched', () => {
    databaseInformationTreeDataProvider.refresh();
    connectionTreeDataProvider.refresh();
  });
  schemaPoller.events.once('connectionErrored', (error: ConnectionError) => {
    schemaPoller.events.removeAllListeners();
    void schemaPollerEventHandlers.handleConnectionErrored(error);
    attachSchemaPollerConnectionFailedEventListeners();
  });
}

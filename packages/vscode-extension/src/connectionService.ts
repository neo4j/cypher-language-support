import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import { ConnnectionResult } from '@neo4j-cypher/schema-poller';
import { commands, workspace } from 'vscode';
import { constants } from './constants';
import {
  getDatabaseConnectionManager,
  getExtensionContext,
} from './contextService';
import {
  MethodName,
  sendNotificationToLanguageClient,
} from './languageClientService';

export type Scheme = 'neo4j' | 'neo4j+s' | 'bolt' | 'bolt+s';

export type State = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * A Connection object that represents a connection to a Neo4j database.
 */
export type Connection = {
  key: string;
  name: string;
  scheme: Scheme;
  host: string;
  port?: string | undefined;
  user: string;
  database?: string | undefined;
  connect: boolean;
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

  delete connections[key];
  await saveConnections(connections);
  await deletePasswordByKey(key);
  await updateDatabaseConnectionAndNotifyLanguageClient(
    'connectionDisconnected',
    {
      ...connection,
      connect: false,
    },
  );
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

  if (result.success || (forceSave && result.retriable)) {
    await saveConnection(connection);
    await savePasswordByKey(connection.key, password);
    return await updateDatabaseConnectionAndNotifyLanguageClient(
      'connectionUpdated',
      connection,
    );
  }

  return result;
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
    connect: !connection.connect,
    state: !connection.connect ? 'connecting' : 'disconnected',
  };

  await disconnectAllDatabaseConnections();
  await saveConnection(connection);

  let result = { success: true };

  if (connection.connect) {
    result = await updateDatabaseConnectionAndNotifyLanguageClient(
      'connectionUpdated',
      connection,
    );
  }

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
export function getCurrentConnection(): Connection | null {
  return (
    Object.values(getConnections()).find((connection) => connection.connect) ??
    null
  );
}

/**
 * Gets all Connections from the global state as an array of Connection objects.
 * This is artificially limited to one, for now.
 * @returns An array of all Connection objects.
 */
export function getAllConnections(): Connection[] {
  const connections = Object.values(getConnections());
  return connections.length ? [connections[0]] : [];
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
): Neo4jSettings {
  const trace = workspace
    .getConfiguration('neo4j')
    .get<{ server: 'off' | 'messages' | 'verbose' }>('trace') ?? {
    server: 'off',
  };

  return {
    trace: trace,
    connect: connection.connect,
    connectURL: getDatabaseConnectionString(connection),
    database: connection.database,
    user: connection.user,
    password: password,
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
  const databaseConnectionManager = getDatabaseConnectionManager();
  return await databaseConnectionManager.connect(settings);
}

/**
 * Dispatches a notification to the language client with the given method name and settings to either connect or disconnect from the database.
 * If the Connection's connect flag is set, an attempt to establish a persistent connection to the database will be made.
 * If the connection is successful, the Connection's state will be set to 'connected'.
 * If the connection is not successful, the Connection's state will either be set to 'error' if the error is retriable, or disconnected if not.
 * If the Connection's connect flag is not set, the database connection will be dropped.
 * @param methodName The method name of the notification to send to the language client, either 'connectionUpdated' or 'connectionDisconnected'.
 * @param connection The Connection to update the database connection for.
 * @returns A promise that resolves with the Connection result.
 */
async function updateDatabaseConnectionAndNotifyLanguageClient(
  methodName: MethodName,
  connection: Connection,
): Promise<ConnnectionResult> {
  const password = await getPasswordForConnection(connection.key);
  const settings = getDatabaseConnectionSettings(connection, password);
  const databaseConnectionManager = getDatabaseConnectionManager();
  let result: ConnnectionResult = { success: true };

  await sendNotificationToLanguageClient(methodName, settings);

  if (connection.connect) {
    result = await databaseConnectionManager.persistentConnect(settings);
    const state: State = result.success
      ? 'connected'
      : result.retriable
      ? 'error'
      : 'disconnected';
    const connect: boolean = result.success || result.retriable;

    await saveConnection({
      ...connection,
      state: state,
      connect: connect,
    });
  } else {
    databaseConnectionManager.disconnect();
  }

  return result;
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
  await commands.executeCommand(constants.COMMANDS.REFRESH_CONNECTIONS_COMMAND);
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
  const databaseConnectionManager = getDatabaseConnectionManager();

  for (const key in connections) {
    if (connections[key].connect) {
      connections[key] = {
        ...connections[key],
        connect: false,
        state: 'disconnected',
      };

      void sendNotificationToLanguageClient('connectionDisconnected');
      databaseConnectionManager.disconnect();
    }
  }

  await saveConnections(connections);
}

/**
 * Gets all Connections from the global state.
 * @returns A Connections object.
 */
function getConnections(): Connections {
  const context = getExtensionContext();
  return context.globalState.get(CONNECTIONS_KEY, {});
}

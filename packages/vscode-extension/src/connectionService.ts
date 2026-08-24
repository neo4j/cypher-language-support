import { Neo4jConnectionSettings } from '@neo4j-cypher/language-server/src/types';
import {
  ConnectionError,
  ConnnectionResult,
  Database,
} from '@neo4j-cypher/query-tools';
import { commands, workspace } from 'vscode';
import { CONSTANTS } from './constants';
import { getExtensionContext, getSchemaPoller } from './contextService';
import { sendNotificationToLanguageClient } from './languageClientService';
import * as schemaPollerEventHandlers from './schemaPollerEventHandlers';
import { connectionTreeDataProvider } from './treeviews/connectionTreeDataProvider';
import { databaseInformationTreeDataProvider } from './treeviews/databaseInformationTreeDataProvider';
import { displayMessageForConnectionResult } from './uiUtils';
import { dynamicallyAdjustLinter, switchToLinter } from './linterSwitching';

export type Scheme =
  | 'neo4j'
  | 'neo4j+s'
  | 'neo4j+ssc'
  | 'bolt'
  | 'bolt+s'
  | 'bolt+ssc';

type State = 'inactive' | 'activating' | 'active' | 'error';

/**
 * A Connection object that represents a connection to a Neo4j database.
 * Connections with source 'setting' are defined in the neo4j.connections
 * setting and are never persisted to the global state.
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
  source?: 'setting';
};

/**
 * A map of Connection keys to Connection objects.
 */
export type Connections = {
  [key: string]: Connection | null;
};

const CONNECTIONS_KEY = 'connections';
const APPROVED_SETTING_SERVERS_KEY = 'approvedSettingServers';
const SETTING_CONNECTION_STATES_KEY = 'settingConnectionStates';
const CONNECTIONS_SETTING_SECTION = 'neo4j';
const CONNECTIONS_SETTING_NAME = 'connections';

/**
 * The shape of an entry in the neo4j.connections setting.
 */
type SettingConnectionEntry = {
  name?: string;
  scheme: Scheme;
  host: string;
  port?: string | number;
  user: string;
  password?: string;
  database?: string;
};

/**
 * The state (connection state and selected database) of a setting connection.
 * Setting connections live in settings.json, which cannot hold their state, so
 * it is kept in the global state keyed by the connection's derived key.
 */
type SettingConnectionState = { state: State; database?: string };

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
    if (connection.source !== 'setting') {
      await savePasswordByKey(connection.key, password);
    }
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

  const result =
    await updateDatabaseConnectionAndNotifyLanguageClient(connection);

  return { result, connection };
}

/**
 * Saves a connection in the global state.
 * For setting connections only their state is saved, the connection itself
 * stays defined by the neo4j.connections setting.
 * @param connection The connection to save.
 * @returns A promise that resolves when the connection has been saved.
 */
export async function saveConnection(connection: Connection): Promise<void> {
  if (!connection) {
    return;
  }

  if (connection.source === 'setting') {
    const states = getSettingConnectionStates();
    states[connection.key] = {
      state: connection.state,
      database: connection.database,
    };
    await saveSettingConnectionStates(states);
    await commands.executeCommand(
      CONSTANTS.COMMANDS.REFRESH_CONNECTIONS_COMMAND,
    );
    return;
  }

  const connections = getConnections();
  connections[connection.key] = connection;

  await saveConnections(connections);
}

/**
 * Gets the password for a given Connection, if one exists.
 * Passwords for setting connections are read from the settings entry, all
 * others from the secrets store.
 * @param key The key of the Connection to get the password for.
 * @returns A promise that resolves with the password, or null if no password exists.
 */
export async function getPasswordForConnection(
  key: string,
): Promise<string | null> {
  const settingEntry = getSettingConnectionEntryByKey(key);
  if (settingEntry) {
    return settingEntry.password ?? null;
  }

  const context = getExtensionContext();
  return (await context.secrets.get(key)) ?? null;
}

/**
 * Returns the currently connected Connection if it exists.
 * @returns The current Connection, or null if no Connection is connected to the database.
 */
export function getActiveConnection(): Connection | null {
  return (
    getAllConnections().find((connection) => connection.state !== 'inactive') ??
    null
  );
}

/**
 * Gets all Connections, both from the global state and from the
 * neo4j.connections setting, as an array of Connection objects.
 * @returns An array of all Connection objects.
 */
export function getAllConnections(): Connection[] {
  const connections = Object.values(getConnections()).filter(
    (connection): connection is Connection => !!connection,
  );
  return [...connections, ...getSettingConnections()];
}

/**
 * Gets a Connection by its key, from the global state or from the
 * neo4j.connections setting.
 * @param key The key of the Connection to get.
 * @returns The Connection, or null if no Connection with the given key exists.
 */
export function getConnectionByKey(key: string): Connection | null {
  const connections = getConnections();
  return (
    connections[key] ??
    getSettingConnections().find((connection) => connection.key === key) ??
    null
  );
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
function getDatabaseConnectionSettings(
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

  if (result.success) {
    attachSchemaPollerConnectionEventListeners();
  } else {
    attachSchemaPollerConnectionFailedEventListeners();
  }

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
    await sendNotificationToLanguageClient('connectionUpdated', settings);
  } else {
    await sendNotificationToLanguageClient('connectionDisconnected');
  }

  // Note the e2e tests are always going to be on an older neo4j version (a docker container)
  // We want for all of the tests to run with the latest version of the linter,
  // not an older one (which would not make sense to debug them for example)
  //
  // except for the tests that are specifically about switching the linter
  if (result.success) {
    if (process.env.DEBUG_VSCODE_TESTS !== undefined) {
      // tests code
      if (process.env.LINTER_SWITCHING_TESTS === 'true') {
        await dynamicallyAdjustLinter();
      } else {
        await switchToLinter('Default', []);
      }
    } else {
      // production code
      await dynamicallyAdjustLinter();
    }
  }

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

  const states = getSettingConnectionStates();
  for (const key in states) {
    if (states[key].state !== 'inactive') {
      states[key] = { ...states[key], state: 'inactive' };

      void sendNotificationToLanguageClient('connectionDisconnected');
      disconnectFromSchemaPoller();
    }
  }
  await saveSettingConnectionStates(states);

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
 * Gets the states of all setting connections from the global state.
 * @returns A map of setting connection keys to their states.
 */
function getSettingConnectionStates(): Record<string, SettingConnectionState> {
  const context = getExtensionContext();
  return context.globalState.get(SETTING_CONNECTION_STATES_KEY, {});
}

/**
 * Saves the states of all setting connections in the global state.
 * @param states A map of setting connection keys to their states.
 * @returns A promise that resolves when the states have been saved.
 */
async function saveSettingConnectionStates(
  states: Record<string, SettingConnectionState>,
): Promise<void> {
  const context = getExtensionContext();
  await context.globalState.update(SETTING_CONNECTION_STATES_KEY, states);
}

/**
 * Guard function to validate a value is a Scheme.
 * @param scheme The value to validate as a Scheme.
 * @returns True if the value is a valid Scheme, false otherwise.
 */
function isValidScheme(scheme: unknown): scheme is Scheme {
  return (
    typeof scheme === 'string' &&
    ['neo4j', 'neo4j+s', 'neo4j+ssc', 'bolt', 'bolt+s', 'bolt+ssc'].includes(
      scheme,
    )
  );
}

/**
 * Substitutes ${env:VAR} references in a string with the value of the
 * environment variable VAR. Note that process.env is a copy of the
 * environment VS Code was launched with, so changes to environment variables
 * require a full restart of VS Code to be picked up.
 * References to unset variables are left as-is, so they are visible in the
 * connections view rather than silently becoming empty strings.
 * @param value The string to substitute environment variable references in.
 * @returns The string with environment variable references substituted.
 */
function substituteEnvVariables(value: string): string {
  return value.replace(
    /\$\{env:([^}]+)\}/g,
    (reference, variableName: string) => process.env[variableName] ?? reference,
  );
}

/**
 * Substitutes ${env:VAR} references in all string fields of a setting
 * connection entry, except the scheme (which is validated against a fixed
 * set of values before substitution).
 * @param entry The setting connection entry to substitute in.
 * @returns The entry with environment variable references substituted.
 */
function substituteEnvVariablesInEntry(
  entry: SettingConnectionEntry,
): SettingConnectionEntry {
  return {
    ...entry,
    name:
      typeof entry.name === 'string'
        ? substituteEnvVariables(entry.name)
        : entry.name,
    host: substituteEnvVariables(entry.host),
    port:
      typeof entry.port === 'string'
        ? substituteEnvVariables(entry.port)
        : entry.port,
    user: substituteEnvVariables(entry.user),
    password:
      typeof entry.password === 'string'
        ? substituteEnvVariables(entry.password)
        : entry.password,
    database:
      typeof entry.database === 'string'
        ? substituteEnvVariables(entry.database)
        : entry.database,
  };
}

/**
 * Reads the connection entries from the neo4j.connections setting,
 * discarding malformed entries. Values may reference environment variables
 * with ${env:VAR}, which are substituted from the environment VS Code was
 * launched with.
 * @returns An array of setting connection entries.
 */
function getSettingConnectionEntries(): SettingConnectionEntry[] {
  const entries = workspace
    .getConfiguration(CONNECTIONS_SETTING_SECTION)
    .get<SettingConnectionEntry[]>(CONNECTIONS_SETTING_NAME, []);

  if (!Array.isArray(entries)) {
    return [];
  }

  return entries
    .filter(
      (entry) =>
        entry &&
        typeof entry.host === 'string' &&
        typeof entry.user === 'string' &&
        isValidScheme(entry.scheme),
    )
    .map(substituteEnvVariablesInEntry);
}

/**
 * Derives a deterministic key for a setting connection entry, so its state
 * survives settings reloads. The name is part of the key, so entries that
 * share an address but carry e.g. different credentials (multiple DBMSs
 * served on the same local address) can coexist under different names.
 * @param entry The setting connection entry to derive a key for.
 * @returns The key for the entry.
 */
function getSettingConnectionKey(entry: SettingConnectionEntry): string {
  const port = entry.port !== undefined ? `:${entry.port}` : '';
  const database = entry.database ? `/${entry.database}` : '';
  return `${entry.name ?? ''}|${entry.user}@${entry.scheme}://${entry.host}${port}${database}`;
}

/**
 * Gets a setting connection entry from the settings by its derived key.
 * @param key The key of the setting connection entry to get.
 * @returns The setting connection entry, or null if none matches the key.
 */
function getSettingConnectionEntryByKey(
  key: string,
): SettingConnectionEntry | null {
  return (
    getSettingConnectionEntries().find(
      (entry) => getSettingConnectionKey(entry) === key,
    ) ?? null
  );
}

/**
 * Gets all connections defined in the neo4j.connections setting as
 * Connection objects, overlaying any runtime state they have accumulated.
 * @returns An array of setting Connection objects.
 */
function getSettingConnections(): Connection[] {
  const connections: Connection[] = [];
  const seenKeys = new Set<string>();
  const states = getSettingConnectionStates();

  for (const entry of getSettingConnectionEntries()) {
    const key = getSettingConnectionKey(entry);
    if (seenKeys.has(key)) {
      continue;
    }
    seenKeys.add(key);

    const connectionState = states[key];
    connections.push({
      key: key,
      scheme: entry.scheme,
      name: entry.name,
      host: entry.host,
      port: entry.port !== undefined ? String(entry.port) : undefined,
      user: entry.user,
      database: connectionState?.database ?? entry.database,
      state: connectionState?.state ?? 'inactive',
      source: 'setting',
    });
  }

  return connections;
}

/**
 * Gets the server address (scheme, host and port) of a setting connection
 * entry. Trust approvals are tracked per server address: the danger of a
 * malicious settings.json lies in which server credentials are sent to, not
 * in the entry's name, user or database.
 * @param entry The setting connection entry to get the server address for.
 * @returns The server address of the entry.
 */
function getSettingServerAddress(entry: SettingConnectionEntry): string {
  const port = entry.port !== undefined ? `:${entry.port}` : '';
  return `${entry.scheme}://${entry.host}${port}`;
}

/**
 * Gets the set of approved setting connection server addresses from the global state.
 * @returns A map of approved server addresses.
 */
function getApprovedSettingServers(): Record<string, boolean> {
  const context = getExtensionContext();
  return context.globalState.get(APPROVED_SETTING_SERVERS_KEY, {});
}

/**
 * Saves the set of approved setting connection server addresses in the global state.
 * @param approvedServers A map of approved server addresses.
 * @returns A promise that resolves when the approvals have been saved.
 */
async function saveApprovedSettingServers(
  approvedServers: Record<string, boolean>,
): Promise<void> {
  const context = getExtensionContext();
  await context.globalState.update(
    APPROVED_SETTING_SERVERS_KEY,
    approvedServers,
  );
}

/**
 * Checks whether the user has approved the server address a setting connection
 * points at. The approval is shared by all setting connections with the same
 * server address.
 * @param key The key of the setting connection to check.
 * @returns True if the connection's server address has been approved.
 */
export function isSettingConnectionApproved(key: string): boolean {
  const entry = getSettingConnectionEntryByKey(key);
  if (!entry) {
    return false;
  }

  return !!getApprovedSettingServers()[getSettingServerAddress(entry)];
}

/**
 * Records the user's approval of a setting connection's server address in the
 * global state, so they are not prompted again for connections to that server.
 * @param key The key of the setting connection to approve.
 * @returns A promise that resolves when the approval has been saved.
 */
export async function approveSettingConnection(key: string): Promise<void> {
  const entry = getSettingConnectionEntryByKey(key);
  if (!entry) {
    return;
  }

  const approvedServers = getApprovedSettingServers();
  approvedServers[getSettingServerAddress(entry)] = true;
  await saveApprovedSettingServers(approvedServers);
}

/**
 * Handler for changes to the neo4j.connections setting.
 * Drops the state of entries that no longer exist (disconnecting if one of
 * them was the active connection), removes approvals of server addresses that
 * no entry points at anymore, and refreshes the connections view.
 * Also run on activation, in case the settings changed while the extension
 * was not running.
 * @returns A promise that resolves when the handler has completed.
 */
export async function handleSettingConnectionsChange(): Promise<void> {
  const settingKeys = new Set(
    getSettingConnections().map((connection) => connection.key),
  );
  const states = getSettingConnectionStates();

  for (const key in states) {
    if (!settingKeys.has(key)) {
      if (states[key].state !== 'inactive') {
        await disconnectFromDatabaseAndNotifyLanguageClient();
      }
      delete states[key];
    }
  }

  const settingAddresses = new Set(
    getSettingConnectionEntries().map(getSettingServerAddress),
  );
  const approvedServers = getApprovedSettingServers();
  for (const address in approvedServers) {
    if (!settingAddresses.has(address)) {
      delete approvedServers[address];
    }
  }

  await saveSettingConnectionStates(states);
  await saveApprovedSettingServers(approvedServers);
  await commands.executeCommand(CONSTANTS.COMMANDS.REFRESH_CONNECTIONS_COMMAND);
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

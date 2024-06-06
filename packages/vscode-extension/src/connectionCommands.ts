import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import { commands, window, workspace } from 'vscode';
import { getConnectionString, getCredentials } from './connectionHelpers';
import { GlobalStateManager } from './globalStateManager';
import { LangugageClientManager, MethodName } from './languageClientManager';
import { SecretStorageManager } from './secretStorageManager';
import { TransientConnectionManager } from './transientConnectionManager';
import { Connection } from './types/connection';

export {
  testConnection,
  addConnection,
  deleteConnection,
  updateConnection,
  toggleConnection,
  listConnectionProperties,
  updateLanguageClientConfig,
};

async function testConnection(connection: Connection): Promise<boolean> {
  const url = getConnectionString(connection);
  const credentials = getCredentials(connection);
  const success = await TransientConnectionManager.instance.testConnection(
    url,
    credentials,
  );
  success
    ? void window.showInformationMessage('Connection successful')
    : void window.showErrorMessage('Connection failed');

  return success;
}

async function addConnection(connection: Connection): Promise<void> {
  const { password } = getCredentials(connection);
  await updateState(connection, password);
  await commands.executeCommand('neo4j.refreshConnections');
}

async function toggleConnection(
  key: string,
  connected: boolean,
): Promise<void> {
  await GlobalStateManager.instance.toggleConnection(key, connected);
  const neo4jSettings = await getNeo4jSettings(key);
  await notifyLanguageClient(neo4jSettings, MethodName.ConnectionUpdated);
}

async function updateConnection(key: string): Promise<void> {
  const neo4jSettings = await getNeo4jSettings(key);
  // only refresh the language client if we've updated the current connection?
  await notifyLanguageClient(neo4jSettings, MethodName.ConnectionUpdated);
}

async function deleteConnection(key: string): Promise<void> {
  const neo4jSettings = await getNeo4jSettings(key);
  await GlobalStateManager.instance.deleteConnection(key);
  await notifyLanguageClient(neo4jSettings, MethodName.ConnectionDeleted);
  void window.showInformationMessage('Connection deleted');
}

async function listConnectionProperties(
  key: string,
): Promise<{ labels: string[]; relationshipTypes: string[] }> {
  const connection = GlobalStateManager.instance.getConnection(key);
  const url = getConnectionString(connection);
  const credentials = getCredentials(connection);
  return await TransientConnectionManager.instance.getDatabaseDataSummary(
    url,
    credentials,
    connection.database,
  );
}

async function updateLanguageClientConfig(key: string): Promise<void> {
  const settings = await getNeo4jSettings(key);
  await notifyLanguageClient(settings, MethodName.ConnectionUpdated);
}

async function getNeo4jSettings(key: string): Promise<Neo4jSettings> {
  const { scheme, host, port, database, user, connected } =
    GlobalStateManager.instance.getConnection(key);

  const trace = workspace
    .getConfiguration('neo4j')
    .get<{ server: 'off' | 'messages' | 'verbose' }>('trace') ?? {
    server: 'off',
  };

  const password = await SecretStorageManager.instance.getPasswordForConnection(
    key,
  );

  const url = `${scheme}${host}:${port}}`;
  const credentials = { username: user, password };

  return {
    trace: trace,
    connect: connected,
    connectURL: url,
    database: database,
    user: credentials.username,
    password: credentials.password,
  };
}

async function notifyLanguageClient(
  settings: Neo4jSettings,
  method: MethodName,
) {
  await LangugageClientManager.instance.dispatchNotification(method, settings);
}

async function updateState(connection: Connection, password: string) {
  await GlobalStateManager.instance.setConnection(connection);
  await SecretStorageManager.instance.setPasswordForConnection(
    connection.key,
    password,
  );
}

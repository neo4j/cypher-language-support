import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import { TransientConnection } from '@neo4j-cypher/schema-poller';
import { commands, window, workspace } from 'vscode';
import { getConnectionString, getCredentials } from './connectionHelpers';
import { GlobalStateManager } from './globalStateManager';
import { LangugageClientManager } from './languageClientManager';
import { PersistentConnectionManager } from './persistentConnectionManager';
import { SecretStorageManager } from './secretStorageManager';
import { Connection } from './types/connection';

export async function testConnection(connection: Connection): Promise<boolean> {
  const url = getConnectionString(connection);
  const credentials = getCredentials(connection);
  const transientConnection = new TransientConnection();
  const success = await transientConnection.testConnection(url, credentials, {
    appName: 'vscode-extension',
  });

  success
    ? void window.showInformationMessage('Connection successful')
    : void window.showErrorMessage('Connection failed');

  return success;
}

export async function addConnection(connection: Connection): Promise<void> {
  const { password } = getCredentials(connection);
  await updateState(connection, password);
  await commands.executeCommand('neo4j.connect-to-database', connection.key);
  await commands.executeCommand('neo4j.refresh-connections');
}

export async function updateLanguageClientConfig(key: string): Promise<void> {
  const settings = await getNeo4jSettings(key);
  await notifiyLanguageClient(settings);
}

export async function changeDatabaseConnection(key: string): Promise<void> {
  const neo4jSettings = await getNeo4jSettings(key);

  const currentDatabase =
    PersistentConnectionManager.instance.currentDatabase();

  if (currentDatabase === neo4jSettings.database) {
    return;
  }

  const successful = await PersistentConnectionManager.instance.connect(
    neo4jSettings.connectURL,
    { username: neo4jSettings.user, password: neo4jSettings.password },
    { appName: 'vscode-extension' },
    neo4jSettings.database,
  );

  if (successful) {
    await notifiyLanguageClient(neo4jSettings);
    if (neo4jSettings.connect) {
      void window.showInformationMessage('Established connection to Neo4j');
    }
  } else {
    void window.showErrorMessage('Unable to connect to Neo4j');
  }
}

async function getNeo4jSettings(key: string): Promise<Neo4jSettings> {
  const { scheme, host, port, database, user } =
    GlobalStateManager.instance.getConnection(key);

  const connect =
    workspace.getConfiguration('neo4j').get<boolean>('connect') ?? false;

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
    connect: connect,
    connectURL: url,
    database: database,
    user: credentials.username,
    password: credentials.password,
  };
}

async function notifiyLanguageClient(settings: Neo4jSettings) {
  await LangugageClientManager.instance.dispatchNotification(
    'connectionChanged',
    settings,
  );
}

async function updateState(connection: Connection, password: string) {
  await GlobalStateManager.instance.setConnection(connection);
  await SecretStorageManager.instance.setPasswordForConnection(
    connection.key,
    password,
  );
}

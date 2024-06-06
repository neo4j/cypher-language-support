import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import { queries } from '@neo4j-cypher/schema-poller';
import { Driver } from 'neo4j-driver';
import { commands, window, workspace } from 'vscode';
import { getCredentials } from '../helpers/connectionHelpers';
import {
  GlobalStateManager,
  LangugageClientManager,
  SecretStorageManager,
} from '../managers';
import { DatabaseDriverManager } from '../managers/databaseDriverManager';
import { Connection, MethodName } from '../types';

const CONNECTION_FAILED_MESSAGE: string = 'Connection to Neo4j failed';

async function acquireDriver(connection: Connection): Promise<Driver> {
  return await DatabaseDriverManager.instance.acquireDriver(connection);
}

export async function testConnection(connection: Connection): Promise<boolean> {
  const driver = await acquireDriver(connection);

  if (driver) {
    void window.showInformationMessage('Connection successful');
    return true;
  }

  void window.showErrorMessage(CONNECTION_FAILED_MESSAGE);
  return false;
}

export async function addConnection(connection: Connection): Promise<void> {
  const { password } = getCredentials(connection);
  const driver = await acquireDriver(connection);

  if (driver) {
    await updateState(connection, password);
    await commands.executeCommand('neo4j.refreshConnections');
    if (connection.connected) {
      await DatabaseDriverManager.instance.updateDriver(connection);
      await updateLanguageClientConfig(connection.key);
    }
  } else {
    void window.showErrorMessage(CONNECTION_FAILED_MESSAGE);
  }
}

export async function toggleConnection(
  key: string,
  connected: boolean,
): Promise<void> {
  const connection = GlobalStateManager.instance.getConnection(key);

  if (connected) {
    const driver = await acquireDriver(connection);
    if (!driver) {
      void window.showErrorMessage(CONNECTION_FAILED_MESSAGE);
      return;
    }
  }

  await GlobalStateManager.instance.toggleConnection(key, connected);
  const neo4jSettings = await getNeo4jSettings(key);
  await notifyLanguageClient(neo4jSettings, MethodName.ConnectionUpdated);
}

export async function deleteConnection(key: string): Promise<void> {
  const neo4jSettings = await getNeo4jSettings(key);
  await GlobalStateManager.instance.deleteConnection(key);
  await notifyLanguageClient(neo4jSettings, MethodName.ConnectionDeleted);
  void window.showInformationMessage('Connection deleted');
}

export async function getConnectionProperties(
  key: string,
): Promise<{ labels: string[]; relationshipTypes: string[] }> {
  const connection = GlobalStateManager.instance.getConnection(key);
  const driver = await DatabaseDriverManager.instance.acquireDriver(connection);
  const { query, queryConfig } = queries.getDataSummary(connection.database);

  if (driver) {
    const { labels, relationshipTypes } = await driver.executeQuery(
      query,
      {},
      queryConfig,
    );
    return { labels, relationshipTypes };
  } else {
    void window.showErrorMessage(CONNECTION_FAILED_MESSAGE);
  }

  return { labels: [], relationshipTypes: [] };
}

export async function updateLanguageClientConfig(key: string): Promise<void> {
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

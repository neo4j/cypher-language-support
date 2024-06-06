import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import { workspace } from 'vscode';
import { DatabaseDriverManager } from '../managers/databaseDriverManager';
import { LangugageClientManager } from '../managers/languageClientManager';
import { ConnectionRepository } from '../repositories/connectionRepository';
import { MethodName } from '../types';
import { Connection, getConnectionString } from '../types/connection';

export async function testConnection(
  connection: Connection,
  password: string,
): Promise<boolean> {
  return await DatabaseDriverManager.instance.ensureDriver(
    connection,
    password,
  );
}

export async function addOrUpdateConnection(
  connection: Connection,
  password: string,
): Promise<boolean> {
  if (await DatabaseDriverManager.instance.ensureDriver(connection, password)) {
    await ConnectionRepository.instance.setConnection(connection, password);
    if (connection.connected) {
      await DatabaseDriverManager.instance.updateDriver(connection, password);
      await notifyLanguageClient(connection.key, MethodName.ConnectionUpdated);
    }
    return true;
  }

  return false;
}

export async function toggleConnection(
  key: string,
  connected: boolean,
): Promise<boolean> {
  const connection = ConnectionRepository.instance.getConnection(key);
  const password = await ConnectionRepository.instance.getPasswordForConnection(
    key,
  );
  if (await DatabaseDriverManager.instance.ensureDriver(connection, password)) {
    await ConnectionRepository.instance.toggleConnection(key, connected);
    await notifyLanguageClient(key, MethodName.ConnectionUpdated);
    return true;
  }
  return false;
}

export async function deleteConnection(key: string): Promise<void> {
  await ConnectionRepository.instance.deleteConnection(key);
  await notifyLanguageClient(key, MethodName.ConnectionDeleted);
}

export async function notifyLanguageClient(key: string, method: MethodName) {
  const settings = await getLanguageClientConnectionSettings(key);
  await LangugageClientManager.instance.sendNotification(method, settings);
}

async function getLanguageClientConnectionSettings(
  key: string,
): Promise<Neo4jSettings> {
  const connection = ConnectionRepository.instance.getConnection(key);

  const trace = workspace
    .getConfiguration('neo4j')
    .get<{ server: 'off' | 'messages' | 'verbose' }>('trace') ?? {
    server: 'off',
  };

  const password = await ConnectionRepository.instance.getPasswordForConnection(
    key,
  );

  return {
    trace: trace,
    connect: connection.connected,
    connectURL: getConnectionString(connection),
    database: connection.database,
    user: connection.user,
    password: password,
  };
}

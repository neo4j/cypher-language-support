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
      await notifyLanguageClient(connection, MethodName.ConnectionUpdated);
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
    await notifyLanguageClient(connection, MethodName.ConnectionUpdated);
    return true;
  }
  return false;
}

export async function deleteConnection(key: string): Promise<void> {
  const connection = ConnectionRepository.instance.getConnection(key);
  await ConnectionRepository.instance.deleteConnection(key);
  await notifyLanguageClient(connection, MethodName.ConnectionDeleted);
}

export async function notifyLanguageClient(
  connection: Connection,
  method: MethodName,
) {
  const settings = await getLanguageClientConnectionSettings(connection);
  await LangugageClientManager.instance.sendNotification(method, settings);
}

async function getLanguageClientConnectionSettings(
  connection: Connection,
): Promise<Neo4jSettings> {
  const trace = workspace
    .getConfiguration('neo4j')
    .get<{ server: 'off' | 'messages' | 'verbose' }>('trace') ?? {
    server: 'off',
  };

  const password = await ConnectionRepository.instance.getPasswordForConnection(
    connection.key,
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

import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import { workspace } from 'vscode';
import { LangugageClientManager } from '../managers/languageClientManager';
import { PersistentConnectionManager } from '../managers/persistentConnectionManager';
import { ConnectionRepository } from '../repositories/connectionRepository';
import { Connection, getConnectionString } from '../types/connection';
import { MethodName } from '../types/methodName';

export async function testConnection(
  connection: Connection,
  password: string,
): Promise<boolean> {
  return await PersistentConnectionManager.instance.connectionIsSuccessful(
    connection,
    password,
  );
}

export async function addOrUpdateConnection(
  connection: Connection,
  password: string,
): Promise<boolean> {
  if (
    await PersistentConnectionManager.instance.connectionIsSuccessful(
      connection,
      password,
    )
  ) {
    await ConnectionRepository.instance.setConnection(connection, password);
    if (connection.connected) {
      await PersistentConnectionManager.instance.updateConnection(
        connection,
        password,
      );
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
  if (
    await PersistentConnectionManager.instance.connectionIsSuccessful(
      connection,
      password,
    )
  ) {
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
  await PersistentConnectionManager.instance.closeConnection();
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

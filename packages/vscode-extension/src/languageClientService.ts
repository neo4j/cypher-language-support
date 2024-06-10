import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import { workspace } from 'vscode';
import { getLanguageClient } from './appContext';
import {
  Connection,
  getConnectionString,
  getPasswordForConnection,
} from './connection';

export enum MethodName {
  ConnectionUpdated = 'connectionUpdated',
  ConnectionDeleted = 'connectionDeleted',
}

export async function sendNotificationToLanguageClient(
  methodName: MethodName,
  connection: Connection,
) {
  const languageClient = getLanguageClient();
  const settings = await getLanguageClientConnectionSettings(connection);
  await languageClient.sendNotification(methodName, settings);
}

async function getLanguageClientConnectionSettings(
  connection: Connection,
): Promise<Neo4jSettings> {
  const trace = workspace
    .getConfiguration('neo4j')
    .get<{ server: 'off' | 'messages' | 'verbose' }>('trace') ?? {
    server: 'off',
  };

  const password = await getPasswordForConnection(connection.key);

  return {
    connectionKey: connection.key,
    trace: trace,
    connect: connection.connect,
    connectURL: getConnectionString(connection),
    database: connection.database,
    user: connection.user,
    password: password,
  };
}

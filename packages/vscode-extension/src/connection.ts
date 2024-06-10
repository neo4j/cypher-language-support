import {
  Neo4jDataSummary,
  testConnectionTransiently,
} from '@neo4j-cypher/schema-poller';
import { getContext } from './appContext';
import {
  MethodName,
  sendNotificationToLanguageClient,
} from './languageClientService';

export type Connection = {
  key: string;
  name: string;
  scheme: string;
  host: string;
  port: string;
  user: string;
  database: string;
  connect: boolean;
  default: boolean;
  dataSummary: Neo4jDataSummary;
};

type Connections = {
  [key: string]: Connection | null;
};

const CONNECTIONS_KEY: string = 'connections';

export async function testConnection(
  connection: Connection,
  password: string,
): Promise<boolean> {
  return await testConnectionTransiently(
    getConnectionString(connection),
    {
      username: connection.user,
      password: password,
    },
    {
      appName: 'vscode-extension',
    },
  );
}

export function getCurrentConnection(): Connection | null {
  return Object.values(getConnections()).find(
    (connection) => connection.connect,
  );
}

// Artificially limit this to a single connection for now
export function getAllConnections(): Connection[] {
  return [Object.values(getConnections() || [])[0]];
}

export function getConnection(key: string): Connection | null {
  const connections = getConnections();
  return connections[key];
}

export async function deleteConnection(key: string): Promise<void> {
  const connections = getConnections();
  const connection = connections[key];
  delete connections[key];
  await updateConnections(connections);
  await deletePassword(key);
  await sendNotification(MethodName.ConnectionDeleted, connection);
}

export async function saveConnection(
  connection: Connection,
  password: string,
  isNew: boolean,
): Promise<void> {
  const connections = getConnections();

  if (isNew) {
    connection.connect = true;
  }

  connections[connection.key] = { ...connection };

  await updateConnections(connections);
  await savePassword(connection.key, password);

  if (connection.connect) {
    await sendNotification(MethodName.ConnectionUpdated, connection);
  }
}

export async function updateConnectionDataSummary(
  data: Neo4jDataSummary,
): Promise<void> {
  if (Object.hasOwn(data, 'labels')) {
    const connections = getConnections();
    let connection = getCurrentConnection();
    connection = { ...connection, dataSummary: data };
    connections[connection.key] = connection;
    await updateConnections(connections);
  }
}

export async function toggleConnection(key: string): Promise<void> {
  const connections = getConnections();
  let connection = connections[key];
  connection = { ...connection, connect: !connection.connect };
  connections[key] = connection;
  await updateConnections(connections);
  await sendNotification(MethodName.ConnectionUpdated, connection);
}

export async function getPasswordForConnection(key: string): Promise<string> {
  const context = getContext();
  return await context.secrets.get(key);
}

export function getConnectionDataSummary(key: string): Neo4jDataSummary {
  const connection = getConnection(key);

  if (!connection) {
    return { labels: [], relationshipTypes: [], propertyKeys: [] };
  }

  return {
    labels: connection.dataSummary?.labels ?? [],
    relationshipTypes: connection.dataSummary?.relationshipTypes ?? [],
    propertyKeys: [],
  };
}

export function getConnectionString(connection: Connection): string {
  return `${connection.scheme}${connection.host}:${connection.port}`;
}

async function updateConnections(connections: Connections): Promise<void> {
  const context = getContext();
  await context.globalState.update(CONNECTIONS_KEY, connections);
}

async function savePassword(key: string, password: string): Promise<void> {
  const context = getContext();
  await context.secrets.store(key, password);
}

async function deletePassword(key: string): Promise<void> {
  const context = getContext();
  await context.secrets.delete(key);
}

function getConnections(): Connections {
  const context = getContext();
  return context.globalState.get(CONNECTIONS_KEY, {});
}

async function sendNotification(
  methodName: MethodName,
  connection: Connection,
): Promise<void> {
  await sendNotificationToLanguageClient(methodName, connection);
}

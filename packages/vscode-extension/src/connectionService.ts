import { getExtensionContext } from './contextService';
import {
  MethodName,
  sendNotificationToLanguageClient,
} from './languageClientService';

export type Scheme = 'neo4j' | 'neo4j+s' | 'bolt' | 'bolt+s';

export type Connection = {
  key: string;
  name: string;
  scheme: Scheme;
  host: string;
  port?: string | undefined;
  user: string;
  database: string;
  connect: boolean;
};

export type Connections = {
  [key: string]: Connection | null;
};

const CONNECTIONS_KEY: string = 'connections';

export function getCurrentConnection(): Connection | null {
  return (
    Object.values(getConnections()).find((connection) => connection.connect) ??
    null
  );
}

// Artificially limit this to a single connection for now
export function getAllConnections(): Connection[] {
  const connections = Object.values(getConnections());
  return connections.length ? [connections[0]] : [];
}

export function getConnection(key: string): Connection | null {
  const connections = getConnections();
  return connections[key] ?? null;
}

export async function deleteConnection(key: string): Promise<void> {
  const connections = getConnections();
  let connection = connections[key];
  if (connection) {
    connection = { ...connection, connect: false };
    delete connections[key];
    await updateConnections(connections);
    await deletePassword(key);
    await sendNotification(MethodName.ConnectionDeleted, connection);
  }
}

export async function saveConnection(
  connection: Connection,
  password: string,
  isNew: boolean,
): Promise<void> {
  let connections = getConnections();

  if (isNew) {
    connection.connect = true;
  }

  connections = connection.connect
    ? resetAllConnections(connections)
    : connections;

  connections = {
    ...connections,
    [connection.key]: connection,
  };

  await updateConnections(connections);
  await savePassword(connection.key, password);

  if (connection.connect) {
    await sendNotification(MethodName.ConnectionUpdated, connection);
  }
}

export async function toggleConnection(key: string): Promise<void> {
  let connections = getConnections();
  let connection = connections[key];

  if (!connection) {
    return;
  }

  const connect = !connection.connect;

  connections = Object.fromEntries(
    Object.entries(connections).map(([connectionKey, connectionValue]) => [
      connectionKey,
      {
        ...connectionValue,
        connect: connectionKey === key ? connect : !connect,
      },
    ]),
  );

  connection = connections[key];

  await updateConnections(connections);
  await sendNotification(MethodName.ConnectionUpdated, connection);
}

export async function getPasswordForConnection(
  key: string,
): Promise<string | null> {
  const context = getExtensionContext();
  return (await context.secrets.get(key)) ?? null;
}

export function getConnectionString(connection: Connection): string | null {
  if (connection) {
    return connection.port
      ? `${connection.scheme}://${connection.host}:${connection.port}`
      : `${connection.scheme}://${connection.host}`;
  }

  return null;
}

function resetAllConnections(connections: Connections): Connections {
  return Object.fromEntries(
    Object.entries(connections).map(([key, connection]) => [
      key,
      { ...connection, connect: false },
    ]),
  );
}

async function updateConnections(connections: Connections): Promise<void> {
  const context = getExtensionContext();
  await context.globalState.update(CONNECTIONS_KEY, connections);
}

async function savePassword(key: string, password: string): Promise<void> {
  const context = getExtensionContext();
  await context.secrets.store(key, password);
}

async function deletePassword(key: string): Promise<void> {
  const context = getExtensionContext();
  await context.secrets.delete(key);
}

function getConnections(): Connections {
  const context = getExtensionContext();
  return context.globalState.get(CONNECTIONS_KEY, {});
}

async function sendNotification(
  methodName: MethodName,
  connection: Connection,
): Promise<void> {
  await sendNotificationToLanguageClient(methodName, connection);
}
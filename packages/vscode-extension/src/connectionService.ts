import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import { workspace } from 'vscode';
import { getConnectionManager, getExtensionContext } from './contextService';
import {
  MethodName,
  sendNotificationToLanguageClient,
} from './languageClientService';

export type Scheme = 'neo4j' | 'neo4j+s' | 'bolt' | 'bolt+s';

export type State =
  | 'connected'
  | 'connecting'
  | 'reconnecting'
  | 'disconnected';

export type Connection = {
  key: string;
  name: string;
  scheme: Scheme;
  host: string;
  port?: string | undefined;
  user: string;
  database: string;
  connect: boolean;
  state: State;
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
  const connection = connections[key];
  if (connection) {
    delete connections[key];
    await updateConnections(connections);
    await deletePassword(key);
    await updateDbmsConnection('connectionDeleted', {
      ...connection,
      connect: false,
    });
  }
}

export async function saveConnection(
  connection: Connection | null,
  password: string,
): Promise<void> {
  if (!connection) {
    return;
  }

  const connections = connection.connect
    ? disconnectAllAndGetConnections()
    : getConnections();

  connections[connection.key] = connection;

  await updateConnections(connections);
  await savePassword(connection.key, password);

  if (connection.connect) {
    await updateDbmsConnection('connectionUpdated', connection);
  }
}

export async function updateConnectionState(
  connection: Connection,
): Promise<void> {
  if (!connection) {
    return;
  }

  const connections = getConnections();
  connections[connection.key] = connection;

  await updateConnections(connections);
}

export async function toggleConnection(
  key: string,
  connect: boolean,
): Promise<void> {
  const connections = disconnectAllAndGetConnections();

  const connection = connections[key];

  if (!connection) {
    return;
  }

  const state: State = connect ? 'connecting' : 'disconnected';

  const toggledConnection = {
    ...connection,
    connect: connect,
    state: state,
  };
  connections[key] = toggledConnection;

  await updateConnections(connections);
  await updateDbmsConnection('connectionUpdated', toggledConnection);
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

export async function updateDbmsConnection(
  methodName: MethodName,
  connection: Connection,
): Promise<void> {
  const settings = await getConnectionSettings(connection);
  const connectionManager = getConnectionManager();

  await sendNotificationToLanguageClient(methodName, settings);

  connectionManager.disconnect();

  if (connection.connect) {
    await connectionManager.connect(settings);
  }
}

export async function getConnectionSettings(
  connection: Connection,
): Promise<Neo4jSettings> {
  const trace = workspace
    .getConfiguration('neo4j')
    .get<{ server: 'off' | 'messages' | 'verbose' }>('trace') ?? {
    server: 'off',
  };

  const password = await getPasswordForConnection(connection.key);

  return {
    trace: trace,
    connect: connection.connect,
    connectURL: getConnectionString(connection),
    database: connection.database,
    user: connection.user,
    password: password,
  };
}

function disconnectAllAndGetConnections(): Connections {
  const connections = getConnections();

  for (const key in connections) {
    if (connections[key].connect) {
      connections[key] = {
        ...connections[key],
        connect: false,
        state: 'disconnected',
      };
    }
  }

  return connections;
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

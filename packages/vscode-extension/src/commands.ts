import { window, workspace } from 'vscode';
import { GlobalStateManager } from './globalStateManager';
import { LangugageClientManager } from './languageClientManager';
import { PersistentConnectionManager } from './persistentConnectionManager';
import { SecretStorageManager } from './secretStorageManager';

export async function connectToDatabase(connectionName: string): Promise<void> {
  const { scheme, host, port, database, user } =
    GlobalStateManager.instance.getConnection(connectionName);

  const currentDatabase =
    PersistentConnectionManager.instance.currentDatabase();

  if (currentDatabase === database) {
    return;
  }

  const password = await SecretStorageManager.instance.getPasswordForConnection(
    connectionName,
  );

  const url = `${scheme}${host}:${port}}`;
  const credentials = { username: user, password };
  const config = { appName: 'vscode-extension' };

  const successful = await PersistentConnectionManager.instance.connect(
    url,
    credentials,
    config,
    database,
  );

  if (successful) {
    await notifiyLanguageClient(
      url,
      database,
      credentials.username,
      credentials.password,
    );
    // await commands.executeCommand('neo4j.refresh-connections');
    void window.showInformationMessage('Established connection to Neo4j');
  } else {
    void window.showErrorMessage('Unable to connect to Neo4j');
  }
}

async function notifiyLanguageClient(
  url: string,
  database: string,
  username: string,
  password: string,
) {
  const connect =
    workspace.getConfiguration('neo4j').get<boolean>('connect') ?? false;

  const trace = workspace
    .getConfiguration('neo4j')
    .get<{ server: 'off' | 'messages' | 'verbose' }>('trace') ?? {
    server: 'off',
  };

  await LangugageClientManager.instance.dispatchNotification(
    'connectionChanged',
    {
      trace: trace,
      connect: connect,
      connectUrl: url,
      user: username,
      password: password,
      database: database,
    },
  );
}

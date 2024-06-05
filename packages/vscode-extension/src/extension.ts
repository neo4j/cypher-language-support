import { PersistentConnection } from '@neo4j-cypher/schema-poller';
import * as path from 'path';
import {
  commands,
  ConfigurationChangeEvent,
  ExtensionContext,
  window,
  workspace,
} from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';
import {
  changeDatabaseConnection,
  updateLanguageClientConfig,
} from './commands';
import { ConnectionPanel } from './connectionPanel';
import {
  ConnectionItem,
  ConnectionTreeDataProvider,
} from './connectionTreeDataProvider';
import { GlobalStateManager } from './globalStateManager';
import { LangugageClientManager } from './languageClientManager';
import { PersistentConnectionManager } from './persistentConnectionManager';
import { SecretStorageManager } from './secretStorageManager';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  // The server is implemented in node
  const runServer = context.asAbsolutePath(
    path.join('dist', 'cypher-language-server.js'),
  );
  const debugServer = context.asAbsolutePath(
    path.join('..', 'language-server', 'dist', 'server.js'),
  );

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { module: runServer, transport: TransportKind.ipc },
    debug: {
      module: debugServer,
      transport: TransportKind.ipc,
    },
  };

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for Cypher text documents
    documentSelector: [{ language: 'cypher' }],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher('**/.clientrc'),
    },
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    'neo4j',
    'Cypher Language Client',
    serverOptions,
    clientOptions,
  );

  // Initialize singletons
  GlobalStateManager.instance = new GlobalStateManager(context.globalState);
  SecretStorageManager.instance = new SecretStorageManager(context.secrets);
  LangugageClientManager.instance = new LangugageClientManager(client);
  PersistentConnectionManager.instance = new PersistentConnectionManager(
    new PersistentConnection(),
  );

  // Register our tree view provider to render connections in the sidebar
  const connectionTreeDataProvider = new ConnectionTreeDataProvider();

  // Register commands
  context.subscriptions.push(
    window.registerTreeDataProvider(
      'neo4jConnections',
      connectionTreeDataProvider,
    ),
    commands.registerCommand('neo4j.manageConnection', () => {
      ConnectionPanel.createOrShow(context.extensionUri);
    }),
    commands.registerCommand(
      'neo4j.deleteConnection',
      async (connection: ConnectionItem) => {
        const result = await window.showWarningMessage(
          `Are you sure you want to delete connection ${connection.label}?`,
          { modal: true },
          'Yes',
        );

        if (result === 'Yes') {
          // TODO - Delete connection
        }
      },
    ),
    commands.registerCommand('neo4j.connectToDatabase', async (key: string) => {
      await changeDatabaseConnection(key);
    }),
    commands.registerCommand('neo4j.refreshConnections', () => {
      connectionTreeDataProvider.refresh();
    }),
    workspace.onDidChangeConfiguration(
      async (event: ConfigurationChangeEvent) => {
        if (
          event.affectsConfiguration('neo4j.connect') ||
          event.affectsConfiguration('neo4j.trace.server')
        ) {
          const getCurretConnection =
            GlobalStateManager.instance.getCurrentConnection();
          await updateLanguageClientConfig(getCurretConnection.key);
        }
      },
    ),
  );

  // TODO - Create "Default connection" if the extension has pre-existing settings

  // Start the client. This will also launch the server
  void client.start();
}

export function deactivate(): Promise<void> | undefined {
  PersistentConnectionManager.instance.disconnect();

  if (!client) {
    return undefined;
  }

  return client.stop();
}

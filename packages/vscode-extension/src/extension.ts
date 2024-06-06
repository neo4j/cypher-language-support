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
  deleteConnection,
  toggleConnection,
  updateLanguageClientConfig,
} from './connectionCommands';
import { ConnectionPanel } from './connectionPanel';
import {
  ConnectionItem,
  ConnectionTreeDataProvider,
} from './connectionTreeDataProvider';
import { GlobalStateManager } from './globalStateManager';
import { LangugageClientManager } from './languageClientManager';
import { SecretStorageManager } from './secretStorageManager';
import { TransientConnectionManager } from './transientConnectionManager';

let client: LanguageClient;

export async function activate(context: ExtensionContext) {
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
  TransientConnectionManager.instance = new TransientConnectionManager();

  await GlobalStateManager.instance.resetConnections();

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
          await deleteConnection(connection.key);
          connectionTreeDataProvider.refresh();
        }
      },
    ),
    commands.registerCommand(
      'neo4j.connect',
      async (connection: ConnectionItem) => {
        await toggleConnection(connection.key, true);
        connectionTreeDataProvider.refresh();
      },
    ),
    commands.registerCommand(
      'neo4j.disconnect',
      async (connection: ConnectionItem) => {
        await toggleConnection(connection.key, false);
        connectionTreeDataProvider.refresh();
      },
    ),
    commands.registerCommand('neo4j.refreshConnections', () => {
      connectionTreeDataProvider.refresh();
    }),
    workspace.onDidChangeConfiguration(
      async (event: ConfigurationChangeEvent) => {
        if (event.affectsConfiguration('neo4j.trace.server')) {
          const getCurretConnection =
            GlobalStateManager.instance.getCurrentConnection();
          await updateLanguageClientConfig(getCurretConnection.key);
        }
      },
    ),
  );

  // Start the client. This will also launch the server
  void client.start();
}

export async function deactivate(): Promise<void> | undefined {
  await GlobalStateManager.instance.resetConnections();

  if (!client) {
    return undefined;
  }

  return client.stop();
}

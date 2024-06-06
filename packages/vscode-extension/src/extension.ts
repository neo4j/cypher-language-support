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
import { DatabaseDriverManager } from './managers/databaseDriverManager';
import { LangugageClientManager } from './managers/languageClientManager';
import {
  ConnectionItem,
  ConnectionTreeDataProvider,
} from './providers/connectionTreeDataProvider';
import { ConnectionRepository } from './repositories/connectionRepository';
import {
  deleteConnection,
  notifyLanguageClient,
  toggleConnection,
} from './services/connectionService';
import { MethodName } from './types';
import {
  CONNECTION_FAILED_MESSAGE,
  CONNECT_COMMAND,
  DELETE_CONNECTION_COMMAND,
  DISCONNECT_COMMAND,
  MANAGE_CONNECTION_COMMAND,
  REFRESH_CONNECTIONS_COMMAND,
} from './util/constants';
import { ConnectionPanel } from './webviews/connectionPanel';

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
  LangugageClientManager.instance = new LangugageClientManager(client);
  DatabaseDriverManager.instance = new DatabaseDriverManager();
  ConnectionRepository.instance = new ConnectionRepository(
    context.globalState,
    context.secrets,
  );

  await ConnectionRepository.instance.resetConnections();

  // Register our tree view provider to render connections in the sidebar
  const connectionTreeDataProvider = new ConnectionTreeDataProvider();

  // Register commands
  context.subscriptions.push(
    window.registerTreeDataProvider(
      'neo4jConnections',
      connectionTreeDataProvider,
    ),
    commands.registerCommand(MANAGE_CONNECTION_COMMAND, () => {
      ConnectionPanel.createOrShow(context.extensionUri);
    }),

    commands.registerCommand(
      DELETE_CONNECTION_COMMAND,
      async (connection: ConnectionItem) => {
        const result = await window.showWarningMessage(
          `Are you sure you want to delete connection ${connection.label}?`,
          { modal: true },
          'Yes',
        );

        if (result === 'Yes') {
          await deleteConnection(connection.key);
          connectionTreeDataProvider.refresh();
          void window.showInformationMessage('Connection deleted');
        }
      },
    ),
    commands.registerCommand(
      CONNECT_COMMAND,
      async (connection: ConnectionItem) => {
        if (await toggleConnection(connection.key, true)) {
          connectionTreeDataProvider.refresh();
        } else {
          void window.showErrorMessage(CONNECTION_FAILED_MESSAGE);
        }
      },
    ),
    commands.registerCommand(
      DISCONNECT_COMMAND,
      async (connection: ConnectionItem) => {
        if (await toggleConnection(connection.key, false)) {
          connectionTreeDataProvider.refresh();
        } else {
          void window.showErrorMessage(CONNECTION_FAILED_MESSAGE);
        }
      },
    ),
    commands.registerCommand(REFRESH_CONNECTIONS_COMMAND, () => {
      connectionTreeDataProvider.refresh();
    }),
    workspace.onDidChangeConfiguration(
      async (event: ConfigurationChangeEvent) => {
        if (event.affectsConfiguration('neo4j.trace.server')) {
          const currentConnection =
            ConnectionRepository.instance.getCurrentConnection();
          await notifyLanguageClient(
            currentConnection,
            MethodName.ConnectionUpdated,
          );
        }
      },
    ),
  );

  // Start the client. This will also launch the server
  void client.start();
}

export async function deactivate(): Promise<void> | undefined {
  await ConnectionRepository.instance.resetConnections();

  if (!client) {
    return undefined;
  }

  return client.stop();
}

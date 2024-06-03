import * as path from 'path';
import { commands, ExtensionContext, window, workspace } from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';
import { ConnectionManager } from './ConnectionManager';
import { ConnectionPanel } from './ConnectionPanel';
import { ConnectionTreeDataProvider } from './ConnectionTreeDataProvider';
import { LangugageClientManager } from './LanguageClientManager';
import { SecretsManager } from './SecretsManager';

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

  ConnectionManager.globalState = context.globalState;
  SecretsManager.secrets = context.secrets;
  LangugageClientManager.globalClient = client;

  const connectionTreeDataProvider = new ConnectionTreeDataProvider();
  window.registerTreeDataProvider(
    'neo4j-connections',
    connectionTreeDataProvider,
  );

  context.subscriptions.push(
    commands.registerCommand('neo4j.connect', () => {
      ConnectionPanel.createOrShow(context.extensionUri);
    }),
  );

  // Start the client. This will also launch the server
  void client.start();
}

export function deactivate(): Promise<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}

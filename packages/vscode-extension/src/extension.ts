import * as path from 'path';
import { ExtensionContext, workspace } from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';
import { getCurrentConnection } from './connectionService';
import { setContext } from './contextService';
import {
  MethodName,
  sendNotificationToLanguageClient,
} from './languageClientService';
import { registerDisposables } from './registrationService';

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

  setContext(context, client);

  // Register disposables
  // Command handlers and view registrations
  context.subscriptions.push(...registerDisposables());

  // Start the client. This will also launch the server
  await client.start();

  // Reconnect to a connection if there is one
  await reconnectConnection();
}

export async function deactivate(): Promise<void> | undefined {
  if (!client) {
    return undefined;
  }

  return client.stop();
}

async function reconnectConnection(): Promise<void> {
  const connection = getCurrentConnection();
  if (connection) {
    await sendNotificationToLanguageClient(
      MethodName.ConnectionUpdated,
      connection,
    );
  }
}

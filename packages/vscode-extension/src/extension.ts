import * as path from 'path';
import {
  commands,
  ExtensionContext,
  RelativePattern,
  StatusBarAlignment,
  Uri,
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
  disconnectDatabaseConnectionOnExtensionDeactivation,
  reconnectDatabaseConnectionOnExtensionActivation,
} from './connectionService';
import { getSchemaPoller, setContext } from './contextService';
import { sendParametersToLanguageServer } from './parameterService';
import { registerDisposables } from './registrationService';
import { SymbolTable } from '@neo4j-cypher/language-support';
import { sendNotificationToLanguageClient } from './languageClientService';

let client: LanguageClient;
let symbolTableVersion = 0;

export const linterStatusBarItem = window.createStatusBarItem(
  StatusBarAlignment.Right,
);

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
  const config = workspace.getConfiguration('neo4j.features');
  const schemaBasedPatternCompletions = config.get(
    'schemaBasedPatternCompletions',
    false,
  );

  const serverOptions: ServerOptions = {
    run: {
      module: runServer,
      transport: TransportKind.ipc,
      options: { env: { schemaBasedPatternCompletions } },
    },
    debug: {
      module: debugServer,
      transport: TransportKind.ipc,
      options: { env: { schemaBasedPatternCompletions } },
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

  // Handle any sequence events for activation
  await reconnectDatabaseConnectionOnExtensionActivation();
  await sendParametersToLanguageServer();

  // in developement mode, we manually reload the extension.
  if (process.env.watch === 'true') {
    const watcher = workspace.createFileSystemWatcher(
      new RelativePattern(
        Uri.file(context.asAbsolutePath('dist')),
        'extension.js',
      ),
    );

    watcher.onDidChange(() => {
      void window.showInformationMessage('Extension rebuilt, reloading...');
      void commands.executeCommand<void>(
        'workbench.action.restartExtensionHost',
      );
    });

    context.subscriptions.push(watcher);
  }

  client.onNotification('symbolTableDone', (params) => {
    symbolTableVersion++;
    const symbolTables = (params as { symbolTables: SymbolTable[] })
      .symbolTables;
    void window.showInformationMessage(
      'Calculated symbol table nbr' +
        symbolTableVersion +
        '\n' +
        stringifySymbolTables(symbolTables),
    );
  });

  window.onDidChangeActiveTextEditor((editor) => {
    const doc = editor.document;
    if (doc.languageId === 'cypher') {
      const query = doc.getText();
      const uri = doc.uri.fsPath;
      const schema = getSchemaPoller().metadata?.dbSchema;
      void sendNotificationToLanguageClient('fetchSymbolTable', {
        query,
        uri,
        schema,
      });
    }
  });
}

function stringifySymbolTables(symbolTables: SymbolTable[]): string {
  if (!symbolTables) {
    return '';
  }
  return symbolTables
    .map((symbolTable) => {
      if (symbolTable.length == 0) {
        return '';
      }
      let result = ' [';
      symbolTable.map((symbol) => {
        result += symbol.variable + ': ' + symbol.types.toString() + ', ';
      });
      return result.substring(0, result.length - 2) + ']';
    })
    .toString();
}

export async function deactivate(): Promise<void> | undefined {
  // Handle any sequence events for deactivation
  await disconnectDatabaseConnectionOnExtensionDeactivation();

  if (!client) {
    return undefined;
  }

  return client.stop();
}

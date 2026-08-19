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
  Connection,
  Connections,
  disconnectDatabaseConnectionOnExtensionDeactivation,
  getConnections,
  reconnectDatabaseConnectionOnExtensionActivation,
  Scheme,
} from './connectionService';
import { getSchemaPoller, setContext } from './contextService';
import { sendParametersToLanguageServer } from './parameterService';
import { registerDisposables } from './registrationService';
import { SymbolTable } from '@neo4j-cypher/language-support';
import { sendNotificationToLanguageClient } from './languageClientService';
import { CONSTANTS } from './constants';
import { displayConfirmSettingConnectionPrompt } from './uiUtils.js';

const WELCOME_SHOWN_KEY = 'neo4j.welcomeShown';

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
  // key: string;
  //   scheme: Scheme;
  //   name?: string;
  //   host: string;
  //   port?: string;
  //   user: string;
  //   database?: string;
  //   state: State;

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const config = workspace.getConfiguration('neo4j.features');
  const debugSymbolTable = config.get('debugSymbolTable', false);

  const serverOptions: ServerOptions = {
    run: {
      module: runServer,
      transport: TransportKind.ipc,
      options: { env: { debugSymbolTable } },
    },
    debug: {
      module: debugServer,
      transport: TransportKind.ipc,
      options: { env: { debugSymbolTable } },
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

  // Show the welcome page the first time the extension is activated
  if (!context.globalState.get(WELCOME_SHOWN_KEY, false)) {
    await context.globalState.update(WELCOME_SHOWN_KEY, true);
    await commands.executeCommand(CONSTANTS.COMMANDS.SHOW_WELCOME);
  }

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
  const oldConnections: Connections = getConnections();
  const connections:
    | {
        key: string;
        scheme: Scheme;
        name: string;
        host: string;
        port: string;
        user: string;
        password: string;
      }[]
    | undefined = workspace
    .getConfiguration('neo4j.connections')
    .get('entries');
  if (connections) {
    await Promise.allSettled(
      connections.map(async (cfgConnection) => {
        if (oldConnections[cfgConnection.key]) {
          return;
        }
        const connection: Connection = {
          key: cfgConnection.key,
          scheme: cfgConnection.scheme,
          name: cfgConnection.name,
          host: cfgConnection.host,
          port: cfgConnection.port,
          user: cfgConnection.user,
          state: 'inactive',
        };
        const confirmed =
          await displayConfirmSettingConnectionPrompt(connection);
        if (confirmed) {
          await commands.executeCommand(
            CONSTANTS.COMMANDS.SAVE_CONNECTION_COMMAND,
            connection,
            cfgConnection.password,
          );
        }
      }),
    );
  }
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

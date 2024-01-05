import {
  createConnection,
  Diagnostic,
  DidChangeConfigurationNotification,
  InitializeResult,
  ProposedFeatures,
  SemanticTokensRegistrationOptions,
  SemanticTokensRegistrationType,
  TextDocumentChangeEvent,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';

import { syntaxColouringLegend } from '@neo4j-cypher/language-support';
import { Neo4jSchemaPoller } from '@neo4j-cypher/schema-poller';
import { doAutoCompletion } from './autocompletion';
import { doSignatureHelp } from './signatureHelp';
import { applySyntaxColouringForDocument } from './syntaxColouring';
import { Neo4jSettings } from './types';

const connection = createConnection(ProposedFeatures.all);

import { join } from 'path';
import { MessageChannel, Worker } from 'worker_threads';

let oldWorker: Worker | null;
let nextWorker = new Worker(join(__dirname, 'worker.js'));

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

const neo4jSdk = new Neo4jSchemaPoller();

connection.onInitialize(() => {
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Full,
      // Tell the client what features does the server support
      completionProvider: {
        resolveProvider: false,
        triggerCharacters: ['.'],
      },
      semanticTokensProvider: {
        documentSelector: null,
        legend: syntaxColouringLegend,
        range: false,
        full: {
          delta: false,
        },
      },
      signatureHelpProvider: {
        triggerCharacters: ['(', ',', ')'],
      },
    },
  };

  return result;
});

connection.onInitialized(() => {
  void connection.client.register(DidChangeConfigurationNotification.type, {
    section: 'neo4j',
  });

  const registrationOptions: SemanticTokensRegistrationOptions = {
    documentSelector: null,
    legend: syntaxColouringLegend,
    range: false,
    full: {
      delta: false,
    },
  };
  void connection.client.register(
    SemanticTokensRegistrationType.type,
    registrationOptions,
  );
});

// TODO can we make the semantic analysis cancelable without killing the whole thread?
// TOOD figure out how problematic it is to

let latestVersion: number | null = null;
// Trigger error highlighting on every document change
function handleDocChange(change: TextDocumentChangeEvent<TextDocument>) {
  const { port1, port2 } = new MessageChannel();

  const { document } = change;
  const query = document.getText();

  const requestVersion = document.version;
  latestVersion = requestVersion;
  port2.on('message', (diagnostics: Diagnostic[]) => {
    console.log('document version done', document.version);
    if (requestVersion === latestVersion) {
      void connection.sendDiagnostics({
        uri: document.uri,
        diagnostics: diagnostics,
      });
    }
  });

  void oldWorker?.terminate().then(() => {
    console.log(`worker ${requestVersion} killed.`);
  });

  oldWorker = nextWorker;
  oldWorker.postMessage(
    {
      query,
      port: port1,
      dbSchema: neo4jSdk.metadata?.dbSchema ?? {},
    },
    [port1],
  );

  nextWorker = new Worker(join(__dirname, 'worker.js'));
  console.log('spawn document version', requestVersion);
}

//const debouncedDocChange = debounce(handleDocChange, 200);
const debouncedDocChange = handleDocChange;

documents.onDidChangeContent(debouncedDocChange);

// Trigger the syntax colouring
connection.languages.semanticTokens.on(
  applySyntaxColouringForDocument(documents),
);

// Trigger the signature help, providing info about functions / procedures
connection.onSignatureHelp(doSignatureHelp(documents, neo4jSdk));
// Trigger the auto completion
connection.onCompletion(doAutoCompletion(documents, neo4jSdk));

connection.onDidChangeConfiguration(
  (params: { settings: { neo4j: Neo4jSettings } }) => {
    neo4jSdk.disconnect();

    const neo4jConfig = params.settings.neo4j;
    if (
      neo4jSdk.connection === undefined &&
      neo4jConfig.connect &&
      neo4jConfig.password &&
      neo4jConfig.URL &&
      neo4jConfig.user
    ) {
      void neo4jSdk.persistentConnect(
        neo4jConfig.URL,
        {
          username: neo4jConfig.user,
          password: neo4jConfig.password,
        },
        { appName: 'cypher-language-server' },
      );
    }
  },
);

documents.listen(connection);
connection.listen();

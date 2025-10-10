import {
  createConnection,
  Diagnostic,
  DidChangeConfigurationNotification,
  InitializeResult,
  ProposedFeatures,
  SemanticTokensRegistrationOptions,
  SemanticTokensRegistrationType,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  parserWrapper,
  SymbolTable,
  syntaxColouringLegend,
} from '@neo4j-cypher/language-support';
import { Neo4jSchemaPoller } from '@neo4j-cypher/query-tools';
import { doAutoCompletion } from './autocompletion';
import { formatDocument } from './formatting';
import { cleanupWorkers, lintDocument, setLintWorker } from './linting';
import { doSignatureHelp } from './signatureHelp';
import { applySyntaxColouringForDocument } from './syntaxColouring';
import {
  LintWorkerSettings,
  Neo4jConnectionSettings,
  Neo4jParameters,
  Neo4jSettings,
} from './types';
import workerpool from 'workerpool';
import { join } from 'path';
import { LinterTask, LintWorker } from '@neo4j-cypher/lint-worker';

const connection = createConnection(ProposedFeatures.all);
let settings: Neo4jSettings | undefined = undefined;

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
const neo4jSchemaPoller = new Neo4jSchemaPoller();

const defaultWorkerPath = join(__dirname, 'lintWorker.cjs');

const symbolTablePool = workerpool.pool(defaultWorkerPath, {
  maxWorkers: 1,
  workerTerminateTimeout: 2000,
});

let lastSemanticJob: LinterTask | undefined;

let nextJob: { document: TextDocument; neo4j: Neo4jSchemaPoller };

async function getSymbolTable(
  document: TextDocument,
  neo4j: Neo4jSchemaPoller,
) {
  const query = document.getText();
  document.version;
  const dbSchema = neo4j.metadata?.dbSchema ?? {};
  if (lastSemanticJob === undefined || lastSemanticJob.resolved) {
    nextJob = undefined;
    const proxyWorker =
      (await symbolTablePool.proxy()) as unknown as LintWorker;

    lastSemanticJob = proxyWorker.lintCypherQuery(query, dbSchema);
    const documentVersion = document.version;
    const result = await lastSemanticJob;
    //If we get a symboltable, we want to pass it on, but not if we've moved documents during a slow calculation
    if (
      result.symbolTables &&
      !(nextJob && nextJob.document.uri != document.uri)
    ) {
      parserWrapper.setSymbolsInfo(
        {
          query,
          symbolTables: result.symbolTables,
        },
        documentVersion,
        async (symbolTables: SymbolTable[]) =>
          await connection.sendNotification('symbolTableDone', {
            symbolTables,
          }),
      );
      //If any jobs were requested during our calculation, the latest one will be in nextJob
      if (nextJob) {
        const { document, neo4j } = nextJob;
        void getSymbolTable(document, neo4j);
      }
    }
  } else {
    nextJob = { document, neo4j };
  }
}

async function lintSingleDocument(document: TextDocument): Promise<void> {
  void getSymbolTable(document, neo4jSchemaPoller);
  if (settings?.features?.linting) {
    return lintDocument(
      document,
      (diagnostics: Diagnostic[]) => {
        void connection.sendDiagnostics({
          uri: document.uri,
          diagnostics,
        });
      },
      async (symbolTables: SymbolTable[]) =>
        await connection.sendNotification('symbolTableDone', {
          symbolTables: symbolTables,
        }),
      neo4jSchemaPoller,
    );
  } else {
    void connection.sendDiagnostics({
      uri: document.uri,
      diagnostics: [],
    });
  }
}

function relintAllDocuments() {
  void documents.all().map(lintSingleDocument);
}

connection.onInitialize(() => {
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Full,
      // Tell the client what features does the server support
      completionProvider: {
        resolveProvider: false,
        triggerCharacters: ['.', ':', '{', '$', ')', ' '],
      },
      semanticTokensProvider: {
        documentSelector: [{ language: 'cypher' }],
        legend: syntaxColouringLegend,
        range: false,
        full: {
          delta: false,
        },
      },
      signatureHelpProvider: {
        triggerCharacters: ['(', ',', ')'],
      },
      documentFormattingProvider: true,
    },
  };

  return result;
});

connection.onInitialized(() => {
  void connection.client.register(DidChangeConfigurationNotification.type, {
    section: 'neo4j',
  });

  const registrationOptions: SemanticTokensRegistrationOptions = {
    documentSelector: [{ language: 'cypher' }],
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

connection.onDidChangeConfiguration((params) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  settings = params.settings?.neo4j as Neo4jSettings;
  relintAllDocuments();
});

documents.onDidChangeContent((change) => lintSingleDocument(change.document));

// Trigger the syntax colouring
connection.languages.semanticTokens.on(
  applySyntaxColouringForDocument(documents),
);

// Trigger the signature help, providing info about functions / procedures
connection.onSignatureHelp(doSignatureHelp(documents, neo4jSchemaPoller));
// Trigger the auto completion
connection.onCompletion(doAutoCompletion(documents, neo4jSchemaPoller));

connection.onNotification(
  'updateLintWorker',
  (linterSettings: LintWorkerSettings) => {
    const lintWorkerPath = linterSettings.lintWorkerPath;
    const linterVersion = linterSettings.linterVersion;

    void (async () => {
      await setLintWorker(lintWorkerPath, linterVersion);
      relintAllDocuments();
    })();
  },
);

connection.onNotification(
  'connectionUpdated',
  (connectionSettings: Neo4jConnectionSettings) => {
    changeConnection(connectionSettings);
    neo4jSchemaPoller.events.once('schemaFetched', relintAllDocuments);
  },
);

connection.onNotification('updateParameters', (parameters: Neo4jParameters) => {
  neo4jSchemaPoller.setParameters(parameters);
  relintAllDocuments();
});

connection.onDocumentFormatting((params) => {
  return formatDocument(params, documents);
});

connection.onNotification('connectionDisconnected', () => {
  disconnect();
  relintAllDocuments();
});

documents.listen(connection);

connection.listen();

connection.onExit(() => {
  void cleanupWorkers();
});

const changeConnection = (connectionSettings: Neo4jConnectionSettings) => {
  disconnect();

  if (
    neo4jSchemaPoller.connection === undefined &&
    connectionSettings.connect &&
    connectionSettings.password &&
    connectionSettings.connectURL &&
    connectionSettings.user
  ) {
    void neo4jSchemaPoller.persistentConnect(
      connectionSettings.connectURL,
      {
        username: connectionSettings.user,
        password: connectionSettings.password,
      },
      { appName: 'cypher-language-server' },
      connectionSettings.database,
    );
  }
};

const disconnect = () => {
  neo4jSchemaPoller.disconnect();
};

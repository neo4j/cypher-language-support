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
  DbSchema,
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
import { LintWorker } from '@neo4j-cypher/lint-worker';

class SymbolFetcher {
  private processing = false;
  private nextJob: {
    query: string;
    uri: string;
    schema: DbSchema;
  };
  private defaultWorkerPath = join(__dirname, 'lintWorker.cjs');
  private symbolTablePool = workerpool.pool(this.defaultWorkerPath, {
    maxWorkers: 1,
    workerTerminateTimeout: 0,
  });

  public queueSymbolJob(query: string, uri: string, schema: DbSchema) {
    this.nextJob = { query, uri, schema };
    if (!this.processing) {
      void this.processJobQueue();
    }
  }

  private async processJobQueue() {
    this.processing = true;
    const proxyWorker =
      (await this.symbolTablePool.proxy()) as unknown as LintWorker;
    while (this.nextJob) {
      try {
        const query = this.nextJob.query;
        const dbSchema = this.nextJob.schema;
        const docUri = this.nextJob.uri;
        this.nextJob = undefined;

        const lastSemanticJob = proxyWorker.lintCypherQuery(query, dbSchema);

        const result = await lastSemanticJob;
        if (
          //if this.nextJob has new doc, our result is no longer valid
          result.symbolTables &&
          !(this.nextJob && this.nextJob.uri != docUri)
        ) {
          parserWrapper.setSymbolsInfo(
            {
              query,
              symbolTables: result.symbolTables,
            },
            async (symbolTables: SymbolTable[]) =>
              await connection.sendNotification('symbolTableDone', {
                symbolTables,
              }),
          );
        }
      } catch (e) {
        //eslint-disable-next-line
        console.log('Symbol table calculation failed');
      }
    }
    this.processing = false;
  }
}

const connection = createConnection(ProposedFeatures.all);
let settings: Neo4jSettings | undefined = undefined;

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
const neo4jSchemaPoller = new Neo4jSchemaPoller();
const symbolFetcher = new SymbolFetcher();

async function lintSingleDocument(document: TextDocument): Promise<void> {
  symbolFetcher.queueSymbolJob(
    document.getText(),
    document.uri,
    neo4jSchemaPoller?.metadata?.dbSchema,
  );
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

connection.onNotification(
  'fetchSymbolTable',
  (params: {
    query: string;
    uri: string;
    version: number;
    schema: DbSchema;
  }) => {
    neo4jSchemaPoller.events.once(
      'schemaFetched',
      void symbolFetcher.queueSymbolJob(
        params.query,
        params.uri,
        params.schema,
      ),
    );
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

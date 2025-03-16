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
  syntaxColouringLegend,
  _internalFeatureFlags,
} from '@neo4j-cypher/language-support';
import { Neo4jSchemaPoller } from '@neo4j-cypher/schema-poller';
import { doAutoCompletion } from './autocompletion';
import { formatDocument } from './formatting';
import { cleanupWorkers, lintDocument } from './linting';
import { doSignatureHelp } from './signatureHelp';
import { applySyntaxColouringForDocument } from './syntaxColouring';
import {
  Neo4jConnectionSettings,
  Neo4jParameters,
  Neo4jSettings,
} from './types';

if (process.env.CYPHER_25 === 'true') {
  _internalFeatureFlags.cypher25 = true;
}

const connection = createConnection(ProposedFeatures.all);
let settings: Neo4jSettings | undefined = undefined;

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
const neo4jSchemaPoller = new Neo4jSchemaPoller();

async function lintSingleDocument(document: TextDocument): Promise<void> {
  if (settings?.features?.linting) {
    return lintDocument(
      document,
      (diagnostics: Diagnostic[]) => {
        void connection.sendDiagnostics({
          uri: document.uri,
          diagnostics,
        });
      },
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
  cleanupWorkers();
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

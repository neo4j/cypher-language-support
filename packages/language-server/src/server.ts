import {
  createConnection,
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
  validateSyntax,
} from '@neo4j-cypher/language-support';
import { Neo4jSchemaPoller } from '@neo4j-cypher/schema-poller';
import { doAutoCompletion } from './autocompletion';
import { doSignatureHelp } from './signatureHelp';
import { applySyntaxColouringForDocument } from './syntaxColouring';
import { Neo4jSettings } from './types';

const connection = createConnection(ProposedFeatures.all);

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

// Trigger the syntactic errors highlighting on every document change
documents.onDidChangeContent((change) => {
  const document = change.document;
  const diagnostics = validateSyntax(
    document.getText(),
    neo4jSdk.metadata?.dbSchema ?? {},
  );
  void connection.sendDiagnostics({
    uri: document.uri,
    diagnostics: diagnostics,
  });
});

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
        { username: neo4jConfig.user, password: neo4jConfig.password },
        { appName: 'cypher-language-server' },
      );
    }
  },
);

documents.listen(connection);
connection.listen();

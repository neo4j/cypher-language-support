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

import { syntaxColouringLegend, validateSyntax } from 'language-support';
import { doAutoCompletion } from './autocompletion';
import { DbInfoImpl } from './dbInfo';
import { doSignatureHelp } from './signatureHelp';
import { applySyntaxColouringForDocument } from './syntaxColouring';
import { CypherLSPSettings } from './types';

const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
const dbInfo = new DbInfoImpl();

connection.onInitialize(() => {
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Full,
      // Tell the client what features does the server support
      completionProvider: {
        resolveProvider: false,
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
    section: 'cypherLSP',
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
  const diagnostics = validateSyntax(document.getText());
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
connection.onSignatureHelp(doSignatureHelp(documents, dbInfo));
// Trigger the auto completion
connection.onCompletion(doAutoCompletion(documents, dbInfo));

connection.onDidChangeConfiguration(
  (params: { settings: { cypherLSP: CypherLSPSettings } }) => {
    const neo4jConfig = params.settings.cypherLSP.neo4j;

    if (
      neo4jConfig.connect &&
      neo4jConfig.password &&
      neo4jConfig.URL &&
      neo4jConfig.user
    ) {
      dbInfo.setConfig({
        url: neo4jConfig.URL,
        user: neo4jConfig.user,
        password: neo4jConfig.password,
      });
      void dbInfo.startSignaturesPolling();
    } else {
      dbInfo.stopPolling();
    }
  },
);

documents.listen(connection);
connection.listen();

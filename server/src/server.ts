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
  DocumentSemanticTokensProvider,
  Legend,
  validateTextDocument,
} from './highlighting';

import { doAutoCompletion } from './autocompletion';
import { doSignatureHelp } from './signatureHelp';

const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

const legend = new Legend();
const semanticTokensProvider = new DocumentSemanticTokensProvider();

documents.onDidClose(() => {
  console.log('closing document');
});

connection.onDidChangeWatchedFiles(() => {
  // Monitored files have change in VSCode
  connection.console.log('We received a file change event');
});

connection.onInitialize(() => {
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // Tell the client that this server supports code completion.
      completionProvider: {
        resolveProvider: true,
      },
      semanticTokensProvider: {
        documentSelector: null,
        legend: legend,
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
  connection.client.register(
    DidChangeConfigurationNotification.type,
    undefined,
  );

  const registrationOptions: SemanticTokensRegistrationOptions = {
    documentSelector: null,
    legend: legend,
    range: false,
    full: {
      delta: false,
    },
  };
  connection.client.register(
    SemanticTokensRegistrationType.type,
    registrationOptions,
  );
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent((change) => {
  const textDocument = change.document;
  const diagnostics = validateTextDocument(textDocument);
  connection.sendDiagnostics({
    uri: textDocument.uri,
    diagnostics: diagnostics,
  });
});

connection.languages.semanticTokens.on((params) => {
  const document = documents.get(params.textDocument.uri);
  if (document == undefined) return { data: [] };

  return semanticTokensProvider.provideDocumentSemanticTokens(document);
});

connection.onSignatureHelp(doSignatureHelp(documents));

connection.onCompletion(doAutoCompletion(documents));
documents.listen(connection);
connection.listen();

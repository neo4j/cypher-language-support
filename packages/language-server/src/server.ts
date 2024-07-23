import {
  createConnection,
  Diagnostic,
  DidChangeConfigurationNotification,
  InitializeParams,
  InitializeResult,
  ProposedFeatures,
  SemanticTokensRegistrationOptions,
  SemanticTokensRegistrationType,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';

import { syntaxColouringLegend } from '@neo4j-cypher/language-support';
import { doAutoCompletion } from './autocompletion';
import { doSignatureHelp } from './signatureHelp';
import { applySyntaxColouringForDocument } from './syntaxColouring';

const connection = createConnection(ProposedFeatures.all);

import { cleanupWorkers, lintDocument } from './linting';
import { getRuntime } from './runtime/runtimeFactory';
import { RuntimeStrategy } from './runtime/runtimeStrategy';

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let runtimeStrategy: RuntimeStrategy;

connection.onInitialize((params: InitializeParams): InitializeResult => {
  runtimeStrategy = getRuntime(params.clientInfo?.name ?? '', connection);

  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Full,
      // Tell the client what features does the server support
      completionProvider: {
        resolveProvider: false,
        triggerCharacters: ['.', ':', '{', '$', ')'],
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

  // Trigger linting
  documents.onDidChangeContent((change) =>
    lintDocument(
      change,
      (diagnostics: Diagnostic[]) => {
        void connection.sendDiagnostics({
          uri: change.document.uri,
          diagnostics,
        });
      },
      runtimeStrategy,
    ),
  );

  // Trigger the signature help, providing info about functions / procedures
  connection.onSignatureHelp(doSignatureHelp(documents, runtimeStrategy));

  // Trigger the auto completion
  connection.onCompletion(doAutoCompletion(documents, runtimeStrategy));

  // Trigger the syntax colouring
  connection.languages.semanticTokens.on(
    applySyntaxColouringForDocument(documents),
  );

  documents.listen(connection);
});

connection.listen();

connection.onExit(() => {
  cleanupWorkers();
});

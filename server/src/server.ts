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
  doSyntacticValidation,
  doSyntaxColouring,
  Legend,
} from './highlighting';

import { doAutoCompletion } from './autocompletion';
import { DbInfo, DbInfoImpl } from './dbInfo';
import { doSignatureHelp } from './signatureHelp';

const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
const legend = new Legend();
const dbInfo: DbInfo = new DbInfoImpl();

connection.onInitialize(() => {
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // Tell the client what features does the server support
      completionProvider: {
        resolveProvider: false,
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

// Trigger the syntactic errors highlighting on every document change
connection.onDidChangeTextDocument(doSyntacticValidation(documents));
// Trigger the syntax colouring
connection.languages.semanticTokens.on(doSyntaxColouring(documents));
// Trigger the signature help, providing info about functions / procedures
connection.onSignatureHelp(doSignatureHelp(documents, dbInfo));
// Trigger the auto completion
connection.onCompletion(doAutoCompletion(documents, dbInfo));

documents.listen(connection);
connection.listen();

import {
  createConnection,
  InitializeResult,
  ProposedFeatures,
  SemanticTokensRegistrationOptions,
  SemanticTokensRegistrationType,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';

import { doAutoCompletion } from './autocompletion';
import { DbInfo, DbInfoImpl } from './dbInfo';
import { doSyntaxColouring, Legend } from './highlighting/syntaxColouring';
import { doSyntaxValidationText } from './highlighting/syntaxValidation';
import { doSignatureHelp } from './signatureHelp';

const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
const legend = new Legend();
const dbInfo: DbInfo = new DbInfoImpl();

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
documents.onDidChangeContent((change) => {
  const document = change.document;
  const diagnostics = doSyntaxValidationText(document.getText());
  connection.sendDiagnostics({
    uri: document.uri,
    diagnostics: diagnostics,
  });
});
// Trigger the syntax colouring
connection.languages.semanticTokens.on(doSyntaxColouring(documents));
// Trigger the signature help, providing info about functions / procedures
connection.onSignatureHelp(doSignatureHelp(documents, dbInfo));
// Trigger the auto completion
connection.onCompletion(doAutoCompletion(documents, dbInfo));

documents.listen(connection);
connection.listen();

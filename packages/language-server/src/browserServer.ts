import {
  BrowserMessageReader,
  BrowserMessageWriter,
  createConnection,
  InitializeResult,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver/browser';

import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  DbSchema,
  syntaxColouringLegend,
} from '@neo4j-cypher/language-support';
import { doAutoCompletion } from './autocompletion';
import { formatDocument } from './formatting';
import { doSignatureHelp } from './signatureHelp';
import { applySyntaxColouringForDocument } from './syntaxColouring';

/* eslint-disable @typescript-eslint/no-explicit-any */
const messageReader = new BrowserMessageReader(globalThis as any);
const messageWriter = new BrowserMessageWriter(globalThis as any);
const connection = createConnection(messageReader, messageWriter);

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let dbSchema: DbSchema = {};
const getDbSchema = () => dbSchema;

connection.onInitialize((): InitializeResult => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Full,
      completionProvider: {
        resolveProvider: false,
        triggerCharacters: ['.', ':', '{', '$', ')', ' ', ']', '-', '<'],
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
});

// No linting in the browser build — send empty diagnostics
documents.onDidChangeContent((change) => {
  void connection.sendDiagnostics({
    uri: change.document.uri,
    diagnostics: [],
  });
});

// Trigger the syntax colouring
connection.languages.semanticTokens.on(
  applySyntaxColouringForDocument(documents),
);

// Trigger the signature help
connection.onSignatureHelp(doSignatureHelp(documents, getDbSchema));

// Trigger the auto completion
connection.onCompletion(doAutoCompletion(documents, getDbSchema));

// Trigger document formatting
connection.onDocumentFormatting((params) => {
  return formatDocument(params, documents);
});

documents.listen(connection);
connection.listen();

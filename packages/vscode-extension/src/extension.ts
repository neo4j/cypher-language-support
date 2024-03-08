import { validateSyntax } from '@neo4j-cypher/language-support';
import * as path from 'path';
import * as vscode from 'vscode';
import { ExtensionContext, workspace } from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

let client: LanguageClient;

export const SQL_START_REGEX = /(?<token>"""|"|'''|'|`)--\s*cypher/;
function checkRange(
  log: vscode.OutputChannel,
  doc: vscode.TextDocument,
  range: vscode.Range,
): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];

  const sqlStr = doc.getText(range);

  log.appendLine(`linting sql: ${sqlStr}`);
  const replaced = sqlStr.replace(/--\s*cypher/g, '');
  log.appendLine(`well actually : ${replaced}`);
  const errors = validateSyntax(replaced, {});

  log.appendLine(`errors: ${errors.length}`);
  errors.forEach((error) => {
    const diagnostic = new vscode.Diagnostic(
      range,
      error.message,
      vscode.DiagnosticSeverity.Error,
    );
    diagnostics.push(diagnostic);
  });

  return diagnostics;
}

export function refreshDiagnostics(
  doc: vscode.TextDocument,
  inlinesqlDiagnostics: vscode.DiagnosticCollection,
  log: vscode.OutputChannel,
): void {
  const diagnostics: vscode.Diagnostic[] = [];

  let startRangePosition = -1;
  let sqlStringBound = '';
  let sqlStartLineIndex = -1;

  let match;
  let sqlStringCnt = 0;
  for (let lineIndex = 0; lineIndex < doc.lineCount; lineIndex += 1) {
    const lineOfText = doc.lineAt(lineIndex).text;
    if (sqlStartLineIndex === -1) {
      if ((match = SQL_START_REGEX.exec(lineOfText)) !== null) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-non-null-assertion
        startRangePosition = match.index + match.groups!.token.length;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-non-null-assertion
        sqlStringBound = match.groups!.token;
        sqlStartLineIndex = lineIndex;
      }
    } else if (sqlStringBound !== '') {
      const endSqlIndex = lineOfText.indexOf(sqlStringBound);
      if (endSqlIndex !== -1) {
        sqlStringCnt += 1;
        const range = new vscode.Range(
          sqlStartLineIndex,
          startRangePosition,
          lineIndex,
          endSqlIndex,
        );
        const subDiagnostics = checkRange(log, doc, range);
        diagnostics.push(...subDiagnostics);
        sqlStartLineIndex = -1;
        sqlStringBound = '';
      }
    }
  }
  const now = new Date().toISOString();
  if (sqlStringBound !== '') {
    log.appendLine(`${now}: SQL string was not closed.`);
  }
  log.appendLine(`${now}: ${sqlStringCnt} SQL strings found and linted`);

  inlinesqlDiagnostics.set(doc.uri, diagnostics);
}

function subscribeToDocumentChanges(
  context: vscode.ExtensionContext,
  inlinesqlDiagnostics: vscode.DiagnosticCollection,
  log: vscode.OutputChannel,
): void {
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        void refreshDiagnostics(editor.document, inlinesqlDiagnostics, log);
      }
    }),
  );

  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((e) => {
      const now = new Date().toISOString();
      log.appendLine(`${now}: document saved, refreshing diagnostics`);
      void refreshDiagnostics(e, inlinesqlDiagnostics, log);
    }),
  );

  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument((doc) =>
      inlinesqlDiagnostics.delete(doc.uri),
    ),
  );
  log.appendLine('watching active editors');
}

export function activate(context: ExtensionContext) {
  // The server is implemented in node
  const runServer = context.asAbsolutePath(
    path.join('dist', 'cypher-language-server.js'),
  );
  const debugServer = context.asAbsolutePath(
    path.join('..', 'language-server', 'dist', 'server.js'),
  );

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { module: runServer, transport: TransportKind.ipc },
    debug: {
      module: debugServer,
      transport: TransportKind.ipc,
    },
  };

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for Cypher text documents
    documentSelector: [{ scheme: 'file', language: 'cypher' }],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher('**/.clientrc'),
    },
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    'neo4j',
    'Cypher Language Client',
    serverOptions,
    clientOptions,
  );

  // Start the client. This will also launch the server
  void client.start();

  const inlineDiagnostics =
    vscode.languages.createDiagnosticCollection('inlinecypher');
  context.subscriptions.push(inlineDiagnostics);

  const log = vscode.window.createOutputChannel('Inline cypher');
  log.appendLine('inline cypher activated');

  subscribeToDocumentChanges(context, inlineDiagnostics, log);
}

export function deactivate(): Promise<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}

import { validateSyntax } from '@neo4j-cypher/language-support';
import debounce from 'lodash.debounce';
import { join } from 'path';
import { Diagnostic, TextDocumentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import workerpool from 'workerpool';
import { LinterTask, LintWorker } from './lintWorker';
import { RuntimeStrategy } from './runtime/runtimeStrategy';

const pool = workerpool.pool(join(__dirname, 'lintWorker.js'), {
  minWorkers: 2,
  workerTerminateTimeout: 2000,
});

let lastSemanticJob: LinterTask | undefined;

async function rawLintDocument(
  change: TextDocumentChangeEvent<TextDocument>,
  sendDiagnostics: (diagnostics: Diagnostic[]) => void,
  runtime: RuntimeStrategy,
) {
  const dbSchema = runtime.getDbSchema();
  const { document } = change;

  const query = document.getText();
  if (query.length === 0) {
    sendDiagnostics([]);
    return;
  }

  const syntaxErrors = validateSyntax(query, dbSchema);

  sendDiagnostics(syntaxErrors);

  if (syntaxErrors.length === 0) {
    try {
      if (lastSemanticJob !== undefined && !lastSemanticJob.resolved) {
        void lastSemanticJob.cancel();
      }

      const proxyWorker = (await pool.proxy()) as unknown as LintWorker;
      lastSemanticJob = proxyWorker.validateSemantics(query, dbSchema);
      const result = await lastSemanticJob;

      sendDiagnostics(result);
    } catch (err) {
      if (!(err instanceof workerpool.Promise.CancellationError)) {
        console.error(err);
      }
    }
  }
}

export const lintDocument = debounce(rawLintDocument, 600, {
  leading: false,
  trailing: true,
});

export const cleanupWorkers = () => {
  void pool.terminate();
};

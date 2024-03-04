import {
  validateSemantics,
  validateSyntax,
} from '@neo4j-cypher/language-support';
import { Neo4jSchemaPoller } from '@neo4j-cypher/schema-poller';
import debounce from 'lodash.debounce';
import { join } from 'path';
import { Diagnostic, TextDocumentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import workerpool from 'workerpool';
import { LinterTask } from './lint-worker';

const pool = workerpool.pool(join(__dirname, 'lintWorker.js'), {
  minWorkers: 2,
  workerTerminateTimeout: 2000,
});

let lastSemanticJob: LinterTask | undefined;

async function rawLintDocument(
  change: TextDocumentChangeEvent<TextDocument>,
  sendDiagnostics: (diagnostics: Diagnostic[]) => void,
  neo4j: Neo4jSchemaPoller,
) {
  const { document } = change;

  const query = document.getText();
  if (query.length === 0) {
    sendDiagnostics([]);
    return;
  }

  const dbSchema = neo4j.metadata?.dbSchema ?? {};
  const syntaxErrors = validateSyntax(query, dbSchema);

  sendDiagnostics(syntaxErrors);

  if (syntaxErrors.length === 0) {
    try {
      // if (lastSemanticJob !== undefined && !lastSemanticJob.resolved) {
      //   void lastSemanticJob.cancel();
      // }

      // const proxyWorker = (await pool.proxy()) as unknown as LintWorker;
      // lastSemanticJob = proxyWorker.validateSemantics(query, dbSchema);
      // const result = await lastSemanticJob;

      const result = validateSemantics(query, dbSchema);

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

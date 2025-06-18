import {
  _internalFeatureFlags,
  clampUnsafePositions,
} from '@neo4j-cypher/language-support';
import { Neo4jSchemaPoller } from '@neo4j-cypher/query-tools';
import debounce from 'lodash.debounce';
import { join } from 'path';
import { Diagnostic } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import workerpool from 'workerpool';
import type { LinterTask, LintWorker } from '@neo4j-cypher/lint-worker';

const pool = workerpool.pool(join(__dirname, 'lintWorker.cjs'), {
  minWorkers: 2,
  workerTerminateTimeout: 2000,
});

let lastSemanticJob: LinterTask | undefined;

async function rawLintDocument(
  document: TextDocument,
  sendDiagnostics: (diagnostics: Diagnostic[]) => void,
  neo4j: Neo4jSchemaPoller,
) {
  const query = document.getText();
  if (query.length === 0) {
    sendDiagnostics([]);
    return;
  }

  const dbSchema = neo4j.metadata?.dbSchema ?? {};
  try {
    if (lastSemanticJob !== undefined && !lastSemanticJob.resolved) {
      void lastSemanticJob.cancel();
    }

    const proxyWorker = (await pool.proxy()) as unknown as LintWorker;
    lastSemanticJob = proxyWorker.lintCypherQuery(
      query,
      dbSchema,
      _internalFeatureFlags,
    );

    const result = await lastSemanticJob;

    //marks the entire text if any position is negative
    const positionSafeResult = clampUnsafePositions(result, document);

    sendDiagnostics(positionSafeResult);
  } catch (err) {
    if (!(err instanceof workerpool.Promise.CancellationError)) {
      console.error(err);
    }
  }
}

export const lintDocument: typeof rawLintDocument = debounce(
  rawLintDocument,
  600,
  {
    leading: false,
    trailing: true,
  },
);

export const cleanupWorkers = () => {
  void pool.terminate();
};

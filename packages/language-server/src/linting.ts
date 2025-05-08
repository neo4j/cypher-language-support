import { _internalFeatureFlags } from '@neo4j-cypher/language-support';
import {
  pool,
  WorkerCancellationError,
  type LinterTask,
  type LintWorker,
} from '@neo4j-cypher/lint-worker';
import { Neo4jSchemaPoller } from '@neo4j-cypher/query-tools';
import debounce from 'lodash.debounce';
import { Diagnostic } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

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

    sendDiagnostics(result);
  } catch (err) {
    if (!(err instanceof WorkerCancellationError)) {
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

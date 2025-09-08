import {
  _internalFeatureFlags,
  clampUnsafePositions,
  parserWrapper,
} from '@neo4j-cypher/language-support';
import { Neo4jSchemaPoller } from '@neo4j-cypher/query-tools';
import debounce from 'lodash.debounce';
import { join } from 'path';
import { Diagnostic } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import workerpool from 'workerpool';
import {
  convertDbSchema,
  LinterTask,
  LintWorker,
} from '@neo4j-cypher/lint-worker';

const defaultWorkerPath = join(__dirname, 'lintWorker.cjs');

let pool = workerpool.pool(defaultWorkerPath, {
  minWorkers: 2,
  workerTerminateTimeout: 20000,
});
export let workerPath = defaultWorkerPath;
let linterVersion: string | undefined = undefined;
let lastSemanticJob: LinterTask | undefined;

/**Sets the lintworker to the one specified by the given path, reverting to default if the path is undefined */
export async function setLintWorker(
  lintWorkerPath: string | undefined,
  linter: string | undefined,
) {
  lintWorkerPath = lintWorkerPath ? lintWorkerPath : defaultWorkerPath;
  if (lintWorkerPath !== workerPath) {
    await cleanupWorkers();
    workerPath = lintWorkerPath;
    linterVersion = linter;
    pool = workerpool.pool(workerPath, {
      minWorkers: 2,
      workerTerminateTimeout: 2000,
    });
  }
}

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

    const fixedDbSchema = convertDbSchema(dbSchema, linterVersion);
    lastSemanticJob = proxyWorker.lintCypherQuery(
      query,
      fixedDbSchema,
      _internalFeatureFlags,
    );

    const result = await lastSemanticJob;

    //marks the entire text if any position is negative
    const positionSafeResult = clampUnsafePositions(
      result.diagnostics,
      document,
    );

    // Pass the computed symbol tables to the parser
    if (result.symbolTables) {
      parserWrapper.setSymbolsInfo({
        query,
        symbolTables: result.symbolTables,
      });
    }

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

export const cleanupWorkers = async () => {
  await pool.terminate();
};

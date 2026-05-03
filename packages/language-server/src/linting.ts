import {
  clampUnsafePositions,
  SymbolTable,
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
import { languageService } from './server';

const defaultWorkerPath = join(__dirname, 'lintWorker.cjs');

let pool = workerpool.pool(defaultWorkerPath, {
  minWorkers: 2,
  workerTerminateTimeout: 1000,
});
let linterVersion: string | undefined = undefined;
let lastSemanticJob: LinterTask | undefined;

/**Sets the lintworker to the one specified by the given path, reverting to default if the path is undefined */
export async function setLintWorker(
  lintWorkerPath: string | undefined = defaultWorkerPath,
  linter: string | undefined,
) {
  await cleanupWorkers();
  linterVersion = linter;
  pool = workerpool.pool(lintWorkerPath, {
    minWorkers: 2,
    workerTerminateTimeout: 1000,
  });
}

async function rawLintDocument(
  document: TextDocument,
  sendDiagnostics: (diagnostics: Diagnostic[]) => void,
  notifySymbolTableDone: (symbolTable: SymbolTable[]) => Promise<void>,
  neo4j: Neo4jSchemaPoller,
) {
  const query = document.getText();
  if (query.length === 0) {
    sendDiagnostics([]);
    return;
  }

  const dbSchema = neo4j.metadata?.dbSchema ?? {};
  try {
    // Wait for any in-flight cancellation to settle before grabbing a new
    // worker, otherwise pool.proxy() may return a worker that is being torn
    // down and the next call rejects with "Worker is terminated".
    if (lastSemanticJob !== undefined && !lastSemanticJob.resolved) {
      lastSemanticJob.cancel();
      try {
        await lastSemanticJob;
      } catch {
        /* expected CancellationError */
      }
    }

    const fixedDbSchema = convertDbSchema(dbSchema, linterVersion);

    // Retry once on transient "Worker is terminated" — covers the rare case
    // where a worker exits between proxy() and the actual call.
    const runLint = async () => {
      const proxyWorker = (await pool.proxy()) as unknown as LintWorker;
      lastSemanticJob = proxyWorker.lintCypherQuery(query, fixedDbSchema, {
        consoleCommands: false,
      });
      return await lastSemanticJob;
    };

    let result;
    try {
      result = await runLint();
    } catch (err) {
      if (err instanceof workerpool.Promise.CancellationError) throw err;
      const msg = err && err.message ? String(err.message) : String(err);
      if (/worker is terminated/i.test(msg)) {
        result = await runLint();
      } else {
        throw err;
      }
    }

    //marks the entire text if any position is negative
    const positionSafeResult = clampUnsafePositions(
      result.diagnostics,
      document,
    );

    // Pass the computed symbol tables to the parser
    if (result.symbolTables) {
      languageService.setSymbolsInfo(
        {
          query,
          symbolTables: result.symbolTables,
        },
        notifySymbolTableDone,
      );
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

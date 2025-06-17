import {
  _internalFeatureFlags,
  SyntaxDiagnostic,
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

    cleanPositions(
      result,
      document.lineCount,
      document.getText().length -
        document.offsetAt({ line: document.lineCount - 1, character: 0 }),
    );

    sendDiagnostics(result);
  } catch (err) {
    if (!(err instanceof workerpool.Promise.CancellationError)) {
      console.error(err);
    }
  }
}

//marks the entire text if any position is negative
function cleanPositions(
  diagnostics: SyntaxDiagnostic[],
  endLine: number,
  endOffset: number,
): void {
  for (const diagnostic of diagnostics) {
    if (
      [
        diagnostic.range.end.character,
        diagnostic.range.start.character,
        diagnostic.range.end.line,
        diagnostic.range.start.line,
      ].find((pos) => pos < 0)
    ) {
      diagnostic.range.start.line = 0;
      diagnostic.range.end.line = endLine;
      diagnostic.range.start.character = 0;
      diagnostic.range.end.character = endOffset;
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

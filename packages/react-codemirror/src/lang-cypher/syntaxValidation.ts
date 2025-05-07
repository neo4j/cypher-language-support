import { Diagnostic, linter } from '@codemirror/lint';
import { Extension } from '@codemirror/state';
import { DiagnosticSeverity, DiagnosticTag } from 'vscode-languageserver-types';
import workerpool from 'workerpool';
import type { CypherConfig } from './langCypher';
import type { LinterTask, LintWorker } from '@neo4j-cypher/lint-worker';

const WorkerURL = new URL('./lintWorker.mjs', import.meta.url).pathname;

const pool = workerpool.pool(WorkerURL, {
  minWorkers: 2,
  workerOpts: { type: 'module' },
  workerTerminateTimeout: 2000,
});

let lastSemanticJob: LinterTask | undefined;

export const cypherLinter: (config: CypherConfig) => Extension = (config) =>
  linter(async (view) => {
    if (!config.lint) {
      return [];
    }
    const query = view.state.doc.toString();
    if (query.length === 0) {
      return [];
    }

    console.log(WorkerURL)

    try {
      if (lastSemanticJob !== undefined && !lastSemanticJob.resolved) {
        void lastSemanticJob.cancel();
      }

      const proxyWorker = (await pool.proxy()) as unknown as LintWorker;
      lastSemanticJob = proxyWorker.lintCypherQuery(
        query,
        config.schema ?? {},
        //config.featureFlags ?? {},
      );
      const result = await lastSemanticJob;

      const a: Diagnostic[] = result.map((diagnostic) => {
        return {
          from: diagnostic.offsets.start,
          to: diagnostic.offsets.end,
          severity:
            diagnostic.severity === DiagnosticSeverity.Error
              ? 'error'
              : 'warning',
          message: diagnostic.message,
          ...(diagnostic.tags !== undefined &&
          diagnostic.tags.includes(DiagnosticTag.Deprecated)
            ? { markClass: 'cm-deprecated-element' }
            : {}),
        };
      });
      return a;
    } catch (err) {
      if (!(err instanceof workerpool.Promise.CancellationError)) {
        console.error(String(err) + ' ' + query);
      }
    }
    return [];
  });

export const cleanupWorkers = () => {
  void pool.terminate();
};

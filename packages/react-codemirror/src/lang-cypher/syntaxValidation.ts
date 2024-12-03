import { linter } from '@codemirror/lint';
import { Extension } from '@codemirror/state';
import { DiagnosticSeverity } from 'vscode-languageserver-types';
import workerpool from 'workerpool';
import type { CypherConfig } from './langCypher';
import type { LinterTask, LintWorker } from './lintWorker';
import WorkerURL from './lintWorker?worker&url';

const pool = workerpool.pool(WorkerURL, {
  minWorkers: 2,
  workerOpts: { type: 'module' },
  workerTerminateTimeout: 2000,
});

let lastSemanticJob: LinterTask | undefined;

export const semanticAnalysisLinter: (config: CypherConfig) => Extension = (
  config,
) =>
  linter(async (view) => {
    if (!config.lint) {
      return [];
    }

    const query = view.state.doc.toString();
    if (query.length === 0) {
      return [];
    }

    try {
      if (lastSemanticJob !== undefined && !lastSemanticJob.resolved) {
        void lastSemanticJob.cancel();
      }

      const proxyWorker = (await pool.proxy()) as unknown as LintWorker;
      lastSemanticJob = proxyWorker.lintCypherQuery(query, config.schema ?? {});
      const result = await lastSemanticJob;

      return result.map((diag) => {
        return {
          from: diag.offsets.start,
          to: diag.offsets.end,
          severity:
            diag.severity === DiagnosticSeverity.Error ? 'error' : 'warning',
          message: diag.message,
        };
      });
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

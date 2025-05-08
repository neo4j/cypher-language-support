import { Diagnostic, linter } from '@codemirror/lint';
import { Extension } from '@codemirror/state';
import {
  pool,
  WorkerCancellationError,
  type LinterTask,
  type LintWorker,
} from '@neo4j-cypher/lint-worker';
import { DiagnosticSeverity, DiagnosticTag } from 'vscode-languageserver-types';
import type { CypherConfig } from './langCypher';

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
      if (!(err instanceof WorkerCancellationError)) {
        console.error(String(err) + ' ' + query);
      }
    }
    return [];
  });

export const cleanupWorkers = () => {
  void pool.terminate();
};

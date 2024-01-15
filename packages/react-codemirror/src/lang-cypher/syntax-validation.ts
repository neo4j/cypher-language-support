import { Diagnostic, linter } from '@codemirror/lint';
import { Extension } from '@codemirror/state';
import {
  findEndPosition,
  parserWrapper,
  validateSyntax,
} from '@neo4j-cypher/language-support';
import { DiagnosticSeverity } from 'vscode-languageserver-types';
import workerpool from 'workerpool';
import type { CypherConfig } from './lang-cypher';
import type { LinterTask, LintWorker } from './lint-worker';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore ignore: https://v3.vitejs.dev/guide/features.html#import-with-query-suffixes
import WorkerURL from './lint-worker?url&worker';

const pool = workerpool.pool(WorkerURL as string, {
  minWorkers: 2,
  workerOpts: { type: 'module' },
  workerTerminateTimeout: 2000,
});

let lastSemanticJob: LinterTask | undefined;

export const cypherLinter: (config: CypherConfig) => Extension = (config) =>
  linter((view) => {
    if (!config.lint) {
      return [];
    }

    const query = view.state.doc.toString();
    const syntaxErrors = validateSyntax(query, config.schema ?? {});

    return syntaxErrors.map(
      (diagnostic): Diagnostic => ({
        from: diagnostic.offsets.start,
        to: diagnostic.offsets.end,
        severity:
          diagnostic.severity === DiagnosticSeverity.Error
            ? 'error'
            : 'warning',
        message: diagnostic.message,
      }),
    );
  });

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

    // we want to avoid the ANTLR4 reparse in the worker thread, this should hit our main thread cache
    const parse = parserWrapper.parse(query);
    if (parse.diagnostics.length !== 0) {
      return [];
    }

    try {
      if (lastSemanticJob !== undefined && !lastSemanticJob.resolved) {
        void lastSemanticJob.cancel();
      }

      const proxyWorker = (await pool.proxy()) as unknown as LintWorker;
      lastSemanticJob = proxyWorker.validateSemantics(query);
      const result = await lastSemanticJob;

      return result.map((el) => {
        const diagnostic = findEndPosition(el, parse);

        return {
          from: diagnostic.offsets.start,
          to: diagnostic.offsets.end,
          severity:
            diagnostic.severity === DiagnosticSeverity.Error
              ? 'error'
              : 'warning',
          message: diagnostic.message,
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

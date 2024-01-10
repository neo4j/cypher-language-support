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

const pool = workerpool.pool(
  new URL('./lint-worker', import.meta.url).toString(),
  {
    minWorkers: 2,
    workerOpts: { type: 'module' },
  },
);
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
      lastSemanticJob = proxyWorker.runSemanticAnalysis(query);
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
      console.error(err);
    }
  });

// TODO can this be integrated into the codemirror lifecycl
export const cleanupWorkers = () => {
  void pool.terminate();
};

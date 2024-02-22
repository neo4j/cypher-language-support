import { Diagnostic, linter } from '@codemirror/lint';
import { Extension } from '@codemirror/state';
import { parserWrapper, validateSyntax } from '@neo4j-cypher/language-support';
import { DiagnosticSeverity } from 'vscode-languageserver-types';
import type { CypherConfig } from './langCypher';
import type { LinterTask, LintWorker } from './lintWorker';
import type { WorkerPoolModule } from './workerPool';

let poolModule: WorkerPoolModule | undefined;
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
      if (!poolModule) {
        poolModule = await import('./workerPool');
      }

      const proxyWorker =
        (await poolModule.pool.proxy()) as unknown as LintWorker;
      lastSemanticJob = proxyWorker.validateSemantics(query);
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
      const isCancellationError =
        poolModule && err instanceof poolModule.CancellationError;

      if (!isCancellationError) {
        console.error(String(err) + ' ' + query);
      }
    }
    return [];
  });

export const cleanupWorkers = () => {
  void poolModule?.terminateWorkers();
};

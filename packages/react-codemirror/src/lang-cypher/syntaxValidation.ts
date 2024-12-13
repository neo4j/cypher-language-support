import { Diagnostic, linter } from '@codemirror/lint';
import { Extension } from '@codemirror/state';
import { parserWrapper, validateSyntax } from '@neo4j-cypher/language-support';
import { DiagnosticSeverity, DiagnosticTag } from 'vscode-languageserver-types';
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
    const statements = parse.statementsParsing;

    const anySyntacticError = statements.some(
      (statement) => statement.syntaxErrors.length !== 0,
    );

    if (anySyntacticError) {
      return [];
    }

    try {
      if (lastSemanticJob !== undefined && !lastSemanticJob.resolved) {
        void lastSemanticJob.cancel();
      }

      const proxyWorker = (await pool.proxy()) as unknown as LintWorker;
      lastSemanticJob = proxyWorker.validateSemantics(
        query,
        config.schema ?? {},
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

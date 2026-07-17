import { Diagnostic, linter } from '@codemirror/lint';
import { Extension, StateEffect } from '@codemirror/state';
import { DiagnosticSeverity, DiagnosticTag } from 'vscode-languageserver-types';
import workerpool from 'workerpool';
import type { CypherConfig } from './langCypher';
import type { LintWorker } from '@neo4j-cypher/lint-worker';
import { isNotParamError } from '@neo4j-cypher/language-support';

const WorkerURL = new URL('./lintWorker.mjs', import.meta.url).pathname;

const pool = workerpool.pool(WorkerURL, {
  minWorkers: 1,
  workerOpts: { type: 'module' },
  workerTerminateTimeout: 2000,
});

export const schemaUpdated = StateEffect.define<void>();

let n = 0;
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
      if (pool.stats().busyWorkers > 0) {
        await pool.terminate(true);
      }

      const proxyWorker = (await pool.proxy()) as unknown as LintWorker;
      const result = await proxyWorker.lintCypherQuery(
        query,
        config.schema ?? {},
        config.featureFlags ?? {},
      );
      console.log("Lint nbr: " + n)
      n++;

      if (result.symbolTables) {
        config.languageService.setSymbolsInfo({
          query,
          symbolTables: result.symbolTables,
        });
      }

      const a: Diagnostic[] = result.diagnostics.map((diagnostic) => {
        return {
          from: diagnostic.offsets.start >= 0 ? diagnostic.offsets.start : 0,
          to:
            diagnostic.offsets.end >= 0 ? diagnostic.offsets.end : query.length,
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
      if (!config.schema?.databaseNames?.length) {
        return a.filter(isNotParamError);
      }
      return a;
    } catch (err) {
      if (!String(err).includes('Worker terminated')) {
        console.error(String(err) + ' ' + query);
      }
    }
    return [];
  }, {
    needsRefresh: (update) =>
      update.transactions.some((tr) =>
        tr.effects.some((effect) => effect.is(schemaUpdated)),
      ),
  });

export const cleanupWorkers = () => {
  void pool.terminate();
};

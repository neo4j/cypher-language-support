import { Diagnostic, linter } from '@codemirror/lint';
import { Extension } from '@codemirror/state';
import {
  SyntaxDiagnostic,
  validateSyntax,
} from '@neo4j-cypher/language-support';
import { DiagnosticSeverity } from 'vscode-languageserver-types';
import type { CypherConfig } from './langCypher';

const createWorker = () =>
  new Worker(new URL('./lintWorker', import.meta.url), { type: 'module' });
let lintWorker = createWorker();
let workerBusy = false;

function resetWorker() {
  lintWorker.terminate();
  lintWorker = createWorker();
  workerBusy = false;
}

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

    const channel = new MessageChannel();
    if (workerBusy) {
      resetWorker();
    }

    workerBusy = true;
    lintWorker.postMessage({ query, dbSchema: config.schema ?? {} }, [
      channel.port1,
    ]);

    const diagPromise = new Promise<Diagnostic[]>((resolve) => {
      channel.port2.onmessage = (event) => {
        const msg = event.data as SyntaxDiagnostic[];

        const diagnostics = msg.map(
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

        if (workerBusy) {
          workerBusy = false;
        }
        resolve(diagnostics);
      };
    });

    const timeoutPromise = new Promise<Diagnostic[]>((resolve) => {
      setTimeout(() => {
        if (workerBusy) {
          resetWorker();
        }

        resolve([]);
      }, 2000);
    });

    const result = await Promise.race([diagPromise, timeoutPromise]);

    return result;
  });

export const cleanupWorkers = () => {
  void lintWorker.terminate();
};

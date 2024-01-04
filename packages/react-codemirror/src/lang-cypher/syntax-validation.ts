import { Diagnostic, linter } from '@codemirror/lint';
import { Extension } from '@codemirror/state';
import { SyntaxDiagnostic } from '@neo4j-cypher/language-support';
import { DiagnosticSeverity } from 'vscode-languageserver-types';
import type { CypherConfig } from './lang-cypher';

const lintWorker = new Worker(new URL('./lint-worker', import.meta.url), {
  type: 'module',
});

export const cypherLinter: (config: CypherConfig) => Extension = (config) =>
  linter(async (view) => {
    if (!config.lint) {
      return [];
    }

    // This is why we need the message channel
    // https://stackoverflow.com/questions/62076325/how-to-let-a-webworker-do-multiple-tasks-simultaneously
    const channel = new MessageChannel();
    const query = view.state.doc.toString();

    lintWorker.postMessage({ query, dbSchema: config.schema ?? {} }, [
      channel.port1,
    ]);

    return new Promise((resolve) => {
      channel.port2.onmessage = (event) => {
        const rawDiagnostics = event.data as SyntaxDiagnostic[];

        const diagnostics = rawDiagnostics.map(
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

        resolve(diagnostics);
      };
    });
  });

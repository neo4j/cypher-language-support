import { Diagnostic, linter } from '@codemirror/lint';
import { Extension } from '@codemirror/state';
import {
  SyntaxDiagnostic,
  validateSyntax,
} from '@neo4j-cypher/language-support';
import { DiagnosticSeverity } from 'vscode-languageserver-types';
import type { CypherConfig } from './lang-cypher';

export const cypherLinter: (config: CypherConfig) => Extension = (config) =>
  linter((view) => {
    if (!config.lint) {
      return [];
    }

    return validateSyntax(view.state.doc.toString(), config.schema).map(
      (diagnostic) => ({
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

const semanticAnalysisWorker = new Worker(
  new URL('./semantic-analysis-worker', import.meta.url),
  { type: 'module' },
);

export const semanticAnalysisLinter: (config: CypherConfig) => Extension = (
  config,
) =>
  linter(async (view) => {
    if (!config.lint) {
      return [];
    }

    // This is why we need the message channel
    // https://stackoverflow.com/questions/62076325/how-to-let-a-webworker-do-multiple-tasks-simultaneously
    const channel = new MessageChannel();
    const query = view.state.doc.toString();

    semanticAnalysisWorker.postMessage({ query }, [channel.port1]);

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

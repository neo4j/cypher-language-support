import { Diagnostic, linter } from '@codemirror/lint';
import { Extension } from '@codemirror/state';
import {
  parserWrapper,
  SyntaxDiagnostic,
  validateSyntax,
} from '@neo4j-cypher/language-support';
import { DiagnosticSeverity } from 'vscode-languageserver-types';
import type { CypherConfig } from './lang-cypher';

const lintWorker = new Worker(new URL('./lint-worker', import.meta.url), {
  type: 'module',
});

// gör dessa i main process
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

    // This is why we need the message channel
    // https://stackoverflow.com/questions/62076325/how-to-let-a-webworker-do-multiple-tasks-simultaneously
    const query = view.state.doc.toString();

    const parse = parserWrapper.parse(query);
    // we want to avoid re-parsing with ANTLR4 in the worker thread
    //  TODO double check the cache works as we want it to
    if (parse.diagnostics.length !== 0) {
      return [];
    }

    const channel = new MessageChannel();
    lintWorker.postMessage({ query, dbSchema: config.schema ?? {} }, [
      channel.port1,
    ]);

    return new Promise((resolve) => {
      channel.port2.onmessage = (event) => {
        const msg = event.data as { diags: SyntaxDiagnostic[]; done: boolean };

        const diagnostics = msg.diags.map(
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

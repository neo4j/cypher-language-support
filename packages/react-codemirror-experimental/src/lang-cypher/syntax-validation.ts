import { Diagnostic, linter } from '@codemirror/lint';
import { Extension } from '@codemirror/state';
import { DbSchema, validateSyntax } from 'language-support';
import { DiagnosticSeverity } from 'vscode-languageserver-types';

export const cypherLinter: (schema?: DbSchema) => Extension = (schema) =>
  linter((view) => {
    const diagnostics: Diagnostic[] = [];

    validateSyntax(view.state.doc.toString(), schema).forEach((diagnostic) => {
      diagnostics.push({
        from: diagnostic.offsets.start,
        to: diagnostic.offsets.end,
        severity:
          diagnostic.severity === DiagnosticSeverity.Error
            ? 'error'
            : 'warning',
        message: diagnostic.message,
      });
    });

    return diagnostics;
  });

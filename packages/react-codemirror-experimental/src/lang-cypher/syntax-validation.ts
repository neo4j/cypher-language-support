import { Diagnostic, linter } from '@codemirror/lint';
import { Extension } from '@codemirror/state';
import { DbSchema, validateSyntax } from 'language-support';
import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';

function toBufferPosition(pos: Position, eofPositions: number[]): number {
  const column = pos.character;
  const line = pos.line;
  const lineOffset = line > 0 ? eofPositions[line - 1] + line - 1 : 0;
  return lineOffset + column;
}

export const cypherLinter: (schema?: DbSchema) => Extension = (schema) =>
  linter((view) => {
    const diagnostics: Diagnostic[] = [];
    const query = view.state.doc.toString();
    const splitted = query.split('\n');
    const eofPositions = splitted.map(
      (
        (sum) => (value) =>
          (sum += value.length)
      )(0),
    );

    validateSyntax(view.state.doc.toString(), schema).forEach((diagnostic) => {
      const range = diagnostic.range;
      const from = toBufferPosition(range.start, eofPositions);
      const to = toBufferPosition(range.end, eofPositions);
      diagnostics.push({
        from: from,
        to: to,
        severity:
          diagnostic.severity === DiagnosticSeverity.Error
            ? 'error'
            : 'warning',
        message: diagnostic.message,
      });
    });

    return diagnostics;
  });

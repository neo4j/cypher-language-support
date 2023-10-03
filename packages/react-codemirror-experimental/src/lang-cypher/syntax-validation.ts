import { Diagnostic, linter } from '@codemirror/lint';
import { Extension } from '@codemirror/state';
import { DbSchema, validateSyntax } from 'language-support';
import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';

function toBufferPosition(pos: Position, eofPositions: number[]): number {
  const column = pos.character;
  const line = pos.line;
  // The buffer position will be the position where the line starts
  // plus the number of end of lines until that position plus the column
  const lineOffset = line > 0 ? eofPositions[line - 1] + line : 0;
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
      // We need to translate positions in lines and columns to buffer
      // positions, since for codemirror the input is a continuous buffer
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

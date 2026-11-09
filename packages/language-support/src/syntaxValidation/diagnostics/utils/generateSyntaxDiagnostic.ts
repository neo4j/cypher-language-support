import type { DiagnosticSeverity } from 'vscode-languageserver-types';
import { Position, DiagnosticTag } from 'vscode-languageserver-types';
import type {
  ParsedProcedure,
  LabelOrRelType,
  ParsedParameter,
  PropertyType,
} from '../../../cypherLanguageService/parsingTypes.js';
import type { SyntaxDiagnostic } from '../../syntaxValidation.js';

export function generateSyntaxDiagnostic(
  rawText: string,
  parsedText: ParsedProcedure | LabelOrRelType | ParsedParameter | PropertyType,
  severity: DiagnosticSeverity,
  message: string,
  deprecation: boolean = false,
): SyntaxDiagnostic {
  const nameChunks = rawText.split('\n');
  const linesOffset = nameChunks.length - 1;
  const lineIndex = parsedText.line - 1;
  const startColumn = parsedText.column;
  const endColumn =
    linesOffset == 0
      ? startColumn + rawText.length
      : (nameChunks.at(-1)?.length ?? 0);

  const error: SyntaxDiagnostic = {
    severity,
    range: {
      start: Position.create(lineIndex, startColumn),
      end: Position.create(lineIndex + linesOffset, endColumn),
    },
    offsets: parsedText.offsets,
    message,
    ...(deprecation ? { tags: [DiagnosticTag.Deprecated] } : {}),
  };
  return error;
}

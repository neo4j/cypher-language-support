import type { Token } from 'antlr4ng';
import { Position } from 'vscode-languageserver-types';
import type { SyntaxDiagnostic } from '../../syntaxValidation/syntaxValidation.js';

export function translateTokensToRange(
  start: Token,
  stop: Token,
): Pick<SyntaxDiagnostic, 'range' | 'offsets'> {
  return {
    range: {
      start: Position.create(start.line - 1, start.column),
      end: Position.create(stop.line - 1, stop.column + stop.text!.length),
    },
    offsets: {
      start: start.start,
      end: stop.stop + 1,
    },
  };
}

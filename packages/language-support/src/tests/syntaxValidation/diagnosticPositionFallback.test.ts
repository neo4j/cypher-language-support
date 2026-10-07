import { DiagnosticSeverity } from 'vscode-languageserver-types';
import {
  convertTranspiledDiagnosticToSyntaxDiagnostic,
  type SemanticAnalysisElement,
} from '../../syntaxValidation/semanticAnalysisWrapper.js';

describe('Semantic analysis missing positions', () => {
  // Currently this is a case that actually triggers undefined endPosition in semantic analysis
  // but only statement length/newlines is relevant for this test since we mock the SemanticAnalysisElements
  const statement = `MATCH (n)
LET x a=`;
  const position = { offset: 12, line: 1, column: 2 };

  function rangeOf(element: SemanticAnalysisElement) {
    const [{ range, offsets }] = convertTranspiledDiagnosticToSyntaxDiagnostic(
      [element],
      DiagnosticSeverity.Error,
      statement,
    );
    return { range, offsets };
  }

  test('Missing end position collapses to the start position', () => {
    expect(
      rangeOf({ message: '', startPosition: position, endPosition: null }),
    ).toEqual({
      range: {
        start: { line: 1, character: 2 },
        end: { line: 1, character: 2 },
      },
      offsets: { start: 12, end: 12 },
    });
  });

  test('Missing start position collapses to the end position', () => {
    expect(
      rangeOf({ message: '', startPosition: null, endPosition: position }),
    ).toEqual({
      range: {
        start: { line: 1, character: 2 },
        end: { line: 1, character: 2 },
      },
      offsets: { start: 12, end: 12 },
    });
  });

  test('Missing both positions marks the whole statement', () => {
    expect(
      rangeOf({ message: '', startPosition: null, endPosition: null }),
    ).toEqual({
      range: {
        start: { line: 0, character: 0 },
        end: { line: 1, character: 8 },
      },
      offsets: { start: 0, end: 18 },
    });
  });
});

import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  clampUnsafePositions,
  SyntaxDiagnostic,
} from '../syntaxValidation/syntaxValidation';
import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';

describe('Clean positions', () => {
  test('Cleaning positions should mark the entire document', () => {
    let error: SyntaxDiagnostic;
    error = makeBadDiagnostic(Position.create(0, 0), Position.create(0, -5), {
      start: 0,
      end: 20,
    });
    testPositionCoversDoc('abcdefg \nblablbla \nbc', 3, 2, error);
    error = makeBadDiagnostic(Position.create(0, 0), Position.create(0, 4), {
      start: 0,
      end: -1,
    });
    testPositionCoversDoc('1234', 1, 4, error);
    error = makeBadDiagnostic(Position.create(-3, 0), Position.create(0, 5), {
      start: 0,
      end: 5,
    });
    testPositionCoversDoc(
      'MATCH (n) RETURN n;\nMATCH(n) RETURN m',
      2,
      17,
      error,
    );
  });
});

function testPositionCoversDoc(
  text: string,
  endLine: number,
  endChar: number,
  error: SyntaxDiagnostic,
) {
  const textDoc: TextDocument = TextDocument.create(
    'testDoc.cypher',
    'cypher',
    0,
    text,
  );
  const cleanedResult = clampUnsafePositions([error], textDoc)[0];

  expect(cleanedResult.range.start.line).toBe(0);
  expect(cleanedResult.range.start.character).toBe(0);
  expect(cleanedResult.range.end.line).toBe(endLine);
  expect(cleanedResult.range.end.character).toBe(endChar);
  expect(cleanedResult.offsets.start).toBe(0);
  expect(cleanedResult.offsets.end).toBe(text.length);
}

const makeBadDiagnostic = (
  start: Position,
  end: Position,
  offsets: { start: number; end: number },
) => {
  const error: SyntaxDiagnostic = {
    severity: DiagnosticSeverity.Error,
    range: {
      start,
      end,
    },
    offsets,
    message: 'a fatal flaw was detected in your program',
  };
  return error;
};

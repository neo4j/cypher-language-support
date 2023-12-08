import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';

import { ParserRuleContext, ParseTree, Token } from 'antlr4';
import { DbSchema } from '../../dbSchema';
import {
  EnrichedParsingResult,
  LabelOrRelType,
  LabelType,
  parserWrapper,
} from '../../parserWrapper';
import type { SemanticAnalysisError } from './semanticAnalysisWrapper';
import { SyntaxDiagnostic } from './syntaxValidationHelpers';

const semanticAnalysisWorker = new Worker(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore sdf
  new URL('./semanticAnalysisWorker.js', import.meta.url),
  { type: 'module' },
);

// separate out the lintsourcese to be 2 separate ones, have the other one be async

function detectNonDeclaredLabel(
  labelOrRelType: LabelOrRelType,
  dbLabels: Set<string>,
  dbRelationshipTypes: Set<string>,
): SyntaxDiagnostic | undefined {
  const labelName = labelOrRelType.labelText;
  const notInDatabase =
    (labelOrRelType.labeltype === LabelType.nodeLabelType &&
      !dbLabels.has(labelName)) ||
    (labelOrRelType.labeltype === LabelType.relLabelType &&
      !dbRelationshipTypes.has(labelName)) ||
    (!dbLabels.has(labelName) && !dbRelationshipTypes.has(labelName));

  if (notInDatabase && !labelOrRelType.couldCreateNewLabel) {
    const labelChunks = labelName.split('\n');
    const linesOffset = labelChunks.length - 1;
    const lineIndex = labelOrRelType.line - 1;
    const startColumn = labelOrRelType.column;
    const endColumn =
      linesOffset == 0
        ? startColumn + labelName.length
        : labelChunks.at(-1)?.length ?? 0;

    const warning: SyntaxDiagnostic = {
      severity: DiagnosticSeverity.Warning,
      range: {
        start: Position.create(lineIndex, startColumn),
        end: Position.create(lineIndex + linesOffset, endColumn),
      },
      offsets: labelOrRelType.offsets,
      message:
        labelOrRelType.labeltype +
        ' ' +
        labelName +
        " is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
    };

    return warning;
  }

  return undefined;
}

function warnOnUndeclaredLabels(
  parsingResult: EnrichedParsingResult,
  dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  const warnings: SyntaxDiagnostic[] = [];

  if (dbSchema.labels && dbSchema.relationshipTypes) {
    const dbLabels = new Set(dbSchema.labels);
    const dbRelationshipTypes = new Set(dbSchema.relationshipTypes);
    const labelsAndRelTypes = parsingResult.collectedLabelOrRelTypes;

    labelsAndRelTypes.forEach((labelOrRelType) => {
      const warning = detectNonDeclaredLabel(
        labelOrRelType,
        dbLabels,
        dbRelationshipTypes,
      );

      if (warning) warnings.push(warning);
    });
  }

  return warnings;
}

type PositionWithOffset = {
  relative: Position;
  offset: number;
};

function findEndPosition(
  parsingResult: EnrichedParsingResult,
  start: Position,
  startOffset: number,
): PositionWithOffset {
  let token: Token | undefined = undefined;
  const line = start.line + 1;
  const column = start.character;
  const toExplore: ParseTree[] = [parsingResult.result];

  while (toExplore.length > 0 && !token) {
    const current: ParseTree = toExplore.pop();

    if (current instanceof ParserRuleContext) {
      const startToken = current.start;
      if (startToken.line === line && startToken.column === column) {
        token = current.stop;
      }
      if (current.children) {
        current.children.forEach((child) => toExplore.push(child));
      }
    }
  }

  if (token === undefined) {
    return {
      offset: startOffset,
      relative: start,
    };
  } else {
    return {
      offset: token.stop + 1,
      relative: Position.create(
        token.line - 1,
        token.column + token.text.length,
      ),
    };
  }
}

export function validateSyntax(
  wholeFileText: string,
  dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  let diagnostics: SyntaxDiagnostic[] = [];

  if (wholeFileText.length > 0) {
    const parsingResult = parserWrapper.parse(wholeFileText);
    const errors = parsingResult.errors;

    const warnings = warnOnUndeclaredLabels(parsingResult, dbSchema);
    diagnostics = errors.concat(warnings);
  }

  return diagnostics;
}

export async function runSemanticAnalysis(
  wholeFileText: string,
): Promise<SyntaxDiagnostic[]> {
  if (wholeFileText.length > 0) {
    const parsingResult = parserWrapper.parse(wholeFileText);
    const errors = parsingResult.errors;

    if (errors.length === 0) {
      return new Promise((resolve, reject) => {
        // Receiving results from the worker
        semanticAnalysisWorker.addEventListener('message', function (event) {
          console.log('Received data from worker: ', event.data);

          const result = (event.data as { result: SemanticAnalysisError[] })
            .result;

          const diagnostics = result.map((e: SemanticAnalysisError) => {
            const start = Position.create(e.line - 1, e.column - 1);
            const startOffset = e.offset;
            const end = findEndPosition(parsingResult, start, startOffset);

            return {
              severity: DiagnosticSeverity.Error,
              range: {
                start: start,
                end: end.relative,
              },
              offsets: {
                start: startOffset,
                end: end.offset,
              },
              message: e.msg,
            };
          });

          resolve(diagnostics);
        });

        semanticAnalysisWorker.addEventListener('error', function (error) {
          reject(error);
        });

        const requestId = Math.random().toString();
        console.log('sending message');
        semanticAnalysisWorker.postMessage({ requestId, query: wholeFileText });
      });
    }
  }

  return [];
}

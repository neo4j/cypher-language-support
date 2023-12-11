import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';

import { ParserRuleContext, ParseTree, Token } from 'antlr4';
import { DbSchema } from '../../dbSchema';
import {
  EnrichedParsingResult,
  LabelOrRelType,
  LabelType,
  parserWrapper,
} from '../../parserWrapper';
import {
  SemanticAnalysisElement,
  SemanticAnalysisResult,
} from './semanticAnalysisWrapper';
import { SyntaxDiagnostic } from './syntaxValidationHelpers';

const semanticAnalysisWorker = new Worker(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore this import.meta.url doesn't work for cjs
  new URL('./semanticAnalysisWorker.js', import.meta?.url),
  { type: 'module' },
);

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

type PositionWithOffset = {
  relative: Position;
  offset: number;
};

export function sortByPosition(a: SyntaxDiagnostic, b: SyntaxDiagnostic) {
  const lineDiff = a.range.start.line - b.range.start.line;
  if (lineDiff !== 0) return lineDiff;

  return a.range.start.character - b.range.start.character;
}

function getSemanticAnalysisDiagnostics(
  elements: SemanticAnalysisElement[],
  severity: DiagnosticSeverity,
  parsingResult: EnrichedParsingResult,
): SyntaxDiagnostic[] {
  return elements.map((e) => {
    const start = Position.create(e.position.line - 1, e.position.column - 1);
    const startOffset = e.position.offset;
    const end = findEndPosition(parsingResult, start, startOffset);

    return {
      severity: severity,
      range: {
        start: start,
        end: end.relative,
      },
      offsets: {
        start: startOffset,
        end: end.offset,
      },
      message: e.message,
    };
  });
}

export function validateSyntax(
  wholeFileText: string,
  dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  if (wholeFileText.length > 0) {
    const parsingResult = parserWrapper.parse(wholeFileText);
    const diagnostics = parsingResult.diagnostics;

    const labelWarnings = warnOnUndeclaredLabels(parsingResult, dbSchema);
    return [...diagnostics, ...labelWarnings].sort(sortByPosition);
  }

  return [];
}

function runSemanticAnalysisInWorker(
  query: string,
  parsingResult: EnrichedParsingResult,
): Promise<SyntaxDiagnostic[]> {
  // See explaination here on why and how we use the MessageChannel API rather than just postMessage():
  // https://stackoverflow.com/questions/62076325/how-to-let-a-webworker-do-multiple-tasks-simultaneously

  const channel = new MessageChannel();

  semanticAnalysisWorker.postMessage({ query }, [channel.port1]);

  return new Promise((resolve) => {
    channel.port2.onmessage = (event) => {
      const result = event.data as SemanticAnalysisResult;

      const errors = getSemanticAnalysisDiagnostics(
        result.errors,
        DiagnosticSeverity.Error,
        parsingResult,
      );

      const warnings = getSemanticAnalysisDiagnostics(
        result.notifications,
        DiagnosticSeverity.Warning,
        parsingResult,
      );

      resolve([...errors, ...warnings]);
    };
  });
}

export async function runSemanticAnalysis(
  wholeFileText: string,
): Promise<SyntaxDiagnostic[]> {
  if (wholeFileText.length > 0) {
    const parsingResult = parserWrapper.parse(wholeFileText);
    const { diagnostics } = parsingResult;
    if (diagnostics.length === 0) {
      return runSemanticAnalysisInWorker(wholeFileText, parsingResult);
    }
  }

  return [];
}

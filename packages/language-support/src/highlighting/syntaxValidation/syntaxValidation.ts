import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';

import { ParserRuleContext, ParseTree, Token } from 'antlr4';
import { DbSchema } from '../../dbSchema';
import {
  EnrichedParsingResult,
  LabelOrRelType,
  LabelType,
  parserWrapper,
} from '../../parserWrapper';
import { SemanticAnalysisElement } from './semanticAnalysisWrapper';
import { SyntaxDiagnostic } from './syntaxValidationHelpers';

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
  e: SemanticAnalysisElement,
  parsingResult: EnrichedParsingResult,
): SyntaxDiagnostic {
  let token: Token | undefined = undefined;

  const start = Position.create(e.position.line - 1, e.position.column - 1);
  const startOffset = e.position.offset;

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
      severity: e.severity,
      message: e.message,
      range: {
        start: start,
        end: start,
      },
      offsets: {
        start: startOffset,
        end: startOffset,
      },
    };
  } else {
    return {
      severity: e.severity,
      message: e.message,
      range: {
        start: start,
        end: Position.create(token.line - 1, token.column + token.text.length),
      },
      offsets: {
        start: startOffset,
        end: token.stop + 1,
      },
    };
  }
}

export function sortByPosition(a: SyntaxDiagnostic, b: SyntaxDiagnostic) {
  const lineDiff = a.range.start.line - b.range.start.line;
  if (lineDiff !== 0) return lineDiff;

  return a.range.start.character - b.range.start.character;
}

export function validateSyntax(
  wholeFileText: string,
  dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  if (wholeFileText.length > 0) {
    const parsingResult = parserWrapper.parse(wholeFileText);
    const diagnostics = parsingResult.diagnostics;

    const labelWarnings = warnOnUndeclaredLabels(parsingResult, dbSchema);
    return diagnostics.concat(labelWarnings).sort(sortByPosition);
  }

  return [];
}

export const runSemanticAnalysis = validateSyntax;
/**
 * Requires your query to not have any parse errors!!
 *
 *
export function runSemanticAnalysis(query: string) {
  if (query.length > 0) {
    const { notifications, errors } = wrappedSemanticAnalysis(query);

    return (
      notifications
        .concat(errors)
        // todo find end position outside
        .map((elem) => findEndPosition(elem, parsingResult))
    );
  }
}

 */

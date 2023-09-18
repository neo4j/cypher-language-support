import {
  Diagnostic,
  DiagnosticSeverity,
  Position,
} from 'vscode-languageserver-types';

import { DbSchema } from '../dbSchema';
import {
  EnrichedParsingResult,
  LabelOrRelType,
  LabelType,
  parserWrapper,
} from '../parserWrapper';

function detectNonDeclaredLabel(
  labelOrRelType: LabelOrRelType,
  dbLabels: Set<string>,
  dbRelationshipTypes: Set<string>,
): Diagnostic | undefined {
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

    const warning: Diagnostic = {
      severity: DiagnosticSeverity.Warning,
      range: {
        start: Position.create(lineIndex, startColumn),
        end: Position.create(lineIndex + linesOffset, endColumn),
      },
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
): Diagnostic[] {
  const warnings: Diagnostic[] = [];

  if (dbSchema.labels && dbSchema.relationshipTypes) {
    const dbLabels = new Set(dbSchema.labels);
    const dbRelationshipTypes = new Set(dbSchema.relationshipTypes);

    if (dbSchema.labels && dbSchema.relationshipTypes) {
      parsingResult.collectedLabelOrRelTypes.forEach((labelOrRelType) => {
        const warning = detectNonDeclaredLabel(
          labelOrRelType,
          dbLabels,
          dbRelationshipTypes,
        );

        if (warning) warnings.push(warning);
      });
    }
  }

  return warnings;
}

export function validateSyntax(
  wholeFileText: string,
  dbSchema: DbSchema,
): Diagnostic[] {
  const parsingResult = parserWrapper.parse(wholeFileText);
  const errors = parsingResult.errors;
  const warnings = warnOnUndeclaredLabels(parsingResult, dbSchema);
  const diagnostics = errors.concat(warnings);

  return diagnostics;
}

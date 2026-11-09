import { DiagnosticSeverity } from 'vscode-languageserver-types';
import type { ParsedStatement } from '../../cypherLanguageService/parserWrapper/parserWrapper.js';
import {
  LabelType,
  type LabelOrRelType,
} from '../../cypherLanguageService/parsingTypes.js';
import type { DbSchema } from '../../dbSchema.js';
import type { SyntaxDiagnostic } from '../syntaxValidation.js';
import { generateSyntaxDiagnostic } from './utils/generate-syntax-diagnostic.js';

export function warnOnUndeclaredLabels(
  parsingResult: ParsedStatement,
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

function detectNonDeclaredLabel(
  labelOrRelType: LabelOrRelType,
  dbLabels: Set<string>,
  dbRelationshipTypes: Set<string>,
): SyntaxDiagnostic | undefined {
  const labelName = labelOrRelType.labelText;
  const normalizedLabelName = labelName.replace(/^`|`$/g, '');
  const notInDatabase =
    (labelOrRelType.labelType === LabelType.nodeLabelType &&
      !dbLabels.has(normalizedLabelName)) ||
    (labelOrRelType.labelType === LabelType.relLabelType &&
      !dbRelationshipTypes.has(normalizedLabelName)) ||
    (!dbLabels.has(normalizedLabelName) &&
      !dbRelationshipTypes.has(normalizedLabelName));

  if (notInDatabase) {
    const message =
      labelOrRelType.labelType +
      ' ' +
      labelName +
      " is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application";
    return generateSyntaxDiagnostic(
      labelName,
      labelOrRelType,
      DiagnosticSeverity.Warning,
      message,
    );
  }

  return undefined;
}

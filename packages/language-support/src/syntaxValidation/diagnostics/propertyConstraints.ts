import { DiagnosticSeverity } from 'vscode-languageserver-types';
import type { ParsedStatement } from '../../cypherLanguageService/parserWrapper/parserWrapper.js';
import type { DbSchema } from '../../dbSchema.js';
import type { SyntaxDiagnostic } from '../syntaxValidation.js';
import { generateSyntaxDiagnostic } from './utils/generateSyntaxDiagnostic.js';
import { isNodeOrRelationshipProperty } from './utils/isNodeOrRelationshipProperty.js';
import type { SymbolTable } from '../../types.js';
import { ConstraintsHandler } from './utils/contraintsHandler.js';
import { inferExpressionTypes } from './utils/inferExpressionType.js';

/** Sends a warning if a property is assigned to a type not matching the constraint */
export function warnOnPropertyNotInConstraint(
  parsingResult: ParsedStatement,
  dbSchema: DbSchema,
  symbolTable: SymbolTable,
): SyntaxDiagnostic[] {
  const warnings: SyntaxDiagnostic[] = [];

  const constraintInfo = dbSchema.constraintInfo;
  if (!constraintInfo) {
    return [];
  }

  const constraintsHandler = new ConstraintsHandler(
    constraintInfo.constraints,
    symbolTable,
  );

  for (const property of parsingResult.collectedProperties) {
    if (
      property.type === 'read' ||
      !property.assignedExpression ||
      !isNodeOrRelationshipProperty(property, symbolTable)
    ) {
      continue;
    }

    const expectedType = constraintsHandler.getPropertyType(property);
    const actualTypes = inferExpressionTypes(
      property.assignedExpression,
      symbolTable,
    );
    // Keep comparisons to known scalar types until richer constraints are supported.
    const scalarTypes = new Set(['STRING', 'INTEGER', 'FLOAT', 'BOOLEAN']);
    const expected = expectedType?.toUpperCase();

    // TODO: improve this
    if (
      !expected ||
      !scalarTypes.has(expected) ||
      !actualTypes?.length ||
      !actualTypes.every((type) => scalarTypes.has(type.toUpperCase())) ||
      actualTypes.some((type) => type.toUpperCase() === expected)
    ) {
      continue;
    }

    const message = `Type mismatch for property ${property.propertyName}: expected ${expectedType} but was ${actualTypes.join(' or ')}`;
    const warning = generateSyntaxDiagnostic(
      property.propertyName,
      property,
      DiagnosticSeverity.Warning,
      message,
    );
    warnings.push(warning);
  }

  return warnings;
}

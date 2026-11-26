import { DiagnosticSeverity } from 'vscode-languageserver-types';
import type { ParsedStatement } from '../../cypherLanguageService/parserWrapper/parserWrapper.js';
import type { DbSchema } from '../../dbSchema.js';
import type { SyntaxDiagnostic } from '../syntaxValidation.js';
import { generateSyntaxDiagnostic } from './utils/generateSyntaxDiagnostic.js';
import { isNodeOrRelationshipProperty } from './utils/isNodeOrRelationshipProperty.js';
import type { SymbolTable } from '../../types.js';
import { ConstraintsHandler } from './utils/contraintsHandler.js';
import { inferExpressionTypes } from './utils/inferExpressionType.js';
import type { PropertyType } from '../../cypherLanguageService/parsingTypes.js';

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
    const warning = diagnosticForProperty(
      property,
      symbolTable,
      constraintsHandler,
    );
    if (warning) {
      warnings.push(warning);
    }
  }

  return warnings;
}

function diagnosticForProperty(
  property: PropertyType,
  symbolTable: SymbolTable,
  constraintsHandler: ConstraintsHandler,
): SyntaxDiagnostic | undefined {
  if (
    property.type === 'read' ||
    !property.assignedExpression ||
    !isNodeOrRelationshipProperty(property, symbolTable)
  ) {
    return undefined;
  }

  const expectedType = constraintsHandler.getPropertyType(property);
  const actualTypes = inferExpressionTypes(
    property.assignedExpression,
    symbolTable,
  );

  const expected = expectedType?.toUpperCase();

  if (matchTypesOrUnknown(actualTypes, expected)) {
    return undefined;
  }

  const message = `Type mismatch for property ${property.propertyName}: expected ${expectedType} but was ${actualTypes.join(' or ')}`;
  const warning = generateSyntaxDiagnostic(
    property.propertyName,
    property,
    DiagnosticSeverity.Warning,
    message,
  );
  return warning;
}

/** @returns true if the actualTypes match the expected type. Will return true if unknown */
function matchTypesOrUnknown(
  actualTypes: string[],
  expected: string | undefined,
): boolean {
  const scalarTypes = new Set(['STRING', 'INTEGER', 'FLOAT', 'BOOLEAN']);

  if (!expected || !scalarTypes.has(expected)) {
    return true;
  }

  const expectedTypesKnown =
    actualTypes.length > 0 &&
    actualTypes.every((type) => scalarTypes.has(type.toUpperCase()));

  if (!expectedTypesKnown) {
    return true;
  }

  return actualTypes.some((type) => type.toUpperCase() === expected);
}

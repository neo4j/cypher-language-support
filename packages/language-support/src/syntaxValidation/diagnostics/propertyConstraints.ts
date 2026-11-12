import { DiagnosticSeverity } from 'vscode-languageserver-types';
import type { ParsedStatement } from '../../cypherLanguageService/parserWrapper/parserWrapper.js';
import type { DbSchema } from '../../dbSchema.js';
import type { SyntaxDiagnostic } from '../syntaxValidation.js';
import { generateSyntaxDiagnostic } from './utils/generateSyntaxDiagnostic.js';
import { isNodeOrRelationshipProperty } from './utils/isNodeOrRelationshipProperty.js';
import type { SymbolTable } from '../../types.js';
import { ConstraintsHandler } from './utils/contraintsHandler.js';

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
    dbSchema.constraintInfo.constraints,
    symbolTable,
  );

  const propertiesWithIncorrectType = parsingResult.collectedProperties.filter(
    (propInCypher) => {
      // Ignore properties that are not of Node or Relationship
      if (!isNodeOrRelationshipProperty(propInCypher, symbolTable)) {
        return false;
      }

      const _propConstraintType =
        constraintsHandler.getPropertyType(propInCypher);

      return true;
    },
  );

  for (const property of propertiesWithIncorrectType) {
    const message =
      property.propertyName +
      " is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application";
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

import { DiagnosticSeverity } from 'vscode-languageserver-types';
import type { ParsedStatement } from '../../cypherLanguageService/parserWrapper/parserWrapper.js';
import type { DbSchema } from '../../dbSchema.js';
import type { SyntaxDiagnostic } from '../syntaxValidation.js';
import { generateSyntaxDiagnostic } from './utils/generateSyntaxDiagnostic.js';
import { isNodeOrRelationshipProperty } from './utils/isNodeOrRelationshipProperty.js';
import type { SymbolTable } from '../../types.js';

export function warnOnUndeclaredProperties(
  parsingResult: ParsedStatement,
  dbSchema: DbSchema,
  symbolTable: SymbolTable,
): SyntaxDiagnostic[] {
  const warnings: SyntaxDiagnostic[] = [];
  const propertiesInSchema = dbSchema.propertyKeys;

  if (!propertiesInSchema) {
    return [];
  }

  const writeProperties = new Set(
    parsingResult.collectedProperties
      .filter((propInCypher) => propInCypher.type === 'write')
      .map((p) => p.propertyName),
  );

  const missingProperties = parsingResult.collectedProperties.filter(
    (propInCypher) => {
      // Ignore properties that are not of Node or Relationship
      if (!isNodeOrRelationshipProperty(propInCypher, symbolTable)) {
        return false;
      }

      // Ignore all properties that are being modified in the query
      if (writeProperties.has(propInCypher.propertyName)) {
        return false;
      }

      return !propertiesInSchema.includes(propInCypher.propertyName);
    },
  );

  for (const property of missingProperties) {
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

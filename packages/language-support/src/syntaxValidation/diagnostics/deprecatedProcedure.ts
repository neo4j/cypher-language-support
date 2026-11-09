import { DiagnosticSeverity } from 'vscode-languageserver-types';
import type { ParsedStatement } from '../../cypherLanguageService/parserWrapper/parserWrapper.js';
import type { ParsedProcedure } from '../../cypherLanguageService/parsingTypes.js';
import type { DbSchema } from '../../dbSchema.js';
import { resolveCypherVersion } from '../../helpers.js';
import type { SyntaxDiagnostic } from '../syntaxValidation.js';
import { generateSyntaxDiagnostic } from './utils/generateSyntaxDiagnostic.js';

export function warningOnDeprecatedProcedure(
  parsingResult: ParsedStatement,
  dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  const warnings: SyntaxDiagnostic[] = [];
  if (dbSchema.procedures) {
    const cypherVersion = resolveCypherVersion(
      parsingResult.cypherVersion,
      dbSchema,
    );
    const proceduresInQuery = parsingResult.collectedProcedures;

    proceduresInQuery.forEach((parsedProcedure) => {
      const proc = dbSchema.procedures?.[cypherVersion]?.[parsedProcedure.name];
      const procedureDeprecated = proc?.option?.deprecated;
      const deprecatedBy = proc?.deprecatedBy;
      if (deprecatedBy)
        if (procedureDeprecated) {
          warnings.push(
            generateProcedureDeprecatedWarning(parsedProcedure, deprecatedBy),
          );
        }
    });
  }
  return warnings;
}

function generateProcedureDeprecatedWarning(
  parsedProcedure: ParsedProcedure,
  deprecatedBy: string | undefined,
): SyntaxDiagnostic {
  const procDeprecatedWarning = `Procedure ${parsedProcedure.name} is deprecated.`;
  return generateSyntaxDiagnostic(
    parsedProcedure.rawText,
    parsedProcedure,
    DiagnosticSeverity.Warning,
    deprecatedBy
      ? procDeprecatedWarning + ` Alternative: ${deprecatedBy}`
      : procDeprecatedWarning,
    true,
  );
}

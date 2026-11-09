import { DiagnosticSeverity } from 'vscode-languageserver-types';
import type { ParsedStatement } from '../../cypherLanguageService/parserWrapper/parserWrapper.js';
import type { ParsedFunction } from '../../cypherLanguageService/parsingTypes.js';
import type { DbSchema } from '../../dbSchema.js';
import { resolveCypherVersion } from '../../helpers.js';
import type { SyntaxDiagnostic } from '../syntaxValidation.js';
import { generateSyntaxDiagnostic } from './utils/generateSyntaxDiagnostic.js';

export function warningOnDeprecatedFunction(
  parsingResult: ParsedStatement,
  dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  const warnings: SyntaxDiagnostic[] = [];
  if (dbSchema.functions) {
    const cypherVersion = resolveCypherVersion(
      parsingResult.cypherVersion,
      dbSchema,
    );
    const functionsInQuery = parsingResult.collectedFunctions;
    functionsInQuery.forEach((parsedFunction) => {
      const fn = dbSchema.functions?.[cypherVersion]?.[parsedFunction.name];
      const functionDeprecated = fn?.isDeprecated;
      const deprecatedBy = fn?.deprecatedBy;
      if (functionDeprecated) {
        warnings.push(
          generateFunctionDeprecatedWarning(parsedFunction, deprecatedBy),
        );
      }
    });
  }
  return warnings;
}

function generateFunctionDeprecatedWarning(
  parsedFunction: ParsedFunction,
  deprecatedBy: string | undefined,
): SyntaxDiagnostic {
  const funcDeprecatedWarning = `Function ${parsedFunction.name} is deprecated.`;
  return generateSyntaxDiagnostic(
    parsedFunction.rawText,
    parsedFunction,
    DiagnosticSeverity.Warning,
    deprecatedBy
      ? funcDeprecatedWarning + ` Alternative: ${deprecatedBy}`
      : funcDeprecatedWarning,
    true,
  );
}

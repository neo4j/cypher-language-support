import { DiagnosticSeverity } from 'vscode-languageserver-types';
import type { ParsedStatement } from '../../cypherLanguageService/parserWrapper/parserWrapper.js';
import type { DbSchema } from '../../dbSchema.js';
import type { SyntaxDiagnostic } from '../syntaxValidation.js';
import { generateSyntaxDiagnostic } from './utils/generateSyntaxDiagnostic.js';

export function errorOnUndeclaredParameters(
  parsingResult: ParsedStatement,
  dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  const errors: SyntaxDiagnostic[] = [];

  if (parsingResult.collectedParameters) {
    parsingResult.collectedParameters.forEach((parameter) => {
      let parameterName = parameter.name;
      if (parameterName.startsWith('`') && parameterName.endsWith('`')) {
        parameterName = parameterName.substring(1, parameterName.length - 1);
      }
      if (dbSchema.parameters?.[parameterName] === undefined) {
        errors.push(
          generateSyntaxDiagnostic(
            parameter.rawText,
            parameter,
            DiagnosticSeverity.Error,
            `Parameter $${parameter.name} is not defined.`,
          ),
        );
      }
    });
  }

  return errors;
}

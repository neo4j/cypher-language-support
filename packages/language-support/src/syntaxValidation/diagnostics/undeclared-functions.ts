import { DiagnosticSeverity } from 'vscode-languageserver-types';
import type { ParsedStatement } from '../../cypherLanguageService/parserWrapper/parserWrapper.js';
import type { ParsedFunction } from '../../cypherLanguageService/parsingTypes.js';
import type { DbSchema } from '../../dbSchema.js';
import { resolveCypherVersion } from '../../helpers.js';
import type { Neo4jFunction, Neo4jProcedure } from '../../types.js';
import type { SyntaxDiagnostic } from '../syntaxValidation.js';
import { generateSyntaxDiagnostic } from './utils/generate-syntax-diagnostic.js';
import { functionExists } from './utils/function-exists.js';

export function errorOnUndeclaredFunctions(
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
      const warning = detectNonDeclaredFunction(
        parsedFunction,
        dbSchema.functions?.[cypherVersion] ?? {},
        dbSchema.procedures?.[cypherVersion] ?? {},
      );

      if (warning) warnings.push(warning);
    });
  }

  return warnings;
}

function detectNonDeclaredFunction(
  parsedFunction: ParsedFunction,
  functionsSchema: Record<string, Neo4jFunction>,
  procedureSchema: Record<string, Neo4jProcedure>,
): SyntaxDiagnostic | undefined {
  const exists = functionExists(parsedFunction, functionsSchema);
  if (!exists) {
    const existsAsProcedure =
      procedureSchema && Boolean(procedureSchema[parsedFunction.name]);
    if (existsAsProcedure) {
      return generateProcedureUsedAsFunctionError(parsedFunction);
    }
    return generateFunctionNotFoundError(parsedFunction);
  }

  return undefined;
}

function generateFunctionNotFoundError(
  parsedFunction: ParsedFunction,
): SyntaxDiagnostic {
  return generateSyntaxDiagnostic(
    parsedFunction.rawText,
    parsedFunction,
    DiagnosticSeverity.Error,
    `Function ${parsedFunction.name} is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application`,
  );
}

function generateProcedureUsedAsFunctionError(
  parsedFunction: ParsedFunction,
): SyntaxDiagnostic {
  return generateSyntaxDiagnostic(
    parsedFunction.rawText,
    parsedFunction,
    DiagnosticSeverity.Error,
    `${parsedFunction.name} is a procedure, not a function. Did you mean to call the procedure ${parsedFunction.name} inside a CALL clause?`,
  );
}

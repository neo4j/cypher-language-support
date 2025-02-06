import {
  Diagnostic,
  DiagnosticSeverity,
  DiagnosticTag,
  Position,
} from 'vscode-languageserver-types';

import { DbSchema } from '../dbSchema';
import { resolveCypherVersion } from '../helpers';
import {
  LabelOrRelType,
  LabelType,
  ParsedFunction,
  ParsedProcedure,
  ParsedStatement,
  parserWrapper,
} from '../parserWrapper';
import { Neo4jFunction, Neo4jProcedure } from '../types';
import { wrappedSemanticAnalysis } from './semanticAnalysisWrapper';

export type SyntaxDiagnostic = Diagnostic & {
  offsets: { start: number; end: number };
};

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

  if (notInDatabase && !labelOrRelType.couldCreateNewLabel) {
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

function generateSyntaxDiagnostic(
  rawText: string,
  parsedText: ParsedProcedure | LabelOrRelType,
  severity: DiagnosticSeverity,
  message: string,
  deprecation: boolean = false,
): SyntaxDiagnostic {
  const nameChunks = rawText.split('\n');
  const linesOffset = nameChunks.length - 1;
  const lineIndex = parsedText.line - 1;
  const startColumn = parsedText.column;
  const endColumn =
    linesOffset == 0
      ? startColumn + rawText.length
      : nameChunks.at(-1)?.length ?? 0;

  const error: SyntaxDiagnostic = {
    severity,
    range: {
      start: Position.create(lineIndex, startColumn),
      end: Position.create(lineIndex + linesOffset, endColumn),
    },
    offsets: parsedText.offsets,
    message,
    ...(deprecation ? { tags: [DiagnosticTag.Deprecated] } : {}),
  };
  return error;
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
}

function functionExists(
  functionCandidate: ParsedFunction,
  functionsSchema: Record<string, Neo4jFunction>,
): boolean {
  if (!functionCandidate || !functionsSchema) {
    return false;
  }
  const functionExistsWithExactName = Boolean(
    functionsSchema[functionCandidate.name],
  );
  const lowercaseFunctionName = functionCandidate.name.toLowerCase();
  const caseInsensitiveFunctionInDatabase =
    functionsSchema[lowercaseFunctionName];

  // Built-in functions are case-insensitive in the database
  return (
    functionExistsWithExactName ||
    (caseInsensitiveFunctionInDatabase &&
      caseInsensitiveFunctionInDatabase.isBuiltIn)
  );
}

function generateFunctionUsedAsProcedureError(
  parsedProcedure: ParsedProcedure,
): SyntaxDiagnostic {
  return generateSyntaxDiagnostic(
    parsedProcedure.rawText,
    parsedProcedure,
    DiagnosticSeverity.Error,
    `${parsedProcedure.name} is a function, not a procedure. Did you mean to use the function ${parsedProcedure.name} with a RETURN instead of a CALL clause?`,
  );
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

function generateProcedureNotFoundError(
  parsedProcedure: ParsedProcedure,
): SyntaxDiagnostic {
  return generateSyntaxDiagnostic(
    parsedProcedure.rawText,
    parsedProcedure,
    DiagnosticSeverity.Error,
    `Procedure ${parsedProcedure.name} is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application`,
  );
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

function warnOnUndeclaredLabels(
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

export function sortByPositionAndMessage(
  a: SyntaxDiagnostic,
  b: SyntaxDiagnostic,
) {
  const lineDiff = a.range.start.line - b.range.start.line;
  if (lineDiff !== 0) return lineDiff;

  const columnDiff = a.range.start.character - b.range.start.character;
  if (columnDiff !== 0) return columnDiff;

  return a.message > b.message ? 1 : -1;
}

type FixSemanticPositionsArgs = {
  semanticDiagnostics: SyntaxDiagnostic[];
  parseResult: ParsedStatement;
};

function fixOffsets({
  semanticDiagnostics,
  parseResult,
}: FixSemanticPositionsArgs): SyntaxDiagnostic[] {
  const cmd = parseResult.command;
  return semanticDiagnostics.map((e) => {
    const { range, offsets } = e;
    const lineAdjust = cmd.start.line - 1;
    const colAdjust = range.start.line === 0 ? cmd.start.column : 0;
    const offsetAdjust = cmd.start.start;

    const start = Position.create(
      range.start.line + lineAdjust,
      range.start.character + colAdjust,
    );

    const end = Position.create(
      range.end.line + lineAdjust,
      range.end.character + colAdjust,
    );

    const adjustedRange = { start, end };
    const adjustedOffset = {
      start: offsets.start + offsetAdjust,
      end: offsets.end + offsetAdjust,
    };

    return { ...e, range: adjustedRange, offsets: adjustedOffset };
  });
}

export function lintCypherQuery(
  query: string,
  dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  if (query.length > 0) {
    const cachedParse = parserWrapper.parse(query);
    const statements = cachedParse.statementsParsing;
    const errors = statements.flatMap((current) => {
      const cmd = current.command;
      if (cmd.type === 'cypher' && cmd.statement.length > 0) {
        const functionErrors = errorOnUndeclaredFunctions(current, dbSchema);
        const procedureErrors = errorOnUndeclaredProcedures(current, dbSchema);
        const procedureWarnings = warningOnDeprecatedProcedure(
          current,
          dbSchema,
        );
        const functionWarnings = warningOnDeprecatedFunction(current, dbSchema);
        const labelWarnings = warnOnUndeclaredLabels(current, dbSchema);

        const { notifications, errors } = wrappedSemanticAnalysis(
          cmd.statement,
          dbSchema,
          current.cypherVersion,
        );

        // This contains both the syntax and the semantic errors
        const rawSemanticDiagnostics = notifications.concat(errors);
        const semanticDiagnostics = fixOffsets({
          semanticDiagnostics: rawSemanticDiagnostics,
          parseResult: current,
        });

        return semanticDiagnostics
          .concat(
            labelWarnings,
            functionErrors,
            procedureErrors,
            functionWarnings,
            procedureWarnings,
            current.syntaxErrors,
          )
          .sort(sortByPositionAndMessage);
      }
      // There could be console command errors
      return current.syntaxErrors;
    });

    return errors;
  }

  return [];
}

function warningOnDeprecatedProcedure(
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

function warningOnDeprecatedFunction(
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

function errorOnUndeclaredFunctions(
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

function errorOnUndeclaredProcedures(
  parsingResult: ParsedStatement,
  dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  const errors: SyntaxDiagnostic[] = [];

  if (dbSchema.procedures) {
    const cypherVersion = resolveCypherVersion(
      parsingResult.cypherVersion,
      dbSchema,
    );
    const proceduresInQuery = parsingResult.collectedProcedures;

    proceduresInQuery.forEach((parsedProcedure) => {
      const procedureExists = Boolean(
        dbSchema.procedures?.[cypherVersion]?.[parsedProcedure.name],
      );
      if (!procedureExists) {
        const existsAsFunction = functionExists(
          parsedProcedure,
          dbSchema.functions?.[cypherVersion] ?? {},
        );
        if (existsAsFunction) {
          errors.push(generateFunctionUsedAsProcedureError(parsedProcedure));
        } else {
          errors.push(generateProcedureNotFoundError(parsedProcedure));
        }
      }
    });
  }

  return errors;
}

import {
  Diagnostic,
  DiagnosticSeverity,
  DiagnosticTag,
  Position,
} from 'vscode-languageserver-types';

import { TextDocument } from 'vscode-languageserver-textdocument';

import { DbSchema } from '../dbSchema';
import { resolveCypherVersion } from '../helpers';
import {
  LabelOrRelType,
  LabelType,
  ParsedFunction,
  ParsedParameter,
  ParsedProcedure,
  ParsedStatement,
  parserWrapper,
} from '../parserWrapper';
import { Neo4jFunction, Neo4jProcedure, SymbolTable } from '../types';
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

export function clampUnsafePositions(
  diagnostics: SyntaxDiagnostic[],
  document: TextDocument,
): SyntaxDiagnostic[] {
  const endLine = document.lineCount;
  const endOffset = document.getText().length;
  const endLineOffset =
    endOffset -
    document.offsetAt({ line: document.lineCount - 1, character: 0 });
  return diagnostics.map((diagnostic: SyntaxDiagnostic) => {
    if (
      [
        diagnostic.range.end.character,
        diagnostic.range.start.character,
        diagnostic.range.end.line,
        diagnostic.range.start.line,
        diagnostic.offsets.start,
        diagnostic.offsets.end,
      ].find((pos) => pos < 0)
    ) {
      return {
        ...diagnostic,
        range: {
          start: Position.create(0, 0),
          end: Position.create(endLine, endLineOffset),
        },
        offsets: { start: 0, end: endOffset },
      };
    } else {
      return diagnostic;
    }
  });
}

function generateSyntaxDiagnostic(
  rawText: string,
  parsedText: ParsedProcedure | LabelOrRelType | ParsedParameter,
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
  const lowerCaseFunctionName = functionCandidate.name.toLowerCase();
  const caseInsensitiveBuiltInFunctionExists = Boolean(
    Object.values(functionsSchema).find(
      (fn) => fn.isBuiltIn && fn.name.toLowerCase() === lowerCaseFunctionName,
    ),
  );
  // Built-in functions are case-insensitive in the database
  return caseInsensitiveBuiltInFunctionExists || functionExistsWithExactName;
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

type FixSymbolTablePositionArgs = {
  symbolTable: SymbolTable;
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

function fixSymbolTableOffsets({
  symbolTable,
  parseResult,
}: FixSymbolTablePositionArgs): SymbolTable {
  const cmd = parseResult.command;
  const offsetAdjust = cmd.start.start;

  return symbolTable.map((symbol) => {
    return {
      variable: symbol.variable,
      definitionPosition: symbol.definitionPosition + offsetAdjust,
      types: symbol.types,
      references: symbol.references.map((ref) => ref + offsetAdjust),
    };
  });
}

export function lintCypherQuery(
  query: string,
  dbSchema: DbSchema,
  consoleCommandsEnabled?: boolean,
): { diagnostics: SyntaxDiagnostic[]; symbolTables: SymbolTable[] } {
  if (query.length > 0) {
    const cachedParse = parserWrapper.parse(query, consoleCommandsEnabled);
    const statements = cachedParse.statementsParsing;
    const result = statements.map((current) => {
      const cmd = current.command;
      if (cmd.type === 'cypher' && cmd.statement.length > 0) {
        if (current.cypherVersionError)
          return { diagnostics: [current.cypherVersionError], symbolTable: [] };

        const parameterErrors = errorOnUndeclaredParameters(current, dbSchema);
        const functionErrors = errorOnUndeclaredFunctions(current, dbSchema);
        const procedureErrors = errorOnUndeclaredProcedures(current, dbSchema);
        const procedureWarnings = warningOnDeprecatedProcedure(
          current,
          dbSchema,
        );
        const functionWarnings = warningOnDeprecatedFunction(current, dbSchema);
        const labelWarnings = warnOnUndeclaredLabels(current, dbSchema);

        const {
          notifications,
          errors,
          symbolTable: rawSymbolTable,
        } = wrappedSemanticAnalysis(
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

        const diagnostics = semanticDiagnostics
          .concat(
            labelWarnings,
            parameterErrors,
            functionErrors,
            procedureErrors,
            functionWarnings,
            procedureWarnings,
            current.syntaxErrors,
          )
          .sort(sortByPositionAndMessage);

        const symbolTable = fixSymbolTableOffsets({
          symbolTable: rawSymbolTable,
          parseResult: current,
        });

        return { diagnostics, symbolTable };
      }
      // There could be console command errors
      return { diagnostics: current.syntaxErrors, symbolTable: [] };
    });

    const diagnostics = result.flatMap((d) => d.diagnostics);
    const symbolTables = result.map((d) => d.symbolTable);
    return { diagnostics, symbolTables: symbolTables };
  }

  return { diagnostics: [], symbolTables: [] };
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

function errorOnUndeclaredParameters(
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

import type { Diagnostic } from 'vscode-languageserver-types';
import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';

import type { TextDocument } from 'vscode-languageserver-textdocument';

import type { DbSchema } from '../dbSchema.js';
import { resolveCypherVersion } from '../helpers.js';
import type { SymbolTable } from '../types.js';
import { wrappedSemanticAnalysis } from './semanticAnalysisWrapper.js';
import { warnOnSchemaPathViolations } from './diagnostics/schemaBasedValidation.js';
import { _internalFeatureFlags } from '../featureFlags.js';

import type { ParsedProcedure } from '../cypherLanguageService/parsingTypes.js';
import type {
  ParsedStatement,
  ParsingResult,
} from '../cypherLanguageService/parserWrapper/parserWrapper.js';
import { createParsingResult } from '../cypherLanguageService/parserWrapper/parserWrapper.js';
import { errorOnUndeclaredParameters } from './diagnostics/undeclaredParameters.js';
import { warnOnUndeclaredProperties } from './diagnostics/undeclaredProperties.js';
import { errorOnUndeclaredFunctions } from './diagnostics/undeclaredFunctions.js';
import { functionExists } from './diagnostics/utils/functionExists.js';
import { warningOnDeprecatedProcedure } from './diagnostics/deprecatedProcedure.js';
import { warningOnDeprecatedFunction } from './diagnostics/deprecatedFunction.js';
import { warnOnUndeclaredLabels } from './diagnostics/undeclaredLabels.js';
import { generateSyntaxDiagnostic } from './diagnostics/utils/generateSyntaxDiagnostic.js';

export type SyntaxDiagnostic = Diagnostic & {
  offsets: { start: number; end: number };
};

export type GenericDiagnostic = { message: string };

export function isNotParamError<T extends GenericDiagnostic>(
  diagnostic: T,
): boolean {
  return (
    !diagnostic.message.startsWith('Parameter ') ||
    !diagnostic.message.endsWith(' is not defined.')
  );
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

function sortByPositionAndMessage(a: SyntaxDiagnostic, b: SyntaxDiagnostic) {
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

/** moves offsets/positions to fit the whole query after per-statement linting */
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

/** moves offsets/positions to fit the whole query after per-statement symbol table retrieval */
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
      labels: symbol.labels,
    };
  });
}

export interface LintCypherQueryOptions {
  consoleCommandsEnabled?: boolean;
}

/**
 * Variant that accepts an already-computed parse, so CypherLanguageService can reuse
 * its cache. Not re-exported from index.ts: ParsingResult exposes the generated ANTLR
 * parser, which would drag the whole parser into the public API.
 */
export function lintCypherQueryWithParsingResult(
  query: string,
  dbSchema: DbSchema,
  {
    consoleCommandsEnabled = true,
    parsingResult,
  }: LintCypherQueryOptions & { parsingResult?: ParsingResult } = {},
): { diagnostics: SyntaxDiagnostic[]; symbolTables: SymbolTable[] } {
  if (query.length > 0) {
    const resolvedParsingResult =
      parsingResult ?? createParsingResult(query, { consoleCommandsEnabled });
    const statements = resolvedParsingResult.statementsParsing;
    const result = statements.map((current) => {
      const cmd = current.command;
      if (
        (cmd.type === 'cypher' || cmd.type === 'auto') &&
        cmd.statement.length > 0
      ) {
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

        function moveUnfinishedErrorToEndPoint(e: SyntaxDiagnostic) {
          return e.message.includes('Query cannot conclude with')
            ? {
                ...e,
                offsets: { start: e.offsets.end, end: e.offsets.end },
                range: { start: e.range.end, end: e.range.end },
              }
            : e;
        }

        const cleanedErrors = errors.map(moveUnfinishedErrorToEndPoint);

        // This contains both the syntax and the semantic errors
        const rawSemanticDiagnostics = notifications.concat(cleanedErrors);
        const semanticDiagnostics = fixOffsets({
          semanticDiagnostics: rawSemanticDiagnostics,
          parseResult: current,
        });

        const symbolTable = fixSymbolTableOffsets({
          symbolTable: rawSymbolTable,
          parseResult: current,
        });

        const propertiesWarnings = warnOnUndeclaredProperties(
          current,
          dbSchema,
          symbolTable,
        );

        const schemaPathWarnings = warnOnSchemaPathViolations(
          current,
          dbSchema,
          symbolTable,
        );

        const diagnostics = semanticDiagnostics
          .concat(
            labelWarnings,
            propertiesWarnings,
            schemaPathWarnings,
            parameterErrors,
            functionErrors,
            procedureErrors,
            functionWarnings,
            procedureWarnings,
            current.syntaxErrors,
          )
          .sort(sortByPositionAndMessage);

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

export function lintCypherQuery(
  query: string,
  dbSchema: DbSchema,
  options: LintCypherQueryOptions = {},
): { diagnostics: SyntaxDiagnostic[]; symbolTables: SymbolTable[] } {
  return lintCypherQueryWithParsingResult(query, dbSchema, options);
}

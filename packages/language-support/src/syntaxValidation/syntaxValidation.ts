import {
  DiagnosticSeverity,
  DiagnosticTag,
  Position,
} from 'vscode-languageserver-types';

import { ParserRuleContext, ParseTree, Token } from 'antlr4';
import { DbSchema } from '../dbSchema';
import {
  LabelOrRelType,
  LabelType,
  ParsedFunction,
  ParsedProcedure,
  ParsedStatement,
  parserWrapper,
} from '../parserWrapper';
import { Neo4jFunction } from '../types';
import {
  SemanticAnalysisElement,
  wrappedSemanticAnalysis,
} from './semanticAnalysisWrapper';
import { SyntaxDiagnostic } from './syntaxValidationHelpers';

function detectNonDeclaredLabel(
  labelOrRelType: LabelOrRelType,
  dbLabels: Set<string>,
  dbRelationshipTypes: Set<string>,
): SyntaxDiagnostic | undefined {
  const labelName = labelOrRelType.labelText;
  const normalizedLabelName = labelName.replace(/^`|`$/g, '');
  const notInDatabase =
    (labelOrRelType.labeltype === LabelType.nodeLabelType &&
      !dbLabels.has(normalizedLabelName)) ||
    (labelOrRelType.labeltype === LabelType.relLabelType &&
      !dbRelationshipTypes.has(normalizedLabelName)) ||
    (!dbLabels.has(normalizedLabelName) &&
      !dbRelationshipTypes.has(normalizedLabelName));

  if (notInDatabase && !labelOrRelType.couldCreateNewLabel) {
    const message =
      labelOrRelType.labeltype +
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
): SyntaxDiagnostic | undefined {
  const lowercaseFunctionName = parsedFunction.name.toLowerCase();
  const caseInsensitiveFunctionInDatabase =
    functionsSchema[lowercaseFunctionName];

  // Built-in functions are case-insensitive in the database
  if (
    caseInsensitiveFunctionInDatabase &&
    caseInsensitiveFunctionInDatabase.isBuiltIn
  ) {
    return undefined;
  }

  const functionExistsWithExactName = Boolean(
    functionsSchema[parsedFunction.name],
  );
  if (!functionExistsWithExactName) {
    return generateFunctionNotFoundError(parsedFunction);
  }
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
): SyntaxDiagnostic {
  return generateSyntaxDiagnostic(
    parsedProcedure.rawText,
    parsedProcedure,
    DiagnosticSeverity.Warning,
    `Procedure ${parsedProcedure.name} is deprecated.`,
    true,
  );
}

function generateFunctionDeprecatedWarning(
  parsedFunction: ParsedFunction,
): SyntaxDiagnostic {
  return generateSyntaxDiagnostic(
    parsedFunction.rawText,
    parsedFunction,
    DiagnosticSeverity.Warning,
    `Function ${parsedFunction.name} is deprecated.`,
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

type FixSemanticPositionsArgs = {
  semanticElements: SemanticAnalysisElement[];
  parseResult: ParsedStatement;
};

function fixSemanticAnalysisPositions({
  semanticElements,
  parseResult,
}: FixSemanticPositionsArgs): SyntaxDiagnostic[] {
  const cmd = parseResult.command;
  return semanticElements.map((e) => {
    let token: Token | undefined = undefined;

    const start = Position.create(
      e.position.line - 1 + cmd.start.line - 1,
      e.position.column - 1 + (e.position.line === 1 ? cmd.start.column : 0),
    );

    const startOffset = e.position.offset + cmd.start.start;
    const toExplore: ParseTree[] = [parseResult.ctx];

    while (toExplore.length > 0) {
      const current: ParseTree = toExplore.pop();

      if (current instanceof ParserRuleContext) {
        const startToken = current.start;
        const stopToken = current.stop;

        if (
          startToken.start <= startOffset &&
          stopToken &&
          startOffset <= stopToken.stop
        ) {
          token = stopToken;
          if (startToken.start < startOffset && current.children) {
            current.children.forEach((child) => toExplore.push(child));
          }
        }
      }
    }

    if (token === undefined) {
      return {
        severity: e.severity,
        message: e.message,
        range: {
          start: start,
          end: start,
        },
        offsets: {
          start: startOffset,
          end: startOffset,
        },
      };
    } else {
      return {
        severity: e.severity,
        message: e.message,
        range: {
          start: start,
          end: Position.create(
            token.line - 1,
            token.column + token.text.length,
          ),
        },
        offsets: {
          start: startOffset,
          end: token.stop + 1,
        },
      };
    }
  });
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

export function lintCypherQuery(
  query: string,
  dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  const syntaxErrors = validateSyntax(query, dbSchema);
  // If there are any syntactic errors in the query, do not run the semantic validation
  if (syntaxErrors.find((d) => d.severity === DiagnosticSeverity.Error)) {
    return syntaxErrors;
  }

  const semanticErrors = validateSemantics(query, dbSchema);
  return syntaxErrors.concat(semanticErrors);
}

export function validateSyntax(
  query: string,
  dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  if (query.length === 0) {
    return [];
  }
  const statements = parserWrapper.parse(query);
  const result = statements.statementsParsing.flatMap((statement) => {
    const syntaxErrors = statement.syntaxErrors;
    const labelWarnings = warnOnUndeclaredLabels(statement, dbSchema);
    return syntaxErrors.concat(labelWarnings).sort(sortByPositionAndMessage);
  });

  return result;
}

/**
 * Assumes the provided query has no parse errors
 */
export function validateSemantics(
  query: string,
  dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  if (query.length > 0) {
    const cachedParse = parserWrapper.parse(query);
    const statements = cachedParse.statementsParsing;
    const semanticErrors = statements.flatMap((current) => {
      if (current.syntaxErrors.length === 0) {
        const cmd = current.command;
        if (cmd.type === 'cypher' && cmd.statement.length > 0) {
          const functionErrors = errorOnUndeclaredFunctions(current, dbSchema);
          const procedureErrors = errorOnUndeclaredProcedures(
            current,
            dbSchema,
          );
          const procedureWarnings = warningOnDeprecatedProcedure(
            current,
            dbSchema,
          );
          const functionWarnings = warningOnDeprecatedFunction(
            current,
            dbSchema,
          );

          const { notifications, errors } = wrappedSemanticAnalysis(
            cmd.statement,
            dbSchema,
          );

          const elements = notifications.concat(errors);
          const semanticDiagnostics = fixSemanticAnalysisPositions({
            semanticElements: elements,
            parseResult: current,
          });
          return semanticDiagnostics
            .concat(
              functionErrors,
              procedureErrors,
              functionWarnings,
              procedureWarnings,
            )
            .sort(sortByPositionAndMessage);
        }
      }
      return [];
    });

    return semanticErrors;
  }

  return [];
}

function warningOnDeprecatedProcedure(
  parsingResult: ParsedStatement,
  dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  const warnings: SyntaxDiagnostic[] = [];
  if (dbSchema.procedures) {
    const proceduresInQuery = parsingResult.collectedProcedures;

    proceduresInQuery.forEach((parsedProcedure) => {
      const procedureDeprecated =
        dbSchema.procedures?.[parsedProcedure.name]?.option?.deprecated;
      if (procedureDeprecated) {
        warnings.push(generateProcedureDeprecatedWarning(parsedProcedure));
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
    const functionsInQuery = parsingResult.collectedFunctions;
    functionsInQuery.forEach((parsedFunction) => {
      const functionDeprecated =
        dbSchema.functions?.[parsedFunction.name]?.isDeprecated;
      if (functionDeprecated) {
        warnings.push(generateFunctionDeprecatedWarning(parsedFunction));
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
    const functionsInQuery = parsingResult.collectedFunctions;

    functionsInQuery.forEach((parsedFunction) => {
      const warning = detectNonDeclaredFunction(
        parsedFunction,
        dbSchema.functions,
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
    const proceduresInQuery = parsingResult.collectedProcedures;

    proceduresInQuery.forEach((parsedProcedure) => {
      const procedureExists = Boolean(
        dbSchema.procedures[parsedProcedure.name],
      );
      if (!procedureExists) {
        errors.push(generateProcedureNotFoundError(parsedProcedure));
      }
    });
  }

  return errors;
}

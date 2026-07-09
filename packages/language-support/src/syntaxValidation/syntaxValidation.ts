import {
  Diagnostic,
  DiagnosticSeverity,
  DiagnosticTag,
  Position,
} from 'vscode-languageserver-types';

import { TextDocument } from 'vscode-languageserver-textdocument';

import { DbSchema } from '../dbSchema.js';
import { resolveCypherVersion } from '../helpers.js';
import {
  LabelOrRelType,
  LabelType,
  ParsedFunction,
  ParsedParameter,
  ParsedProcedure,
  ParsedStatement,
  ParsingResult,
  PropertyType,
  createParsingResult,
  translateTokensToRange,
} from '../cypherLanguageService.js';
import {
  isLabelLeaf,
  LabelOrCondition,
  Neo4jFunction,
  Neo4jProcedure,
  SymbolTable,
} from '../types.js';
import { wrappedSemanticAnalysis } from './semanticAnalysisWrapper.js';
import { _internalFeatureFlags } from '../featureFlags.js';
import {
  CreateClauseContext,
  InsertClauseContext,
  MergeClauseContext,
  NodePatternContext,
  PatternElementContext,
  RelationshipPatternContext,
  StatementContext,
} from '../generated-parser/CypherCmdParser.js';
import { ParserRuleContext } from 'antlr4';
import {
  convertToCNF,
  isAnyNode,
  isNotAnyNode,
  removeInnerAnys,
} from '../labelTreeRewriting.js';
import {
  getNodesFromRelsSet,
  getRelsFromNodesSets,
  walkCNFTree,
} from '../labelTreeWalking.js';

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

  if (notInDatabase) {
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

type GenericDiagnostic = { message: string };

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

function generateSyntaxDiagnostic(
  rawText: string,
  parsedText: ParsedProcedure | LabelOrRelType | ParsedParameter | PropertyType,
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
      : (nameChunks.at(-1)?.length ?? 0);

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

function warnOnUndeclaredProperties(
  parsingResult: ParsedStatement,
  _dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  const warnings: SyntaxDiagnostic[] = [];
  const properties = parsingResult.collectedProperties;
  for (const property of properties) {
    const message = property.propertyName + ' not available';
    const warning = generateSyntaxDiagnostic(
      property.propertyName,
      property,
      DiagnosticSeverity.Warning,
      message,
    );
    warnings.push(warning);
  }

  // if (dbSchema.labels && dbSchema.relationshipTypes) {
  //   const dbLabels = new Set(dbSchema.labels);
  //   const dbrelationshiptypes = new Set(dbSchema.relationshipTypes);
  //   const labelsAndRelTypes = parsingResult.collectedLabelOrRelTypes;

  //   labelsAndRelTypes.forEach((labelOrRelType) => {
  //     const warning = detectNonDeclaredLabel(
  //       labelOrRelType,
  //       dbLabels,
  //       dbRelationshipTypes,
  //     );

  //     if (warning) warnings.push(warning);
  //   });
  // }

  return warnings;
}

function warnOnPathDirectionalityIssues(
  parsingResult: ParsedStatement,
  dbSchema: DbSchema,
  symbolTable: SymbolTable,
): SyntaxDiagnostic[] {
  const statements = parsingResult.ctx.statementOrCommand_list();
  return statements.reduce<SyntaxDiagnostic[]>((acc, stmtOrCommand) => {
    const stmt = stmtOrCommand.preparsedStatement()?.statement();
    if (!stmt) {
      return acc;
    }
    const pathIssues = findPathIssues(stmt, dbSchema, symbolTable);
    return acc.concat(pathIssues);
  }, []);
}

function labelTreeToString(node: LabelOrCondition): string {
  if (isLabelLeaf(node)) {
    return node.value;
  } else if (node.condition === 'any') {
    return 'ANY';
  } else if (node.children.length === 1) {
    return labelTreeToString(node.children[0]);
  } else {
    let separator = ' ';
    switch (node.condition) {
      case 'and':
        separator = ' & ';
        break;
      case 'or':
        separator = ' | ';
        break;
      case 'not':
        separator = '!';
        break;
    }
    const childStrings: string[] = node.children.map((c) =>
      labelTreeToString(c),
    );
    return '(' + childStrings.join(separator) + ')';
  }
}

function labelsToMessage(
  firstLabelTree: LabelOrCondition,
  connectedLabel: string,
  direction: 'outgoing' | 'incoming' | 'bidirectional',
  firstVarType: 'node' | 'relationship',
) {
  const directionSubString =
    direction === 'bidirectional' ? 'incoming/outgoing' : direction;
  const secondVarString =
    firstVarType === 'node'
      ? '[:' + connectedLabel + ']'
      : '(:' + connectedLabel + ')';
  const firstVarString =
    firstVarType === 'node'
      ? '(:' + labelTreeToString(firstLabelTree) + ')'
      : '[:' + labelTreeToString(firstLabelTree) + ']';
  return `${secondVarString} has no ${directionSubString} ${firstVarString}`;
}

function findPathIssues(
  stmt: StatementContext,
  dbSchema: DbSchema,
  symbolTable: SymbolTable,
): SyntaxDiagnostic[] {
  const patternElements: PatternElementContext[] =
    findNonCreatingPatternElements(stmt, []);
  const diagnostics: SyntaxDiagnostic[] = [];
  for (const pattern of patternElements) {
    const children = pattern.children ?? [];
    let n = 0;
    while (n < children.length - 1) {
      const child = children[n];
      const nextChild = children[n + 1];
      n++;
      if (
        child instanceof NodePatternContext &&
        nextChild instanceof RelationshipPatternContext
      ) {
        if (!nextChild.stop?.stop || !child.stop?.stop) {
          continue;
        }
        const symbol = symbolTable.find((x) =>
          x.references.some(
            (ref) =>
              ref >= child.start.start && ref <= (child.stop?.stop ?? -1),
          ),
        );
        const nextSymbolLabels = symbolTable.find((x) =>
          x.references.some(
            (ref) =>
              ref >= nextChild.start.start &&
              ref <= (nextChild.stop?.stop ?? -1),
          ),
        )?.labels;
        if (symbol && nextSymbolLabels) {
          const direction =
            nextChild.leftArrow() &&
            !nextChild.rightArrow() &&
            nextChild.arrowLine_list()?.length == 2 //check for 2 lines to handle unfinished rel better
              ? 'outgoing'
              : !nextChild.leftArrow() && nextChild.rightArrow()
                ? 'incoming'
                : 'bidirectional';
          const possibleRels = possibleFollowingRelType(
            direction,
            dbSchema,
            symbol.labels,
          );
          if (
            possibleRels &&
            'children' in nextSymbolLabels &&
            nextSymbolLabels.children.length === 1 &&
            isLabelLeaf(nextSymbolLabels.children[0])
          ) {
            if (!possibleRels.has(nextSymbolLabels.children[0].value)) {
              diagnostics.push({
                message: labelsToMessage(
                  symbol.labels,
                  nextSymbolLabels.children[0].value,
                  direction,
                  'node',
                ),
                severity: DiagnosticSeverity.Warning,
                ...translateTokensToRange(child.start, nextChild.stop),
              });
            }
          }
        }
      }
      if (
        child instanceof RelationshipPatternContext &&
        nextChild instanceof NodePatternContext
      ) {
        if (!nextChild.stop?.stop || !child.stop?.stop) {
          continue;
        }
        const symbol = symbolTable.find((x) =>
          x.references.some(
            (ref) =>
              ref >= child.start.start && ref <= (child.stop?.stop ?? -1),
          ),
        );
        const nextSymbolLabels = symbolTable.find((x) =>
          x.references.some(
            (ref) =>
              ref >= nextChild.start.start &&
              ref <= (nextChild.stop?.stop ?? -1),
          ),
        )?.labels;
        if (symbol && nextSymbolLabels) {
          const direction =
            child.leftArrow() &&
            !child.rightArrow() &&
            child.arrowLine_list()?.length == 2 //check for 2 lines to handle unfinished rel better
              ? 'outgoing'
              : !child.leftArrow() && child.rightArrow()
                ? 'incoming'
                : 'bidirectional';
          const possibleRels = possibleFollowingLabels(
            direction,
            dbSchema,
            symbol.labels,
          );
          if (
            possibleRels &&
            nextSymbolLabels &&
            'children' in nextSymbolLabels &&
            nextSymbolLabels.children.length === 1 &&
            isLabelLeaf(nextSymbolLabels.children[0])
          ) {
            if (!possibleRels.has(nextSymbolLabels.children[0].value)) {
              diagnostics.push({
                message: labelsToMessage(
                  symbol.labels,
                  nextSymbolLabels.children[0].value,
                  direction,
                  'relationship',
                ),
                severity: DiagnosticSeverity.Warning,
                ...translateTokensToRange(child.start, nextChild.stop),
              });
            }
          }
        }
      }
    }
  }
  return diagnostics;
}

function findNonCreatingPatternElements(
  ctx: ParserRuleContext,
  acc: PatternElementContext[],
): PatternElementContext[] {
  for (const c of ctx.children ?? []) {
    if (
      c instanceof MergeClauseContext ||
      c instanceof CreateClauseContext ||
      c instanceof InsertClauseContext
    ) {
      continue;
    }
    if (c instanceof PatternElementContext) {
      acc.push(c);
    }
    if (c instanceof ParserRuleContext) {
      findNonCreatingPatternElements(c, acc);
    }
  }
  return acc;
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
      labels: symbol.labels,
    };
  });
}

export function lintCypherQuery(
  query: string,
  dbSchema: DbSchema,
  {
    consoleCommandsEnabled = true,
    parsingResult,
  }: {
    consoleCommandsEnabled?: boolean;
    parsingResult?: ParsingResult;
  } = {},
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
        const propertiesWarnings = warnOnUndeclaredProperties(
          current,
          dbSchema,
        );

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

        const missingPathWarnings = dbSchema.graphSchema
          ? warnOnPathDirectionalityIssues(current, dbSchema, symbolTable)
          : [];

        const diagnostics = semanticDiagnostics
          .concat(
            labelWarnings,
            propertiesWarnings,
            parameterErrors,
            functionErrors,
            procedureErrors,
            functionWarnings,
            procedureWarnings,
            missingPathWarnings,
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

//Returns possible following rel types, or undefined in cases where we should quit
function possibleFollowingRelType(
  direction: 'incoming' | 'outgoing' | 'bidirectional',
  dbSchema: DbSchema,
  labels: LabelOrCondition,
): Set<string> | undefined {
  const { toNodes: relsToNodesSet, fromNodes: relsFromNodesSet } =
    getRelsFromNodesSets(dbSchema);
  return getFollowingLabels(direction, labels, {
    incomingLabels: relsToNodesSet,
    outGoingLabels: relsFromNodesSet,
  });
}

//Returns possible following labels, or undefined in cases where we should quit
function possibleFollowingLabels(
  direction: 'incoming' | 'outgoing' | 'bidirectional',
  dbSchema: DbSchema,
  labels: LabelOrCondition,
): Set<string> | undefined {
  const { toRels: nodesToRelsSet, fromRels: nodesFromRelsSet } =
    getNodesFromRelsSet(dbSchema);
  return getFollowingLabels(direction, labels, {
    incomingLabels: nodesToRelsSet,
    outGoingLabels: nodesFromRelsSet,
  });
}

function getFollowingLabels(
  direction: 'incoming' | 'outgoing' | 'bidirectional',
  labels: LabelOrCondition,
  {
    incomingLabels,
    outGoingLabels,
  }: {
    incomingLabels: Map<string, Set<string>>;
    outGoingLabels: Map<string, Set<string>>;
  },
): Set<string> | undefined {
  let cnfTree: LabelOrCondition;
  try {
    const treeWithRewrittenAnys = removeInnerAnys(labels);
    if (isAnyNode(treeWithRewrittenAnys)) {
      return undefined;
    } else if (isNotAnyNode(treeWithRewrittenAnys)) {
      return undefined;
    }
    cnfTree = convertToCNF(treeWithRewrittenAnys);
  } catch {
    return undefined;
  }
  const { inLabels, outLabels } = walkCNFTree(
    incomingLabels,
    outGoingLabels,
    cnfTree,
  );
  const allNodes =
    direction === 'outgoing'
      ? outLabels
      : direction === 'incoming'
        ? inLabels
        : inLabels.union(outLabels);
  return allNodes;
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

export const paramMsgStart = 'Parameter ';

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

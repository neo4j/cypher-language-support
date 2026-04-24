/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';
import { DbSchema, Registry } from '../dbSchema.js';
import {
  CypherVersion,
  isCondition,
  LabelOrCondition,
  Neo4jFunction,
  Neo4jProcedure,
  SymbolTable,
} from '../types.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {
  analyzeQuery,
  calculateSymbolTable,
  updateSignatureResolver,
} from './semanticAnalysis.js';
import { SyntaxDiagnostic } from './syntaxValidation.js';

export interface SemanticAnalysisResult {
  errors: SyntaxDiagnostic[];
  notifications: SyntaxDiagnostic[];
}

export interface ElementPosition {
  offset: number;
  line: number;
  column: number;
}

export interface SemanticAnalysisElement {
  message: string;
  startPosition: ElementPosition;
  endPosition: ElementPosition;
}

const previousResolvers: {
  [cypherVersion: CypherVersion]: {
    functions: Registry<Neo4jFunction>;
    procedures: Registry<Neo4jProcedure>;
  };
} = {};

function copySettingSeverity(
  elements: SemanticAnalysisElement[],
  severity: DiagnosticSeverity,
): SyntaxDiagnostic[] {
  return elements.map(({ message, startPosition, endPosition }) => ({
    severity: severity,
    message,
    range: {
      start: Position.create(startPosition.line, startPosition.column),
      end: Position.create(endPosition.line, endPosition.column),
    },
    offsets: {
      start: startPosition.offset,
      end: endPosition.offset,
    },
  }));
}

function copySymbolTable(symbolTable: SymbolTable): SymbolTable {
  return symbolTable.map(
    ({ variable, definitionPosition, types, references, labels }) => {
      return {
        variable,
        definitionPosition,
        types: Array.from(types),
        references: Array.from(references),
        labels: verifyLabelTree(labels)
          ? labelTreeFromJava(labels)
          : { condition: 'and', children: [] },
      };
    },
  );
}

function verifyLabelTree(labels: LabelOrCondition): boolean {
  if (
    'condition' in labels &&
    isCondition(labels.condition) &&
    'children' in labels &&
    labels.children.every(verifyLabelTree)
  ) {
    return true;
  } else if ('value' in labels && typeof labels.value === 'string') {
    return true;
  } else {
    return false;
  }
}

function labelTreeFromJava(labels: LabelOrCondition): LabelOrCondition {
  if ('children' in labels) {
    const children = [];
    for (const c of labels.children) {
      children.push(labelTreeFromJava(c));
    }
    return { condition: labels.condition, children };
  } else {
    return { value: labels.value };
  }
}

function updateResolverForVersion(
  dbSchema: DbSchema,
  cypherVersion: CypherVersion,
) {
  const previousResolver = previousResolvers?.[cypherVersion];
  const currentResolver = {
    procedures: dbSchema?.procedures?.[cypherVersion],
    functions: dbSchema?.functions?.[cypherVersion],
  };
  if (JSON.stringify(previousResolver) !== JSON.stringify(currentResolver)) {
    previousResolvers[cypherVersion] = currentResolver;
    const procedures = Object.values(
      dbSchema?.procedures?.[cypherVersion] ?? {},
    );
    const functions = Object.values(dbSchema?.functions?.[cypherVersion] ?? {});
    updateSignatureResolver(
      {
        procedures: procedures,
        functions: functions,
      },
      cypherVersion,
    );
  }
}

export function wrappedSymbolTableCollection(
  query: string,
  dbSchema: DbSchema,
  parsedVersion?: CypherVersion,
): SymbolTable {
  try {
    const defaultVersion = dbSchema?.defaultLanguage;
    const cypherVersion = parsedVersion ?? defaultVersion ?? 'CYPHER 5';
    updateResolverForVersion(dbSchema, cypherVersion);
    const symbolTable: SymbolTable = calculateSymbolTable(query, cypherVersion);

    return copySymbolTable(symbolTable);
  } catch {
    /* Ignores exceptions if they happen calling the semantic analysis. Should not happen but this is just defensive in case it did */
    return [];
  }
}

export function wrappedSemanticAnalysis(
  query: string,
  dbSchema: DbSchema,
  parsedVersion?: CypherVersion,
): SemanticAnalysisResult {
  try {
    const defaultVersion = dbSchema?.defaultLanguage;
    const cypherVersion = parsedVersion ?? defaultVersion ?? 'CYPHER 5';
    updateResolverForVersion(dbSchema, cypherVersion);
    const semanticErrorsResult = analyzeQuery(query, cypherVersion);
    const errors: SemanticAnalysisElement[] = semanticErrorsResult.errors;
    const notifications: SemanticAnalysisElement[] =
      semanticErrorsResult.notifications;

    return {
      errors: copySettingSeverity(errors, DiagnosticSeverity.Error),
      notifications: copySettingSeverity(
        notifications,
        DiagnosticSeverity.Warning,
      ),
    };
  } catch {
    /* Ignores exceptions if they happen calling the semantic analysis. Should not happen but this is just defensive in case it did */
    return { errors: [], notifications: [] };
  }
}

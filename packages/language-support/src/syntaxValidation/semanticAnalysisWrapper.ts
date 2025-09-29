/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';
import { DbSchema, Registry } from '../dbSchema';
import {
  CypherVersion,
  LabelOrCondition,
  Neo4jFunction,
  Neo4jProcedure,
  SymbolTable,
} from '../types';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { analyzeQuery, updateSignatureResolver } from './semanticAnalysis';
import { SyntaxDiagnostic } from './syntaxValidation';

export interface SemanticAnalysisResult {
  errors: SyntaxDiagnostic[];
  notifications: SyntaxDiagnostic[];
  symbolTable: SymbolTable;
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
        labels: labelTreeFromJava(labels),
      };
    },
  );
}

function labelTreeFromJava(labels: LabelOrCondition): LabelOrCondition {
  if ('children' in labels) {
    const children = [];
    for (const c of labels.children) {
      children.push(labelTreeFromJava(c));
    }
    return { andOr: labels.andOr, children };
  } else {
    return { value: labels.value, validFrom: labels.validFrom };
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
    const symbolTable: SymbolTable = semanticErrorsResult.symbolTable;

    return {
      errors: copySettingSeverity(errors, DiagnosticSeverity.Error),
      notifications: copySettingSeverity(
        notifications,
        DiagnosticSeverity.Warning,
      ),
      symbolTable: copySymbolTable(symbolTable),
    };
  } catch (e) {
    /* Ignores exceptions if they happen calling the semantic analysis. Should not happen but this is just defensive in case it did */
    return { errors: [], notifications: [], symbolTable: [] };
  }
}

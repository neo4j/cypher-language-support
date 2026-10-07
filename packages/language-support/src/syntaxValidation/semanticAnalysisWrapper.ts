import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';
import type { DbSchema, Registry } from '../dbSchema.js';
import type {
  CypherVersion,
  LabelOrCondition,
  Neo4jFunction,
  Neo4jProcedure,
  SymbolTable,
} from '../types.js';
import { isCondition } from '../types.js';
// @ts-ignore
import { analyzeQuery, updateSignatureResolver } from './semanticAnalysis.js';
import type { SyntaxDiagnostic } from './syntaxValidation.js';

export interface SemanticAnalysisResult {
  errors: SyntaxDiagnostic[];
  notifications: SyntaxDiagnostic[];
  symbolTable: SymbolTable;
}

interface ElementPosition {
  offset: number;
  line: number;
  column: number;
}

export interface SemanticAnalysisElement {
  message: string;
  startPosition: ElementPosition | null;
  endPosition: ElementPosition | null;
}

const previousResolvers: {
  [cypherVersion: CypherVersion]: {
    functions: Registry<Neo4jFunction>;
    procedures: Registry<Neo4jProcedure>;
  };
} = {};

function statementEndPosition(statement: string): ElementPosition {
  const lines = statement.split('\n');
  return {
    offset: statement.length,
    line: lines.length - 1,
    column: lines[lines.length - 1].length,
  };
}

export function convertTranspiledDiagnosticToSyntaxDiagnostic(
  elements: SemanticAnalysisElement[],
  severity: DiagnosticSeverity,
  statement: string,
): SyntaxDiagnostic[] {
  return elements.map(({ message, startPosition, endPosition }) => {
    // A single missing position collapses the span to the other one; only mark the whole statement if both are missing
    const start = startPosition ??
      endPosition ?? { offset: 0, line: 0, column: 0 };
    const end = endPosition ?? startPosition ?? statementEndPosition(statement);
    return {
      severity: severity,
      message,
      range: {
        start: Position.create(start.line, start.column),
        end: Position.create(end.line, end.column),
      },
      offsets: {
        start: start.offset,
        end: end.offset,
      },
    };
  });
}

function convertTranspiledSymbolTableToJSObject(
  symbolTable: SymbolTable,
): SymbolTable {
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

export function wrappedSemanticAnalysis(
  statement: string,
  dbSchema: DbSchema,
  parsedVersion?: CypherVersion,
): SemanticAnalysisResult {
  try {
    const defaultVersion = dbSchema?.defaultLanguage;
    const cypherVersion = parsedVersion ?? defaultVersion ?? 'CYPHER 5';
    updateResolverForVersion(dbSchema, cypherVersion);
    const semanticErrorsResult = analyzeQuery(statement, cypherVersion);
    const errors: SemanticAnalysisElement[] = semanticErrorsResult.errors;
    const notifications: SemanticAnalysisElement[] =
      semanticErrorsResult.notifications;
    const symbolTable: SymbolTable = semanticErrorsResult.symbolTable;

    return {
      errors: convertTranspiledDiagnosticToSyntaxDiagnostic(
        errors,
        DiagnosticSeverity.Error,
        statement,
      ),
      notifications: convertTranspiledDiagnosticToSyntaxDiagnostic(
        notifications,
        DiagnosticSeverity.Warning,
        statement,
      ),
      symbolTable: convertTranspiledSymbolTableToJSObject(symbolTable),
    };
  } catch {
    /* Ignores exceptions if they happen calling the semantic analysis. Should not happen but this is just defensive in case it did */
    return { errors: [], notifications: [], symbolTable: [] };
  }
}

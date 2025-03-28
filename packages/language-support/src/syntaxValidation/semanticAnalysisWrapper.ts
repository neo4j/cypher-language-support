/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';
import { DbSchema, Registry } from '../dbSchema';
import { CypherVersion, Neo4jFunction, Neo4jProcedure } from '../types';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { analyzeQuery, updateSignatureResolver } from './semanticAnalysis.js';
import { SyntaxDiagnostic } from './syntaxValidation';

export interface SemanticAnalysisResult {
  errors: SyntaxDiagnostic[];
  notifications: SyntaxDiagnostic[];
}

export interface SemanticAnalysisElement {
  message: string;
  startPosition: {
    offset: number;
    line: number;
    column: number;
  };
  endPosition: {
    offset: number;
    line: number;
    column: number;
  };
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

    return {
      errors: copySettingSeverity(errors, DiagnosticSeverity.Error),
      notifications: copySettingSeverity(
        notifications,
        DiagnosticSeverity.Warning,
      ),
    };
  } catch (e) {
    /* Ignores exceptions if they happen calling the semantic analysis. Should not happen but this is just defensive in case it did */
    return { errors: [], notifications: [] };
  }
}

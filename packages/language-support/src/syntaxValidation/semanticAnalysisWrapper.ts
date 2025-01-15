/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';
import { DbSchema } from '../dbSchema';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { analyzeQuery, updateSignatureResolver } from './semanticAnalysis';
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

let previousSchema: DbSchema | undefined = undefined;

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

export function wrappedSemanticAnalysis(
  query: string,
  dbSchema: DbSchema,
  parsedVersion: string,
): SemanticAnalysisResult {
  try {
    if (JSON.stringify(dbSchema) !== JSON.stringify(previousSchema)) {
      previousSchema = dbSchema;
      const procedures = Object.values(dbSchema.procedures ?? {});
      const functions = Object.values(dbSchema.functions ?? {});
      updateSignatureResolver({
        procedures: procedures,
        functions: functions,
      });
    }

    const validCypherVersions = ['cypher 5', 'cypher 25'];
    let cypherVersion = 'cypher 5';
    const fullParsedVersion = 'cypher ' + parsedVersion;

    if (parsedVersion && validCypherVersions.includes(fullParsedVersion)) {
      cypherVersion = fullParsedVersion;
    } else if (
      dbSchema.defaultLanguage &&
      validCypherVersions.includes(dbSchema.defaultLanguage)
    ) {
      cypherVersion = dbSchema.defaultLanguage;
    }
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

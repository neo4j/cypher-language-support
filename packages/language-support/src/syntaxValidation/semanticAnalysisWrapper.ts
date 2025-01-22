/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';
import { DbSchema } from '../dbSchema';
import { CypherVersion, cypherVersions } from '../types';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { resolveCypherVersion } from '../helpers';
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
  parsedVersion?: CypherVersion,
): SemanticAnalysisResult {
  try {
    if (JSON.stringify(dbSchema) !== JSON.stringify(previousSchema)) {
      previousSchema = dbSchema;

      cypherVersions.forEach((cypherVersion) => {
        const procedures = Object.values(
          dbSchema?.procedures?.[cypherVersion] ?? {},
        );
        const functions = Object.values(
          dbSchema?.functions?.[cypherVersion] ?? {},
        );
        updateSignatureResolver(
          {
            procedures: procedures,
            functions: functions,
          },
          cypherVersion,
        );
      });
    }

    const cypherVersion = resolveCypherVersion(parsedVersion, dbSchema);
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

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { DiagnosticSeverity } from 'vscode-languageserver-types';
import { DbSchema } from '../dbSchema';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { semanticAnalysis, updateSignatureResolver } from './semanticAnalysis';

export interface SemanticAnalysisResult {
  errors: SemanticAnalysisElement[];
  notifications: SemanticAnalysisElement[];
}

export interface SemanticAnalysisElement {
  severity: DiagnosticSeverity;
  message: string;
  position: {
    offset: number;
    line: number;
    column: number;
  };
}
type SemanticAnalysisElementNoSeverity = Omit<
  SemanticAnalysisElement,
  'severity'
>;

export function wrappedSemanticAnalysis(
  query: string,
  dbSchema: DbSchema,
): SemanticAnalysisResult {
  try {
    let semanticErrorsResult = undefined;

    if (dbSchema.functions && dbSchema.procedures) {
      updateSignatureResolver({
        procedures: Object.values(dbSchema.procedures),
        functions: Object.values(dbSchema.functions),
      });
    }
    semanticAnalysis([query], (a) => {
      semanticErrorsResult = a;
    });
    const errors: SemanticAnalysisElementNoSeverity[] =
      semanticErrorsResult.$errors.data;
    const notifications: SemanticAnalysisElementNoSeverity[] =
      semanticErrorsResult.$notifications.data;

    return {
      errors: errors.map(({ message, position }) => ({
        severity: DiagnosticSeverity.Error,
        message,
        position: {
          column: position.column,
          line: position.line,
          offset: position.offset,
        },
      })),
      notifications: notifications.map(({ message, position }) => ({
        severity: DiagnosticSeverity.Warning,
        message,
        position: {
          column: position.column,
          line: position.line,
          offset: position.offset,
        },
      })),
    };
  } catch (e) {
    /* Ignores exceptions if they happen calling the semantic analysis. Should not happen but this is just defensive in case it did */
    return { errors: [], notifications: [] };
  }
}

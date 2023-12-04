/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { semanticAnalysis } from './semanticAnalysis';

interface SemanticAnalysisResult {
  errors: SemanticAnalysisElement[];
  notifications: SemanticAnalysisElement[];
}

export interface SemanticAnalysisElement {
  message: string;
  position: {
    offset: number;
    line: number;
    column: number;
  };
}

export function doSemanticAnalysis(query: string): SemanticAnalysisResult {
  try {
    let semanticErrorsResult = undefined;
    semanticAnalysis([query], (a) => {
      semanticErrorsResult = a;
    });
    const errors: SemanticAnalysisElement[] = semanticErrorsResult.$errors.data;
    const notifications: SemanticAnalysisElement[] =
      semanticErrorsResult.$notifications.data;
    return { errors: errors, notifications: notifications };
  } catch (e) {
    /* Ignores exceptions if they happen calling the semantic analysis. Should not happen but this is just defensive in case it did */
    return { errors: [], notifications: [] };
  }
}

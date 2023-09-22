/* eslint-disable */
import { semanticAnalysis } from './semanticAnalysis';

interface SemanticAnalysisError {
  msg: string;
  line: number;
  column: number;
}

export function doSemanticAnalysis(query: string): SemanticAnalysisError[] {
  try {
    const errors = semanticAnalysis(query).$array.data;
    let i = 0;
    let keepLooping = true;
    let result: SemanticAnalysisError[] = [];

    while (i < errors.length && keepLooping) {
      const error = errors[i];

      if (error !== null) {
        const errorMsg = error['$msg'];
        const position = error['$position66'];
        result.push({
          msg: errorMsg.toString(),
          line: position['$line0'],
          column: position['$column0'],
        });
      } else {
        keepLooping = false;
      }
      i++;
    }

    return result;
  } catch (e) {
    /* Ignores exceptions if they happen calling the semantic analysis. Should not happen but this is just defensive in case it did */
    return [];
  }
}

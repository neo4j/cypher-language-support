/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { semanticAnalysis } from './semanticAnalysis';

interface SemanticAnalysisError {
  msg: string;
  line: number;
  column: number;
  offset: number;
}

export function doSemanticAnalysis(query: string): SemanticAnalysisError[] {
  try {
    let semanticErrorsResult = undefined;
    semanticAnalysis(query, (a) => {
      semanticErrorsResult = a;
    });
    const errors = semanticErrorsResult.$array.data;
    let i = 0;
    let keepLooping = true;
    const result: SemanticAnalysisError[] = [];

    while (i < errors.length && keepLooping) {
      const error = errors[i];

      if (error !== null) {
        const errorMsg = error['$msg'];
        const position = error['$position91'];
        result.push({
          msg: errorMsg.toString(),
          line: position['$line0'],
          column: position['$column0'],
          offset: position['$offset0'],
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

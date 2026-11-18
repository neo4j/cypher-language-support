import { ParseTreeWalker } from 'antlr4ng';
import { ParameterCollector } from './cypherLanguageService/collectors/parameterCollector.js';
import type { ParsingResult } from './cypherLanguageService/parserWrapper/parserWrapper.js';
import type { DbSchema } from './dbSchema.js';
import { findCaret } from './helpers.js';

export function getParameterHover({
  parsingResult,
  dbSchema,
  caretPosition,
}: {
  parsingResult: ParsingResult;
  dbSchema?: DbSchema;
  caretPosition: number;
}): { name: string; value: string } | undefined {
  if (!dbSchema) {
    return undefined;
  }

  if (dbSchema.parameters) {
    const caret = findCaret(parsingResult, caretPosition);
    if (caret) {
      const statement = caret.statement;
      const paramCollector = new ParameterCollector(caret.token);

      ParseTreeWalker.DEFAULT.walk(paramCollector, statement.ctx);

      const currentParam = paramCollector.caretParameter;
      if (currentParam) {
        const param = dbSchema.parameters[currentParam.name];
        if (param && param instanceof Object && 'stringValue' in param) {
          return {
            name: currentParam.name,
            value: param.stringValue as string,
          };
        }
      }
    }
  }
  return undefined;
}

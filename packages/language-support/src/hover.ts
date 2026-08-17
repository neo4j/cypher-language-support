import { ParseTreeWalker } from 'antlr4';
import { ParsingResult } from './cypherLanguageService.js';
import { DbSchema } from './dbSchema.js';
import { SignatureHelper } from './signatureHelp.js';
import { findCaret } from './helpers.js';
import { HoverInfo, Neo4jFunction, Neo4jProcedure } from './types.js';

export function getHoverInfo({
  caretPosition,
  dbSchema,
  parsingResult,
}: {
  caretPosition: number;
  dbSchema: DbSchema;
  parsingResult: ParsingResult;
}): HoverInfo | undefined {
  const result = findCaret(parsingResult, caretPosition);
  if (!result) {
    return undefined;
  }

  const statement = result.statement;
  const signatureHelper = new SignatureHelper(statement.tokens, result.token);
  const cypherVersion = statement.cypherVersion ?? dbSchema.defaultLanguage;
  if (!cypherVersion) {
    return undefined;
  }
  ParseTreeWalker.DEFAULT.walk(signatureHelper, statement.ctx);
  const method = signatureHelper.result;
  if (!method) {
    return undefined;
  }

  const methodName = method.methodName;

  if (method.methodType === 'procedure') {
    if (!dbSchema.procedures) {
      return undefined;
    }
    const fn = dbSchema.procedures?.[cypherVersion]?.[methodName];
    if (!fn) {
      return undefined;
    }

    const isDeprecated = fn.option.deprecated;

    return createHoverInfoObject(fn, isDeprecated);
  }

  if (method.methodType === 'function') {
    if (!dbSchema.functions) {
      return undefined;
    }
    const fn = dbSchema.functions?.[cypherVersion]?.[methodName];
    if (!fn) {
      return undefined;
    }

    const isDeprecated = fn.isDeprecated;

    return createHoverInfoObject(fn, isDeprecated);
  }
}

function createHoverInfoObject(
  fn: Neo4jFunction | Neo4jProcedure,
  isDeprecated: boolean,
): HoverInfo {
  return {
    signature: fn.signature,
    description: fn.description,
    returnDescription: fn.returnDescription,
    isDeprecated: isDeprecated,
    params: fn.argumentDescription.map((arg) => {
      return {
        name: arg.name,
        description: arg.description,
        isDeprecated: arg.isDeprecated,
        type: arg.type,
      };
    }),
  };
}

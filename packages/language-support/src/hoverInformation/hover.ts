import { ParsingResult } from '../cypherLanguageService.js';
import { DbSchema } from '../dbSchema.js';
import { getMethodSignature, MethodType } from '../signatureHelp.js';
import {
  SignatureHoverInfo,
  Neo4jFunction,
  Neo4jProcedure,
  SymbolsInfo,
  Symbol,
} from '../types.js';
import { findVariableOnCaret } from './variableHover.js';

export function getHoverInfo({
  caretPosition,
  dbSchema,
  parsingResult,
  symbolsInfo,
}: {
  caretPosition: number;
  dbSchema: DbSchema;
  parsingResult: ParsingResult;
  symbolsInfo: SymbolsInfo;
}): SignatureHoverInfo | Symbol | undefined {
  const methodSignatureInfo = getMethodSignature({
    parsingResult,
    caretPosition,
    dbSchema,
  });
  if (!methodSignatureInfo && symbolsInfo) {
    const variableSignatureInfo = findVariableOnCaret({
      parsingResult,
      caretPosition,
      dbSchema,
      symbolsInfo,
    });
    return variableSignatureInfo;
  }

  const { schemaMethod, parsedMethod } = methodSignatureInfo;
  if (!schemaMethod) {
    return;
  }

  return createSignatureHoverInfoObject(
    schemaMethod,
    isDeprecated(schemaMethod, parsedMethod.methodType),
  );
}

function createSignatureHoverInfoObject(
  fn: Neo4jFunction | Neo4jProcedure,
  isDeprecated: boolean,
): SignatureHoverInfo {
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

function isDeprecated(
  method: Neo4jFunction | Neo4jProcedure,
  type: MethodType,
): boolean {
  if (type === MethodType.function) {
    return (method as Neo4jFunction).isDeprecated;
  }
  if (type === MethodType.procedure) {
    return (method as Neo4jProcedure).option.deprecated;
  }
}

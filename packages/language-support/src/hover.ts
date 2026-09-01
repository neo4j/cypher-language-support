import { ParsingResult } from './cypherLanguageService.js';
import { DbSchema } from './dbSchema.js';
import { getMethodSignature, MethodType } from './signatureHelp.js';
import { SignatureHoverInfo, Neo4jFunction, Neo4jProcedure } from './types.js';

export function getHoverInfo({
  caretPosition,
  dbSchema,
  parsingResult,
}: {
  caretPosition: number;
  dbSchema: DbSchema;
  parsingResult: ParsingResult;
}): SignatureHoverInfo | undefined {
  const methodSignatureInfo = getMethodSignature({
    query: parsingResult,
    caretPosition,
    dbSchema,
    consoleCommandsEnabled: false,
  });
  if (!methodSignatureInfo) {
    return;
  }

  const { schemaMethod, parsedMethod } = methodSignatureInfo;
  if (!schemaMethod) {
    return;
  }

  return createHoverInfoObject(
    schemaMethod,
    isDeprecated(schemaMethod, parsedMethod.methodType),
  );
}

function createHoverInfoObject(
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

import { ParsingResult } from './cypherLanguageService.js';
import { DbSchema } from './dbSchema.js';
import { getMethodSignature } from './signatureHelp.js';
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

  const { signature } = methodSignatureInfo;
  if (!signature) {
    return;
  }

  return createHoverInfoObject(signature, false);
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

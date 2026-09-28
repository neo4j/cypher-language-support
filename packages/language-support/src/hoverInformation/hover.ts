import type { ParsingResult } from '../cypherLanguageService.js';
import type { DbSchema } from '../dbSchema.js';
import { getMethodSignature, MethodType } from '../signatureHelp.js';
import type { Neo4jFunction, Neo4jProcedure, SymbolsInfo } from '../types.js';
import { isLabelLeaf } from '../types.js';
import { findVariableOnCaret } from './variableHover.js';
import { renderLabelTree } from '../labelTreeRender.js';

export interface HoverDescription {
  name: string;
  description: string;
}

/** The hover information shared by functions and procedures. */
export interface MethodHoverInfo {
  signature: string;
  description: string;
  isDeprecated: boolean;
  parameters: HoverDescription[];
}

/**
 * The information to show when hovering a variable, function or procedure.
 * It is left to the consumer to render it, e.g. as markdown or as HTML.
 */
export type HoverInfo =
  | {
      kind: 'variable';
      variable: string;
      types: string[];
      labelExpression?: string;
    }
  | ({ kind: 'function'; returnType: string } & MethodHoverInfo)
  | ({ kind: 'procedure'; returnValues: HoverDescription[] } & MethodHoverInfo);

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
}): HoverInfo | undefined {
  const methodSignatureInfo = getMethodSignature({
    parsingResult,
    caretPosition,
    dbSchema,
    checkCaretOnMethodName: true,
  });

  if (!methodSignatureInfo?.schemaMethod) {
    if (!symbolsInfo) {
      return undefined;
    }
    const symbol = findVariableOnCaret({
      parsingResult,
      caretPosition,
      symbolsInfo,
    });
    if (!symbol) {
      return undefined;
    }

    const hasLabels =
      !isLabelLeaf(symbol.labels) && symbol.labels.children.length > 0;

    return {
      kind: 'variable',
      variable: symbol.variable,
      types: symbol.types,
      ...(hasLabels && { labelExpression: renderLabelTree(symbol.labels) }),
    };
  }

  const { schemaMethod, parsedMethod } = methodSignatureInfo;
  const methodInfo = {
    signature: schemaMethod.signature,
    description: schemaMethod.description,
    parameters: schemaMethod.argumentDescription.map(toHoverDescription),
  };

  if (parsedMethod.methodType === MethodType.procedure) {
    const procedure = schemaMethod as Neo4jProcedure;
    return {
      kind: 'procedure',
      ...methodInfo,
      isDeprecated: procedure.option.deprecated,
      returnValues: (procedure.returnDescription ?? []).map(toHoverDescription),
    };
  }

  const func = schemaMethod as Neo4jFunction;
  return {
    kind: 'function',
    ...methodInfo,
    isDeprecated: func.isDeprecated,
    returnType: func.returnDescription,
  };
}

function toHoverDescription({
  name,
  description,
}: HoverDescription): HoverDescription {
  return { name, description };
}

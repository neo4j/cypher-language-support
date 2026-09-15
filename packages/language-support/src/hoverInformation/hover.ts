import { Hover, MarkupKind } from 'vscode-languageserver-types';
import { ParsingResult } from '../cypherLanguageService.js';
import { DbSchema } from '../dbSchema.js';
import { getMethodSignature, MethodType } from '../signatureHelp.js';
import {
  SignatureHoverInfo,
  Neo4jFunction,
  Neo4jProcedure,
  SymbolsInfo,
} from '../types.js';
import { findVariableOnCaret } from './variableHover.js';
import { renderLabelTree } from '../labelTreeRender.js';

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
}): Hover | undefined {
  const methodSignatureInfo = getMethodSignature({
    parsingResult,
    caretPosition,
    dbSchema,
    checkCaretOnMethodName: true,
  });

  if (!methodSignatureInfo?.schemaMethod) {
    if (!symbolsInfo) {
      return;
    }
    const symbol = findVariableOnCaret({
      parsingResult,
      caretPosition,
      dbSchema,
      symbolsInfo,
    });
    if (!symbol) {
      return;
    }
    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: [
          '`',
          `${symbol.variable}: ${symbol.types.join(', ')}`,
          '`',
          '',
          renderLabelTree(symbol.labels),
        ].join('\n'),
      },
    };
  }

  const { schemaMethod, parsedMethod } = methodSignatureInfo;
  const deprecated = isDeprecated(schemaMethod, parsedMethod.methodType);
  const params = schemaMethod.argumentDescription.map((arg) => {
    return {
      name: arg.name,
      description: arg.description,
      isDeprecated: arg.isDeprecated,
      type: arg.type,
    };
  });

  return {
    contents: {
      kind: MarkupKind.Markdown,
      value: [
        '```cypher',
        schemaMethod.signature,
        '```',
        `${deprecated ? '(_deprecated_) ' : ''}${schemaMethod.description}`,
        '',
        ...createParametersHoverString(params),
        '',
        ...createReturnHoverString(schemaMethod.returnDescription),
      ].join('\n'),
    },
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

function createParametersHoverString(
  params: SignatureHoverInfo['params'],
): string[] {
  if (params.length === 0) {
    return [];
  }

  return [
    '**Parameters**',
    ...params.map((param) => {
      return `- \`${param.name}\` - ${param.description}`;
    }),
  ];
}

function createReturnHoverString(
  returnDescription: SignatureHoverInfo['returnDescription'],
): string[] {
  if (!returnDescription) {
    return [];
  }

  if (typeof returnDescription === 'string') {
    return [`**Returns:** \`${returnDescription}\``];
  }
  if (returnDescription.length === 0) {
    return [];
  }

  return [
    '**Returns**',
    ...returnDescription.map((ret) => {
      return `- \`${ret.name}\` - ${ret.description}`;
    }),
  ];
}

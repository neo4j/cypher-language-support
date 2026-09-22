import type { Hover } from 'vscode-languageserver-types';
import { MarkupKind } from 'vscode-languageserver-types';
import type { ParsingResult } from '../cypherLanguageService.js';
import type { DbSchema } from '../dbSchema.js';
import { getMethodSignature, MethodType } from '../signatureHelp.js';
import type {
  ArgumentDescription,
  Neo4jFunction,
  Neo4jProcedure,
  ReturnDescription,
  SymbolsInfo,
} from '../types.js';
import { isLabelLeaf } from '../types.js';
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

    const labelTreeString = [
      '```cypher',
      renderLabelTree(symbol.labels),
      '```',
    ].join('\n');
    const hoverContent = hasLabels
      ? [
          '`',
          `${symbol.variable}: ${symbol.types.join(', ')}`,
          '`',
          '',
          labelTreeString,
        ].join('\n')
      : ['`', `${symbol.variable}: ${symbol.types.join(', ')}`, '`'].join('\n');
    const hover = {
      contents: {
        kind: MarkupKind.Markdown,
        value: hoverContent,
      },
    };
    return hover;
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

  return false;
}

function createParametersHoverString(params: ArgumentDescription[]): string[] {
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
  returnDescription: string | ReturnDescription[],
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

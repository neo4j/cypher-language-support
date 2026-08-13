import { HoverInfo } from '@neo4j-cypher/language-support';

export function createParametersHoverString(
  params: HoverInfo['params'],
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

export function createReturnHoverString(
  returnDescription: HoverInfo['returnDescription'],
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

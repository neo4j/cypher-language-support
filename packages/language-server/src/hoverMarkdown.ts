import type {
  HoverDescription,
  HoverInfo,
} from '@neo4j-cypher/language-support';
import {
  escapeDescriptionForMarkdown,
  formatLineForMarkdown,
} from './descriptionToMarkdown.js';

function cypherCodeBlock(fragment: string): string[] {
  return ['```cypher', fragment, '```'];
}

export function hoverInfoToMarkdown(info: HoverInfo): string {
  if (info.kind === 'variable') {
    const typeLine = ['`', `${info.variable}: ${info.types.join(', ')}`, '`'];
    return (
      info.labelExpression === undefined
        ? typeLine
        : [...typeLine, '', ...cypherCodeBlock(info.labelExpression)]
    ).join('\n');
  }

  return [
    ...cypherCodeBlock(info.signature),
    `${info.isDeprecated ? '(_deprecated_) ' : ''}${escapeDescriptionForMarkdown(
      info.description,
    )}`,
    '',
    ...descriptionsToMarkdown('**Parameters**', info.parameters),
    '',
    ...(info.kind === 'function'
      ? functionReturn(info.returnType)
      : descriptionsToMarkdown('**Returns**', info.returnValues)),
  ].join('\n');
}

function descriptionsToMarkdown(
  heading: string,
  descriptions: HoverDescription[],
): string[] {
  if (descriptions.length === 0) {
    return [];
  }

  return [
    heading,
    ...descriptions.flatMap(({ name, description }) =>
      formatLineForMarkdown(name, description),
    ),
  ];
}

function functionReturn(returnType: string): string[] {
  return returnType ? [`**Returns:** \`${returnType}\``] : [];
}

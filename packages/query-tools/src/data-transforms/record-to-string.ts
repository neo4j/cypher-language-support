import type { Node, Path, Point, Relationship } from 'neo4j-driver';
import { isInt, isNode, isPath, isPoint, isRelationship } from 'neo4j-driver';

import type {
  CypherDataType,
  CypherProperty,
} from '../types/cypher-data-types';
import {
  isCypherPropertyType,
  isCypherTemporalType,
  isInt8Array,
} from '../types/cypher-data-types';
import { formatFloat } from './format-float';

export const spacialFormat = (p: Point): string => {
  const zString = p.z !== undefined ? `, z:${formatFloat(p.z)}` : '';
  return `point({srid:${p.srid.toString()}, x:${formatFloat(
    p.x,
  )}, y:${formatFloat(p.y)}${zString}})`;
};

export function propertyToString(
  property: CypherProperty,
  quoteStrings = true,
): string {
  if (Array.isArray(property)) {
    return `[${property
      .map((p) => propertyToString(p, quoteStrings))
      .join(', ')}]`;
  }
  if (property === null) {
    return 'null';
  }
  if (
    typeof property === 'boolean' ||
    isInt(property) ||
    typeof property === 'bigint' ||
    isCypherTemporalType(property)
  ) {
    return property.toString();
  }
  if (isPoint(property)) {
    spacialFormat(property);
  }
  if (typeof property === 'number') {
    return formatFloat(property);
  }

  if (typeof property === 'string') {
    if (quoteStrings) {
      return `"${property}"`;
    }
    return property;
  }

  if (isInt8Array(property)) {
    return 'ByteArray';
  }

  // This case shouldn't be used, but added as a fallback
  return String(property);
}

const cypherShellStyleStringify = (
  value: Node | Relationship | Path,
  {
    stringStyle,
    quoteStrings = true,
  }: { stringStyle: CypherStringStyle; quoteStrings: boolean },
): string => {
  const includeIds = stringStyle === 'cypher-with-ids';
  if (isNode(value)) {
    const labels = value.labels.length > 0 ? `:${value.labels.join(':')}` : '';
    const properties = Object.entries(value.properties)
      .map(([key, val]: [string, CypherProperty]) => {
        return `${key}: ${propertyToString(val, quoteStrings)}`;
      })
      .concat(
        includeIds
          ? [
              `<elementId>: "${value.elementId.toString()}", <id>: ${value.identity.toString()}`,
            ]
          : [],
      )
      .join(', ');
    const propertiesString = properties.length > 0 ? `{${properties}}` : '';

    const space = labels.length > 0 && propertiesString.length > 0 ? ' ' : '';
    return `(${labels}${space}${propertiesString})`;
  } else if (isRelationship(value)) {
    const type = value.type ? `:${value.type}` : '';

    const properties = Object.entries(value.properties)
      .map(([key, val]: [string, CypherProperty]) => {
        return `${key}: ${propertyToString(val, quoteStrings)}`;
      })
      .concat(
        includeIds
          ? [
              `<elementId>: ${
                quoteStrings
                  ? `"${value.elementId.toString()}"`
                  : value.elementId.toString()
              }, <id>: ${value.identity.toString()}`,
            ]
          : [],
      )
      .join(', ');
    const propertiesString = properties.length > 0 ? ` {${properties}}` : '';

    return `[${type}${propertiesString}]`;
  } else if (isPath(value)) {
    if (value.segments.length === 0) {
      return cypherShellStyleStringify(value.start, {
        stringStyle,
        quoteStrings,
      });
    }

    return value.segments
      .map((segment, index) => {
        const result = [];

        if (index === 0) {
          result.push(
            cypherShellStyleStringify(segment.start, {
              stringStyle,
              quoteStrings,
            }),
          );
        }

        if (
          segment.start.elementId === segment.relationship.startNodeElementId
        ) {
          result.push('-');
          result.push(
            cypherShellStyleStringify(segment.relationship, {
              stringStyle,
              quoteStrings,
            }),
          );
          result.push('->');
          result.push(
            cypherShellStyleStringify(segment.end, {
              stringStyle,
              quoteStrings,
            }),
          );
        } else {
          result.push('<-');
          result.push(
            cypherShellStyleStringify(segment.relationship, {
              stringStyle,
              quoteStrings,
            }),
          );
          result.push('-');
          result.push(
            cypherShellStyleStringify(segment.end, {
              stringStyle,
              quoteStrings,
            }),
          );
        }

        return result.join('');
      })
      .join('');
  }
  return '';
};

export type CypherStringStyle = 'cypher' | 'cypher-with-ids';
export type StringStyle = 'json' | CypherStringStyle;
type RecursiveStringifyOptions = {
  indentationLevel?: number;
  quoteStrings?: boolean;
  stringStyle?: StringStyle;
};
const recursiveStringify = (
  value: CypherDataType,
  {
    indentationLevel = 0,
    quoteStrings = true,
    stringStyle = 'json',
  }: RecursiveStringifyOptions = {},
): string => {
  const indentation = '  '.repeat(indentationLevel);

  const nextIndentationLevel = indentationLevel + 1;
  const nextIdentation = '  '.repeat(nextIndentationLevel);

  if (isCypherPropertyType(value)) {
    return propertyToString(value, quoteStrings);
  }

  if (Array.isArray(value)) {
    return `[
${value
  .map(
    (v) =>
      `${nextIdentation}${recursiveStringify(v, {
        indentationLevel: nextIndentationLevel,
        quoteStrings,
      })}`,
  )
  .join(',\n')}\n${indentation}]`;
  }

  // Now we have nodes, relationships, paths and cypher maps left.
  // No special care for them stringify them as we would normal objects
  // unless we are in cypher-shell style
  if (
    stringStyle !== 'json' &&
    (isNode(value) || isRelationship(value) || isPath(value))
  ) {
    return cypherShellStyleStringify(value, { stringStyle, quoteStrings });
  }

  const entries = Object.entries(value);
  if (entries.length === 0) {
    return '{}';
  }

  return `{
${entries
  .map(([key, val]: [string, CypherProperty]) => {
    return `${nextIdentation}${key}: ${recursiveStringify(val, {
      indentationLevel: nextIndentationLevel,
      quoteStrings,
    })}`;
  })
  .join(',\n')}
${indentation}}`;
};

export const cypherDataToString = (
  map: CypherDataType,
  stringStyle: StringStyle = 'json',
  quoteStrings = true,
): string => {
  return recursiveStringify(map, { quoteStrings, stringStyle });
};

import {
  isDate,
  isDateTime,
  isDuration,
  isInt,
  isLocalDateTime,
  isLocalTime,
  isNode,
  isPath,
  isPoint,
  isRelationship,
  isTime,
} from 'neo4j-driver-core';

import type {
  CypherDataType,
  CypherProperty,
} from '../types/cypher-data-types';
import {
  isCypherBasicPropertyType,
  isInt8Array,
} from '../types/cypher-data-types';

type CypherPropertyName =
  | 'Float'
  | 'null'
  | 'String'
  | 'Bigint'
  | 'Boolean'
  | `List${string}`
  | 'LocalTime'
  | 'Time'
  | 'Date'
  | 'LocalDateTime'
  | 'DateTime'
  | 'Integer'
  | 'Duration'
  | 'Point'
  | 'ByteArray'
  | 'Unknown';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const getPropertyTypeDisplayName = (
  val?: CypherProperty,
): CypherPropertyName => {
  const jsType = typeof val;
  if (jsType === 'number') {
    return 'Float';
  }

  if (val === null || val === undefined) {
    /* There's no concept of undefined in cypher, null serves both purposes */
    return 'null';
  }

  // Need to duplicate this `typeof` for typescripts type inference to understand
  if (typeof val !== 'object') {
    const capitalized = capitalize(jsType);

    switch (capitalized) {
      case 'String':
      case 'Bigint':
      case 'Boolean':
        return capitalized;
      default:
        return 'Unknown';
    }
  }

  if (val instanceof Array) {
    const [firstVal] = val;
    if (firstVal !== undefined) {
      // Lists in properties are only allowed to contain a single type so all items are the same type
      return `List<${getPropertyTypeDisplayName(firstVal)}>(${val.length})`;
    }
    return `List(${val.length})`;
  }

  if (isLocalTime(val)) {
    return 'LocalTime';
  }

  if (isTime(val)) {
    return 'Time';
  }

  if (isDate(val)) {
    return 'Date';
  }

  if (isLocalDateTime(val)) {
    return 'LocalDateTime';
  }

  if (isDateTime(val)) {
    return 'DateTime';
  }

  if (isInt(val)) {
    return 'Integer';
  }

  if (isDuration(val)) {
    return 'Duration';
  }

  if (isPoint(val)) {
    return 'Point';
  }

  if (isInt8Array(val)) {
    return 'ByteArray';
  }

  return 'Unknown';
};

export type CypherDataTypeName =
  | CypherPropertyName
  | 'Node'
  | 'Relationship'
  | 'Path'
  | 'Map';
export function getCypherTypeName(val?: CypherDataType): CypherDataTypeName {
  if (Array.isArray(val)) {
    return 'List';
  }

  if (isCypherBasicPropertyType(val)) {
    return getPropertyTypeDisplayName(val);
  }
  if (isNode(val)) {
    return 'Node';
  }

  if (isRelationship(val)) {
    return 'Relationship';
  }

  if (isPath(val)) {
    return 'Path';
  }

  // TODO Nacho: this was `Unknown` in the upx code. What should we do here?
  return 'Map';
}

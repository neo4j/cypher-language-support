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
  isVector,
} from 'neo4j-driver';

import type {
  CypherDataTypeName,
  CypherParameter,
  CypherPropertyName,
} from '@neo4j-cypher/language-support';
import type {
  CypherDataType,
  CypherProperty,
} from '../types/cypher-data-types.js';
import {
  isCypherBasicPropertyType,
  isInt8Array,
} from '../types/cypher-data-types.js';
import { cypherDataToString } from './record-to-string.js';

export type { CypherDataTypeName, CypherPropertyName };

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

  if (isVector(val)) {
    return 'Vector';
  }

  return 'Unknown';
};

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

  if (isVector(val)) {
    return 'Vector';
  }

  return 'Map';
}

/**
 * Creates a parameter for `DbSchema.parameters` from a value returned by the
 * neo4j driver, e.g. from evaluating `RETURN <expression>`
 */
export function toCypherParameter(value: CypherDataType): CypherParameter {
  return {
    type: getCypherTypeName(value),
    stringValue: cypherDataToString(value),
  };
}

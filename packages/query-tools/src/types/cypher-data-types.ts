import type {
  Date,
  DateTime,
  Duration,
  Integer,
  LocalDateTime,
  LocalTime,
  Node,
  Path,
  Point,
  Relationship,
  Time,
} from 'neo4j-driver';
import {
  isDate,
  isDateTime,
  isDuration,
  isInt,
  isLocalDateTime,
  isLocalTime,
  isPoint,
  isTime,
} from 'neo4j-driver';
type NumberOrInteger = number | Integer | bigint;

/** 
      The neo4j driver type mapping - https://neo4j.com/docs/javascript-manual/current/cypher-workflow/#js-driver-type-mapping
      
      Star denotes custom driver class.
      
      Cypher(neo4j) -  Driver type(js)
      null          - null
      List          - array
      Map           - Object
      Boolean       - boolean
      Integer       - Integer*
      Float         - number
      String        - string
      ByteArray     - Int8Array
      Date          - Date*
      Time          - Time*
      LocalTime     - LocalTime*
      DateTime      - DateTime*
      LocalDateTime - LocalDateTime*
      Duration      - Duration*
      Point         - Point*
      Node          - Node*
      Relationship  - Relationship*
      Path          - Path*
      */

export type CypherBasicPropertyType =
  | null
  | boolean
  | number
  | string
  | Integer
  | bigint
  | Int8Array
  | CypherTemporalType
  | Point;

export type CypherTemporalType =
  | Date<NumberOrInteger>
  | Time<NumberOrInteger>
  | DateTime
  | LocalTime<NumberOrInteger>
  | LocalDateTime
  | Duration<NumberOrInteger>;

// Lists are also allowed as property types, as long as all items are the same basic type
export type CypherProperty =
  | CypherBasicPropertyType
  | CypherBasicPropertyType[];

// CypherStructuralType can NOT be used as property or parameter
export type CypherStructuralType = Node | Relationship | Path;

// Maps & lists CAN be used as parameters but not as properties
// with the exception that list if all it's items are the same CypherBasicPropertyType
export type CypherList = (
  | CypherBasicPropertyType
  | CypherStructuralType
  | CypherMap
  | CypherList
)[];

export interface CypherMap {
  [key: string]:
    | CypherBasicPropertyType
    | CypherStructuralType
    | CypherMap
    | CypherList;
}

export type CypherDataType =
  | CypherBasicPropertyType
  | CypherStructuralType
  | CypherMap
  | CypherList;

export const isCypherTemporalType = (
  anything: unknown,
): anything is CypherTemporalType => {
  if (typeof anything === 'object' && anything !== null) {
    return [
      isDate,
      isTime,
      isDateTime,
      isLocalTime,
      isLocalDateTime,
      isDuration,
    ].some((tester) => tester(anything));
  }
  return false;
};

export const isCypherBasicPropertyType = (
  value: unknown,
): value is CypherBasicPropertyType => {
  const valType = typeof value;

  return (
    value === null ||
    valType === 'boolean' ||
    valType === 'string' ||
    valType === 'number' ||
    valType === 'bigint' ||
    value?.constructor === Int8Array ||
    isInt(value) ||
    isCypherTemporalType(value) ||
    isPoint(value)
  );
};

export const isCypherPropertyType = (
  value: unknown,
): value is CypherProperty => {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return true;
    }

    return isCypherBasicPropertyType(value[0]);
  }
  return isCypherBasicPropertyType(value);
};

export function isInt8Array(val: unknown): val is Int8Array {
  return (
    typeof val === 'object' && val !== null && val.constructor === Int8Array
  );
}

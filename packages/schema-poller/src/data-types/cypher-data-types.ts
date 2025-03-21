import type {
  Date,
  DateTime,
  Duration,
  Integer,
  LocalDateTime,
  LocalTime,
  Point,
  Time,
} from 'neo4j-driver-core';

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
  | Date
  | Time
  | DateTime
  | LocalTime
  | LocalDateTime
  | Duration;

// Lists are also allowed as property types, as long as all items are the same basic type
export type CypherProperty =
  | CypherBasicPropertyType
  | CypherBasicPropertyType[];

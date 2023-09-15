import type {
  Date,
  DateTime,
  Duration,
  Integer,
  LocalDateTime,
  LocalTime,
  Path,
  Time,
} from "neo4j-driver";
import {
  isDate,
  isDateTime,
  isDuration,
  isInt,
  isLocalDateTime,
  isLocalTime,
  isPath,
  isTime,
} from "neo4j-driver";

import type { CypherDataType } from "../types/cypher-data-types.js";
import type { CypherDataTypeName } from "./cypher-type-names.js";
import { getCypherTypeName } from "./cypher-type-names.js";

function simpleComparison<T>(a: T, b: T) {
  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  return 0;
}

const typeSortingOrder: Record<CypherDataTypeName, number> = {
  Unknown: 0,
  // maps get sorted as unknown
  Map: 1,
  Node: 2,
  Relationship: 3,
  List: 4,
  Path: 5,
  Point: 6,
  DateTime: 7,
  LocalDateTime: 8,
  Date: 9,
  Time: 10,
  LocalTime: 11,
  Duration: 12,
  String: 13,
  Boolean: 14,
  Integer: 15,
  Float: 16,
  null: 17,
  ByteArray: 18,
  Bigint: 19,
};

export function compareCypherValues(
  valueA?: CypherDataType,
  valueB?: CypherDataType
) {
  const typeA = getCypherTypeName(valueA);
  const typeB = getCypherTypeName(valueB);

  // compare numbers and integers together
  if (typeof valueA === "number" && typeof valueB === "number") {
    return simpleComparison(valueA, valueB);
  }

  if (typeof valueA === "number" && isInt(valueB)) {
    return simpleComparison(valueA, valueB.toNumber());
  }

  if (isInt(valueA) && typeof valueB === "number") {
    return simpleComparison(valueA.toNumber(), valueB);
  }

  if (isInt(valueA) && isInt(valueB)) {
    return simpleComparison(valueA.toNumber(), valueB.toNumber());
  }

  // sort other differing type by typepriority
  if (typeA !== typeB) {
    return simpleComparison(
      typeSortingOrder[typeA] ?? -1,
      typeSortingOrder[typeB] ?? -1
    );
  }

  if (valueA === undefined || valueA === null) {
    return 0;
  }

  // Typescript is not smart enough to figure out the types are the same so we'll cast valueB
  if (typeof valueA === "boolean") {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const castB = valueB as boolean;
    return simpleComparison(Number(valueA), Number(castB));
  }

  if (typeof valueA === "string") {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const castB = valueB as string;
    return valueA.localeCompare(castB, undefined, { sensitivity: "base" });
  }

  const totalSeconds = (time: {
    hour: Integer;
    minute: Integer;
    second: Integer;
    nanosecond: Integer;
  }) =>
    time.hour.toNumber() * 3600 +
    time.minute.toNumber() * 60 +
    time.second.toNumber() +
    time.nanosecond.toNumber() / 1e9;

  if (isLocalTime(valueA)) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const castB = valueB as LocalTime;

    return simpleComparison(totalSeconds(valueA), totalSeconds(castB));
  }

  if (isTime(valueA)) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const castB = valueB as Time;
    return simpleComparison(totalSeconds(valueA), totalSeconds(castB));
  }

  if (isDate(valueA)) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const castB = valueB as Date;
    return simpleComparison(
      valueA.toStandardDate().getTime(),
      castB.toStandardDate().getTime()
    );
  }

  if (isDateTime(valueA)) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const castB = valueB as DateTime;
    return simpleComparison(
      valueA.toStandardDate().getTime(),
      castB.toStandardDate().getTime()
    );
  }

  if (isLocalDateTime(valueA)) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const castB = valueB as LocalDateTime;
    return simpleComparison(
      valueA.toStandardDate().getTime(),
      castB.toStandardDate().getTime()
    );
  }

  if (isDuration(valueA)) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const castB = valueB as Duration;
    const totalMinutes = (duration: Duration) =>
      duration.months.toNumber() * 30 * 24 * 60 +
      duration.days.toNumber() * 24 * 60 +
      duration.seconds.toNumber() / 60 +
      castB.nanoseconds.toNumber() / 1e9;
    return simpleComparison(totalMinutes(valueA), totalMinutes(castB));
  }

  // sort path by length
  if (isPath(valueA)) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const pathB = valueB as Path;
    return simpleComparison(valueA.segments.length, pathB.segments.length);
  }

  if (Array.isArray(valueA)) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const castB = valueB as unknown[];
    return simpleComparison(valueA.length, castB.length);
  }

  // let nodes, relationships, points, bigints and maps pass through to default case
  return simpleComparison(valueA, valueB);
}

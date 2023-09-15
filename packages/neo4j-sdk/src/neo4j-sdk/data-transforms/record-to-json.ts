import { isInt, isPoint } from "neo4j-driver";

import {
  isCypherBasicPropertyType,
  isCypherTemporalType,
} from "../types/cypher-data-types.js";
import type {
  CypherDataType,
  CypherProperty,
} from "../types/cypher-data-types.js";
import { formatFloat } from "./format-float.js";

export function propertyToJSON(property: CypherProperty): string {
  if (property === null) {
    return "null";
  }
  if (typeof property === "boolean") {
    return property.toString();
  }
  if (isInt(property)) {
    return property.toString();
  }
  if (typeof property === "bigint") {
    return property.toString();
  }
  if (typeof property === "number") {
    return formatFloat(property);
  }
  if (typeof property === "string") {
    return `"${property}"`;
  }
  if (property.constructor === Int8Array) {
    return "ByteArray";
  }

  if (isCypherTemporalType(property) || isPoint(property)) {
    return `{${Object.entries(property)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .map(([key, val]) => `"${key}": ${propertyToJSON(val)}`)
      .join(",")}}`;
  }

  // This case shouldn't be used, but added as a fallback
  return String(property);
}

export const cypherDataToJSON = (map: CypherDataType): string => {
  const recursiveStringify = (
    value: CypherDataType,
    indentationLevel = 0
  ): string => {
    const indentation = "  ".repeat(indentationLevel);

    const nextIndentationLevel = indentationLevel + 1;
    const nextIdentation = "  ".repeat(nextIndentationLevel);

    if (Array.isArray(value)) {
      return `[
${value
  .map((v) => `${nextIdentation}${recursiveStringify(v, nextIndentationLevel)}`)
  .join(",\n")}\n${indentation}]`;
    }

    const objectProperty =
      typeof value === "object" &&
      (isCypherTemporalType(value ?? {}) || isPoint(value));

    // Normally nothing can be undefined, but when stringifying points & datetimes they can have undefined fields
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (value === null || value === undefined) {
      return "null";
    }

    if (!objectProperty && isCypherBasicPropertyType(value)) {
      return propertyToJSON(value);
    }

    // Now we have temporals, points, nodes, relationships, paths and cypher maps left.
    // No special care for them stringify them as we would normal objects
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return "{}";
    }

    return `{
${entries
  .map(([key, val]) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return `${nextIdentation}"${key}": ${recursiveStringify(
      val,
      nextIndentationLevel
    )}`;
  })
  .join(",\n")}
${indentation}}`;
  };

  return recursiveStringify(map);
};

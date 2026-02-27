import type { QueryResult, Record as Neo4jRecord } from 'neo4j-driver';
import { int, isInt, isVector, types, Vector } from 'neo4j-driver';

export const RESERVED_TYPE_PROPERTY_NAME = 'transport-class';
export const ESCAPE_CHAR = '_';

export type Neo4jType =
  | typeof types.Record
  | typeof types.Result
  | typeof types.ResultSummary
  | typeof types.Node
  | typeof types.PathSegment
  | typeof types.Path
  | typeof types.Relationship
  | typeof types.Point
  | typeof types.Date
  | typeof types.DateTime
  | typeof types.Duration
  | typeof types.LocalDateTime
  | typeof types.LocalTime
  | typeof types.Time
  | typeof types.Integer
  | typeof types.Vector
  | Record<string, unknown>
  | Neo4jType[]
  | undefined
  | null;

export function addAnnotationProp(
  obj: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  type: string | unknown,
  prop: string = RESERVED_TYPE_PROPERTY_NAME,
): Record<string, unknown> {
  // The shallow copy is needed because the object type returned by the driver is not extensible.
  let objShallowCopy = Object.entries(obj).reduce<Record<string, unknown>>(
    (newObj, [key, value]) => {
      newObj[key] = value;
      return newObj;
    },
    {},
  );

  // Recursively escape the reserved property if it already exists.
  if (Object.prototype.hasOwnProperty.call(objShallowCopy, prop)) {
    objShallowCopy = addAnnotationProp(
      objShallowCopy,
      objShallowCopy[prop],
      ESCAPE_CHAR + prop,
    );
    delete objShallowCopy[prop];
  }

  objShallowCopy[prop] = type;
  return objShallowCopy;
}

export function deleteAnnotationProp(obj: Record<string, unknown>): void {
  let escapedProp = RESERVED_TYPE_PROPERTY_NAME;

  while (Object.prototype.hasOwnProperty.call(obj, escapedProp)) {
    // On the first loop since `escapedProp` is not actually escaped, this
    // line does nothing. In the next loops we only want to replace the
    // first instance of the escape char.
    obj[escapedProp.replace(ESCAPE_CHAR, '')] = obj[escapedProp];

    delete obj[escapedProp];
    escapedProp = ESCAPE_CHAR + escapedProp;
  }
}

function copyAndAnnotate(
  obj: Exclude<Neo4jType | QueryResult, undefined | null | Neo4jType[]>,
): Record<string, unknown> {
  return Object.keys(obj).reduce<Record<string, unknown>>((newObj, key) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore TypeScript complains about not being able to use `key` to
    // index `obj`, but we know that `key` exists in `obj` since it's coming
    // from Object.keys.
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const value = obj[key] as unknown as Neo4jType;

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    newObj[key] = serializeTypeAnnotations(value);
    return newObj;
  }, {});
}

export function serializeTypeAnnotations(
  item: QueryResult | Neo4jRecord,
): Record<string, unknown>;
export function serializeTypeAnnotations(
  item: Neo4jType,
): Record<string, unknown> | null | undefined | unknown[];
export function serializeTypeAnnotations(
  item: Neo4jType | QueryResult | Neo4jRecord,
): Record<string, unknown> | null | undefined | unknown[] {
  if (Array.isArray(item)) {
    return item.map((i) => serializeTypeAnnotations(i));
  }
  if (item === null || item === undefined) {
    return item;
  }

  if (item instanceof types.Record) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore There are two versions of the type for Record coming from the
    // driver.
    const tmp = copyAndAnnotate(item);
    return addAnnotationProp(tmp, 'Record');
  }
  if (item instanceof types.ResultSummary) {
    const tmp = copyAndAnnotate(item);
    return addAnnotationProp(tmp, 'ResultSummary');
  }
  if (item instanceof types.Node) {
    const tmp = copyAndAnnotate(item);
    return addAnnotationProp(tmp, 'Node');
  }
  if (item instanceof types.PathSegment) {
    const tmp = copyAndAnnotate(item);
    return addAnnotationProp(tmp, 'PathSegment');
  }
  if (item instanceof types.Path) {
    const tmp = copyAndAnnotate(item);
    return addAnnotationProp(tmp, 'Path');
  }
  if (item instanceof types.Relationship) {
    const tmp = copyAndAnnotate(item);
    return addAnnotationProp(tmp, 'Relationship');
  }
  if (item instanceof types.Point) {
    const tmp = copyAndAnnotate(item);
    return addAnnotationProp(tmp, 'Point');
  }
  if (item instanceof types.Date) {
    const tmp = copyAndAnnotate(item);
    return addAnnotationProp(tmp, 'Date');
  }
  if (item instanceof types.DateTime) {
    const tmp = copyAndAnnotate(item);
    return addAnnotationProp(tmp, 'DateTime');
  }
  if (item instanceof types.Duration) {
    const tmp = copyAndAnnotate(item);
    return addAnnotationProp(tmp, 'Duration');
  }
  if (item instanceof types.LocalDateTime) {
    const tmp = copyAndAnnotate(item);
    return addAnnotationProp(tmp, 'LocalDateTime');
  }
  if (item instanceof types.LocalTime) {
    const tmp = copyAndAnnotate(item);
    return addAnnotationProp(tmp, 'LocalTime');
  }
  if (item instanceof types.Time) {
    const tmp = copyAndAnnotate(item);
    return addAnnotationProp(tmp, 'Time');
  }
  if (isInt(item)) {
    const tmp = { ...item };
    return addAnnotationProp(tmp, 'Integer');
  }
  if (isVector(item)) {
    const typedArray = item.asTypedArray();
    const values =
      typedArray instanceof BigInt64Array
        ? Array.from(typedArray, (v) => v.toString())
        : Array.from(typedArray);

    return addAnnotationProp(
      {
        _type: item.getType(),
        _values: values,
      },
      'Vector',
    );
  }
  if (typeof item === 'object') {
    const tmp = copyAndAnnotate(item);
    return addAnnotationProp(tmp, 'Object');
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore this type isn't inferred correctly
  return item;
}

/* eslint-disable @typescript-eslint/no-explicit-any,
@typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access,
@typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment,
no-underscore-dangle, @typescript-eslint/no-redundant-type-constituents
*/

export function deserializeTypeAnnotations(
  rawItem: Record<string, unknown>,
): QueryResult | Neo4jRecord;
export function deserializeTypeAnnotations(rawItem: any): any;
export function deserializeTypeAnnotations(
  rawItem: Record<string, unknown> | any,
): QueryResult | any {
  if (Array.isArray(rawItem)) {
    const mapped = rawItem.map((i) => deserializeTypeAnnotations(i));
    return mapped;
  }

  if (
    rawItem === null ||
    rawItem === undefined ||
    typeof rawItem === 'boolean' ||
    typeof rawItem === 'string' ||
    !Object.prototype.hasOwnProperty.call(rawItem, RESERVED_TYPE_PROPERTY_NAME)
  ) {
    return rawItem;
  }

  const item = { ...rawItem };
  const className = item[RESERVED_TYPE_PROPERTY_NAME];
  deleteAnnotationProp(item);

  switch (className) {
    case 'Record':
      return new types.Record(
        deserializeTypeAnnotations(item.keys),
        deserializeTypeAnnotations(item._fields),
        deserializeTypeAnnotations(item._fieldLookup),
      );
    case 'ResultSummary': {
      const metadata = {
        ...item,
        type: item.queryType,
        db: item.database.name,

        result_available_after: deserializeTypeAnnotations(
          item.resultAvailableAfter,
        ),
        result_consumed_after: deserializeTypeAnnotations(
          item.resultConsumedAfter,
        ),

        profile: item.profile === false ? null : item.profile,
        plan: item.plan === false ? null : item.plan,

        stream_summary: { have_records_streamed: true },

        server: {
          ...item.server,
          version: item.server.agent,
        },
      };

      return new types.ResultSummary(
        deserializeTypeAnnotations(item.query.text),
        deserializeTypeAnnotations(item.query.parameters),
        deserializeTypeAnnotations(metadata),
        deserializeTypeAnnotations(item.server.protocolVersion),
      );
    }
    case 'Node':
      return new types.Node(
        deserializeTypeAnnotations(item.identity),
        item.labels,
        deserializeTypeAnnotations(item.properties),
        item.elementId,
      );
    case 'Relationship':
      return new types.Relationship(
        deserializeTypeAnnotations(item.identity),
        deserializeTypeAnnotations(item.start),
        deserializeTypeAnnotations(item.end),
        item.type,
        deserializeTypeAnnotations(item.properties),
        item.elementId,
        item.startNodeElementId,
        item.endNodeElementId,
      );
    case 'PathSegment':
      return new types.PathSegment(
        deserializeTypeAnnotations(item.start),
        deserializeTypeAnnotations(item.relationship),
        deserializeTypeAnnotations(item.end),
      );
    case 'Path': {
      const { segments } = item;

      return new types.Path(
        deserializeTypeAnnotations(item.start),
        deserializeTypeAnnotations(item.end),
        (Array.isArray(segments) ? segments : []).map((x: any) =>
          deserializeTypeAnnotations(x),
        ),
      );
    }
    case 'Point':
      return new types.Point(
        deserializeTypeAnnotations(item.srid),
        deserializeTypeAnnotations(item.x),
        deserializeTypeAnnotations(item.y),
        deserializeTypeAnnotations(item.z),
      );
    case 'Date':
      return new types.Date(
        deserializeTypeAnnotations(item.year),
        deserializeTypeAnnotations(item.month),
        deserializeTypeAnnotations(item.day),
      );
    case 'DateTime':
      return new types.DateTime(
        deserializeTypeAnnotations(item.year),
        deserializeTypeAnnotations(item.month),
        deserializeTypeAnnotations(item.day),
        deserializeTypeAnnotations(item.hour),
        deserializeTypeAnnotations(item.minute),
        deserializeTypeAnnotations(item.second),
        deserializeTypeAnnotations(item.nanosecond),
        deserializeTypeAnnotations(item.timeZoneOffsetSeconds),
        deserializeTypeAnnotations(item.timeZoneId),
      );
    case 'Duration':
      return new types.Duration(
        deserializeTypeAnnotations(item.months),
        deserializeTypeAnnotations(item.days),
        deserializeTypeAnnotations(item.seconds),
        deserializeTypeAnnotations(item.nanoseconds),
      );
    case 'LocalDateTime':
      return new types.LocalDateTime(
        deserializeTypeAnnotations(item.year),
        deserializeTypeAnnotations(item.month),
        deserializeTypeAnnotations(item.day),
        deserializeTypeAnnotations(item.hour),
        deserializeTypeAnnotations(item.minute),
        deserializeTypeAnnotations(item.second),
        deserializeTypeAnnotations(item.nanosecond),
      );
    case 'LocalTime':
      return new types.LocalTime(
        deserializeTypeAnnotations(item.hour),
        deserializeTypeAnnotations(item.minute),
        deserializeTypeAnnotations(item.second),
        deserializeTypeAnnotations(item.nanosecond),
      );
    case 'Time':
      return new types.Time(
        deserializeTypeAnnotations(item.hour),
        deserializeTypeAnnotations(item.minute),
        deserializeTypeAnnotations(item.second),
        deserializeTypeAnnotations(item.nanosecond),
        deserializeTypeAnnotations(item.timeZoneOffsetSeconds),
      );
    case 'Integer':
      return int(item);

    case 'Vector': {
      // Reconstruct the appropriate TypedArray from serialized values
      const type = item._type;
      const values = item._values;
      let typedArray;

      switch (type) {
        case 'INT8':
          typedArray = new Int8Array(values);
          break;
        case 'INT16':
          typedArray = new Int16Array(values);
          break;
        case 'INT32':
          typedArray = new Int32Array(values);
          break;
        case 'INT64':
          // For INT64, values are stored as strings to avoid BigInt serialization issues
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          typedArray = new BigInt64Array(values.map((v: any) => BigInt(v)));
          break;
        case 'FLOAT32':
          typedArray = new Float32Array(values);
          break;
        case 'FLOAT64':
          typedArray = new Float64Array(values);
          break;
        default:
          // TODO test and veriy
          // fallback to plain object handling to avoid crashing
          // if someone were to add a new vector type, we don't want to crash the entire application
          return item;
      }

      return new Vector(typedArray);
    }
    case 'Object':
      return Object.keys(item).reduce<Record<string, unknown>>(
        (newObj, key) => {
          newObj[key] = deserializeTypeAnnotations(item[key]);
          return newObj;
        },
        {},
      );
    default:
      return item;
  }
}

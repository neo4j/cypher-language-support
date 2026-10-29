import { resultTransformers } from 'neo4j-driver';
import type { ExecuteQueryArgs } from '../types/sdkTypes.js';
import type { Constraint } from '@neo4j-cypher/language-support';

/**
 * List available constraints on your dbms
 * https://neo4j.com/docs/cypher-manual/current/schema/constraints/list-constraints/
 */
export function listConstraints(currentDb: string): ExecuteQueryArgs<{
  constraints: Constraint[];
}> {
  const query =
    'SHOW CONSTRAINTS YIELD type, labelsOrTypes, properties, enforcedLabel, propertyType';

  const resultTransformer = resultTransformers.mapped({
    map(record) {
      const obj = record.toObject();
      return obj as Constraint;
    },
    collect(constraints, summary) {
      return {
        constraints,
        summary,
      };
    },
  });

  return {
    query,
    queryConfig: { resultTransformer, routing: 'READ', database: currentDb },
  };
}

/**
 * List YIELDable fields available on SHOW CONSTRAINTS, or returns undefined if no constraints exist
 * https://neo4j.com/docs/cypher-manual/current/schema/constraints/list-constraints/
 */
export function listConstraintFields(currentDb: string): ExecuteQueryArgs<{
  fieldNames: string[] | undefined;
}> {
  const query = 'SHOW CONSTRAINTS YIELD * LIMIT 1';

  const resultTransformer = resultTransformers.mapped({
    map(record) {
      const fieldNames: string[] = record.keys.map((x) => x.toString());
      return fieldNames;
    },
    collect(fieldNames, summary) {
      return {
        fieldNames: fieldNames[0],
        summary,
      };
    },
  });

  return {
    query,
    queryConfig: { resultTransformer, routing: 'READ', database: currentDb },
  };
}

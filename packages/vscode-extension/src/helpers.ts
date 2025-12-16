import { DbSchema, lintCypherQuery } from '@neo4j-cypher/language-support';

export function validateParamInput(
  paramValue: string,
  dbSchema: DbSchema,
): string | undefined {
  const diagnostics = lintCypherQuery(
    `RETURN ${paramValue}`,
    dbSchema,
    true,
  ).diagnostics;
  const errors = diagnostics.filter((d) => d.severity === 1);
  if (errors.length > 0) {
    return (
      'Value cannot be evaluated: ' + errors.map((e) => e.message).join('. ')
    );
  }
  return undefined;
}

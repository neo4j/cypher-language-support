import {
  DbSchema as DbSchemaNew,
  Neo4jFunction,
} from '@neo4j-cypher/language-support-new';
import {
  DbSchema,
  // lintCypherQuery as _lintCypherQuery,
  // _internalFeatureFlags,
  validateSyntax,
  validateSemantics,
  Neo4jProcedure,
} from '@neo4j-cypher/language-support';
import workerpool from 'workerpool';

export function returnFive() {
  return 5;
}

function lintCypherQuery(
  query: string,
  dbSchema: DbSchemaNew,
  //featureFlags: { consoleCommands?: boolean; cypher25?: boolean } = {},
) {
  //console.log("Entering lintCypherQuery in worker with featureflags", featureFlags)
  // We allow to override the consoleCommands feature flag
  // if (featureFlags.consoleCommands !== undefined) {
  //   _internalFeatureFlags.consoleCommands = featureFlags.consoleCommands;
  // }
  // if (featureFlags.cypher25 !== undefined) {
  //   _internalFeatureFlags.cypher25 = featureFlags.cypher25;
  // }
  if (dbSchema.procedures && dbSchema.functions) {
    const oldSchema: DbSchema = {
      procedures: dbSchema.procedures['CYPHER 5'] as Record<
        string,
        Neo4jProcedure
      >,
      functions: dbSchema.functions['CYPHER 5'] as Record<
        string,
        Neo4jFunction
      >,
      labels: dbSchema.labels,
      relationshipTypes: dbSchema.relationshipTypes,
      databaseNames: dbSchema.databaseNames,
      aliasNames: dbSchema.aliasNames,
      // userNames: dbSchema.userNames,
      // roleNames: dbSchema.roleNames,
      parameters: dbSchema.parameters,
      propertyKeys: dbSchema.propertyKeys,
    };
    const syntaxErrors = validateSyntax(query, oldSchema);
    const semanticErrors =
      syntaxErrors.length > 0 ? [] : validateSemantics(query, oldSchema);

    return syntaxErrors.concat(semanticErrors);
  }

  return validateSyntax(query, {});
}

workerpool.worker({ lintCypherQuery });

type LinterArgs = Parameters<typeof lintCypherQuery>;

export type LinterTask = workerpool.Promise<ReturnType<typeof lintCypherQuery>>;

export type LintWorker = {
  lintCypherQuery: (...args: LinterArgs) => LinterTask;
};

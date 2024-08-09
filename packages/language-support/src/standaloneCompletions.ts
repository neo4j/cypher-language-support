import { autocomplete } from './autocompletion/autocompletion';
import { Neo4jFunction, Neo4jProcedure } from './types';

export interface DbSchemaNative {
  labels?: string[];
  relationshipTypes?: string[];
  databaseNames?: string[];
  aliasNames?: string[];
  userNames?: string[];
  roleNames?: string[];
  parameters?: Map<string, unknown>;
  propertyKeys?: string[];
  procedures?: Map<string, Neo4jProcedure>;
  functions?: Map<string, Neo4jFunction>;
}

function standaloneAutocomplete(query: string, dbSchemaNative: DbSchemaNative) {
  const dbSchema = {
    ...dbSchemaNative,
    procedures: Object.fromEntries(dbSchemaNative.procedures),
    functions: Object.fromEntries(dbSchemaNative.functions),
    parameters: Object.fromEntries(dbSchemaNative.parameters),
  };
  return autocomplete(query, dbSchema);
}

globalThis.autocomplete = standaloneAutocomplete;

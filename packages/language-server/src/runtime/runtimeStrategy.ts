import { DbSchema } from '@neo4j-cypher/language-support';

export interface RuntimeStrategy {
  getDbSchema(): DbSchema;
}

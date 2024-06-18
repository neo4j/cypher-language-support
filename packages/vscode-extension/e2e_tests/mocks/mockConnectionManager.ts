import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import { Neo4jSchemaPoller } from '@neo4j-cypher/schema-poller';
import { ConnnectionResult } from '@neo4j-cypher/schema-poller/dist/cjs/src/schemaPoller';

export class MockConnectionManager {
  private readonly _schemaPoller: Neo4jSchemaPoller;

  async connect(connectionSettings: Neo4jSettings): Promise<ConnnectionResult> {
    await Promise.resolve(connectionSettings);
    return { success: true };
  }

  disconnect() {}

  dispose() {}
}

import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import { Neo4jSchemaPoller } from '@neo4j-cypher/schema-poller';

export class MockConnectionManager {
  private readonly _schemaPoller: Neo4jSchemaPoller;

  async connect(connectionSettings: Neo4jSettings): Promise<void> {
    await Promise.resolve(connectionSettings);
  }

  disconnect() {}
}

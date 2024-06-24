import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';

export class MockLanguageClient {
  async sendNotification(
    methodName: string,
    settings: Neo4jSettings,
  ): Promise<void> {
    await Promise.resolve(
      `sending notification using ${methodName} with ${settings.connectURL}, ${settings.connect}, ${settings.database}, ${settings.password}, ${settings.trace.server}, ${settings.user}`,
    );
  }
}

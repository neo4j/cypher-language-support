import type {
  Neo4jConnectionSettings,
  Neo4jSettings,
} from '@neo4j-cypher/language-server/types';

export class MockLanguageClient {
  async sendNotification(
    methodName: string,
    settings?: Neo4jConnectionSettings | Neo4jSettings,
  ): Promise<void> {
    if (settings) {
      if ('trace' in settings) {
        await Promise.resolve(
          `sending settings notification using ${methodName} with ${settings?.trace.server}, ${settings?.features.linting}`,
        );
      } else {
        await Promise.resolve(
          `sending connection notification using ${methodName} with ${settings?.connectURL}, ${settings?.connect}, ${settings?.database}, ${settings?.password}, ${settings?.user}`,
        );
      }
    }
  }
}

import {
  LintWorkerSettings,
  Neo4jConnectionSettings,
  Neo4jSettings,
} from '@neo4j-cypher/language-server/src/types';

export class MockLanguageClient {
  async sendNotification(
    methodName: string,
    settings?: LintWorkerSettings | Neo4jConnectionSettings | Neo4jSettings,
  ): Promise<void> {
    if (settings) {
      if ('trace' in settings) {
        await Promise.resolve(
          `sending settings notification using ${methodName} with ${settings?.trace.server}, ${settings?.features.linting}`,
        );
      } else if ('connectURL' in settings) {
        await Promise.resolve(
          `sending connection notification using ${methodName} with ${settings?.connectURL}, ${settings?.connect}, ${settings?.database}, ${settings?.password}, ${settings?.user}`,
        );
      }
    }
  }
}

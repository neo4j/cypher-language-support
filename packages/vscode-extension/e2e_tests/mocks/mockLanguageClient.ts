import { DbSchema } from '@neo4j-cypher/language-support/dist/types';

export class MockLanguageClient {
  async sendNotification(
    methodName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dbSchema?: DbSchema,
  ): Promise<void> {
    await Promise.resolve(`sending notification using ${methodName}`);
  }
}

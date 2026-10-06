import type { DbSchema } from '@neo4j-cypher/language-support';

export abstract class MetadataPoller {
  public dbSchema: DbSchema = {};
  abstract stopBackgroundPolling(): void;
  abstract startBackgroundPolling(intervalSeconds?: number): void;
  abstract fetchDbSchema(): void;
}

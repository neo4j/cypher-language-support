import type { DbSchema } from '@neo4j-cypher/language-support';

export abstract class MetadataPoller {
  public dbSchema: DbSchema = {};
  /** @internal */
  abstract stopBackgroundPolling(): void;
  /** @internal */
  abstract startBackgroundPolling(intervalSeconds?: number): void;
  abstract fetchDbSchema(): void;
}

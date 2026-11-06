import type { DbSchema } from '@neo4j-cypher/language-support';
import { MetadataPoller } from './metadataPoller.js';

export class DisconnectedMetadataPoller extends MetadataPoller {
  public dbSchema: DbSchema = {};
  constructor(parameters: Record<string, unknown>) {
    super();
    this.dbSchema.parameters = parameters;
  }
  stopBackgroundPolling() {}
  startBackgroundPolling() {}
  fetchDbSchema(): void {}
}

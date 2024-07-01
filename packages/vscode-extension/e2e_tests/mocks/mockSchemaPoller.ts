/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConnnectionResult } from '@neo4j-cypher/schema-poller';
import EventEmitter from 'events';
import { Config, EagerResult, RecordShape } from 'neo4j-driver';

export class MockSchemaPoller {
  events: EventEmitter = new EventEmitter();

  async connect(
    url: string,
    credentials: {
      username: string;
      password: string;
    },
    config: {
      driverConfig?: Config;
      appName: string;
    },
    database?: string,
  ): Promise<ConnnectionResult> {
    return Promise.resolve({
      success: true,
      retriable: false,
      error: undefined,
    });
  }

  async persistentConnect(
    url: string,
    credentials: {
      username: string;
      password: string;
    },
    config: {
      driverConfig?: Config;
      appName: string;
    },
    database?: string,
  ): Promise<ConnnectionResult> {
    return Promise.resolve({
      success: true,
      retriable: false,
      error: undefined,
    });
  }

  async runQuery(query: string): Promise<EagerResult<RecordShape> | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result: Promise<undefined> = await Promise.resolve(undefined);
    return result;
  }

  disconnect(): void {}
}

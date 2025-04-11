/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConnnectionResult,
  Neo4jSchemaPoller,
} from '@neo4j-cypher/query-tools';
import EventEmitter from 'events';
import { Config } from 'neo4j-driver';

export class MockSchemaPoller extends Neo4jSchemaPoller {
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

  disconnect(): void {}
}

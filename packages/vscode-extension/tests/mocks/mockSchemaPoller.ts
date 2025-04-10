/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConnnectionResult,
  MetadataPoller,
  Neo4jConnection,
} from '@neo4j-cypher/schema-poller';
import EventEmitter from 'events';
import { Config, Driver } from 'neo4j-driver';

export class MockSchemaPoller {
  driver?: Driver;
  connection?: Neo4jConnection;
  events: EventEmitter = new EventEmitter();
  metadata?: MetadataPoller;

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

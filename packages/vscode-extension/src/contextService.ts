import { Neo4jConnectionSettings } from '@neo4j-cypher/language-server/src/types';
import {
  ConnnectionResult,
  MetadataPoller,
  Neo4jConnection,
  Neo4jSchemaPoller,
} from '@neo4j-cypher/schema-poller';
import EventEmitter from 'events';
import { Config } from 'neo4j-driver';
import { ExtensionContext } from 'vscode';
import CypherRunner from './cypherRunner';

type LanguageClient = {
  sendNotification: (
    method: string,
    settings?: Neo4jConnectionSettings,
  ) => Promise<void>;
};

type SchemaPoller = {
  connection?: Neo4jConnection;
  metadata?: MetadataPoller;
  events: EventEmitter;
  connect(
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
  ): Promise<ConnnectionResult>;
  persistentConnect(
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
  ): Promise<ConnnectionResult>;
  disconnect(): void;
};

let _context: ExtensionContext | undefined;
let _languageClient: LanguageClient | undefined;
let _schemaPoller: SchemaPoller | undefined;
let _queryRunner: CypherRunner | undefined;

/**
 * Sets global context/singletons for the extension.
 * @param context The global context of the extension's runtime.
 * @param languageClient The language client for the extension.
 */
export function setContext(
  context: ExtensionContext,
  languageClient: LanguageClient,
) {
  _context = context;
  _languageClient = languageClient;
  _schemaPoller = new Neo4jSchemaPoller();
  _queryRunner = new CypherRunner();
}

/**
 * @returns The global extension context.
 */
export function getExtensionContext(): ExtensionContext {
  if (!_context) {
    throw new Error('Context is undefined');
  }
  return _context;
}

/**
 * @returns The global language client.
 */
export function getLanguageClient(): LanguageClient {
  if (!_languageClient) {
    throw new Error('Language client is undefined');
  }
  return _languageClient;
}

/**
 * @returns The global schema poller.
 */
export function getSchemaPoller(): SchemaPoller {
  if (!_schemaPoller) {
    _schemaPoller = new Neo4jSchemaPoller();
  }

  return _schemaPoller;
}

/**
 * @returns The global query runner.
 */
export function getQueryRunner(): CypherRunner {
  if (!_queryRunner) {
    _queryRunner = new CypherRunner();
  }

  return _queryRunner;
}

import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import {
  ConnnectionResult,
  Neo4jConnection,
  Neo4jSchemaPoller,
} from '@neo4j-cypher/schema-poller';
import EventEmitter from 'events';
import { Config } from 'neo4j-driver';
import { ExtensionContext } from 'vscode';

type LanguageClient = {
  sendNotification: (method: string, settings?: Neo4jSettings) => Promise<void>;
};

type SchemaPoller = {
  connection?: Neo4jConnection;
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

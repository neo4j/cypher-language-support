import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import { ConnnectionResult } from '@neo4j-cypher/schema-poller';
import { ExtensionContext } from 'vscode';
import { SchemaPollerConnectionManager } from './schemaPollerConnectionManager';

type LanguageClient = {
  sendNotification: (method: string, settings: Neo4jSettings) => Promise<void>;
};

type DatabaseConnectionManager = {
  persistentConnect(settings: Neo4jSettings): Promise<ConnnectionResult>;
  connect: (settings: Neo4jSettings) => Promise<ConnnectionResult>;
  disconnect: () => void;
};

let _context: ExtensionContext | undefined;
let _languageClient: LanguageClient | undefined;
let _databaseConnectionManager: DatabaseConnectionManager | undefined;

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
  _databaseConnectionManager = new SchemaPollerConnectionManager();
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
 * @returns The global database connection manager.
 */
export function getDatabaseConnectionManager(): DatabaseConnectionManager {
  if (!_databaseConnectionManager) {
    throw new Error('Connection manager is undefined');
  }
  return _databaseConnectionManager;
}

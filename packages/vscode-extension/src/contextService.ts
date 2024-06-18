import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import { ConnnectionResult } from '@neo4j-cypher/schema-poller/dist/cjs/src/schemaPoller';
import { ExtensionContext } from 'vscode';
import { SchemaPollerConnectionManager } from './schemaPollerConnectionManager';

type LanguageClient = {
  sendNotification: (method: string, settings: Neo4jSettings) => Promise<void>;
};

type ConnectionManager = {
  connect: (settings: Neo4jSettings) => Promise<ConnnectionResult>;
  disconnect: () => void;
};

let _context: ExtensionContext | undefined;
let _languageClient: LanguageClient | undefined;
let _connectionManager: ConnectionManager | undefined;

export function setContext(
  context: ExtensionContext,
  languageClient: LanguageClient,
) {
  _context = context;
  _languageClient = languageClient;
  _connectionManager = new SchemaPollerConnectionManager();
}

export function getExtensionContext(): ExtensionContext {
  if (!_context) {
    throw new Error('Context is undefined');
  }
  return _context;
}

export function getLanguageClient(): LanguageClient {
  if (!_languageClient) {
    throw new Error('Language client is undefined');
  }
  return _languageClient;
}

export function getConnectionManager(): ConnectionManager {
  if (!_connectionManager) {
    throw new Error('Connection manager is undefined');
  }
  return _connectionManager;
}

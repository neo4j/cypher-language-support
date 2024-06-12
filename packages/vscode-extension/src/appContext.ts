import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import { ExtensionContext } from 'vscode';

type Neo4jLanguageClient = {
  sendNotification: (method: string, settings: Neo4jSettings) => Promise<void>;
};

let _context: ExtensionContext | undefined;
let _languageClient: Neo4jLanguageClient | undefined;

export function setAppContext(
  context: ExtensionContext,
  languageClient: Neo4jLanguageClient,
) {
  _context = context;
  _languageClient = languageClient;
}

export function getExtensionContext(): ExtensionContext {
  if (!_context) {
    throw new Error('Context is undefined');
  }
  return _context;
}

export function getLanguageClient(): Neo4jLanguageClient {
  if (!_languageClient) {
    throw new Error('Language client is undefined');
  }
  return _languageClient;
}

import {
  LintWorkerSettings,
  Neo4jConnectionSettings,
  SymbolFetchingParams,
} from '@neo4j-cypher/language-server/src/types';
import { Neo4jSchemaPoller } from '@neo4j-cypher/query-tools';
import { ExtensionContext } from 'vscode';
import CypherRunner from './cypherRunner';
import { SymbolTable } from '@neo4j-cypher/language-support';

type LanguageClient = {
  sendNotification: (
    method: string,
    params?:
      | Neo4jConnectionSettings
      | LintWorkerSettings
      | { symbolTable: SymbolTable }
      | SymbolFetchingParams,
  ) => Promise<void>;
};

let _context: ExtensionContext | undefined;
let _languageClient: LanguageClient | undefined;
let _schemaPoller: Neo4jSchemaPoller | undefined;
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
export function getSchemaPoller(): Neo4jSchemaPoller {
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

import {
  LintWorkerSettings,
  Neo4jConnectionSettings,
} from '@neo4j-cypher/language-server/src/types';
import { getLanguageClient } from './contextService';
import { DbSchema, SymbolTable } from '@neo4j-cypher/language-support';

export type MethodName =
  | 'connectionUpdated'
  | 'connectionDisconnected'
  | 'updateParameters'
  | 'updateLintWorker'
  | 'symbolTableDone'
  | 'fetchSymbolTable';

/**
 * Communicates to the language client that a connection has been updated or disconnected and needs to take action.
 * @param methodName The name of the method to call.
 * @param settings The settings to send to the language client.
 */
export async function sendNotificationToLanguageClient(
  methodName: MethodName,
  params?:
    | Neo4jConnectionSettings
    | LintWorkerSettings
    | { symbolTable: SymbolTable }
    | { query: string; uri: string; schema: DbSchema },
) {
  const languageClient = getLanguageClient();
  await languageClient.sendNotification(methodName, params);
}

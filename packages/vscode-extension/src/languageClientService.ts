import type { Neo4jConnectionSettings } from '@neo4j-cypher/language-server/types';
import { getLanguageClient } from './contextService';

export type MethodName =
  | 'connectionUpdated'
  | 'connectionDisconnected'
  | 'updateParameters';

/**
 * Communicates to the language client that a connection has been updated or disconnected and needs to take action.
 * @param methodName The name of the method to call.
 * @param settings The settings to send to the language client.
 */
export async function sendNotificationToLanguageClient(
  methodName: MethodName,
  settings?: Neo4jConnectionSettings,
) {
  const languageClient = getLanguageClient();
  await languageClient.sendNotification(methodName, settings);
}

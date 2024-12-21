import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import { getLanguageClient } from './contextService';

export type MethodName = 'connectionUpdated' | 'connectionDisconnected';

/**
 * Communicates to the language client that a connection has been updated or disconnected and needs to take action.
 * @param methodName The name of the method to call.
 * @param settings The settings to send to the language client.
 */
export async function sendNotificationToLanguageClient(
  methodName: MethodName,
  settings?: Neo4jSettings,
) {
  const languageClient = getLanguageClient();
  await languageClient.sendNotification(methodName, settings);
}

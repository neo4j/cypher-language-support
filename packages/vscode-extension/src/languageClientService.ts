import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import { getLanguageClient } from './contextService';

export type MethodName = 'connectionUpdated' | 'connectionDeleted';

export async function sendNotificationToLanguageClient(
  methodName: MethodName,
  settings: Neo4jSettings,
) {
  const languageClient = getLanguageClient();
  await languageClient.sendNotification(methodName, settings);
}

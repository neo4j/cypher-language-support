import { ConfigurationChangeEvent } from 'vscode';
import { getCurrentConnection } from './connectionService';
import {
  MethodName,
  sendNotificationToLanguageClient,
} from './languageClientService';

export async function configurationChangedEventHandler(
  event: ConfigurationChangeEvent,
): Promise<void> {
  if (event.affectsConfiguration('neo4j.trace.server')) {
    const currentConnection = getCurrentConnection();
    if (currentConnection) {
      await sendNotificationToLanguageClient(
        MethodName.ConnectionUpdated,
        currentConnection,
      );
    }
  }
}

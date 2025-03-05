import { sendNotificationToLanguageClient } from './languageClientService';
import { parametersManager } from './treeviews/parametersTreeProvider';

export async function sendParametersToLanguageServer() {
  await sendNotificationToLanguageClient(
    'updateParameters',
    parametersManager.asParameters(),
  );
}

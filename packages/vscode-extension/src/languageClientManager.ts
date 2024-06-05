import { LanguageClient } from 'vscode-languageclient/node';

/**
 * Singleton class to dispatch notifications to the language client
 *
 * Wraps a LanguageClient instance and exposes a function to send notifications
 */
type MethodName = 'connectionChanged';

export class LangugageClientManager {
  private static _instance: LangugageClientManager;
  private readonly _languageClient: LanguageClient;

  constructor(languageClient: LanguageClient) {
    this._languageClient = languageClient;
  }

  public static set instance(value: LangugageClientManager) {
    LangugageClientManager._instance = value;
  }

  public static get instance(): LangugageClientManager {
    return LangugageClientManager._instance;
  }

  async dispatchNotification(methodName: MethodName, payload: object) {
    await this._languageClient.sendNotification(methodName, payload);
  }
}

import { LanguageClient } from 'vscode-languageclient/node';

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

  async sendNotification(eventName: string, payload: object) {
    await this._languageClient.sendNotification(eventName, payload);
  }
}

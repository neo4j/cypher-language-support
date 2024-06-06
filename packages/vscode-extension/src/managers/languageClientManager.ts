import { LanguageClient } from 'vscode-languageclient/node';
import { MethodName } from '../types/methodName';

/**
 * Singleton class to dispatch notifications to the language client
 *
 * Wraps a LanguageClient instance and exposes a function to send notifications
 */
export class LangugageClientManager {
  private static _instance: LangugageClientManager;
  private readonly _languageClient: LanguageClient;

  constructor(languageClient: LanguageClient) {
    this._languageClient = languageClient;
  }

  static set instance(value: LangugageClientManager) {
    LangugageClientManager._instance = value;
  }

  static get instance(): LangugageClientManager {
    return LangugageClientManager._instance;
  }

  async sendNotification(methodName: MethodName, payload: object) {
    await this._languageClient.sendNotification(methodName, payload);
  }
}

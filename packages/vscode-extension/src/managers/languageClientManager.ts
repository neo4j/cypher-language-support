import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import { workspace } from 'vscode';
import { LanguageClient } from 'vscode-languageclient/node';
import { ConnectionRepository } from '../repositories/connectionRepository';
import { Connection, getConnectionString } from '../types/connection';
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

  async sendNotification(methodName: MethodName, connection: Connection) {
    const settings = await this.getLanguageClientConnectionSettings(connection);
    await this._languageClient.sendNotification(methodName, settings);
  }

  private async getLanguageClientConnectionSettings(
    connection: Connection,
  ): Promise<Neo4jSettings> {
    const trace = workspace
      .getConfiguration('neo4j')
      .get<{ server: 'off' | 'messages' | 'verbose' }>('trace') ?? {
      server: 'off',
    };

    const password =
      await ConnectionRepository.instance.getPasswordForConnection(
        connection.key,
      );

    return {
      trace: trace,
      connect: connection.connect,
      connectURL: getConnectionString(connection),
      database: connection.database,
      user: connection.user,
      password: password,
    };
  }
}

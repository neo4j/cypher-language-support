import { SecretStorage } from 'vscode';

/**
 * Singleton class to manage secret storage
 *
 * Wraps a SecretStorage instance and exposes functions to store, retrieve, and delete passwords for connections
 */
export class SecretStorageManager {
  private static _instance: SecretStorageManager;
  private readonly _secretStorage: SecretStorage;

  constructor(secretStorage: SecretStorage) {
    this._secretStorage = secretStorage;
  }

  public static set instance(value: SecretStorageManager) {
    SecretStorageManager._instance = value;
  }

  public static get instance(): SecretStorageManager {
    return SecretStorageManager._instance;
  }

  async setPasswordForConnection(
    connectionName: string,
    password: string,
  ): Promise<void> {
    await this._secretStorage.store(connectionName, password);
  }

  async getPasswordForConnection(connectionName: string): Promise<string> {
    return await this._secretStorage.get(connectionName);
  }
}

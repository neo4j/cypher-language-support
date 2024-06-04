import { SecretStorage } from 'vscode';

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

  setPasswordForConnection(connectionName: string, password: string) {
    void this._secretStorage.store(connectionName, password);
  }

  getPasswordForConnection(connectionName: string) {
    return this._secretStorage.get(connectionName);
  }

  deletePasswordForConnection(connectionName: string) {
    void this._secretStorage.delete(connectionName);
  }
}

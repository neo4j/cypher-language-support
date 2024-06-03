import { SecretStorage } from 'vscode';

export class SecretsManager {
  static secrets: SecretStorage;

  static async setPasswordForConnection(
    connectionName: string,
    password: string,
  ) {
    await this.secrets.store(connectionName, password);
  }

  static async getPasswordForConnection(connectionName: string) {
    return await this.secrets.get(connectionName);
  }

  static async deletePasswordForConnection(connectionName: string) {
    await this.secrets.delete(connectionName);
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Event, SecretStorage, SecretStorageChangeEvent } from 'vscode';

export class InMemorySecretStorage implements SecretStorage {
  private _storage: { [keyName: string]: any } = {};

  get(key: string): Thenable<string> {
    return Promise.resolve(this._storage[key]);
  }

  store(key: string, value: string): Thenable<void> {
    this._storage[key] = value;
    return Promise.resolve();
  }

  delete(key: string): Thenable<void> {
    this._storage[key] = undefined;
    return Promise.resolve();
  }

  onDidChange: Event<SecretStorageChangeEvent>;
}

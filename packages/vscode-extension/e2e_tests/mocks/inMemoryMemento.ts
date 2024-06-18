/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Memento } from 'vscode';

export class InMemoryMemento implements Memento {
  private _storage: { [keyName: string]: any } = {};

  get<T>(key: string): T | undefined;
  get<T>(key: string, defaultValue: T): T;
  get(key: string, defaultValue?: any) {
    return this._storage[key] || defaultValue;
  }

  update(key: string, value: any): Thenable<void> {
    this._storage[key] = value;
    return Promise.resolve();
  }

  keys(): readonly string[] {
    return Object.keys(this._storage);
  }

  setKeysForSync(keys: string[]): void {}
}

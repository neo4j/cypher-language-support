import { Memento } from 'vscode';
import { Connections } from '../../src/connectionService';

export class InMemoryMemento implements Memento {
  private _storage: { [keyName: string]: Connections } = {};

  get<T>(key: string): T | undefined;
  get<T>(key: string, defaultValue: T): T;
  get(key: string, defaultValue?: null) {
    return this._storage[key] || defaultValue;
  }

  update(key: string, value: Connections): Thenable<void> {
    this._storage[key] = value;
    return Promise.resolve();
  }

  keys(): readonly string[] {
    return Object.keys(this._storage);
  }

  setKeysForSync(keys: string[]): void {
    keys;
  }
}

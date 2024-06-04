import { Memento } from 'vscode';
import { Settings } from './types/settings';

export class GlobalStateManager {
  private static _instance: GlobalStateManager;
  private readonly _globalState: Memento;

  constructor(globalState: Memento) {
    this._globalState = globalState;
  }

  public static set instance(value: GlobalStateManager) {
    GlobalStateManager._instance = value;
  }

  public static get instance(): GlobalStateManager {
    return GlobalStateManager._instance;
  }

  getConnectionNames(): readonly string[] {
    return this._globalState.keys();
  }

  getConnection(connectionName: string): Settings | undefined {
    return this._globalState.get(connectionName);
  }

  setConnection(settings: Settings): void {
    void this._globalState.update(settings.connectionName, settings);
  }
}

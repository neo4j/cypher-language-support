import { Memento } from 'vscode';
import { Settings } from './types/settings';

/**
 * Singleton class to manage global state
 *
 * Wraps a Memento instance and exposes a number of functions to
 * get and update connections stored in the global workspace
 */
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

  async setConnection(settings: Settings): Promise<void> {
    await this._globalState.update(settings.connectionName, settings);
  }
}

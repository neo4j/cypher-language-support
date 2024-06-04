import { TransientConnection } from '@neo4j-cypher/schema-poller';

export class TransientConnectionManager {
  private static _instance: TransientConnectionManager;
  private readonly _transientConnection: TransientConnection;

  constructor(transientConnection: TransientConnection) {
    this._transientConnection = transientConnection;
  }

  public static set instance(value: TransientConnectionManager) {
    TransientConnectionManager._instance = value;
  }

  public static get instance(): TransientConnectionManager {
    return TransientConnectionManager._instance;
  }
}

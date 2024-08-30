import { Database } from '@neo4j-cypher/schema-poller';
import {
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  Uri,
} from 'vscode';
import {
  Connection,
  getAllConnections,
  getConnectionByKey,
  getConnectionDatabases,
} from './../connectionService';

export type ConnectionItemType =
  | 'connection'
  | 'activeConnection'
  | 'database'
  | 'activeDatabase';

export class ConnectionTreeDataProvider
  implements TreeDataProvider<ConnectionItem>
{
  private _onDidChangeTreeData: EventEmitter<
    ConnectionItem | undefined | void
  > = new EventEmitter<ConnectionItem | undefined | void>();
  readonly onDidChangeTreeData: Event<ConnectionItem | undefined | void> =
    this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ConnectionItem): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getChildren(element?: ConnectionItem): ConnectionItem[] {
    if (!element) {
      return this.getTopLevelConnections();
    }

    if (element.type === 'activeConnection') {
      return this.getDatabaseConnectionItems(element);
    }
  }

  private getTopLevelConnections(): ConnectionItem[] {
    const connectionItems = Array<ConnectionItem>();
    const connections = getAllConnections();

    for (const connection of connections) {
      if (connection) {
        let description: string = '';

        switch (connection.state) {
          case 'active':
            description = 'connected';
            break;
          case 'activating':
          case 'error':
            description = 'connecting...';
            break;
          default:
            description = '';
            break;
        }

        connectionItems.push(
          new ConnectionItem(
            connection.state === 'active' ? 'activeConnection' : 'connection',
            this.getConnectionName(connection),
            description,
            connection.state === 'active'
              ? TreeItemCollapsibleState.Collapsed
              : TreeItemCollapsibleState.None,
            connection.key,
          ),
        );
      }
    }

    return connectionItems;
  }

  private getDatabaseConnectionItems(
    element: ConnectionItem,
  ): ConnectionItem[] {
    const connection = getConnectionByKey(element.key);

    if (!connection) {
      return [];
    }

    return getConnectionDatabases().map(
      (database: Pick<Database, 'name' | 'default' | 'home'>) => {
        const name: string = database.home
          ? `${database.name} 🏠`
          : database.name;

        const activeDatabase: boolean =
          database.name === connection.database ||
          (!connection.database && database.default);

        const description: string = activeDatabase ? 'active' : '';

        const type: ConnectionItemType = activeDatabase
          ? 'activeDatabase'
          : 'database';

        return new ConnectionItem(
          type,
          name,
          description,
          TreeItemCollapsibleState.None,
          database.name,
        );
      },
      [],
    );
  }

  private getConnectionName(connection: Connection): string {
    return connection.port
      ? `${connection.user}@${connection.scheme}://${connection.host}:${connection.port}`
      : `${connection.user}@${connection.scheme}://${connection.host}`;
  }
}

export const connectionTreeDataProvider = new ConnectionTreeDataProvider();

/**
 * Extends the TreeItem class to represent a connection in the tree view.
 * @param key The unique key of the connection, used to set the id.
 * @param state The state of the connection, used to set the description.
 * @param label The label of the connection, used to set the label and tooltip.
 * @param collapsibleState The collapsible state of the connection.
 */
export class ConnectionItem extends TreeItem {
  constructor(
    readonly type: ConnectionItemType,
    readonly label: string,
    readonly description: string,
    readonly collapsibleState: TreeItemCollapsibleState,
    readonly key?: string,
  ) {
    super(label, collapsibleState);
    this.tooltip = label;
    this.contextValue = this.type;

    switch (type) {
      case 'activeConnection':
      case 'connection':
        this.id = key;
        break;
      case 'activeDatabase':
      case 'database':
        this.resourceUri = Uri.from({ scheme: '', query: `type=${this.type}` });
        this.iconPath = '.';
        break;
    }
  }
}

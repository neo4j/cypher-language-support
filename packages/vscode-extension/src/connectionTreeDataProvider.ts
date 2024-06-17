import {
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
} from 'vscode';
import { getAllConnections } from './connectionService';

type ConnectionItemType = 'connection' | 'activeConnection';

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
  }

  private getTopLevelConnections(): ConnectionItem[] {
    const connectionItems = Array<ConnectionItem>();
    const connections = getAllConnections();

    for (const connection of connections) {
      if (connection) {
        connectionItems.push(
          new ConnectionItem(
            connection.key,
            connection.connect ? 'activeConnection' : 'connection',
            connection.name,
            TreeItemCollapsibleState.None,
          ),
        );
      }
    }
    return connectionItems;
  }
}

export class ConnectionItem extends TreeItem {
  constructor(
    public readonly key: string,
    public readonly type: ConnectionItemType,
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
  ) {
    super(label, collapsibleState);
    this.id = key;
    this.tooltip = this.label;
    this.description = this.type === 'activeConnection' ? 'connected' : '';
    this.contextValue = this.type;
  }
}

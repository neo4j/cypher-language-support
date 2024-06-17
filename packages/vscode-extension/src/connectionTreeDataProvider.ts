import {
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
} from 'vscode';
import { getAllConnections, State } from './connectionService';

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
            connection.state,
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
    public readonly state: State,
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
  ) {
    super(label, collapsibleState);
    this.id = key;
    this.tooltip = this.label;
    switch (state) {
      case 'connected':
        this.description = 'connected';
        break;
      case 'connecting':
        this.description = 'connecting...';
        break;
      case 'reconnecting':
        this.description = 'reconnecting...';
        break;
      default:
        this.description = '';
        break;
    }
    this.contextValue =
      this.state === 'connected' || this.state === 'reconnecting'
        ? 'activeConnection'
        : 'connection';
  }
}

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

/**
 * Extends the TreeItem class to represent a connection in the tree view.
 * @param key The unique key of the connection, used to set the id.
 * @param state The state of the connection, used to set the description.
 * @param label The label of the connection, used to set the label and tooltip.
 * @param collapsibleState The collapsible state of the connection.
 */
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
      case 'active':
        this.description = 'connected';
        break;
      case 'activating':
      case 'error':
        this.description = 'connecting...';
        break;
      default:
        this.description = '';
        break;
    }

    this.contextValue =
      this.state === 'inactive' ? 'connection' : 'activeConnection';
  }
}

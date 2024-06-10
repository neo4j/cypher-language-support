import {
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
} from 'vscode';
import { getAllConnections, getConnectionDataSummary } from './connection';

type ConnectionItemType =
  | 'connection'
  | 'activeConnection'
  | 'label'
  | 'relationship';

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

    switch (element.type) {
      case 'connection':
      case 'activeConnection':
        return this.getConnectionElement(element);
      case 'label':
      case 'relationship':
        return this.getPropertyElements(element);
    }
  }

  private getConnectionElement(element: ConnectionItem): ConnectionItem[] {
    if (element.type === 'activeConnection') {
      return [
        new ConnectionItem(
          'label',
          'Labels',
          TreeItemCollapsibleState.Collapsed,
          element.key,
        ),
        new ConnectionItem(
          'relationship',
          'Relationships',
          TreeItemCollapsibleState.Collapsed,
          element.key,
        ),
      ];
    }
  }

  private getPropertyElements(element: ConnectionItem): ConnectionItem[] {
    const summary = getConnectionDataSummary(element.key);
    if (element.type === 'label') {
      return this.mapConnectionItemsForType(element.type, summary.labels);
    } else {
      return this.mapConnectionItemsForType(
        element.type,
        summary.relationshipTypes,
      );
    }
  }

  private mapConnectionItemsForType(
    type: ConnectionItemType,
    properties: string[],
  ): ConnectionItem[] {
    return properties?.map(
      (r) => new ConnectionItem(type, r, TreeItemCollapsibleState.None),
    );
  }

  private getTopLevelConnections(): ConnectionItem[] {
    const connectionItems = Array<ConnectionItem>();
    const connections = getAllConnections();

    for (const connection of connections) {
      if (connection) {
        connectionItems.push(
          new ConnectionItem(
            connection.connect ? 'activeConnection' : 'connection',
            connection.name,
            connection.connect
              ? TreeItemCollapsibleState.Collapsed
              : TreeItemCollapsibleState.None,
            connection.key,
          ),
        );
      }
    }
    return connectionItems;
  }
}

export class ConnectionItem extends TreeItem {
  constructor(
    public readonly type: ConnectionItemType,
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly key?: string,
  ) {
    super(label, collapsibleState);
    this.tooltip = this.label;
    this.description = this.type === 'activeConnection' ? 'connected' : '';
    this.id =
      this.type === 'activeConnection' || this.type === 'connection'
        ? key
        : undefined;

    this.contextValue = this.type;
  }
}

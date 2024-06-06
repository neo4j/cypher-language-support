import {
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
} from 'vscode';
import { ConnectionRepository } from '../repositories/connectionRepository';

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

  async getChildren(element?: ConnectionItem): Promise<ConnectionItem[]> {
    if (!element) {
      return this.getTopLevelConnections();
    }

    switch (element.type) {
      case 'connection':
      case 'activeConnection':
        return this.getConnectionElement(element);
      case 'label':
      case 'relationship':
        return await this.getPropertyElements(element);
    }
  }

  private getConnectionElement(element: ConnectionItem): ConnectionItem[] {
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

  private async getPropertyElements(
    element: ConnectionItem,
  ): Promise<ConnectionItem[]> {
    const summary =
      await ConnectionRepository.instance.getConnectionDataSummary(element.key);
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
    return properties.map(
      (r) => new ConnectionItem(type, r, TreeItemCollapsibleState.None),
    );
  }

  private getTopLevelConnections(): ConnectionItem[] {
    const connectionItems = Array<ConnectionItem>();
    // Artificially limit this to one connection for now
    const connections = [ConnectionRepository.instance.getConnections()[0]];

    for (const connection of connections) {
      if (connection) {
        connectionItems.push(
          new ConnectionItem(
            connection.connected ? 'activeConnection' : 'connection',
            connection.name,
            TreeItemCollapsibleState.Collapsed,
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

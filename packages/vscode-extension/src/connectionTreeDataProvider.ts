import {
  commands,
  Event,
  EventEmitter,
  ProviderResult,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
} from 'vscode';
import { GlobalStateManager } from './globalStateManager';
import { PersistentConnectionManager } from './persistentConnectionManager';

type ConnectionItemType = 'connection' | 'label' | 'relationship';

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

  getParent(element: ConnectionItem): ProviderResult<ConnectionItem> {
    return element;
  }

  async getChildren(element?: ConnectionItem): Promise<ConnectionItem[]> {
    if (!element) {
      return this.getTopLevelConnections();
    }

    switch (element.type) {
      case 'connection':
        return await this.getConnectionElement(element);
      case 'label':
        return await this.getLabelElement();
      case 'relationship':
        return await this.getRelationshipElement();
    }
  }

  private async getConnectionElement(
    element: ConnectionItem,
  ): Promise<ConnectionItem[]> {
    await commands.executeCommand(
      'neo4j.connectToDatabase',
      element.id,
      element,
    );

    return [
      new ConnectionItem('label', 'Labels', TreeItemCollapsibleState.Collapsed),
      new ConnectionItem(
        'relationship',
        'Relationships',
        TreeItemCollapsibleState.Collapsed,
      ),
    ];
  }

  private async getLabelElement(): Promise<ConnectionItem[]> {
    const summary =
      await PersistentConnectionManager.instance.getDatabaseDataSummary();
    return summary.labels.map(
      (l) => new ConnectionItem('label', l, TreeItemCollapsibleState.None),
    );
  }

  private async getRelationshipElement(): Promise<ConnectionItem[]> {
    const summary =
      await PersistentConnectionManager.instance.getDatabaseDataSummary();
    return summary.relationshipTypes.map(
      (r) =>
        new ConnectionItem('relationship', r, TreeItemCollapsibleState.None),
    );
  }

  private getTopLevelConnections(): ConnectionItem[] {
    const connectionItems = Array<ConnectionItem>();
    // Artificially limit this to one connection for now
    const connections = [GlobalStateManager.instance.getConnections()[0]];

    for (const connection of connections) {
      if (connection) {
        connectionItems.push(
          new ConnectionItem(
            'connection',
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
    if (key) {
      this.id = key;
    }

    this.contextValue = this.type;
  }
}

import {
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
} from 'vscode';
import {
  getActiveConnection,
  getDbSchemaInformation,
} from '../connectionService';

type DatabaseInformationItemType = 'label' | 'relationship';

export class DatabaseInformationTreeDataProvider
  implements TreeDataProvider<DatabaseInformationItem>
{
  private _onDidChangeTreeData: EventEmitter<
    DatabaseInformationItem | undefined | void
  > = new EventEmitter<DatabaseInformationItem | undefined | void>();
  readonly onDidChangeTreeData: Event<
    DatabaseInformationItem | undefined | void
  > = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: DatabaseInformationItem): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getChildren(element?: DatabaseInformationItem): DatabaseInformationItem[] {
    if (!element) {
      return this.getActiveConnectionInformation();
    }

    return this.getDatabaseInformationElements(element);
  }

  private getActiveConnectionInformation(): DatabaseInformationItem[] | null {
    const activeConnection = getActiveConnection();
    if (!activeConnection) {
      return null;
    }

    return [
      new DatabaseInformationItem(
        'label',
        'Labels',
        TreeItemCollapsibleState.Collapsed,
      ),
      new DatabaseInformationItem(
        'relationship',
        'Relationships',
        TreeItemCollapsibleState.Collapsed,
      ),
    ];
  }

  private getDatabaseInformationElements(
    element: DatabaseInformationItem,
  ): DatabaseInformationItem[] {
    const dbSchemaInformation = getDbSchemaInformation();

    if (!dbSchemaInformation) {
      return [];
    }

    return element.type === 'label'
      ? this.mapDbSchemaProperties('label', dbSchemaInformation.labels)
      : this.mapDbSchemaProperties(
          'relationship',
          dbSchemaInformation.relationships,
        );
  }

  private mapDbSchemaProperties(
    type: DatabaseInformationItemType,
    properties: string[],
  ): DatabaseInformationItem[] {
    return properties?.map(
      (property) =>
        new DatabaseInformationItem(
          type,
          property,
          TreeItemCollapsibleState.None,
        ),
    );
  }
}

export const databaseInformationTreeDataProvider =
  new DatabaseInformationTreeDataProvider();

class DatabaseInformationItem extends TreeItem {
  constructor(
    public readonly type: DatabaseInformationItemType,
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
  ) {
    super(label, collapsibleState);
  }
}

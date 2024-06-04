import {
  Command,
  commands,
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
} from 'vscode';
import { GlobalStateManager } from './globalStateManager';
import { PersistentConnectionManager } from './persistentConnectionManager';

type TreeItemType = 'connection' | 'label' | 'relationship';

export class ConnectionTreeDataProvider
  implements TreeDataProvider<Connection>
{
  private _onDidChangeTreeData: EventEmitter<Connection | undefined | void> =
    new EventEmitter<Connection | undefined | void>();
  readonly onDidChangeTreeData: Event<Connection | undefined | void> =
    this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Connection): TreeItem | Thenable<TreeItem> {
    return element;
  }

  async getChildren(element?: Connection): Promise<Connection[]> {
    if (element) {
      if (element.type === 'connection') {
        await commands.executeCommand(
          'neo4j.connect-to-database',
          element.label,
        );

        return [
          new Connection('label', 'Labels', TreeItemCollapsibleState.Collapsed),
          new Connection(
            'relationship',
            'Relationships',
            TreeItemCollapsibleState.Collapsed,
          ),
        ];
      } else if (element.type === 'label') {
        const summary =
          await PersistentConnectionManager.instance.getDatabaseDataSummary();
        return summary.labels.map(
          (l) => new Connection('label', l, TreeItemCollapsibleState.None),
        );
      } else if (element.type === 'relationship') {
        const summary =
          await PersistentConnectionManager.instance.getDatabaseDataSummary();
        return summary.relationshipTypes.map(
          (l) =>
            new Connection('relationship', l, TreeItemCollapsibleState.None),
        );
      }
    } else {
      // Artificially limit this to one connection for now
      const connections = Array<Connection>();
      const connectionName =
        GlobalStateManager.instance.getConnectionNames()[0];
      connections.push(
        new Connection(
          'connection',
          connectionName,
          TreeItemCollapsibleState.Collapsed,
          {
            command: 'neo4j.connect-to-database',
            title: 'Connect',
            arguments: [connectionName],
          },
        ),
      );
      return connections;
    }
  }
}

class Connection extends TreeItem {
  constructor(
    public readonly type: TreeItemType,
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly command?: Command,
  ) {
    super(label, collapsibleState);
    this.tooltip = this.label;
  }
}

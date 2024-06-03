import {
  Command,
  ProviderResult,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
} from 'vscode';
import { ConnectionManager } from './ConnectionManager';

// TODO - Finish this implementation
// - Show a list of databases belonging to a connection
// - Show a tree view of nodes and relatioships for each database
// - Implement a new connection manager to achieve this or can we share the same connection with the schema poller?F
export class ConnectionTreeDataProvider
  implements TreeDataProvider<Connection>
{
  getTreeItem(element: Connection): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getChildren(element?: Connection): ProviderResult<Connection[]> {
    if (element) {
      return Promise.resolve([]);
    } else {
      const connections = ConnectionManager.getConnections();
      return connections.map((connection) => {
        return new Connection(connection, TreeItemCollapsibleState.Collapsed, {
          command: '',
          title: 'Connect',
          arguments: [],
        });
      });
    }
  }
}

export class Connection extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly command?: Command,
  ) {
    super(label, collapsibleState);

    this.tooltip = this.label;
  }
}

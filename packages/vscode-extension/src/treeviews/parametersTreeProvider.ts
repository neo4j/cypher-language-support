import path from 'path';
import { Event, EventEmitter, TreeDataProvider, TreeItem, Uri } from 'vscode';
import { getParameters, Parameter } from '../parameterService';

class ParameterTreeItem extends TreeItem {
  constructor(parameter: Parameter) {
    const label = `${parameter.key}: ${parameter.stringValue} (${parameter.type})`;
    super(label);
    this.id = parameter.key;
    this.contextValue = 'parameter';
    this.label = label;
    this.iconPath = {
      light: Uri.file(
        path.join(__dirname, '..', 'resources', 'images', 'ParameterLight.svg'),
      ),
      dark: Uri.file(
        path.join(__dirname, '..', 'resources', 'images', 'ParameterDark.svg'),
      ),
    };
  }
}

export class ParameterTreeProvider
  implements TreeDataProvider<ParameterTreeItem>
{
  private _onDidChangeTreeData: EventEmitter<
    ParameterTreeItem | undefined | void
  > = new EventEmitter<ParameterTreeItem | undefined | void>();
  readonly onDidChangeTreeData: Event<ParameterTreeItem | undefined | void> =
    this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ParameterTreeItem): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getChildren(): ParameterTreeItem[] {
    const parameters: Record<string, Parameter> = getParameters();

    return Object.values(parameters).map(
      (parameter) => new ParameterTreeItem(parameter),
    );
  }
}

export const parametersTreeDataProvider = new ParameterTreeProvider();

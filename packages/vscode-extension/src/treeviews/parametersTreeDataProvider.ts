import path from 'path';
import { Event, EventEmitter, TreeDataProvider, TreeItem, Uri } from 'vscode';
import { getParameters, Parameter } from '../parameterService';

export class ParameterItem extends TreeItem {
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

export class ParameterTreeDataProvider
  implements TreeDataProvider<ParameterItem>
{
  private _onDidChangeTreeData: EventEmitter<ParameterItem | undefined | void> =
    new EventEmitter<ParameterItem | undefined | void>();
  readonly onDidChangeTreeData: Event<ParameterItem | undefined | void> =
    this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ParameterItem): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getChildren(): ParameterItem[] {
    const parameters: Record<string, Parameter> = getParameters();

    return Object.values(parameters).map(
      (parameter) => new ParameterItem(parameter),
    );
  }
}

export const parametersTreeDataProvider = new ParameterTreeDataProvider();

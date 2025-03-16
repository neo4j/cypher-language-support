import { CypherDataTypeName } from '@neo4j-cypher/schema-poller';
import * as vscode from 'vscode';
import { TreeItem } from 'vscode';
import { ParameterStore } from '../parameterStore';

export const PARAMETERS = 'neo4j.parameters';

interface INode {
  getTreeItem(): Promise<vscode.TreeItem> | vscode.TreeItem;

  getChildren(): Promise<INode[]> | INode[];
}

export interface Parameter {
  key: string;
  value: unknown;
  stringifiedValue: string;
  type: CypherDataTypeName;
}

class ParameterTreeItem implements INode {
  constructor(private readonly parameter: Parameter) {}

  getKey(): string {
    return this.parameter.key;
  }

  getTreeItem(): TreeItem | Promise<TreeItem> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const value = this.parameter.stringifiedValue;
    return {
      id: this.parameter.key,
      label: `${this.parameter.key}: ${value} (${this.parameter.type})`,
      contextValue: 'parameter',
      // TODO Nacho What is this?
      iconPath: '',
    };
  }

  getChildren(): INode[] | Promise<INode[]> {
    return [];
  }
}

abstract class TreeProvider implements vscode.TreeDataProvider<INode> {
  public _onDidChangeTreeData: vscode.EventEmitter<INode | undefined> =
    new vscode.EventEmitter<INode | undefined>();
  public readonly onDidChangeTreeData: vscode.Event<INode | undefined> =
    this._onDidChangeTreeData.event;

  constructor() {}

  public getTreeItem(
    element: INode,
  ): Promise<vscode.TreeItem> | vscode.TreeItem {
    return element.getTreeItem();
  }

  abstract getChildren(element?: INode): Thenable<INode[]> | INode[];

  public refresh(element?: INode): void {
    this._onDidChangeTreeData.fire(element);
  }
}

export class ParameterTreeProvider extends TreeProvider {
  constructor(private readonly parameters: ParameterStore) {
    super();
  }

  public getChildren(element?: INode): Thenable<INode[]> | INode[] {
    if (!element) {
      return this.getConnectionNodes();
    }
    return element.getChildren();
  }

  getConnectionNodes(): Promise<INode[]> {
    const parameters: Record<string, Parameter> = this.parameters.getState();

    return Promise.resolve(
      Object.values(parameters).map(
        (parameter) => new ParameterTreeItem(parameter),
      ),
    );
  }
}

export const parametersManager = new ParameterStore();
export const parametersTreeProvider = parametersManager.getTreeProvider();

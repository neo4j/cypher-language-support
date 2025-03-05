import { int } from 'neo4j-driver';
import * as vscode from 'vscode';
import { TreeItem } from 'vscode';
import { getExtensionContext } from '../contextService';
import { sendNotificationToLanguageClient } from '../languageClientService';

export const PARAMETERS = 'neo4j.parameters';

export const PARAMETER_TYPE_STRING = 'STRING'; // will keep value
export const PARAMETER_TYPE_INT = 'INT'; // neo4j.int(value)
export const PARAMETER_TYPE_FLOAT = 'FLOAT'; // parseFloat(value)
export const PARAMETER_TYPE_OBJECT = 'JSON or OBJECT'; // JSON.parse(value)
export const PARAMETER_TYPE_NULL = 'NULL'; // null

export const parameterTypes = [
  PARAMETER_TYPE_STRING,
  PARAMETER_TYPE_INT,
  PARAMETER_TYPE_FLOAT,
  PARAMETER_TYPE_OBJECT,
  PARAMETER_TYPE_NULL,
] as const;

export type ParameterType = (typeof parameterTypes)[number];

interface INode {
  getTreeItem(): Promise<vscode.TreeItem> | vscode.TreeItem;

  getChildren(): Promise<INode[]> | INode[];
}

export interface Parameter {
  key: string;
  value: string;
  type: ParameterType;
}

function convertParameter(parameter: Parameter): [string, unknown] {
  switch (parameter.type) {
    case PARAMETER_TYPE_NULL:
      return [parameter.key, null];
    case PARAMETER_TYPE_INT:
      return [parameter.key, int(parameter.value)];
    case PARAMETER_TYPE_FLOAT:
      return [parameter.key, parseFloat(parameter.value)];
    case PARAMETER_TYPE_OBJECT:
      return [parameter.key, JSON.parse(parameter.value)];
    default:
      return [parameter.key, parameter.value];
  }
}

export class ParameterManager {
  private readonly tree: ParameterTreeProvider;

  constructor() {
    this.tree = new ParameterTreeProvider(this);
  }

  getTreeProvider(): ParameterTreeProvider {
    return this.tree;
  }

  getState(): Record<string, Parameter> {
    const context = getExtensionContext();
    return context.globalState.get(PARAMETERS) || {};
  }

  has(key: string): boolean {
    const state = this.getState();

    // TODO Nacho What is this?
    // eslint-disable-next-line no-prototype-builtins
    return state.hasOwnProperty(key);
  }

  clear(): Promise<void> {
    return this.updateState({});
  }

  async updateState(state: Record<string, Parameter>) {
    const context = getExtensionContext();
    await context.globalState.update(PARAMETERS, state);

    await sendNotificationToLanguageClient(
      'updateParameters',
      parametersManager.asParameters(),
    );

    this.tree.refresh();
  }

  asParameters(): Record<string, unknown> {
    const parameters = this.getState();

    return Object.fromEntries(
      Object.values(parameters).map((param: Parameter) =>
        convertParameter(param),
      ),
    );
  }

  keys(): string[] {
    const parameters = this.getState();

    return Object.keys(parameters);
  }

  async set(
    key: string,
    value: string,
    type: ParameterType = PARAMETER_TYPE_STRING,
  ) {
    const parameters = this.getState();

    parameters[key.trim()] = { key: key.trim(), value, type };

    await this.updateState(parameters);

    await vscode.window.showInformationMessage(`Parameter \`${key}\` set.`);
  }

  async remove(key: string) {
    const parameters = this.getState();

    delete parameters[key];

    await this.updateState(parameters);

    await vscode.window.showInformationMessage(`Parameter \`${key}\` removed.`);
  }
}

class ParameterTreeItem implements INode {
  constructor(private readonly parameter: Parameter) {}

  getKey(): string {
    return this.parameter.key;
  }

  getTreeItem(): TreeItem | Promise<TreeItem> {
    return {
      id: this.parameter.key,
      label: `${this.parameter.key}: ${this.parameter.value} (${this.parameter.type})`,
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

class ParameterTreeProvider extends TreeProvider {
  constructor(private readonly parameters: ParameterManager) {
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

export const parametersManager = new ParameterManager();
export const parametersTreeProvider = parametersManager.getTreeProvider();

import {
  CypherDataTypeName,
  deserializeTypeAnnotations,
} from '@neo4j-cypher/schema-poller';
import * as vscode from 'vscode';
import { TreeItem } from 'vscode';
import { getExtensionContext } from '../contextService';
import { sendNotificationToLanguageClient } from '../languageClientService';

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

    const res = Object.fromEntries(
      Object.values(parameters).map((p) => [
        p.key,
        deserializeTypeAnnotations(p.value),
      ]),
    );
    return res;
  }

  keys(): string[] {
    const parameters = this.getState();

    return Object.keys(parameters);
  }

  async set(
    key: string,
    value: unknown,
    stringifiedValue: string,
    type: CypherDataTypeName,
  ) {
    const parameters = this.getState();

    parameters[key.trim()] = { key: key.trim(), value, stringifiedValue, type };

    await this.updateState(parameters);

    await vscode.window.showInformationMessage(`Parameter \`${key}\` set.`);
  }
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

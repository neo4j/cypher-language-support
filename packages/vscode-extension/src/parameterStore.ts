import {
  CypherDataTypeName,
  deserializeTypeAnnotations,
} from '@neo4j-cypher/schema-poller';
import * as vscode from 'vscode';
import { getExtensionContext } from './contextService';
import { sendNotificationToLanguageClient } from './languageClientService';
import {
  Parameter,
  PARAMETERS,
  parametersManager,
  ParameterTreeProvider,
} from './treeviews/parametersTreeProvider';

export class ParameterStore {
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

export async function sendParametersToLanguageServer() {
  await sendNotificationToLanguageClient(
    'updateParameters',
    parametersManager.asParameters(),
  );
}

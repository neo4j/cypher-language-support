import {
  CypherDataTypeName,
  deserializeTypeAnnotations,
} from '@neo4j-cypher/schema-poller';
import * as vscode from 'vscode';
import { getExtensionContext } from './contextService';
import { sendNotificationToLanguageClient } from './languageClientService';

export interface Parameter {
  key: string;
  serializedValue: unknown;
  stringValue: string;
  type: CypherDataTypeName;
}

export type Parameters = {
  [key: string]: Parameter | null;
};

export const PARAMETERS_KEY = 'neo4j.parameters';

/**
 * Gets all Parameters from the global state.
 * @returns A Parameters object.
 */
export function getParameters(): Record<string, Parameter> {
  const context = getExtensionContext();
  return context.globalState.get(PARAMETERS_KEY) || {};
}

export async function clearParameters(): Promise<void> {
  const context = getExtensionContext();
  await context.globalState.update(PARAMETERS_KEY, {});
}

export function getDeserializedParams(): Record<string, unknown> {
  const parameters = getParameters();

  const res = Object.fromEntries(
    Object.values(parameters).map((p) => [
      p.key,
      deserializeTypeAnnotations(p.serializedValue),
    ]),
  );
  return res;
}

export async function setParameter(param: Parameter) {
  const parameters = getParameters();
  const key = param.key;
  parameters[key] = param;
  await saveParameters(parameters);
  await sendParametersToLanguageServer();
  void vscode.window.showInformationMessage(`Parameter \`${key}\` set.`);
}

/**
 * Saves a Connections object in the global state.
 * A command to refresh the Connections view will be executed after the Connections object has been saved.
 * @param connections The Connections object to save.
 * @returns A promise that resolves when the Connections object has been saved.
 */
async function saveParameters(connections: Parameters): Promise<void> {
  const context = getExtensionContext();
  await context.globalState.update(PARAMETERS_KEY, connections);
}

export async function sendParametersToLanguageServer() {
  const params = getDeserializedParams();
  await sendNotificationToLanguageClient('updateParameters', params);
}

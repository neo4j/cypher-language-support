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
export function getParameters(): Parameters {
  const context = getExtensionContext();
  return context.globalState.get(PARAMETERS_KEY) || {};
}

/**
 * Removes all parameters from the global state.
 * @returns void
 */
export async function clearParameters(): Promise<void> {
  const context = getExtensionContext();
  await context.globalState.update(PARAMETERS_KEY, {});
}

/**
 * Parameters are objects that are stored serialized in the global state.
 * This method deserializes them and returns them as a Record<string, unknown>
 * where unknown is the type of each parameter object.
 * @returns the deserialized parameters
 */
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

/**
 * Sets parameter in the global state, sends them to the language server and shows a confirmation message in the UI.
 * @returns void
 */
export async function setParameter(param: Parameter) {
  const parameters = getParameters();
  const key = param.key;
  parameters[key] = param;
  await saveParameters(parameters);
  await sendParametersToLanguageServer();
  void vscode.window.showInformationMessage(`Parameter \`${key}\` set.`);
}

/**
 * Saves a Parameters object to the global state.
 * @param parameters The Parameters object to save.
 * @returns A void promise that resolves when the Parameters object has been saved.
 */
async function saveParameters(parameters: Parameters): Promise<void> {
  const context = getExtensionContext();
  await context.globalState.update(PARAMETERS_KEY, parameters);
}

/**
 * Fetches the parameters from the global store and signals
 * the language server to update the parameters.
 * @returns A void promise that resolves when the
 *          Parameters object has been sent the language server.
 */
export async function sendParametersToLanguageServer() {
  const params = getDeserializedParams();
  await sendNotificationToLanguageClient('updateParameters', params);
}

import { DbSchema, lintCypherQuery } from '@neo4j-cypher/language-support';
import {
  cypherDataToString,
  CypherDataType,
  CypherDataTypeName,
  Database,
  getCypherTypeName,
  Neo4jType,
  serializeTypeAnnotations,
} from '@neo4j-cypher/query-tools';
import { Neo4jError } from 'neo4j-driver';
import { window } from 'vscode';
import { DiagnosticSeverity } from 'vscode-languageclient';
import { CONSTANTS } from '../constants';
import { getSchemaPoller } from '../contextService';
import {
  clearParameters,
  deleteParameter,
  getParameterByKey,
  setParameter,
} from '../parameterService';
import {
  ParameterItem,
  parametersTreeDataProvider,
} from '../treeviews/parametersTreeDataProvider';

async function isConnected(): Promise<boolean> {
  const schemaPoller = getSchemaPoller();
  return schemaPoller.connection?.healthcheck();
}

export function validateParamInput(
  paramValue: string,
  dbSchema: DbSchema,
): string | undefined {
  const diagnostics = lintCypherQuery(`RETURN ${paramValue}`, dbSchema, true);
  const errors = diagnostics.filter(
    (d) => d.severity === DiagnosticSeverity.Error,
  );
  if (errors.length > 0) {
    return (
      'Value cannot be evaluated: ' + errors.map((e) => e.message).join(' ')
    );
  }
  return undefined;
}

export async function addParameter(defaultParamName?: string): Promise<void> {
  const connected = await isConnected();

  if (!connected) {
    void window.showErrorMessage(
      CONSTANTS.MESSAGES.ERROR_DISCONNECTED_SET_PARAMS,
    );
    return;
  }

  const paramName =
    defaultParamName ??
    (await window.showInputBox({
      prompt: 'Parameter name',
      placeHolder:
        'The name you want to store your parameter with, for example: param, p, `my parameter`',
      ignoreFocusOut: true,
    }));
  if (!paramName) {
    void window.showErrorMessage(CONSTANTS.MESSAGES.ERROR_EMPTY_PARAM_NAME);
    return;
  }
  const schemaPoller = getSchemaPoller();
  const dbSchema = schemaPoller?.metadata?.dbSchema ?? {};
  let timeout: NodeJS.Timeout;
  const paramValue = await window.showInputBox({
    prompt: defaultParamName
      ? `Parameter value for the parameter ${defaultParamName}`
      : 'Parameter value',
    placeHolder:
      'The value for your parameter (anything you could evaluate in a RETURN), for example: 1234, "some string", datetime(), {a: 1, b: "some string"}',
    ignoreFocusOut: true,
    validateInput: (paramValue) => {
      return new Promise<string>((resolve) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          const validationResult = validateParamInput(paramValue, dbSchema);
          resolve(validationResult);
        }, 200);
      });
    },
  });

  if (!paramValue) {
    void window.showErrorMessage(CONSTANTS.MESSAGES.ERROR_EMPTY_PARAM_VALUE);
    return;
  }

  await evaluateParam(paramName, paramValue);
}

export async function editParameter(paramItem: ParameterItem): Promise<void> {
  const connected = await isConnected();
  if (!connected) {
    void window.showErrorMessage(
      CONSTANTS.MESSAGES.ERROR_DISCONNECTED_EDIT_PARAMS,
    );
    return;
  }
  const existingParam = getParameterByKey(paramItem.id);
  if (!existingParam) {
    return;
  }
  const schemaPoller = getSchemaPoller();
  const dbSchema = schemaPoller?.metadata?.dbSchema ?? {};
  const paramValue = await window.showInputBox({
    prompt: 'Parameter value',
    value: existingParam.evaluatedStatement,
    ignoreFocusOut: true,
    validateInput: (paramValue) => validateParamInput(paramValue, dbSchema),
  });
  if (!paramValue) {
    void window.showErrorMessage(CONSTANTS.MESSAGES.ERROR_EMPTY_PARAM_VALUE);
    return;
  }

  await evaluateParam(paramItem.id, paramValue);
}

export async function removeParameter(paramItem: ParameterItem): Promise<void> {
  await removeParameterByKey(paramItem.id);
}

export async function removeParameterByKey(key: string) {
  await deleteParameter(key);
  parametersTreeDataProvider.refresh();
}

export async function clearAllParameters(): Promise<void> {
  await clearParameters();
  parametersTreeDataProvider.refresh();
}

function getCurrentDatabase(): Database | undefined {
  const schemaPoller = getSchemaPoller();
  const connection = schemaPoller?.connection;
  const databases = connection?.databases;
  return databases?.find((db) => db.name === connection.currentDb);
}

export async function evaluateParam(
  paramName: string,
  paramValue: string,
): Promise<void> {
  const schemaPoller = getSchemaPoller();

  try {
    const db = getCurrentDatabase();

    if (db.type === 'system') {
      void window.showErrorMessage(
        CONSTANTS.MESSAGES.ERROR_PARAM_EVALUATION_SYSTEM_DB,
      );
      return;
    }
    const result = await schemaPoller.connection.runCypherQuery({
      query: `RETURN ${paramValue} AS param`,
      parameters: {},
    });
    const [record] = result.records;
    if (record === undefined) {
      void window.showErrorMessage(CONSTANTS.MESSAGES.ERROR_PARAM_EVALUATION);
    }
    const resultEntries = Object.values(record.toObject());
    const paramAsNeo4jType = resultEntries[0] as Neo4jType;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const paramAsCypherType = resultEntries[0] as CypherDataType;
    const type: CypherDataTypeName = getCypherTypeName(paramAsCypherType);
    const stringValue = cypherDataToString(paramAsCypherType).replaceAll(
      '\n',
      '',
    );

    const serializedValue = serializeTypeAnnotations(paramAsNeo4jType);
    await setParameter({
      key: paramName,
      serializedValue,
      stringValue,
      type,
      evaluatedStatement: paramValue,
    });
    parametersTreeDataProvider.refresh();
  } catch (e) {
    if (e instanceof Neo4jError) {
      //If we can get past linting-check with invalid query but still have failing query
      //when executing, we catch here as a backup
      void window.showErrorMessage(
        'Failed to evaluate parameter: ' + e.message,
      );
    } else {
      // only catch neo4j errors
      throw e;
    }
  }

  return;
}

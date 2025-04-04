import { DbSchema, lintCypherQuery } from '@neo4j-cypher/language-support';
import {
  cypherDataToString,
  CypherDataType,
  CypherDataTypeName,
  Database,
  getCypherTypeName,
  Neo4jType,
  serializeTypeAnnotations,
} from '@neo4j-cypher/schema-poller';
import { Neo4jError } from 'neo4j-driver';
import { window } from 'vscode';
import { DiagnosticSeverity } from 'vscode-languageclient';
import { getSchemaPoller } from '../contextService';
import {
  clearParameters,
  deleteParameter,
  getParameter,
  setParameter,
} from '../parameterService';
import {
  ParameterItem,
  parametersTreeDataProvider,
} from '../treeviews/parametersTreeDataProvider';

export async function isConnected(): Promise<boolean> {
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
    await window.showErrorMessage(
      'You need to be connected to neo4j to set parameters.',
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
    await window.showErrorMessage('Parameter name cannot be empty.');
    return;
  }
  const schemaPoller = getSchemaPoller();
  const dbSchema = schemaPoller.metadata.dbSchema;
  const paramValue = await window.showInputBox({
    prompt: defaultParamName
      ? `Parameter value for the parameter ${defaultParamName}`
      : 'Parameter value',
    placeHolder:
      'The value for your parameter (anything you could evaluate in a RETURN), for example: 1234, "some string", datetime(), {a: 1, b: "some string"}',
    ignoreFocusOut: true,
    validateInput: (paramValue) => validateParamInput(paramValue, dbSchema),
  });

  if (!paramValue) {
    void window.showErrorMessage('Parameter value cannot be empty.');
    return;
  }

  await evaluateParam(paramName, paramValue);
}

export async function editParameter(paramItem: ParameterItem): Promise<void> {
  const connected = await isConnected();
  if (!connected) {
    await window.showErrorMessage(
      'You need to be connected to neo4j to edit parameters.',
    );
    return;
  }
  const existingParam = getParameter(paramItem.id);
  if (!existingParam) {
    return;
  }
  const schemaPoller = getSchemaPoller();
  const dbSchema = schemaPoller.metadata.dbSchema;
  const paramValue = await window.showInputBox({
    prompt: 'Parameter value',
    value: existingParam.evaluatedStatement,
    ignoreFocusOut: true,
    validateInput: (paramValue) => validateParamInput(paramValue, dbSchema),
  });
  if (!paramValue) {
    await window.showErrorMessage('Parameter value cannot be empty.');
    return;
  }

  await evaluateParam(paramItem.id, paramValue);
}

export async function removeParameter(paramItem: ParameterItem): Promise<void> {
  await removeParameterWithKey(paramItem.id);
}

export async function removeParameterWithKey(key: string) {
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
        'Parameters cannot be evaluated against a system database. Please connect to a user database.',
      );
      return;
    }
    const result = await schemaPoller.connection.runCypherQuery({
      query: `RETURN ${paramValue} AS param`,
      parameters: {},
    });
    const [record] = result.records;
    if (record === undefined) {
      await window.showErrorMessage('Parameter evaluation failed.');
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

import { parseParam } from '@neo4j-cypher/language-support';
import {
  cypherDataToString,
  CypherDataType,
  CypherDataTypeName,
  getCypherTypeName,
  Neo4jType,
  serializeTypeAnnotations,
} from '@neo4j-cypher/schema-poller';
import { window } from 'vscode';
import { getSchemaPoller } from '../contextService';
import { clearParameters, setParameter } from '../parameterService';
import { parametersTreeDataProvider } from '../treeviews/parametersTreeProvider';

export async function addParameter(): Promise<void> {
  const paramName = await window.showInputBox({
    prompt: 'Parameter name',
    placeHolder:
      'The name you want to store your parameter with, for exsample: param, p, `my parameter`',
    ignoreFocusOut: true,
  });
  const paramValue = await window.showInputBox({
    prompt: 'Parameter value',
    placeHolder:
      'The value for your parameter (anything you could evaluate in a RETURN), for example: 1234, "some string", datetime(), {a: 1, b: "some string"}',
    ignoreFocusOut: true,
  });
  if (!paramName || !paramValue) {
    return;
  }
  await evaluateParam(paramName, paramValue);
}

export async function clearAllParameters(): Promise<void> {
  await clearParameters();
  parametersTreeDataProvider.refresh();
}

export async function evaluateParam(
  paramName: string,
  paramValue: string,
): Promise<void> {
  const schemaPoller = getSchemaPoller();
  const connected = await schemaPoller.connection?.healthcheck();

  if (!connected) {
    await window.showErrorMessage(
      'You need to be connected to neo4j to set parameters.',
    );
    return;
  }

  const dbSchema = schemaPoller.metadata.dbSchema;

  try {
    const paramParsing = parseParam(`${paramName} => ${paramValue}`, dbSchema);
    const { key, value, errors } = paramParsing;
    if (errors.length > 0) {
      errors.forEach((e) => void window.showErrorMessage(e.message));
    }

    const result = await schemaPoller.connection.runCypherQuery({
      query: `RETURN ${value} AS param`,
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
    await setParameter({ key, serializedValue, stringValue, type });
    parametersTreeDataProvider.refresh();
  } catch (e) {
    await window.showErrorMessage('Wrong format for the parameter.');
  }

  return;
}

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
import { getSchemaPoller } from './contextService';
import { parametersManager } from './treeviews/parametersTreeProvider';

export async function addParameter(): Promise<void> {
  const parameters = parametersManager;
  const schemaPoller = getSchemaPoller();
  const dbSchema = schemaPoller.metadata.dbSchema;

  const param = await window.showInputBox({
    prompt: 'Parameter string',
    placeHolder: 'eg. key: string, integer => 1234 or map => {a: 1}',
    ignoreFocusOut: true,
  });
  if (!param) {
    return;
  }

  const paramParsing = parseParam(param, dbSchema);
  if (paramParsing.errors.length > 0) {
    const errors = paramParsing.errors.map((e) => e.message).join('\n');
    await window.showErrorMessage(errors);
  }
  const { key, value } = paramParsing;

  const result = await schemaPoller.connection.runCypherQuery({
    query: `RETURN ${value} AS param`,
    parameters: {},
  });
  const [record] = result.records;
  if (record === undefined) {
    await window.showErrorMessage('Parameter evaluation failed');
  }
  const resultEntries = Object.values(record.toObject());
  const paramAsNeo4jType = resultEntries[0] as Neo4jType;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const paramAsCypherType = resultEntries[0] as CypherDataType;
  const type: CypherDataTypeName = getCypherTypeName(paramAsCypherType);
  const stringifiedValue = cypherDataToString(paramAsCypherType).replaceAll(
    '\n',
    '',
  );

  const serializedValue = serializeTypeAnnotations(paramAsNeo4jType);
  await parameters.set(key, serializedValue, stringifiedValue, type);
}

export async function clearParameters(): Promise<void> {
  const parameters = parametersManager;
  await parameters.clear();
}

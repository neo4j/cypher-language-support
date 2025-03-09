import { parseParam } from '@neo4j-cypher/language-support';
import {
  getPropertyTypeDisplayName,
  Neo4jType,
  serializeTypeAnnotations,
} from '@neo4j-cypher/schema-poller';
import { CypherBasicPropertyType } from '@neo4j-cypher/schema-poller/dist/cjs/src/types/cypher-data-types';
import { window } from 'vscode';
import { getSchemaPoller } from './contextService';
import { parametersManager } from './treeviews/parametersTreeProvider';

export async function setParameter(): Promise<void> {
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
  const type = getPropertyTypeDisplayName(
    resultEntries[0] as CypherBasicPropertyType,
  );
  const serializedValue = serializeTypeAnnotations(paramAsNeo4jType);
  await parameters.set(key, serializedValue, type);
}

export async function clearParameters(): Promise<void> {
  const parameters = parametersManager;
  await parameters.clear();
}

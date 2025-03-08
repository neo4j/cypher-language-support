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
  const param = await window.showInputBox({
    prompt: 'Parameter string',
    placeHolder: 'eg. key: string, integer => 1234 or map => {a: 1}',
    ignoreFocusOut: true,
  });
  if (!param) {
    return;
  }

  // key => object
  // TODO Nacho eugh: we have a parser that could allow us to do this maybe?
  const objectMatch = param.match(/^([a-z0-9\s]+)=>(.*)$/i);

  if (objectMatch) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_all, key, value] = objectMatch;

    const result = await schemaPoller.connection.runCypherQuery({
      query: `RETURN ${value} AS param`,
      parameters: {},
    });
    const [record] = result.records;
    if (record === undefined) {
      throw {
        code: 'Params.MissingExpressionError',
        message: 'Parameter expression missing.',
      };
    }
    const resultEntries = Object.values(record.toObject());
    const param = resultEntries[0] as Neo4jType;
    const type = getPropertyTypeDisplayName(
      resultEntries[0] as CypherBasicPropertyType,
    );
    const serializedValue = serializeTypeAnnotations(param);
    await parameters.set(key, serializedValue, type);
  }
}

export async function clearParameters(): Promise<void> {
  const parameters = parametersManager;
  await parameters.clear();
}

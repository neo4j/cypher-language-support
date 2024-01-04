import { DbSchema, validateSyntax } from '@neo4j-cypher/language-support';
import { parentPort } from 'worker_threads';

parentPort.on(
  'message',
  (value: { query: string; dbSchema: DbSchema; port: MessagePort }) => {
    const result = validateSyntax(value.query, value.dbSchema);

    value.port.postMessage(result);
    value.port.close();
  },
);

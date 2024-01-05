import {
  DbSchema,
  runSemanticAnalysis,
  validateSyntax,
} from '@neo4j-cypher/language-support';
import { parentPort } from 'worker_threads';

parentPort.on(
  'message',
  (value: { query: string; dbSchema: DbSchema; port: MessagePort }) => {
    console.log('workers spawned');
    const syntaxErrors = validateSyntax(value.query, value.dbSchema);

    const shouldDoSemanticCheck = syntaxErrors.length === 0;
    // send one message as soon as we know normal parser has no errors
    value.port.postMessage({
      diags: syntaxErrors,
      done: !shouldDoSemanticCheck,
    });

    // send another message when we have semantic errors as well
    if (shouldDoSemanticCheck) {
      const semanticErrors = runSemanticAnalysis(value.query);
      value.port.postMessage({ diags: semanticErrors, done: true });
    }

    value.port.close();
  },
);

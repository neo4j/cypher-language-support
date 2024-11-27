import { lintCypherQuery } from '@neo4j-cypher/language-support';
import workerpool from 'workerpool';

workerpool.worker({ lintCypherQuery });

type LinterArgs = Parameters<typeof lintCypherQuery>;

export type LinterTask = workerpool.Promise<ReturnType<typeof lintCypherQuery>>;

export type LintWorker = {
  validateSemantics: (...args: LinterArgs) => LinterTask;
};

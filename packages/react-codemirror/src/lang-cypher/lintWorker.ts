import { validateSemantics } from '@neo4j-cypher/language-support';
import workerpool from 'workerpool';

workerpool.worker({ validateSemantics });

type LinterArgs = Parameters<typeof validateSemantics>;

export type LinterTask = workerpool.Promise<
  ReturnType<typeof validateSemantics>
>;

export type LintWorker = {
  validateSemantics: (...args: LinterArgs) => LinterTask;
};

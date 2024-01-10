import { runSemanticAnalysis } from '@neo4j-cypher/language-support';
import workerpool from 'workerpool';

workerpool.worker({ runSemanticAnalysis });

type LinterArgs = Parameters<typeof runSemanticAnalysis>;

export type LinterTask = workerpool.Promise<
  ReturnType<typeof runSemanticAnalysis>
>;

export type LintWorker = {
  runSemanticAnalysis: (...args: LinterArgs) => LinterTask;
};

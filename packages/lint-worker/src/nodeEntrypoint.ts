export type { LinterTask, LintWorker } from './lintWorker';
import workerpool from 'workerpool';
export const WorkerCancellationError = workerpool.Promise.CancellationError;

export const pool = workerpool.pool(__dirname + '/lintWorker.cjs', {
  minWorkers: 2,
  workerOpts: { type: 'module' },
  workerTerminateTimeout: 2000,
});

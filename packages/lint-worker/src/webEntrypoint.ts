export type { LinterTask, LintWorker } from './lintWorker';
import workerpool from 'workerpool';
import WorkerURL from './lintWorker?worker&url';
export const WorkerCancellationError = workerpool.Promise.CancellationError;

export const pool = workerpool.pool(WorkerURL, {
  minWorkers: 2,
  workerOpts: { type: 'module' },
  workerTerminateTimeout: 2000,
});

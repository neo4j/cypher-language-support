import workerpool from 'workerpool';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore ignore: https://v3.vitejs.dev/guide/features.html#import-with-query-suffixes
import WorkerURL from './lintWorker?url&worker';

export const pool = workerpool.pool(WorkerURL as string, {
  minWorkers: 2,
  workerOpts: { type: 'module' },
  workerTerminateTimeout: 2000,
});

export const CancellationError = workerpool.Promise.CancellationError;

export const terminateWorkers = () => pool.terminate();

export type WorkerPoolModule = {
  terminateWorkers: typeof terminateWorkers;
  pool: typeof pool;
  CancellationError: typeof CancellationError;
};

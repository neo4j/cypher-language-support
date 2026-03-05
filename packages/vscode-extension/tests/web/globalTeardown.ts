import { ChildProcess } from 'child_process';

export default async function globalTeardown() {
  const server = (globalThis as Record<string, unknown>).__VSCODE_WEB_SERVER as
    | ChildProcess
    | undefined;

  if (server) {
    server.kill('SIGTERM');
    // Give it a moment to shut down gracefully
    await new Promise<void>((resolve) => {
      server.on('exit', resolve);
      setTimeout(() => {
        server.kill('SIGKILL');
        resolve();
      }, 5_000);
    });
  }
}

import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as http from 'http';

const VSCODE_WEB_PORT = 3333;

function waitForServer(port: number, timeout = 30_000): Promise<void> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get(`http://localhost:${port}`, (res) => {
        res.resume();
        if (res.statusCode === 200 || res.statusCode === 302) {
          resolve();
        } else {
          retry();
        }
      });
      req.on('error', retry);
      req.end();
    };

    const retry = () => {
      if (Date.now() - start > timeout) {
        reject(
          new Error(`Server on port ${port} did not start within ${timeout}ms`),
        );
        return;
      }
      setTimeout(check, 500);
    };

    check();
  });
}

let serverProcess: ChildProcess | undefined;

export default async function globalSetup() {
  const extensionDir = path.resolve(__dirname, '../..');
  const fixturesDir = path.resolve(extensionDir, 'tests', 'fixtures');

  serverProcess = spawn(
    'npx',
    [
      '@vscode/test-web',
      `--extensionDevelopmentPath=${extensionDir}`,
      '--browser=none',
      `--port=${VSCODE_WEB_PORT}`,
      fixturesDir,
    ],
    {
      cwd: extensionDir,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env },
    },
  );

  serverProcess.stdout?.on('data', (data: Buffer) => {
    process.stdout.write(`[vscode-web] ${data.toString()}`);
  });
  serverProcess.stderr?.on('data', (data: Buffer) => {
    process.stderr.write(`[vscode-web] ${data.toString()}`);
  });

  await waitForServer(VSCODE_WEB_PORT);

  process.env.VSCODE_WEB_URL = `http://localhost:${VSCODE_WEB_PORT}`;
  // Store the process so globalTeardown can clean it up
  (globalThis as Record<string, unknown>).__VSCODE_WEB_SERVER = serverProcess;
}

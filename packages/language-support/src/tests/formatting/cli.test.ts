import { spawn } from 'child_process';
import { join } from 'path';

const unformattedInput = `match (n) return n`;
const formattedInput = `
MATCH (n)
RETURN n`.trimStart();

describe('CLI formatting', () => {
  const cliPath = join(__dirname, '../../../dist/esm/formatting/cli.mjs');
  const testFilesDir = join(__dirname, 'cli-test-files');

  test('should format input from stdin', async () => {
    const result = await new Promise<string>((resolve, reject) => {
      const process = spawn('node', [cliPath]);
      let output = '';

      process.stdout.on('data', (data: Buffer) => {
        output += data.toString('utf8');
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });

      process.stdin.write(unformattedInput);
      process.stdin.end();
    });

    expect(result).toBe(formattedInput);
  });

  test('should format unformatted input when reading from stdin', async () => {
    const result = await new Promise<string>((resolve, reject) => {
      const process = spawn('node', [cliPath]);
      let output = '';

      process.stdout.on('data', (data: Buffer) => {
        output += data.toString('utf8');
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });

      process.stdin.write(unformattedInput);
      process.stdin.end();
    });

    expect(result).toBe(formattedInput);
  });

  test('should correctly identify formatted and unformatted files with --check flag', async () => {
    const notFormattedPath = join(testFilesDir, 'not-formatted.cy');
    const nestedNotFormattedPath = join(
      testFilesDir,
      'nested',
      'also-not-formatted.cy',
    );
    const formattedPath = join(testFilesDir, 'formatted.cy');
    const result = await new Promise<{
      stdout: string;
      stderr: string;
      code: number;
    }>((resolve) => {
      const process = spawn('node', [cliPath, '-c', testFilesDir]);
      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data: Buffer) => {
        stdout += data.toString('utf8');
      });

      process.stderr.on('data', (data: Buffer) => {
        stderr += data.toString('utf8');
      });

      process.on('close', (code) => {
        resolve({ stdout, stderr, code: code ?? 0 });
      });
    });
    expect(result.code).toBe(1);
    expect(result.stderr).toContain(
      `File ${notFormattedPath} is not formatted correctly`,
    );
    expect(result.stderr).toContain(
      `File ${nestedNotFormattedPath} is not formatted correctly`,
    );
    expect(result.stderr).not.toContain(
      `File ${formattedPath} is not formatted correctly`,
    );
  });
});

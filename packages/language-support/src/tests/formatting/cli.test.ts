import { spawn } from 'child_process';
import { join } from 'path';

const cliPath = join(__dirname, '../../../dist/esm/formatting/cli.mjs');

interface CliResult {
  stdout: string;
  stderr: string;
  code: number;
}

async function runCli(args: string[] = [], input?: string): Promise<CliResult> {
  return new Promise<CliResult>((resolve) => {
    const process = spawn('node', [cliPath, ...args]);
    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data: Buffer) => {
      stdout += data.toString('utf8');
    });

    process.stderr.on('data', (data: Buffer) => {
      stderr += data.toString('utf8');
    });

    if (input) {
      process.stdin.write(input);
      process.stdin.end();
    }

    process.on('close', (code) => {
      resolve({ stdout, stderr, code: code ?? 0 });
    });
  });
}

describe('CLI formatting', () => {
  const testFilesDir = join(__dirname, 'cli-test-files');
  const unformattedInput = `match (n) return n`;
  const formattedInput = `
MATCH (n)
RETURN n`.trimStart();

  test('should format input from stdin', async () => {
    const result = await runCli([], unformattedInput);
    expect(result.code).toBe(0);
    expect(result.stdout).toBe(formattedInput);
  });

  test('should format unformatted input when reading from stdin', async () => {
    const result = await runCli([], unformattedInput);
    expect(result.code).toBe(0);
    expect(result.stdout).toBe(formattedInput);
  });

  test('should correctly identify formatted and unformatted files with --check flag', async () => {
    const notFormattedPath = join(testFilesDir, 'not-formatted.cy');
    const nestedNotFormattedPath = join(
      testFilesDir,
      'nested',
      'also-not-formatted.cy',
    );
    const formattedPath = join(testFilesDir, 'formatted.cy');

    const result = await runCli(['-c', testFilesDir]);

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

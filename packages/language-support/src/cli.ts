#!/usr/bin/env node

import { formatQuery } from './index.js';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function printUsage() {
  console.error(`Usage: cypherfmt [options] [file|directory]

Options:
  -i, --in-place    Modify files in place (overwrite the input file)
  -c, --check       Check if files are formatted correctly (exit with error if not)
  -h, --help        Show this help message

If no file is provided, reads from stdin.
If a directory is provided, it will be processed recursively.
`);
  process.exit(1);
}

async function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', (chunk: Buffer) => {
      data += chunk.toString('utf8');
    });
    process.stdin.on('end', () => {
      resolve(data);
    });
  });
}

function processFile(
  filePath: string,
  options: { inPlace: boolean; check: boolean },
): boolean {
  const input = readFileSync(filePath, 'utf8');
  const formatted = formatQuery(input).formattedQuery;

  if (options.check) {
    if (input !== formatted) {
      console.error(`File ${filePath} is not formatted correctly`);
      return false;
    }
    return true;
  }

  if (options.inPlace) {
    writeFileSync(filePath, formatted);
  } else {
    process.stdout.write(formatted);
  }
  return true;
}

async function processDirectory(
  dirPath: string,
  options: { inPlace: boolean; check: boolean },
): Promise<boolean> {
  const skipDirs = ['node_modules', '.git', 'dist', 'build'];
  let allFilesFormatted = true;

  const entries = readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (!skipDirs.includes(entry.name)) {
        const subDirResult = await processDirectory(fullPath, options);
        allFilesFormatted = allFilesFormatted && subDirResult;
      }
    } else if (
      entry.isFile() &&
      (entry.name.endsWith('.cy') || entry.name.endsWith('.cypher'))
    ) {
      const fileResult = processFile(fullPath, options);
      allFilesFormatted = allFilesFormatted && fileResult;
    }
  }

  return allFilesFormatted;
}

async function main() {
  const args = process.argv.slice(2);
  let inPlace = false;
  let check = false;
  let inputPath: string | undefined;

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-h' || arg === '--help') {
      printUsage();
    } else if (arg === '-i' || arg === '--in-place') {
      inPlace = true;
    } else if (arg === '-c' || arg === '--check') {
      check = true;
    } else if (!arg.startsWith('-')) {
      inputPath = arg;
    } else {
      console.error(`Unknown option: ${arg}`);
      printUsage();
    }
  }

  try {
    if (inputPath) {
      const stats = statSync(inputPath);
      if (stats.isDirectory()) {
        const success = await processDirectory(inputPath, { inPlace, check });
        if (!success) {
          process.exit(1);
        }
      } else {
        const success = processFile(inputPath, { inPlace, check });
        if (!success) {
          process.exit(1);
        }
      }
    } else {
      const input = await readStdin();
      const formatted = formatQuery(input).formattedQuery;
      if (check) {
        if (input !== formatted) {
          console.error('Input is not formatted correctly');
          process.exit(1);
        }
      } else {
        process.stdout.write(formatted);
      }
    }
  } catch (error) {
    console.error(
      'Error:',
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}

void main();

#!/usr/bin/env node

import { formatQuery } from './index.js';
import { readFileSync, writeFileSync } from 'fs';

function printUsage() {
  console.error(`Usage: cypherfmt [options] [file]

Options:
  -i, --in-place    Modify files in place (overwrite the input file)
  -h, --help        Show this help message

If no file is provided, reads from stdin.
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

async function main() {
  const args = process.argv.slice(2);
  let inPlace = false;
  let inputFile: string | undefined;

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-h' || arg === '--help') {
      printUsage();
    } else if (arg === '-i' || arg === '--in-place') {
      inPlace = true;
    } else if (!arg.startsWith('-')) {
      inputFile = arg;
    } else {
      console.error(`Unknown option: ${arg}`);
      printUsage();
    }
  }

  try {
    let input: string;
    if (inputFile) {
      input = readFileSync(inputFile, 'utf8');
    } else {
      input = await readStdin();
    }

    const formatted = formatQuery(input).formattedQuery;

    if (inPlace && inputFile) {
      writeFileSync(inputFile, formatted);
    } else {
      process.stdout.write(formatted);
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

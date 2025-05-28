#!/usr/bin/env node

import { formatQuery } from './index.js';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const CYPHER_FILE_EXTENSIONS = ['.cy', '.cyp', '.cypher'];

function printUsage() {
  console.error(`Usage: cypherfmt [options] [file|directory]

Options:
  -i, --in-place    Modify files in place (overwrite the input file)
  -c, --check       Check if files are formatted correctly (exit with error if not)
  -h, --help        Show this help message

If no file is provided, reads from stdin.
If a directory is provided, it will be processed recursively, and format all .cy, .cyp, or .cypher files in place.
`);
  process.exit(1);
}

function readStdin(): string {
  return readFileSync(0, 'utf8');
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
  let allFilesFormatted = true;

  const entries = readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const subDirResult = await processDirectory(fullPath, options);
      allFilesFormatted = allFilesFormatted && subDirResult;
    } else if (
      entry.isFile() &&
      CYPHER_FILE_EXTENSIONS.some((ext) => entry.name.endsWith(ext))
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
        // Automatically set inPlace to true when processing a directory, since printing to stdout
        // does not make sense in that case. If check is set that will take precedence though.
        inPlace = true;
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
      const input = readStdin();
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

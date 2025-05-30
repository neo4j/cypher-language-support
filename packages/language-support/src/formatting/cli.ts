#!/usr/bin/env node

import { formatQuery } from './formatting';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const CYPHER_FILE_EXTENSIONS = ['.cy', '.cyp', '.cypher'];

function printUsage() {
  console.error(`Usage: cypherfmt [options] [file|directory]

Options:
  -i, --in-place    Modify file in place (overwrite the input file)
  -c, --check       Check if files are formatted correctly (exit with error if not)
  -h, --help        Show this help message

If no file is provided, reads from stdin.
If a directory is provided, it will be processed recursively, and format all .cy, .cyp, or .cypher files in place (unless --check is used).
`);
  process.exit(1);
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

function processDirectory(
  dirPath: string,
  options: { inPlace: boolean; check: boolean },
): boolean {
  let allFilesFormatted = true;

  const entries = readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const subDirResult = processDirectory(fullPath, options);
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

interface ParsedArgs {
  inPlace: boolean;
  check: boolean;
  inputPath?: string;
}

function parseArgs(args: string[]): ParsedArgs {
  let inPlace = false;
  let check = false;
  let inputPath: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-h' || arg === '--help') {
      printUsage();
    } else if (arg === '-i' || arg === '--in-place') {
      inPlace = true;
    } else if (arg === '-c' || arg === '--check') {
      check = true;
    } else if (!arg.startsWith('-')) {
      if (inputPath) {
        console.error('Error: Multiple input paths provided');
        printUsage();
      }
      inputPath = arg;
    } else {
      console.error(`Unknown option: ${arg}`);
      printUsage();
    }
  }

  return { inPlace, check, inputPath };
}

function main() {
  const { inPlace, check, inputPath } = parseArgs(process.argv.slice(2));

  try {
    if (inputPath) {
      const stats = statSync(inputPath);
      if (stats.isDirectory()) {
        // Automatically set inPlace to true when processing a directory, since printing to stdout
        // does not make sense in that case. If check is set that will take precedence though.
        const success = processDirectory(inputPath, { inPlace: true, check });
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
      // No file or directory provided, read from stdin.
      const input = readFileSync(0, 'utf8');
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

main();

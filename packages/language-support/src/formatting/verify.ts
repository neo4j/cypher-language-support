import { CharStreams, CommonTokenStream } from 'antlr4';
import readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import CypherCmdLexer from '../generated-parser/CypherCmdLexer';
import CypherCmdParser from '../generated-parser/CypherCmdParser';
import { formatQuery } from "./formattingv2";
import {
  FormatterErrorsListener,
} from './formattingHelpers';
import { standardizeQuery } from './standardizer';

function verifyFormatting(query: string): void {
  const formatted = formatQuery(query);
  const queryStandardized = standardizeQuery(query);
  const formattedStandardized = standardizeQuery(formatted);
  // AST integrity check
  if (formattedStandardized !== queryStandardized) {
    throw new Error(
      `Standardized query does not match standardized formatted query,
---------   QUERY BEFORE START  ------------
${query}
---------   QUERY BEFORE END    ----------

---------   QUERY FORMATTED START  ------------
${formatted}

---------   QUERY FORMATTED END    ----------
`,
    );
  }
  // Idempotency check
  const formattedTwice = formatQuery(formatted);
  if (formattedTwice !== formatted) {
    throw new Error(
      `Formatting is not idempotent`,
    );
  }
}

function isBadQuery(query: string): boolean {
  try {
    const inputStream = CharStreams.fromString(query);
    const lexer = new CypherCmdLexer(inputStream);
    const tokens = new CommonTokenStream(lexer);
    const parser = new CypherCmdParser(tokens);
    parser.removeErrorListeners();
    parser.addErrorListener(new FormatterErrorsListener());
    parser.statementsOrCommands();
  } catch (e) {
    return true;
  }
  return false;
}

function testQueries(queries: string[]) {
  let badQueries = 0;
  let successful = 0;
  for (let i = 0; i < queries.length; i++) {
    if (i % 1000 === 0) {
      console.log(`Processed ${i} queries out of ${queries.length}`);
    }
    const query = queries[i];
    if (isBadQuery(query)) {
      badQueries++;
      continue;
    }
    try {
      verifyFormatting(query);
      successful++;
    } catch (e) {
      console.log(`Error in query ${i}`);
      console.log(query);
      console.log(e.message);
    }
  }
  const goodQueries = queries.length - badQueries;
  console.log(`Successfully formatted ${successful} queries out of ${goodQueries}`);
}

const filePath = path.join(__dirname, 'queries_10000.json');
const fileContent = fs.readFileSync(filePath, 'utf-8');
const queries: string[] = JSON.parse(fileContent);

function interactiveQueryReview(queryList: string[]): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function showRandomQuery(): void {
    // Pick a random query from the list
    const randomIndex = Math.floor(Math.random() * queryList.length);
    const originalQuery = queryList[randomIndex];
    if (isBadQuery(originalQuery)) {
      showRandomQuery();
      return;
    }
    const formattedQuery = formatQuery(originalQuery);

    console.log('\n\n\n\n\n\n\n--- Original Query ---');
    console.log(originalQuery);
    console.log('\n--- Formatted Query ---');
    console.log('X'.repeat(80));
    console.log(formattedQuery);
    console.log('\nPress Enter to display another query (Ctrl+C to exit)...\n');

    // Wait for the user to press Enter before showing another query.
    rl.question('', () => {
      showRandomQuery();
    });
  }

  showRandomQuery();
}

interactiveQueryReview(queries);


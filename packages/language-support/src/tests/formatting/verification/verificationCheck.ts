import * as fs from 'fs';
import * as path from 'path';
import { formatQuery } from '../../../formatting/formatting';
import { standardizeQuery } from '../../../formatting/standardizer';

function throwError(message: string, query: string, formatted: string): never {
  throw new Error(`${message},
---------   QUERY BEFORE START  ------------
${query}
---------   QUERY BEFORE END    ----------

---------   QUERY FORMATTED START  ------------
${formatted}
---------   QUERY FORMATTED END    ----------
`);
}

function verifyFormatting(query: string): void {
  const formatted = formatQuery(query).formattedQuery;
  const queryStandardized = standardizeQuery(query);
  const formattedStandardized = standardizeQuery(formatted);
  const originalNonWhitespaceCount = query.replace(/\s/g, '').length;
  const formattedNonWhitespaceCount = formatted.replace(/\s/g, '').length;

  // Non-whitespace character count check
  if (originalNonWhitespaceCount !== formattedNonWhitespaceCount) {
    throwError('Non-whitespace character count mismatch', query, formatted);
  }

  // AST integrity check
  if (formattedStandardized !== queryStandardized) {
    throwError(
      'Standardized query does not match standardized formatted query',
      query,
      formatted,
    );
  }

  // Idempotency check
  const formattedTwice = formatQuery(formatted).formattedQuery;
  if (formattedTwice !== formatted) {
    throwError('Formatting is not idempotent', query, formatted);
  }
}

function verifyFormattingOfSampleQueries() {
  const filePath = path.join(__dirname, 'sample_queries.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const queries: string[] = JSON.parse(fileContent) as string[];
  queries.forEach((query) => verifyFormatting(query));
}

verifyFormattingOfSampleQueries();

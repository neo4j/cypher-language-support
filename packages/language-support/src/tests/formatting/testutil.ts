import { formatQuery, FormattingOptions } from '../../formatting/formatting.js';
import { standardizeQuery } from '../../formatting/standardizer.js';

export function verifyFormatting(
  query: string,
  expected: string,
  formattingOptions?: FormattingOptions,
): void {
  const formatted = formatQuery(query, formattingOptions).formattedQuery;
  expect(formatted).toEqual(expected);
  const queryStandardized = standardizeQuery(query);
  const formattedStandardized = standardizeQuery(formatted);
  if (formattedStandardized !== queryStandardized) {
    throw new Error(
      `Standardized query does not match standardized formatted query`,
    );
  }
  // Idempotency check
  const formattedTwice = formatQuery(
    formatted,
    formattingOptions,
  ).formattedQuery;
  expect(formattedTwice).toEqual(formatted);
}

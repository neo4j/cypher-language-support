import { formatQuery, FormattingOptions } from '../../formatting/formatting';
import { standardizeQuery } from '../../formatting/standardizer';

export function verifyFormatting(
  query: string,
  expected: string,
  formattingOptions?: FormattingOptions,
): void {
  const formatted = formattingOptions
    ? formatQuery(query, formattingOptions).formattedString
    : formatQuery(query);
  expect(formatted).toEqual(expected);
  const queryStandardized = standardizeQuery(query);
  const formattedStandardized = standardizeQuery(formatted);
  if (formattedStandardized !== queryStandardized) {
    throw new Error(
      `Standardized query does not match standardized formatted query`,
    );
  }
  // Idempotency check
  const formattedTwice = formattingOptions
    ? formatQuery(query, formattingOptions).formattedString
    : formatQuery(query);
  expect(formattedTwice).toEqual(formatted);
}

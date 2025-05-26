import { formatQuery, FormattingOptions } from '../../formatting/formatting';
import { standardizeQuery } from '../../formatting/standardizer';

export function verifyFormatting(
  query: string,
  expected: string,
  formattingOptions?: FormattingOptions,
): void {
  const formatted = formatQuery(query, formattingOptions).formattedString;
  expect(formatted).toEqual(expected);
  const queryStandardized = standardizeQuery(query);
  const formattedStandardized = standardizeQuery(formatted);
  if (formattedStandardized !== queryStandardized) {
    throw new Error(
      `Standardized query does not match standardized formatted query`,
    );
  }
  // Idempotency check
  const formattedTwice = formatQuery(query, formattingOptions).formattedString;
  expect(formattedTwice).toEqual(formatted);
}

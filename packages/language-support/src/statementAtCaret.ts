import { createParsingResult } from './cypherLanguageService.js';

/**
 * Returns the text of the statement containing the caret.
 *
 * This lives here rather than in the consumer so that ParsingResult - which exposes
 * the generated ANTLR parser - does not need to be part of this package's public API.
 */
export function getStatementAtCaret(
  input: string,
  caretOffset: number,
  { consoleCommandsEnabled = true }: { consoleCommandsEnabled?: boolean } = {},
): string {
  const statements = createParsingResult(input, {
    consoleCommandsEnabled,
  });
  // Since the find goes through the statements in order this will work out.
  let currentStatement = statements.statementsParsing.find((statement) => {
    const stopOffset = statement?.ctx?.stop?.stop;
    return stopOffset ? stopOffset >= caretOffset : false;
  });
  // Special case for when the caret is after the final token
  currentStatement =
    !currentStatement && statements.statementsParsing
      ? statements.statementsParsing.at(-1)
      : currentStatement;
  const result = input.slice(
    currentStatement.tokens.at(0).start,
    currentStatement.tokens.at(-1).stop + 1,
  );
  return result;
}

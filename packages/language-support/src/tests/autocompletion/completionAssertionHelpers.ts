import { CypherLanguageService } from '../../cypherLanguageService';
import { DbSchema } from '../../dbSchema';
import { CompletionItem } from '../../types';

const languageService = new CypherLanguageService();

export function testCompletionsExactly({
  query,
  offset = query.length,
  dbSchema = {},
  expected = [],
}: {
  query: string;
  offset?: number;
  dbSchema?: DbSchema;
  expected?: CompletionItem[];
}) {
  const actualCompletionList = languageService.provideAutocompletions(
    query,
    dbSchema,
    offset,
  );
  expect(actualCompletionList).toEqual(expected);
}

export function testCompletions({
  query,
  offset = query.length,
  dbSchema = {},
  excluded = [],
  expected = [],
  assertEmpty = false,
  manualTrigger = false,
  computeSymbolsInfo = false,
}: {
  query: string;
  offset?: number;
  dbSchema?: DbSchema;
  excluded?: Partial<CompletionItem>[];
  expected?: CompletionItem[];
  assertEmpty?: boolean;
  manualTrigger?: boolean;
  computeSymbolsInfo?: boolean;
}) {
  // TODO This is a temporary hack because completions are not working well
  query = query.slice(0, offset);
  if (computeSymbolsInfo) {
    const result = languageService.provideLinting(query, dbSchema);
    languageService.setSymbolsInfo({
      query,
      symbolTables: result.symbolTables,
    });
  }

  const actualCompletionList = languageService.provideAutocompletions(
    query,
    dbSchema,
    offset,
    manualTrigger,
  );

  if (assertEmpty) {
    expect(actualCompletionList).toEqual([]);
  }

  expect(actualCompletionList).not.toContain(null);
  expect(actualCompletionList).not.toContain(undefined);

  const expectedCompletions = expected.map((expectedItem) =>
    actualCompletionList.find(
      (value) =>
        value.kind === expectedItem.kind &&
        value.label === expectedItem.label &&
        value.detail === expectedItem.detail,
    ),
  );

  expect(expected).toEqual(expectedCompletions);

  const unexpectedCompletions = excluded.filter((notExpectedItem) =>
    actualCompletionList.find((value) => {
      // if label is left out -> only check kind and vice versa
      const matchingKind =
        notExpectedItem.kind === undefined ||
        notExpectedItem.kind === value.kind;

      const matchingLabel =
        notExpectedItem.label === undefined ||
        notExpectedItem.label === value.label;

      return matchingKind && matchingLabel;
    }),
  );

  expect(unexpectedCompletions).toEqual([]);
  if (computeSymbolsInfo) {
    languageService.clearCache();
  }
}

export function getSymbolCompletions({
  query,
  dbSchema,
}: {
  query: string;
  dbSchema: DbSchema;
}) {
  const result = languageService.provideLinting(query, dbSchema);
  languageService.setSymbolsInfo({
    query: query,
    symbolTables: result.symbolTables,
  });

  const completions = languageService.provideAutocompletions(
    query,
    dbSchema,
    query.length,
    false,
  );
  return completions;
}

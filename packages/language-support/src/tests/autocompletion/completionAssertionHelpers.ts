import { autocomplete } from '../../autocompletion/autocompletion';
import { DbSchema } from '../../dbSchema';
import { parserWrapper } from '../../parserWrapper';
import { CompletionItem } from '../../types';
import { getSymbolTablesForQuery } from '../syntaxValidation/helpers';

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
  const actualCompletionList = autocomplete(query, dbSchema, offset);
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
  getSymbolsInfoFrom,
}: {
  query: string;
  offset?: number;
  dbSchema?: DbSchema;
  excluded?: Partial<CompletionItem>[];
  expected?: CompletionItem[];
  assertEmpty?: boolean;
  manualTrigger?: boolean;
  getSymbolsInfoFrom?: string;
}) {
  if (typeof getSymbolsInfoFrom === 'string') {
    parserWrapper.parse(getSymbolsInfoFrom);
    const symbolTables = getSymbolTablesForQuery({
      query: getSymbolsInfoFrom,
      dbSchema,
    });
    console.log(JSON.stringify(symbolTables, null, 2));

    parserWrapper.setSymbolsInfo({
      query,
      symbolTables,
    });
  }

  const actualCompletionList = autocomplete(
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
}

import { autocomplete } from '../../autocompletion/autocompletion';
import { DbSchema } from '../../dbSchema';
import { CompletionItem } from '../../types';

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
}: {
  query: string;
  offset?: number;
  dbSchema?: DbSchema;
  excluded?: Partial<CompletionItem>[];
  expected?: CompletionItem[];
  assertEmpty?: boolean;
  manualTrigger?: boolean;
}) {
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

  const unexpectedCompletions = excluded.map((notExpectedItem) =>
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

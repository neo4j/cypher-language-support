import { CompletionItem } from 'vscode-languageserver-types';
import { autocomplete } from '../../autocompletion/autocompletion';
import { DbSchema } from '../../dbSchema';

type InclusionTestArgs = {
  query: string;
  dbSchema?: DbSchema;
  expected: CompletionItem[];
};
export function testCompletionContains({
  query,
  dbSchema = {},
  expected,
}: InclusionTestArgs) {
  const actualCompletionList = autocomplete(query, dbSchema);

  expect(actualCompletionList).not.toContain(null);
  expect(actualCompletionList).not.toContain(undefined);

  const actual = expected.map((expectedItem) =>
    actualCompletionList.find(
      (value) =>
        value.kind === expectedItem.kind && value.label === expectedItem.label,
    ),
  );

  expect(expected).toEqual(actual);
}

type ExclusionTestArgs = {
  query: string;
  dbSchema?: DbSchema;
  excluded: Partial<CompletionItem>[];
};
export function testCompletionDoesNotContain({
  query,
  dbSchema = {},
  excluded,
}: ExclusionTestArgs) {
  const actualCompletionList = autocomplete(query, dbSchema);

  expect(actualCompletionList).not.toContain(null);
  expect(actualCompletionList).not.toContain(undefined);

  const actual = excluded.map((notExpectedItem) =>
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

  expect(actual).toEqual([]);
}

import { CompletionItemKind } from 'vscode-languageserver-types';
import type { DbSchema } from '../../../dbSchema.js';
import { testCompletions } from './completionAssertionHelpers.js';

describe('Can complete SHOW CONSTRAINTS YIELD', () => {
  const dbSchema: DbSchema = {
    constraintInfo: {
      constraints: [],
      fieldNames: [
        'id',
        'name',
        'type',
        'entityType',
        'labelsOrTypes',
        'properties',
        'enforced',
        'classification',
        'ownedIndex',
        'propertyType',
        'options',
        'createStatement',
      ],
    },
  };

  test('Can suggest all yield-able values', () => {
    const query = 'SHOW CONSTRAINTS YIELD ';

    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: 'id',
          kind: CompletionItemKind.Variable,
        },
        {
          label: 'name',
          kind: CompletionItemKind.Variable,
        },
        {
          label: 'type',
          kind: CompletionItemKind.Variable,
        },
        {
          label: 'entityType',
          kind: CompletionItemKind.Variable,
        },
        {
          label: 'labelsOrTypes',
          kind: CompletionItemKind.Variable,
        },
        {
          label: 'properties',
          kind: CompletionItemKind.Variable,
        },
        {
          label: 'enforced',
          kind: CompletionItemKind.Variable,
        },
        {
          label: 'propertyType',
          kind: CompletionItemKind.Variable,
        },
        {
          label: 'options',
          kind: CompletionItemKind.Variable,
        },
        {
          label: 'createStatement',
          kind: CompletionItemKind.Variable,
        },
      ],
    });
  });

  test('Suggests yield-able columns that fit started word', () => {
    const query = 'SHOW CONSTRAINTS YIELD prop';

    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: 'properties',
          kind: CompletionItemKind.Variable,
        },
        {
          label: 'propertyType',
          kind: CompletionItemKind.Variable,
        },
      ],
    });
  });

  test('Suggests only yield-able columns that are not already used', () => {
    const query = 'SHOW CONSTRAINTS YIELD properties, prop';

    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: 'propertyType',
          kind: CompletionItemKind.Variable,
        },
      ],
    });
  });
});

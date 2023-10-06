import { CompletionItemKind } from 'vscode-languageserver-types';
import { DbSchema } from '../../dbSchema';
import {
  testCompletionContains,
  testCompletionDoesNotContain,
} from './completion-assertion-helpers';

describe('property key completions', () => {
  const dbSchema: DbSchema = { propertyKeys: ['name', 'type', 'level'] };

  test('correctly completes property keys in WHERE', () => {
    const query = 'MATCH (n) WHERE n.';
    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Property },
        { label: 'type', kind: CompletionItemKind.Property },
        { label: 'level', kind: CompletionItemKind.Property },
      ],
    });
  });

  test('correctly completes property keys in match clauses', () => {
    const cases = [
      'MATCH ({',
      'MATCH (n {',
      'MATCH (n:Person {',
      'MATCH (n:Person {p: 1, ',
    ];
    cases.forEach((query) =>
      testCompletionContains({
        query,
        dbSchema,
        expected: [
          { label: 'name', kind: CompletionItemKind.Property },
          { label: 'type', kind: CompletionItemKind.Property },
          { label: 'level', kind: CompletionItemKind.Property },
        ],
      }),
    );
  });

  test('correctly completes property keys in simple map projection', () => {
    const query = `
RETURN movie {
 .
`;

    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Property },
        { label: 'type', kind: CompletionItemKind.Property },
        { label: 'level', kind: CompletionItemKind.Property },
      ],
    });
  });

  test('correctly completes property keys in complex map projection', () => {
    const query = `
RETURN movie {
 actors: [(movie)<-[rel:ACTED_IN]-(person:Person) 
                 | person { .
`;

    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Property },
        { label: 'type', kind: CompletionItemKind.Property },
        { label: 'level', kind: CompletionItemKind.Property },
      ],
    });
  });

  test('does not complete property keys in literals', () => {
    const query = `RETURN {`;

    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [
        { label: 'name', kind: CompletionItemKind.Property },
        { label: 'type', kind: CompletionItemKind.Property },
        { label: 'level', kind: CompletionItemKind.Property },
      ],
    });
  });
});

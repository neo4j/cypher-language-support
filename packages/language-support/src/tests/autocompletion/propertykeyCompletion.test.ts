import { CompletionItemKind } from 'vscode-languageserver-types';
import { DbSchema } from '../../dbSchema';
import { testCompletions } from './completionAssertionHelpers';

describe('property key completions', () => {
  const dbSchema: DbSchema = {
    propertyKeys: ['name', 'type', 'level'],
    functionSignatures: { 'apoc.util.sleep': { label: 'apoc.util.sleep' } },
  };

  test('correctly completes property keys in WHERE', () => {
    const query = 'MATCH (n) WHERE n.';
    testCompletions({
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
      testCompletions({
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

    testCompletions({
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

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Property },
        { label: 'type', kind: CompletionItemKind.Property },
        { label: 'level', kind: CompletionItemKind.Property },
      ],
    });
  });

  test('does not complete property keys in map literals', () => {
    const query = `RETURN {`;

    testCompletions({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Property }],
    });
  });

  test('does not complete property keys for undefined variables', () => {
    const query = `RETURN abc.`;

    testCompletions({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Property }],
    });
  });

  test('does not try to complete property keys for non-variable expressions', () => {
    const expressions = ["'abc'", '1', 'true', 'null', '[]', '{}', '$para'];

    expressions.forEach((expression) => {
      testCompletions({
        query: `RETURN ${expression}.`,
        dbSchema,
        excluded: [{ kind: CompletionItemKind.Property }],
      });
    });
  });

  test('does not yet support completing property keys for variables in parentesis', () => {
    const query = `WITH 1 as node RETURN (node).`;

    testCompletions({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Property }],
    });
  });

  test('completes property keys for non-node variables when semantic analysis is not available', () => {
    const query = `WITH 1 as node RETURN node.`;

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Property },
        { label: 'type', kind: CompletionItemKind.Property },
        { label: 'level', kind: CompletionItemKind.Property },
      ],
    });
  });

  test('completes both namespace and properties when variable name is equal to namespace', () => {
    const query = `MATCH (apoc) RETURN apoc.`;

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'type', kind: CompletionItemKind.Property },
        {
          label: 'util',
          kind: CompletionItemKind.Function,
          detail: '(namespace)',
        },
      ],
    });
  });
});

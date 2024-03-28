import {
  CompletionItemKind,
  InsertTextFormat,
} from 'vscode-languageserver-types';
import {
  testCompletions,
  testCompletionsExactly,
} from './completionAssertionHelpers';

describe('snippet completions', () => {
  test('suggests path snippets after ()', () => {
    testCompletionsExactly({
      query: 'MATCH ()',
      expected: [
        {
          label: '-[]->()',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: InsertTextFormat.Snippet,
          insertText: '-[${1: }]->(${2: })',
          filterText: '',
          detail: 'path template',
        },
        {
          label: '<-[]-()',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: InsertTextFormat.Snippet,
          insertText: '<-[${1: }]-(${2: })',
          filterText: '',
          detail: 'path template',
        },
      ],
    });
  });

  // TODO test other places where snippets are suggested

  test('does not suggest snippets when path is started ', () => {
    testCompletions({
      query: 'MATCH ()<',
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });
    testCompletions({
      query: 'MATCH ()-',
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });
    testCompletions({
      query: 'MATCH ()-[',
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });
    testCompletions({
      query: 'MATCH ()-[]',
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });
    testCompletions({
      query: 'MATCH ()<-',
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });
  });

  test('suggests path snippets when starting new path MATCH ()-[]->()', () => {
    testCompletionsExactly({
      query: 'MATCH ()<-[]-()',
      expected: [
        {
          label: '-[]->()',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: InsertTextFormat.Snippet,
          insertText: '-[${1: }]->(${2: })',
          filterText: '',
          detail: 'path template',
        },
        {
          label: '<-[]-()',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: InsertTextFormat.Snippet,
          insertText: '<-[${1: }]-(${2: })',
          filterText: '',
          detail: 'path template',
        },
      ],
    });
  });

  test('suggests path snippets after MATCH ()--()', () => {
    testCompletionsExactly({
      query: 'MATCH ()--()',
      expected: [
        {
          label: '-[]->()',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: InsertTextFormat.Snippet,
          insertText: '-[${1: }]->(${2: })',
          filterText: '',
          detail: 'path template',
        },
        {
          label: '<-[]-()',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: InsertTextFormat.Snippet,
          insertText: '<-[${1: }]-(${2: })',
          filterText: '',
          detail: 'path template',
        },
      ],
    });
  });

  test('does not suggest paths when trigger character used in other contexts', () => {
    testCompletions({
      query: 'RETURN (1)',
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });

    testCompletions({
      query: 'RETURN abs(1)',
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });

    testCompletions({
      query: 'CALL dbms.clientConfig()',
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });
  });

  test('typing snippet trigger character should not open completions automatically in expression..', () => {
    testCompletions({
      query: 'RETURN (1)',
      assertEmpty: true,
    });

    testCompletions({
      query: 'RETURN abs(1)',
      assertEmpty: true,
    });
  });

  test('...but manually triggering completions after -/< should still work', () => {
    testCompletions({
      query: 'RETURN (1)',
      manualTrigger: true,
      expected: [
        { kind: CompletionItemKind.Keyword, label: 'AND' },
        { kind: CompletionItemKind.Keyword, label: 'OR' },
      ],
    });

    testCompletions({
      query: 'RETURN abs(1)',
      manualTrigger: true,
      expected: [
        { kind: CompletionItemKind.Keyword, label: 'AND' },
        { kind: CompletionItemKind.Keyword, label: 'OR' },
      ],
    });
  });
});

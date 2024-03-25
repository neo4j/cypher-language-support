import {
  CompletionItemKind,
  InsertTextFormat,
} from 'vscode-languageserver-types';
import {
  testCompletions,
  testCompletionsExactly,
} from './completionAssertionHelpers';

describe('snippet completions', () => {
  test('suggests path snippets after ()-', () => {
    testCompletionsExactly({
      query: 'MATCH ()-',
      expected: [
        {
          label: '-[]->()',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: InsertTextFormat.Snippet,
          insertText: '[${1: }]->(${2: })',
          detail: 'path template',
        },
      ],
    });
  });

  test('suggests path snippets after ()<', () => {
    testCompletionsExactly({
      query: 'MATCH ()<',
      expected: [
        {
          label: '<-[]-()',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: InsertTextFormat.Snippet,
          insertText: '-[${1: }]-(${2: })',
          detail: 'path template',
        },
      ],
    });
  });

  test('does not suggest snippets in half finished path open bracket', () => {
    testCompletions({
      query: 'MATCH ()-[',
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });
  });

  test('does not suggest snippets in half finished path closed bracket', () => {
    testCompletions({
      query: 'MATCH ()-[]',
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });
  });

  test('does not suggest snippets in half finished path arrow', () => {
    testCompletions({
      query: 'MATCH ()<-',
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });
  });

  test('suggests path snippets after MATCH ()-[]->()<', () => {
    testCompletionsExactly({
      query: 'MATCH ()<-[]-()<',
      expected: [
        {
          label: '<-[]-()',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: InsertTextFormat.Snippet,
          insertText: '-[${1: }]-(${2: })',
          detail: 'path template',
        },
      ],
    });
  });

  test('suggests path snippets after MATCH ()-[]->()-', () => {
    testCompletionsExactly({
      query: 'MATCH ()-[]->()-',
      expected: [
        {
          label: '-[]->()',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: InsertTextFormat.Snippet,
          insertText: '[${1: }]->(${2: })',
          detail: 'path template',
        },
      ],
    });
  });

  test('suggests path snippets after MATCH ()--()-', () => {
    testCompletionsExactly({
      query: 'MATCH ()--()-',
      expected: [
        {
          label: '-[]->()',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: InsertTextFormat.Snippet,
          insertText: '[${1: }]->(${2: })',
          detail: 'path template',
        },
      ],
    });
  });

  test('suggests path snippets after ()-', () => {
    testCompletionsExactly({
      query: 'MATCH ()-[]->()-',
      expected: [
        {
          label: '-[]->()',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: InsertTextFormat.Snippet,
          insertText: '[${1: }]->(${2: })',
          detail: 'path template',
        },
      ],
    });
  });

  test('does not suggest paths when trigger characters used in expressions', () => {
    testCompletions({
      query: 'RETURN 1-',
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });

    testCompletions({
      query: 'RETURN 1<',
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });
  });

  test('typing snippet trigger character should not open completions automatically in expression..', () => {
    testCompletions({
      query: 'RETURN 1-',
      assertEmpty: true,
    });

    testCompletions({
      query: 'RETURN 1<',
      assertEmpty: true,
    });
  });

  test('...but manually triggering completions after -/< should still work', () => {
    testCompletions({
      query: 'RETURN 1-',
      manualTrigger: true,
      expected: [
        { kind: CompletionItemKind.Keyword, label: 'INFINITY' },
        { kind: CompletionItemKind.Keyword, label: 'NAN' },
      ],
    });

    testCompletions({
      query: 'RETURN 1<',
      manualTrigger: true,
      expected: [
        { kind: CompletionItemKind.Keyword, label: 'INFINITY' },
        { kind: CompletionItemKind.Keyword, label: 'NAN' },
      ],
    });
  });
});

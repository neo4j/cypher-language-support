import { testCompletions } from './completionAssertionHelpers';

describe('snippet completions', () => {
  test('suggests path snippets after ()-', () => {
    testCompletions({
      query: 'MATCH ()-',
      expected: [
        /*
        {
          label: '-[]->()',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: InsertTextFormat.Snippet,
          insertText: '[${1: }]->(${2: })',
          detail: 'path template',
        },
        */
      ],
    });
  });

  test.skip('suggests path snippets after ()<', () => {
    /* not implemented */
  });

  test.skip('does not suggest paths when trigger characters used in expressions', () => {
    /* not implemented */
  });

  test.skip('show only snippet completions after snippet trigger characters for automatically triggered completion request', () => {
    /* not implemented */
  });

  test.skip('show all completions after snippet trigger characters when manually triggered completion request', () => {
    /* not implemented */
  });
});

import { testCompletions } from './completionAssertionHelpers';

describe('expression completions', () => {
  test('Debugging completion', () => {
    const query = `RETURN `;

    expect(
      testCompletions({
        query: query,
        expected: [],
      }),
    );
  });
});

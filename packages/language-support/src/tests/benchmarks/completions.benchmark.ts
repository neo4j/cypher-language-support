/* eslint-disable no-console */
import { bench, describe } from 'vitest';
import { parse, defaultCypherHelper } from '../../parserWrapper';
import { testData } from '../testData';
import { autocompletionQueries, tictactoe } from './benchmarkQueries';

describe('completions', () => {
  bench('multistatement - autocompletion', function () {
    const query = tictactoe + ';\n' + tictactoe;
    const subQuery = tictactoe;
    defaultCypherHelper.clearCache();
    // This mimics getting the cursor back in the query and retriggering auto-completion
    defaultCypherHelper.complete(query, testData.mockSchema);
    defaultCypherHelper.complete(query, testData.mockSchema, subQuery.length);
  });

  // Handle autocomplete queries
  Object.entries(autocompletionQueries).forEach(([name, query]) => {
    bench(`autocomplete - ${name} (parse.time.only)`, function () {
      parse(query);
    });

    bench(`autocomplete - ${name}`, function () {
      defaultCypherHelper.clearCache();
      defaultCypherHelper.complete(query, testData.mockSchema);
    });
  });
});

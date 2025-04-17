/* eslint-disable no-console */
import { bench, describe } from 'vitest';
import { autocomplete } from '../../autocompletion/autocompletion';
import { parse, parserWrapper } from '../../parserWrapper';
import { testData } from '../testData';
import { autocompletionQueries, tictactoe } from './benchmarkQueries';

describe('completions', () => {
  bench('multistatement - autocompletion', function () {
    const query = tictactoe + ';\n' + tictactoe;
    const subQuery = tictactoe;
    parserWrapper.clearCache();
    // This mimics getting the cursor back in the query and retriggering auto-completion
    autocomplete(query, testData.mockSchema);
    autocomplete(query, testData.mockSchema, subQuery.length);
  });

  // Handle autocomplete queries
  Object.entries(autocompletionQueries).forEach(([name, query]) => {
    bench(`autocomplete - ${name} (parse.time.only)`, function () {
      parse(query);
    });

    bench(`autocomplete - ${name}`, function () {
      parserWrapper.clearCache();
      autocomplete(query, testData.mockSchema);
    });
  });
});

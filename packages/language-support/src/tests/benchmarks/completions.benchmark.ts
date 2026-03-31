/* eslint-disable no-console */
import { bench, describe } from 'vitest';
import { CypherLanguageService, parse } from '../../cypherLanguageService.js';
import { testData } from '../testData.js';
import { autocompletionQueries, tictactoe } from './benchmarkQueries.js';
const languageService = new CypherLanguageService();
describe('completions', () => {
  bench('multistatement - autocompletion', function () {
    const query = tictactoe + ';\n' + tictactoe;
    const subQuery = tictactoe;
    languageService.clearCache();
    // This mimics getting the cursor back in the query and retriggering auto-completion
    languageService.autocomplete(query, testData.mockSchema);
    languageService.autocomplete(query, testData.mockSchema, {
      caretPosition: subQuery.length,
    });
  });

  // Handle autocomplete queries
  Object.entries(autocompletionQueries).forEach(([name, query]) => {
    bench(`autocomplete - ${name} (parse.time.only)`, function () {
      parse(query);
    });

    bench(`autocomplete - ${name}`, function () {
      languageService.clearCache();
      languageService.autocomplete(query, testData.mockSchema);
    });
  });
});

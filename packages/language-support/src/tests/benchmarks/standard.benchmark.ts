/* eslint-disable no-console */
import { bench, describe } from 'vitest';
import { CypherLanguageService, parse } from '../../cypherLanguageService';
import { testData } from '../testData';
import {
  createMovieDb,
  largePokemonquery,
  simpleQuery,
  tictactoe,
} from './benchmarkQueries';

const periodicIterate = 'CALL apoc.periodic.iterate(';
const periodicIterateFirstArg = '"MATCH (p:Person) RETURN id(p) as personId", ';
const languageService = new CypherLanguageService();

/**
 * Run standard benchmarks for a given query
 */
function benchmarkQuery(queryName: string, queryContent: string) {
  describe(queryName, () => {
    bench('parse', () => {
      parse(queryContent);
    });

    bench('parse with CypherLanguageService', () => {
      languageService.clearCache();
      languageService.parse(queryContent);
    });

    bench('syntax highlighting', () => {
      languageService.clearCache();
      languageService.highlightSyntax(queryContent);
    });

    bench(
      'syntax validation',
      () => {
        languageService.clearCache();
        languageService.lint(queryContent, testData.mockSchema);
      },
      // benchmarking the semantic analysis can be very slow, so we lower the minimum number of iterations & warmup iterations
      { iterations: 1, warmupIterations: 2 },
    );

    bench('autocomplete next statement - no schema', () => {
      languageService.clearCache();
      languageService.autocomplete(queryContent, {});
    });

    bench('autocomplete next statement - schema', () => {
      languageService.clearCache();
      languageService.autocomplete(queryContent, testData.mockSchema);
    });

    bench('signature help', () => {
      const subQuery = queryContent + periodicIterate;
      const fullQuery =
        queryContent + periodicIterate + periodicIterateFirstArg;
      languageService.clearCache();
      languageService.getSignatureHelp(queryContent, testData.mockSchema, {
        caretPosition: fullQuery.length,
      });
      languageService.getSignatureHelp(queryContent, testData.mockSchema, {
        caretPosition: subQuery.length,
      });
    });
  });
}

describe('benchmarks', () => {
  benchmarkQuery('simple query', simpleQuery);
  benchmarkQuery('tictactoe', tictactoe);
  benchmarkQuery('movies', createMovieDb);
  benchmarkQuery('pokemon', largePokemonquery);
});

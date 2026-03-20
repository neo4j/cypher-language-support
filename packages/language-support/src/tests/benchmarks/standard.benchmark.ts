/* eslint-disable no-console */
import { bench, describe } from 'vitest';
import { parse, defaultCypherHelper } from '../../cypherHelper';
import { testData } from '../testData';
import {
  createMovieDb,
  largePokemonquery,
  simpleQuery,
  tictactoe,
} from './benchmarkQueries';

const periodicIterate = 'CALL apoc.periodic.iterate(';
const periodicIterateFirstArg = '"MATCH (p:Person) RETURN id(p) as personId", ';

/**
 * Run standard benchmarks for a given query
 */
function benchmarkQuery(queryName: string, queryContent: string) {
  describe(queryName, () => {
    bench('parse', () => {
      parse(queryContent);
    });

    bench('parse with cypherHelper', () => {
      defaultCypherHelper.clearCache();
      defaultCypherHelper.parse(queryContent);
    });

    bench('syntax highlighting', () => {
      defaultCypherHelper.clearCache();
      defaultCypherHelper.syntaxColour(queryContent);
    });

    bench(
      'syntax validation',
      () => {
        defaultCypherHelper.clearCache();
        defaultCypherHelper.lint(queryContent, testData.mockSchema);
      },
      // benchmarking the semantic analysis can be very slow, so we lower the minimum number of iterations & warmup iterations
      { iterations: 1, warmupIterations: 2 },
    );

    bench('autocomplete next statement - no schema', () => {
      defaultCypherHelper.clearCache();
      defaultCypherHelper.complete(queryContent, {});
    });

    bench('autocomplete next statement - schema', () => {
      defaultCypherHelper.clearCache();
      defaultCypherHelper.complete(queryContent, testData.mockSchema);
    });

    bench('signature help', () => {
      const subQuery = queryContent + periodicIterate;
      const fullQuery =
        queryContent + periodicIterate + periodicIterateFirstArg;
      defaultCypherHelper.clearCache();
      defaultCypherHelper.sigHelp(
        queryContent,
        testData.mockSchema,
        fullQuery.length,
      );
      defaultCypherHelper.sigHelp(
        queryContent,
        testData.mockSchema,
        subQuery.length,
      );
    });
  });
}

describe('benchmarks', () => {
  benchmarkQuery('simple query', simpleQuery);
  benchmarkQuery('tictactoe', tictactoe);
  benchmarkQuery('movies', createMovieDb);
  benchmarkQuery('pokemon', largePokemonquery);
});

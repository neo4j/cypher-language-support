/* eslint-disable no-console */
import { bench, describe } from 'vitest';
import { autocomplete } from '../../autocompletion/autocompletion';
import { parse, parserWrapper } from '../../parserWrapper';
import { signatureHelp } from '../../signatureHelp';
import { applySyntaxColouring } from '../../syntaxColouring/syntaxColouring';
import { lintCypherQuery } from '../../syntaxValidation/syntaxValidation';
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

    bench('parse with parserWrapper', () => {
      parserWrapper.clearCache();
      parserWrapper.parse(queryContent);
    });

    bench('syntax highlighting', () => {
      parserWrapper.clearCache();
      applySyntaxColouring(queryContent);
    });

    bench(
      'syntax validation',
      () => {
        parserWrapper.clearCache();
        lintCypherQuery(queryContent, testData.mockSchema);
      },
      // benchmarking the semantic analysis can be very slow, so we lower the minimum number of iterations & warmup iterations
      { iterations: 1, warmupIterations: 2 },
    );

    bench('autocomplete next statement - no schema', () => {
      parserWrapper.clearCache();
      autocomplete(queryContent, {});
    });

    bench('autocomplete next statement - schema', () => {
      parserWrapper.clearCache();
      autocomplete(queryContent, testData.mockSchema);
    });

    bench('signature help', () => {
      const subQuery = queryContent + periodicIterate;
      const fullQuery =
        queryContent + periodicIterate + periodicIterateFirstArg;
      parserWrapper.clearCache();
      signatureHelp(queryContent, testData.mockSchema, fullQuery.length);
      signatureHelp(queryContent, testData.mockSchema, subQuery.length);
    });
  });
}

describe('benchmarks', () => {
  benchmarkQuery('simple query', simpleQuery);
  benchmarkQuery('tictactoe', tictactoe);
  benchmarkQuery('movies', createMovieDb);
  benchmarkQuery('pokemon', largePokemonquery);
});

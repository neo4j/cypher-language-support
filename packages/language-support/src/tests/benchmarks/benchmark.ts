/* eslint-disable no-console */
import Benchmark from 'benchmark';
import { autocomplete } from '../../autocompletion/autocompletion';
import { applySyntaxColouring2 } from '../../highlighting/syntaxColouring/syntaxColouring';
import { validateSyntax } from '../../highlighting/syntaxValidation/syntaxValidation';
import { parse, parserWrapper } from '../../parserWrapper';
import { benchmarkingMediumSizeSchema } from './benchmark-dbschemas';
import {
  autocompletionQueries,
  createMovieDb,
  largePokemonquery,
  simpleQuery,
  tictactoe,
} from './benchmark-queries';

Benchmark.options.minSamples = 20;

const suite = new Benchmark.Suite();

suite
  .add('simple - parse', function () {
    parse(simpleQuery);
  })
  .add('simple - highlight', function () {
    parserWrapper.clearCache();
    applySyntaxColouring2(simpleQuery);
  })
  .add('simple - validate syntax', function () {
    parserWrapper.clearCache();
    validateSyntax(simpleQuery, benchmarkingMediumSizeSchema);
  })
  .add('simple - autocomplete next statement', function () {
    parserWrapper.clearCache();
    autocomplete(simpleQuery, benchmarkingMediumSizeSchema);
  })
  .add('movies - parse', function () {
    parse(createMovieDb);
  })
  .add('movies - highlight', function () {
    parserWrapper.clearCache();
    applySyntaxColouring2(createMovieDb);
  })
  .add('movies - validate syntax', function () {
    parserWrapper.clearCache();
    validateSyntax(createMovieDb, benchmarkingMediumSizeSchema);
  })
  .add('movies - autocomplete next statement', function () {
    parserWrapper.clearCache();
    autocomplete(createMovieDb, benchmarkingMediumSizeSchema);
  })
  .add('tictactoe - parse', function () {
    parserWrapper.clearCache();
    parse(tictactoe);
  })
  .add('tictactoe - highlight', function () {
    parserWrapper.clearCache();
    applySyntaxColouring2(tictactoe);
  })
  .add('tictactoe - validate syntax', function () {
    parserWrapper.clearCache();
    validateSyntax(tictactoe, benchmarkingMediumSizeSchema);
  })
  .add('tictactoe - autocomplete next statement - no Schema', function () {
    parserWrapper.clearCache();
    autocomplete(tictactoe, {});
  })
  .add('tictactoe - autocomplete next statement - medium Schema', function () {
    parserWrapper.clearCache();
    autocomplete(tictactoe, benchmarkingMediumSizeSchema);
  })
  .add('pokemon - parse', function () {
    parserWrapper.clearCache();
    parse(largePokemonquery);
  })
  .add('pokemon - parserwrapper parse', function () {
    parserWrapper.clearCache();
    parserWrapper.parse(largePokemonquery);
  })
  .add('pokemon - syntax highlight', function () {
    parserWrapper.clearCache();
    applySyntaxColouring2(largePokemonquery);
  });

Object.entries(autocompletionQueries).forEach(([name, query]) => {
  suite.add(`autocomplete - ${name} (parse.time.only)`, function () {
    parse(query);
  });
  suite.add(`autocomplete - ${name}`, function () {
    parserWrapper.clearCache();
    autocomplete(query, benchmarkingMediumSizeSchema);
  });
});

suite
  .on('cycle', function (event: { target: { toString: () => string } }) {
    console.log(String(event.target));
  })
  .on('complete', async function () {
    const API_KEY = process.env.GRAFANA_API_KEY;

    if (API_KEY) {
      console.log('Publishing metrics to grafana');
      const USER_ID = 1226722;

      const metrics: Record<string, number> = {};

      // arcane magic to get the benchmark results
      // eslint-disable-next-line
      this.forEach(function (benchmark: {
        name: string;
        hz: number /* operations per second */;
      }) {
        metrics[benchmark.name] = benchmark.hz;
      });

      const body = Object.entries(metrics)
        .map(
          ([key, value]) =>
            `unit-benchmark,bar_label=${key.replaceAll(
              /\s/g,
              '',
            )},source=benchmarkjs metric=${value}`,
        )
        .join('\n');

      await fetch(
        'https://influx-prod-39-prod-eu-north-0.grafana.net/api/v1/push/influx/write',
        {
          method: 'post',
          body,
          headers: {
            Authorization: `Bearer ${USER_ID}:${API_KEY}`,
            'Content-Type': 'text/plain',
          },
        },
      ).then((res) => {
        if (res.ok) {
          console.log('Metrics pushed to grafana successfully');
        } else {
          throw new Error(
            `Failed to push metrics to grafana: ${res.statusText}`,
          );
        }
      });
    }
  })
  .run({ async: true });

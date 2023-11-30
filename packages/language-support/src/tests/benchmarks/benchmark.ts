/* eslint-disable no-console */
import Benchmark from 'benchmark';
import { autocomplete } from '../../autocompletion/autocompletion';
import { applySyntaxColouring } from '../../highlighting/syntaxColouring/syntaxColouring';
import { validateSyntax } from '../../highlighting/syntaxValidation/syntaxValidation';
import { parse } from '../../parserWrapper';
import { benchmarkingMediumSizeSchema } from './benchmark-dbschemas';
import {
  autocompletionQueries,
  createMovieDb,
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
    applySyntaxColouring(simpleQuery);
  })
  .add('simple - validate syntax', function () {
    validateSyntax(simpleQuery, benchmarkingMediumSizeSchema);
  })
  .add('simple - autocomplete next statement', function () {
    autocomplete(simpleQuery, benchmarkingMediumSizeSchema);
  })
  .add('movies - parse', function () {
    parse(createMovieDb);
  })
  .add('movies - highlight', function () {
    applySyntaxColouring(createMovieDb);
  })
  .add('movies - validate syntax', function () {
    validateSyntax(createMovieDb, benchmarkingMediumSizeSchema);
  })
  .add('movies - autocomplete next statement', function () {
    autocomplete(createMovieDb, benchmarkingMediumSizeSchema);
  })
  .add('tictactoe - parse', function () {
    parse(tictactoe);
  })
  .add('tictactoe - highlight', function () {
    applySyntaxColouring(tictactoe);
  })
  .add('tictactoe - validate syntax', function () {
    validateSyntax(tictactoe, benchmarkingMediumSizeSchema);
  })
  .add('tictactoe - autocomplete next statement - no Schema', function () {
    autocomplete(tictactoe, {});
  })
  .add('tictactoe - autocomplete next statement - medium Schema', function () {
    autocomplete(tictactoe, benchmarkingMediumSizeSchema);
  });

Object.entries(autocompletionQueries).forEach(([name, query]) => {
  suite.add(`autocomplete - ${name} (parse.time.only)`, function () {
    parse(query);
  });
  suite.add(`autocomplete - ${name}`, function () {
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

      console.log(body);
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

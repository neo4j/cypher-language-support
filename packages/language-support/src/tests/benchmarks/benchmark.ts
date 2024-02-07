/* eslint-disable no-console */
import Benchmark from 'benchmark';
import { autocomplete } from '../../autocompletion/autocompletion';
import { applySyntaxColouring } from '../../highlighting/syntaxColouring/syntaxColouring';
import {
  lintCypherQuery,
  validateSyntax,
} from '../../highlighting/syntaxValidation/syntaxValidation';
import { parse, parserWrapper } from '../../parserWrapper';
import { signatureHelp } from '../../signatureHelp';
import { testData } from '../testData';
import {
  autocompletionQueries,
  createMovieDb,
  largePokemonquery,
  simpleQuery,
  tictactoe,
} from './benchmark-queries';

const periodicIterate = 'CALL apoc.periodic.iterate(';
const periodicIterateFirstArg = '"MATCH (p:Person) RETURN id(p) as personId", ';

Benchmark.options.minSamples = 10;
Benchmark.options.maxTime = 1;

const suite = new Benchmark.Suite();

suite
  .add('simple - parse', function () {
    parse(simpleQuery);
  })
  .add('simple - highlight', function () {
    parserWrapper.clearCache();
    applySyntaxColouring(simpleQuery);
  })
  .add('simple - validate syntax', function () {
    parserWrapper.clearCache();
    validateSyntax(simpleQuery, testData.mockSchema);
  })
  .add('simple - autocomplete next statement', function () {
    parserWrapper.clearCache();
    autocomplete(simpleQuery, testData.mockSchema);
  })
  .add('movies - parse', function () {
    parse(createMovieDb);
  })
  .add('movies - highlight', function () {
    parserWrapper.clearCache();
    applySyntaxColouring(createMovieDb);
  })
  .add('movies - validate syntax', function () {
    parserWrapper.clearCache();
    lintCypherQuery(createMovieDb, testData.mockSchema);
  })
  .add('movies - autocomplete next statement', function () {
    parserWrapper.clearCache();
    autocomplete(createMovieDb, testData.mockSchema);
  })
  .add('movies - signature help', function () {
    const subQuery = createMovieDb + periodicIterate;
    const query = createMovieDb + periodicIterate + periodicIterateFirstArg;
    parserWrapper.clearCache();
    signatureHelp(query, testData.mockSchema, query.length - 1);
    signatureHelp(query, testData.mockSchema, subQuery.length - 1);
  })
  .add('tictactoe - parse', function () {
    parserWrapper.clearCache();
    parse(tictactoe);
  })
  .add('tictactoe - highlight', function () {
    parserWrapper.clearCache();
    applySyntaxColouring(tictactoe);
  })
  .add('tictactoe - validate syntax', function () {
    parserWrapper.clearCache();
    lintCypherQuery(tictactoe, testData.mockSchema);
  })
  .add('tictactoe - autocomplete next statement - no Schema', function () {
    parserWrapper.clearCache();
    autocomplete(tictactoe, {});
  })
  .add('tictactoe - autocomplete next statement - medium Schema', function () {
    parserWrapper.clearCache();
    autocomplete(tictactoe, testData.mockSchema);
  })
  .add('tictactoe - signature help', function () {
    const subQuery = tictactoe + periodicIterate;
    const query = tictactoe + periodicIterate + periodicIterateFirstArg;
    parserWrapper.clearCache();
    signatureHelp(query, testData.mockSchema, query.length - 1);
    signatureHelp(query, testData.mockSchema, subQuery.length - 1);
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
    applySyntaxColouring(largePokemonquery);
  })
  .add('pokemon - signature help', function () {
    const subQuery = largePokemonquery + periodicIterate;
    const query = largePokemonquery + periodicIterate + periodicIterateFirstArg;
    parserWrapper.clearCache();
    // This mimics getting the cursor back in the query and retriggering signature help
    signatureHelp(query, testData.mockSchema, query.length - 1);
    signatureHelp(query, testData.mockSchema, subQuery.length - 1);
  })
  .add('multistatement - autocompletion', function () {
    const query = tictactoe + ';\n' + tictactoe;
    const subQuery = tictactoe;
    parserWrapper.clearCache();
    // This mimics getting the cursor back in the query and retriggering auto-completion
    autocomplete(query, testData.mockSchema);
    autocomplete(subQuery, testData.mockSchema);
  });

Object.entries(autocompletionQueries).forEach(([name, query]) => {
  suite.add(`autocomplete - ${name} (parse.time.only)`, function () {
    parse(query);
  });
  suite.add(`autocomplete - ${name}`, function () {
    parserWrapper.clearCache();
    autocomplete(query, testData.mockSchema);
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

/* eslint-disable no-console */
import Benchmark from 'benchmark';
import {
  applySyntaxColouring,
  applySyntaxColouring2,
} from '../../highlighting/syntaxColouring/syntaxColouring';
import { parse, parserWrapper } from '../../parserWrapper';
import { createMovieDb as query } from './benchmark-queries';

Benchmark.options.minSamples = 20;

const suite = new Benchmark.Suite();

suite
  .add('parse', function () {
    parse(query);
  })
  .add('old with cache', function () {
    applySyntaxColouring(query);
  })
  .add('old without cache', function () {
    parserWrapper.clearCache();
    applySyntaxColouring(query);
  })
  .add('new with cache', function () {
    applySyntaxColouring2(query);
  })
  .add('new without cache', function () {
    parserWrapper.clearCache();
    applySyntaxColouring2(query);
  });

suite
  .on('cycle', function (event: { target: { toString: () => string } }) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    const metrics: Record<string, number> = {};

    // arcane magic to get the benchmark results
    // eslint-disable-next-line
    this.forEach(function (benchmark: {
      name: string;
      hz: number /* operations per second */;
    }) {
      metrics[benchmark.name] = benchmark.hz;
    });

    /*
    console.log(
      'Parser is faster than parserwrapper by',
      metrics.parse / metrics.parserwrapper,
    );
    console.log(
      'Parserwrapper is faster than highlight by',
      metrics.parserwrapper / metrics.highlight,
    );

    */
    console.log(
      'Alltogether parser is faster than highlight by',
      metrics.parse / metrics.highlight,
    );
  })
  .run({ async: false });

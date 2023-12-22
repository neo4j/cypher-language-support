/* eslint-disable no-console */
import Benchmark from 'benchmark';
import { parse, parserWrapper } from '../../parserWrapper';
import { largePokemonquery as query } from './benchmark-queries';

Benchmark.options.minSamples = 20;
// warmup
parse(query);
parse(query);
parse(query);
parse(query);
parse(query);
parse(query);

console.log('------- new run -------');

const parseStart = performance.now();
parse(query);
console.log('parse-plain-total', performance.now() - parseStart);

parserWrapper.parse(query);
parserWrapper.clearCache();
parserWrapper.parse(query);
parserWrapper.clearCache();
parserWrapper.parse(query);
parserWrapper.clearCache();
parserWrapper.parse(query);
parserWrapper.clearCache();
const parse2Start = performance.now();
parserWrapper.parse(query);

console.log('parse2-total', performance.now() - parse2Start);
/* 
// let them use cache
parserWrapper.parse(query);

const parse3Start = performance.now();
applySyntaxColouring(query);
console.log('syntax highlight-total', performance.now() - parse3Start);

const parse4Start = performance.now();
// parserWrapper.clearCache();
applySyntaxColouring2(query);
console.log('version 2 total', performance.now() - parse4Start);
*/

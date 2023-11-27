import Benchmark from 'benchmark';
import { autocomplete } from '../../autocompletion/autocompletion';
import { applySyntaxColouring } from '../../highlighting/syntaxColouring/syntaxColouring';
import { validateSyntax } from '../../highlighting/syntaxValidation/syntaxValidation';
import { parse } from '../../parserWrapper';
import {
  autocompletionQueries,
  createMovieDb,
  simpleQuery,
  tictactoe,
} from './benchmark-queries';
const suite = new Benchmark.Suite();

suite
  .add('simple - parse', function () {
    parse(simpleQuery);
  })
  .add('simple - highlight', function () {
    applySyntaxColouring(simpleQuery);
  })
  .add('simple - validate syntax', function () {
    validateSyntax(simpleQuery, {});
  })
  .add('simple - autocomplete next statement', function () {
    autocomplete(simpleQuery, {});
  })
  .add('movies - parse', function () {
    parse(createMovieDb);
  })
  .add('movies - highlight', function () {
    applySyntaxColouring(createMovieDb);
  })
  .add('movies - validate syntax', function () {
    validateSyntax(createMovieDb, {});
  })
  .add('movies - autocomplete next statement', function () {
    autocomplete(createMovieDb, {});
  })
  .add('tictactoe - parse', function () {
    parse(tictactoe);
  })
  .add('tictactoe - highlight', function () {
    applySyntaxColouring(tictactoe);
  })
  .add('tictactoe - validate syntax', function () {
    validateSyntax(tictactoe, {});
  })
  .add('tictactoe - autocomplete next statement', function () {
    autocomplete(tictactoe, {});
  });

Object.entries(autocompletionQueries).forEach(([name, query]) => {
  suite.add(`autocomplete - ${name}`, function () {
    autocomplete(query, {
      aliasNames: ['alias'],
      databaseNames: ['db'],
      labels: ['label'],
      relationshipTypes: ['relType'],
      propertyKeys: ['prop'],
      functionSignatures: { 'apoc.util.sleep': { label: 'apoc.util.sleep' } },
      procedureSignatures: { 'db.ping': { label: 'db.ping' } },
    });
  });
});

suite
  .on('cycle', function (event: { target: { toString: () => string } }) {
    // eslint-disable-next-line no-console
    console.log(String(event.target));
  })
  .run({ async: false });

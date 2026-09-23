import { describe } from 'vitest';
import {
  createParsingResult,
  CypherLanguageService,
  parse,
} from '../../cypherLanguageService.js';
import { testData } from '../testData.js';
import {
  createMovieDb,
  largePokemonquery,
  simpleQuery,
  tictactoe,
} from './benchmarkQueries.js';

const periodicIterate = 'CALL apoc.periodic.iterate(';
const periodicIterateFirstArg = '"MATCH (p:Person) RETURN id(p) as personId", ';
const languageService = new CypherLanguageService();

/**
 * Run standard benchmarks for a given query
 */
function benchmarkQuery(queryName: string, queryContent: string) {
  // oxlint-disable-next-line vitest/valid-title
  describe(queryName, () => {
    test('parse', async ({ bench }) => {
      await bench('parse', () => {
        parse(queryContent);
      }).run();
    });

    // Equivalent to what CypherLanguageService.parse does on a cold cache; the
    // method itself is private so that ParsingResult stays out of the public API.

    test('createParsingResult', async ({ bench }) => {
      await bench('createParsingResult', () => {
        createParsingResult(queryContent, { consoleCommandsEnabled: true });
      }).run();
    });

    test('syntax highlighting', async ({ bench }) => {
      await bench('syntax highlighting', () => {
        languageService.clearCache();
        languageService.highlightSyntax(queryContent);
      }).run();
    });

    test('syntax validation', async ({ bench }) => {
      await bench('syntax validation', () => {
        languageService.clearCache();
        languageService.lint(queryContent, testData.mockSchema);
      }).run();
    });

    test('autocomplete next statement - no schema', async ({ bench }) => {
      await bench('autocomplete next statement - no schema', () => {
        languageService.clearCache();
        languageService.autocomplete(queryContent, {});
      }).run();
    });

    test('autocomplete next statement - schema', async ({ bench }) => {
      await bench('autocomplete next statement - schema', () => {
        languageService.clearCache();
        languageService.autocomplete(queryContent, testData.mockSchema);
      }).run();
    });

    test('signature help', async ({ bench }) => {
      await bench('signature help', () => {
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
      }).run();
    });
  });
}

describe('benchmarks', () => {
  benchmarkQuery('simple query', simpleQuery);
  benchmarkQuery('tictactoe', tictactoe);
  benchmarkQuery('movies', createMovieDb);
  benchmarkQuery('pokemon', largePokemonquery);
});

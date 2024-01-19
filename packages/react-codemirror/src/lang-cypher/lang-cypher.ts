import {
  defineLanguageFacet,
  Language,
  LanguageSupport,
} from '@codemirror/language';
import { parserWrapper, type DbSchema } from '@neo4j-cypher/language-support';
import { cypherAutocomplete } from './autocomplete';
import { ParserAdapter } from './ParserAdapter';
import { cypherLinter } from './syntax-validation';

const facet = defineLanguageFacet({
  commentTokens: { block: { open: '/*', close: '*/' }, line: '//' },
  closeBrackets: { brackets: ['(', '[', '{', "'", '"', '`'] },
});

const parserAdapter = new ParserAdapter(facet);

const cypherLanguage = new Language(facet, parserAdapter, [], 'cypher');

export type CypherConfig = {
  lint?: boolean;
  schema?: DbSchema;
};

// cursed way to enable console commands. Threw it together to test how it feels with the toggle
// I'm not 100% sure it's needed
// perhaps export an "init" function from the language support?
// it is tricky to send the config with each command, because of the cache.
// easiest way really is to surface a function for linting the commands
// and run it in the environemtns where we want to warn a.k.a the server?
parserWrapper.enableConsoleCommands = true;

export function cypher(config: CypherConfig) {
  return new LanguageSupport(cypherLanguage, [
    cypherLanguage.data.of({
      autocomplete: cypherAutocomplete(config),
    }),
    cypherLinter(config),
  ]);
}

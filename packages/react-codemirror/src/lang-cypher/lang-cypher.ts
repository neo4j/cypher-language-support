import {
  defineLanguageFacet,
  Language,
  LanguageSupport,
} from '@codemirror/language';
import type { DbSchema } from '@neo4j-cypher/language-support';
import { cypherAutocomplete } from './autocomplete';
import { ParserAdapter } from './ParserAdapter';
import { cypherLinter } from './syntax-validation';

const facet = defineLanguageFacet({
  commentTokens: { block: { open: '/*', close: '*/' }, line: '//' },
  closeBrackets: { brackets: ['(', '[', '{', "'", '"', '`'] },
});

const parserAdapter = new ParserAdapter(facet);

const cypherLanguage = new Language(facet, parserAdapter, [], 'cypher');

type CypherLanguageArgs = {
  lint: boolean;
  schema?: DbSchema;
};

export function cypher({ lint, schema = {} }: CypherLanguageArgs) {
  return new LanguageSupport(cypherLanguage, [
    cypherLanguage.data.of({
      autocomplete: cypherAutocomplete(schema),
    }),
    ...(lint ? [cypherLinter(schema)] : []),
  ]);
}
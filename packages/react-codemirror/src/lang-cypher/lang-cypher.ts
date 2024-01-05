import {
  defineLanguageFacet,
  Language,
  LanguageSupport,
} from '@codemirror/language';
import type { DbSchema } from '@neo4j-cypher/language-support';
import { cypherAutocomplete } from './autocomplete';
import { ParserAdapter } from './parser-adapter';
import { cypherLinter } from './syntax-validation';

const facet = defineLanguageFacet({
  commentTokens: { block: { open: '/*', close: '*/' }, line: '//' },
  closeBrackets: { brackets: ['(', '[', '{', "'", '"', '`'] },
});

export type CypherConfig = {
  lint?: boolean;
  schema?: DbSchema;
};

export function cypher(
  config: CypherConfig,
  onSlowParse?: (timeTaken: number) => void,
) {
  console.log('cypher', config);
  const parserAdapter = new ParserAdapter(facet, onSlowParse);

  const cypherLanguage = new Language(facet, parserAdapter, [], 'cypher');

  return new LanguageSupport(cypherLanguage, [
    cypherLanguage.data.of({
      autocomplete: cypherAutocomplete(config),
    }),
    cypherLinter(config),
  ]);
}

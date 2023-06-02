import {
  defineLanguageFacet,
  Language,
  LanguageSupport,
} from '@codemirror/language';
import { cypherAutocomplete } from './autocomplete';
import { ParserAdapter } from './ParserAdapter';

const facet = defineLanguageFacet({
  commentTokens: { block: { open: '/*', close: '*/' }, line: '//' },
  closeBrackets: { brackets: ['(', '[', '{', "'", '"', '`'] },
});

const parserAdapter = new ParserAdapter(facet);

export const cypherLanguage = new Language(facet, parserAdapter, [], 'cypher');

export function cypher() {
  return new LanguageSupport(
    cypherLanguage,
    cypherLanguage.data.of({ autocomplete: cypherAutocomplete }),
  );
}

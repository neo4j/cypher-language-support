import {
  defineLanguageFacet,
  Language,
  LanguageSupport,
} from '@codemirror/language';
import { ParserAdapter } from './ParserAdapter';

const parserAdapter = new ParserAdapter();
const facet = defineLanguageFacet({
  commentTokens: { block: { open: '/*', close: '*/' }, line: '//' },
});

const cypherLanguage = new Language(facet, parserAdapter, [], 'Cypher');

export const cypher = new LanguageSupport(cypherLanguage);

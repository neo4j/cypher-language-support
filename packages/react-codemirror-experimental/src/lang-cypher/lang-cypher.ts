import {
  defineLanguageFacet,
  Language,
  LanguageSupport,
} from '@codemirror/language';
import { DbSchema } from '../../../language-support/src/dbSchema';
import { cypherAutocomplete } from './autocomplete';
import { ParserAdapter } from './ParserAdapter';
import { cypherLinter } from './syntax-validation';

const facet = defineLanguageFacet({
  commentTokens: { block: { open: '/*', close: '*/' }, line: '//' },
  closeBrackets: { brackets: ['(', '[', '{', "'", '"', '`'] },
});

const parserAdapter = new ParserAdapter(facet);

const cypherLanguage = new Language(facet, parserAdapter, [], 'cypher');

export function cypher(withLinting: boolean, schema?: DbSchema) {
  return new LanguageSupport(
    cypherLanguage,
    [
      cypherLanguage.data.of({
        autocomplete: cypherAutocomplete(schema),
      }),
    ].concat(withLinting ? [cypherLinter(schema)] : []),
  );
}

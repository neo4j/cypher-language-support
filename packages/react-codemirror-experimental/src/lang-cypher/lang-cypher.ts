import {
  defineLanguageFacet,
  Language,
  LanguageSupport,
} from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { DbInfo } from '../../../language-support/src/dbInfo';
import { cypherAutocomplete, SchemaState, schemaState } from './autocomplete';
import { ParserAdapter } from './ParserAdapter';

const facet = defineLanguageFacet({
  commentTokens: { block: { open: '/*', close: '*/' }, line: '//' },
  closeBrackets: { brackets: ['(', '[', '{', "'", '"', '`'] },
});

const parserAdapter = new ParserAdapter(facet);

export const cypherLanguage = (extraExtensions: Extension[] = []) =>
  new Language(facet, parserAdapter, extraExtensions, 'cypher');

export function cypher(schema?: DbInfo) {
  const schemaStateExtension = schemaState.init(() => new SchemaState(schema));
  const langExtension = cypherLanguage([schemaStateExtension]);

  return new LanguageSupport(
    langExtension,
    langExtension.data.of({ autocomplete: cypherAutocomplete }),
  );
}

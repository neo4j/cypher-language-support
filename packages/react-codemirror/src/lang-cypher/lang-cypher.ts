import {
  defineLanguageFacet,
  Language,
  LanguageSupport,
} from '@codemirror/language';
import type { DbSchema } from '@neo4j-cypher/language-support';
import { cypherAutocomplete } from './autocomplete';
import { ParserAdapter } from './ParserAdapter';
import { signatureHelpTooltip } from './signature-help';
import { cypherLinter } from './syntax-validation';

const facet = defineLanguageFacet({
  commentTokens: { block: { open: '/*', close: '*/' }, line: '//' },
  closeBrackets: { brackets: ['(', '[', '{', "'", '"', '`'] },
});

const parserAdapter = new ParserAdapter(facet);

const cypherLanguage = new Language(facet, parserAdapter, [], 'cypher');

export type CypherConfig = {
  lint?: boolean;
  signatureHelp?: boolean;
  schema?: DbSchema;
};

export function cypher(config: CypherConfig) {
  return new LanguageSupport(cypherLanguage, [
    cypherLanguage.data.of({
      autocomplete: cypherAutocomplete(config),
    }),
    cypherLinter(config),
    signatureHelpTooltip(config),
  ]);
}

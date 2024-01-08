import {
  defineLanguageFacet,
  Language,
  LanguageSupport,
} from '@codemirror/language';
import type { DbSchema } from '@neo4j-cypher/language-support';
import { cypherAutocomplete } from './autocomplete';
import { PrismParserAdapter } from './prism-parser-adapter';
import { cypherLinter, semanticAnalysisLinter } from './syntax-validation';

const facet = defineLanguageFacet({
  commentTokens: { block: { open: '/*', close: '*/' }, line: '//' },
  closeBrackets: { brackets: ['(', '[', '{', "'", '"', '`'] },
});

export type CypherConfig = {
  lint?: boolean;
  schema?: DbSchema;
  useLightVersion: boolean;
};

export function cypher(
  config: CypherConfig,
  onSlowParse?: (timeTaken: number) => void,
) {
  onSlowParse;
  const parserAdapter = new PrismParserAdapter(facet);

  const cypherLanguage = new Language(facet, parserAdapter, [], 'cypher');

  return new LanguageSupport(cypherLanguage, [
    cypherLanguage.data.of({
      autocomplete: cypherAutocomplete(config),
    }),
    cypherLinter(config),
    semanticAnalysisLinter(config),
  ]);
}

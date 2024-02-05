import {
  defineLanguageFacet,
  Language,
  LanguageSupport,
} from '@codemirror/language';
import {
  toggleConsoleCommands,
  type DbSchema,
} from '@neo4j-cypher/language-support';
import { cypherAutocomplete } from './autocomplete';
import { ParserAdapter } from './parser-adapter';
import { signatureHelpTooltip } from './signature-help';
import { cypherLinter, semanticAnalysisLinter } from './syntax-validation';

const facet = defineLanguageFacet({
  commentTokens: { block: { open: '/*', close: '*/' }, line: '//' },
  closeBrackets: { brackets: ['(', '[', '{', "'", '"', '`'] },
});

export type CypherConfig = {
  lint?: boolean;
  schema?: DbSchema;
  useLightVersion: boolean;
  setUseLightVersion?: (useLightVersion: boolean) => void;
};

export function cypher(config: CypherConfig) {
  toggleConsoleCommands(true);
  const parserAdapter = new ParserAdapter(facet, config);

  const cypherLanguage = new Language(facet, parserAdapter, [], 'cypher');

  return new LanguageSupport(cypherLanguage, [
    cypherLanguage.data.of({
      autocomplete: cypherAutocomplete(config),
    }),
    cypherLinter(config),
    semanticAnalysisLinter(config),
    signatureHelpTooltip(config),
  ]);
}

import { autocompletion } from '@codemirror/autocomplete';
import {
  defineLanguageFacet,
  Language,
  LanguageSupport,
} from '@codemirror/language';
import { type DbSchema } from '@neo4j-cypher/language-support';
import { completionStyles, cypherAutocomplete } from './autocomplete';
import { ParserAdapter } from './parser-adapter';
import { signatureHelpTooltip } from './signatureHelp';
import { cypherLinter } from './syntaxValidation';

const facet = defineLanguageFacet({
  commentTokens: { block: { open: '/*', close: '*/' }, line: '//' },
  closeBrackets: { brackets: ['(', '[', '{', "'", '"', '`'] },
});

export type CypherConfig = {
  lint?: boolean;
  showSignatureTooltipBelow?: boolean;
  featureFlags?: {
    consoleCommands?: boolean;
  };
  schema?: DbSchema;
  useLightVersion: boolean;
  setUseLightVersion?: (useLightVersion: boolean) => void;
};

export function cypher(config: CypherConfig) {
  const parserAdapter = new ParserAdapter(facet, config);

  const cypherLanguage = new Language(facet, parserAdapter, [], 'cypher');

  return new LanguageSupport(cypherLanguage, [
    autocompletion({
      override: [cypherAutocomplete(config)],
      optionClass: completionStyles,
    }),
    cypherLinter(config),
    signatureHelpTooltip(config),
  ]);
}

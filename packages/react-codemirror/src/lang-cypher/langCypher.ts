import { autocompletion } from '@codemirror/autocomplete';
import {
  defineLanguageFacet,
  Language,
  LanguageSupport,
} from '@codemirror/language';
import {
  _internalFeatureFlags,
  type DbSchema,
} from '@neo4j-cypher/language-support';
import { completionStyles, cypherAutocomplete } from './autocomplete';
import { ParserAdapter } from './parser-adapter';
import { signatureHelpTooltip } from './signatureHelp';
import { cypherLinter, semanticAnalysisLinter } from './syntaxValidation';

const facet = defineLanguageFacet({
  commentTokens: { block: { open: '/*', close: '*/' }, line: '//' },
  closeBrackets: { brackets: ['(', '[', '{', "'", '"', '`'] },
});

export type CypherConfig = {
  lint?: boolean;
  featureFlags?: {
    signatureInfoOnAutoCompletions?: boolean;
    consoleCommands?: boolean;
  };
  schema?: DbSchema;
  useLightVersion: boolean;
  setUseLightVersion?: (useLightVersion: boolean) => void;
};

export function cypher(config: CypherConfig) {
  const featureFlags = config.featureFlags;
  // We allow to override the consoleCommands feature flag
  if (featureFlags.consoleCommands !== undefined) {
    _internalFeatureFlags.consoleCommands = featureFlags.consoleCommands;
  }

  const parserAdapter = new ParserAdapter(facet, config);

  const cypherLanguage = new Language(facet, parserAdapter, [], 'cypher');

  return new LanguageSupport(cypherLanguage, [
    autocompletion({
      override: [cypherAutocomplete(config)],
      optionClass: completionStyles,
    }),
    cypherLinter(config),
    semanticAnalysisLinter(config),
    signatureHelpTooltip(config),
  ]);
}

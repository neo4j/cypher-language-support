import { snippetCompletion } from '@codemirror/autocomplete';
import {
  defineLanguageFacet,
  Language,
  LanguageSupport,
} from '@codemirror/language';
import {
  setConsoleCommandsEnabled,
  type DbSchema,
} from '@neo4j-cypher/language-support';
import { cypherAutocomplete } from './autocomplete';
import { ParserAdapter } from './parser-adapter';
import { signatureHelpTooltip } from './signatureHelp';
import { cypherLinter, semanticAnalysisLinter } from './syntaxValidation';

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
  setConsoleCommandsEnabled(true);
  const parserAdapter = new ParserAdapter(facet, config);

  const cypherLanguage = new Language(facet, parserAdapter, [], 'cypher');

  return new LanguageSupport(cypherLanguage, [
    cypherLanguage.data.of({
      autocomplete: [
        cypherAutocomplete(config),
        snippetCompletion('mySnippet(${one}, ${two})', { label: 'mySnippet' }),
      ],
    }),
    cypherLinter(config),
    semanticAnalysisLinter(config),
    signatureHelpTooltip(config),
  ]);
}

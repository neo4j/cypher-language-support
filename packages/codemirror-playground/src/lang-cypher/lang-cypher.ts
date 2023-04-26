import {
  defineLanguageFacet,
  Language,
  LanguageSupport,
} from '@codemirror/language';
import { ParserAdapter } from './ParserAdapter';

function myCompletions(context: CompletionContext) {
  const word = context.matchBefore(/\w*/);
  if (word.from == word.to && !context.explicit) return null;
  return {
    from: word.from,
    options: [
      { label: 'match', type: 'keyword' },
      { label: 'hello', type: 'variable', info: '(World)' },
      { label: 'magic', type: 'text', apply: '⠁⭒*.✩.*⭒⠁', detail: 'macro' },
    ],
  };
}

const facet = defineLanguageFacet({
  commentTokens: { block: { open: '/*', close: '*/' }, line: '//' },
  closeBrackets: { brackets: ['(', '[', '{', "'", '"', '`'] },
});

const parserAdapter = new ParserAdapter(facet);

export const cypherLanguage = new Language(facet, parserAdapter, [], 'cypher');

import { CompletionContext } from '@codemirror/autocomplete';

export function cypher() {
  return new LanguageSupport(
    cypherLanguage,
    cypherLanguage.data.of({ autocomplete: myCompletions }),
  );
}

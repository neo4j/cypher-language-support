import { CompletionContext, CompletionSource } from '@codemirror/autocomplete';
import {
  defineLanguageFacet,
  Language,
  LanguageSupport,
} from '@codemirror/language';
import { autocomplete } from 'language-support';
import { CompletionItemKind } from 'vscode-languageserver-types';
import { ParserAdapter } from './ParserAdapter';

const completionKindToCodemirrorType = (c: CompletionItemKind) => {
  const map: Partial<Record<CompletionItemKind, string>> = {
    [CompletionItemKind.Keyword]: 'keyword',
  };

  return map[c];
};

const myCompletions: CompletionSource = (context: CompletionContext) => {
  const options = autocomplete(
    context.state.doc.toString(),
    { line: 0, character: context.pos },
    {
      functionSignatures: new Map(),
      procedureSignatures: new Map(),
      relationshipTypes: [],
      labels: [],
    },
  );

  return {
    from: context.matchBefore(/\w*$/).from,
    options: options.map((o) => ({
      label: o.label,
      type: completionKindToCodemirrorType(o.kind),
    })),
  };
};

const facet = defineLanguageFacet({
  commentTokens: { block: { open: '/*', close: '*/' }, line: '//' },
  closeBrackets: { brackets: ['(', '[', '{', "'", '"', '`'] },
});

const parserAdapter = new ParserAdapter(facet);

export const cypherLanguage = new Language(facet, parserAdapter, [], 'cypher');

export function cypher() {
  return new LanguageSupport(
    cypherLanguage,
    cypherLanguage.data.of({ autocomplete: myCompletions }),
  );
}

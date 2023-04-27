import { CompletionSource } from '@codemirror/autocomplete';
import {
  defineLanguageFacet,
  Language,
  LanguageSupport,
} from '@codemirror/language';
import { autocomplete } from 'language-support';
import { CompletionItemKind } from 'vscode-languageserver-types';
import { ParserAdapter } from './ParserAdapter';

// From codemirror docs, the base built in icons in autocomplete list are:
type CodemirrorBuiltinIcons =
  | `class`
  | `constant`
  | `enum`
  | `function`
  | `interface`
  | `keyword`
  | `method`
  | `namespace`
  | `property`
  | `text`
  | `type`
  | `variable`;

const completionKindToCodemirrorIcon = (c: CompletionItemKind) => {
  const map: Partial<Record<CompletionItemKind, CodemirrorBuiltinIcons>> = {
    [CompletionItemKind.Constant]: 'constant',
    [CompletionItemKind.Function]: 'function',
    [CompletionItemKind.Keyword]: 'keyword',
    [CompletionItemKind.Method]: 'method',
    [CompletionItemKind.Property]: 'property',
    [CompletionItemKind.Text]: 'text',
    [CompletionItemKind.TypeParameter]: 'type',
    [CompletionItemKind.Variable]: 'variable',
  };

  return map[c] ?? 'text';
};

const myCompletions: CompletionSource = (context) => {
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
      type: completionKindToCodemirrorIcon(o.kind),
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

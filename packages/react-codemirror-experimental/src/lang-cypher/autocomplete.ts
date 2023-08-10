import { CompletionSource } from '@codemirror/autocomplete';
import { autocomplete } from 'language-support';
import { CompletionItemKind } from 'vscode-languageserver-types';

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

// hmm space räcker för att fatta rätt regel
export const cypherAutocomplete: CompletionSource = (context) => {
  const textUntilCursor = context.state.doc.toString().slice(0, context.pos);
  const options = autocomplete(textUntilCursor, {
    functionSignatures: new Map([
      ['a.b', { label: '' }],
      ['xx.yy.proc', { label: '' }],
      ['xx.yy.procedure', { label: '' }],
      ['db.info', { label: '' }],
    ]),
    procedureSignatures: new Map(),
    relationshipTypes: ['Rel', 'KNOWS'],
    labels: ['Label', 'Person'],
    databaseNames: ['db1', 'db2', 'movese'],
  });

  return {
    from: context.matchBefore(/\w*$/).from,
    options: options.map((o) => ({
      label: o.label,
      type: completionKindToCodemirrorIcon(o.kind),
    })),
  };
};

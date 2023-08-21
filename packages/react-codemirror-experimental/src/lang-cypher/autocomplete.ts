import { CompletionSource } from '@codemirror/autocomplete';
import { autocomplete, DbInfo } from 'language-support';
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

const emptySchema: DbInfo = {
  functionSignatures: {},
  labels: [],
  procedureSignatures: {},
  relationshipTypes: [],
};
export const cypherAutocomplete: (schema?: DbInfo) => CompletionSource =
  (schema) => (context) => {
    const textUntilCursor = context.state.doc.toString().slice(0, context.pos);

    const triggerCharacters = ['.', ':', '[', '(', '{', '$', ' ', '\n'];
    const lastCharacter = textUntilCursor.slice(-1);

    const lastWord = context.matchBefore(/\w*/);
    const inWord = lastWord.from !== lastWord.to;

    const shouldTriggerCompletion =
      inWord || context.explicit || triggerCharacters.includes(lastCharacter);

    if (!shouldTriggerCompletion) {
      return null;
    }

    const options = autocomplete(textUntilCursor, schema ?? emptySchema);

    return {
      from: context.matchBefore(/\w*$/).from,
      options: options.map((o) => ({
        label: o.label,
        type: completionKindToCodemirrorIcon(o.kind),
      })),
    };
  };

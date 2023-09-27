import { CompletionSource } from '@codemirror/autocomplete';
import { autocomplete, DbSchema } from 'language-support';
import { CompletionItemKind } from 'vscode-languageserver-types';
import { CompletionItemIcons } from '../icons';

const completionKindToCodemirrorIcon = (c: CompletionItemKind) => {
  const map: Record<CompletionItemKind, CompletionItemIcons> = {
    [CompletionItemKind.Text]: 'Text',
    [CompletionItemKind.Method]: 'Method',
    [CompletionItemKind.Function]: 'Function',
    [CompletionItemKind.Constructor]: 'Constructor',
    [CompletionItemKind.Field]: 'Field',
    [CompletionItemKind.Variable]: 'Variable',
    [CompletionItemKind.Class]: 'Class',
    [CompletionItemKind.Interface]: 'Interface',
    [CompletionItemKind.Module]: 'Module',
    [CompletionItemKind.Property]: 'Property',
    [CompletionItemKind.Unit]: 'Unit',
    [CompletionItemKind.Value]: 'Value',
    [CompletionItemKind.Enum]: 'Enum',
    [CompletionItemKind.Keyword]: 'Keyword',
    [CompletionItemKind.Snippet]: 'Snippet',
    [CompletionItemKind.Color]: 'Color',
    [CompletionItemKind.File]: 'File',
    [CompletionItemKind.Reference]: 'Reference',
    [CompletionItemKind.Folder]: 'Folder',
    [CompletionItemKind.EnumMember]: 'EnumMember',
    [CompletionItemKind.Constant]: 'Constant',
    [CompletionItemKind.Struct]: 'Struct',
    [CompletionItemKind.Event]: 'Event',
    [CompletionItemKind.Operator]: 'Operator',
    [CompletionItemKind.TypeParameter]: 'TypeParameter',
  };

  return map[c];
};

const emptySchema: DbSchema = {};
export const cypherAutocomplete: (schema?: DbSchema) => CompletionSource =
  (schema) => (context) => {
    const textUntilCursor = context.state.doc.toString().slice(0, context.pos);

    const triggerCharacters = ['.', ':', '{', '$'];
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
      from: context.matchBefore(/(\w|\$)*$/).from,
      options: options.map((o) => ({
        label: o.label,
        type: completionKindToCodemirrorIcon(o.kind),
      })),
    };
  };

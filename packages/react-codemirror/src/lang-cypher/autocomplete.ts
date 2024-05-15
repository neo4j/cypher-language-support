import { CompletionSource, snippet } from '@codemirror/autocomplete';
import { autocomplete } from '@neo4j-cypher/language-support';
import { CompletionItemKind } from 'vscode-languageserver-types';
import { CompletionItemIcons } from '../icons';
import type { CypherConfig } from './langCypher';
import { getDocString } from './utils';

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
    // we're miss-using the enum here as there is no `Console` kind in the predefined list
    [CompletionItemKind.Event]: 'Console',
    [CompletionItemKind.Operator]: 'Operator',
    [CompletionItemKind.TypeParameter]: 'TypeParameter',
  };

  return map[c];
};

export const cypherAutocomplete: (config: CypherConfig) => CompletionSource =
  (config) => (context) => {
    const textUntilCursor = context.state.doc.toString().slice(0, context.pos);

    const triggerCharacters = ['.', ':', '{', '$', ')'];
    const lastCharacter = textUntilCursor.slice(-1);

    const lastWord = context.matchBefore(/\w*/);
    const inWord = lastWord.from !== lastWord.to;

    const shouldTriggerCompletion =
      inWord || context.explicit || triggerCharacters.includes(lastCharacter);

    if (config.useLightVersion && !context.explicit) {
      return null;
    }

    if (!shouldTriggerCompletion) {
      return null;
    }

    const options = autocomplete(
      textUntilCursor,
      config.schema ?? {},
      undefined,
      context.explicit,
    );

    return {
      from: context.matchBefore(/(\w|\$)*$/).from,
      options: options.map((o) => {
        const maybeInfo = o.documentation
          ? { info: getDocString(o.documentation) }
          : {};
        return {
          label: o.label,
          type: completionKindToCodemirrorIcon(o.kind),
          apply:
            o.kind === CompletionItemKind.Snippet
              ? // codemirror requires an empty snippet space to be able to tab out of the completion
                snippet((o.insertText ?? o.label) + '${}')
              : undefined,
          detail: o.detail,
          ...maybeInfo,
        };
      }),
    };
  };

import {
  Completion,
  CompletionSource,
  snippet,
} from '@codemirror/autocomplete';
import { autocomplete } from '@neo4j-cypher/language-support';
import {
  CompletionItemKind,
  CompletionItemTag,
} from 'vscode-languageserver-types';
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

export const completionStyles: (
  completion: Completion & { deprecated?: boolean },
) => string = (completion) => {
  if (completion.deprecated) {
    return 'cm-deprecated-element';
  } else {
    return null;
  }
};

export const cypherAutocomplete: (config: CypherConfig) => CompletionSource =
  (config) => (context) => {
    const documentText = context.state.doc.toString();
    const offset = context.pos;
    const triggerCharacters = ['.', ':', '{', '$', ')'];
    const lastCharacter = documentText.at(offset - 1);
    const yieldTriggered = false; //shouldAutoCompleteYield(documentText, offset);
    const lastWord = context.matchBefore(/\w*/);
    const inWord = lastWord.from !== lastWord.to;

    const shouldTriggerCompletion =
      inWord ||
      context.explicit ||
      triggerCharacters.includes(lastCharacter) ||
      yieldTriggered;

    if (config.useLightVersion && !context.explicit) {
      return null;
    }

    if (!shouldTriggerCompletion) {
      return null;
    }

    const options = autocomplete(
      // TODO This is a temporary hack because completions are not working well
      documentText.slice(0, offset),
      config.schema ?? {},
      offset,
      context.explicit,
    );

    return {
      from: context.matchBefore(/(\w|\$)*$/).from,
      options: options.map((o) => {
        let maybeInfo = {};
        let emptyInfo = true;
        const newDiv = document.createElement('div');

        if (o.signature) {
          const header = document.createElement('p');
          header.setAttribute('class', 'cm-completionInfo-signature');
          header.textContent = o.signature;
          if (header.textContent.length > 0) {
            emptyInfo = false;
            newDiv.appendChild(header);
          }
        }

        if (o.documentation) {
          const paragraph = document.createElement('p');
          paragraph.textContent = getDocString(o.documentation);
          if (paragraph.textContent.length > 0) {
            emptyInfo = false;
            newDiv.appendChild(paragraph);
          }
        }

        if (!emptyInfo) {
          maybeInfo = {
            info: () => Promise.resolve(newDiv),
          };
        }
        const deprecated =
          o.tags?.find((tag) => tag === CompletionItemTag.Deprecated) ?? false;
        // The negative boost moves the deprecation down the list
        // so we offer the user the completions that are
        // deprecated the last
        const maybeDeprecated = deprecated
          ? { boost: -99, deprecated: true }
          : {};

        return {
          label: o.insertText ? o.insertText : o.label,
          displayLabel: o.label,
          type: completionKindToCodemirrorIcon(o.kind),
          apply:
            o.kind === CompletionItemKind.Snippet
              ? // codemirror requires an empty snippet space to be able to tab out of the completion
                snippet((o.insertText ?? o.label) + '${}')
              : undefined,
          detail: o.detail,
          ...maybeDeprecated,
          ...maybeInfo,
        };
      }),
    };
  };

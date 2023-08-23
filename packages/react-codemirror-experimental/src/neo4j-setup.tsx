import {
  acceptCompletion,
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete';
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands';
import {
  bracketMatching,
  defaultHighlightStyle,
  foldKeymap,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { EditorState, Extension } from '@codemirror/state';
import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from '@codemirror/view';

import { lintKeymap } from '@codemirror/lint';

export const basicNeo4jSetup = (prompt?: string): Extension[] => {
  const keymaps = [
    closeBracketsKeymap,
    defaultKeymap,
    searchKeymap,
    historyKeymap,
    foldKeymap,
    completionKeymap,
    lintKeymap,
    {
      key: 'Tab',
      preventDefault: true,
      run: acceptCompletion,
    },
    indentWithTab,
  ].flat();

  const extensions: Extension[] = [];

  extensions.push(
    lineNumbers({
      formatNumber(a, state) {
        if (state.doc.lines === 1 && prompt !== undefined) {
          return prompt;
        }

        return a.toString();
      },
    }),
  );

  extensions.push(highlightSpecialChars());
  extensions.push(history());

  extensions.push(drawSelection());
  extensions.push(dropCursor());
  extensions.push(EditorState.allowMultipleSelections.of(true));
  extensions.push(indentOnInput());
  extensions.push(
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  );

  extensions.push(bracketMatching());
  extensions.push(closeBrackets());
  extensions.push(autocompletion());

  extensions.push(rectangularSelection());
  extensions.push(crosshairCursor());
  extensions.push(highlightSelectionMatches());

  extensions.push(keymap.of(keymaps));

  return extensions;
};

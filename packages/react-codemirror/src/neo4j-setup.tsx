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
  indentLess,
  indentMore,
} from '@codemirror/commands';
import {
  bracketMatching,
  defaultHighlightStyle,
  foldKeymap,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { EditorState, Extension, StateCommand } from '@codemirror/state';
import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  EditorView,
  highlightSpecialChars,
  keymap,
  rectangularSelection,
} from '@codemirror/view';

import { lintKeymap } from '@codemirror/lint';
import { getIconForType } from './icons';

const insertTab: StateCommand = (cmd) => {
  // if there is a selection we should indent the selected text, but if not insert
  // two spaces as per the cypher style guide
  if (cmd.state.selection.main.from === cmd.state.selection.main.to) {
    cmd.dispatch(
      cmd.state.update({
        changes: {
          from: cmd.state.selection.main.to,
          to: cmd.state.selection.main.to,
          insert: '  ',
        },
        selection: { anchor: cmd.state.selection.main.to + 2 },
      }),
    );
  } else {
    indentMore(cmd);
  }
  return true;
};

export const basicNeo4jSetup = (): Extension[] => {
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
    {
      key: 'Tab',
      preventDefault: true,
      run: insertTab,
    },
    {
      key: 'Shift-Tab',
      preventDefault: true,
      run: indentLess,
    },
  ].flat();

  const extensions: Extension[] = [];

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
  extensions.push(
    autocompletion({
      icons: false,
      interactionDelay: 5,
      addToOptions: [
        {
          render(completion, state) {
            const isDarkTheme = state.facet(EditorView.darkTheme);
            const icon = document.createElement('span');

            icon.innerHTML = getIconForType(completion.type, isDarkTheme);

            const svgElement = icon.children[0] as SVGElement;

            svgElement.style.display = 'inline';
            svgElement.style.marginRight = '5px';
            return icon;
          },
          position: 20,
        },
      ],
    }),
  );

  extensions.push(rectangularSelection());
  extensions.push(crosshairCursor());
  extensions.push(highlightSelectionMatches());

  extensions.push(keymap.of(keymaps));

  return extensions;
};

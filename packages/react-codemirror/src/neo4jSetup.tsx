import {
  acceptCompletion,
  autocompletion,
  clearSnippet,
  closeBrackets,
  closeBracketsKeymap,
  closeCompletion,
  completionKeymap,
  nextSnippetField,
  prevSnippetField,
  snippetKeymap,
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
import type { Extension, StateCommand } from '@codemirror/state';
import { EditorState } from '@codemirror/state';
import type { Command, KeyBinding } from '@codemirror/view';
import {
  drawSelection,
  dropCursor,
  EditorView,
  highlightSpecialChars,
  keymap,
  rectangularSelection,
  ViewPlugin,
} from '@codemirror/view';

import { lintKeymap } from '@codemirror/lint';
import { getIconForType } from './icons';

// CodeMirror's crosshairCursor only supports a single modifier key, so this
// mirrors it for our Shift-Alt box selection to keep the feature discoverable
const crosshairPlugin = ViewPlugin.fromClass(
  class {
    bothKeysDown = false;

    constructor(readonly view: EditorView) {}

    set(e: KeyboardEvent | MouseEvent) {
      const bothKeysDown = e.altKey && e.shiftKey;
      if (this.bothKeysDown !== bothKeysDown) {
        this.bothKeysDown = bothKeysDown;
        this.view.update([]);
      }
    }
  },
  {
    eventObservers: {
      keydown(e) {
        this.set(e);
      },
      keyup(e) {
        this.set(e);
      },
      //Allows us to also show crosshair over editor when editor not in focus
      mousemove(e) {
        this.set(e);
      },
    },
  },
);

const boxSelectionCrosshair: Extension = [
  crosshairPlugin,
  EditorView.contentAttributes.of((view) =>
    view.plugin(crosshairPlugin)?.bothKeysDown
      ? { style: 'cursor: crosshair' }
      : null,
  ),
];

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

type SetupProps = {
  moveFocusOnTab?: boolean;
};

export const basicNeo4jSetup = ({
  moveFocusOnTab = false,
}: SetupProps): Extension[] => {
  const keymaps: KeyBinding[] = [
    closeBracketsKeymap,
    defaultKeymap,
    searchKeymap,
    historyKeymap,
    foldKeymap,
    completionKeymap,
    lintKeymap,
  ].flat();

  if (!moveFocusOnTab) {
    keymaps.push(
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
    );
  }

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

  // VS Code style modifiers: Mod-click is reserved for go to definition,
  // so Alt-click adds a cursor and Shift-Alt-drag does box selection
  extensions.push(
    EditorView.clickAddsSelectionRange.of((e) => e.altKey && !e.shiftKey),
  );
  extensions.push(
    rectangularSelection({
      eventFilter: (e) => e.altKey && e.shiftKey && e.button === 0,
    }),
  );
  extensions.push(boxSelectionCrosshair);
  extensions.push(highlightSelectionMatches());

  extensions.push(keymap.of(keymaps));

  extensions.push(
    snippetKeymap.of([
      {
        key: 'Tab',
        run: acceptCompletionOrGotoNextSnippet,
        shift: acceptCompletionOrGotoPrevSnippet,
      },
      { key: 'Escape', run: closeCompletionsOrClearSnippets },
    ]),
  );

  return extensions;
};

// The logic to check if there's a completion open is surprisingly complex
// https://github.com/codemirror/autocomplete/blob/5ad2ebc861f2f61cdc943fc087a5bfb756a7d0fa/src/view.ts#L31
// For example it respects an interaction delay, so we can't just check if the completion is open
// instead we just run the acceptCompletion command which returns true if a completion was accepted
// in that case we know that we shouldn't move to the next snippet field
const acceptCompletionOrGotoNextSnippet: Command = (view: EditorView) => {
  const didCompletion = acceptCompletion(view);
  if (didCompletion) {
    return true;
  }

  return nextSnippetField(view);
};

const acceptCompletionOrGotoPrevSnippet: Command = (view: EditorView) => {
  const didCompletion = acceptCompletion(view);
  if (didCompletion) {
    return true;
  }

  return prevSnippetField(view);
};

const closeCompletionsOrClearSnippets: Command = (view: EditorView) => {
  const closedCompletions = closeCompletion(view);
  if (closedCompletions) {
    return true;
  }

  return clearSnippet(view);
};

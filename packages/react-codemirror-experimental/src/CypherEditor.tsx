import { Extension, StateEffect } from '@codemirror/state';
import { EditorView, KeyBinding, keymap } from '@codemirror/view';
import CodeEditor, {
  ReactCodeMirrorProps,
  ReactCodeMirrorRef,
} from '@uiw/react-codemirror';
import React from 'react';
import { cypher } from './lang-cypher/lang-cypher';
import { basicNeo4jSetup } from './neo4j-setup';
import { ayuLightTheme } from './themes';

import { StateField } from '@codemirror/state';

type HistoryNavigation = 'BACK' | 'FORWARDS';

// TODO make move in history undoaable
// Todo kolla det issuet grabben hade med sin undostack

// history version for quick compare

const moveInHistory = StateEffect.define<HistoryNavigation>();
const pushToHistory = StateEffect.define<string>();
const DRAFT_ENTRY_INDEX = -1;
const historyInitialState = {
  history: [],
  index: DRAFT_ENTRY_INDEX,
  documentUpdate: null,
  draft: '',
};
const historyState = StateField.define<History>({
  create() {
    return historyInitialState;
  },
  toJSON(value) {
    return JSON.stringify(value);
  },
  update(value, transaction) {
    for (const effect of transaction.effects) {
      if (effect.is(moveInHistory)) {
        console.log(value);
        if (value.history.length === 0) {
          return {
            ...value,
            documentUpdate: null,
          };
        }

        const currentHistoryIndex = value.index;
        if (effect.value === 'BACK') {
          debugger;
          const newHistoryIndex = currentHistoryIndex + 1;

          if (newHistoryIndex === value.history.length) {
            return {
              ...value,
              documentUpdate: null,
            };
          }

          let draft = value.draft;
          if (currentHistoryIndex === DRAFT_ENTRY_INDEX) {
            draft = transaction.state.doc.toString();
          }

          return {
            ...value,
            draft,
            index: newHistoryIndex,
            documentUpdate: value.history[newHistoryIndex],
          };
        } else if (effect.value === 'FORWARDS') {
          const newHistoryIndex = currentHistoryIndex - 1;

          if (currentHistoryIndex === DRAFT_ENTRY_INDEX) {
            return { ...value, documentUpdate: null };
          }

          if (newHistoryIndex === DRAFT_ENTRY_INDEX) {
            return {
              ...value,
              index: newHistoryIndex,
              documentUpdate: value.draft,
            };
          } else {
            return {
              ...value,
              index: newHistoryIndex,
              documentUpdate: value.history[newHistoryIndex],
            };
          }
        }
      } else if (effect.is(pushToHistory)) {
        return {
          ...value,
          history: [effect.value, ...value.history],
        };
      }
    }
    return value;
  },

  // TODO starting history
});

type History = {
  history: string[];
  index: number;
  draft: string;
  documentUpdate: string | null;
};

function navigateHistory(view: EditorView, direction: HistoryNavigation) {
  view.dispatch(
    view.state.update({
      effects: moveInHistory.of(direction),
    }),
  );

  const updatedHistory = view.state.field<History>(historyState, false);
  if (updatedHistory.documentUpdate !== null) {
    view.dispatch(
      view.state.update({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: updatedHistory.documentUpdate,
        },
      }),
    );
  }
}
export const replBindings = ({
  onExecute,
  onNewHistoryEntry: newHistoryEntry,
}: ReplProps = {}): Extension[] => {
  return [
    keymap.of([
      {
        key: 'Enter',
        preventDefault: true,
        run: (view) => {
          const doc = view.state.doc.toString();
          if (doc.trim() !== '') {
            onExecute?.(doc);
            newHistoryEntry?.(doc);
            view.dispatch({
              effects: pushToHistory.of(doc),
              changes: { from: 0, to: view.state.doc.length, insert: '' },
            });
          }

          return true;
        },
      },
      {
        key: 'ArrowUp',
        preventDefault: true,
        run: (view) => {
          // If text is selected or cursor is not at top of document, do nothing
          const { empty, head } = view.state.selection.main;
          if (!empty || head !== 0) {
            return false;
          }

          navigateHistory(view, 'BACK');
          return true;
        },
      },
      {
        key: 'ArrowDown',
        preventDefault: true,
        run: (view) => {
          const { empty, head } = view.state.selection.main;
          // If text is selected or cursor is not at end of document, do nothing
          if (!empty || head !== view.state.doc.length) {
            return false;
          }
          navigateHistory(view, 'FORWARDS');

          return true;
        },
      },
    ]),
  ];
};
// todo custom comparitor for history?

/*
EditorState. .of((viewupdate) => {
  let width = viewupdate.view.defaultCharacterWidth
  let current_width = viewupdate.view.state.field(extra_cycle_character_width, false)

  if (current_width !== width) {
      console.log(`current_width:`, current_width)
      console.log(`width:`, width)
      current_width = width
      viewupdate.view.dispatch({
          effects: [CharacterWidthEffect.of(current_width)],
      })
  }
})

*/

/* 

// some way to do get and store history
// some way to navigate history

multiline comments
  extra keybindings
  useDb
  kan man ge den focus
  slå på och av word-wrap
  tab fungerar lite märkligt

  hantera att kunna gå till storskärm
  senare vim keybindings settings
  // TODO skicka med schema
  // TOOD switch to jest
  // TODO make the dmeo backed by real data.

  // simple snippets
  // Hover information => links to docs

  // infer schema client side - neo4j-sdk
  // e2e tests

  autocompelten funkar bara om i the vvery end
  /**
   * custom keybindings på något sätt 
*/

function getThemeExtension(
  theme: 'light' | 'dark' | 'none' | Extension,
): Extension | Extension[] {
  switch (theme) {
    case 'light':
      return ayuLightTheme();
    case 'dark':
      // TODO implement dark theme
      return ayuLightTheme();
    case 'none':
      return [];
    default:
      return theme;
  }
}

type ReplProps = {
  onExecute?: (cmd: string) => void;
  initialHistory?: string[];
  onNewHistoryEntry?: (historyEntry: string) => void;
};

type CypherEditorOwnProps = {
  prompt?: string;
  extraKeybindings?: KeyBinding[];
} & ReplProps;

type CypherEditor = React.ForwardRefExoticComponent<
  CypherEditorOwnProps &
    ReactCodeMirrorProps &
    React.RefAttributes<ReactCodeMirrorRef>
>;
export const CypherEditor: CypherEditor = React.forwardRef((props, ref) => {
  const {
    theme = 'light',
    extensions = [],
    prompt,
    onExecute,
    initialHistory = ['abc'],
    onNewHistoryEntry,
    extraKeybindings = [],
    ...rest
  } = props;

  const replExtension = onExecute
    ? replBindings({
        onExecute,
        initialHistory,
        onNewHistoryEntry,
      })
    : [];

  return (
    <CodeEditor
      ref={ref}
      theme={getThemeExtension(theme)}
      extensions={[
        cypher(),
        historyState.init(() => ({
          ...historyInitialState,
          history: initialHistory,
        })),
        keymap.of(extraKeybindings),
        replExtension,
        basicNeo4jSetup(prompt),
        ...extensions,
      ]}
      basicSetup={false}
      {...rest}
    />
  );
});

import { Extension, StateEffect } from '@codemirror/state';
import { KeyBinding, keymap } from '@codemirror/view';
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

const moveInHistory = StateEffect.define<HistoryNavigation>();
const pushToHistory = StateEffect.define<string>();
const historyState = StateField.define<History>({
  create() {
    return { history: [''], index: 0 };
  },
  toJSON(value) {
    return JSON.stringify(value);
  },
  update(value, transaction) {
    const DRAFT_ENTRY_INDEX = 0;
    for (const effect of transaction.effects) {
      if (effect.is(moveInHistory)) {
        const { history, index: currentHistoryIndex } = value;

        if (history.length === 1) {
          return value;
        }

        if (effect.value === 'BACK') {
          const newHistoryIndex = currentHistoryIndex + 1;

          if (newHistoryIndex === history.length) {
            return value;
          }

          const newHistory = history.slice();
          if (currentHistoryIndex === DRAFT_ENTRY_INDEX) {
            newHistory[0] = transaction.state.doc.toString();
          }

          return {
            history: newHistory,
            index: newHistoryIndex,
          };
        } else if (effect.value === 'FORWARDS') {
          const newHistoryIndex = currentHistoryIndex - 1;

          if (currentHistoryIndex === DRAFT_ENTRY_INDEX) {
            return value;
          }

          return { ...value, index: newHistoryIndex };
        }
      } else if (effect.is(pushToHistory)) {
        return {
          ...value,
          // draft entry is always first, but history is filled from pos 1
          history: [value.history[0], effect.value, ...value.history.slice(1)],
        };
      }
    }
    return value;
  },

  // command fired -> update history
  // up arrow fired -> update index
  // down arrow fired -> update index
  // TODO starting history
});

type History = { history: string[]; index: number };

export const replBindings = ({
  onExecute,
  newHistoryEntry,
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
          // TODO If cursor is att top of document, move in history

          const transaction = view.state.update({
            effects: moveInHistory.of('BACK'),
          });

          console.log(transaction.state);
          view.dispatch(transaction);

          const updatedHistory = view.state.field<History>(historyState, false);

          view.dispatch(
            view.state.update({
              changes: {
                from: 0,
                to: view.state.doc.length,
                insert: updatedHistory.history[updatedHistory.index],
              },
            }),
          );
          return true;
        },
      },
      {
        key: 'ArrowDown',
        preventDefault: true,
        run: (view) => {
          // TODO If cursor is att bottom of document, move in history

          view.dispatch({ effects: moveInHistory.of('FORWARDS') });
          const updatedHistory = view.state.field<History>(historyState, false);

          // update document to match history entry
          // TODO gör bara om något ännrdades

          view.dispatch(
            view.state.update({
              changes: {
                from: 0,
                to: view.state.doc.length,
                insert: updatedHistory.history[updatedHistory.index],
              },
            }),
          );

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
  newHistoryEntry?: (historyEntry: string) => void;
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
    initialHistory = [],
    newHistoryEntry,
    extraKeybindings = [],
    ...rest
  } = props;

  const replExtension = onExecute
    ? replBindings({
        onExecute,
        initialHistory,
        newHistoryEntry,
      })
    : [];

  return (
    <CodeEditor
      ref={ref}
      theme={getThemeExtension(theme)}
      extensions={[
        cypher(),
        historyState,
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

import { Extension, StateEffect } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';

import { StateField } from '@codemirror/state';

type HistoryState = {
  history: string[];
  index: number;
  draft: string;
  documentUpdate: string | null;
};
const DRAFT_ENTRY_INDEX = -1;
const historyInitialState = {
  history: [],
  index: DRAFT_ENTRY_INDEX,
  documentUpdate: null,
  draft: '',
};

const historyState = StateField.define<HistoryState>({
  create() {
    return historyInitialState;
  },
  toJSON(value) {
    return JSON.stringify(value);
  },
  update(value, transaction) {
    for (const effect of transaction.effects) {
      if (effect.is(moveInHistory)) {
        if (value.history.length === 0) {
          return {
            ...value,
            documentUpdate: null,
          };
        }

        const currentHistoryIndex = value.index;
        if (effect.value === 'BACK') {
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
      } else if (effect.is(replaceHistory)) {
        return {
          ...value,
          index: DRAFT_ENTRY_INDEX,
          history: effect.value,
        };
      }
    }
    return value;
  },
});

type HistoryNavigation = 'BACK' | 'FORWARDS';
const moveInHistory = StateEffect.define<HistoryNavigation>();
export const replaceHistory = StateEffect.define<string[]>();

function navigateHistory(view: EditorView, direction: HistoryNavigation) {
  view.dispatch(
    view.state.update({
      effects: moveInHistory.of(direction),
      selection: { anchor: direction === 'BACK' ? 0 : view.state.doc.length },
    }),
  );

  const updatedHistory = view.state.field<HistoryState>(historyState, false);
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

type ReplProps = {
  history?: string[];
};

export const replMode = ({ history }: ReplProps): Extension[] => {
  return [
    historyState.init(() => ({
      ...historyInitialState,
      history,
    })),
    keymap.of([
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
        mac: 'Cmd-ArrowUp',
        win: 'Ctrl-ArrowUp',
        linux: 'Ctrl-ArrowUp',
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
      {
        mac: 'Cmd-ArrowDown',
        win: 'Ctrl-ArrowDown',
        linux: 'Ctrl-ArrowDown',
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

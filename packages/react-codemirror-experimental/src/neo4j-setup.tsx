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
import {
  highlightSelectionMatches,
  search,
  searchKeymap,
} from '@codemirror/search';
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

/*
Can be used to override the way the search panel is implemented.
Should create a [Panel](https://codemirror.net/6/docs/ref/#view.Panel) that contains a form
which lets the user:

- See the [current](https://codemirror.net/6/docs/ref/#search.getSearchQuery) search query.
- Manipulate the [query](https://codemirror.net/6/docs/ref/#search.SearchQuery) and
  [update](https://codemirror.net/6/docs/ref/#search.setSearchQuery) the search state with a new
  query.
- Notice external changes to the query by reacting to the
  appropriate [state effect](https://codemirror.net/6/docs/ref/#search.setSearchQuery).
- Run some of the search commands.

The field that should be focused when opening the panel must be
tagged with a `main-field=true` DOM attribute.
*/

const createNeo4jSearchPanel = () => {
  const div = document.createElement('div');
  div.innerText = 'Custom search panel yet to be implemented';

  const neo4jPanel = { dom: div, update: () => undefined };
  return neo4jPanel;
};

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
  extensions.push(search({ createPanel: createNeo4jSearchPanel }));
  extensions.push(autocompletion());

  extensions.push(rectangularSelection());
  extensions.push(crosshairCursor());
  extensions.push(highlightSelectionMatches());

  extensions.push(keymap.of(keymaps));

  return extensions;
};

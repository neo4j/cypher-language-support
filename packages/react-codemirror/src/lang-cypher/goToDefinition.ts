import { EditorSelection, type Extension } from '@codemirror/state';
import {
  closeHoverTooltips,
  type Command,
  EditorView,
  keymap,
} from '@codemirror/view';
import type { CypherConfig } from './langCypher';

const isMac =
  typeof navigator !== 'undefined' && /Mac/.test(navigator.platform);

function goToDefinitionAt(
  view: EditorView,
  pos: number,
  config: CypherConfig,
): boolean {
  const definition = config.languageService.goToDefinition(
    view.state.doc.toString(),
    pos,
  );
  if (!definition) {
    return false;
  }
  view.dispatch({
    selection: EditorSelection.cursor(definition.startOffset),
    scrollIntoView: true,
    effects: closeHoverTooltips,
  });
  return true;
}

export const goToDefinitionCommand =
  (config: CypherConfig): Command =>
  (view) =>
    goToDefinitionAt(view, view.state.selection.main.head, config);

export function cypherGoToDefinition(config: CypherConfig): Extension {
  return [
    keymap.of([
      { key: 'F12', run: goToDefinitionCommand(config), preventDefault: true },
    ]),
    EditorView.domEventHandlers({
      mousedown(event, view) {
        const modKey = isMac ? event.metaKey : event.ctrlKey;
        if (event.button !== 0 || !modKey || event.altKey || event.shiftKey) {
          return false;
        }
        event.preventDefault();
        const pos = view.posAtCoords({ x: event.clientX, y: event.clientY });
        if (pos !== null && goToDefinitionAt(view, pos, config)) {
          view.focus();
        }
        return true;
      },
    }),
  ];
}

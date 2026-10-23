import {
  EditorSelection,
  type Extension,
  StateEffect,
  StateField,
} from '@codemirror/state';
import {
  closeHoverTooltips,
  type Command,
  type EditorView,
  keymap,
  ViewPlugin,
} from '@codemirror/view';
import type { CypherConfig } from './langCypher';

const isMac =
  typeof navigator !== 'undefined' && /Mac/.test(navigator.platform);

const setHoverSuppressed = StateEffect.define<boolean>();

// Like VS Code, the hover stays hidden after a jump until the mouse actually
// moves, so the caret moving away from under it isn't missed. CodeMirror's
// own hover would reopen on any mousemove, including same-position ones
export const hoverSuppressed = StateField.define<boolean>({
  create: () => false,
  update(suppressed, tr) {
    for (const effect of tr.effects) {
      if (effect.is(setHoverSuppressed)) {
        suppressed = effect.value;
      }
    }
    return suppressed;
  },
});

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
    effects: [closeHoverTooltips, setHoverSuppressed.of(true)],
  });
  return true;
}

export const goToDefinitionCommand =
  (config: CypherConfig): Command =>
  (view) =>
    goToDefinitionAt(view, view.state.selection.main.head, config);

const goToDefinitionPlugin = (config: CypherConfig) =>
  ViewPlugin.fromClass(
    class {
      lastMouse: { x: number; y: number } | undefined;
    },
    {
      eventHandlers: {
        mousemove(event, view) {
          const { clientX: x, clientY: y } = event;
          if (this.lastMouse?.x === x && this.lastMouse?.y === y) {
            return;
          }
          this.lastMouse = { x, y };
          if (view.state.field(hoverSuppressed)) {
            view.dispatch({ effects: setHoverSuppressed.of(false) });
          }
        },
        mousedown(event, view) {
          const modKey = isMac ? event.metaKey : event.ctrlKey;
          if (event.button !== 0 || !modKey || event.altKey || event.shiftKey) {
            return false;
          }
          // Mod-click only ever means go to definition, so it is swallowed even
          // when there is nothing to jump to
          event.preventDefault();
          const pos = view.posAtCoords({ x: event.clientX, y: event.clientY });
          if (pos !== null && goToDefinitionAt(view, pos, config)) {
            view.focus();
          }
          return true;
        },
      },
    },
  );

export function cypherGoToDefinition(config: CypherConfig): Extension {
  return [
    hoverSuppressed,
    keymap.of([
      { key: 'F12', run: goToDefinitionCommand(config), preventDefault: true },
    ]),
    goToDefinitionPlugin(config),
  ];
}

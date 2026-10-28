import { EditorSelection, type Extension } from '@codemirror/state';
import {
  closeHoverTooltips,
  type Command,
  Decoration,
  EditorView,
  keymap,
  ViewPlugin,
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

/** Returns the range covering the variable reference at offset pos if one exists otherwise undefined
 *
 * Ex. MATCH (n) RETURN n
 *
 * with pos=17 or pos=18 -> { from:17, to:18 }
 */
function symbolWithDefinitionRange(
  view: EditorView,
  pos: number,
  config: CypherConfig,
): { from: number; to: number } | undefined {
  const definition = config.languageService.goToDefinition(
    view.state.doc.toString(),
    pos,
  );
  if (definition) {
    const symbol = config.languageService
      .getSymbolsInfo()
      .symbolTables.flatMap((table) =>
        table.map((symbol) =>
          symbol.definitionPosition === definition.startOffset
            ? symbol
            : undefined,
        ),
      )
      .find((x) => x !== undefined);
    const symbolStart = symbol.references.find(
      (ref) => ref <= pos && ref + symbol.variable.length >= pos,
    );
    return {
      from: symbolStart,
      to: symbolStart + symbol.variable.length,
    };
  }
  return undefined;
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
    clickableSymbolPlugin.of(config),
  ];
}

const clickableSymbolPlugin = ViewPlugin.fromClass(
  class {
    decorations = Decoration.none;
    showClickCursor = false;
    coords: { x: number; y: number } = { x: 0, y: 0 };

    constructor(
      readonly view: EditorView,
      readonly cfg: CypherConfig,
    ) {}

    set(e: MouseEvent | KeyboardEvent) {
      const modKey = isMac ? e.metaKey : e.ctrlKey;
      if (e instanceof MouseEvent) {
        this.coords = { x: e.clientX, y: e.clientY };
      }
      const pos = this.view.posAtCoords({ x: this.coords.x, y: this.coords.y });
      const definition =
        pos != null && symbolWithDefinitionRange(this.view, pos, this.cfg);
      const showClickCursor = modKey && definition !== undefined;
      if (this.showClickCursor !== showClickCursor) {
        this.showClickCursor = showClickCursor;
        if (this.showClickCursor) {
          const decoration: Decoration = Decoration.mark({
            class: 'cm-clickableSymbol',
          });
          this.decorations = Decoration.set(
            decoration.range(definition.from, definition.to),
          );
          this.view.update([]);
        } else {
          this.decorations = Decoration.none;
          this.view.update([]);
        }
      }
    }
  },
  {
    eventObservers: {
      mousemove(e) {
        this.set(e);
      },
      keydown(e) {
        this.set(e);
      },
      keyup(e) {
        this.set(e);
      },
    },
    decorations: (plugin) => plugin.decorations,
  },
);

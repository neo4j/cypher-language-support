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
  if (!definition) {
    return undefined;
  }
  const symbols =
    config.languageService.getSymbolsInfo()?.symbolTables?.flat() ?? [];
  for (const symbol of symbols) {
    if (symbol.definitionPosition !== definition.startOffset) {
      continue;
    }
    const from = symbol.references.find(
      (ref) =>
        ref !== symbol.definitionPosition &&
        ref <= pos &&
        pos <= ref + symbol.variable.length,
    );
    if (from !== undefined) {
      return { from, to: from + symbol.variable.length };
    }
  }
  return undefined;
}

const goToDefinitionCommand =
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

const clickableSymbolMark = Decoration.mark({ class: 'cm-clickableSymbol' });

const clickableSymbolPlugin = ViewPlugin.fromClass(
  class {
    decorations = Decoration.none;
    range: { from: number; to: number } | undefined;
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
      const pos = modKey ? this.view.posAtCoords(this.coords) : null;
      const range =
        pos === null
          ? undefined
          : symbolWithDefinitionRange(this.view, pos, this.cfg);
      //Only need changes when hovering on the position of a new reference
      if (range?.from !== this.range?.from || range?.to !== this.range?.to) {
        this.range = range;
        this.decorations = range
          ? Decoration.set(clickableSymbolMark.range(range.from, range.to))
          : Decoration.none;
        this.view.update([]);
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

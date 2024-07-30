import { insertNewline } from '@codemirror/commands';
import {
  Annotation,
  Compartment,
  EditorState,
  Extension,
} from '@codemirror/state';
import {
  EditorView,
  KeyBinding,
  keymap,
  lineNumbers,
  placeholder,
  ViewUpdate,
} from '@codemirror/view';
import { type DbSchema } from '@neo4j-cypher/language-support';
import debounce from 'lodash.debounce';
import { Component, createRef } from 'react';
import {
  replaceHistory,
  replMode as historyNavigation,
} from './historyNavigation';
import { cypher, CypherConfig } from './lang-cypher/langCypher';
import { cleanupWorkers } from './lang-cypher/syntaxValidation';
import { basicNeo4jSetup } from './neo4jSetup';
import { getThemeExtension } from './themes';

type DomEventHandlers = Parameters<typeof EditorView.domEventHandlers>[0];
export interface CypherEditorProps {
  /**
   * The prompt to show on single line editors
   */
  prompt?: string;
  /**
   * Custom keybindings to add to the editor.
   * See https://codemirror.net/6/docs/ref/#keymap.of
   */
  extraKeybindings?: KeyBinding[];
  /**
   * Callback on query execution, triggered via ctrl/cmd + Enter.
   * If provided, will enable "repl-mode", which turns on navigating editor history
   *
   * @param cmd - the editor value when ctrl/cmd + enter was pressed
   * @returns void
   */
  onExecute?: (cmd: string) => void;
  /**
   * If true, pressing enter will add a new line to the editor and cmd/ctrl + enter will execute the query.
   * Otherwise pressing enter on a single line will execute the query.
   *
   * @default false
   */
  newLineOnEnter?: boolean;
  /**
   * The editor history navigable via up/down arrow keys. Order newest to oldest.
   * Add to this list with the `onExecute` callback for REPL style history.
   */
  history?: string[];
  /**
   * When set to `true` the editor will use the background color of the parent element.
   *
   * @default false
   */
  overrideThemeBackgroundColor?: boolean;
  /**
   * Whether the editor should take focus on mount.
   * Will move the cursor to the end of the query when provided with an initial value.
   *
   * @default false
   */
  autofocus?: boolean;
  /**
   * Where to place the cursor in the query. Cannot be enabled at the same time than autofocus
   */
  offset?: number;
  /**
   * Whether the editor should wrap lines.
   *
   * @default false
   */
  lineWrap?: boolean;
  /**
   * Whether the editor should perform syntax validation.
   *
   * @default true
   */
  lint?: boolean;
  /**
   * Whether the signature help tooltip should be shown below the text.
   * If false, it will be shown above.
   *
   * @default true
   */
  showSignatureTooltipBelow?: boolean;
  /**
   * Internal feature flags for the editor. Don't use in production
   *
   */
  featureFlags?: {
    consoleCommands?: boolean;
    signatureInfoOnAutoCompletions?: boolean;
  };
  /**
   * The schema to use for autocompletion and linting.
   *
   * @type {DbSchema}
   */
  schema?: DbSchema;
  /**
   * The current value of the editor.
   */
  value?: string;
  /**
   * Extra css classnames to add to the editor container.
   */
  className?: string;
  /**
   * Set the built in theme or provide a custom theme.
   *
   * `light` / `dark` / `Extension`
   *  @default light
   */
  theme?: 'light' | 'dark' | Extension;
  /**
   * Callback when the editor value changes.
   * @param {string} value - the current editor value
   * @param {ViewUpdate} viewUpdate - the view update from codemirror
   */
  onChange?(value: string, viewUpdate: ViewUpdate): void;

  /**
   * Map of event handlers to add to the editor.
   *
   * Note that the props are compared by reference, meaning object defined inline
   * will cause the editor to re-render (much like the style prop does in this example:
   * <div style={{}} />
   *
   * Memoize the object if you want/need to avoid this.
   *
   * @example
   * // listen to blur events
   * <CypherEditor domEventHandlers={{blur: () => console.log("blur event fired")}} />
   */
  domEventHandlers?: DomEventHandlers;
  /**
   * Placeholder text to display when the editor is empty.
   */
  placeholder?: string;
  /**
   * Whether the editor should show line numbers.
   *
   * @default true
   */
  lineNumbers?: boolean;
  /**
   * Whether the editor is read-only.
   *
   * @default false
   */
  readonly?: boolean;

  /**
   * String value to assign to the aria-label attribute of the editor
   */
  ariaLabel?: string;
}

const executeKeybinding = (
  onExecute?: (cmd: string) => void,
  newLineOnEnter?: boolean,
  flush?: () => void,
) => {
  const keybindings: Record<string, KeyBinding> = {
    'Shift-Enter': {
      key: 'Shift-Enter',
      run: insertNewline,
    },
    'Ctrl-Enter': {
      key: 'Ctrl-Enter',
      run: () => true,
    },
    Enter: {
      key: 'Enter',
      run: insertNewline,
    },
  };

  if (onExecute) {
    keybindings['Ctrl-Enter'] = {
      key: 'Ctrl-Enter',
      mac: 'Mod-Enter',
      preventDefault: true,
      run: (view: EditorView) => {
        const doc = view.state.doc.toString();
        if (doc.trim() !== '') {
          flush?.();
          onExecute(doc);
        }

        return true;
      },
    };

    if (!newLineOnEnter) {
      keybindings['Enter'] = {
        key: 'Enter',
        preventDefault: true,
        run: (view: EditorView) => {
          const doc = view.state.doc.toString();
          if (doc.includes('\n')) {
            // Returning false means the event will mark the event
            // as not handled and the default behavior will be executed
            return false;
          }

          if (doc.trim() !== '') {
            flush?.();
            onExecute(doc);
          }

          return true;
        },
      };
    }
  }

  return Object.values(keybindings);
};

const themeCompartment = new Compartment();
const keyBindingCompartment = new Compartment();
const lineNumbersCompartment = new Compartment();
const readOnlyCompartment = new Compartment();
const placeholderCompartment = new Compartment();
const domEventHandlerCompartment = new Compartment();

const formatLineNumber =
  (prompt?: string) => (a: number, state: EditorState) => {
    if (state.doc.lines === 1 && prompt !== undefined) {
      return prompt;
    }

    return a.toString();
  };

type CypherEditorState = { cypherSupportEnabled: boolean };

const ExternalEdit = Annotation.define<boolean>();

export class CypherEditor extends Component<
  CypherEditorProps,
  CypherEditorState
> {
  /**
   * The codemirror editor container.
   */
  editorContainer: React.RefObject<HTMLDivElement> = createRef();
  /**
   * The codemirror editor state.
   */
  editorState: React.MutableRefObject<EditorState> = createRef();
  /**
   * The codemirror editor view.
   */
  editorView: React.MutableRefObject<EditorView> = createRef();
  private schemaRef: React.MutableRefObject<CypherConfig> = createRef();

  private latestDispatchedValue: string | undefined;

  /**
   * Focus the editor
   */
  focus() {
    this.editorView.current?.focus();
  }

  /**
   * Move the cursor to the supplied position.
   * For example, to move the cursor to the end of the editor, use `value.length`
   */
  updateCursorPosition(position: number) {
    this.editorView.current?.dispatch({
      selection: { anchor: position, head: position },
    });
  }

  /**
   * Externally set the editor value and focus the editor.
   */
  setValueAndFocus(value = '') {
    const currentCmValue = this.editorView.current.state?.doc.toString() ?? '';
    this.editorView.current.dispatch({
      changes: {
        from: 0,
        to: currentCmValue.length,
        insert: value,
      },
      selection: { anchor: value.length, head: value.length },
    });
    this.editorView.current?.focus();
  }

  static defaultProps: CypherEditorProps = {
    lint: true,
    schema: {},
    overrideThemeBackgroundColor: false,
    lineWrap: false,
    showSignatureTooltipBelow: true,
    extraKeybindings: [],
    history: [],
    theme: 'light',
    lineNumbers: true,
    newLineOnEnter: false,
  };

  private debouncedOnChange = this.props.onChange
    ? debounce(
        ((value, viewUpdate) => {
          this.latestDispatchedValue = value;
          this.props.onChange(value, viewUpdate);
        }) satisfies CypherEditorProps['onChange'],
        200,
      )
    : undefined;

  componentDidMount(): void {
    const {
      theme,
      extraKeybindings,
      lineWrap,
      overrideThemeBackgroundColor,
      schema,
      lint,
      showSignatureTooltipBelow,
      featureFlags,
      onExecute,
      newLineOnEnter,
    } = this.props;

    this.schemaRef.current = {
      schema,
      lint,
      showSignatureTooltipBelow,
      featureFlags: {
        consoleCommands: true,
        ...featureFlags,
      },
      useLightVersion: false,
      setUseLightVersion: (newVal) => {
        if (this.schemaRef.current !== undefined) {
          this.schemaRef.current.useLightVersion = newVal;
        }
      },
    };

    const themeExtension = getThemeExtension(
      theme,
      overrideThemeBackgroundColor,
    );

    const changeListener = this.debouncedOnChange
      ? [
          EditorView.updateListener.of((upt: ViewUpdate) => {
            const wasUserEdit = !upt.transactions.some((tr) =>
              tr.annotation(ExternalEdit),
            );

            if (upt.docChanged && wasUserEdit) {
              const doc = upt.state.doc;
              const value = doc.toString();
              this.debouncedOnChange(value, upt);
            }
          }),
        ]
      : [];

    this.latestDispatchedValue = this.props.value;

    this.editorState.current = EditorState.create({
      extensions: [
        keyBindingCompartment.of(
          keymap.of([
            ...executeKeybinding(onExecute, newLineOnEnter, () =>
              this.debouncedOnChange?.flush(),
            ),
            ...extraKeybindings,
          ]),
        ),
        historyNavigation(this.props),
        basicNeo4jSetup(),
        themeCompartment.of(themeExtension),
        changeListener,
        cypher(this.schemaRef.current),
        lineWrap ? EditorView.lineWrapping : [],

        lineNumbersCompartment.of(
          this.props.lineNumbers
            ? lineNumbers({ formatNumber: formatLineNumber(this.props.prompt) })
            : [],
        ),
        readOnlyCompartment.of(EditorState.readOnly.of(this.props.readonly)),
        placeholderCompartment.of(
          this.props.placeholder ? placeholder(this.props.placeholder) : [],
        ),
        domEventHandlerCompartment.of(
          this.props.domEventHandlers
            ? EditorView.domEventHandlers(this.props.domEventHandlers)
            : [],
        ),
        this.props.ariaLabel
          ? EditorView.contentAttributes.of({
              'aria-label': this.props.ariaLabel,
            })
          : [],
      ],
      doc: this.props.value,
    });

    this.editorView.current = new EditorView({
      state: this.editorState.current,
      parent: this.editorContainer.current,
    });

    if (this.props.autofocus) {
      this.focus();
      if (this.props.value) {
        this.updateCursorPosition(this.props.value.length);
      }
    } else if (this.props.offset) {
      this.updateCursorPosition(this.props.offset);
    }
  }

  componentDidUpdate(prevProps: CypherEditorProps): void {
    if (!this.editorView.current) {
      return;
    }

    // Handle externally set value
    const currentCmValue = this.editorView.current.state?.doc.toString() ?? '';

    if (
      this.props.value !== undefined &&
      this.props.value !== this.latestDispatchedValue
    ) {
      this.debouncedOnChange?.cancel();
      this.editorView.current.dispatch({
        changes: {
          from: 0,
          to: currentCmValue.length,
          insert: this.props.value ?? '',
        },
        annotations: [ExternalEdit.of(true)],
      });
    }

    // Handle theme change
    const didChangeTheme =
      prevProps.theme !== this.props.theme ||
      prevProps.overrideThemeBackgroundColor !==
        this.props.overrideThemeBackgroundColor;

    if (didChangeTheme) {
      this.editorView.current.dispatch({
        effects: themeCompartment.reconfigure(
          getThemeExtension(
            this.props.theme,
            this.props.overrideThemeBackgroundColor,
          ),
        ),
      });
    }

    if (
      prevProps.lineNumbers !== this.props.lineNumbers ||
      prevProps.prompt !== this.props.prompt
    ) {
      this.editorView.current.dispatch({
        effects: lineNumbersCompartment.reconfigure(
          this.props.lineNumbers
            ? lineNumbers({ formatNumber: formatLineNumber(this.props.prompt) })
            : [],
        ),
      });
    }

    if (prevProps.readonly !== this.props.readonly) {
      this.editorView.current.dispatch({
        effects: readOnlyCompartment.reconfigure(
          EditorState.readOnly.of(this.props.readonly),
        ),
      });
    }

    if (prevProps.placeholder !== this.props.placeholder) {
      this.editorView.current.dispatch({
        effects: placeholderCompartment.reconfigure(
          this.props.placeholder ? placeholder(this.props.placeholder) : [],
        ),
      });
    }

    if (
      prevProps.extraKeybindings !== this.props.extraKeybindings ||
      prevProps.onExecute !== this.props.onExecute
    ) {
      this.editorView.current.dispatch({
        effects: keyBindingCompartment.reconfigure(
          keymap.of([
            ...executeKeybinding(
              this.props.onExecute,
              this.props.newLineOnEnter,
              () => this.debouncedOnChange?.flush(),
            ),
            ...this.props.extraKeybindings,
          ]),
        ),
      });
    }

    if (prevProps.domEventHandlers !== this.props.domEventHandlers) {
      this.editorView.current.dispatch({
        effects: domEventHandlerCompartment.reconfigure(
          this.props.domEventHandlers
            ? EditorView.domEventHandlers(this.props.domEventHandlers)
            : [],
        ),
      });
    }

    // This component rerenders on every keystroke and comparing the
    // full lists of editor strings on every render could be expensive.
    const didChangeHistoryEstimate =
      prevProps.history?.length !== this.props.history?.length ||
      prevProps.history?.[0] !== this.props.history?.[0];

    if (didChangeHistoryEstimate) {
      this.editorView.current.dispatch({
        effects: replaceHistory.of(this.props.history ?? []),
      });
    }

    /*
    The cypher configuration is a mutable object that is passed to the cypher language extension.
    Much like how the schema based completions work in the official sql language extension.
    https://github.com/codemirror/lang-sql/blob/4b7b2564dff7cdb1a15f8ccd08142f2cc8a0006f/src/sql.ts#L178C17-L178C18
    */
    this.schemaRef.current.schema = this.props.schema;
    this.schemaRef.current.lint = this.props.lint;
    this.schemaRef.current.featureFlags = this.props.featureFlags;
  }

  componentWillUnmount(): void {
    this.editorView.current?.destroy();
    cleanupWorkers();
  }

  render(): React.ReactNode {
    const { className, theme } = this.props;

    const themeClass =
      typeof theme === 'string' ? `cm-theme-${theme}` : 'cm-theme';

    return (
      <div
        ref={this.editorContainer}
        className={`${themeClass}${className ? ` ${className}` : ''}`}
      />
    );
  }
}
